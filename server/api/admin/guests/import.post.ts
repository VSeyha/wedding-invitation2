// POST /api/admin/guests/import - Admin: bulk import guests from Excel/CSV and auto-create invitations
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { z } from 'zod'

const importGuestItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  phone: z.string().nullable().optional(),
  note: z.string().nullable().optional()
})

const importBatchSchema = z.object({
  guests: z.array(importGuestItemSchema).min(1, 'At least one guest is required')
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!
  const body = await readBody(event)

  const parsed = importBatchSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid guest import data',
      data: parsed.error.format()
    })
  }

  const { guests: items } = parsed.data

  // Clean and prepare rows
  const cleanRows = items
    .map(g => ({
      name: g.name.trim(),
      phone: g.phone && String(g.phone).trim() ? String(g.phone).trim() : null,
      note: g.note && String(g.note).trim() ? String(g.note).trim() : ''
    }))
    .filter(g => g.name.length > 0)

  if (!cleanRows.length) {
    throw createError({ statusCode: 400, statusMessage: 'No valid guest names found in import' })
  }

  // 1. Batch insert into `guests` table
  const { data: insertedGuests, error: guestError } = await supabase
    .from('guests')
    .insert(cleanRows)
    .select('id, name, phone, note, created_at')

  if (guestError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to insert guests: ${guestError.message}`
    })
  }

  if (!insertedGuests || !insertedGuests.length) {
    throw createError({ statusCode: 500, statusMessage: 'No guests were created' })
  }

  // 2. Batch generate invitations for each inserted guest
  const inviteRows = insertedGuests.map(g => ({
    guest_id: g.id,
    status: 'active'
  }))

  const { data: insertedInvites, error: inviteError } = await supabase
    .from('invitations')
    .insert(inviteRows)
    .select('id, token, status, guest_id, created_at')

  if (inviteError) {
    console.error('Warning: Error creating invitations for imported guests:', inviteError)
  }

  // Combine inserted results for client response
  const guestsWithInvites = insertedGuests.map(g => ({
    ...g,
    invitations: (insertedInvites || []).filter(i => i.guest_id === g.id)
  }))

  return {
    success: true,
    count: insertedGuests.length,
    data: guestsWithInvites
  }
})
