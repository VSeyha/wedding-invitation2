import type { Ref } from 'vue'

/**
 * Bidirectional scroll fade-in / fade-out observer for timeline items.
 * Toggles `.is-visible` on `[data-scroll-fade]` elements inside `containerRef`
 * as they enter and leave the viewport.
 */
export function useScrollFade(containerRef: Ref<HTMLElement | null>, watchSource?: () => unknown) {
  let observer: IntersectionObserver | null = null

  const setup = () => {
    if (!import.meta.client || typeof IntersectionObserver === 'undefined') return
    if (observer) observer.disconnect()

    const rootEl = containerRef.value
    if (!rootEl) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          } else {
            entry.target.classList.remove('is-visible')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '-20px 0px -30px 0px'
      }
    )

    rootEl.querySelectorAll('[data-scroll-fade]').forEach((el) => {
      observer?.observe(el)
    })
  }

  onMounted(() => {
    nextTick(setup)
  })

  if (watchSource) {
    watch(watchSource, () => {
      nextTick(setup)
    })
  }

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}
