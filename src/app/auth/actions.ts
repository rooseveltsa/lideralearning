'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'

// Returns an error string on failure, or redirects on success
export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        if (error.message.toLowerCase().includes('invalid login')) {
            return { error: 'Email ou senha incorretos.' }
        }
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    const redirectTo = formData.get('redirectTo') as string
    redirect(redirectTo || '/dashboard')
}

// Returns an error string on failure, or redirects on success
export async function signup(formData: FormData) {
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const email = formData.get('email') as string
    const fullName = formData.get('fullName') as string
    const redirectTo = formData.get('redirectTo') as string

    if (password !== confirmPassword) {
        return { error: 'As senhas não coincidem.' }
    }

    if (password.length < 6) {
        return { error: 'A senha deve ter pelo menos 6 caracteres.' }
    }

    // Use admin client to create user WITHOUT email confirmation
    // This bypasses Supabase's rate limiting on confirmation emails
    const admin = createAdminClient()

    const { data: newUser, error: createError } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email — no verification email sent
        user_metadata: {
            full_name: fullName,
        },
    })

    if (createError) {
        if (createError.message.toLowerCase().includes('already been registered') ||
            createError.message.toLowerCase().includes('already exists')) {
            return { error: 'Este email já está cadastrado. Faça login ou use outro email.' }
        }
        if (createError.message.toLowerCase().includes('rate limit') ||
            createError.message.toLowerCase().includes('security')) {
            return { error: 'Muitas tentativas. Aguarde um momento e tente novamente.' }
        }
        console.error('[signup] Error creating user:', createError.message)
        return { error: 'Erro ao criar conta. Tente novamente.' }
    }

    // Now sign in the newly created user so they get a session
    const supabase = await createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        console.error('[signup] Error signing in after creation:', signInError.message)
        return { error: 'Conta criada! Faça login com suas credenciais.' }
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
