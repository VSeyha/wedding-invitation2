<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 pointer-events-none z-0"
    :style="{ opacity: animationConfig.opacity || 0.7 }"
  ></canvas>
</template>

<script setup lang="ts">
import type { AnimationConfig } from '~~/shared/types/appearance'

const props = defineProps<{
  config?: Partial<AnimationConfig>
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)

const animationConfig = computed(() => ({
  enabled: props.config?.enabled ?? true,
  preset: props.config?.preset || 'lotus_petals',
  speed: props.config?.speed || 1,
  quantity: props.config?.particle_quantity || 30,
  size: props.config?.object_size || 22,
  opacity: props.config?.opacity || 0.7
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
  type: 'petal' | 'dust'
}

let animationId: number | null = null
let particles: Particle[] = []

const initParticles = (width: number, height: number) => {
  particles = []
  const count = animationConfig.value.quantity
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
      type: animationConfig.value.preset === 'particles' ? 'dust' : 'petal'
    })
  }
}

const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.globalAlpha = p.opacity

  // Draw golden/pinkish lotus petal curve
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
  ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2)
  ctx.fillStyle = '#E5C77A'
  ctx.shadowColor = '#C9A24A'
  ctx.shadowBlur = 6
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
      } else {
        drawPetal(ctx, p)
      }

      // Update physics
      p.y += p.speedY
      p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX
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
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initParticles(canvas.width, canvas.height)
}

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
