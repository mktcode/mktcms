<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { InvoiceOut } from '~/types';
import { LazyLayoutDeleteModal } from '#components'

const { data, status, refresh } = useFetch('/api/invoicesOut/list');
const toast = useToast();
const overlay = useOverlay();
const deleteModal = overlay.create(LazyLayoutDeleteModal)

const columns: TableColumn<InvoiceOut>[] = [
  {
    accessorKey: 'id',
    header: 'Rnr.',
    cell: ({ row }) => `${row.getValue('id')}`
  },
  {
    accessorKey: 'customerName',
    header: 'Kunde'
  },
  {
    accessorKey: 'date',
    header: 'Datum'
  },
  {
    accessorKey: 'total',
    header: 'Betrag',
    cell: ({ row }) => {
      return formatPrice(row.getValue('total'))
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status')
      return status === 0 ? 'Offen' : 'Bezahlt'
    }
  },
  {
    id: 'actions',
  }
]

function getDropdownActions(content: InvoiceOut): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Als PDF herunterladen',
        icon: 'i-lucide-download',
        to: `/api/invoicesOut/print/${content.id}`,
        target: '_blank'
      }
    ],
    [
      {
        label: 'Bearbeiten',
        icon: 'i-lucide-edit',
        href: `/buchhaltung/rechnungen/ausgehend/${content.id}`
      },
      {
        label: 'Löschen',
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: async () => {
          deleteModal.patch({ title: `Rechnung ${content.id}` })
          const shouldDelete = await deleteModal.open()
          if (!shouldDelete) return

          $fetch(`/api/invoicesOut/delete`, {
            method: 'POST',
            body: { id: content.id }
          }).then(() => {
            refresh();
            toast.add({
              title: 'Rechnung gelöscht',
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
        <UButton class="ml-auto" icon="i-lucide-plus" to="/buchhaltung/rechnungen/ausgehend/neu">
          Neue Rechnung
        </UButton>
      </LayoutNavbarAccounting>
    </template>
    <LayoutList
      :data="data || []"
      :columns="columns"
      :getDropdownActions="getDropdownActions"
      :loading="status === 'pending'"
    />
  </NuxtLayout>
</template>