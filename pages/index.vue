<script setup lang="ts">
const { data: posts } = await useAsyncData(() => queryCollection('mktcms').all())
</script>

<template>
  <!-- Navbar -->
  <header class="bg-white shadow">
    <div class="container mx-auto px-4 py-6 flex justify-between items-center">
      <div class="text-2xl font-bold text-gray-800">Fayo-Coach</div>
      <nav>
        <ul class="flex space-x-6">
          <li><a href="#food" class="text-gray-600 hover:text-gray-900">Food</a></li>
          <li><a href="#attention" class="text-gray-600 hover:text-gray-900">Attention</a></li>
          <li><a href="#yoga" class="text-gray-600 hover:text-gray-900">Yoga</a></li>
          <li><a href="#om" class="text-gray-600 hover:text-gray-900">Om</a></li>
          <li><a href="#contact" class="text-gray-600 hover:text-gray-900">Contact</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative h-96 bg-cover bg-center" style="background-image: url('/img/default-header.jpg');">
    <div class="absolute inset-0 bg-black/50 flex items-center">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-6xl font-bold text-white">Embrace Your Journey</h1>
        <p class="mt-4 text-xl text-gray-200">Food, Attention, Yoga, Om – Cultivate your inner balance.</p>
        <a href="#contact"
          class="mt-6 inline-block bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-6 rounded shadow">
          Get Started
        </a>
      </div>
    </div>
  </section>

  <!-- Mktcms Section -->
  <h1>News</h1>
  <ul>
    <li v-for="post in posts" :key="post.id">
      <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
    </li>
  </ul>

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
