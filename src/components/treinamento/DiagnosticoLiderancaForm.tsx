'use client'

import { FormEvent, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Star,
  Users,
  Brain,
  Target,
  Rocket,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

type Identificacao = {
  nomeCompleto: string
  cargoAtual: string
  tempoFuncao: string
  departamento: string
}

type ReflexaoLideranca = {
  visaoTempo: string
  tomadaDecisao: string
  autonomiaTime: string
}

type DimensaoNota = {
  facilitador: number
  orientador: number
  garantidor: number
  estrategista: number
  mentor: number
}

type Maturidade40 = {
  usoDadosEstruturados: boolean
  promptsMagicos: boolean
  analiseCausaRaiz: boolean
  anonimizacaoDados: boolean
  padroesSuccesso: boolean
  soWhat: string
}

type GestaoEquipes = {
  eiaEvento: string
  eiaImpacto: string
  eiaAcao: string
  quadrante: {
    inicianteMotivado: { nome: string; perfil: string }
    estrela: { nome: string; perfil: string }
    questionador: { nome: string; perfil: string }
    problema: { nome: string; perfil: string }
  }
}

type PlanoAcao = {
  compromisso1: string
  compromisso2: string
  compromisso3: string
}

type DiagnosticoFormData = {
  identificacao: Identificacao
  reflexao: ReflexaoLideranca
  dimensoes: DimensaoNota
  maturidade: Maturidade40
  gestao: GestaoEquipes
  plano: PlanoAcao
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */

const STEPS = [
  { label: 'Identificação', icon: ClipboardCheck },
  { label: 'Reflexão', icon: Brain },
  { label: 'Autoavaliação', icon: Star },
  { label: 'Maturidade 4.0', icon: Target },
  { label: 'Equipes', icon: Users },
  { label: 'Plano de Ação', icon: Rocket },
]

const dimensoes = [
  {
    key: 'facilitador' as const,
    label: 'Facilitador',
    descricao: 'Elimina obstáculos e cria ambiente produtivo.',
    impacto: 'Burocracia excessiva, processos travados e desmotivação.',
  },
  {
    key: 'orientador' as const,
    label: 'Orientador',
    descricao: 'Desenvolve competências e promove aprendizado.',
    impacto: 'Dependência total do líder e estagnação técnica do time.',
  },
  {
    key: 'garantidor' as const,
    label: 'Garantidor',
    descricao: 'Assegura qualidade, segurança e ética (O Guardião).',
    impacto: 'Retrabalho, acidentes e riscos à integridade da marca.',
  },
  {
    key: 'estrategista' as const,
    label: 'Estrategista',
    descricao: 'Traduz metas em planos de ação concretos.',
    impacto: 'Reatividade, desperdício de recursos e falta de rumo.',
  },
  {
    key: 'mentor' as const,
    label: 'Mentor',
    descricao: 'Prepara sucessores e deixa um legado.',
    impacto: 'Vácuo de liderança e estagnação da carreira do próprio líder.',
  },
]

const corNota: Record<number, string> = {
  1: '#EF4444',
  2: '#F97316',
  3: '#F59E0B',
  4: '#1565C0',
  5: '#4CAF35',
}

const labelNota: Record<number, string> = {
  1: 'Muito baixo',
  2: 'Baixo',
  3: 'Intermediário',
  4: 'Bom',
  5: 'Excelente',
}

const perfilOptions = ['X', 'Y (Millennial)', 'Z']

const initialForm: DiagnosticoFormData = {
  identificacao: { nomeCompleto: '', cargoAtual: '', tempoFuncao: '', departamento: '' },
  reflexao: { visaoTempo: '', tomadaDecisao: '', autonomiaTime: '' },
  dimensoes: { facilitador: 0, orientador: 0, garantidor: 0, estrategista: 0, mentor: 0 },
  maturidade: {
    usoDadosEstruturados: false,
    promptsMagicos: false,
    analiseCausaRaiz: false,
    anonimizacaoDados: false,
    padroesSuccesso: false,
    soWhat: '',
  },
  gestao: {
    eiaEvento: '',
    eiaImpacto: '',
    eiaAcao: '',
    quadrante: {
      inicianteMotivado: { nome: '', perfil: '' },
      estrela: { nome: '', perfil: '' },
      questionador: { nome: '', perfil: '' },
      problema: { nome: '', perfil: '' },
    },
  },
  plano: { compromisso1: '', compromisso2: '', compromisso3: '' },
}

/* ─────────────────────────────────────────────
   Shared Styles
───────────────────────────────────────────── */

const inputClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20'

const textareaClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 min-h-[100px] resize-y'

const labelClass = 'text-sm font-semibold text-[#334155]'

const sectionTitleClass = 'text-xl font-extrabold text-[#0F172A]'

const sectionDescClass = 'mt-1 text-sm leading-relaxed text-[#64748B]'

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

export default function DiagnosticoLiderancaForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<DiagnosticoFormData>(initialForm)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [sucesso, setSucesso] = useState(false)

  const totalSteps = STEPS.length
  const progressoVisual = Math.round(((step + 1) / totalSteps) * 100)

  /* ── Helpers ── */

  function updateIdentificacao(field: keyof Identificacao, value: string) {
    setForm((prev) => ({ ...prev, identificacao: { ...prev.identificacao, [field]: value } }))
  }

  function updateReflexao(field: keyof ReflexaoLideranca, value: string) {
    setForm((prev) => ({ ...prev, reflexao: { ...prev.reflexao, [field]: value } }))
  }

  function updateDimensao(key: keyof DimensaoNota, nota: number) {
    setForm((prev) => ({ ...prev, dimensoes: { ...prev.dimensoes, [key]: nota } }))
  }

  function updateMaturidade(field: string, value: boolean | string) {
    setForm((prev) => ({ ...prev, maturidade: { ...prev.maturidade, [field]: value } }))
  }

  function updateGestao(field: keyof GestaoEquipes, value: string) {
    setForm((prev) => ({ ...prev, gestao: { ...prev.gestao, [field]: value } }))
  }

  function updateQuadrante(quadrante: keyof GestaoEquipes['quadrante'], field: 'nome' | 'perfil', value: string) {
    setForm((prev) => ({
      ...prev,
      gestao: {
        ...prev.gestao,
        quadrante: {
          ...prev.gestao.quadrante,
          [quadrante]: { ...prev.gestao.quadrante[quadrante], [field]: value },
        },
      },
    }))
  }

  function updatePlano(field: keyof PlanoAcao, value: string) {
    setForm((prev) => ({ ...prev, plano: { ...prev.plano, [field]: value } }))
  }

  /* ── Validação por step ── */

  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return !!form.identificacao.nomeCompleto && !!form.identificacao.cargoAtual
      case 1:
        return !!form.reflexao.visaoTempo && !!form.reflexao.tomadaDecisao && !!form.reflexao.autonomiaTime
      case 2:
        return Object.values(form.dimensoes).every((v) => v > 0)
      case 3:
        return !!form.maturidade.soWhat
      case 4:
        return !!form.gestao.eiaEvento && !!form.gestao.eiaImpacto && !!form.gestao.eiaAcao
      case 5:
        return !!form.plano.compromisso1 && !!form.plano.compromisso2 && !!form.plano.compromisso3
      default:
        return false
    }
  }, [step, form])

  /* ── Navigation ── */

  function avancar() {
    setErro(null)
    if (step < totalSteps - 1) setStep((s) => s + 1)
  }

  function voltar() {
    setErro(null)
    if (step > 0) setStep((s) => s - 1)
  }

  /* ── Submit ── */

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (enviando) return

    setEnviando(true)
    setErro(null)

    try {
      const response = await fetch('/api/treinamento/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao enviar diagnóstico.')
      }

      setSucesso(true)
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado ao enviar diagnóstico.')
    } finally {
      setEnviando(false)
    }
  }

  /* ── Success State ── */

  if (sucesso) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[#4CAF35]/30 bg-[#4CAF35]/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#4CAF35] text-white">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-[#0F172A]">Diagnóstico enviado com sucesso!</h3>
        <p className="mt-3 text-sm leading-relaxed text-[#64748B]">
          Seu diagnóstico de liderança estratégica foi registrado. O mentor Claudemir entrará em contato
          para agendar a 1a sessão de mentoria e alinhar os próximos passos do seu plano de desenvolvimento.
        </p>
        <a
          href="https://wa.me/5564996099020"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
        >
          Falar com Claudemir no WhatsApp
        </a>
      </div>
    )
  }

  /* ── Render Steps ── */

  function renderStep() {
    switch (step) {
      case 0:
        return renderIdentificacao()
      case 1:
        return renderReflexao()
      case 2:
        return renderAutoavaliacao()
      case 3:
        return renderMaturidade()
      case 4:
        return renderGestaoEquipes()
      case 5:
        return renderPlanoAcao()
      default:
        return null
    }
  }

  /* ── Step 1: Identificação ── */

  function renderIdentificacao() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={sectionTitleClass}>Identificação e Contexto Estratégico</h2>
          <p className={sectionDescClass}>
            A evolução do papel de Líder Operacional para Líder Estratégico exige o abandono de vícios reativos
            em favor de uma visão de futuro.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Nome Completo *</label>
            <input
              value={form.identificacao.nomeCompleto}
              onChange={(e) => updateIdentificacao('nomeCompleto', e.target.value)}
              placeholder="Ex: João da Silva"
              className={inputClass}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Cargo Atual *</label>
            <input
              value={form.identificacao.cargoAtual}
              onChange={(e) => updateIdentificacao('cargoAtual', e.target.value)}
              placeholder="Ex: Supervisor de Produção"
              className={inputClass}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Tempo na Função</label>
            <input
              value={form.identificacao.tempoFuncao}
              onChange={(e) => updateIdentificacao('tempoFuncao', e.target.value)}
              placeholder="Ex: 2 anos e 6 meses"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Departamento / Setor</label>
            <input
              value={form.identificacao.departamento}
              onChange={(e) => updateIdentificacao('departamento', e.target.value)}
              placeholder="Ex: Produção Industrial"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    )
  }

  /* ── Step 2: Reflexão de Liderança ── */

  function renderReflexao() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={sectionTitleClass}>Reflexão de Papel: Líder Operacional vs. Estratégico</h2>
          <p className={sectionDescClass}>
            A evolução do papel exige o abandono de vícios reativos em favor de uma visão de futuro.
            Reflita com sinceridade sobre cada aspecto.
          </p>
        </div>

        <div className="space-y-5">
          <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">Questão 1</p>
            <label className={labelClass}>
              Visão e Tempo: Você gasta a maior parte do seu dia &quot;apagando incêndios&quot; ou consegue planejar
              o futuro enquanto o presente acontece? Cite um exemplo. *
            </label>
            <textarea
              value={form.reflexao.visaoTempo}
              onChange={(e) => updateReflexao('visaoTempo', e.target.value)}
              placeholder="Descreva como você divide seu tempo entre operação e planejamento..."
              className={`mt-3 ${textareaClass}`}
              required
            />
          </div>

          <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">Questão 2</p>
            <label className={labelClass}>
              Tomada de Decisão: Suas decisões são reativas ou baseadas em análise de dados e visão sistêmica?
              Explique como decidiu sobre o último problema crítico. *
            </label>
            <textarea
              value={form.reflexao.tomadaDecisao}
              onChange={(e) => updateReflexao('tomadaDecisao', e.target.value)}
              placeholder="Descreva o problema e como você tomou a decisão..."
              className={`mt-3 ${textareaClass}`}
              required
            />
          </div>

          <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
            <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">Questão 3</p>
            <label className={labelClass}>
              Autonomia do Time: Você centraliza tarefas ou criou processos que permitem confiar na execução
              autônoma da equipe? *
            </label>
            <textarea
              value={form.reflexao.autonomiaTime}
              onChange={(e) => updateReflexao('autonomiaTime', e.target.value)}
              placeholder="Descreva como funciona a autonomia da sua equipe..."
              className={`mt-3 ${textareaClass}`}
              required
            />
          </div>
        </div>
      </div>
    )
  }

  /* ── Step 3: Autoavaliação 5 Dimensões ── */

  function renderAutoavaliacao() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className={sectionTitleClass}>As 5 Dimensões da Liderança Estratégica</h2>
          <p className={sectionDescClass}>
            O equilíbrio entre as dimensões abaixo diferencia o &quot;bom técnico&quot; do &quot;líder de alta performance&quot;.
            Avalie-se de 1 a 5 em cada dimensão.
          </p>
        </div>

        <div className="space-y-4">
          {dimensoes.map((dim) => {
            const notaAtual = form.dimensoes[dim.key]

            return (
              <div key={dim.key} className="rounded-xl border border-[#E3EBF6] bg-white p-5">
                <div className="mb-1 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A]">{dim.label}</h3>
                    <p className="mt-0.5 text-xs text-[#64748B]">{dim.descricao}</p>
                  </div>
                  {notaAtual > 0 && (
                    <span
                      className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold text-white"
                      style={{ backgroundColor: corNota[notaAtual] }}
                    >
                      {labelNota[notaAtual]}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  {[1, 2, 3, 4, 5].map((nota) => {
                    const selecionado = notaAtual === nota
                    return (
                      <button
                        key={nota}
                        type="button"
                        onClick={() => updateDimensao(dim.key, nota)}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-all ${
                          selecionado
                            ? 'text-white shadow-md'
                            : 'border border-[#E3EBF6] bg-[#F8FAFD] text-[#64748B] hover:border-[#1565C0] hover:text-[#1565C0]'
                        }`}
                        style={selecionado ? { backgroundColor: corNota[nota] } : undefined}
                      >
                        {nota}
                      </button>
                    )
                  })}
                </div>

                {notaAtual > 0 && notaAtual <= 2 && (
                  <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                    <strong>Impacto:</strong> {dim.impacto}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* ── Step 4: Maturidade 4.0 ── */

  function renderMaturidade() {
    const checklistItems: { key: keyof Omit<Maturidade40, 'soWhat'>; label: string }[] = [
      { key: 'usoDadosEstruturados', label: 'Uso de Dados Estruturados: Analiso ERP/Excel para correlação de variáveis.' },
      { key: 'promptsMagicos', label: 'Prompts Mágicos: Utilizo IA (Contexto + Dados + Objetivo) para soluções táticas.' },
      { key: 'analiseCausaRaiz', label: 'Análise de Causa Raiz: Identifico se a falha é Humana, de Máquina ou de Processo.' },
      { key: 'anonimizacaoDados', label: 'Anonimização de Dados: Removo nomes e dados sensíveis antes de análises em IA.' },
      { key: 'padroesSuccesso', label: 'Padrões de Sucesso: Transformo resultados positivos em procedimentos replicáveis.' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h2 className={sectionTitleClass}>Maturidade 4.0: O Supervisor Cientista</h2>
          <p className={sectionDescClass}>
            No modelo de Operações 4.0, o valor migra do &quot;fazer o gráfico&quot; para o &quot;saber o que fazer com a informação&quot;.
            O Supervisor Cientista utiliza a Tríade da Maestria: Reconhecimento, Criação e Utilização.
          </p>
        </div>

        <div className="rounded-xl border border-[#E3EBF6] bg-white p-5">
          <p className="mb-3 text-sm font-bold text-[#0F172A]">Checklist de Competências Técnicas e Segurança</p>
          <div className="space-y-3">
            {checklistItems.map((item) => (
              <label
                key={item.key}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#E3EBF6] px-4 py-3 transition-all hover:border-[#1565C0]/30 hover:bg-[#F8FAFD]"
              >
                <input
                  type="checkbox"
                  checked={form.maturidade[item.key] as boolean}
                  onChange={(e) => updateMaturidade(item.key, e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] text-[#1565C0] accent-[#1565C0]"
                />
                <span className="text-sm text-[#334155]">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
            O &quot;So What?&quot; (Impacto Real)
          </p>
          <label className={labelClass}>
            Descreva uma decisão recente baseada em 70% de dados onde você aplicou a Tríade da Maestria
            para gerar um ganho de produtividade ou redução de erros: *
          </label>
          <textarea
            value={form.maturidade.soWhat}
            onChange={(e) => updateMaturidade('soWhat', e.target.value)}
            placeholder="Descreva a situação, os dados utilizados e o resultado obtido..."
            className={`mt-3 ${textareaClass}`}
            required
          />
        </div>
      </div>
    )
  }

  /* ── Step 5: Gestão de Equipes ── */

  function renderGestaoEquipes() {
    const quadrantes: { key: keyof GestaoEquipes['quadrante']; label: string; acao: string }[] = [
      { key: 'inicianteMotivado', label: 'Iniciante Motivado', acao: 'Direcionar (Mentoria Técnica)' },
      { key: 'estrela', label: 'O Estrela', acao: 'Delegar (Desafios Estratégicos)' },
      { key: 'questionador', label: 'O Questionador', acao: 'Apoiar (Feedback Comportamental)' },
      { key: 'problema', label: 'O Problema', acao: 'Treinar ou Substituir' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h2 className={sectionTitleClass}>Gestão de Equipes e Inteligência Comportamental</h2>
          <p className={sectionDescClass}>
            A transição do Supervisor Autoritário para o Supervisor Coach aumenta o engajamento em 79%
            e reduz o burnout. Aplique a Estrutura E.I.A. com neutralidade e escuta ativa.
          </p>
        </div>

        {/* E.I.A. */}
        <div className="rounded-xl border border-[#E3EBF6] bg-white p-5">
          <p className="mb-4 text-sm font-bold text-[#0F172A]">
            Estrutura E.I.A. (Evento, Impacto, Ação)
          </p>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Evento (Fato sem julgamento) *</label>
              <textarea
                value={form.gestao.eiaEvento}
                onChange={(e) => updateGestao('eiaEvento', e.target.value)}
                placeholder="Descreva o fato objetivamente, sem julgamentos..."
                className={textareaClass}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Impacto (Consequência no resultado/clima) *</label>
              <textarea
                value={form.gestao.eiaImpacto}
                onChange={(e) => updateGestao('eiaImpacto', e.target.value)}
                placeholder="Qual foi o impacto desse evento no resultado ou no clima?"
                className={textareaClass}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Ação (Sugestão de futuro/solução) *</label>
              <textarea
                value={form.gestao.eiaAcao}
                onChange={(e) => updateGestao('eiaAcao', e.target.value)}
                placeholder="Que ação futura ou solução você propõe?"
                className={textareaClass}
                required
              />
            </div>
          </div>
        </div>

        {/* Quadrante de Talentos */}
        <div className="rounded-xl border border-[#E3EBF6] bg-white p-5">
          <p className="mb-1 text-sm font-bold text-[#0F172A]">
            Engenharia de Equipes e Diversidade Geracional
          </p>
          <p className="mb-4 text-xs text-[#64748B]">
            Mapeie seus talentos considerando as necessidades das Gerações X, Y e Z.
          </p>

          <div className="space-y-4">
            {quadrantes.map((q) => (
              <div
                key={q.key}
                className="rounded-lg border border-[#E3EBF6] bg-[#F8FAFD] p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-[#0F172A]">{q.label}</p>
                  <span className="rounded-md bg-[#1565C0]/10 px-2 py-0.5 text-[11px] font-semibold text-[#1565C0]">
                    {q.acao}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    value={form.gestao.quadrante[q.key].nome}
                    onChange={(e) => updateQuadrante(q.key, 'nome', e.target.value)}
                    placeholder="Nome do colaborador"
                    className={inputClass}
                  />
                  <select
                    value={form.gestao.quadrante[q.key].perfil}
                    onChange={(e) => updateQuadrante(q.key, 'perfil', e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Perfil Geracional</option>
                    {perfilOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  /* ── Step 6: Plano de Ação ── */

  function renderPlanoAcao() {
    const fases = [
      { fase: '1. Comportamental', periodo: 'Semanas 1-4', foco: 'Escuta Ativa, Confiança e Ética', ferramenta: 'Tribunal das Virtudes' },
      { fase: '2. Processual', periodo: 'Semanas 5-8', foco: 'Otimização e Padronização', ferramenta: 'Tríade da Maestria' },
      { fase: '3. Estratégico', periodo: 'Semanas 9-12', foco: 'Inovação e Sucessão', ferramenta: 'Mentoria Reversa (Z ensina X)' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h2 className={sectionTitleClass}>Plano de Ação: Roteiro de 12 Semanas</h2>
          <p className={sectionDescClass}>
            Para vencer a &quot;Curva do Esquecimento&quot;, este roteiro foca em resultados mensuráveis
            com acompanhamento high-touch.
          </p>
        </div>

        {/* Tabela de Fases */}
        <div className="overflow-hidden rounded-xl border border-[#E3EBF6]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#F8FAFD]">
                <th className="px-4 py-3 font-bold text-[#334155]">Fase</th>
                <th className="px-4 py-3 font-bold text-[#334155]">Período</th>
                <th className="hidden px-4 py-3 font-bold text-[#334155] sm:table-cell">Foco</th>
                <th className="hidden px-4 py-3 font-bold text-[#334155] md:table-cell">Ferramenta</th>
              </tr>
            </thead>
            <tbody>
              {fases.map((f, i) => (
                <tr key={i} className={i < fases.length - 1 ? 'border-b border-[#E3EBF6]' : ''}>
                  <td className="px-4 py-3 font-semibold text-[#0F172A]">{f.fase}</td>
                  <td className="px-4 py-3 text-[#64748B]">{f.periodo}</td>
                  <td className="hidden px-4 py-3 text-[#64748B] sm:table-cell">{f.foco}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="rounded-md bg-[#1565C0]/10 px-2 py-0.5 text-xs font-semibold text-[#1565C0]">
                      {f.ferramenta}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Compromissos */}
        <div className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
          <p className="mb-4 text-sm font-bold text-[#0F172A]">Compromisso de Autocoaching</p>

          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                1. O que eu mudarei no meu comportamento diário para que minha equipe se torne
                autônoma e reduza minha sobrecarga operacional? *
              </label>
              <textarea
                value={form.plano.compromisso1}
                onChange={(e) => updatePlano('compromisso1', e.target.value)}
                placeholder="Descreva a mudança que você se compromete a fazer..."
                className={textareaClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                2. Como utilizarei a análise de causa raiz e dados de IA para antecipar gargalos
                e mitigar a ociosidade do setor? *
              </label>
              <textarea
                value={form.plano.compromisso2}
                onChange={(e) => updatePlano('compromisso2', e.target.value)}
                placeholder="Descreva como pretende usar dados e IA..."
                className={textareaClass}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                3. Qual ação estratégica de treinamento iniciarei hoje para preparar meu sucessor
                e viabilizar meu crescimento para o nível Sênior? *
              </label>
              <textarea
                value={form.plano.compromisso3}
                onChange={(e) => updatePlano('compromisso3', e.target.value)}
                placeholder="Descreva a ação de treinamento e sucessão..."
                className={textareaClass}
                required
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Main Render ── */

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress */}
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {(() => {
              const StepIcon = STEPS[step].icon
              return <StepIcon className="h-4 w-4 text-[#1565C0]" />
            })()}
            <p className="text-sm font-bold text-[#64748B]">
              {STEPS[step].label} — Etapa {step + 1} de {totalSteps}
            </p>
          </div>
          <p className="text-sm font-bold text-[#1565C0]">{progressoVisual}%</p>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div
            className="h-full rounded-full bg-[#1565C0] transition-all duration-500"
            style={{ width: `${progressoVisual}%` }}
          />
        </div>
        {/* Step indicators */}
        <div className="mt-3 flex gap-1">
          {STEPS.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? 'bg-[#1565C0]' : 'bg-[#E3EBF6]'
              }`}
              title={s.label}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Error */}
      {erro && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      {/* Navigation */}
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
            disabled={!stepValid}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1565C0] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0D47A1] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!stepValid || enviando}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F57C00]/20 transition-all hover:bg-[#E65100] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {enviando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Enviar Diagnóstico
              </>
            )}
          </button>
        )}
      </div>
    </form>
  )
}
