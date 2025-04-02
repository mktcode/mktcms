import { H3Event } from 'h3';
import puppeteer from 'puppeteer';
import ZUGFeRDGenerator from 'zugferd-generator'
import { getDateBasedInvoiceNumber as base } from '../../utils/invoiceNumber';
import { InvoiceOut } from '~/types';
import { createTransport } from 'nodemailer';
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export function getDateBasedInvoiceNumber() {
  return base();
}

export function getInvoiceFileKey(userId: number, invoiceNumber: string) {
  return `${userId}/invoiceOut/${invoiceNumber}.pdf`;
}

export async function generateInvoicePdf(event: H3Event, invoiceId: number) {
  const { public: { appUrl } } = useRuntimeConfig();

  if (await denies(event, manageInvoiceOut, invoiceId)) {
    throw createError({
      status: 403,
      statusMessage: 'You are not authorized to download this invoice.'
    })
  }

  const sessionCookie = getCookie(event, 'nuxt-session');
  if (!sessionCookie) {
    throw createError({
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
  await page.goto(`${appUrl}/buchhaltung/rechnungen/ausgehend/print-${invoiceId}`, { waitUntil: "networkidle0" });

  const pdf = await page.pdf();

  await browser.close();

  const zugferd = new ZUGFeRDGenerator({
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
  });

  const pdfBuffer = Buffer.from(pdf);

  const pdfWithEmbeddedEInvoice = await zugferd.embedInPDF(pdfBuffer);

  return new Blob([pdfWithEmbeddedEInvoice], { type: 'application/pdf' })
}

export async function sendInvoiceToCustomer(event: H3Event, invoice: InvoiceOut) {
  const db = await getDatabaseConnection();
  const { user } = await requireUserSession(event);

  if (await denies(event, manageInvoiceOut, invoice.id)) {
    throw createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, diese Rechnung zu senden.'
    })
  }

  const smtp = await db
    .selectFrom('smtp')
    .selectAll()
    .where('userId', '=', user.id)
    .executeTakeFirst()
  
  if (!smtp) {
    throw createError({
      status: 404,
      statusMessage: 'SMTP-Einstellungen nicht gefunden.'
    })
  }

  const customer = await db
    .selectFrom('customers')
    .selectAll()
    .where('id', '=', invoice.customerId)
    .executeTakeFirst()
  
  if (!customer) {
    throw createError({
      status: 404,
      statusMessage: 'Kunde nicht gefunden.'
    })
  }

  if (!customer.email) {
    throw createError({
      status: 400,
      statusMessage: 'Für diesen Kunden ist keine E-Mail-Adresse hinterlegt.'
    })
  }

  const s3 = createS3Client();

  const command = new GetObjectCommand({
    Bucket: 'mktcms',
    Key: getInvoiceFileKey(user.id, invoice.number),
  });

  const response = await s3.send(command);

  if (!response.Body) {
    throw createError({
      status: 404,
      statusMessage: 'Rechnung nicht im Bucket gefunden.',
    });
  }
  
  const pdf = await response.Body.transformToByteArray();

  const transporter = createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.username,
      pass: smtp.password,
    },
  });

  return await transporter.sendMail({
    from: smtp.from,
    to: customer.email,
    subject: `Rechnung ${invoice.number}`,
    text: `Hier ist Ihre Rechnung ${invoice.number}.`,
    attachments: [
      {
        filename: `Rechnung-${invoice.number}.pdf`,
        contentType: 'application/pdf',
        content: Buffer.from(pdf),
      },
    ],
  });
}

export async function finalizeInvoice(event: H3Event, invoice: InvoiceOut) {
  const s3 = createS3Client();
  const { user } = await requireUserSession(event);

  const fileExists = await s3FileExists('mktcms', getInvoiceFileKey(user.id, invoice.number));

  if (!fileExists) {
    const pdfBlob = await generateInvoicePdf(event, invoice.id);
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer());

    const command = new PutObjectCommand({
      Bucket: 'mktcms',
      Key: getInvoiceFileKey(user.id, invoice.number),
      Body: pdfBuffer,
      ContentType: 'application/pdf',
      Metadata: {
        'filename': `Rechnung-${invoice.number}.pdf`,
      },
    });
    await s3.send(command);
  }
}