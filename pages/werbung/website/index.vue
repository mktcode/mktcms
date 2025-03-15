<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Website } from '~/types';
import { LazyLayoutDeleteModal } from '#components'

const { data: websites, status, refresh } = await useFetch('/api/websites/list');
const toast = useToast();
const overlay = useOverlay();
const deleteModal = overlay.create(LazyLayoutDeleteModal)

const columns: TableColumn<Website>[] = [
  {
    accessorKey: 'title',
    header: 'Titel'
  },
  {
    accessorKey: 'subtitle',
    header: 'Untertitel'
  },
  {
    accessorKey: 'description',
    header: 'Beschreibung'
  },
  {
    accessorKey: 'domain',
    header: 'Domain'
  },
  {
    id: 'actions',
  }
]

function getDropdownActions(item: Website): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Website öffnen',
        icon: 'i-lucide-external-link',
        to: `/website/${item.id}`,
        target: '_blank'
      }
    ],
    [
      {
        label: 'Bearbeiten',
        icon: 'i-lucide-edit',
        href: `/werbung/website/${item.id}`
      },
      {
        label: 'Löschen',
        icon: 'i-heroicons-trash',
        color: 'error',
        onSelect: async () => {
          deleteModal.patch({ title: item.title })
          const shouldDelete = await deleteModal.open()
          if (!shouldDelete) return

          $fetch(`/api/websites/delete`, {
            method: 'POST',
            body: { id: item.id }
          }).then(() => {
            refresh();
            toast.add({
              title: 'Website gelöscht',
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
      <LayoutNavbarAds>
        <UButton class="ml-auto" icon="i-lucide-plus" to="/werbung/website/neu">
          Neue Website
        </UButton>
      </LayoutNavbarAds>
    </template>
    <LayoutList
      :data="websites || []"
      :columns="columns"
      :getDropdownActions="getDropdownActions"
      :loading="status === 'pending'"
    />
  </NuxtLayout>
</template>