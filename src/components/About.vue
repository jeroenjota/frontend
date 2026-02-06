<template>
  <div
    id="about"
    class="bg-linear-to-r scroll-mt-40 from-blue-200 to-white px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <h2
        class="font-garamond text-primary mb-4 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
        About Me
      </h2>
      <!-- Eerste alinea full width -->
      <p class="text-xl leading-relaxed md:text-3xl">
        {{ text[0] }}
      </p>
      <!-- Foto jeroen -->
      <img
        class="float-right mb-4 ml-4 w-48 rounded-full"
        :src="myHead"
        alt="" />

      <p class="text-lg leading-relaxed">
        {{ text[1] }}
      </p>
      <p class="mb-6 text-lg leading-relaxed">
        {{ text[2] }} 
      </p>
        <p class="text-lg">
          {{ text[3] }}
        </p>
      <!-- Carousel rechts met tekst eromheen -->
      <div class="relative mt-6">
        <p class="text-lg leading-relaxed">{{ text[4] }}</p>
        <div
          class="float-left mr-4 mt-2 w-full overflow-hidden rounded-2xl shadow-xl sm:w-1/2 md:w-1/3 lg:w-1/4">
          <div class="relative h-96 w-full">
            <transition name="fade" mode="out-in">
              <img
                :key="current"
                :src="fotoUrl(photos[current])"
                alt="Jeroen Verstegen"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                class="kenburns absolute inset-0 h-full w-full object-cover" />
            </transition>
            <div
              class="bg-linear-to-t absolute inset-0 from-black to-transparent opacity-20"></div>
            <div class="absolute bottom-0 left-0 p-2 text-right text-white">
              <h3 class="font-garamond text-xl italic">{{ headings[1] }}</h3>
            </div>
          </div>
        </div>
        <p class="mt-4 text-lg leading-relaxed">
          {{ text[5] }}
        </p>

        <p class="mt-4 text-lg leading-relaxed">{{ text[6] }}</p>
        <p class="mt-4 text-lg leading-relaxed">{{ text[7] }}</p>
        <!-- Carousel -->
      </div>
    </div>
        <p class="mt-4 text-lg leading-relaxed">{{ text[8] }}</p>
  </div>
</template>

<script setup>
import { assetUrl } from "../api.js";
const fotoUrl = assetUrl;
import { ref, onMounted, onUnmounted } from "vue";

const text = [
  //  1
  "Hello, nice to meet you! My name is Jeroen (Jerome),",
  // 2
  "I am a professional, licenced guide in Amsterdam and North-Holland and I am looking forward to meeting you and take you on a tour to discover the Netherlands like never before. You will love the experience!",
  " I was born in Amsterdam in 1956 and, although I have lived in many other cities and countries when I was younger, Amsterdam has always been my home.",
  // 3
  "The unique history and atmosphere are inseparably connected to each other, and I am always on the lookout for new facts and stories about the city. Learning about Amsterdam and its famous history also triggered the curiosity about other parts of this so-called Low Holland area. The fascinating way this small country created the world's biggest marine and trade fleet in the 17th century is one of the things that makes this area so special. Although I do feel some pride about this fact, I am also very much aware that there have been - and still are - many situations where the human factor was less important than financial gain. And I do think that this part of the story also has to be told.",
  // 4
  "Before being a guide, I was a bar owner in the Amsterdam district 'de Jordaan'. I loved that work, making people feel happy and relaxed has always been something that comes natural to me. But after 15 years, it was time for a new episode. Before running the bar, I was a computer programmer, a teacher, an actor and a tourist guide in France. With the experience and the knowledge I acquired over the years, the step to becoming a tourist guide in my hometown was a natural one. ",
  // 5
  "I have been giving tours for different kinds of groups, in four different languages, at different locations in and around Amsterdam since 2017. And according to the reviews, my guests have always enjoyed themselves very much.. Being an ex-bartender and an ex-teacher, I am always in for a joke and a laugh. Life is too serious as it is 🙂",
  // 6
  "I speak English as good as fluently, which is not exceptional in the Netherlands. Because I lived in the south of France for two years, my French is also pretty good. And, not too difficult for a Dutchman, I also speak German reasonably well, although the grammar is a bit 'rusty'. Besides those languages I am trying to learn Spanish, but I don't think I am yet at a 'tour-giving' level 🤫",
  // 7
  "I am married and have two grown-up sons. I still live in the heart of the city, in Amsterdam, I couldn't live anywhere else.",
  "I hope to get to know you very soon and to share some of my stories with you. If there is one of my tour you like, but you want some adjustments, or if you want to combine two tours or subjects, just reach out and I will prepare a customized tour for you.",
  // 8
  "I have a license to guide people through the Amsterdam city center. I own a rather old but very well maintained large car (Volvo V70) that has room enough for 3 /4 passengers. Or I could rent a minibus; I have a driver's license to transport up to 8 passengers.",
];

const myHead = "uploads/system/jeroengidst_0.jpg";

const headings = ["About Me", "Your guide: Jeroen"];

const photos = [
  "/uploads/system/jeroengidst_1.avif",
  "/uploads/system/jeroengidst_2.avif",
  "/uploads/system/jeroengidst_3.avif",
  "/uploads/system/jeroengidst_4.avif",
];

const loaded = ref(false);
const current = ref(0);
let interval = null;

const preloadImages = () => {
  let loadedCount = 0;

  photos.forEach((src) => {
    const img = new Image();
    img.src = fotoUrl(src);
    img.onload = () => {
      loadedCount++;
      if (loadedCount === photos.length) {
        loaded.value = true;
      }
    };
  });
};

const next = () => {
  current.value = (current.value + 1) % photos.length;
};

onMounted(() => {
  preloadImages();
  interval = setInterval(next, 10000);
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 
@keyframes kenburns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

.kenburns {
  animation: kenburns 6s ease-in-out forwards;
}
 */
</style>
