<script setup lang="ts">
defineProps<{
  logoWidth: number
  image: string
  title: string
  subtitle: string
  slogan: string
  street: string
  zip: string
  city: string
  email: string
  phone: string
  website: string
}>()

const { public: { s3Endpoint } } = useRuntimeConfig()
</script>

<template>
  <div class="@container bg-white flex aspect-[8.5/5.5] w-full overflow-hidden text-gray-950 whitespace-normal">
    <div class="p-[6cqw] flex flex-col justify-between w-[67cqw]">
      <div class="flex items-center gap-[3cqw]">
        <div>
          <img src="~/assets/img/mktcms.png" alt="Logo" class="rounded-full w-[15cqw]" />
        </div>
        <div>
          <div class="font-bold text-[3cqw] leading-none">
            {{ title }}
          </div>
          <div class="text-[3cqw]">
            {{ subtitle }}
          </div>
        </div>
      </div>
      <div class="text-[5cqw] font-bold leading-tight">
        {{ slogan }}
      </div>
      <div class="flex flex-col gap-[1cqw]">
        <div class="flex gap-[1cqw] items-start" v-if="street && zip && city">
          <UIcon name="i-heroicons-building-office-2" class="size-[3cqw] text-gray-300 shrink-0" />
          <div class="text-[3cqw] text-gray-600 leading-tight">
            {{ street }},<br />{{ zip }} {{ city }}
          </div>
        </div>
        <div class="flex gap-[1cqw] items-center" v-if="phone">
          <UIcon name="i-heroicons-phone" class="size-[3cqw] text-gray-300 shrink-0" />
          <div class="text-[3cqw] text-gray-600">
            {{ phone }}
          </div>
        </div>
        <div class="flex gap-[1cqw] items-center" v-if="email">
          <UIcon name="i-heroicons-envelope" class="size-[3cqw] text-gray-300 shrink-0" />
          <div class="text-[3cqw] text-gray-600">
            {{ email }}
          </div>
        </div>
        <div class="flex gap-[1cqw] items-center" v-if="website">
          <UIcon name="i-heroicons-globe-alt" class="size-[3cqw] text-gray-300 shrink-0" />
          <div class="text-[3cqw] text-gray-600">
            {{ website }}
          </div>
        </div>
      </div>
    </div>
    <img
      v-if="image"
      :src="`${s3Endpoint}/mktcms/${image}`"
      alt="Bild"
      class="w-[33cqw] object-cover shrink-0"
    />
  </div>
</template>