<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Supplier } from '~/types';
import { LazyLayoutDeleteModal } from '#components'

const { data: suppliers, status, refresh } = useFetch('/api/suppliers/list');
const toast = useToast();
const overlay = useOverlay();
const deleteModal = overlay.create(LazyLayoutDeleteModal)

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
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: async () => {
          deleteModal.patch({ title: item.name })
          const shouldDelete = await deleteModal.open()
          if (!shouldDelete) return

          $fetch(`/api/suppliers/delete`, {
            method: 'POST',
            body: { id: item.id }
          }).then(() => {
            refresh();
            toast.add({
              title: 'Lieferant gelöscht',
              color: 'success',
              icon: 'i-lucide-circle-check'
            })
          }).catch((e) => {
            console.log(e)
            toast.add({
              title: 'Fehler beim Löschen: ' + e.statusMessage,
              color: 'error',
              icon: 'i-lucide-circle-x'
            })
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