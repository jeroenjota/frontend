<template>
  <div
    class="scroll-mt-65 fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4"
    @click.self="emit('close')">
    <div>
      <div
        class="max-h-[75vh] w-[95vw] max-w-5xl overflow-hidden rounded-lg bg-cyan-700 p-4 shadow-2xl sm:w-[92vw]">
        <!-- Header -->
        <div
          class="mb-4 flex items-center justify-between border-b border-gray-300 p-4">
          <h1 class="text-xl text-gray-200 md:text-2xl">
            {{ firstWord(category?.name) }} tours <span v-if="categoryTours.length>0">({{ categoryTours.length }})</span>
          </h1>
          <button
            @click="emit('close')"
            aria-label="Close"
            class="text-gray-300 hover:text-white">
            <Icon icon="mdi:close" class="h-6 w-6 text-gray-300 hover:text-white" />
          </button>
        </div>
        <!-- Scrollable list -->
        <div
          ref="scrollContainer"
          class="max-h-[60vh] w-full flex-1 overflow-y-auto overscroll-contain bg-cyan-600 p-0"
          @scroll="updateScrollHint">
          <div v-if="categoryTours.length === 0">No tours in this category</div>
          <div class="flex flex-col gap-2 md:flex-row md:justify-center">
            <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <li
                v-for="tour in categoryTours"
                :key="tour.id"
                class="rounded border border-gray-200 p-3"
                @click="emit('open-tour', tour)">
                <h3 class="mb-2 text-lg font-medium text-gray-200">
                  {{ tour.title }}
                </h3>
                <div
                  class="bg-primary m-0 flex flex-col gap-4 overflow-hidden rounded-lg shadow-sm md:flex-row">
                  <!-- Image -->
                  <div
                    class="relative h-48 w-full shrink-0 overflow-hidden md:h-40 md:w-56">
                    <img
                      :src="assetUrl('/uploads/resized/' + tour.image)"
                      :alt="tour.title"
                      class="h-full w-full object-cover" />
                  </div>

                  <!-- Content -->
                  <div
                    class="bg-primary flex flex-1 justify-between p-3 text-sm text-white">
                    <!-- LEFT COLUMN -->
                    <div class="flex flex-col">
                      <p class="text-base text-gray-200">
                        {{ tour.description }}
                      </p>
                      <p>{{ tour.duration }} hours</p>
                      <p>Max: {{ tour.groupSize }} people</p>
                    </div>

                    <!-- RIGHT COLUMN -->
                    <div class="flex items-center">
                      <PriceBlock :tour="tour" />
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <div
            v-if="showScrollHint"
            class="bg-linear-to-t sticky bottom-0 z-10 mt-2 from-cyan-900/90 to-transparent px-4 pb-2 pt-8 text-center text-xs font-semibold tracking-wide text-cyan-100">
            Scroll voor meer tours
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { apiUrl, assetUrl } from "../api.js";
import PriceBlock from "./PriceBlock.vue";
const emit = defineEmits(["close", "open-tour"]);

const props = defineProps({
  categoryId: {
    type: Number,
    required: true,
  },
});

const category = ref([]);
const categoryTours = ref([]);
const scrollContainer = ref(null);
const showScrollHint = ref(false);

const updateScrollHint = () => {
  const el = scrollContainer.value;
  if (!el) return;

  const remaining = el.scrollHeight - el.scrollTop - el.clientHeight;
  showScrollHint.value = remaining > 8;
};

const fetchCategory = async (id) => {
  try {
    const response = await fetch(apiUrl("/public/categories/" + id));
    const json = await response.json();
    category.value = json;
  } catch (error) {
    console.error("Error fetching category:", error);
  }
};

const fetchToursByCategory = async (id) => {
  try {
    const response = await fetch(apiUrl(`/public/tours/category/${id}`));
    const json = await response.json();
    // console.log("Fetched tours for category", id, ":", json);
    categoryTours.value = json;
    await nextTick();
    updateScrollHint();
  } catch (error) {
    console.error("Error fetching tours for category:", error);
  }
};

function firstWord(tekst) {
  if (!tekst) return "";
  return tekst.split(" ")[0];
}

onMounted(() => {
  fetchCategory(props.categoryId);
  // console.log("Fetching tours for category ID:", props.categoryId);
  fetchToursByCategory(props.categoryId);
  window.addEventListener("resize", updateScrollHint);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateScrollHint);
});
</script>
