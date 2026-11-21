export interface StoryMilestone {
  icon: string
  title_km: string
  subtitle_en: string
  description_km: string
  description_en: string
}

export interface WeddingGiftInfo {
  enabled: boolean
  qr_code_url: string
  account_name_en: string
  bank_name: string
  account_name_km: string
  account_number: string
  message_km?: string
  message_en?: string
}

export interface GalleryConfig {
  layout?: 'grid' | 'masonry' | 'carousel' | 'featured'
  columns_mobile?: 1 | 2
  columns_desktop?: 2 | 3 | 4
  aspect_ratio?: 'square' | 'portrait' | 'landscape' | 'natural'
  card_style?: 'gold-frame' | 'rounded' | 'glass' | 'minimal'
  gap?: 'compact' | 'normal' | 'relaxed'
  max_display?: number | 'all'
}

export const DEFAULT_GALLERY_CONFIG: GalleryConfig = {
  layout: 'grid',
  columns_mobile: 2,
  columns_desktop: 3,
  aspect_ratio: 'square',
  card_style: 'gold-frame',
  gap: 'normal',
  max_display: 'all'
}

export interface WeddingSettings {
  id: string
  bride_name_km: string
  bride_name_en: string
  groom_name_km: string
  groom_name_en: string
  wedding_date: string
  venue_name_km: string
  venue_name_en: string
  venue_address_km: string
  venue_address_en: string
  google_maps_url: string
  invitation_message_km: string
  invitation_message_en: string
  groom_photo_url?: string | null
  bride_photo_url?: string | null
  our_story?: StoryMilestone[] | null
  gift_info?: WeddingGiftInfo | null
  gallery_config?: GalleryConfig | null
  created_at?: string
  updated_at?: string
}

export type WeddingSettingsUpdate = Partial<Omit<WeddingSettings, 'id' | 'created_at' | 'updated_at'>>
