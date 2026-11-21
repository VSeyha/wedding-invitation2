// GET /api/wedding - Public: returns current wedding settings
import { useServerSupabase } from '~~/server/utils/supabase'
import { getStoredGalleryConfig } from '~~/server/utils/galleryConfig'

export default defineEventHandler(async () => {
  const supabase = useServerSupabase()
  if (!supabase) {
    throw createError({ statusCode: 503, statusMessage: 'Database not configured' })
  }

  const { data, error } = await supabase
    .from('wedding_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  const galleryConfig = data?.gallery_config || getStoredGalleryConfig()

  return {
    data: {
      ...data,
      gallery_config: galleryConfig
    }
  }
})
