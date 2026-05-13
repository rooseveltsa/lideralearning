# Runbook — Auditoria Resend em Produção

**Owner:** @devops (Gage)
**Trigger:** Story BUG.AUTOAVALIACAO.1 AC-1
**Data:** 2026-05-13
**Objetivo:** Validar que o envio de email do diagnóstico de autoavaliação está funcional em produção, e diagnosticar/corrigir qualquer falha ambiental.

---

## ⏱️ Tempo estimado: 30-45 min

## 📋 Checklist de Auditoria

### 1. Validar variáveis de ambiente no Vercel

Acesse: https://vercel.com/{org}/lideralearning/settings/environment-variables

Confirme as seguintes vars **EXISTEM** no env `Production`:

| Variável | Esperado | Status |
|---|---|---|
| `RESEND_API_KEY` | Começa com `re_` | ⬜ |
| `EMAIL_FROM` *(opcional)* | `LIDERA Treinamentos <noreply@lideralearning.vercel.app>` ou domínio próprio | ⬜ |
| `EMAIL_REPLY_TO` *(opcional)* | `claudemir@lideralearning.com.br` ou email definitivo | ⬜ |
| `NEXT_PUBLIC_SITE_URL` | `https://lideralearning.vercel.app` (ou domínio próprio) | ⬜ |
| `SUPABASE_SERVICE_ROLE_KEY` | (já existente) | ⬜ |

**Se `RESEND_API_KEY` ausente:** essa É a causa raiz. Adicione e faça redeploy.

### 2. Validar autenticação Resend

Execute localmente (ou em terminal com env de prod):

```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "LIDERA Treinamentos <noreply@lideralearning.vercel.app>",
    "to": "claudemir@gmail.com",
    "subject": "Teste auditoria — pode ignorar",
    "text": "Se você recebeu, RESEND_API_KEY está OK em prod."
  }'
```

**Resultado esperado:**
- `200 OK` com `{"id": "..."}` → API key válida ✅
- `401 Unauthorized` → API key inválida ou revogada ❌
- `403 Forbidden` → domínio remetente não verificado ❌
- `422 Validation` → from inválido ❌

### 3. Validar domínio remetente no Resend

Acesse: https://resend.com/domains

Domínio `lideralearning.vercel.app` precisa estar listado com status **"Verified"** ✅.

**Se status for "Pending" ou "Failed":**
- Vá em Add Domain → siga instruções DKIM/SPF/DMARC
- Subdomínio `vercel.app` pode não permitir DKIM custom (limitação Vercel)
- **Recomendação forte:** registrar `lideralearning.com.br` (domínio próprio) — afeta deliverability MUITO

### 4. Validar logs de envio em produção

Acesse: https://resend.com/emails

Filtre últimos 24h:
- Quantos emails foram tentados?
- Quantos bounced? Status code?
- Há padrão de falha (mesmo domínio, mesmo tipo)?

**Threshold de alerta:**
- Bounce rate > 5% = problema sério de reputação
- Delivery rate < 90% = problema de domínio ou conteúdo

### 5. Validar entrega manual

Faça lead de teste em produção:

```
1. Acesse https://lideralearning.vercel.app/treinamento/autoavaliacao
2. Responda 6 questões (qualquer resposta)
3. Clique "Quero meu PDI"
4. Preencha:
   - Nome: Teste Auditoria
   - Email: <seu_email_pessoal>
   - WhatsApp: (11) 99999-9999
5. Submit
6. Verifique:
   - Banner verde aparece com seu email
   - Email chega em < 30s na caixa de entrada
   - Email NÃO cai em spam
   - Conteúdo do email tem score + perfil + CTAs
```

### 6. Validar logs Vercel após teste

Vercel Dashboard → Project → Logs → Functions → buscar `/api/treinamento/lead-capture`

Procure linhas estruturadas (JSON):
- `"event":"lead_captured"` — confirma lead salvo
- `"event":"email_sent"` — confirma envio com `success:true`
- `"event":"email_send_failed_attempt"` ou `email_send_failed_final` — indica problema

---

## 🚨 Cenários Comuns e Resolução

### Cenário A: `RESEND_API_KEY` ausente
**Sintomas:** Logs mostram `"Email not configured (RESEND_API_KEY missing)"`
**Fix:** Adicionar env var no Vercel, fazer redeploy.

### Cenário B: API key válida, mas emails caem em spam
**Sintomas:** Resend mostra "Delivered", mas usuário não vê na caixa de entrada.
**Causa raiz:** Reputação do domínio `noreply@lideralearning.vercel.app` é fraca.
**Fix curto prazo:** Adicionar no Resend o subdomínio `vercel.app` (se possível).
**Fix correto:** Registrar `lideralearning.com.br` (domínio próprio), configurar SPF/DKIM/DMARC, migrar `EMAIL_FROM` via env var (sem deploy de código).

### Cenário C: Timeout no envio
**Sintomas:** Logs mostram `"event":"email_send_exception_attempt"` com `"Timeout after 5000ms"`
**Causa raiz:** Resend lento ou cold start do Vercel.
**Fix:** Wrapper já tem retry com backoff (5s, 30s). Se persistir, aumentar `DEFAULT_TIMEOUT_MS` em `send-with-retry.ts` para 10000ms.

### Cenário D: Domínio verificado mas DKIM falha
**Sintomas:** Bounce rate alto, mensagens "DKIM signature did not verify".
**Fix:** Re-adicionar DKIM record no DNS, aguardar 24-48h propagação.

---

## 📊 Métricas Pós-Fix (monitorar primeira semana)

| Métrica | Target | Onde ver |
|---|---|---|
| Lead capture rate (autoavaliação completa → lead salvo) | > 95% | Vercel logs grep `lead_captured` |
| Email delivery rate | > 95% | Resend dashboard |
| Email open rate | > 30% (primeiros 7 dias) | Resend dashboard |
| Bounce rate | < 3% | Resend dashboard |
| Spam complaints | 0 | Resend dashboard |

**Alerta crítico:** se delivery rate < 90% por 24h, abrir incidente e considerar migração emergencial para domínio próprio.

---

## ✅ Critério de Conclusão

- [ ] Todas as 6 etapas executadas
- [ ] Cenário identificado (A/B/C/D ou "tudo OK")
- [ ] Fix aplicado se necessário
- [ ] Email de teste chegou na caixa de entrada (não spam) em < 30s
- [ ] Métricas monitoradas por 7 dias

Documentar resultado neste arquivo no fim, em seção "Audit Result — YYYY-MM-DD".

---

## Audit Result

*(preenchido por @devops após executar)*

**Date:** _pending_
**Cenário identificado:** _pending_
**Fix aplicado:** _pending_
**Email teste recebido:** _pending_
