'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Trophy,
  Target,
  Users,
  Zap,
  Brain,
  Calendar,
  Cpu,
  Star,
  TrendingUp,
  Shield,
  Lightbulb,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

type UserProfile = {
  id: string
  fullName: string
  email: string
}

type DimensaoRating = {
  id: string
  label: string
  descricao: string
  icon: typeof Target
}

type SkillRating = {
  id: string
  label: string
  categoria: 'hard' | 'soft'
}

type CheckboxItem = {
  id: string
  label: string
}

type Respostas = Record<string, number>
type TextosAbertos = Record<string, string>
type CheckboxState = Record<string, boolean>

/* ─────────────────────────────────────────────
   Form Data
───────────────────────────────────────────── */

const dimensoes: DimensaoRating[] = [
  {
    id: 'facilitador',
    label: 'Facilitador',
    descricao: 'Elimina obstaculos e cria ambiente produtivo',
    icon: Zap,
  },
  {
    id: 'orientador',
    label: 'Orientador',
    descricao: 'Desenvolve competencias e promove aprendizado',
    icon: Users,
  },
  {
    id: 'garantidor',
    label: 'Garantidor',
    descricao: 'Assegura qualidade, seguranca e etica',
    icon: Shield,
  },
  {
    id: 'estrategista',
    label: 'Estrategista',
    descricao: 'Traduz metas em planos de acao concretos',
    icon: Target,
  },
  {
    id: 'mentor',
    label: 'Mentor',
    descricao: 'Prepara sucessores e deixa um legado',
    icon: Star,
  },
]

const hardSkills: SkillRating[] = [
  { id: 'hard_execucao', label: 'Execucao e Entrega', categoria: 'hard' },
  { id: 'hard_processos', label: 'Dominio de Processos', categoria: 'hard' },
  { id: 'hard_ferramentas', label: 'Uso de Ferramentas (ERP/CRM)', categoria: 'hard' },
  { id: 'hard_padroes', label: 'Padroes de Sucesso (Triade da Maestria)', categoria: 'hard' },
]

const softSkills: SkillRating[] = [
  { id: 'soft_inteligencia', label: 'Inteligencia Emocional', categoria: 'soft' },
  { id: 'soft_feedback', label: 'Feedback Assertivo (Formula E.I.A.)', categoria: 'soft' },
  { id: 'soft_conflitos', label: 'Gestao de Conflitos Geracionais', categoria: 'soft' },
  { id: 'soft_visao', label: 'Visao de Futuro', categoria: 'soft' },
]

const fasesRoteiro = [
  {
    valor: 1,
    label: 'Comportamental (Sem. 1-4)',
    descricao: 'Escuta Ativa, Confianca e Etica',
  },
  {
    valor: 2,
    label: 'Processual (Sem. 5-8)',
    descricao: 'Otimizacao e Padronizacao',
  },
  {
    valor: 3,
    label: 'Estrategico (Sem. 9-12)',
    descricao: 'Inovacao e Sucessao',
  },
]

const tecnologiaItems: CheckboxItem[] = [
  { id: 'tech_dados', label: 'Uso de Dados Estruturados (ERP/Excel)' },
  { id: 'tech_prompts', label: 'Prompts Magicos (Contexto + Dados + Objetivo)' },
  { id: 'tech_causa_raiz', label: 'Analise de Causa Raiz' },
  { id: 'tech_anonimizacao', label: 'Anonimizacao de Dados' },
  { id: 'tech_padroes', label: 'Padroes de Sucesso' },
]

const stepConfig = [
  { titulo: 'Identificacao e Contexto', subtitulo: 'Seus Dados', icon: Users },
  { titulo: 'Diagnostico das 5 Dimensoes', subtitulo: 'Lideranca', icon: Target },
  { titulo: 'Hard Skills vs Soft Skills', subtitulo: 'Competencias', icon: Brain },
  { titulo: 'Roteiro de 12 Semanas', subtitulo: 'Plano de Acao', icon: Calendar },
  { titulo: 'Supervisor 4.0 e Tecnologia', subtitulo: 'Inovacao', icon: Cpu },
]

const ratingLabels: Record<number, string> = {
  1: 'Muito Baixo',
  2: 'Baixo',
  3: 'Moderado',
  4: 'Alto',
  5: 'Muito Alto',
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function getDimensaoNivel(media: number) {
  if (media <= 2)
    return {
      titulo: 'Em Desenvolvimento',
      cor: '#EF4444',
      bgCor: '#FEF2F2',
      borderCor: '#FECACA',
    }
  if (media <= 3.5)
    return {
      titulo: 'Intermediario',
      cor: '#F59E0B',
      bgCor: '#FFFBEB',
      borderCor: '#FDE68A',
    }
  return {
    titulo: 'Avancado',
    cor: '#4CAF35',
    bgCor: '#F0FDF4',
    borderCor: '#BBF7D0',
  }
}

function getFaseRecomendacao(fase: number) {
  switch (fase) {
    case 1:
      return 'Foco recomendado: fortaleca a base comportamental. Invista em escuta ativa, construcao de confianca e praticas eticas consistentes.'
    case 2:
      return 'Foco recomendado: otimize processos e padronize entregas. Aplique ferramentas de gestao para eliminar gargalos.'
    case 3:
      return 'Foco recomendado: pense estrategicamente. Inicie acoes de inovacao e preparacao de sucessores para deixar um legado.'
    default:
      return ''
  }
}

/* ─────────────────────────────────────────────
   Shared Styles
───────────────────────────────────────────── */

const textareaClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 min-h-[80px] resize-y'

const inputClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20'

/* ─────────────────────────────────────────────
   Rating Scale Component
───────────────────────────────────────────── */

function RatingScale({
  id,
  value,
  onChange,
}: {
  id: string
  value: number | undefined
  onChange: (id: string, valor: number) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const selected = value === n
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(id, n)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-extrabold transition-all ${
              selected
                ? 'text-white shadow-sm'
                : 'border border-[#E5E7EB] bg-white text-[#94A3B8] hover:border-[#BCD0EA] hover:bg-[#F8FAFD] hover:text-[#334155]'
            }`}
            style={
              selected
                ? {
                    backgroundColor:
                      n >= 4 ? '#4CAF35' : n >= 3 ? '#F59E0B' : '#EF4444',
                  }
                : undefined
            }
            title={ratingLabels[n]}
          >
            {n}
          </button>
        )
      })}
      {value !== undefined && (
        <span className="ml-2 text-xs font-semibold text-[#64748B]">
          {ratingLabels[value]}
        </span>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

type Props = {
  user: UserProfile
}

export default function PDIForm({ user }: Props) {
  const [step, setStep] = useState(0)
  const [respostas, setRespostas] = useState<Respostas>({})
  const [textos, setTextos] = useState<TextosAbertos>({
    nome: user.fullName || '',
    cargo: '',
    tempoFuncao: '',
    departamento: '',
  })
  const [checkboxes, setCheckboxes] = useState<CheckboxState>({})
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<{
    dimensoes: Record<string, number>
    hardMedia: number
    softMedia: number
    faseEscolhida: number
    pdiId: string
  } | null>(null)

  const totalSteps = stepConfig.length
  const isResultado = resultado !== null
  const progressoVisual = Math.round(((step + 1) / totalSteps) * 100)

  /* ── Validation per step ── */

  function isStepValid(s: number): boolean {
    switch (s) {
      case 0:
        return !!(textos.nome?.trim() && textos.cargo?.trim())
      case 1:
        return dimensoes.every((d) => respostas[d.id] !== undefined)
      case 2:
        return (
          hardSkills.every((sk) => respostas[sk.id] !== undefined) &&
          softSkills.every((sk) => respostas[sk.id] !== undefined)
        )
      case 3:
        return respostas['faseRoteiro'] !== undefined
      case 4:
        return true
      default:
        return false
    }
  }

  function isAllValid(): boolean {
    return [0, 1, 2, 3, 4].every((s) => isStepValid(s))
  }

  /* ── Handlers ── */

  function selecionar(id: string, valor: number) {
    setRespostas((prev) => ({ ...prev, [id]: valor }))
  }

  function updateTexto(key: string, value: string) {
    setTextos((prev) => ({ ...prev, [key]: value }))
  }

  function toggleCheckbox(id: string) {
    setCheckboxes((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  function avancar() {
    setErro(null)
    if (step < totalSteps - 1) setStep((s) => s + 1)
  }

  function voltar() {
    setErro(null)
    if (step > 0) setStep((s) => s - 1)
  }

  async function handleSubmit() {
    if (!isAllValid() || enviando) return

    setEnviando(true)
    setErro(null)

    const dimensoesScore: Record<string, number> = {}
    dimensoes.forEach((d) => {
      dimensoesScore[d.id] = respostas[d.id] ?? 0
    })

    const hardTotal = hardSkills.reduce((acc, sk) => acc + (respostas[sk.id] ?? 0), 0)
    const softTotal = softSkills.reduce((acc, sk) => acc + (respostas[sk.id] ?? 0), 0)
    const hardMedia = hardTotal / hardSkills.length
    const softMedia = softTotal / softSkills.length
    const faseEscolhida = respostas['faseRoteiro'] ?? 1

    try {
      const response = await fetch('/api/treinamento/pdi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          identificacao: {
            nome: textos.nome,
            cargo: textos.cargo,
            tempoFuncao: textos.tempoFuncao,
            departamento: textos.departamento,
          },
          dimensoes: dimensoesScore,
          hardSkills: hardSkills.reduce(
            (acc, sk) => ({ ...acc, [sk.id]: respostas[sk.id] ?? 0 }),
            {} as Record<string, number>
          ),
          softSkills: softSkills.reduce(
            (acc, sk) => ({ ...acc, [sk.id]: respostas[sk.id] ?? 0 }),
            {} as Record<string, number>
          ),
          faseRoteiro: faseEscolhida,
          textosAbertos: {
            comportamentoDiario: textos.comportamentoDiario || '',
            analiseGargalos: textos.analiseGargalos || '',
            acaoEstrategica: textos.acaoEstrategica || '',
            decisaoBaseadaDados: textos.decisaoBaseadaDados || '',
          },
          tecnologias: Object.entries(checkboxes)
            .filter(([, v]) => v)
            .map(([k]) => k),
        }),
      })

      const data = (await response.json()) as {
        success?: boolean
        error?: string
        pdiId?: string
      }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao enviar o Plano de Desenvolvimento Individual.')
      }

      setResultado({
        dimensoes: dimensoesScore,
        hardMedia,
        softMedia,
        faseEscolhida,
        pdiId: data.pdiId || '',
      })
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado.')
    } finally {
      setEnviando(false)
    }
  }

  /* ═══════════════════════════════════════════
     RESULTADO FINAL
  ═══════════════════════════════════════════ */

  if (isResultado) {
    const dimValues = Object.values(resultado.dimensoes)
    const mediaDimensoes = dimValues.reduce((a, b) => a + b, 0) / dimValues.length
    const nivel = getDimensaoNivel(mediaDimensoes)
    const pontuacaoGeral =
      (mediaDimensoes + resultado.hardMedia + resultado.softMedia) / 3

    return (
      <div className="space-y-6">
        {/* Score Geral */}
        <div className="text-center">
          <div
            className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: nivel.bgCor,
              border: `2px solid ${nivel.borderCor}`,
            }}
          >
            <Trophy className="h-9 w-9" style={{ color: nivel.cor }} />
          </div>
          <p className="text-sm font-bold text-[#64748B]">Pontuacao Geral</p>
          <p className="text-4xl font-extrabold text-[#0F172A]">
            {pontuacaoGeral.toFixed(1)}{' '}
            <span className="text-lg font-bold text-[#94A3B8]">/ 5.0</span>
          </p>
        </div>

        {/* Nivel */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: nivel.bgCor,
            borderColor: nivel.borderCor,
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.15em]"
            style={{ color: nivel.cor }}
          >
            Nivel de Maturidade
          </p>
          <h3 className="mt-1 text-xl font-extrabold text-[#0F172A]">
            {nivel.titulo}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[#334155]">
            Sua media nas 5 dimensoes da lideranca e{' '}
            <strong>{mediaDimensoes.toFixed(1)}</strong>/5.0. Continue
            investindo nas areas com menor pontuacao para equilibrar seu
            perfil de lider.
          </p>
        </div>

        {/* Radar / Dimensoes */}
        <div className="overflow-hidden rounded-2xl border border-[#E3EBF6] bg-white">
          <div className="border-b border-[#E5E7EB] px-5 py-3">
            <h4 className="text-sm font-bold text-[#0F172A]">
              5 Dimensoes da Lideranca
            </h4>
          </div>
          {dimensoes.map((d, i) => {
            const nota = resultado.dimensoes[d.id] ?? 0
            const pct = (nota / 5) * 100
            const DIcon = d.icon
            return (
              <div
                key={d.id}
                className={`px-5 py-4 ${
                  i < dimensoes.length - 1 ? 'border-b border-[#E5E7EB]' : ''
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <DIcon className="h-4 w-4 text-[#1565C0]" />
                    <p className="text-sm font-bold text-[#111827]">{d.label}</p>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{
                      color:
                        nota >= 4
                          ? '#4CAF35'
                          : nota >= 3
                            ? '#F59E0B'
                            : '#EF4444',
                    }}
                  >
                    {nota}/5
                  </span>
                </div>
                <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-[#EEF3F9]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor:
                        nota >= 4
                          ? '#4CAF35'
                          : nota >= 3
                            ? '#F59E0B'
                            : '#EF4444',
                    }}
                  />
                </div>
                <p className="text-xs text-[#64748B]">{d.descricao}</p>
              </div>
            )
          })}
        </div>

        {/* Skills Comparison */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#E3EBF6] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#1565C0]" />
              <h4 className="text-sm font-bold text-[#0F172A]">Hard Skills</h4>
            </div>
            <p className="text-3xl font-extrabold text-[#0F172A]">
              {resultado.hardMedia.toFixed(1)}
              <span className="text-base font-bold text-[#94A3B8]">/5.0</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF3F9]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(resultado.hardMedia / 5) * 100}%`,
                  backgroundColor:
                    resultado.hardMedia >= 4
                      ? '#4CAF35'
                      : resultado.hardMedia >= 3
                        ? '#F59E0B'
                        : '#EF4444',
                }}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-[#E3EBF6] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#F57C00]" />
              <h4 className="text-sm font-bold text-[#0F172A]">Soft Skills</h4>
            </div>
            <p className="text-3xl font-extrabold text-[#0F172A]">
              {resultado.softMedia.toFixed(1)}
              <span className="text-base font-bold text-[#94A3B8]">/5.0</span>
            </p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEF3F9]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(resultado.softMedia / 5) * 100}%`,
                  backgroundColor:
                    resultado.softMedia >= 4
                      ? '#4CAF35'
                      : resultado.softMedia >= 3
                        ? '#F59E0B'
                        : '#EF4444',
                }}
              />
            </div>
          </div>
        </div>

        {/* Fase Recomendada */}
        <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
          <div className="mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#1565C0]" />
            <h4 className="text-sm font-bold text-[#0F172A]">
              Fase Escolhida: {fasesRoteiro.find((f) => f.valor === resultado.faseEscolhida)?.label}
            </h4>
          </div>
          <p className="text-sm leading-relaxed text-[#334155]">
            {getFaseRecomendacao(resultado.faseEscolhida)}
          </p>
        </div>

        {/* Recomendacoes */}
        <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
          <h4 className="mb-3 text-sm font-bold text-[#0F172A]">
            Proximos Passos do Seu PDI
          </h4>
          <div className="space-y-2.5">
            {[
              {
                label: 'Dimensao Prioritaria',
                desc: `Foque na dimensao com menor pontuacao para equilibrar seu perfil de lideranca.`,
              },
              {
                label: 'Desenvolvimento de Skills',
                desc:
                  resultado.hardMedia < resultado.softMedia
                    ? 'Priorize Hard Skills: invista em treinamentos tecnicos e dominio de processos.'
                    : 'Priorize Soft Skills: invista em inteligencia emocional e comunicacao assertiva.',
              },
              {
                label: 'Roteiro Semanal',
                desc: 'Siga o roteiro de 12 semanas definido, revisando seu progresso a cada 4 semanas.',
              },
              {
                label: 'Tecnologia 4.0',
                desc: 'Aplique as ferramentas tecnologicas selecionadas no dia a dia para potencializar suas decisoes.',
              },
              {
                label: 'Mentoria Continua',
                desc: 'Agende conversas periodicas com seu mentor ou gestor para alinhar expectativas e medir evolucao.',
              },
            ].map((b) => (
              <div key={b.label} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1565C0]" />
                <p className="text-sm text-[#334155]">
                  <strong>{b.label}:</strong> {b.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-[#1565C0]/10 px-4 py-3 text-xs font-semibold text-[#1565C0]">
            Objetivo: Em 12 semanas, evoluir de supervisor operacional para um lider
            de valor com visao estrategica e equipe autonoma.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="mb-4 text-sm font-semibold italic text-[#64748B]">
            Seu Plano de Desenvolvimento Individual foi salvo. Compartilhe com
            seu gestor para alinhar expectativas e acompanhar sua evolucao.
          </p>
          <a
            href="https://wa.me/5564996099020?text=Ol%C3%A1%2C%20completei%20meu%20PDI%20e%20quero%20saber%20mais%20sobre%20o%20acompanhamento%20LIDERA!"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
          >
            Falar com Claudemir no WhatsApp
          </a>
        </div>
      </div>
    )
  }

  /* ═══════════════════════════════════════════
     STEP RENDERING
  ═══════════════════════════════════════════ */

  const currentStepConfig = stepConfig[step]
  const StepIcon = currentStepConfig.icon

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

      {/* Step Header */}
      <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1565C0]/10">
          <StepIcon className="h-5 w-5 text-[#1565C0]" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
          {currentStepConfig.subtitulo}
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#111827]">
          {currentStepConfig.titulo}
        </h2>
      </div>

      {/* ── Step 0: Identificacao ── */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Nome Completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={textos.nome || ''}
              onChange={(e) => updateTexto('nome', e.target.value)}
              placeholder="Seu nome completo"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Cargo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={textos.cargo || ''}
              onChange={(e) => updateTexto('cargo', e.target.value)}
              placeholder="Ex: Supervisor de Producao"
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#334155]">
                Tempo na Funcao
              </label>
              <input
                type="text"
                value={textos.tempoFuncao || ''}
                onChange={(e) => updateTexto('tempoFuncao', e.target.value)}
                placeholder="Ex: 2 anos e 6 meses"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#334155]">
                Departamento / Setor
              </label>
              <input
                type="text"
                value={textos.departamento || ''}
                onChange={(e) => updateTexto('departamento', e.target.value)}
                placeholder="Ex: Operacoes Industriais"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 1: 5 Dimensoes ── */}
      {step === 1 && (
        <div className="space-y-4">
          <p className="rounded-xl border border-[#E4EAF4] bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#111827]">
            Avalie-se de 1 a 5 em cada dimensao da lideranca:
          </p>
          {dimensoes.map((d) => {
            const DIcon = d.icon
            return (
              <div
                key={d.id}
                className="rounded-xl border border-[#E3EBF6] bg-white p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#1565C0]/10">
                    <DIcon className="h-4 w-4 text-[#1565C0]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#111827]">{d.label}</p>
                    <p className="text-xs text-[#64748B]">{d.descricao}</p>
                  </div>
                </div>
                <RatingScale
                  id={d.id}
                  value={respostas[d.id]}
                  onChange={selecionar}
                />
              </div>
            )
          })}
        </div>
      )}

      {/* ── Step 2: Hard Skills vs Soft Skills ── */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Hard Skills */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#1565C0]" />
              <h3 className="text-sm font-bold text-[#0F172A]">Hard Skills</h3>
            </div>
            <div className="space-y-3">
              {hardSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="rounded-xl border border-[#E3EBF6] bg-white p-4"
                >
                  <p className="mb-2 text-sm font-semibold text-[#334155]">
                    {sk.label}
                  </p>
                  <RatingScale
                    id={sk.id}
                    value={respostas[sk.id]}
                    onChange={selecionar}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#F57C00]" />
              <h3 className="text-sm font-bold text-[#0F172A]">Soft Skills</h3>
            </div>
            <div className="space-y-3">
              {softSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="rounded-xl border border-[#E3EBF6] bg-white p-4"
                >
                  <p className="mb-2 text-sm font-semibold text-[#334155]">
                    {sk.label}
                  </p>
                  <RatingScale
                    id={sk.id}
                    value={respostas[sk.id]}
                    onChange={selecionar}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 3: Roteiro de 12 Semanas ── */}
      {step === 3 && (
        <div className="space-y-5">
          <p className="rounded-xl border border-[#E4EAF4] bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#111827]">
            Selecione a fase que melhor representa seu foco atual:
          </p>

          {/* Radio Options */}
          <div className="space-y-3">
            {fasesRoteiro.map((fase) => {
              const selecionado = respostas['faseRoteiro'] === fase.valor
              return (
                <button
                  key={fase.valor}
                  type="button"
                  onClick={() => selecionar('faseRoteiro', fase.valor)}
                  className={`w-full rounded-xl border px-5 py-4 text-left transition-all ${
                    selecionado
                      ? 'border-[#1565C0] bg-[#EFF6FE] shadow-sm'
                      : 'border-[#E5E7EB] bg-white hover:border-[#BCD0EA] hover:bg-[#F8FAFD]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold text-white"
                      style={{
                        backgroundColor: selecionado ? '#1565C0' : '#CBD5E1',
                      }}
                    >
                      {fase.valor}
                    </span>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-bold ${selecionado ? 'text-[#111827]' : 'text-[#334155]'}`}
                      >
                        {fase.label}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">
                        {fase.descricao}
                      </p>
                    </div>
                    {selecionado && (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1565C0]" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Texto Aberto */}
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#334155]">
                O que eu mudarei no meu comportamento diario para que minha equipe
                se torne autonoma?
              </label>
              <textarea
                value={textos.comportamentoDiario || ''}
                onChange={(e) => updateTexto('comportamentoDiario', e.target.value)}
                placeholder="Descreva as mudancas que pretende implementar..."
                className={textareaClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#334155]">
                Como utilizarei analise de causa raiz e dados de IA para antecipar
                gargalos?
              </label>
              <textarea
                value={textos.analiseGargalos || ''}
                onChange={(e) => updateTexto('analiseGargalos', e.target.value)}
                placeholder="Descreva sua estrategia com dados e IA..."
                className={textareaClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#334155]">
                Qual acao estrategica de treinamento iniciarei hoje para preparar meu
                sucessor?
              </label>
              <textarea
                value={textos.acaoEstrategica || ''}
                onChange={(e) => updateTexto('acaoEstrategica', e.target.value)}
                placeholder="Descreva a acao que iniciara imediatamente..."
                className={textareaClass}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: Supervisor 4.0 e Tecnologia ── */}
      {step === 4 && (
        <div className="space-y-5">
          <p className="rounded-xl border border-[#E4EAF4] bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#111827]">
            Selecione as ferramentas e abordagens tecnologicas que voce ja utiliza
            ou pretende adotar:
          </p>

          {/* Checkboxes */}
          <div className="space-y-2">
            {tecnologiaItems.map((item) => {
              const checked = !!checkboxes[item.id]
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleCheckbox(item.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${
                    checked
                      ? 'border-[#1565C0] bg-[#EFF6FE]'
                      : 'border-[#E5E7EB] bg-white hover:border-[#BCD0EA] hover:bg-[#F8FAFD]'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                      checked
                        ? 'border-[#1565C0] bg-[#1565C0]'
                        : 'border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {checked && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold ${checked ? 'text-[#111827]' : 'text-[#334155]'}`}
                  >
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Texto Aberto */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Descreva uma decisao recente baseada em dados onde aplicou a Triade da
              Maestria
            </label>
            <textarea
              value={textos.decisaoBaseadaDados || ''}
              onChange={(e) => updateTexto('decisaoBaseadaDados', e.target.value)}
              placeholder="Contexto, dados utilizados e resultado obtido..."
              className={textareaClass}
            />
          </div>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Navegacao */}
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
            disabled={!isStepValid(step)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Proximo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isAllValid() || enviando}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F57C00]/20 transition-all hover:bg-[#E65100] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {enviando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando seu PDI...
              </>
            ) : (
              <>
                <Lightbulb className="h-4 w-4" />
                Finalizar meu PDI
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
