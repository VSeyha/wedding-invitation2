// GET /api/wedding - Public: returns current wedding settings
import { useServerSupabase } from '~~/server/utils/supabase'
import { getStoredGalleryConfig } from '~~/server/utils/galleryConfig'

export default defineEventHandler(async (event) => {
  setHeader(event, 'Cache-Control', 'public, max-age=0, s-maxage=5, stale-while-revalidate=10, must-revalidate')
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

  const rawGalleryConfig = data?.gallery_config || getStoredGalleryConfig()
  const {
    telegram_message: legacyFallbackMsg,
    telegram_message_km: fallbackKm,
    telegram_message_en: fallbackEn,
    ...cleanGalleryConfig
  } = rawGalleryConfig as any

  return {
    data: {
      ...data,
      gallery_config: cleanGalleryConfig,
      telegram_message_km: data?.telegram_message_km || fallbackKm || legacyFallbackMsg || '',
      telegram_message_en: data?.telegram_message_en || fallbackEn || ''
    }
  }
})
