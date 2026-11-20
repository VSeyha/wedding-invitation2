<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.guests') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Manage wedding guests and their invitation links.</p>
      </div>
      <button @click="openCreateModal" class="btn-primary flex items-center gap-2 self-start">
        <span>+</span> Add Guest
      </button>
    </div>

    <!-- Search -->
    <div class="mb-4">
      <input v-model="search" type="text" placeholder="Search guests..." class="input-field max-w-sm" />
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl border border-[#C9A24A]/20 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#641D2D]/5 border-b border-[#C9A24A]/20">
            <tr>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Name</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Phone</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Status</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">RSVP</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Opened</th>
              <th class="text-right px-4 py-3 font-semibold text-[#641D2D]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="6" class="px-4 py-8 text-center text-[#3C2925]/50">Loading...</td></tr>
            <tr v-else-if="!filteredGuests.length"><td colspan="6" class="px-4 py-8 text-center text-[#3C2925]/50">No guests found.</td></tr>
            <tr
              v-for="guest in filteredGuests"
              :key="guest.id"
              class="border-b border-[#C9A24A]/10 hover:bg-[#F7F0E3]/50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-[#3C2925]">{{ guest.name }}</td>
              <td class="px-4 py-3 text-[#3C2925]/70">{{ guest.phone || '—' }}</td>
              <td class="px-4 py-3">
                <span v-if="invitation(guest)?.status === 'active'" class="badge-success">Active</span>
                <span v-else-if="invitation(guest)?.status === 'revoked'" class="badge-error">Revoked</span>
                <span v-else class="badge-neutral">No Invite</span>
              </td>
              <td class="px-4 py-3">
                <span v-if="rsvp(guest) === 'attending'" class="badge-success">✓ Attending</span>
                <span v-else-if="rsvp(guest) === 'not_attending'" class="badge-error">✗ Declined</span>
                <span v-else class="badge-neutral">Pending</span>
              </td>
              <td class="px-4 py-3 text-[#3C2925]/60 text-xs">
                {{ invitation(guest)?.opened_at ? new Date(invitation(guest).opened_at).toLocaleDateString() : '—' }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="copyLink(guest)" title="Copy invite link" class="btn-icon">📋</button>
                  <button @click="openEditModal(guest)" title="Edit guest" class="btn-icon">✏️</button>
                  <button @click="confirmDelete(guest)" title="Delete guest" class="btn-icon text-red-500">🗑️</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create / Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-box">
        <h2 class="text-lg font-bold text-[#641D2D] mb-4">{{ editingGuest ? 'Edit Guest' : 'Add New Guest' }}</h2>
        <form @submit.prevent="submitGuest" class="space-y-4">
          <div>
            <label class="form-label">Guest Name *</label>
            <input v-model="form.name" type="text" required class="input-field" placeholder="e.g. Sopheak Dara" />
          </div>
          <div>
            <label class="form-label">Phone (optional)</label>
            <input v-model="form.phone" type="text" class="input-field" placeholder="+855 12 345 678" />
          </div>
          <div v-if="formError" class="text-red-600 text-sm">{{ formError }}</div>
          <div class="flex gap-3 pt-2">
            <button type="submit" :disabled="submitting" class="btn-primary">
              {{ submitting ? 'Saving...' : editingGuest ? 'Save Changes' : 'Add Guest' }}
            </button>
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div v-if="deletingGuest" class="modal-overlay" @click.self="deletingGuest = null">
      <div class="modal-box">
        <h2 class="text-lg font-bold text-red-700 mb-2">Delete Guest?</h2>
        <p class="text-sm text-[#3C2925]/80 mb-4">
          Delete <strong>{{ deletingGuest.name }}</strong>? This will also remove their invitation and RSVP.
        </p>
        <div class="flex gap-3">
          <button @click="deleteGuest" :disabled="submitting" class="btn-danger">{{ submitting ? 'Deleting...' : 'Yes, Delete' }}</button>
          <button @click="deletingGuest = null" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()
const config = useRuntimeConfig()

const guests = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const showModal = ref(false)
const editingGuest = ref<any>(null)
const deletingGuest = ref<any>(null)
const submitting = ref(false)
const formError = ref('')
const toast = ref('')
const form = ref({ name: '', phone: '' })

const siteUrl = config.public.siteUrl as string

const filteredGuests = computed(() =>
  guests.value.filter(g => g.name.toLowerCase().includes(search.value.toLowerCase()))
)

const invitation = (g: any) => g.invitations?.[0]
const rsvp = (g: any) => invitation(g)?.rsvps?.[0]?.attendance_status

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const fetchGuests = async () => {
  loading.value = true
  const token = await getToken()
  const { data } = await $fetch<any>('/api/admin/guests', {
    headers: { authorization: `Bearer ${token}` }
  }).catch(() => ({ data: [] }))
  guests.value = data || []
  loading.value = false
}

const showToast = (msg: string) => {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 3000)
}

const openCreateModal = () => { editingGuest.value = null; form.value = { name: '', phone: '' }; formError.value = ''; showModal.value = true }
const openEditModal = (g: any) => { editingGuest.value = g; form.value = { name: g.name, phone: g.phone || '' }; formError.value = ''; showModal.value = true }
const closeModal = () => { showModal.value = false; editingGuest.value = null }

const submitGuest = async () => {
  submitting.value = true; formError.value = ''
  const token = await getToken()
  try {
    if (editingGuest.value) {
      await $fetch(`/api/admin/guests/${editingGuest.value.id}`, { method: 'PUT', headers: { authorization: `Bearer ${token}` }, body: form.value })
      showToast('Guest updated.')
    } else {
      await $fetch('/api/admin/guests', { method: 'POST', headers: { authorization: `Bearer ${token}` }, body: form.value })
      showToast('Guest added with invitation link.')
    }
    closeModal(); await fetchGuests()
  } catch (e: any) { formError.value = e?.data?.statusMessage || 'Error saving guest.' }
  submitting.value = false
}

const confirmDelete = (g: any) => { deletingGuest.value = g }
const deleteGuest = async () => {
  if (!deletingGuest.value) return
  submitting.value = true
  const token = await getToken()
  try {
    await $fetch(`/api/admin/guests/${deletingGuest.value.id}`, { method: 'DELETE', headers: { authorization: `Bearer ${token}` } })
    showToast('Guest deleted.'); deletingGuest.value = null; await fetchGuests()
  } catch { showToast('Error deleting guest.') }
  submitting.value = false
}

const copyLink = async (g: any) => {
  const token = invitation(g)?.token
  if (!token) return showToast('No invitation link yet.')
  const url = `${siteUrl}/invite/${token}`
  await navigator.clipboard.writeText(url)
  showToast('Invitation link copied!')
}

onMounted(fetchGuests)
</script>

<style scoped>
.btn-primary { @apply px-4 py-2 rounded-lg bg-[#641D2D] text-[#F7F0E3] font-medium hover:bg-[#7D2438] transition-colors text-sm disabled:opacity-50; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.btn-danger { @apply px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors text-sm disabled:opacity-50; }
.btn-icon { @apply w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F0E3] transition-colors text-base; }
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.form-label { @apply block text-xs font-semibold uppercase tracking-wider text-[#3C2925]/70 mb-1; }
.badge-success { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700; }
.badge-error { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700; }
.badge-neutral { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600; }
.modal-overlay { @apply fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4; }
.modal-box { @apply bg-white rounded-2xl p-6 w-full max-w-md shadow-xl; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50 animate-bounce; }
</style>
