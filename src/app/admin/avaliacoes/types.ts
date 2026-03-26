// ---------------------------------------------------------------------------
// Shared types for Avaliacoes page and client
// ---------------------------------------------------------------------------

export type SelfAssessment = {
  id: string
  user_id: string
  perfil_lideranca: string
  pontuacao_total: number
  q_percepcao: number | null
  q_gestao: number | null
  q_comunicacao: number | null
  q_tecnologia: number | null
  q_etica: number | null
  q_dor: number | null
  texto_dor_atual: string | null
  texto_custo_futuro: string | null
  created_at: string
}

export type ExecAssessment = {
  id: string
  user_id: string
  supervisor_user_id: string | null
  nome_supervisor: string
  cargo_supervisor: string | null
  nome_avaliador: string | null
  nome_empresa: string | null
  media_dimensoes: number | null
  pdi_type: string | null
  dim_comunicacao: number | null
  dim_tomada_decisao: number | null
  dim_gestao_equipe: number | null
  dim_orientacao_resultados: number | null
  dim_adaptabilidade: number | null
  dim_lideranca_estrategica: number | null
  dim_desenvolvimento_pessoas: number | null
  dim_inovacao: number | null
  dim_etica_integridade: number | null
  dim_gestao_crise: number | null
  ponto_forte: string | null
  area_melhoria: string | null
  impacto_equipe: string | null
  recomendacao: string | null
  comentario_adicional: string | null
  recomendacao_geral: string | null
  nivel_confianca: number | null
  created_at: string
}

export type PdiRow = {
  id: string
  user_id: string
  cargo: string | null
  dim_facilitador: number | null
  dim_orientador: number | null
  dim_garantidor: number | null
  dim_estrategista: number | null
  dim_mentor: number | null
  hs_execucao: number | null
  hs_processos: number | null
  hs_ferramentas: number | null
  hs_padroes: number | null
  ss_inteligencia_emocional: number | null
  ss_feedback: number | null
  ss_conflitos_geracionais: number | null
  ss_visao_futuro: number | null
  fase_atual: number | null
  compromisso_comportamento: string | null
  compromisso_dados: string | null
  compromisso_sucessao: string | null
  competencias_40: unknown
  texto_triade: string | null
  media_dimensoes: number | null
  created_at: string
}
