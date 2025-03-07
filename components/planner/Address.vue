<script setup lang="ts">
// address
</script>

<template>
  <div class="flex flex-col gap-4 mb-8">
    <div>
      <label for="companyName" class="block text-sm font-medium text-gray-700">
        Firmenname
      </label>
      <input type="text" id="companyName" class="input" />
    </div>

    <div>
      <label for="street" class="block text-sm font-medium text-gray-700">
        Straße
      </label>
      <input type="text" id="street" class="input" />
    </div>

    <div class="flex w-full gap-4">
      <div class="w-1/4">
        <label for="zip" class="block text-sm font-medium text-gray-700">
          PLZ
        </label>
        <input type="text" id="zip" class="input" />
      </div>
      <div class="flex-grow">
        <label for="city" class="block text-sm font-medium text-gray-700">
          Ort
        </label>
        <input type="text" id="city" class="input" />
      </div>
    </div>
  </div>
</template>