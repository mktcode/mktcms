<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';

defineProps<{
  data: any[];
  columns: TableColumn<any>[];
  getDropdownActions: (item: any) => DropdownMenuItem[][];
  loading: boolean;
}>();

const columnPinning = ref({
  left: [],
  right: ['actions']
})
</script>

<template>
  <UTable
    :data="data"
    :columns="columns"
    :loading="loading"
    class="flex-1"
    loading-color="primary"
    loading-animation="swing"
    v-model:column-pinning="columnPinning"
  >
    <slot />
    <template #actions-cell="{ row }">
      <div class="text-right">
        <UDropdownMenu :items="getDropdownActions(row.original)">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
        </UDropdownMenu>
      </div>
    </template>
  </UTable>
</template>