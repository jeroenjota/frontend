<template>
  <section id="discounts" class="scroll-mt-45 bg-transparent px-4 py-8">
    <main class="mx-auto max-w-5xl rounded-md bg-white/60 p-4 shadow-lg backdrop-blur-md">
      <!-- HEADER -->
      <header class="mb-4 grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <button
          v-if="looping"
          type="button"
          aria-label="Scroll offers left"
          @mouseenter="startAutoScroll('right')"
          @click="startAutoScroll('left')"
          class="group rounded-full bg-white/70 p-3 shadow-lg backdrop-blur transition hover:scale-110 hover:bg-white">
          <svg
            class="h-6 w-6 text-gray-700 transition group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div v-else class="w-12"></div>
        <div class="text-center">
          <h2
            class="font-garamond text-primary text-center text-2xl font-bold sm:text-4xl">
            Discounts
          </h2>
          <p class="mx-auto max-w-2xl text-lg text-gray-800">
            <span v-if="tours.length === 0">
              No tours with discount at the moment
            </span>
            <span v-else>Limited time discount for these tours</span>
          </p>
        </div>

        <button
          v-if="looping"
          type="button"
          aria-label="Scroll offers right"
          @mouseenter="startAutoScroll('left')"
          @click="startAutoScroll('right')"
          class="group rounded-full bg-white/70 p-3 shadow-lg backdrop-blur transition hover:scale-110 hover:bg-white">
          <svg
            class="h-6 w-6 text-gray-700 transition group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div v-else class="w-12"></div>
      </header>

      <!-- CAROUSEL -->
      <div class="relative">
        <ul
          ref="carousel"
          @mouseenter="pauseAutoScroll"
          @mouseleave="resumeAutoScroll"
          @focusin="pauseForFocus"
          @focusout="resumeAfterFocus"
          class="flex gap-6 overflow-x-auto scroll-smooth">
          <li
            v-for="(tour, index) in displayedTours"
            :key="`${tour.id}-${index}`"
            class="min-w-[85%] sm:min-w-[45%] lg:min-w-[30%]">
            <article
              @click="$emit('open-tour', tour)"
              class="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition hover:scale-[1.02]">
              <!-- IMAGE -->
              <figure class="relative">
                <img
                  :src="assetUrl('/uploads/resized/' + tour.image)"
                  :alt="tour.title"
                  class="h-64 w-full object-cover" />

                <figcaption
                  v-if="tour.discount > 0"
                  class="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  -{{ tour.discount }}%
                </figcaption>

                <!-- CARD -->
                <section class="bg-white p-4">
                  <!-- Rating -->
                  <div class="flex items-center">
                    <Icon
                      v-for="i in 5"
                      :key="i"
                      icon="line-md:star-alt-filled"
                      width="16"
                      height="16"
                      :class="
                        i <= Math.floor(tour.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      " />
                    <div
                      class="flex w-full flex-row items-center justify-between">
                      <span class="ml-1 text-sm text-gray-500">
                        ({{ Number(tour.rating).toFixed(1) }} )
                      </span>
                      <ReviewLink :tour="tour" class="text-primary" />
                    </div>
                  </div>

                  <!-- TITLE -->
                  <div class="my-3 border-y py-2">
                    <h3
                      class="flex items-center justify-center text-center text-lg font-semibold text-blue-800">
                      {{ tour.title }}
                    </h3>
                  </div>

                  <!-- INFO -->
                  <div
                    class="mb-4 flex justify-between text-sm font-semibold text-gray-600">
                    <span>{{ tour.duration }} hours</span>
                    <span>{{ tour.groupSize }} people</span>
                  </div>

                  <!-- PRICE -->
                  <footer
                    class="flex items-center justify-between rounded bg-cyan-700 px-2 py-1 text-sm font-bold text-white">
                    <div class="flex flex-row gap-2">
                      <PriceBlock :tour="tour" />
                    </div>

                    <button
                      class="rounded-full bg-green-950 p-2 text-white hover:bg-green-700">
                      <Icon icon="icon-park-solid:shopping" width="18" />
                    </button>
                  </footer>
                </section>
              </figure>
            </article>
          </li>
        </ul>
      </div>
      <div
        v-if="showTourist"
        class="ml-8 flex flex-row items-center justify-end">
        <h2 class="">
          <img
            :src="assetUrl('/uploads/system/tourist_qrcode.png')"
            class="max-h-16 sm:max-h-20 md:max-h-24"
            alt="" />
        </h2>
        <p class="mx-auto max-w-2xl text-lg text-gray-800">
          Scan qr-code for more information
        </p>
      </div>
    </main>
  </section>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { computed, nextTick, ref, watch, onMounted, onBeforeUnmount } from "vue";
import { apiUrl, assetUrl } from "../api.js";
import PriceBlock from "./PriceBlock.vue";
import ReviewLink from "./ReviewLink.vue";
//  Moved to App.vue
// import TourDetail from "./TourDetail.vue";
// const emit = defineEmits(["open-tour"]);

const tours = ref([]);
const looping = ref(false);
const displayedTours = computed(() =>
  looping.value ? [...tours.value, ...tours.value] : tours.value,
);
const showTourist = ref(false);
const props = defineProps({
  modalOpen: Boolean,
});
const carousel = ref(null);

let direction = 1;
let mounted = false;
let rafId = null;
let pointerInside = false;
let focusInside = false;

const stopAutoScroll = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

const autoScroll = () => {
  rafId = null;
  const el = carousel.value;
  if (!el || props.modalOpen || pointerInside || focusInside) return;

  const firstCopy = el.children[tours.value.length];
  if (!looping.value || !firstCopy || !el.firstElementChild) return;

  const loopWidth = firstCopy.offsetLeft - el.firstElementChild.offsetLeft;
  if (loopWidth <= 0) return;
  const next = el.scrollLeft + direction;
  el.scrollTo({
    left: ((next % loopWidth) + loopWidth) % loopWidth,
    behavior: "instant",
  });
  rafId = requestAnimationFrame(autoScroll);
};

const startAutoScroll = (dir) => {
  if (dir) direction = dir === "left" ? -1 : 1;
  if (mounted && looping.value && rafId === null && !props.modalOpen && !pointerInside && !focusInside) {
    rafId = requestAnimationFrame(autoScroll);
  }
};

const pauseAutoScroll = () => {
  pointerInside = true;
  stopAutoScroll();
};

const resumeAutoScroll = () => {
  pointerInside = false;
  startAutoScroll();
};

const pauseForFocus = () => {
  focusInside = true;
  stopAutoScroll();
};

const resumeAfterFocus = (event) => {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  focusInside = false;
  startAutoScroll();
};

const updateLoop = async () => {
  const el = carousel.value;
  if (!el) return;

  const first = el.firstElementChild;
  const last = el.children[tours.value.length - 1];
  looping.value = Boolean(
    first && last && last.offsetLeft + last.offsetWidth - first.offsetLeft > el.clientWidth,
  );
  await nextTick();
  if (!mounted) return;
  if (looping.value) startAutoScroll();
  else stopAutoScroll();
};

watch(tours, updateLoop, { flush: "post" });

watch(() => props.modalOpen, (open) => {
  if (open) stopAutoScroll();
  else startAutoScroll();
});

const fetchTours = async () => {
  try {
    // console.log(
    //   "Fetching discount tours...",
    //   apiUrl("/public/tours/discounts"),
    // );
    const response = await fetch(apiUrl("/public/tours/discounts"));
    const json = await response.json();

    tours.value = json;
  } catch (error) {
    console.error("Error fetching tours:", error);
  }
};

onMounted(() => {
  mounted = true;
  fetchTours();
  window.addEventListener("resize", updateLoop);
});

onBeforeUnmount(() => {
  mounted = false;
  stopAutoScroll();
  window.removeEventListener("resize", updateLoop);
});
</script>
