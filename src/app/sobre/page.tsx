import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { Target, Heart, Rocket, Award, ChevronRight, BarChart, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const valores = [
    { icon: Target, titulo: 'Resultado Matemático', desc: 'Não vendemos motivação. Entregamos frameworks operacionais que reduzem custo e aumentam a margem de lucro através de pessoas.' },
    { icon: Heart, titulo: 'Capital Humano', desc: 'Acreditamos que o lucro é uma consequência natural de times bem geridos, psicologicamente seguros e tecnicamente desafiados.' },
    { icon: Rocket, titulo: 'Pragmatismo', desc: 'Metodologias aplicadas com o que há de mais atual no mercado. Sem "filosofia", apenas o que funciona na trincheira.' },
    { icon: Award, titulo: 'Padrão Elite', desc: 'Nossa régua é alta. Não admitimos mediania em nossos programas de imersão corporativa.' },
]

export default function SobrePage() {
    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#111827] selection:bg-[#1565C0]/20">
            <SiteHeader />

            {/* Hero / Manifesto */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                <div className="relative z-10 max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1565C0]/5 text-[#1565C0] text-sm font-semibold mb-6 border border-[#1565C0]/10">
                        Nossa História & Manifesto
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold mb-8 leading-[1.05] tracking-tight text-[#111827]">
                        Nascemos para resgatar a <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1565C0] to-[#4CAF35]">verdadeira gestão.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#64748B] leading-relaxed max-w-3xl mx-auto font-light">
                        A Lidera atua na perigosa lacuna entre a teoria acadêmica e a realidade prática corporativa brasileira.
                    </p>
                </div>
            </section>

            {/* Missão e O Problema */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-[#111827] mb-8 leading-tight tracking-tight">
                            Elevamos o padrão da gestão no cenário corporativo brasileiro.
                        </h2>
                        <div className="space-y-6 text-lg text-[#64748B] leading-relaxed">
                            <p>
                                O Brasil sofre com uma epidemia silenciosa: empresas perdem milhões anualmente promovendo técnicos excelentes para serem gestores medianos, sem nunca lhes dar as ferramentas de liderança necessárias.
                            </p>
                            <p>
                                Nossa missão é equipar esses profissionais com frameworks testados de alta performance. Entregamos programas que combinam metodologia de trincheira, tecnologia de retenção e uma abordagem obstinada por resultados.
                            </p>
                            <ul className="pt-4 space-y-4">
                                {['Método acima de Motivação', 'Prática acima de Teoria', 'Lucro como consequência de Pessoas'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 font-semibold text-[#111827]">
                                        <CheckCircle2 className="h-5 w-5 text-[#4CAF35]" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Founder Quote Card - High End */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#1E88E5]/5 to-[#4CAF35]/5 rounded-3xl blur-2xl" />
                        <div className="relative bg-white border border-[#E5E7EB] rounded-3xl p-10 md:p-14 shadow-2xl">
                            <div className="absolute top-10 left-10 text-[120px] font-serif text-[#F8FAFC] leading-none select-none z-0">
                                "
                            </div>
                            <blockquote className="relative z-10 text-2xl md:text-3xl text-[#111827] font-heading font-bold leading-tight mb-10">
                                "Liderança deixou de ser um cargo no organograma para se tornar a principal alavanca de retenção e lucro de uma companhia séria. É assumir o total desconforto de alinhar pessoas aos resultados."
                            </blockquote>
                            <div className="relative z-10 flex items-center gap-5 pt-8 border-t border-[#E5E7EB]">
                                <div className="w-16 h-16 rounded-full bg-[#0B0F19] flex items-center justify-center text-white text-xl font-bold font-heading">
                                    RM
                                </div>
                                <div>
                                    <p className="font-extrabold text-lg text-[#111827]">Roosevelt Miranda</p>
                                    <p className="text-[#64748B] font-medium">Fundador e CEO Lidera</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores - B2B Solid Approach */}
            <section className="py-24 px-6 bg-[#0B0F19] text-white">
                <div className="max-w-[1200px] mx-auto">
                    <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-xl">
                            <p className="text-[#1E88E5] font-bold tracking-wider uppercase text-sm mb-4">Princípios de Atuação</p>
                            <h2 className="text-4xl md:text-5xl font-heading font-extrabold leading-tight">
                                O que consideramos inegociável na Lidera.
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {valores.map(({ icon: Icon, titulo, desc }) => (
                            <div key={titulo} className="group border-t border-[#1E293B] pt-8">
                                <div className="w-12 h-12 bg-[#1E293B] group-hover:bg-[#1E88E5] rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                                    <Icon className="h-6 w-6 text-[#94A3B8] group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="font-heading font-bold text-xl mb-4 group-hover:text-[#1E88E5] transition-colors">{titulo}</h3>
                                <p className="text-[#94A3B8] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Consulting */}
            <section className="py-32 px-6 bg-white border-b border-[#E5E7EB] text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="w-16 h-16 bg-[#F8FAFC] rounded-2xl flex items-center justify-center mx-auto mb-8 border border-[#E5E7EB]">
                        <BarChart className="h-8 w-8 text-[#1565C0]" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] mb-6 leading-tight">
                        Eleve a barra da sua gestão
                    </h2>
                    <p className="text-xl text-[#64748B] mb-12 leading-relaxed">
                        Conecte-se com nossa equipe para um Diagnóstico Estratégico.
                        Vamos mapear as oportunidades de eficiência da sua liderança atual.
                    </p>
                    <Link
                        href="/empresas"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#111827] text-white font-semibold rounded-xl hover:bg-[#1565C0] hover:shadow-xl hover:shadow-[#1565C0]/20 transition-all duration-300 text-lg"
                    >
                        Conhecer a Solução para Empresas
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}
