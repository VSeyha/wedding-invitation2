// GET /api/wedding - Public: returns current wedding settings
import { useServerSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useServerSupabase()
  if (!supabase) {
    throw createError({ statusCode: 503, statusMessage: 'Database not configured' })
  }

  const { data, error } = await supabase
    .from('wedding_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { data }
})
