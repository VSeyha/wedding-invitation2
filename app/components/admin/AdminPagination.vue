<template>
  <div v-if="totalItems > 0" class="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-[#C9A24A]/20 text-xs text-[#3C2925]/70 select-none">
    <!-- Left: Showing summary & Page Size -->
    <div class="flex items-center gap-3">
      <span>
        Showing <strong class="text-[#641D2D] font-semibold">{{ startIndex }}</strong> to
        <strong class="text-[#641D2D] font-semibold">{{ endIndex }}</strong> of
        <strong class="text-[#641D2D] font-semibold">{{ totalItems }}</strong> {{ itemName }}
      </span>

      <div class="hidden sm:flex items-center gap-1.5 ml-2 border-l border-gray-200 pl-3">
        <span>Rows:</span>
        <select
          v-model.number="selectedPageSize"
          class="border border-[#C9A24A]/60 rounded-md px-2.5 py-1 text-xs bg-white text-[#641D2D] font-bold focus:outline-none focus:ring-1 focus:ring-[#641D2D] cursor-pointer min-w-[62px] shadow-xs"
        >
          <option v-for="size in allPageSizeOptions" :key="size" :value="size" :selected="size === Number(pageSize)">
            {{ size }}
          </option>
        </select>
      </div>
    </div>

    <!-- Right: Page Controls -->
    <div class="flex items-center gap-1">
      <!-- First Page -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="pagination-btn px-2"
        title="First Page"
      >
        «
      </button>

      <!-- Previous Page -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn px-2"
        title="Previous Page"
      >
        ‹
      </button>

      <!-- Page Numbers with Ellipsis -->
      <template v-for="(p, idx) in visiblePages" :key="idx">
        <span v-if="p === '...'" class="px-2 py-1 text-gray-400">...</span>
        <button
          v-else
          @click="goToPage(p as number)"
          class="pagination-btn min-w-[28px] h-7"
          :class="currentPage === p ? 'pagination-btn-active' : ''"
        >
          {{ p }}
        </button>
      </template>

      <!-- Next Page -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn px-2"
        title="Next Page"
      >
        ›
      </button>

      <!-- Last Page -->
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="pagination-btn px-2"
        title="Last Page"
      >
        »
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    totalItems: number
    currentPage: number
    pageSize: number
    pageSizeOptions?: number[]
    itemName?: string
  }>(),
  {
    pageSizeOptions: () => [10, 15, 25, 50, 100],
    itemName: 'items'
  }
)

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
  (e: 'update:current-page', page: number): void
  (e: 'update:pageSize', size: number): void
  (e: 'update:page-size', size: number): void
}>()

// Ensure pageSize is always present in options so select is never empty
const allPageSizeOptions = computed(() => {
  const opts = [...props.pageSizeOptions]
  const current = Number(props.pageSize) || 15
  if (!opts.includes(current)) {
    opts.push(current)
    opts.sort((a, b) => a - b)
  }
  return opts
})

// Two-way reactive wrapper for select v-model
const selectedPageSize = computed({
  get: () => Number(props.pageSize) || 15,
  set: (val: number) => {
    changePageSize(Number(val))
  }
})

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / (Number(props.pageSize) || 15))))

const startIndex = computed(() => {
  if (props.totalItems === 0) return 0
  const size = Number(props.pageSize) || 15
  return (props.currentPage - 1) * size + 1
})

const endIndex = computed(() => {
  const size = Number(props.pageSize) || 15
  return Math.min(props.totalItems, props.currentPage * size)
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('update:current-page', page)
}

const changePageSize = (newSize: number) => {
  const size = Number(newSize) || 15
  emit('update:pageSize', size)
  emit('update:page-size', size)
  const newTotalPages = Math.max(1, Math.ceil(props.totalItems / size))
  if (props.currentPage > newTotalPages) {
    emit('update:currentPage', newTotalPages)
    emit('update:current-page', newTotalPages)
  }
}

watch(() => props.totalItems, (count) => {
  const size = Number(props.pageSize) || 15
  const max = Math.max(1, Math.ceil(count / size))
  if (props.currentPage > max) {
    emit('update:currentPage', max)
    emit('update:current-page', max)
  }
})

// Generate smart visible pages array (e.g. [1, 2, 3, '...', 10])
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = props.currentPage

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | string)[] = []

  if (current <= 4) {
    for (let i = 1; i <= 5; i++) pages.push(i)
    pages.push('...')
    pages.push(total)
  } else if (current >= total - 3) {
    pages.push(1)
    pages.push('...')
    for (let i = total - 4; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    pages.push('...')
    pages.push(current - 1)
    pages.push(current)
    pages.push(current + 1)
    pages.push('...')
    pages.push(total)
  }

  return pages
})
</script>

<style scoped>
.pagination-btn {
  @apply h-7 flex items-center justify-center rounded border border-gray-200 bg-white text-xs text-[#3C2925] font-medium transition-colors hover:bg-[#F7F0E3] hover:text-[#641D2D] hover:border-[#C9A24A]/40 disabled:opacity-40 disabled:pointer-events-none;
}
.pagination-btn-active {
  @apply bg-[#641D2D] text-[#F7F0E3] font-bold border-[#641D2D] hover:bg-[#7D2438] hover:text-[#F7F0E3];
}
</style>
