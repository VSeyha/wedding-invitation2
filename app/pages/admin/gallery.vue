<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.gallery') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Upload and manage wedding photos (auto-optimized for mobile speed).</p>
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

    <div v-if="uploading" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 animate-pulse flex items-center gap-2">
      <Zap class="w-4 h-4" />
      <span>{{ uploadProgressMessage || 'Optimizing and uploading photos...' }}</span>
    </div>

    <div v-if="loading" class="text-center py-8 text-[#3C2925]/50">Loading gallery...</div>
    <div v-else-if="!photos.length" class="text-center py-16 text-[#3C2925]/50">
      <div class="mb-2 flex justify-center text-[#C9A24A]/60">
        <Image class="w-12 h-12 stroke-1" />
      </div>
      <p class="font-medium">No photos uploaded yet.</p>
      <p class="text-xs text-[#3C2925]/40 mt-1">Click "Upload Photos" above to add pictures to your wedding invitation.</p>
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="relative group rounded-xl overflow-hidden border border-[#C9A24A]/30 shadow-sm aspect-square bg-gray-100"
      >
        <img
          :src="photo.url"
          :alt="photo.alt_text_en || 'Wedding photo'"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
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
import { Camera, Zap, Image, Trash2 } from 'lucide-vue-next'
import { compressImage } from '~~/app/utils/imageCompressor'

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

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 4000)
}

const fetchPhotos = async () => {
  loading.value = true
  const token = await getToken()
  try {
    const res = await $fetch<any>('/api/admin/gallery', {
      headers: { authorization: `Bearer ${token}` }
    })
    photos.value = res?.data || []
  } catch (err: any) {
    console.error('Failed to load gallery:', err)
  } finally {
    loading.value = false
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
    await fetchPhotos()
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
    await fetchPhotos()
  } catch (err: any) {
    showToast(err?.data?.statusMessage || 'Failed to delete photo.')
  } finally {
    submitting.value = false
  }
}

onMounted(fetchPhotos)
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.btn-danger { @apply px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50; }
.modal-overlay { @apply fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4; }
.modal-box { @apply bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50 animate-bounce; }
</style>
