// Dados estáticos do step "Objetivo de Carreira" — comum aos 2 forms.
// Versão pessoal: a própria pessoa diz onde quer chegar.
// Versão empresa: gestor projeta evolução do supervisor avaliado.

import type { ChoicePickerOption } from '@/components/diagnostico/ui/ChoicePicker'

// ───── PERFIL PESSOAL ─────

export const HORIZONTE_CARREIRA: ChoicePickerOption[] = [
  { value: '6_meses', label: 'Próximos 6 meses', description: 'Quero evoluir rápido, ano de inflexão' },
  { value: '1_ano', label: 'Em 1 ano', description: 'Movimento natural de crescimento' },
  { value: '2_3_anos', label: 'Entre 2 e 3 anos', description: 'Construção sólida, sem pressa' },
  { value: '5_mais_anos', label: '5 anos ou mais', description: 'Estabilidade primeiro, evolução depois' },
]

export const VELOCIDADE_DESEJADA: ChoicePickerOption[] = [
  { value: 'gradual', label: 'Gradual e sustentável', description: 'Sem comprometer minha saúde mental e familiar' },
  { value: 'acelerada', label: 'Acelerada', description: 'Estou disposto(a) a investir tempo extra' },
  { value: 'muito_acelerada', label: 'Muito acelerada', description: 'Quero mudar de patamar este ano' },
]

export const MOMENTO_VIDA: ChoicePickerOption[] = [
  { value: 'consolidacao', label: 'Buscando consolidação', description: 'Quero firmar onde estou antes de evoluir' },
  { value: 'transicao', label: 'Em transição', description: 'Mudança grande recente (cargo, cidade, vida pessoal)' },
  { value: 'expansao', label: 'Em expansão', description: 'Energia alta, momento de avançar' },
  { value: 'reinicio', label: 'Recomeço', description: 'Voltando após pausa ou mudança radical' },
]

// ───── PERFIL EMPRESA — perspectiva do gestor ─────

export const PROXIMO_PASSO_SUPERVISOR: ChoicePickerOption[] = [
  { value: 'mantem', label: 'Manter no cargo atual', description: 'Por ora, foco é amadurecer onde está' },
  { value: 'expansao_responsabilidade', label: 'Expandir responsabilidades', description: 'Mais liderados, mais áreas, ainda no mesmo cargo' },
  { value: 'promocao_curta', label: 'Promoção próxima', description: 'Coordenação, gerência de turno ou liderança de área em 6-12 meses' },
  { value: 'promocao_estrategica', label: 'Promoção estratégica', description: 'Caminho para cargo de gerência ou diretoria em 1-2 anos' },
  { value: 'sucessor_critico', label: 'Sucessor crítico', description: 'Estamos preparando para assumir posição de gestor sênior' },
]

export const PRAZO_EVOLUCAO_EMPRESA: ChoicePickerOption[] = [
  { value: 'urgente', label: 'Urgente (3-6 meses)', description: 'Empresa precisa dessa evolução agora' },
  { value: 'curto', label: 'Curto prazo (6-12 meses)', description: 'Movimento natural no próximo ciclo' },
  { value: 'medio', label: 'Médio prazo (1-2 anos)', description: 'Há tempo para construção' },
  { value: 'longo', label: 'Longo prazo (2+ anos)', description: 'Sem pressão de prazo' },
]

export const PLANO_SUCESSAO: ChoicePickerOption[] = [
  { value: 'nao_existe', label: 'Não existe', description: 'Esta pessoa não está em plano de sucessão' },
  { value: 'informal', label: 'Existe informalmente', description: 'Falamos do potencial mas não formalizamos' },
  { value: 'formal', label: 'Existe formalmente', description: 'Está em plano de sucessão estruturado' },
  { value: 'critico', label: 'Posição crítica', description: 'Se sair, a empresa sente impacto imediato' },
]
