<template>
  <div class="space-y-4">

    <!-- Month navigation -->
    <div class="mb-2 flex items-center justify-between">
      <button @click="prevMonth" class="rounded bg-gray-200 px-3 py-1">Prev</button>
      <h2 class="text-lg font-semibold">
        {{ currentMonthName }} {{ currentYear }}
      </h2>
      <button @click="nextMonth" class="rounded bg-gray-200 px-3 py-1">Next</button>
    </div>

    <!-- Calendar grid -->
    <div class="grid grid-cols-7 gap-1 text-center">
      <!-- Weekdays -->
      <div class="font-semibold" v-for="d in weekdays" :key="d">{{ d }}</div>

      <!-- Days -->
      <template v-for="(day, idx) in monthDays" :key="idx">
        <div v-if="day"
             @click="selectDay(day)"
             :class="dayClass(day)">
          {{ day.getDate() }}
        </div>
        <div v-else></div>
      </template>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-2">Checking availability...</div>

    <!-- Available times -->
    <div v-if="availableTimes.length" class="mt-2">
      <h3 class="font-semibold">Available start times:</h3>
      <div class="mt-2 grid grid-cols-3 gap-2">
        <button v-for="time in availableTimes" :key="time"
                class="rounded bg-green-500 p-2 text-white hover:bg-green-600">
          {{ time }}
        </button>
      </div>
    </div>

    <div v-else-if="selectedDate && !loading" class="mt-2">
      No availability on this date.
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { apiUrl } from '../api.js';

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

// Weekdays labels
const weekdays = ['M','Tu','W','Th','F','Sa','Su'];

// -------------------- Helpers --------------------
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

// Month / Year
const currentYear = computed(() => current.value.getFullYear());
const currentMonth = computed(() => current.value.getMonth());
const currentMonthName = computed(() => current.value.toLocaleString('default',{ month: 'long' }));

// Tour min/max dates
const minDate = new Date(props.fromDate);
const maxDate = new Date(props.tillDate);

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

// -------------------- Fetch availability for the month --------------------
async function fetchMonthAvailability() {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0);

  const start = firstDay < minDate ? minDate : firstDay;
  const end = lastDay > maxDate ? maxDate : lastDay;

  const daysToCheck = [];
  for (let d = start.getDate(); d <= end.getDate(); d++) {
    const dateObj = new Date(currentYear.value, currentMonth.value, d);
    daysToCheck.push(formatDate(dateObj));
  }

  const availability = {};
  await Promise.all(daysToCheck.map(async dateStr => {
    try {
      const res = await fetch(apiUrl(`/public/availability?date=${dateStr}&tourId=${props.tourId}`));
      const data = await res.json();
      availability[dateStr] = data.length > 0; // true = boekbaar
    } catch (err) {
      console.error(err);
      availability[dateStr] = false;
    }
  }));

  monthAvailability.value = availability;
}

// -------------------- Day Classes --------------------
function dayClass(day) {
  if (!day) return '';
  const dateStr = formatDate(day);

  // Buiten tour-periode altijd grijs
  if (day < minDate || day > maxDate) 
    return 'bg-gray-200 text-gray-400 cursor-not-allowed rounded p-2';

  // Geen beschikbaarheid
  const isAvailable = monthAvailability.value[dateStr];
  if (!isAvailable) 
    return 'bg-gray-200 text-gray-400 cursor-not-allowed rounded p-2';

  // geselecteerd
  if (selectedDate.value && formatDate(selectedDate.value) === dateStr)
    return 'bg-blue-500 text-white rounded p-2';

  // beschikbaar
  return 'bg-green-100 hover:bg-green-200 rounded p-2 cursor-pointer';
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
    const res = await fetch(apiUrl(`/public/availability?date=${formatDate(date)}&tourId=${props.tourId}`));
    availableTimes.value = await res.json();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

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