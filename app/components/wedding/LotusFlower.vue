<template>
  <svg
    :class="['select-none inline-block', customClass]"
    :width="size"
    :height="size"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <!-- Gold Outer Lotus Petal Gradient -->
      <linearGradient :id="`lotus-outer-${uid}`" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#8F6B1E" />
        <stop offset="40%" stop-color="#C9A24A" />
        <stop offset="75%" stop-color="#F2D17E" />
        <stop offset="100%" stop-color="#FFF8E0" />
      </linearGradient>

      <!-- Center Petal Highlight Gradient -->
      <linearGradient :id="`lotus-inner-${uid}`" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stop-color="#A67C1E" />
        <stop offset="50%" stop-color="#E5C77A" />
        <stop offset="85%" stop-color="#FFF2CE" />
        <stop offset="100%" stop-color="#FFFFFF" />
      </linearGradient>

      <!-- Sacred Core Glow -->
      <radialGradient :id="`lotus-core-${uid}`" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="45%" stop-color="#FFEBB0" />
        <stop offset="80%" stop-color="#C9A24A" />
        <stop offset="100%" stop-color="#641D2D" />
      </radialGradient>

      <filter :id="`lotus-shadow-${uid}`" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#3D121B" flood-opacity="0.3" />
      </filter>
    </defs>

    <!-- Outer Ambient Glow -->
    <circle
      v-if="glow"
      cx="50"
      cy="52"
      r="44"
      fill="#F2D17E"
      opacity="0.22"
      class="animate-pulse"
    />

    <!-- Sacred Golden Lotus Petals (Arranged in classic Khmer Buddhist / Royal Lotus formation) -->
    <g :filter="`url(#lotus-shadow-${uid})`">
      <!-- Outer Base Petals (Left & Right Flanks) -->
      <path
        d="M50 78 C25 76, 8 62, 12 42 C18 40, 36 54, 50 78 Z"
        :fill="`url(#lotus-outer-${uid})`"
        opacity="0.9"
      />
      <path
        d="M50 78 C75 76, 92 62, 88 42 C82 40, 64 54, 50 78 Z"
        :fill="`url(#lotus-outer-${uid})`"
        opacity="0.9"
      />

      <!-- Secondary Outer Petals -->
      <path
        d="M50 78 C30 70, 16 50, 24 30 C34 32, 44 48, 50 78 Z"
        :fill="`url(#lotus-outer-${uid})`"
        opacity="0.95"
      />
      <path
        d="M50 78 C70 70, 84 50, 76 30 C66 32, 56 48, 50 78 Z"
        :fill="`url(#lotus-outer-${uid})`"
        opacity="0.95"
      />

      <!-- Middle Petals -->
      <path
        d="M50 78 C38 64, 26 40, 36 20 C44 26, 48 45, 50 78 Z"
        :fill="`url(#lotus-inner-${uid})`"
      />
      <path
        d="M50 78 C62 64, 74 40, 64 20 C56 26, 52 45, 50 78 Z"
        :fill="`url(#lotus-inner-${uid})`"
      />

      <!-- Central Sacred Lotus Petal (Tallest Peak) -->
      <path
        d="M50 78 C42 56, 38 32, 50 14 C62 32, 58 56, 50 78 Z"
        :fill="`url(#lotus-inner-${uid})`"
      />

      <!-- Petal Center Vein -->
      <path
        d="M50 20 L50 74"
        stroke="#FFFFFF"
        stroke-width="1"
        stroke-linecap="round"
        opacity="0.6"
      />

      <!-- Sacred Lotus Heart / Stamen Seed Core -->
      <ellipse
        cx="50"
        cy="70"
        rx="10"
        ry="6"
        :fill="`url(#lotus-core-${uid})`"
      />
      <circle cx="46" cy="69" r="1.2" fill="#641D2D" opacity="0.7" />
      <circle cx="50" cy="68" r="1.3" fill="#641D2D" opacity="0.8" />
      <circle cx="54" cy="69" r="1.2" fill="#641D2D" opacity="0.7" />
      <circle cx="48" cy="71" r="1" fill="#641D2D" opacity="0.6" />
      <circle cx="52" cy="71" r="1" fill="#641D2D" opacity="0.6" />
    </g>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number
    glow?: boolean
    customClass?: string
  }>(),
  {
    size: 40,
    glow: false,
    customClass: ''
  }
)

const uid = Math.random().toString(36).substring(2, 8)
</script>
