import nodemailer from 'nodemailer'

function createMailer(runtimeConfig: {
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPass: string
}) {
  const transporter = nodemailer.createTransport({
    host: runtimeConfig.smtpHost,
    port: runtimeConfig.smtpPort,
    secure: true,
    auth: {
      user: runtimeConfig.smtpUser,
      pass: runtimeConfig.smtpPass,
    },
  })

  return transporter
}

export { createMailer }
