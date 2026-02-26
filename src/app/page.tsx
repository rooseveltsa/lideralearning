import { createClient } from '@/lib/supabase/server'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, TrendingUp, ShieldCheck, PlayCircle, Users2 } from 'lucide-react'

// ─── Dados de Copywriting de Alta Conversão ─────────────────────────────────

const dores = [
  {
    titulo: 'Crescimento Desordenado',
    descricao: 'Sua empresa escala, a operação infla, mas a linha de frente de gestão não suporta a pressão. O resultado é gargalo operacional.',
  },
  {
    titulo: 'Custo Oculto da Incompetência',
    descricao: 'Promover um excelente técnico sem método de gestão não gera um líder; gera a frustração e o turnover dos seus melhores talentos.',
  },
  {
    titulo: 'Eficácia vs. Motivação',
    descricao: 'O mercado corporativo não precisa de mais treinamentos motivacionais. Precisa de frameworks de execução implacáveis.',
  },
]

const diferenciais = [
  { icon: ShieldCheck, titulo: 'Metodologia de Trincheira', descricao: 'Nada de teorias acadêmicas obsoletas. Ensinamos gestão com base no que funciona hoje, no mercado brasileiro real.' },
  { icon: Users2, titulo: 'Grupos Ultra-Focados', descricao: 'Não somos uma plataforma de aulas gravadas para as massas. Somos uma consultoria de desenvolvimento de elites.' },
  { icon: TrendingUp, titulo: 'Impacto Mensurável', descricao: 'Cada programa é desenhado para retornar o investimento em até 90 dias através de retenção, eficiência e processos.' },
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: cursos } = await supabase
    .from('courses')
    .select('id, title, description, price, thumbnail_url')
    .eq('is_published', true)
    .limit(3)

  return (
    <div className="bg-[#FFFFFF] text-[#111827] selection:bg-[#1565C0]/20">
      <SiteHeader />

      {/* ══════════════════════════════
          HERO SECTION - STRIPE/APPLE STYLE
      ══════════════════════════════ */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden bg-white">
        {/* Elementos de fundo sutil para não parecer vazio (Escondidos no mobile para evitar bug WebKit canvas blur) */}
        <div className="hidden md:block absolute top-0 right-0 w-[800px] h-[800px] bg-[#1565C0]/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="hidden md:block absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#4CAF35]/[0.02] rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1565C0]/5 text-[#1565C0] text-sm font-semibold mb-8 animate-fade-up border border-[#1565C0]/10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1565C0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1565C0]"></span>
            </span>
            Nova Formação Executiva
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5rem] tracking-tight font-heading font-extrabold text-[#111827] leading-[1.05] mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
            Transformamos chefes operacionais em <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#4CAF35]">
              Líderes de Alto Impacto.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#64748B] max-w-[800px] mx-auto leading-relaxed mb-12 animate-fade-up font-light" style={{ animationDelay: '200ms' }}>
            Empresas perdem milhões promovendo seus melhores técnicos sem prepará-los para a gestão. Entregamos o método prático para que sua liderança pare de apagar incêndios e passe a escalar a margem de lucro da sua operação.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-up" style={{ animationDelay: '300ms' }}>
            <Link
              href="/cursos"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#111827] text-white font-semibold rounded-xl hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1565C0]/20 transition-all duration-300 transform hover:-translate-y-0.5 text-lg"
            >
              Conhecer as Formações
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#E5E7EB] text-[#111827] font-semibold rounded-xl hover:border-[#111827] transition-all duration-300 text-lg"
            >
              <PlayCircle className="h-5 w-5 text-[#64748B]" />
              Falar com Consultor
            </a>
          </div>
        </div>

        {/* Dashboard Preview / Elemento de Autoridade (Visual) */}
        <div className="max-w-[1000px] mx-auto mt-24 relative animate-fade-up" style={{ animationDelay: '500ms' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white z-10" />
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl overflow-hidden p-2">
            <div className="rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E5E7EB]">
              {/* Fake UI Header */}
              <div className="h-12 border-b border-[#E5E7EB] bg-white flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="mx-auto bg-[#F8FAFC] rounded flex items-center justify-center text-[10px] text-[#64748B] px-3 py-1 font-mono">
                  Lidera Plataforma Corporativa
                </div>
              </div>
              {/* Fake UI Body (Image placeholder that looks like a platform) */}
              <div className="h-[400px] bg-gradient-to-br from-[#F8FAFC] to-[#EEF3FB] relative flex items-center justify-center p-8">
                <div className="w-full h-full border border-dashed border-[#CBD5E1] rounded-lg bg-white/50 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-[#1565C0] opacity-50" />
                  </div>
                  <p className="text-[#64748B] font-medium font-heading">Nossa Tecnologia Proprietária de Avaliação 360º</p>
                  <p className="text-sm text-[#94A3B8] max-w-sm mt-2">Acompanhe a evolução do seu gestor em tempo real através do painel corporativo Lidera.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          MÉTRICAS (SOCIAL PROOF)
      ══════════════════════════════ */}
      <section className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1200px] mx-auto px-6">
          <p className="text-center text-sm font-bold tracking-widest text-[#64748B] uppercase mb-10">Métricas que comprovam nossa eficácia</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#E5E7EB]">
            {[
              { num: '5.000+', label: 'Líderes formados' },
              { num: '200+', label: 'Empresas clientes' },
              { num: '98%', label: 'Índice de Retenção' },
              { num: '12', label: 'Anos de Método Prático' }
            ].map((metric, i) => (
              <div key={i} className={`flex flex-col items-center justify-center ${i === 0 ? '' : 'pl-8'}`}>
                <span className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-2">{metric.num}</span>
                <span className="text-sm text-[#64748B] font-medium">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          A DOR (IDENTIFICAÇÃO)
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] leading-tight mb-6">
                A média gestão brasileira assumiu um cargo para o qual <span className="text-[#EF4444]">nunca</span> foi treinada.
              </h2>
              <p className="text-xl text-[#64748B] leading-relaxed mb-8">
                As empresas perdem milhões anualmente promovendo técnicos excelentes para serem gestores medianos. Sem método de liderança, a engrenagem da empresa para.
              </p>
              <ul className="space-y-4">
                {[
                  'Turnover altíssimo na base de operação',
                  'Gestor que só sabe apagar incêndios diários',
                  'Estratégia que nunca é executada na ponta'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium text-[#111827]">
                    <div className="w-6 h-6 rounded-full bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {dores.map((dor, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-heading font-bold text-[#111827] mb-3">{dor.titulo}</h3>
                  <p className="text-[#64748B] leading-relaxed">{dor.descricao}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          SOLUÇÃO (CURSOS)
      ══════════════════════════════ */}
      {cursos && cursos.length > 0 && (
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6">
                O Antídoto: Nossos Programas de Formação
              </h2>
              <p className="text-xl text-[#64748B] leading-relaxed">
                Desenhamos trilhas específicas para capacitar seu líder com ferramentas que ele usa já na segunda-feira.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {cursos.map((curso) => (
                <Link key={curso.id} href={`/curso/${curso.id}`} className="group flex flex-col bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#1565C0] hover:shadow-xl hover:shadow-[#1565C0]/10 transition-all duration-300">
                  <div className="h-56 bg-[#F8FAFC] relative overflow-hidden border-b border-[#E5E7EB]">
                    {curso.thumbnail_url ? (
                      <img
                        src={curso.thumbnail_url}
                        alt={curso.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-heading font-bold text-[100px] text-[#E5E7EB] leading-none opacity-50 select-none">
                          {curso.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-heading font-bold text-[#111827] mb-4 group-hover:text-[#1565C0] transition-colors leading-tight">
                      {curso.title}
                    </h3>
                    <p className="text-[#64748B] mb-8 line-clamp-3 leading-relaxed flex-grow">
                      {curso.description}
                    </p>

                    <div className="pt-6 border-t border-[#E5E7EB] mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">Acesso Imediato</span>
                          <span className="text-xl font-extrabold text-[#111827]">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(curso.price)}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F8FAFC] flex items-center justify-center group-hover:bg-[#1565C0] group-hover:text-white text-[#111827] transition-all">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════
          DIFERENCIAIS (B2B FOCUS)
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#0B0F19] text-white overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-8 leading-tight">
                Escute: Metodologia teórica <span className="text-[#1E88E5]">não suporta</span> a pressão diária do Corporate.
              </h2>
              <p className="text-xl text-[#94A3B8] leading-relaxed mb-10">
                Nosso formato é baseado em vivência executiva real. Ensinamos seu gestor a delegar, cobrar, avaliar e reter talento na prática. Sem firulas, direto ao ponto.
              </p>

              <div className="space-y-6">
                {diferenciais.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#1E88E5]/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-[#1E88E5]" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1">{item.titulo}</h4>
                      <p className="text-[#94A3B8] leading-relaxed">{item.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* B2B Callout Box */}
            <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-10 md:p-12 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#1E88E5]/10 rounded-full blur-[60px]" />

              <h3 className="text-3xl font-heading font-bold mb-4 relative z-10">Para a sua Empresa (B2B)</h3>
              <p className="text-[#94A3B8] mb-8 relative z-10 leading-relaxed text-lg">
                Eleve a maturidade de gestão da sua diretoria à coordenação. Construímos academias de liderança in-company ou entregamos nossa plataforma corporativa whitelabel para o seu RH gerir.
              </p>

              <ul className="space-y-4 mb-10 relative z-10">
                {[
                  'Dashboard de Acompanhamento (RH)',
                  'Certificação Personalizada Lidera',
                  'Onboarding Dedicado'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium">
                    <CheckCircle2 className="h-5 w-5 text-[#4CAF35]" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/empresas"
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-[#1E88E5] hover:bg-[#1565C0] text-white font-bold rounded-xl transition-colors text-lg relative z-10"
              >
                Falar com Executivo B2B
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════
          BOTTOM CTA
      ══════════════════════════════ */}
      <section className="py-24 md:py-32 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-[#111827] leading-tight mb-8">
            Sua liderança não pode esperar outra crise para evoluir.
          </h2>
          <p className="text-xl text-[#64748B] mb-12 leading-relaxed">
            Seja um aluno individual buscando promoção ou uma empresa querendo blindar sua operação. A mudança começa com a capacitação técnica certa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#111827] text-white border-2 border-[#111827] font-semibold rounded-xl hover:bg-[#1565C0] hover:border-[#1565C0] transition-all text-lg"
            >
              Criar Conta Gratuita
            </Link>
            <Link
              href="/cursos"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#111827] border-2 border-[#E5E7EB] font-semibold rounded-xl hover:border-[#111827] transition-all text-lg"
            >
              Ver Catálogo Completo
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}
