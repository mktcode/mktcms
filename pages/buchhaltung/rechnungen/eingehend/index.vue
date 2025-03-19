<script setup lang="ts">
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { InvoiceIn } from '~/types';

const { data, status } = useFetch('/api/invoicesIn/list');
const toast = useToast();

const columns: TableColumn<InvoiceIn>[] = [
  {
    accessorKey: 'id',
    header: 'Rnr.',
    cell: ({ row }) => `${row.getValue('id')}`
  },
  {
    accessorKey: 'supplierName',
    header: 'Lieferant'
  },
  {
    accessorKey: 'date',
    header: 'Datum'
  },
  {
    id: 'actions',
  }
]

async function downloadEInvoicePDF(content: InvoiceIn) {
  const response = await $fetch<Blob>('/api/invoicesIn/einvoice', {
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

function getDropdownActions(content: InvoiceIn): DropdownMenuItem[][] {
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
        href: `/buchhaltung/rechnungen/eingehend/${content.id}`
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
        <UButton class="ml-auto" icon="i-lucide-plus" to="/buchhaltung/rechnungen/eingehend/neu">
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