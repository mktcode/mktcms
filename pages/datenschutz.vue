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
    <div class="bg-white">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="flex flex-col justify-center py-16 lg:py-24">
          <div class="flex items-center gap-6">
            <div>
              <h2 class="text-xl font-semibold text-primary-600">
                Gemäß DSGVO und BDSG
              </h2>
              <p class="text-4xl font-bold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                Datenschutzerklärung
              </p>
            </div>
          </div>
          <p class="mt-8 text-lg/8 text-gray-600">
            In Arbeit...
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>