/**
 * Funil atual: PDI (pessoa ou empresa) → turma presencial.
 * Aulas gravadas ficam fora da escada até serem publicadas.
 */

/** Liga o paywall do PDI. Desligado por padrão para não travar o funil atual. */
export const PDI_CHECKOUT_ENABLED = process.env.PDI_CHECKOUT_ENABLED === 'true'

/** Preço simbólico do PDI em centavos (default R$ 29,90). */
export const PDI_PRICE_CENTS = Number.parseInt(process.env.PDI_PRICE_CENTS || '2990', 10)

export const PDI_PRODUCT_NAME = 'PDI completo — Plano de Desenvolvimento Individual'

export function formatBRLFromCents(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export type FunnelStep = {
  degrau: string
  title: string
  description: string
  cta: string
  href: string
  highlight: boolean
}

/** Escada ao final do PDI: a venda agora é a turma presencial. */
export const FUNNEL_LADDER: FunnelStep[] = [
  {
    degrau: '01',
    title: 'Turma presencial para você',
    description:
      'O PDI vira a pauta da imersão Supervisor: Da Operação à Liderança. As aulas gravadas entram na plataforma depois.',
    cta: 'Ver o programa presencial',
    href: '/treinamento/modulos',
    highlight: true,
  },
  {
    degrau: '02',
    title: 'Turma presencial para a empresa',
    description:
      'O mesmo programa, fechado para o time. O diagnóstico dos supervisores define quem entra e o que a turma precisa treinar.',
    cta: 'Levar para a empresa',
    href: '/empresas',
    highlight: false,
  },
]
