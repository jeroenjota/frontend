<template>
  <article
    class="min-w-80 max-w-90 shrink-0 overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl"
  >
    <img
      :src="assetUrl('/uploads/resized/' + tour.image)"
      class="h-64 w-full object-cover"
    />

    <div class="space-y-2 p-4">

      <h3 class="text-lg font-bold">
        {{ tour.title }}
      </h3>

      <p class="text-sm text-gray-600">
        {{ tour.duration }}h / {{ tour.groupSize }} people
      </p>

      <p class="text-primary font-semibold">
        €{{ tour.price }}
      </p>

    </div>
  </article>
</template>

<script setup>
import { assetUrl } from "../api.js";
defineProps({
  tour: Object
});
</script>