import { z } from 'zod'

// UUID validation helper
export const uuidSchema = z.string().uuid({ message: 'Invalid UUID format' })

export const storyMilestoneSchema = z.object({
  icon: z.string().default('✨'),
  title_km: z.string().default(''),
  subtitle_en: z.string().default(''),
  description_km: z.string().default(''),
  description_en: z.string().default('')
})

export const weddingGiftInfoSchema = z.object({
  enabled: z.boolean().default(true),
  qr_code_url: z.string().optional().default(''),
  account_name_en: z.string().optional().default(''),
  bank_name: z.string().optional().default(''),
  account_name_km: z.string().optional().default(''),
  account_number: z.string().optional().default(''),
  message_km: z.string().optional().default(''),
  message_en: z.string().optional().default('')
})

// ============================================================
// Wedding Settings
// ============================================================
export const galleryConfigSchema = z.object({
  layout: z.enum(['grid', 'masonry', 'carousel', 'featured']).optional(),
  columns_mobile: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  columns_desktop: z.union([z.literal(2), z.literal(3), z.literal(4)]).optional(),
  aspect_ratio: z.enum(['square', 'portrait', 'landscape', 'natural']).optional(),
  card_style: z.enum(['gold-frame', 'rounded', 'glass', 'minimal']).optional(),
  gap: z.enum(['compact', 'normal', 'relaxed']).optional(),
  max_display: z.union([z.number(), z.literal('all')]).optional()
})

export const weddingSettingsUpdateSchema = z.object({
  bride_name_km: z.string().max(200).optional(),
  bride_name_en: z.string().max(200).optional(),
  groom_name_km: z.string().max(200).optional(),
  groom_name_en: z.string().max(200).optional(),
  wedding_date: z.string().datetime({ offset: true }).optional().nullable(),
  venue_name_km: z.string().max(300).optional(),
  venue_name_en: z.string().max(300).optional(),
  venue_address_km: z.string().max(500).optional(),
  venue_address_en: z.string().max(500).optional(),
  google_maps_url: z.string().url().optional().or(z.literal('')),
  invitation_message_km: z.string().max(2000).optional(),
  invitation_message_en: z.string().max(2000).optional(),
  groom_photo_url: z.string().url().optional().nullable().or(z.literal('')),
  bride_photo_url: z.string().url().optional().nullable().or(z.literal('')),
  our_story: z.array(storyMilestoneSchema).optional().nullable(),
  gift_info: weddingGiftInfoSchema.optional().nullable(),
  gallery_config: galleryConfigSchema.optional().nullable()
})

// ============================================================
// Guest
// ============================================================
export const guestCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  phone: z.string().max(30).optional().nullable()
})

export const guestUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  phone: z.string().max(30).optional().nullable()
})

// ============================================================
// RSVP
// ============================================================
export const rsvpSubmitSchema = z.object({
  token: uuidSchema,
  attendance_status: z.enum(['attending', 'not_attending'])
})

// ============================================================
// Programme
// ============================================================
export const programmeCreateSchema = z.object({
  title_km: z.string().max(300).optional().default(''),
  title_en: z.string().max(300).optional().default(''),
  description_km: z.string().max(1000).optional().nullable(),
  description_en: z.string().max(1000).optional().nullable(),
  event_time: z.string().datetime({ offset: true }),
  display_order: z.number().int().min(0).optional().default(0)
})

export const programmeUpdateSchema = programmeCreateSchema.partial()

// ============================================================
// Appearance
// ============================================================
const themeColorsSchema = z.object({
  primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondary: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  text: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  heading: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  border: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  highlight: z.string().regex(/^#[0-9A-Fa-f]{6}$/)
})

const mobileBorderSchema = z.object({
  enabled: z.boolean().default(false),
  preset: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  opacity: z.number().min(0.05).max(1).optional().default(1),
  style: z.enum(['frame-overlay', 'card-border']).optional().default('frame-overlay')
})

const backgroundConfigSchema = z.object({
  type: z.enum(['none', 'solid', 'gradient', 'image', 'animated', 'preset']),
  preset_name: z.string().optional().nullable(),
  scroll_zoom: z.boolean().optional().default(true),
  zoom_effect: z.enum(['zoom-in', 'zoom-out', 'breathe']).optional().default('zoom-in'),
  image_url: z.string().optional().nullable(),
  position: z.string().optional(),
  size: z.string().optional(),
  repeat: z.string().optional(),
  opacity: z.number().min(0).max(1).optional(),
  overlay_color: z.string().optional(),
  overlay_opacity: z.number().min(0).max(1).optional(),
  gradient_direction: z.string().optional(),
  gradient_from: z.string().optional(),
  gradient_to: z.string().optional(),
  mobile_border: mobileBorderSchema.optional()
})

const animationConfigSchema = z.object({
  enabled: z.boolean(),
  preset: z.enum(['lotus_petals', 'particles', 'floral', 'ornaments', 'lights', 'hearts', 'none']),
  speed: z.number().min(0.1).max(5),
  particle_quantity: z.number().int().min(0).max(200),
  object_size: z.number().min(4).max(200),
  opacity: z.number().min(0).max(1),
  direction: z.enum(['down', 'up', 'float']),
  intensity: z.number().min(0).max(5),
  desktop_quality: z.enum(['high', 'medium', 'low']),
  mobile_quality: z.enum(['high', 'medium', 'low'])
})

const openingAnimationConfigSchema = z.object({
  style: z.enum([
    'click_seal',
    'golden_seal',
    'romdoul_seal',
    'curtain',
    'scratch',
    'slide_unlock',
    'envelope_flap',
    'direct',
    'none',
    'khmer_seal',
    'lotus',
    'floral',
    'fade'
  ]),
  duration: z.number().min(0.1).max(10),
  speed: z.number().min(0.1).max(5),
  background_color: z.string().optional(),
  sound_enabled: z.boolean().optional().default(false)
})

export const appearanceSaveSchema = z.object({
  theme_name: z.string().min(1).max(100),
  theme_config: themeColorsSchema,
  background_config: backgroundConfigSchema,
  animation_config: animationConfigSchema,
  opening_animation_config: openingAnimationConfigSchema,
  is_published: z.boolean().optional().default(false)
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
