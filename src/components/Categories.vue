<template>
  <section id="categories" class="scroll-mt-[180px] bg-sky-300 py-8">
    <div class="container mx-auto max-w-7xl px-4">
      <!-- Section Header -->
      <div class="mb-4 text-center">
        <h2 class="font-garamond text-primary text-2xl font-bold sm:text-3xl md:text-4xl">
          Explore by Categories
        </h2>
        <p class="mx-auto max-w-2xl text-lg text-gray-800">
          Discover tours tailored to your interests and preferences.
        </p>
      </div>
      <!-- Categories list -->
      <div
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="(category, index) in categories"
          :key="index"
          @click="openCategoryTours(category.id)"
          class="group relative overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-lg">
          <div class="h-64 overflow-hidden">
            <img
              :src="assetUrl('/uploads/thumbs/' + category.photo)"
              :alt="category.category"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </div>
          <div
            class="bg-linear-to-t absolute inset-0 from-black/60 via-transparent to-transparent">
            <div class="absolute bottom-0 left-0 p-6">
              <h3 class="text-xl font-semibold text-white">
                {{ category.name }}
              </h3>
              <p class="mt-1 text-gray-300">{{ category.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToursWithCategorie
      :categoryId="activeCategoryId"
      v-if="showToursByCategory"
      @open-tour="$emit('open-tour', $event)"
      @close="showToursByCategory = false" />
  </section>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { apiUrl , assetUrl} from "../api.js";
import ToursWithCategorie from "./ToursWithCategorie.vue";

const showToursByCategory = ref(false);
const categories = ref([]);
const activeCategoryId = ref(null);

const fetchCategories = async () => {
  try {
    const response = await fetch(apiUrl("/public/categories"));
    const json = await response.json();
    // console.log("Fetched categories data:", json);
    categories.value = json;
    // console.log("Categories after fetch:", categories.value);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

const openCategoryTours = (categoryId) => {
  activeCategoryId.value = categoryId;
  showToursByCategory.value = true;

  // console.log("Category clicked", categoryId);
};

onMounted(fetchCategories);
</script>
