<template>
  <section id="tours" class="scroll-mt-45 bg-transparent px-4 py-4">
    <main class="mx-auto max-w-5xl rounded-md bg-white/60 p-4 shadow-lg backdrop-blur-md">
      <h2 class="font-garamond text-primary mb-2 text-center text-2xl font-bold sm:text-4xl">
        All Tours
      </h2>

      <div class="rounded-2xl p-2 px-4 shadow-lg">
        <div
          class="tours-scroll overflow-y-scroll pr-3"
          :style="{ maxHeight: gridHeight }"
          tabindex="0"
          role="region"
          aria-label="All tours">
          <div ref="grid" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <TourCard
              v-for="tour in tours"
              :key="tour.id"
              :tour="tour"
              @click="$emit('open-tour', tour)" />
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import TourCard from "./TourCard.vue";
import { apiUrl } from "../api.js";

const tours = ref([]);
const grid = ref(null);
const gridHeight = ref("");
let resizeObserver;

const updateGridHeight = () => {
  const el = grid.value;
  if (!el || !el.children.length) {
    gridHeight.value = "";
    return;
  }

  const columns = getComputedStyle(el).gridTemplateColumns.split(" ").length;
  const visibleCards = columns * (columns === 1 ? 1 : 2);
  const first = el.children[0];
  const last = el.children[Math.min(visibleCards, el.children.length) - 1];
  gridHeight.value = `${last.offsetTop + last.offsetHeight - first.offsetTop}px`;
};

watch(tours, () => {
  if (!resizeObserver || !grid.value) return;
  resizeObserver.disconnect();
  resizeObserver.observe(grid.value);
  for (const card of grid.value.children) resizeObserver.observe(card);
  updateGridHeight();
}, { flush: "post" });

const fetchTours = async () => {
  try {
    const res = await fetch(apiUrl("/public/tours?current=true"));
    if (!res.ok) {
      throw new Error(`Failed to fetch tours: ${res.status}`);
    }
    tours.value = await res.json();
  } catch (error) {
    console.error("Failed to load tours", error);
    tours.value = [];
  }
};

onMounted(() => {
  resizeObserver = new ResizeObserver(updateGridHeight);
  resizeObserver.observe(grid.value);
  fetchTours();
});

onBeforeUnmount(() => {
  resizeObserver.disconnect();
});
</script>

<style scoped>
.tours-scroll {
  scrollbar-gutter: stable;
  scrollbar-color: #0e7490 #e0f2fe;
  scrollbar-width: auto;
}

.tours-scroll::-webkit-scrollbar {
  width: 12px;
}

.tours-scroll::-webkit-scrollbar-track {
  background: #e0f2fe;
  border-radius: 6px;
}

.tours-scroll::-webkit-scrollbar-thumb {
  background: #0e7490;
  border: 2px solid #e0f2fe;
  border-radius: 6px;
}
</style>
