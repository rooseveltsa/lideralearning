'use client'

import { useState } from 'react'
import SiteHeader from '@/components/site/Header'
import SiteFooter from '@/components/site/Footer'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'

export default function ContatoPage() {
    const [sending, setSending] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSending(true)
        // Simular envio — integrar com Resend/Formspree no futuro
        await new Promise(r => setTimeout(r, 1500))
        setSending(false)
        setSent(true)
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#111827] selection:bg-[#1565C0]/20">
            <SiteHeader />

            <section className="pt-40 pb-32 px-6 relative overflow-hidden bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1E88E5]/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-[#4CAF35]/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="max-w-[1200px] mx-auto relative z-10">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1565C0]/5 text-[#1565C0] text-sm font-semibold mb-6 border border-[#1565C0]/10">
                            Fale com um Estrategista
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-[#111827] mb-6 leading-tight tracking-tight">
                            Pronto para resolver os <br className="hidden md:block" />
                            gargalos da sua <span className="text-[#1565C0]">gestão?</span>
                        </h1>
                        <p className="text-xl text-[#64748B] leading-relaxed max-w-2xl mx-auto font-light">
                            Não alocamos robôs para falar de negócios. Nossa equipe técnica está pronta para analisar seu cenário e propor um plano de ação claro.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-stretch">
                        {/* Informações */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-2xl font-heading font-extrabold text-[#111827] mb-8">Canais Diretos</h2>
                                <div className="space-y-8">
                                    {[
                                        { icon: Mail, label: 'E-mail Corporativo', value: 'lideratreinamentos@tutamail.com', href: 'mailto:lideratreinamentos@tutamail.com' },
                                        { icon: Phone, label: 'Linha WhatsApp Direta', value: '+55 (00) 00000-0000', href: 'https://wa.me/5500000000000' },
                                        { icon: MapPin, label: 'Operação Central', value: 'Brasil — 100% Digital & Escalonável', href: null },
                                    ].map(({ icon: Icon, label, value, href }) => (
                                        <div key={label} className="flex items-start gap-5 group">
                                            <div className="p-4 bg-white border border-[#E5E7EB] group-hover:border-[#1565C0] group-hover:bg-[#F8FAFC] rounded-2xl transition-all duration-300">
                                                <Icon className="h-6 w-6 text-[#1565C0]" strokeWidth={2} />
                                            </div>
                                            <div className="pt-1">
                                                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-2">{label}</p>
                                                {href ? (
                                                    <a href={href} target="_blank" rel="noopener noreferrer"
                                                        className="text-[#111827] text-lg hover:text-[#1E88E5] font-extrabold transition-colors">
                                                        {value}
                                                    </a>
                                                ) : (
                                                    <p className="text-[#111827] font-extrabold text-lg">{value}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#0B0F19] rounded-3xl p-10 border border-[#1E293B] text-white shadow-2xl relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#1E88E5]/20 blur-3xl rounded-full" />
                                <h3 className="font-heading font-extrabold text-2xl mb-4 text-white relative z-10">SLA de Retorno</h3>
                                <p className="text-[#94A3B8] text-base leading-relaxed relative z-10 mb-6 font-medium">
                                    Nosso time atua de Segunda a Sexta, das 8h às 18h (Horário de Brasília).
                                </p>
                                <div className="p-4 bg-white/5 border border-white/10 rounded-xl relative z-10 flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-[#4CAF35] animate-pulse" />
                                    <p className="text-[#E2E8F0] text-sm font-bold">100% de respostas em até 24h úteis.</p>
                                </div>
                            </div>
                        </div>

                        {/* Formulário */}
                        <div className="bg-white rounded-3xl p-10 border border-[#E5E7EB] shadow-xl">
                            {sent ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mx-auto mb-8">
                                        <Send className="h-8 w-8 text-[#1565C0]" />
                                    </div>
                                    <h3 className="text-3xl font-heading font-extrabold text-[#111827] mb-4">Briefing Recebido.</h3>
                                    <p className="text-[#64748B] text-lg font-light">Nossa equipe de Customer Success analisará seu ticket e entrará em contato em breve.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <h3 className="text-3xl font-heading font-extrabold text-[#111827] mb-8">Inicie seu diagnóstico</h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Nome Completo</label>
                                            <input required name="nome" placeholder="John Doe"
                                                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] text-base placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/50 focus:border-[#1E88E5] transition-all bg-white" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">E-mail Corporativo</label>
                                            <input required name="email" type="email" placeholder="ceo@empresa.com"
                                                className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] text-base placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/50 focus:border-[#1E88E5] transition-all bg-white" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Classificação da Demanda</label>
                                        <div className="relative">
                                            <select name="assunto"
                                                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] text-base focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/50 focus:border-[#1E88E5] transition-all appearance-none">
                                                <option value="duvida">Dúvida sobre os programas / formações</option>
                                                <option value="empresa">Consultoria Corporativa In-Company</option>
                                                <option value="parceria">Integração de Parcerias Estratégicas</option>
                                                <option value="outro">Demanda Genérica</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2 block">Detalhamento do Cenário Atual</label>
                                        <textarea required name="mensagem" rows={5} placeholder="Qual o principal gargalo da sua empresa hoje?"
                                            className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl text-[#111827] text-base placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#1E88E5]/50 focus:border-[#1E88E5] transition-all resize-none" />
                                    </div>

                                    <button type="submit" disabled={sending}
                                        className="w-full flex items-center justify-center gap-2 py-4 mt-4 bg-[#111827] text-white font-bold text-base rounded-xl hover:bg-[#1565C0] shadow-xl shadow-[#1565C0]/20 hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none transition-all duration-300">
                                        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                        {sending ? 'Processando envio...' : 'Solicitar Atendimento'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    )
}
