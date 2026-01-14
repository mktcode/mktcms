import nodemailer from 'nodemailer'
import { useRuntimeConfig } from 'nitropack/runtime'

export async function sendMail({ subject, fields, replyTo }: { subject: string, fields: Record<string, any>, replyTo?: string }) {
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

  const mailOptions = {
    from: mailerFrom,
    to: mailerTo,
    replyTo: replyTo || undefined,
    subject: subject,
    html: Object.entries(fields).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join(''),
    text: Object.entries(fields).map(([key, value]) => `${key}: ${value}`).join('\n'),
  }

  return await transporter.sendMail(mailOptions)
}
