import puppeteer from 'puppeteer';
import { z } from 'zod';
import ZUGFeRDGenerator from 'zugferd-generator'

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

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
  const { public: { appUrl } } = useRuntimeConfig();

  if (await denies(event, manageInvoiceOut, Number(id))) {
    return createError({
      status: 403,
      statusMessage: 'You are not authorized to download this invoice.'
    })
  }
  
  const sessionCookie = getCookie(event, 'nuxt-session');
  if (!sessionCookie) {
    return createError({
      status: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Yes, we trust the pages we open.
  // See: https://pptr.dev/troubleshooting#setting-up-chrome-linux-sandbox
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  browser.setCookie({
    name: 'nuxt-session',
    value: sessionCookie || '',
    domain: appUrl.replace(/^https?:\/\//, '')
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1700, height: 1100 });
  await page.goto(`${appUrl}/buchhaltung/rechnungen/ausgehend/print-${id}`, { waitUntil: "networkidle0" });

  const pdf = await page.pdf();

  await browser.close();

  const zugferd = new ZUGFeRDGenerator(invoiceData);

  const pdfBuffer = Buffer.from(pdf);

  const pdfWithEmbeddedEInvoice = await zugferd.embedInPDF(pdfBuffer);

  const blob = new Blob([pdfWithEmbeddedEInvoice], { type: 'application/pdf' })
  
  setResponseHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=invoice.pdf",
  });

  return blob;
});
