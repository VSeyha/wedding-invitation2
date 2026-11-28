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
    <div ref="timelineRef" class="relative border-l-2 border-wedding-secondary/40 ml-4 sm:ml-6 space-y-6 pl-6 sm:pl-7">
      <div
        v-for="prog in sorted"
        :key="prog.id"
        data-scroll-fade
        class="relative group scroll-fade-item"
      >
        <!-- Dot Indicator on line -->
        <span class="absolute -left-[31px] sm:-left-[35px] top-3.5 w-3.5 h-3.5 rounded-full bg-wedding-secondary border-2 border-wedding-bg shadow-sm transition-transform duration-300 group-hover:scale-125 group-hover:bg-wedding-primary"></span>

        <!-- Event Content Box -->
        <div class="khmer-card rounded-2xl p-4 sm:p-5 border border-wedding-secondary/30 shadow-sm interactive-card cursor-pointer group-hover:border-wedding-secondary/60">
          <div class="inline-block px-2.5 py-0.5 rounded-full bg-wedding-primary/10 text-wedding-primary font-mono font-bold text-xs mb-1.5 border border-wedding-secondary/20">
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
const timelineRef = ref<HTMLElement | null>(null)

const sorted = computed(() => [...props.programmes].sort((a, b) => a.display_order - b.display_order))
useScrollFade(timelineRef, () => sorted.value.length)

const formatTime = (timeStr: string) => {
  if (!timeStr) return ''
  const d = new Date(timeStr)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
