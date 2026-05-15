'use client'

import { useRouter } from 'next/navigation'
import { Mail, Phone, User as UserIcon, Briefcase, Building2, Users, Calendar, MapPin } from 'lucide-react'

import { WizardShell, type WizardStep } from '@/components/diagnostico/ui/WizardShell'
import { ScaleRating } from '@/components/diagnostico/ui/ScaleRating'
import { ScalePillar } from '@/components/diagnostico/ui/ScalePillar'
import { ChoicePicker } from '@/components/diagnostico/ui/ChoicePicker'
import {
  AUTOAVALIACAO_COMPETENCIAS,
  DISC_PESSOAL,
  MODULOS_PESSOAL,
  DESEJOS_DESENVOLVIMENTO,
  PILARES_RADAR,
  type ModuloPessoalKey,
} from '@/lib/diagnostico/pessoal-data'
import {
  HORIZONTE_CARREIRA,
  VELOCIDADE_DESEJADA,
  MOMENTO_VIDA,
} from '@/lib/diagnostico/carreira-data'
import { KPIS_PESSOAL_PERCEBIDOS } from '@/lib/diagnostico/kpis-data'

type UserProfile = { id: string; fullName: string; email: string } | null

type FormData = {
  // 1. Identificação
  nomeCompleto: string
  email: string
  whatsapp: string
  empresa: string
  cargo: string
  setor: string
  tempoNaFuncao: string
  qtdLiderados: string
  idade: string
  cidadeUF: string
  dataAvaliacao: string

  // 2-4
  autoavaliacao: Record<string, number>
  perfilComportamentalPessoal: Record<string, Record<string, number>>
  modulos: Partial<Record<ModuloPessoalKey, string>>

  // 5. Reflexão
  pontosFortes: string
  comportamentosPrejudicam: string
  desejaDesenvolver: Record<string, number>

  // 6. Radar
  radar: Record<string, number>

  // 7. PDI
  comportamentoEliminar: string
  habilidadeDesenvolver: string
  acaoProximos7Dias: string
  resultado90Dias: string
  quemPodeApoiar: string

  // 8. Alinhamento
  oQueEmpresaEspera: string
  oQueEntregaMelhor: string
  ondeMaiorDesalinhamento: string

  // 9. Carreira
  cargoAlmejado: string
  horizonteCarreira: string
  velocidadeDesejada: string
  momentoVida: string
  maiorBarreira: string
  quemPodeApoiarCarreira: string

  // 10. KPIs percebidos
  kpisPercebidos: Record<string, number>
}

const todayISO = () => new Date().toISOString().slice(0, 10)

function getInitialData(user: UserProfile): FormData {
  return {
    nomeCompleto: user?.fullName || '',
    email: user?.email || '',
    whatsapp: '',
    empresa: '',
    cargo: '',
    setor: '',
    tempoNaFuncao: '',
    qtdLiderados: '',
    idade: '',
    cidadeUF: '',
    dataAvaliacao: todayISO(),
    autoavaliacao: {},
    perfilComportamentalPessoal: { D: {}, I: {}, S: {}, C: {} },
    modulos: {},
    pontosFortes: '',
    comportamentosPrejudicam: '',
    desejaDesenvolver: {},
    radar: {},
    comportamentoEliminar: '',
    habilidadeDesenvolver: '',
    acaoProximos7Dias: '',
    resultado90Dias: '',
    quemPodeApoiar: '',
    oQueEmpresaEspera: '',
    oQueEntregaMelhor: '',
    ondeMaiorDesalinhamento: '',
    cargoAlmejado: '',
    horizonteCarreira: '',
    velocidadeDesejada: '',
    momentoVida: '',
    maiorBarreira: '',
    quemPodeApoiarCarreira: '',
    kpisPercebidos: {},
  }
}

const inputClass =
  'w-full rounded-xl border border-[#E3EBF6] bg-white px-4 py-3 text-sm text-[#111827] placeholder:text-[#94A3B8] transition-all focus:border-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0]/20'

const textareaClass = `${inputClass} min-h-[120px] resize-y`

function TextField({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  type = 'text',
  required,
  inputMode,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  icon?: typeof Mail
  type?: string
  required?: boolean
  inputMode?: 'text' | 'numeric' | 'email' | 'tel'
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-[#334155]">
        {label}
        {required && <span className="ml-1 text-[#EF4444]">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className={Icon ? `${inputClass} pl-10` : inputClass}
        />
      </div>
    </div>
  )
}

type Props = {
  user: UserProfile
}

export default function DiagnosticoPessoalForm({ user }: Props) {
  const router = useRouter()

  const steps: WizardStep<FormData>[] = [
    {
      id: 'identificacao',
      title: '1. Identificação',
      subtitle: 'Seus dados profissionais. Use a mesma empresa do diagnóstico empresarial (se houver) para cruzar informações.',
      render: (data, update) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Nome completo" value={data.nomeCompleto} onChange={(v) => update({ nomeCompleto: v })} icon={UserIcon} required />
          <TextField label="E-mail" value={data.email} onChange={(v) => update({ email: v })} icon={Mail} type="email" inputMode="email" required />
          <TextField
            label="WhatsApp"
            value={data.whatsapp}
            onChange={(v) => update({ whatsapp: v })}
            icon={Phone}
            type="tel"
            inputMode="tel"
            placeholder="(64) 9 9609-9020"
          />
          <TextField label="Empresa (atual ou última)" value={data.empresa} onChange={(v) => update({ empresa: v })} icon={Building2} placeholder="Mesmo nome do form empresa, se houver" />
          <TextField label="Cargo / Função" value={data.cargo} onChange={(v) => update({ cargo: v })} icon={Briefcase} placeholder="Supervisor de Produção..." />
          <TextField label="Setor" value={data.setor} onChange={(v) => update({ setor: v })} placeholder="Produção, Logística..." />
          <TextField label="Tempo na função" value={data.tempoNaFuncao} onChange={(v) => update({ tempoNaFuncao: v })} placeholder="2 anos, 8 meses..." />
          <TextField label="Quantidade de liderados" value={data.qtdLiderados} onChange={(v) => update({ qtdLiderados: v })} icon={Users} inputMode="numeric" placeholder="12" />
          <TextField label="Idade" value={data.idade} onChange={(v) => update({ idade: v })} inputMode="numeric" placeholder="38" />
          <TextField label="Cidade / UF" value={data.cidadeUF} onChange={(v) => update({ cidadeUF: v })} icon={MapPin} placeholder="Rio Verde / GO" />
          <TextField label="Data" value={data.dataAvaliacao} onChange={(v) => update({ dataAvaliacao: v })} icon={Calendar} type="date" />
        </div>
      ),
      validate: (data) => {
        if (!data.nomeCompleto.trim()) return 'Informe seu nome completo.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()))
          return 'Informe um e-mail válido.'
        return null
      },
    },
    {
      id: 'autoavaliacao',
      title: '2. Autoavaliação Comportamental',
      subtitle: 'Como você se percebe hoje? Classifique de 1 (Muito fraco) a 5 (Muito forte).',
      render: (data, update) => (
        <div className="space-y-3">
          {AUTOAVALIACAO_COMPETENCIAS.map((c) => (
            <ScaleRating
              key={c.id}
              label={c.label}
              minLabel="Muito fraco"
              maxLabel="Muito forte"
              value={data.autoavaliacao[c.id]}
              onChange={(v) => update({ autoavaliacao: { ...data.autoavaliacao, [c.id]: v } })}
            />
          ))}
        </div>
      ),
      validate: (data) => {
        const answered = Object.keys(data.autoavaliacao).length
        if (answered < AUTOAVALIACAO_COMPETENCIAS.length)
          return `Responda todas as ${AUTOAVALIACAO_COMPETENCIAS.length} competências (${answered}/${AUTOAVALIACAO_COMPETENCIAS.length} respondidas).`
        return null
      },
    },
    {
      id: 'disc_pessoal',
      title: '3. Perfil Comportamental Pessoal (DISC)',
      subtitle: 'Escolha os comportamentos que mais representam você. Classifique de 1 a 5.',
      render: (data, update) => (
        <div className="space-y-6">
          {(Object.keys(DISC_PESSOAL) as Array<keyof typeof DISC_PESSOAL>).map((key) => {
            const group = DISC_PESSOAL[key]
            return (
              <div key={key} className="rounded-2xl border border-[#E3EBF6] bg-white p-5">
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-extrabold text-white"
                    style={{ backgroundColor: group.color }}
                  >
                    {key}
                  </span>
                  <div>
                    <p className="font-heading text-base font-extrabold text-[#0F172A]">{group.label}</p>
                    <p className="text-xs text-[#64748B]">{group.description}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <ScaleRating
                      key={item.id}
                      label={item.label}
                      value={data.perfilComportamentalPessoal[key]?.[item.id]}
                      onChange={(v) =>
                        update({
                          perfilComportamentalPessoal: {
                            ...data.perfilComportamentalPessoal,
                            [key]: { ...data.perfilComportamentalPessoal[key], [item.id]: v },
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ),
      validate: (data) => {
        let total = 0
        for (const key of Object.keys(DISC_PESSOAL) as Array<keyof typeof DISC_PESSOAL>) {
          total += Object.keys(data.perfilComportamentalPessoal[key] || {}).length
        }
        if (total < 20) return `Responda todos os 20 traços DISC (${total}/20 respondidos).`
        return null
      },
    },
    {
      id: 'modulos',
      title: '4. Autoanálise por Módulo LIDERA',
      subtitle: 'Escolha a opção que melhor descreve sua atuação hoje em cada dimensão.',
      render: (data, update) => (
        <div className="space-y-4">
          {(Object.keys(MODULOS_PESSOAL) as ModuloPessoalKey[]).map((key) => {
            const modulo = MODULOS_PESSOAL[key]
            return (
              <ChoicePicker
                key={key}
                label={modulo.titulo}
                helperText={modulo.pergunta}
                options={modulo.opcoes}
                value={data.modulos[key]}
                onChange={(v) => update({ modulos: { ...data.modulos, [key]: v } })}
              />
            )
          })}
        </div>
      ),
      validate: (data) => {
        const total = Object.keys(MODULOS_PESSOAL).length
        const answered = Object.values(data.modulos).filter(Boolean).length
        if (answered < total) return `Responda todos os ${total} módulos (${answered}/${total} respondidos).`
        return null
      },
    },
    {
      id: 'reflexao',
      title: '5. Reflexão Profissional',
      subtitle: 'Olhar honesto sobre suas forças, fragilidades e desejos de evolução.',
      render: (data, update) => (
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Quais são hoje seus <strong className="text-[#22C55E]">3 maiores pontos fortes</strong>?
            </label>
            <textarea
              value={data.pontosFortes}
              onChange={(e) => update({ pontosFortes: e.target.value })}
              placeholder="Liste 3 forças que você reconhece em si..."
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Quais comportamentos mais <strong className="text-[#EF4444]">prejudicam seus resultados</strong>?
            </label>
            <textarea
              value={data.comportamentosPrejudicam}
              onChange={(e) => update({ comportamentosPrejudicam: e.target.value })}
              placeholder="Seja honesto consigo mesmo..."
              className={textareaClass}
            />
          </div>

          <div className="rounded-2xl border border-[#E3EBF6] bg-[#F8FAFD] p-5">
            <p className="mb-3 text-sm font-bold text-[#0F172A]">
              O que gostaria de desenvolver nos próximos 12 meses?
            </p>
            <p className="mb-4 text-xs text-[#64748B]">Classifique de 1 (Pouco importante) a 5 (Extremamente importante).</p>
            <div className="space-y-2.5">
              {DESEJOS_DESENVOLVIMENTO.map((d) => (
                <ScaleRating
                  key={d.id}
                  label={d.label}
                  value={data.desejaDesenvolver[d.id]}
                  onChange={(v) => update({ desejaDesenvolver: { ...data.desejaDesenvolver, [d.id]: v } })}
                />
              ))}
            </div>
          </div>
        </div>
      ),
      validate: (data) => {
        if (!data.pontosFortes.trim()) return 'Descreva ao menos um ponto forte.'
        const answered = Object.keys(data.desejaDesenvolver).length
        if (answered < DESEJOS_DESENVOLVIMENTO.length)
          return `Classifique todos os ${DESEJOS_DESENVOLVIMENTO.length} desejos de desenvolvimento (${answered}/${DESEJOS_DESENVOLVIMENTO.length}).`
        return null
      },
    },
    {
      id: 'radar',
      title: '6. Radar de Desenvolvimento',
      subtitle: 'Dê uma nota de 0 a 10 para cada pilar da sua vida. Visão honesta = PDI eficaz.',
      render: (data, update) => (
        <div className="space-y-3">
          {PILARES_RADAR.map((p) => (
            <ScalePillar
              key={p.id}
              label={p.label}
              value={data.radar[p.id]}
              onChange={(v) => update({ radar: { ...data.radar, [p.id]: v } })}
            />
          ))}
        </div>
      ),
      validate: (data) => {
        const answered = Object.keys(data.radar).length
        if (answered < PILARES_RADAR.length)
          return `Avalie todos os ${PILARES_RADAR.length} pilares (${answered}/${PILARES_RADAR.length} avaliados).`
        return null
      },
    },
    {
      id: 'pdi',
      title: '7. Plano de Desenvolvimento Individual',
      subtitle: 'Definição prática: o que você vai fazer nos próximos 90 dias.',
      render: (data, update) => (
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Qual comportamento você deseja <strong className="text-[#EF4444]">eliminar imediatamente</strong>?
            </label>
            <textarea
              value={data.comportamentoEliminar}
              onChange={(e) => update({ comportamentoEliminar: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Qual habilidade você deseja <strong className="text-[#22C55E]">desenvolver primeiro</strong>?
            </label>
            <textarea
              value={data.habilidadeDesenvolver}
              onChange={(e) => update({ habilidadeDesenvolver: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Qual <strong className="text-[#1565C0]">ação prática</strong> iniciará nos próximos 7 dias?
            </label>
            <textarea
              value={data.acaoProximos7Dias}
              onChange={(e) => update({ acaoProximos7Dias: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Qual <strong className="text-[#1565C0]">resultado</strong> deseja alcançar em 90 dias?
            </label>
            <textarea
              value={data.resultado90Dias}
              onChange={(e) => update({ resultado90Dias: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              <strong className="text-[#7B1FA2]">Quem pode apoiar</strong> seu desenvolvimento?
            </label>
            <textarea
              value={data.quemPodeApoiar}
              onChange={(e) => update({ quemPodeApoiar: e.target.value })}
              placeholder="Mentor, líder direto, colega de equipe, família..."
              className={textareaClass}
            />
          </div>
        </div>
      ),
      validate: (data) => {
        if (!data.comportamentoEliminar.trim() && !data.habilidadeDesenvolver.trim())
          return 'Preencha ao menos comportamento a eliminar OU habilidade a desenvolver.'
        return null
      },
    },
    {
      id: 'alinhamento',
      title: '8. Alinhamento Final',
      subtitle: 'Sua percepção sobre a relação com a empresa (atual ou última).',
      render: (data, update) => (
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              O que a empresa <strong className="text-[#1565C0]">espera de você</strong> hoje?
            </label>
            <p className="text-xs text-[#64748B]">Preencha mesmo não estando empregado — use a última experiência.</p>
            <textarea
              value={data.oQueEmpresaEspera}
              onChange={(e) => update({ oQueEmpresaEspera: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              O que você acredita <strong className="text-[#22C55E]">entregar melhor atualmente</strong>?
            </label>
            <p className="text-xs text-[#64748B]">Ou no último trabalho, se aplicável.</p>
            <textarea
              value={data.oQueEntregaMelhor}
              onChange={(e) => update({ oQueEntregaMelhor: e.target.value })}
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Onde existe <strong className="text-[#F57C00]">maior desalinhamento</strong> entre você e a empresa?
            </label>
            <textarea
              value={data.ondeMaiorDesalinhamento}
              onChange={(e) => update({ ondeMaiorDesalinhamento: e.target.value })}
              className={textareaClass}
            />
          </div>
        </div>
      ),
      validate: (data) => {
        if (
          !data.oQueEmpresaEspera.trim() &&
          !data.oQueEntregaMelhor.trim() &&
          !data.ondeMaiorDesalinhamento.trim()
        )
          return 'Preencha ao menos um campo do alinhamento final.'
        return null
      },
    },
    {
      id: 'carreira',
      title: '9. Objetivo de Carreira',
      subtitle:
        'Onde você quer chegar — sem isso, qualquer PDI vira generalismo. Suas respostas calibram urgência e foco do plano.',
      render: (data, update) => (
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Qual <strong className="text-[#1565C0]">cargo / posição</strong> você gostaria de ocupar?
            </label>
            <input
              type="text"
              value={data.cargoAlmejado}
              onChange={(e) => update({ cargoAlmejado: e.target.value })}
              placeholder="Ex: Coordenador de Produção, Gerente de Operações, Diretor Industrial..."
              className={inputClass}
            />
          </div>

          <ChoicePicker
            label="Em quanto tempo?"
            helperText="Quanto tempo você se dá para chegar lá"
            options={HORIZONTE_CARREIRA}
            value={data.horizonteCarreira}
            onChange={(v) => update({ horizonteCarreira: v })}
          />

          <ChoicePicker
            label="Qual velocidade desejada?"
            helperText="Quanto você está disposto(a) a investir"
            options={VELOCIDADE_DESEJADA}
            value={data.velocidadeDesejada}
            onChange={(v) => update({ velocidadeDesejada: v })}
          />

          <ChoicePicker
            label="Qual o seu momento de vida hoje?"
            helperText="Contexto pessoal impacta o ritmo do plano"
            options={MOMENTO_VIDA}
            value={data.momentoVida}
            onChange={(v) => update({ momentoVida: v })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Qual sua <strong className="text-[#EF4444]">maior barreira</strong> percebida?
            </label>
            <p className="text-xs text-[#64748B]">
              O que pode te impedir de chegar lá: técnica, comportamental, política, mercado...
            </p>
            <textarea
              value={data.maiorBarreira}
              onChange={(e) => update({ maiorBarreira: e.target.value })}
              className={textareaClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              <strong className="text-[#7B1FA2]">Quem pode te apoiar</strong> nessa jornada de carreira?
            </label>
            <p className="text-xs text-[#64748B]">Mentor, gestor direto, mentor externo, network setor...</p>
            <textarea
              value={data.quemPodeApoiarCarreira}
              onChange={(e) => update({ quemPodeApoiarCarreira: e.target.value })}
              className={textareaClass}
            />
          </div>
        </div>
      ),
      validate: (data) => {
        if (!data.cargoAlmejado.trim()) return 'Informe um cargo ou posição almejada.'
        if (!data.horizonteCarreira) return 'Escolha o horizonte de tempo.'
        if (!data.velocidadeDesejada) return 'Escolha a velocidade desejada.'
        if (!data.momentoVida) return 'Escolha seu momento de vida atual.'
        return null
      },
    },
    {
      id: 'kpis',
      title: '10. KPIs Operacionais Percebidos',
      subtitle:
        'Como você percebe os indicadores da sua operação hoje? Escala 1 (saudável) a 5 (muito crítico).',
      render: (data, update) => (
        <div className="space-y-3">
          {KPIS_PESSOAL_PERCEBIDOS.map((k) => (
            <ScaleRating
              key={k.id}
              label={k.label}
              minLabel="Saudável"
              maxLabel="Muito crítico"
              helperText={k.description}
              value={data.kpisPercebidos[k.id]}
              onChange={(v) => update({ kpisPercebidos: { ...data.kpisPercebidos, [k.id]: v } })}
            />
          ))}
        </div>
      ),
      validate: (data) => {
        const answered = Object.keys(data.kpisPercebidos).length
        if (answered < KPIS_PESSOAL_PERCEBIDOS.length)
          return `Avalie todos os ${KPIS_PESSOAL_PERCEBIDOS.length} indicadores (${answered}/${KPIS_PESSOAL_PERCEBIDOS.length} respondidos).`
        return null
      },
    },
  ]

  async function handleSubmit(data: FormData) {
    const response = await fetch('/api/diagnostico/pessoal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = (await response.json()) as { success?: boolean; error?: string; diagnosticoId?: string }
    if (!response.ok || !json.success) {
      throw new Error(json.error || 'Falha ao enviar diagnóstico.')
    }
    router.push(`/diagnostico/pessoal/resultado/${json.diagnosticoId || ''}`)
  }

  return (
    <WizardShell<FormData>
      steps={steps}
      initialData={getInitialData(user)}
      onSubmit={handleSubmit}
      submitLabel="Gerar meu PDI"
    />
  )
}
