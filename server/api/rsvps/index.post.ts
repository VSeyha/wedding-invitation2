// POST /api/rsvps - Public: submit or update RSVP using invitation token
import { useServerSupabase } from '~~/server/utils/supabase'
import { validateInvitationToken } from '~~/server/utils/invitation'
import { validateBody, rsvpSubmitSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, attendance_status } = validateBody(rsvpSubmitSchema, body)

  const supabase = useServerSupabase()!

  // Validate invitation (throws 404/410 if invalid/revoked)
  const invitation = await validateInvitationToken(token)

  // Upsert RSVP
  const { data, error } = await supabase
    .from('rsvps')
    .upsert(
      {
        invitation_id: invitation.id,
        attendance_status,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      { onConflict: 'invitation_id' }
    )
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
