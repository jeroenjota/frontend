<template>
  <div
    id="contact"
    class="bg-linear-to-r scroll-mt-40 from-indigo-400 to-blue-500 px-4 py-6 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-4 text-center">
        <h1 class="font-garamond mb-2 text-2xl font-bold text-white md:text-4xl">
          Contact Us
        </h1>
      </div>

      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div class="space-y-8">
          <div class="rounded-lg border border-gray-100 bg-white p-8 shadow-xl">
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
        <div class="rounded-lg border border-gray-100 bg-white p-8 shadow-xl">
          <h2 class="mb-6 font-serif text-2xl font-semibold text-gray-900">
            Send us a message
          </h2>
          <form class="space-y-2" action="">
            <div class="flex items-start">
              <input
                type="text"
                id="name"
                name="name"
                class="w-full rounded-lg border-gray-200 p-2 hover:shadow-md focus:border-transparent focus:ring-2 focus:ring-sky-500"
                placeholder="Your name" />
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                class="w-full rounded-lg border-gray-200 p-2 hover:shadow-md focus:border-transparent focus:ring-2 focus:ring-sky-500"
                placeholder="Your email" />
            </div>
            <div>
              <textarea
                rows="5"
                id="message"
                class="w-full rounded-lg border-gray-200 p-2 hover:shadow-md focus:border-transparent focus:ring-2 focus:ring-sky-500"
                placeholder="Any special requests or questions?"></textarea>
            </div>
            <button
              class="w-full rounded-lg bg-teal-950 px-6 py-3 font-medium text-white shadow-md transition duration-300 hover:bg-teal-600">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup></script>
