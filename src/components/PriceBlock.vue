<template>
  <div class="flex flex-row items-center justify-end gap-2">
    <span
      v-if="tour.discount > 0"
      class="text-shadow-2xs rounded-2xl bg-red-500 p-2 text-sm font-bold text-white"
      >
      -{{ tour.discount }}%
    </span>
    <div class="flex flex-col justify-end gap-1 text-right">
      <span
        v-if="tour.discount > 0"
        class="mr-2 line-through"
        :class="darkText ? 'text-gray-500' : 'text-gray-300'">
        {{
          new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(tour.price)
        }}
      </span>
      <span class="text-lg font-bold" :class="darkText ? 'text-primary' : 'text-white'">
        <span v-if="tour.transportation==='Car'"></span>
        {{
          new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(Number(tour.price) * (1 - Number(tour.discount || 0) / 100))
        }}
      </span>
      <span v-if="tour.pprice > 0" :class="darkText ? 'text-primary' : 'text-white'" >
        +
        {{
          new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(Number(tour.pprice))
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
  darkText: Boolean,
});
</script>
