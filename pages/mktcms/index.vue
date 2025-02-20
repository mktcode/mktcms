<script setup lang="ts">
useHead({
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
  ],
});

definePageMeta({
  layout: 'mktcms',
  middleware() {
    const { loggedIn } = useUserSession()
    if (!loggedIn.value) {
      return navigateTo('/mktcms/login')
    }
  },
})

const businessinfo = await $fetch('/api/businessinfo')
const privacyPolicy = false
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-4">
      Willkommen
    </h1>
    
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div class="flex space-x-4 border border-gray-200 rounded-lg p-4">
        <div>
          <svg v-if="businessinfo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-green-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-yellow-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h2 class="text-xl font-bold text-gray-900 mb-2">
            Unternehmensdaten
          </h2>
          <p class="text-gray-600" v-if="businessinfo">
            Ihre Unternehmensdaten sind hinterlegt. Sie können diese jederzeit bearbeiten. Ein Impressum wird nun automatisch generiert.
          </p>
          <p class="text-gray-600" v-else>
            Sie haben Ihre Unternehmensdaten noch nicht hinterlegt. Um automatisch generierte Inhalte zu erstellen, wie z.B. Ihr Impressum, werden diese Daten benötigt.
          </p>
          <div v-if="businessinfo" class="flex ml-auto mt-4">
            <NuxtLink
              to="/impressum"
              class="button light"
              target="_blank"
            >
              <span>Impressum ansehen</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </NuxtLink>
            <NuxtLink
              to="/mktcms/businessinfo"
              class="button light"
            >
              <span>Daten bearbeiten</span>
            </NuxtLink>
          </div>
          <NuxtLink
            v-else
            to="/mktcms/businessinfo"
            class="button ml-auto mt-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
            </svg>
            <span>Unternehmendaten hinterlegen</span>
          </NuxtLink>
        </div>
      </div>
      <div class="flex space-x-4 border border-gray-200 rounded-lg p-4">
        <div>
          <svg v-if="privacyPolicy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-green-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-yellow-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>
        <div class="flex flex-col">
          <h2 class="text-xl font-bold text-gray-900 mb-2">
            Datenschutz
          </h2>
          <p class="text-gray-600" v-if="privacyPolicy">
            Ihre Datenschutzerklärung ist hinterlegt. Sie können diese jederzeit bearbeiten.
          </p>
          <p class="text-gray-600" v-else>
            Es fehlt noch eine Datenschutzerklärung.
            Füllen Sie bitte den Fragebogen zum Datenschutz aus, um Ihre Datenschutzerklärung zu generieren.
          </p>
          <div v-if="privacyPolicy" class="flex ml-auto mt-4">
            <NuxtLink
              to="/datenschutz"
              class="button light"
              target="_blank"
            >
              <span>Datenschutzerklärung ansehen</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 opacity-50">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </NuxtLink>
            <NuxtLink
              to="/mktcms/businessinfo"
              class="button light"
            >
              <span>Angaben bearbeiten</span>
            </NuxtLink>
          </div>
          <NuxtLink
            v-else
            to="/mktcms/businessinfo"
            class="button ml-auto mt-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.242 5.992h12m-12 6.003H20.24m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 1 1 1.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 0 1 0 2.25H3.74m0-.002h.375a1.125 1.125 0 0 1 0 2.25H2.99" />
            </svg>
            <span>Fragebogen ausfüllen</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>