<template>
  <section id="offers" class="py-16 scroll-mt-20 bg-sky-100">
    <main class="container mx-auto px-4">

    <h2 class="text-3xl font-bold text-center text-primary mb-2">
      Special Offers
    </h2>
    <p class="text-center text-indigo-600 mb-12">
      Take advantage of these limited-time offers.
    </p>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="offer in currentOffers"
        :key="offer.id"
        :class="[
          offer.bgColor,
          'rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105',
        ]">
        <div class="p-6">
          <div class="flex justify-between items-start mb-4">
            <h3 :class="[offer.textColor, 'text-xl font-semibold']">
              {{ offer.title }}
            </h3>
            <span class="bg-white rounded-full p-3 shadow-md">
              <Icon
                :icon="
                  offer.discount.includes('%')
                    ? 'material-symbols:percent'
                    : 'mdi:gift'
                "
                :class="[offer.textColor, 'text-2xl']" />
            </span>
          </div>
          <p class="text-gray-700 mb-6">{{ offer.description }}</p>
          <div class="flex items-center text-gray-600">
            <Icon icon="¨svg-spinners:clock" class="mr-2" />
            <span>Ends on {{ offer.endDate }}</span>
          </div>
          <div class="bg-white rounded-lg p-4 mb-4">
            <p class="text-sm text-gray-500 mb-1">Use code</p>
            <p class="font-bold font-mono text-lg">{{ offer.code }}</p>
          </div>
          <button
            :class="[
              offer.textColor,
              'w-full py-3 rounded-lg font-semibold border',
              offer.textColor.replace('text', 'border'), 'hover:bg-white Transition-colors duration-300',
            ]">Claim Offer</button>
        </div>
      </div>
    </div>
    </main>
  </section>
</template>
<script setup>
import { ref, Transition } from "vue";
const currentOffers = ref([
  {
    id: 1,
    title: "Winter Special",
    description:
      "Get 20% off on all city tours booked in November and December.",
    discount: "20%",
    endDate: "2025-12-31",
    code: "WINTER25",
    bgColor: "bg-indigo-200",
    textColor: "text-indigo-900",
  },
  {
    id: 2,
    title: "Family Package",
    description:
      "Book a family tour and get one child free for every two adults.",
    discount: "10%",
    endDate: "2025-12-31",
    code: "FAMILY10",
    bgColor: "bg-green-200",
    textColor: "text-green-900",
  },
  {
    id: 3,
    title: "Early Bird Discount",
    description: "Book your tour at least 30 days in advance and save 15%.",
    discount: "15%",
    endDate: "2025-12-31",
    code: "EARLY15",
    bgColor: "bg-yellow-200",
    textColor: "text-yellow-900",
  },
]);
</script>
import { ref } from "vue";
