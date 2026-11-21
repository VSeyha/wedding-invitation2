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
      <!-- Outer Petal Gradient -->
      <linearGradient :id="`romdoul-outer-${uid}`" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stop-color="#FFF5D6" />
        <stop offset="35%" stop-color="#F2D17E" />
        <stop offset="75%" stop-color="#C9A24A" />
        <stop offset="100%" stop-color="#8F6B1E" />
      </linearGradient>

      <!-- Inner Petal Gradient -->
      <linearGradient :id="`romdoul-inner-${uid}`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="30%" stop-color="#FFF2CE" />
        <stop offset="70%" stop-color="#E5C77A" />
        <stop offset="100%" stop-color="#A67C1E" />
      </linearGradient>

      <!-- Center Receptacle Radial Gradient -->
      <radialGradient :id="`romdoul-core-${uid}`" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FFFCE8" />
        <stop offset="40%" stop-color="#F2D17E" />
        <stop offset="85%" stop-color="#8F6B1E" />
        <stop offset="100%" stop-color="#5A1522" />
      </radialGradient>

      <!-- Petal Shading Filter -->
      <filter :id="`romdoul-shadow-${uid}`" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#3D121B" flood-opacity="0.35" />
      </filter>
    </defs>

    <!-- Outer Bloom Halo (if glowing) -->
    <circle
      v-if="glow"
      cx="50"
      cy="50"
      r="44"
      fill="#F2D17E"
      opacity="0.18"
      class="animate-pulse"
    />

    <!-- ============================================================== -->
    <!-- ROMDOUL OUTER WHORL: 3 Large Broad Triangular Petals (120° apart) -->
    <!-- ============================================================== -->
    <g :filter="`url(#romdoul-shadow-${uid})`">
      <!-- Petal 1: Top (0° / 12 o'clock) -->
      <g transform="translate(50, 50)">
        <path
          d="M0 -10 C-18 -18, -26 -34, 0 -47 C26 -34, 18 -18, 0 -10 Z"
          :fill="`url(#romdoul-outer-${uid})`"
          stroke="#E5C77A"
          stroke-width="0.8"
        />
        <!-- Center ridge highlight -->
        <path d="M0 -45 L0 -14" stroke="#FFF9E6" stroke-width="1.2" opacity="0.6" stroke-linecap="round" />
      </g>

      <!-- Petal 2: Bottom-Right (120° / 4 o'clock) -->
      <g transform="translate(50, 50) rotate(120)">
        <path
          d="M0 -10 C-18 -18, -26 -34, 0 -47 C26 -34, 18 -18, 0 -10 Z"
          :fill="`url(#romdoul-outer-${uid})`"
          stroke="#E5C77A"
          stroke-width="0.8"
        />
        <path d="M0 -45 L0 -14" stroke="#FFF9E6" stroke-width="1.2" opacity="0.6" stroke-linecap="round" />
      </g>

      <!-- Petal 3: Bottom-Left (240° / 8 o'clock) -->
      <g transform="translate(50, 50) rotate(240)">
        <path
          d="M0 -10 C-18 -18, -26 -34, 0 -47 C26 -34, 18 -18, 0 -10 Z"
          :fill="`url(#romdoul-outer-${uid})`"
          stroke="#E5C77A"
          stroke-width="0.8"
        />
        <path d="M0 -45 L0 -14" stroke="#FFF9E6" stroke-width="1.2" opacity="0.6" stroke-linecap="round" />
      </g>
    </g>

    <!-- ============================================================== -->
    <!-- ROMDOUL INNER WHORL: 3 Arched Inner Petals (alternating at 60°, 180°, 300°) -->
    <!-- ============================================================== -->
    <g>
      <!-- Inner Petal 1: Top-Right (60°) -->
      <g transform="translate(50, 50) rotate(60)">
        <path
          d="M0 -6 C-12 -12, -16 -24, 0 -34 C16 -24, 12 -12, 0 -6 Z"
          :fill="`url(#romdoul-inner-${uid})`"
          stroke="#C9A24A"
          stroke-width="0.6"
        />
        <path d="M0 -31 L0 -9" stroke="#FFFFFF" stroke-width="0.9" opacity="0.7" stroke-linecap="round" />
      </g>

      <!-- Inner Petal 2: Bottom (180°) -->
      <g transform="translate(50, 50) rotate(180)">
        <path
          d="M0 -6 C-12 -12, -16 -24, 0 -34 C16 -24, 12 -12, 0 -6 Z"
          :fill="`url(#romdoul-inner-${uid})`"
          stroke="#C9A24A"
          stroke-width="0.6"
        />
        <path d="M0 -31 L0 -9" stroke="#FFFFFF" stroke-width="0.9" opacity="0.7" stroke-linecap="round" />
      </g>

      <!-- Inner Petal 3: Top-Left (300°) -->
      <g transform="translate(50, 50) rotate(300)">
        <path
          d="M0 -6 C-12 -12, -16 -24, 0 -34 C16 -24, 12 -12, 0 -6 Z"
          :fill="`url(#romdoul-inner-${uid})`"
          stroke="#C9A24A"
          stroke-width="0.6"
        />
        <path d="M0 -31 L0 -9" stroke="#FFFFFF" stroke-width="0.9" opacity="0.7" stroke-linecap="round" />
      </g>
    </g>

    <!-- ============================================================== -->
    <!-- ROMDOUL CENTER RECEPTACLE & STAMENS (កេសរផ្ការំដួល)            -->
    <!-- ============================================================== -->
    <!-- Central Button -->
    <circle
      cx="50"
      cy="50"
      r="8.5"
      :fill="`url(#romdoul-core-${uid})`"
      stroke="#C9A24A"
      stroke-width="0.8"
    />

    <!-- Golden Stamen Dots -->
    <circle cx="50" cy="46" r="1.3" fill="#FFFDF0" />
    <circle cx="53.5" cy="48" r="1.3" fill="#FFFDF0" />
    <circle cx="53.5" cy="52" r="1.3" fill="#FFFDF0" />
    <circle cx="50" cy="54" r="1.3" fill="#FFFDF0" />
    <circle cx="46.5" cy="52" r="1.3" fill="#FFFDF0" />
    <circle cx="46.5" cy="48" r="1.3" fill="#FFFDF0" />
    <circle cx="50" cy="50" r="1.8" fill="#FFFFFF" />
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number | string
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
