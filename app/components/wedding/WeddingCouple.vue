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
        <div class="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 rounded-full border-4 border-wedding-secondary p-1 overflow-hidden shadow-gold-glow">
          <div class="w-full h-full rounded-full bg-gradient-to-tr from-wedding-primary/20 to-wedding-secondary/30 flex items-center justify-center text-4xl">
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
        <div class="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4 rounded-full border-4 border-wedding-secondary p-1 overflow-hidden shadow-gold-glow">
          <div class="w-full h-full rounded-full bg-gradient-to-tr from-wedding-primary/20 to-wedding-secondary/30 flex items-center justify-center text-4xl">
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
