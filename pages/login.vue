<template>
  <div class="min-h-screen max-w-lg mx-auto flex flex-col items-center justify-center">
    <img src="~/assets/img/logo-small.png" alt="Solihost" class="w-32 mx-auto mb-12" />
    <p class="text-lg text-gray-700 text-center mb-12">
      Aktuell ist die Anmeldung nur mit einem vorhandenen Google-Konto möglich und <span class="font-bold">erfordert eine Einladung</span>.
    </p>
    <a href="/auth/google" class="border border-gray-300 shadow rounded-md p-4 text-xl font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between gap-4">
      <img src="~/assets/img/google.svg" class="size-8" />
      Mit Google anmelden
    </a>
    <NuxtLink to="/" class="mt-6 text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1 leading-0">
      <UIcon name="i-heroicons-arrow-left" class="size-4 mr-1" />
      <span class="leading-0">
        Zurück zur Startseite
      </span>
    </NuxtLink>
  </div>
</template>