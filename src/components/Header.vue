<template>
  <header class="sticky top-0 z-50 transition-all duration-300">
    <section
      :class="[
        'w-full',
        isScrolled
          ? 'bg-cyan-100/95 backdrop-blur shadow-md py-4'
          : 'bg-cyan-100 py-6',
      ]">
      <div
        class="mx-auto grid h-16 max-w-full grid-cols-[auto_1fr_auto] items-center gap-4 sm:h-20 md:h-24 lg:h-32">
        <!-- logo -->
        <div class="flex items-center justify-start">
          <a href="#home" class="py-2 text-2xl font-bold text-cyan-800">
            <img
              :src="assetUrl('/uploads/system/logo.gif')"
              class="ml-4 h-16 w-auto sm:h-20 md:h-24 lg:h-32"
              alt="Jota Logo" />
          </a>
        </div>
        <!-- titel -->
        <div class="flex justify-center">
          <h1
            class="text-primary font-garamond text-left text-2xl sm:text-4xl md:text-6xl lg:text-8xl">
            Amsterdam Tours
          </h1>
        </div>
        <!-- Adress and phone -->
        <div class="hidden items-center justify-end gap-6 md:flex">
          <div class="font-garamond text sky-600 space-y-1 text-right">
            <ul>
              <li
                v-for="item in adresItems"
                :key="item.id"
                class="flex items-center justify-end gap-2">
                <Icon :icon="item.icon" class="h-5 w-5" />
                <span>{{ item.value }}</span>
              </li>
            </ul>
          </div>
          <div class="">
            <span
              v-if="backendOnline.status !== 'ok'"
              class="bg-red-500 px-4 py-2 text-white"
              >BACKEND OFFLINE</span
            ><span v-else>{{ backendOnline.time }}</span>
          </div>
        </div>
        <!-- Icons 
        <aside
          class="flex items-center space-x-4">
          <button
            class="relative p-2 text-gray-700 hover:text-cyan-600"
            aria-label="Wishlist">
            <Icon icon="mdi:cart-outline" class="h-5 w-5" />
            <span
              class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
              >5</span
            >
          </button>
          <button
            class="relative p-2 text-gray-700 hover:text-cyan-600"
            aria-label="Wishlist">
            <Icon icon="mdi:account-outline" class="h-5 w-5" />
          </button>
        </aside>
        -->
        <button
          class="text-gray-600 hover:text-cyan-600 sm:hidden"
          aria-label="Toggle mobile menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen">
          <icon icon="mdi:menu" class="h-6 w-6" />
        </button>
      </div>
    </section>
    <!-- Navbar links-->
    <nav class="bg-cyan-700" aria-label="Main menu">
      <div class="mx-auto flex max-w-7xl justify-between px-4 sm:px-6 lg:px-8">
        <ul
          class="hidden flex-wrap justify-start gap-x-6 py-3 text-sm font-medium text-white sm:flex">
          <li v-for="item in navItems" :key="item.id">
            <a
              v-if="item.loc === 'internal' && item.showItem"
              :href="item.link"
              class="transition-colors hover:text-cyan-300"
              ><Icon :icon="item.icon" class="inline h-5 w-5" />
              {{ item.name }}</a
            >
          </li>
        </ul>
        <ul
          class="hidden flex-wrap justify-start gap-x-6 py-3 text-sm font-medium text-white sm:flex">
          <li v-for="item in navItems" :key="item.id">
            <a
              v-if="item.loc !== 'internal'"
              :href="item.link"
              class="transition-colors hover:text-cyan-300"
              ><Icon :icon="item.icon" class="inline h-5 w-5" />
              {{ item.name }}</a
            >
          </li>
        </ul>
        <section
          v-if="isMobileMenuOpen"
          @click="isMobileMenuOpen = false"
          class="mt-2 space-y-3 rounded-lg bg-white p-4 text-center text-[#5d4037] shadow-md sm:hidden"
          aria-label="Mobile Navigation">
          <a
            v-for="item in navItems"
            :key="item.id"
            :href="item.link"
            class="block font-medium hover:text-green-600"
            >{{ item.name }}</a
          >
          <p for="item in adresItems">
            <span v-for="item in adresItems" :key="item.id" class="mt-2 block">
              <Icon :icon="item.icon" class="inline h-5 w-5" />
              {{ item.value }}
            </span>
          </p>
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
  {
    id: 1,
    name: "Home",
    link: "#home",
    loc: "internal",
    icon: "mdi:home",
    showItem: true,
  },
  {
    id: 2,
    name: "Tours",
    link: "#tours",
    loc: "internal",
    icon: "mdi:map-search-outline",
    showItem: true,
  },
  {
    id: 3,
    name: "Categories",
    link: "#categories",
    loc: "internal",
    icon: "mdi:shape-outline",
    showItem: true,
  },
  {
    id: 4,
    name: "Discounts",
    link: "#discounts",
    loc: "internal",
    icon: "mdi:tag-outline",
    showItem: true,
  },
  {
    id: 5,
    name: "About",
    link: "#about",
    loc: "system",
    icon: "mdi:information-outline",
    showItem: true,
  },
  {
    id: 6,
    name: "Contact",
    link: "#contact",
    loc: "system",
    icon: "mdi:phone-outline",
    showItem: true,
  },
  {
    id: 7,
    name: "Links",
    link: "#footer",
    loc: "system",
    icon: "mdi:link-variant",
    showItem: true,
  },
];

const adresItems = [
  { id: 1, type: "phone", value: "(+31) 6 4711 6541", icon: "mdi:phone" },
  { id: 2, type: "location", value: "Amsterdam", icon: "mdi:map-marker" },
  { id: 3, type: "email", value: "info@jotatours.nl", icon: "mdi:email" },
];

import { apiUrl,assetUrl } from "../api.js";
import { Icon } from "@iconify/vue";

const backendOnline = ref({});

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(async () => {
  try {
    const res = await fetch(apiUrl("/health"));
    backendOnline.value = await res.json();
    console.log("Backend health check response:", backendOnline.value);
  } catch (err) {
    backendOnline.value = false;
    // console.log("Backend health check failed:", err);
  }
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>
