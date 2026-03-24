'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

type Resposta = {
  perguntaId: number
  valor: number
}

const perguntas = [
  {
    id: 1,
    categoria: 'Segurança na função',
    texto: 'Me sinto seguro(a) ao tomar decisões que impactam minha equipe.',
  },
  {
    id: 2,
    categoria: 'Segurança na função',
    texto: 'Consigo manter a calma e o foco quando surgem problemas inesperados.',
  },
  {
    id: 3,
    categoria: 'Relacionamento com a equipe',
    texto: 'Minha equipe me respeita como líder e segue minhas orientações.',
  },
  {
    id: 4,
    categoria: 'Relacionamento com a equipe',
    texto: 'Consigo lidar bem com conflitos entre membros da equipe.',
  },
  {
    id: 5,
    categoria: 'Relacionamento com a equipe',
    texto: 'Tenho facilidade para liderar pessoas que antes eram meus colegas de trabalho.',
  },
  {
    id: 6,
    categoria: 'Comunicação e postura',
    texto: 'Consigo me comunicar de forma clara e direta com minha equipe.',
  },
  {
    id: 7,
    categoria: 'Comunicação e postura',
    texto: 'Sei dar feedback negativo sem gerar ressentimento.',
  },
  {
    id: 8,
    categoria: 'Tomada de decisão',
    texto: 'Tomo decisões com agilidade, mesmo quando não tenho todas as informações.',
  },
  {
    id: 9,
    categoria: 'Tomada de decisão',
    texto: 'Sei delegar tarefas de forma adequada, sem centralizar tudo em mim.',
  },
  {
    id: 10,
    categoria: 'Gestão operacional',
    texto: 'Consigo identificar e corrigir falhas no processo antes que gerem retrabalho.',
  },
  {
    id: 11,
    categoria: 'Gestão operacional',
    texto: 'Minha equipe entrega resultados consistentes sem eu precisar cobrar o tempo todo.',
  },
  {
    id: 12,
    categoria: 'Desenvolvimento pessoal',
    texto: 'Busco aprender e me desenvolver continuamente como líder.',
  },
]

const escalaLabels: Record<number, string> = {
  1: 'Discordo totalmente',
  2: 'Discordo',
  3: 'Neutro',
  4: 'Concordo',
  5: 'Concordo totalmente',
}

type InfoState = {
  nome: string
  whatsapp: string
  empresa: string
  cargo: string
}

export default function AvaliacaoForm() {
  const [info, setInfo] = useState<InfoState>({ nome: '', whatsapp: '', empresa: '', cargo: '' })
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [etapa, setEtapa] = useState<'info' | 'avaliacao' | 'resultado'>('info')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<{ media: number; categorias: Record<string, number> } | null>(null)

  function handleInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setInfo((prev) => ({ ...prev, [name]: value }))
  }

  function handleResposta(perguntaId: number, valor: number) {
    setRespostas((prev) => {
      const existing = prev.findIndex((r) => r.perguntaId === perguntaId)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing] = { perguntaId, valor }
        return updated
      }
      return [...prev, { perguntaId, valor }]
    })
  }

  function getRespostaValor(perguntaId: number): number | undefined {
    return respostas.find((r) => r.perguntaId === perguntaId)?.valor
  }

  function calcularResultado() {
    const categorias: Record<string, number[]> = {}
    for (const pergunta of perguntas) {
      const resp = respostas.find((r) => r.perguntaId === pergunta.id)
      if (resp) {
        if (!categorias[pergunta.categoria]) categorias[pergunta.categoria] = []
        categorias[pergunta.categoria].push(resp.valor)
      }
    }

    const mediaCategorias: Record<string, number> = {}
    let total = 0
    let count = 0
    for (const [cat, valores] of Object.entries(categorias)) {
      const media = valores.reduce((a, b) => a + b, 0) / valores.length
      mediaCategorias[cat] = Math.round(media * 10) / 10
      total += valores.reduce((a, b) => a + b, 0)
      count += valores.length
    }

    return {
      media: count > 0 ? Math.round((total / count) * 10) / 10 : 0,
      categorias: mediaCategorias,
    }
  }

  function getNivelLabel(media: number): { label: string; cor: string; descricao: string } {
    if (media >= 4.0) return { label: 'Avançado', cor: '#4CAF35', descricao: 'Você demonstra maturidade na liderança. O treinamento vai potencializar seus pontos fortes.' }
    if (media >= 3.0) return { label: 'Intermediário', cor: '#F57C00', descricao: 'Você tem uma base boa, mas há pontos importantes para desenvolver. O treinamento vai direcionar sua evolução.' }
    return { label: 'Iniciante', cor: '#EF4444', descricao: 'Há oportunidades significativas de desenvolvimento. O treinamento é essencial para sua evolução na função.' }
  }

  async function handleSubmitAvaliacao(e: FormEvent) {
    e.preventDefault()
    if (respostas.length < perguntas.length || enviando) return

    setEnviando(true)
    setErro(null)

    const calc = calcularResultado()

    try {
      const response = await fetch('/api/treinamento/avaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...info,
          respostas,
          resultado: calc,
          treinamento: 'lideranca-abril-2026',
        }),
      })

      const data = (await response.json()) as { success?: boolean; error?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao enviar avaliação.')
      }

      setResultado(calc)
      setEtapa('resultado')
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado.')
    } finally {
      setEnviando(false)
    }
  }

  // ── ETAPA 1: INFO PESSOAL ──
  if (etapa === 'info') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white">Antes de começar</h3>
          <p className="mt-2 text-sm text-[#A9BDD8]">
            Preencha seus dados para que possamos montar seu PDI (Plano de Desenvolvimento Individual) após a avaliação.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#94A3B8]">Nome completo *</label>
            <input
              name="nome"
              value={info.nome}
              onChange={handleInfoChange}
              placeholder="Ex: João da Silva"
              className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#94A3B8]">WhatsApp *</label>
            <input
              name="whatsapp"
              value={info.whatsapp}
              onChange={handleInfoChange}
              placeholder="(64) 99999-9999"
              className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#94A3B8]">Empresa</label>
            <input
              name="empresa"
              value={info.empresa}
              onChange={handleInfoChange}
              placeholder="Nome da empresa"
              className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#94A3B8]">Cargo atual</label>
            <input
              name="cargo"
              value={info.cargo}
              onChange={handleInfoChange}
              placeholder="Ex: Supervisor de produção"
              className="rounded-xl border border-[#334155] bg-[#0B0F19] px-4 py-3 text-sm text-white placeholder:text-[#475569] transition-all focus:border-[#1E88E5] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/20"
            />
          </div>
        </div>

        <button
          onClick={() => {
            if (info.nome && info.whatsapp) setEtapa('avaliacao')
          }}
          disabled={!info.nome || !info.whatsapp}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#1E88E5]/20 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#1565C0]"
        >
          Iniciar avaliação
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    )
  }

  // ── ETAPA 3: RESULTADO ──
  if (etapa === 'resultado' && resultado) {
    const nivel = getNivelLabel(resultado.media)

    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white" style={{ backgroundColor: nivel.cor }}>
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="text-2xl font-bold text-white">Resultado da Avaliação</h3>
          <p className="mt-2 text-sm text-[#A9BDD8]">{info.nome}</p>
        </div>

        <div className="rounded-2xl border border-[#22314B] bg-[#0F1B30] p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#9CB4CF]">Nível geral</p>
          <p className="mt-2 text-4xl font-extrabold text-white">{resultado.media}<span className="text-lg text-[#9CB4CF]">/5.0</span></p>
          <p className="mt-2 text-base font-bold" style={{ color: nivel.cor }}>{nivel.label}</p>
          <p className="mt-3 text-sm leading-relaxed text-[#A9BDD8]">{nivel.descricao}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#9CB4CF]">Por categoria</p>
          {Object.entries(resultado.categorias).map(([cat, media]) => {
            const pct = (media / 5) * 100
            const catNivel = getNivelLabel(media)
            return (
              <div key={cat} className="rounded-xl border border-[#253B5A] bg-[#0F1B30] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{cat}</p>
                  <p className="text-sm font-bold" style={{ color: catNivel.cor }}>{media}/5.0</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1A2438]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: catNivel.cor }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-2xl border border-[#F57C00]/30 bg-[#F57C00]/10 p-6 text-center">
          <p className="text-sm font-bold text-[#F57C00]">Próximo passo</p>
          <p className="mt-2 text-sm leading-relaxed text-[#A9BDD8]">
            Com base nessa avaliação, o mentor Claudemir vai estruturar seu PDI (Plano de Desenvolvimento Individual) antes do treinamento.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/treinamento/lideranca-abril-2026/inscricao"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#E65100]"
            >
              Garantir minha vaga
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="https://wa.me/5564996099020"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#335077] px-6 py-3 text-sm font-bold text-[#D4E4F6] transition-colors hover:border-[#4F77AA] hover:text-white"
            >
              Falar com Claudemir
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── ETAPA 2: AVALIAÇÃO ──
  const categorias = [...new Set(perguntas.map((p) => p.categoria))]
  const todasRespondidas = respostas.length >= perguntas.length

  return (
    <form onSubmit={handleSubmitAvaliacao} className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white">Avaliação Diagnóstica</h3>
        <p className="mt-2 text-sm text-[#A9BDD8]">
          Responda cada afirmação de acordo com sua realidade atual. Seja honesto(a) — isso vai direcionar seu PDI.
        </p>
        <div className="mt-3 flex items-center gap-4">
          <p className="text-xs text-[#7FA0C2]">Progresso: {respostas.length}/{perguntas.length}</p>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1A2438]">
            <div
              className="h-full rounded-full bg-[#1E88E5] transition-all duration-300"
              style={{ width: `${(respostas.length / perguntas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {categorias.map((cat) => (
        <div key={cat} className="space-y-4">
          <h4 className="border-b border-[#1E2F49] pb-2 text-sm font-bold uppercase tracking-[0.12em] text-[#F57C00]">
            {cat}
          </h4>
          {perguntas
            .filter((p) => p.categoria === cat)
            .map((pergunta) => {
              const selecionado = getRespostaValor(pergunta.id)
              return (
                <div key={pergunta.id} className="rounded-xl border border-[#253B5A] bg-[#0F1B30] p-4">
                  <p className="mb-3 text-sm font-medium text-white">{pergunta.texto}</p>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((valor) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => handleResposta(pergunta.id, valor)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                          selecionado === valor
                            ? 'bg-[#1E88E5] text-white shadow-md shadow-[#1E88E5]/30'
                            : 'border border-[#334155] bg-[#0B0F19] text-[#9AB2CE] hover:border-[#1E88E5]/50 hover:text-white'
                        }`}
                        title={escalaLabels[valor]}
                      >
                        {valor}
                      </button>
                    ))}
                  </div>
                  {selecionado && (
                    <p className="mt-2 text-xs text-[#7FA0C2]">{escalaLabels[selecionado]}</p>
                  )}
                </div>
              )
            })}
        </div>
      ))}

      {erro ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {erro}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={!todasRespondidas || enviando}
        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E88E5] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#1E88E5]/20 transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#1565C0]"
      >
        {enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
        {enviando ? 'Processando...' : 'Ver resultado da avaliação'}
      </button>

      {!todasRespondidas && (
        <p className="text-center text-xs text-[#475569]">
          Responda todas as {perguntas.length} perguntas para ver seu resultado.
        </p>
      )}
    </form>
  )
}
