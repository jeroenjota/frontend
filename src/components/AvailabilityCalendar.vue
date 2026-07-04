<template>
  <div class="space-y-4">
    <!-- STEP 1: MAANDOVERZICHT -->
    <div v-if="!selectedDate">
      <div class="mb-2 flex justify-center gap-4 text-xs">
        <span class="flex items-center gap-1">
          <span class="h-2 w-2 rounded-full bg-green-500"></span>
          many times
        </span>
        <span class="flex items-center gap-1">
          <span class="h-2 w-2 rounded-full bg-yellow-500"></span>
          few left
        </span>
      </div>
      <!-- Month navigation -->
      <div class="mb-2 flex items-center justify-between">
        <button @click="prevMonth" class="rounded bg-gray-200 px-3 py-1">
          Prev
        </button>
        <h2 class="text-lg font-semibold">
          {{ currentMonthName }} {{ currentYear }}
        </h2>
        <button @click="nextMonth" class="rounded bg-gray-200 px-3 py-1">
          Next
        </button>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-0.5 text-center">
        <div
          class="text-xs sm:text-sm sm:font-semibold"
          v-for="d in weekdays"
          :key="d">
          {{ d }}
        </div>

        <template v-for="(day, idx) in monthDays" :key="idx">
          <div
            v-if="day"
            class="relative flex aspect-square items-center justify-center rounded text-xs sm:text-sm"
            @click="selectDay(day)"
            :class="dayClass(day)">
            {{ day.getDate() }}
            <!-- Availability dots -->
            <span
              v-if="availabilityDot(day)"
              class="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full"
              :class="availabilityDot(day)"></span>
          </div>
          <div v-else></div>
        </template>
      </div>
    </div>

    <!-- STEP 2: BESCHIKBARE TIJDEN -->
    <div v-else>
      <!-- Geselecteerde datum -->
      <h2 class="mb-0 text-center font-semibold">Availability for</h2>
      <h2 class="mb-2 text-center font-semibold">
        {{ selectedDateFormatted }}
      </h2>

      <!-- Loading -->
      <div v-if="loading">Checking availability...</div>

      <!-- Beschikbare tijden -->
      <div v-if="availableTimes.length" class="mt-2 grid grid-cols-3 gap-2">
        <button
          v-for="time in availableTimes"
          :key="time"
          @click="selectTime(time)"
          class="rounded bg-green-500 p-2 text-white hover:bg-green-600">
          {{ time }}
        </button>
      </div>

      <div v-else-if="!loading">No availability on this date.</div>
      <!-- Terug knop -->
      <button
        @click="goBack"
        class="button mt-4 rounded-2xl bg-blue-600 px-4 py-1 text-lg text-blue-100 hover:underline">
        ← Back to calendar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { apiUrl } from "../api.js";

const emit = defineEmits(["select-time"]);

const props = defineProps({
  tourId: { type: Number, required: true },
  fromDate: { type: String, required: true },
  tillDate: { type: String, required: true },
});

// -------------------- Refs --------------------
const current = ref(new Date());
const selectedDate = ref(null);
const availableTimes = ref([]);
const loading = ref(false);
const monthAvailability = ref({}); // { 'YYYY-MM-DD': true/false }

const selectedTime = ref(null);

function selectTime(time) {
  selectedTime.value = time;
  emit("select-time", { date: selectedDate.value, time });
}

// Weekdays labels
const weekdays = ["M", "Tu", "W", "Th", "F", "Sa", "Su"];

// -------------------- Helpers --------------------
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// Month / Year
const currentYear = computed(() => current.value.getFullYear());
const currentMonth = computed(() => current.value.getMonth());
const currentMonthName = computed(() =>
  current.value.toLocaleString("default", { month: "long" }),
);

// Tour min/max dates
const minDate = props.fromDate.slice(0, 10);
const maxDate = props.tillDate.slice(0, 10);

// -------------------- Month Grid --------------------
const monthDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  const days = [];

  // Bereken offset: maandag = 0
  // JS: zondag=0, maandag=1, … zaterdag=6
  // formula: (day + 6) % 7 → maandag=0, zondag=6
  const offset = (firstDay.getDay() + 6) % 7;

  for (let i = 0; i < offset; i++) days.push(null);

  // echte dagen
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateObj = new Date(currentYear.value, currentMonth.value, d);
    days.push(dateObj);
  }

  return days;
});

function availabilityDot(day) {
  const dateStr = formatDate(day);
  const slots = monthAvailability.value[dateStr];

  if (!slots) return null;

  if (slots >= 4) return "bg-green-500"; // veel beschikbaar
  if (slots >= 1) return "bg-yellow-500"; // weinig beschikbaar

  return "bg-gray-400"; // vol
}

// -------------------- Fetch availability for the month --------------------
async function fetchMonthAvailability() {
  const res = await fetch(
    apiUrl(
      `/public/availability/month?year=${currentYear.value}&month=${
        currentMonth.value + 1
      }&tourId=${props.tourId}`,
    ),
  );

  const data = await res.json();
  // console.log("Month availability data:", data);
  const availability = {};

  Object.keys(data).forEach((date) => {
    availability[date] = data[date].length;
  });

  monthAvailability.value = availability;
}

// -------------------- Day Classes --------------------
// function dayClass(day) {
//   if (!day) return "";
//   const dateStr = formatDate(day);

//   // Buiten tour-periode altijd grijs
//   if (day < minDate || day > maxDate)
//     return "bg-gray-200 text-gray-400 cursor-not-allowed rounded p-2";

//   // Geen beschikbaarheid
//   const isAvailable = monthAvailability.value[dateStr];
//   if (!isAvailable)
//     return "bg-gray-200 text-gray-400 cursor-not-allowed rounded p-2";

//   // geselecteerd
//   if (selectedDate.value && formatDate(selectedDate.value) === dateStr)
//     return "bg-blue-500 text-white rounded p-2";

//   // beschikbaar
//   return "bg-green-100 hover:bg-green-200 rounded p-2 cursor-pointer";
// }

function dayClass(day) {
  if (!day) return "";

  const dateStr = formatDate(day);
  const base =
    "cursor-pointer aspect-square flex items-center justify-center rounded text-xs sm:text-sm";

  if (dateStr < minDate || dateStr > maxDate)
    return `${base} bg-gray-200 text-gray-400 cursor-not-allowed`;

  const slots = monthAvailability.value[dateStr];

  if (!slots) return `${base} bg-gray-200 text-gray-400 cursor-not-allowed`;

  if (selectedDate.value && formatDate(selectedDate.value) === dateStr)
    return `${base} bg-blue-500 text-white`;

  return `${base} bg-green-50 hover:bg-green-100`;
}

// -------------------- Select Day --------------------
function selectDay(day) {
  const dateStr = formatDate(day);
  if (!monthAvailability.value[dateStr]) return;
  selectedDate.value = day;
}

// -------------------- Fetch times voor geselecteerde dag --------------------
watch(selectedDate, async (date) => {
  if (!date) return;
  loading.value = true;
  availableTimes.value = [];

  try {
    const res = await fetch(
      apiUrl(
        `/public/availability?date=${formatDate(date)}&tourId=${props.tourId}`,
      ),
    );
    availableTimes.value = await res.json();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const selectedDateFormatted = computed(() => {
  if (!selectedDate.value) return "";
  return selectedDate.value.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
});

function goBack() {
  selectedDate.value = null;
  availableTimes.value = [];
}

// -------------------- Navigate Month --------------------
function prevMonth() {
  current.value = new Date(currentYear.value, currentMonth.value - 1, 1);
  fetchMonthAvailability();
}
function nextMonth() {
  current.value = new Date(currentYear.value, currentMonth.value + 1, 1);
  fetchMonthAvailability();
}



// Fetch availability bij load
onMounted(fetchMonthAvailability);
</script>
