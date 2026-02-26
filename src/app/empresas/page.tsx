import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { CheckCircle2, ArrowRight, BarChart3, Users, Shield, HeadphonesIcon } from 'lucide-react'
import Link from 'next/link'

const features = [
    { icon: Users, titulo: 'Controle em Larga Escala', desc: 'Gerencie dezenas ou centenas de líderes em um ecossistema único com hierarquia de acesso e departamentos.' },
    { icon: BarChart3, titulo: 'Métricas de Evolução', desc: 'Saia do "achismo". Acompanhe taxas de engajamento, horas consumidas e conclusão de trilhas em tempo real.' },
    { icon: Shield, titulo: 'Jornadas Sob Medida', desc: 'Nossa equipe projeta a esteira de aprendizagem específica que resolve as dores atuais do seu negócio.' },
    { icon: HeadphonesIcon, titulo: 'Customer Success', desc: 'Sua empresa terá um estrategista dedicado garantindo que o investimento se converta em resultado prático.' },
]

const planos = [
    {
        nome: 'Starter',
        desc: 'Para pequenas equipes em ascensão',
        preco: 'R$ 997',
        periodo: '/mê\s',
        destaques: ['Até 25 acessos corporativos', '5 trilhas essenciais de gestão', 'Dashboard gerencial básico', 'Suporte em horário comercial'],
        cta: 'Assinar Starter',
        destaque: false,
    },
    {
        nome: 'Business',
        desc: 'Para empresas em tração',
        preco: 'R$ 2.497',
        periodo: '/mê\s',
        destaques: ['Até 100 acessos corporativos', 'Acervo completo liberado', 'Análises de performance avançadas', 'CS (Consultor Estratégico) dedicado', 'Customização de trilhas'],
        cta: 'Assinar Business',
        destaque: true,
    },
    {
        nome: 'Enterprise',
        desc: 'Para grandes operações (+100 líderes)',
        preco: 'Custom',
        periodo: '',
        destaques: ['Acessos ilimitados', 'Integração via API com seu RH/ERP', 'SLA de disponibilidade (99.9%)', 'Onboarding imersivo e diagnóstico'],
        cta: 'Agendar Demonstração',
        destaque: false,
    },
]

export default function EmpresasPage() {
    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#111827] selection:bg-[#1565C0]/20">
            <SiteHeader />

            {/* Hero B2B - Dark Premium SaaS */}
            <section className="relative pt-40 pb-32 px-6 overflow-hidden bg-[#0B0F19] text-white">
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#1E88E5]/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4CAF35]/10 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-[1000px] mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#1E88E5] text-sm font-semibold mb-8 uppercase tracking-widest">
                        Solução Corporativa Especializada
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-heading font-extrabold mb-8 leading-[1.1] tracking-tight">
                        Blindagem Executiva para <br className="hidden md:block" />
                        empresas em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#4CAF35]">franca expansão.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[#94A3B8] leading-relaxed max-w-3xl mx-auto mb-12 font-light">
                        A arquitetura educacional B2B projetada para transformar profissionais de execução tática em estrategistas gerenciais com ROI comprovado (Retorno sobre Investimento).
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://wa.me/5500000000000?text=Olá! Tenho interesse em conhecer a solução B2B da Lidera!"
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#1E88E5] text-white font-bold text-lg rounded-xl shadow-lg shadow-[#1E88E5]/20 hover:bg-[#1565C0] hover:-translate-y-0.5 transition-all duration-300">
                            Falar com um Estrategista <ArrowRight className="h-5 w-5" />
                        </a>
                        <a href="#planos"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-[#334155] text-white font-bold text-lg rounded-xl hover:bg-[#1E293B] hover:border-[#475569] transition-colors duration-300">
                            Ver Estrutura Comercial
                        </a>
                    </div>
                </div>
            </section>

            {/* Features Enterprise */}
            <section className="py-32 px-6 bg-white border-b border-[#E5E7EB]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-20">
                        <p className="text-[#1565C0] font-bold tracking-wider uppercase text-sm mb-4">Gestão Centralizada</p>
                        <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">
                            Governança educacional <br className="hidden md:block" />
                            que seu RH controla de ponta a ponta.
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {features.map(({ icon: Icon, titulo, desc }) => (
                            <div key={titulo} className="group">
                                <div className="w-14 h-14 bg-[#F8FAFC] border border-[#E5E7EB] group-hover:border-[#1565C0] group-hover:bg-[#1565C0] rounded-2xl flex items-center justify-center mb-6 transition-all duration-300">
                                    <Icon className="h-6 w-6 text-[#111827] group-hover:text-white transition-colors duration-300" />
                                </div>
                                <h3 className="font-heading font-extrabold text-[#111827] text-xl mb-3">{titulo}</h3>
                                <p className="text-[#64748B] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Planos e Pricing */}
            <section id="planos" className="py-32 px-6 bg-[#F8FAFC]">
                <div className="max-w-[1200px] mx-auto">
                    <div className="text-center mb-20">
                        <p className="text-[#1565C0] font-bold tracking-wider uppercase text-sm mb-4">Planos Comerciais</p>
                        <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-[#111827] tracking-tight">Arquitetura de Investimento Escalável</h2>
                        <p className="text-xl text-[#64748B] mt-6 max-w-2xl mx-auto font-light">Estruturamos planos empresariais que acompanham a maturidade do seu time e o orçamento anual da sua companhia.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                        {planos.map((plano) => (
                            <div key={plano.nome} className={`relative flex flex-col rounded-3xl p-10 border transition-transform duration-300 ${plano.destaque
                                ? 'bg-[#111827] border-[#111827] text-white shadow-2xl scale-100 lg:scale-[1.02] z-10'
                                : 'bg-white border-[#E5E7EB] text-[#111827] shadow-lg'
                                }`}>
                                {plano.destaque && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#1E88E5] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                                        Focado em Escala
                                    </div>
                                )}
                                <h3 className={`text-2xl font-heading font-extrabold mb-2 ${plano.destaque ? 'text-white' : 'text-[#111827]'}`}>{plano.nome}</h3>
                                <p className={`text-sm mb-8 ${plano.destaque ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{plano.desc}</p>

                                <div className="mb-8">
                                    <span className={`text-5xl font-heading font-extrabold tracking-tight ${plano.destaque ? 'text-white' : 'text-[#111827]'}`}>{plano.preco}</span>
                                    {plano.periodo && <span className={`text-lg font-medium ${plano.destaque ? 'text-[#94A3B8]' : 'text-[#64748B]'}`}>{plano.periodo}</span>}
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plano.destaques.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className={`h-5 w-5 flex-shrink-0 mt-0.5 ${plano.destaque ? 'text-[#4CAF35]' : 'text-[#1E88E5]'}`} />
                                            <span className={`font-medium ${plano.destaque ? 'text-[#E2E8F0]' : 'text-[#475569]'}`}>{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a href="https://wa.me/5500000000000"
                                    target="_blank" rel="noopener noreferrer"
                                    className={`block w-full text-center px-6 py-4 rounded-xl font-bold text-base transition-all duration-300 ${plano.destaque
                                        ? 'bg-[#1E88E5] text-white hover:bg-[#1565C0] shadow-xl shadow-[#1E88E5]/20'
                                        : 'bg-[#F1F5F9] text-[#111827] hover:bg-[#E2E8F0] border border-[#E5E7EB]'
                                        }`}>
                                    {plano.cta}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}
