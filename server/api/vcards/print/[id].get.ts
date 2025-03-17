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

  const browser = await puppeteer.launch();
  browser.setCookie({
    name: 'nuxt-session',
    value: sessionCookie || '',
    domain: appUrl.replace(/^https?:\/\//, '')
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1700, height: 1100 });
  await page.goto(`${appUrl}/werbung/print/print-${id}`, { waitUntil: "networkidle0" });
  
  const screenshot = await page.screenshot({ type: "png" });

  await browser.close();
  
  setResponseHeaders(event, {
    "Content-Type": "image/png",
    "Content-Disposition": "attachment; filename=vcard.png",
  });

  return screenshot
});
