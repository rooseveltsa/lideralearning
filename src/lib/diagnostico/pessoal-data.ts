// Dados estáticos do Formulário 2 — Autoidentificação Comportamental e PDI.
// Fonte de verdade das listas: competências, traços DISC pessoal, módulos, pilares.

import type { ChoicePickerOption } from '@/components/diagnostico/ui/ChoicePicker'

// Seção 2 — Autoavaliação Comportamental (20 competências, escala 1-5)
export const AUTOAVALIACAO_COMPETENCIAS = [
  { id: 'comunicacao', label: 'Comunicação' },
  { id: 'escuta_ativa', label: 'Escuta ativa' },
  { id: 'inteligencia_emocional', label: 'Inteligência emocional' },
  { id: 'lideranca', label: 'Liderança' },
  { id: 'planejamento', label: 'Planejamento' },
  { id: 'organizacao', label: 'Organização' },
  { id: 'gestao_conflitos', label: 'Gestão de conflitos' },
  { id: 'tomada_decisao', label: 'Tomada de decisão' },
  { id: 'delegacao', label: 'Delegação' },
  { id: 'capacidade_analitica', label: 'Capacidade analítica' },
  { id: 'gestao_pressao', label: 'Gestão sob pressão' },
  { id: 'senso_dono', label: 'Senso de dono' },
  { id: 'desenvolvimento_pessoas', label: 'Desenvolvimento de pessoas' },
  { id: 'etica_coerencia', label: 'Ética e coerência' },
  { id: 'seguranca_operacional', label: 'Segurança operacional' },
  { id: 'adaptabilidade', label: 'Adaptabilidade' },
  { id: 'gestao_indicadores', label: 'Gestão de indicadores' },
  { id: 'uso_ia', label: 'Uso de IA e tecnologia' },
  { id: 'trabalho_equipe', label: 'Trabalho em equipe' },
  { id: 'resiliencia', label: 'Resiliência' },
] as const

// Seção 3 — Perfil Comportamental Pessoal (20 traços DISC, escala 1-5)
export const DISC_PESSOAL = {
  D: {
    label: 'Dominância (D)',
    description: 'Decisivo, competitivo, executor',
    color: '#EF4444',
    items: [
      { id: 'decidido', label: 'Decidido' },
      { id: 'competitivo', label: 'Competitivo' },
      { id: 'direto', label: 'Direto' },
      { id: 'executor', label: 'Executor' },
      { id: 'ousado', label: 'Ousado' },
    ],
  },
  I: {
    label: 'Influência (I)',
    description: 'Comunicativo, inspirador, sociável',
    color: '#F59E0B',
    items: [
      { id: 'comunicativo', label: 'Comunicativo' },
      { id: 'inspirador', label: 'Inspirador' },
      { id: 'sociavel', label: 'Sociável' },
      { id: 'persuasivo', label: 'Persuasivo' },
      { id: 'entusiasmado', label: 'Entusiasmado' },
    ],
  },
  S: {
    label: 'Estabilidade (S)',
    description: 'Paciente, colaborativo, leal',
    color: '#22C55E',
    items: [
      { id: 'paciente', label: 'Paciente' },
      { id: 'equilibrado', label: 'Equilibrado' },
      { id: 'colaborativo', label: 'Colaborativo' },
      { id: 'leal', label: 'Leal' },
      { id: 'persistente', label: 'Persistente' },
    ],
  },
  C: {
    label: 'Conformidade (C)',
    description: 'Organizado, analítico, disciplinado',
    color: '#1565C0',
    items: [
      { id: 'organizado', label: 'Organizado' },
      { id: 'analitico', label: 'Analítico' },
      { id: 'prudente', label: 'Prudente' },
      { id: 'disciplinado', label: 'Disciplinado' },
      { id: 'detalhista', label: 'Detalhista' },
    ],
  },
} as const

// Seção 4 — Autoanálise por Módulo LIDERA (8 módulos)
export type ModuloPessoalKey =
  | 'funcao_estrategica'
  | 'inteligencia_comportamental'
  | 'etica_responsabilidade'
  | 'gestao_geracional'
  | 'desenvolvimento_sucessao'
  | 'dados_ia'
  | 'senso_dono'
  | 'estrategia_carreira'

export const MODULOS_PESSOAL: Record<
  ModuloPessoalKey,
  { titulo: string; pergunta: string; opcoes: ChoicePickerOption[] }
> = {
  funcao_estrategica: {
    titulo: 'Módulo 1 — Função Estratégica',
    pergunta: 'Hoje você atua mais como:',
    opcoes: [
      { value: 'bombeiro', label: 'Bombeiro operacional' },
      { value: 'organizador', label: 'Organizador da equipe' },
      { value: 'estrategista', label: 'Estrategista' },
      { value: 'formador', label: 'Formador de líderes' },
    ],
  },
  inteligencia_comportamental: {
    titulo: 'Módulo 2 — Inteligência Comportamental',
    pergunta: 'Quando pressionado:',
    opcoes: [
      { value: 'emocional', label: 'Reajo emocionalmente' },
      { value: 'me_fecho', label: 'Me fecho' },
      { value: 'equilibrio', label: 'Mantenho equilíbrio' },
      { value: 'organizacao', label: 'Transformo pressão em organização' },
    ],
  },
  etica_responsabilidade: {
    titulo: 'Módulo 3 — Ética e Responsabilidade',
    pergunta: 'Você sente que sua equipe confia em você?',
    opcoes: [
      { value: 'pouco', label: 'Pouco' },
      { value: 'parcialmente', label: 'Parcialmente' },
      { value: 'muito', label: 'Muito' },
      { value: 'totalmente', label: 'Totalmente' },
    ],
  },
  gestao_geracional: {
    titulo: 'Módulo 4 — Gestão Geracional',
    pergunta: 'Você consegue lidar bem com pessoas de diferentes idades?',
    opcoes: [
      { value: 'muita_dificuldade', label: 'Tenho muita dificuldade' },
      { value: 'alguma', label: 'Alguma dificuldade' },
      { value: 'boa', label: 'Boa adaptação' },
      { value: 'excelente', label: 'Excelente adaptação' },
    ],
  },
  desenvolvimento_sucessao: {
    titulo: 'Módulo 5 — Desenvolvimento e Sucessão',
    pergunta: 'Hoje você prepara alguém para ocupar seu lugar?',
    opcoes: [
      { value: 'nao', label: 'Não' },
      { value: 'pouco', label: 'Pouco' },
      { value: 'sim', label: 'Sim' },
      { value: 'sucessores', label: 'Já tenho sucessores em desenvolvimento' },
    ],
  },
  dados_ia: {
    titulo: 'Módulo 6 — Dados e IA',
    pergunta: 'Você usa indicadores ou IA para melhorar decisões?',
    opcoes: [
      { value: 'nao_uso', label: 'Não uso' },
      { value: 'pouco', label: 'Uso pouco' },
      { value: 'moderado', label: 'Uso moderadamente' },
      { value: 'frequente', label: 'Uso frequentemente' },
    ],
  },
  senso_dono: {
    titulo: 'Módulo 7 — Senso de Dono',
    pergunta: 'Você age como dono da operação?',
    opcoes: [
      { value: 'raramente', label: 'Raramente' },
      { value: 'as_vezes', label: 'Às vezes' },
      { value: 'frequentemente', label: 'Frequentemente' },
      { value: 'constantemente', label: 'Constantemente' },
    ],
  },
  estrategia_carreira: {
    titulo: 'Módulo 8 — Estratégia de Carreira',
    pergunta: 'Você possui um plano claro de crescimento profissional?',
    opcoes: [
      { value: 'nao', label: 'Não' },
      { value: 'parcialmente', label: 'Parcialmente' },
      { value: 'sim', label: 'Sim' },
      { value: 'executando', label: 'Estou executando meu plano ativamente' },
    ],
  },
} as const

// Seção 5b — O que gostaria de desenvolver (12 itens, escala 1-5)
export const DESEJOS_DESENVOLVIMENTO = [
  { id: 'comunicacao', label: 'Comunicação' },
  { id: 'lideranca', label: 'Liderança' },
  { id: 'gestao_emocional', label: 'Gestão emocional' },
  { id: 'ia', label: 'Inteligência artificial' },
  { id: 'gestao_conflitos', label: 'Gestão de conflitos' },
  { id: 'organizacao', label: 'Organização' },
  { id: 'planejamento', label: 'Planejamento' },
  { id: 'gestao_pessoas', label: 'Gestão de pessoas' },
  { id: 'seguranca_psicologica', label: 'Segurança psicológica' },
  { id: 'visao_estrategica', label: 'Visão estratégica' },
  { id: 'gestao_indicadores', label: 'Gestão de indicadores' },
  { id: 'formacao_sucessores', label: 'Formação de sucessores' },
] as const

// Seção 6 — Radar de Desenvolvimento (10 pilares, escala 0-10)
export const PILARES_RADAR = [
  { id: 'emocional', label: 'Emocional' },
  { id: 'familiar', label: 'Familiar' },
  { id: 'social', label: 'Social' },
  { id: 'profissional', label: 'Profissional' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'saude', label: 'Saúde' },
  { id: 'intelectual', label: 'Intelectual' },
  { id: 'espiritual', label: 'Espiritual' },
  { id: 'lideranca', label: 'Liderança' },
  { id: 'equilibrio', label: 'Equilíbrio vida/trabalho' },
] as const
