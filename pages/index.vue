<script setup lang="ts">
const { data: posts } = await useAsyncData(() => queryCollection('mktcms').all())
</script>

<template>
  <div class="h-screen flex flex-col">
    <Navbar />
    <Hero />
  </div>
  <About />
  <Contact />
  <Footer />
</template>
