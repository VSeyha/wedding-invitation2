// GET /api/gallery - Public: list photos
import { useServerSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600')
  const supabase = useServerSupabase()
  if (!supabase) return { data: [] }

  const { data, error } = await supabase
    .from('wedding_photos')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  const photosWithUrl = (data || []).map((photo: any) => {
    let url = photo.photo_url || ''
    // If url is missing or is a relative storage path (e.g. "photos/xxx.webp"), generate the full Supabase public URL
    if (!url || !url.startsWith('http')) {
      const storageKey = photo.storage_path || url
      if (storageKey) {
        const { data: urlData } = supabase.storage
          .from('wedding-photos')
          .getPublicUrl(storageKey)
        url = urlData.publicUrl
      }
    }

    return {
      ...photo,
      url,
      photo_url: url,
      storage_path: photo.storage_path || photo.photo_url || '',
      alt_text_km: photo.alt_text_km || photo.caption_km || '',
      alt_text_en: photo.alt_text_en || photo.caption_en || ''
    }
  })

  return { data: photosWithUrl }
})
