import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function setupAdmin() {
  console.log('🔍 Buscando usuário roosevelt.miranda@gmail.com...')

  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()

  if (listError) {
    console.error('❌ Erro ao listar usuários:', listError.message)
    process.exit(1)
  }

  const targetUser = users.find(u => u.email === 'roosevelt.miranda@gmail.com')

  if (!targetUser) {
    console.error('❌ Usuário não encontrado!')
    process.exit(1)
  }

  console.log('✅ Usuário encontrado! ID:', targetUser.id)
  console.log('📝 Criando/atualizando perfil como admin...')

  // Tentar inserir o perfil admin
  const { error } = await supabaseAdmin
    .from('profiles')
    .upsert({
      id: targetUser.id,
      full_name: targetUser.user_metadata?.full_name ?? 'Roosevelt Miranda',
      role: 'admin'
    })

  if (error) {
    if (error.message.includes('relation "public.profiles" does not exist') || error.code === '42P01') {
      console.log('\n⚠️  A tabela "profiles" ainda não existe.')
      console.log('\n📋 Por favor, execute o seguinte SQL no Supabase → SQL Editor:\n')
      console.log(`-- Cole este SQL completo e execute:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin', 'hr_manager')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Perfil proprio" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Admin ve tudo" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);

-- Políticas para admin gerenciar cursos
CREATE POLICY "Admins gerenciam cursos" ON public.courses FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins gerenciam modulos" ON public.modules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins gerenciam aulas" ON public.lessons FOR ALL
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Definir você como admin
INSERT INTO public.profiles (id, full_name, role)
VALUES ('${targetUser.id}', 'Roosevelt Miranda', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Confirmar:
SELECT id, full_name, role FROM public.profiles;`)
      console.log('\n⎯'.repeat(50))
      console.log('📌 Seu User ID para referência:', targetUser.id)
    } else {
      console.error('❌ Erro ao criar perfil:', error.message)
    }
    process.exit(1)
  }

  console.log('✅ Perfil admin criado com sucesso!')
  console.log('🚀 Acesse o Painel Admin em: http://localhost:3000/admin')
}

setupAdmin()
