<template>
  <div
    id="contact"
    class="py-16 scroll-mt-20 bg-linear-to-r from-sky-200 to-blue-50 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-primary mb-4 font-garamond">
          Contact Us
        </h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="space-y-8">
          <div class="bg-white p-8 rounded-lg shadow-xl border border-gray-100">
            <h2 class="text-2xl font-serif font-semibold text-gray-900 mb-6">
              Contact Information
            </h2>
            <div class="space-y-6">
              <div class="flex items-start">
                <div class="bg-emerald-500 p-3 rounded-full mr-4">
                  <Icon icon="mdi:phone" class="w-6 h-6 text-teal-50" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-950">Phone</h3>
                  <p class="text-gray-700">+31 6 4711 6541</p>
                </div>
              </div>
              <div class="flex items-start">
                <div class="bg-emerald-500 p-3 rounded-full mr-4">
                  <Icon icon="mdi:envelope" class="w-6 h-6 text-teal-50" />
                </div>
                <div>
                  <h3 class="text-lg font-medium text-gray-950">Email</h3>
                  <p class="text-gray-700">info@jota.nl</p>
                  <p class="text-gray-700">jeroen@jota.nl</p>
                </div>
              </div>
            </div>
            <p
              class="text-lg text-gray-800 max-w-4xl mx-auto mt-6 border-t-2 pt-6">
              I'd love to hear from you! Whether you have questions about the
              tours, need assistance with bookings, or just want to say hello,
              feel free to reach out.
            </p>
          </div>
        </div>
        <div class="bg-white p-8 rounded-lg shadow-xl border border-gray-100">
          <h2 class="text-2xl font-serif font-semibold text-gray-900 mb-6">
            Send us a message
          </h2>
          <form class="space-y-2" action="">
            <div class="flex items-start">
              <input
                type="text"
                id="name"
                name="name"
                class="w-full p-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent hover:shadow-md"
                placeholder="Your name" />
            </div>
            <div>
              <input
                type="email"
                id="email"
                name="email"
                class="w-full p-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent hover:shadow-md"
                placeholder="Your email" />
            </div>
            <div>
              <textarea
                rows="5"
                id="message"
                class="w-full p-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent hover:shadow-md"
                placeholder="Any special requests or questions?"></textarea>
            </div>
            <button
              class="w-full bg-teal-950 hover:bg-teal-600 text-white py-3 px-6 rounded-lg transition duration-300 font-medium shadow-md">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup></script>
