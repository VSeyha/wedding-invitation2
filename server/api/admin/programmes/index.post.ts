// POST /api/admin/programmes - Admin: create programme item
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { validateBody, programmeCreateSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!
  const body = await readBody(event)
  const payload = validateBody(programmeCreateSchema, body)

  const { data, error } = await supabase
    .from('wedding_programmes')
    .insert(payload)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
