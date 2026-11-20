<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[#641D2D] font-en-heading md:text-3xl">
        {{ t('admin.dashboard') }}
      </h1>
      <p class="text-sm text-[#3C2925]/70 mt-1">
        Overview of guests, RSVPs, and wedding invitation metrics.
      </p>
    </div>

    <!-- Quick Stats Placeholder -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div
        v-for="stat in stats"
        :key="stat.labelKey"
        class="bg-white p-4 rounded-xl border border-[#C9A24A]/30 shadow-sm"
      >
        <div class="text-2xl mb-1">{{ stat.icon }}</div>
        <div class="text-xs text-[#3C2925]/70 font-medium">{{ t(stat.labelKey) }}</div>
        <div class="text-xl font-bold text-[#641D2D] mt-1">{{ stat.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth'
})

const { t } = useLocale()

const stats = [
  { labelKey: 'admin.total_guests', value: '0', icon: '👥' },
  { labelKey: 'admin.opened_invitations', value: '0', icon: '💌' },
  { labelKey: 'admin.attending_count', value: '0', icon: '✅' },
  { labelKey: 'admin.not_attending_count', value: '0', icon: '❌' },
  { labelKey: 'admin.pending_count', value: '0', icon: '⏳' },
  { labelKey: 'admin.published', value: 'Active', icon: '🎨' }
]
</script>
