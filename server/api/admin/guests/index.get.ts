// GET /api/admin/guests - Admin: list all guests with invitation status
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const { data, error } = await supabase
    .from('guests')
    .select(`
      id, name, phone, note, created_at, updated_at,
      invitations ( id, token, status, opened_at, created_at,
        rsvps ( id, attendance_status, submitted_at )
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
