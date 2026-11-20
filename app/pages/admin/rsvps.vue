<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.rsvps') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">Track guest attendance responses.</p>
      </div>
      <button @click="exportCSV" class="btn-secondary self-start text-xs inline-flex items-center gap-1.5">
        <Download class="w-3.5 h-3.5" />
        <span>Export CSV</span>
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-[#C9A24A]/20 p-4 text-center">
        <div class="text-2xl font-bold text-[#641D2D]">{{ stats.total }}</div>
        <div class="text-xs text-[#3C2925]/60 mt-1">Total Guests</div>
      </div>
      <div class="bg-green-50 rounded-xl border border-green-200 p-4 text-center">
        <div class="text-2xl font-bold text-green-700">{{ stats.attending }}</div>
        <div class="text-xs text-green-700/80 mt-1">Attending</div>
      </div>
      <div class="bg-red-50 rounded-xl border border-red-200 p-4 text-center">
        <div class="text-2xl font-bold text-red-700">{{ stats.not_attending }}</div>
        <div class="text-xs text-red-700/80 mt-1">Declined</div>
      </div>
      <div class="bg-amber-50 rounded-xl border border-amber-200 p-4 text-center">
        <div class="text-2xl font-bold text-amber-700">{{ stats.pending }}</div>
        <div class="text-xs text-amber-700/80 mt-1">Pending</div>
      </div>
    </div>

    <!-- Search & Filter -->
    <div class="mb-4 flex flex-col sm:flex-row gap-3">
      <input v-model="search" type="text" placeholder="Search by guest name..." class="input-field max-w-sm" />
      <select v-model="filterStatus" class="input-field max-w-[180px]">
        <option value="">All Statuses</option>
        <option value="attending">Attending</option>
        <option value="not_attending">Declined</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    <div class="bg-white rounded-xl border border-[#C9A24A]/20 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#641D2D]/5 border-b border-[#C9A24A]/20">
            <tr>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Guest Name</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Attendance</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Response Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="3" class="px-4 py-8 text-center text-[#3C2925]/50">Loading...</td></tr>
            <tr v-else-if="!filtered.length"><td colspan="3" class="px-4 py-8 text-center text-[#3C2925]/50">No responses found.</td></tr>
            <tr v-for="row in filtered" :key="row.id || row.guest_name" class="border-b border-[#C9A24A]/10 hover:bg-[#F7F0E3]/50">
              <td class="px-4 py-3 font-medium text-[#3C2925]">{{ row.guest_name }}</td>
              <td class="px-4 py-3">
                <span v-if="row.status === 'attending'" class="badge-success inline-flex items-center gap-1">
                  <Check class="w-3.5 h-3.5" /> Attending
                </span>
                <span v-else-if="row.status === 'not_attending'" class="badge-error inline-flex items-center gap-1">
                  <X class="w-3.5 h-3.5" /> Declined
                </span>
                <span v-else class="badge-neutral inline-flex items-center gap-1">
                  <Clock class="w-3.5 h-3.5" /> Pending
                </span>
              </td>
              <td class="px-4 py-3 text-xs text-[#3C2925]/60">
                {{ row.submitted_at ? new Date(row.submitted_at).toLocaleDateString() : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Download, Check, X, Clock } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()

const rsvps = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const filterStatus = ref('')

const stats = computed(() => ({
  total: rsvps.value.length,
  attending: rsvps.value.filter(r => r.status === 'attending').length,
  not_attending: rsvps.value.filter(r => r.status === 'not_attending').length,
  pending: rsvps.value.filter(r => r.status === 'pending').length,
}))

const filtered = computed(() =>
  rsvps.value.filter(r => {
    const nameMatch = r.guest_name.toLowerCase().includes(search.value.toLowerCase())
    const statusMatch = !filterStatus.value || r.status === filterStatus.value
    return nameMatch && statusMatch
  })
)

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

onMounted(async () => {
  const token = await getToken()
  const { data } = await $fetch<any>('/api/admin/rsvps', { headers: { authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
  // Flatten structure
  rsvps.value = (data || []).map((r: any) => ({
    id: r.id,
    guest_name: r.invitations?.guests?.name || '—',
    status: r.attendance_status,
    submitted_at: r.submitted_at
  }))
  loading.value = false
})

const exportCSV = () => {
  const rows = [['Guest Name', 'Attendance', 'Response Date']]
  rsvps.value.forEach(r => rows.push([r.guest_name, r.status || 'pending', r.submitted_at || '']))
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  a.download = 'rsvps.csv'; a.click()
}
</script>

<style scoped>
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.badge-success { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700; }
.badge-error { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700; }
.badge-neutral { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600; }
</style>
