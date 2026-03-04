<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4"
    @click.self="emit('close')">
    <div
      class="max-w-200 flex max-h-[95vh] w-full flex-col overflow-hidden rounded-lg border-4 border-blue-800 bg-gray-100 p-4 shadow-2xl">
      <!-- Header -->
      <div
        class="bg-primary mb-4 flex w-full flex-col gap-2 rounded-lg p-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <h2 class="text-xl font-bold sm:text-2xl">{{ tour.title }}</h2>
        <div class="flex flex-wrap gap-4 text-sm font-semibold sm:text-base">
          <span>{{ tour.duration }} hours</span>
          <span>{{ tour.groupSize }} people</span>
          <span>
            {{
              new Intl.NumberFormat("nl-NL", {
                style: "currency",
                currency: "EUR",
              }).format(tour.price)
            }}
          </span>
        </div>
      </div>

      <!-- Main: Carousel + Calendar -->
      <div class="flex flex-1 flex-col gap-4 overflow-hidden sm:flex-row">
        <!-- Carousel: 2/3 -->
        <div
          class="sm:flex-2 flex flex-1 flex-col items-center overflow-hidden rounded-lg border border-gray-500 bg-gray-100">
          <div
            class="relative flex w-full justify-center bg-gray-100 p-2"
            @mouseenter="stopAutoplay"
            @mouseleave="autoplay && startAutoplay()">
            <div
              v-if="loading"
              class="flex h-64 items-center justify-center text-gray-500">
              Laden…
            </div>
            <div v-else class="inline-flex w-full flex-col items-center">
              <div class="flex w-full justify-center">
                <img
                  :src="assetUrl('/uploads/resized/' + fotos[current].filename)"
                  class="max-h-64 w-full max-w-full rounded object-contain"
                  @click="openLightbox" />
              </div>
              <div
                v-if="fotos.length > 1"
                class="mt-2 flex w-full items-center justify-between text-sm text-gray-700">
                <button @click.stop="prev">‹</button>
                <button
                  @click.stop="autoplay ? stopAutoplay() : startAutoplay()">
                  {{ autoplay ? "❚❚" : "▶" }}
                </button>
                <button @click.stop="next">›</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar: 1/3 -->
        <div class="flex-1 overflow-auto rounded-lg border border-gray-500 bg-gray-100 p-2 sm:flex-1">
          <AvailabilityCalendar
            v-if="tour && tour.fromDate && tour.tillDate"
            :tour-id="tour.id"
            :from-date="tour.fromDate"
            :till-date="tour.tillDate"
            @select-time="openBooking" />
        </div>
      </div>
      <!-- Content: full width -->
      <div
        class="hover:prose-a:text-blue-800 mt-4 max-h-60 overflow-y-auto rounded-lg bg-gray-100 p-4">
        <div v-html="tour.content"></div>
      </div>

      <!-- Buttons: full width -->
      <div class="mt-4 flex flex-wrap justify-end gap-2">
        <button
          class="bg-primary rounded px-4 py-2 text-white hover:bg-sky-900"
          @click="openMailForm">
          <InformationCircleIcon class="mr-1 inline h-5 w-5" /> Info request
        </button>
        <button
          class="rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
          @click="emit('close')">
          Sluiten
        </button>
      </div>

      <!-- ContactForm modal -->
      <ContactForm
        v-if="showMailForm"
        @close="showMailForm = false"
        :subject="'Booking request: ' + tour.title"
        :mode="contactMode"
        :preferredDate="bookingDate"
        :startTime="bookingTime"
        :tourname="tour.title" />
    </div>
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
const contactMode = ref("booking"); // default
const bookingDate = ref("");
const bookingTime = ref("");

const autoplay = ref(true);
const intervalMs = 4000; // 4 seconden

const contactFormOpen = ref(false);

const openLightbox = () => {
  contactFormOpen.value = true;
  document.body.classList.add("overflow-hidden");
};

const closeLightbox = () => {
  contactFormOpen.value = false;
  document.body.classList.remove("overflow-hidden");
};

let timer = null;

function niceDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function openBooking({ date, time }) {
  bookingDate.value = niceDate(date);
  bookingTime.value = time;
  contactMode.value = "booking";
  showMailForm.value = true;
}

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
  contactMode.value = "info";
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
