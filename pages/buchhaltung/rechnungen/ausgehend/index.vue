<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import { LazyLayoutDeleteModal, LazyInvoicesOutSendToCustomerModal } from '#components'
import type { OutputItem as InvoicesOutListItem } from '~/server/api/invoicesOut/list.get';

const { data, status, refresh } = await useFetch('/api/invoicesOut/list');
const toast = useToast();
const overlay = useOverlay();
const deleteModal = overlay.create(LazyLayoutDeleteModal)
const sendToCustomerModal = overlay.create(LazyInvoicesOutSendToCustomerModal)

const columns: TableColumn<InvoicesOutListItem>[] = [
  {
    accessorKey: 'number',
    header: 'Rnr.',
  },
  {
    accessorKey: 'customerName',
    header: 'Kunde'
  },
  {
    accessorKey: 'date',
    header: 'Datum',
    cell: ({ row }) => {
      return formatDate(row.getValue('date'))
    }
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
      const status = row.getValue('status') as keyof typeof invoiceStatus
      return invoiceStatus[status]
    }
  },
  {
    id: 'actions',
  }
]

function getDropdownActions(invoiceListItem: InvoicesOutListItem): DropdownMenuItem[][] {
  const items: DropdownMenuItem[][] = [
    [
      {
        label: 'Als PDF herunterladen',
        icon: 'i-lucide-download',
        to: `/api/invoicesOut/print/${invoiceListItem.id}`,
        target: '_blank'
      },
      {
        label: 'An Kunde senden',
        icon: 'i-heroicons-envelope',
        onSelect: async () => {
          sendToCustomerModal.patch({ invoice: invoiceListItem })
          const shouldSend = await sendToCustomerModal.open()
          if (!shouldSend) return

          $fetch(`/api/invoicesOut/sendToCustomer`, {
            method: 'POST',
            body: { id: invoiceListItem.id }
          }).then(() => {
            refresh();
            toast.add({
              title: 'Rechnung gesendet',
              color: 'success',
              icon: 'i-lucide-circle-check'
            })
          }).catch((e) => {
            console.log(e)
            toast.add({
              title: 'Fehler beim Senden: ' + e.statusMessage,
              color: 'error',
              icon: 'i-lucide-circle-x'
            })
          })
        }
      }
    ],
  ]

  if (invoiceListItem.status === 0) {
    items.push([
      {
        label: 'Bearbeiten',
        icon: 'i-lucide-edit',
        href: `/buchhaltung/rechnungen/ausgehend/${invoiceListItem.id}`
      },
      {
        label: 'Löschen',
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: async () => {
          deleteModal.patch({ title: `Rechnung ${invoiceListItem.id}` })
          const shouldDelete = await deleteModal.open()
          if (!shouldDelete) return

          $fetch(`/api/invoicesOut/delete`, {
            method: 'POST',
            body: { id: invoiceListItem.id }
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
    ])
  }

  return items
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