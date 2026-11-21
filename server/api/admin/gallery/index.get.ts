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
    if (!url && photo.storage_path) {
      const { data: urlData } = supabase.storage
        .from('wedding-photos')
        .getPublicUrl(photo.storage_path)
      url = urlData.publicUrl
    }

    return {
      ...photo,
      url,
      storage_path: photo.storage_path || photo.photo_url || ''
    }
  })

  return { data: photosWithUrl }
})
