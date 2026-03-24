import { resend, isEmailEnabled, EMAIL_FROM } from './resend'
import { PDIEmailTemplate } from './templates/pdi-report'
import type { PDIReport } from '@/lib/utils/pdi-generator'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lideralearning.vercel.app'

export async function sendPDIEmail(
  to: string,
  report: PDIReport,
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailEnabled || !resend) {
    console.log('[sendPDIEmail] Email not configured (RESEND_API_KEY missing). Skipping.')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `${report.alunoName}, seu PDI de Lideranca esta pronto — LIDERA`,
      react: PDIEmailTemplate({ report, siteUrl: SITE_URL }),
    })

    if (error) {
      console.error('[sendPDIEmail] Resend API error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error'
    console.error('[sendPDIEmail] Exception:', message)
    return { success: false, error: message }
  }
}
