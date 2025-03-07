<script setup lang="ts">
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import Color from "color";

const props = defineProps<{
  target: Target
}>()

const color = computed(() => props.target.color)
const colorHover = computed(() => Color(color.value).darken(0.1).hex())

const showCtaButton = computed(() => {
  if (props.target.ctaType === 0 && props.target.phone) {
    return true;
  }

  if (props.target.ctaType === 1 && props.target.email) {
    return true;
  }

  if (props.target.ctaType === 2 && props.target.link) {
    return true;
  }

  return false;
});
</script>

<template>
  <div class="border-8 border-gray-200 rounded-2xl overflow-x-hidden overflow-y-scroll target-preview aspect-9/16">
    <img src="~/assets/img/default-header.jpg" alt="Header" class="w-full aspect-video object-cover" />
    <div class="p-6">
      <div class="flex items-center gap-4">
        <div>
          <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full" :style="{ width: `100px` }" />
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
      <div class="mt-8 text-4xl font-bold">
        {{  target.slogan }}
      </div>
      <div class="mt-4 text-lg text-gray-700">
        {{ target.description }}
      </div>
      <div class="mt-4">
        <div class="flex flex-col gap-2 text-gray-700">
          <div v-for="benefit in target.benefits" class="flex items-start gap-2">
            <ChevronRightIcon class="size-5 opacity-50" :style="{ color: target.color }" />
            <span>{{ benefit }}</span>
          </div>
        </div>
      </div>
      <div v-if="showCtaButton" class="mt-8">
        <div v-if="target.ctaType === 0">
          <a :href="`tel:${target.phone}`" class="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
            </svg>
            {{ target.phone }}
          </a>
        </div>
        <div v-if="target.ctaType === 1">
          <a :href="`mailto:${target.email}`" class="button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
            {{ target.email }}
          </a>
        </div>
        <div v-if="target.ctaType === 2">
          <a :href="target.link" class="button">
            {{ target.link }}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50 ml-auto">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="bg-gray-50" v-if="target.contactEmail">
      <form class="p-6 flex flex-col gap-4">
        <h1 v-if="target.contactTitle" class="text-2xl font-bold text-gray-900">
          {{ target.contactTitle }}
        </h1>
        <p v-if="target.contactDescription" class="text-lg text-gray-700">
          {{ target.contactDescription }}
        </p>
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input type="text" id="name" class="input" />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            E-Mail
          </label>
          <input type="email" id="email" class="input" />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700">
            Nachricht
          </label>
          <textarea id="message" class="input" rows="4"></textarea>
        </div>
        <button class="button w-full mt-4">
          Absenden
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.target-preview .button {
  background-color: v-bind(color);
  &:hover {
    background-color: v-bind(colorHover);
  }
}
</style>