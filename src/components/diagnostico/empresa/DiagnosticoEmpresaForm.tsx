'use client'

import { useRouter } from 'next/navigation'
import { Building2, Mail, Phone, User as UserIcon, Briefcase, Users, Calendar } from 'lucide-react'

import { WizardShell, type WizardStep } from '@/components/diagnostico/ui/WizardShell'
import { ScaleRating } from '@/components/diagnostico/ui/ScaleRating'
import { ChoicePicker } from '@/components/diagnostico/ui/ChoicePicker'
import {
  COMPETENCIAS_LIDERANCA,
  DISC_TRAITS,
  DESAFIOS_ATUAIS,
  MODULOS_LIDERA,
  EXPECTATIVAS_RESULTADOS,
  type ModuloKey,
} from '@/lib/diagnostico/empresa-data'
import {
  PROXIMO_PASSO_SUPERVISOR,
  PRAZO_EVOLUCAO_EMPRESA,
  PLANO_SUCESSAO,
} from '@/lib/diagnostico/carreira-data'
import { KPIS_EMPRESA } from '@/lib/diagnostico/kpis-data'

type FormData = {
  // 1. Identificação
  empresa: string
  unidadeFilial: string
  segmento: string
  gestorNome: string
  gestorCargo: string
  gestorEmail: string
  gestorWhatsapp: string
  supervisorNome: string
  supervisorCargo: string
  tempoNaFuncao: string
  qtdLiderados: string
  dataAvaliacao: string

  // 2-6 e 7
  perfilLiderancaEsperado: Record<string, number>
  perfilComportamentalDesejado: Record<string, Record<string, number>>
  diagnosticoAtual: Record<string, number>
  modulos: Partial<Record<ModuloKey, string>>
  expectativas: Record<string, number>
  comportamentosFortalecer: string
  comportamentosEliminar: string
  oQueSeriaExcelente: string

  // 8. Carreira do supervisor (visão do gestor)
  proximoPasso: string
  prazoEvolucao: string
  planoSucessao: string
  maiorBloqueio: string

  // 9. KPIs operacionais reais (números)
  kpis: Record<string, string>
}

const todayISO = () => new Date().toISOString().slice(0, 10)

const initialData: FormData = {
  empresa: '',
  unidadeFilial: '',
  segmento: '',
  gestorNome: '',
  gestorCargo: '',
  gestorEmail: '',
  gestorWhatsapp: '',
  supervisorNome: '',
  supervisorCargo: '',
  tempoNaFuncao: '',
  qtdLiderados: '',
  dataAvaliacao: todayISO(),
  perfilLiderancaEsperado: {},
  perfilComportamentalDesejado: { D: {}, I: {}, S: {}, C: {} },
  diagnosticoAtual: {},
  modulos: {},
  expectativas: {},
  comportamentosFortalecer: '',
  comportamentosEliminar: '',
  oQueSeriaExcelente: '',
  proximoPasso: '',
  prazoEvolucao: '',
  planoSucessao: '',
  maiorBloqueio: '',
  kpis: {},
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

export default function DiagnosticoEmpresaForm() {
  const router = useRouter()

  const steps: WizardStep<FormData>[] = [
    {
      id: 'identificacao',
      title: '1. Identificação',
      subtitle: 'Dados da empresa e do supervisor que está sendo avaliado.',
      render: (data, update) => (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E3EBF6] bg-white p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
              Empresa
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Empresa" value={data.empresa} onChange={(v) => update({ empresa: v })} icon={Building2} required />
              <TextField label="Unidade / Filial" value={data.unidadeFilial} onChange={(v) => update({ unidadeFilial: v })} placeholder="Matriz, Filial SP..." />
              <TextField label="Segmento" value={data.segmento} onChange={(v) => update({ segmento: v })} placeholder="Indústria, Varejo, Logística..." />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E3EBF6] bg-white p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
              Gestor responsável
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Nome do Gestor" value={data.gestorNome} onChange={(v) => update({ gestorNome: v })} icon={UserIcon} required />
              <TextField label="Cargo" value={data.gestorCargo} onChange={(v) => update({ gestorCargo: v })} icon={Briefcase} placeholder="Diretor de RH, Gerente Industrial..." />
              <TextField label="E-mail" value={data.gestorEmail} onChange={(v) => update({ gestorEmail: v })} icon={Mail} type="email" inputMode="email" required />
              <TextField label="WhatsApp" value={data.gestorWhatsapp} onChange={(v) => update({ gestorWhatsapp: v })} icon={Phone} inputMode="tel" placeholder="(64) 99609-9020" />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E3EBF6] bg-white p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.13em] text-[#1565C0]">
              Supervisor avaliado
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Nome do Supervisor" value={data.supervisorNome} onChange={(v) => update({ supervisorNome: v })} icon={UserIcon} required />
              <TextField label="Cargo / Função" value={data.supervisorCargo} onChange={(v) => update({ supervisorCargo: v })} placeholder="Supervisor de Produção..." />
              <TextField label="Tempo na função" value={data.tempoNaFuncao} onChange={(v) => update({ tempoNaFuncao: v })} placeholder="2 anos, 8 meses..." />
              <TextField label="Quantidade de liderados" value={data.qtdLiderados} onChange={(v) => update({ qtdLiderados: v })} icon={Users} inputMode="numeric" placeholder="12" />
              <TextField label="Data da avaliação" value={data.dataAvaliacao} onChange={(v) => update({ dataAvaliacao: v })} icon={Calendar} type="date" />
            </div>
          </div>
        </div>
      ),
      validate: (data) => {
        if (!data.empresa.trim()) return 'Informe o nome da empresa.'
        if (!data.gestorNome.trim()) return 'Informe o nome do gestor responsável.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.gestorEmail.trim()))
          return 'Informe um e-mail válido para o gestor.'
        if (!data.supervisorNome.trim()) return 'Informe o nome do supervisor a ser avaliado.'
        return null
      },
    },
    {
      id: 'perfil_lideranca',
      title: '2. Perfil de Liderança Esperado',
      subtitle:
        'Quais características a empresa considera essenciais em um Supervisor de Excelência? Classifique de 1 (Pouco importante) a 5 (Extremamente importante).',
      render: (data, update) => (
        <div className="space-y-3">
          {COMPETENCIAS_LIDERANCA.map((c) => (
            <ScaleRating
              key={c.id}
              label={c.label}
              value={data.perfilLiderancaEsperado[c.id]}
              onChange={(v) =>
                update({
                  perfilLiderancaEsperado: { ...data.perfilLiderancaEsperado, [c.id]: v },
                })
              }
            />
          ))}
        </div>
      ),
      validate: (data) => {
        const answered = Object.keys(data.perfilLiderancaEsperado).length
        if (answered < COMPETENCIAS_LIDERANCA.length)
          return `Responda todas as ${COMPETENCIAS_LIDERANCA.length} competências (${answered}/${COMPETENCIAS_LIDERANCA.length} respondidas).`
        return null
      },
    },
    {
      id: 'disc',
      title: '3. Perfil Comportamental Desejado (DISC)',
      subtitle:
        'Marque os comportamentos mais alinhados à cultura da empresa. Classifique de 1 (Pouco importante) a 5 (Extremamente importante).',
      render: (data, update) => (
        <div className="space-y-6">
          {(Object.keys(DISC_TRAITS) as Array<keyof typeof DISC_TRAITS>).map((key) => {
            const group = DISC_TRAITS[key]
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
                    <p className="font-heading text-base font-extrabold text-[#0F172A]">
                      {group.label}
                    </p>
                    <p className="text-xs text-[#64748B]">{group.description}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <ScaleRating
                      key={item.id}
                      label={item.label}
                      value={data.perfilComportamentalDesejado[key]?.[item.id]}
                      onChange={(v) =>
                        update({
                          perfilComportamentalDesejado: {
                            ...data.perfilComportamentalDesejado,
                            [key]: { ...data.perfilComportamentalDesejado[key], [item.id]: v },
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
        for (const key of Object.keys(DISC_TRAITS) as Array<keyof typeof DISC_TRAITS>) {
          total += Object.keys(data.perfilComportamentalDesejado[key] || {}).length
        }
        if (total < 20) return `Responda todos os 20 traços DISC (${total}/20 respondidos).`
        return null
      },
    },
    {
      id: 'diagnostico_atual',
      title: '4. Diagnóstico Atual da Liderança',
      subtitle:
        'Onde estão hoje os maiores desafios da supervisão? Classifique de 1 (Muito baixo) a 5 (Muito crítico).',
      render: (data, update) => (
        <div className="space-y-3">
          {DESAFIOS_ATUAIS.map((d) => (
            <ScaleRating
              key={d.id}
              label={d.label}
              minLabel="Muito baixo"
              maxLabel="Muito crítico"
              value={data.diagnosticoAtual[d.id]}
              onChange={(v) =>
                update({
                  diagnosticoAtual: { ...data.diagnosticoAtual, [d.id]: v },
                })
              }
            />
          ))}
        </div>
      ),
      validate: (data) => {
        const answered = Object.keys(data.diagnosticoAtual).length
        if (answered < DESAFIOS_ATUAIS.length)
          return `Responda todos os ${DESAFIOS_ATUAIS.length} temas (${answered}/${DESAFIOS_ATUAIS.length} respondidos).`
        return null
      },
    },
    {
      id: 'modulos',
      title: '5. Avaliação Estratégica por Módulo LIDERA',
      subtitle:
        'Para cada módulo do programa LIDERA, escolha a opção que melhor descreve o supervisor hoje.',
      render: (data, update) => (
        <div className="space-y-4">
          {(Object.keys(MODULOS_LIDERA) as ModuloKey[]).map((key) => {
            const modulo = MODULOS_LIDERA[key]
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
        const total = Object.keys(MODULOS_LIDERA).length
        const answered = Object.values(data.modulos).filter(Boolean).length
        if (answered < total) return `Responda todos os ${total} módulos (${answered}/${total} respondidos).`
        return null
      },
    },
    {
      id: 'expectativas',
      title: '6. Expectativas da Empresa',
      subtitle:
        'Quais resultados a empresa espera deste profissional nos próximos 12 meses? Classifique de 1 a 5.',
      render: (data, update) => (
        <div className="space-y-3">
          {EXPECTATIVAS_RESULTADOS.map((e) => (
            <ScaleRating
              key={e.id}
              label={e.label}
              value={data.expectativas[e.id]}
              onChange={(v) => update({ expectativas: { ...data.expectativas, [e.id]: v } })}
            />
          ))}
        </div>
      ),
      validate: (data) => {
        const answered = Object.keys(data.expectativas).length
        if (answered < EXPECTATIVAS_RESULTADOS.length)
          return `Responda todas as ${EXPECTATIVAS_RESULTADOS.length} expectativas (${answered}/${EXPECTATIVAS_RESULTADOS.length} respondidas).`
        return null
      },
    },
    {
      id: 'espaco_aberto',
      title: '7. Espaço Aberto',
      subtitle: 'Suas observações qualitativas sobre o supervisor avaliado.',
      render: (data, update) => (
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Quais comportamentos precisam ser <strong className="text-[#22C55E]">fortalecidos</strong>?
            </label>
            <textarea
              value={data.comportamentosFortalecer}
              onChange={(e) => update({ comportamentosFortalecer: e.target.value })}
              placeholder="Descreva os comportamentos positivos que precisam crescer..."
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Quais comportamentos precisam ser <strong className="text-[#EF4444]">eliminados</strong>?
            </label>
            <textarea
              value={data.comportamentosEliminar}
              onChange={(e) => update({ comportamentosEliminar: e.target.value })}
              placeholder="Descreva os comportamentos prejudiciais que precisam parar..."
              className={textareaClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              O que faria este supervisor ser considerado <strong className="text-[#1565C0]">excelente</strong> nesta empresa?
            </label>
            <textarea
              value={data.oQueSeriaExcelente}
              onChange={(e) => update({ oQueSeriaExcelente: e.target.value })}
              placeholder="Descreva o cenário ideal..."
              className={textareaClass}
            />
          </div>
        </div>
      ),
      validate: (data) => {
        if (
          !data.comportamentosFortalecer.trim() &&
          !data.comportamentosEliminar.trim() &&
          !data.oQueSeriaExcelente.trim()
        )
          return 'Responda ao menos um campo do espaço aberto para finalizar.'
        return null
      },
    },
    {
      id: 'carreira',
      title: '8. Visão de Carreira do Supervisor',
      subtitle:
        'Qual o futuro projetado para este supervisor dentro da empresa? Essas respostas calibram a urgência e foco do PDI.',
      render: (data, update) => (
        <div className="space-y-4">
          <ChoicePicker
            label="Qual é o próximo passo natural para esta pessoa?"
            options={PROXIMO_PASSO_SUPERVISOR}
            value={data.proximoPasso}
            onChange={(v) => update({ proximoPasso: v })}
          />

          <ChoicePicker
            label="Qual prazo realista para essa evolução?"
            options={PRAZO_EVOLUCAO_EMPRESA}
            value={data.prazoEvolucao}
            onChange={(v) => update({ prazoEvolucao: v })}
          />

          <ChoicePicker
            label="Existe plano de sucessão envolvendo este supervisor?"
            options={PLANO_SUCESSAO}
            value={data.planoSucessao}
            onChange={(v) => update({ planoSucessao: v })}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#334155]">
              Qual o <strong className="text-[#EF4444]">maior bloqueio</strong> para a carreira dele(a)?
            </label>
            <p className="text-xs text-[#64748B]">
              Técnico, comportamental, político, expectativa errada, falta de oportunidade, etc.
            </p>
            <textarea
              value={data.maiorBloqueio}
              onChange={(e) => update({ maiorBloqueio: e.target.value })}
              placeholder="Descreva com objetividade — quanto mais específico, melhor o PDI gerado..."
              className={textareaClass}
            />
          </div>
        </div>
      ),
      validate: (data) => {
        if (!data.proximoPasso) return 'Escolha o próximo passo natural.'
        if (!data.prazoEvolucao) return 'Escolha o prazo realista.'
        if (!data.planoSucessao) return 'Indique o status de sucessão.'
        return null
      },
    },
    {
      id: 'kpis',
      title: '9. KPIs Operacionais Reais',
      subtitle:
        'Números atuais da operação dele(a). Preencha apenas os que conhece — campos vazios viram "não informado". Quanto mais números, mais específico o PDI.',
      render: (data, update) => (
        <div className="space-y-4">
          <p className="rounded-xl border border-[#E3EBF6] bg-[#F8FAFD] px-4 py-3 text-xs text-[#64748B]">
            Não é obrigatório preencher tudo. Preencha apenas os que você sabe — o PDI usa esses
            valores para gerar KPIs específicos (ex: &ldquo;reduzir turnover de 28% para 18%&rdquo;)
            em vez de metas genéricas.
          </p>
          {KPIS_EMPRESA.map((kpi) => (
            <div key={kpi.id} className="rounded-xl border border-[#E3EBF6] bg-white px-5 py-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0F172A]">{kpi.label}</label>
                {kpi.hint && <p className="text-xs text-[#64748B]">{kpi.hint}</p>}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={data.kpis[kpi.id] || ''}
                    onChange={(e) => update({ kpis: { ...data.kpis, [kpi.id]: e.target.value } })}
                    placeholder={kpi.placeholder}
                    className={`${inputClass} max-w-[200px]`}
                  />
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#94A3B8]">
                    {kpi.unit}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ),
      validate: () => null, // todos opcionais
    },
  ]

  async function handleSubmit(data: FormData) {
    const response = await fetch('/api/diagnostico/empresa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const json = (await response.json()) as { success?: boolean; error?: string; diagnosticoId?: string }
    if (!response.ok || !json.success) {
      throw new Error(json.error || 'Falha ao enviar diagnóstico.')
    }
    router.push(`/diagnostico/empresa/resultado/${json.diagnosticoId || ''}`)
  }

  return (
    <WizardShell<FormData>
      steps={steps}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel="Enviar diagnóstico"
    />
  )
}
