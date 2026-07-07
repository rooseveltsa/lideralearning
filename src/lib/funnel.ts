/**
 * Funil de receita Lidera — do valor simbólico ao ticket alto.
 * Degrau 0: PDI pago (tripwire) → 1: turma presencial → 2: Academy → 3: corporativo.
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

/** Escada de ofertas exibida ao final do PDI (upsell progressivo). */
export const FUNNEL_LADDER: FunnelStep[] = [
  {
    degrau: '01',
    title: 'Imersão presencial + Academy',
    description:
      'Workshop intensivo de 2 dias com turmas de até 10 pessoas e trilhas digitais para executar o seu PDI com método e acompanhamento.',
    cta: 'Ver próxima turma',
    href: '/treinamento/modulo-1',
    highlight: false,
  },
  {
    degrau: '02',
    title: 'Lidera Academy completa',
    description:
      'Acesso contínuo a 120+ cursos com trilhas por papel — o motor que sustenta a sua evolução muito além dos 90 dias do PDI.',
    cta: 'Conhecer os planos',
    href: '/pricing',
    highlight: true,
  },
  {
    degrau: '03',
    title: 'Programa corporativo',
    description:
      'Diagnóstico organizacional, trilhas por nível de liderança e acompanhamento dedicado para levar o método à operação inteira.',
    cta: 'Falar com especialista',
    href: '/empresas',
    highlight: false,
  },
]
