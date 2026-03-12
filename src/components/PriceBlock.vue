<template>
  <div class="flex flex-row items-center justify-end gap-2">
    <span v-if="tour.discount" class="text-sm font-bold text-yellow-500">
      -{{ tour.discount }}%
    </span>
    <div class="flex flex-col justify-end gap-1 text-right">
      <span v-if="tour.discount > 0" class="mr-2 text-gray-300 line-through">
        {{
          new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(tour.price)
        }}
      </span>
      <span class="text-lg font-bold text-white">
        {{
          new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(Number(tour.price) * (1 - tour.discount / 100))
        }}
      </span>
      <span v-if="tour.pprice > 0">
        +
        {{
          new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(Number(tour.pprice) * (1 - tour.discount / 100))
        }}
        pp</span
      >
    </div>
  </div>
</template>

<script setup>
defineProps({
  tour: {
    type: Object,
    required: true,
  },
});
</script>
