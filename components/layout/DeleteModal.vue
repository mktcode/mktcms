<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="`Löschen von ${title}`"
    description="Möchten Sie diesen Datensatz wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
  >
    <template #footer>
      <div class="w-full flex justify-between gap-2">
        <UButton color="neutral" label="Abbrechen" @click="emit('close', false)" />
        <UButton color="error" variant="link" label="Wirklich löschen" icon="i-heroicons-trash" @click="emit('close', true)" />
      </div>
    </template>
  </UModal>
</template>
