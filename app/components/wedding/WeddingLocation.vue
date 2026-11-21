<template>
  <section class="py-12 px-4 max-w-3xl mx-auto">
    <div class="text-center mb-8">
      <div class="text-2xl text-wedding-secondary mb-1">📍</div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading">
        {{ t('common.location') }}
      </h2>
      <div class="w-24 h-0.5 bg-wedding-secondary mx-auto mt-2"></div>
    </div>

    <div class="khmer-card rounded-3xl p-6 sm:p-8 border-2 border-wedding-secondary/40 shadow-sm text-center interactive-card">
      <!-- Venue Name -->
      <h3 class="font-khmer-heading text-lg sm:text-2xl text-wedding-primary mb-2">
        {{ isKhmer ? (wedding?.venue_name_km || wedding?.venue_name_en) : (wedding?.venue_name_en || wedding?.venue_name_km) }}
      </h3>

      <!-- Venue Address -->
      <p class="font-khmer-body text-sm text-wedding-text/80 max-w-lg mx-auto mb-6 leading-relaxed">
        {{ isKhmer ? (wedding?.venue_address_km || wedding?.venue_address_en) : (wedding?.venue_address_en || wedding?.venue_address_km) }}
      </p>

      <!-- Google Maps Button -->
      <div v-if="wedding?.google_maps_url">
        <a
          :href="wedding.google_maps_url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-wedding-primary hover:bg-wedding-primary/90 text-wedding-bg font-medium shadow-md transition-all text-sm interactive-btn cursor-pointer"
        >
          <span>🗺️</span>
          <span>{{ t('common.open_map') }}</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { WeddingSettings } from '~~/shared/types/wedding'

defineProps<{
  wedding?: WeddingSettings | null
}>()

const { isKhmer, t } = useLocale()
</script>
