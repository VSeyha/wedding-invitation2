<template>
  <section class="py-12 px-4 max-w-4xl mx-auto">
    <div class="text-center mb-10">
      <div class="flex items-center justify-center mb-1">
        <RomdoulFlower :size="24" :glow="true" />
      </div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading" style="line-height: 2 !important;">
        {{ t('common.bride_and_groom') }}
      </h2>
      <div class="w-24 h-0.5 bg-wedding-secondary mx-auto mt-4"></div>
    </div>

    <div class="grid grid-cols-2 gap-2.5 sm:gap-5 items-stretch">
      <!-- Groom Card -->
      <div class="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-center border border-wedding-secondary/40 shadow-sm relative overflow-hidden group interactive-card stagger-1 cursor-pointer flex flex-col justify-between">
        <div>
          <div class="w-20 h-20 sm:w-36 sm:h-36 mx-auto mb-2 sm:mb-3 rounded-full border-2 sm:border-4 border-wedding-secondary p-0.5 sm:p-1 overflow-hidden shadow-gold-glow bg-white transition-all duration-300 group-hover:ring-4 group-hover:ring-wedding-secondary/30">
            <img
              v-if="wedding?.groom_photo_url"
              :src="wedding.groom_photo_url"
              :alt="wedding.groom_name_en || 'Groom'"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
            />
            <div
              v-else
              class="w-full h-full rounded-full bg-gradient-to-tr from-wedding-primary/20 to-wedding-secondary/30 flex items-center justify-center text-2xl sm:text-4xl group-hover:scale-110 transition-transform duration-300"
            >
              🤵
            </div>
          </div>
          <div class="text-[10px] sm:text-xs uppercase tracking-widest text-wedding-secondary font-bold mb-1 sm:mb-2">
            The Groom
          </div>
          <h3 class="font-khmer-heading text-sm sm:text-xl text-wedding-primary mb-1" style="line-height: 1.8 !important;">
            {{ wedding?.groom_name_km || 'កូនកំលោះ' }}
          </h3>
          <p class="font-en-heading text-xs sm:text-sm font-semibold text-wedding-heading truncate">
            {{ wedding?.groom_name_en || 'Groom Name' }}
          </p>
        </div>
      </div>

      <!-- Bride Card -->
      <div class="bg-white/85 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 text-center border border-wedding-secondary/40 shadow-sm relative overflow-hidden group interactive-card stagger-2 cursor-pointer flex flex-col justify-between">
        <div>
          <div class="w-20 h-20 sm:w-36 sm:h-36 mx-auto mb-2 sm:mb-3 rounded-full border-2 sm:border-4 border-wedding-secondary p-0.5 sm:p-1 overflow-hidden shadow-gold-glow bg-white transition-all duration-300 group-hover:ring-4 group-hover:ring-wedding-secondary/30">
            <img
              v-if="wedding?.bride_photo_url"
              :src="wedding.bride_photo_url"
              :alt="wedding.bride_name_en || 'Bride'"
              loading="lazy"
              decoding="async"
              class="w-full h-full object-cover rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-1"
            />
            <div
              v-else
              class="w-full h-full rounded-full bg-gradient-to-tr from-wedding-primary/20 to-wedding-secondary/30 flex items-center justify-center text-2xl sm:text-4xl group-hover:scale-110 transition-transform duration-300"
            >
              👰
            </div>
          </div>
          <div class="text-[10px] sm:text-xs uppercase tracking-widest text-wedding-secondary font-bold mb-1 sm:mb-2">
            The Bride
          </div>
          <h3 class="font-khmer-heading text-sm sm:text-xl text-wedding-primary mb-1" style="line-height: 1.8 !important;">
            {{ wedding?.bride_name_km || 'កូនក្រមុំ' }}
          </h3>
          <p class="font-en-heading text-xs sm:text-sm font-semibold text-wedding-heading truncate">
            {{ wedding?.bride_name_en || 'Bride Name' }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import RomdoulFlower from './RomdoulFlower.vue'
import type { WeddingSettings } from '~~/shared/types/wedding'

defineProps<{
  wedding?: WeddingSettings | null
}>()

const { t } = useLocale()
</script>
