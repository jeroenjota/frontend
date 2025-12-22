<template>
  <div
    class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
    @click.self="emit('close')">
    <div
      class="bg-white w-full max-w-3xl rounded-lg overflow-hidden p-4 border-blue-500 border-4 shadow-2xl">
      <div class="flex flex-col md:flex-row md:justify-center gap-2">
        <div class=" bg-white flex items-center justify-left h-72">
          <!-- CAROUSEL -->

          <div
            class="relative w-full h-72 overflow-hidden bg-white p-4"
            @mouseenter="stopAutoplay"
            @mouseleave="autoplay && startAutoplay()">
            <!-- Loading state -->
            <div
              v-if="loading"
              class="flex items-center justify-center h-full text-gray-500">
              Laden…
            </div>

            <!-- Foto -->
            <div v-else class="flex items-center justify-center h-full w-full">
              <img
                :src="api('/images/' + fotos[current])"
                class="max-h-full object-contain" />
            </div>

            <!-- Vorige knop -->
            <button
              v-if="fotos.length > 1"
              class="absolute left-4 top-1/2 -translate-y-1/2 bg-blue-500/50 text-white px-3 py-1 rounded hover:bg-blue-500/80 transition"
              @click.stop="prev">
              ‹
            </button>

            <!-- Volgende knop -->
            <button
              v-if="fotos.length > 1"
              class="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-500/50 text-white px-3 py-1 rounded hover:bg-blue-500/80 transition"
              @click.stop="next">
              ›
            </button>

            <!-- Dots -->
            <div v-if="fotos.length > 1" class="flex gap-2 justify-center mt-3">
              <button
                v-for="(f, i) in fotos"
                :key="i"
                class="w-2.5 h-2.5 rounded-full transition"
                :class="i === current ? 'bg-blue-400' : 'bg-gray-200'"
                @click="current = i" />
            </div>

            <!-- Play/Pause knop -->
            <button
              v-if="fotos.length > 1"
              class="absolute top-5 right-5 bg-blue-500/50 text-white px-2 py-1 rounded hover:bg-blue-500/80 transition"
              @click.stop="
                autoplay ? stopAutoplay() : startAutoplay();
                autoplay = !autoplay;
              ">
              {{ autoplay ? "❚❚" : "▶" }}
            </button>
          </div>
        </div>
        <!-- CONTENT -->
        <div class="p-4 flex flex-col flex-1">
          <h2 class="text-2xl font-bold mb-3">{{ tour.title }}</h2>
          <p class="mb-4 whitespace-pre-line">
            {{ tour.description }}
          </p>
          <!-- details -->
          <div class="w-full mb-4">
            <h3 class="font-semibold mb-2">
              Price:
              <span
                v-if="tour.discount > 0"
                class="text-gray-500 line-through mr-2"
                >€{{ tour.price.toFixed(2) }}</span
              >
              <span class="font-bold text-cyan-600"
                >€{{
                  (tour.price * (1 - tour.discount / 100)).toFixed(2)
                }}</span
              >
            </h3>
            <h3 class="font-semibold">
              Duration:
              <span class="text-lg font-medium">{{ tour.duration }} hours</span>
            </h3>
            <h3 class="font-semibold">
              Group Size:
              <span class="text-lg font-medium"
                >max {{ tour.maxGroupsize }}</span
              >
            </h3>
          </div>
          <p>
            <a :href="tour.book" class="text-lg font-medium" target="_blank"
              >Book @ ToursByLocals
            </a>
          </p>
        </div>
      </div>
      <div class="w-full py-8 px-4 mb-4">
        <p>{{ tour.content }}</p>
      </div>
      <div class="text-right p-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded"
          @click="emit('close')">
          Sluiten
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { api } from "../api.js";
const props = defineProps({
  tour: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const fotos = ref([]);
const current = ref(0);
const loading = ref(true);

const autoplay = ref(true);
const intervalMs = 4000; // 4 seconden
let timer = null;

const fetchFotos = async () => {
  loading.value = true;
  try {
    const res = await fetch(api("/tours/" + props.tour.id));
    const data = await res.json();

    fotos.value = data.fotos || [];
    current.value = 0;
  } catch (e) {
    // ignore
    console.error("Error fetching fotos:", e);
  } finally {
    loading.value = false;
  }
};
//  carousel controls
const next = () => {
  current.value = (current.value + 1) % fotos.value.length;
};
const prev = () => {
  current.value = (current.value - 1 + fotos.value.length) % fotos.value.length;
};
// autoplay controls

const startAutoplay = () => {
  if (timer || fotos.value.length <= 1) return;
  timer = setInterval(() => {
    next();
  }, intervalMs);
};

const stopAutoplay = () => {
  clearInterval(timer);
  timer = null;
};

// escape-to-close
onMounted(() => {
  fetchFotos();
});

onUnmounted(() => {
  stopAutoplay();
});

watch(fotos)(() => {
  if (autoplay.value) {
    stopAutoplay();
    startAutoplay();
  }
});

watch(
  () => props.tour,
  () => {
    current.value = 0;
    fotos.value = [];
    fetchFotos();
  }
);
</script>
