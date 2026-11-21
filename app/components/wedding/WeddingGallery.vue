<template>
  <section class="py-12 px-4 max-w-5xl mx-auto" v-if="photos.length">
    <div class="text-center mb-10">
      <div class="text-2xl text-wedding-secondary mb-1">🖼️</div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading">
        {{ t('common.gallery') }}
      </h2>
      <div class="w-24 h-0.5 bg-wedding-secondary mx-auto mt-2"></div>
    </div>

    <!-- 1. CAROUSEL / SLIDESHOW LAYOUT -->
    <div v-if="effectiveConfig.layout === 'carousel'" class="relative group/carousel">
      <!-- Carousel Track -->
      <div
        ref="carouselTrack"
        class="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-2"
        :class="gapClasses"
      >
        <div
          v-for="(photo, index) in displayedPhotos"
          :key="photo.id"
          @click="openLightbox(index)"
          class="snap-center flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-300 transform active:scale-95 group relative bg-black/5"
          :class="[carouselWidthClasses, cardStyleClasses, aspectClasses]"
        >
          <img
            :src="photo.url"
            :alt="photo.alt_text_en || 'Wedding photo'"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-wedding-primary/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl">
            🔍
          </div>
        </div>
      </div>

      <!-- Carousel Arrow Controls -->
      <button
        type="button"
        @click="scrollCarousel(-1)"
        class="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-wedding-primary border border-wedding-secondary/40 shadow-md items-center justify-center text-lg z-10 transition-all opacity-0 group-hover/carousel:opacity-100"
        aria-label="Scroll left"
      >
        ‹
      </button>
      <button
        type="button"
        @click="scrollCarousel(1)"
        class="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-wedding-primary border border-wedding-secondary/40 shadow-md items-center justify-center text-lg z-10 transition-all opacity-0 group-hover/carousel:opacity-100"
        aria-label="Scroll right"
      >
        ›
      </button>
      <div class="text-center mt-2 sm:hidden text-[11px] text-wedding-text/50 font-light">
        👉 Swipe to explore photos
      </div>
    </div>

    <!-- 2. FEATURED HERO + THUMBNAILS LAYOUT -->
    <div v-else-if="effectiveConfig.layout === 'featured'" class="space-y-3 sm:space-y-4">
      <!-- Big Hero Showcase Photo -->
      <div
        v-if="displayedPhotos[0]"
        @click="openLightbox(0)"
        class="w-full cursor-pointer overflow-hidden relative group bg-black/5"
        :class="[cardStyleClasses, 'aspect-[16/10] sm:aspect-[21/10]']"
      >
        <img
          :src="displayedPhotos[0].url"
          :alt="displayedPhotos[0].alt_text_en || 'Featured Wedding Photo'"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-wedding-secondary/40 text-[11px] font-semibold text-wedding-primary shadow-sm flex items-center gap-1.5">
          <span>✨</span>
          <span>{{ isKhmer ? 'រូបភាពអនុស្សាវរីយ៍' : 'Featured Moment' }}</span>
        </div>
        <div class="absolute inset-0 bg-wedding-primary/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xl">
          🔍
        </div>
      </div>

      <!-- Sub Thumbnails Grid -->
      <div v-if="displayedPhotos.length > 1" :class="gridClasses">
        <div
          v-for="(photo, index) in displayedPhotos.slice(1)"
          :key="photo.id"
          @click="openLightbox(index + 1)"
          class="cursor-pointer overflow-hidden relative group bg-black/5"
          :class="[cardStyleClasses, aspectClasses]"
        >
          <img
            :src="photo.url"
            :alt="photo.alt_text_en || 'Wedding photo'"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-wedding-primary/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl">
            🔍
          </div>
        </div>
      </div>
    </div>

    <!-- 3. MASONRY LAYOUT -->
    <div
      v-else-if="effectiveConfig.layout === 'masonry'"
      :class="masonryClasses"
    >
      <div
        v-for="(photo, index) in displayedPhotos"
        :key="photo.id"
        @click="openLightbox(index)"
        class="break-inside-avoid mb-3 sm:mb-4 cursor-pointer overflow-hidden relative group bg-black/5"
        :class="cardStyleClasses"
      >
        <img
          :src="photo.url"
          :alt="photo.alt_text_en || 'Wedding photo'"
          class="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-wedding-primary/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl">
          🔍
        </div>
      </div>
    </div>

    <!-- 4. CLASSIC GRID LAYOUT (Default) -->
    <div v-else :class="gridClasses">
      <div
        v-for="(photo, index) in displayedPhotos"
        :key="photo.id"
        @click="openLightbox(index)"
        class="cursor-pointer overflow-hidden relative group bg-black/5"
        :class="[cardStyleClasses, aspectClasses]"
      >
        <img
          :src="photo.url"
          :alt="photo.alt_text_en || 'Wedding photo'"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-wedding-primary/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl">
          🔍
        </div>
      </div>
    </div>

    <!-- Expand Button if max_display is limited -->
    <div v-if="hasMorePhotos && !isExpanded" class="text-center mt-6">
      <button
        type="button"
        @click="isExpanded = true"
        class="px-6 py-2.5 rounded-full bg-white/90 hover:bg-white border-2 border-wedding-secondary/50 text-wedding-primary text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all transform active:scale-95 inline-flex items-center gap-2"
      >
        <span>📷</span>
        <span>{{ isKhmer ? `មើលរូបថតទាំងអស់ (${photos.length})` : `View All Photos (${photos.length})` }}</span>
      </button>
    </div>

    <!-- Full-screen Mobile-Optimized Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="activePhotoIndex !== null"
        class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 select-none touch-none overscroll-contain"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @wheel.prevent.stop
        @touchmove.prevent
        @click.self="closeLightbox"
      >
        <!-- Top Control Bar (High Z-Index, Safe from Notch) -->
        <div class="w-full flex items-center justify-between z-20 pt-1 sm:pt-2">
          <!-- Counter Pill -->
          <div class="px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white/90 text-xs sm:text-sm font-mono tracking-wider shadow-sm">
            {{ activePhotoIndex + 1 }} / {{ photos.length }}
          </div>

          <!-- Close Button (Thumb-Friendly Circle) -->
          <button
            type="button"
            @click="closeLightbox"
            class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white/30 active:scale-90 backdrop-blur-md border border-white/25 text-white flex items-center justify-center transition-all duration-200 shadow-md cursor-pointer text-lg"
            aria-label="Close photo preview"
          >
            ✕
          </button>
        </div>

        <!-- Center Image Viewport -->
        <div
          class="flex-1 w-full flex items-center justify-center relative my-auto py-2"
          @click.self="closeLightbox"
        >
          <!-- Previous Button (Desktop & Tablet) -->
          <button
            v-if="photos.length > 1"
            type="button"
            @click.stop="prevPhoto"
            class="hidden sm:flex absolute left-2 lg:left-6 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/20 text-white items-center justify-center text-2xl transition-all duration-200 z-20 shadow-lg cursor-pointer"
            aria-label="Previous photo"
          >
            ‹
          </button>

          <!-- Current Image Container with Smooth Fade & Scale -->
          <div class="relative max-w-4xl max-h-[72vh] sm:max-h-[82vh] w-full flex items-center justify-center">
            <img
              :key="activePhotoIndex"
              :src="photos[activePhotoIndex].url"
              :alt="photos[activePhotoIndex].alt_text_en || 'Wedding photo preview'"
              class="max-w-full max-h-[72vh] sm:max-h-[82vh] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl transition-all duration-300 pointer-events-auto"
            />
          </div>

          <!-- Next Button (Desktop & Tablet) -->
          <button
            v-if="photos.length > 1"
            type="button"
            @click.stop="nextPhoto"
            class="hidden sm:flex absolute right-2 lg:right-6 w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/20 text-white items-center justify-center text-2xl transition-all duration-200 z-20 shadow-lg cursor-pointer"
            aria-label="Next photo"
          >
            ›
          </button>
        </div>

        <!-- Bottom Controls / Mobile Navigation Bar -->
        <div class="w-full flex flex-col items-center gap-3 z-20 pb-2 sm:pb-4">
          <!-- Mobile Thumb Navigation Buttons -->
          <div class="flex sm:hidden items-center justify-center gap-6 w-full px-6">
            <button
              v-if="photos.length > 1"
              type="button"
              @click.stop="prevPhoto"
              class="px-5 py-2 rounded-full bg-white/15 active:bg-white/30 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
            >
              <span class="text-base">‹</span> Prev
            </button>
            <span class="text-[11px] text-white/50 font-light">Swipe to browse</span>
            <button
              v-if="photos.length > 1"
              type="button"
              @click.stop="nextPhoto"
              class="px-5 py-2 rounded-full bg-white/15 active:bg-white/30 backdrop-blur-md border border-white/20 text-white text-xs font-semibold flex items-center gap-1 active:scale-95 transition-all"
            >
              Next <span class="text-base">›</span>
            </button>
          </div>

          <!-- Indicator Dots (Max 12 dots shown for clean look) -->
          <div v-if="photos.length <= 12" class="flex items-center gap-1.5 overflow-x-auto max-w-full px-4 py-1">
            <button
              v-for="(_, dotIdx) in photos"
              :key="dotIdx"
              type="button"
              @click.stop="activePhotoIndex = dotIdx"
              class="w-2 h-2 rounded-full transition-all duration-300"
              :class="activePhotoIndex === dotIdx ? 'w-5 bg-wedding-secondary ring-2 ring-white/50' : 'bg-white/30 hover:bg-white/50'"
              :aria-label="`Go to photo ${dotIdx + 1}`"
            ></button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import type { WeddingPhoto } from '~~/shared/types/programme'
import { DEFAULT_GALLERY_CONFIG, type GalleryConfig } from '~~/shared/types/wedding'

const props = defineProps<{
  photos: WeddingPhoto[]
  config?: Partial<GalleryConfig> | null
}>()

const { isKhmer, t } = useLocale()
const activePhotoIndex = ref<number | null>(null)
const isExpanded = ref(false)
const carouselTrack = ref<HTMLElement | null>(null)

const effectiveConfig = computed<GalleryConfig>(() => ({
  ...DEFAULT_GALLERY_CONFIG,
  ...(props.config || {})
}))

// Limit display when max_display is a number
const hasMorePhotos = computed(() => {
  const limit = effectiveConfig.value.max_display
  if (typeof limit === 'number') {
    return props.photos.length > limit
  }
  return false
})

const displayedPhotos = computed(() => {
  const limit = effectiveConfig.value.max_display
  if (!isExpanded.value && typeof limit === 'number') {
    return props.photos.slice(0, limit)
  }
  return props.photos
})

// Dynamic Aspect Ratio Classes
const aspectClasses = computed(() => {
  const ratio = effectiveConfig.value.aspect_ratio || 'square'
  if (ratio === 'portrait') return 'aspect-[3/4]'
  if (ratio === 'landscape') return 'aspect-[4/3]'
  if (ratio === 'natural') return ''
  return 'aspect-square'
})

// Dynamic Card Framing Classes
const cardStyleClasses = computed(() => {
  const style = effectiveConfig.value.card_style || 'gold-frame'
  if (style === 'rounded') return 'rounded-2xl sm:rounded-3xl border border-wedding-secondary/30 shadow-sm'
  if (style === 'glass') return 'rounded-2xl bg-white/80 backdrop-blur-md border border-white/50 shadow-md p-1'
  if (style === 'minimal') return 'rounded-lg overflow-hidden'
  // gold-frame (default luxury)
  return 'rounded-2xl border-2 border-wedding-secondary/40 shadow-sm hover:shadow-gold-glow/50 transition-shadow'
})

// Gap Classes
const gapClasses = computed(() => {
  const gap = effectiveConfig.value.gap || 'normal'
  if (gap === 'compact') return 'gap-2 sm:gap-2.5'
  if (gap === 'relaxed') return 'gap-4 sm:gap-5'
  return 'gap-2.5 sm:gap-3.5'
})

// Grid Columns Classes
const gridClasses = computed(() => {
  const mob = effectiveConfig.value.columns_mobile === 1 ? 'grid-cols-1' : 'grid-cols-2'
  const desk = effectiveConfig.value.columns_desktop === 2
    ? 'sm:grid-cols-2'
    : effectiveConfig.value.columns_desktop === 4
      ? 'sm:grid-cols-4'
      : 'sm:grid-cols-3'
  return `grid ${mob} ${desk} ${gapClasses.value}`
})

// Masonry Columns Classes
const masonryClasses = computed(() => {
  const mob = effectiveConfig.value.columns_mobile === 1 ? 'columns-1' : 'columns-2'
  const desk = effectiveConfig.value.columns_desktop === 4
    ? 'sm:columns-3 lg:columns-4'
    : effectiveConfig.value.columns_desktop === 2
      ? 'sm:columns-2'
      : 'sm:columns-3'
  return `${mob} ${desk} ${gapClasses.value}`
})

// Carousel Card Widths
const carouselWidthClasses = computed(() => {
  return 'w-[80%] sm:w-[46%] md:w-[32%]'
})

const scrollCarousel = (direction: number) => {
  const track = carouselTrack.value
  if (!track) return
  const cardWidth = track.clientWidth * 0.75
  track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' })
}

// Touch Gesture State for Mobile Swipe Navigation
let touchStartX = 0
let touchStartY = 0
let touchEndX = 0
let touchEndY = 0

const onTouchStart = (e: TouchEvent) => {
  if (!e.touches[0]) return
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
  touchEndX = touchStartX
  touchEndY = touchStartY
}

const onTouchMove = (e: TouchEvent) => {
  if (e.cancelable) {
    e.preventDefault()
  }
  if (!e.touches[0]) return
  touchEndX = e.touches[0].clientX
  touchEndY = e.touches[0].clientY
}

const onTouchEnd = () => {
  const dx = touchEndX - touchStartX
  const dy = touchEndY - touchStartY

  // Horizontal Swipe (threshold: 40px, predominantly horizontal)
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
    if (dx < 0) {
      nextPhoto() // Swiped Left -> Next
    } else {
      prevPhoto() // Swiped Right -> Prev
    }
    return
  }

  // Vertical Swipe Down to dismiss (threshold: 75px)
  if (dy > 75 && Math.abs(dy) > Math.abs(dx) * 1.5) {
    closeLightbox()
  }
}

const openLightbox = (idx: number) => {
  activePhotoIndex.value = idx
}

const closeLightbox = () => {
  activePhotoIndex.value = null
}

const prevPhoto = () => {
  if (activePhotoIndex.value === null) return
  activePhotoIndex.value = (activePhotoIndex.value - 1 + props.photos.length) % props.photos.length
}

const nextPhoto = () => {
  if (activePhotoIndex.value === null) return
  activePhotoIndex.value = (activePhotoIndex.value + 1) % props.photos.length
}

// Keyboard Navigation Listener
const handleKeydown = (e: KeyboardEvent) => {
  if (activePhotoIndex.value === null) return
  if (e.key === 'Escape') closeLightbox()
  else if (e.key === 'ArrowLeft') prevPhoto()
  else if (e.key === 'ArrowRight') nextPhoto()
}

// Body Scroll Lock & Lifecycle
let lockedScrollY = 0

const preventBackgroundTouch = (e: TouchEvent) => {
  if (activePhotoIndex.value !== null && e.cancelable) {
    e.preventDefault()
  }
}

watch(activePhotoIndex, (idx) => {
  if (!import.meta.client) return
  if (idx !== null) {
    lockedScrollY = window.scrollY || document.documentElement.scrollTop
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
    document.documentElement.style.touchAction = 'none'
    window.addEventListener('touchmove', preventBackgroundTouch, { passive: false })
  } else {
    window.removeEventListener('touchmove', preventBackgroundTouch)
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
    document.documentElement.style.touchAction = ''

    // Ensure scroll position remains rock-solid without smooth scroll animation from top
    const currentY = window.scrollY || document.documentElement.scrollTop
    if (Math.abs(currentY - lockedScrollY) > 1) {
      const origScrollBehavior = document.documentElement.style.scrollBehavior
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'instant' as ScrollBehavior })
      requestAnimationFrame(() => {
        document.documentElement.style.scrollBehavior = origScrollBehavior
      })
    }
  }
})

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('touchmove', preventBackgroundTouch)
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
    document.documentElement.style.touchAction = ''
  }
})
</script>