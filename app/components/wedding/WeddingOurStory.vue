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
        <span class="text-lg">🪷</span>
        <span class="w-12 h-px bg-wedding-secondary/40"></span>
      </div>
    </div>

    <!-- Story Card Frame with Double Gold Border -->
    <div class="rounded-3xl p-1.5 sm:p-2 bg-gradient-to-b from-[#FAF4EB] via-[#FFFDF9] to-[#F5ECE0] border border-wedding-secondary/35 shadow-gold-glow relative">
      <div class="rounded-[22px] p-6 sm:p-8 bg-[#FFFDF9]/95 border border-wedding-secondary/40 relative overflow-hidden backdrop-blur-sm">
        <!-- Traditional Corner Khmer Kbach Accents -->
        <div class="absolute top-2.5 left-2.5 text-wedding-secondary/80 select-none pointer-events-none transform -rotate-45 drop-shadow-[0_1px_2px_rgba(201,162,74,0.3)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 10 6 8.5 7.5C7 9 5.5 10 5 12C4.5 14 5.5 16 7 16.5C8.5 17 10 16 11 15C10.8 17 10.5 19 9 20.5H15C13.5 19 13.2 17 13 15C14 16 15.5 17 17 16.5C18.5 16 19.5 14 19 12C18.5 10 17 9 15.5 7.5C14 6 12.5 4 12 2Z"/>
            <path d="M7 17C6 17 4 18 4 19C4 20 6 21 8 21C9 21 10 20.5 10.5 20C9.5 19.5 8 18.5 7 17Z"/>
            <path d="M17 17C18 17 20 18 20 19C20 20 18 21 16 21C15 21 14 20.5 13.5 20C14.5 19.5 16 18.5 17 17Z"/>
          </svg>
        </div>
        <div class="absolute top-2.5 right-2.5 text-wedding-secondary/80 select-none pointer-events-none transform rotate-45 drop-shadow-[0_1px_2px_rgba(201,162,74,0.3)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 10 6 8.5 7.5C7 9 5.5 10 5 12C4.5 14 5.5 16 7 16.5C8.5 17 10 16 11 15C10.8 17 10.5 19 9 20.5H15C13.5 19 13.2 17 13 15C14 16 15.5 17 17 16.5C18.5 16 19.5 14 19 12C18.5 10 17 9 15.5 7.5C14 6 12.5 4 12 2Z"/>
            <path d="M7 17C6 17 4 18 4 19C4 20 6 21 8 21C9 21 10 20.5 10.5 20C9.5 19.5 8 18.5 7 17Z"/>
            <path d="M17 17C18 17 20 18 20 19C20 20 18 21 16 21C15 21 14 20.5 13.5 20C14.5 19.5 16 18.5 17 17Z"/>
          </svg>
        </div>
        <div class="absolute bottom-2.5 left-2.5 text-wedding-secondary/80 select-none pointer-events-none transform -rotate-135 drop-shadow-[0_1px_2px_rgba(201,162,74,0.3)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 10 6 8.5 7.5C7 9 5.5 10 5 12C4.5 14 5.5 16 7 16.5C8.5 17 10 16 11 15C10.8 17 10.5 19 9 20.5H15C13.5 19 13.2 17 13 15C14 16 15.5 17 17 16.5C18.5 16 19.5 14 19 12C18.5 10 17 9 15.5 7.5C14 6 12.5 4 12 2Z"/>
            <path d="M7 17C6 17 4 18 4 19C4 20 6 21 8 21C9 21 10 20.5 10.5 20C9.5 19.5 8 18.5 7 17Z"/>
            <path d="M17 17C18 17 20 18 20 19C20 20 18 21 16 21C15 21 14 20.5 13.5 20C14.5 19.5 16 18.5 17 17Z"/>
          </svg>
        </div>
        <div class="absolute bottom-2.5 right-2.5 text-wedding-secondary/80 select-none pointer-events-none transform rotate-135 drop-shadow-[0_1px_2px_rgba(201,162,74,0.3)]">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C11.5 4 10 6 8.5 7.5C7 9 5.5 10 5 12C4.5 14 5.5 16 7 16.5C8.5 17 10 16 11 15C10.8 17 10.5 19 9 20.5H15C13.5 19 13.2 17 13 15C14 16 15.5 17 17 16.5C18.5 16 19.5 14 19 12C18.5 10 17 9 15.5 7.5C14 6 12.5 4 12 2Z"/>
            <path d="M7 17C6 17 4 18 4 19C4 20 6 21 8 21C9 21 10 20.5 10.5 20C9.5 19.5 8 18.5 7 17Z"/>
            <path d="M17 17C18 17 20 18 20 19C20 20 18 21 16 21C15 21 14 20.5 13.5 20C14.5 19.5 16 18.5 17 17Z"/>
          </svg>
        </div>

        <!-- Vertical Timeline Track with Clean Item-to-Item Connection -->
        <div class="relative ml-5 sm:ml-6 space-y-8 sm:space-y-9 pl-6 sm:pl-7 py-2">
          <div
            v-for="(item, index) in activeStoryItems"
            :key="index"
            class="relative group"
          >
            <!-- Vertical Line Segment that connects ONLY to next milestone (No dangling tail after last item) -->
            <div
              v-if="index < activeStoryItems.length - 1"
              class="absolute -left-[26px] sm:-left-[28px] top-10 bottom-[-36px] w-[2px] bg-gradient-to-b from-wedding-secondary/70 via-wedding-secondary/50 to-wedding-secondary/40"
            ></div>

            <!-- Circular Milestone Badge (Luminous ivory without dark fill, with radiant gold halo on wedding day) -->
            <div
              class="absolute -left-[46px] sm:-left-[49px] top-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-105"
              :class="index === activeStoryItems.length - 1
                ? 'bg-gradient-to-br from-white via-[#FFFDF5] to-[#FDF4DC] border-wedding-secondary ring-4 ring-wedding-secondary/25 shadow-gold-glow'
                : 'bg-white/95 border-wedding-secondary/70 shadow-sm'"
            >
              <span class="text-base sm:text-lg select-none leading-none flex items-center justify-center">
                {{ item.icon || '⚜️' }}
              </span>
            </div>

            <!-- Story Item Content -->
            <div class="pt-0.5 transition-transform duration-300 group-hover:translate-x-0.5">
              <!-- Khmer Title -->
              <h3 class="font-khmer-heading text-base sm:text-lg text-wedding-primary" style="line-height: 1.85 !important;">
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
import type { StoryMilestone } from '~~/shared/types/wedding'

const props = defineProps<{
  story?: StoryMilestone[] | null
}>()

const { isKhmer } = useLocale()

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
</script>
