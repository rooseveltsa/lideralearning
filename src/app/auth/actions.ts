'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Returns an error string on failure, or redirects on success
export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

// Returns an error string on failure, or redirects on success
export async function signup(formData: FormData) {
    const supabase = await createClient()

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const email = formData.get('email') as string
    const fullName = formData.get('fullName') as string

    if (password !== confirmPassword) {
        return { error: 'As senhas não coincidem.' }
    }

    const data = {
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
            return { error: 'Limite de cadastros excedido temporariamente pelo servidor. Por favor, aguarde alguns minutos e tente novamente.' }
        }
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/auth/login')
}
