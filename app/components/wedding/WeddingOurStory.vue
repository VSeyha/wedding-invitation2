<template>
  <section class="py-14 px-4 max-w-3xl mx-auto">
    <!-- Header Title -->
    <div class="text-center mb-10">
      <div class="text-xs uppercase tracking-widest text-wedding-secondary font-bold mb-3 font-en-heading">
        រឿងរ៉ាវស្នេហា / OUR STORY
      </div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading" style="line-height: 2 !important;">
        ដំណើររឿងរបស់យើងខ្ញុំ
      </h2>
      <div class="flex items-center justify-center gap-2 mt-4 text-wedding-secondary">
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
        <span class="text-lg">🪷</span>
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
      </div>
    </div>

    <!-- Story Card Frame -->
    <div class="khmer-card rounded-3xl p-6 sm:p-10 border-2 border-wedding-secondary/40 shadow-gold-glow relative overflow-hidden">
      <!-- Traditional Corner Ornaments -->
      <div class="absolute top-2 left-2 text-wedding-secondary/50 text-xl select-none">⚜️</div>
      <div class="absolute top-2 right-2 text-wedding-secondary/50 text-xl select-none">⚜️</div>
      <div class="absolute bottom-2 left-2 text-wedding-secondary/50 text-xl select-none">⚜️</div>
      <div class="absolute bottom-2 right-2 text-wedding-secondary/50 text-xl select-none">⚜️</div>

      <!-- Vertical Timeline Track -->
      <div class="relative border-l-2 border-[#E5C77A]/50 ml-5 sm:ml-7 space-y-10 pl-6 sm:pl-8 py-2">
        <div
          v-for="(item, index) in activeStoryItems"
          :key="index"
          class="relative group"
        >
          <!-- Circular Badge on the line -->
          <div
            class="absolute -left-[45px] sm:-left-[53px] top-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 shadow-md transition-transform group-hover:scale-110"
            :class="index === activeStoryItems.length - 1
              ? 'bg-[#641D2D] border-[#C9A24A] text-[#E5C77A] ring-2 ring-[#C9A24A]/40'
              : index === 1
                ? 'bg-[#FFF9FA] border-rose-300/80 text-rose-500'
                : 'bg-[#FFFDF9] border-[#C9A24A]/80 text-[#C9A24A]'"
          >
            <span class="text-base sm:text-lg select-none">{{ item.icon || '⚜️' }}</span>
          </div>

          <!-- Story Item Content -->
          <div>
            <!-- Khmer Title -->
            <h3 class="font-khmer-heading text-base sm:text-lg text-wedding-primary leading-relaxed">
              {{ item.title_km }}
            </h3>

            <!-- English Subtitle -->
            <div class="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-wedding-secondary mb-2 font-en-heading">
              {{ item.subtitle_en }}
            </div>

            <!-- Khmer Description -->
            <p class="font-khmer-body text-xs sm:text-sm text-wedding-text/90 leading-relaxed">
              {{ item.description_km }}
            </p>

            <!-- English Italic Description -->
            <p class="font-en-body text-[11px] sm:text-xs text-wedding-text/70 italic mt-1 font-light leading-relaxed">
              {{ item.description_en }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { StoryMilestone } from '~~/shared/types/wedding'

const props = defineProps<{
  story?: StoryMilestone[] | null
}>()

const DEFAULT_STORY_ITEMS: StoryMilestone[] = [
  {
    icon: '⚜️',
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
    icon: '✨',
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
</script>
