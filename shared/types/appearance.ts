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

export type BackgroundType = 'none' | 'solid' | 'gradient' | 'image' | 'animated' | 'preset'

export interface MobileBorderConfig {
  enabled: boolean
  preset?: string
  image_url?: string
  opacity?: number
  style?: 'frame-overlay' | 'card-border'
}

export interface MobileBorderPresetOption {
  id: string
  name: string
  name_km: string
  image_url: string
  style: 'frame-overlay' | 'card-border'
}

export const PRESET_MOBILE_BORDERS: Record<string, MobileBorderPresetOption> = {
  'top-bottom': {
    id: 'top-bottom',
    name: 'Top & Bottom Border',
    name_km: 'ស៊ុមក្បាល និងបាតទំព័រ',
    image_url: '/images/mobile_screen_border_background/top_botton_border.png',
    style: 'card-border'
  }
}

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
  mobile_border?: MobileBorderConfig
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
  'kbaj-khmer': {
    id: 'kbaj-khmer',
    name: 'Royal Khmer Golden Kbach',
    name_km: 'ក្បាច់មាសរាជវាំងខ្មែរ',
    image_url: '/images/backgrounds/kbaj-khmer.jpg',
    type: 'image',
    overlay_color: '#FDF8EE',
    overlay_opacity: 0,
    opacity: 1,
    scroll_zoom: true,
    zoom_effect: 'zoom-in'
  },
  'angkor-wat': {
    id: 'angkor-wat',
    name: 'Angkor Wat Sunrise',
    name_km: 'ប្រាសាទអង្គរវត្ត ពេលព្រឹកព្រហាម',
    image_url: '/images/backgrounds/angkor-wat.png',
    type: 'image',
    overlay_color: '#FDF8EE',
    overlay_opacity: 0,
    opacity: 1,
    scroll_zoom: true,
    zoom_effect: 'zoom-in'
  },
  'angkor-wat2': {
    id: 'angkor-wat2',
    name: 'Angkor Wat Grand',
    name_km: 'ប្រាសាទអង្គរវត្ត មហាអស្ចារ្យ',
    image_url: '/images/backgrounds/angkor-wat2.png',
    type: 'image',
    overlay_color: '#FDF8EE',
    overlay_opacity: 0,
    opacity: 1,
    scroll_zoom: true,
    zoom_effect: 'zoom-in'
  },
  'angkor-wat3': {
    id: 'angkor-wat3',
    name: 'Angkor Wat Sunset',
    name_km: 'ប្រាសាទអង្គរវត្ត ពេលអស្តង្គត',
    image_url: '/images/backgrounds/angkor-wat3.jpg',
    type: 'image',
    overlay_color: '#FDF8EE',
    overlay_opacity: 0,
    opacity: 1,
    scroll_zoom: true,
    zoom_effect: 'zoom-in'
  },
  'bg-1': {
    id: 'bg-1',
    name: 'Khmer Heritage Scenic (BG 1)',
    name_km: 'ទេសភាពបេតិកភណ្ឌខ្មែរ ១',
    image_url: '/images/backgrounds/bg-1.png',
    type: 'image',
    overlay_color: '#FDF8EE',
    overlay_opacity: 0,
    opacity: 1,
    scroll_zoom: true,
    zoom_effect: 'zoom-in'
  },
  'pattern': {
    id: 'pattern',
    name: 'Classic Khmer Motif',
    name_km: 'ក្បាច់លម្អ បុរាណ',
    image_url: '/images/backgrounds/pattern.jpeg',
    type: 'image',
    overlay_color: '#FDF8EE',
    overlay_opacity: 0.05,
    opacity: 0.92,
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
  | 'click_seal'
  | 'golden_seal'
  | 'romdoul_seal'
  | 'curtain'
  | 'scratch'
  | 'slide_unlock'
  | 'envelope_flap'
  | 'direct'
  | 'none'
  | 'khmer_seal'
  | 'lotus'
  | 'floral'
  | 'fade'

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
