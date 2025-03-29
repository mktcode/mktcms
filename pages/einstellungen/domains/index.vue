<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Domain } from '~/types';

const { data: domains, status, refresh } = await useFetch('/api/domains/list');

const columns: TableColumn<Domain>[] = [
  {
    accessorKey: 'domain',
    header: 'Domain'
  },
  {
    accessorKey: 'authcode',
    header: 'Authcode'
  },
  {
    id: 'actions',
  }
]

function getDropdownActions(item: Domain): DropdownMenuItem[][] {
  return [
    [
    {
        label: 'Website öffnen',
        icon: 'i-lucide-external-link',
        to: `https://${item.domain}`,
        target: '_blank'
      }
    ],
    [
      {
        label: 'Umziehen',
        icon: 'i-heroicons-arrow-right-start-on-rectangle',
        disabled: true,
      },
      {
        label: 'Kündigen',
        icon: 'i-heroicons-trash',
        disabled: true,
      },
    ]
  ]
}
</script>

<template>
  <NuxtLayout name="default">
    <template #navbar2>
      <LayoutNavbarSettings>
        <UButton class="ml-auto" icon="i-lucide-plus" to="/einstellungen/domains/neu">
          Neue Domain
        </UButton>
      </LayoutNavbarSettings>
    </template>
    <LayoutList
      :data="domains || []"
      :columns="columns"
      :getDropdownActions="getDropdownActions"
      :loading="status === 'pending'"
    />
  </NuxtLayout>
</template>