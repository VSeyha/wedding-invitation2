// GET /api/admin/gallery - Admin: list all photos
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

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
      storage_path: photo.storage_path || photo.photo_url || ''
    }
  })

  return { data: photosWithUrl }
})
