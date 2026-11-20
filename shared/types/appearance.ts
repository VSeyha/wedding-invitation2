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
  preset_name?: string
  scroll_zoom?: boolean
  zoom_effect?: 'zoom-in' | 'zoom-out' | 'breathe'
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

export interface BackgroundPresetOption {
  id: string
  name: string
  name_km: string
  image_url: string
  type: BackgroundType
  overlay_color: string
  overlay_opacity: number
  opacity: number
  scroll_zoom: boolean
  zoom_effect: 'zoom-in' | 'zoom-out' | 'breathe'
}

export const PRESET_BACKGROUNDS: Record<string, BackgroundPresetOption> = {
  'angkor-wat': {
    id: 'angkor-wat',
    name: 'Angkor Wat Sunrise',
    name_km: 'ប្រាសាទអង្គរវត្ត ពេលព្រឹកព្រហាម',
    image_url: '/images/backgrounds/angkor-wat.svg',
    type: 'image',
    overlay_color: '#2A1017',
    overlay_opacity: 0.15,
    opacity: 0.85,
    scroll_zoom: true,
    zoom_effect: 'zoom-in'
  },
  'royal-kbach': {
    id: 'royal-kbach',
    name: 'Royal Golden Kbach',
    name_km: 'ក្បាច់ផ្កាចន្ទន៍ រាជានិយម',
    image_url: '/images/backgrounds/royal-kbach.svg',
    type: 'image',
    overlay_color: '#3D121B',
    overlay_opacity: 0.1,
    opacity: 0.8,
    scroll_zoom: true,
    zoom_effect: 'zoom-in'
  },
  'golden-lotus': {
    id: 'golden-lotus',
    name: 'Sacred Lotus Waters',
    name_km: 'សួនផ្កាឈូកមាស',
    image_url: '/images/backgrounds/golden-lotus.svg',
    type: 'image',
    overlay_color: '#1E0A12',
    overlay_opacity: 0.12,
    opacity: 0.85,
    scroll_zoom: true,
    zoom_effect: 'breathe'
  },
  'classic-ivory': {
    id: 'classic-ivory',
    name: 'Classic Royal Ivory',
    name_km: 'រាជានិយម ភ្លុកដំរីបុរាណ',
    image_url: '',
    type: 'none',
    overlay_color: '#F7F0E3',
    overlay_opacity: 0,
    opacity: 1,
    scroll_zoom: false,
    zoom_effect: 'zoom-in'
  }
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
