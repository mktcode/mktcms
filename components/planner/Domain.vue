<script setup lang="ts">
</script>

<template>
  <div class="flex gap-4 mb-8 items-center">
    <UFormField label="E-Mail" name="email" help="Nur der Name vor dem @.">
      <UInput class="w-full" size="xl" placeholder="kontakt" />
    </UFormField>
    <span class="text-xl">@</span>
    <UFormField label="Domain" name="domain" help="Ihre (Wunsch-) Domain ohne www." class="flex-1 max-w-sm">
      <UInput class="w-full" size="xl" placeholder="ihre-domain.de" />
    </UFormField>
  </div>
</template>