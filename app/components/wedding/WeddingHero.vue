<template>
  <section class="relative pt-10 sm:pt-14 pb-12 px-4 text-center overflow-hidden">
    <!-- Subtitle Greeting in an elegant translucent pill badge -->
    <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-wedding-secondary/45 shadow-sm mb-3">
      <span class="w-1.5 h-1.5 rounded-full bg-wedding-secondary animate-pulse"></span>
      <span class="text-xs sm:text-sm text-wedding-primary font-bold tracking-wide font-khmer-heading">
        {{ t('hero.greeting') }}
      </span>
      <span class="w-1.5 h-1.5 rounded-full bg-wedding-secondary animate-pulse"></span>
    </div>

    <!-- Khmer Wedding Title -->
    <h1 class="font-khmer-heading text-2xl sm:text-3xl text-wedding-heading mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style="line-height: 2.1 !important;">
      {{ isKhmer ? (wedding?.venue_name_km ? 'សិរីមង្គលអាពាហ៍ពិពាហ៍' : 'សិរីមង្គលអាពាហ៍ពិពាហ៍') : 'Wedding Celebration' }}
    </h1>

    <!-- Couple Names Hero Banner (Lightweight & elegant to let background arch frame show through) -->
    <div class="max-w-md mx-auto my-3 p-4 rounded-2xl bg-white/65 backdrop-blur-sm border border-wedding-secondary/35 shadow-sm interactive-card">
      <div class="flex flex-col items-center justify-center gap-1">
        <div class="font-en-heading text-xl sm:text-2xl font-bold text-wedding-primary">
          {{ wedding?.groom_name_en || 'Vet Seyha' }} & {{ wedding?.bride_name_en || 'Sar Nary' }}
        </div>
        <div class="font-khmer-heading text-lg sm:text-xl font-bold text-wedding-primary">
          {{ wedding?.groom_name_km || 'វ៉េត សីហា' }} & {{ wedding?.bride_name_km || 'ស ណារី' }}
        </div>
      </div>

      <!-- Wedding Date in Traditional Khmer & English Subtitle -->
      <div class="mt-3 pt-3 border-t border-wedding-secondary/25 text-center">
        <div class="font-khmer-heading text-sm sm:text-base font-bold text-wedding-heading tracking-wide leading-relaxed">
          {{ isKhmer ? formatKhmerDate(wedding?.wedding_date) : formatEnglishDate(wedding?.wedding_date) }}
        </div>
        <div class="text-xs text-wedding-text/70 font-en-heading font-medium mt-0.5">
          {{ isKhmer ? formatEnglishDate(wedding?.wedding_date) : formatKhmerDate(wedding?.wedding_date) }}
        </div>
      </div>
    </div>

    <!-- Live Countdown Timer -->
    <div class="max-w-lg mx-auto mt-6">
      <div class="text-xs font-bold uppercase tracking-widest text-wedding-secondary mb-3 filter drop-shadow-sm">
        Countdown to Our Special Day
      </div>
      <div class="grid grid-cols-4 gap-2 sm:gap-4">
        <div
          v-for="unit in countdownUnits"
          :key="unit.labelKey"
          class="p-2.5 sm:p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-wedding-secondary/40 shadow-sm interactive-card cursor-pointer group active:scale-95"
        >
          <div class="text-xl sm:text-3xl font-bold text-wedding-primary font-mono transition-transform duration-300 group-hover:scale-105 group-hover:text-wedding-secondary">
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
