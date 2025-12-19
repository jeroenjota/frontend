<template>
  <section id="categories" class="py-16  scroll-mt-20 bg-cyan-100">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="mb-12 text-center">
        <h2 class="text-3xl font-bold text-primary mb-4">
          Explore by Categories
        </h2>
        <p class="text-lg text-gray-800 max-w-2xl mx-auto">
          Discover tours tailored to your interests and preferences.
        </p>
      </div>
      <!-- Categories list -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          v-for="(category, index) in categories"
          :key="index"
          class="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-lg transition-shadow duration-300">
          <div class="h-64 overflow-hidden">
            <img
              :src="api('/images/' + category.foto)"
              :alt="category.category"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <div
            class="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent">
            <div class="absolute bottom-0 left-0 p-6">
              <h3 class="text-xl font-semibold text-white">
                {{ category.name }}
              </h3>
              <p class="text-gray-300 mt-1">{{ category.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { api } from "../api.js";

const categories = ref([]);

const fetchCategories = async () => {
  try {

    const response = await fetch(api("/categories"));
    const json = await response.json();
    // console.log("Fetched categories data:", data);
    categories.value = json.data;
    console.log("Categories after fetch:", categories.value);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};

onMounted(fetchCategories);
</script>
