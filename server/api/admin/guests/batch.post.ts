// POST /api/admin/guests/batch - Admin: batch update guests (e.g. assign side/note)
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { z } from 'zod'

const batchUpdateSchema = z.object({
  guest_ids: z.array(z.string().uuid()).min(1),
  note: z.string().max(200)
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!
  const body = await readBody(event)
  const parsed = batchUpdateSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid batch update payload' })
  }
  const { guest_ids, note } = parsed.data
  const { error } = await supabase
    .from('guests')
    .update({ note })
    .in('id', guest_ids)

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { success: true, count: guest_ids.length }
})
