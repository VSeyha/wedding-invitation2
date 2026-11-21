<template>
  <canvas
    ref="canvasRef"
    :class="[absolute ? 'absolute inset-0 w-full h-full' : 'fixed inset-0 w-full h-full', 'pointer-events-none z-0']"
    :style="{ opacity: animationConfig.opacity || 0.7 }"
  ></canvas>
</template>

<script setup lang="ts">
import type { AnimationConfig, ThemeColors } from '~~/shared/types/appearance'

const props = withDefaults(
  defineProps<{
    config?: Partial<AnimationConfig>
    absolute?: boolean
    scrollVelocity?: number
    palette?: 'gold' | 'pink_white' | 'auto'
    themeColors?: ThemeColors | null
  }>(),
  {
    palette: 'auto'
  }
)

const canvasRef = ref<HTMLCanvasElement | null>(null)

const effectivePalette = computed(() => {
  if (props.palette && props.palette !== 'auto') return props.palette
  const primary = (props.themeColors?.primary || '').toLowerCase()
  const name = ((props.config as any)?.theme_name || '').toLowerCase()
  if (primary.includes('f4') || primary.includes('db') || primary.includes('pink') || name.includes('pink')) {
    return 'pink_white'
  }
  return 'gold'
})

const animationConfig = computed(() => ({
  enabled: props.config?.enabled ?? true,
  preset: props.config?.preset || 'lotus_petals',
  speed: props.config?.speed ?? 0.6,
  quantity: props.config?.particle_quantity || 24,
  size: props.config?.object_size || 22,
  opacity: props.config?.opacity || 0.7,
  direction: props.config?.direction || 'down'
}))

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
  opacity: number
  type: 'petal' | 'dust' | 'heart' | 'light'
}

let animationId: number | null = null
let particles: Particle[] = []

const initParticles = (width: number, height: number) => {
  particles = []
  if (!animationConfig.value.enabled || animationConfig.value.preset === 'none') return

  const count = Math.min(Math.max(animationConfig.value.quantity, 5), 100)
  const preset = animationConfig.value.preset
  let type: Particle['type'] = 'petal'
  if (preset === 'particles') type = 'dust'
  else if (preset === 'hearts') type = 'heart'
  else if (preset === 'lights') type = 'light'

  // Gentle, calm romantic base speed scaled down for elegant slow motion
  const baseSpeed = (animationConfig.value.speed ?? 0.6) * 0.35

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 0.5 + 0.75) * animationConfig.value.size,
      speedX: (Math.random() - 0.5) * 0.15 * baseSpeed,
      speedY: (Math.random() * 0.22 + 0.12) * baseSpeed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.006 * baseSpeed,
      opacity: Math.random() * 0.35 + 0.45,
      type
    })
  }
}

const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.globalAlpha = p.opacity

  // Draw natural curved lotus petal geometry
  ctx.beginPath()
  ctx.moveTo(0, -p.size)
  ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.4, p.size * 0.6, p.size * 0.8, 0, p.size)
  ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.8, -p.size * 0.75, -p.size * 0.4, 0, -p.size)
  ctx.closePath()

  if (effectivePalette.value === 'pink_white') {
    // Dreamy White-to-Rose Pink gradient
    const grad = ctx.createLinearGradient(0, -p.size, 0, p.size)
    grad.addColorStop(0, '#FFFFFF') // Pure luminous white tip
    grad.addColorStop(0.35, '#FCE7F3') // Soft blush pink
    grad.addColorStop(0.75, '#F472B6') // Romantic blossom rose
    grad.addColorStop(1, '#DB2777') // Lotus magenta base
    ctx.fillStyle = grad
    ctx.fill()

    // Fine translucent white central vein
    ctx.beginPath()
    ctx.moveTo(0, -p.size * 0.8)
    ctx.lineTo(0, p.size * 0.7)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)'
    ctx.lineWidth = 1
    ctx.stroke()
  } else {
    // Khmer luxury gold gradient
    const grad = ctx.createLinearGradient(0, -p.size, 0, p.size)
    grad.addColorStop(0, '#E5C77A')
    grad.addColorStop(0.5, '#C9A24A')
    grad.addColorStop(1, '#8F6B1E')
    ctx.fillStyle = grad
    ctx.fill()

    // Petal center vein
    ctx.beginPath()
    ctx.moveTo(0, -p.size * 0.8)
    ctx.lineTo(0, p.size * 0.7)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  ctx.restore()
}

const drawDust = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.globalAlpha = p.opacity

  ctx.beginPath()
  ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2)

  if (effectivePalette.value === 'pink_white') {
    ctx.fillStyle = '#FFFFFF'
    ctx.shadowColor = '#F472B6'
    ctx.shadowBlur = 10
  } else {
    ctx.fillStyle = '#E5C77A'
    ctx.shadowColor = '#C9A24A'
    ctx.shadowBlur = 8
  }
  ctx.fill()

  ctx.restore()
}

const drawHeart = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation * 0.3)
  ctx.globalAlpha = p.opacity

  const s = p.size * 0.5
  ctx.beginPath()
  ctx.moveTo(0, s * 0.3)
  ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.2, s * 0.4, 0, s * 1.2)
  ctx.bezierCurveTo(s * 1.2, s * 0.4, s, -s * 0.6, 0, s * 0.3)
  if (effectivePalette.value === 'pink_white') {
    ctx.fillStyle = '#F472B6'
    ctx.shadowColor = '#FBCFE8'
    ctx.shadowBlur = 6
  } else {
    ctx.fillStyle = '#C9A24A'
  }
  ctx.fill()

  ctx.restore()
}

const drawLight = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.globalAlpha = p.opacity * 0.6

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
  if (effectivePalette.value === 'pink_white') {
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
    grad.addColorStop(0.5, 'rgba(244, 114, 182, 0.45)')
    grad.addColorStop(1, 'rgba(244, 114, 182, 0)')
  } else {
    grad.addColorStop(0, 'rgba(229, 199, 122, 0.9)')
    grad.addColorStop(0.5, 'rgba(201, 162, 74, 0.4)')
    grad.addColorStop(1, 'rgba(201, 162, 74, 0)')
  }
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.arc(0, 0, p.size, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}

const render = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (animationConfig.value.enabled && animationConfig.value.preset !== 'none') {
    for (const p of particles) {
      if (p.type === 'dust') {
        drawDust(ctx, p)
      } else if (p.type === 'heart') {
        drawHeart(ctx, p)
      } else if (p.type === 'light') {
        drawLight(ctx, p)
      } else {
        drawPetal(ctx, p)
      }

      // Smooth, gentle constant float (scrolling does not accelerate particles)
      p.y += p.speedY
      p.x += Math.sin(p.y * 0.008) * 0.2 + p.speedX
      p.rotation += p.rotationSpeed

      // Wrap around edges
      if (p.y > canvas.height + p.size) {
        p.y = -p.size
        p.x = Math.random() * canvas.width
      }
      if (p.x < -p.size) p.x = canvas.width + p.size
      if (p.x > canvas.width + p.size) p.x = -p.size
    }
  }

  animationId = requestAnimationFrame(render)
}

const handleResize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  if (props.absolute && canvas.parentElement) {
    canvas.width = canvas.parentElement.clientWidth || 360
    canvas.height = canvas.parentElement.clientHeight || 640
  } else {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  initParticles(canvas.width, canvas.height)
}

// Watch config changes to update live in real-time
watch(
  () => [
    animationConfig.value.enabled,
    animationConfig.value.preset,
    animationConfig.value.quantity,
    animationConfig.value.size,
    animationConfig.value.speed
  ],
  () => {
    if (canvasRef.value) {
      initParticles(canvasRef.value.width, canvasRef.value.height)
    }
  }
)

onMounted(() => {
  if (typeof window === 'undefined') return
  handleResize()
  window.addEventListener('resize', handleResize)
  render()
})

onUnmounted(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('resize', handleResize)
  if (animationId) cancelAnimationFrame(animationId)
})
</script>
