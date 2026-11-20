// GET /api/admin/rsvps - Admin: list all RSVPs with guest info
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const { data, error } = await supabase
    .from('rsvps')
    .select(`
      id, attendance_status, submitted_at, updated_at,
      invitations!inner (
        id, token, status, opened_at,
        guests!inner ( id, name, phone )
      )
    `)
    .order('submitted_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
