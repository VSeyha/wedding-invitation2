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
  guests: z.array(importGuestItemSchema).min(1, 'At least one guest is required'),
  update_existing: z.boolean().optional().default(true)
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

  const { guests: items, update_existing: updateExisting } = parsed.data

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

  // Fetch existing guests to detect duplicates and update if requested
  const { data: existingGuests } = await supabase
    .from('guests')
    .select('id, name')

  const existingMap = new Map<string, string>()
  existingGuests?.forEach(g => {
    existingMap.set(g.name.toLowerCase().trim(), g.id)
  })

  const rowsToInsert: typeof cleanRows = []
  const rowsToUpdate: { id: string; name: string; phone: string | null; note: string }[] = []

  for (const row of cleanRows) {
    const existingId = existingMap.get(row.name.toLowerCase().trim())
    if (existingId) {
      if (updateExisting) {
        rowsToUpdate.push({ id: existingId, ...row })
      }
    } else {
      rowsToInsert.push(row)
    }
  }

  // 1. Update existing guests (sync note & phone)
  let updatedCount = 0
  if (rowsToUpdate.length > 0) {
    await Promise.all(
      rowsToUpdate.map(async u => {
        const updateData: Record<string, any> = { note: u.note }
        if (u.phone) updateData.phone = u.phone
        await supabase.from('guests').update(updateData).eq('id', u.id)
      })
    )
    updatedCount = rowsToUpdate.length
  }

  // 2. Batch insert brand new guests
  let insertedGuests: any[] = []
  if (rowsToInsert.length > 0) {
    const { data, error: guestError } = await supabase
      .from('guests')
      .insert(rowsToInsert)
      .select('id, name, phone, note, created_at')

    if (guestError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to insert guests: ${guestError.message}`
      })
    }
    insertedGuests = data || []

    // Batch generate invitations for each inserted guest
    if (insertedGuests.length > 0) {
      const inviteRows = insertedGuests.map(g => ({
        guest_id: g.id,
        status: 'active'
      }))
      await supabase.from('invitations').insert(inviteRows)
    }
  }

  return {
    success: true,
    count: updatedCount + insertedGuests.length,
    updated: updatedCount,
    inserted: insertedGuests.length
  }
})
