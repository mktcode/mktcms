<script setup lang="ts">
import { EnvelopeIcon, PhoneIcon } from '@heroicons/vue/24/outline'

const {
  logoWidth,
  title,
  subtitle,
  email,
  phone,
  slogan,
  description,
} = usePlanner()
</script>

<template>
  <div class="flex">
    <div class="shadow-xl max-w-md bg-white -rotate-3 flex gap-4 aspect-8/5 w-full z-20 group hover:scale-105 hover:rotate-0 hover:shadow-2xl transition-all">
      <div class="absolute inset-0 z-0 bg-gradient-to-bl from-transparent to-gray-400/10 opacity-100 group-hover:opacity-0 transition-all" />
      <div class="p-6 flex flex-col gap-4 w-full">
        <div class="flex items-center gap-4">
          <div>
            <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full max-w-16" :style="{ width: `${logoWidth}px` }" />
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
        <div class="text-2xl font-bold">
          {{ slogan }}
        </div>
        <div class="flex flex-col gap-1">
          <div class="flex gap-2 items-center" v-if="phone">
            <PhoneIcon class="size-4 text-gray-400" />
            <div class="text-sm text-gray-600">
              {{ phone }}
            </div>
          </div>
          <div class="flex gap-2 items-center" v-if="email">
            <EnvelopeIcon class="size-4 text-gray-400" />
            <div class="text-sm text-gray-600">
              {{ email }}
            </div>
          </div>
        </div>
      </div>
      <img src="~/assets/img/default-header.jpg" alt="Header" class="w-36 aspect-9/16 object-cover" />
    </div>
    <div class="shadow-xl max-w-md bg-white rotate-3 flex gap-4 aspect-8/5 w-full z-10 -ml-6 hover:z-30 hover:scale-105 hover:rotate-0 hover:shadow-2xl transition-all">
      <div class="absolute inset-0 z-0 bg-gradient-to-bl from-transparent to-gray-400/10 opacity-100 group-hover:opacity-0 transition-all" />
      <div class="p-16 text-center flex flex-col items-center justify-center gap-4 w-full">
        <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full" :style="{ width: `120px` }" />
        <div class="text-3xl font-bold">
          {{ slogan }}
        </div>
        <div class="text-lg text-gray-700">
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>