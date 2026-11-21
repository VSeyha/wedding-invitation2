<template>
  <svg
    :class="['select-none inline-block', customClass]"
    :width="size"
    :height="size"
    :viewBox="viewBox"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :style="rotationStyle"
  >
    <defs>
      <!-- Khmer Royal Gold Gradient -->
      <linearGradient :id="`kbach-gold-${uid}`" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF8E7" />
        <stop offset="25%" stop-color="#F5D77F" />
        <stop offset="65%" stop-color="#C9A24A" />
        <stop offset="100%" stop-color="#8F6B1E" />
      </linearGradient>

      <!-- Center Spine Highlight Gradient -->
      <linearGradient :id="`kbach-highlight-${uid}`" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.9" />
        <stop offset="50%" stop-color="#FFF2CE" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#C9A24A" stop-opacity="0" />
      </linearGradient>

      <!-- Drop Shadow Filter for Depth -->
      <filter :id="`kbach-shadow-${uid}`" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="2" flood-color="#4A121D" flood-opacity="0.3" />
      </filter>
    </defs>

    <!-- Outer Glow (Optional) -->
    <circle
      v-if="glow"
      cx="50"
      cy="50"
      r="40"
      fill="#F5D77F"
      opacity="0.2"
      class="animate-pulse"
    />

    <!-- ============================================================== -->
    <!-- VARIANT 1: CORNER KBACH (ក្បាច់កែងស៊ុមប្រពៃណីខ្មែរ)                 -->
    <!-- Fits snugly into 90-degree card corners                        -->
    <!-- ============================================================== -->
    <g v-if="type === 'corner'" :filter="`url(#kbach-shadow-${uid})`">
      <!-- Corner Anchor & Main L-Bracket Curves -->
      <path
        d="M6 6 C18 6, 28 8, 38 16 C30 18, 22 24, 18 32 C12 24, 8 16, 6 6 Z"
        :fill="`url(#kbach-gold-${uid})`"
        stroke="#E5C77A"
        stroke-width="0.8"
      />
      <!-- Horizontal Tapering Flame Leaf (តាមបន្ទាត់ផ្តេក) -->
      <path
        d="M6 6 C20 4, 34 6, 46 10 C38 12, 30 13, 24 18 C16 12, 10 8, 6 6 Z"
        :fill="`url(#kbach-gold-${uid})`"
        opacity="0.95"
      />
      <path
        d="M46 10 C58 13, 68 18, 76 26 C66 25, 56 22, 48 18 C47 15, 46 12, 46 10 Z"
        :fill="`url(#kbach-gold-${uid})`"
      />
      <!-- Vertical Tapering Flame Leaf (តាមបន្ទាត់ឈរ) -->
      <path
        d="M6 6 C4 20, 6 34, 10 46 C12 38, 13 30, 18 24 C12 16, 8 10, 6 6 Z"
        :fill="`url(#kbach-gold-${uid})`"
        opacity="0.95"
      />
      <path
        d="M10 46 C13 58, 18 68, 26 76 C25 66, 22 56, 18 48 C15 47, 12 46, 10 46 Z"
        :fill="`url(#kbach-gold-${uid})`"
      />
      <!-- Diagonal Central Sprout (ក្បាច់ពន្លកចង្អុលចូលកណ្តាល) -->
      <path
        d="M14 14 C26 26, 36 34, 48 42 C38 42, 30 38, 24 30 C20 22, 16 16, 14 14 Z"
        :fill="`url(#kbach-gold-${uid})`"
      />
      <path
        d="M48 42 C56 48, 62 56, 66 66 C56 62, 48 56, 42 48 C44 46, 46 44, 48 42 Z"
        :fill="`url(#kbach-gold-${uid})`"
      />
      <!-- Corner Rosette Jewel Node -->
      <circle cx="10" cy="10" r="4.5" :fill="`url(#kbach-gold-${uid})`" stroke="#FFF8E7" stroke-width="0.8" />
      <circle cx="10" cy="10" r="2" fill="#5A1522" />
    </g>

    <!-- ============================================================== -->
    <!-- VARIANT 2: CREST / FINIAL (ក្បាច់ភ្ញីទេស កំពូលរាជានិយម)          -->
    <!-- Symmetrical upward Angkorian flame finial                      -->
    <!-- ============================================================== -->
    <g v-else :filter="`url(#kbach-shadow-${uid})`">
      <!-- 1. Central Tall Flame Sprout (ពន្លកកណ្តាល) -->
      <path
        d="M50 8 C43 22, 38 34, 44 48 C47 54, 53 54, 56 48 C62 34, 57 22, 50 8 Z"
        :fill="`url(#kbach-gold-${uid})`"
        stroke="#E5C77A"
        stroke-width="0.8"
      />
      <!-- Spine Highlight on Central Flame -->
      <path d="M50 12 L50 46" :stroke="`url(#kbach-highlight-${uid})`" stroke-width="1.2" stroke-linecap="round" />

      <!-- 2. Left Flame Tendril (ក្បាច់ស្លាបឆ្វេង) -->
      <path
        d="M46 36 C34 26, 20 28, 14 38 C10 46, 14 54, 22 52 C30 50, 36 44, 42 48 C40 42, 42 38, 46 36 Z"
        :fill="`url(#kbach-gold-${uid})`"
        stroke="#E5C77A"
        stroke-width="0.8"
      />
      <path
        d="M22 52 C14 56, 12 66, 18 72 C24 76, 32 72, 34 64 C36 56, 32 52, 22 52 Z"
        :fill="`url(#kbach-gold-${uid})`"
        opacity="0.9"
      />

      <!-- 3. Right Flame Tendril (ក្បាច់ស្លាបស្តាំ) -->
      <path
        d="M54 36 C66 26, 80 28, 86 38 C90 46, 86 54, 78 52 C70 50, 64 44, 58 48 C60 42, 58 38, 54 36 Z"
        :fill="`url(#kbach-gold-${uid})`"
        stroke="#E5C77A"
        stroke-width="0.8"
      />
      <path
        d="M78 52 C86 56, 88 66, 82 72 C76 76, 68 72, 66 64 C64 56, 68 52, 78 52 Z"
        :fill="`url(#kbach-gold-${uid})`"
        opacity="0.9"
      />

      <!-- 4. Lower Symmetrical Calyx / Lotus Base (ត្របកទ្រក្បាច់) -->
      <path
        d="M32 72 C40 68, 60 68, 68 72 C74 78, 66 86, 50 88 C34 86, 26 78, 32 72 Z"
        :fill="`url(#kbach-gold-${uid})`"
        stroke="#E5C77A"
        stroke-width="0.8"
      />

      <!-- 5. Center Golden Core Medallion -->
      <circle cx="50" cy="62" r="5" :fill="`url(#kbach-gold-${uid})`" stroke="#FFF8E7" stroke-width="0.8" />
      <circle cx="50" cy="62" r="2.5" fill="#4A121D" />

      <!-- Bottom Hanging Droplet / Pearl Bead -->
      <circle cx="50" cy="93" r="2.5" :fill="`url(#kbach-gold-${uid})`" />
    </g>
  </svg>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: number | string
    type?: 'crest' | 'corner'
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    glow?: boolean
    customClass?: string
  }>(),
  {
    size: 24,
    type: 'crest',
    position: 'top-left',
    glow: false,
    customClass: ''
  }
)

const uid = Math.random().toString(36).substring(2, 9)

const viewBox = computed(() => {
  return props.type === 'corner' ? '0 0 80 80' : '0 0 100 100'
})

const rotationStyle = computed(() => {
  if (props.type !== 'corner') return {}
  switch (props.position) {
    case 'top-right':
      return { transform: 'scaleX(-1)' }
    case 'bottom-left':
      return { transform: 'scaleY(-1)' }
    case 'bottom-right':
      return { transform: 'scale(-1, -1)' }
    default:
      return {}
  }
})
</script>
