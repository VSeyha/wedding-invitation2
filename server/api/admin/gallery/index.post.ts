// POST /api/admin/gallery - Admin: save photo record
import { useServerSupabase } from '~~/server/utils/supabase'
import { requireAdmin } from '~~/server/utils/auth'
import { z } from 'zod'
import { validateBody } from '~~/server/utils/validation'

const photoCreateSchema = z.object({
  storage_path: z.string().min(1),
  alt_text_km: z.string().optional().nullable(),
  alt_text_en: z.string().optional().nullable(),
  display_order: z.number().int().optional().default(0)
})

export default defineEventHandler(async (event) => {
  await requireAdmin(event)
  const supabase = useServerSupabase()!
  const body = await readBody(event)
  const payload = validateBody(photoCreateSchema, body)

  const { data, error } = await supabase
    .from('wedding_photos')
    .insert(payload)
    .select()
    .single()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
