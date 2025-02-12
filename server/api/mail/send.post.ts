export default defineEventHandler(async (event) => {
  const {
    name,
    email,
    phone,
    message,
  }: { name: string, email: string, phone: string, message: string } = await readBody(event)

  const { smtpHost, smtpPass, smtpPort, smtpUser, smtpFrom, smtpFromName, smtpTo } = useRuntimeConfig()

  if (!name) {
    return {
      success: false,
      error: 'Name not provided.',
    }
  }

  if (!email && !phone) {
    return {
      success: false,
      error: 'No contact information provided.',
    }
  }

  const mailer = createMailer({
    smtpHost,
    smtpPort,
    smtpUser,
    smtpPass,
  })

  await mailer.sendMail({
    from: smtpFrom,
    to: smtpTo,
    subject: 'Kontaktanfrage',
    text: `Name: ${name}\nE-Mail: ${email}\nTelefon: ${phone}\n\n${message}`,
  })

  await mailer.sendMail({
    from: smtpFrom,
    to: email,
    subject: 'Ihre Kontaktanfrage',
    text: `Hallo ${name},\n\nvielen Dank für Ihre Anfrage. Ich werde mich in Kürze bei Ihnen melden.\n\nViele Grüße,\n${smtpFromName}`,
  })

  return {
    success: true,
    error: null,
  }
})
