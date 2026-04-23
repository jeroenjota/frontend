<template>
<section id="tours" class="scroll-mt-45 bg-sky-200 py-8">
  <main class="mx-auto max-w-7xl px-4">

    <!-- HEADER -->
    <header class="mb-6 flex items-center justify-between">
      <h2 class="font-garamond text-primary text-4xl font-bold">
        Featured Tours
      </h2>

      <div class="flex gap-3">
        <button
          @click="scrollLeft"
          class="rounded-full bg-white p-2 shadow hover:bg-sky-100"
        >
          <Icon icon="line-md:arrow-small-left" width="28" />
        </button>

        <button
          @click="scrollRight"
          class="rounded-full bg-white p-2 shadow hover:bg-sky-100"
        >
          <Icon icon="line-md:arrow-small-right" width="28" />
        </button>
      </div>
    </header>

    <!-- CAROUSEL -->
    <div class="relative">

      <ul
        ref="carousel"
        class="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth"
      >

        <li
          v-for="tour in tours"
          :key="tour.id"
          class="min-w-[85%] shrink-0 sm:min-w-[45%] lg:min-w-[30%]"
        >

          <article
            @click="$emit('open-tour', tour)"
            class="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition hover:scale-[1.02]"
          >

            <!-- IMAGE -->
            <figure class="relative">

              <img
                :src="assetUrl('/uploads/resized/' + tour.image)"
                :alt="tour.title"
                class="h-64 w-full object-cover"
              />

              <figcaption
                v-if="tour.discount > 0"
                class="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white"
              >
                -{{ tour.discount }}%
              </figcaption>

              <!-- CARD -->
              <section class="bg-sky-100 p-4">

                <!-- Rating -->
                <div class="flex items-center">
                  <Icon
                    v-for="i in 5"
                    :key="i"
                    icon="line-md:star-alt-filled"
                    width="16"
                    height="16"
                    :class="i <= Math.floor(tour.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'"
                  />
                  <span class="ml-1 text-sm text-gray-500">
                    ({{ Number(tour.rating).toFixed(1) }})
                  </span>
                </div>

                <!-- TITLE -->
                <div class="my-3 border-y py-2">
                  <h3
                    class="flex h-20 items-center justify-center text-center text-lg font-semibold text-blue-800"
                  >
                    {{ tour.title }}
                  </h3>
                </div>

                <!-- INFO -->
                <div class="mb-4 flex justify-between text-sm font-semibold text-gray-600">
                  <span>{{ tour.duration }} hours</span>
                  <span>{{ tour.groupsize }} pers</span>
                </div>

                <!-- PRICE -->
                <footer class="flex items-center justify-between">

                  <div>
                    <span
                      v-if="tour.discount > 0"
                      class="mr-2 text-sm text-gray-500 line-through"
                    >
                      {{
                        new Intl.NumberFormat("nl-NL", {
                          style: "currency",
                          currency: "EUR",
                        }).format(tour.price)
                      }}
                    </span>

                    <span class="text-lg font-bold text-cyan-600">
                      {{
                        new Intl.NumberFormat("nl-NL", {
                          style: "currency",
                          currency: "EUR",
                        }).format(
                          Number(tour.price) * (1 - tour.discount / 100)
                        )
                      }}
                    </span>
                  </div>

                  <button
                    class="rounded-full bg-green-950 p-2 text-white hover:bg-green-700"
                  >
                    <Icon icon="icon-park-solid:shopping" width="18" />
                  </button>

                </footer>

              </section>
            </figure>

          </article>
        </li>

      </ul>
    </div>
  </main>
</section></template>
<script setup>
import { Icon } from "@iconify/vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { apiUrl } from "../api.js";
// import TourDetail from "./TourDetail.vue";
import { assetUrl } from "../api";

const currentSlide = ref(0);
const toursPerPage = ref(4);
const tours = ref([]);

const totalSlides = computed(() => {
  return Math.ceil(tours.value.length / toursPerPage.value);
});

const visibleTours = computed(() => {
  const start = (currentSlide.value * toursPerPage.value);
  const tourSet = tours.value.slice(start, start + toursPerPage.value);
  return tourSet;
});

const carousel = ref(null);

const scrollLeft = () => {
  carousel.value.scrollBy({
    left: -carousel.value.offsetWidth,
    behavior: "smooth",
  });
};

const scrollRight = () => {
  carousel.value.scrollBy({
    left: carousel.value.offsetWidth,
    behavior: "smooth",
  });
};
const nextSlide = () => {
  currentSlide.value =
    currentSlide.value === totalSlides.value - 1 ? 0 : currentSlide.value + 1;
};
const prevSlide = () => {
  currentSlide.value =
    currentSlide.value === 0 ? totalSlides.value - 1 : currentSlide.value - 1;
};


const fetchTours = async () => {
  try {
    const response = await fetch(apiUrl("/public/tours"));
    const json = await response.json();
    // console.log("Fetched tours data:", json);
    tours.value = json;
  } catch (error) {
    console.error("Error fetching tours:", error);
  }
};

onMounted(() => {
  fetchTours();
  // Fetch tours data from an API or local data source
    // console.log("carousel ref:", carousel.value);

});

</script>
