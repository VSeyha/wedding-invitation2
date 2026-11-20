<template>
  <div class="relative min-h-screen">
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

    <!-- Active Valid Invitation -->
    <div v-else class="relative z-10">
      <!-- 1. Khmer Royal Seal Opening Envelope -->
      <WeddingOpeningAnimation
        :guest-name="invitation?.guest_name || ''"
        :wedding="wedding"
        @opened="hasOpened = true"
      />

      <!-- 2. Main Invitation Content (Unveiled after seal clicked) -->
      <main class="transition-opacity duration-1000 pb-20" :class="{ 'opacity-100': hasOpened, 'opacity-0': !hasOpened }">
        <!-- Hero Section -->
        <WeddingHero :wedding="wedding" />

        <!-- Couple Introduction -->
        <WeddingCouple :wedding="wedding" />

        <!-- Warm Invitation Letter -->
        <WeddingMessage :wedding="wedding" />

        <!-- Ceremony Programme Timeline -->
        <WeddingProgramme :programmes="programmes" />

        <!-- Venue Location & Map -->
        <WeddingLocation :wedding="wedding" />

        <!-- Photo Gallery -->
        <WeddingGallery :photos="photos" />

        <!-- RSVP Attendance Form -->
        <WeddingRSVP
          :token="token"
          :guest-name="invitation?.guest_name || ''"
          :initial-status="invitation?.rsvp?.status"
          @updated="onRSVPUpdated"
        />

        <!-- Footer -->
        <footer class="mt-16 text-center text-xs text-wedding-text/60 font-en-heading pb-8">
          <p class="mb-1">With Love & Gratitude</p>
          <p class="font-bold text-wedding-primary">
            {{ wedding?.groom_name_en }} & {{ wedding?.bride_name_en }}
          </p>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import WeddingCanvasBackground from '~~/app/components/wedding/WeddingCanvasBackground.vue'
import WeddingOpeningAnimation from '~~/app/components/wedding/WeddingOpeningAnimation.vue'
import WeddingHero from '~~/app/components/wedding/WeddingHero.vue'
import WeddingCouple from '~~/app/components/wedding/WeddingCouple.vue'
import WeddingMessage from '~~/app/components/wedding/WeddingMessage.vue'
import WeddingProgramme from '~~/app/components/wedding/WeddingProgramme.vue'
import WeddingLocation from '~~/app/components/wedding/WeddingLocation.vue'
import WeddingGallery from '~~/app/components/wedding/WeddingGallery.vue'
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
