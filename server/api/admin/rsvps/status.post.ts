// POST /api/admin/rsvps/status - Admin: update RSVP status (including resetting back to pending)
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { z } from 'zod'

const updateRsvpSchema = z.object({
  guest_id: z.string().uuid().optional(),
  invitation_id: z.string().uuid().optional(),
  status: z.enum(['pending', 'attending', 'not_attending'])
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!
  const body = await readBody(event)

  const parsed = updateRsvpSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid RSVP update data',
      data: parsed.error.format()
    })
  }

  const { guest_id, invitation_id, status } = parsed.data

  if (!guest_id && !invitation_id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Either guest_id or invitation_id is required'
    })
  }

  let targetInvitationId = invitation_id

  // Find invitation by guest_id if invitation_id not provided
  if (!targetInvitationId && guest_id) {
    const { data: inv, error: invError } = await supabase
      .from('invitations')
      .select('id')
      .eq('guest_id', guest_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (invError) throw createError({ statusCode: 500, statusMessage: invError.message })

    if (inv) {
      targetInvitationId = inv.id
    } else {
      // If guest has no invitation yet and status is attending/not_attending, create one
      if (status !== 'pending') {
        const { data: newInv, error: newInvErr } = await supabase
          .from('invitations')
          .insert({ guest_id, status: 'active' })
          .select('id')
          .single()
        if (newInvErr) throw createError({ statusCode: 500, statusMessage: newInvErr.message })
        targetInvitationId = newInv.id
      } else {
        // Already no invitation / no RSVP, so it is already pending
        return { success: true, status: 'pending' }
      }
    }
  }

  // If resetting to 'pending', delete the RSVP record
  if (status === 'pending') {
    if (targetInvitationId) {
      const { error: delError } = await supabase
        .from('rsvps')
        .delete()
        .eq('invitation_id', targetInvitationId)

      if (delError) {
        throw createError({ statusCode: 500, statusMessage: delError.message })
      }
    }
    return { success: true, status: 'pending' }
  }

  // Otherwise, upsert RSVP record with attending or not_attending
  const { data, error } = await supabase
    .from('rsvps')
    .upsert(
      {
        invitation_id: targetInvitationId,
        attendance_status: status,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { onConflict: 'invitation_id' }
    )
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true, data, status }
})
