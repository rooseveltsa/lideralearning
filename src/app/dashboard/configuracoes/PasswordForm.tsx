'use client'

import { useState, useRef } from 'react'
import { updatePassword } from '../actions'
import { Loader2, KeyRound } from 'lucide-react'

export default function PasswordForm() {
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setMessage(null)

        const result = await updatePassword(formData)

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success })
            formRef.current?.reset()
        }

        setIsPending(false)
    }

    return (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
                <h2 className="text-xl font-heading font-extrabold text-[#111827] flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-[#64748B]" /> Segurança da Conta
                </h2>
                <p className="text-[#64748B] text-sm font-medium mt-1">
                    Atualize sua senha de acesso periodicamente para manter sua conta segura.
                </p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-[#D1FAE5] text-[#047857] border border-[#6EE7B7]' : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'}`}>
                    {message.text}
                </div>
            )}

            <form ref={formRef} action={handleSubmit} className="space-y-6 max-w-xl">
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-bold text-[#475569] tracking-wide block">
                        Nova Senha
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Mínimo 6 caracteres"
                        minLength={6}
                        className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-bold text-[#475569] tracking-wide block">
                        Confirmar Nova Senha
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="Repita a nova senha"
                        minLength={6}
                        className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium"
                    />
                </div>

                <div className="pt-4 border-t border-[#F8FAFC]">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 h-12 px-8 bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-bold shadow-lg shadow-[#1E88E5]/20 disabled:opacity-50 transition-all w-full sm:w-auto"
                    >
                        {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                        Atualizar Senha
                    </button>
                </div>
            </form>
        </div>
    )
}
