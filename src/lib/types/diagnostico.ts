// Tipos compartilhados dos diagnósticos (empresa + pessoal).

export type TipoDiagnostico = 'empresa' | 'pessoal'

export type EscalaImportancia = 1 | 2 | 3 | 4 | 5

export type EscalaPilar = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type DiscDimensao = 'D' | 'I' | 'S' | 'C'

// Form 1 — Empresa
export type IdentificacaoEmpresa = {
  empresa: string
  unidadeFilial: string
  segmento: string
  gestorNome: string
  gestorCargo: string
  supervisorNome: string
  supervisorCargo: string
  tempoNaFuncao: string
  qtdLiderados: number
  dataAvaliacao: string
}

export type PerfilLiderancaEsperado = Record<string, EscalaImportancia>

export type PerfilComportamentalDesejado = {
  D: Record<string, EscalaImportancia>
  I: Record<string, EscalaImportancia>
  S: Record<string, EscalaImportancia>
  C: Record<string, EscalaImportancia>
}

export type DiagnosticoAtualLideranca = Record<string, EscalaImportancia>

export type ModuloLidera = {
  funcaoEstrategica: string
  inteligenciaComportamental: string
  eticaResponsabilidade: string
  gestaoGeracional: string
  sucessaoDesenvolvimento: string
  dadosIA: string
  padroesSensoDono: string
  estrategiaCarreira: string
}

export type ExpectativaEmpresa = Record<string, EscalaImportancia>

export type EspacoAbertoEmpresa = {
  comportamentosFortalecer: string
  comportamentosEliminar: string
  oQueSeriaExcelente: string
}

export type Form1Data = {
  identificacao: IdentificacaoEmpresa
  perfilLiderancaEsperado: PerfilLiderancaEsperado
  perfilComportamentalDesejado: PerfilComportamentalDesejado
  diagnosticoAtual: DiagnosticoAtualLideranca
  modulos: ModuloLidera
  expectativas: ExpectativaEmpresa
  espacoAberto: EspacoAbertoEmpresa
}

// Form 2 — Pessoal
export type IdentificacaoProfissional = {
  nomeCompleto: string
  empresa: string
  cargo: string
  setor: string
  tempoNaFuncao: string
  qtdLiderados: number
  idade: number
  cidadeUF: string
  email: string
  data: string
}

export type AutoavaliacaoComportamental = Record<string, EscalaImportancia>

export type PerfilComportamentalPessoal = PerfilComportamentalDesejado

export type ReflexaoProfissional = {
  pontosFortes: string
  comportamentosPrejudicam: string
  desejaDesenvolver: Record<string, EscalaImportancia>
}

export type RadarDesenvolvimento = {
  emocional: EscalaPilar
  familiar: EscalaPilar
  social: EscalaPilar
  profissional: EscalaPilar
  financeiro: EscalaPilar
  saude: EscalaPilar
  intelectual: EscalaPilar
  espiritual: EscalaPilar
  lideranca: EscalaPilar
  equilibrio: EscalaPilar
}

export type PlanoDesenvolvimentoIndividual = {
  comportamentoEliminar: string
  habilidadeDesenvolver: string
  acaoProximos7Dias: string
  resultado90Dias: string
  quemPodeApoiar: string
}

export type AlinhamentoFinal = {
  oQueEmpresaEspera: string
  oQueEntregaMelhor: string
  ondeMaiorDesalinhamento: string
}

export type Form2Data = {
  identificacao: IdentificacaoProfissional
  autoavaliacao: AutoavaliacaoComportamental
  perfilComportamentalPessoal: PerfilComportamentalPessoal
  modulos: ModuloLidera
  reflexao: ReflexaoProfissional
  radar: RadarDesenvolvimento
  pdi: PlanoDesenvolvimentoIndividual
  alinhamento: AlinhamentoFinal
}
