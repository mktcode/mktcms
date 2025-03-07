<script setup lang="ts">
import { PhoneIcon } from '@heroicons/vue/24/outline'

const {
  logoWidth,
  title,
  subtitle,
  slogan,
  description,
  targets,
} = usePlanner()
</script>

<template>
  <div class="flex">
    <div class="shadow-xl max-w-md bg-white -rotate-2 flex flex-col gap-4 justify-between aspect-[4.1/5.8] w-full z-40 hover:shadow-2xl hover:scale-105 hover:rotate-0">
      <img src="~/assets/img/default-header.jpg" alt="Header" class="w-full aspect-video object-cover" />
      <div class="p-6 flex-1">
        <div class="flex items-center gap-4">
          <div>
            <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full max-w-20" :style="{ width: `${logoWidth}px` }" />
          </div>
          <div>
            <div class="font-bold">
              {{ title }}
            </div>
            <div>
              {{ subtitle }}
            </div>
          </div>
        </div>
        <div class="mt-8 text-3xl font-bold">
          {{ slogan }}
        </div>
        <div class="mt-1 text-lg text-gray-700">
          {{ description }}
        </div>
        <div class="mt-8 flex gap-2 items-center">
          <PhoneIcon class="size-5 text-gray-400" />
          <div class="text-xl text-gray-600">
            0123 456789
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="(target, index) in targets" :key="index"
      class="-ml-32 shadow-xl max-w-md bg-white flex flex-col gap-4 justify-between aspect-[4.1/5.8] w-full hover:shadow-2xl hover:scale-105 hover:rotate-0 hover:z-50"
      :class="{
        'rotate-2': index % 2 === 0,
        '-rotate-2': index % 2 !== 0,
        'z-30': index == 0,
        'z-20': index == 1,
        'z-10': index == 2,
      }"
    >
    <img src="~/assets/img/default-header.jpg" alt="Header" class="w-full aspect-video object-cover" />
      <div class="p-6 flex-1">
        <div class="flex items-center gap-4">
          <div>
            <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full max-w-20" :style="{ width: `${logoWidth}px` }" />
          </div>
          <div>
            <div class="font-bold">
              {{ target.title }}
            </div>
            <div>
              {{ target.subtitle }}
            </div>
          </div>
        </div>
        <div class="mt-8 text-3xl font-bold">
          {{ target.slogan }}
        </div>
        <div class="mt-1 text-lg text-gray-700">
          {{ target.description }}
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