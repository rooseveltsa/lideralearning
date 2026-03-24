'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Target,
  Users,
  MessageCircle,
  BarChart3,
  Shield,
  AlertTriangle,
  Trophy,
} from 'lucide-react'

/* ─────────────────────────────────────────────
   Types
───────────────────────────────────────────── */

type UserProfile = {
  id: string
  fullName: string
  email: string
}

type Questao = {
  id: string
  numero: number
  titulo: string
  subtitulo: string
  pergunta: string
  icon: typeof Target
  opcoes: { valor: number; label: string; descricao: string }[]
  campoTexto?: { label: string; placeholder: string; key: string }[]
}

type Respostas = Record<string, number>
type TextosAbertos = Record<string, string>

/* ─────────────────────────────────────────────
   Questões do Formulário
───────────────────────────────────────────── */

const questoes: Questao[] = [
  {
    id: 'percepcao',
    numero: 2,
    titulo: 'Percepção da Sua Função',
    subtitulo: 'O Elo',
    pergunta: 'No seu dia a dia, qual é a sua principal forma de atuação hoje?',
    icon: Target,
    opcoes: [
      {
        valor: 1,
        label: 'Supervisor Júnior',
        descricao:
          'Frequentemente me vejo apagando incêndios técnicos e, por vezes, realizo tarefas que poderiam ser delegadas à equipe para evitar atrasos.',
      },
      {
        valor: 2,
        label: 'Supervisor Pleno',
        descricao:
          'Consigo acompanhar indicadores e processos, mas ainda encontro dificuldades em delegar tarefas sem sentir que perco o controle.',
      },
      {
        valor: 3,
        label: 'Supervisor Sênior (Líder de Valor)',
        descricao:
          'Meu foco está em formar sucessores e antecipar proativamente problemas, visando evitar interrupções na operação.',
      },
    ],
  },
  {
    id: 'gestao',
    numero: 3,
    titulo: 'Gestão de Equipes',
    subtitulo: 'Matriz de Competência',
    pergunta: 'Qual você considera ser o maior desafio da sua equipe atualmente?',
    icon: Users,
    opcoes: [
      {
        valor: 1,
        label: 'Falta de Capacitação',
        descricao:
          'Tenho pessoas motivadas, mas com baixa competência técnica, resultando em erros por falta de treinamento.',
      },
      {
        valor: 2,
        label: 'Falta de Engajamento',
        descricao:
          'Possuo técnicos competentes, porém desmotivados ou resistentes a mudanças e novas abordagens.',
      },
      {
        valor: 3,
        label: 'Sobrecarga do Líder',
        descricao:
          'Sou a única pessoa capaz de resolver problemas críticos, o que me leva a uma constante sobrecarga de trabalho.',
      },
    ],
  },
  {
    id: 'comunicacao',
    numero: 4,
    titulo: 'Comunicação e Postura',
    subtitulo: 'A Face do Líder',
    pergunta:
      'Como você avalia sua capacidade de fornecer feedback assertivo (comunicar a verdade com respeito, clareza e base em fatos)?',
    icon: MessageCircle,
    opcoes: [
      {
        valor: 1,
        label: 'Evito Conflitos',
        descricao:
          'Tenho dificuldade em abordar questões delicadas e, consequentemente, deixo passar comportamentos inadequados.',
      },
      {
        valor: 2,
        label: 'Comunicação Direta',
        descricao:
          'Falo o que é necessário, mas percebo que a equipe pode reagir de forma defensiva ou desmotivada.',
      },
      {
        valor: 3,
        label: 'Feedback Construtivo',
        descricao:
          'Sou capaz de corrigir comportamentos de forma eficaz, mantendo o respeito, a clareza e o engajamento da pessoa.',
      },
    ],
  },
  {
    id: 'tecnologia',
    numero: 5,
    titulo: 'Tecnologia, Dados e KPIs',
    subtitulo: 'Supervisor 4.0',
    pergunta: 'Qual é a sua relação com indicadores de desempenho (KPIs) e tecnologia?',
    icon: BarChart3,
    opcoes: [
      {
        valor: 1,
        label: 'Reativo (Análise Retrospectiva)',
        descricao:
          'Somente identifico problemas ao final do mês ou quando sou cobrado pela gerência.',
      },
      {
        valor: 2,
        label: 'Ativo (Orientação Proativa)',
        descricao:
          'Acompanho os números diariamente e realizo ajustes nos processos assim que detecto desvios, agindo de forma preventiva.',
      },
      {
        valor: 3,
        label: 'Inovador',
        descricao:
          'Já utilizo ou tenho grande interesse em aprender a aplicar Inteligência Artificial e análise de dados para otimizar tarefas rotineiras e antecipar falhas.',
      },
    ],
  },
  {
    id: 'etica',
    numero: 6,
    titulo: 'Alicerce Ético',
    subtitulo: 'Integridade na Prática',
    pergunta:
      'Se um dos seus operadores de melhor desempenho cometesse um erro grave, qual seria sua reação?',
    icon: Shield,
    opcoes: [
      {
        valor: 1,
        label: 'Ignorar',
        descricao: 'Optaria por não intervir para não prejudicar a meta de produção do dia.',
      },
      {
        valor: 3,
        label: 'Agir com Integridade',
        descricao:
          'Aplicaria a correção necessária, pois o exemplo e a ética são mais valiosos do que o cumprimento de metas de curto prazo.',
      },
    ],
  },
  {
    id: 'dor',
    numero: 7,
    titulo: 'Dor Atual e Expectativa',
    subtitulo: 'Autoconhecimento',
    pergunta: 'Como você avalia sua clareza e urgência em relação ao seu principal desafio?',
    icon: AlertTriangle,
    campoTexto: [
      {
        label: 'Qual situação hoje mais gera estresse no seu trabalho?',
        placeholder: 'Descreva brevemente...',
        key: 'dorAtual',
      },
      {
        label: 'Se essa situação persistir pelos próximos 90 dias, qual será o custo para você?',
        placeholder: 'Em termos de tempo, imagem, saúde, resultados...',
        key: 'custoFuturo',
      },
    ],
    opcoes: [
      {
        valor: 1,
        label: 'Não sei exatamente como resolver',
        descricao: 'Sinto-me perdido quanto aos próximos passos.',
      },
      {
        valor: 2,
        label: 'Sei o problema, mas não sei por onde começar',
        descricao: 'Tenho clareza do desafio, mas não da solução.',
      },
      {
        valor: 3,
        label: 'Sei o que precisa mudar e quero agir agora',
        descricao: 'Estou pronto para implementar as mudanças necessárias.',
      },
    ],
  },
]

/* ─────────────────────────────────────────────
   Perfis de Resultado
───────────────────────────────────────────── */

function getPerfil(pontos: number) {
  if (pontos <= 10)
    return {
      faixa: '7 a 10 pontos',
      titulo: 'Supervisor Reativo (Apagador de Incêndios)',
      cor: '#EF4444',
      bgCor: '#FEF2F2',
      borderCor: '#FECACA',
      descricao:
        'Você é essencial para a operação, mas arca com um alto custo em estresse e sobrecarga. O maior risco é se tornar um gargalo permanente na equipe.',
    }
  if (pontos <= 15)
    return {
      faixa: '11 a 15 pontos',
      titulo: 'Supervisor Técnico em Transição',
      cor: '#F59E0B',
      bgCor: '#FFFBEB',
      borderCor: '#FDE68A',
      descricao:
        'Você já compreende processos e indicadores, mas ainda depende excessivamente de si mesmo. Seu desafio é evoluir para um papel de liderança, em vez de permanecer apenas como especialista técnico.',
    }
  return {
    faixa: '16 a 21 pontos',
    titulo: 'Líder de Valor em Formação',
    cor: '#4CAF35',
    bgCor: '#F0FDF4',
    borderCor: '#BBF7D0',
    descricao:
      'Você já demonstra uma mentalidade de liderança, mas necessita de métodos, ferramentas e uma visão sistêmica para consolidar seu papel e escalar resultados de forma consistente.',
  }
}

/* ─────────────────────────────────────────────
   Shared Styles
───────────────────────────────────────────── */

const textareaClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20 min-h-[80px] resize-y'

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */

type Props = {
  user: UserProfile
}

export default function AutoavaliacaoLiderForm({ user }: Props) {
  const [step, setStep] = useState(0)
  const [respostas, setRespostas] = useState<Respostas>({})
  const [textos, setTextos] = useState<TextosAbertos>({})
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [resultado, setResultado] = useState<{
    pontos: number
    diagnosticoId: string
  } | null>(null)

  const totalSteps = questoes.length
  const isResultado = resultado !== null
  const questaoAtual = !isResultado ? questoes[step] : null
  const respostaSelecionada = questaoAtual ? respostas[questaoAtual.id] : undefined
  const progressoVisual = Math.round(((step + 1) / totalSteps) * 100)
  const todasRespondidas = questoes.every((q) => respostas[q.id] !== undefined)

  function selecionar(questaoId: string, valor: number) {
    setRespostas((prev) => ({ ...prev, [questaoId]: valor }))
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

  async function handleSubmit() {
    if (!todasRespondidas || enviando) return

    setEnviando(true)
    setErro(null)

    const pontos = Object.values(respostas).reduce((acc, v) => acc + v, 0)

    try {
      const response = await fetch('/api/treinamento/autoavaliacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          userName: user.fullName,
          respostas,
          textos,
          pontuacaoTotal: pontos,
        }),
      })

      const data = (await response.json()) as { success?: boolean; error?: string; diagnosticoId?: string }

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao enviar autoavaliação.')
      }

      setResultado({ pontos, diagnosticoId: data.diagnosticoId || '' })
    } catch (error: unknown) {
      setErro(error instanceof Error ? error.message : 'Erro inesperado.')
    } finally {
      setEnviando(false)
    }
  }

  /* ── Resultado Final ── */

  if (isResultado) {
    const perfil = getPerfil(resultado.pontos)
    const beneficios = [
      { label: 'Delegação Estruturada', desc: 'Técnicas para delegar com eficácia, sem perda de controle.' },
      { label: 'Feedback Assertivo', desc: 'Estratégias para fornecer feedback construtivo sem gerar resistência.' },
      { label: 'Uso de Indicadores', desc: 'Aplicação prática de KPIs para antecipar falhas e otimizar a operação.' },
      { label: 'Formação de Sucessores', desc: 'Desenvolvimento de talentos para reduzir a dependência do líder.' },
      { label: 'Tecnologia e IA', desc: 'Introdução prática à IA aplicada à gestão e operação.' },
    ]

    return (
      <div className="space-y-6">
        {/* Score */}
        <div className="text-center">
          <div
            className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{ backgroundColor: perfil.bgCor, border: `2px solid ${perfil.borderCor}` }}
          >
            <Trophy className="h-9 w-9" style={{ color: perfil.cor }} />
          </div>
          <p className="text-sm font-bold text-[#64748B]">Sua Pontuação</p>
          <p className="text-4xl font-extrabold text-[#0F172A]">
            {resultado.pontos} <span className="text-lg font-bold text-[#94A3B8]">/ 21</span>
          </p>
        </div>

        {/* Perfil */}
        <div
          className="rounded-2xl border p-6"
          style={{ backgroundColor: perfil.bgCor, borderColor: perfil.borderCor }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: perfil.cor }}>
            {perfil.faixa}
          </p>
          <h3 className="mt-1 text-xl font-extrabold text-[#0F172A]">{perfil.titulo}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#334155]">{perfil.descricao}</p>
        </div>

        {/* Detalhe por questão */}
        <div className="overflow-hidden rounded-2xl border border-[#E3EBF6] bg-white">
          {questoes.map((q, i) => {
            const nota = respostas[q.id] ?? 0
            const max = Math.max(...q.opcoes.map((o) => o.valor))
            const pct = (nota / max) * 100
            const opcaoEscolhida = q.opcoes.find((o) => o.valor === nota)

            return (
              <div
                key={q.id}
                className={`px-5 py-4 ${i < questoes.length - 1 ? 'border-b border-[#E5E7EB]' : ''}`}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-[#111827]">{q.titulo}</p>
                  <span className="text-sm font-bold" style={{ color: nota >= 3 ? '#4CAF35' : nota >= 2 ? '#F59E0B' : '#EF4444' }}>
                    {nota} pt{nota !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-[#EEF3F9]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: nota >= 3 ? '#4CAF35' : nota >= 2 ? '#F59E0B' : '#EF4444',
                    }}
                  />
                </div>
                <p className="text-xs text-[#64748B]">{opcaoEscolhida?.label}</p>
              </div>
            )
          })}
        </div>

        {/* Como o treinamento ajuda */}
        <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
          <h4 className="mb-3 text-sm font-bold text-[#0F172A]">
            Como o Treinamento LIDERA Atua Neste Diagnóstico
          </h4>
          <div className="space-y-2.5">
            {beneficios.map((b) => (
              <div key={b.label} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1565C0]" />
                <p className="text-sm text-[#334155]">
                  <strong>{b.label}:</strong> {b.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-[#1565C0]/10 px-4 py-3 text-xs font-semibold text-[#1565C0]">
            Objetivo: Em até 90 dias, transformar o modo de &quot;sobrevivência&quot; em uma liderança
            previsível e respeitada.
          </p>
        </div>

        {/* CTA - Ver PDI */}
        <div className="rounded-2xl border border-[#7B1FA2]/20 bg-[#F3E5F5] p-6 text-center">
          <h4 className="text-base font-extrabold text-[#7B1FA2]">
            Seu PDI foi gerado automaticamente!
          </h4>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#64748B]">
            Com base nas suas respostas, geramos seu Plano de Desenvolvimento Individual
            com recomendações personalizadas e um roteiro de 12 semanas.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/treinamento/pdi"
              className="inline-flex items-center gap-2 rounded-xl bg-[#7B1FA2] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#6A1B9A]"
            >
              <Trophy className="h-4 w-4" />
              Ver meu PDI completo
            </a>
            <a
              href="https://wa.me/5564996099020?text=Ol%C3%A1%2C%20fiz%20a%20autoavalia%C3%A7%C3%A3o%20e%20quero%20saber%20mais%20sobre%20o%20treinamento%20LIDERA!"
              className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1DA851]"
            >
              Falar com Claudemir
            </a>
          </div>
        </div>

        <p className="text-center text-sm font-semibold italic text-[#64748B]">
          O próximo passo não é trabalhar mais — é liderar melhor.
        </p>
      </div>
    )
  }

  /* ── Questão Atual ── */

  if (!questaoAtual) return null

  const Icon = questaoAtual.icon

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-[#64748B]">
            Questão {step + 1} de {totalSteps}
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

      {/* Header da questão */}
      <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1565C0]/10">
          <Icon className="h-5 w-5 text-[#1565C0]" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
          {questaoAtual.subtitulo}
        </p>
        <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#111827]">
          {questaoAtual.titulo}
        </h2>
        <p className="mt-3 rounded-xl border border-[#E4EAF4] bg-white px-4 py-3 text-sm font-semibold leading-relaxed text-[#111827]">
          {questaoAtual.pergunta}
        </p>
      </div>

      {/* Campos de texto (se houver) */}
      {questaoAtual.campoTexto && (
        <div className="space-y-4">
          {questaoAtual.campoTexto.map((campo) => (
            <div key={campo.key} className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#334155]">{campo.label}</label>
              <textarea
                value={textos[campo.key] || ''}
                onChange={(e) => updateTexto(campo.key, e.target.value)}
                placeholder={campo.placeholder}
                className={textareaClass}
              />
            </div>
          ))}
        </div>
      )}

      {/* Opções */}
      <div className="space-y-3">
        {questaoAtual.opcoes.map((opcao) => {
          const selecionado = respostaSelecionada === opcao.valor
          return (
            <button
              key={opcao.valor}
              type="button"
              onClick={() => selecionar(questaoAtual.id, opcao.valor)}
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
                    backgroundColor: selecionado
                      ? opcao.valor >= 3
                        ? '#4CAF35'
                        : opcao.valor >= 2
                          ? '#F59E0B'
                          : '#EF4444'
                      : '#CBD5E1',
                  }}
                >
                  {opcao.valor}
                </span>
                <div className="flex-1">
                  <p className={`text-sm font-bold ${selecionado ? 'text-[#111827]' : 'text-[#334155]'}`}>
                    {opcao.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">{opcao.descricao}</p>
                </div>
                {selecionado && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1565C0]" />}
              </div>
            </button>
          )
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
            disabled={respostaSelecionada === undefined}
            className="inline-flex items-center gap-2 rounded-xl bg-[#111827] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#1565C0] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Próximo
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!todasRespondidas || enviando}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F57C00] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#F57C00]/20 transition-all hover:bg-[#E65100] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {enviando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculando resultado...
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4" />
                Ver meu diagnóstico
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
