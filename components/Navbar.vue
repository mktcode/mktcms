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
          <li><a href="#yoga" class="navlink">Über mich</a></li>
          <li><a href="#food" class="navlink">Kurse</a></li>
          <li><a href="#attention" class="navlink">Veranstaltungen</a></li>
          <li><a href="#om" class="navlink">Kontakt</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>