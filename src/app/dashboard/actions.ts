'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const fullName = formData.get('fullName') as string

    if (!fullName) {
        return { error: 'O nome completo é obrigatório.' }
    }

    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { error: 'Usuário não autenticado.' }
        }

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user.id)

        if (error) throw error

        revalidatePath('/dashboard/perfil')
        return { success: 'Perfil atualizado com sucesso!' }
    } catch (error: any) {
        console.error('Update profile error:', error)
        return { error: error.message || 'Erro ao atualizar o perfil. Tente novamente mais tarde.' }
    }
}

export async function updatePassword(formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!password || password.length < 6) {
        return { error: 'A nova senha deve ter pelo menos 6 caracteres.' }
    }

    if (password !== confirmPassword) {
        return { error: 'As senhas não coincidem.' }
    }

    try {
        const supabase = await createClient()
        // Supabase Auth updateUser will reset password for the currently logged in user
        const { error } = await supabase.auth.updateUser({ password })

        if (error) throw error

        return { success: 'Senha atualizada com sucesso! Use a nova senha no próximo login.' }
    } catch (error: any) {
        console.error('Update password error:', error)
        return { error: error.message || 'Erro ao atualizar a senha. Tente novamente.' }
    }
}
