<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.gallery') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Upload photos and customize your wedding gallery display on the invitation page.</p>
      </div>
      <label class="btn-primary cursor-pointer self-start flex items-center gap-2">
        <Camera class="w-4 h-4" />
        <span>{{ uploading ? 'Optimizing & Uploading...' : 'Upload Photos' }}</span>
        <input
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="uploadPhotos"
          :disabled="uploading"
        />
      </label>
    </div>

    <!-- Uploading Banner -->
    <div v-if="uploading" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 animate-pulse flex items-center gap-2">
      <Zap class="w-4 h-4" />
      <span>{{ uploadProgressMessage || 'Optimizing and uploading photos...' }}</span>
    </div>

    <!-- Gallery Display & Layout Settings Panel with Live Preview -->
    <div class="mb-8 p-5 sm:p-6 rounded-2xl bg-white border border-[#C9A24A]/35 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 mb-5 border-b border-[#C9A24A]/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#F7F0E3] border border-[#C9A24A]/40 flex items-center justify-center text-lg text-[#641D2D]">
            🎨
          </div>
          <div>
            <h2 class="text-base font-bold text-[#641D2D]">Gallery Display Settings (ការកំណត់ទម្រង់រូបថត)</h2>
            <p class="text-xs text-[#3C2925]/60">Customize how your gallery is arranged and displayed on the guest invitation page.</p>
          </div>
        </div>
        <button
          @click="saveGalleryConfig"
          :disabled="savingConfig"
          class="btn-primary py-2 px-5 text-xs flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm active:scale-95"
        >
          <SlidersHorizontal class="w-3.5 h-3.5" />
          <span>{{ savingConfig ? 'Saving Settings...' : 'Save Gallery Settings' }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
        <!-- 1. Layout Mode -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#641D2D] mb-2">
            Layout Style (ទម្រង់ប្លង់)
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in layoutOptions"
              :key="opt.value"
              type="button"
              @click="galleryConfig.layout = opt.value"
              class="p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer"
              :class="galleryConfig.layout === opt.value
                ? 'border-[#641D2D] bg-[#F7F0E3]/70 font-semibold text-[#641D2D] shadow-sm ring-1 ring-[#641D2D]'
                : 'border-gray-200 hover:border-[#C9A24A]/60 text-gray-700 bg-white'"
            >
              <span class="text-base mb-1">{{ opt.icon }}</span>
              <span class="text-xs font-medium">{{ opt.label }}</span>
              <span class="text-[10px] text-gray-500 font-normal leading-tight mt-0.5">{{ opt.desc }}</span>
            </button>
          </div>
        </div>

        <!-- 2. Aspect Ratio -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#641D2D] mb-2">
            Photo Aspect Ratio (ទំហំរូបថត)
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in aspectOptions"
              :key="opt.value"
              type="button"
              @click="galleryConfig.aspect_ratio = opt.value"
              class="p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer"
              :class="galleryConfig.aspect_ratio === opt.value
                ? 'border-[#641D2D] bg-[#F7F0E3]/70 font-semibold text-[#641D2D] shadow-sm ring-1 ring-[#641D2D]'
                : 'border-gray-200 hover:border-[#C9A24A]/60 text-gray-700 bg-white'"
            >
              <span class="text-base mb-1">{{ opt.icon }}</span>
              <span class="text-xs font-medium">{{ opt.label }}</span>
              <span class="text-[10px] text-gray-500 font-normal leading-tight mt-0.5">{{ opt.desc }}</span>
            </button>
          </div>
        </div>

        <!-- 3. Framing & Border Style -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#641D2D] mb-2">
            Frame Styling (ស៊ុមរូបថត)
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="opt in frameOptions"
              :key="opt.value"
              type="button"
              @click="galleryConfig.card_style = opt.value"
              class="p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer"
              :class="galleryConfig.card_style === opt.value
                ? 'border-[#641D2D] bg-[#F7F0E3]/70 font-semibold text-[#641D2D] shadow-sm ring-1 ring-[#641D2D]'
                : 'border-gray-200 hover:border-[#C9A24A]/60 text-gray-700 bg-white'"
            >
              <span class="text-base mb-1">{{ opt.icon }}</span>
              <span class="text-xs font-medium">{{ opt.label }}</span>
              <span class="text-[10px] text-gray-500 font-normal leading-tight mt-0.5">{{ opt.desc }}</span>
            </button>
          </div>
        </div>

        <!-- 4. Mobile Columns -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#641D2D] mb-2">
            Mobile Columns (ទូរស័ព្ទដៃ)
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="galleryConfig.columns_mobile = 1"
              class="p-2.5 rounded-xl border text-center transition-all cursor-pointer"
              :class="galleryConfig.columns_mobile === 1
                ? 'border-[#641D2D] bg-[#F7F0E3]/70 font-semibold text-[#641D2D] ring-1 ring-[#641D2D]'
                : 'border-gray-200 hover:border-[#C9A24A]/60 text-gray-700'"
            >
              <div class="font-bold text-xs">1 Column</div>
              <div class="text-[10px] text-gray-500">Full Width Cards</div>
            </button>
            <button
              type="button"
              @click="galleryConfig.columns_mobile = 2"
              class="p-2.5 rounded-xl border text-center transition-all cursor-pointer"
              :class="galleryConfig.columns_mobile === 2
                ? 'border-[#641D2D] bg-[#F7F0E3]/70 font-semibold text-[#641D2D] ring-1 ring-[#641D2D]'
                : 'border-gray-200 hover:border-[#C9A24A]/60 text-gray-700'"
            >
              <div class="font-bold text-xs">2 Columns</div>
              <div class="text-[10px] text-gray-500">Compact 2x2 Grid</div>
            </button>
          </div>
        </div>

        <!-- 5. Desktop Columns -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#641D2D] mb-2">
            Desktop Columns (កុំព្យូទ័រ)
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="col in [2, 3, 4] as const"
              :key="col"
              type="button"
              @click="galleryConfig.columns_desktop = col"
              class="p-2.5 rounded-xl border text-center transition-all cursor-pointer"
              :class="galleryConfig.columns_desktop === col
                ? 'border-[#641D2D] bg-[#F7F0E3]/70 font-semibold text-[#641D2D] ring-1 ring-[#641D2D]'
                : 'border-gray-200 hover:border-[#C9A24A]/60 text-gray-700'"
            >
              <div class="font-bold text-xs">{{ col }} Cols</div>
            </button>
          </div>
        </div>

        <!-- 6. Gap / Spacing -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-[#641D2D] mb-2">
            Grid Spacing (គម្លាតរូបភាព)
          </label>
          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="g in [
                { value: 'compact', label: 'Compact', desc: '8px' },
                { value: 'normal', label: 'Normal', desc: '12px' },
                { value: 'relaxed', label: 'Relaxed', desc: '20px' }
              ] as const"
              :key="g.value"
              type="button"
              @click="galleryConfig.gap = g.value"
              class="p-2.5 rounded-xl border text-center transition-all cursor-pointer"
              :class="galleryConfig.gap === g.value
                ? 'border-[#641D2D] bg-[#F7F0E3]/70 font-semibold text-[#641D2D] ring-1 ring-[#641D2D]'
                : 'border-gray-200 hover:border-[#C9A24A]/60 text-gray-700'"
            >
              <div class="font-bold text-xs">{{ g.label }}</div>
              <div class="text-[10px] text-gray-500">{{ g.desc }}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Live Interactive Preview Section -->
      <div class="mt-8 pt-6 border-t border-[#C9A24A]/25">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 class="text-sm font-bold uppercase tracking-wider text-[#641D2D]">
                Live Gallery Preview (ការមើលសាកល្បងផ្ទាល់)
              </h3>
            </div>
            <p class="text-xs text-[#3C2925]/60 mt-0.5">
              Updates in real-time as you tweak the layout and styling options above.
            </p>
          </div>

          <!-- Device Viewport Toggle -->
          <div class="flex items-center bg-gray-100 p-1 rounded-xl self-start sm:self-auto border border-gray-200">
            <button
              type="button"
              @click="previewDevice = 'mobile'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              :class="previewDevice === 'mobile'
                ? 'bg-white text-[#641D2D] shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-800'"
            >
              <Smartphone class="w-3.5 h-3.5" />
              <span>Mobile View (375px)</span>
            </button>
            <button
              type="button"
              @click="previewDevice = 'desktop'"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              :class="previewDevice === 'desktop'
                ? 'bg-white text-[#641D2D] shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-800'"
            >
              <Monitor class="w-3.5 h-3.5" />
              <span>Desktop View (Full)</span>
            </button>
          </div>
        </div>

        <!-- Live Preview Stage with Simulated Wallpaper Backdrop -->
        <div class="bg-gradient-to-b from-[#FAF4EB] via-[#FFFDF9] to-[#F5ECE0] p-4 sm:p-6 rounded-2xl border border-[#C9A24A]/30 flex justify-center overflow-hidden">
          <div
            class="transition-all duration-300 w-full"
            :class="previewDevice === 'mobile'
              ? 'max-w-[390px] bg-white/95 rounded-3xl p-3 sm:p-4 shadow-xl border-2 border-[#C9A24A]/40'
              : 'max-w-4xl bg-white/95 rounded-2xl p-4 sm:p-6 shadow-sm border border-[#C9A24A]/30'"
          >
            <!-- Embedded Gallery Component Running Live Config -->
            <WeddingGallery :photos="previewPhotosList" :config="galleryConfig" />
          </div>
        </div>
      </div>

      <!-- Live Summary Bar -->
      <div class="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-2">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-[#641D2D]">Active Setup:</span>
          <span class="px-2 py-0.5 rounded-md bg-[#F7F0E3] text-[#641D2D] font-mono font-medium">
            {{ galleryConfig.layout }} · {{ galleryConfig.aspect_ratio }} · {{ galleryConfig.card_style }}
          </span>
        </div>
        <span class="text-[11px] text-[#C9A24A] font-medium">✓ Changes apply immediately to public invitation</span>
      </div>
    </div>

    <!-- Photos Grid Header -->
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-sm font-bold uppercase tracking-wider text-[#641D2D]">
        Uploaded Photos ({{ photos.length }})
      </h2>
      <span class="text-xs text-gray-500">Drag or click delete to manage</span>
    </div>

    <!-- Photos Loading State -->
    <div v-if="loading" class="text-center py-8 text-[#3C2925]/50">Loading gallery...</div>
    <div v-else-if="!photos.length" class="text-center py-16 text-[#3C2925]/50">
      <div class="mb-2 flex justify-center text-[#C9A24A]/60">
        <Image class="w-12 h-12 stroke-1" />
      </div>
      <p class="font-medium">No photos uploaded yet.</p>
      <p class="text-xs text-[#3C2925]/40 mt-1">Click "Upload Photos" above to add pictures to your wedding invitation.</p>
    </div>

    <!-- Photos Management Grid -->
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="relative group rounded-xl overflow-hidden border border-[#C9A24A]/30 shadow-sm aspect-square bg-[#F7F0E3]/40"
      >
        <img
          :src="photo.url"
          :alt="photo.alt_text_en || 'Wedding photo'"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            @click="confirmDeletePhoto(photo)"
            class="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-sm transition-colors shadow-lg cursor-pointer"
            title="Delete Photo"
          >
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
          {{ photo.alt_text_en || `Photo ${photo.display_order + 1}` }}
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deletingPhoto" class="modal-overlay" @click.self="deletingPhoto = null">
      <div class="modal-box">
        <h2 class="text-lg font-bold text-red-700 mb-2">Delete Photo?</h2>
        <p class="text-sm text-[#3C2925]/80 mb-4">
          Are you sure you want to delete this photo? It will be permanently removed.
        </p>
        <div class="flex gap-3">
          <button @click="deletePhoto" :disabled="submitting" class="btn-danger">
            {{ submitting ? 'Deleting...' : 'Yes, Delete' }}
          </button>
          <button @click="deletingPhoto = null" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { Camera, Zap, Image, Trash2, SlidersHorizontal, Smartphone, Monitor } from 'lucide-vue-next'
import { compressImage } from '~~/app/utils/imageCompressor'
import WeddingGallery from '~~/app/components/wedding/WeddingGallery.vue'
import { DEFAULT_GALLERY_CONFIG, type GalleryConfig } from '~~/shared/types/wedding'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()

const photos = ref<any[]>([])
const loading = ref(true)
const uploading = ref(false)
const uploadProgressMessage = ref('')
const submitting = ref(false)
const deletingPhoto = ref<any>(null)
const toast = ref('')

const savingConfig = ref(false)
const previewDevice = ref<'mobile' | 'desktop'>('mobile')
const galleryConfig = ref<GalleryConfig>({ ...DEFAULT_GALLERY_CONFIG })

const samplePhotos = [
  { id: 'sample-1', url: '/images/backgrounds/angkor-wat.png', alt_text_en: 'Sample 1', display_order: 0 },
  { id: 'sample-2', url: '/images/backgrounds/kbaj-khmer.jpg', alt_text_en: 'Sample 2', display_order: 1 },
  { id: 'sample-3', url: '/images/backgrounds/khmer-pattern.jpeg', alt_text_en: 'Sample 3', display_order: 2 },
  { id: 'sample-4', url: '/images/backgrounds/golden-lotus.svg', alt_text_en: 'Sample 4', display_order: 3 }
]

const previewPhotosList = computed(() => {
  if (photos.value.length > 0) return photos.value
  return samplePhotos
})

const layoutOptions = [
  { value: 'grid' as const, label: 'Classic Grid', desc: 'Clean uniform columns', icon: '▦' },
  { value: 'masonry' as const, label: 'Masonry Wall', desc: 'Artistic staggered height', icon: '▤' },
  { value: 'carousel' as const, label: 'Swipe Slider', desc: 'Horizontal scroll cards', icon: '↔' },
  { value: 'featured' as const, label: 'Featured Hero', desc: '1 Big photo + sub-grid', icon: '🔲' }
]

const aspectOptions = [
  { value: 'square' as const, label: 'Square 1:1', desc: 'Clean uniform fit', icon: '⬛' },
  { value: 'portrait' as const, label: 'Portrait 3:4', desc: 'Tall elegant portraits', icon: '▯' },
  { value: 'landscape' as const, label: 'Landscape 4:3', desc: 'Scenic wide photos', icon: '▭' },
  { value: 'natural' as const, label: 'Natural Ratio', desc: 'Original image aspect', icon: '🖼️' }
]

const frameOptions = [
  { value: 'gold-frame' as const, label: 'Gold Frame', desc: 'Royal gold border & glow', icon: '👑' },
  { value: 'rounded' as const, label: 'Rounded', desc: 'Modern soft rounded', icon: '🔲' },
  { value: 'glass' as const, label: 'Glassmorphism', desc: 'Frosted white glass', icon: '🫧' },
  { value: 'minimal' as const, label: 'Minimal', desc: 'Clean borderless edge', icon: '▫️' }
]

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 4000)
}

const fetchPhotosAndConfig = async () => {
  loading.value = true
  const token = await getToken()
  try {
    const [galRes, wedRes] = await Promise.all([
      $fetch<any>('/api/admin/gallery', {
        headers: { authorization: `Bearer ${token}` }
      }).catch(() => null),
      $fetch<any>(`/api/wedding?t=${Date.now()}`).catch(() => null)
    ])

    photos.value = galRes?.data || []
    if (wedRes?.data?.gallery_config) {
      galleryConfig.value = { ...DEFAULT_GALLERY_CONFIG, ...wedRes.data.gallery_config }
    }
  } catch (err: any) {
    console.error('Failed to load gallery data:', err)
  } finally {
    loading.value = false
  }
}

const saveGalleryConfig = async () => {
  savingConfig.value = true
  const token = await getToken()

  try {
    const res = await $fetch<any>('/api/wedding', {
      method: 'PUT',
      headers: { authorization: `Bearer ${token}` },
      body: {
        gallery_config: galleryConfig.value
      }
    })

    if (res?.data?.gallery_config) {
      galleryConfig.value = { ...DEFAULT_GALLERY_CONFIG, ...res.data.gallery_config }
    }
    showToast('✓ Gallery settings saved & updated on invitation!')
  } catch (err: any) {
    console.error('Failed to save gallery config:', err)
    showToast('Failed to save gallery settings: ' + (err?.data?.statusMessage || err.message))
  } finally {
    savingConfig.value = false
  }
}

const uploadPhotos = async (e: Event) => {
  const input = e.target as HTMLInputElement
  const fileList = input.files
  if (!fileList || fileList.length === 0) return

  uploading.value = true
  const token = await getToken()

  try {
    const formData = new FormData()
    let originalTotalSize = 0
    let compressedTotalSize = 0

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      originalTotalSize += file.size

      uploadProgressMessage.value = `Optimizing photo ${i + 1} of ${fileList.length}...`

      // Compress client-side: max 1920x1920, quality 0.82 WebP
      const compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1920,
        quality: 0.82,
        mimeType: 'image/webp'
      })

      compressedTotalSize += compressedFile.size
      formData.append('files', compressedFile)
    }

    uploadProgressMessage.value = `Uploading optimized photos to storage...`

    const res = await $fetch<any>('/api/admin/gallery/upload', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: formData
    })

    const count = res?.data?.length || fileList.length
    const originalMb = (originalTotalSize / (1024 * 1024)).toFixed(1)
    const compressedMb = (compressedTotalSize / (1024 * 1024)).toFixed(1)

    showToast(`✓ Uploaded ${count} photo(s) (${originalMb}MB → ${compressedMb}MB, ultra-fast mobile loading!)`)
    input.value = ''
    await fetchPhotosAndConfig()
  } catch (err: any) {
    console.error('Upload error:', err)
    showToast(err?.data?.statusMessage || 'Upload failed. Please try again.')
  } finally {
    uploading.value = false
    uploadProgressMessage.value = ''
  }
}

const confirmDeletePhoto = (photo: any) => {
  deletingPhoto.value = photo
}

const deletePhoto = async () => {
  if (!deletingPhoto.value) return
  submitting.value = true
  const token = await getToken()

  try {
    await $fetch(`/api/admin/gallery/${deletingPhoto.value.id}`, {
      method: 'DELETE',
      headers: { authorization: `Bearer ${token}` }
    })
    showToast('Photo deleted.')
    deletingPhoto.value = null
    await fetchPhotosAndConfig()
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'Failed to delete photo.')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchPhotosAndConfig)
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.btn-danger { @apply px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50; }
.modal-overlay { @apply fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4; }
.modal-box { @apply bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50 animate-bounce; }
</style>
