import { resend, isEmailEnabled, EMAIL_FROM, EMAIL_REPLY_TO } from './resend'
import { WelcomeEmailTemplate } from './templates/welcome'
import { AssessmentCompleteEmailTemplate } from './templates/assessment-complete'
import { CertificateReadyEmailTemplate } from './templates/certificate-ready'
import { PDIEmailTemplate } from './templates/pdi-report'
import { WorkshopFollowupEmailTemplate } from './templates/workshop-followup'
import { ReengagementEmailTemplate } from './templates/reengagement'
import { UpsellFullProgramEmailTemplate } from './templates/upsell-full-program'
import { DiagnosticoEmpresaRecebidoTemplate } from './templates/diagnostico-empresa-recebido'
import { DiagnosticoPessoalRecebidoTemplate } from './templates/diagnostico-pessoal-recebido'
import { LeadPdiAlertTemplate } from './templates/lead-pdi-alert'
import { generatePartialPDI } from '@/lib/utils/pdi-generator'

type TemplateType =
  | 'welcome'
  | 'assessment-complete'
  | 'certificate-ready'
  | 'pdi-report'
  | 'workshop-followup'
  | 'reengagement'
  | 'upsell-full-program'
  | 'diagnostico-empresa-recebido'
  | 'diagnostico-pessoal-recebido'
  | 'lead-pdi-alert'

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
    case 'assessment-complete': {
      const firstName = ((data.name as string) || 'Participante').split(' ')[0]
      return {
        subject: `${firstName}, seu diagnóstico de liderança chegou — veja seu perfil e próximos passos`,
        react: AssessmentCompleteEmailTemplate({
          name: (data.name as string) || 'Participante',
          perfil: (data.perfil as string) || 'transicao',
          score: (data.score as number) || 0,
          dimensoes: data.dimensoes as
            | Parameters<typeof AssessmentCompleteEmailTemplate>[0]['dimensoes']
            | undefined,
          topGaps: data.topGaps as
            | Parameters<typeof AssessmentCompleteEmailTemplate>[0]['topGaps']
            | undefined,
        }),
      }
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
    case 'diagnostico-empresa-recebido': {
      const gestorNome = (data.gestorNome as string) || 'Gestor'
      const firstName = gestorNome.trim().split(' ')[0]
      return {
        subject: `${firstName}, o PDI executivo do supervisor está pronto`,
        react: DiagnosticoEmpresaRecebidoTemplate({
          gestorNome,
          empresa: (data.empresa as string) || 'sua empresa',
          supervisorNome: (data.supervisorNome as string) || 'o supervisor avaliado',
          fitScore: (data.fitScore as number) || 0,
          discScores:
            (data.discScores as Record<string, number>) || { D: 0, I: 0, S: 0, C: 0 },
          diagnosticoId: (data.diagnosticoId as string | null | undefined) ?? null,
        }),
      }
    }
    case 'diagnostico-pessoal-recebido': {
      const nomeCompleto = (data.nomeCompleto as string) || 'Líder'
      const firstName = nomeCompleto.trim().split(' ')[0]
      return {
        subject: `${firstName}, seu PDI personalizado de 90 dias está pronto`,
        react: DiagnosticoPessoalRecebidoTemplate({
          nomeCompleto,
          empresa: (data.empresa as string) || undefined,
          selfScore: (data.selfScore as number) || 0,
          radarAverage: (data.radarAverage as number) || 0,
          discScores:
            (data.discScores as Record<string, number>) || { D: 0, I: 0, S: 0, C: 0 },
          diagnosticoId: (data.diagnosticoId as string | null | undefined) ?? null,
        }),
      }
    }
    case 'lead-pdi-alert': {
      const participantName = (data.participantName as string) || 'Participante'
      return {
        subject: `🔔 Novo gatilho de venda: ${participantName} fez o PDI`,
        react: LeadPdiAlertTemplate({
          participantName,
          participantEmail: (data.participantEmail as string) || '',
          perfil: (data.perfil as string) || 'transicao',
          score: (data.score as number) || 0,
          dorAtual: (data.dorAtual as string | null | undefined) ?? null,
          custoFuturo: (data.custoFuturo as string | null | undefined) ?? null,
          adminPdiUrl: (data.adminPdiUrl as string) || SITE_URL,
          whatsappUrl: (data.whatsappUrl as string | null | undefined) ?? null,
        }),
      }
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
      replyTo: EMAIL_REPLY_TO,
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
