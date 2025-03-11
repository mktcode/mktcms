<script setup lang="ts">
import { resolveComponent } from 'vue';
import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
import type { Invoice, Project } from '~/types';
import { PDFDocument, PDFHexString, PDFName, StandardFonts, rgb } from 'pdf-lib'

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

function _formatDate(date: Date) {
  return date.toISOString().split('.')[0] + 'Z';
}

function _addMetadataToDoc(
  pdfDoc: PDFDocument,
  date: Date,
  documentId: string,
  title: string,
  author: string,
  producer: string,
  creator: string
) {
  const metadataXML = `
  <?xpacket begin="" id="${documentId}"?>
    <x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 5.2-c001 63.139439, 2010/09/27-13:37:26">
      <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">

        <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/">
          <dc:format>application/pdf</dc:format>
          <dc:creator>
            <rdf:Seq>
              <rdf:li>${author}</rdf:li>
            </rdf:Seq>
          </dc:creator>
          <dc:title>
              <rdf:Alt>
                <rdf:li xml:lang="x-default">${title}</rdf:li>
              </rdf:Alt>
          </dc:title>
        </rdf:Description>

        <rdf:Description rdf:about="" xmlns:xmp="http://ns.adobe.com/xap/1.0/">
          <xmp:CreatorTool>${creator}</xmp:CreatorTool>
          <xmp:CreateDate>${_formatDate(date)}</xmp:CreateDate>
          <xmp:ModifyDate>${_formatDate(date)}</xmp:ModifyDate>
          <xmp:MetadataDate>${_formatDate(date)}</xmp:MetadataDate>
        </rdf:Description>

        <rdf:Description rdf:about="" xmlns:pdf="http://ns.adobe.com/pdf/1.3/">
          <pdf:Producer>${producer}</pdf:Producer>
        </rdf:Description>

        <rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">
          <pdfaid:part>1</pdfaid:part>
          <pdfaid:conformance>B</pdfaid:conformance>
        </rdf:Description>
      </rdf:RDF>
    </x:xmpmeta>
  <?xpacket end="w"?>
  `.trim();

  const metadataStream = pdfDoc.context.stream(metadataXML, {
    Type: 'Metadata',
    Subtype: 'XML',
    Length: metadataXML.length,
  });
  const metadataStreamRef = pdfDoc.context.register(metadataStream);
  pdfDoc.catalog.set(PDFName.of('Metadata'), metadataStreamRef);
}

const generatePDF = async (invoice: Invoice) => {
  const pdfDoc = await PDFDocument.create()

  const documentId = 'a164b1c9821755d27c65f0c0e7e02547'
  const id = PDFHexString.of(documentId)
  pdfDoc.context.trailerInfo.ID = pdfDoc.context.obj([id, id])

  const createDate = new Date();
  pdfDoc.setTitle('Rechnung')
  pdfDoc.setAuthor('Mein Unternehmen')
  pdfDoc.setProducer('Mein Unternehmen')
  pdfDoc.setCreator('Mein Unternehmen')
  pdfDoc.setCreationDate(createDate);
  pdfDoc.setModificationDate(createDate);
  _addMetadataToDoc(pdfDoc, createDate, documentId, 'Rechnung', 'Mein Unternehmen', 'Mein Unternehmen', 'Mein Unternehmen')

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

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  })

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