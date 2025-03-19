import { z } from "zod";
import { PDFDocument, StandardFonts } from 'pdf-lib'
import ZUGFeRDGenerator from 'zugferd-generator'
import { InvoiceIn } from "~/types";

const invoiceData = {
  id: 'INV-001',
  issueDate: '2025-04-04',
  currency: 'EUR',
  supplier: { name: 'Supplier Ltd.', country: 'DE' },
  customer: { name: 'Customer Ltd.', country: 'DE' },
  totalAmount: 119,
  taxTotal: { taxAmount: 19, taxPercentage: 19 },
  lineItems: [
      {
          id: 'ITEM-001',
          description: 'Product A',
          quantity: 1,
          unitPrice: 100,
          lineTotal: 100,
      },
  ],
};

const generatePDF = async (invoice: InvoiceIn) => {
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

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  })
  const pdfBuffer = Buffer.from(pdfBytes);

  const zugferd = new ZUGFeRDGenerator(invoiceData);

  const pdfWithEmbeddedEInvoice = await zugferd.embedInPDF(pdfBuffer);

  const blob = new Blob([pdfWithEmbeddedEInvoice], { type: 'application/pdf' })

  return blob
}

const bodySchema = z.object({
  id: z.number()
})

export default defineEventHandler(async (event) => {
  const db = await getDatabaseConnection()
  const { id } = await readValidatedBody(event, bodySchema.parse);

  if (await denies(event, manageInvoiceIn, id)) {
    return createError({
      status: 403,
      statusMessage: 'You are not authorized to download this invoice.'
    })
  }

  const invoice = await db.selectFrom('invoicesIn')
    .selectAll()
    .where('id', '=', id)
    .limit(1)
    .executeTakeFirst()
  
  if (!invoice) {
    throw createError({
      status: 404,
      statusMessage: 'Invoice not found'
    })
  }

  const pdf = await generatePDF(invoice)

  setResponseHeader(event, 'Content-Type', 'application/pdf')
  
  return pdf
})
