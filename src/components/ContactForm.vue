<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click.self="emit('close')">
    <div
      class="w-full max-w-2xl overflow-hidden rounded-lg border-4 border-blue-500 bg-gray-200 p-4 shadow-2xl">
      <h2 class="font-garamond text-primary text-2xl">{{ subject }}</h2>
      <p>
        Please fill in the form below, and we will get back to you as soon as
        possible.
      </p>
      <p class="text-sm text-gray-600">
        Except surname and email, everything is optional, but it will help if
        you provide as much information as possible
      </p>
      <form
        @submit.prevent="submitForm"
        class="mx-auto max-w-3xl space-y-6 border-2 border-gray-500 p-6 shadow-md">
        <!-- Naam -->
        <div class="grid gap-4 sm:grid-cols-5">
          <select
            v-model="fields.title"
            class="h-10 rounded-lg border-gray-200 px-2 focus:ring-2 focus:ring-sky-500">
            <option value="">Title</option>
            <option>Mr</option>
            <option>Mrs</option>
            <option>Ms</option>
            <option>Dr</option>
          </select>

          <div class="sm:col-span-1">
            <label class="form-label">First name</label>
            <input v-model="contactForm.name" type="text" class="form-input" />
          </div>

          <div class="sm:col-span-2">
            <label class="form-label">Surname</label>
            <input
              v-model="contactForm.surname"
              type="text"
              required
              class="form-input" />
          </div>
          <div class="sm:col-span-1">
            <label class="form-label">Group size</label>
            <input
              v-model.number="contactForm.groupSize"
              type="number"
              min="1"
              placeholder="Number of people"
              class="form-input" />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-4">
          <!--  Email -->
          <div class="w-full sm:col-span-3">
            <label class="form-label">Email</label>
            <input
              v-model="contactForm.email"
              type="email"
              required
              class="form-input" />
          </div>
          <!-- Phone -->
          <div>
            <label class="form-label sm:col-span-1">Phone</label>
            <input v-model="contactForm.phone" type="text" class="form-input" />
          </div>
        </div>
        <div class="grid gap-4 sm:grid-cols-3">
          <!-- Herkomst & taal -->
          <div>
            <label class="form-label">Country</label>
            <input
              v-model="contactForm.country"
              type="text"
              class="form-input" />
          </div>

          <div>
            <label class="form-label">Preferred language</label>
            <select v-model="contactForm.language" class="form-input">
              <option disabled value="">Select a language</option>
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
            </select>
          </div>

          <!-- Tour details -->
          <div class="sm:col-span-1">
            <div>
              <label class="form-label">Preferred date</label>
              <input
                v-model="contactForm.preferredDate"
                type="date"
                class="form-input" />
            </div>
          </div>
        </div>

        <!-- Bericht -->
        <div>
          <label class="form-label">Message</label>
          <textarea
            v-model="contactForm.message"
            rows="5"
            class="form-input"
            placeholder="Your message" ></textarea>
        </div>

        <!-- Honeypot -->
        <input
          v-model="contactForm.company"
          type="text"
          class="hidden"
          tabindex="-1"
          autocomplete="off" />

        <!-- Actie -->
        <div class="flex items-center justify-between">
          <button
            type="button"
            @click="emit('close')"
            class="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
            @enter-cancelled="">
            Close
          </button>
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
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { contactForm } from "../composables/useContactForm.js";
import { apiUrl } from "../api.js";

const props = defineProps({
  subject: {
    type: String,
    default: "",
  },
  tourname: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  surname: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
});
contactForm.message = props.tourname
  ? "Please get in touch with me about " + (props.tourname || "this tour")
  : "";
contactForm.tourTitle = props.tourname || "Jota Tours";
contactForm.subject = props.subject || "General Inquiry";

contactForm.name = props.name;
contactForm.surname = props.surname;
contactForm.email = props.email;
contactForm.message = props.message;

const emit = defineEmits(["close"]);

const loading = ref(false);
const success = ref(false);
const error = ref(null);

const submitForm = async () => {
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
