'use client'

import Link from "next/link"
import { signup } from "@/app/auth/actions"
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

export default function RegisterPage() {
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
            // On success, the server action calls redirect('/dashboard')
        })
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center p-4 bg-[#F8FAFC] selection:bg-[#1565C0]/20">
            <div className="w-full max-w-[440px] py-8">
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
                            Nova Licença Corporativa
                        </CardTitle>
                        <CardDescription className="text-center text-[#64748B] text-base">
                            Preencha os dados abaixo para iniciar sua jornada conosco.
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
                                <Label htmlFor="fullName" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Nome Completo</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    className="h-12 px-4 rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-base focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5] transition-all"
                                />
                            </div>
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
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Senha</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="h-12 px-4 rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-base focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5] transition-all"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword" className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Confirmar</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        className="h-12 px-4 rounded-xl border-[#E5E7EB] bg-[#F8FAFC] text-base focus-visible:ring-[#1E88E5]/50 focus-visible:ring-2 focus-visible:border-[#1E88E5] transition-all"
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-6 pt-2 pb-8">
                            <Button
                                className="w-full h-12 bg-[#1E88E5] hover:bg-[#1565C0] text-white text-base font-bold rounded-xl shadow-md shadow-[#1E88E5]/20 transition-all duration-300 relative"
                                type="submit"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin absolute left-4" />
                                        Criando licença...
                                    </>
                                ) : (
                                    "Criar Conta"
                                )}
                            </Button>
                            <div className="text-center text-sm text-[#64748B]">
                                Já possui uma conta corporativa?{" "}
                                <Link href="/auth/login" className="text-[#1565C0] font-bold hover:text-[#1E88E5] transition-colors">
                                    Fazer Login
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    )
}
