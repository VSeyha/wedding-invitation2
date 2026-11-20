<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.gallery') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Upload and manage wedding photos.</p>
      </div>
      <label class="btn-primary cursor-pointer self-start">
        📷 Upload Photos
        <input type="file" accept="image/*" multiple class="hidden" @change="uploadPhotos" :disabled="uploading" />
      </label>
    </div>

    <div v-if="uploading" class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
      Uploading {{ uploadProgress }}...
    </div>

    <div v-if="loading" class="text-center py-8 text-[#3C2925]/50">Loading...</div>
    <div v-else-if="!photos.length" class="text-center py-16 text-[#3C2925]/50">
      <div class="text-4xl mb-2">🖼️</div>
      <p>No photos uploaded yet. Click "Upload Photos" to get started.</p>
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="photo in photos"
        :key="photo.id"
        class="relative group rounded-xl overflow-hidden border border-[#C9A24A]/20 shadow-sm aspect-square"
      >
        <img
          :src="photo.url"
          :alt="photo.alt_text_en || 'Wedding photo'"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button @click="confirmDeletePhoto(photo)" class="w-9 h-9 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-lg transition-colors" title="Delete">🗑️</button>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
          {{ photo.alt_text_en || `Photo ${photo.display_order + 1}` }}
        </div>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deletingPhoto" class="modal-overlay" @click.self="deletingPhoto = null">
      <div class="modal-box">
        <h2 class="text-lg font-bold text-red-700 mb-2">Delete Photo?</h2>
        <p class="text-sm text-[#3C2925]/80 mb-4">This will permanently remove the photo.</p>
        <div class="flex gap-3">
          <button @click="deletePhoto" :disabled="submitting" class="btn-danger">{{ submitting ? 'Deleting...' : 'Yes, Delete' }}</button>
          <button @click="deletingPhoto = null" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()

const photos = ref<any[]>([])
const loading = ref(true)
const uploading = ref(false)
const uploadProgress = ref('')
const submitting = ref(false)
const deletingPhoto = ref<any>(null)
const toast = ref('')

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const fetchPhotos = async () => {
  loading.value = true
  const token = await getToken()
  const { data } = await $fetch<any>('/api/admin/gallery', { headers: { authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
  photos.value = data || []
  loading.value = false
}

const showToast = (msg: string) => { toast.value = msg; setTimeout(() => { toast.value = '' }, 3000) }

const uploadPhotos = async (e: Event) => {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  if (!files.length || !supabase) return
  uploading.value = true
  const token = await getToken()

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    uploadProgress.value = `${i + 1} / ${files.length}`
    const path = `photos/${Date.now()}_${file.name.replace(/\s+/g, '_')}`

    const { error } = await supabase.storage.from('wedding-photos').upload(path, file, { cacheControl: '3600', upsert: false })
    if (error) { showToast(`Upload failed: ${error.message}`); continue }

    // Save record via API
    await $fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: { storage_path: path, display_order: photos.value.length + i }
    }).catch(() => {})
  }

  uploading.value = false; uploadProgress.value = ''
  showToast(`${files.length} photo(s) uploaded!`)
  await fetchPhotos()
}

const confirmDeletePhoto = (photo: any) => { deletingPhoto.value = photo }
const deletePhoto = async () => {
  if (!deletingPhoto.value || !supabase) return
  submitting.value = true
  const token = await getToken()
  await supabase.storage.from('wedding-photos').remove([deletingPhoto.value.storage_path])
  await $fetch(`/api/admin/gallery/${deletingPhoto.value.id}`, { method: 'DELETE', headers: { authorization: `Bearer ${token}` } }).catch(() => {})
  showToast('Photo deleted.'); deletingPhoto.value = null; await fetchPhotos()
  submitting.value = false
}

onMounted(fetchPhotos)
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.btn-danger { @apply px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50; }
.modal-overlay { @apply fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4; }
.modal-box { @apply bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50; }
</style>
