import { Settings } from "lucide-react"
import PasswordForm from "./PasswordForm"

export default function ConfiguracoesPage() {
    return (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#1E88E5]/10 text-[#1E88E5] rounded-xl">
                    <Settings className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-extrabold text-[#111827] tracking-tight">Configurações</h1>
                    <p className="text-[#64748B] font-medium mt-1">Gerencie as preferências e proteção da sua conta</p>
                </div>
            </div>

            <PasswordForm />
        </div>
    )
}
