<template>
  <section
    id="privacy"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    @click.self="$emit('close')">
    <main
      class="rounded-lg border-4 border-gray-500 bg-blue-100 p-2 shadow-2xl sm:max-h-[85vh]">
      <header class="mb-4 text-center">
        <h2
          class="font-garamond text-primary text-2xl font-bold sm:text-3xl md:text-4xl">
          Privacy Policy Jota Tours
        </h2>
      </header>

      <div
        class="max-w-200 max-h-[75vh] w-full overflow-hidden overflow-y-auto overscroll-contain rounded-lg bg-blue-100 p-4 shadow-2xl">
        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Identity of the Controller
        </h3>
        <div class="text-lg leading-relaxed">
          Jota Tours, operating in and around Amsterdam, The Netherlands, is
          responsible for the processing of personal data as described in this
          Privacy Policy. Contact: info@jota.nl Chamber of Commerce (KvK): 336430
        </div>

        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Personal Data We Collect
        </h3>
        <div class="text-lg leading-relaxed">
          When you contact us or book a private tour, we may collect: name,
          email address, phone number, group size, preferred tour date, billing
          details (if applicable), IP address, and any information you provide
          in contact or booking forms. We only collect data necessary to provide
          our services.
        </div>

        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Purpose of Processing
        </h3>
        <div class="text-lg leading-relaxed">
          Personal data is processed for the following purposes: responding to
          inquiries, confirming and performing tour bookings, communication
          regarding your tour, invoicing, complying with legal obligations, and
          improving our website and services. Processing is based on contractual
          necessity, legal obligations, legitimate interest, or consent where
          applicable.
        </div>

        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Payments
        </h3>
        <div class="text-lg leading-relaxed">
          Payments may be handled by third-party payment providers. Jota Tours
          does not store full payment details. Payment providers process your
          data in accordance with their own privacy policies.
        </div>

        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Data Retention
        </h3>
        <div class="text-lg leading-relaxed">
          Booking and invoice data are retained for 7 years in accordance with
          Dutch tax regulations. Contact inquiries without booking are retained
          for up to 12 months. Data provided based on consent (e.g., marketing)
          is retained until consent is withdrawn.
        </div>

        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Sharing of Data
        </h3>
        <div class="text-lg leading-relaxed">
          Jota Tours does not sell personal data. Data may be shared with
          hosting providers, IT service providers, payment processors, and
          accounting services when necessary for business operations or legal
          compliance. All third parties are required to process data securely
          and confidentially.
        </div>

        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Cookies
        </h3>
        <div class="text-lg leading-relaxed">
          Our website uses cookies to ensure proper functionality and improve
          user experience. Analytical or tracking cookies are only used with
          prior consent where required. You may disable cookies through your
          browser settings.
        </div>

        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Your Rights
        </h3>
        <div class="text-lg leading-relaxed">
          Under the General Data Protection Regulation (GDPR), you have the
          right to access, correct, delete, restrict or object to the processing
          of your personal data, and to request data portability. You may
          withdraw consent at any time. Requests can be submitted to
          info@jota.nl. You also have the right to lodge a complaint with the
          <span class="italic"> Autoriteit Persoonsgegevens </span>.
        </div>

        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Data Security
        </h3>
        <div class="text-lg leading-relaxed">
          Jota Tours takes appropriate technical and organizational measures to
          protect personal data against unauthorized access, loss, misuse, or
          disclosure.
        </div>
        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Photography and Media
        </h3>
        <div class="text-lg leading-relaxed">
          During tours, photographs or short video recordings may occasionally
          be taken for promotional and marketing purposes, including use on the
          Jota Tours website and social media channels. If individuals are
          clearly recognizable in any image, such material will only be used
          with prior consent. Participation in photographs is entirely
          voluntary. You may decline to be photographed at any time during the
          tour without providing a reason. If you have given consent and later
          wish to withdraw it, you may contact Jota Tours at info@jota.nl. Upon
          request, we will remove the relevant material where reasonably
          possible.
        </div>
        <h3 class="font-garamond text-primary text-2xl font-bold sm:text-3xl">
          Changes to this Policy
        </h3>
        <div class="text-lg leading-relaxed">
          Jota Tours reserves the right to amend this Privacy Policy. The most
          recent version will always be published on the website.
        </div>

        <div class="mt-4 text-center">
          <button
            @click="$emit('close')"
            class="rounded-2xl bg-amber-700 px-4 py-2 text-center text-white">
            Close
          </button>
        </div>
      </div>
    </main>
  </section>
</template>

<script setup>
const emit = defineEmits(["close"]);
</script>

<style scoped></style>
