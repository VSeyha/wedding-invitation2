<template>
  <section class="py-14 px-4 max-w-3xl mx-auto">
    <!-- Header Title -->
    <div class="text-center mb-10">
      <div class="text-xs uppercase tracking-widest text-wedding-secondary font-bold mb-3 font-en-heading">
        {{ isKhmer ? 'ដំណើររឿងស្នេហា' : 'OUR LOVE STORY' }}
      </div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading" style="line-height: 2.1 !important;">
        {{ isKhmer ? 'ដំណើររឿងរបស់យើងខ្ញុំ' : 'Our Beautiful Journey' }}
      </h2>
      <div class="flex items-center justify-center gap-2 mt-4 text-wedding-secondary">
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
        <RomdoulFlower :size="20" :glow="true" />
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
      </div>
    </div>

    <!-- Story Card Frame with Double Gold Border -->
    <div class="rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-[#FAF4EB] via-[#FFFDF9] to-[#F5ECE0] border border-wedding-secondary/35 shadow-gold-glow relative interactive-card">
      <div class="rounded-[22px] p-6 sm:p-8 bg-[#FFFDF9]/95 border border-wedding-secondary/40 relative overflow-hidden backdrop-blur-sm">
        <!-- Traditional Corner Khmer Kbach Accents -->
        <div class="absolute top-2.5 left-2.5 select-none pointer-events-none">
          <KhmerKbach :size="24" type="corner" position="top-left" />
        </div>
        <div class="absolute top-2.5 right-2.5 select-none pointer-events-none">
          <KhmerKbach :size="24" type="corner" position="top-right" />
        </div>
        <div class="absolute bottom-2.5 left-2.5 select-none pointer-events-none">
          <KhmerKbach :size="24" type="corner" position="bottom-left" />
        </div>
        <div class="absolute bottom-2.5 right-2.5 select-none pointer-events-none">
          <KhmerKbach :size="24" type="corner" position="bottom-right" />
        </div>

        <!-- Vertical Timeline Track with Clean Item-to-Item Connection -->
        <div ref="storyTrackRef" class="relative ml-5 sm:ml-6 space-y-8 sm:space-y-9 pl-6 sm:pl-7 py-2">
          <div
            v-for="(item, index) in activeStoryItems"
            :key="index"
            data-scroll-fade
            class="relative group cursor-pointer p-2 sm:p-2.5 rounded-2xl transition-all duration-300 hover:bg-white/70 hover:shadow-sm scroll-fade-item"
          >
            <!-- Vertical Line Segment that connects ONLY to next milestone (No dangling tail after last item) -->
            <div
              v-if="index < activeStoryItems.length - 1"
              class="absolute -left-[26px] sm:-left-[28px] top-10 bottom-[-36px] w-[2px] bg-gradient-to-b from-wedding-secondary/70 via-wedding-secondary/50 to-wedding-secondary/40"
            ></div>

            <!-- Circular Milestone Badge (Luminous ivory without dark fill, with radiant gold halo on wedding day) -->
            <div
              class="absolute -left-[46px] sm:-left-[49px] top-2 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-115 group-hover:ring-4 group-hover:ring-wedding-secondary/35 group-active:scale-95 shadow-sm"
              :class="index === activeStoryItems.length - 1
                ? 'bg-gradient-to-br from-white via-[#FFFDF5] to-[#FDF4DC] border-wedding-secondary ring-4 ring-wedding-secondary/25 shadow-gold-glow'
                : 'bg-white/95 border-wedding-secondary/70'"
            >
              <span class="text-base sm:text-lg select-none leading-none flex items-center justify-center">
                {{ item.icon || '✨' }}
              </span>
            </div>

            <!-- Story Item Content -->
            <div class="pt-0.5 pl-1 transition-transform duration-300 group-hover:translate-x-1">
              <!-- Khmer Title -->
              <h3 class="font-khmer-heading text-base sm:text-lg text-wedding-primary group-hover:text-wedding-heading transition-colors" style="line-height: 1.85 !important;">
                {{ item.title_km }}
              </h3>

              <!-- English Subtitle -->
              <div class="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-wedding-secondary my-1 font-en-heading">
                {{ item.subtitle_en }}
              </div>

              <!-- Khmer Description -->
              <p class="font-khmer-body text-xs sm:text-[13px] text-wedding-text/85 leading-relaxed pt-0.5">
                {{ item.description_km }}
              </p>

              <!-- English Italic Description -->
              <p class="font-en-body text-[11px] sm:text-xs text-wedding-text/65 italic mt-1 font-light leading-relaxed">
                {{ item.description_en }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import RomdoulFlower from './RomdoulFlower.vue'
import KhmerKbach from './KhmerKbach.vue'
import type { StoryMilestone } from '~~/shared/types/wedding'

const props = defineProps<{
  story?: StoryMilestone[] | null
}>()

const { isKhmer } = useLocale()
const storyTrackRef = ref<HTMLElement | null>(null)

const DEFAULT_STORY_ITEMS: StoryMilestone[] = [
  {
    icon: '✨',
    title_km: 'ថ្ងៃដែលយើងបានជួបគ្នា (២០១៩)',
    subtitle_en: 'THE FIRST MEETING (2019)',
    description_km: 'ការជួបគ្នាដោយចៃដន្យនាថ្ងៃប្រឡងបាក់ឌុបឆ្នាំ២០១៩ ដែលក្លាយជាចំណុចចាប់ផ្តើមនៃរឿងរ៉ាវទាំងអស់។',
    description_en: 'A chance encounter during the 2019 national exams that sparked a lifetime.'
  },
  {
    icon: '🌸',
    title_km: 'ការចាប់ផ្តើមស្នេហា',
    subtitle_en: 'THE LOVE BEGINS',
    description_km: 'ពីភាពស្និទ្ធស្នាល ប្រែជាសេចក្តីស្រឡាញ់ ការយល់ចិត្ត និងការមើលថែគ្នាទៅវិញទៅមក។',
    description_en: 'Growing from close companions into true love, understanding, and care.'
  },
  {
    icon: '💍',
    title_km: 'ការសន្យារួមដំណើរ',
    subtitle_en: 'THE COMMITMENT',
    description_km: 'ការប្តេជ្ញាកាន់ដៃគ្នាមិនលែងគ្រប់កាលៈទេសៈ ដោយមានពរជ័យពីអ្នកមានគុណទាំងសងខាង។',
    description_en: 'A promise to walk hand in hand through every season, blessed by our families.'
  },
  {
    icon: '👑',
    title_km: 'ថ្ងៃជ័យមង្គលអាពាហ៍ពិពាហ៍ (១៦.០១.២០២៧)',
    subtitle_en: 'THE WEDDING CELEBRATION (16.01.2027)',
    description_km: 'ថ្ងៃសៅរ៍ ទី១៦ ខែមករា ឆ្នាំ២០២៧ ជាការចាប់ផ្តើមទំព័រជីវិតថ្មីក្រោមសក្ខីភាពនៃក្តីស្រឡាញ់។',
    description_en: 'Saturday, January 16, 2027: Beginning our forever, surrounded by love and family.'
  }
]

const activeStoryItems = computed(() => {
  if (props.story && props.story.length > 0) {
    return props.story
  }
  return DEFAULT_STORY_ITEMS
})

useScrollFade(storyTrackRef, () => activeStoryItems.value.length)
</script>
