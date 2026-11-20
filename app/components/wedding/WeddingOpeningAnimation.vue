<template>
  <div
    v-if="!opened"
    :class="[
      absolute ? 'absolute inset-0 z-30' : 'fixed inset-0 z-50',
      'flex items-center justify-center p-4 bg-wedding-primary transition-all duration-1000 overflow-hidden'
    ]"
    :style="{ backgroundColor: 'var(--wedding-primary, #641D2D)' }"
    :class-extra="{ 'opacity-0 pointer-events-none scale-105': isOpening }"
  >
    <!-- Background Khmer Pattern Texture -->
    <div
      class="absolute inset-0 opacity-10"
      :style="{
        backgroundImage: 'radial-gradient(var(--wedding-secondary, #C9A24A) 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }"
    ></div>

    <!-- Envelope Wrapper -->
    <div
      class="max-w-md w-full relative rounded-3xl p-6 sm:p-10 border-4 border-wedding-secondary shadow-gold-glow-lg text-center transform transition-all duration-700"
      :style="{
        backgroundColor: 'var(--wedding-bg, #F7F0E3)',
        borderColor: 'var(--wedding-secondary, #C9A24A)'
      }"
      :class="{ 'translate-y-12 opacity-0': isOpening }"
    >
      <!-- Traditional Ornate Corners -->
      <div class="absolute top-2 left-2 text-wedding-secondary text-xl select-none">⚜️</div>
      <div class="absolute top-2 right-2 text-wedding-secondary text-xl select-none">⚜️</div>
      <div class="absolute bottom-2 left-2 text-wedding-secondary text-xl select-none">⚜️</div>
      <div class="absolute bottom-2 right-2 text-wedding-secondary text-xl select-none">⚜️</div>

      <!-- Top Greeting -->
      <div class="text-wedding-secondary text-xs font-semibold tracking-widest uppercase mb-2">
        {{ isKhmer ? 'លិខិតអញ្ជើញសិរីមង្គល' : 'WEDDING INVITATION' }}
      </div>

      <!-- Wedding Header -->
      <h1 class="font-khmer-heading text-xl sm:text-2xl text-wedding-primary mb-1 leading-relaxed">
        សិរីមង្គលអាពាហ៍ពិពាហ៍
      </h1>
      <p class="font-en-heading text-lg text-wedding-secondary font-bold mb-6">
        {{ wedding?.groom_name_en || 'Seyha' }} & {{ wedding?.bride_name_en || 'Nary' }}
      </p>

      <!-- Guest Special Card -->
      <div class="my-6 p-4 rounded-2xl bg-white/80 border border-wedding-secondary/40 shadow-inner">
        <div class="text-xs text-wedding-text/70 font-khmer-body mb-1">
          {{ t('invitation.dear') }}
        </div>
        <div class="text-xl sm:text-2xl font-bold text-wedding-primary font-khmer-heading leading-relaxed">
          {{ guestName || 'ភ្ញៀវកិត្តិយស' }}
        </div>
      </div>

      <!-- Golden Seal Button -->
      <div class="mt-8 flex flex-col items-center">
        <button
          type="button"
          @click="handleOpen"
          class="group relative w-20 h-20 rounded-full flex items-center justify-center shadow-gold-glow hover:shadow-gold-glow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
          :style="{
            background: 'linear-gradient(135deg, var(--wedding-accent, #E5C77A), var(--wedding-secondary, #C9A24A), #8F6B1E)'
          }"
          :title="t('common.open_invitation')"
        >
          <!-- Pulsing Outer Ring -->
          <span
            class="absolute inset-0 rounded-full border-2 animate-ping opacity-30"
            :style="{ borderColor: 'var(--wedding-accent, #E5C77A)' }"
          ></span>

          <!-- Traditional Lotus Motif / Seal -->
          <span class="text-3xl drop-shadow">🪷</span>
        </button>

        <span class="mt-3 text-xs font-semibold text-wedding-primary tracking-wider uppercase font-khmer-body animate-pulse">
          {{ t('common.open_invitation') }}
        </span>
      </div>

      <!-- Wedding Date Preview -->
      <div class="mt-6 text-xs text-wedding-text/60 font-medium">
        {{ formattedDate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeddingSettings } from '~~/shared/types/wedding'

const props = defineProps<{
  guestName?: string
  wedding?: WeddingSettings | null
  absolute?: boolean
}>()

const emit = defineEmits<{
  (e: 'opened'): void
}>()

const { isKhmer, t } = useLocale()
const opened = ref(false)
const isOpening = ref(false)

const formattedDate = computed(() => {
  if (!props.wedding?.wedding_date) return 'ថ្ងៃសៅរ៍ ទី១៦ ខែមករា ឆ្នាំ២០២៧'
  const d = new Date(props.wedding.wedding_date)
  return d.toLocaleDateString(isKhmer.value ? 'km-KH' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const handleOpen = () => {
  isOpening.value = true
  setTimeout(() => {
    opened.value = true
    emit('opened')
  }, 900)
}

// Allow external resets (for live preview re-testing)
defineExpose({
  reset: () => {
    opened.value = false
    isOpening.value = false
  }
})
</script>
