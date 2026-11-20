<template>
  <div
    class="relative bg-[#2A1017] flex justify-center selection:bg-wedding-primary selection:text-wedding-bg font-khmer-body"
    :class="hasOpened ? 'min-h-screen overflow-x-hidden' : 'h-screen max-h-screen overflow-hidden'"
  >
    <!-- 1. Dedicated Dynamic Background Layer with Parallax Zoom In / Zoom Out on Scroll -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Scalable Background Artwork (Angkor Wat / Royal Kbach / Custom) -->
      <div
        v-if="bgImageUrl"
        class="w-full h-full bg-cover bg-center will-change-transform"
        :style="dynamicBackgroundStyle"
      ></div>
      <!-- Ambient Gradient / Tint Overlay -->
      <div
        class="absolute inset-0 transition-opacity duration-500"
        :style="backgroundOverlayStyle"
      ></div>
    </div>

    <!-- 2. Falling Golden Lotus Petals / Dust reacting to scroll velocity -->
    <WeddingCanvasBackground :config="appearanceConfig?.animation_config" :scroll-velocity="scrollVelocity" />

    <!-- Error State: Invitation Not Found or Revoked -->
    <div
      v-if="errorState"
      class="min-h-screen flex items-center justify-center p-6 text-center relative z-10 w-full"
    >
      <div class="max-w-md w-full khmer-card p-8 rounded-3xl border-2 border-wedding-secondary shadow-gold-glow">
        <div class="text-4xl mb-3">⚠️</div>
        <h1 class="text-xl font-bold text-wedding-primary font-khmer-heading mb-2">
          {{ errorState === 410 ? t('invitation.revoked_title') : t('invitation.not_found_title') }}
        </h1>
        <p class="text-sm text-wedding-text/80 font-khmer-body">
          {{ errorState === 410 ? t('invitation.revoked_desc') : t('invitation.not_found_desc') }}
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-else-if="loading"
      class="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10 w-full"
    >
      <div class="text-4xl mb-4 animate-bounce">💌</div>
      <div class="font-khmer-heading text-lg text-wedding-primary animate-pulse">
        {{ t('common.loading') }}
      </div>
    </div>

    <!-- Active Valid Invitation (Focused on Tablet & Mobile) -->
    <div
      v-else
      class="relative z-10 w-full flex justify-center"
      :class="hasOpened ? '' : 'h-screen max-h-screen overflow-hidden'"
    >
      <!-- Centered Mobile & Tablet Frame -->
      <div
        class="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] bg-wedding-bg/95 relative sm:shadow-2xl sm:border-x sm:border-wedding-secondary/30 transition-all duration-300"
        :class="hasOpened ? 'min-h-screen overflow-x-hidden' : 'h-screen max-h-screen overflow-hidden flex items-center justify-center'"
      >
        <!-- 1. Khmer Royal Seal Opening Envelope -->
        <WeddingOpeningAnimation
          :guest-name="invitation?.guest_name || ''"
          :wedding="wedding"
          :absolute="true"
          @opening="onEnvelopeOpening"
          @opened="onEnvelopeOpened"
        />

        <!-- 2. Main Invitation Content (Unveiled after seal clicked) with Lively Scroll Reveal -->
        <main
          v-if="isOpening || hasOpened"
          class="transition-opacity duration-1000 pb-20 relative"
          :class="{ 'opacity-100': hasOpened, 'opacity-0 pointer-events-none': !hasOpened }"
        >
          <!-- Hero Section -->
          <div class="scroll-reveal revealed">
            <WeddingHero :wedding="wedding" />
          </div>

          <!-- Couple Introduction -->
          <div class="scroll-reveal">
            <WeddingCouple :wedding="wedding" />
          </div>

          <!-- Our Story Timeline -->
          <div class="scroll-reveal">
            <WeddingOurStory :story="wedding?.our_story" />
          </div>

          <!-- Warm Invitation Letter -->
          <div class="scroll-reveal">
            <WeddingMessage :wedding="wedding" />
          </div>

          <!-- Ceremony Programme Timeline -->
          <div class="scroll-reveal">
            <WeddingProgramme :programmes="programmes" />
          </div>

          <!-- Venue Location & Map -->
          <div class="scroll-reveal">
            <WeddingLocation :wedding="wedding" />
          </div>

          <!-- Photo Gallery -->
          <div class="scroll-reveal">
            <WeddingGallery :photos="photos" />
          </div>

          <!-- Digital Wedding Gift / KHQR -->
          <div class="scroll-reveal">
            <WeddingGift :gift-info="wedding?.gift_info" />
          </div>

          <!-- RSVP Attendance Form -->
          <div class="scroll-reveal">
            <WeddingRSVP
              :token="token"
              :guest-name="invitation?.guest_name || ''"
              :initial-status="invitation?.rsvp?.status"
              @updated="onRSVPUpdated"
            />
          </div>

          <!-- Footer -->
          <footer class="mt-16 text-center text-xs text-wedding-text/60 font-en-heading pb-8 px-4">
            <p class="mb-1">With Love & Gratitude</p>
            <p class="font-bold text-wedding-primary">
              {{ wedding?.groom_name_en }} & {{ wedding?.bride_name_en }}
            </p>
          </footer>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WeddingCanvasBackground from '~~/app/components/wedding/WeddingCanvasBackground.vue'
import WeddingOpeningAnimation from '~~/app/components/wedding/WeddingOpeningAnimation.vue'
import WeddingHero from '~~/app/components/wedding/WeddingHero.vue'
import WeddingCouple from '~~/app/components/wedding/WeddingCouple.vue'
import WeddingOurStory from '~~/app/components/wedding/WeddingOurStory.vue'
import WeddingMessage from '~~/app/components/wedding/WeddingMessage.vue'
import WeddingProgramme from '~~/app/components/wedding/WeddingProgramme.vue'
import WeddingLocation from '~~/app/components/wedding/WeddingLocation.vue'
import WeddingGallery from '~~/app/components/wedding/WeddingGallery.vue'
import WeddingGift from '~~/app/components/wedding/WeddingGift.vue'
import WeddingRSVP from '~~/app/components/wedding/WeddingRSVP.vue'

import { PRESET_BACKGROUNDS } from '~~/shared/types/appearance'
import type { WeddingSettings } from '~~/shared/types/wedding'
import type { WeddingProgramme as ProgrammeType, WeddingPhoto } from '~~/shared/types/programme'
import type { PublicInvitationData } from '~~/shared/types/invitation'
import type { WeddingAppearance } from '~~/shared/types/appearance'

const route = useRoute()
const { t } = useLocale()
const { applyThemeColors } = useWeddingAppearance()

const token = computed(() => (route.params.uuid as string) || '')
const loading = ref(true)
const errorState = ref<number | null>(null)
const isOpening = ref(false)
const hasOpened = ref(false)

// Lock html & body scrolling strictly while the envelope is unopened
useHead({
  bodyAttrs: {
    class: computed(() => (!hasOpened.value ? 'overflow-hidden h-screen touch-none select-none' : ''))
  },
  htmlAttrs: {
    class: computed(() => (!hasOpened.value ? 'overflow-hidden h-screen' : ''))
  }
})

// Direct DOM style lock for foolproof cross-browser scroll prevention (iOS Safari / Mobile Chrome)
watch(
  hasOpened,
  (opened) => {
    if (!import.meta.client) return
    if (opened) {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.height = ''
      document.documentElement.style.height = ''
      document.body.style.touchAction = ''
    } else {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.body.style.height = '100%'
      document.documentElement.style.height = '100%'
      document.body.style.touchAction = 'none'
    }
  },
  { immediate: true }
)

const invitation = ref<PublicInvitationData | null>(null)
const wedding = ref<WeddingSettings | null>(null)
const programmes = ref<ProgrammeType[]>([])
const photos = ref<WeddingPhoto[]>([])
const appearanceConfig = ref<WeddingAppearance | null>(null)

// Scroll tracking for Zoom in / Zoom out & lively motion
const scrollProgress = ref(0)
const scrollVelocity = ref(0)
let lastScrollY = 0
let lastScrollTime = 0
let scrollRafId: number | null = null
let observer: IntersectionObserver | null = null

const handleScroll = () => {
  if (!import.meta.client) return
  if (scrollRafId) return

  scrollRafId = window.requestAnimationFrame(() => {
    const y = window.scrollY || document.documentElement.scrollTop
    const max = Math.max((document.documentElement.scrollHeight - window.innerHeight), 1)
    scrollProgress.value = Math.min(Math.max(y / max, 0), 1)

    const now = performance.now()
    const dt = Math.max(now - lastScrollTime, 16)
    const dy = Math.abs(y - lastScrollY)
    scrollVelocity.value = Math.min(dy / dt, 5)

    lastScrollY = y
    lastScrollTime = now
    scrollRafId = null
  })
}

const setupScrollReveal = () => {
  if (!import.meta.client || typeof IntersectionObserver === 'undefined') return

  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    }
  )

  nextTick(() => {
    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer?.observe(el)
    })
  })
}

const onEnvelopeOpening = () => {
  isOpening.value = true
}

const onEnvelopeOpened = () => {
  hasOpened.value = true
  nextTick(() => {
    setupScrollReveal()
  })
}

const bgImageUrl = computed(() => {
  const bg = appearanceConfig.value?.background_config
  if (!bg) return '/images/backgrounds/angkor-wat.svg'
  if (bg.type === 'image' && bg.image_url) return bg.image_url
  if (bg.preset_name && PRESET_BACKGROUNDS[bg.preset_name]?.image_url) {
    return PRESET_BACKGROUNDS[bg.preset_name].image_url
  }
  if (bg.type === 'none') return ''
  return '/images/backgrounds/angkor-wat.svg'
})

const dynamicBackgroundStyle = computed(() => {
  if (!bgImageUrl.value) return {}
  const bg = appearanceConfig.value?.background_config
  const opacity = bg?.opacity ?? 0.8
  const scrollZoom = bg?.scroll_zoom !== false
  const effect = bg?.zoom_effect || 'zoom-in'

  let scale = 1.04
  if (scrollZoom) {
    if (effect === 'zoom-in') {
      // Smoothly zoom in from 1.04 to 1.25 as you scroll down
      scale = 1.04 + scrollProgress.value * 0.22
    } else if (effect === 'zoom-out') {
      // Starts at 1.22 and smoothly zooms out to 1.04
      scale = 1.22 - scrollProgress.value * 0.18
    } else if (effect === 'breathe') {
      // Ambient breathing wave with scroll momentum
      scale = 1.06 + Math.sin(scrollProgress.value * Math.PI) * 0.12
    }
  }

  return {
    backgroundImage: `url(${bgImageUrl.value})`,
    opacity,
    transform: `scale(${scale.toFixed(3)})`,
    transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
})

const backgroundOverlayStyle = computed(() => {
  const bg = appearanceConfig.value?.background_config
  const color = bg?.overlay_color || '#2A1017'
  const opacity = bg?.overlay_opacity ?? 0.25
  return {
    backgroundColor: color,
    opacity
  }
})

const loadInvitationData = async () => {
  loading.value = true
  errorState.value = null

  try {
    const [invRes, wedRes, progRes, galRes, appRes] = await Promise.all([
      $fetch<any>(`/api/invitations/${token.value}`).catch((e) => {
        errorState.value = e.statusCode || 404
        return null
      }),
      $fetch<any>('/api/wedding').catch(() => null),
      $fetch<any>('/api/programmes').catch(() => null),
      $fetch<any>('/api/gallery').catch(() => null),
      $fetch<any>('/api/appearance').catch(() => null)
    ])

    if (invRes?.data) invitation.value = invRes.data
    if (wedRes?.data) wedding.value = wedRes.data
    if (progRes?.data) programmes.value = progRes.data
    if (galRes?.data) photos.value = galRes.data
    if (appRes?.data) {
      appearanceConfig.value = appRes.data
      if (appRes.data.theme_config) {
        applyThemeColors(appRes.data.theme_config)
      }
    }
  } catch (err: any) {
    console.error('Failed to load invitation:', err)
    errorState.value = 500
  } finally {
    loading.value = false
    nextTick(() => {
      setupScrollReveal()
    })
  }
}

const onRSVPUpdated = (status: 'attending' | 'not_attending') => {
  if (invitation.value) {
    invitation.value.rsvp = {
      status,
      submitted_at: new Date().toISOString()
    }
  }
}

onMounted(() => {
  loadInvitationData()
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    document.body.style.height = ''
    document.documentElement.style.height = ''
    document.body.style.touchAction = ''
    window.removeEventListener('scroll', handleScroll)
    if (observer) observer.disconnect()
    if (scrollRafId) cancelAnimationFrame(scrollRafId)
  }
})
</script>
