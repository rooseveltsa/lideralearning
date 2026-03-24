'use client'

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { signup } from "@/app/auth/actions"
import { useState, useTransition, Suspense } from "react"
import { Loader2, Sparkles, Target, Users, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#F4F8FD]">
                <Loader2 className="h-8 w-8 animate-spin text-[#1565C0]" />
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

    return (
        <div className="flex min-h-screen w-full bg-[#F4F8FD] selection:bg-[#1565C0]/20">
            {/* Left - Branding */}
            <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[#060D1A] p-10 text-white">
                <div>
                    <Link href="/" className="flex items-center gap-1.5">
                        <span className="font-heading font-extrabold text-2xl text-white">Lidera</span>
                        <span className="font-extrabold text-2xl text-[#F57C00]">.</span>
                    </Link>
                </div>

                <div className="space-y-8">
                    <div>
                        <h2 className="font-heading text-3xl font-extrabold leading-tight">
                            Transforme sua
                            <br />
                            <span className="text-[#1E88E5]">liderança</span> hoje.
                        </h2>
                        <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#A9BDD8]">
                            Crie sua conta e descubra seu perfil de liderança com nosso diagnóstico gratuito.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E88E5]/20">
                                <Target className="h-4 w-4 text-[#1E88E5]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Diagnóstico gratuito</p>
                                <p className="text-xs text-[#8CB8E7]">Receba seu PDI automaticamente</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F57C00]/20">
                                <TrendingUp className="h-4 w-4 text-[#F57C00]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Plano de 12 semanas</p>
                                <p className="text-xs text-[#8CB8E7]">Evolução comportamental, processual e estratégica</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7B1FA2]/20">
                                <Users className="h-4 w-4 text-[#CE93D8]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Mentoria individual</p>
                                <p className="text-xs text-[#8CB8E7]">Acompanhamento 30 e 60 dias</p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-[#5A7A9E]">
                    © {new Date().getFullYear()} LIDERA Treinamentos
                </p>
            </div>

            {/* Right - Form */}
            <div className="flex flex-1 items-center justify-center p-6">
                <div className="w-full max-w-[420px]">
                    {/* Mobile logo */}
                    <div className="flex justify-center mb-6 lg:hidden">
                        <Link href="/" className="flex items-center gap-1.5">
                            <span className="font-heading font-extrabold text-2xl text-[#111827]">Lidera</span>
                            <span className="font-extrabold text-2xl text-[#1565C0]">.</span>
                        </Link>
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-[#F57C00]" />
                            <h1 className="text-2xl font-heading font-extrabold text-[#111827]">
                                Bem-vindo à LIDERA
                            </h1>
                        </div>
                        <p className="text-sm text-[#64748B]">
                            Crie sua conta em segundos e comece sua jornada de liderança.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {redirectTo && <input type="hidden" name="redirectTo" value={redirectTo} />}

                        {error && (
                            <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm p-3 rounded-xl font-medium text-center">
                                {error}
                            </div>
                        )}

                        {/* Nome */}
                        <div className="space-y-1.5">
                            <Label htmlFor="fullName" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                                Nome Completo *
                            </Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                type="text"
                                placeholder="Seu nome completo"
                                required
                                className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5]"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                                E-mail *
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
                                required
                                className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5]"
                            />
                        </div>

                        {/* WhatsApp com DDD */}
                        <div className="space-y-1.5">
                            <Label htmlFor="whatsapp" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                                WhatsApp com DDD *
                            </Label>
                            <div className="flex gap-2">
                                <div className="flex h-11 w-14 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] text-sm font-bold text-[#64748B]">
                                    +55
                                </div>
                                <Input
                                    id="whatsapp"
                                    name="whatsapp"
                                    type="tel"
                                    placeholder="(64) 99999-9999"
                                    required
                                    maxLength={15}
                                    className="h-11 flex-1 px-4 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5]"
                                    onChange={(e) => {
                                        // Mask: (XX) XXXXX-XXXX
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
                        <div className="space-y-1.5">
                            <Label htmlFor="company" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                                Empresa <span className="text-[#94A3B8] font-normal normal-case">(opcional)</span>
                            </Label>
                            <Input
                                id="company"
                                name="company"
                                type="text"
                                placeholder="Nome da empresa onde trabalha"
                                className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5]"
                            />
                        </div>

                        {/* Senhas */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                                    Senha *
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="confirmPassword" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">
                                    Confirmar *
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="h-11 px-4 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5]"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            className="w-full h-11 bg-[#1E88E5] hover:bg-[#1565C0] text-white text-sm font-bold rounded-xl shadow-md shadow-[#1E88E5]/20 transition-all"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando conta...
                                </>
                            ) : (
                                "Criar Minha Conta"
                            )}
                        </Button>

                        <p className="text-center text-sm text-[#64748B]">
                            Já tem conta?{" "}
                            <Link
                                href={`/auth/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                                className="text-[#1565C0] font-bold hover:text-[#1E88E5]"
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
