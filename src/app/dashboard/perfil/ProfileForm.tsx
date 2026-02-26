'use client'

import { useState } from 'react'
import { updateProfile } from '../actions'
import { Loader2, Save, User } from 'lucide-react'

export default function ProfileForm({ initialName, email }: { initialName: string, email: string }) {
    const [isPending, setIsPending] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        setMessage(null)

        const result = await updateProfile(formData)

        if (result.error) {
            setMessage({ type: 'error', text: result.error })
        } else if (result.success) {
            setMessage({ type: 'success', text: result.success })
        }

        setIsPending(false)
    }

    return (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-heading font-extrabold text-[#111827] mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-[#64748B]" /> Dados Pessoais
            </h2>

            {message && (
                <div className={`mb-6 p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${message.type === 'success' ? 'bg-[#D1FAE5] text-[#047857] border border-[#6EE7B7]' : 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FCA5A5]'}`}>
                    {message.text}
                </div>
            )}

            <form action={handleSubmit} className="space-y-6 max-w-xl">
                <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-bold text-[#475569] tracking-wide block">
                        Nome Completo
                    </label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        defaultValue={initialName}
                        required
                        className="w-full px-4 h-12 bg-[#F8FAFC] border border-[#E5E7EB] rounded-xl text-[#111827] focus:outline-none focus:ring-4 focus:ring-[#1E88E5]/10 focus:border-[#1E88E5] transition-all font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-[#475569] tracking-wide block flex justify-between">
                        E-mail de Acesso
                        <span className="text-xs font-normal text-[#94A3B8] uppercase">Não editável</span>
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-4 h-12 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl text-[#94A3B8] font-medium cursor-not-allowed"
                    />
                    <p className="text-xs text-[#94A3B8] font-medium mt-1">Para alterar seu e-mail, entre em contato com o suporte.</p>
                </div>

                <div className="pt-4 border-t border-[#F8FAFC]">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 h-12 px-8 bg-[#1E88E5] hover:bg-[#1565C0] text-white rounded-xl font-bold shadow-lg shadow-[#1E88E5]/20 disabled:opacity-50 transition-all w-full sm:w-auto"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>
    )
}
