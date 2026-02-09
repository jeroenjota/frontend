<template>
  <div  class="min-h-screen bg-cover bg-center">
    <Header />
    <Home />
   <!-- <Intro /> -->
    <Tours @open-tour="openTour" />
    <Categories @open-tour="openTour" />
    <Offers @open-tour="openTour"/>
    <About />
    <Contact />
    <Foot />
    <TourDetail
      v-if="showTourDetail"
      :key="selectedTour?.id"
      :tour="selectedTour"
      @close="closeTour" />
  </div>
</template>
<script setup>
import { ref } from "vue";
import Header from "./components/Header.vue";
// import Intro from "./components/Intro.vue";
import Home from "./components/Home.vue";
import Tours from "./components/Tours.vue";
import TourDetail from "./components/TourDetail.vue";
import Categories from "./components/Categories.vue";
import Offers from "./components/Offers.vue";
import About from "./components/About.vue";
import Contact from "./components/Contact.vue";
import Foot from "./components/Foot.vue";
import { assetUrl } from "./api";
const fotoUrl = assetUrl;
const selectedTour = ref(null);
const showTourDetail = ref(false);

function openTour(tour) {
  // console.log("Opening tour:", tour);
  selectedTour.value = tour;
  showTourDetail.value = true;
}

function closeTour() {
  showTourDetail.value = false;
  selectedTour.value = null;
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
