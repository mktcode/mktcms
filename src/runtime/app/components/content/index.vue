<script setup lang="ts">
import { useFetch, useRoute } from '#app'
import { computed } from 'vue'
import Breadcrumb from './breadcrumb.vue'
import Files from './files.vue'
import Dirs from './dirs.vue'

const path = useRoute().params.path as string || ''
const pathParts = path.split(':')

const { data: keys } = await useFetch('/api/admin/content/list', {
  query: { path },
})

const keysWithoutCurrentPath = computed(() => {
  return keys.value?.map((key: string) =>
    key.replace(new RegExp('^' + pathParts.join(':') + ':'), ''),
  ) || []
})

const files = computed(() => {
  return keysWithoutCurrentPath.value.filter((key: string) => !key.includes(':'))
})

const dirs = computed(() => {
  return keysWithoutCurrentPath.value.reduce((acc: string[], key: string) => {
    const parts = key.split(':')
    if (parts.length > 1 && parts[0]) {
      const dir = parts[0]
      if (!acc.includes(dir)) {
        acc.push(dir)
      }
    }
    return acc
  }, [])
})
</script>

<template>
  <div>
    <Breadcrumb :parts="pathParts" />

    <NuxtLink
      to="/admin/new"
      style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;"
    >
      Datei hochladen
    </NuxtLink>

    <Files
      v-if="files.length"
      :path="path"
      :files="files"
    />

    <Dirs
      v-if="dirs.length"
      :path="path"
      :dirs="dirs"
      style="margin-top: 8px;"
    />
  </div>
</template>
