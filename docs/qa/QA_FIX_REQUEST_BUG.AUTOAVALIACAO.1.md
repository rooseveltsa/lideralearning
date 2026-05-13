# QA Fix Request — BUG.AUTOAVALIACAO.1

**Story:** `docs/stories/BUG.AUTOAVALIACAO.1.story.md`
**Issued by:** @qa (Quinn)
**Issued to:** @dev (Dex)
**Date:** 2026-05-13
**Original Gate:** CONCERNS
**Path chosen by owner:** Opção 2 — fix completo (H1 + H2 + M1 + M2) antes do push
**Estimated effort:** ~3h

---

## Escopo deste Fix Request

Corrigir 2 HIGH issues + 2 MEDIUM issues identificados na QA Review. Após fix, story volta para `Ready for Review` e @qa faz re-review.

**Out of scope deste fix:**
- M3 (build validation) — @devops faz antes do push
- M4 (Playwright smoke test) — vira tech debt em story separada
- L1 (a11y aria-live) — vira tech debt
- L2 (rate limiting pré-existente) — vira tech debt

---

## 🟠 H1 — Retry policy vs Vercel timeout

**Arquivo:** `src/lib/email/send-with-retry.ts`

**Problema:**
- `RETRY_DELAYS_MS = [5000, 30000]` + `DEFAULT_TIMEOUT_MS = 5000`
- Worst case: 5s tentativa 1 + 5s espera + 5s tentativa 2 + 30s espera + 5s tentativa 3 ≈ **55s**
- Vercel Hobby plan: 10s timeout duro. Vercel Pro: 60s.
- Resultado prático: na Hobby, retries 2-3 NUNCA executam — a função morre em 10s.

**Fix esperado:**

Substituir:
```typescript
const DEFAULT_TIMEOUT_MS = 5000
const RETRY_DELAYS_MS = [5000, 30000]
```

Por:
```typescript
const DEFAULT_TIMEOUT_MS = 4000  // 4s por tentativa (margem para serverless)
const RETRY_DELAYS_MS = [2000]   // 1 retry após 2s — worst case ~10s total
```

Worst case novo: 4s + 2s + 4s = 10s — dentro do limite Vercel Hobby (10s).

**Alternativa (se quiser preservar retry agressivo):** mover retries 2 e 3 para background job no Trigger.dev/Inngest (assíncrono). Mas isso é overkill para esta story — Opção mínima acima resolve.

**Critério de aceitação:**
- [ ] `DEFAULT_TIMEOUT_MS` ≤ 4000ms
- [ ] `RETRY_DELAYS_MS` resulta em worst-case ≤ 10s total
- [ ] Comentário no código explicando o porquê (constraint Vercel Hobby)
- [ ] Logger continua reportando `attempts` corretamente

---

## 🟠 H2 — Template `assessment-complete` incompleto vs AC-4

**Arquivo:** `src/lib/email/templates/assessment-complete.tsx`

**Problema:**
AC-4 listava 5 requisitos para o template; 2 críticos foram skipped:

1. ❌ **Faltando:** "5 dimensões individualmente com %"
2. ❌ **Faltando:** "Top 3 gaps prioritários"
3. ❌ **Faltando:** "Footer LGPD com link de unsubscribe ou email do DPO"

**Fix esperado:**

### 1. Aceitar mais dados no template

Mudar signature:
```typescript
export function AssessmentCompleteEmailTemplate(props: {
  name: string
  perfil: string
  score: number
  dimensoes?: {
    percepcao: number
    gestao: number
    comunicacao: number
    tecnologia: number
    etica: number
    dor: number
  }
  topGaps?: Array<{ titulo: string; nota: number; recomendacao: string }>
}): React.ReactElement
```

### 2. Atualizar `src/lib/email/send.ts` template builder

Passar `dimensoes` e `topGaps` para o template quando disponíveis (em fallback, esconder seção).

### 3. Atualizar `src/app/api/treinamento/lead-capture/route.ts`

Aceitar `respostas` no payload (já aceita) + calcular topGaps server-side. Adicionar helper `computeTopGaps(respostas)` que retorna as 3 dimensões com menor pontuação + recomendação textual mapeada.

Sugestão de mapping (fica em `src/lib/treinamento/recomendacoes.ts`):
```typescript
export const RECOMENDACOES_POR_DIMENSAO = {
  percepcao: 'Praticar antecipação proativa de problemas...',
  gestao: 'Estruturar matriz de competências da equipe...',
  comunicacao: 'Fortalecer feedback assertivo com técnicas SBI...',
  tecnologia: 'Adotar acompanhamento diário de KPIs...',
  etica: 'Reforçar exemplo e integridade nos processos...',
  dor: 'Mapear urgências e definir plano de ação 12 semanas...',
}
```

### 4. Adicionar seção visual no template (entre Score e PDI Notice)

- Lista das 6 dimensões com barra visual + % calculado (`(nota/3) * 100`)
- Box destacando "Seus 3 gaps prioritários" com título + recomendação curta para cada um

### 5. Footer LGPD com unsubscribe

Como SDR.1.7 (LGPD opt-out flow) ainda não está implementado, footer mínimo:
- Link `<a href="mailto:claudemir@lideralearning.com.br?subject=Remover%20da%20lista">Não desejo receber estes emails</a>`
- Texto curto: "Você recebeu porque concluiu a autoavaliação. Para sair, basta replicar este email."

**Critério de aceitação:**
- [ ] Template aceita `dimensoes` e `topGaps` opcionalmente
- [ ] Seção visual de 6 dimensões com barras + % renderiza corretamente em Gmail/Outlook
- [ ] Box "3 gaps prioritários" renderiza
- [ ] Footer tem link mailto de unsubscribe funcional
- [ ] Quando `dimensoes` ausente (fallback), template não quebra — apenas omite a seção

---

## 🟡 M1 — PII (email) em logs estruturados

**Arquivo:** `src/lib/logger/structured.ts`

**Problema:**
Logger registra emails em texto plano em todos os eventos (`lead_captured`, `email_sent`, etc.). Compliance LGPD recomenda minimização de dados em logs.

**Fix esperado:**

Adicionar helper de mascaramento exportado:

```typescript
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return '***'
  const [local, domain] = email.split('@')
  const localMasked = local.length <= 2 ? '*'.repeat(local.length) : `${local[0]}***${local[local.length - 1]}`
  const [domainName, ...tld] = domain.split('.')
  const domainMasked = domainName.length <= 2 ? '*'.repeat(domainName.length) : `${domainName[0]}***`
  return `${localMasked}@${domainMasked}.${tld.join('.')}`
}
```

Aplicar em todos os call sites:
- `src/app/api/treinamento/lead-capture/route.ts` — todos os `logger.*({ email })` → `logger.*({ email: maskEmail(email) })`
- `src/lib/email/send-with-retry.ts` — mesmo tratamento em `to`

**Critério de aceitação:**
- [ ] `maskEmail` exportado e usado em todos os logger calls que passam email
- [ ] Logs em prod mostram `j***o@g***.com` em vez de `john@gmail.com`
- [ ] Unit test do helper com 5 cenários (vazio, sem @, 1 char local, normal, subdomínio)

---

## 🟡 M2 — Unit tests do `send-with-retry`

**Arquivo novo:** `src/lib/email/__tests__/send-with-retry.test.ts`

**Cenários obrigatórios (mínimo 4):**

1. **Success na 1ª tentativa:** mock `sendEmail` retorna `{success: true}` → resultado `{success: true, attempts: 1}`
2. **Success na 2ª tentativa (retry):** mock falha primeira, sucede segunda → `{success: true, attempts: 2}`
3. **Falha final após todos retries:** mock falha sempre → `{success: false, error: '...', attempts: 2}` (2 attempts com novo `RETRY_DELAYS_MS = [2000]`)
4. **Timeout (DEFAULT_TIMEOUT_MS):** mock nunca resolve → timeout chega antes → falha conforme esperado

**Setup:**
- Framework: verificar se projeto usa Vitest, Jest ou outro. Provavelmente Vitest dado que é Next 16 + React 19. Se nenhum estiver configurado, **abrir question com user antes de instalar** (evita scope creep).

**Critério de aceitação:**
- [ ] 4 cenários implementados
- [ ] Coverage ≥ 80% do arquivo `send-with-retry.ts`
- [ ] Testes passam em CI (rodar `npm test` ou equivalente)

---

## 🚨 Não fazer (out of scope deste fix request)

- ❌ Refatorar logger para usar pino/winston (mantém implementação atual simples)
- ❌ Adicionar Playwright (vira story tech debt separada)
- ❌ Adicionar rate limiting no endpoint (issue pré-existente)
- ❌ Migrar para domínio `lideralearning.com.br` (story separada)
- ❌ Adicionar ARIA live no banner (vira tech debt LOW)

---

## Workflow esperado

1. @dev executa `*apply-qa-fixes` ou implementa manualmente
2. Para cada issue, marcar checkbox no critério de aceitação acima
3. Rodar `npx tsc --noEmit` ao final
4. Rodar `npm test` se possível
5. Atualizar Dev Agent Record da story com novos arquivos/decisões
6. Mudar Status story para `Ready for Review` novamente
7. Notificar @qa para re-review

Tempo estimado total: **~3h** (H1: 15min, H2: 90min, M1: 30min, M2: 60min)

---

## Change Log

- **2026-05-13** — Fix request criado por @qa após gate CONCERNS em first review. Owner escolheu Opção 2 (fix completo antes do push).
