<script setup lang="ts">
const { content: products } = await useContent('product', 3);
</script>

<template>
  <header class="bg-white shadow">
    <div class="container mx-auto px-4 py-6 flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <NuxtLink to="/">
          <img src="/img/logo.png" alt="Embrace Your Journey" class="h-8">
        </NuxtLink>
        <div class="leading-tight">
          <span class="text-indigo-950 font-bold">
            Beatrix Kopischke
          </span>
          <span class="block text-rose-900 italic">
            Lifestyle Coach
          </span>
        </div>
      </div>
      <nav>
        <ul class="flex space-x-12">
          <li>
            <NuxtLink to="/#about" class="navlink">Über mich</NuxtLink>
          </li>
          <li v-for="product in products" :key="product.id">
            <NuxtLink :to="`/content/${product.id}`" class="navlink">
              {{ product.title }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/#contact" class="navlink">Kontakt</NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>