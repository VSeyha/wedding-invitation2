// GET /api/admin/stats - Admin: dashboard statistics
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const [guests, invitations, rsvps] = await Promise.all([
    supabase.from('guests').select('id', { count: 'exact', head: true }),
    supabase.from('invitations').select('id, opened_at, status', { count: 'exact' }),
    supabase.from('rsvps').select('attendance_status')
  ])

  const totalGuests = guests.count ?? 0
  const allInvitations = invitations.data ?? []
  const allRsvps = rsvps.data ?? []

  const opened = allInvitations.filter(i => i.opened_at !== null).length
  const attending = allRsvps.filter(r => r.attendance_status === 'attending').length
  const notAttending = allRsvps.filter(r => r.attendance_status === 'not_attending').length
  const pending = totalGuests - attending - notAttending

  return {
    data: {
      total_guests: totalGuests,
      total_invitations: allInvitations.length,
      invitations_opened: opened,
      attending,
      not_attending: notAttending,
      pending: Math.max(0, pending)
    }
  }
})
