import { redirect } from 'next/navigation'
import { Gift, Link2, Share2, TrendingUp, Users } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default async function IndicacoesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const admin = createAdminClient()

  // Get or create referral code
  const { data: referralCode } = await admin
    .from('referral_codes')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  const tableMissing = !referralCode

  // Get referrals
  const { data: referrals } = referralCode
    ? await admin
        .from('referrals')
        .select('id, status, commission_amount, referred_email, created_at')
        .eq('referral_code_id', (referralCode as { id: string }).id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const code = (referralCode as { code?: string } | null)?.code || 'LDR-XXXXXX'
  const totalReferrals = (referralCode as { total_referrals?: number } | null)?.total_referrals || 0
  const totalEarnings = (referralCode as { total_earnings?: number } | null)?.total_earnings || 0
  const commissionPercent = (referralCode as { commission_percent?: number } | null)?.commission_percent || 10

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lideralearning.vercel.app'
  const referralLink = `${siteUrl}?ref=${code}`

  return (
    <div className="min-h-screen bg-[#F7FAFD] px-6 py-8">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Programa de Indicações</h1>
          <p className="mt-1 text-sm text-[#64748B]">
            Indique colegas e ganhe {commissionPercent}% de comissão em cada compra
          </p>
        </div>

        {tableMissing && (
          <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
            <p className="text-sm font-bold text-amber-800">Programa de indicações em implantação.</p>
            <p className="mt-1 text-sm text-amber-700">Execute <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs">docs/database/18_referral_program.sql</code> no Supabase para ativar.</p>
          </div>
        )}

        {/* Referral Link Card */}
        <div className="mb-6 rounded-2xl border border-[#1565C0]/20 bg-[#ECF3FC] p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-[#0B4A8F]">
            <Link2 className="h-4 w-4" />
            Seu link de indicação
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              readOnly
              value={referralLink}
              className="flex-1 rounded-xl border border-[#D8E2EF] bg-white px-4 py-3 text-sm font-medium text-[#0F172A]"
            />
            <button className="inline-flex items-center gap-2 rounded-xl bg-[#1E88E5] px-5 py-3 text-sm font-bold text-white hover:bg-[#1565C0]">
              <Share2 className="h-4 w-4" />
              Copiar
            </button>
          </div>
          <p className="mt-2 text-xs text-[#475569]">
            Código: <span className="font-bold">{code}</span> — Comissão: <span className="font-bold">{commissionPercent}%</span>
          </p>
        </div>

        {/* KPI Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <Users className="mb-2 h-5 w-5 text-[#1E88E5]" />
            <p className="text-2xl font-extrabold text-[#0F172A]">{totalReferrals}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Indicações convertidas</p>
          </div>
          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <TrendingUp className="mb-2 h-5 w-5 text-green-600" />
            <p className="text-2xl font-extrabold text-[#0F172A]">{formatCurrency(totalEarnings)}</p>
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Ganhos totais</p>
          </div>
          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <Gift className="mb-2 h-5 w-5 text-purple-600" />
            <p className="text-2xl font-extrabold text-[#0F172A]">{commissionPercent}%</p>
            <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Comissão por venda</p>
          </div>
        </div>

        {/* Referral History */}
        <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
          <h2 className="mb-4 text-lg font-extrabold text-[#0F172A]">Histórico de Indicações</h2>
          {(referrals || []).length === 0 ? (
            <p className="text-sm text-[#94A3B8]">
              Nenhuma indicação ainda. Compartilhe seu link para começar a ganhar!
            </p>
          ) : (
            <div className="space-y-2">
              {(referrals as { id: string; status: string; commission_amount: number | null; referred_email: string | null; created_at: string }[]).map((ref) => (
                <div key={ref.id} className="flex items-center justify-between rounded-xl border border-[#E5ECF6] bg-[#F7FAFE] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{ref.referred_email || 'Pendente'}</p>
                    <p className="text-xs text-[#64748B]">
                      {new Date(ref.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                      ref.status === 'converted' ? 'bg-green-50 text-green-700' :
                      ref.status === 'signed_up' ? 'bg-blue-50 text-blue-700' :
                      ref.status === 'paid_out' ? 'bg-purple-50 text-purple-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {ref.status === 'converted' ? 'Convertido' :
                       ref.status === 'signed_up' ? 'Cadastrado' :
                       ref.status === 'paid_out' ? 'Pago' : 'Pendente'}
                    </span>
                    {ref.commission_amount && (
                      <p className="mt-1 text-xs font-bold text-green-600">{formatCurrency(ref.commission_amount)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
