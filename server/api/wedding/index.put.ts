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
    .select('id')
    .limit(1)
    .maybeSingle()

  let result
  let dbPayload: any = { ...payload }

  if (existing) {
    let updateRes = await supabase
      .from('wedding_settings')
      .update(dbPayload)
      .eq('id', existing.id)
      .select()
      .single()

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

  return {
    data: {
      ...result,
      gallery_config: savedGalleryConfig || result?.gallery_config || getStoredGalleryConfig()
    }
  }
})
