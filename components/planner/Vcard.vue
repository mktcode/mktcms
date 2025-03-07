<script setup lang="ts">
import { PhoneIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="flex">
    <div class="shadow-xl max-w-md bg-white -rotate-3 flex gap-4 aspect-8/5 w-full z-20 hover:scale-105 hover:rotate-0 hover:shadow-2xl">
      <div class="p-6">
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
      <img src="~/assets/img/default-header.jpg" alt="Header" class="w-36 aspect-9/16 object-cover" />
    </div>
    <div class="shadow-xl max-w-md bg-white rotate-3 flex gap-4 aspect-8/5 w-full z-10 -ml-6 hover:z-30 hover:scale-105 hover:rotate-0 hover:shadow-2xl">
      <div class="p-16 text-center flex flex-col items-center justify-center gap-4 w-full">
        <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full" :style="{ width: `120px` }" />
        <div class="text-3xl font-bold">
          Ein Programmierer zum anfassen!
        </div>
        <div class="text-lg text-gray-700">
          Wir programmieren Ihre Website und vieles mehr. Einfach und schnell.
        </div>
      </div>
    </div>
  </div>
</template>