<script setup lang="ts">
import { useFetch, useRoute } from '#app';
import { computed } from 'vue';

const path = useRoute().params.path as string || '';
const pathParts = path.split('/');

const { data: keys } = await useFetch('/api/content/list', {
  query: { path }
});

const keysWithoutCurrentPath = computed(() => {
  return keys.value?.map((key: string) =>
    key.replace(new RegExp('^' + pathParts.join(':') + ':'), '')
  ) || [];
});

const files = computed(() => {
  return keysWithoutCurrentPath.value.filter((key: string) => !key.includes(':'));
});

const dirs = computed(() => {
  return keysWithoutCurrentPath.value.reduce((acc: string[], key: string) => {
    const parts = key.split(':');
    if (parts.length > 1 && parts[0]) {
      const dir = parts[0];
      if (!acc.includes(dir)) {
        acc.push(dir);
      }
    }
    return acc;
  }, []);
});
</script>

<template>
  <div>
    <div class="breadcrumbs">
      <a href="/admin">Hauptverzeichnis</a>
      <span v-for="(part, index) in pathParts" :key="index">
        /
        <a :href="`/admin/${pathParts.slice(0, index + 1).join('/')}`">
          {{ part }}
        </a>
      </span>
    </div>

    <div class="files" v-if="files.length">
      <a v-for="file in files" :key="file" :href="`/admin/${path ? path + '/' : ''}${file}`">{{ file }}</a>
    </div>

    <div class="dirs" v-if="dirs.length" style="margin-top: 8px;">
      <a v-for="dir in dirs" :key="dir" :href="`/admin/${path ? path + '/' : ''}${dir}`">
        <span>
          {{ dir.replace(/:/g, '/').replace(path, '') }}
        </span>
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 16px; height: 16px; vertical-align: middle;">
            <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </a>
    </div>
  </div>
</template>