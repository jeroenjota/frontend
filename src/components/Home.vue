<template>
    <section id="home" class="scroll-mt-50 bg-transparent px-4 pt-4" >
    <div class="relative mx-auto max-w-5xl rounded-md bg-white/60 p-4 shadow-lg backdrop-blur-md">

    <div class="relative z-10 w-full max-w-5xl px-4 md:px-6 lg:px-8">
      <div class="text-center lg:text-left">
        <div class="relative z-10 mx-auto w-full">
          <!-- ✅ hier bepaal je de breedte -->
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
</section>
</template>
<script setup>
import Intro from "./Intro.vue";
</script>
<style lang=""></style>
