<script setup lang="ts">
const { loggedIn } = useUserSession()
</script>

<template>
  <NuxtLayout name="default">
    <UAlert class="rounded-none" icon="i-heroicons-information-circle">
      <template #title>
        Demo
      </template>
      <template #description>
        Dies ist eine öffentliche Demo. Alle Daten werden regelmäßig zurückgesetzt.
      </template>
    </UAlert>
    <div class="pt-6 px-6 flex items-center gap-4">
      <NuxtLink to="/" class="flex items-center gap-4">
        <img src="~/assets/img/logo-small.png" alt="Solihost Logo" class="w-28 -rotate-6" />
      </NuxtLink>
      <UButton v-if="!loggedIn" to="/login" variant="ghost" class="ml-auto" trailing-icon="i-heroicons-arrow-right-start-on-rectangle">
        Anmelden
      </UButton>
    </div>
    <MarketingFeatures />
    <MarketingAbout />
    <MarketingFooter />
  </NuxtLayout>
</template>