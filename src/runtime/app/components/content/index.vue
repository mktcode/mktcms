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
    <div v-if="path">
      <a href="/admin">Root</a>
      <span v-for="(part, index) in pathParts" :key="index">
        /
        <a :href="`/admin/${pathParts.slice(0, index + 1).join('/')}`">
          {{ part }}
        </a>
      </span>
    </div>

    <hr />
    <div v-for="file in files" :key="file">
      <p>{{ file }}</p>
    </div>
    <hr />
    <div v-for="dir in dirs" :key="dir">
      <a :href="`/admin/${path ? path + '/' : ''}${dir}`">
        {{ dir.replace(/:/g, '/').replace(path, '') }}
      </a>
    </div>
  </div>
</template>