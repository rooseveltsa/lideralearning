# Backlog — Epic PDI (Devolutiva que Funciona + DISC com Olhar Técnico)

**Epic:** `docs/stories/epics/EPIC-PDI-devolutiva-disc.md`
**Stack:** Next.js App Router + Supabase + NVIDIA NIM (Llama 3.3 70B) + Resend — herda do projeto
**Design system:** herda do projeto (Lidera)

Estimativa em **points** (Fibonacci 1/2/3/5/8/13) — referência: 1 pt ≈ 0.5 dia.

---

## 🔴 SPRINT 0 — Destravar a devolutiva (13 pts, ~2 dias) — BLOQUEIA TUDO

> Nada do S1/S2 começa antes do S0 estar em produção e verificado com um preenchimento real de ponta a ponta.

---

### PDI.0.1 — Geração do PDI sobrevive ao fim da request
**Pontos:** 5 · **Deps:** nenhuma · **Agente:** @dev · **Severidade:** 🔴 crítica

**Objetivo:** O PDI passa a ser efetivamente gerado e gravado. Hoje não é.

**Causa raiz:** `void (async () => {...})()` disparado sem `await`, seguido de `return NextResponse.json(...)`. A Vercel congela a execução na resposta e a promise é descartada. Não existe `waitUntil`, `after()`, `maxDuration` nem `vercel.json` em nenhum lugar do repositório.

**Arquivos:**
- `src/app/api/diagnostico/pessoal/route.ts` (linhas 282–384)
- `src/app/api/diagnostico/empresa/route.ts` (linha 232 — bug idêntico)

**Abordagem (nesta ordem de preferência):**
1. **`after()` do `next/server`** — mantém a arquitetura atual, trabalho pós-resposta é oficialmente suportado. Requer `export const maxDuration = 60`.
2. **Plano B (se `after()` não segurar os 30s do LLM):** rota dedicada `POST /api/diagnostico/pessoal/[id]/gerar-pdi`, chamada pelo cliente a partir da página de resultado, com polling e estado visível.

**AC:**
- [ ] `export const maxDuration = 60` nas duas rotas
- [ ] Geração do PDI executada via `after()` (ou rota dedicada, se o plano B for acionado)
- [ ] Envio de e-mail movido para dentro do mesmo bloco pós-resposta — hoje ele é `await`-ado ANTES (linha 266) e já consome o orçamento de 10s do plano Hobby (`send-with-retry.ts:14-17`) antes de o PDI sequer começar
- [ ] Preenchimento real em produção → `personal_diagnostics.pdi.generated` populado em < 3 min
- [ ] Mesmo teste no funil de empresa → `b2b_diagnostics.espaco_aberto.pdi_generated` populado
- [ ] Se a geração falhar, o registro grava `pdi.error` com timestamp e motivo (input para PDI.0.4)

**Riscos:** timeout da Vercel. Mitigação: medir tempo real do LLM em prod antes de fechar a story; se p95 > 45s, acionar plano B.

---

### PDI.0.2 — Variáveis de ambiente de produção + `.env.example` honesto
**Pontos:** 2 · **Deps:** nenhuma · **Agente:** @devops · **Severidade:** 🔴 crítica

**Objetivo:** A IA e o e-mail passam a existir em produção.

**Estado atual (`.env.production` puxado da Vercel):** só existem `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SUPABASE_*`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`. **`NVIDIA_API_KEY` e `RESEND_API_KEY` não estão lá.**

**AC:**
- [ ] `NVIDIA_API_KEY` setada na Vercel (prod + preview) → `pdi_no_nvidia_key_fallback` para de aparecer nos logs
- [ ] `RESEND_API_KEY` setada na Vercel (prod + preview) → fecha a task `T1 (@devops)` pendente em `docs/stories/BUG.AUTOAVALIACAO.1.story.md:77` e o runbook `docs/troubleshooting/RESEND-PROD-AUDIT.md`
- [ ] `ADMIN_NOTIFICATION_EMAIL`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `NEXT_PUBLIC_APP_URL` conferidas
- [ ] `.env.example` atualizado com as 9 variáveis hoje ausentes: `NVIDIA_API_KEY`, `ADMIN_NOTIFICATION_EMAIL`, `EMAIL_FROM`, `EMAIL_REPLY_TO`, `NEXT_PUBLIC_APP_URL`, `PDI_CHECKOUT_ENABLED`, `PDI_PRICE_CENTS`, `CRON_SECRET`, `META_CAPI_TOKEN`
- [ ] Redeploy + verificação: um preenchimento real gera PDI **pela IA** (não pelo fallback) e o e-mail chega

---

### PDI.0.3 — Desarmar o paywall do PDI
**Pontos:** 1 · **Deps:** nenhuma · **Agente:** @devops · **Severidade:** 🟡 alta

**Objetivo:** Garantir que o paywall não bloqueie a devolutiva. Decisão do Júnior: cobrança de PDI sai de cena por ora.

**AC:**
- [ ] Confirmar valor atual de `PDI_CHECKOUT_ENABLED` na Vercel; setar explicitamente `false`
- [ ] Verificar no Supabase (`information_schema.columns`) se `58_pdi_checkout.sql` rodou — se `personal_diagnostics.pdi_paid_at` não existir e a flag estivesse `true`, o paywall estava travando a entrega **de forma permanente**
- [ ] Registrar no epic o estado real da migration 58 (rodou / não rodou)
- [ ] Página `/diagnostico/pessoal/pdi/[id]` entrega o PDI sem paywall, verificado em prod

**Nota:** o código do checkout (`funnel.ts`, `PdiPaywall.tsx`, `checkout-actions.ts`) **fica no repo**, apenas desligado. Remoção definitiva só depois de decidir a monetização com dados (pós-S1).

---

### PDI.0.4 — Falha de PDI nunca mais é silenciosa
**Pontos:** 2 · **Deps:** PDI.0.1 · **Agente:** @dev · **Severidade:** 🔴 crítica

**Objetivo:** Se o PDI falhar, o time descobre em minutos — não pelo cliente reclamando.

**Estado atual:** `route.ts:369-374` apenas loga `pdi_generation_failed`. `checkout-actions.ts:176-178` tem `catch { return false }` sem log nenhum. O usuário vê "processando…" eternamente.

**Arquivos:** `src/app/api/diagnostico/pessoal/route.ts`, `src/app/api/diagnostico/empresa/route.ts`, `src/lib/email/` (novo template de alerta)

**AC:**
- [ ] Falha na geração → e-mail de alerta para `ADMIN_NOTIFICATION_EMAIL` com id do diagnóstico, erro e link para reprocessar
- [ ] Falha no envio de e-mail → mesmo alerta
- [ ] `catch { return false }` de `checkout-actions.ts:176` passa a logar
- [ ] A página do PDI diferencia **"gerando"** (< 3 min, mostra spinner) de **"falhou"** (> 3 min, mostra mensagem honesta + botão "tentar novamente" + contato) — hoje ambos mostram a mesma tela de espera infinita

---

### PDI.0.6 — 🔴 `generate-missing-pdis` está aberta na internet
**Pontos:** 1 · **Deps:** nenhuma · **Agente:** @dev · **Severidade:** 🔴 crítica (segurança)

**Achado durante a implementação do PDI.0.5.**

`src/app/api/admin/generate-missing-pdis/route.ts` exporta um `POST` **sem nenhuma verificação de autenticação** — não checa sessão, não checa role, não exige `CRON_SECRET`. Qualquer pessoa que descubra a URL dispara geração de PDI em massa contra a base inteira (custo de LLM + escrita no banco).

**AC:**
- [ ] Aplicar o mesmo guard de `api/admin/diagnosticos/reprocessar-pdi` (sessão Supabase + `profiles.role = 'admin'`)
- [ ] Auditar as demais rotas sob `src/app/api/admin/` — ver se alguma outra está aberta
- [ ] Se alguma precisar ser chamada por cron, usar `CRON_SECRET` em header, nunca rota pública

---

### PDI.0.5 — Backfill: recuperar todos os PDIs perdidos
**Pontos:** 3 · **Deps:** PDI.0.1, PDI.0.2 · **Agente:** @dev · **Severidade:** 🟡 alta

**Objetivo:** Ninguém que já preencheu fica sem devolutiva. Hoje **todos** estão órfãos, e não existe nenhuma rotina que os recupere (`api/admin/generate-missing-pdis` atende a tabela `leadership_pdi` — o *outro* sistema, do funil de treinamento).

**Arquivos:** `src/app/api/admin/diagnosticos/reprocessar-pdi/route.ts` (novo), tela admin em `src/app/admin/`

**AC:**
- [ ] Endpoint admin lista diagnósticos com `pdi.generated` ausente (pessoal + empresa), com contagem
- [ ] Reprocessa em lote, com rate limit (não estourar a NVIDIA nem o timeout)
- [ ] Opção de **reenviar o e-mail** com o link do PDI para quem foi recuperado
- [ ] Protegido por auth de admin (não expor `CRON_SECRET` em rota pública)
- [ ] Executado em prod → **zero diagnósticos órfãos**
- [ ] Relatar ao Júnior/Claudemir quantas pessoas foram recuperadas (dado comercial: são leads quentes esquecidos)

---

## SPRINT 1 — DISC com olhar técnico + cruzamento 360 (21 pts, ~1,5 sem)

> A demanda do Claudemir. Só começa depois do S0 verificado em prod.

---

### PDI.1.1 — Guarda-corpo ético do DISC (prompt + teste)
**Pontos:** 3 · **Deps:** S0 · **Agente:** @dev + @po · **Severidade:** 🔴 crítica (risco jurídico)

**Objetivo:** O DISC nunca rotula ninguém. Isso vira código, não recomendação.

**Contexto:** o próprio Claudemir levantou o ponto: DISC **não é** teste psicológico regulamentado, é mapeamento comportamental. Isso nos permite aplicá-lo sem psicólogo habilitado — desde que a devolutiva jamais funcione como instrumento de seleção ou diagnóstico.

**Arquivos:** `src/lib/ai/prompts/pdi-pessoal-prompt.ts`, `src/lib/ai/prompts/disc-guardrails.ts` (novo), `tests/` (novo)

**AC:**
- [ ] Bloco de guarda-corpo no system prompt: linguagem de desenvolvimento; comportamento observável em contexto, não personalidade fixa; nunca rótulo
- [ ] Lista de termos/padrões **proibidos** no output: "você é um D/I/S/C", "perfil incompatível", qualquer recomendação de contratar/demitir/promover, qualquer termo clínico
- [ ] Disclaimer obrigatório renderizado na página do PDI (não só no prompt)
- [ ] **Teste automatizado** que roda o gerador contra N perfis sintéticos e falha o build se algum termo proibido aparecer
- [ ] Revisão do texto final por @po antes do merge

---

### PDI.1.2 — Persona técnica: psicólogo organizacional
**Pontos:** 3 · **Deps:** PDI.1.1 · **Agente:** @dev

**Objetivo:** Elevar a qualidade interpretativa da devolutiva. Hoje o prompt gera plano; falta a **leitura**.

**Arquivos:** `src/lib/ai/prompts/pdi-pessoal-prompt.ts` (336 linhas, estender), `src/lib/diagnostico/pdi-knowledge/disc-strategies.ts`

**AC:**
- [ ] System prompt assume papel de psicólogo organizacional aplicando DISC ao desenvolvimento de liderança (não à seleção), com as referências que o Claudemir levantou (Marston 1928 como origem teórica; DISC como mapeamento, não teste)
- [ ] Output ganha seção de **leitura comportamental**: como o perfil se manifesta sob pressão, em conflito, ao delegar, ao dar feedback
- [ ] Cada afirmação da leitura é ancorada em uma resposta concreta do formulário (rastreabilidade — nada de texto genérico de bolo)
- [ ] Comparação A/B contra o PDI atual em 5 casos reais, avaliada pelo Claudemir

---

### PDI.1.3 — Cruzamento 360: autoavaliação × avaliação executiva
**Pontos:** 8 · **Deps:** PDI.1.2 · **Agente:** @dev + @data-engineer · **Severidade:** ⭐ diferencial do produto

**Objetivo:** O ativo que ninguém mais entrega: o ponto cego. *"Você se vê D; seu time te vê C."*

**Contexto:** hoje autoavaliação (`api/treinamento/autoavaliacao`) e avaliação executiva (`api/treinamento/avaliacao-executiva`) existem, mas **não conversam**. O valor está exatamente no delta entre elas.

**AC:**
- [ ] Modelo de dados liga autoavaliação e avaliação(ões) executiva(s) do mesmo líder (migration nova, aplicada em prod com AC explícito)
- [ ] Cálculo do **gap** por dimensão DISC e por competência dos 8 módulos
- [ ] Classificação do gap: **ponto cego** (o outro vê pior), **força não reconhecida** (o outro vê melhor), **alinhado**
- [ ] A IA interpreta o gap com cuidado — hipótese de leitura, nunca veredito
- [ ] Visualização do delta na página do PDI (radar sobreposto: eu × meu time)
- [ ] Regra de privacidade: com menos de 3 avaliadores, **não** exibe o cruzamento (protege anonimato de quem avaliou) — decisão de produto, não técnica: confirmar com @po

---

### PDI.1.4 — Mapa DISC → 8 módulos Lidera → ferramentas
**Pontos:** 5 · **Deps:** PDI.1.2 · **Agente:** @dev

**Objetivo:** Fechar o loop que o Claudemir desenhou: o DISC deixa de ser autoconhecimento solto e passa a **prescrever** trilha dentro do método Lidera.

**Base existente:** `pdi-knowledge/modulos-lidera.ts`, `ferramentas.ts` (10 IDs), `niveis-lider.ts` (5), `potencializacao-por-forca.ts`. A tese dos "2 motores" (força → ferramentas/multiplicador; fraqueza → módulo) já está implementada só do lado da força.

**AC:**
- [ ] Matriz explícita: perfil DISC × gap → módulo Lidera prioritário → ferramenta → conteúdo didático
- [ ] Cobre os 8 temas do Claudemir: inteligência emocional, liderança situacional, feedback estruturado, comunicação adaptativa, gestão de conflitos, delegação, desenvolvimento de equipes, cultura organizacional
- [ ] **Fecha a lacuna registrada na memória do projeto:** prescrição por *tipo de gap* (hoje só o lado "força" existe)
- [ ] Corrigir bug de validação em `pdi-generator.ts:45-52` — há um `return true` dentro do loop de referências que aborta a validação restante ao encontrar a primeira `literaturaId` inválida
- [ ] Todo módulo/ferramenta citado no PDI existe de fato no catálogo (sem alucinação de conteúdo)

---

### PDI.1.5 — Medir se a devolutiva é boa
**Pontos:** 2 · **Deps:** PDI.1.3 · **Agente:** @dev

**AC:**
- [ ] Pesquisa de 1 clique no fim do PDI ("isso te ajudou?" 1–5) gravada no Supabase
- [ ] Dashboard admin: taxa de geração, % IA vs fallback, nota média, CTR do CTA de treinamento
- [ ] Métricas do epic passam a ser observáveis, não estimadas

---

## SPRINT 2 — Cultura organizacional (13 pts, ~1 sem)

> *"Quanto a CULTURA ORGANIZACIONAL, essa sim, acho que se queremos ser grandes, precisamos partir com proposta minimamente organizada e que nossos clientes tenham clareza de como agimos com eles e com nossos times."* — Claudemir, 13/07

---

### PDI.2.1 — Manifesto de cultura da Lidera
**Pontos:** 3 · **Deps:** nenhuma (**pode correr em paralelo com o S0**) · **Agente:** @po + Claudemir

**Objetivo:** A Lidera declara como age — com clientes e com o próprio time. Entregável de conteúdo, não de código.

**AC:**
- [ ] Documento em `docs/cultura/MANIFESTO-LIDERA.md`: princípios, como tratamos o cliente, como tratamos o time, o que não fazemos
- [ ] Escrito pelo Claudemir (é a voz dele), estruturado por @po
- [ ] Coerente com o posicionamento já existente no site ("formar líderes estrategistas")
- [ ] Página pública `/cultura` no design system Lidera
- [ ] Referenciável em proposta comercial

---

### PDI.2.2 — Devolutiva de cultura para o cliente
**Pontos:** 8 · **Deps:** PDI.2.1, S1 · **Agente:** @dev

**Objetivo:** O instrumento de cultura (`/pesquisa/cultura`, já existente) ganha devolutiva — espelho organizacional do PDI individual.

**AC:**
- [ ] Reaproveita o motor e os guarda-corpos do S1 (não criar motor novo)
- [ ] Devolutiva organizacional: onde a cultura declarada difere da percebida
- [ ] Nunca identifica respondente individual (agregado, mínimo de N respostas)
- [ ] Liga o resultado aos módulos Lidera (cultura é um dos 8 temas)

---

### PDI.2.3 — Reabrir a decisão de monetização
**Pontos:** 2 · **Deps:** PDI.1.5 (precisa de dados) · **Agente:** @po + Júnior

**Objetivo:** Decidir com número, não com achismo.

**AC:**
- [ ] Com 30+ PDIs entregues: medir CTR do PDI → treinamento
- [ ] Decidir: PDI é isca (grátis sempre) ou produto de entrada (pago para PF)?
- [ ] Se for isca: **remover** `funnel.ts`, `PdiPaywall.tsx`, `checkout-actions.ts` e a migration 58 do caminho crítico
- [ ] Se for produto: **antes de reativar**, entregar de fato o "PDF completo" que o paywall promete (`PdiPaywall.tsx:13`) — hoje é só `window.print()`

---

### PDI.2.4 — [Dívida técnica] Dois motores de PDI
**Pontos:** — · **Deps:** — · **Agente:** @architect

**Não fazer agora. Registrar para não esquecer.**

Existem dois sistemas de PDI totalmente independentes:
- **Funil de diagnóstico** (público, com IA): `src/lib/diagnostico/pdi-generator.ts`
- **Funil de treinamento** (aluno logado, 100% rule-based): `src/lib/utils/pdi-generator.ts`, 1004 linhas

Eles não compartilham knowledge base, prompts nem formato de saída. Conforme o S1 evoluir o motor de diagnóstico, a divergência aumenta. Decidir a convergência **depois** do S1, com o formato final do PDI já estabilizado.
