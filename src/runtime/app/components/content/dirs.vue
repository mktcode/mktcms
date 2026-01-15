<script setup lang="ts">
defineProps<{
  path: string
  dirs: string[]
}>()
</script>

<template>
  <div class="dirs">
    <NuxtLink
      v-for="dir in dirs"
      :key="dir"
      :to="`/admin/${path ? path + ':' : ''}${dir}`"
    >
      <span>
        {{ dir }}
      </span>
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          style="width: 16px; height: 16px; vertical-align: middle;"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </span>
    </NuxtLink>
  </div>
</template>