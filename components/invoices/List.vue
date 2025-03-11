<script setup lang="ts">
import { resolveComponent } from 'vue';
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Invoice, Project } from '~/types';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const props = defineProps<{
  project: Project;
}>();

const invoices = ref<Invoice[]>([]);
const toast = useToast();

const fetchPosts = async () => {
  const data = await $fetch('/api/invoices/list', {
    query: {
      projectId: props.project.id,
    }
  });
  invoices.value = data;
};

onMounted(fetchPosts);

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const columns: TableColumn<Invoice>[] = [
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

function getDropdownActions(content: Invoice): DropdownMenuItem[][] {
  return [
    [
      {
        label: 'Als PDF herunterladen',
        icon: 'i-lucide-copy',
        onSelect: () => generatePDF(content),
      }
    ],
    [
      {
        label: 'Bearbeiten',
        icon: 'i-lucide-edit',
        href: `/rechnungen/${content.id}`
      },
      {
        label: 'Löschen',
        icon: 'i-lucide-trash',
        color: 'error',
        onSelect: () => {
          invoices.value = invoices.value.filter((c) => c.id !== content.id)
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

const generatePDF = async (invoice: Invoice) => {
  const pdfDoc = await PDFDocument.create()
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  const page = pdfDoc.addPage()
  const { height } = page.getSize()
  const fontSize = 30
  page.drawText('Rechnung', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: helveticaFont,
  })
  page.drawText(`Rechnungsnummer: ${invoice.id}`, {
    x: 50,
    y: height - 5 * fontSize,
    size: fontSize / 2,
    font: helveticaFont,
  })

  const pdfBytes = await pdfDoc.save()

  const blob = new Blob([pdfBytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  window.open(url)
}
</script>

<template>
  <div>
    <div class="flex">
      <UButton color="success" class="ml-auto" icon="i-lucide-plus" to="/rechnungen/neu">
        Neue Rechnung
      </UButton>
    </div>
    <UTable
      :data="invoices"
      :columns="columns"
      class="flex-1"
    >
      <template #actions-cell="{ row }">
        <div class="text-right">
          <UDropdownMenu :items="getDropdownActions(row.original)">
            <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
          </UDropdownMenu>
        </div>
      </template>
    </UTable>
  </div>
</template>