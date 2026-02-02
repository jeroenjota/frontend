<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click.self="emit('close')">
    <div>
      <div
        class="w-full max-w-3xl overflow-hidden rounded-lg border-4 border-blue-500 bg-white p-4 shadow-2xl">
        <!-- Header -->
        <div
          class="mb-4 flex items-center justify-between border-b border-gray-300 p-4">
          <h1
            class="border-b-4 border-blue-500 text-2xl text-blue-600 md:text-3xl">
            {{ firstWord(category?.name)   }} tours
          </h1>
          <button
            @click="emit('close')"
            aria-label="Close"
            class="text-gray-600 hover:text-gray-800">
            <Icon icon="mdi:close" class="h-6 w-6" />
          </button>
        </div>
        <!-- Scrollable list -->
        <div
          class="max-h-[70vh] max-w-3xl flex-1 overflow-y-auto overscroll-contain p-4">
          <div v-if="categoryTours.length === 0">No tours in this category</div>
          <div class="flex flex-col gap-2 md:flex-row md:justify-center">
            <ul class="space-y-3">
              <li
                v-for="tour in categoryTours"

                :key="tour.id"
                class="rounded border bg-white p-3" 
                @click="emit('open-tour', tour)">
                <h3 class="mb-2 text-xl font-medium text-blue-600">
                  {{ tour.title }}
                </h3>
                <figure
                  class="m-0 flex flex-col gap-4 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:flex-row">
                  <!-- Image container -->
                  <div
                    class="relative flex h-48 w-full shrink-0 items-center justify-center overflow-hidden bg-white md:h-40 md:w-56">
                    <img
                      :src="assetUrl('/uploads/resized/' + tour.image)"
                      :alt="tour.title"
                      class="h-full w-full object-cover" />
                  </div>
                  <figcaption class="flex flex-col justify-center p-2 text-sm text-gray-700">
                    <p class="text-xl text-indigo-800">{{ tour.description }}</p>
                    <p>{{ tour.duration }} hours</p>
                    <p>{{ tour.price }}</p>
                    <p>Max: {{ tour.maxpers }} people</p>
                  </figcaption>
                </figure>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { apiUrl, assetUrl } from "../api.js";

const emit = defineEmits(["close", "open-tour"]);

const props = defineProps({
  categoryId: {
    type: Number,
    required: true,
  },
});

const category = ref([]);
const categoryTours = ref([]);

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
});
</script>
