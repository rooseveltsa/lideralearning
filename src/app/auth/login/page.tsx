'use client'

import Link from "next/link"
import { login } from "@/app/auth/actions"
import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
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
            // On success, the server action calls redirect('/dashboard')
            // which Next.js handles as a navigation automatically
        })
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#F8FAFC] selection:bg-[#1565C0]/20">
            <div className="w-full max-w-[400px]">
                {/* Logo Top */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-1.5 group select-none">
                        <span className="font-heading font-extrabold text-2xl tracking-tight text-[#111827]">
                            Lidera
                        </span>
                        <span className="font-extrabold text-2xl text-[#1565C0]">.</span>
                    </Link>
                </div>

                <Card className="w-full border-[#E5E7EB] shadow-xl shadow-[#111827]/[0.02] rounded-2xl bg-white">
                    <CardHeader className="space-y-3 pb-6">
                        <CardTitle className="text-2xl font-heading font-extrabold text-center text-[#111827]">
                            Entrar na Plataforma
                        </CardTitle>
                        <CardDescription className="text-center text-[#64748B] text-base">
                            Insira suas credenciais corporativas.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="grid gap-5">
                            {error && (
                                <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm p-3 rounded-xl font-medium text-center">
                                    {error}
                                </div>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">E-mail Corporativo</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="ceo@empresa.com"
                                    required
                                    className="h-12 px-4 rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-base focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5] transition-all"
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Senha</Label>
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-sm font-medium text-[#1565C0] hover:text-[#1E88E5] transition-colors"
                                    >
                                        Esqueceu sua senha?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="h-12 px-4 rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-base focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5] transition-all"
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-6 pt-2 pb-8">
                            <Button
                                className="w-full h-12 bg-[#111827] hover:bg-[#1565C0] text-white text-base font-bold rounded-xl shadow-md shadow-[#111827]/10 transition-all duration-300 relative"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin absolute left-4" />
                                        Entrando...
                                    </>
                                ) : (
                                    "Acessar Dashboard"
                                )}
                            </Button>
                            <div className="text-center text-sm text-[#64748B]">
                                Não tem uma licença corporativa?{" "}
                                <Link href="/auth/register" className="text-[#1565C0] font-bold hover:text-[#1E88E5] transition-colors">
                                    Criar Conta
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
