<template>
  <section id="reviews" class="scroll-mt-45 bg-transparent px-4 py-8">
    <main class="mx-auto max-w-5xl rounded-md bg-white/60 p-4 shadow-lg backdrop-blur-md">
      <!-- HEADER -->
      <header class="mb-4 flex flex-col items-center justify-between">
        <div class="flex flex-row items-baseline justify-around gap-6">
          <h2
            :id="selectedTourId ? `reviews-tour-${selectedTourId}` : undefined"
            class="font-garamond text-primary scroll-mt-45 text-center text-2xl font-bold sm:text-4xl">
            Reviews
            <span v-if="visibleReviews.length"></span>
          </h2>
            <span class="text-primary whitespace-nowrap text-center" v-if="averageStars !== null">
              {{ averageStars.toFixed(1) }} / 5
              <Icon icon="line-md:star-alt-filled" aria-label="stars" class="inline h-6 w-6" />
            </span>
            </div>
            <div>
          <p v-if="selectedTourId" class="text-primary text-center">
            {{ selectedTourTitle }}
            <a href="#reviews" class="ml-2 text-sm underline">All reviews</a>
          </p>
          <p class="mx-auto max-w-2xl text-lg text-gray-800">
            <span v-if="loading">Loading reviews...</span>
            <span v-else-if="error" role="alert">{{ error }}</span>
            <span v-else-if="visibleReviews.length === 0">
              No reviews at the moment
            </span>
          </p>
        </div>

        <div v-if="canScrollLeft || canScrollRight" class="flex gap-3">
          <button
            type="button"
            aria-label="Previous reviews"
            :disabled="!canScrollLeft"
            @click="scrollLeft"
            class="rounded-full bg-white p-2 shadow hover:bg-sky-100 disabled:opacity-30">
            <Icon icon="line-md:arrow-small-left" width="28" />
          </button>

          <button
            type="button"
            aria-label="Next reviews"
            :disabled="!canScrollRight"
            @click="scrollRight"
            class="rounded-full bg-white p-2 shadow hover:bg-sky-100 disabled:opacity-30">
            <Icon icon="line-md:arrow-small-right" width="28" />
          </button>
        </div>
      </header>

      <!-- CAROUSEL -->
      <div class="relative">
        <ul ref="carousel" class="flex gap-6 overflow-x-auto scroll-smooth">
          <li
            v-for="review in visibleReviews"
            :key="review.id"
            class="w-[85%] min-w-0 shrink-0 sm:w-[45%] lg:w-[30%]">
            <article class="h-full rounded-lg bg-white p-6 shadow-md">
              <h3 class="mb-2 text-lg font-semibold text-blue-800">
                {{ review.tourTitle }}
              </h3>
              <div
                v-if="review.stars !== null"
                role="img"
                :aria-label="`${review.stars} out of 5 stars`"
                class="mb-2 flex items-center gap-1">
                <Icon
                  v-for="i in 5"
                  :key="i"
                  aria-hidden="true"
                  icon="line-md:star-alt-filled"
                  width="20"
                  height="20"
                  :class="i <= review.stars ? 'text-yellow-500' : 'text-gray-300'" />
                <span aria-hidden="true" class="ml-1 text-sm text-gray-600">{{ review.stars }} / 5</span>
              </div>
              <div class="space-y-1 text-sm text-gray-600">
                <p>Tourdate: <time :datetime="review.tourDate">{{ formatDate(review.tourDate) }}</time></p>
              </div>
              <ReviewText :review-id="review.id" :content="review.content" />
              <p class="text-primary font-semibold">{{ review.firstName }}</p>
            </article>
          </li>
        </ul>
      </div>
    </main>
  </section>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { apiUrl } from "../api.js";
import { useCarousel } from "../composables/useCarousel.js";
import ReviewText from "./ReviewText.vue";
const reviews = ref([]);
const selectedTourId = ref(null);
const visibleReviews = computed(() => selectedTourId.value
  ? reviews.value.filter(review => review.tourId === selectedTourId.value)
  : reviews.value);
const selectedTourTitle = computed(() => visibleReviews.value[0]?.tourTitle || "Tour reviews");
const averageStars = computed(() => {
  const scored = visibleReviews.value.filter(review => review.stars !== null);
  return scored.length
    ? scored.reduce((sum, review) => sum + review.stars, 0) / scored.length
    : null;
});
const loading = ref(true);
const error = ref("");
const {
  container: carousel,
  canScrollLeft,
  canScrollRight,
  scrollLeft,
  scrollRight,
  updateScrollState,
} = useCarousel();

watch(visibleReviews, () => {
  if (carousel.value) carousel.value.scrollTo({ left: 0, behavior: "instant" });
  updateScrollState();
}, { flush: "post" });

async function followReviewLink() {
  const match = /^#reviews-tour-([1-9]\d*)$/.exec(window.location.hash);
  if (!match && window.location.hash !== "#reviews") return;
  selectedTourId.value = match ? Number(match[1]) : null;
  await nextTick();
  document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const formatDate = (date) => dateFormatter.format(new Date(`${date}T00:00:00Z`));

const fetchReviews = async () => {
  try {
    const response = await fetch(apiUrl("/public/reviews"));
    if (!response.ok) throw new Error(`Failed to fetch reviews: ${response.status}`);
    const json = await response.json();
    if (!Array.isArray(json)) throw new Error("Invalid reviews response");
    reviews.value = json;
  } catch (err) {
    console.error("Error fetching reviews:", err);
    error.value = "Reviews could not be loaded. Please try again later.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchReviews();
  followReviewLink();
  window.addEventListener("hashchange", followReviewLink);
});
onBeforeUnmount(() => window.removeEventListener("hashchange", followReviewLink));
</script>
