<script setup lang="ts">
// address
</script>

<template>
  <div class="flex flex-col gap-4 mb-8">
    <UFormField label="Firmenname" name="companyName" required>
      <UInput class="w-full" size="xl" />
    </UFormField>

    <UFormField label="Straße" name="street" required>
      <UInput class="w-full" size="xl" />
    </UFormField>

    <div class="flex w-full gap-4">
      <div>
        <UFormField label="PLZ" name="zip" required>
          <UInput class="w-full" size="xl" />
        </UFormField>
      </div>
      <div class="flex-grow">
        <UFormField label="Ort" name="city" required>
          <UInput class="w-full" size="xl" />
        </UFormField>
      </div>
    </div>
  </div>
</template>