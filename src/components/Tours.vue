<template>
  <section id="tours" class="py-16 scroll-mt-20 bg-green-100">
    <main class="container mx-auto px-4">
      <header class="flex justify-between items-center mb-8 mt-4">
        <h2 class="md:text-4xl text-3xl font-bold font-garamond text-primary">
          Featured Tours
        </h2>
        <nav
          class="flex justify-end space-x-4"
          aria-label="Tour Carousel Controls">
          <button
            @click="prevSlide"
            class="bg-white text-cyan-900 p-2 shadow-md rounded-full hover:bg-cyan-100 transition-colors"
            aria-label="Previous tour">
            <Icon icon="line-md:arrow-small-left" width="24" height="24" />
          </button>
          <button
            @click="nextSlide"
            class="bg-white text-cyan-900 p-2 shadow-md rounded-full hover:bg-cyan-100 transition-colors"
            aria-label="Next tour">
            <Icon icon="line-md:arrow-small-right" width="24" height="24" />
          </button>
        </nav>
      </header>
      <section class="relative overflow-hidden">
        <ul
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <li
            v-for="tour in visibleTours"
            :key="tour.id"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:scale-105">
            <article @click="openTour(tour)" class="cursor-pointer">
              <figure class="relative">
                <img
                  :src="api('/images/' + tour.image + '.jpg')"
                  :alt="tour.title"
                  class="w-full h-64 object-cover" />
                <figcaption
                  v-if="tour.discount > 0"
                  class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{{ tour.discount }}% OFF
                </figcaption>

                <button
                  class="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-cyan-100 text-gray-700"
                  aria-label="Add to wishlist">
                  <Icon icon="line-md:heart" width="18" height="18" />
                </button>
                <section class="p-4">
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
                    <span class="text-sm text-gray-500 ml-1"
                      >({{ tour.rating }})</span
                    >
                  </div>
                  <h3 class="text-lg font-semibold text-gray-800 mb-1">
                    {{ tour.title }}
                  </h3>
                  <footer class="flex items-center justify-between">
                    <div>
                      <span
                        v-if="tour.discount > 0"
                        class="text-sm text-gray-500 line-through mr-2"
                        >€{{ tour.price.toFixed(2) }}
                      </span>
                      <span class="text-lg font-bold text-cyan-600"
                        >€{{
                          (tour.price * (1 - tour.discount / 100)).toFixed(2)
                        }}</span
                      >
                    </div>
                    <button
                      aria-label="Book tour"
                      class="p-2 bg-green-950 rounded-full text-white hover:bg-green-700 transition-colors">
                      <Icon
                        icon="icon-park-solid:shopping"
                        width="18"
                        height="18" />
                    </button>
                  </footer>
                </section>
              </figure>
            </article>
          </li>
        </ul>
      </section>
      <!-- Slide pagination -->
      <nav
        class="flex justify-center mt-6 space-x-2"
        aria-label="Carousel pagination">
        <button
          v-for="n in totalSlides"
          :key="n"
          @click="currentSlide = n - 1"
          :class="[
            'w-3 h-3 rounded-full',
            currentSlide === n - 1 ? 'bg-cyan-950' : 'bg-gray-400',
          ]"
          aria-label="'Go to slide ' + n"></button>
      </nav>
    <TourDetail
      v-if="showTourDetail"
      :key="selectedTour?.id"
      :tour="selectedTour"
      @close="closeTour" />
    </main>
  </section>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { api } from "../api.js";
import TourDetail from "./TourDetail.vue";

const currentSlide = ref(0);
const toursPerPage = ref(4);
const tours = ref([]);
const selectedTour = ref(null);
const showTourDetail = ref(false);

const API_URL = import.meta.env.VITE_API_URL;

const totalSlides = computed(() => {
  return Math.ceil(tours.value.length / toursPerPage.value);
});
const visibleTours = computed(() => {
  const start = currentSlide.value * toursPerPage.value;
  const tourSet = tours.value.slice(start, start + toursPerPage.value);
  return tourSet;
});

const nextSlide = () => {
  currentSlide.value =
    currentSlide.value === totalSlides.value - 1 ? 0 : currentSlide.value + 1;
};
const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? totalSlides.value - 1 : currentSlide.value - 1;
};

const handleResize = () => {
  const width = window.innerWidth;
  if (width < 640) {
    toursPerPage.value = 1;
  } else if (width >= 640 && width < 768) {
    toursPerPage.value = 2;
  } else if (width >= 768 && width < 1024) {
    toursPerPage.value = 3;
  } else {
    toursPerPage.value = 4;
  }
};

const fetchTours = async () => {
  try {
    const response = await fetch(api("/tours"));
    const json = await response.json();

    tours.value = json.data;
  } catch (error) {
    console.error("Error fetching tours:", error);
  }
};

const openTour = async (tour) => {
  const res = await fetch(`${API_URL}/tours/${tour.id}`);
  selectedTour.value = await res.json();
  showTourDetail.value = true;
};

const closeTour = () => {
  selectedTour.value = null;
  showTourDetail.value = false;
};

onMounted(() => {
  fetchTours();
  handleResize();
  window.addEventListener("resize", handleResize);
  // Fetch tours data from an API or local data source
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
