<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click.self="emit('close')">
    <div
      class="max-h-[95vh] rounded-lg border-4 border-blue-500 bg-sky-100 p-2 shadow-2xl sm:max-h-[85vh]">
      <div
        class="max-w-200 max-h-[75vh] w-full overflow-hidden overflow-y-auto overscroll-contain rounded-lg bg-sky-100 shadow-2xl sm:max-h-[75vh]">
        <div class="flex flex-col gap-2 md:flex-row md:justify-center">
          <div class="max-w-140 justify-left flex items-center bg-sky-100">
            <!-- CAROUSEL -->
            <div
              class="relative flex justify-center bg-sky-100 p-2"
              @mouseenter="stopAutoplay"
              @mouseleave="autoplay && startAutoplay()">
              <!-- Loading -->
              <div
                v-if="loading"
                class="flex h-64 items-center justify-center text-gray-500">
                Laden…
              </div>
              <!-- Foto + controls wrapper -->
              <div v-else class="inline-flex flex-col items-center">
                <!-- Foto -->
                <div class="flex aspect-video items-center justify-center">
                  <img
                    :src="
                      assetUrl('/uploads/resized/' + fotos[current].filename)
                    "
                    width="600"
                    height="400"
                    class="max-h-full max-w-full rounded object-contain"
                    @click="openLightbox" />
                </div>
                <!-- Controls (zelfde breedte als img) -->
                <div
                  v-if="fotos.length > 1"
                  class="group mt-2 flex w-full items-center justify-between rounded bg-transparent px-2 py-0 text-sm text-gray-700 transition">
                  <!-- Vorige -->
                  <button
                    class="flex h-9 w-9 items-center justify-center rounded text-gray-600 transition hover:bg-gray-300 hover:text-gray-900"
                    @click.stop="prev"
                    aria-label="Vorige foto">
                    <span class="text-2xl leading-none">‹</span>
                  </button>
                  <!-- Play / Pause -->
                  <button
                    class="flex h-9 w-9 items-center justify-center rounded text-gray-600 transition hover:bg-gray-300 hover:text-gray-900"
                    @click.stop="
                      autoplay ? stopAutoplay() : startAutoplay();
                      autoplay = !autoplay;
                    ">
                    {{ autoplay ? "❚❚" : "▶" }}
                  </button>
                  <!-- Volgende -->
                  <button
                    class="flex h-9 w-9 items-center justify-center rounded text-gray-600 transition hover:bg-gray-300 hover:text-gray-900"
                    @click.stop="next"
                    aria-label="Volgende foto">
                    <span class="text-2xl leading-none">›</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- LIGHTBOX -->
          <transition name="fade">
            <div
              v-if="lightboxOpen"
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
              @click.self="closeLightbox">
              <!-- Sluitknop -->
              <button
                class="absolute right-4 top-4 text-3xl text-white/80 hover:text-white"
                aria-label="Sluiten"
                @click="closeLightbox">
                ×
              </button>
              <!-- Afbeelding -->
              <img
                :src="assetUrl('/uploads/original/' + fotos[current].filename)"
                class="max-h-full max-w-full cursor-zoom-out rounded-lg object-contain shadow-2xl"
                @click="closeLightbox" />
            </div>
          </transition>
          <!-- CONTENT -->
          <div class="flex-2 flex flex-col p-4">
            <h3 class="font-semibold">
              Max:
              <span class="text-lg font-medium">{{ tour.maxpers }} ppl</span>
            </h3>
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
              <div
                class="gap-px-4 mb-4 mt-2 grid w-full grid-cols-2 py-2 text-sm text-blue-900">
                <span v-for="category in categories" :key="category.id"
                  >{{ category.name }}
                  <!-- <CheckIcon class="inline h-4 w-4 text-blue-600" /> -->
                </span>
              </div>
              <p class="mb-4 whitespace-pre-line">
                {{ tour.description }}
              </p>
              <AvailabilityCalendar
                v-if="tour && tour.fromDate && tour.tillDate"
                :tour-id="tour.id"
                :from-date="tour.fromDate"
                :till-date="tour.tillDate" />
            </div>
          </div>
        </div>
        <div class="flex w-full justify-center gap-8">
          <h2 class="mb-3 text-2xl font-bold">{{ tour.title }}</h2>
        </div>
        <div class="max-h-60 overflow-y-auto">
          <div
            class="prose prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-ul:list-none prose-ul:pl-0 w-full max-w-none bg-gray-100 px-4 py-2"
            v-html="tour.content"></div>
        </div>
      </div>
      <div class="flex flex-row items-center justify-between gap-4 bg-sky-100">
        <div class="p-4 text-right">
          <button
            class="bg-primary rounded px-4 py-2 text-white hover:bg-sky-900"
            @click="openMailForm">
            <InformationCircleIcon class="inline h-5 w-5" />
            Info request
          </button>
        </div>

        <div class="p-4 text-right">
          <button
            class="bg-primary rounded px-4 py-2 text-white hover:bg-sky-900"
            @click="emit('close')">
            Sluiten
          </button>
        </div>
      </div>
    </div>
    <ContactForm
      v-if="showMailForm"
      @close="showMailForm = false"
      :subject="'Tour Inquiry: ' + tour.title"
      :tourname="tour.title"></ContactForm>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
import { apiUrl, assetUrl } from "../api.js";
import DOMpurify from "dompurify";
import { CheckIcon, InformationCircleIcon } from "@heroicons/vue/16/solid";
import ContactForm from "./ContactForm.vue";
import AvailabilityCalendar from "./AvailabilityCalendar.vue";
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
const showMailForm = ref(false);

const autoplay = ref(true);
const intervalMs = 4000; // 4 seconden

const lightboxOpen = ref(false);

const openLightbox = () => {
  lightboxOpen.value = true;
  document.body.classList.add("overflow-hidden");
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.classList.remove("overflow-hidden");
};

let timer = null;

const fetchCategories = async () => {
  try {
    const res = await fetch(
      apiUrl(`/public/tours/${props.tour.id}/categories`),
    );
    categories.value = await res.json();
    // console.log("Fetched categories:", categories.value);
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

const openMailForm = () => {
  // console.log("Opening mail form for tour:", props.tour.title);
  showMailForm.value = true;
};

function handleKeydown(event) {
  // voorlopig niets, voorkomt de fout
}

// escape-to-close
onMounted(() => {
  const safeContent = DOMpurify.sanitize(props.tour.content) || "";
  props.tour.content = safeContent;
  props.tour.fromDate = props.tour.fromDate || "2024-01-01";
  props.tour.tillDate = props.tour.tillDate || "2099-12-31";
  const handleKeydown = (e) => {
    if (e.key === "Escape") {
      emit("close");
    }
  };
  window.addEventListener("keydown", handleKeydown);
  fetchFotos();
  fetchCategories();
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
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
