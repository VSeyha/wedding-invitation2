<template>
  <div class="relative min-h-screen" :style="pageBackgroundStyle">
    <!-- Falling Golden Lotus Petals Background -->
    <WeddingCanvasBackground :config="appearanceConfig?.animation_config" />

    <!-- Error State: Invitation Not Found or Revoked -->
    <div
      v-if="errorState"
      class="min-h-screen flex items-center justify-center p-6 text-center relative z-10"
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
      class="min-h-screen flex flex-col items-center justify-center p-6 text-center relative z-10"
    >
      <div class="text-4xl mb-4 animate-bounce">💌</div>
      <div class="font-khmer-heading text-lg text-wedding-primary animate-pulse">
        {{ t('common.loading') }}
      </div>
    </div>

    <!-- Active Valid Invitation (Focused on Tablet & Mobile) -->
    <div v-else class="relative z-10 w-full flex justify-center">
      <!-- Centered Mobile & Tablet Frame -->
      <div
        class="w-full max-w-[480px] sm:max-w-[540px] md:max-w-[580px] min-h-screen bg-wedding-bg relative sm:shadow-2xl sm:border-x sm:border-wedding-secondary/30 transition-all duration-300 overflow-x-hidden"
      >
        <!-- 1. Khmer Royal Seal Opening Envelope -->
        <WeddingOpeningAnimation
          :guest-name="invitation?.guest_name || ''"
          :wedding="wedding"
          @opened="hasOpened = true"
        />

        <!-- 2. Main Invitation Content (Unveiled after seal clicked) -->
        <main
          class="transition-opacity duration-1000 pb-20 relative"
          :class="{ 'opacity-100': hasOpened, 'opacity-0 pointer-events-none': !hasOpened }"
        >
          <!-- Hero Section -->
          <WeddingHero :wedding="wedding" />

          <!-- Couple Introduction -->
          <WeddingCouple :wedding="wedding" />

          <!-- Our Story Timeline -->
          <WeddingOurStory :story="wedding?.our_story" />

          <!-- Warm Invitation Letter -->
          <WeddingMessage :wedding="wedding" />

          <!-- Ceremony Programme Timeline -->
          <WeddingProgramme :programmes="programmes" />

          <!-- Venue Location & Map -->
          <WeddingLocation :wedding="wedding" />

          <!-- Photo Gallery -->
          <WeddingGallery :photos="photos" />

          <!-- Digital Wedding Gift / KHQR -->
          <WeddingGift :gift-info="wedding?.gift_info" />

          <!-- RSVP Attendance Form -->
          <WeddingRSVP
            :token="token"
            :guest-name="invitation?.guest_name || ''"
            :initial-status="invitation?.rsvp?.status"
            @updated="onRSVPUpdated"
          />

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
const hasOpened = ref(false)

const invitation = ref<PublicInvitationData | null>(null)
const wedding = ref<WeddingSettings | null>(null)
const programmes = ref<ProgrammeType[]>([])
const photos = ref<WeddingPhoto[]>([])
const appearanceConfig = ref<WeddingAppearance | null>(null)

const loadInvitationData = async () => {
  loading.value = true
  errorState.value = null

  try {
    // Parallel fetch invitation, wedding settings, programmes, gallery, and appearance
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

    if (invRes?.data) {
      invitation.value = invRes.data
    }
    if (wedRes?.data) {
      wedding.value = wedRes.data
    }
    if (progRes?.data) {
      programmes.value = progRes.data
    }
    if (galRes?.data) {
      photos.value = galRes.data
    }
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
  }
}

const pageBackgroundStyle = computed(() => {
  const bg = appearanceConfig.value?.background_config
  const c = appearanceConfig.value?.theme_config
  if (!bg) return {}

  if (bg.type === 'solid') {
    return { backgroundColor: bg.overlay_color || c?.bg || 'var(--wedding-bg, #F7F0E3)' }
  }
  if (bg.type === 'gradient') {
    const dir = bg.gradient_direction || 'to bottom'
    const from = c?.bg || '#F7F0E3'
    const to = c?.primary || '#641D2D'
    return { background: `linear-gradient(${dir}, ${from}, ${to})` }
  }
  if (bg.type === 'image' && bg.image_url) {
    return {
      backgroundImage: `url(${bg.image_url})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }
  }
  return { backgroundColor: c?.bg || 'var(--wedding-bg, #F7F0E3)' }
})

const onRSVPUpdated = (status: 'attending' | 'not_attending') => {
  if (invitation.value) {
    invitation.value.rsvp = {
      status,
      submitted_at: new Date().toISOString()
    }
  }
}

onMounted(loadInvitationData)
</script>
