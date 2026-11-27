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

      <!-- Google Maps QR Code & Button -->
      <div v-if="wedding?.google_maps_url" class="flex flex-col items-center gap-5">
        <div
          v-if="qrDataUrl"
          class="inline-flex flex-col items-center p-3.5 rounded-2xl bg-[#FFFDF9] border-2 border-wedding-secondary/50 shadow-[0_10px_28px_rgba(100,29,45,0.12)]"
        >
          <img
            :src="qrDataUrl"
            alt="Google Maps Location QR Code"
            class="w-36 h-36 sm:w-40 sm:h-40 rounded-xl block"
          />
          <span class="mt-2 text-[11px] font-semibold text-wedding-primary font-khmer-body">
            {{ isKhmer ? 'ស្កេន QR Code ដើម្បីបើកផែនទី' : 'Scan QR Code for Directions' }}
          </span>
        </div>

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
import QRCode from 'qrcode'
import type { WeddingSettings } from '~~/shared/types/wedding'

const props = defineProps<{
  wedding?: WeddingSettings | null
}>()

const { isKhmer, t } = useLocale()
const qrDataUrl = ref('')

watch(
  () => props.wedding?.google_maps_url,
  async (url) => {
    if (!import.meta.client || !url) {
      qrDataUrl.value = ''
      return
    }
    try {
      qrDataUrl.value = await QRCode.toDataURL(url, {
        width: 320,
        margin: 1,
        color: {
          dark: '#641D2D',
          light: '#FFFDF9'
        }
      })
    } catch (err) {
      console.error('Failed to generate location QR code:', err)
      qrDataUrl.value = ''
    }
  },
  { immediate: true }
)
</script>
