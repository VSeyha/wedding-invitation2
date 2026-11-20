<template>
  <div>
    <!-- Top Action Bar -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.appearance') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Customize Khmer themes, colors, background, and animations.</p>
      </div>
      <div class="flex flex-wrap items-center gap-2 self-start">
        <button @click="resetToDefault" class="btn-secondary text-xs">
          🔄 Restore Default
        </button>
        <button @click="save(false)" :disabled="saving" class="btn-secondary text-xs">
          {{ saving ? 'Saving...' : '💾 Save Draft' }}
        </button>
        <button @click="save(true)" :disabled="saving" class="btn-primary text-xs">
          {{ saving ? 'Publishing...' : '🚀 ' + t('admin.publish') }}
        </button>
      </div>
    </div>

    <!-- Layout: Settings Panels on Left, Live Preview on Right -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Settings Column (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- 1. Preset Themes -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-3 flex items-center gap-2">
            <span>🎨</span> Preset Khmer Themes
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="(preset, key) in PRESET_THEMES"
              :key="key"
              @click="applyPreset(key, preset)"
              class="p-3 rounded-xl border text-left transition-all relative overflow-hidden"
              :class="config.theme_name === preset.name ? 'border-[#641D2D] ring-2 ring-[#641D2D]/30 shadow-md' : 'border-gray-200 hover:border-[#C9A24A]/50'"
            >
              <div class="flex items-center gap-1.5 mb-2">
                <span class="w-4 h-4 rounded-full border border-black/10" :style="{ backgroundColor: preset.colors.primary }"></span>
                <span class="w-4 h-4 rounded-full border border-black/10" :style="{ backgroundColor: preset.colors.secondary }"></span>
                <span class="w-4 h-4 rounded-full border border-black/10" :style="{ backgroundColor: preset.colors.bg }"></span>
              </div>
              <div class="text-xs font-bold text-[#3C2925] truncate">{{ preset.name }}</div>
              <div class="text-[10px] text-[#3C2925]/60 font-khmer-body truncate">{{ preset.name_km }}</div>
            </button>
          </div>
        </div>

        <!-- 2. Color Customizer -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-3 flex items-center gap-2">
            <span>🖌️</span> Palette Colors
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div v-for="(val, colKey) in config.theme_config" :key="colKey" class="flex flex-col gap-1">
              <label class="text-[11px] font-medium text-[#3C2925]/70 capitalize">{{ colKey }}</label>
              <div class="flex items-center gap-2 border border-gray-200 rounded-lg p-1.5 bg-gray-50/50">
                <input
                  type="color"
                  v-model="config.theme_config[colKey]"
                  class="w-7 h-7 rounded border-0 cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  v-model="config.theme_config[colKey]"
                  class="w-16 text-xs font-mono uppercase bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Background Settings -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-3 flex items-center gap-2">
            <span>🖼️</span> Background Type & Styling
          </h2>
          <div class="space-y-4">
            <div>
              <label class="form-label">Type</label>
              <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <button
                  v-for="bType in ['none', 'solid', 'gradient', 'image', 'animated']"
                  :key="bType"
                  type="button"
                  @click="config.background_config.type = bType as any"
                  class="px-3 py-1.5 rounded-lg border text-xs capitalize transition-all"
                  :class="config.background_config.type === bType ? 'bg-[#641D2D] text-white border-[#641D2D]' : 'bg-gray-50 border-gray-200 text-[#3C2925] hover:border-[#C9A24A]'"
                >
                  {{ bType }}
                </button>
              </div>
            </div>

            <!-- Gradient settings -->
            <div v-if="config.background_config.type === 'gradient'" class="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label class="form-label">Gradient Direction</label>
                <select v-model="config.background_config.gradient_direction" class="input-field">
                  <option value="to bottom">To Bottom</option>
                  <option value="to bottom right">To Bottom Right</option>
                  <option value="to right">To Right</option>
                </select>
              </div>
              <div>
                <label class="form-label">Overlay Opacity ({{ Math.round((config.background_config.overlay_opacity || 0.05) * 100) }}%)</label>
                <input type="range" min="0" max="1" step="0.05" v-model.number="config.background_config.overlay_opacity" class="w-full accent-[#641D2D]" />
              </div>
            </div>

            <!-- Image settings -->
            <div v-if="config.background_config.type === 'image'" class="space-y-3 pt-2">
              <div>
                <label class="form-label">Background Image URL</label>
                <input v-model="config.background_config.image_url" placeholder="https://..." class="input-field" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="form-label">Image Opacity ({{ Math.round((config.background_config.opacity || 0.15) * 100) }}%)</label>
                  <input type="range" min="0.05" max="1" step="0.05" v-model.number="config.background_config.opacity" class="w-full accent-[#641D2D]" />
                </div>
                <div>
                  <label class="form-label">Overlay Color</label>
                  <input type="color" v-model="config.background_config.overlay_color" class="w-full h-8 rounded border p-0 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Animation Settings -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
              <span>✨</span> Background Animation
            </h2>
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="config.animation_config.enabled" class="sr-only peer" />
              <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#641D2D]"></div>
              <span class="ml-2 text-xs font-medium text-[#3C2925]">{{ config.animation_config.enabled ? 'Enabled' : 'Disabled' }}</span>
            </label>
          </div>

          <div v-if="config.animation_config.enabled" class="space-y-4 pt-2">
            <div>
              <label class="form-label">Animation Preset</label>
              <select v-model="config.animation_config.preset" class="input-field">
                <option value="lotus_petals">Golden Lotus Petals (Falling petals)</option>
                <option value="particles">Golden Particles (Floating dust)</option>
                <option value="floral">Khmer Floral (Soft blossoms)</option>
                <option value="ornaments">Khmer Ornaments (Traditional motif)</option>
                <option value="lights">Floating Lights (Bokor lights)</option>
                <option value="hearts">Romantic Hearts</option>
                <option value="none">None (Static)</option>
              </select>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label class="form-label">Speed ({{ config.animation_config.speed }}x)</label>
                <input type="range" min="0.2" max="3" step="0.1" v-model.number="config.animation_config.speed" class="w-full accent-[#641D2D]" />
              </div>
              <div>
                <label class="form-label">Quantity ({{ config.animation_config.particle_quantity }})</label>
                <input type="range" min="5" max="80" step="5" v-model.number="config.animation_config.particle_quantity" class="w-full accent-[#641D2D]" />
              </div>
              <div>
                <label class="form-label">Opacity ({{ Math.round(config.animation_config.opacity * 100) }}%)</label>
                <input type="range" min="0.1" max="1" step="0.05" v-model.number="config.animation_config.opacity" class="w-full accent-[#641D2D]" />
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Opening Animation -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
          <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-3 flex items-center gap-2">
            <span>💌</span> Opening Animation
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">Opening Style</label>
              <select v-model="config.opening_animation_config.style" class="input-field">
                <option value="golden_seal">Golden Royal Seal</option>
                <option value="khmer_seal">Khmer Traditional Seal</option>
                <option value="lotus">Golden Lotus Flower</option>
                <option value="floral">Floral Opening</option>
                <option value="fade">Simple Fade</option>
                <option value="none">No Animation</option>
              </select>
            </div>
            <div>
              <label class="form-label">Duration ({{ config.opening_animation_config.duration }}s)</label>
              <input type="range" min="0.5" max="4" step="0.2" v-model.number="config.opening_animation_config.duration" class="w-full accent-[#641D2D] mt-2" />
            </div>
          </div>
        </div>
      </div>

      <!-- Live Preview Column (5 cols) -->
      <div class="lg:col-span-5">
        <div class="sticky top-6 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#3C2925]/70">Live Preview</h3>
            <div class="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-xs">
              <button
                @click="previewDevice = 'mobile'"
                class="px-2.5 py-1 rounded-md transition-all"
                :class="previewDevice === 'mobile' ? 'bg-white shadow-sm font-bold text-[#641D2D]' : 'text-gray-500'"
              >
                📱 Mobile
              </button>
              <button
                @click="previewDevice = 'desktop'"
                class="px-2.5 py-1 rounded-md transition-all"
                :class="previewDevice === 'desktop' ? 'bg-white shadow-sm font-bold text-[#641D2D]' : 'text-gray-500'"
              >
                💻 Desktop
              </button>
            </div>
          </div>

          <!-- Preview Frame -->
          <div
            class="mx-auto rounded-3xl border-4 border-[#3C2925] shadow-2xl overflow-hidden transition-all duration-300 relative"
            :style="{
              width: previewDevice === 'mobile' ? '320px' : '100%',
              height: '560px',
              backgroundColor: config.theme_config.bg,
              color: config.theme_config.text
            }"
          >
            <!-- Simulated Invitation Card -->
            <div class="h-full overflow-y-auto p-4 flex flex-col items-center justify-between text-center relative z-10">
              <!-- Top Ornamental Header -->
              <div class="pt-4">
                <div class="text-3xl mb-1" :style="{ color: config.theme_config.secondary }">⚜️</div>
                <div
                  class="text-[10px] uppercase tracking-widest font-bold"
                  :style="{ color: config.theme_config.secondary }"
                >
                  Save The Date
                </div>
              </div>

              <!-- Center Bride & Groom -->
              <div
                class="p-4 rounded-2xl border w-full backdrop-blur-sm"
                :style="{
                  backgroundColor: 'rgba(255, 255, 255, 0.75)',
                  borderColor: config.theme_config.border
                }"
              >
                <div class="font-khmer-heading text-sm mb-1 leading-relaxed" :style="{ color: config.theme_config.heading }">
                  សិរីមង្គលអាពាហ៍ពិពាហ៍
                </div>
                <div class="font-en-heading text-lg font-bold" :style="{ color: config.theme_config.primary }">
                  Sokha & Bopha
                </div>
                <div class="text-[11px] mt-2 text-[#3C2925]/80 font-khmer-body">
                  សូមគោរពអញ្ជើញ ឯកឧត្តម លោកជំទាវ លោក លោកស្រី
                </div>
                <div class="mt-3">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-[10px] font-bold"
                    :style="{
                      backgroundColor: config.theme_config.primary,
                      color: config.theme_config.bg
                    }"
                  >
                    💌 Open Invitation
                  </span>
                </div>
              </div>

              <!-- Bottom Venue & Date Info -->
              <div class="pb-4 text-[10px] space-y-1 text-[#3C2925]/70">
                <div class="font-bold" :style="{ color: config.theme_config.heading }">
                  Phnom Penh, Cambodia
                </div>
                <div>December 25, 2026</div>
              </div>
            </div>
          </div>

          <div class="text-center text-xs text-[#3C2925]/50">
            Preview reflects the active draft colors and fonts.
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import {
  PRESET_THEMES,
  DEFAULT_THEME_COLORS,
  type WeddingAppearance,
  type ThemeColors
} from '~~/shared/types/appearance'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()

const saving = ref(false)
const toast = ref('')
const previewDevice = ref<'mobile' | 'desktop'>('mobile')

const config = ref<WeddingAppearance>({
  id: '',
  theme_name: 'Khmer Royal Burgundy & Gold',
  theme_config: { ...DEFAULT_THEME_COLORS },
  background_config: {
    type: 'none',
    opacity: 0.15,
    overlay_color: '#641D2D',
    overlay_opacity: 0.05
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
})

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3500)
}

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const applyPreset = (key: string, preset: { name: string; colors: ThemeColors }) => {
  config.value.theme_name = preset.name
  config.value.theme_config = { ...preset.colors }
  showToast(`Applied preset: ${preset.name}`)
}

const resetToDefault = () => {
  config.value.theme_name = 'Khmer Royal Burgundy & Gold'
  config.value.theme_config = { ...DEFAULT_THEME_COLORS }
  config.value.background_config = { type: 'none', opacity: 0.15, overlay_color: '#641D2D', overlay_opacity: 0.05 }
  config.value.animation_config.preset = 'lotus_petals'
  config.value.animation_config.enabled = true
  config.value.opening_animation_config.style = 'golden_seal'
  showToast('Restored default Khmer Royal Burgundy & Gold.')
}

const loadAppearance = async () => {
  try {
    const res = await $fetch<any>('/api/appearance')
    if (res?.data) {
      if (res.data.theme_name) config.value.theme_name = res.data.theme_name
      if (res.data.theme_config) config.value.theme_config = res.data.theme_config
      if (res.data.background_config) config.value.background_config = res.data.background_config
      if (res.data.animation_config) config.value.animation_config = res.data.animation_config
      if (res.data.opening_animation_config) config.value.opening_animation_config = res.data.opening_animation_config
    }
  } catch (err) {
    console.error('Error loading appearance:', err)
  }
}

const save = async (publish: boolean) => {
  saving.value = true
  const token = await getToken()
  config.value.is_published = publish

  try {
    await $fetch('/api/admin/appearance', {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      body: config.value
    })
    showToast(publish ? '🚀 Theme published to live website!' : '💾 Draft appearance saved.')
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'Failed to save appearance.')
  } finally {
    saving.value = false
  }
}

onMounted(loadAppearance)
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm disabled:opacity-50; }
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.form-label { @apply block text-xs font-semibold uppercase tracking-wider text-[#3C2925]/70 mb-1; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50 animate-bounce; }
</style>
