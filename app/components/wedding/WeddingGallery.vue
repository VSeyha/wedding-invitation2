<template>
  <section class="py-12 px-4 max-w-5xl mx-auto" v-if="photos.length">
    <div class="text-center mb-10">
      <div class="text-2xl text-wedding-secondary mb-1">🖼️</div>
      <h2 class="font-khmer-heading text-xl sm:text-2xl text-wedding-heading">
        {{ t('common.gallery') }}
      </h2>
      <div class="w-24 h-0.5 bg-wedding-secondary mx-auto mt-2"></div>
    </div>

    <!-- Gallery Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      <div
        v-for="(photo, index) in photos"
        :key="photo.id"
        @click="openLightbox(index)"
        class="aspect-square rounded-2xl overflow-hidden cursor-pointer border border-wedding-secondary/30 shadow-sm relative group bg-black/5"
      >
        <img
          :src="photo.url"
          :alt="photo.alt_text_en || 'Wedding photo'"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-wedding-primary/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl">
          🔍
        </div>
      </div>
    </div>

    <!-- Full-screen Lightbox Modal -->
    <div
      v-if="activePhotoIndex !== null"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      @click.self="closeLightbox"
    >
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 text-white text-3xl hover:text-wedding-secondary p-2 z-10"
      >
        ✕
      </button>

      <!-- Previous Button -->
      <button
        v-if="photos.length > 1"
        @click.stop="prevPhoto"
        class="absolute left-4 text-white text-3xl hover:text-wedding-secondary p-2 z-10"
      >
        ‹
      </button>

      <!-- Active Image -->
      <div class="max-w-4xl max-h-[85vh] flex items-center justify-center">
        <img
          :src="photos[activePhotoIndex].url"
          :alt="photos[activePhotoIndex].alt_text_en || 'Wedding photo preview'"
          class="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />
      </div>

      <!-- Next Button -->
      <button
        v-if="photos.length > 1"
        @click.stop="nextPhoto"
        class="absolute right-4 text-white text-3xl hover:text-wedding-secondary p-2 z-10"
      >
        ›
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { WeddingPhoto } from '~~/shared/types/programme'

const props = defineProps<{
  photos: WeddingPhoto[]
}>()

const { t } = useLocale()
const activePhotoIndex = ref<number | null>(null)

const openLightbox = (idx: number) => {
  activePhotoIndex.value = idx
}

const closeLightbox = () => {
  activePhotoIndex.value = null
}

const prevPhoto = () => {
  if (activePhotoIndex.value === null) return
  activePhotoIndex.value = (activePhotoIndex.value - 1 + props.photos.length) % props.photos.length
}

const nextPhoto = () => {
  if (activePhotoIndex.value === null) return
  activePhotoIndex.value = (activePhotoIndex.value + 1) % props.photos.length
}
</script>
