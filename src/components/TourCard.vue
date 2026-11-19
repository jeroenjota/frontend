<template>
  <article
    class="min-w-0 overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-xl">
    <img
      :src="assetUrl('/uploads/resized/' + tour.image)"
      class="h-64 w-full object-cover" />

    <div class="space-y-2 p-4">
      <h3 class="text-lg font-bold">
        {{ tour.title }}
      </h3>

      <p class="text-sm text-gray-600">
        {{ tour.duration }}h / {{ tour.groupSize }} people
      </p>
      <div class="flex flex-row justify-between gap-1 rounded-xl bg-cyan-700 p-4">
        <PriceBlock :tour="tour" />
        <ReviewLink :tour="tour" class="text-white" />
      </div>
    </div>
  </article>
</template>

<script setup>
import { assetUrl } from "../api.js";
import PriceBlock from "./PriceBlock.vue";
import ReviewLink from "./ReviewLink.vue";
defineProps({
  tour: Object,
});
</script>
