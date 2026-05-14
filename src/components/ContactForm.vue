<!-- ContactForm.vue modal -->

<template>
  <transition name="modal-fade">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      @click.self="emit('close')">
      <div
        class="scroll-mt-45 max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border-4 border-blue-500 bg-gray-200 p-6 shadow-2xl">
        <h2 class="font-garamond text-primary text-xl sm:text-2xl">
          {{ subject }} 
          <p class="text-right text-lg font-normal">
          (Base price {{ baseprice > 0 ? formatEuro(baseprice) : "Free info"   }} {{ perpersonprice > 0 ? "+ " + formatEuro(perpersonprice) + " pp" : "" }})
          </p>
        </h2>
        <p class="text-sm text-gray-600 sm:text-base">
          Please fill in the form below, and we will get back to you as soon as
          possible.
        </p>
        <p
          class="mb-1 hidden text-sm text-gray-900 sm:mb-2 sm:block sm:text-base">
          First name, surname, and email are required, but it will help if you
          provide as much information as possible
        </p>
        <form
          @submit.prevent="submitForm"
          :class="[
            'mx-auto max-w-3xl space-y-3 sm:space-y-6 border-2 border-gray-500 p-4 sm:p-6 shadow-md',
            shake ? 'animate-[shake_0.3s_ease-in-out]' : '',
          ]">
          <div
            class="mb-2 hidden h-2 w-full rounded bg-gray-300 text-sm sm:block sm:text-base">
            <div
              class="h-2 rounded bg-blue-500 transition-all duration-300"
              :style="{ width: progress + '%' }"></div>
          </div>
          <!-- Naam -->
          <div class="grid gap-2 sm:grid-cols-4">
            <div class="sm:col-span-1">
              <label class="hidden text-sm font-medium text-gray-700 sm:block"
                >First name</label
              >
              <input
                v-model="contactForm.name"
                required
                placeholder="First name"
                type="text"
                class="form-input sm:placeholder-transparent" />
            </div>

            <div class="sm:col-span-2">
              <label class="hidden text-sm font-medium text-gray-700 sm:block"
                >Surname</label
              >
              <input
                v-model="contactForm.surname"
                type="text"
                placeholder="Surname"
                required
                class="form-input sm:placeholder-transparent" />
            </div>
            <div class="w-full">
              <label class="hidden text-sm font-medium text-gray-700 sm:block"
                >Country</label
              >
              <input
                v-model="contactForm.country"
                type="text"
                placeholder="Country"
                class="form-input sm:placeholder-transparent" />
            </div>
          </div>
          <div class="grid gap-2 sm:grid-cols-4">
            <!--  Email -->
            <div class="w-full sm:col-span-3">
              <label class="hidden text-sm font-medium text-gray-700 sm:block"
                >Email</label
              >
              <input
                v-model="contactForm.email"
                type="email"
                placeholder="Email"
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

            <div class="grid sm:grid-cols-1">
              <!-- Phone -->
              <div class="w-full">
                <label class="hidden text-sm font-medium text-gray-700 sm:block"
                  >Phone</label
                >
                <input
                  v-model="contactForm.phone"
                  type="text"
                  placeholder="Phone"
                  class="form-input w-full sm:placeholder-transparent" />
              </div>
            </div>
          </div>
          <!-- Tour details -->
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-7">
            <div class="w-full sm:col-span-2">
              <div class="col-span-2">
                <label class="text-sm font-medium text-gray-700 sm:block"
                  >Preferred date</label
                >
                <input
                  v-model="contactForm.preferredDate"
                  type="date"
                  class="form-input sm:placeholder-transparent" />
              </div>
            </div>

            <!-- language -->
            <div class="col-span-1 w-full">
              <label class="text-sm font-medium text-gray-700 sm:block"
                >Language</label
              >
              <select
                v-model="contactForm.language"
                class="form-input sm:placeholder-transparent" value="Eng">
                <option value="en">Eng</option>
                <option value="nl">Ned</option>
                <option value="fr">Fra</option>
                <option value="de">Deu</option>
                <option value="es">Esp</option>
              </select>
            </div>
            <div class="colspan-1 grid sm:col-span-1">
              <label class="block text-sm font-medium text-gray-700 sm:block"
                >Party(max {{ maxGroupSize }})</label
              >
              <input
                v-model.number="contactForm.groupSize"
                type="number"
                min="1"
                :max="maxGroupSize"
                placeholder="Number of people"

                class="form-input sm:placeholder-transparent" />

            </div>
            <div class="col-span-3" v-if="transportation==='Car'">  
              <label class="block text-sm font-medium text-gray-700 sm:block"
                >Transport
                <span v-if="contactForm.groupSize===4 && contactForm.transportation==='MyVolvo'"> (4 Maybe tight in the back)</span>
                </label
              >
              <select
                v-model="contactForm.transportation"
                class="form-input sm:placeholder-transparent">
                <option v-if="transportation!=='Car'" value="">{{ transportation }}</option>
                <option v-else=""
                  v-for="option in availableTransportOptions"
                  :key="option.value"
                  :value="option.value">
                  {{ option.label }} ({{ option.max }}p, {{ formatEuro(option.price) }} extra)
                </option>
              </select>
            </div>

          </div>

          <!-- Bericht -->
          <div>
            <label class="hidden text-sm font-medium text-gray-700 sm:block"
              >Message</label
            >
            <textarea
              v-model="contactForm.message"
              rows="6"
              class="form-input sm:placeholder-transparent"
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
          <!-- Actions -->
          <div class="space-y-1">
            <!-- Privacy agreement -->
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

            <!-- Status message -->
            <div class="min-h-5 text-sm">
              <transition name="fade">
                <p v-if="success" class="font-medium text-green-600">
                  ✓ Thank you! I’ll contact you shortly.
                </p>
              </transition>

              <p v-if="error" class="text-red-600">
                {{ error }}
              </p>
            </div>

            <!-- Buttons -->
            <div class="flex items-center justify-between">
              <button
                type="button"
                @click="emit('close')"
                class="rounded-lg bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400">
                Close
              </button>

              <button
                type="submit"
                :disabled="!isValid || loading || success"
                class="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
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

const emit = defineEmits(["togglePrivacy", "toggleTerms", "close"]);

const props = defineProps({
  subject: { type: String, default: "" },
  tourname: { type: String, default: "" },
  baseprice: { type: Number, default: 0 },
  perpersonprice: { type: Number, default: 0 },
  mode: { type: String, default: "info" },
  preferredDate: { type: String, default: "" }, // 👈 nieuw
  startTime: { type: String, default: "" }, // 👈 nieuw
  maxGroupSize: { type: Number, default: 4 }, // 👈 nieuw
  transportation: { type: String, default: "" }, // 👈 nieuw
});

const contactForm = createContactForm();

const loading = ref(false);
const success = ref(false);
const error = ref(null);
const shake = ref(false);
const firstInput = ref(null);
const agreedToPrivacy = ref(false);
/* -----------------------
   Init
------------------------*/
const initializeForm = () => {
  contactForm.tourTitle = props.tourname || "Jota Tours";
  contactForm.subject =
    props.subject ||
    (props.mode === "booking"
      ? `Booking request - ${props.tourname}`
      : `Info request - ${props.tourname}`);

  // Zet preferred date indien meegegeven
  contactForm.preferredDate = props.preferredDate || "";

  // Berichten afhankelijk van mode
  if (props.mode === "booking") {
    contactForm.message = `I would like to book
    Tour: ${props.tourname}
    Date: ${props.preferredDate || "[please suggest a date]"}
    Start time: ${props.startTime || "[please suggest a time]"}
Please contact me with more details.
Thank you.`;
  } else if (props.mode === "info") {
    contactForm.message = `I would like to know more about your tour
    "${props.tourname}"
Please contact me.
Thank you.`;
  } else {
    contactForm.message = "";
  }
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
   Transportation methods + prices
------------------------*/
const transportOptions = [
  { value: "MyVolvo", label: "My Volvo V70", max: 4, price: 0 },
  { value: "Rent-SUV", label: "SUV rental", max: 4, price: 150 },
  { value: "Rent-Vito", label: "Mercedes Vito", max: 8, price: 250 },
  { value: "Rent-Lux", label: "Mercedes V-Class", max: 7, price: 350 },
];

const formatEuro = (amount) => {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
};

const availableTransportOptions = computed(() => {
  const size = Number(contactForm.groupSize) || 1;
  return transportOptions.filter((option) => size <= option.max);
});

const choice4GroupSize = computed(() => {
  if (contactForm.groupSize === 4) {
    return "Maybe tight in the back)";
  }
  else {
    return "";
  }   
});

watch(
  () => contactForm.groupSize,
  () => {
    const isCurrentSelectionValid = availableTransportOptions.value.some(
      (option) => option.value === contactForm.transportation,
    );

    if (!isCurrentSelectionValid) {
      contactForm.transportation = availableTransportOptions.value[0]?.value || "";
    }
  },
  { immediate: true },
);

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
  if (!agreedToPrivacy.value) {
    shake.value = true;
    setTimeout(() => (shake.value = false), 400);
    alert("Please agree to the privacy policy before submitting.");
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
