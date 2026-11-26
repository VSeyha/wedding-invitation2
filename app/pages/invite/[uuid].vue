<template>
  <div
    class="relative flex justify-center selection:bg-wedding-secondary/30 selection:text-wedding-primary font-khmer-body overflow-x-hidden min-h-screen bg-[#140D0A]"
  >
    <!-- Unified Dynamic Scenic Backdrop (Edge-to-edge for Desktop & Mobile) -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <!-- Fullscreen Ambient Backdrop (Gives atmospheric color & depth across widescreen monitors) -->
      <div
        ref="ambientBgRef"
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
        ref="centerBgRef"
        class="w-full h-full bg-cover bg-center will-change-transform"
        :style="dynamicBackgroundStyle"
      ></div>
      <!-- Subtle internal contrast tint -->
      <div class="absolute inset-0 bg-black/[0.08] pointer-events-none"></div>
    </div>

    <Transition name="page-fade" mode="out-in">
      <!-- Error State: Invitation Not Found or Revoked -->
      <div
        v-if="errorState"
        key="error"
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
        key="loading"
        class="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10 w-full"
      >
        <div class="relative w-full max-w-[290px] rounded-3xl bg-[#FFFDF9]/92 backdrop-blur-md border border-[#C9A24A]/55 shadow-[0_20px_55px_rgba(60,25,15,0.28)] px-7 py-7 flex flex-col items-center overflow-hidden">
          <!-- Subtle Inset Gold Frame -->
          <div class="absolute inset-2 rounded-2xl border border-[#C9A24A]/30 pointer-events-none"></div>

          <!-- 4 Delicate Khmer Kbach Corners -->
          <div class="absolute top-2.5 left-2.5 opacity-75 pointer-events-none"><KhmerKbach :size="14" type="corner" position="top-left" /></div>
          <div class="absolute top-2.5 right-2.5 opacity-75 pointer-events-none"><KhmerKbach :size="14" type="corner" position="top-right" /></div>
          <div class="absolute bottom-2.5 left-2.5 opacity-75 pointer-events-none"><KhmerKbach :size="14" type="corner" position="bottom-left" /></div>
          <div class="absolute bottom-2.5 right-2.5 opacity-75 pointer-events-none"><KhmerKbach :size="14" type="corner" position="bottom-right" /></div>

          <!-- Animated Golden Halo + Romdoul Emblem -->
          <div class="relative w-16 h-16 mb-4 flex items-center justify-center">
            <div
              class="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C9A24A] border-r-[#E5C77A]/60 animate-spin"
              style="animation-duration: 2.2s;"
            ></div>
            <div class="absolute inset-1.5 rounded-full bg-gradient-to-br from-[#FFFDF7] to-[#FAF0DC] border border-[#C9A24A]/35 shadow-inner flex items-center justify-center">
              <RomdoulFlower :size="34" :glow="true" custom-class="animate-pulse" />
            </div>
          </div>

          <!-- Bilingual Royal Loading Text -->
          <div class="font-khmer-heading text-base text-[#641D2D] leading-relaxed">
            {{ t('common.loading') }}
          </div>
          <div class="text-[10px] tracking-[0.22em] text-[#8F6B1E] font-semibold uppercase mt-1">
            Preparing Invitation
          </div>

          <!-- Smooth Gold Shimmer Bar -->
          <div class="mt-4 w-36 h-1 rounded-full bg-[#C9A24A]/20 overflow-hidden relative shimmer-skeleton"></div>
        </div>
      </div>

      <!-- Active Valid Invitation -->
      <div
        v-else
        key="active"
        class="relative z-10 w-full flex justify-center py-0 sm:py-8 min-h-screen"
      >
      <!-- 1. Khmer Royal Seal Opening Envelope (Full Screen on Mobile & Desktop) -->
      <WeddingOpeningAnimation
        v-if="appearanceConfig"
        :key="'invite-opening-' + (appearanceConfig?.opening_animation_config?.style || 'default')"
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
        <!-- 2. Main Invitation Content (Unveiled seamlessly behind animation) -->
        <main
          class="pb-20 relative will-change-transform transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
          :class="{
            'opacity-100 translate-y-0 scale-100': isOpening || hasOpened,
            'opacity-0 translate-y-3 scale-[0.985] pointer-events-none': !isOpening && !hasOpened
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
            <WeddingGallery :photos="photos" :config="wedding?.gallery_config" :loading="galleryLoading" />
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
    </Transition>

    <!-- Fixed Screen Controls (Language Switcher & Scroll-to-Top) -->
    <div
      v-if="!loading && !errorState && (hasOpened || isOpening)"
      class="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] pointer-events-none z-40"
    >
      <!-- Fixed Top-Right Language Switcher -->
      <button
        type="button"
        @click="toggleLocale"
        class="pointer-events-auto absolute top-3.5 right-3.5 sm:top-5 sm:right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-wedding-secondary/60 shadow-md text-xs sm:text-sm font-semibold text-wedding-primary transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        :title="t('common.language')"
      >
        <span class="w-2 h-2 rounded-full bg-wedding-secondary animate-pulse"></span>
        <span>{{ isKhmer ? 'English' : 'ភាសាខ្មែរ' }}</span>
      </button>

      <!-- Fixed Bottom-Right Scroll to Top Button -->
      <button
        type="button"
        @click="scrollToTop"
        aria-label="Scroll to top"
        class="absolute bottom-5 right-3.5 sm:bottom-6 sm:right-5 w-11 h-11 rounded-full bg-[#FFFDF9]/95 hover:bg-white backdrop-blur-md border border-wedding-secondary/70 shadow-[0_8px_24px_rgba(100,29,45,0.22)] text-wedding-primary flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] interactive-btn cursor-pointer"
        :class="showScrollTop ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
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
import RomdoulFlower from '~~/app/components/wedding/RomdoulFlower.vue'
import KhmerKbach from '~~/app/components/wedding/KhmerKbach.vue'

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
const galleryLoading = ref(true)
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

// Damped scroll tracking for silky smooth GPU-only zoom (zero Vue re-render overhead)
const ambientBgRef = ref<HTMLElement | null>(null)
const centerBgRef = ref<HTMLElement | null>(null)
const targetScrollProgress = ref(0)
const showScrollTop = ref(false)
let smoothProgress = 0
let lastRafTime = 0
let dampingRafId: number | null = null
let observer: IntersectionObserver | null = null

const computeZoomScale = (progress: number): number => {
  const bg = appearanceConfig.value?.background_config
  if (bg && bg.type !== 'preset' && bg.type !== 'image') return 1
  if (bg?.scroll_zoom === false) return 1.02

  const effect = bg?.zoom_effect || 'zoom-in'
  if (effect === 'zoom-out') {
    return 1.10 - progress * 0.10
  }
  if (effect === 'breathe') {
    return 1.02 + (1 - Math.cos(progress * Math.PI * 2)) * 0.04
  }
  // Default: 'zoom-in'
  return 1.0 + progress * 0.10
}

const applyBackgroundZoomTransform = (progress: number) => {
  const scale = computeZoomScale(progress)
  const s = scale.toFixed(6)
  const transform = `scale3d(${s}, ${s}, 1)`
  if (ambientBgRef.value) ambientBgRef.value.style.transform = transform
  if (centerBgRef.value) centerBgRef.value.style.transform = transform
}

const updateSmoothScroll = (now: number) => {
  const dt = lastRafTime ? Math.min((now - lastRafTime) / 1000, 0.05) : 0.016
  lastRafTime = now

  // Frame-rate-independent exponential smoothing (silky across 60Hz / 90Hz / 120Hz)
  const alpha = 1 - Math.exp(-5.5 * dt)
  const dProgress = targetScrollProgress.value - smoothProgress
  smoothProgress += dProgress * alpha

  applyBackgroundZoomTransform(smoothProgress)

  if (Math.abs(dProgress) < 0.00005) {
    smoothProgress = targetScrollProgress.value
    applyBackgroundZoomTransform(smoothProgress)
    dampingRafId = null
    lastRafTime = 0
    return
  }

  dampingRafId = requestAnimationFrame(updateSmoothScroll)
}

const handleScroll = () => {
  if (!import.meta.client) return

  const y = window.scrollY || document.documentElement.scrollTop
  showScrollTop.value = y > 280
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
  targetScrollProgress.value = Math.min(Math.max(y / max, 0), 1)

  if (!dampingRafId) {
    lastRafTime = performance.now()
    dampingRafId = requestAnimationFrame(updateSmoothScroll)
  }
}

const scrollToTop = () => {
  if (!import.meta.client) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const setupScrollReveal = () => {
  if (!import.meta.client || typeof IntersectionObserver === 'undefined') return

  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        } else {
          entry.target.classList.remove('revealed')
        }
      })
    },
    {
      threshold: 0.02,
      rootMargin: '0px 0px -15px 0px'
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
    const initialScale = computeZoomScale(smoothProgress).toFixed(6)

    return {
      backgroundImage: `url(${imgUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity,
      transform: `scale3d(${initialScale}, ${initialScale}, 1)`
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
  galleryLoading.value = true
  errorState.value = null

  // Fetch below-the-fold data in parallel without blocking the opening screen
  $fetch<any>('/api/programmes')
    .then((progRes) => {
      if (progRes?.data) programmes.value = progRes.data
    })
    .catch(() => null)

  $fetch<any>(`/api/gallery?t=${Date.now()}`)
    .then((galRes) => {
      if (galRes?.data) photos.value = galRes.data
    })
    .catch(() => null)
    .finally(() => {
      galleryLoading.value = false
    })

  try {
    const [invRes, wedRes, appRes] = await Promise.all([
      $fetch<any>(`/api/invitations/${token.value}`).catch((e) => {
        errorState.value = e.statusCode || 404
        return null
      }),
      $fetch<any>(`/api/wedding?t=${Date.now()}`).catch(() => null),
      $fetch<any>(`/api/appearance?t=${Date.now()}`).catch(() => null)
    ])

    if (invRes?.data) invitation.value = invRes.data
    if (wedRes?.data) wedding.value = wedRes.data
    if (appRes?.data) {
      appearanceConfig.value = appRes.data
      if (appRes.data.theme_config) {
        applyThemeColors(appRes.data.theme_config)
      }
      const animStyle = appRes.data.opening_animation_config?.style
      if (animStyle === 'none' || animStyle === 'direct') {
        hasOpened.value = true
        isOpening.value = false
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
