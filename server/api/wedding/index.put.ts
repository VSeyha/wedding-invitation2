// PUT /api/wedding - Admin: update wedding settings
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { validateBody, weddingSettingsUpdateSchema } from '~~/server/utils/validation'
import { saveStoredGalleryConfig, getStoredGalleryConfig } from '~~/server/utils/galleryConfig'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = useServerSupabase()!
  const body = await readBody(event)
  const payload = validateBody(weddingSettingsUpdateSchema, body)

  let savedGalleryConfig = null
  if (payload.gallery_config) {
    savedGalleryConfig = saveStoredGalleryConfig(payload.gallery_config)
  }

  // Get current row (there should only be one)
  const { data: existing } = await supabase
    .from('wedding_settings')
    .select('id, gallery_config')
    .limit(1)
    .maybeSingle()

  let result
  let dbPayload: any = { ...payload }

  // Preserve fallback telegram messages inside gallery_config if gallery_config is updated separately
  if (dbPayload.gallery_config) {
    const existingGc = (existing?.gallery_config as any) || {}
    if (existingGc.telegram_message_km !== undefined && dbPayload.telegram_message_km === undefined) {
      dbPayload.gallery_config.telegram_message_km = existingGc.telegram_message_km
    }
    if (existingGc.telegram_message_en !== undefined && dbPayload.telegram_message_en === undefined) {
      dbPayload.gallery_config.telegram_message_en = existingGc.telegram_message_en
    }
  }

  if (existing) {
    let updateRes = await supabase
      .from('wedding_settings')
      .update(dbPayload)
      .eq('id', existing.id)
      .select()
      .single()

    // If telegram_message_km / telegram_message_en columns do not exist yet in DB, store inside gallery_config JSONB in Supabase
    if (updateRes.error && updateRes.error.message?.includes('telegram_message')) {
      const msgKm = dbPayload.telegram_message_km
      const msgEn = dbPayload.telegram_message_en
      delete dbPayload.telegram_message_km
      delete dbPayload.telegram_message_en
      dbPayload.gallery_config = {
        ...(dbPayload.gallery_config || (existing.gallery_config as any) || getStoredGalleryConfig()),
        ...(msgKm !== undefined ? { telegram_message_km: msgKm } : {}),
        ...(msgEn !== undefined ? { telegram_message_en: msgEn } : {})
      }
      updateRes = await supabase
        .from('wedding_settings')
        .update(dbPayload)
        .eq('id', existing.id)
        .select()
        .single()
    }

    // If gallery_config column does not exist yet in DB, retry without it
    if (updateRes.error && updateRes.error.message?.includes('gallery_config')) {
      delete dbPayload.gallery_config
      updateRes = await supabase
        .from('wedding_settings')
        .update(dbPayload)
        .eq('id', existing.id)
        .select()
        .single()
    }

    if (updateRes.error) throw createError({ statusCode: 500, statusMessage: updateRes.error.message })
    result = updateRes.data
  } else {
    let insertRes = await supabase
      .from('wedding_settings')
      .insert(dbPayload)
      .select()
      .single()

    if (insertRes.error && insertRes.error.message?.includes('telegram_message')) {
      const msgKm = dbPayload.telegram_message_km
      const msgEn = dbPayload.telegram_message_en
      delete dbPayload.telegram_message_km
      delete dbPayload.telegram_message_en
      dbPayload.gallery_config = {
        ...(dbPayload.gallery_config || getStoredGalleryConfig()),
        ...(msgKm !== undefined ? { telegram_message_km: msgKm } : {}),
        ...(msgEn !== undefined ? { telegram_message_en: msgEn } : {})
      }
      insertRes = await supabase
        .from('wedding_settings')
        .insert(dbPayload)
        .select()
        .single()
    }

    if (insertRes.error && insertRes.error.message?.includes('gallery_config')) {
      delete dbPayload.gallery_config
      insertRes = await supabase
        .from('wedding_settings')
        .insert(dbPayload)
        .select()
        .single()
    }

    if (insertRes.error) throw createError({ statusCode: 500, statusMessage: insertRes.error.message })
    result = insertRes.data
  }

  const rawGalleryConfig = savedGalleryConfig || result?.gallery_config || getStoredGalleryConfig()
  const {
    telegram_message: _legacy,
    telegram_message_km: fallbackKm,
    telegram_message_en: fallbackEn,
    ...cleanGalleryConfig
  } = rawGalleryConfig as any

  return {
    data: {
      ...result,
      gallery_config: cleanGalleryConfig,
      telegram_message_km: result?.telegram_message_km ?? fallbackKm ?? payload.telegram_message_km ?? '',
      telegram_message_en: result?.telegram_message_en ?? fallbackEn ?? payload.telegram_message_en ?? ''
    }
  }
})
