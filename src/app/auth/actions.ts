'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/service'
import { sendEmail } from '@/lib/email/send'

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
    const whatsapp = (formData.get('whatsapp') as string)?.replace(/\D/g, '') || ''
    const company = (formData.get('company') as string)?.trim() || ''
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
            whatsapp: whatsapp ? `+55${whatsapp}` : '',
            company: company,
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

    // Create profile in profiles table (essential for all admin features)
    if (newUser?.user) {
        try {
            await admin.from('profiles').upsert({
                id: newUser.user.id,
                full_name: fullName,
                role: 'student',
                whatsapp: whatsapp ? `+55${whatsapp}` : '',
                company: company,
            }, { onConflict: 'id' })
        } catch (e) {
            console.error('[signup] Profile creation failed:', e)
        }
    }

    // After successful signIn, create prospect in CRM for lead tracking
    try {
        // Check if prospect with this email already exists (email is not unique in schema)
        const { data: existing } = await admin
            .from('crm_prospects')
            .select('id')
            .eq('email', email)
            .limit(1)
            .maybeSingle()

        if (!existing) {
            await admin.from('crm_prospects').insert({
                full_name: fullName,
                job_title: 'Não informado',
                job_function: 'outro',
                company_name: company || 'Não informado',
                email: email,
                phone: whatsapp ? `+55${whatsapp}` : null,
                outreach_status: 'connected',
                notes: `Cadastro via site. Redirect: ${redirectTo || '/dashboard'}`,
            })
        }
    } catch (e) {
        // Non-blocking - don't fail signup if CRM insert fails
        console.error('[signup] CRM prospect creation failed:', e)
    }

    // Send welcome email (non-blocking — don't await)
    sendEmail(email, 'welcome', { name: fullName })
      .then((result) => {
        if (!result.success) console.error('[signup] Welcome email failed:', result.error)
      })
      .catch((err) => console.error('[signup] Welcome email exception:', err))

    revalidatePath('/', 'layout')
    redirect(redirectTo || '/dashboard')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/auth/login')
}
