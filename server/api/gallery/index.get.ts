// GET /api/gallery - Public: list photos
import { useServerSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useServerSupabase()
  if (!supabase) return { data: [] }

  const { data, error } = await supabase
    .from('wedding_photos')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  const photosWithUrl = (data || []).map((photo: any) => {
    let url = photo.photo_url || ''
    if (!url && photo.storage_path) {
      const { data: urlData } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(photo.storage_path)
      url = urlData.publicUrl
    }

    return {
      ...photo,
      url,
      storage_path: photo.storage_path || photo.photo_url || '',
      alt_text_km: photo.alt_text_km || photo.caption_km || '',
      alt_text_en: photo.alt_text_en || photo.caption_en || ''
    }
  })

  return { data: photosWithUrl }
})
