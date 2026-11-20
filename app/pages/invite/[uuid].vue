<template>
  <div
    class="relative bg-[#FFF7F9] flex justify-center selection:bg-pink-200 selection:text-[#881337] font-khmer-body overflow-x-hidden"
    :class="hasOpened ? 'min-h-screen' : 'h-screen max-h-screen overflow-hidden'"
  >
    <!-- 1. Ambient Panoramic Scenic Desktop Backdrop (Romantic White & Blush Pink overlay screen, hidden on mobile) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden sm:block">
      <!-- Panoramic Background Artwork with soft dreamy focus -->
      <div
        v-if="bgImageUrl"
        class="w-full h-full bg-cover bg-center will-change-transform scale-105 transition-all duration-1000 opacity-35"
        :style="{
          backgroundImage: `url(${bgImageUrl})`,
          filter: 'blur(3px) saturate(1.15) brightness(1.04)'
        }"
      ></div>

      <!-- Side Overlay Screen: Soft white & pastel pink romantic gradient screen -->
      <div
        class="absolute inset-0"
        style="background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 245, 248, 0.85) 55%, rgba(254, 226, 236, 0.95) 100%);"
      ></div>

      <!-- Gentle Frosted Glass Overlay Screen with subtle pink veil -->
      <div class="absolute inset-0 bg-gradient-to-b from-white/80 via-pink-50/60 to-rose-100/80 backdrop-blur-[1.5px]"></div>

      <!-- Ambient White & Blossom Pink Petals / Starlight Drift Across Desktop -->
      <WeddingCanvasBackground
        palette="pink_white"
        :config="{
          ...appearanceConfig?.animation_config,
          preset: 'lotus_petals',
          particle_quantity: 26,
          opacity: 0.75,
          speed: 0.6
        }"
        :scroll-velocity="smoothScrollVelocity"
      />
    </div>

    <!-- 2. Desktop Decorative Side Wings (Left & Right of Mobile Screen, hidden on screens < 1200px) -->
    <div class="fixed inset-0 pointer-events-none z-10 hidden xl:flex justify-between items-center px-6 2xl:px-14 max-w-[1700px] mx-auto">
      <!-- Left Wing: Royal Monogram & Couple Blessing (White & Rose-Gold Glassmorphism) -->
      <div class="w-64 2xl:w-72 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/80 shadow-[0_15px_35px_rgba(244,114,182,0.18)] text-center text-[#881337] transform -translate-y-4 pointer-events-auto transition-all duration-300">
        <div class="text-3xl text-pink-500 mb-2 select-none animate-pulse">🌸</div>
        <div class="text-[10px] uppercase tracking-widest text-pink-600 font-semibold mb-1">
          WEDDING CELEBRATION
        </div>
        <div class="font-khmer-heading text-base text-[#9F1239] mb-2" style="line-height: 2 !important;">
          សិរីមង្គលអាពាហ៍ពិពាហ៍
        </div>
        <div class="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-pink-300/80 to-transparent my-2.5"></div>
        <div class="font-khmer-heading text-lg text-[#881337] font-bold mb-0.5">
          {{ wedding?.groom_name_km || 'វ៉េត សីហា' }}
        </div>
        <div class="text-xs text-pink-500 font-serif italic mb-0.5">&amp;</div>
        <div class="font-khmer-heading text-lg text-[#881337] font-bold mb-2">
          {{ wedding?.bride_name_km || 'ស ណារី' }}
        </div>
        <div class="text-[11px] text-pink-700/80 font-en-heading">
          {{ wedding?.groom_name_en || 'Vet Seyha' }} &amp; {{ wedding?.bride_name_en || 'Sar Nary' }}
        </div>
      </div>

      <!-- Right Wing: Celebration Countdown & Venue Info (White & Rose-Gold Glassmorphism) -->
      <div class="w-64 2xl:w-72 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-pink-200/80 shadow-[0_15px_35px_rgba(244,114,182,0.18)] text-center text-[#881337] transform -translate-y-4 pointer-events-auto transition-all duration-300">
        <div class="text-2xl text-pink-500 mb-2 select-none">⏳</div>
        <div class="text-[10px] uppercase tracking-widest text-pink-600 font-semibold mb-2">
          COUNTDOWN TO CELEBRATION
        </div>

        <!-- 4-Box Digital Countdown -->
        <div class="grid grid-cols-4 gap-1.5 my-2.5">
          <div class="bg-pink-50/80 rounded-xl p-1.5 border border-pink-200/70 shadow-sm">
            <div class="text-base font-bold text-[#881337] font-mono">{{ countdown.days }}</div>
            <div class="text-[8px] text-pink-600/80 uppercase font-semibold">Days</div>
          </div>
          <div class="bg-pink-50/80 rounded-xl p-1.5 border border-pink-200/70 shadow-sm">
            <div class="text-base font-bold text-[#881337] font-mono">{{ countdown.hours }}</div>
            <div class="text-[8px] text-pink-600/80 uppercase font-semibold">Hours</div>
          </div>
          <div class="bg-pink-50/80 rounded-xl p-1.5 border border-pink-200/70 shadow-sm">
            <div class="text-base font-bold text-[#881337] font-mono">{{ countdown.minutes }}</div>
            <div class="text-[8px] text-pink-600/80 uppercase font-semibold">Mins</div>
          </div>
          <div class="bg-pink-50/80 rounded-xl p-1.5 border border-pink-200/70 shadow-sm">
            <div class="text-base font-bold text-[#881337] font-mono">{{ countdown.seconds }}</div>
            <div class="text-[8px] text-pink-600/80 uppercase font-semibold">Secs</div>
          </div>
        </div>

        <div class="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-pink-300/80 to-transparent my-2.5"></div>
        <div class="text-[11px] font-bold text-[#881337] font-khmer-body mb-0.5 truncate">
          {{ wedding?.venue_name_km || 'The Premier Centre Sen Sok' }}
        </div>
        <div class="text-[10px] text-pink-700/80 font-khmer-body">
          {{ wedding?.venue_address_km || 'រាជធានីភ្នំពេញ' }}
        </div>
      </div>
    </div>

    <!-- 3. Crisp Mobile Screen Background & Particles (Strictly Scoped to Mobile Screen Width) -->
    <div class="fixed inset-0 pointer-events-none z-0 flex justify-center overflow-hidden">
      <div class="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] h-full relative overflow-hidden">
        <!-- Scalable Crisp Background Artwork (Angkor Wat / Royal Kbach / Custom) -->
        <div
          v-if="bgImageUrl"
          class="w-full h-full bg-cover bg-center will-change-transform"
          :style="dynamicBackgroundStyle"
        ></div>
        <!-- Ambient Warm Tint Overlay -->
        <div
          class="absolute inset-0 transition-opacity duration-500"
          :style="backgroundOverlayStyle"
        ></div>
        <!-- Falling White & Pink Lotus Petals Scoped to Mobile Screen Only -->
        <WeddingCanvasBackground
          :absolute="true"
          palette="pink_white"
          :config="appearanceConfig?.animation_config"
          :scroll-velocity="smoothScrollVelocity"
        />
      </div>
    </div>

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

    <!-- Active Valid Invitation (Focused on Mobile Screen Only) -->
    <div
      v-else
      class="relative z-10 w-full flex justify-center"
      :class="hasOpened ? '' : 'h-screen max-h-screen overflow-hidden'"
    >
      <!-- Centered Mobile Screen Frame with Soft Rose Border & Ambient Shadow -->
      <div
        class="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] bg-wedding-bg/95 relative sm:shadow-[0_20px_60px_rgba(244,114,182,0.22),0_0_35px_rgba(255,255,255,0.7),0_10px_25px_rgba(0,0,0,0.08)] sm:border-x sm:border-pink-200/60 transition-all duration-300"
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

// Desktop Live Countdown Timer
const now = ref(Date.now())
let countdownInterval: any = null

const countdown = computed(() => {
  const targetDate = wedding.value?.wedding_date || '2027-01-16T04:26:00.000Z'
  const diff = Math.max(0, new Date(targetDate).getTime() - now.value)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
})

// Damped scroll tracking for silky smooth zoom and particle dynamics (no abrupt/fast changes)
const targetScrollProgress = ref(0)
const smoothScrollProgress = ref(0)
const targetScrollVelocity = ref(0)
const smoothScrollVelocity = ref(0)
let lastScrollY = 0
let lastScrollTime = 0
let dampingRafId: number | null = null
let observer: IntersectionObserver | null = null

const updateSmoothScroll = () => {
  // Damped linear interpolation (lerp factor 0.04 = super smooth & silky glide)
  const dProgress = targetScrollProgress.value - smoothScrollProgress.value
  smoothScrollProgress.value += dProgress * 0.04

  // Smoothly damp velocity so it accelerates gently and coasts to a stop smoothly
  const dVel = targetScrollVelocity.value - smoothScrollVelocity.value
  smoothScrollVelocity.value += dVel * 0.06
  targetScrollVelocity.value *= 0.92 // gradual momentum decay

  dampingRafId = requestAnimationFrame(updateSmoothScroll)
}

const handleScroll = () => {
  if (!import.meta.client) return

  const y = window.scrollY || document.documentElement.scrollTop
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
  targetScrollProgress.value = Math.min(Math.max(y / max, 0), 1)

  const nowTime = performance.now()
  const dt = Math.max(nowTime - lastScrollTime, 16)
  const dy = Math.abs(y - lastScrollY)
  targetScrollVelocity.value = Math.min(dy / dt, 2.0)

  lastScrollY = y
  lastScrollTime = nowTime
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
  if (!bg) return '/images/backgrounds/angkor-wat.png'
  if (bg.type === 'none') return ''
  if (bg.type === 'image' && bg.image_url) return bg.image_url
  if (bg.preset_name && PRESET_BACKGROUNDS[bg.preset_name]?.image_url) {
    return PRESET_BACKGROUNDS[bg.preset_name].image_url
  }
  if (bg.type === 'preset') {
    return PRESET_BACKGROUNDS['angkor-wat']?.image_url || '/images/backgrounds/angkor-wat.png'
  }
  return '/images/backgrounds/angkor-wat.png'
})

const dynamicBackgroundStyle = computed(() => {
  if (!bgImageUrl.value) return {}
  const bg = appearanceConfig.value?.background_config
  const opacity = bg?.opacity ?? 1
  const scrollZoom = bg?.scroll_zoom !== false
  const effect = bg?.zoom_effect || 'zoom-in'

  let scale = 1.02
  if (scrollZoom) {
    if (effect === 'zoom-in') {
      // Gentle, silky smooth zoom from 1.02 to 1.07 (no abrupt/fast changes)
      scale = 1.02 + smoothScrollProgress.value * 0.05
    } else if (effect === 'zoom-out') {
      scale = 1.07 - smoothScrollProgress.value * 0.05
    } else if (effect === 'breathe') {
      scale = 1.02 + Math.sin(smoothScrollProgress.value * Math.PI) * 0.03
    }
  }

  return {
    backgroundImage: `url(${bgImageUrl.value})`,
    opacity,
    transform: `scale(${scale.toFixed(4)})`
  }
})

const backgroundOverlayStyle = computed(() => {
  const bg = appearanceConfig.value?.background_config
  const color = bg?.overlay_color || '#FDF8EE'
  const opacity = bg?.overlay_opacity ?? 0
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
    dampingRafId = requestAnimationFrame(updateSmoothScroll)
    countdownInterval = setInterval(() => {
      now.value = Date.now()
    }, 1000)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    if (countdownInterval) clearInterval(countdownInterval)
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
    document.body.style.height = ''
    document.documentElement.style.height = ''
    document.body.style.touchAction = ''
    window.removeEventListener('scroll', handleScroll)
    if (observer) observer.disconnect()
    if (dampingRafId) cancelAnimationFrame(dampingRafId)
  }
})
</script>
