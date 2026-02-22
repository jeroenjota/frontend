<template>
  <footer id="footer" class="text-primary mt-1 bg-cyan-100 py-1">
    <div class="mx-auto max-w-7xl px-4">
      <div
        class="mb-1 flex flex-col gap-3 border-gray-700 py-2 md:flex-row md:justify-between">
        <!-- friendsLinks -->
        <div
          class="w-full rounded-lg border border-gray-400 bg-gray-300 px-4 py-4 shadow-2xl">
          <h3 class="font-garamond mb-4 text-lg font-semibold sm:text-3xl">
            Friends
          </h3>
          <ul class="space-y-2 text-xl sm:text-2xl">
            <li v-for="(friend, index) in friendsLinks" :key="index">
              <a
                :href="friend.link"
                class="transition hover:text-white"
                target="_blank">
                <img
                  class="inline h-12"
                  v-if="friend.logo"
                  :src="friendsLogo(friend.logo)"
                  target="_blank" />
                <span class="ml-4">{{ friend.name }} </span>
              </a>
            </li>
          </ul>
        </div>
        <div
          class="w-full rounded-lg border border-gray-400 bg-gray-300 px-4 py-4 shadow-2xl">
          <!-- Quick Links -->
          <h3 class="font-garamond mb-4 text-lg font-semibold sm:text-3xl">
            Quick Links
          </h3>
          <ul class="space-y-2 text-xl sm:text-2xl">
            <li v-for="(link, index) in quickLinks" :key="index">
              <a :href="link.link" class="transition hover:text-white"
                ><Icon :icon="link.icon" class="inline h-5 w-5" />
                {{ link.name }}</a
              >
            </li>
          </ul>
        </div>
        <!-- Customer services -->
        <div
          class="w-full rounded-lg border border-gray-400 bg-gray-300 px-4 py-4 shadow-2xl">
          <h3 class="font-garamond mb-4 text-lg font-semibold sm:text-3xl">
            Customer Service
          </h3>
          <ul class="space-y-2 text-xl sm:text-2xl">
            <li v-for="(service, index) in customerServices" :key="index">
              <span v-if="service.link">
                <a :href="service.link" class="transition hover:text-white"
                  ><Icon :icon="service.icon" class="inline h-5 w-5" />
                  {{ service.name }}</a
                >
              </span>
              <span v-else>
                <Icon :icon="service.icon" class="inline h-5 w-5" />
                <button @click="toggleTerms" class="transition hover:text-white" v-if="service.action === 'toggleTerms'">
                  {{ service.name }}
                </button>
                <button @click="togglePrivacy" class="transition hover:text-white" v-else-if="service.action === 'togglePrivacy'">
                  {{ service.name }}
                </button>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <!-- Footer bottom -->
      <div class="border-gray-800 py-2 text-center md:flex-row">
        <p class="font-garamond text-sm italic">
          &copy; {{ new Date().getFullYear() }} jota services
        </p>
        <!-- <div class="mt-4 flex space-x-6 md:mt-0">
          <Icon v-for="iconName in paymentIcons" :key="iconName" :icon="iconName" class="h-8 w-8"
          />

        </div> -->
      </div>
    </div>
  </footer>
  <Terms v-if="showTerms" @close="toggleTerms"></Terms>
  <Privacy v-if="showPrivacy" @close="togglePrivacy"></Privacy>
</template>
<script setup>
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import { apiUrl, assetUrl } from "../api";
import Terms from "./Terms.vue";
import Privacy from "./Privacy.vue";

const showTerms = ref(false);
const showPrivacy = ref(false);

const friendsLinks = ref([
  {
    name: "",
    link: "https://www.tourist.com/p/6578",
    logo: "logo.CXmepMON.svg",
  },
  {
    name: "ToursByLocals",
    link: "https://www.toursbylocals.com/tour-guides/netherlands/amsterdam/guide-profile/jeroen-v-664d21fe96689af34335158a",
    logo: "tbl_logo.png",
  },
  {
    name: "",
    link: "https://www.amsterdamexperiences.nl/",
    logo: "amsterdamexperiences_logo.webp",
  },
  {
    name: "KAYAK",
    link: "https://www.kayak.co.uk/Amsterdam.1334.guide",
    logo: "kayak.png",
  },
  {
    name: "GetYourGuide",
    link: "https://www.getyourguide.nl/jota-services-s189991/?visitor-id=QYILJ4G687QFHEYLWUEC817RTIIRTWE1&locale_autoredirect_optout=true",
    logo: "gyg.png",
  },
]);
const quickLinks = ref([
  { name: "Home", link: "#home", icon: "mdi:home" },
  { name: "Tours", link: "#tours", icon: "mdi:map-search-outline" },
  { name: "Categories", link: "#categories", icon: "mdi:shape-outline" },
  { name: "Offers", link: "#offers", icon: "mdi:tag-outline" },
  // { name: "About", link: "#about", icon: "mdi:information-outline" },
  // { name: "Contact", link: "#contact", icon: "mdi:phone-outline" },
  // { name: "Links", link: "#footer", icon: "mdi:link-variant" },
]);
const customerServices = ref([
  { name: "About", link: "#about", icon: "mdi:information-outline" },
  { name: "Contact", link: "#contact", icon: "mdi:phone-outline" },
  {
    name: "Terms of Service",
    action: "toggleTerms",
    icon: "mdi:file-document-outline",
  },
  { name: "Privacy Policy", action: "togglePrivacy", icon: "mdi:shield-lock-outline" },
]);
const paymentIcons = ref([
  "logos:visa",
  "logos:mastercard",
  "logos:paypal",
  "logos:ideal",
]);

function toggleTerms() {
  showTerms.value = !showTerms.value;
} 

function togglePrivacy() {
  showPrivacy.value = !showPrivacy.value;
}

function friendsLogo(logo) {
  if (!logo) return null;
  return assetUrl("/uploads/system/" + logo);
}
</script>
