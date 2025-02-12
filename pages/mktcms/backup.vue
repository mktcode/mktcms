<script setup lang="ts">
definePageMeta({
  layout: 'mktcms',
})

const { public: { domain } } = useRuntimeConfig();

async function downloadArchive() {
  try {
    const response = await $fetch<Blob>('/api/backup/all', {
      method: 'POST',
      responseType: 'blob',
    });

    if (!response) throw new Error('Download failed');

    const blob = new Blob([response], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${domain}-backup-${new Date().toISOString().split('T')[0]}.zip`);
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
  }
}
</script>

<template>
  <div>
    <div class="flex items-center">
      <h1 class="text-3xl font-bold text-gray-900">
        Datensicherung
      </h1>
    </div>

    <div class="mt-10">
      <p>
        Hier können Sie alle Daten Ihrer Website und E-Mail-Postfächer herunterladen.
      </p>
      <button
        @click="downloadArchive"
        class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer flex items-center space-x-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
        </svg>
        <span>
          Alles herunterladen
        </span>
      </button>
    </div>
  </div>
</template>