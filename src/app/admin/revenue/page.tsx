import { createAdminClient } from '@/lib/supabase/service'
import { BadgeDollarSign, CreditCard, TrendingUp, Users } from 'lucide-react'
import Link from 'next/link'

type PaymentRow = {
  id: string
  amount: number
  currency: string
  status: string
  provider: string
  created_at: string
  order_id: string | null
}

type EnrollmentRow = {
  id: string
  status: string
  created_at: string
}

type LeadRow = {
  id: string
  status: string
  created_at: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default async function RevenueDashboard() {
  const admin = createAdminClient()

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

  const [
    { data: allPayments },
    { data: monthPayments },
    { data: lastMonthPayments },
    { data: enrollments },
    { data: leads },
    { data: recentPayments },
  ] = await Promise.all([
    admin.from('payments').select('id, amount, currency, status, provider, created_at, order_id').eq('status', 'succeeded'),
    admin.from('payments').select('id, amount').eq('status', 'succeeded').gte('created_at', startOfMonth),
    admin.from('payments').select('id, amount').eq('status', 'succeeded').gte('created_at', startOfLastMonth).lte('created_at', endOfLastMonth),
    admin.from('enrollments').select('id, status, created_at'),
    admin.from('b2b_leads').select('id, status, created_at'),
    admin.from('payments').select('id, amount, currency, status, provider, created_at, order_id').eq('status', 'succeeded').order('created_at', { ascending: false }).limit(10),
  ])

  const totalRevenue = (allPayments as PaymentRow[] | null)?.reduce((sum, p) => sum + p.amount, 0) || 0
  const monthRevenue = (monthPayments as { amount: number }[] | null)?.reduce((sum, p) => sum + p.amount, 0) || 0
  const lastMonthRevenue = (lastMonthPayments as { amount: number }[] | null)?.reduce((sum, p) => sum + p.amount, 0) || 0
  const activeEnrollments = (enrollments as EnrollmentRow[] | null)?.filter(e => e.status === 'active').length || 0
  const totalLeads = (leads as LeadRow[] | null)?.length || 0
  const wonLeads = (leads as LeadRow[] | null)?.filter(l => l.status === 'won').length || 0

  const monthGrowth = lastMonthRevenue > 0
    ? (((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(0)
    : monthRevenue > 0 ? '+100' : '0'

  return (
    <div className="min-h-screen bg-[#F7FAFD] px-6 py-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Revenue Dashboard</h1>
            <p className="mt-1 text-sm text-[#64748B]">Visão financeira da plataforma</p>
          </div>
          <Link
            href="/admin"
            className="rounded-xl border border-[#D8E2EF] bg-white px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F4F8FC]"
          >
            Voltar ao Admin
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <BadgeDollarSign className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Receita Total</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TrendingUp className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Receita Mês Atual</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">{formatCurrency(monthRevenue)}</p>
                <p className={`text-xs font-bold ${Number(monthGrowth) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {Number(monthGrowth) >= 0 ? '+' : ''}{monthGrowth}% vs mês anterior
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Matrículas Ativas</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">{activeEnrollments}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <CreditCard className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#64748B]">Leads B2B</p>
                <p className="text-2xl font-extrabold text-[#0F172A]">{totalLeads}</p>
                <p className="text-xs font-bold text-green-600">{wonLeads} convertidos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Payments Table */}
        <div className="rounded-2xl border border-[#D8E2EF] bg-white p-6">
          <h2 className="mb-4 text-lg font-extrabold text-[#0F172A]">Últimos Pagamentos</h2>
          {(recentPayments as PaymentRow[] | null)?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5ECF6] text-xs font-bold uppercase tracking-wide text-[#64748B]">
                    <th className="pb-3 pr-4">Data</th>
                    <th className="pb-3 pr-4">Valor</th>
                    <th className="pb-3 pr-4">Provider</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Order ID</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentPayments as PaymentRow[]).map((p) => (
                    <tr key={p.id} className="border-b border-[#F1F5F9] last:border-0">
                      <td className="py-3 pr-4 font-medium text-[#0F172A]">{formatDate(p.created_at)}</td>
                      <td className="py-3 pr-4 font-bold text-green-600">{formatCurrency(p.amount)}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                          p.provider === 'stripe' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {p.provider}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-[#94A3B8]">{p.order_id?.slice(0, 8) || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-[#94A3B8]">Nenhum pagamento registrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  )
}
