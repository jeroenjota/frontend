<template>
  <div
    id="contact"
    class="scroll-mt-45 bg-sky-300 px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-5xl">
      <div class="mb-4 text-center">
        <h1
          class="font-garamond text-primary text-2xl font-bold sm:text-3xl md:text-4xl">
          Contact Us
        </h1>
      </div>

      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="space-y-8">
          <div
            class="rounded-lg border border-gray-100 bg-gray-200 p-8 shadow-xl">
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
              <div class="flex flex-col items-start gap-2 sm:flex-row">
                <input
                  v-model="contactForm.name"
                  required
                  type="text"
                  class="h-10 rounded-lg border-gray-200 px-2 focus:ring-2 focus:ring-sky-500"
                  placeholder="First name" />
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
                <label class="flex items-start gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    v-model="agreedToPrivacy"
                    class="mt-1 h-4 w-4 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500" />
                  <span>
                    I have read and agree to the
                    <button
                      type="button"
                      @click="emit('togglePrivacy')"
                      class="text-cyan-700 underline hover:text-cyan-500">
                      Privacy Policy
                    </button>
                    and
                    <button
                      type="button"
                      @click="emit('toggleTerms')"
                      class="text-cyan-700 underline hover:text-cyan-500">
                      Terms & Conditions</button
                    >.
                  </span>
                </label>

                <button
                  type="submit"
                  :disabled="loading || !canSend"
                  class="btn-primary">
                  {{ loading ? "Sending..." : "Send message" }}
                </button>
              </div>

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
import { ref, computed } from "vue";

const contactForm = createContactForm();
const loading = ref(false);
const success = ref(false);
const error = ref(null);
const emit = defineEmits(["togglePrivacy", "toggleTerms"]);
const agreedToPrivacy = ref(false);

// eenvoudige email validatie
const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// computed property die checkt of form verstuurd mag worden
const canSend = computed(() => {
  return (
    agreedToPrivacy.value &&
    contactForm.surname.trim() !== "" &&
    isValidEmail(contactForm.email)
  );
});

const sendMessage = async () => {
  error.value = null;
  success.value = false;
  if (!canSend.value) {
    error.value =
      "Please fill in all required fields and agree to the privacy policy.";
    return;
  }

  loading.value = true;

  try {
    const res = await fetch(apiUrl("/public/contact/general"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm),
    });

    if (!res.ok) throw new Error("Sending failed");

    success.value = true;
    // clear form if needed
    // Object.keys(contactForm).forEach(k => contactForm[k] = "");
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script>
