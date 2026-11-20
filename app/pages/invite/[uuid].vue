<template>
  <div class="min-h-screen flex items-center justify-center p-6 text-center">
    <div class="max-w-md w-full khmer-card p-8 rounded-2xl border-2 border-wedding-secondary shadow-gold-glow">
      <div class="text-4xl mb-4 animate-bounce">💌</div>
      <h1 class="text-xl md:text-2xl font-khmer-heading text-wedding-heading mb-2">
        {{ t('common.wedding_invitation') }}
      </h1>
      <p class="text-sm text-wedding-text/70 mb-4 font-mono">
        Token: {{ route.params.uuid }}
      </p>
      <p class="text-sm font-khmer-body text-wedding-text">
        {{ t('common.loading') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useLocale()
</script>
