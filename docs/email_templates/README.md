# Como Configurar E-mails Transacionais no Supabase

Este documento instrui como anexar os templates visuais premium (Boas-vindas e Recuperação de Senha) aos disparos nativos de e-mail do Supabase.

1. Acesse seu painel do **Supabase**.
2. Vá em **Authentication** > **E-mail Templates**.

### Template Confirmação de E-mail (Boas-vindas)
No Supabase, procure pela aba **Confirm signup**.
- **Subject:** `Bem-vindo(a) à Lidera Treinamentos! Confirme seu acesso` 
- **Source:** Copie todo o conteúdo do arquivo `welcome.html` (fornecido nesta pasta) e cole no editor de Source (Código-fonte HTML) do Supabase.

### Template Redefinição de Senha
No Supabase, procure pela aba **Reset Password**.
- **Subject:** `Lidera Treinamentos — Redefinição de Senha` 
- **Source:** Copie todo o conteúdo do arquivo `reset_password.html` (nesta pasta) e cole no editor de código fonte do Supabase.

> **Dica:** Os templates já estão formatados usando as variáveis exatas (`{{ .ConfirmationURL }}`, `{{ .Data.full_name }}`) nativas do compilador de templates do Supabase Auth.
