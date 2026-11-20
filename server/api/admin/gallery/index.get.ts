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

  const photosWithUrl = (data || []).map((photo) => {
    const { data: urlData } = supabase.storage
      .from('wedding-photos')
      .getPublicUrl(photo.storage_path)

    return {
      ...photo,
      url: urlData.publicUrl
    }
  })

  return { data: photosWithUrl }
})
