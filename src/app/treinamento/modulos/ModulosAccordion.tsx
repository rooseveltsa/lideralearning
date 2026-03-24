'use client'

import { useState } from 'react'
import {
  BookOpen,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Cpu,
  Rocket,
  Shield,
  Target,
  Trophy,
  Users,
} from 'lucide-react'

type Module = {
  id: number
  title: string
  subtitle: string
  day: number
  period: string
  icon: typeof Target
  color: string
  topics: string[]
  objective: string
  takeaway: string
}

const modules: Module[] = [
  {
    id: 1,
    title: 'A Função Estratégica',
    subtitle: 'O supervisor como "Elo" entre diretoria e operação',
    day: 1,
    period: 'Manhã',
    icon: Target,
    color: '#1565C0',
    topics: [
      'O papel do supervisor como ponte entre estratégia e operação',
      'As 5 dimensões: Facilitador, Orientador, Garantidor, Estrategista e Mentor',
      'Transição de executor para líder: o que muda na prática',
      'Diagnóstico da sua maturidade como líder',
    ],
    objective: 'Compreender seu papel estratégico e identificar dimensões para evolução.',
    takeaway: 'Você sai sabendo exatamente onde está e para onde precisa ir.',
  },
  {
    id: 2,
    title: 'Inteligência Comportamental',
    subtitle: 'Postura, comunicação e inteligência emocional',
    day: 1,
    period: 'Manhã',
    icon: Brain,
    color: '#1565C0',
    topics: [
      'Comunicação assertiva no dia a dia do líder',
      'Inteligência emocional aplicada à gestão de pessoas',
      'Feedback assertivo: Fórmula E.I.A (Evento, Impacto, Ação)',
      'Escuta ativa e mediação de conflitos',
    ],
    objective: 'Dominar técnicas de comunicação para construir confiança com a equipe.',
    takeaway: 'Você aplica o E.I.A já na segunda-feira com sua equipe.',
  },
  {
    id: 3,
    title: 'Alicerce Ético',
    subtitle: 'Virtudes, integridade e responsabilidade',
    day: 1,
    period: 'Tarde',
    icon: Shield,
    color: '#F57C00',
    topics: [
      'As virtudes essenciais para o exercício da liderança',
      'Dinâmica prática: Tribunal das Virtudes',
      'Equilíbrio entre integridade e cumprimento de metas',
      'Construção de autoridade moral com a equipe',
    ],
    objective: 'Desenvolver base ética que sustente decisões sob pressão.',
    takeaway: 'Sua equipe vai respeitar suas decisões porque confia no seu caráter.',
  },
  {
    id: 4,
    title: 'Diversidade Geracional',
    subtitle: 'Liderando equipes multigeracionais',
    day: 1,
    period: 'Tarde',
    icon: Users,
    color: '#F57C00',
    topics: [
      'Gerações X, Y (Millennials) e Z: o que motiva cada uma',
      'Como liderar cada perfil sem conflitos',
      'Mediação de conflitos entre gerações',
      'Mentoria reversa: o que as gerações novas podem ensinar',
    ],
    objective: 'Transformar diversidade geracional em vantagem competitiva.',
    takeaway: 'Você para de reclamar das gerações e começa a usar cada perfil a seu favor.',
  },
  {
    id: 5,
    title: 'Engenharia de Equipes',
    subtitle: 'Mapeamento, delegação e sucessão',
    day: 2,
    period: 'Manhã',
    icon: BriefcaseBusiness,
    color: '#1565C0',
    topics: [
      'Matriz: Iniciante Motivado, O Estrela, O Questionador, O Problema',
      'Técnicas de delegação por perfil comportamental',
      'Planejamento de sucessão: preparando seu substituto',
      'Como desenvolver talentos dentro da equipe',
    ],
    objective: 'Mapear sua equipe e aplicar a estratégia certa para cada perfil.',
    takeaway: 'Você vai saber exatamente quem treinar, delegar, apoiar ou substituir.',
  },
  {
    id: 6,
    title: 'O Supervisor 4.0',
    subtitle: 'Tecnologia e IA na gestão',
    day: 2,
    period: 'Manhã',
    icon: Cpu,
    color: '#1565C0',
    topics: [
      'IA na prática: Gemini e ChatGPT no dia a dia do líder',
      'Prompt Mágico: Contexto + Dados + Objetivo',
      'Análise de causa raiz com apoio de tecnologia',
      'KPI Autópsia (passado) vs KPI Bússola (futuro)',
    ],
    objective: 'Integrar IA ao seu fluxo e tomar decisões baseadas em dados.',
    takeaway: 'Você vai usar IA para resolver problemas reais do seu setor em minutos.',
  },
  {
    id: 7,
    title: 'Padrões de Sucesso',
    subtitle: 'Reconhecendo e replicando resultados',
    day: 2,
    period: 'Tarde',
    icon: Trophy,
    color: '#F57C00',
    topics: [
      'Tríade da Maestria: Reconhecimento, Criação e Utilização',
      'KPIs S.M.A.R.T. para sua área',
      'Padrões de execução para resultados previsíveis',
      'Documentar e transferir boas práticas',
    ],
    objective: 'Sistematizar processos de alta performance na sua área.',
    takeaway: 'Sucesso não é sorte, é padrão — e você vai criar os seus.',
  },
  {
    id: 8,
    title: 'Estratégia e Plano Futuro',
    subtitle: 'PDI, sucessão e autocoaching',
    day: 2,
    period: 'Tarde',
    icon: Rocket,
    color: '#F57C00',
    topics: [
      'PDI — Plano de Desenvolvimento Individual personalizado',
      'Estratégia de carreira: de supervisor a gestor',
      'Plano de sucessão: garantindo continuidade',
      'Compromisso de autocoaching e acompanhamento',
    ],
    objective: 'Sair com plano concreto de evolução para os próximos 60 dias.',
    takeaway: 'Você sai com data, nome do sucessor e plano na mão.',
  },
]

export default function ModulosAccordion() {
  const [openId, setOpenId] = useState<number | null>(1)

  const day1 = modules.filter((m) => m.day === 1)
  const day2 = modules.filter((m) => m.day === 2)

  function toggle(id: number) {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="space-y-8">
      {/* Dia 1 */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#1565C0] text-xs font-extrabold text-white">
            D1
          </span>
          <h2 className="text-lg font-extrabold text-[#0F172A]">O Elo e o Alicerce Ético</h2>
          <span className="text-xs text-[#64748B]">4 módulos · 8h</span>
        </div>
        <div className="space-y-2">
          {day1.map((mod) => (
            <ModuleItem key={mod.id} module={mod} isOpen={openId === mod.id} onToggle={toggle} />
          ))}
        </div>
      </div>

      {/* Dia 2 */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#F57C00] text-xs font-extrabold text-white">
            D2
          </span>
          <h2 className="text-lg font-extrabold text-[#0F172A]">Tecnologia e Futuro</h2>
          <span className="text-xs text-[#64748B]">4 módulos · 8h</span>
        </div>
        <div className="space-y-2">
          {day2.map((mod) => (
            <ModuleItem key={mod.id} module={mod} isOpen={openId === mod.id} onToggle={toggle} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ModuleItem({
  module: mod,
  isOpen,
  onToggle,
}: {
  module: Module
  isOpen: boolean
  onToggle: (id: number) => void
}) {
  const Icon = mod.icon

  return (
    <div className="overflow-hidden rounded-xl border border-[#D8E2EF] bg-white shadow-sm">
      {/* Header clicável */}
      <button
        onClick={() => onToggle(mod.id)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-[#F7FAFE]"
      >
        <span
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[10px] font-extrabold text-white"
          style={{ backgroundColor: mod.color }}
        >
          {String(mod.id).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#0F172A]">{mod.title}</p>
          <p className="text-xs text-[#64748B]">{mod.subtitle}</p>
        </div>
        <span className="shrink-0 rounded-md bg-[#F7FAFE] px-2 py-0.5 text-[10px] font-bold text-[#64748B]">
          {mod.period}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#94A3B8] transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Conteúdo expandido */}
      {isOpen && (
        <div className="border-t border-[#E5ECF6] px-5 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Tópicos */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#64748B]">
                O que você vai aprender
              </p>
              <ul className="space-y-2">
                {mod.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#334155]">
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0"
                      style={{ color: mod.color }}
                    />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Objetivo + Takeaway */}
            <div className="space-y-3">
              <div className="rounded-lg border border-[#E5ECF6] bg-[#F7FAFE] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0B4A8F]">
                  Objetivo
                </p>
                <p className="mt-1 text-sm text-[#334155]">{mod.objective}</p>
              </div>
              <div
                className="rounded-lg px-4 py-3"
                style={{ backgroundColor: `${mod.color}0A`, border: `1px solid ${mod.color}20` }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: mod.color }}>
                  Resultado prático
                </p>
                <p className="mt-1 text-sm font-medium text-[#0F172A]">{mod.takeaway}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
