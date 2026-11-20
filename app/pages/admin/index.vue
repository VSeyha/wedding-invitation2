<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading md:text-3xl">
          {{ t('admin.dashboard') }}
        </h1>
        <p class="text-sm text-[#3C2925]/70 mt-1">
          Overview of guests, RSVPs, and wedding invitation metrics.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="fetchStats"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#C9A24A]/40 text-xs font-medium hover:bg-[#F7F0E3] transition-colors cursor-pointer text-[#641D2D]"
        >
          <RotateCw class="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
        <NuxtLink
          to="/admin/guests"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#641D2D] text-[#F7F0E3] text-xs font-medium hover:bg-[#7D2438] transition-colors shadow-sm"
        >
          <UserPlus class="w-3.5 h-3.5" />
          <span>+ Add Guest</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div
        v-for="stat in statCards"
        :key="stat.labelKey"
        class="bg-white p-4 rounded-xl border border-[#C9A24A]/30 shadow-sm transition-all hover:shadow-md"
      >
        <div class="w-8 h-8 rounded-lg flex items-center justify-center mb-2" :class="stat.bgClass">
          <component :is="stat.icon" class="w-4 h-4" :class="stat.colorClass" />
        </div>
        <div class="text-xs text-[#3C2925]/70 font-medium">{{ t(stat.labelKey) }}</div>
        <div class="text-2xl font-bold text-[#641D2D] mt-1">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Quick Navigation Shortcuts -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        to="/admin/guests"
        class="p-5 rounded-2xl bg-white border border-[#C9A24A]/30 hover:border-[#641D2D] hover:shadow-md transition-all shadow-sm group"
      >
        <div class="w-12 h-12 rounded-xl bg-[#641D2D]/10 text-[#641D2D] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Users class="w-6 h-6" />
        </div>
        <h3 class="font-bold text-sm text-[#641D2D]">Manage Guests</h3>
        <p class="text-xs text-[#3C2925]/70 mt-1">Add guest names and copy invitation links for sharing on Telegram/WhatsApp.</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/rsvps"
        class="p-5 rounded-2xl bg-white border border-[#C9A24A]/30 hover:border-[#641D2D] hover:shadow-md transition-all shadow-sm group"
      >
        <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <CheckSquare class="w-6 h-6" />
        </div>
        <h3 class="font-bold text-sm text-[#641D2D]">Check RSVPs</h3>
        <p class="text-xs text-[#3C2925]/70 mt-1">Review guest responses and export attendee tables to CSV.</p>
      </NuxtLink>

      <NuxtLink
        to="/admin/appearance"
        class="p-5 rounded-2xl bg-white border border-[#C9A24A]/30 hover:border-[#641D2D] hover:shadow-md transition-all shadow-sm group"
      >
        <div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Palette class="w-6 h-6" />
        </div>
        <h3 class="font-bold text-sm text-[#641D2D]">Theme & Animations</h3>
        <p class="text-xs text-[#3C2925]/70 mt-1">Customize Khmer traditional colors, falling petals, and preview on mobile.</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  RotateCw,
  UserPlus,
  Users,
  MailOpen,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  CheckSquare,
  Palette
} from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const { t } = useLocale()
const supabase = useSupabase()

const stats = ref({
  total_guests: 0,
  total_invitations: 0,
  invitations_opened: 0,
  attending: 0,
  not_attending: 0,
  pending: 0
})

const statCards = computed(() => [
  {
    labelKey: 'admin.total_guests',
    value: stats.value.total_guests,
    icon: Users,
    colorClass: 'text-blue-700',
    bgClass: 'bg-blue-50'
  },
  {
    labelKey: 'admin.opened_invitations',
    value: stats.value.invitations_opened,
    icon: MailOpen,
    colorClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50'
  },
  {
    labelKey: 'admin.attending_count',
    value: stats.value.attending,
    icon: CheckCircle2,
    colorClass: 'text-green-700',
    bgClass: 'bg-green-50'
  },
  {
    labelKey: 'admin.not_attending_count',
    value: stats.value.not_attending,
    icon: XCircle,
    colorClass: 'text-rose-700',
    bgClass: 'bg-rose-50'
  },
  {
    labelKey: 'admin.pending_count',
    value: stats.value.pending,
    icon: Clock,
    colorClass: 'text-amber-700',
    bgClass: 'bg-amber-50'
  },
  {
    labelKey: 'admin.published',
    value: 'Active',
    icon: Sparkles,
    colorClass: 'text-[#C9A24A]',
    bgClass: 'bg-[#FAF0E6]'
  }
])

const getToken = async () => {
  if (!supabase) return ''
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token || ''
}

const fetchStats = async () => {
  const token = await getToken()
  try {
    const res = await $fetch<any>('/api/admin/stats', {
      headers: { authorization: `Bearer ${token}` }
    })
    if (res?.data) {
      stats.value = res.data
    }
  } catch (err) {
    console.error('Error fetching admin stats:', err)
  }
}

onMounted(fetchStats)
</script>
