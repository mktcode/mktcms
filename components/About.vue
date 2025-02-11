<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts/list', { method: 'POST', body: { category: 'product', limit: 6 } });
</script>

<template>
  <section id="about" class="py-32 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-12">
        <img src="/img/profil-placerholder.jpg" alt="Beatrix Kopischke" class="rounded-full w-64 h-64">
        <div>
          <h3 class="text-2xl font-bold text-rose-900 mb-4">
            Inner Balance und Lifestyle Coaching
          </h3>
          <h2 class="text-4xl md:text-6xl font-bold text-indigo-950">
            Gesundheit geht nur ganzheitlich.
          </h2>
          <p class="mt-8 text-xl text-gray-600 leading-relaxed">
            Möchtest du dich gesünder ernähren, ohne auf Genuss zu verzichten? Suchst du eine Ernährungsweise, die zu deinem Lebensstil passt – ob vegetarisch, vegan oder klimafreundlich? Ich unterstütze dich dabei, bewusste Entscheidungen zu treffen, die dein Wohlbefinden steigern.
          </p>
          <p class="mt-4 text-xl text-gray-600 leading-relaxed">
            Doch wahre Balance umfasst mehr als nur Ernährung. Bewegung und Achtsamkeit sind ebenso entscheidend. Mit Faszienyoga, Achtsamkeitstraining und kreativem Schreiben helfe ich dir, Stress zu reduzieren, dich selbst besser kennenzulernen und deinen Körper zu stärken.
          </p>
          <p class="mt-4 text-xl text-gray-600 leading-relaxed">
            Entdecke, wie du durch einfache, alltagstaugliche Methoden mehr Leichtigkeit in dein Leben bringst.
            Lass uns gemeinsam den Weg zu mehr Wohlbefinden gehen!
          </p>

          <div class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div v-for="post in posts" :key="post.id" class="flex flex-col items-center">
              <h4 class="text-2xl font-bold text-indigo-950">
                {{ post.title }}
              </h4>
              <p class="my-4 text-lg text-center text-gray-600 leading-relaxed">
                {{ post.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>