<template>
<section id="home" class="scroll-mt-[200px] bg-sky-200 py-0">
  <div
    class="relative flex items-center justify-center bg-cover bg-center bg-no-repeat p-2"
    :style="{ backgroundImage: `url(${fotoUrl('/uploads/system/main.jpg')})` }"
  >
    <div class="relative z-10 w-full max-w-6xl px-4 md:px-6 lg:px-8">
      <div class="text-center lg:text-left">
        <div class="relative z-10 mx-auto w-full">
          <!-- ✅ hier bepaal je de breedte -->
          <div
            class="w-full rounded-md bg-white/60 p-4 shadow-lg backdrop-blur-md"
          >
            <Intro />
            <div class="mt-1 flex justify-center gap-4">
              <a
                href="#tours"
                class="rounded-lg bg-cyan-700 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-cyan-700"
              >
                All Tours
              </a>

              <a
                href="#discounts"
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
// import mainImage from "../img/keukenhof02.jpg";
import { assetUrl } from "../api";
const fotoUrl = assetUrl;
import Intro from "./Intro.vue";
</script>
<style lang=""></style>
