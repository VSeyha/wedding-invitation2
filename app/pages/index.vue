<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center">
    <div class="max-w-md w-full khmer-card p-8 rounded-2xl border-2 border-wedding-secondary shadow-gold-glow">
      <div class="text-4xl mb-4">⚜️</div>
      <h1 class="text-2xl md:text-3xl font-khmer-heading text-wedding-heading mb-2">
        សិរីមង្គលអាពាហ៍ពិពាហ៍
      </h1>
      <p class="text-lg font-en-heading text-wedding-secondary font-semibold mb-6">
        Khmer Traditional Wedding Invitation
      </p>
      <p class="text-sm text-wedding-text/80 mb-6 font-khmer-body">
        សូមប្រើប្រាស់តំណភ្ជាប់លិខិតអញ្ជើញផ្ទាល់ខ្លួន (Personalized Link) របស់អ្នក ដើម្បីបើកមើលលិខិតអញ្ជើញ។
      </p>
      <div class="pt-4 border-t border-wedding-secondary/30 flex flex-col gap-3">
        <NuxtLink
          to="/admin"
          class="inline-block px-5 py-2.5 rounded-xl bg-wedding-primary text-wedding-bg font-medium hover:bg-wedding-primary/90 transition-all text-sm"
        >
          {{ t('admin.title') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useLocale()
</script>
