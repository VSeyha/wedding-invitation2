import { z } from 'zod'

// UUID validation helper
export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' })

// ============================================================
// Wedding Settings
// ============================================================
export const weddingSettingsUpdateSchema = z.object({
  bride_name_km:         z.string().max(200).optional(),
  bride_name_en:         z.string().max(200).optional(),
  groom_name_km:         z.string().max(200).optional(),
  groom_name_en:         z.string().max(200).optional(),
  wedding_date:          z.string().datetime({ offset: true }).optional().nullable(),
  venue_name_km:         z.string().max(300).optional(),
  venue_name_en:         z.string().max(300).optional(),
  venue_address_km:      z.string().max(500).optional(),
  venue_address_en:      z.string().max(500).optional(),
  google_maps_url:       z.string().url().optional().or(z.literal('')),
  invitation_message_km: z.string().max(2000).optional(),
  invitation_message_en: z.string().max(2000).optional(),
  groom_photo_url:       z.string().url().optional().nullable().or(z.literal('')),
  bride_photo_url:       z.string().url().optional().nullable().or(z.literal(''))
})

// ============================================================
// Guest
// ============================================================
export const guestCreateSchema = z.object({
  name:  z.string().min(1, 'Name is required').max(200),
  phone: z.string().max(30).optional().nullable()
})

export const guestUpdateSchema = z.object({
  name:  z.string().min(1).max(200).optional(),
  phone: z.string().max(30).optional().nullable()
})

// ============================================================
// RSVP
// ============================================================
export const rsvpSubmitSchema = z.object({
  token:             uuidSchema,
  attendance_status: z.enum(['attending', 'not_attending'])
})

// ============================================================
// Programme
// ============================================================
export const programmeCreateSchema = z.object({
  title_km:        z.string().max(300).optional().default(''),
  title_en:        z.string().max(300).optional().default(''),
  description_km:  z.string().max(1000).optional().nullable(),
  description_en:  z.string().max(1000).optional().nullable(),
  event_time:      z.string().datetime({ offset: true }),
  display_order:   z.number().int().min(0).optional().default(0)
})

export const programmeUpdateSchema = programmeCreateSchema.partial()

// ============================================================
// Appearance
// ============================================================
const themeColorsSchema = z.object({
  primary:   z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  bg:        z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  text:      z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  heading:   z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  border:    z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent:    z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  highlight: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
})

const backgroundConfigSchema = z.object({
  type:            z.enum(['none', 'solid', 'gradient', 'image', 'animated']),
  image_url:       z.string().optional().nullable(),
  position:        z.string().optional(),
  size:            z.string().optional(),
  repeat:          z.string().optional(),
  opacity:         z.number().min(0).max(1).optional(),
  overlay_color:   z.string().optional(),
  overlay_opacity: z.number().min(0).max(1).optional(),
  gradient_direction: z.string().optional(),
  gradient_from:   z.string().optional(),
  gradient_to:     z.string().optional()
})

const animationConfigSchema = z.object({
  enabled:          z.boolean(),
  preset:           z.enum(['lotus_petals', 'particles', 'floral', 'ornaments', 'lights', 'hearts', 'none']),
  speed:            z.number().min(0.1).max(5),
  particle_quantity: z.number().int().min(0).max(200),
  object_size:      z.number().min(4).max(200),
  opacity:          z.number().min(0).max(1),
  direction:        z.enum(['down', 'up', 'float']),
  intensity:        z.number().min(0).max(5),
  desktop_quality:  z.enum(['high', 'medium', 'low']),
  mobile_quality:   z.enum(['high', 'medium', 'low'])
})

const openingAnimationConfigSchema = z.object({
  style:            z.enum(['golden_seal', 'khmer_seal', 'lotus', 'floral', 'fade', 'none']),
  duration:         z.number().min(0.1).max(10),
  speed:            z.number().min(0.1).max(5),
  background_color: z.string().optional(),
  sound_enabled:    z.boolean()
})

export const appearanceSaveSchema = z.object({
  theme_name:               z.string().min(1).max(100),
  theme_config:             themeColorsSchema,
  background_config:        backgroundConfigSchema,
  animation_config:         animationConfigSchema,
  opening_animation_config: openingAnimationConfigSchema,
  is_published:             z.boolean().optional().default(false)
})

// ============================================================
// Helper: parse & throw H3 error on failure
// ============================================================
export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Validation Error',
      data: result.error.flatten()
    })
  }
  return result.data
}
