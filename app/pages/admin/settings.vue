<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.settings') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Edit wedding details, portraits, love story, and KHQR gift account.</p>
      </div>
      <button @click="save" :disabled="saving" class="btn-primary self-start inline-flex items-center gap-1.5">
        <Save class="w-3.5 h-3.5" />
        <span>{{ saving ? 'Saving...' : t('admin.save') }}</span>
      </button>
    </div>

    <div v-if="loading" class="text-center py-8 text-[#3C2925]/50">Loading settings...</div>
    <form v-else @submit.prevent="save" class="space-y-6 max-w-3xl">
      <!-- Couple Names & Portraits -->
      <section class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
        <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-4 flex items-center gap-2">
          <Users class="w-4 h-4" />
          <span>Couple Names & Portraits</span>
        </h2>

        <!-- Photo Upload Row -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-[#C9A24A]/20">
          <!-- Groom Photo -->
          <div class="flex flex-col items-center text-center p-4 bg-[#F7F0E3]/40 rounded-2xl border border-[#C9A24A]/30">
            <div class="w-24 h-24 rounded-full border-2 border-[#C9A24A] overflow-hidden mb-3 bg-white flex items-center justify-center shadow-md relative">
              <img v-if="form.groom_photo_url" :src="form.groom_photo_url" alt="Groom" class="w-full h-full object-cover" />
              <User v-else class="w-10 h-10 text-[#C9A24A]/70" />
            </div>
            <label class="btn-secondary text-xs cursor-pointer inline-flex items-center gap-1.5">
              <Camera class="w-3.5 h-3.5" />
              <span>{{ uploadingGroom ? 'Uploading...' : 'Upload Groom Photo' }}</span>
              <input type="file" accept="image/*" class="hidden" @change="uploadCouplePhoto($event, 'groom')" :disabled="uploadingGroom" />
            </label>
            <button v-if="form.groom_photo_url" type="button" @click="form.groom_photo_url = ''" class="text-[11px] text-red-600 hover:underline mt-1.5 cursor-pointer">Remove photo</button>
          </div>

          <!-- Bride Photo -->
          <div class="flex flex-col items-center text-center p-4 bg-[#F7F0E3]/40 rounded-2xl border border-[#C9A24A]/30">
            <div class="w-24 h-24 rounded-full border-2 border-[#C9A24A] overflow-hidden mb-3 bg-white flex items-center justify-center shadow-md relative">
              <img v-if="form.bride_photo_url" :src="form.bride_photo_url" alt="Bride" class="w-full h-full object-cover" />
              <User v-else class="w-10 h-10 text-[#C9A24A]/70" />
            </div>
            <label class="btn-secondary text-xs cursor-pointer inline-flex items-center gap-1.5">
              <Camera class="w-3.5 h-3.5" />
              <span>{{ uploadingBride ? 'Uploading...' : 'Upload Bride Photo' }}</span>
              <input type="file" accept="image/*" class="hidden" @change="uploadCouplePhoto($event, 'bride')" :disabled="uploadingBride" />
            </label>
            <button v-if="form.bride_photo_url" type="button" @click="form.bride_photo_url = ''" class="text-[11px] text-red-600 hover:underline mt-1.5 cursor-pointer">Remove photo</button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label class="form-label">Groom Name (Khmer)</label><input v-model="form.groom_name_km" class="input-field" /></div>
          <div><label class="form-label">Groom Name (English)</label><input v-model="form.groom_name_en" class="input-field" /></div>
          <div><label class="form-label">Bride Name (Khmer)</label><input v-model="form.bride_name_km" class="input-field" /></div>
          <div><label class="form-label">Bride Name (English)</label><input v-model="form.bride_name_en" class="input-field" /></div>
        </div>
      </section>

      <!-- Date & Venue -->
      <section class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
        <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-4 flex items-center gap-2">
          <Calendar class="w-4 h-4" />
          <span>Date & Venue</span>
        </h2>
        <div class="space-y-4">
          <div><label class="form-label">Wedding Date & Time</label><input v-model="form.wedding_date" type="datetime-local" class="input-field" /></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label class="form-label">Venue Name (Khmer)</label><input v-model="form.venue_name_km" class="input-field" /></div>
            <div><label class="form-label">Venue Name (English)</label><input v-model="form.venue_name_en" class="input-field" /></div>
            <div><label class="form-label">Venue Address (Khmer)</label><textarea v-model="form.venue_address_km" rows="2" class="input-field" /></div>
            <div><label class="form-label">Venue Address (English)</label><textarea v-model="form.venue_address_en" rows="2" class="input-field" /></div>
          </div>
          <div><label class="form-label">Google Maps URL</label><input v-model="form.google_maps_url" type="url" class="input-field" placeholder="https://maps.google.com/..." /></div>
        </div>
      </section>

      <!-- Our Story Milestones -->
      <section class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
              <BookOpen class="w-4 h-4" />
              <span>Our Story (ដំណើររឿងរបស់យើងខ្ញុំ)</span>
            </h2>
            <p class="text-xs text-[#3C2925]/60 mt-0.5">Edit love story milestones displayed on the invitation.</p>
          </div>
          <div class="flex gap-2">
            <button type="button" @click="loadDefaultStory" class="btn-secondary text-[11px] py-1 px-2.5 inline-flex items-center gap-1.5 cursor-pointer">
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Load Template</span>
            </button>
            <button type="button" @click="addStoryMilestone" class="btn-primary text-[11px] py-1 px-2.5 inline-flex items-center gap-1.5 cursor-pointer">
              <Plus class="w-3.5 h-3.5" />
              <span>Add Milestone</span>
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div
            v-for="(item, idx) in form.our_story"
            :key="idx"
            class="p-4 rounded-xl border border-[#C9A24A]/30 bg-[#F7F0E3]/20 relative"
          >
            <div class="flex items-center justify-between mb-3 border-b border-[#C9A24A]/20 pb-2">
              <span class="text-xs font-bold text-[#641D2D]">Milestone #{{ idx + 1 }}</span>
              <div class="flex items-center gap-1">
                <button v-if="idx > 0" type="button" @click="moveStory(idx, -1)" class="p-1 text-xs hover:bg-gray-200 rounded cursor-pointer" title="Move Up">
                  <ArrowUp class="w-3.5 h-3.5" />
                </button>
                <button v-if="idx < form.our_story.length - 1" type="button" @click="moveStory(idx, 1)" class="p-1 text-xs hover:bg-gray-200 rounded cursor-pointer" title="Move Down">
                  <ArrowDown class="w-3.5 h-3.5" />
                </button>
                <button type="button" @click="removeStory(idx)" class="p-1 text-xs text-red-600 hover:bg-red-50 rounded cursor-pointer" title="Delete Milestone">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
              <div class="sm:col-span-1">
                <label class="form-label">Icon Label</label>
                <input v-model="item.icon" class="input-field text-center text-sm" placeholder="e.g. 2019" />
              </div>
              <div class="sm:col-span-3">
                <label class="form-label">Khmer Title</label>
                <input v-model="item.title_km" class="input-field font-khmer-body" placeholder="ថ្ងៃដែលយើងបានជួបគ្នា (២០១៩)" />
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">English Subtitle</label>
              <input v-model="item.subtitle_en" class="input-field font-en-heading uppercase text-xs" placeholder="THE FIRST MEETING (2019)" />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="form-label">Khmer Story Text</label>
                <textarea v-model="item.description_km" rows="2" class="input-field font-khmer-body text-xs" placeholder="ការជួបគ្នាដោយចៃដន្យ..." />
              </div>
              <div>
                <label class="form-label">English Story Text</label>
                <textarea v-model="item.description_en" rows="2" class="input-field text-xs italic" placeholder="A chance encounter..." />
              </div>
            </div>
          </div>

          <div v-if="!form.our_story || !form.our_story.length" class="text-center py-6 text-xs text-[#3C2925]/50 border border-dashed border-[#C9A24A]/40 rounded-xl">
            No custom milestones yet. Click "+ Add Milestone" or "Load Template" to customize your love story timeline.
          </div>
        </div>
      </section>

      <!-- Digital Wedding Gift & KHQR (ចំណងដៃឌីជីថល) -->
      <section class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] flex items-center gap-2">
              <Gift class="w-4 h-4" />
              <span>Digital Wedding Gift & KHQR (ចំណងដៃឌីជីថល)</span>
            </h2>
            <p class="text-xs text-[#3C2925]/60 mt-0.5">Customize KHQR payment card, bank details, and upload QR code image.</p>
          </div>
          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.gift_info.enabled" class="sr-only peer" />
            <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#641D2D]"></div>
            <span class="ml-2 text-xs font-medium text-[#3C2925]">{{ form.gift_info.enabled ? 'Enabled' : 'Disabled' }}</span>
          </label>
        </div>

        <div v-if="form.gift_info.enabled" class="space-y-4 pt-2">
          <!-- QR Code Upload -->
          <div class="p-4 rounded-xl border border-[#C9A24A]/30 bg-[#F7F0E3]/30 flex flex-col sm:flex-row items-center gap-5">
            <div class="w-32 h-32 rounded-xl border-2 border-[#C9A24A] bg-white p-1 overflow-hidden shadow flex items-center justify-center flex-shrink-0 relative">
              <img v-if="form.gift_info.qr_code_url" :src="form.gift_info.qr_code_url" alt="QR" class="w-full h-full object-contain" />
              <div v-else class="text-center p-2 text-xs text-gray-400">
                <QrCode class="w-8 h-8 mx-auto mb-1 text-gray-400" />
                <span>No QR Uploaded</span>
              </div>
            </div>
            <div class="flex-1 text-center sm:text-left space-y-2">
              <div class="text-xs font-bold text-[#641D2D]">KHQR Code Image</div>
              <p class="text-[11px] text-[#3C2925]/70">Upload your Bakong / ABA KHQR code screenshot or photo. It will be auto-optimized for clean rendering.</p>
              <div class="flex flex-wrap gap-2 justify-center sm:justify-start">
                <label class="btn-secondary text-xs cursor-pointer py-1.5 px-3 inline-flex items-center gap-1.5">
                  <Upload class="w-3.5 h-3.5" />
                  <span>{{ uploadingQr ? 'Optimizing & Uploading...' : 'Upload KHQR Image' }}</span>
                  <input type="file" accept="image/*" class="hidden" @change="uploadQrCode" :disabled="uploadingQr" />
                </label>
                <button v-if="form.gift_info.qr_code_url" type="button" @click="form.gift_info.qr_code_url = ''" class="text-xs text-red-600 hover:underline cursor-pointer">Remove QR</button>
              </div>
            </div>
          </div>

          <!-- Bank Account Details -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="form-label">KHQR Account Name (English)</label>
              <input v-model="form.gift_info.account_name_en" class="input-field font-mono uppercase" placeholder="e.g. SEYHA VET" />
            </div>
            <div>
              <label class="form-label">Bank Name</label>
              <input v-model="form.gift_info.bank_name" class="input-field" placeholder="e.g. ABA Bank" />
            </div>
            <div>
              <label class="form-label">Account Name (Khmer)</label>
              <input v-model="form.gift_info.account_name_km" class="input-field font-khmer-heading" placeholder="e.g. វ៉េត សីហា & ស ណារី" />
            </div>
            <div>
              <label class="form-label">Bank Account Number</label>
              <input v-model="form.gift_info.account_number" class="input-field font-mono font-bold" placeholder="e.g. 007 342 922" />
            </div>
          </div>

          <div>
            <label class="form-label">Intro Greeting Note (Khmer)</label>
            <textarea v-model="form.gift_info.message_km" rows="2" class="input-field font-khmer-body text-xs" />
          </div>
        </div>
      </section>

      <!-- Invitation Message -->
      <section class="bg-white rounded-xl border border-[#C9A24A]/20 p-5 shadow-sm">
        <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D] mb-4 flex items-center gap-2">
          <Mail class="w-4 h-4" />
          <span>Invitation Message</span>
        </h2>
        <div class="space-y-4">
          <div>
            <label class="form-label">Message (Khmer)</label>
            <textarea v-model="form.invitation_message_km" rows="4" class="input-field font-khmer-body" />
          </div>
          <div>
            <label class="form-label">Message (English)</label>
            <textarea v-model="form.invitation_message_en" rows="4" class="input-field" />
          </div>
        </div>
      </section>

      <div v-if="successMsg" class="text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-sm">{{ successMsg }}</div>
      <div v-if="errorMsg" class="text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm">{{ errorMsg }}</div>

      <button type="submit" :disabled="saving" class="btn-primary inline-flex items-center gap-2">
        <Save class="w-4 h-4" />
        <span>{{ saving ? 'Saving Changes...' : 'Save Changes' }}</span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import {
  Save,
  Users,
  User,
  Camera,
  Calendar,
  BookOpen,
  RotateCcw,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Gift,
  QrCode,
  Upload,
  Mail
} from 'lucide-vue-next'
import { compressImage } from '~~/app/utils/imageCompressor'
import type { StoryMilestone, WeddingGiftInfo } from '~~/shared/types/wedding'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()

const loading = ref(true)
const saving = ref(false)
const uploadingGroom = ref(false)
const uploadingBride = ref(false)
const uploadingQr = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const DEFAULT_STORY_TEMPLATE: StoryMilestone[] = [
  {
    icon: '⚜️',
    title_km: 'ថ្ងៃដែលយើងបានជួបគ្នា (២០១៩)',
    subtitle_en: 'THE FIRST MEETING (2019)',
    description_km: 'ការជួបគ្នាដោយចៃដន្យនាថ្ងៃប្រឡងបាក់ឌុបឆ្នាំ២០១៩ ដែលក្លាយជាចំណុចចាប់ផ្តើមនៃរឿងរ៉ាវទាំងអស់។',
    description_en: 'A chance encounter during the 2019 national exams that sparked a lifetime.'
  },
  {
    icon: '🌸',
    title_km: 'ការចាប់ផ្តើមស្នេហា',
    subtitle_en: 'THE LOVE BEGINS',
    description_km: 'ពីភាពស្និទ្ធស្នាល ប្រែជាសេចក្តីស្រឡាញ់ ការយល់ចិត្ត និងការមើលថែគ្នាទៅវិញទៅមក។',
    description_en: 'Growing from close companions into true love, understanding, and care.'
  },
  {
    icon: '💍',
    title_km: 'ការសន្យារួមដំណើរ',
    subtitle_en: 'THE COMMITMENT',
    description_km: 'ការប្តេជ្ញាកាន់ដៃគ្នាមិនលែងគ្រប់កាលៈទេសៈ ដោយមានពរជ័យពីអ្នកមានគុណទាំងសងខាង។',
    description_en: 'A promise to walk hand in hand through every season, blessed by our families.'
  },
  {
    icon: '👑',
    title_km: 'ថ្ងៃជ័យមង្គលអាពាហ៍ពិពាហ៍ (១៦.០១.២០២៧)',
    subtitle_en: 'THE WEDDING CELEBRATION (16.01.2027)',
    description_km: 'ថ្ងៃសៅរ៍ ទី១៦ ខែមករា ឆ្នាំ២០២៧ ជាការចាប់ផ្តើមទំព័រជីវិតថ្មីក្រោមសក្ខីភាពនៃក្តីស្រឡាញ់។',
    description_en: 'Saturday, January 16, 2027: Beginning our forever, surrounded by love and family.'
  }
]

const DEFAULT_GIFT_INFO: WeddingGiftInfo = {
  enabled: true,
  qr_code_url: '/images/khqr-default.jpg',
  account_name_en: 'SEYHA VET',
  bank_name: 'ABA Bank',
  account_name_km: 'វ៉ែត សីហា & ស ណារី',
  account_number: '007 342 922',
  message_km: 'សម្រាប់ឯកឧត្តម លោកជំទាវ លោក លោកស្រី និងភ្ញៀវកិត្តិយសទាំងអស់ ដែលមានបំណងចូលរួមចំណងដៃតាមរយៈការស្កេន KHQR ឬផ្ទេរប្រាក់តាមគណនីធនាគារ',
  message_en: 'For guests who wish to send wedding blessings and digital gifts via KHQR or bank transfer.'
}

const form = ref<{
  bride_name_km: string
  bride_name_en: string
  groom_name_km: string
  groom_name_en: string
  groom_photo_url: string
  bride_photo_url: string
  wedding_date: string
  venue_name_km: string
  venue_name_en: string
  venue_address_km: string
  venue_address_en: string
  google_maps_url: string
  invitation_message_km: string
  invitation_message_en: string
  our_story: StoryMilestone[]
  gift_info: WeddingGiftInfo
}>({
  bride_name_km: '',
  bride_name_en: '',
  groom_name_km: '',
  groom_name_en: '',
  groom_photo_url: '',
  bride_photo_url: '',
  wedding_date: '',
  venue_name_km: '',
  venue_name_en: '',
  venue_address_km: '',
  venue_address_en: '',
  google_maps_url: '',
  invitation_message_km: '',
  invitation_message_en: '',
  our_story: [],
  gift_info: { ...DEFAULT_GIFT_INFO }
})

const addStoryMilestone = () => {
  if (!form.value.our_story) form.value.our_story = []
  form.value.our_story.push({
    icon: 'Milestone',
    title_km: '',
    subtitle_en: '',
    description_km: '',
    description_en: ''
  })
}

const loadDefaultStory = () => {
  form.value.our_story = JSON.parse(JSON.stringify(DEFAULT_STORY_TEMPLATE))
}

const removeStory = (idx: number) => {
  form.value.our_story.splice(idx, 1)
}

const moveStory = (idx: number, delta: number) => {
  const target = idx + delta
  if (target < 0 || target >= form.value.our_story.length) return
  const temp = form.value.our_story[idx]
  form.value.our_story[idx] = form.value.our_story[target]
  form.value.our_story[target] = temp
}

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const uploadCouplePhoto = async (e: Event, role: 'groom' | 'bride') => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (role === 'groom') uploadingGroom.value = true
  else uploadingBride.value = true

  const token = await getToken()

  try {
    const compressedFile = await compressImage(file, {
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.85,
      mimeType: 'image/webp'
    })

    const formData = new FormData()
    formData.append('file', compressedFile)

    const res = await $fetch<any>('/api/admin/couple/upload', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: formData
    })

    const uploadedUrl = res?.data?.url
    if (uploadedUrl) {
      if (role === 'groom') form.value.groom_photo_url = uploadedUrl
      else form.value.bride_photo_url = uploadedUrl
    }
  } catch (err: any) {
    console.error('Photo upload error:', err)
    errorMsg.value = `Failed to upload ${role} photo: ${err?.data?.statusMessage || err.message}`
  } finally {
    if (role === 'groom') uploadingGroom.value = false
    else uploadingBride.value = false
    input.value = ''
  }
}

const uploadQrCode = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploadingQr.value = true
  const token = await getToken()

  try {
    // Keep QR clean & sharp with high quality
    const compressedFile = await compressImage(file, {
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.92,
      mimeType: 'image/webp'
    })

    const formData = new FormData()
    formData.append('file', compressedFile)

    const res = await $fetch<any>('/api/admin/couple/upload', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: formData
    })

    const uploadedUrl = res?.data?.url
    if (uploadedUrl) {
      form.value.gift_info.qr_code_url = uploadedUrl
    }
  } catch (err: any) {
    console.error('QR upload error:', err)
    errorMsg.value = `Failed to upload QR code: ${err?.data?.statusMessage || err.message}`
  } finally {
    uploadingQr.value = false
    input.value = ''
  }
}

onMounted(async () => {
  const token = await getToken()
  const { data } = await $fetch<any>('/api/wedding', { headers: { authorization: `Bearer ${token}` } }).catch(() => ({ data: null }))
  if (data) {
    Object.assign(form.value, {
      ...data,
      wedding_date: data.wedding_date ? new Date(data.wedding_date).toISOString().slice(0, 16) : '',
      groom_photo_url: data.groom_photo_url || '',
      bride_photo_url: data.bride_photo_url || '',
      our_story: (data.our_story && data.our_story.length > 0) ? data.our_story : JSON.parse(JSON.stringify(DEFAULT_STORY_TEMPLATE)),
      gift_info: data.gift_info ? { ...DEFAULT_GIFT_INFO, ...data.gift_info } : { ...DEFAULT_GIFT_INFO }
    })
  } else {
    form.value.our_story = JSON.parse(JSON.stringify(DEFAULT_STORY_TEMPLATE))
    form.value.gift_info = { ...DEFAULT_GIFT_INFO }
  }
  loading.value = false
})

const save = async () => {
  saving.value = true; successMsg.value = ''; errorMsg.value = ''
  const token = await getToken()
  try {
    const payload = {
      ...form.value,
      wedding_date: form.value.wedding_date ? new Date(form.value.wedding_date).toISOString() : null
    }
    await $fetch('/api/wedding', { method: 'PUT', headers: { authorization: `Bearer ${token}` }, body: payload })
    successMsg.value = '✓ Wedding settings, KHQR, and Our Story milestones saved successfully.'
  } catch (e: any) { errorMsg.value = e?.data?.statusMessage || 'Error saving settings.' }
  saving.value = false
}
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.btn-secondary { @apply px-3 py-1.5 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-xs disabled:opacity-50; }
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.form-label { @apply block text-xs font-semibold uppercase tracking-wider text-[#3C2925]/70 mb-1; }
</style>
