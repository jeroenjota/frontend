import { reactive } from 'vue'

export const contactForm = reactive({
  name: '',
  surname: '',
  language: '',
  phone: '',
  country: '',
  email: '',
  message: '',
  tourId: null,
  tourTitle: '',
  preferredDate: '',
  groupSize: 1,
  company: '' // honeypot, verborgen veld als hier iets is ingevuld is het een bot!
})
