<template>
  <tr
    v-for="row in rows"
    :key="`skel-row-${row}`"
    class="border-b border-[#C9A24A]/10"
  >
    <td
      v-for="(col, idx) in columns"
      :key="`skel-col-${row}-${idx}`"
      class="px-4 py-3.5"
      :class="col === 'actions' ? 'text-right' : ''"
    >
      <!-- Action icon buttons skeleton -->
      <div v-if="col === 'actions'" class="flex items-center justify-end gap-1.5">
        <span class="w-7 h-7 rounded-lg shimmer-skeleton inline-block"></span>
        <span class="w-7 h-7 rounded-lg shimmer-skeleton inline-block"></span>
        <span class="w-7 h-7 rounded-lg shimmer-skeleton inline-block"></span>
      </div>

      <!-- Status / RSVP badge pill skeleton -->
      <span
        v-else-if="col === 'pill'"
        class="inline-block h-5 w-16 rounded-full shimmer-skeleton"
      ></span>

      <!-- Secondary / date / phone text skeleton -->
      <span
        v-else-if="col === 'muted'"
        class="inline-block h-3.5 rounded-md shimmer-skeleton"
        :class="row % 2 === 0 ? 'w-20' : 'w-24'"
      ></span>

      <!-- Primary name / title text skeleton -->
      <span
        v-else
        class="inline-block h-4 rounded-md shimmer-skeleton"
        :class="row % 3 === 0 ? 'w-36' : row % 2 === 0 ? 'w-28' : 'w-32'"
      ></span>
    </td>
  </tr>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    rows?: number
    columns?: Array<'text' | 'muted' | 'pill' | 'actions'>
  }>(),
  {
    rows: 6,
    columns: () => ['text', 'muted', 'pill', 'actions']
  }
)
</script>
