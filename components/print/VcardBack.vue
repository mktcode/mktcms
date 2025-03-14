<script setup lang="ts">
defineProps<{
  showLogo: boolean
  title: string
  text: string
}>()
</script>

<template>
  <div class="@container bg-white flex aspect-[8.5/5.5] w-full overflow-hidden text-gray-950">
    <div class="p-[6cqw] flex flex-col items-center justify-center gap-[3cqw] w-full">
      <img v-if="showLogo" src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full mb-[3cqw] w-[25cqw]" />
      <div v-if="title" class="font-bold text-[5cqw] leading-none">
        {{ title }}
      </div>
      <div v-if="text" class="text-center text-[4cqw]">
        {{ text }}
      </div>
    </div>
  </div>
</template>