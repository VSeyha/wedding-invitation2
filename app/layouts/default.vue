<template>
  <div
    class="min-h-screen text-wedding-text bg-wedding-bg selection:bg-wedding-primary selection:text-wedding-bg transition-colors duration-500 relative overflow-x-hidden font-khmer-body"
    :lang="isKhmer ? 'km' : 'en'"
  >
    <!-- Language Switcher Floating Button (Suppressed on invitation pages to avoid duplicate) -->
    <header v-if="!route.path.startsWith('/invite')" class="fixed top-4 right-4 z-40">
      <button
        @click="toggleLocale"
        class="flex items-center gap-2 px-3 py-1.5 rounded-full khmer-card hover:border-wedding-primary transition-all text-xs sm:text-sm font-medium shadow-md text-wedding-heading"
        :title="t('common.language')"
      >
        <span class="w-2 h-2 rounded-full bg-wedding-secondary animate-pulse"></span>
        <span>{{ isKhmer ? 'English' : 'ភាសាខ្មែរ' }}</span>
      </button>
    </header>

    <!-- Main Content Slot -->
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { isKhmer, toggleLocale, t } = useLocale()
const { appearance } = useWeddingAppearance()
</script>
