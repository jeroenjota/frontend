<template>
  <div id="contact" class="scroll-mt-[180px] bg-sky-300 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-4 text-center">
        <h1
          class="font-garamond text-primary text-2xl font-bold sm:text-3xl md:text-4xl">
          Contact Us
        </h1>
      </div>

      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="space-y-8">
          <div class="rounded-lg border border-gray-100 bg-gray-200 p-8 shadow-xl">
            <h2 class="mb-6 font-serif text-2xl font-semibold text-gray-900">
              Contact Information
            </h2>
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="mr-4 rounded-full bg-emerald-500 p-3">
                  <Icon icon="mdi:phone" class="h-6 w-6 text-teal-50" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-950">Phone</h3>
                  <p class="text-gray-700">+31 6 4711 6541</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="mr-4 rounded-full bg-emerald-500 p-3">
                  <Icon icon="mdi:envelope" class="h-6 w-6 text-teal-50" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-950">Email</h3>
                  <p class="text-gray-700">info@jota.nl</p>
                  <p class="text-gray-700">jeroen@jota.nl</p>
                </div>
              </div>
            </div>
            <p
              class="mx-auto mt-6 max-w-4xl border-t-2 pt-6 text-lg text-gray-800">
              I'd love to hear from you! Whether you have questions about the
              tours, need assistance with bookings, or just want to say hello,
              feel free to reach out.
            </p>
          </div>
        </div>
        <div
          class="w-full rounded-lg border border-gray-100 bg-gray-200 p-8 shadow-xl">
          <h2 class="mb-6 font-serif text-2xl font-semibold text-gray-900">
            Send us a message
          </h2>
          <div class="flex items-center gap-2">
            <form class="w-full space-y-2" @submit.prevent="sendMessage">
              <div class="flex items-center gap-2">
                <select
                  v-model="contactForm.title"
                  required
                  class="h-10 rounded-lg border-gray-200 px-2 focus:ring-2 focus:ring-sky-500">
                  <option value="">Title</option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                  <option>Dr</option>
                </select>

                <input
                  v-model="contactForm.name"
                  required
                  type="text"
                  class="h-10 flex-1 rounded-lg border-gray-200 px-2 focus:ring-2 focus:ring-sky-500"
                  placeholder="First name" />
              </div>
              <div class="flex items-start">
                <input
                  v-model="contactForm.surname"
                  required
                  type="text"
                  id="surname"
                  name="surname"
                  class="w-full rounded-lg border-gray-200 p-2 hover:shadow-md focus:border-transparent focus:ring-2 focus:ring-sky-500"
                  placeholder="Surname" />
              </div>
              <div>
                <input
                  v-model="contactForm.email"
                  required
                  type="email"
                  id="email"
                  name="email"
                  class="w-full rounded-lg border-gray-200 p-2 hover:shadow-md focus:border-transparent focus:ring-2 focus:ring-sky-500"
                  placeholder="Your email" />
              </div>
              <div>
                <textarea
                  v-model="contactForm.message"
                  required
                  rows="3"
                  id="message"
                  class="w-full rounded-lg border-gray-200 p-2 hover:shadow-md focus:border-transparent focus:ring-2 focus:ring-sky-500"
                  placeholder="Any special requests or questions?"></textarea>
              </div>

              <!-- Honeypot -->
              <input
                v-model="contactForm.company"
                type="text"
                class="visually-hidden -left-2499.75 absolute"
                tabindex="-1"
                autocomplete="off" />

              <div class="flex items-center justify-between">
                <div>
                  <p v-if="success" class="text-sm text-green-600">
                    Thank you! I will contact you soon.
                  </p>
                  <p v-if="error" class="text-sm text-red-600">
                    {{ error }}
                  </p>
                </div>
                <button type="submit" :disabled="loading" class="btn-primary">
                  {{ loading ? "Sending..." : "Send message" }}
                </button>
              </div>

              <!-- <button
                class="w-full rounded-lg bg-teal-950 px-6 py-3 font-medium text-white shadow-md transition duration-300 hover:bg-teal-600">
                Send Message
              </button> -->
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { apiUrl } from "../api.js";
import { createContactForm } from "../composables/useContactForm";
import { ref } from "vue";
const contactForm = createContactForm();
const loading = ref(false);
const success = ref(false);
const error = ref(null);

const sendMessage = async () => {
  error.value = null;
  loading.value = true;

  try {
    const res = await fetch(apiUrl("/public/contact"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm),
    });

    if (!res.ok) throw new Error("Verzenden mislukt");

    success.value = true;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
