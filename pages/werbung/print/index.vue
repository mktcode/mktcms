<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Vcard } from '~/types';
import { LazyLayoutDeleteModal } from '#components'

const { data: vcards, status, refresh } = await useFetch('/api/vcards/list');
const toast = useToast();
const overlay = useOverlay();
const deleteModal = overlay.create(LazyLayoutDeleteModal)

const PrintVcard = resolveComponent('PrintVcard')

const columns: TableColumn<Vcard>[] = [
  {
    accessorKey: 'vcard',
    enableResizing: false,
    meta: {
      class: {
        th: 'w-72',
        td: 'p-0'
      }
    },
    size: 340,
    minSize: 340,
    maxSize: 340,
    header: 'Vorschau',
    cell: ({ row }) => {
      return h(PrintVcard, {
        logoWidth: 120,
        title: row.original.title,
        subtitle: row.original.subtitle,
        slogan: row.original.slogan,
        street: row.original.street,
        zip: row.original.zip,
        city: row.original.city,
        phone: row.original.phone,
        email: row.original.email,
        website: row.original.website
      })
    }
  },
  {
    accessorKey: 'title',
    header: 'Titel'
  },
  {
    accessorKey: 'street',
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

function getDropdownActions(item: Vcard): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Druckdatei herunterladen',
        icon: 'i-lucide-download',
        to: `/api/vcards/print/${item.id}`,
        target: '_blank'
      }
    ],
    [
      {
        label: 'Bearbeiten',
        icon: 'i-lucide-edit',
        href: `/werbung/print/${item.id}`
      },
      {
        label: 'Löschen',
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: async () => {
          deleteModal.patch({ title: item.title })
          const shouldDelete = await deleteModal.open()
          if (!shouldDelete) return

          $fetch(`/api/vcards/delete`, {
            method: 'POST',
            body: { id: item.id }
          }).then(() => {
            refresh();
            toast.add({
              title: 'Visitenkarte gelöscht',
              color: 'success',
              icon: 'i-lucide-circle-check'
            })
          }).catch((e) => {
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
      <LayoutNavbarAds>
        <UButton class="ml-auto" icon="i-lucide-plus" to="/werbung/print/neu">
          Neue Visitenkarte
        </UButton>
      </LayoutNavbarAds>
    </template>
    <LayoutList
      :data="vcards || []"
      :columns="columns"
      :getDropdownActions="getDropdownActions"
      :loading="status === 'pending'"
    />
  </NuxtLayout>
</template>