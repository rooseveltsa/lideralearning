// Dados estáticos do Formulário 1 — Avaliação Empresarial de Supervisor.
// Fonte de verdade das listas (competências, comportamentos DISC, módulos, expectativas).
// Editável sem precisar mexer no componente.

import type { ChoicePickerOption } from '@/components/diagnostico/ui/ChoicePicker'

// Seção 2 — Perfil de Liderança Esperado (20 competências, escala 1-5)
export const COMPETENCIAS_LIDERANCA = [
  { id: 'organizacao', label: 'Organização' },
  { id: 'comunicacao_clara', label: 'Comunicação clara' },
  { id: 'inteligencia_emocional', label: 'Inteligência emocional' },
  { id: 'postura_etica', label: 'Postura ética' },
  { id: 'gestao_conflitos', label: 'Gestão de conflitos' },
  { id: 'lideranca_exemplo', label: 'Liderança pelo exemplo' },
  { id: 'disciplina', label: 'Disciplina' },
  { id: 'planejamento', label: 'Planejamento' },
  { id: 'tomada_decisao', label: 'Tomada de decisão' },
  { id: 'foco_resultado', label: 'Foco em resultado' },
  { id: 'desenvolvimento_pessoas', label: 'Desenvolvimento de pessoas' },
  { id: 'gestao_indicadores', label: 'Gestão de indicadores' },
  { id: 'seguranca_operacional', label: 'Segurança operacional' },
  { id: 'adaptabilidade', label: 'Adaptabilidade' },
  { id: 'tecnologia_ia', label: 'Uso de tecnologia e IA' },
  { id: 'capacidade_analitica', label: 'Capacidade analítica' },
  { id: 'senso_dono', label: 'Senso de dono' },
  { id: 'capacidade_delegar', label: 'Capacidade de delegar' },
  { id: 'formacao_sucessores', label: 'Formação de sucessores' },
  { id: 'resiliencia', label: 'Resiliência sob pressão' },
] as const

// Seção 3 — Perfil Comportamental DISC (20 traços, escala 1-5)
export const DISC_TRAITS = {
  D: {
    label: 'Dominância (D)',
    description: 'Decisivo, competitivo, focado em metas',
    color: '#EF4444',
    items: [
      { id: 'decisivo', label: 'Decisivo' },
      { id: 'competitivo', label: 'Competitivo' },
      { id: 'executor', label: 'Executor' },
      { id: 'assertivo', label: 'Assertivo' },
      { id: 'focado_metas', label: 'Focado em metas' },
    ],
  },
  I: {
    label: 'Influência (I)',
    description: 'Comunicativo, motivador, sociável',
    color: '#F59E0B',
    items: [
      { id: 'comunicativo', label: 'Comunicativo' },
      { id: 'motivador', label: 'Motivador' },
      { id: 'persuasivo', label: 'Persuasivo' },
      { id: 'inspirador', label: 'Inspirador' },
      { id: 'sociavel', label: 'Sociável' },
    ],
  },
  S: {
    label: 'Estabilidade (S)',
    description: 'Paciente, colaborativo, confiável',
    color: '#22C55E',
    items: [
      { id: 'paciente', label: 'Paciente' },
      { id: 'colaborativo', label: 'Colaborativo' },
      { id: 'confiavel', label: 'Confiável' },
      { id: 'equilibrado', label: 'Equilibrado' },
      { id: 'persistente', label: 'Persistente' },
    ],
  },
  C: {
    label: 'Conformidade (C)',
    description: 'Analítico, organizado, detalhista',
    color: '#1565C0',
    items: [
      { id: 'analitico', label: 'Analítico' },
      { id: 'organizado', label: 'Organizado' },
      { id: 'detalhista', label: 'Detalhista' },
      { id: 'disciplinado', label: 'Disciplinado' },
      { id: 'prudente', label: 'Prudente' },
    ],
  },
} as const

// Seção 4 — Diagnóstico Atual da Liderança (15 temas, escala 1-5)
export const DESAFIOS_ATUAIS = [
  { id: 'comunicacao', label: 'Comunicação' },
  { id: 'engajamento', label: 'Engajamento da equipe' },
  { id: 'turnover', label: 'Turnover' },
  { id: 'disciplina_operacional', label: 'Disciplina operacional' },
  { id: 'seguranca', label: 'Segurança' },
  { id: 'conflitos_internos', label: 'Conflitos internos' },
  { id: 'delegacao', label: 'Delegação' },
  { id: 'falta_autonomia', label: 'Falta de autonomia da equipe' },
  { id: 'retrabalho', label: 'Retrabalho' },
  { id: 'gestao_emocional', label: 'Gestão emocional' },
  { id: 'resistencia_mudanca', label: 'Resistência à mudança' },
  { id: 'gestao_geracoes', label: 'Gestão de gerações' },
  { id: 'planejamento', label: 'Planejamento' },
  { id: 'organizacao', label: 'Organização' },
  { id: 'uso_dados', label: 'Uso de dados/indicadores' },
] as const

// Seção 5 — Módulos LIDERA (8 módulos, choice única)
export type ModuloKey =
  | 'funcao_estrategica'
  | 'inteligencia_comportamental'
  | 'etica_responsabilidade'
  | 'gestao_geracional'
  | 'sucessao_desenvolvimento'
  | 'dados_ia'
  | 'padroes_senso_dono'
  | 'estrategia_carreira'

export const MODULOS_LIDERA: Record<
  ModuloKey,
  { titulo: string; pergunta: string; opcoes: ChoicePickerOption[] }
> = {
  funcao_estrategica: {
    titulo: 'Módulo 1 — Função Estratégica',
    pergunta: 'O supervisor atual atua mais como:',
    opcoes: [
      { value: 'executor', label: 'Executor operacional' },
      { value: 'facilitador', label: 'Facilitador da equipe' },
      { value: 'estrategista', label: 'Estrategista' },
      { value: 'desenvolvedor', label: 'Desenvolvedor de pessoas' },
    ],
  },
  inteligencia_comportamental: {
    titulo: 'Módulo 2 — Inteligência Comportamental',
    pergunta: 'Como o supervisor reage sob pressão?',
    opcoes: [
      { value: 'impulsivo', label: 'Impulsivamente' },
      { value: 'equilibrado', label: 'De forma equilibrada' },
      { value: 'evita_conflitos', label: 'Evita conflitos' },
      { value: 'inteligencia_emocional', label: 'Atua com inteligência emocional' },
    ],
  },
  etica_responsabilidade: {
    titulo: 'Módulo 3 — Ética e Responsabilidade',
    pergunta: 'O supervisor transmite confiança e coerência?',
    opcoes: [
      { value: 'raramente', label: 'Raramente' },
      { value: 'as_vezes', label: 'Às vezes' },
      { value: 'frequentemente', label: 'Frequentemente' },
      { value: 'consistentemente', label: 'Consistentemente' },
    ],
  },
  gestao_geracional: {
    titulo: 'Módulo 4 — Gestão Geracional',
    pergunta: 'O supervisor consegue lidar bem com diferentes gerações?',
    opcoes: [
      { value: 'nao', label: 'Não' },
      { value: 'parcialmente', label: 'Parcialmente' },
      { value: 'sim', label: 'Sim' },
      { value: 'excelencia', label: 'Com excelência' },
    ],
  },
  sucessao_desenvolvimento: {
    titulo: 'Módulo 5 — Sucessão e Desenvolvimento',
    pergunta: 'Existe formação de novos líderes?',
    opcoes: [
      { value: 'nao_existe', label: 'Não existe' },
      { value: 'muito_pouco', label: 'Muito pouco' },
      { value: 'em_desenvolvimento', label: 'Em desenvolvimento' },
      { value: 'estruturado', label: 'Estruturado' },
    ],
  },
  dados_ia: {
    titulo: 'Módulo 6 — Dados e IA',
    pergunta: 'O supervisor utiliza indicadores e tecnologia nas decisões?',
    opcoes: [
      { value: 'nao_utiliza', label: 'Não utiliza' },
      { value: 'pouco', label: 'Pouco' },
      { value: 'moderadamente', label: 'Moderadamente' },
      { value: 'frequentemente', label: 'Frequentemente' },
    ],
  },
  padroes_senso_dono: {
    titulo: 'Módulo 7 — Padrões e Senso de Dono',
    pergunta: 'O supervisor demonstra visão de dono?',
    opcoes: [
      { value: 'nao', label: 'Não' },
      { value: 'parcialmente', label: 'Parcialmente' },
      { value: 'sim', label: 'Sim' },
      { value: 'referencia', label: 'É referência nisso' },
    ],
  },
  estrategia_carreira: {
    titulo: 'Módulo 8 — Estratégia de Carreira',
    pergunta: 'A empresa vê potencial de crescimento neste profissional?',
    opcoes: [
      { value: 'nao', label: 'Não' },
      { value: 'moderado', label: 'Potencial moderado' },
      { value: 'alto', label: 'Alto potencial' },
      { value: 'estrategico', label: 'Potencial para cargos estratégicos' },
    ],
  },
} as const

// Seção 6 — Expectativas (10 itens, escala 1-5)
export const EXPECTATIVAS_RESULTADOS = [
  { id: 'produtividade', label: 'Melhorar produtividade' },
  { id: 'turnover', label: 'Reduzir turnover' },
  { id: 'clima', label: 'Melhorar clima' },
  { id: 'seguranca', label: 'Melhorar segurança' },
  { id: 'retrabalho', label: 'Reduzir retrabalho' },
  { id: 'sucessores', label: 'Desenvolver sucessores' },
  { id: 'comunicacao', label: 'Melhorar comunicação' },
  { id: 'indicadores', label: 'Melhorar indicadores' },
  { id: 'lideranca_estrategica', label: 'Desenvolver liderança estratégica' },
  { id: 'relacionamento', label: 'Melhorar relacionamento entre setores' },
] as const
