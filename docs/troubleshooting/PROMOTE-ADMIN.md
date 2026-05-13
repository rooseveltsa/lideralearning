# Runbook — Promover Usuário para Admin

**Owner:** Claudemir Domingos
**Data:** 2026-05-13
**Contexto:** Após o fix do redirect role-aware (commit consolidado pós-393e253), usuários `role='admin'` na tabela `profiles` serão automaticamente redirecionados para `/admin` no login. Este runbook explica como promover o usuário do owner ao role admin.

---

## ⏱️ Tempo estimado: 2 minutos

---

## Passo 1 — Identificar seu email de login

Você precisa do email que usa para entrar no sistema. Provavelmente é `claudemir.lidera@gmail.com` (o mesmo que aparece como email comercial) ou variante.

---

## Passo 2 — Executar SQL no Supabase Studio

1. Acesse https://app.supabase.com e selecione o projeto Lidera Learning
2. Menu lateral → **SQL Editor**
3. Cole e execute o SQL abaixo (substitua o email se necessário):

```sql
-- Promover usuário a admin
UPDATE public.profiles
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users
  WHERE email = 'claudemir.lidera@gmail.com'
  LIMIT 1
);

-- Verificar resultado
SELECT p.id, p.full_name, p.role, u.email
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'claudemir.lidera@gmail.com';
```

**Resultado esperado:** 1 linha com `role = 'admin'`.

---

## Passo 3 — Validar no site

1. Faça logout no site (se estiver logado)
2. Acesse https://lideralearning.vercel.app/auth/login
3. Faça login com `claudemir.lidera@gmail.com`
4. **Esperado:** redirecionamento automático para `/admin` (não mais para `/dashboard`)

---

## 🚨 Troubleshooting

### "SQL executou mas continuo indo para /dashboard"

Causa provável: cache de sessão. Solução:
1. Logout manual
2. Limpar cookies do site (Chrome: `chrome://settings/cookies/detail?site=lideralearning.vercel.app`)
3. Login novamente

### "Email não existe em auth.users"

Causa: você nunca criou conta no site. Solução: cadastre-se primeiro em `/auth/register`, depois rode o SQL.

### "Update afetou 0 rows"

Causa: o usuário existe em `auth.users` mas não tem registro em `profiles` (raro — significa que signup não criou profile). Solução:

```sql
-- Criar profile manualmente
INSERT INTO public.profiles (id, full_name, role)
SELECT id, 'Claudemir Domingos', 'admin'
FROM auth.users
WHERE email = 'claudemir.lidera@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

---

## 🔐 Outros admins

Para promover outros usuários no futuro, basta repetir o SQL substituindo o email.

Para **demote** (admin → student):

```sql
UPDATE public.profiles
SET role = 'student'
WHERE id = (SELECT id FROM auth.users WHERE email = 'email@aqui.com');
```

---

## Change Log

- **2026-05-13** — Runbook criado por @devops (Gage) como parte do fix do bug "admin redireciona para dashboard". Necessário para destravar acesso ao painel admin do owner.
