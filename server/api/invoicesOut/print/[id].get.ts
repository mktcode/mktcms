import puppeteer from 'puppeteer';
import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, paramsSchema.parse);
  const { public: { appUrl } } = useRuntimeConfig();
  
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
  
  setResponseHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Disposition": "attachment; filename=invoice.pdf",
  });

  return pdf
});
