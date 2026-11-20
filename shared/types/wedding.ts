export interface StoryMilestone {
  icon: string
  title_km: string
  subtitle_en: string
  description_km: string
  description_en: string
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
  created_at?: string
  updated_at?: string
}

export type WeddingSettingsUpdate = Partial<Omit<WeddingSettings, 'id' | 'created_at' | 'updated_at'>>
