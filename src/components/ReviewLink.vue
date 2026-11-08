<template>
  <a
    v-if="tour.reviewCount > 0"
    :href="`#reviews-tour-${tour.id}`"
    :aria-label="`Read ${tour.reviewCount} ${tour.reviewCount === 1 ? 'review' : 'reviews'} for ${tour.title}`"
    class="text-sm underline hover:no-underline"
    @click.stop="emit('navigate')">
    {{ tour.reviewCount }} {{ tour.reviewCount === 1 ? "review" : "reviews" }}
  </a>
</template>

<script setup>
import { Icon } from "@iconify/vue";
defineProps({ tour: { type: Object, required: true } });
const emit = defineEmits(["navigate"]);
</script>
