<template>
  <canvas
    ref="canvasRef"
    :class="[absolute ? 'absolute inset-0 w-full h-full' : 'fixed inset-0 w-full h-full', 'pointer-events-none z-0']"
    :style="{ opacity: animationConfig.opacity || 0.7 }"
  ></canvas>
</template>

<script setup lang="ts">
import type { AnimationConfig } from '~~/shared/types/appearance'

const props = defineProps<{
  config?: Partial<AnimationConfig>
  absolute?: boolean
  scrollVelocity?: number
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const animationConfig = computed(() => ({
  enabled: props.config?.enabled ?? true,
  preset: props.config?.preset || 'lotus_petals',
  speed: props.config?.speed || 1,
  quantity: props.config?.particle_quantity || 30,
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

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 0.6 + 0.7) * animationConfig.value.size,
      speedX: (Math.random() - 0.5) * 0.8 * animationConfig.value.speed,
      speedY: (Math.random() * 0.9 + 0.6) * animationConfig.value.speed,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02 * animationConfig.value.speed,
      opacity: Math.random() * 0.4 + 0.4,
      type
    })
  }
}

const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.globalAlpha = p.opacity

  // Draw golden lotus petal curve
  ctx.beginPath()
  ctx.moveTo(0, -p.size)
  ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.4, p.size * 0.6, p.size * 0.8, 0, p.size)
  ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.8, -p.size * 0.75, -p.size * 0.4, 0, -p.size)
  ctx.closePath()

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

  ctx.restore()
}

const drawDust = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.globalAlpha = p.opacity

  ctx.beginPath()
  ctx.arc(0, 0, p.size * 0.25, 0, Math.PI * 2)
  ctx.fillStyle = '#E5C77A'
  ctx.shadowColor = '#C9A24A'
  ctx.shadowBlur = 8
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
  ctx.fillStyle = '#C9A24A'
  ctx.fill()

  ctx.restore()
}

const drawLight = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.globalAlpha = p.opacity * 0.6

  const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
  grad.addColorStop(0, 'rgba(229, 199, 122, 0.9)')
  grad.addColorStop(0.5, 'rgba(201, 162, 74, 0.4)')
  grad.addColorStop(1, 'rgba(201, 162, 74, 0)')
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

      // Update physics with scroll momentum reactivity
      const scrollDrift = (props.scrollVelocity || 0) * 0.4
      p.y += (p.speedY + scrollDrift)
      p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX
      p.rotation += p.rotationSpeed + scrollDrift * 0.005

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
