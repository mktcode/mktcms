<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarHelp />
    </template>
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-4">
        Hilfe
      </h1>
  
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-bold">
            Telefon
          </h2>
          <p>
            <span class="font-bold">Mo - Fr: 9-17 Uhr</span><br />
            0176 70 86 46 27
          </p>
        </div>
  
        <div class="flex flex-col gap-2">
          <h2 class="text-xl font-bold">
            E-Mail
          </h2>
          <p>
            <a href="mailto:kontakt@markus-kottlaender.de">
              kontakt@markus-kottlaender.de
            </a>
          </p>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>