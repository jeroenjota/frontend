// src/composables/useContactForm.js
import { reactive } from "vue";

export function createContactForm() {
  return reactive({
    title: "",
    name: "",
    surname: "",
    language: "",
    phone: "",
    country: "",
    email: "",
    message: "",
    transportation: "",
    tourId: null,
    tourTitle: "",
    preferredDate: "",
    groupSize: 1,
    company: "", // honeypot
  });
}