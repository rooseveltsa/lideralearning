import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

const admins = [
    { email: 'hugocamposdecarvalho@gmail.com', name: 'Hugo Carvalho', password: 'LideraAdmin2024!' },
    { email: 'claudemirsdomingos@hotmail.com', name: 'Claudemir Domingos', password: 'LideraAdmin2024!' }
]

async function main() {
    for (const admin of admins) {
        console.log(`🚀 Criando conta para ${admin.email}...`)

        // Cria o usuário pelo painel Admin da Supabase (ignora Rate Limits normais)
        const { data: userData, error: userError } = await supabase.auth.admin.createUser({
            email: admin.email,
            password: admin.password,
            email_confirm: true,
            user_metadata: { full_name: admin.name }
        })

        if (userError) {
            if (userError.message.includes('already been registered') || userError.message.includes('User already registered')) {
                console.log(`⚠️ Usuário ${admin.email} já existe. Vamos apenas promover para admin.`)

                // Buscar o ID dele
                const { data: usersData } = await supabase.auth.admin.listUsers()
                const existingUser = usersData.users.find(u => u.email === admin.email)

                if (existingUser) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .update({ role: 'admin' })
                        .eq('id', existingUser.id)

                    if (profileError) console.error(`Erro ao atualizar perfil do ${admin.email}:`, profileError.message)
                    else console.log(`✅ ${admin.email} promovido para ADMIN com sucesso!`)
                }
            } else {
                console.error(`❌ Erro ao criar ${admin.email}:`, userError.message)
            }
            continue
        }

        console.log(`👤 Usuário criado. Promovendo ${admin.email} para Administrador...`)

        // O trigger do banco já criou a linha no 'profiles', vamos apenas atualizar a Role
        // Dar um tempinho mínimo pro trigger rodar
        await new Promise(r => setTimeout(r, 1000))

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userData.user.id)

        if (profileError) {
            console.error(`Erro ao promover ${admin.email}:`, profileError.message)
        } else {
            console.log(`✅ Sucesso! ${admin.email} agora é um Administrador.`)
        }
    }
}

main()
