<script setup lang="ts">
import type { OutputItem as InvoicesOutListItem } from '~/server/api/invoicesOut/list.get';

defineProps<{
  invoice: InvoicesOutListItem
}>()

const emit = defineEmits<{ close: [boolean] }>()
</script>

<template>
  <UModal
    :close="{ onClick: () => emit('close', false) }"
    :title="`Rechnung #${invoice.id} an den Kunden senden`"
  >
    <template #description>
      Möchten Sie diese Rechnung wirklich an den Kunden senden? Danach kann nur noch der Status bearbeitet werden.
      <br />
      <br />
      <strong>Rechnung an:</strong><br />
      {{ invoice.customerName }}<br />
      {{  invoice.customerEmail }}
    </template>

    <template #footer>
      <div class="w-full flex justify-between gap-2">
        <UButton color="neutral" label="Abbrechen" @click="emit('close', false)" />
        <UButton color="primary" variant="soft" label="Senden" icon="i-heroicons-check" @click="emit('close', true)" />
      </div>
    </template>
  </UModal>
</template>
