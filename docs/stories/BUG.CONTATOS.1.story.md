# Story BUG.CONTATOS.1 — Página de contatos com placeholders e informações erradas

**Status:** Ready for Review
**Tipo:** Bug fix (produção)
**Prioridade:** 🟠 P1 — afeta credibilidade da marca
**Pontos:** 1
**Agente atribuído:** @dev (Dex)
**Criado por:** @sm (River) — 2026-05-13
**Validado por:** @po (Pax) — 2026-05-13, score 9/10
**Reportado por:** Claudemir Domingos via briefing 2026-05-13
**URL afetada:** https://lideralearning.vercel.app/contato
**Deps:**
- 🚧 **AC-3 bloqueio operacional:** confirmação do email comercial correto com Claudemir antes de @dev começar essa AC específica. Outras ACs (1, 2, 4, 5, 6, 7) podem prosseguir sem essa confirmação.
- 🚧 **AC-5 bloqueio operacional:** confirmação de Claudemir sobre o trecho cortado "claudemi[...] verdade — não só o cargo".
**Riscos:**
- 🟡 **Hardcode espalhado em outros arquivos:** AC-7 mitiga via grep audit, mas pode revelar mais ocorrências do que esperado, ampliando escopo. Aceitável — vale corrigir tudo nesta story.
- 🟢 **Centralização em config.ts (AC-6):** mudança benigna que pode afetar imports em footer/header. CodeRabbit deve pegar qualquer regressão.

---

## Problema Reportado

Página de contatos exibe placeholders genéricos (DDD 11, números "99999-9999" / "4000-0000") em vez das informações reais do dono (Claudemir Domingos, DDD 64).

## Diagnóstico Técnico (já realizado pelo Explore)

Arquivo `src/app/contato/page.tsx` linhas 7-26 tem valores hard-coded errados:

| Campo | Atual (ERRADO) | Correto (CONFIRMADO) |
|---|---|---|
| WhatsApp display | `+55 (11) 99999-9999` | `+55 (64) 9 9609-9020` |
| WhatsApp href | `https://wa.me/5511999999999` | `https://wa.me/5564996099020` |
| Telefone display | `+55 (11) 4000-0000` | (mesmo do WhatsApp ou remover bloco) |
| Telefone href | `tel:+551140000000` | (mesmo do WhatsApp ou remover bloco) |
| Email comercial | `comercial@lideratreinamentos.com.br` | ⚠️ A CONFIRMAR com Claudemir |

A seção "Canais diretos" (linhas 60-81) tem 3 cards: Email, WhatsApp, Telefone. Todos precisam ser auditados.

---

## Acceptance Criteria

1. **AC-1 (WhatsApp correto):** Linhas 7-26 de `contato/page.tsx`:
   - Display: `+55 (64) 9 9609-9020`
   - Href: `https://wa.me/5564996099020?text=Ol%C3%A1%20Claudemir%2C%20vim%20pelo%20site`
   - Ambos atualizados consistentemente (display + link)

2. **AC-2 (Telefone consolidado):** Como Claudemir opera como pessoa-única no contato direto, **remover o card de "Telefone" separado** OU usar mesmo número do WhatsApp. Decidir com base em decisão UX:
   - **Opção A (recomendada):** Remover card "Telefone", manter apenas "Email" + "WhatsApp"
   - **Opção B:** Manter card com mesmo número WhatsApp e label "Ligação direta (mesmo número WhatsApp)"

3. **AC-3 (Email comercial confirmado):** ⚠️ Precisa input do owner antes de fixar. Opções:
   - `claudemir@lideralearning.com.br` (se domínio próprio existe)
   - `contato@lideralearning.com.br`
   - `claudemir.ferreira@lideratreinamentos.com.br`
   - Manter `comercial@lideratreinamentos.com.br` se domínio é oficial
   - **Ação:** @dev pergunta ao Claudemir antes de implementar. Atualizar Change Log com decisão.

4. **AC-4 (Nome + cargo do responsável):** Verificar se a página exibe "Claudemir Domingos" em algum lugar como ponto de contato. Se exibe, garantir grafia correta e cargo (sugestão: "CEO & Founder" ou "Fundador" — confirmar com Claudemir).

5. **AC-5 (Texto cortado do briefing):** O briefing original mencionava algo sobre "Canais diretos / E-mail comercial / claudemi[...] verdade — não só o cargo" — texto chegou cortado. Investigar se há outra correção textual além dos dados de contato. Se houver, criar follow-up story; se não, fechar nesta.

6. **AC-6 (Centralizar contato em config):** Extrair valores para `src/lib/config/contact.ts`:
   ```typescript
   export const CONTACT = {
     whatsapp: { display: '+55 (64) 9 9609-9020', e164: '5564996099020', url: 'https://wa.me/5564996099020' },
     email: { commercial: '...', ceo: '...' },
     owner: { name: 'Claudemir Domingos', role: 'Fundador' },
     instagram: '@lideratreinamentos',
     linkedin: 'linkedin.com/company/lideratreinamentos',
   }
   ```
   Page importa de `CONTACT.*` em vez de hardcode. Previne regressão futura.

7. **AC-7 (Audit cross-site):** Grep no projeto inteiro por `99999-9999`, `5511999999999`, `4000-0000`, `(11) 4000` — confirmar que NENHUM outro arquivo tem esses placeholders. Se houver, listar e corrigir todos nesta story.

---

## Tasks / Subtasks

- [ ] **T1 (@dev):** Confirmar email correto com Claudemir (AC-3)
- [ ] **T2 (@dev):** Criar `src/lib/config/contact.ts` (AC-6)
- [ ] **T3 (@dev):** Refatorar `src/app/contato/page.tsx` para usar `CONTACT.*` (AC-1, AC-2, AC-3)
- [ ] **T4 (@dev):** Grep + fix em outros arquivos com placeholders (AC-7)
- [ ] **T5 (@qa):** Visual QA mobile + desktop confirma layout não quebrou

---

## Dev Notes

### Decisão arquitetural
- **Centralização em config:** vale o investimento mesmo para 1 story de 1pt. Esses valores aparecem em footer, header, contato, autoavaliação (link WhatsApp Claudemir), emails. Hardcode espalhado é débito técnico.

---

## Out of Scope

- ❌ Redesign da página de contatos (apenas fix dos valores)
- ❌ Adicionar formulário de contato (não no escopo desta story)
- ❌ Integrar contato com CRM (já tem lead capture separado)

---

## Definition of Done

- [ ] Todos os 7 ACs verificados (AC-3 desbloqueado pela resposta do Claudemir)
- [ ] Visual QA mobile/desktop OK
- [ ] CodeRabbit review limpo
- [ ] Push para prod feito por @devops
- [ ] Claudemir confirma visualmente em prod

---

## Change Log

- **2026-05-13** — Story criada por @sm (River) com base em report direto do owner + Explore confirmando placeholders. P1 porque é credibilidade visível para qualquer prospect que abra a página.
- **2026-05-13** — Validada por @po (Pax) com 10-point checklist, score 9/10 → status `Draft → Ready` (com bloqueio operacional em AC-3 + AC-5 até confirmação do owner). Adicionada seção "Deps" + "Riscos" formal (fix-A). @dev pode começar pelas ACs 1, 2, 4, 6, 7 sem aguardar confirmação.
