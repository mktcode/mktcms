<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Website } from '~/types';
import { LazyLayoutDeleteModal } from '#components'
import type { MessageAggregated } from '~/server/api/contactForm/messages';

const { data: messages, status, refresh } = await useFetch<MessageAggregated[]>('/api/contactForm/messages');
const toast = useToast();
const overlay = useOverlay();
const deleteModal = overlay.create(LazyLayoutDeleteModal)

const columns: TableColumn<MessageAggregated>[] = [
  {
    accessorKey: 'websiteTitle',
    header: 'Website',
  },
  {
    accessorKey: 'contactFormSubject',
    header: 'Betreff'
  },
  {
    accessorKey: 'firstname',
    header: 'Vorname'
  },
  {
    accessorKey: 'lastname',
    header: 'Nachname'
  },
  {
    accessorKey: 'phone',
    header: 'Telefon'
  },
  {
    accessorKey: 'email',
    header: 'E-Mail'
  },
  {
    accessorKey: 'message',
    header: 'Nachricht',
    meta: {
      class: {
        td: 'truncate max-w-[300px]'
      }
    }
  },
  {
    accessorKey: 'date',
    header: 'Datum',
    cell: ({ row }) => {
      return new Date(row.getValue('date')).toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  {
    id: 'actions',
  }
]

function getDropdownActions(item: Website): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Antworten',
        icon: 'i-heroicons-arrow-uturn-right',
        to: `#`,
      }
    ],
    [
      {
        label: 'Löschen',
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: async () => {
          deleteModal.patch({ title: item.contactFormSubject })
          const shouldDelete = await deleteModal.open()
          if (!shouldDelete) return

          $fetch(`/api/contactForm/deleteMessage`, {
            method: 'POST',
            body: { id: item.id }
          }).then(() => {
            refresh();
            toast.add({
              title: 'Nachricht gelöscht',
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
    <LayoutList
      :data="messages || []"
      :columns="columns"
      :getDropdownActions="getDropdownActions"
      :loading="status === 'pending'"
    />
  </NuxtLayout>
</template>