<template>
  <transition name="modal-fade">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="emit('close')">
      <div
        class="modal-card w-full max-w-2xl overflow-hidden rounded-2xl border-4 border-blue-500 bg-gray-200 p-6 shadow-2xl">
        <h2 class="font-garamond text-primary text-2xl">{{ subject }}</h2>
        <p>
          Please fill in the form below, and we will get back to you as soon as
          possible.
        </p>
        <p class="text-sm text-gray-600">
          First name, surname, and email are required, but it will help if
          you provide as much information as possible
        </p>
        <form
          @submit.prevent="submitForm"
          :class="[
            'mx-auto max-w-3xl space-y-6 border-2 border-gray-500 p-6 shadow-md transition-all duration-200',
            shake ? 'animate-[shake_0.3s_ease-in-out]' : '',
          ]">
          <div class="mb-4 h-2 w-full rounded bg-gray-300">
            <div
              class="h-2 rounded bg-blue-500 transition-all duration-300"
              :style="{ width: progress + '%' }"></div>
          </div>
          <!-- Naam -->
          <div class="grid gap-4 sm:grid-cols-4">

            <div class="sm:col-span-1">
              <label class="form-label">First name</label>
              <input
                v-model="contactForm.name"
                required
                type="text"
                class="form-input" />
            </div>

            <div class="sm:col-span-2">
              <label class="form-label">Surname</label>
              <input
                v-model="contactForm.surname"
                type="text"
                required
                class="form-input" />
            </div>
            <div>
              <label class="form-label">Country</label>
              <input
                v-model="contactForm.country"
                type="text"
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
                :class="[
                  'form-input transition-all duration-200',
                  contactForm.email
                    ? emailValid
                      ? 'border-green-500 focus:ring-green-400'
                      : 'border-red-500 focus:ring-red-400'
                    : '',
                ]" />
            </div>
            <!-- Phone -->
            <div>
              <label class="form-label sm:col-span-1">Phone</label>
              <input
                v-model="contactForm.phone"
                type="text"
                class="form-input" />
            </div>
          </div>
          <!-- Tour details -->
          <div class="grid gap-4 sm:grid-cols-5">
            <div class="sm:col-span-1">
              <label class="form-label">Group size</label>
              <input
                v-model.number="contactForm.groupSize"
                type="number"
                min="1"
                placeholder="Number of people"
                class="form-input" />
            </div>
            <div class="sm:col-span-2">
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

            <div class="sm:col-span-2">
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
              placeholder="Your message"></textarea>
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
            <div class="min-h-5 text-sm transition-all duration-300">
              <transition name="fade">
                <p
                  v-if="success"
                  class="mt-3 text-center font-medium text-green-600">
                  ✓ Thank you! I’ll contact you shortly.
                </p>
              </transition>
              <p v-if="error" class="text-red-600">
                {{ error }}
              </p>
            </div>
            <button
              type="submit"
              :disabled="!isValid || loading || success"
              class="relative flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
              <svg
                v-if="loading"
                class="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  stroke-width="4" />
                <path
                  class="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8v8z" />
              </svg>

              <span v-if="success">✓ Sent</span>
              <span v-else-if="loading">Sending...</span>
              <span v-else>Send message</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from "vue";
import { createContactForm } from "../composables/useContactForm.js";
import { apiUrl } from "../api.js";

const props = defineProps({
  subject: { type: String, default: "" },
  tourname: { type: String, default: "" },
  name: { type: String, default: "" },
  surname: { type: String, default: "" },
  email: { type: String, default: "" },
  message: { type: String, default: "" },
});

const emit = defineEmits(["close"]);

const contactForm = createContactForm();

const loading = ref(false);
const success = ref(false);
const error = ref(null);
const shake = ref(false);
const firstInput = ref(null);

/* -----------------------
   Init
------------------------*/
const initializeForm = () => {
  contactForm.tourTitle = props.tourname || "Jota Tours";
  contactForm.subject = props.subject || "General Inquiry";

  contactForm.name = props.name;
  contactForm.surname = props.surname;
  contactForm.email = props.email;

  contactForm.message =
    props.message ||
    (props.tourname
      ? `Please get in touch with me about ${props.tourname}`
      : "");
};

initializeForm();

/* -----------------------
   Validation
------------------------*/
const isValid = computed(() => {
  return (
    contactForm.surname.trim() !== "" &&
    contactForm.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)
  );
});

/* -----------------------
   Auto close after success
------------------------*/
watch(success, (val) => {
  if (val) {
    setTimeout(() => {
      emit("close");
    }, 2000); // sluit na 2 seconden
  }
});

/* -----------------------
   Submit
------------------------*/
const submitForm = async () => {
  if (!isValid.value) {
    shake.value = true;
    setTimeout(() => (shake.value = false), 400);
    return;
  }

  error.value = null;
  loading.value = true;

  if (contactForm.company) {
    loading.value = false;
    return;
  }

  try {
    const res = await fetch(apiUrl("/public/contact"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactForm),
    });

    if (!res.ok) throw new Error("Sending failed");

    success.value = true;

    Object.assign(contactForm, createContactForm());
    initializeForm();
  } catch (err) {
    error.value = err.message || "Something went wrong";
    shake.value = true;
    setTimeout(() => (shake.value = false), 400);
  } finally {
    loading.value = false;
  }
};

const emailValid = computed(() =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email),
);

const progress = computed(() => {
  const fields = [
    contactForm.surname,
    contactForm.email,
    contactForm.name,
    contactForm.country,
    contactForm.message,
  ];

  const filled = fields.filter((f) => f && f.toString().trim() !== "").length;
  return Math.min(100, (filled / fields.length) * 100);
});

onMounted(async () => {
  await nextTick();
  firstInput.value?.focus();
});
</script>
