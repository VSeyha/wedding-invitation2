<template>
  <section class="py-12 px-4 max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <div class="text-2xl text-wedding-secondary mb-1">🪷</div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading">
        {{ t('common.bride_and_groom') }}
      </h2>
      <div class="w-24 h-0.5 bg-wedding-secondary mx-auto mt-2"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <!-- Groom Card -->
      <div class="khmer-card rounded-3xl p-6 sm:p-8 text-center border border-wedding-secondary/40 shadow-sm relative overflow-hidden group">
        <div class="w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-4 rounded-full border-4 border-wedding-secondary p-1 overflow-hidden shadow-gold-glow bg-white">
          <img
            v-if="wedding?.groom_photo_url"
            :src="wedding.groom_photo_url"
            :alt="wedding.groom_name_en || 'Groom'"
            class="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
          />
          <div
            v-else
            class="w-full h-full rounded-full bg-gradient-to-tr from-wedding-primary/20 to-wedding-secondary/30 flex items-center justify-center text-5xl"
          >
            🤵
          </div>
        </div>
        <div class="text-xs uppercase tracking-widest text-wedding-secondary font-bold mb-1">
          The Groom
        </div>
        <h3 class="font-khmer-heading text-xl text-wedding-primary mb-1">
          {{ wedding?.groom_name_km || 'កូនកំលោះ' }}
        </h3>
        <p class="font-en-heading text-base font-semibold text-wedding-heading">
          {{ wedding?.groom_name_en || 'Groom Name' }}
        </p>
      </div>

      <!-- Bride Card -->
      <div class="khmer-card rounded-3xl p-6 sm:p-8 text-center border border-wedding-secondary/40 shadow-sm relative overflow-hidden group">
        <div class="w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-4 rounded-full border-4 border-wedding-secondary p-1 overflow-hidden shadow-gold-glow bg-white">
          <img
            v-if="wedding?.bride_photo_url"
            :src="wedding.bride_photo_url"
            :alt="wedding.bride_name_en || 'Bride'"
            class="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-105"
          />
          <div
            v-else
            class="w-full h-full rounded-full bg-gradient-to-tr from-wedding-primary/20 to-wedding-secondary/30 flex items-center justify-center text-5xl"
          >
            👰
          </div>
        </div>
        <div class="text-xs uppercase tracking-widest text-wedding-secondary font-bold mb-1">
          The Bride
        </div>
        <h3 class="font-khmer-heading text-xl text-wedding-primary mb-1">
          {{ wedding?.bride_name_km || 'កូនក្រមុំ' }}
        </h3>
        <p class="font-en-heading text-base font-semibold text-wedding-heading">
          {{ wedding?.bride_name_en || 'Bride Name' }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { WeddingSettings } from '~~/shared/types/wedding'

defineProps<{
  wedding?: WeddingSettings | null
}>()

const { t } = useLocale()
</script>
