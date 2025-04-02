import { z } from 'zod';

const paramsSchema = z.object({
  id: z.string()
})

export default defineEventHandler(async (event) => {
  const { id: idString } = await getValidatedRouterParams(event, paramsSchema.parse);
  const id = Number(idString);

  const db = await getDatabaseConnection();

  if (await denies(event, manageInvoiceOut, id)) {
    throw createError({
      status: 403,
      statusMessage: 'Du bist nicht berechtigt, diese Rechnung herunterzuladen.'
    })
  }

  const invoice = await db
    .selectFrom('invoicesOut')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();
  
  if (!invoice) {
    throw createError({
      status: 404,
      statusMessage: 'Rechnung nicht gefunden.'
    })
  }

  // TODO: return from bucket if status !== 0
  const pdfBlob = await generateInvoicePdf(event, id)
  
  setResponseHeaders(event, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="rechnung-${invoice.number}.pdf"`,
  });

  return pdfBlob;
});
