// Tipos do PDI gerado e armazenado em personal_diagnostics.pdi.generated (JSONB).

import type { NivelLiderId } from './pdi-knowledge/niveis-lider'

export type PdiConvergenciaPoint = {
  analise: string
  percepcaoPessoal: string
  percepcaoExterna: string
  convergencia: 'Alta' | 'Média' | 'Baixa'
  comentario: string
}

export type PdiAcao = {
  descricao: string
  ferramentaId: string
  comoExecutar: string
}

export type PdiFase = {
  numero: number
  titulo: string
  periodo: string
  objetivo: string
  acoes: PdiAcao[]
  kpiSucesso: string
  // Módulo do treinamento LIDERA que esta fase ataca (ex: "Módulo 2 — Inteligência Comportamental").
  // Opcional para retro-compatibilidade (PDIs antigos sem este campo).
  moduloLidera?: string
}

export type PdiProximoPasso = {
  titulo: string
  descricao: string
}

export type PdiReferencia = {
  // ID da literatura na knowledge base. Componente busca metadados completos.
  literaturaId: string
  // Justificativa: por que este livro foi escolhido para este PDI específico.
  porQueLer: string
}

export type PdiReport = {
  convergencia: {
    resumo: string
    pontos: PdiConvergenciaPoint[]
  }
  fases: PdiFase[]
  proximosPassos: PdiProximoPasso[]
  notaCritica: string
  classificacao: {
    atual: NivelLiderId
    alvo90Dias: NivelLiderId
  }
  // Referências bibliográficas que fundamentam este PDI (3-5 livros).
  // Opcional para retro-compatibilidade (PDIs antigos sem este campo).
  referencias?: PdiReferencia[]
  // Metadados de geração
  meta: {
    generatedAt: string
    // 'nvidia-nim' fica para os PDIs antigos já gravados no banco.
    provider: 'anthropic' | 'nvidia' | 'nvidia-nim' | 'rule-based-fallback'
    model?: string
    promptTokens?: number
    completionTokens?: number
    latencyMs?: number
    version: string
  }
}
