import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey || supabaseServiceKey.includes('dummy')) {
    console.error('❌ Erro: Chaves do Supabase ausentes ou inválidas no .env.local')
    process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const adminEmail = 'caludemirsdomingos@hotmail.com'
const adminPassword = 'LideraAdmin2024!'
const adminName = 'Claudemir Domingos'

async function createAdmin() {
    console.log(`🚀 Iniciando criação do admin: ${adminEmail}`)

    // 1. Criar o usuário no Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { full_name: adminName }
    })

    let userId = userData?.user?.id

    if (userError) {
        if (userError.message.includes('already been registered') || userError.message.includes('User already registered')) {
            console.log(`⚠️ Usuário já existe no Auth. Buscando ID...`)
            const { data: usersData } = await supabaseAdmin.auth.admin.listUsers()
            const existingUser = usersData.users.find(u => u.email === adminEmail)
            if (existingUser) {
                userId = existingUser.id
            } else {
                console.error('❌ Não foi possível encontrar o usuário existente.')
                process.exit(1)
            }
        } else {
            console.error('❌ Erro ao criar usuário:', userError.message)
            process.exit(1)
        }
    }

    console.log(`✅ Usuário identificado (ID: ${userId}). Promovendo a Admin no banco de dados...`)

    // 2. Upsert no perfil para garantir que seja admin
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
            id: userId,
            full_name: adminName,
            role: 'admin'
        })

    if (profileError) {
        console.error('❌ Erro ao atualizar perfil:', profileError.message)
        process.exit(1)
    }

    console.log(`\n✨ SUCESSO! ✨`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`Email: ${adminEmail}`)
    console.log(`Senha: ${adminPassword}`)
    console.log(`Papel: Administrador`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
}

createAdmin()
