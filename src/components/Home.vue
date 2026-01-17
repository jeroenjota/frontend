<template>
<section id="home" class="scroll-mt-32 bg-sky-100">
  <div
    class="relative flex h-80 items-center justify-center bg-cover bg-center bg-no-repeat"
    :style="{ backgroundImage: `url(${bg})` }"
  >
    <div class="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-12">
      <div class="text-center lg:text-left">
        <div class="relative z-10 mx-auto w-full lg:mx-0">
          <!-- ✅ hier bepaal je de breedte -->
          <div
            class="w-full max-w-xs rounded-xl bg-white/40 px-8 py-6 backdrop-blur-sm sm:max-w-xl lg:max-w-3xl"
          >
            <div class="flex items-center justify-center lg:justify-start">
              <h1
                class="text-primary font-garamond text-2xl leading-tight sm:text-3xl md:text-5xl lg:text-6xl"
              >
                Dutch Tours with
              </h1>
              <img
                src="../img/logokaal.gif"
                class="ml-4 h-16 sm:h-20 md:h-24 lg:h-32"
                alt=""
              />
            </div>

            <p class="text-primary mt-4 text-lg">
              Discover unforgettable travel experiences tailored just for you.
            </p>

            <div class="mt-4 flex justify-center gap-4 lg:justify-start">
              <a
                href="#tours"
                class="rounded-lg bg-cyan-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-cyan-700"
              >
                All Tours
              </a>

              <a
                href="#tours"
                class="text-primary rounded-lg border border-sky-600 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
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
import bg from "../img/centraal_station.jpg";

</script>
<style lang=""></style>
