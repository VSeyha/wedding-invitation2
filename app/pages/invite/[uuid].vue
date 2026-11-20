<template>
  <div
    class="relative bg-[#14080D] flex justify-center selection:bg-wedding-primary selection:text-wedding-bg font-khmer-body overflow-x-hidden"
    :class="hasOpened ? 'min-h-screen' : 'h-screen max-h-screen overflow-hidden'"
  >
    <!-- 1. Ambient Panoramic Scenic Desktop Backdrop (Cinematic soft-focus scenery with golden dust, hidden on mobile) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden hidden sm:block">
      <!-- Panoramic Artwork with soft cinematic focus and warm color saturation -->
      <div
        v-if="bgImageUrl"
        class="w-full h-full bg-cover bg-center will-change-transform scale-105 transition-all duration-1000 opacity-65"
        :style="{
          backgroundImage: `url(${bgImageUrl})`,
          filter: 'blur(3px) brightness(0.72) saturate(1.25)'
        }"
      ></div>
      <!-- Soft Radial Vignette: softly draws focus directly into the mobile invitation -->
      <div
        class="absolute inset-0"
        style="background: radial-gradient(circle at 50% 45%, rgba(20, 8, 13, 0.25) 0%, rgba(15, 5, 10, 0.65) 65%, rgba(10, 3, 7, 0.92) 100%);"
      ></div>
      <!-- Ambient Golden Dust & Starlight Drift Across Desktop -->
      <WeddingCanvasBackground
        :config="{
          ...appearanceConfig?.animation_config,
          preset: 'particles',
          particle_quantity: 24,
          opacity: 0.35,
          speed: 0.8
        }"
      />
    </div>

    <!-- 2. Desktop Decorative Side Wings (Left & Right of Mobile Screen, hidden on screens < 1200px) -->
    <div class="fixed inset-0 pointer-events-none z-10 hidden xl:flex justify-between items-center px-6 2xl:px-14 max-w-[1700px] mx-auto">
      <!-- Left Wing: Royal Monogram & Couple Blessing -->
      <div class="w-64 2xl:w-72 p-6 rounded-3xl bg-[#2A1017]/75 backdrop-blur-md border border-[#C9A24A]/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)] text-center text-[#F7F0E3] transform -translate-y-4 pointer-events-auto">
        <div class="text-3xl text-wedding-secondary mb-2 select-none animate-pulse">⚜️</div>
        <div class="text-[10px] uppercase tracking-widest text-wedding-secondary/90 font-semibold mb-1">
          WEDDING CELEBRATION
        </div>
        <div class="font-khmer-heading text-base text-wedding-accent mb-2" style="line-height: 2 !important;">
          សិរីមង្គលអាពាហ៍ពិពាហ៍
        </div>
        <div class="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-[#C9A24A]/60 to-transparent my-2.5"></div>
        <div class="font-khmer-heading text-lg text-white mb-0.5">
          {{ wedding?.groom_name_km || 'វ៉េត សីហា' }}
        </div>
        <div class="text-xs text-wedding-secondary font-serif italic mb-0.5">&amp;</div>
        <div class="font-khmer-heading text-lg text-white mb-2">
          {{ wedding?.bride_name_km || 'ស ណារី' }}
        </div>
        <div class="text-[11px] text-[#F7F0E3]/70 font-en-heading">
          {{ wedding?.groom_name_en || 'Vet Seyha' }} &amp; {{ wedding?.bride_name_en || 'Sar Nary' }}
        </div>
      </div>

      <!-- Right Wing: Celebration Countdown & Venue Info -->
      <div class="w-64 2xl:w-72 p-6 rounded-3xl bg-[#2A1017]/75 backdrop-blur-md border border-[#C9A24A]/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)] text-center text-[#F7F0E3] transform -translate-y-4 pointer-events-auto">
        <div class="text-2xl text-wedding-secondary mb-2 select-none">⏳</div>
        <div class="text-[10px] uppercase tracking-widest text-wedding-secondary/90 font-semibold mb-2">
          COUNTDOWN TO CELEBRATION
        </div>

        <!-- 4-Box Digital Countdown -->
        <div class="grid grid-cols-4 gap-1.5 my-2.5">
          <div class="bg-black/35 rounded-xl p-1.5 border border-[#C9A24A]/25">
            <div class="text-base font-bold text-wedding-accent font-mono">{{ countdown.days }}</div>
            <div class="text-[8px] text-[#F7F0E3]/70">Days</div>
          </div>
          <div class="bg-black/35 rounded-xl p-1.5 border border-[#C9A24A]/25">
            <div class="text-base font-bold text-wedding-accent font-mono">{{ countdown.hours }}</div>
            <div class="text-[8px] text-[#F7F0E3]/70">Hours</div>
          </div>
          <div class="bg-black/35 rounded-xl p-1.5 border border-[#C9A24A]/25">
            <div class="text-base font-bold text-wedding-accent font-mono">{{ countdown.minutes }}</div>
            <div class="text-[8px] text-[#F7F0E3]/70">Mins</div>
          </div>
          <div class="bg-black/35 rounded-xl p-1.5 border border-[#C9A24A]/25">
            <div class="text-base font-bold text-wedding-accent font-mono">{{ countdown.seconds }}</div>
            <div class="text-[8px] text-[#F7F0E3]/70">Secs</div>
          </div>
        </div>

        <div class="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-[#C9A24A]/60 to-transparent my-2.5"></div>
        <div class="text-[11px] font-bold text-wedding-accent font-khmer-body mb-0.5 truncate">
          {{ wedding?.venue_name_km || 'The Premier Centre Sen Sok' }}
        </div>
        <div class="text-[10px] text-[#F7F0E3]/70 font-khmer-body">
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
        <!-- Falling Golden Lotus Petals / Dust Scoped to Mobile Screen Only -->
        <WeddingCanvasBackground
          :absolute="true"
          :config="appearanceConfig?.animation_config"
          :scroll-velocity="scrollVelocity"
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
      <!-- Centered Mobile Screen Frame with Royal Gold Border & Ambient Shadow -->
      <div
        class="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] bg-wedding-bg/90 relative sm:shadow-[0_20px_70px_rgba(0,0,0,0.6),0_0_50px_rgba(201,162,74,0.15)] sm:border-x sm:border-wedding-secondary/40 transition-all duration-300"
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
      // Smoothly zoom in from 1.02 to 1.20 as you scroll down
      scale = 1.02 + scrollProgress.value * 0.18
    } else if (effect === 'zoom-out') {
      // Starts at 1.18 and smoothly zooms out to 1.02
      scale = 1.18 - scrollProgress.value * 0.16
    } else if (effect === 'breathe') {
      // Ambient breathing wave with scroll momentum
      scale = 1.03 + Math.sin(scrollProgress.value * Math.PI) * 0.08
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
    if (scrollRafId) cancelAnimationFrame(scrollRafId)
  }
})
</script>
