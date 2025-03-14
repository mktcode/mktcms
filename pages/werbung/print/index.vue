<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Vcard } from '~/types';
import { LazyLayoutDeleteModal } from '#components'

const { data: vcards, status, refresh } = await useFetch('/api/vcards/list');
const toast = useToast();
const overlay = useOverlay();
const deleteModal = overlay.create(LazyLayoutDeleteModal)

const columns: TableColumn<Vcard>[] = [
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
        label: 'Vorschau',
        icon: 'i-lucide-copy',
        onSelect: () => {
          navigator.clipboard.writeText(item.id.toString())
          toast.add({
            title: 'Kundennummer kopiert',
            color: 'success',
            icon: 'i-lucide-circle-check'
          })
        },
      },
      {
        label: 'Druckdatei herunterladen',
        icon: 'i-lucide-download',
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