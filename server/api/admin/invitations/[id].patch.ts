// PATCH /api/admin/invitations/[id] - Admin: revoke or regenerate invitation
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { uuidSchema } from '~~/server/utils/validation'
import { z } from 'zod'

const schema = z.object({
  action: z.enum(['revoke', 'regenerate', 'activate'])
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const id = getRouterParam(event, 'id') || ''
  const parsed = uuidSchema.safeParse(id)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid invitation ID' })

  const body = await readBody(event)
  const { action } = schema.parse(body)

  let updatePayload: any = {}

  if (action === 'revoke') {
    updatePayload = { status: 'revoked' }
  } else if (action === 'activate') {
    updatePayload = { status: 'active' }
  } else if (action === 'regenerate') {
    // Generate a new UUID token by inserting a new invitation for the same guest
    const { data: existing } = await supabase
      .from('invitations')
      .select('guest_id')
      .eq('id', id)
      .single()

    if (!existing) throw createError({ statusCode: 404, statusMessage: 'Invitation not found' })

    // Revoke old
    await supabase.from('invitations').update({ status: 'revoked' }).eq('id', id)

    // Create new
    const { data: newInv, error } = await supabase
      .from('invitations')
      .insert({ guest_id: existing.guest_id, status: 'active' })
      .select()
      .single()

    if (error) throw createError({ statusCode: 500, statusMessage: error.message })
    return { data: newInv }
  }

  const { data, error } = await supabase
    .from('invitations')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
