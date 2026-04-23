<template>
  <div
    class="z-9999 fixed inset-0 flex items-center justify-center bg-black/60 p-2 sm:p-4"
    @click.self="emit('close')">
    <div
      class="max-w-200 flex max-h-[95vh] w-full flex-col overflow-hidden rounded-lg border-4 border-blue-800 bg-gray-100 p-4 shadow-2xl">
      <!-- Header -->
      <div
        class="bg-primary mb-4 flex w-full flex-col gap-1 rounded-lg p-4 text-white sm:flex-row sm:items-center sm:justify-between">
        <div class="flex-2 flex gap-1">
          <h2 class="text-xl font-bold sm:text-2xl">{{ tour.title }}</h2>
        </div>
        <div
          class="flex flex-1 flex-wrap gap-4 text-sm font-semibold sm:text-base">
          <span>{{ tour.duration }} h</span>
          <span>{{ tour.groupSize }} p</span>
          <PriceBlock :tour="tour" />
        </div>
      </div>

      <!-- Main: Carousel + Calendar -->
      <div class="flex min-h-fit flex-1 flex-col gap-1 overflow-hidden sm:flex-row">
        <!-- Carousel: 2/3 -->
        <div
          class="sm:flex-2 flex flex-1 flex-col items-center overflow-hidden rounded-lg border border-gray-100 bg-gray-100">
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
                <transition name="fade" mode="out-in">
                  <img
                    :key="fotos[current].filename"
                    :src="
                      assetUrl('/uploads/resized/' + fotos[current].filename)
                    "
                    class="max-h-64 w-full max-w-full rounded object-contain"
                    @click="openLightbox" />
                </transition>
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
        <div
          class="flex-1 overflow-auto rounded-lg border border-gray-500 bg-gray-100 p-2 sm:flex-1">
          <AvailabilityCalendar
            v-if="tour"
            :tour-id="tour.id"
            :from-date="safeFallbackFromDate"
            :till-date="safeFallbackTillDate"
            @select-time="openBooking" />
        </div>
      </div>
      <!-- info -->
      <div class="text-primary mt-2 w-full text-center text-lg font-semibold">
        {{ tour.description }}
      </div>
      <div class="w-full text-center italic hover:not-italic">
        Featuring: {{ listItems.join(", ") }}
      </div>
      <!-- Content: full width -->
      <div
        class="max-h-60 w-full overflow-y-auto rounded-lg border-2 border-gray-300 bg-gray-100 px-4 text-lg text-gray-800">
        <!-- <h3 class="mb-2 mt-4 text-lg font-bold">Description</h3> -->
        <div v-html="safeContent"></div>
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
        @togglePrivacy="$emit('togglePrivacy')"
        @toggleTerms="$emit('toggleTerms')"
        @close="showMailForm = false"
        :subject="'Booking request: ' + tour.title"
        :mode="contactMode"
        :preferredDate="bookingDate"
        :startTime="bookingTime"
        :tourname="tour.title"
        :max-group-size="tour.groupSize" />
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, watch, computed } from "vue";
import { apiUrl, assetUrl } from "../api.js";
import DOMpurify from "dompurify";
import { InformationCircleIcon } from "@heroicons/vue/16/solid";
import ContactForm from "./ContactForm.vue";
import AvailabilityCalendar from "./AvailabilityCalendar.vue";
import PriceBlock from "./PriceBlock.vue";
const props = defineProps({
  tour: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["togglePrivacy", "toggleTerms", "close"]);
const categories = ref([]);
const fotos = ref([]);
const current = ref(0);
const loading = ref(true);
const showMailForm = ref(false);
const contactMode = ref("booking"); // default
const bookingDate = ref("");
const bookingTime = ref("");

const autoplay = ref(true);
const intervalMs = 5000;

const safeContent = computed(() =>
  DOMpurify.sanitize(props.tour.content || "")
);
const safeFallbackFromDate = computed(() =>
  props.tour.fromDate || "2024-01-01"
);
const safeFallbackTillDate = computed(() =>
  props.tour.tillDate || "2099-12-31"
);

const listItems = computed(() => {
  if (!props.tour.itinerary) return [];
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = DOMpurify.sanitize(props.tour.itinerary);
  return Array.from(tempDiv.querySelectorAll("li")).map((li) =>
    li.textContent || "",
  );
});

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
  bookingDate.value = date.toISOString().split("T")[0];
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

function handleKeydown(e) {
  if (e.key === "Escape") {
    emit("close");
  }
}

// escape-to-close
onMounted(() => {
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
