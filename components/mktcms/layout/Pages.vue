<script setup lang="ts">
const { data: pages, refresh } = await useFetch('/api/pages/list', { method: 'POST' })

const showNewPageModal = ref(false)

const title = ref('')
const titleSlug = computed(() => title.value ? slugify(title.value) : 'titel-der-seite')
const isHome = ref(false)
const isDynamic = ref(false)

const createPage = async () => {
  await $fetch('/api/pages/create', {
    method: 'POST',
    body: {
      title: title.value,
      isHome: isHome.value,
      isDynamic: isDynamic.value,
    },
  })
  showNewPageModal.value = false
  await refresh()
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-4">
      Seiten
    </h1>
    <button @click="showNewPageModal = true" class="button">
      Neue Seite erstellen
    </button>
    <div v-for="page in pages">
      <h1 class="text-3xl font-bold mb-4 mt-10">
        {{ page.title }}
      </h1>
      <MktcmsLayoutSections :pageId="page.id" />
    </div>
    <MktcmsModal v-if="showNewPageModal">
      <h1>
        Neue Seite erstellen
      </h1>
      <div class="mt-4">
        <div>
          <label for="title">Titel</label>
          <input id="title" type="text" v-model="title" />
        </div>
        <div>
          <label for="isHome">Startseite</label>
          <input id="isHome" type="checkbox" v-model="isHome" />
        </div>
        <div v-if="!isHome">
          <label for="isDynamic">Dynamisch</label>
          <input id="isDynamic" type="checkbox" v-model="isDynamic" />
          <p>
            Wähle diese Option, wenn der Haupt-Inhalt dieser Seite durch die aufgerufene Adresse bestimmt werden soll.
            Also z.B. <span class="italic">https://meine-domain.de/{{ titleSlug }}/&lt;name-des-inhalts&gt;</span>.
            Sektionen, denen du keinen anderen Inhalt zuweisst, nutzen dann &lt;angebot-name&gt; aus der Kateogrie "Angebote".
          </p>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-2">
        <button class="button" @click="createPage">
          Erstellen
        </button>
        <button class="button" @click="showNewPageModal = false">
          Abbrechen
        </button>
      </div>
    </MktcmsModal>
  </div>
</template>