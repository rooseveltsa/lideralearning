import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null

export const isEmailEnabled = !!apiKey

export const EMAIL_FROM =
  process.env.EMAIL_FROM || 'LIDERA Treinamentos <noreply@lideralearning.vercel.app>'

export const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || 'claudemir.lidera@gmail.com'
