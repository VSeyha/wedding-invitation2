<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.telegram') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">
          Configure Khmer & English message templates used when sharing guest invitations via Telegram.
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
      <!-- Left: Bilingual Template Editors & Presets -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white rounded-xl border border-[#C9A24A]/25 p-5 shadow-sm space-y-5">
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
              <Send class="w-4 h-4 text-sky-600" />
              <span>Message Templates (KM / EN)</span>
            </h2>
            <button
              type="button"
              @click="resetTemplates"
              class="text-xs text-[#641D2D] hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>

          <p class="text-xs text-[#3C2925]/70 leading-relaxed">
            Personalize your Khmer and English invitation messages. Use
            <code class="px-1.5 py-0.5 rounded bg-[#F7F0E3] text-[#641D2D] font-mono">{guest}</code>
            to automatically insert the guest's name. Telegram automatically attaches each guest's unique invitation link below your message.
          </p>

          <!-- Khmer Message Editor -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <label class="text-xs font-bold text-[#641D2D]">
                Khmer Message (ភាសាខ្មែរ)
              </label>
              <button
                type="button"
                @click="insertGuestPlaceholder('km')"
                class="px-2.5 py-1 rounded-lg border border-[#C9A24A]/40 text-[11px] font-medium text-[#641D2D] hover:bg-[#F7F0E3] transition-colors cursor-pointer"
              >
                + Insert &#123;guest&#125;
              </button>
            </div>
            <textarea
              ref="kmTextareaRef"
              v-model="templateKm"
              rows="4"
              class="input-field font-khmer-body leading-relaxed"
              placeholder="សូមគោរពអញ្ជើញ {guest}..."
            />
          </div>

          <!-- English Message Editor -->
          <div class="space-y-2 pt-2 border-t border-gray-100">
            <div class="flex items-center justify-between gap-2">
              <label class="text-xs font-bold text-[#641D2D]">
                English Message (English)
              </label>
              <button
                type="button"
                @click="insertGuestPlaceholder('en')"
                class="px-2.5 py-1 rounded-lg border border-[#C9A24A]/40 text-[11px] font-medium text-[#641D2D] hover:bg-[#F7F0E3] transition-colors cursor-pointer"
              >
                + Insert &#123;guest&#125;
              </button>
            </div>
            <textarea
              ref="enTextareaRef"
              v-model="templateEn"
              rows="4"
              class="input-field font-en-body leading-relaxed"
              placeholder="Dear {guest}, you are warmly invited..."
            />
          </div>

          <!-- Save Action Row -->
          <div class="flex justify-end pt-1">
            <button
              type="button"
              @click="saveTemplates"
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
              @click="applyPreset(preset)"
              class="w-full text-left p-3.5 rounded-xl border border-gray-200 hover:border-[#C9A24A] hover:bg-[#F7F0E3]/40 transition-all cursor-pointer space-y-1"
            >
              <div class="text-xs font-bold text-[#641D2D]">{{ preset.name }}</div>
              <div class="text-xs text-[#3C2925]/75 font-khmer-body line-clamp-1">KM: {{ preset.km }}</div>
              <div class="text-xs text-[#3C2925]/70 line-clamp-1">EN: {{ preset.en }}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Live Telegram Preview -->
      <div class="lg:col-span-5">
        <div class="bg-white rounded-xl border border-[#C9A24A]/25 p-5 shadow-sm space-y-4 sticky top-6">
          <div class="flex items-center justify-between gap-2">
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D]">
              Live Telegram Preview
            </h2>
            <!-- Preview Language Switcher -->
            <div class="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200 text-[11px]">
              <button
                type="button"
                @click="previewLang = 'km'"
                class="px-2.5 py-1 rounded-md transition-all cursor-pointer"
                :class="previewLang === 'km' ? 'bg-white text-[#641D2D] font-bold shadow-sm' : 'text-gray-500 hover:text-gray-800'"
              >
                ខ្មែរ (KM)
              </button>
              <button
                type="button"
                @click="previewLang = 'en'"
                class="px-2.5 py-1 rounded-md transition-all cursor-pointer"
                :class="previewLang === 'en' ? 'bg-white text-[#641D2D] font-bold shadow-sm' : 'text-gray-500 hover:text-gray-800'"
              >
                English (EN)
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-[#3C2925]/70 mb-1">Sample Guest Name</label>
            <input v-model="sampleGuest" type="text" class="input-field text-xs" placeholder="លោក សុខា / Mr. Sokha" />
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
            <span>Test Share ({{ previewLang.toUpperCase() }}) in Telegram</span>
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

const STORAGE_KEY_KM = 'wedding_telegram_share_template_km'
const STORAGE_KEY_EN = 'wedding_telegram_share_template_en'
const DEFAULT_KM = 'សូមគោរពអញ្ជើញ {guest} ចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ 💐💍 សូមចុចលើតំណភ្ជាប់ខាងក្រោមដើម្បីបើកសំបុត្រអញ្ជើញ៖'
const DEFAULT_EN = 'Dear {guest}, we are delighted to invite you to celebrate our wedding day! 💍✨ Please tap the link below to open your personal invitation:'

const presets = [
  {
    name: 'Khmer Royal Formal & Classic English',
    km: 'សូមគោរពអញ្ជើញ {guest} ចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ 💐💍 សូមចុចលើតំណភ្ជាប់ខាងក្រោមដើម្បីបើកសំបុត្រអញ្ជើញ៖',
    en: 'Dear {guest}, we are delighted to invite you to celebrate our wedding day! 💍✨ Please tap the link below to open your personal invitation:'
  },
  {
    name: 'Warm & Friendly (ស្និទ្ធស្នាល)',
    km: 'សួស្តី {guest}! 💌 ពួកយើងសូមគោរពអញ្ជើញចូលរួមក្នុងថ្ងៃជ័យមង្គលរបស់យើងខ្ញុំ។ ចុចតំណភ្ជាប់ខាងក្រោមដើម្បីមើលសំបុត្រអញ្ជើញ៖',
    en: 'Hi {guest}! 💌 You are warmly invited to our wedding celebration! Tap below to view your invitation:'
  }
]

const kmTextareaRef = ref<HTMLTextAreaElement | null>(null)
const enTextareaRef = ref<HTMLTextAreaElement | null>(null)
const templateKm = ref(DEFAULT_KM)
const templateEn = ref(DEFAULT_EN)
const previewLang = ref<'km' | 'en'>('km')
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

const formatMessage = (lang: 'km' | 'en', guestName: string) => {
  const defaultName = lang === 'km' ? 'ភ្ញៀវកិត្តិយស' : 'Honored Guest'
  const name = guestName?.trim() || defaultName
  const tpl = lang === 'km' ? (templateKm.value || DEFAULT_KM) : (templateEn.value || DEFAULT_EN)
  return tpl.replaceAll('{guest}', name)
}

const renderedPreview = computed(() => formatMessage(previewLang.value, sampleGuest.value))

const insertGuestPlaceholder = (lang: 'km' | 'en') => {
  const el = lang === 'km' ? kmTextareaRef.value : enTextareaRef.value
  const targetRef = lang === 'km' ? templateKm : templateEn
  const token = '{guest}'
  if (!el) {
    targetRef.value = targetRef.value ? `${targetRef.value} ${token}` : token
    return
  }
  const start = el.selectionStart ?? targetRef.value.length
  const end = el.selectionEnd ?? targetRef.value.length
  const before = targetRef.value.slice(0, start)
  const after = targetRef.value.slice(end)
  targetRef.value = `${before}${token}${after}`
  nextTick(() => {
    el.focus()
    const cursor = start + token.length
    el.setSelectionRange(cursor, cursor)
  })
}

const applyPreset = (preset: { km: string; en: string }) => {
  templateKm.value = preset.km
  templateEn.value = preset.en
  saveTemplates()
}

const saveTemplates = async () => {
  saving.value = true
  try {
    const token = await getToken()
    await $fetch('/api/wedding', {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      body: {
        telegram_message_km: templateKm.value,
        telegram_message_en: templateEn.value
      }
    })
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY_KM, templateKm.value)
      localStorage.setItem(STORAGE_KEY_EN, templateEn.value)
    }
    showToast('✓ Telegram KM & EN messages saved to Supabase!')
  } catch (err: any) {
    console.error('Failed to save Telegram messages:', err)
    showToast(err?.data?.statusMessage || 'Failed to save Telegram messages.')
  } finally {
    saving.value = false
  }
}

const resetTemplates = async () => {
  templateKm.value = DEFAULT_KM
  templateEn.value = DEFAULT_EN
  await saveTemplates()
}

const testShareTelegram = () => {
  const url = encodeURIComponent(sampleLink)
  const text = encodeURIComponent(formatMessage(previewLang.value, sampleGuest.value))
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await $fetch<any>(`/api/wedding?t=${Date.now()}`).catch(() => null)
    if (res?.data) {
      if (res.data.telegram_message_km) templateKm.value = res.data.telegram_message_km
      if (res.data.telegram_message_en) templateEn.value = res.data.telegram_message_en
      if (import.meta.client) {
        if (res.data.telegram_message_km) localStorage.setItem(STORAGE_KEY_KM, res.data.telegram_message_km)
        if (res.data.telegram_message_en) localStorage.setItem(STORAGE_KEY_EN, res.data.telegram_message_en)
      }
    } else if (import.meta.client) {
      const savedKm = localStorage.getItem(STORAGE_KEY_KM)
      const savedEn = localStorage.getItem(STORAGE_KEY_EN)
      if (savedKm) templateKm.value = savedKm
      if (savedEn) templateEn.value = savedEn
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
