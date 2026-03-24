'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Building2,
  UserCog,
  Users,
  Sparkles,
  BarChart3,
  Shield,
  Zap,
  Trophy,
  ClipboardCheck,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

type UserProfile = {
  id: string
  fullName: string
  email: string
}

type Respostas = Record<string, string>
type TextosAbertos = Record<string, string>

type RadioOption = {
  value: string
  label: string
  descricao?: string
}

type StepField =
  | { type: 'text'; key: string; label: string; placeholder: string }
  | { type: 'textarea'; key: string; label: string; placeholder: string }
  | { type: 'radio'; key: string; label: string; opcoes: RadioOption[] }
  | { type: 'divider'; label: string }

type StepConfig = {
  id: string
  numero: number
  titulo: string
  subtitulo: string
  icon: typeof Building2
  fields: StepField[]
}

/* ─────────────────────────────────────────────
   Form Steps Configuration
───────────────────────────────────────────── */

const steps: StepConfig[] = [
  {
    id: 'identificacao',
    numero: 1,
    titulo: 'Identificação',
    subtitulo: 'Dados Gerais',
    icon: Building2,
    fields: [
      { type: 'text', key: 'empresa', label: 'Empresa', placeholder: 'Nome da empresa' },
      { type: 'text', key: 'nomeSupervisor', label: 'Nome do Supervisor', placeholder: 'Nome completo do supervisor avaliado' },
      { type: 'text', key: 'cargo', label: 'Cargo', placeholder: 'Cargo atual do supervisor' },
      { type: 'text', key: 'gestorDireto', label: 'Gestor Direto / RH Responsável', placeholder: 'Nome do gestor direto ou responsável de RH' },
      { type: 'text', key: 'dataAvaliacao', label: 'Data', placeholder: 'DD/MM/AAAA' },
    ],
  },
  {
    id: 'perfilSupervisor',
    numero: 2,
    titulo: 'Perfil do Supervisor',
    subtitulo: 'O Elo Estratégico',
    icon: UserCog,
    fields: [
      { type: 'divider', label: 'Situação Atual' },
      {
        type: 'radio',
        key: 'principalDesafio',
        label: 'Principal desafio observado no supervisor',
        opcoes: [
          { value: 'transmissao', label: 'Transmissão', descricao: 'Dificuldade em traduzir metas estratégicas em ações claras para a equipe.' },
          { value: 'execucao', label: 'Execução', descricao: 'Excesso de atuação operacional, gerando sobrecarga e perda de foco gerencial.' },
          { value: 'postura', label: 'Postura', descricao: 'Baixa autoridade percebida pela equipe e pares.' },
          { value: 'posicionamento', label: 'Posicionamento', descricao: 'Atuação frágil com a diretoria, sem voz ativa nas decisões.' },
        ],
      },
      {
        type: 'radio',
        key: 'nivelAtualPerfil',
        label: 'Nível atual percebido',
        opcoes: [
          { value: 'reativo', label: 'Reativo', descricao: 'Atua apenas quando demandado, sem iniciativa própria.' },
          { value: 'funcional', label: 'Funcional', descricao: 'Cumpre o básico, mas sem impacto estratégico.' },
          { value: 'estrategico', label: 'Estratégico', descricao: 'Atua com visão de médio/longo prazo e influência.' },
        ],
      },
      { type: 'divider', label: 'Visão de Futuro' },
      {
        type: 'radio',
        key: 'atuacaoPosLidera',
        label: 'Como o supervisor deve atuar após o LIDERA',
        opcoes: [
          { value: 'tradutorEstrategico', label: 'Tradutor Estratégico', descricao: 'Capaz de traduzir metas da diretoria em planos de ação para a equipe.' },
          { value: 'liderDesenvolvedor', label: 'Líder Desenvolvedor', descricao: 'Foco em desenvolver pessoas e formar sucessores.' },
          { value: 'referenciaPostura', label: 'Referência de Postura', descricao: 'Exemplo de conduta, ética e posicionamento.' },
          { value: 'interlocutorConfiavel', label: 'Interlocutor Confiável', descricao: 'Parceiro estratégico da diretoria nas decisões.' },
        ],
      },
      {
        type: 'radio',
        key: 'nivelEsperadoPerfil',
        label: 'Nível esperado após o treinamento',
        opcoes: [
          { value: 'funcional', label: 'Funcional', descricao: 'Que passe a cumprir o papel gerencial com consistência.' },
          { value: 'estrategico', label: 'Estratégico', descricao: 'Que atue com visão e influência na operação.' },
          { value: 'referencia', label: 'Referência', descricao: 'Que se torne modelo de liderança na organização.' },
        ],
      },
    ],
  },
  {
    id: 'gestaoEquipe',
    numero: 3,
    titulo: 'Gestão da Equipe',
    subtitulo: 'Matriz de Competência',
    icon: Users,
    fields: [
      { type: 'divider', label: 'Situação Atual' },
      {
        type: 'radio',
        key: 'maiorGargalo',
        label: 'Maior gargalo observado na equipe do supervisor',
        opcoes: [
          { value: 'iniciantesMotivados', label: 'Iniciantes Motivados', descricao: 'Equipe com vontade, mas sem competência técnica suficiente.' },
          { value: 'tecnicosDesengajados', label: 'Técnicos Desengajados', descricao: 'Profissionais experientes, porém desmotivados ou resistentes.' },
          { value: 'faltaSucessao', label: 'Falta de Sucessão', descricao: 'Não há pessoas preparadas para assumir responsabilidades maiores.' },
          { value: 'dificuldadeEscalar', label: 'Dificuldade de Escalar Resultados', descricao: 'A equipe depende excessivamente do supervisor para entregar.' },
        ],
      },
      {
        type: 'radio',
        key: 'maturidadeAtual',
        label: 'Maturidade atual da equipe',
        opcoes: [
          { value: 'baixa', label: 'Baixa', descricao: 'Equipe requer supervisão constante e direta.' },
          { value: 'media', label: 'Média', descricao: 'Equipe funciona com acompanhamento periódico.' },
          { value: 'alta', label: 'Alta', descricao: 'Equipe opera com autonomia significativa.' },
        ],
      },
      { type: 'divider', label: 'Visão de Futuro' },
      {
        type: 'radio',
        key: 'visaoFuturoEquipe',
        label: 'O que esperamos que o supervisor desenvolva na equipe',
        opcoes: [
          { value: 'competenciasTecnicas', label: 'Desenvolva competências técnicas', descricao: 'Capacitar a equipe para executar com qualidade e autonomia.' },
          { value: 'reativeEngajamento', label: 'Reative engajamento', descricao: 'Recuperar a motivação e o comprometimento dos profissionais.' },
          { value: 'formeSucessores', label: 'Forme sucessores', descricao: 'Preparar pessoas para assumir posições de maior responsabilidade.' },
          { value: 'otimizeAlocacao', label: 'Otimize alocação e desempenho', descricao: 'Melhorar a distribuição de tarefas e eficiência da equipe.' },
        ],
      },
      {
        type: 'radio',
        key: 'maturidadeEsperada',
        label: 'Maturidade esperada pós-treinamento',
        opcoes: [
          { value: 'media', label: 'Média', descricao: 'Que a equipe funcione com acompanhamento periódico.' },
          { value: 'alta', label: 'Alta', descricao: 'Que a equipe opere com autonomia significativa.' },
          { value: 'sustentavel', label: 'Sustentável', descricao: 'Que a equipe mantenha resultados sem depender do supervisor.' },
        ],
      },
    ],
  },
  {
    id: 'conflitosGeracionais',
    numero: 4,
    titulo: 'Conflitos Geracionais',
    subtitulo: 'Diversidade e Coesão',
    icon: Sparkles,
    fields: [
      { type: 'textarea', key: 'impactosConflito', label: 'Quais impactos você observa no conflito de gerações dentro da equipe do supervisor?', placeholder: 'Descreva os principais impactos observados...' },
      {
        type: 'radio',
        key: 'nivelImpacto',
        label: 'Nível de impacto dos conflitos geracionais',
        opcoes: [
          { value: 'baixo', label: 'Baixo', descricao: 'Diferenças existem, mas não afetam significativamente a operação.' },
          { value: 'medio', label: 'Médio', descricao: 'Conflitos geram atritos frequentes e afetam a produtividade.' },
          { value: 'alto', label: 'Alto', descricao: 'Conflitos são críticos e comprometem resultados e clima.' },
        ],
      },
      { type: 'textarea', key: 'expectativaConflito', label: 'Qual comportamento esperado do supervisor após o treinamento nesta área?', placeholder: 'Descreva a expectativa de mudança comportamental...' },
    ],
  },
  {
    id: 'supervisor4',
    numero: 5,
    titulo: 'Supervisor 4.0',
    subtitulo: 'Dados e IA',
    icon: BarChart3,
    fields: [
      { type: 'textarea', key: 'kpiPreocupa', label: 'Qual KPI mais preocupa a empresa em relação à área do supervisor?', placeholder: 'Ex: turnover, produtividade, retrabalho, absenteísmo...' },
      {
        type: 'radio',
        key: 'gestaoAtualDados',
        label: 'Como o supervisor gerencia dados e indicadores atualmente?',
        opcoes: [
          { value: 'reativa', label: 'Reativa', descricao: 'Só analisa dados quando cobrado ou no fechamento do mês.' },
          { value: 'parcial', label: 'Parcial', descricao: 'Acompanha alguns indicadores, mas sem ação preventiva consistente.' },
          { value: 'preventiva', label: 'Preventiva', descricao: 'Monitora indicadores ativamente e age antes dos problemas.' },
        ],
      },
      { type: 'textarea', key: 'melhoriaEsperadaKpi', label: 'Qual melhoria concreta é esperada neste indicador após o treinamento?', placeholder: 'Descreva o resultado esperado...' },
    ],
  },
  {
    id: 'eticaSeguranca',
    numero: 6,
    titulo: 'Ética e Segurança Psicológica',
    subtitulo: 'Ambiente de Confiança',
    icon: Shield,
    fields: [
      {
        type: 'radio',
        key: 'climaAtual',
        label: 'Como é o clima atual na área do supervisor?',
        opcoes: [
          { value: 'errosOcultados', label: 'Erros ocultados por medo', descricao: 'A equipe tem medo de reportar falhas e esconde problemas.' },
          { value: 'transparenciaParcial', label: 'Transparência parcial', descricao: 'Alguns problemas são reportados, mas há resistência em expor falhas.' },
          { value: 'ambienteAberto', label: 'Ambiente aberto, mas pouco ágil', descricao: 'As pessoas se sentem à vontade, mas falta velocidade na correção.' },
        ],
      },
      {
        type: 'radio',
        key: 'nivelConfianca',
        label: 'Nível de confiança na relação supervisor-equipe',
        opcoes: [
          { value: 'baixo', label: 'Baixo', descricao: 'Relação marcada por desconfiança ou distanciamento.' },
          { value: 'medio', label: 'Médio', descricao: 'Relação funcional, mas sem profundidade de confiança.' },
          { value: 'alto', label: 'Alto', descricao: 'Relação de confiança consolidada e recíproca.' },
        ],
      },
      {
        type: 'radio',
        key: 'expectativaEtica',
        label: 'Expectativa pós-treinamento',
        opcoes: [
          { value: 'comunicacaoAberta', label: 'Comunicação aberta', descricao: 'Que o supervisor promova diálogo transparente sem retaliação.' },
          { value: 'correcaoSemMedo', label: 'Correção sem medo', descricao: 'Que erros sejam tratados como oportunidades de aprendizado.' },
          { value: 'posturaEticaConsistente', label: 'Postura ética consistente', descricao: 'Que o supervisor seja referência de integridade em todas as situações.' },
        ],
      },
    ],
  },
  {
    id: 'autonomiaDecisao',
    numero: 7,
    titulo: 'Autonomia e Tomada de Decisão',
    subtitulo: 'Protagonismo Gerencial',
    icon: Zap,
    fields: [
      {
        type: 'radio',
        key: 'nivelAtualAutonomia',
        label: 'Nível atual de autonomia do supervisor',
        opcoes: [
          { value: 'dependente', label: 'Dependente', descricao: 'Consulta a chefia para praticamente todas as decisões.' },
          { value: 'parcialmenteAutonomo', label: 'Parcialmente Autônomo', descricao: 'Resolve questões operacionais, mas escala decisões táticas.' },
          { value: 'autonomo', label: 'Autônomo', descricao: 'Toma decisões com segurança e responde por elas.' },
        ],
      },
      {
        type: 'radio',
        key: 'nivelEsperadoAutonomia',
        label: 'Nível de autonomia esperado após o treinamento',
        opcoes: [
          { value: 'autonomiaOperacional', label: 'Autonomia Operacional', descricao: 'Que resolva questões do dia a dia sem depender de aprovação.' },
          { value: 'autonomiaDecisoria', label: 'Autonomia Decisória', descricao: 'Que tome decisões táticas e responda por resultados.' },
          { value: 'autonomiaEstrategica', label: 'Autonomia Estratégica', descricao: 'Que participe ativamente de decisões estratégicas da área.' },
        ],
      },
      { type: 'textarea', key: 'prioridadeEstrategica', label: 'Prioridade Estratégica: qual é o UM resultado crítico que este supervisor deve entregar nos próximos 90 dias?', placeholder: 'Descreva o resultado mais importante esperado...' },
    ],
  },
  {
    id: 'criterioSucesso',
    numero: 8,
    titulo: 'Critério de Sucesso e Síntese',
    subtitulo: 'Visão Consolidada',
    icon: ClipboardCheck,
    fields: [
      { type: 'textarea', key: 'criterioSucesso', label: 'Qual o critério de sucesso do investimento no treinamento? (30 e 60 dias)', placeholder: 'Descreva como a empresa medirá o retorno do investimento...' },
      { type: 'textarea', key: 'situacaoAtualSupervisor', label: 'Situação Atual do Supervisor (síntese)', placeholder: 'Resumo de como o supervisor atua hoje...' },
      { type: 'textarea', key: 'perfilEsperado', label: 'Perfil Esperado Pós-LIDERA', placeholder: 'Descreva como o supervisor deve atuar após o treinamento...' },
      { type: 'textarea', key: 'maiorGap', label: 'Maior GAP a ser fechado', placeholder: 'Qual a maior lacuna entre a situação atual e a esperada...' },
      { type: 'textarea', key: 'riscoSeMudar', label: 'Risco se nada mudar', placeholder: 'O que acontecerá se o supervisor continuar atuando como hoje...' },
    ],
  },
]

/* ─────────────────────────────────────────────
   Step Labels for Result
───────────────────────────────────────────── */

const radioLabelsMap: Record<string, Record<string, string>> = {}
steps.forEach((s) => {
  s.fields.forEach((f) => {
    if (f.type === 'radio') {
      const map: Record<string, string> = {}
      f.opcoes.forEach((o) => {
        map[o.value] = o.label
      })
      radioLabelsMap[f.key] = map
    }
  })
})

function getRadioLabel(key: string, value: string): string {
  return radioLabelsMap[key]?.[value] ?? value
}

/* ─────────────────────────────────────────────
   Shared Styles
───────────────────────────────────────────── */

const textareaClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 min-h-[80px] resize-y'

const inputClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20'

/* ─────────────────────────────────────────────
   Validation Helpers
───────────────────────────────────────────── */

function isStepComplete(stepConfig: StepConfig, respostas: Respostas, textos: TextosAbertos): boolean {
  for (const field of stepConfig.fields) {
    if (field.type === 'divider') continue
    if (field.type === 'radio') {
      if (!respostas[field.key]) return false
    }
    if (field.type === 'text') {
      if (!textos[field.key]?.trim()) return false
    }
    // textareas are optional — not blocking navigation
  }
  return true
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

type Props = {
  user: UserProfile
}

export default function AvaliacaoExecutivaForm({ user }: Props) {
  const [step, setStep] = useState(0)
  const [respostas, setRespostas] = useState<Respostas>({})
  const [textos, setTextos] = useState<TextosAbertos>({})
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<{
    avaliacaoId: string
  } | null>(null)

  const totalSteps = steps.length
  const isResultado = resultado !== null
  const stepAtual = !isResultado ? steps[step] : null
  const progressoVisual = Math.round(((step + 1) / totalSteps) * 100)

  function selecionarRadio(key: string, valor: string) {
    setRespostas((prev) => ({ ...prev, [key]: valor }))
  }

  function updateTexto(key: string, value: string) {
    setTextos((prev) => ({ ...prev, [key]: value }))
  }

  function avancar() {
    setErro(null)
    if (step < totalSteps - 1) setStep((s) => s + 1)
  }

  function voltar() {
    setErro(null)
    if (step > 0) setStep((s) => s - 1)
  }

  const allStepsComplete = steps.every((s) => isStepComplete(s, respostas, textos))

  async function handleSubmit() {
    if (!allStepsComplete || enviando) return

    setEnviando(true)
    setErro(null)

    try {
      const response = await fetch('/api/treinamento/avaliacao-executiva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          respostas,
          textos,
        }),
      })

      const data = (await response.json()) as { success?: boolean; error?: string; avaliacaoId?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao enviar avaliação executiva.')
      }

      setResultado({ avaliacaoId: data.avaliacaoId || '' })
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado.')
    } finally {
      setEnviando(false)
    }
  }

  /* ── Resultado Final ── */

  if (isResultado) {
    const resultSections = steps.map((s) => ({
      titulo: s.titulo,
      subtitulo: s.subtitulo,
      icon: s.icon,
      items: s.fields
        .filter((f): f is Exclude<StepField, { type: 'divider' }> => f.type !== 'divider')
        .map((f) => {
          if (f.type === 'radio') {
            return { label: f.label, value: getRadioLabel(f.key, respostas[f.key] || '—') }
          }
          return { label: f.label, value: textos[f.key]?.trim() || '—' }
        }),
    }))

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#E8F5E9] border-2 border-[#C8E6C9]">
            <CheckCircle2 className="h-9 w-9 text-[#4CAF35]" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Avaliação Enviada com Sucesso</h2>
          <p className="mt-2 text-sm text-[#64748B]">
            A Avaliação Executiva foi registrada. Confira abaixo o resumo das respostas.
          </p>
        </div>

        {/* Summary Cards */}
        {resultSections.map((section) => {
          const SIcon = section.icon
          return (
            <div key={section.titulo} className="overflow-hidden rounded-2xl border border-[#E3EBF6] bg-white">
              <div className="flex items-center gap-3 border-b border-[#E3EBF6] bg-[#F8FAFD] px-5 py-4">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#1565C0]/10">
                  <SIcon className="h-4.5 w-4.5 text-[#1565C0]" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
                    {section.subtitulo}
                  </p>
                  <p className="text-sm font-bold text-[#111827]">{section.titulo}</p>
                </div>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {section.items.map((item, idx) => (
                  <div key={idx} className="px-5 py-3">
                    <p className="text-xs font-semibold text-[#64748B]">{item.label}</p>
                    <p className="mt-0.5 text-sm text-[#111827]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Next Steps */}
        <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
          <h4 className="mb-3 text-sm font-bold text-[#0F172A]">Próximos Passos</h4>
          <div className="space-y-2.5">
            {[
              'A equipe LIDERA analisará esta avaliação para personalizar o treinamento.',
              'O supervisor será convidado a realizar a autoavaliação complementar.',
              'Um plano de desenvolvimento individual será proposto com base nas respostas.',
            ].map((texto) => (
              <div key={texto} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1565C0]" />
                <p className="text-sm text-[#334155]">{texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="mb-4 text-sm font-semibold italic text-[#64748B]">
            Obrigado por investir no desenvolvimento da liderança da sua empresa.
          </p>
          <a
            href="https://wa.me/5564996099020?text=Ol%C3%A1%2C%20enviei%20a%20avalia%C3%A7%C3%A3o%20executiva%20e%20gostaria%20de%20agendar%20o%20treinamento%20LIDERA!"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
          >
            Falar com Claudemir no WhatsApp
          </a>
        </div>
      </div>
    )
  }

  /* ── Step Atual ── */

  if (!stepAtual) return null

  const Icon = stepAtual.icon
  const stepCompleto = isStepComplete(stepAtual, respostas, textos)

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-[#64748B]">
            Etapa {step + 1} de {totalSteps}
          </p>
          <p className="text-sm font-bold text-[#1565C0]">{progressoVisual}%</p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div
            className="h-full rounded-full bg-[#1565C0] transition-all duration-500"
            style={{ width: `${progressoVisual}%` }}
          />
        </div>
      </div>

      {/* Header da etapa */}
      <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1565C0]/10">
          <Icon className="h-5 w-5 text-[#1565C0]" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
          {stepAtual.subtitulo}
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#111827]">
          {stepAtual.titulo}
        </h2>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {stepAtual.fields.map((field, idx) => {
          if (field.type === 'divider') {
            return (
              <div key={idx} className="pt-2">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#F57C00]">
                  {field.label}
                </p>
                <div className="mt-1.5 h-px bg-[#F57C00]/20" />
              </div>
            )
          }

          if (field.type === 'text') {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#334155]">{field.label}</label>
                <input
                  type="text"
                  value={textos[field.key] || ''}
                  onChange={(e) => updateTexto(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            )
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.key} className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#334155]">{field.label}</label>
                <textarea
                  value={textos[field.key] || ''}
                  onChange={(e) => updateTexto(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={textareaClass}
                />
              </div>
            )
          }

          if (field.type === 'radio') {
            const selectedValue = respostas[field.key]
            return (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#334155]">{field.label}</label>
                <div className="space-y-2.5">
                  {field.opcoes.map((opcao) => {
                    const selecionado = selectedValue === opcao.value
                    return (
                      <button
                        key={opcao.value}
                        type="button"
                        onClick={() => selecionarRadio(field.key, opcao.value)}
                        className={`w-full rounded-xl border px-5 py-4 text-left transition-all ${
                          selecionado
                            ? 'border-[#1565C0] bg-[#EFF6FE] shadow-sm'
                            : 'border-[#E5E7EB] bg-white hover:border-[#BCD0EA] hover:bg-[#F8FAFD]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                              selecionado
                                ? 'border-[#1565C0] bg-[#1565C0]'
                                : 'border-[#CBD5E1] bg-white'
                            }`}
                          >
                            {selecionado && (
                              <span className="h-2 w-2 rounded-full bg-white" />
                            )}
                          </span>
                          <div className="flex-1">
                            <p className={`text-sm font-bold ${selecionado ? 'text-[#111827]' : 'text-[#334155]'}`}>
                              {opcao.label}
                            </p>
                            {opcao.descricao && (
                              <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">
                                {opcao.descricao}
                              </p>
                            )}
                          </div>
                          {selecionado && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1565C0]" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          }

          return null
        })}
      </div>

      {/* Erro */}
      {erro && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Navegação */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E3EBF6] pt-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={voltar}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] transition-colors hover:text-[#111827]"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={avancar}
            disabled={!stepCompleto}
            className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allStepsComplete || enviando}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F57C00]/20 transition-all hover:bg-[#E65100] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {enviando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando avaliação...
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4" />
                Enviar Avaliação Executiva
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
