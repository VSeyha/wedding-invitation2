// GET /api/appearance - Public: get published appearance config
import { useServerSupabase } from '~~/server/utils/supabase'

export default defineEventHandler(async () => {
  const supabase = useServerSupabase()
  if (!supabase) {
    // Return default appearance when DB not configured
    return {
      data: {
        theme_name: 'Khmer Royal Burgundy & Gold',
        theme_config: {
          primary: '#641D2D', secondary: '#C9A24A', bg: '#F7F0E3',
          text: '#3C2925', heading: '#641D2D', border: '#C9A24A',
          accent: '#E5C77A', highlight: '#E5C77A'
        },
        background_config: {
          type: 'preset',
          preset_name: 'angkor-wat',
          image_url: '/images/backgrounds/angkor-wat.png',
          opacity: 1,
          overlay_color: '#FDF8EE',
          overlay_opacity: 0,
          scroll_zoom: true,
          zoom_effect: 'zoom-in'
        },
        animation_config: { enabled: true, preset: 'lotus_petals', speed: 1, particle_quantity: 25, object_size: 24, opacity: 0.7, direction: 'down', intensity: 1, desktop_quality: 'high', mobile_quality: 'medium' },
        opening_animation_config: { style: 'golden_seal', duration: 1.6, speed: 1, sound_enabled: false }
      }
    }
  }

  const { data, error } = await supabase
    .from('wedding_appearance')
    .select('theme_name, theme_config, background_config, animation_config, opening_animation_config')
    .eq('is_published', true)
    .limit(1)
    .maybeSingle()

  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { data }
})
