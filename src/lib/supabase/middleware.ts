import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getDefaultRedirectForUser } from '@/lib/auth/roles'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // This will refresh session if expired.
    // Blindagem: o getUser() é uma chamada de rede ao Auth do Supabase. Se o
    // projeto estiver pausado/lento, uma chamada pendurada estoura o tempo do
    // middleware e derruba o site inteiro (MIDDLEWARE_INVOCATION_TIMEOUT / 504).
    // Damos um timeout curto e tratamos falha como "deslogado": rotas públicas
    // passam (fail open) e rotas protegidas caem no login (fail closed).
    const AUTH_TIMEOUT_MS = 2500
    const user = await Promise.race([
        supabase.auth
            .getUser()
            .then(({ data }) => data.user)
            .catch(() => null),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), AUTH_TIMEOUT_MS)),
    ])

    // Protect dashboard routes — anonymous users go to login
    if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    // Protect admin routes — anonymous users go to login
    if (!user && request.nextUrl.pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        return NextResponse.redirect(url)
    }

    // Logged-in user on /auth/login or /auth/register → redirect to role default
    if (user && (request.nextUrl.pathname === '/auth/login' || request.nextUrl.pathname === '/auth/register')) {
        const url = request.nextUrl.clone()
        url.pathname = await getDefaultRedirectForUser(supabase, user)
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
