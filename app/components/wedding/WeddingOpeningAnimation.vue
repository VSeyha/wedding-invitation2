<template>
  <div
    v-if="!opened"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#641D2D] transition-all duration-1000 overflow-hidden"
    :class="{ 'opacity-0 pointer-events-none scale-105': isOpening }"
  >
    <!-- Background Khmer Pattern Texture -->
    <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#C9A24A_1px,transparent_1px)] [background-size:24px_24px]"></div>

    <!-- Envelope Wrapper -->
    <div
      class="max-w-md w-full relative bg-[#F7F0E3] rounded-3xl p-8 sm:p-10 border-4 border-[#C9A24A] shadow-gold-glow-lg text-center transform transition-all duration-700"
      :class="{ 'translate-y-12 opacity-0': isOpening }"
    >
      <!-- Traditional Ornate Corners -->
      <div class="absolute top-2 left-2 text-[#C9A24A] text-xl select-none">⚜️</div>
      <div class="absolute top-2 right-2 text-[#C9A24A] text-xl select-none">⚜️</div>
      <div class="absolute bottom-2 left-2 text-[#C9A24A] text-xl select-none">⚜️</div>
      <div class="absolute bottom-2 right-2 text-[#C9A24A] text-xl select-none">⚜️</div>

      <!-- Top Greeting -->
      <div class="text-[#C9A24A] text-xs font-semibold tracking-widest uppercase mb-2">
        {{ isKhmer ? 'លិខិតអញ្ជើញសិរីមង្គល' : 'WEDDING INVITATION' }}
      </div>

      <!-- Wedding Header -->
      <h1 class="font-khmer-heading text-xl sm:text-2xl text-[#641D2D] mb-1 leading-relaxed">
        សិរីមង្គលអាពាហ៍ពិពាហ៍
      </h1>
      <p class="font-en-heading text-lg text-[#C9A24A] font-bold mb-6">
        {{ wedding?.groom_name_en || 'Groom' }} & {{ wedding?.bride_name_en || 'Bride' }}
      </p>

      <!-- Guest Special Card -->
      <div class="my-6 p-4 rounded-2xl bg-white/80 border border-[#C9A24A]/40 shadow-inner">
        <div class="text-xs text-[#3C2925]/70 font-khmer-body mb-1">
          {{ t('invitation.dear') }}
        </div>
        <div class="text-xl sm:text-2xl font-bold text-[#641D2D] font-khmer-heading leading-relaxed">
          {{ guestName || t('invitation.honored_guest') }}
        </div>
      </div>

      <!-- Golden Seal Button -->
      <div class="mt-8 flex flex-col items-center">
        <button
          @click="handleOpen"
          class="group relative w-20 h-20 rounded-full bg-gradient-to-br from-[#E5C77A] via-[#C9A24A] to-[#8F6B1E] flex items-center justify-center shadow-gold-glow hover:shadow-gold-glow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
          :title="t('common.open_invitation')"
        >
          <!-- Pulsing Outer Ring -->
          <span class="absolute inset-0 rounded-full border-2 border-[#E5C77A] animate-ping opacity-30"></span>

          <!-- Traditional Lotus Motif / Seal -->
          <span class="text-3xl text-[#641D2D] drop-shadow">🪷</span>
        </button>

        <span class="mt-3 text-xs font-semibold text-[#641D2D] tracking-wider uppercase font-khmer-body animate-pulse">
          {{ t('common.open_invitation') }}
        </span>
      </div>

      <!-- Wedding Date Preview -->
      <div class="mt-6 text-xs text-[#3C2925]/60 font-medium">
        {{ formattedDate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { WeddingSettings } from '~~/shared/types/wedding'

const props = defineProps<{
  guestName: string
  wedding?: WeddingSettings | null
}>()

const emit = defineEmits<{
  (e: 'opened'): void
}>()

const { isKhmer, t } = useLocale()
const opened = ref(false)
const isOpening = ref(false)

const formattedDate = computed(() => {
  if (!props.wedding?.wedding_date) return ''
  const d = new Date(props.wedding.wedding_date)
  return d.toLocaleDateString(props.isKhmer ? 'km-KH' : 'en-US', {
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
  }, 800)
}
</script>
