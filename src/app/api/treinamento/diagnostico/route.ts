import { NextResponse } from 'next/server'

import { createAdminClient } from '@/lib/supabase/service'

function normalize(value: unknown) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export async function POST(request: Request) {
  let json: Record<string, any>

  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  const nomeCompleto = normalize(json.identificacao?.nomeCompleto)
  const cargoAtual = normalize(json.identificacao?.cargoAtual)

  if (!nomeCompleto || !cargoAtual) {
    return NextResponse.json({ error: 'Nome e cargo são obrigatórios.' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data, error } = await admin
    .from('leadership_diagnostics')
    .insert({
      full_name: nomeCompleto,
      role: cargoAtual,
      time_in_role: normalize(json.identificacao?.tempoFuncao) || null,
      department: normalize(json.identificacao?.departamento) || null,
      reflection_vision: normalize(json.reflexao?.visaoTempo) || null,
      reflection_decisions: normalize(json.reflexao?.tomadaDecisao) || null,
      reflection_autonomy: normalize(json.reflexao?.autonomiaTime) || null,
      dim_facilitator: json.dimensoes?.facilitador ?? null,
      dim_advisor: json.dimensoes?.orientador ?? null,
      dim_guarantor: json.dimensoes?.garantidor ?? null,
      dim_strategist: json.dimensoes?.estrategista ?? null,
      dim_mentor: json.dimensoes?.mentor ?? null,
      maturity_structured_data: !!json.maturidade?.usoDadosEstruturados,
      maturity_ai_prompts: !!json.maturidade?.promptsMagicos,
      maturity_root_cause: !!json.maturidade?.analiseCausaRaiz,
      maturity_anonymization: !!json.maturidade?.anonimizacaoDados,
      maturity_success_patterns: !!json.maturidade?.padroesSuccesso,
      maturity_so_what: normalize(json.maturidade?.soWhat) || null,
      eia_event: normalize(json.gestao?.eiaEvento) || null,
      eia_impact: normalize(json.gestao?.eiaImpacto) || null,
      eia_action: normalize(json.gestao?.eiaAcao) || null,
      team_quadrant: json.gestao?.quadrante ?? null,
      commitment_behavior: normalize(json.plano?.compromisso1) || null,
      commitment_data: normalize(json.plano?.compromisso2) || null,
      commitment_succession: normalize(json.plano?.compromisso3) || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error inserting leadership diagnostic:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, diagnosticId: data.id })
}
