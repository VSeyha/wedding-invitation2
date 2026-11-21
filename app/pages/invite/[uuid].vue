<template>
  <div
    class="relative flex justify-center selection:bg-wedding-secondary/30 selection:text-wedding-primary font-khmer-body overflow-x-hidden min-h-screen bg-[#140D0A]"
  >
    <!-- Unified Dynamic Scenic Backdrop (Edge-to-edge for Desktop & Mobile) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Fullscreen Ambient Backdrop (Gives atmospheric color & depth across widescreen monitors) -->
      <div
        class="w-full h-full bg-cover bg-center will-change-transform filter sm:blur-[6px] sm:scale-105"
        :style="dynamicBackgroundStyle"
      ></div>

      <!-- Subtle dark overlay (15–20% opacity) for cinematic depth and text contrast -->
      <div class="absolute inset-0 bg-black/[0.22] pointer-events-none"></div>

      <!-- Depth vignette that focuses the eyes on the central invitation -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="background: radial-gradient(ellipse at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0.45) 100%);"
      ></div>

      <!-- Admin Configured Dynamic Overlay Tint (if customized in Admin Portal) -->
      <div
        class="absolute inset-0 transition-opacity duration-500 pointer-events-none"
        :style="backgroundOverlayStyle"
      ></div>

      <!-- Layer 3: Existing background animations (fullscreen falling golden leaves / particles) -->
      <WeddingCanvasBackground
        v-if="appearanceConfig?.animation_config?.enabled !== false && appearanceConfig?.animation_config?.preset !== 'none'"
        :absolute="false"
        :config="appearanceConfig?.animation_config"
        :theme-colors="appearanceConfig?.theme_config"
      />
    </div>

    <!-- 2. Desktop Side Ambient Backdrop Overlay (Dim & blur side gutters to highlight the central invitation card) -->
    <div class="fixed inset-0 pointer-events-none z-[1] hidden sm:flex justify-center">
      <!-- Left Gutters Overlay -->
      <div class="flex-1 h-full bg-black/50 backdrop-blur-[4px] transition-all duration-500"></div>
      <!-- Center Invitation Slot Placeholder -->
      <div class="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] h-full pointer-events-none"></div>
      <!-- Right Gutters Overlay -->
      <div class="flex-1 h-full bg-black/50 backdrop-blur-[4px] transition-all duration-500"></div>
    </div>

    <!-- 3. Central Invitation Background Layer (Fitted perfectly to the invitation card column, exactly matching the phone preview) -->
    <div class="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] pointer-events-none z-[2] overflow-hidden">
      <!-- Sharp, perfectly framed background image inside the invitation column -->
      <div
        class="w-full h-full bg-cover bg-center will-change-transform"
        :style="dynamicBackgroundStyle"
      ></div>
      <!-- Subtle internal contrast tint -->
      <div class="absolute inset-0 bg-black/[0.08] pointer-events-none"></div>
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

    <!-- Active Valid Invitation -->
    <div
      v-else
      class="relative z-10 w-full flex justify-center py-0 sm:py-8 transition-all duration-700 min-h-screen"
    >
      <!-- 1. Khmer Royal Seal Opening Envelope (Full Screen on Mobile & Desktop) -->
      <WeddingOpeningAnimation
        :guest-name="invitation?.guest_name || ''"
        :wedding="wedding"
        :appearance="appearanceConfig"
        :absolute="false"
        @opening="onEnvelopeOpening"
        @opened="onEnvelopeOpened"
      />

      <!-- Layer 4: Main invitation content with a completely transparent wrapper -->
      <div
        class="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] relative transition-all duration-700 min-h-screen sm:min-h-0 bg-transparent border-0 shadow-none"
      >
        <!-- Floating Language Switcher for Guest (Integrated seamlessly at top-right of Invitation Card) -->
        <header
          class="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-40 transition-opacity duration-500"
          :class="{ 'opacity-0 pointer-events-none': !hasOpened && !isOpening }"
        >
          <button
            @click="toggleLocale"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-wedding-secondary/60 shadow-md text-xs sm:text-sm font-semibold text-wedding-primary transition-all duration-200 transform hover:scale-105 active:scale-95"
            :title="t('common.language')"
          >
            <span class="w-2 h-2 rounded-full bg-wedding-secondary animate-pulse"></span>
            <span>{{ isKhmer ? 'English' : 'ភាសាខ្មែរ' }}</span>
          </button>
        </header>

        <!-- 2. Main Invitation Content (Unveiled seamlessly behind animation) -->
        <main
          class="pb-20 relative transition-all duration-1000 ease-out"
          :class="{
            'opacity-100 transform translate-y-0 scale-100 filter-none': isOpening || hasOpened,
            'opacity-40 transform translate-y-2 scale-[0.98] pointer-events-none filter blur-[1px]': !isOpening && !hasOpened
          }"
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
            <WeddingGallery :photos="photos" :config="wedding?.gallery_config" :loading="loading" />
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

    <!-- Tactile Royal Click / Tap Golden Sparkle Particles -->
    <div
      v-for="s in clickSparkles"
      :key="s.id"
      class="click-sparkle font-serif"
      :style="{
        left: `${s.x}px`,
        top: `${s.y}px`,
        '--dx': s.dx,
        '--dy': s.dy,
        '--rot': s.rot,
        fontSize: `${s.size}px`,
        color: s.color,
        textShadow: `0 0 8px ${s.color}`
      }"
    >
      {{ s.symbol }}
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})

import WeddingCanvasBackground from '~~/app/components/wedding/WeddingCanvasBackground.vue'
import WeddingOpeningAnimation from '~~/app/components/wedding/WeddingOpeningAnimation.vue'
import WeddingHero from '~~/app/components/wedding/WeddingHero.vue'

// Lazy-load below-the-fold components to reduce initial page bundle size and speed up FCP/LCP
const WeddingCouple = defineAsyncComponent(() => import('~~/app/components/wedding/WeddingCouple.vue'))
const WeddingOurStory = defineAsyncComponent(() => import('~~/app/components/wedding/WeddingOurStory.vue'))
const WeddingMessage = defineAsyncComponent(() => import('~~/app/components/wedding/WeddingMessage.vue'))
const WeddingProgramme = defineAsyncComponent(() => import('~~/app/components/wedding/WeddingProgramme.vue'))
const WeddingLocation = defineAsyncComponent(() => import('~~/app/components/wedding/WeddingLocation.vue'))
const WeddingGallery = defineAsyncComponent(() => import('~~/app/components/wedding/WeddingGallery.vue'))
const WeddingGift = defineAsyncComponent(() => import('~~/app/components/wedding/WeddingGift.vue'))
const WeddingRSVP = defineAsyncComponent(() => import('~~/app/components/wedding/WeddingRSVP.vue'))

import { formatKhmerDate, formatEnglishDate } from '~~/app/utils/date'
import { PRESET_BACKGROUNDS } from '~~/shared/types/appearance'

import type { WeddingSettings } from '~~/shared/types/wedding'
import type { WeddingProgramme as ProgrammeType, WeddingPhoto } from '~~/shared/types/programme'
import type { PublicInvitationData } from '~~/shared/types/invitation'
import type { WeddingAppearance } from '~~/shared/types/appearance'

const route = useRoute()
const { isKhmer, toggleLocale, t } = useLocale()
const { applyThemeColors } = useWeddingAppearance()

const token = computed(() => (route.params.uuid as string) || '')
const loading = ref(true)
const errorState = ref<number | null>(null)
const isOpening = ref(false)
const hasOpened = ref(false)

const invitation = ref<PublicInvitationData | null>(null)
const wedding = ref<WeddingSettings | null>(null)
const programmes = ref<ProgrammeType[]>([])
const photos = ref<WeddingPhoto[]>([])
const appearanceConfig = ref<WeddingAppearance | null>(null)

// Apply theme CSS variables directly to :root
watch(
  () => appearanceConfig.value?.theme_config,
  (c) => {
    if (c) applyThemeColors(c)
  },
  { immediate: true }
)

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
      document.body.classList.remove('overflow-hidden', 'h-screen', 'touch-none', 'select-none')
      document.documentElement.classList.remove('overflow-hidden', 'h-screen')
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

  // Performance: Stop requestAnimationFrame loop when scroll animation has settled
  if (Math.abs(dProgress) < 0.0001 && Math.abs(smoothScrollVelocity.value) < 0.001) {
    smoothScrollProgress.value = targetScrollProgress.value
    smoothScrollVelocity.value = 0
    dampingRafId = null
    return
  }

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

  if (!dampingRafId) {
    dampingRafId = requestAnimationFrame(updateSmoothScroll)
  }
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
  hasOpened.value = true
  nextTick(() => {
    setupScrollReveal()
  })
}

const onEnvelopeOpened = () => {
  isOpening.value = false
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
  const bg = appearanceConfig.value?.background_config
  const c = appearanceConfig.value?.theme_config

  if (!bg || bg.type === 'preset' || bg.type === 'image') {
    let imgUrl = bg?.image_url
    if (!imgUrl && bg?.preset_name && PRESET_BACKGROUNDS[bg.preset_name]) {
      imgUrl = PRESET_BACKGROUNDS[bg.preset_name].image_url
    }
    if (!imgUrl) {
      imgUrl = PRESET_BACKGROUNDS['angkor-wat']?.image_url || '/images/backgrounds/angkor-wat.png'
    }

    const opacity = bg?.opacity ?? 1
    const scrollZoom = bg?.scroll_zoom !== false
    const effect = bg?.zoom_effect || 'zoom-in'

    let scale = 1.02
    if (scrollZoom) {
      if (effect === 'zoom-in') {
        scale = 1.02 + smoothScrollProgress.value * 0.05
      } else if (effect === 'zoom-out') {
        scale = 1.07 - smoothScrollProgress.value * 0.05
      } else if (effect === 'breathe') {
        scale = 1.02 + Math.sin(smoothScrollProgress.value * Math.PI) * 0.03
      }
    }

    return {
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity,
      transform: `scale(${scale.toFixed(4)})`
    }
  }

  if (bg.type === 'solid') {
    return {
      backgroundColor: bg.overlay_color || c?.bg || 'var(--wedding-bg, #F7F0E3)'
    }
  }

  if (bg.type === 'gradient') {
    const dir = bg.gradient_direction || 'to bottom'
    const from = bg.gradient_from || c?.bg || '#F7F0E3'
    const to = bg.gradient_to || c?.primary || '#641D2D'
    return {
      background: `linear-gradient(${dir}, ${from}, ${to})`,
      opacity: bg.opacity ?? 0.85
    }
  }

  return {
    backgroundColor: c?.bg || 'var(--wedding-bg, #F7F0E3)'
  }
})

const backgroundOverlayStyle = computed(() => {
  const bg = appearanceConfig.value?.background_config
  const color = bg?.overlay_color || '#000000'
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

// Tactile Royal Click / Tap Sparkle Burst Logic
interface ClickSparkle {
  id: number
  x: number
  y: number
  dx: string
  dy: string
  rot: string
  size: number
  color: string
  symbol: string
}

const clickSparkles = ref<ClickSparkle[]>([])
let sparkleIdCounter = 0
let lastSparkleTime = 0

const triggerSparkleBurst = (x: number, y: number) => {
  const nowTime = performance.now()
  if (nowTime - lastSparkleTime < 90) return
  lastSparkleTime = nowTime

  const colors = ['#E5C77A', '#C9A24A', '#FFFDF9', '#FFD700', '#F687B3']
  const symbols = ['✦', '✨', '•', '✧', '🌸', '❖']
  const count = 6

  const newParticles: ClickSparkle[] = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6
    const distance = 22 + Math.random() * 32
    const dx = `${Math.cos(angle) * distance}px`
    const dy = `${Math.sin(angle) * distance}px`
    const rot = `${Math.floor((Math.random() - 0.5) * 180)}deg`
    const size = Math.floor(10 + Math.random() * 7)
    const color = colors[Math.floor(Math.random() * colors.length)]
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const id = ++sparkleIdCounter

    newParticles.push({ id, x, y, dx, dy, rot, size, color, symbol })
  }

  clickSparkles.value.push(...newParticles)

  setTimeout(() => {
    const ids = new Set(newParticles.map((p) => p.id))
    clickSparkles.value = clickSparkles.value.filter((p) => !ids.has(p.id))
  }, 680)
}

const onGlobalClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement | null
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
    return
  }
  triggerSparkleBurst(e.clientX, e.clientY)
}

onMounted(() => {
  loadInvitationData()
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('click', onGlobalClick, { passive: true })
    dampingRafId = requestAnimationFrame(updateSmoothScroll)
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
    window.removeEventListener('click', onGlobalClick)
    if (observer) observer.disconnect()
    if (dampingRafId) cancelAnimationFrame(dampingRafId)
  }
})
</script>
