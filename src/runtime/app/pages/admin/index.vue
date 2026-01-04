<script setup lang="ts">
const { data: pages, refresh } = await useFetch('/api/content')

const newPage = ref({
  title: '',
  slug: '',
  body: '',
})

async function addPage() {
  await $fetch('/api/admin/content/add', {
    method: 'POST',
    body: {
      title: newPage.value.title,
      slug: newPage.value.slug,
      body: newPage.value.body,
    },
  })

  await refresh()
}
</script>

<template>
  <div class="container mx-auto py-12">
    <h1 class="text-3xl font-bold mb-6">
      Inhalte
    </h1>
    <MktcmsCategories />
    <div class="mb-6 p-4 border border-gray-400 rounded">
      <h2 class="text-lg font-bold mb-2">
        Neuer Inhalt
      </h2>
      <input
        v-model="newPage.title"
        type="text"
        placeholder="Titel"
        class="admin-input"
      >
      <input
        v-model="newPage.slug"
        type="text"
        placeholder="Slug"
        class="admin-input"
      >
      <textarea
        v-model="newPage.body"
        placeholder="Inhalt (HTML)"
        class="admin-input"
        rows="5"
      />
      <div class="flex gap-2">
        <button
          class="admin-button"
          @click="addPage"
        >
          Inhalt hinzufügen
        </button>
        <button
          class="admin-button"
          @click="() => {}"
        >
          Datei auswählen
        </button>
      </div>
    </div>
    <div v-if="pages && pages.length">
      <div
        v-for="page in pages"
        :key="page.id"
        class="mb-6 p-4 border border-gray-400 rounded"
      >
        <h2 class="text-xl font-bold mb-2">
          {{ page.title }}
        </h2>
        <p class="mb-2">
          Slug: {{ page.slug }}
        </p>
        <div class="mb-2">
          {{ page.body }}
        </div>
        <div class="flex gap-2">
          <button
            class="admin-button"
            @click="() => {}"
          >
            Bearbeiten
          </button>
          <button
            class="admin-button bg-red-600 hover:bg-red-700"
            @click="() => {}"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
