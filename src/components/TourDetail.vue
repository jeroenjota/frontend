<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click.self="emit('close')">
    <div
      class="w-full max-w-3xl overflow-hidden rounded-lg border-4 border-blue-500 bg-sky-100 p-4 shadow-2xl">
      <div class="flex flex-col gap-2 md:flex-row md:justify-center">
        <div class="justify-left flex items-center bg-sky-100">
          <!-- CAROUSEL -->
          <div
            class="relative w-full overflow-hidden bg-sky-100 p-2"
            @mouseenter="stopAutoplay"
            @mouseleave="autoplay && startAutoplay()">
            <!-- Loading state -->
            <div
              v-if="loading"
              class="flex h-full items-center justify-center text-gray-500">
              Laden…
            </div>

            <!-- Foto -->
            <div
              v-else
              class="flex aspect-video w-full items-center justify-center">
              <img
                :src="assetUrl('/uploads/original/' + fotos[current].filename)"
                width="600"
                height="400"
                class="max-h-full object-contain" />
            </div>
            <!-- Vorige knop -->
            <button
              v-if="fotos.length > 1"
              class="absolute left-4 top-1/2 -translate-y-1/2 rounded bg-blue-500/50 px-3 py-1 text-white transition hover:bg-blue-500/80"
              @click.stop="prev">
              ‹
            </button>

            <!-- Volgende knop -->
            <button
              v-if="fotos.length > 1"
              class="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-blue-500/50 px-3 py-1 text-white transition hover:bg-blue-500/80"
              @click.stop="next">
              ›
            </button>

            <!-- Dots -->
            <div v-if="fotos.length > 1" class="mt-3 flex justify-center gap-2">
              <button
                v-for="(f, i) in fotos"
                :key="i"
                class="h-2.5 w-2.5 rounded-full transition"
                :class="i === current ? 'bg-blue-400' : 'bg-gray-200'"
                @click="current = i" />
            </div>

            <!-- Play/Pause knop -->
            <button
              v-if="fotos.length > 1"
              class="absolute right-5 top-5 rounded bg-blue-500/50 px-2 py-1 text-white transition hover:bg-blue-500/80"
              @click.stop="
                autoplay ? stopAutoplay() : startAutoplay();
                autoplay = !autoplay;
              ">
              {{ autoplay ? "❚❚" : "▶" }}
            </button>
          </div>
        </div>
        <!-- CONTENT -->
        <div class="flex flex-1 flex-col p-4">
          <h3 class="font-semibold">
            Max:
            <span class="text-lg font-medium">{{ tour.maxpers }} ppl</span>
          </h3>
          <p class="mb-4 font-semibold">
            More info:
            <a
              :href="`mailto:jeroen@jota.nl?subject=${encodeURIComponent(
                'Tour Inquiry: ' + tour.title,
              )}`"
              class="text-blue-600 underline">
              Email us
            </a>
            </p>
          <!-- details -->
          <div class="mb-4 w-full">
            <h3 class="mb-2 font-semibold">
              Price:
              <span
                v-if="tour.discount > 0"
                class="mr-2 text-gray-500 line-through"
                >€{{ Number(tour.price).toFixed(2) }}</span
              >
              <span class="font-bold text-cyan-600"
                >€{{
                  (Number(tour.price) * (1 - tour.discount / 100)).toFixed(2)
                }}</span
              >
            </h3>
            <h3 class="font-semibold">
              Duration:
              <span class="text-lg font-medium">{{ tour.duration }} h</span>
            </h3>
          </div>
        </div>
      </div>
      <div class="flex w-full justify-center gap-8">
        <h2 class="mb-3 text-2xl font-bold">{{ tour.title }}</h2>
        <p class="mb-4 whitespace-pre-line">
          {{ tour.description }}
        </p>
      </div>
      <div class="max-h-60 overflow-y-auto">
        <div
          class="prose prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-ul:list-none prose-ul:pl-0 w-full max-w-none bg-gray-100 px-4 py-2"
          v-html="tour.content"></div>
      </div>
      <div
        class="mb-4 mt-2 grid w-full grid-cols-2 gap-2 bg-gray-200 px-4 py-2 text-sm font-extralight text-blue-700 sm:grid-cols-3 md:grid-cols-4">
        <span v-for="category in categories" :key="category.id"
          >{{ category.name }}
          <CheckIcon class="inline h-4 w-4 text-blue-600" />
        </span>
      </div>
      <div class="p-4 text-right">
        <button
          class="rounded bg-blue-600 px-4 py-2 text-white"
          @click="emit('close')">
          Sluiten
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { apiUrl,assetUrl } from "../api.js";
import DOMpurify from "dompurify";
import { CheckBadgeIcon, CheckIcon } from "@heroicons/vue/16/solid";
const props = defineProps({
  tour: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);
const categories = ref([]);
const fotos = ref([]);
const current = ref(0);
const loading = ref(true);

const autoplay = ref(true);
const intervalMs = 4000; // 4 seconden
let timer = null;

const fetchCategories = async () => {
  try {
    const res = await fetch(apiUrl(`/public/tours/${props.tour.id}/categories`));
    categories.value = await res.json();
  } catch (e) {
    console.error("Error fetching categories:", e);
  }
};

const fetchFotos = async () => {
  loading.value = true;
  try {
    // console.log("Fetching fotos for tour ID:", props.tour.id);
    const res = await fetch(apiUrl(`/public/tours/${props.tour.id}/photos`));

    fotos.value = await res.json();
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
  const safeContent = DOMpurify.sanitize(props.tour.content) || "";
  props.tour.content = safeContent;
  fetchFotos();
  fetchCategories();
});

onUnmounted(() => {
  stopAutoplay();
});

watch(fotos, () => {
  if (autoplay.value) {
    stopAutoplay();
    startAutoplay();
  }
});
watch(
  () => props.tour,
  (newTour, oldTour) => {
    if (!newTour || newTour?.id === oldTour?.id) return;

    current.value = 0;
    fotos.value = [];
    fetchFotos();
  },
  { immediate: true },
);
</script>
