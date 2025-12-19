<template>
  <section id="home" class="bg-sky-100 scroll-mt-20 py-24">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-10">
      <!-- left content -->
      <div class="text-center lg:text-left max-w-xl">
        <div class="flex justify-left items-center ">
        <h1
          class="text-7xl sm:text-5xl text-primary leading-tight mb-4 font-garamond ">
          Dutch Tours with
        </h1>
          <img src="../img/logokaal.gif" width="160" class="mr-4" alt="">
        </div>
        <p class="text-lg text-gray-700 mb-6">
          Discover unforgettable travel experiences tailored just for you.
        </p>
        <div class="flex justify-center lg:justify-start gap-4">
          <a
            href="#tours"
            class="bg-cyan-900 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow hover:bg-cyan-700 transition"
            >All Tours</a
          >
          <!-- oklch(48.8% 0.243 264.376) -->
          <a
            href="#offers"
            class="border border-cyan-500 text-cyan-600 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-cyan-200 transition-colors"
            >Special offers</a
          >
        </div>
      </div>
      <!-- Right image -->
      <div class="w-full lg:w-1/2 flex justify-center">
        <img
          :src="mainImage"
          alt="Tour image"
          class="w-full lg:w-full max-w-md mx-auto rounded-xl shadow-lg" />

      </div>
    </div>
  </section>
</template>
<script setup>
  // public/img/keukenhof02.jpg
  import mainImage from "../img/keukenhof02.jpg";

</script>
<style lang=""></style>
