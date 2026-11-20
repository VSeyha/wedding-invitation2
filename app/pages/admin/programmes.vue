<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.programmes') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Manage the ceremony programme timeline.</p>
      </div>
      <button @click="openCreateModal" class="btn-primary self-start inline-flex items-center gap-1.5">
        <Plus class="w-4 h-4" />
        <span>Add Event</span>
      </button>
    </div>

    <div v-if="loading" class="text-center py-8 text-[#3C2925]/50">Loading...</div>
    <div v-else class="space-y-3">
      <div
        v-for="item in sorted"
        :key="item.id"
        class="bg-white rounded-xl border border-[#C9A24A]/20 p-4 flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="text-xs font-mono bg-[#641D2D]/10 text-[#641D2D] px-2 py-0.5 rounded">{{ formatTime(item.event_time) }}</span>
            <span class="text-xs text-[#3C2925]/50">#{{ item.display_order }}</span>
          </div>
          <div class="font-semibold text-[#641D2D]">{{ item.title_en || item.title_km }}</div>
          <div class="text-xs text-[#3C2925]/70 font-khmer-body" v-if="item.title_km !== item.title_en">{{ item.title_km }}</div>
          <div class="text-xs text-[#3C2925]/60 mt-1" v-if="item.description_en">{{ item.description_en }}</div>
        </div>
        <div class="flex gap-2 self-end sm:self-center">
          <button @click="openEditModal(item)" class="btn-icon text-neutral-600 hover:text-[#641D2D]" title="Edit">
            <Pencil class="w-4 h-4" />
          </button>
          <button @click="confirmDelete(item)" class="btn-icon text-red-500 hover:text-red-700" title="Delete">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div v-if="!sorted.length" class="text-center py-8 text-[#3C2925]/50">No programme events yet.</div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-bold text-[#641D2D] mb-4">{{ editing ? 'Edit Event' : 'Add Event' }}</h2>
        <form @submit.prevent="submit" class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label class="form-label">Title (Khmer)</label><input v-model="form.title_km" class="input-field font-khmer-body" /></div>
            <div><label class="form-label">Title (English)</label><input v-model="form.title_en" class="input-field" /></div>
            <div><label class="form-label">Description (Khmer)</label><textarea v-model="form.description_km" rows="2" class="input-field font-khmer-body" /></div>
            <div><label class="form-label">Description (English)</label><textarea v-model="form.description_en" rows="2" class="input-field" /></div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label class="form-label">Event Time *</label><input v-model="form.event_time" type="datetime-local" required class="input-field" /></div>
            <div><label class="form-label">Display Order</label><input v-model.number="form.display_order" type="number" min="0" class="input-field" /></div>
          </div>
          <div v-if="formError" class="text-red-600 text-sm">{{ formError }}</div>
          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="submitting" class="btn-primary">{{ submitting ? 'Saving...' : 'Save' }}</button>
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div v-if="deleting" class="modal-overlay" @click.self="deleting = null">
      <div class="modal-box">
        <h2 class="text-lg font-bold text-red-700 mb-2">Delete Event?</h2>
        <p class="text-sm text-[#3C2925]/80 mb-4">Delete <strong>{{ deleting.title_en }}</strong>?</p>
        <div class="flex gap-3">
          <button @click="deleteItem" :disabled="submitting" class="btn-danger">Delete</button>
          <button @click="deleting = null" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()

const items = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const editing = ref<any>(null)
const deleting = ref<any>(null)
const submitting = ref(false)
const formError = ref('')
const toast = ref('')
const form = ref({ title_km: '', title_en: '', description_km: '', description_en: '', event_time: '', display_order: 0 })

const sorted = computed(() => [...items.value].sort((a, b) => a.display_order - b.display_order))
const formatTime = (t: string) => t ? new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const fetchItems = async () => {
  loading.value = true
  const token = await getToken()
  const { data } = await $fetch<any>('/api/admin/programmes', { headers: { authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
  items.value = data || []
  loading.value = false
}

const showToast = (msg: string) => { toast.value = msg; setTimeout(() => { toast.value = '' }, 3000) }
const openCreateModal = () => { editing.value = null; form.value = { title_km: '', title_en: '', description_km: '', description_en: '', event_time: '', display_order: items.value.length }; showModal.value = true }
const openEditModal = (item: any) => { editing.value = item; form.value = { ...item, event_time: new Date(item.event_time).toISOString().slice(0, 16) }; showModal.value = true }
const closeModal = () => { showModal.value = false }
const confirmDelete = (item: any) => { deleting.value = item }

const submit = async () => {
  submitting.value = true; formError.value = ''
  const token = await getToken()
  const payload = { ...form.value, event_time: new Date(form.value.event_time).toISOString() }
  try {
    if (editing.value) {
      await $fetch(`/api/admin/programmes/${editing.value.id}`, { method: 'PUT', headers: { authorization: `Bearer ${token}` }, body: payload })
    } else {
      await $fetch('/api/admin/programmes', { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: payload })
    }
    showToast('Saved.'); closeModal(); await fetchItems()
  } catch (e: any) { formError.value = e?.data?.statusMessage || 'Error saving.' }
  submitting.value = false
}

const deleteItem = async () => {
  if (!deleting.value) return
  submitting.value = true
  const token = await getToken()
  await $fetch(`/api/admin/programmes/${deleting.value.id}`, { method: 'DELETE', headers: { authorization: `Bearer ${token}` } }).catch(() => {})
  showToast('Deleted.'); deleting.value = null; await fetchItems()
  submitting.value = false
}

onMounted(fetchItems)
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.btn-danger { @apply px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50; }
.btn-icon { @apply w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F0E3] transition-colors text-base; }
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.form-label { @apply block text-xs font-semibold uppercase tracking-wider text-[#3C2925]/70 mb-1; }
.modal-overlay { @apply fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4; }
.modal-box { @apply bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50; }
</style>
