// PUT /api/wedding - Admin: update wedding settings
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { validateBody, weddingSettingsUpdateSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const supabase = useServerSupabase()!
  const body = await readBody(event)
  const payload = validateBody(weddingSettingsUpdateSchema, body)

  // Get current row (there should only be one)
  const { data: existing } = await supabase
    .from('wedding_settings')
    .select('id')
    .limit(1)
    .maybeSingle()

  let result
  if (existing) {
    const { data, error } = await supabase
      .from('wedding_settings')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    result = data
  } else {
    const { data, error } = await supabase
      .from('wedding_settings')
      .insert(payload)
      .select()
      .single()
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    result = data
  }

  return { data: result }
})
