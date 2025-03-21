<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { InvoiceItem } from '~/types';
import { LazyLayoutDeleteModal } from '#components'

const { data: invoiceItems, status, refresh } = await useFetch('/api/invoiceItems/list');
const toast = useToast();
const overlay = useOverlay();
const deleteModal = overlay.create(LazyLayoutDeleteModal)

const columns: TableColumn<InvoiceItem>[] = [
  {
    accessorKey: 'title',
    header: 'Titel'
  },
  {
    accessorKey: 'description',
    header: 'Beschreibung'
  },
  {
    accessorKey: 'price',
    header: 'Standardpreis'
  },
  {
    accessorKey: 'unit',
    header: 'Einheit'
  },
  {
    id: 'actions',
  }
]

function getDropdownActions(item: InvoiceItem): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Bearbeiten',
        icon: 'i-lucide-edit',
        href: `/buchhaltung/rechnungen/posten/${item.id}`
      },
      {
        label: 'Löschen',
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: async () => {
          deleteModal.patch({ title: item.title })
          const shouldDelete = await deleteModal.open()
          if (!shouldDelete) return

          $fetch(`/api/invoiceItems/delete`, {
            method: 'POST',
            body: { id: item.id }
          }).then(() => {
            refresh();
            toast.add({
              title: 'Posten gelöscht',
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
        <UButton class="ml-auto" icon="i-lucide-plus" to="/buchhaltung/rechnungen/posten/neu">
          Neuer Posten
        </UButton>
      </LayoutNavbarAccounting>
    </template>
    <LayoutList
      :data="invoiceItems || []"
      :columns="columns"
      :getDropdownActions="getDropdownActions"
      :loading="status === 'pending'"
    />
  </NuxtLayout>
</template>