<template>
  <section class="relative pt-20 pb-16 px-4 text-center overflow-hidden">
    <!-- Top Khmer Motif -->
    <div class="inline-block mb-3 text-3xl sm:text-4xl text-wedding-secondary animate-pulse">
      ⚜️
    </div>

    <!-- Subtitle Greeting -->
    <p class="text-xs sm:text-sm text-wedding-secondary font-bold mb-4" :class="{ 'uppercase tracking-widest font-en-heading': !isKhmer }">
      {{ t('hero.greeting') }}
    </p>

    <!-- Khmer Wedding Title -->
    <h1 class="font-khmer-heading text-2xl sm:text-3xl text-wedding-heading mb-6" style="line-height: 2.1 !important;">
      {{ isKhmer ? (wedding?.venue_name_km ? 'សិរីមង្គលអាពាហ៍ពិពាហ៍' : 'សិរីមង្គលអាពាហ៍ពិពាហ៍') : 'Wedding Celebration' }}
    </h1>

    <!-- Couple Names Hero Banner -->
    <div class="max-w-xl mx-auto my-6 p-6 rounded-3xl khmer-card border-2 border-wedding-secondary/50 shadow-gold-glow">
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <div>
          <div class="font-khmer-heading text-xl sm:text-2xl text-wedding-primary">
            {{ isKhmer ? (wedding?.groom_name_km || 'កូនកំលោះ') : (wedding?.groom_name_en || 'Groom') }}
          </div>
          <div class="text-xs text-wedding-text/60 font-en-heading font-medium" v-if="isKhmer">
            {{ wedding?.groom_name_en }}
          </div>
        </div>

        <div class="text-2xl sm:text-3xl text-wedding-secondary font-en-heading font-bold">
          &
        </div>

        <div>
          <div class="font-khmer-heading text-xl sm:text-2xl text-wedding-primary">
            {{ isKhmer ? (wedding?.bride_name_km || 'កូនក្រមុំ') : (wedding?.bride_name_en || 'Bride') }}
          </div>
          <div class="text-xs text-wedding-text/60 font-en-heading font-medium" v-if="isKhmer">
            {{ wedding?.bride_name_en }}
          </div>
        </div>
      </div>

      <!-- Wedding Date in Traditional Khmer & English Subtitle -->
      <div class="mt-4 pt-4 border-t border-wedding-secondary/30 text-center">
        <div class="font-khmer-heading text-base sm:text-lg font-bold text-wedding-heading tracking-wide leading-relaxed">
          {{ isKhmer ? formatKhmerDate(wedding?.wedding_date) : formatEnglishDate(wedding?.wedding_date) }}
        </div>
        <div class="text-xs sm:text-sm text-wedding-text/60 font-en-heading font-medium mt-1">
          {{ isKhmer ? formatEnglishDate(wedding?.wedding_date) : formatKhmerDate(wedding?.wedding_date) }}
        </div>
      </div>
    </div>

    <!-- Live Countdown Timer -->
    <div class="max-w-lg mx-auto mt-8">
      <div class="text-xs font-bold uppercase tracking-widest text-wedding-secondary mb-3">
        Countdown to Our Special Day
      </div>
      <div class="grid grid-cols-4 gap-2 sm:gap-4">
        <div
          v-for="unit in countdownUnits"
          :key="unit.labelKey"
          class="p-3 sm:p-4 rounded-2xl khmer-card border border-wedding-secondary/40 shadow-sm"
        >
          <div class="text-xl sm:text-3xl font-bold text-wedding-primary font-mono">
            {{ unit.value }}
          </div>
          <div class="text-[10px] sm:text-xs text-wedding-text/70 uppercase tracking-wider mt-1">
            {{ t(unit.labelKey) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { WeddingSettings } from '~~/shared/types/wedding'
import { formatKhmerDate, formatEnglishDate } from '~~/app/utils/date'

const props = defineProps<{
  wedding?: WeddingSettings | null
}>()

const { isKhmer, t } = useLocale()

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const countdownUnits = computed(() => [
  { labelKey: 'common.days', value: String(days.value).padStart(2, '0') },
  { labelKey: 'common.hours', value: String(hours.value).padStart(2, '0') },
  { labelKey: 'common.minutes', value: String(minutes.value).padStart(2, '0') },
  { labelKey: 'common.seconds', value: String(seconds.value).padStart(2, '0') }
])

let timer: any = null

const updateCountdown = () => {
  if (!props.wedding?.wedding_date) return
  const target = new Date(props.wedding.wedding_date).getTime()
  const now = new Date().getTime()
  const diff = Math.max(0, target - now)

  days.value = Math.floor(diff / (1000 * 60 * 60 * 24))
  hours.value = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  minutes.value = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  seconds.value = Math.floor((diff % (1000 * 60)) / 1000)
}

onMounted(() => {
  updateCountdown()
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
