// GET /api/programmes - Public: list wedding ceremony programme
import { useServerSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useServerSupabase()
  if (!supabase) return { data: [] }

  const { data, error } = await supabase
    .from('wedding_programmes')
    .select('id, title_km, title_en, description_km, description_en, event_time, display_order')
    .order('display_order', { ascending: true })

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
