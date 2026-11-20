import {
  DEFAULT_THEME_COLORS,
  type ThemeColors,
  type BackgroundConfig,
  type AnimationConfig,
  type OpeningAnimationConfig,
  type WeddingAppearance
} from '~~/shared/types/appearance'

export function useWeddingAppearance() {
  const currentAppearance = useState<WeddingAppearance>('wedding-appearance', () => ({
    id: 'default',
    theme_name: 'Khmer Royal Burgundy & Gold',
    theme_config: { ...DEFAULT_THEME_COLORS },
    background_config: {
      type: 'preset',
      preset_name: 'angkor-wat',
      image_url: '/images/backgrounds/angkor-wat.svg',
      opacity: 0.85,
      overlay_color: '#2A1017',
      overlay_opacity: 0.15,
      scroll_zoom: true,
      zoom_effect: 'zoom-in'
    },
    animation_config: {
      enabled: true,
      preset: 'lotus_petals',
      speed: 1,
      particle_quantity: 25,
      object_size: 24,
      opacity: 0.7,
      direction: 'down',
      intensity: 1,
      desktop_quality: 'high',
      mobile_quality: 'medium'
    },
    opening_animation_config: {
      style: 'golden_seal',
      duration: 1.6,
      speed: 1,
      sound_enabled: false
    },
    is_published: true
  }))

  const applyThemeColors = (colors: ThemeColors) => {
    if (!import.meta.client) return
    const root = document.documentElement
    root.style.setProperty('--wedding-primary', colors.primary)
    root.style.setProperty('--wedding-secondary', colors.secondary)
    root.style.setProperty('--wedding-bg', colors.bg)
    root.style.setProperty('--wedding-text', colors.text)
    root.style.setProperty('--wedding-heading', colors.heading)
    root.style.setProperty('--wedding-border', colors.border)
    root.style.setProperty('--wedding-accent', colors.accent)
    root.style.setProperty('--wedding-highlight', colors.highlight)
  }

  // Watch for theme_config changes and apply CSS variables automatically
  if (import.meta.client) {
    watch(
      () => currentAppearance.value.theme_config,
      (newColors) => {
        if (newColors) applyThemeColors(newColors)
      },
      { immediate: true, deep: true }
    )
  }

  return {
    appearance: currentAppearance,
    applyThemeColors,
    colors: computed(() => currentAppearance.value.theme_config),
    background: computed(() => currentAppearance.value.background_config),
    animation: computed(() => currentAppearance.value.animation_config),
    openingAnimation: computed(() => currentAppearance.value.opening_animation_config)
  }
}
