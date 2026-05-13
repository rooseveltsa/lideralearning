'use client'

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { login } from "@/app/auth/actions"
import { useState, useTransition, Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center p-4" style={{ background: '#f5f1ea' }}>
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#ec6411' }} />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}

function LoginForm() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || ''
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        const formData = new FormData(e.currentTarget)
        startTransition(async () => {
            const result = await login(formData)
            if (result?.error) {
                setError(result.error)
            }
        })
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

                <div>
                    <h2 className="font-heading text-4xl" style={{ lineHeight: 1.05 }}>
                        A liderança que a sua operação
                        <br />
                        <em style={{ fontStyle: 'normal', color: '#fb7d2e' }}>precisa.</em>
                    </h2>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed" style={{ color: 'rgba(245,241,234,0.65)' }}>
                        Acesse sua conta para continuar sua jornada de desenvolvimento na plataforma Lidera.
                    </p>
                </div>

                <p className="text-xs" style={{ color: 'rgba(245,241,234,0.4)' }}>
                    &copy; {new Date().getFullYear()} Lidera Treinamentos
                </p>
            </div>

            {/* Right — form */}
            <div className="flex flex-1 items-center justify-center p-6" style={{ background: '#f5f1ea' }}>
                <div className="w-full max-w-[400px]">
                    {/* Mobile logo */}
                    <div className="mb-8 flex justify-center lg:hidden">
                        <Link href="/" className="flex items-center gap-2">
                            <svg width={24} height={24} viewBox="0 0 64 64" fill="none">
                                <path d="M10 50 L22 18 L26 30 L18 50 Z" fill="#ec6411" />
                                <path d="M22 50 L34 14 L38 26 L30 50 Z" fill="#0f8f3a" />
                                <path d="M34 50 L46 18 L54 30 L42 50 Z" fill="#1855bd" />
                            </svg>
                            <span className="font-sans text-xl font-bold" style={{ color: '#070e1c' }}>Lidera</span>
                        </Link>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl p-8" style={{ background: '#ffffff', border: '1px solid rgba(12,23,41,0.10)', boxShadow: '0 8px 24px rgba(7,14,28,0.08)' }}>
                        <div className="mb-6 text-center">
                            <h1 className="font-heading text-2xl" style={{ color: '#070e1c' }}>
                                Entrar na Plataforma
                            </h1>
                            <p className="mt-2 text-sm" style={{ color: '#6f7585' }}>
                                Acesse sua conta para continuar.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

                            {error && (
                                <div className="rounded-xl p-3 text-center text-sm font-medium" style={{ background: 'rgba(197,52,58,0.08)', border: '1px solid rgba(197,52,58,0.2)', color: '#c5343a' }}>
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider" style={{ color: '#6f7585' }}>
                                    E-mail
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    required
                                    className="block w-full rounded-xl px-4 text-sm outline-none transition-all"
                                    style={{
                                        height: 48,
                                        background: '#f5f1ea',
                                        border: '1px solid rgba(12,23,41,0.15)',
                                        color: '#070e1c',
                                    }}
                                />
                            </div>

                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#6f7585' }}>
                                        Senha
                                    </label>
                                    <Link href="/auth/forgot-password" className="text-xs font-medium" style={{ color: '#ec6411' }}>
                                        Esqueceu sua senha?
                                    </Link>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-xl px-4 text-sm outline-none transition-all"
                                    style={{
                                        height: 48,
                                        background: '#f5f1ea',
                                        border: '1px solid rgba(12,23,41,0.15)',
                                        color: '#070e1c',
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="ld-btn-primary w-full justify-center disabled:opacity-50"
                                style={{ height: 48, borderRadius: 12 }}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Entrando...
                                    </>
                                ) : (
                                    "Entrar"
                                )}
                            </button>

                            <p className="text-center text-sm" style={{ color: '#6f7585' }}>
                                Ainda não tem conta?{" "}
                                <Link
                                    href={`/auth/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                                    className="font-semibold"
                                    style={{ color: '#ec6411' }}
                                >
                                    Criar Conta
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
