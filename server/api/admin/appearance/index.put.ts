// PUT /api/admin/appearance - Admin: save (draft or publish) appearance
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { validateBody, appearanceSaveSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!
  const body = await readBody(event)
  const payload = validateBody(appearanceSaveSchema, body)

  // If publishing, first un-publish all existing
  if (payload.is_published) {
    await supabase
      .from('wedding_appearance')
      .update({ is_published: false })
      .eq('is_published', true)
  }

  // Check if a draft exists
  const { data: existing } = await supabase
    .from('wedding_appearance')
    .select('id')
    .limit(1)
    .maybeSingle()

  let result
  if (existing) {
    const { data, error } = await supabase
      .from('wedding_appearance')
      .update(payload)
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    result = data
  } else {
    const { data, error } = await supabase
      .from('wedding_appearance')
      .insert(payload)
      .select()
      .single()
    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    result = data
  }

  return { data: result }
})
