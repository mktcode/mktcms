<script setup lang="ts">
import { useFetch } from '#app'
import Files from './files.vue'
import Dirs from './dirs.vue'
import usePathParam from '../../composables/usePathParam'

const { path } = usePathParam()

const { data: list } = await useFetch('/api/admin/list', {
  query: { path },
})
</script>

<template>
  <div>
    <Files
      v-if="list && list.files.length"
      :files="list.files"
    />

    <Dirs
      v-if="list && list.dirs.length"
      :dirs="list.dirs"
      style="margin-top: 8px;"
    />
  </div>
</template>
