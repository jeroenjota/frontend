<template>
  <form @submit.prevent="submitForm" class="max-w-xl space-y-4">
    <input
      v-model="contactForm.name"
      type="text"
      placeholder="Name"
      required
      class="input" />

    <input
      v-model="contactForm.surname"
      type="text"
      placeholder="Surname"
      required
      class="input" />
    <input
      v-model="contactForm.language"
      type="text"
      placeholder="Language"
      required
      class="input" />

    <input
      v-model="contactForm.phone"
      type="text"
      placeholder="Phone"
      required
      class="input" />
      
    <input
      v-model="contactForm.country"
      type="text"
      placeholder="Country"
      required
      class="input" />

    <input
      v-model="contactForm.email"
      type="email"
      placeholder="E-mail"
      required
      class="input" />

    <input v-model="contactForm.preferredDate" type="date" class="input" />

    <input
      v-model.number="contactForm.groupSize"
      type="number"
      min="1"
      class="input"
      placeholder="Number of people" />

    <!-- honeypot -->
    <input
      v-model="contactForm.company"
      type="text"
      class="hidden"
      tabindex="-1"
      autocomplete="off" />

    <textarea
      v-model="contactForm.message"
      placeholder="Your message"
      rows="5"
      required
      class="input" />

    <button type="submit" :disabled="loading" class="btn-primary">
      {{ loading ? "Sending..." : "Send message" }}
    </button>

    <p v-if="success" class="text-green-600">
      Thank you! I will contact you soon.
    </p>

    <p v-if="error" class="text-red-600">
      {{ error }}
    </p>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { contactForm } from "@/composables/useContactForm";

const loading = ref(false);
const success = ref(false);
const error = ref(null);

const submitForm = async () => {
  error.value = null;
  loading.value = true;

  try {
    // fetch(apiUrl("/public/tours"));
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

