import { User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import ProfileForm from "./ProfileForm"

export default async function PerfilPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/auth/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="p-6 md:p-10 space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-[#1E88E5]/10 text-[#1E88E5] rounded-xl">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-extrabold text-[#111827] tracking-tight">Meu Perfil</h1>
                    <p className="text-[#64748B] font-medium mt-1">Suas informações pessoais e de contato</p>
                </div>
            </div>

            <ProfileForm
                initialName={profile?.full_name || ''}
                email={user.email || ''}
            />
        </div>
    )
}
