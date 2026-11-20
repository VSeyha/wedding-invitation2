// GET /api/admin/programmes - Admin: list all programmes
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!

  const { data, error } = await supabase
    .from('wedding_programmes')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
