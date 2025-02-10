<script setup lang="ts">
const { data: posts } = await useAsyncData(() => queryCollection('mktcms').all())
</script>

<template>
  <div class="h-screen flex flex-col">
    <Navbar />
    <Hero />
  </div>

  <!-- Food Section -->
  <section id="food" class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Food</h2>
      <p class="text-gray-600">
        Discover nourishing recipes and mindful eating practices designed to elevate your body and spirit.
        Learn how to integrate holistic nutrition into your daily routine.
      </p>
    </div>
  </section>

  <!-- Attention Section -->
  <section id="attention" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Attention</h2>
      <p class="text-gray-600">
        Develop focus and mindfulness through attention training techniques.
        Explore practical methods to cultivate clarity and presence in your everyday life.
      </p>
    </div>
  </section>

  <!-- Yoga Section -->
  <section id="yoga" class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Yoga</h2>
      <p class="text-gray-600">
        Unleash the power of yoga to connect your body, mind, and spirit.
        Our sessions cater to all levels, fostering flexibility, strength, and balance.
      </p>
    </div>
  </section>

  <!-- Om Section -->
  <section id="om" class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Om</h2>
      <p class="text-gray-600">
        Embrace the calming vibrations of the sacred sound Om.
        Learn to integrate meditation and sound healing into your practice to nurture inner peace.
      </p>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="py-16 bg-white">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Contact</h2>
      <form class="max-w-lg mx-auto">
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="name">Name</label>
          <input id="name" type="text" placeholder="Your Name"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="email">Email</label>
          <input id="email" type="email" placeholder="Your Email"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500">
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 mb-2" for="message">Message</label>
          <textarea id="message" rows="4" placeholder="Your Message"
            class="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"></textarea>
        </div>
        <button type="submit" class="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded shadow">
          Send Message
        </button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-gray-800 py-6">
    <div class="container mx-auto px-4 text-center">
      <p class="text-gray-400">© 2025 Fayo-Coach. All rights reserved.</p>
    </div>
  </footer>
</template>
