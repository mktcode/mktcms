<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Supplier } from '~/types';

const { data: suppliers, status } = useFetch('/api/suppliers/list');
const toast = useToast();

const columns: TableColumn<Supplier>[] = [
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

function getDropdownActions(item: Supplier): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Lieferantennummer kopieren',
        icon: 'i-lucide-copy',
        onSelect: () => {
          navigator.clipboard.writeText(item.id.toString())
          toast.add({
            title: 'Lieferantennummer kopiert',
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
        href: `/buchhaltung/lieferanten/${item.id}`
      },
      {
        label: 'Löschen',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => {
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
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarAccounting>
        <UButton class="ml-auto" icon="i-lucide-plus" to="/buchhaltung/lieferanten/neu">
          Neuer Lieferant
        </UButton>
      </LayoutNavbarAccounting>
    </template>
    <LayoutList
      :data="suppliers || []"
      :columns="columns"
      :getDropdownActions="getDropdownActions"
      :loading="status === 'pending'"
    >
      <template #address-cell="{ row }">
        <div>
          <div>{{ row.original.address }}</div>
          <div>{{ row.original.zip }} {{ row.original.city }}</div>
        </div>
      </template>
    </LayoutList>
  </NuxtLayout>
</template>