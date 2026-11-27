<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading">{{ t('admin.invitations') }}</h1>
        <p class="text-sm text-[#3C2925]/60 mt-1">View, share via Telegram, revoke and regenerate invitation links.</p>
      </div>
      <NuxtLink
        to="/admin/telegram"
        class="btn-secondary text-xs inline-flex items-center gap-1.5 self-start"
      >
        <Send class="w-3.5 h-3.5 text-sky-600" />
        <span>Configure Telegram Message</span>
      </NuxtLink>
    </div>

    <!-- Search & Filter -->
    <div class="mb-4 flex flex-col sm:flex-row gap-3">
      <input v-model="search" type="text" placeholder="Search by guest name..." class="input-field max-w-sm" />
      <select v-model="filterStatus" class="input-field max-w-[180px]">
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="revoked">Revoked</option>
      </select>
    </div>

    <div class="bg-white rounded-xl border border-[#C9A24A]/20 overflow-hidden shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-[#641D2D]/5 border-b border-[#C9A24A]/20">
            <tr>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Guest</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Status</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">RSVP</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Opened</th>
              <th class="text-left px-4 py-3 font-semibold text-[#641D2D]">Created</th>
              <th class="text-right px-4 py-3 font-semibold text-[#641D2D]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="6" class="px-4 py-8 text-center text-[#3C2925]/50">Loading...</td></tr>
            <tr v-else-if="!filtered.length"><td colspan="6" class="px-4 py-8 text-center text-[#3C2925]/50">No invitations found.</td></tr>
            <tr
              v-for="inv in paginatedInvitations"
              :key="inv.id"
              class="border-b border-[#C9A24A]/10 hover:bg-[#F7F0E3]/50 transition-colors"
            >
              <td class="px-4 py-3 font-medium text-[#3C2925]">{{ inv.guests?.name }}</td>
              <td class="px-4 py-3">
                <span :class="inv.status === 'active' ? 'badge-success' : 'badge-error'">{{ inv.status }}</span>
              </td>
              <td class="px-4 py-3">
                <span v-if="inv.rsvps?.attendance_status === 'attending'" class="badge-success">✓ Attending</span>
                <span v-else-if="inv.rsvps?.attendance_status === 'not_attending'" class="badge-error">✗ Declined</span>
                <span v-else class="badge-neutral">Pending</span>
              </td>
              <td class="px-4 py-3 text-xs text-[#3C2925]/60">
                {{ inv.opened_at ? new Date(inv.opened_at).toLocaleDateString() : '—' }}
              </td>
              <td class="px-4 py-3 text-xs text-[#3C2925]/60">
                {{ new Date(inv.created_at).toLocaleDateString() }}
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button @click="copyLink(inv)" title="Copy link" class="btn-icon text-neutral-600 hover:text-[#641D2D]" :disabled="inv.status === 'revoked'">
                    <Copy class="w-4 h-4" />
                  </button>
                  <button @click="shareTelegram(inv)" title="Share via Telegram" class="btn-icon text-sky-600 hover:text-sky-700" :disabled="inv.status === 'revoked'">
                    <Send class="w-4 h-4" />
                  </button>
                  <button @click="doAction(inv, inv.status === 'revoked' ? 'activate' : 'revoke')" class="btn-icon" :title="inv.status === 'revoked' ? 'Activate' : 'Revoke'">
                    <CheckCircle2 v-if="inv.status === 'revoked'" class="w-4 h-4 text-green-600" />
                    <Ban v-else class="w-4 h-4 text-amber-600" />
                  </button>
                  <button @click="doAction(inv, 'regenerate')" title="Regenerate link" class="btn-icon text-blue-600 hover:text-blue-800">
                    <RefreshCw class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <AdminPagination
        :total-items="filtered.length"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        item-name="invitations"
      />
    </div>

    <!-- Export -->
    <div class="mt-4 flex justify-end">
      <button @click="exportCSV" class="btn-secondary text-xs inline-flex items-center gap-1.5">
        <Download class="w-3.5 h-3.5" />
        <span>Export CSV</span>
      </button>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </div>
</template>

<script setup lang="ts">
import { Copy, Send, CheckCircle2, Ban, RefreshCw, Download } from 'lucide-vue-next'

definePageMeta({ layout: 'admin', middleware: 'admin-auth' })
const { t } = useLocale()
const supabase = useSupabase()
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl as string

const invitations = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(15)
const toast = ref('')
const submitting = ref(false)

const TELEGRAM_TEMPLATE_STORAGE_KEY = 'wedding_telegram_share_template'
const DEFAULT_TELEGRAM_TEMPLATE = 'សូមគោរពអញ្ជើញ {guest} ចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ 💐💍 សូមចុចលើតំណភ្ជាប់ខាងក្រោមដើម្បីបើកសំបុត្រអញ្ជើញ៖'
const telegramTemplate = ref(DEFAULT_TELEGRAM_TEMPLATE)

const formatTelegramMessage = (guestName?: string, url?: string) => {
  const name = guestName?.trim() || 'ភ្ញៀវកិត្តិយស'
  return (telegramTemplate.value || DEFAULT_TELEGRAM_TEMPLATE)
    .replaceAll('{guest}', name)
    .replaceAll('{link}', url || '')
}

const filtered = computed(() =>
  invitations.value.filter(i => {
    const nameMatch = i.guests?.name?.toLowerCase().includes(search.value.toLowerCase())
    const statusMatch = !filterStatus.value || i.status === filterStatus.value
    return nameMatch && statusMatch
  })
)

const paginatedInvitations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})

watch([search, filterStatus], () => {
  currentPage.value = 1
})

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const fetch = async () => {
  loading.value = true
  const token = await getToken()
  const { data } = await $fetch<any>('/api/admin/invitations', { headers: { authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
  invitations.value = data || []
  loading.value = false
}

const showToast = (msg: string) => { toast.value = msg; setTimeout(() => { toast.value = '' }, 3000) }
const inviteUrl = (inv: any) => `${siteUrl}/invite/${inv.token}`

const copyLink = async (inv: any) => { await navigator.clipboard.writeText(inviteUrl(inv)); showToast('Link copied!') }
const shareTelegram = (inv: any) => {
  const rawUrl = inviteUrl(inv)
  const url = encodeURIComponent(rawUrl)
  const text = encodeURIComponent(formatTelegramMessage(inv.guests?.name, rawUrl))
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
}

const doAction = async (inv: any, action: string) => {
  const token = await getToken()
  try {
    await $fetch(`/api/admin/invitations/${inv.id}`, { method: 'PATCH', headers: { authorization: `Bearer ${token}` }, body: { action } })
    showToast(action === 'revoke' ? 'Invitation revoked.' : action === 'activate' ? 'Invitation activated.' : 'New link generated.')
    await fetch()
  } catch { showToast('Action failed.') }
}

const exportCSV = () => {
  const rows = [['Guest Name', 'Status', 'RSVP', 'Opened At', 'Token URL']]
  invitations.value.forEach(i => rows.push([
    i.guests?.name || '', i.status,
    i.rsvps?.attendance_status || 'pending',
    i.opened_at || '',
    inviteUrl(i)
  ]))
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
  const a = document.createElement('a'); a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  a.download = 'invitations.csv'; a.click()
}

onMounted(() => {
  if (import.meta.client) {
    const saved = localStorage.getItem(TELEGRAM_TEMPLATE_STORAGE_KEY)
    if (saved !== null) telegramTemplate.value = saved
  }
  fetch()
})
</script>

<style scoped>
.input-field { @apply w-full px-3 py-2 rounded-lg border border-[#C9A24A]/40 bg-white focus:outline-none focus:ring-2 focus:ring-[#641D2D]/30 text-sm; }
.btn-secondary { @apply px-4 py-2 rounded-lg bg-[#F7F0E3] text-[#641D2D] font-medium border border-[#C9A24A]/40 hover:bg-[#EDE5D4] transition-colors text-sm; }
.btn-icon { @apply w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F7F0E3] transition-colors text-base disabled:opacity-30; }
.badge-success { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700; }
.badge-error { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700; }
.badge-neutral { @apply inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600; }
.toast { @apply fixed bottom-6 right-6 bg-[#641D2D] text-[#F7F0E3] px-4 py-2 rounded-xl shadow-lg text-sm z-50; }
</style>
