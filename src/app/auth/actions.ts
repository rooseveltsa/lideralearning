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
    const redirectTo = formData.get('redirectTo') as string
    redirect(redirectTo || '/dashboard')
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

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lideralearning.vercel.app'
    const redirectTo = formData.get('redirectTo') as string

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
            emailRedirectTo: `${siteUrl}${redirectTo || '/dashboard'}`,
        },
    })

    if (error) {
        if (error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('security')) {
            return { error: 'Por favor, aguarde alguns segundos e tente novamente.' }
        }
        if (error.message.toLowerCase().includes('already registered')) {
            return { error: 'Este email já está cadastrado. Faça login ou use outro email.' }
        }
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect(redirectTo || '/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/auth/login')
}
