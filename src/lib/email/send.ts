import { resend, isEmailEnabled, EMAIL_FROM } from './resend'
import { WelcomeEmailTemplate } from './templates/welcome'
import { AssessmentCompleteEmailTemplate } from './templates/assessment-complete'
import { CertificateReadyEmailTemplate } from './templates/certificate-ready'
import { PDIEmailTemplate } from './templates/pdi-report'
import { WorkshopFollowupEmailTemplate } from './templates/workshop-followup'
import { ReengagementEmailTemplate } from './templates/reengagement'
import { UpsellFullProgramEmailTemplate } from './templates/upsell-full-program'
import { generatePartialPDI } from '@/lib/utils/pdi-generator'

type TemplateType = 'welcome' | 'assessment-complete' | 'certificate-ready' | 'pdi-report' | 'workshop-followup' | 'reengagement' | 'upsell-full-program'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lideralearning.vercel.app'

function buildEmail(
  template: TemplateType,
  data: Record<string, unknown>,
): { subject: string; react: React.ReactElement } {
  switch (template) {
    case 'welcome':
      return {
        subject: `${data.name || 'Participante'}, bem-vindo a LIDERA Treinamentos!`,
        react: WelcomeEmailTemplate({ name: (data.name as string) || 'Participante' }),
      }
    case 'assessment-complete':
      return {
        subject: `${data.name || 'Participante'}, seu diagnostico de lideranca esta pronto!`,
        react: AssessmentCompleteEmailTemplate({
          name: (data.name as string) || 'Participante',
          perfil: (data.perfil as string) || 'transicao',
          score: (data.score as number) || 0,
        }),
      }
    case 'certificate-ready':
      return {
        subject: `Parabens ${data.name || 'Participante'}! Seu certificado LIDERA foi emitido`,
        react: CertificateReadyEmailTemplate({
          name: (data.name as string) || 'Participante',
          courseName: (data.courseName as string) || 'LIDERA Treinamentos',
          completionDate: (data.completionDate as string) || new Date().toLocaleDateString('pt-BR'),
          verificationCode: (data.verificationCode as string) || '',
        }),
      }
    case 'pdi-report': {
      const report = data.report
        ? (data.report as Parameters<typeof PDIEmailTemplate>[0]['report'])
        : generatePartialPDI(
            (data.userId as string) || '',
            (data.name as string) || 'Participante',
            null,
            (data.selfAssessment as Record<string, unknown>) ?? {},
          )
      return {
        subject: `${report.alunoName}, seu PDI de Lideranca esta pronto — LIDERA`,
        react: PDIEmailTemplate({ report, siteUrl: SITE_URL }),
      }
    }
    case 'workshop-followup':
      return {
        subject: `${data.name || 'Participante'}, sua inscrição no workshop foi recebida!`,
        react: WorkshopFollowupEmailTemplate({
          name: (data.name as string) || 'Participante',
          workshopName: (data.workshopName as string) || undefined,
        }),
      }
    case 'reengagement':
      return {
        subject: `${data.name || 'Participante'}, seu treinamento está te esperando`,
        react: ReengagementEmailTemplate({
          name: (data.name as string) || 'Participante',
          lastAccessDays: (data.lastAccessDays as number) || 7,
          courseName: (data.courseName as string) || undefined,
          progressPercent: (data.progressPercent as number) || 0,
        }),
      }
    case 'upsell-full-program':
      return {
        subject: `${data.name || 'Participante'}, desbloqueie os outros 7 módulos`,
        react: UpsellFullProgramEmailTemplate({
          name: (data.name as string) || 'Participante',
          workshopCompleted: (data.workshopCompleted as string) || undefined,
        }),
      }
    default: {
      const _exhaustive: never = template
      throw new Error(`Unknown email template: ${_exhaustive}`)
    }
  }
}

export async function sendEmail(
  to: string,
  template: TemplateType,
  data: Record<string, unknown>,
): Promise<{ success: boolean; error?: string }> {
  if (!isEmailEnabled || !resend) {
    console.log(`[sendEmail:${template}] Email not configured (RESEND_API_KEY missing). Skipping.`)
    return { success: false, error: 'Email not configured' }
  }

  try {
    const { subject, react } = buildEmail(template, data)

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      react,
    })

    if (error) {
      console.error(`[sendEmail:${template}] Resend API error:`, error)
      return { success: false, error: error.message }
    }

    console.log(`[sendEmail:${template}] Sent to ${to}`)
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown email error'
    console.error(`[sendEmail:${template}] Exception:`, message)
    return { success: false, error: message }
  }
}
