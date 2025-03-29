<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';

const props = defineProps<{
  storageKey: string
}>()

const showAlert = useLocalStorage(props.storageKey, true)
</script>

<template>
  <Transition name="fade">
    <UAlert
      v-if="showAlert"
      variant="solid"
      color="primary"
      title="Bestimme selbst den Preis!"
      icon="i-heroicons-information-circle"
      :ui="{ icon: 'size-11', title: 'text-xl' }"
      :close="{ class: 'text-white/75 hover:text-white' }"
      @update:open="showAlert = $event"
      class="mb-6"
    >
      <template #description>
        <slot />
      </template>
    </UAlert>
  </Transition>
</template>