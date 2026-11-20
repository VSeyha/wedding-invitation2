// GET /api/admin/invitations - Admin: list all invitations
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const { data, error } = await supabase
    .from('invitations')
    .select(`
      id, token, status, opened_at, created_at,
      guests!inner ( id, name, phone ),
      rsvps ( attendance_status, submitted_at )
    `)
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
