export interface ThemeColors {
  primary: string
  secondary: string
  bg: string
  text: string
  heading: string
  border: string
  accent: string
  highlight: string
}

export type BackgroundType = 'none' | 'solid' | 'gradient' | 'image' | 'animated'

export interface BackgroundConfig {
  type: BackgroundType
  image_url?: string
  position?: string
  size?: string
  repeat?: string
  opacity?: number
  overlay_color?: string
  overlay_opacity?: number
  gradient_direction?: string
  gradient_from?: string
  gradient_to?: string
}

export type AnimationPreset =
  | 'lotus_petals'
  | 'particles'
  | 'floral'
  | 'ornaments'
  | 'lights'
  | 'hearts'
  | 'none'

export interface AnimationConfig {
  enabled: boolean
  preset: AnimationPreset
  speed: number
  particle_quantity: number
  object_size: number
  opacity: number
  direction: 'down' | 'up' | 'float'
  intensity: number
  desktop_quality: 'high' | 'medium' | 'low'
  mobile_quality: 'high' | 'medium' | 'low'
}

export type OpeningAnimationStyle =
  | 'golden_seal'
  | 'khmer_seal'
  | 'lotus'
  | 'floral'
  | 'fade'
  | 'none'

export interface OpeningAnimationConfig {
  style: OpeningAnimationStyle
  duration: number
  speed: number
  background_color?: string
  sound_enabled: boolean
}

export interface WeddingAppearance {
  id: string
  theme_name: string
  theme_config: ThemeColors
  background_config: BackgroundConfig
  animation_config: AnimationConfig
  opening_animation_config: OpeningAnimationConfig
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
  primary: '#641D2D', // Deep Burgundy
  secondary: '#C9A24A', // Antique Gold
  bg: '#F7F0E3', // Ivory
  text: '#3C2925', // Dark Brown
  heading: '#641D2D',
  border: '#C9A24A',
  accent: '#E5C77A', // Soft Gold
  highlight: '#E5C77A'
}

export const PRESET_THEMES: Record<string, { name: string; name_km: string; colors: ThemeColors }> = {
  'royal-burgundy': {
    name: 'Khmer Royal Burgundy & Gold',
    name_km: 'រាជានិយម ក្រហមស្វាយ និងទឹកមាស',
    colors: DEFAULT_THEME_COLORS
  },
  'royal-red': {
    name: 'Khmer Royal Red & Gold',
    name_km: 'រាជានិយម ក្រហម និងទឹកមាស',
    colors: {
      primary: '#851919',
      secondary: '#D4AF37',
      bg: '#FAF4EB',
      text: '#2F1E1E',
      heading: '#851919',
      border: '#D4AF37',
      accent: '#EAC864',
      highlight: '#F3DB94'
    }
  },
  'cream-gold': {
    name: 'Khmer Traditional Cream & Gold',
    name_km: 'ប្រពៃណី ក្រែម និងទឹកមាស',
    colors: {
      primary: '#4A3728',
      secondary: '#C5A059',
      bg: '#FFFDF9',
      text: '#3A2E26',
      heading: '#5C4433',
      border: '#C5A059',
      accent: '#DFC17B',
      highlight: '#DFC17B'
    }
  },
  'lotus-pink': {
    name: 'Khmer Lotus Pink & Gold',
    name_km: 'ផ្កាឈូក ផ្កាឈូក និងទឹកមាស',
    colors: {
      primary: '#7A2E3E',
      secondary: '#C9A24A',
      bg: '#FCF5F5',
      text: '#362227',
      heading: '#7A2E3E',
      border: '#E8A7B8',
      accent: '#F3CCD6',
      highlight: '#C9A24A'
    }
  },
  'emerald-gold': {
    name: 'Khmer Emerald & Gold',
    name_km: 'ត្បូងមរកត និងទឹកមាស',
    colors: {
      primary: '#183E31',
      secondary: '#D4AF37',
      bg: '#F4F7F4',
      text: '#1C2E25',
      heading: '#183E31',
      border: '#D4AF37',
      accent: '#83B29B',
      highlight: '#D4AF37'
    }
  },
  'royal-blue': {
    name: 'Khmer Royal Blue & Gold',
    name_km: 'រាជានិយម ខៀវ និងទឹកមាស',
    colors: {
      primary: '#1A2E4C',
      secondary: '#D4AF37',
      bg: '#F2F5F9',
      text: '#1A2332',
      heading: '#1A2E4C',
      border: '#D4AF37',
      accent: '#7FA1C7',
      highlight: '#D4AF37'
    }
  }
}
