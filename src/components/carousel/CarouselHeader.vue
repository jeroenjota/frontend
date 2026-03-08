<template>
  <div class="mb-4 flex items-center justify-between">
    <h2 class="text-2xl font-bold">{{ title }}</h2>

    <div class="flex gap-2">
      <button
        class="rounded bg-gray-200 px-3 py-2 disabled:opacity-30"
        :disabled="!canScrollLeft"
        @click="$emit('left')">
        ←
      </button>

      <button
        class="rounded bg-gray-200 px-3 py-2 disabled:opacity-30"
        :disabled="!canScrollRight"
        @click="$emit('right')">
        →
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  canScrollLeft: Boolean,
  canScrollRight: Boolean,
});
</script>