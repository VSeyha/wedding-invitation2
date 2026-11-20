export interface WeddingProgramme {
  id: string
  title_km: string
  title_en: string
  description_km: string | null
  description_en: string | null
  event_time: string
  display_order: number
  created_at?: string
  updated_at?: string
}

export interface WeddingPhoto {
  id: string
  storage_path: string
  url?: string
  alt_text_km: string | null
  alt_text_en: string | null
  display_order: number
  created_at?: string
}
