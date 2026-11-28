<template>
  <section class="py-12 px-4 max-w-xl mx-auto" id="rsvp">
    <div class="text-center mb-6">
      <div class="text-2xl text-wedding-secondary mb-1">💌</div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading">
        {{ t('rsvp.title') }}
      </h2>
      <div class="w-24 h-0.5 bg-wedding-secondary mx-auto mt-2 mb-3"></div>
      <p class="text-xs sm:text-sm text-wedding-text/70 font-khmer-body">
        {{ t('rsvp.subtitle') }}
      </p>
    </div>

    <!-- RSVP Card Box -->
    <div class="khmer-card rounded-3xl p-6 sm:p-8 border-2 border-wedding-secondary/50 shadow-gold-glow text-center">
      <!-- Guest Name Heading -->
      <div class="mb-6 pb-4 border-b border-wedding-secondary/30">
        <span class="text-xs uppercase tracking-wider text-wedding-secondary font-bold">
          {{ t('invitation.honored_guest') }}
        </span>
        <div class="text-xl sm:text-2xl font-bold text-wedding-primary font-khmer-heading mt-1">
          {{ guestName }}
        </div>
      </div>

      <!-- Current Status Badge -->
      <div class="mb-6">
        <div class="text-xs text-wedding-text/60 mb-2">Current Status:</div>
        <div v-if="currentStatus === 'attending'" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold border border-green-300">
          <span>✓</span>
          <span>{{ t('rsvp.attending') }}</span>
        </div>
        <div v-else-if="currentStatus === 'not_attending'" class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-300">
          <span>✗</span>
          <span>{{ t('rsvp.not_attending') }}</span>
        </div>
        <div v-else class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
          <span>⏳</span>
          <span>{{ t('rsvp.pending') }}</span>
        </div>
      </div>

      <!-- Action Choice Buttons -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 relative z-10">
        <button
          type="button"
          @click="submitRSVP('attending')"
          :disabled="submitting"
          class="relative z-10 py-3 px-4 rounded-2xl border-2 transition-all duration-300 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 interactive-btn cursor-pointer opacity-100"
          :class="currentStatus === 'attending'
            ? 'bg-wedding-primary text-wedding-bg border-wedding-primary shadow-md font-bold'
            : 'bg-white hover:bg-wedding-primary/10 border-wedding-secondary/50 text-wedding-heading'"
        >
          <span>🎉</span>
          <span>{{ t('rsvp.attending') }}</span>
        </button>

        <button
          type="button"
          @click="submitRSVP('not_attending')"
          :disabled="submitting"
          class="relative z-10 py-3 px-4 rounded-2xl border-2 transition-all duration-300 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 interactive-btn cursor-pointer opacity-100"
          :class="currentStatus === 'not_attending'
            ? 'bg-[#3C2925] text-[#F7F0E3] border-[#3C2925] shadow-md font-bold'
            : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'"
        >
          <span>🙏</span>
          <span>{{ t('rsvp.not_attending') }}</span>
        </button>
      </div>

      <!-- Feedback Message -->
      <div v-if="feedbackMessage" class="mt-4 p-3 rounded-xl bg-wedding-secondary/20 border border-wedding-secondary/40 text-xs text-wedding-heading font-medium animate-fade-in">
        {{ feedbackMessage }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'

const props = defineProps<{
  token: string
  guestName: string
  initialStatus?: 'attending' | 'not_attending' | null
}>()

const emit = defineEmits<{
  (e: 'updated', status: 'attending' | 'not_attending'): void
}>()

const { t } = useLocale()

const currentStatus = ref<'attending' | 'not_attending' | null>(props.initialStatus || null)
const submitting = ref(false)
const feedbackMessage = ref('')

watch(() => props.initialStatus, (newVal) => {
  if (newVal) currentStatus.value = newVal
})

const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#E5C77A', '#C9A24A', '#641D2D']
    })
  } catch {
    // Ignore if canvas confetti not supported
  }
}

const submitRSVP = async (status: 'attending' | 'not_attending') => {
  submitting.value = true
  feedbackMessage.value = ''

  try {
    await $fetch('/api/rsvps', {
      method: 'POST',
      body: {
        token: props.token,
        attendance_status: status
      }
    })

    currentStatus.value = status
    emit('updated', status)

    if (status === 'attending') {
      triggerConfetti()
      feedbackMessage.value = t('rsvp.status_confirmed_attending')
    } else {
      feedbackMessage.value = t('rsvp.status_confirmed_not_attending')
    }
  } catch (err: any) {
    console.error('RSVP submit error:', err)
    feedbackMessage.value = t('rsvp.error_submitting')
  } finally {
    submitting.value = false
  }
}
</script>
