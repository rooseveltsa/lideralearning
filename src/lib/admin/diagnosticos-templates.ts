// Templates de mensagem para outreach do admin via WhatsApp e Email.
// Variáveis substituídas em tempo de render.

const SITE = 'https://lideralearning.vercel.app'

export type PessoalTemplateContext = {
  firstName: string
  diagnosticoId: string
  empresa?: string | null
}

export type EmpresaTemplateContext = {
  firstName: string
  empresa: string
  supervisorNome: string
  diagnosticoId: string
}

// ───── WHATSAPP ─────

export function whatsappTextPessoal(ctx: PessoalTemplateContext): string {
  const link = `${SITE}/diagnostico/pessoal/pdi/${ctx.diagnosticoId}`
  return `Olá ${ctx.firstName}! 👋 Aqui é o Claudemir da Lidera Treinamentos.\n\nVi sua autoavaliação e analisei seu PDI — preparei um plano de 90 dias bem objetivo. Quer que eu te explique os pontos mais importantes?\n\n👉 Seu PDI completo: ${link}\n\nQuando você puder, me chama aqui para conversar.`
}

export function whatsappTextEmpresa(ctx: EmpresaTemplateContext): string {
  const link = `${SITE}/diagnostico/empresa/pdi/${ctx.diagnosticoId}`
  return `Olá ${ctx.firstName}! 👋 Aqui é o Claudemir da Lidera Treinamentos.\n\nRecebi o diagnóstico do ${ctx.supervisorNome} da ${ctx.empresa} e já preparei o PDI executivo — insumo direto para sua próxima reunião 1:1 com ele.\n\n👉 PDI executivo: ${link}\n\nQuer agendar 20 minutos para conversarmos sobre como conduzir a evolução dele?`
}

// ───── EMAIL ─────

export function emailSubjectPessoal(ctx: PessoalTemplateContext): string {
  return `${ctx.firstName}, segue seu PDI personalizado de 90 dias`
}

export function emailBodyPessoal(ctx: PessoalTemplateContext): string {
  const link = `${SITE}/diagnostico/pessoal/pdi/${ctx.diagnosticoId}`
  return `Olá ${ctx.firstName},

Tudo bem? Aqui é o Claudemir da Lidera Treinamentos.

Recebi sua autoavaliação e analisei pessoalmente seu PDI. Segue abaixo o link para o plano completo de 90 dias, com:

• Classificação do seu perfil de liderança hoje
• 3 fases estruturadas (30/30/30 dias) com ferramentas LIDERA
• Indicadores claros de evolução
• Bibliografia personalizada para seu caso

👉 Acesse seu PDI completo: ${link}

Recomendo bastante reservar 30 minutos para ler com calma. Se quiser, marque um café virtual comigo (20 minutos) para eu te explicar pessoalmente os pontos de maior alavancagem.

Conta comigo nessa jornada.

Abraço,
Claudemir Domingos
Lidera Treinamentos
WhatsApp: (64) 9 9609-9020`
}

export function emailSubjectEmpresa(ctx: EmpresaTemplateContext): string {
  return `${ctx.firstName}, o PDI executivo do ${ctx.supervisorNome.split(' ')[0]} está pronto`
}

export function emailBodyEmpresa(ctx: EmpresaTemplateContext): string {
  const link = `${SITE}/diagnostico/empresa/pdi/${ctx.diagnosticoId}`
  return `Olá ${ctx.firstName},

Tudo bem? Aqui é o Claudemir da Lidera Treinamentos.

Analisei pessoalmente o diagnóstico que você enviou sobre o ${ctx.supervisorNome} e preparei o PDI executivo — pensado como insumo para sua próxima reunião 1:1 com ele.

O documento traz:

• Classificação atual e meta de 90 dias para o ${ctx.supervisorNome.split(' ')[0]}
• Tabela de convergência entre expectativa da ${ctx.empresa} e o perfil avaliado
• 3 fases operacionais com KPIs específicos (turnover, retrabalho, etc.)
• Rituais de acompanhamento para você como gestor
• Nota crítica de risco se o plano não avançar

👉 PDI executivo: ${link}

Quer marcar 30 minutos para conversarmos sobre como implementar essa evolução? Em geral é nessa conversa que destravamos os pontos políticos e estratégicos que o PDI por si só não resolve.

Abraço,
Claudemir Domingos
Lidera Treinamentos
WhatsApp: (64) 9 9609-9020`
}
