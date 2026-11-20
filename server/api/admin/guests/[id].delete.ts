// DELETE /api/admin/guests/[id] - Admin: delete guest (cascades invitation + rsvp)
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { uuidSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const id = getRouterParam(event, 'id') || ''
  const parsed = uuidSchema.safeParse(id)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid guest ID' })

  const { error } = await supabase.from('guests').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { success: true }
})
