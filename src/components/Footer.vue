<template>
  <footer class="bg-cyan-800 text-gray-300 py-2 mt-1">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex flex-col md:flex-row md:justify-center gap-6 py-8 mb-6 border-b border-gray-700">
        <div class="px-4 py-4 border border-gray-400 rounded-lg shadow-2xl" style="width: 200px;">
          <!-- Quick Links -->
          <h3 class="text-lg font-semibold mb-4 font-garamond">Quick Links</h3>
          <ul class="space-y-2">
            <li v-for="(link, index) in quickLinks" :key="index">
              <a :href="link.link" class="hover:text-white transition">{{
                link.name
              }}</a>
            </li>
          </ul>
        </div>
        <!-- Customer services -->
        <div class="px-4 py-4 border border-gray-400 rounded-lg shadow-2xl" style="width: 200px;">
          <h3 class="text-lg font-semibold mb-4 font-garamond">
            Customer Service
          </h3>
          <ul class="space-y-2">
            <li v-for="(service, index) in customerServices" :key="index">
              <a :href="service.link" class="hover:text-white transition">{{
                service.name
              }}</a>
            </li>
          </ul>
        </div>
      </div>
      <!-- Footer bottom -->
      <div
        class="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-sm font-garamond italic">
          &copy; {{ new Date().getFullYear() }} jota services
        </p>
        <div class="flex space-x-6 mt-4 md:mt-0">
          <Icon v-for="iconName in paymentIcons" :key="iconName" :icon="iconName" class="w-8 h-8"
          />

        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";
const quickLinks = ref([
  { name: "Home", link: "#home" },
  { name: "Tours", link: "#tours" },
  { name: "Categories", link: "#categories" },
  { name: "Offers", link: "#offers" },
]);
const customerServices = ref([
  { name: "About", link: "#about" },
  { name: "Contact", link: "#contact" },
  { name: "Terms of Service", link: "#terms" },
  { name: "Privacy Policy", link: "#privacy" },
]);
const paymentIcons = ref([
  "logos:visa",
  "logos:mastercard",
  "logos:paypal",
  "logos:ideal",
]);
</script>
