<template>
  <div
    ref="container"
    class="flex gap-6 overflow-x-auto scroll-smooth pb-4">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  container: Object,
});
</script>