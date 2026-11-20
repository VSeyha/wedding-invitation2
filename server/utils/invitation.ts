import { useServerSupabase } from './supabase'

/**
 * Validates an invitation token server-side.
 * Returns the full invitation row + guest name, or throws appropriate errors.
 */
export async function validateInvitationToken(token: string) {
  const supabase = useServerSupabase()
  if (!supabase) {
    throw createError({ statusCode: 503, statusMessage: 'Database not configured' })
  }

  const { data, error } = await supabase
    .from('invitations')
    .select(`
      id,
      token,
      status,
      opened_at,
      guest_id,
      guests!inner ( id, name, phone ),
      rsvps ( id, attendance_status, submitted_at )
    `)
    .eq('token', token)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Database error' })
  }

  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Invitation not found' })
  }

  if (data.status === 'revoked') {
    throw createError({ statusCode: 410, statusMessage: 'Invitation revoked' })
  }

  return data
}

/**
 * Marks an invitation as opened (first visit only).
 */
export async function markInvitationOpened(invitationId: string) {
  const supabase = useServerSupabase()
  if (!supabase) return

  await supabase
    .from('invitations')
    .update({ opened_at: new Date().toISOString() })
    .eq('id', invitationId)
    .is('opened_at', null) // Only set once
}
