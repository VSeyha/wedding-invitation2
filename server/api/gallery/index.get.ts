// GET /api/gallery - Public: list photos
import { useServerSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useServerSupabase()
  if (!supabase) return { data: [] }

  const { data, error } = await supabase
    .from('wedding_photos')
    .select('id, storage_path, alt_text_km, alt_text_en, display_order')
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
