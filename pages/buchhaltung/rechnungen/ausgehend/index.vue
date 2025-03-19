<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { InvoiceOut } from '~/types';

const { data, status } = useFetch('/api/invoicesOut/list');
const toast = useToast();

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
    id: 'actions',
  }
]

async function downloadEInvoicePDF(content: InvoiceOut) {
  const response = await $fetch<Blob>('/api/invoicesOut/einvoice', {
    method: 'POST',
    body: { id: content.id },
    responseType: 'blob'
  });

  const blob = new Blob([response], { type: 'application/pdf' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rechnung_${content.id}.pdf`;
  a.click();
}

function getDropdownActions(content: InvoiceOut): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Als PDF herunterladen',
        icon: 'i-lucide-copy',
        onSelect: () => downloadEInvoicePDF(content),
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
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => {
          toast.add({
            title: 'Rechnung gelöscht',
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