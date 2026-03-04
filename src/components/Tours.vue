<template>
  <section id="tours" class="scroll-mt-[180px] bg-sky-200 py-8">
    <main class="container mx-auto max-w-7xl px-4">

      <!-- Section Header -->
      <header class="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <h2
          class="font-garamond text-primary text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl"
        >
          Featured Tours
        </h2>

        <!-- Navigation -->
        <nav
          v-if="tours.length > toursPerPage"
          class="flex gap-3"
          aria-label="Tour Carousel Controls"
        >
          <button
            @click="prevSlide"
            class="rounded-full bg-white p-2 text-cyan-900 shadow-md transition hover:bg-cyan-100"
            aria-label="Previous tour"
          >
            <Icon icon="line-md:arrow-small-left" width="24" height="24" />
          </button>

          <button
            @click="nextSlide"
            class="rounded-full bg-white p-2 text-cyan-900 shadow-md transition hover:bg-cyan-100"
            aria-label="Next tour"
          >
            <Icon icon="line-md:arrow-small-right" width="24" height="24" />
          </button>
        </nav>
      </header>

      <!-- Tours Grid -->
      <section>
        <ul
          class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <li
            v-for="tour in visibleTours"
            :key="tour.id"
            class="overflow-hidden rounded-lg bg-white shadow-md transition hover:scale-[1.02]"
          >
            <article
              @click="$emit('open-tour', tour)"
              class="cursor-pointer"
            >
              <figure class="relative">

                <!-- Image -->
                <img
                  :src="assetUrl('/uploads/resized/' + tour.image)"
                  :alt="tour.title"
                  class="h-64 w-full object-cover"
                />

                <!-- Discount Badge -->
                <figcaption
                  v-if="tour.discount > 0"
                  class="absolute right-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white"
                >
                  -{{ tour.discount }}% OFF
                </figcaption>

                <!-- Card Body -->
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

                  <!-- Title -->
                  <div class="my-3 border-y py-2">
                    <h3
                      class="flex h-20 items-center justify-center text-center text-lg font-semibold text-blue-800"
                    >
                      {{ tour.title }}
                    </h3>
                  </div>

                  <!-- Info -->
                  <div class="mb-4 flex justify-between text-sm font-semibold text-gray-600">
                    <span>{{ tour.duration }} hours</span>
                    <span>{{ tour.maxpers }} pers</span>
                  </div>

                  <!-- Price -->
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
                      aria-label="Book tour"
                      class="rounded-full bg-green-950 p-2 text-white transition hover:bg-green-700"
                    >
                      <Icon
                        icon="icon-park-solid:shopping"
                        width="18"
                        height="18"
                      />
                    </button>
                  </footer>

                </section>
              </figure>
            </article>
          </li>
        </ul>
      </section>

      <!-- Pagination dots -->
      <nav
        class="mt-6 flex justify-center gap-2"
        aria-label="Carousel pagination"
      >
        <button
          v-for="n in totalSlides"
          :key="n"
          @click="currentSlide = n - 1"
          :class="[
            'h-3 w-3 rounded-full transition',
            currentSlide === n - 1 ? 'bg-cyan-950' : 'bg-gray-400'
          ]"
          :aria-label="'Go to slide ' + n"
        />
      </nav>

    </main>
  </section>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { apiUrl } from "../api.js";
// import TourDetail from "./TourDetail.vue";
import { assetUrl } from "../api";
const fotoUrl = assetUrl;

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
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
