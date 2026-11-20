<template>
  <section class="py-12 px-4 max-w-3xl mx-auto" v-if="programmes.length">
    <div class="text-center mb-10">
      <div class="text-2xl text-wedding-secondary mb-1">📅</div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading">
        {{ t('common.programme') }}
      </h2>
      <div class="w-24 h-0.5 bg-wedding-secondary mx-auto mt-2"></div>
    </div>

    <!-- Timeline Wrapper -->
    <div class="relative border-l-2 border-wedding-secondary/40 ml-4 sm:ml-32 space-y-8 pl-6 sm:pl-8">
      <div
        v-for="prog in sorted"
        :key="prog.id"
        class="relative group"
      >
        <!-- Time marker floating on left for desktop -->
        <div class="hidden sm:block absolute -left-40 top-0 w-28 text-right font-mono font-bold text-sm text-wedding-primary">
          {{ formatTime(prog.event_time) }}
        </div>

        <!-- Dot Indicator on line -->
        <span class="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-wedding-secondary border-2 border-wedding-bg shadow-sm"></span>

        <!-- Event Content Box -->
        <div class="khmer-card rounded-2xl p-5 border border-wedding-secondary/30 shadow-sm transition-transform hover:-translate-y-0.5">
          <div class="sm:hidden font-mono font-bold text-xs text-wedding-primary mb-1">
            {{ formatTime(prog.event_time) }}
          </div>
          <h3 class="font-khmer-heading text-base sm:text-lg text-wedding-heading">
            {{ isKhmer ? (prog.title_km || prog.title_en) : (prog.title_en || prog.title_km) }}
          </h3>
          <p
            v-if="prog.description_km || prog.description_en"
            class="text-xs sm:text-sm text-wedding-text/80 mt-1 font-khmer-body leading-relaxed"
          >
            {{ isKhmer ? (prog.description_km || prog.description_en) : (prog.description_en || prog.description_km) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { WeddingProgramme } from '~~/shared/types/programme'

const props = defineProps<{
  programmes: WeddingProgramme[]
}>()

const { isKhmer, t } = useLocale()

const sorted = computed(() => [...props.programmes].sort((a, b) => a.display_order - b.display_order))

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
