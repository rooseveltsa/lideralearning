import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowRight, BookOpen, Clock, Target, PlayCircle } from 'lucide-react'

export default async function CursosPage() {
    const supabase = await createClient()

    const { data: cursos } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#111827] selection:bg-[#1565C0]/20">
            <SiteHeader />

            {/* Hero */}
            <section className="pt-40 pb-20 px-6 bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1565C0]/5 text-[#1565C0] text-sm font-semibold mb-6 border border-[#1565C0]/10">
                        Catálogo de Programas
                    </div>
                    <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-[#111827] mb-6 leading-tight tracking-tight">
                        Desenvolvimento contínuo para <br className="hidden md:block" />
                        quem não negocia <span className="text-[#1565C0]">resultados.</span>
                    </h1>
                    <p className="text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
                        Nossas formações executivas são estruturadas como esteiras de performance: focadas na realidade corporativa e sem teorias intangíveis.
                    </p>
                </div>
            </section>

            {/* Grid de Cursos */}
            <section className="py-24 px-6 relative bg-white">
                <div className="max-w-6xl mx-auto">
                    {!cursos || cursos.length === 0 ? (
                        <div className="text-center py-20 bg-[#F8FAFC] rounded-2xl border border-[#E5E7EB]">
                            <BookOpen className="h-12 w-12 text-[#94A3B8] mx-auto mb-4" />
                            <h3 className="text-xl font-heading font-bold text-[#111827]">Nenhum programa disponível no momento</h3>
                            <p className="text-[#64748B] mt-2">Estamos atualizando nosso catálogo. Volte em breve.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cursos.map((curso) => (
                                <Link
                                    key={curso.id}
                                    href={`/curso/${curso.id}`}
                                    className="group flex flex-col bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden hover:border-[#1565C0] hover:shadow-xl hover:shadow-[#1565C0]/10 transition-all duration-300"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative h-56 bg-[#0B0F19] overflow-hidden border-b border-[#E5E7EB]">
                                        {curso.thumbnail_url ? (
                                            <img
                                                src={curso.thumbnail_url}
                                                alt={curso.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out opacity-90 group-hover:opacity-100"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                                <Target className="h-20 w-20 text-white" />
                                            </div>
                                        )}
                                        {/* Overlay Elegante */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-grow">
                                        <div className="flex items-center gap-3 mb-4 text-xs font-bold text-[#64748B] uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5 bg-[#F8FAFC] text-[#1565C0] px-2.5 py-1 rounded-md border border-[#E5E7EB]">
                                                <BookOpen className="h-3.5 w-3.5" />
                                                Formação
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-3.5 w-3.5" />
                                                Acesso Imediato
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-heading font-extrabold text-[#111827] mb-3 leading-tight group-hover:text-[#1565C0] transition-colors line-clamp-2">
                                            {curso.title}
                                        </h3>

                                        <p className="text-[#64748B] leading-relaxed mb-8 line-clamp-3 flex-grow">
                                            {curso.description}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-[#E5E7EB] flex flex-col gap-5">
                                            <div className="flex items-end justify-between">
                                                <span className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Investimento Único</span>
                                                <span className="text-2xl font-heading font-extrabold text-[#1565C0]">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(curso.price)}
                                                </span>
                                            </div>
                                            <div className="w-full py-4 bg-[#F8FAFC] text-[#111827] font-bold text-sm rounded-xl text-center group-hover:bg-[#1565C0] group-hover:text-white border border-[#E5E7EB] group-hover:border-[#1565C0] transition-all duration-300 flex items-center justify-center gap-2">
                                                Detalhes do Programa
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 px-6 bg-[#0B0F19] text-center border-t border-[#1E293B]">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-heading font-extrabold text-white mb-6 leading-tight">Ainda em dúvida sobre qual trilha escolher?</h2>
                    <p className="text-xl text-[#94A3B8] mb-12 max-w-2xl mx-auto leading-relaxed">
                        Diferentes momentos de carreira exigem diferentes ferramentas. Fale com nossos consultores para mapearmos sua necessidade atual.
                    </p>
                    <a
                        href="https://wa.me/5500000000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1E88E5] text-white font-bold rounded-xl hover:bg-[#1565C0] transition-all duration-300 text-lg"
                    >
                        <PlayCircle className="h-5 w-5" />
                        Falar com Consultor
                    </a>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}
