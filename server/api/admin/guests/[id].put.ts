// PUT /api/admin/guests/[id] - Admin: update guest
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { validateBody, guestUpdateSchema, uuidSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const id = getRouterParam(event, 'id') || ''
  const parsed = uuidSchema.safeParse(id)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid guest ID' })

  const body = await readBody(event)
  const payload = validateBody(guestUpdateSchema, body)

  const { data, error } = await supabase
    .from('guests')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
