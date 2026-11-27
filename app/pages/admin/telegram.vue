<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.telegram') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">
          Configure the default message template used when sharing guest invitations via Telegram.
        </p>
      </div>
      <NuxtLink
        to="/admin/invitations"
        class="btn-secondary text-xs inline-flex items-center gap-1.5 self-start"
      >
        <Mail class="w-3.5 h-3.5" />
        <span>Go to Invitations</span>
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left: Template Editor & Presets -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white rounded-xl border border-[#C9A24A]/25 p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
              <Send class="w-4 h-4 text-sky-600" />
              <span>Message Template</span>
            </h2>
            <button
              type="button"
              @click="resetTemplate"
              class="text-xs text-[#641D2D] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>

          <p class="text-xs text-[#3C2925]/70 leading-relaxed">
            Personalize your invitation message. Use
            <code class="px-1.5 py-0.5 rounded bg-[#F7F0E3] text-[#641D2D] font-mono">{guest}</code>
            to automatically insert the guest's name. Telegram automatically attaches the guest's unique invitation link below your message.
          </p>

          <textarea
            ref="templateTextareaRef"
            v-model="template"
            rows="5"
            class="input-field font-khmer-body leading-relaxed"
            placeholder="Enter your custom Telegram invitation message..."
          />

          <!-- Quick Placeholder & Action Row -->
          <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                @click="insertGuestPlaceholder"
                class="px-3 py-1.5 rounded-lg border border-[#C9A24A]/40 text-xs font-medium text-[#641D2D] hover:bg-[#F7F0E3] transition-colors cursor-pointer"
              >
                + Insert &#123;guest&#125;
              </button>
            </div>

            <button
              type="button"
              @click="saveTemplate"
              :disabled="saving || loading"
              class="px-5 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] text-xs font-semibold hover:bg-[#641D2D]/90 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save class="w-3.5 h-3.5" />
              <span>{{ saving ? 'Saving...' : 'Save Configuration' }}</span>
            </button>
          </div>
        </div>

        <!-- Quick Preset Templates -->
        <div class="bg-white rounded-xl border border-[#C9A24A]/25 p-5 shadow-sm">
          <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-3 flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-[#C9A24A]" />
            <span>Quick Presets</span>
          </h2>
          <div class="space-y-2.5">
            <button
              v-for="preset in presets"
              :key="preset.name"
              type="button"
              @click="applyPreset(preset.text)"
              class="w-full text-left p-3.5 rounded-xl border border-gray-200 hover:border-[#C9A24A] hover:bg-[#F7F0E3]/40 transition-all cursor-pointer"
            >
              <div class="text-xs font-bold text-[#641D2D] mb-1">{{ preset.name }}</div>
              <div class="text-xs text-[#3C2925]/75 font-khmer-body line-clamp-2">{{ preset.text }}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Live Telegram Preview -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-xl border border-[#C9A24A]/25 p-5 shadow-sm space-y-4 sticky top-6">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D]">
              Live Telegram Preview
            </h2>
            <span class="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              Real-time
            </span>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-[#3C2925]/70 mb-1">Sample Guest Name</label>
            <input v-model="sampleGuest" type="text" class="input-field text-xs" placeholder="លោក សុខា" />
          </div>

          <!-- Simulated Telegram Chat Bubble -->
          <div class="rounded-2xl bg-[#E6EBEE] p-4 border border-gray-200">
            <div class="ml-auto max-w-[92%] rounded-2xl rounded-br-sm bg-[#EFFDDE] px-3.5 py-2.5 shadow-sm border border-[#C8E6A0]/60 space-y-2">
              <div class="text-xs text-[#1F2937] font-khmer-body whitespace-pre-wrap leading-relaxed break-words">
                {{ renderedPreview }}
              </div>
              <div class="text-[11px] text-sky-700 underline break-all font-mono">
                {{ sampleLink }}
              </div>
              <div class="text-[10px] text-emerald-700/70 text-right">
                10:30 AM ✓✓
              </div>
            </div>
          </div>

          <button
            type="button"
            @click="testShareTelegram"
            class="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Send class="w-3.5 h-3.5" />
            <span>Test Share in Telegram</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { Send, Save, RotateCcw, Sparkles, Mail } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

const { t } = useLocale()
const supabase = useSupabase()
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string

const TELEGRAM_TEMPLATE_STORAGE_KEY = 'wedding_telegram_share_template'
const DEFAULT_TELEGRAM_TEMPLATE = 'សូមគោរពអញ្ជើញ {guest} ចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ 💐💍 សូមចុចលើតំណភ្ជាប់ខាងក្រោមដើម្បីបើកសំបុត្រអញ្ជើញ៖'

const presets = [
  {
    name: 'Khmer Royal Formal (ផ្លូវការ)',
    text: 'សូមគោរពអញ្ជើញ {guest} ចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ 💐💍 សូមចុចលើតំណភ្ជាប់ខាងក្រោមដើម្បីបើកសំបុត្រអញ្ជើញ៖'
  },
  {
    name: 'Bilingual Warm (ខ្មែរ & English)',
    text: 'សូមគោរពអញ្ជើញ {guest} 💌\nDear {guest}, you are warmly invited to celebrate our wedding day! Please tap the link below to view your invitation:'
  },
  {
    name: 'English Classic',
    text: 'Dear {guest}, we are delighted to invite you to our wedding celebration! 💍✨ Tap the link below to open your personal invitation:'
  }
]

const templateTextareaRef = ref<HTMLTextAreaElement | null>(null)
const template = ref(DEFAULT_TELEGRAM_TEMPLATE)
const sampleGuest = ref('លោក សុខា')
const sampleLink = `${siteUrl}/invite/sample-invitation`
const toast = ref('')
const loading = ref(true)
const saving = ref(false)

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3000)
}

const formatMessage = (guestName: string) => {
  const name = guestName?.trim() || 'ភ្ញៀវកិត្តិយស'
  return (template.value || DEFAULT_TELEGRAM_TEMPLATE).replaceAll('{guest}', name)
}

const renderedPreview = computed(() => formatMessage(sampleGuest.value))

const insertGuestPlaceholder = () => {
  const el = templateTextareaRef.value
  const token = '{guest}'
  if (!el) {
    template.value = template.value ? `${template.value} ${token}` : token
    return
  }
  const start = el.selectionStart ?? template.value.length
  const end = el.selectionEnd ?? template.value.length
  const before = template.value.slice(0, start)
  const after = template.value.slice(end)
  template.value = `${before}${token}${after}`
  nextTick(() => {
    el.focus()
    const cursor = start + token.length
    el.setSelectionRange(cursor, cursor)
  })
}

const applyPreset = (text: string) => {
  template.value = text
  saveTemplate()
}

const saveTemplate = async () => {
  saving.value = true
  try {
    const token = await getToken()
    await $fetch('/api/wedding', {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      body: { telegram_message: template.value }
    })
    if (import.meta.client) {
      localStorage.setItem(TELEGRAM_TEMPLATE_STORAGE_KEY, template.value)
    }
    showToast('✓ Telegram message saved to Supabase!')
  } catch (err: any) {
    console.error('Failed to save Telegram message:', err)
    showToast(err?.data?.statusMessage || 'Failed to save Telegram message.')
  } finally {
    saving.value = false
  }
}

const resetTemplate = async () => {
  template.value = DEFAULT_TELEGRAM_TEMPLATE
  await saveTemplate()
}

const testShareTelegram = () => {
  const url = encodeURIComponent(sampleLink)
  const text = encodeURIComponent(formatMessage(sampleGuest.value))
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>(`/api/wedding?t=${Date.now()}`).catch(() => null)
    if (res?.data?.telegram_message) {
      template.value = res.data.telegram_message
      if (import.meta.client) {
        localStorage.setItem(TELEGRAM_TEMPLATE_STORAGE_KEY, res.data.telegram_message)
      }
    } else if (import.meta.client) {
      const saved = localStorage.getItem(TELEGRAM_TEMPLATE_STORAGE_KEY)
      if (saved) template.value = saved
    }
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50; }
</style>
