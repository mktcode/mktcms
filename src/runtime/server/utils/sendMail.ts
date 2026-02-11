import nodemailer from 'nodemailer'
import ejs from 'ejs'
import { useRuntimeConfig } from 'nitropack/runtime'

export async function sendMail({
  to,
  from,
  subject,
  fields,
  replyTo,
  templateHtml,
  templateText,
}: {
  to?: string
  from?: string
  subject: string
  fields: Record<string, any>
  replyTo?: string
  templateHtml?: string
  templateText?: string
}) {
  const { mktcms: { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, mailerFrom, mailerTo } } = useRuntimeConfig()

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  })

  const finalHtml = templateHtml ? ejs.render(templateHtml, { fields }) : Object.entries(fields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')
  const finalText = templateText ? ejs.render(templateText, { fields }) : Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n')

  const mailOptions = {
    from: from || mailerFrom,
    to: to || mailerTo,
    replyTo: replyTo || undefined,
    subject: subject,
    html: finalHtml,
    text: finalText,
  }

  return await transporter.sendMail(mailOptions)
}
