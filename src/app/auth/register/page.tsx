'use client'

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { signup } from "@/app/auth/actions"
import { useState, useTransition, Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center p-4" style={{ background: '#f5f1ea' }}>
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#ec6411' }} />
            </div>
        }>
            <RegisterForm />
        </Suspense>
    )
}

function RegisterForm() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || ''
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const result = await signup(formData)
            if (result?.error) {
                setError(result.error)
            }
        })
    }

    const inputStyle = {
        height: 44,
        background: '#ffffff',
        border: '1px solid rgba(12,23,41,0.15)',
        color: '#070e1c',
    }

    return (
        <div className="flex min-h-screen w-full" style={{ color: '#070e1c' }}>
            {/* Left — branding panel */}
            <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10" style={{ background: '#070e1c', color: '#f5f1ea' }}>
                <Link href="/" className="flex items-center gap-2.5">
                    <svg width={26} height={26} viewBox="0 0 64 64" fill="none" aria-hidden>
                        <path d="M10 50 L22 18 L26 30 L18 50 Z" fill="#ec6411" />
                        <path d="M22 50 L34 14 L38 26 L30 50 Z" fill="#0f8f3a" />
                        <path d="M34 50 L46 18 L54 30 L42 50 Z" fill="#1855bd" />
                    </svg>
                    <span className="font-sans text-xl font-bold" style={{ letterSpacing: '-0.02em' }}>Lidera</span>
                </Link>

                <div className="space-y-8">
                    <div>
                        <h2 className="font-heading text-3xl" style={{ lineHeight: 1.1 }}>
                            Transforme sua
                            <br />
                            <em style={{ fontStyle: 'italic', color: '#fb7d2e' }}>liderança</em> hoje.
                        </h2>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ color: 'rgba(245,241,234,0.65)' }}>
                            Crie sua conta e descubra seu perfil de liderança com nosso diagnóstico gratuito.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: 'compass', color: '#ec6411', title: 'Diagnóstico gratuito', desc: 'Receba seu PDI automaticamente' },
                            { icon: 'chart', color: '#0f8f3a', title: 'Plano de 12 semanas', desc: 'Evolução comportamental, processual e estratégica' },
                            { icon: 'users', color: '#1855bd', title: 'Mentoria individual', desc: 'Acompanhamento 30 e 60 dias' },
                        ].map((item) => (
                            <div key={item.title} className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${item.color}20` }}>
                                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={item.color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                                        {item.icon === 'compass' && <><circle cx="12" cy="12" r="9" /><path d="m15 9-2 6-6 2 2-6 6-2Z" /></>}
                                        {item.icon === 'chart' && <path d="M3 17 9 11l4 4 8-9M14 4h7v7" />}
                                        {item.icon === 'users' && <><circle cx="9" cy="8" r="3.2" /><path d="M3 19c.6-3.2 3.2-5 6-5s5.4 1.8 6 5" /><circle cx="17.5" cy="8.5" r="2.6" /><path d="M16 14c2.5.2 4.6 2 5 5" /></>}
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{item.title}</p>
                                    <p className="text-xs" style={{ color: 'rgba(245,241,234,0.55)' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs" style={{ color: 'rgba(245,241,234,0.4)' }}>
                    &copy; {new Date().getFullYear()} Lidera Treinamentos
                </p>
            </div>

            {/* Right — form */}
            <div className="flex flex-1 items-center justify-center p-6" style={{ background: '#f5f1ea' }}>
                <div className="w-full max-w-[420px]">
                    {/* Mobile logo */}
                    <div className="mb-6 flex justify-center lg:hidden">
                        <Link href="/" className="flex items-center gap-2">
                            <svg width={24} height={24} viewBox="0 0 64 64" fill="none">
                                <path d="M10 50 L22 18 L26 30 L18 50 Z" fill="#ec6411" />
                                <path d="M22 50 L34 14 L38 26 L30 50 Z" fill="#0f8f3a" />
                                <path d="M34 50 L46 18 L54 30 L42 50 Z" fill="#1855bd" />
                            </svg>
                            <span className="font-sans text-xl font-bold" style={{ color: '#070e1c' }}>Lidera</span>
                        </Link>
                    </div>

                    <div className="mb-6">
                        <div className="mb-2 flex items-center gap-2">
                            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#ec6411" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 4v6M12 14v6M4 12h6M14 12h6" />
                                <path d="M18 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" fill="#ec6411" stroke="none" />
                            </svg>
                            <h1 className="font-heading text-2xl" style={{ color: '#070e1c' }}>
                                Bem-vindo à Lidera
                            </h1>
                        </div>
                        <p className="text-sm" style={{ color: '#6f7585' }}>
                            Crie sua conta em segundos e comece sua jornada de liderança.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

                        {error && (
                            <div className="rounded-xl p-3 text-center text-sm font-medium" style={{ background: 'rgba(197,52,58,0.08)', border: '1px solid rgba(197,52,58,0.2)', color: '#c5343a' }}>
                                {error}
                            </div>
                        )}

                        {/* Nome */}
                        <div>
                            <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#6f7585' }}>
                                Nome Completo *
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Seu nome completo"
                                required
                                className="block w-full rounded-xl px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ec6411]/30"
                                style={inputStyle}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#6f7585' }}>
                                E-mail *
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                className="block w-full rounded-xl px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ec6411]/30"
                                style={inputStyle}
                            />
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label htmlFor="whatsapp" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#6f7585' }}>
                                WhatsApp com DDD *
                            </label>
                            <div className="flex gap-2">
                                <div className="flex items-center justify-center rounded-xl text-sm font-semibold" style={{ width: 56, height: 44, background: '#ebe5d9', border: '1px solid rgba(12,23,41,0.15)', color: '#6f7585' }}>
                                    +55
                                </div>
                                <input
                                    id="whatsapp"
                                    name="whatsapp"
                                    type="tel"
                                    placeholder="(64) 99999-9999"
                                    required
                                    maxLength={15}
                                    className="block flex-1 rounded-xl px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ec6411]/30"
                                    style={inputStyle}
                                    onChange={(e) => {
                                        let v = e.target.value.replace(/\D/g, '')
                                        if (v.length > 11) v = v.slice(0, 11)
                                        if (v.length > 7) {
                                            v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
                                        } else if (v.length > 2) {
                                            v = `(${v.slice(0, 2)}) ${v.slice(2)}`
                                        } else if (v.length > 0) {
                                            v = `(${v}`
                                        }
                                        e.target.value = v
                                    }}
                                />
                            </div>
                        </div>

                        {/* Empresa */}
                        <div>
                            <label htmlFor="company" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#6f7585' }}>
                                Empresa <span className="font-normal normal-case" style={{ color: '#adb1bc' }}>(opcional)</span>
                            </label>
                            <input
                                id="company"
                                name="company"
                                type="text"
                                placeholder="Nome da empresa onde trabalha"
                                className="block w-full rounded-xl px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ec6411]/30"
                                style={inputStyle}
                            />
                        </div>

                        {/* Senhas */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#6f7585' }}>
                                    Senha *
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="block w-full rounded-xl px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ec6411]/30"
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#6f7585' }}>
                                    Confirmar *
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="block w-full rounded-xl px-4 text-sm outline-none transition-all focus:ring-2 focus:ring-[#ec6411]/30"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="ld-btn-primary w-full justify-center disabled:opacity-50"
                            style={{ height: 44, borderRadius: 12 }}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                "Criar Minha Conta"
                            )}
                        </button>

                        <p className="text-center text-sm" style={{ color: '#6f7585' }}>
                            Já tem conta?{" "}
                            <Link
                                href={`/auth/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                                className="font-semibold"
                                style={{ color: '#ec6411' }}
                            >
                                Fazer Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
