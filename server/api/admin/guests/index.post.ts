// POST /api/admin/guests - Admin: create a guest + auto-generate invitation
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { validateBody, guestCreateSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!
  const body = await readBody(event)
  const payload = validateBody(guestCreateSchema, body)

  // Create guest
  const { data: guest, error: guestError } = await supabase
    .from('guests')
    .insert({ name: payload.name, phone: payload.phone ?? null })
    .select()
    .single()

  if (guestError) throw createError({ statusCode: 500, statusMessage: guestError.message })

  // Auto-generate invitation for guest
  const { data: invitation, error: inviteError } = await supabase
    .from('invitations')
    .insert({ guest_id: guest.id, status: 'active' })
    .select()
    .single()

  if (inviteError) throw createError({ statusCode: 500, statusMessage: inviteError.message })

  return { data: { ...guest, invitations: [invitation] } }
})
