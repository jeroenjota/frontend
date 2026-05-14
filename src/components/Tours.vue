<template>
  <section id="tours" class="scroll-mt-45 bg-cyan-800 py-4">
    <main class="mx-auto max-w-7xl px-4">
      <h2
        class="font-garamond mb-2 text-center text-2xl font-bold text-gray-300 sm:text-4xl">
        Featured Tours
      </h2>

      <div class="relative z-0 rounded-2xl p-2 shadow-lg">
        <!-- LEFT BUTTON -->
        <button
          @mouseenter="startAutoScroll('right')"
          @click="startAutoScroll('right')"
          class="z-500 top-19/20 group absolute left-4 -translate-y-1/2 rounded-full bg-white/70 p-3 shadow-lg backdrop-blur transition hover:scale-110 hover:bg-white">
          <svg
            class="h-6 w-6 text-gray-700 transition group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <!-- RIGHT BUTTON -->
        <button
          @mouseenter="startAutoScroll('left')"
          @click="startAutoScroll('left')"
          class="z-500 top-19/20 group absolute right-4 -translate-y-1/2 rounded-full bg-white/70 p-3 shadow-lg backdrop-blur transition duration-200 hover:scale-110 hover:bg-white active:scale-95">
          <svg
            class="h-6 w-6 text-gray-700 transition group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- fade -->
        <div
          class="bg-linear-to-r w-50 pointer-events-none absolute left-0 top-0 h-full from-gray-200"></div>
        <div
          class="bg-linear-to-l w-50 pointer-events-none absolute right-0 top-0 h-full from-gray-200"></div>

        <!-- CAROUSEL -->
        <div
          ref="carousel"
          @mouseenter="pauseAutoScroll"
          @mouseleave="resumeAutoScroll"
          class="flex gap-6 overflow-x-auto scroll-smooth pb-6 pt-8">
          <TourCard
            v-for="tour in tours"
            :key="tour.id"
            :tour="tour"
            @click="$emit('open-tour', tour)"
            class="tour-card"
            ref="cards" />
        </div>
      </div>
    </main>
  </section>
</template>
<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount, watch } from "vue";
import TourCard from "./TourCard.vue";
import { apiUrl } from "../api.js";

const props = defineProps({
  modalOpen: Boolean,
});

const tours = ref([]);
const carousel = ref(null);
const cards = ref([]);

let direction = 1;
let speed = 6;
let running = true;
let rafId = null;

// fetch tours
const fetchTours = async () => {
  try {
    const res = await fetch(apiUrl("/public/tours?current=true"));

    if (!res.ok) {
      throw new Error(`Failed to fetch tours: ${res.status}`);
    }

    tours.value = await res.json();

    await nextTick();
    updateCardScale();
  } catch (error) {
    console.error("Failed to load tours", error);
    tours.value = [];
  }
};

// auto scroll engine
const autoScroll = () => {
  if (!carousel.value || !running) {
    return;
  }

  const el = carousel.value;
  const max = el.scrollWidth - el.clientWidth;

  const distance = direction === 1 ? max - el.scrollLeft : el.scrollLeft;

  // const easing = Math.min(distance / 200, 1);

  el.scrollLeft += direction * speed;

  // reverse direction
  if (distance < 2) {
    direction *= -1;
  }

  updateCardScale();

  rafId = requestAnimationFrame(autoScroll);
};

const startAutoScroll = (dir = "right") => {
  if (props.modalOpen) return   // nooit starten als modal open
  direction = dir === "left" ? -1 : 1
  if (!rafId) rafId = requestAnimationFrame(autoScroll)
}

const stopAutoScroll = () => {

  if(rafId){
    cancelAnimationFrame(rafId)
    rafId = null
  }

}
const pauseAutoScroll = stopAutoScroll

const resumeAutoScroll = () => {
  if (props.modalOpen) return
  startAutoScroll(direction === 1 ? "right" : "left");
};

// center focus cards
const updateCardScale = () => {
  if (!carousel.value) return;

    cards.value.forEach((card) => {
    const el = card.$el;
    const rect = el.getBoundingClientRect();

    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(window.innerWidth / 2 - cardCenter);

    const scale = Math.max(0.85, 1.15 - distance / 800);

    el.style.transform = `scale(${scale})`;
    el.style.zIndex = Math.round(scale * 100);
  });
};

// modal pause
watch(() => props.modalOpen, (open) => {

  if(open){
    // stop met kleine delay zodat we niet net een frame doorscrollen
    setTimeout(() => {
      stopAutoScroll()
      console.log("Modal open – autoScroll gestopt")
    }, 50)  // 50ms werkt meestal goed
  } else {
    // start pas als modal volledig gesloten is
    startAutoScroll("right")
  }

})
onMounted(async () => {
  await fetchTours();

  requestAnimationFrame(autoScroll);

  carousel.value.addEventListener("scroll", updateCardScale);

  if(!props.modalOpen){
    startAutoScroll("right")
  }

});

onBeforeUnmount(() => {
  running = false;
});
</script>
