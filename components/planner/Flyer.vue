<script setup lang="ts">
import { PhoneIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="flex">
    <div class="shadow-xl max-w-md bg-white -rotate-2 flex flex-col gap-4 justify-between aspect-[4.1/5.8] w-full z-20 hover:shadow-2xl hover:scale-105 hover:rotate-0">
      <img src="~/assets/img/default-header.jpg" alt="Header" class="w-full aspect-video object-cover" />
      <div class="p-6 flex-1">
        <div class="flex items-center gap-4">
          <div>
            <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full" :style="{ width: `100px` }" />
          </div>
          <div>
            <div class="font-bold">
              Marketing CMS
            </div>
            <div>
              Das Marketing-Tool für KMU
            </div>
          </div>
        </div>
        <div class="mt-8 text-3xl font-bold">
          Dein Slogan
        </div>
        <div class="mt-1 text-lg text-gray-700">
          Deine Beschreibung
        </div>
        <div class="mt-8 flex gap-2 items-center">
          <PhoneIcon class="size-5 text-gray-400" />
          <div class="text-xl text-gray-600">
            0123 456789
          </div>
        </div>
      </div>
    </div>
  </div>
</template>