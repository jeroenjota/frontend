<template>
  <header class="sticky top-0 z-50 transition-all duration-300">
    <section
      :class="[
        'w-full',
        isScrolled
          ? 'bg-cyan-100/95 backdrop-blur shadow-md py-4'
          : 'bg-cyan-100 py-6',
      ]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex flex-col md:flex-row items-center justify-between gap-3 md-gap6 h-16">
          <!-- logo + mobile menu toggle-->
          <div class="flex justify-between items-center w-full md:w-auto">
            <a href="/" class="text-2xl font-bold text-cyan-800 py-2">
              <img src="../img/logo.gif" width="160" height="190" alt="" />
            </a>
            <button
              class="md:hidden text-gray-600 hover:text-cyan-600"
              aria-label="Toggle mobile menu"
              @click="isMobileMenuOpen = !isMobileMenuOpen">
              <icon icon="mdi:menu" class="w-6 h-6" />
            </button>
          </div>
          <!-- search bar -->
          <form
            class="w-full md:flex-1 max-w-sm"
            role="search"
            aria-label="Site search">
            <label class="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                class="w-full px-3 py-2 text-xs border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <button
                type="submit"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-600"
                aria-label="Search button">
                <Icon icon="mdi:magnify" class="w-4 h-4" />
              </button>
            </label>
          </form>
          <!-- Icons -->
          <aside
            class="flex items-center justify-end space-x-4 w-full md:w-auto">
            <button
              class="relative p-2 text-gray-700 hover:text-cyan-600"
              aria-label="Wishlist">
              <Icon icon="mdi:cart-outline" class="w-5 h-5" />
              <span
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >5</span
              >
            </button>
            <button
              class="relative p-2 text-gray-700 hover:text-cyan-600"
              aria-label="Wishlist">
              <Icon icon="mdi:account-outline" class="w-5 h-5" />
            </button>
          </aside>
        </div>
      </div>
    </section>
    <!-- Navbar links-->
    <nav class="bg-cyan-700" aria-label="Main menu">
      <div class="flex justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul
          class="hidden md:flex justify-start py-3 flex-wrap gap-x-6 text-sm font-medium text-white">
          <li v-for="item in navItems" :key="item.id">
            <a v-if="item.loc==='internal'"
              :href="item.link"
              class="hover:text-cyan-300 transition-colors"
              >{{ item.name }}</a
            >
          </li>
        </ul>
        <ul
          class="hidden md:flex justify-start py-3 flex-wrap gap-x-6 text-sm font-medium text-white">
          <li v-for="item in navItems" :key="item.id">
            <a v-if="item.loc!=='internal'"
              :href="item.link"
              class="hover:text-cyan-300 transition-colors"
              >{{ item.name }}</a
            >
          </li>
        </ul>
        <section
          v-if="isMobileMenuOpen"
          class="md:hidden mt-2 bg-white rounded-lg shadow-md p-4 space-y-3 text-[#5d4037] text-center"
          aria-label="Mobile Navigation">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.link"
            class="block hover:text-green-600 font-medium"
            >{{ item.name }}</a
          >
        </section>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const navItems = [
  { id: 1, name: "Home", link: "#home", loc: "internal" },
  { id: 2, name: "Tours", link: "#tours", loc: "internal" },
  { id: 3, name: "Categories", link: "#categories", loc: "internal" },
  { id: 4, name: "Offers", link: "#offers", loc: "internal" },
  { id: 5, name: "About", link: "#about", loc: "system" },
  { id: 6, name: "Contact", link: "#contact", loc: "system" },
];

import jotaLogo from "../img/logo.gif";

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
