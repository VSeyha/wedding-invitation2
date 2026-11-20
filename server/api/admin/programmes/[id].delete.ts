// DELETE /api/admin/programmes/[id] - Admin: delete programme item
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { uuidSchema } from '~~/server/utils/validation'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const id = getRouterParam(event, 'id') || ''
  const parsed = uuidSchema.safeParse(id)
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid ID' })

  const { error } = await supabase.from('wedding_programmes').delete().eq('id', id)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { success: true }
})
