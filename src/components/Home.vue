<template>
<section id="home" class="bg-sky-100 scroll-mt-20 py-24">
  <div
    class="relative h-80 bg-cover bg-center bg-no-repeat
           flex items-center justify-center"
    :style="{ backgroundImage: `url(${bg})` }"
  >
    <div class="max-w-7xl relative z-10 w-full px-4 sm:px-6 lg:px-12">
      <div class="text-center lg:text-left">
        <!-- ❌ max-w-xl hier weg -->
        <div class="relative w-full z-10 mx-auto lg:mx-0">
          <!-- ✅ hier bepaal je de breedte -->
          <div
            class="bg-white/40 backdrop-blur-sm px-8 py-6 rounded-xl
                   w-full max-w-md sm:max-w-xl lg:max-w-3xl"
          >
            <div class="flex items-center justify-center lg:justify-start">
              <h1
                class="text-2xl sm:text-7xl text-primary leading-tight font-garamond"
              >
                Dutch Tours with
              </h1>
              <img
                src="../img/logokaal.gif"
                width="160"
                class="ml-4"
                alt=""
              />
            </div>

            <p class="text-lg text-primary mt-4">
              Discover unforgettable travel experiences tailored just for you.
            </p>

            <div class="mt-4 flex justify-center lg:justify-start gap-4">
              <a
                href="#tours"
                class="bg-cyan-900 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow hover:bg-cyan-700 transition"
              >
                All Tours
              </a>

              <a
                href="#offers"
                class="border border-sky-600 text-primary px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white/10 transition"
              >
                Special offers
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<script setup>
// public/img/keukenhof02.jpg
import mainImage from "../img/keukenhof02.jpg";
import bg from "../img/amsterdam012.jpg";
</script>
<style lang=""></style>
