<template>
  <section id="discounts" class="scroll-mt-40 bg-green-100 py-8">
    <main class="container mx-auto max-w-7xl px-4">
      <!-- section header -->
      <div class="mb-4 text-center">
        <div class="flex flex-col items-center justify-center md:flex-row">
          <div>
            <h2
              class="font-garamond text-primary text-2xl font-bold sm:text-3xl md:text-4xl">
              Discounts
            </h2>
            <p class="mx-auto max-w-2xl text-lg text-gray-800">
              <span v-if="tours.length === 0">
                No tours with discount at the moment
              </span>
              <span v-else>Limited time discount for these tours</span>
            </p>
          </div>
          <div class="ml-8 flex flex-row items-center justify-end">
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
        </div>
        <nav
          v-if="tours.length > toursPerPage"
          class="flex justify-end space-x-4"
          aria-label="Tour Carousel Controls">
          <button
            @click="prevSlide"
            class="rounded-full bg-white p-2 text-cyan-900 shadow-md transition-colors hover:bg-cyan-100"
            aria-label="Previous tour">
            <Icon icon="line-md:arrow-small-left" width="24" height="24" />
          </button>
          <button
            @click="nextSlide"
            class="rounded-full bg-white p-2 text-cyan-900 shadow-md transition-colors hover:bg-cyan-100"
            aria-label="Next tour">
            <Icon icon="line-md:arrow-small-right" width="24" height="24" />
          </button>
        </nav>
      </div>
      <section class="relative mx-auto w-3/4 overflow-hidden">
        <ul
          class="grid grid-cols-1 items-center gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          <li
            v-for="tour in visibleTours"
            :key="tour.id"
            class="hover:scale-102 overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300">
            <article @click="$emit('open-tour', tour)" class="cursor-pointer">
              <figure class="relative">
                <img
                  :src="assetUrl('/uploads/resized/' + tour.image)"
                  :alt="tour.title"
                  class="h-64 w-full object-cover" />
                <figcaption
                  v-if="tour.discount > 0"
                  class="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                  -{{ tour.discount }}% OFF
                </figcaption>

                <button
                  class="absolute left-3 top-3 rounded-full bg-white p-2 text-gray-700 shadow-md hover:bg-cyan-100"
                  aria-label="Add to wishlist">
                  <Icon icon="line-md:heart" width="18" height="18" />
                </button>
                <section class="bg-sky-100 p-4">
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
                    <span class="ml-1 text-sm text-gray-500"
                      >({{ tour.rating }})</span
                    >
                  </div>
                  <div class="my-2 border-b border-t">
                    <h3
                      class="mb-2 ml-1 flex h-24 items-center text-center text-lg font-semibold text-blue-800">
                      {{ tour.title }}
                    </h3>
                  </div>
                  <div
                    class="mb-4 flex items-center justify-between gap-2 font-semibold">
                    <div>
                      <span class="text-sm text-gray-600"
                        >{{ tour.duration }} hours</span
                      >
                    </div>
                    <div>
                      <span class="text-sm text-gray-600"
                        >{{ tour.maxpers }} pers</span
                      >
                    </div>
                  </div>
                  <footer class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span
                        v-if="tour.discount > 0"
                        class="mr-2 text-sm text-gray-500 line-through"
                        >€{{ Number(tour.price).toFixed(2) }}
                      </span>
                      <span class="text-lg font-bold text-cyan-600"
                        >€{{
                          (
                            Number(tour.price) *
                            (1 - tour.discount / 100)
                          ).toFixed(2)
                        }}</span
                      >
                    </div>
                    <button
                      aria-label="Book tour"
                      class="rounded-full bg-green-950 p-2 text-white transition-colors hover:bg-green-700">
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
        class="mt-6 flex justify-center space-x-2"
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
    </main>
  </section>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { apiUrl, assetUrl } from "../api.js";
//  Moved to App.vue
// import TourDetail from "./TourDetail.vue";
// const emit = defineEmits(["open-tour"]);

const currentSlide = ref(0);
const toursPerPage = ref(3);
const tours = ref([]);

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
  } else if (width >= 640 && width < 1024) {
    toursPerPage.value = 2;
  } else {
    toursPerPage.value = 3;
  }
};

const fetchTours = async () => {
  try {
    console.log(
      "Fetching discount tours...",
      apiUrl("/public/tours/discounts"),
    );
    const response = await fetch(apiUrl("/public/tours/discounts"));
    const json = await response.json();

    tours.value = json;
  } catch (error) {
    console.error("Error fetching tours:", error);
  }
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
