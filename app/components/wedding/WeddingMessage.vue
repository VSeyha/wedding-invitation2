<template>
  <section class="py-12 px-4 max-w-2xl mx-auto text-center">
    <div class="khmer-card rounded-3xl p-8 sm:p-10 border-2 border-wedding-secondary/40 shadow-sm relative">
      <!-- Decorative Top Seal -->
      <div class="text-3xl text-wedding-secondary mb-3">⚜️</div>

      <h2 class="font-khmer-heading text-lg sm:text-xl text-wedding-primary mb-4 leading-relaxed">
        {{ isKhmer ? 'សេចក្តីថ្លែងអំណរគុណ និងការគោរពអញ្ជើញ' : 'A Message from the Couple' }}
      </h2>

      <!-- Message Body -->
      <p class="font-khmer-body text-sm sm:text-base leading-loose text-wedding-text/90 italic mb-4">
        {{ isKhmer ? (wedding?.invitation_message_km || t('invitation.warm_message')) : (wedding?.invitation_message_en || t('invitation.warm_message')) }}
      </p>

      <div class="w-16 h-0.5 bg-wedding-secondary mx-auto mt-6 mb-2"></div>
      <div class="text-xs uppercase tracking-widest text-wedding-secondary font-bold">
        {{ wedding?.groom_name_en }} & {{ wedding?.bride_name_en }}
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
