<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Customer } from '~/types';

const customers = ref<Customer[]>([]);
const toast = useToast();

const fetchPosts = async () => {
  const data = await $fetch('/api/customers/list');
  customers.value = data;
};

onMounted(fetchPosts);

const columns: TableColumn<Customer>[] = [
  {
    accessorKey: 'id',
    header: 'Kdnr.',
    cell: ({ row }) => `${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: 'Name'
  },
  {
    accessorKey: 'address',
    header: 'Adresse'
  },
  {
    accessorKey: 'phone',
    header: 'Telefon'
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    id: 'actions',
  }
]

function getDropdownActions(content: Customer): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Kundennummer kopieren',
        icon: 'i-lucide-copy',
        onSelect: () => {
          navigator.clipboard.writeText(content.id.toString())
          toast.add({
            title: 'Kundennummer kopiert',
            color: 'success',
            icon: 'i-lucide-circle-check'
          })
        },
      }
    ],
    [
      {
        label: 'Bearbeiten',
        icon: 'i-lucide-edit',
        href: `/kunden/${content.id}`
      },
      {
        label: 'Löschen',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => {
          customers.value = customers.value.filter((c) => c.id !== content.id)
          toast.add({
            title: 'Kunde gelöscht',
            color: 'success',
            icon: 'i-lucide-circle-check'
          })
        }
      }
    ]
  ]
}
</script>

<template>
  <UTable
    :data="customers"
    :columns="columns"
    class="flex-1"
  >
    <template #address-cell="{ row }">
      <div>
        <div>{{ row.original.address }}</div>
        <div>{{ row.original.zip }} {{ row.original.city }}</div>
      </div>
    </template>
    <template #actions-cell="{ row }">
      <div class="text-right">
        <UDropdownMenu :items="getDropdownActions(row.original)">
          <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
        </UDropdownMenu>
      </div>
    </template>
  </UTable>
</template>