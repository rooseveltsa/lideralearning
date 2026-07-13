# Epic PDI — Devolutiva que Funciona + DISC com Olhar Técnico

**Status:** Ready
**Criado por:** @architect
**Data:** 2026-07-13
**Source:** Conversa Claudemir (WhatsApp, 12–13/07/2026) + auditoria técnica do pipeline de PDI (13/07/2026)
**Prefixo de stories:** `PDI.{sprint}.{n}`
**Backlog:** `docs/stories/PDI-backlog.md`

---

## O problema real

O Claudemir escreveu: *"Travamos aqui novamente. Que está me preocupando mesmo é essa parte, ela é fundamental para projeto, após a venda é claro."*

Ele tem razão — mas a causa não é a que parece. **O PDI não está "difícil de gerar". Ele está quebrado, e falha em silêncio.**

A auditoria do código encontrou uma cadeia de três falhas somadas:

| # | Falha | Onde | Efeito |
|---|---|---|---|
| 1 | Geração do PDI roda como `void (async () => {...})()` **depois** do `return` da rota | `src/app/api/diagnostico/pessoal/route.ts:284` (e `empresa/route.ts:232`) | Serverless da Vercel congela a execução quando a response sai → a geração é abortada → `pdi.generated` **nunca é gravado** |
| 2 | `NVIDIA_API_KEY` ausente em produção | Vercel env | Mesmo se rodasse, cairia sempre no fallback determinístico → PDI genérico |
| 3 | `RESEND_API_KEY` ausente em produção | Vercel env | O e-mail é o **único** portador do link do PDI → o usuário nunca sabe que existe |

**Resultado para quem preencheu:** não recebe e-mail; se achar a página sozinho, vê *"Seu PDI está sendo gerado… Recarregue esta página em alguns segundos"* para sempre (`pdi/[id]/page.tsx:77`). Nenhum erro é exibido, nenhum alerta é disparado. Todos os PDIs de quem já preencheu **estão perdidos** — não existe rotina de reprocessamento.

**Bomba armada:** se `PDI_CHECKOUT_ENABLED=true` na Vercel e a migration `58_pdi_checkout.sql` não tiver rodado, o paywall bloqueia a devolutiva de forma permanente — nem pagando destrava (`checkout-actions.ts:11` já documenta o risco).

### A conclusão que importa

Nenhuma quantidade de DISC, IA ou metodologia resolve isso. **É bug de infraestrutura, não de produto.** A proposta do Claudemir (DISC + 8 módulos) é excelente e é camada de cima — mas construir camada de cima sobre um cano entupido é desperdício. Por isso o Sprint 0 existe e bloqueia todo o resto.

---

## Decisões travadas (Júnior, 13/07/2026)

1. **Paywall do PDI: desligado agora.** `PDI_CHECKOUT_ENABLED=false`, travado. Primeiro a devolutiva funciona e vira prova de valor; monetização volta na fase 2 com dados reais de conversão. Racional do próprio Júnior: *"só dá pra cobrar de pessoa física, CNPJ não vai pagar para ter acesso a PDI"* — cobrar PDI avulso de B2B é fricção sem receita.
2. **DISC: interpretação + cruzamento 360.** Usa o DISC já coletado, gera leitura técnica e cruza **autoavaliação × avaliação executiva** para revelar pontos cegos. Não construir instrumento DISC próprio agora.
3. **Cultura organizacional: os dois, nessa ordem.** Primeiro o manifesto institucional da Lidera (rápido, alto valor comercial), depois evoluir `/pesquisa/cultura` em devolutiva de cultura para o cliente.

---

## Objetivos

1. **Toda pessoa que preenche recebe a devolutiva.** Sem exceção, sem intervenção manual do Claudemir, em menos de 3 minutos. Se falhar, alguém é avisado.
2. **Ninguém fica para trás.** Backfill de 100% dos diagnósticos órfãos (com `pdi.generated` ausente).
3. **A devolutiva tem olhar técnico.** O DISC deixa de ser gráfico bonito e vira leitura comportamental aplicada à liderança, ancorada nos 8 módulos Lidera e nas ferramentas do método.
4. **O ponto cego aparece.** O cruzamento autoavaliação × avaliação executiva é o ativo diferenciado: *"você se vê D; seu time te vê C"*. É isso que nenhuma plataforma barata entrega.
5. **A Lidera declara sua cultura.** Manifesto público, para o cliente saber como agimos — pré-requisito de escala, como o Claudemir apontou.

---

## Restrições críticas

- **Ética antes de tudo — DISC não é teste psicológico.** O próprio Claudemir levantou isso, e está tecnicamente correto: DISC é *mapeamento comportamental*, não instrumento regulamentado pelo CFP. Consequência de engenharia, não de boa intenção:
  - Linguagem **de desenvolvimento**, nunca de rótulo, diagnóstico clínico ou seleção.
  - **Proibido** no output: "você é um D", "perfil incompatível com a função", qualquer recomendação de contratar/demitir/promover.
  - **Obrigatório** no output: disclaimer de que é ferramenta de autoconhecimento e comunicação, que descreve comportamento observável em contexto, não personalidade fixa.
  - Isso vira **guarda-corpo no system prompt + teste automatizado de output**, não apenas orientação.
- **Não criar arquitetura paralela.** O motor (`src/lib/diagnostico/pdi-generator.ts`), a knowledge base (`pdi-knowledge/`) e os prompts já existem e são bons. Estender, não reescrever.
- **Um motor, não dois.** Hoje existem dois sistemas de PDI independentes (funil de diagnóstico com IA + funil de treinamento rule-based, `src/lib/utils/pdi-generator.ts`, 1004 linhas). Não unificar agora — mas **não deixar a divergência crescer**. Convergência entra no backlog como dívida explícita (PDI.2.4).
- **Migrations são manuais neste projeto** (`docs/database/*.sql` aplicadas no SQL Editor). Toda story que cria migration precisa de AC explícito de aplicação em prod — foi exatamente esse buraco que armou a bomba do paywall.
- **Sem feature creep:** sem instrumento DISC próprio, sem estudo psicométrico, sem app de coaching. Foco: preencheu → recebeu → entendeu → agiu.

---

## Métricas de sucesso

**Confiabilidade (Sprint 0 — inegociável):**
- Taxa de PDIs gerados / diagnósticos submetidos: **100%** (hoje: ~0% em prod)
- Taxa de e-mails entregues com link do PDI: **> 98%**
- Tempo submissão → devolutiva disponível: **< 3 min** (p95)
- Falhas silenciosas: **zero** — toda falha gera alerta para `ADMIN_NOTIFICATION_EMAIL`
- Diagnósticos órfãos após backfill: **zero**

**Qualidade da devolutiva (Sprint 1):**
- % de PDIs gerados pela IA (não pelo fallback determinístico): **> 95%**
- Violações do guarda-corpo ético detectadas em teste de output: **zero**
- Nota da devolutiva (pesquisa de 1 clique no fim do PDI): **> 4,2 / 5**

**Negócio:**
- % de quem recebe PDI que clica no CTA de treinamento
- % de quem recebe PDI que responde ao follow-up (liga com o Epic SDR)

---

## Sprint roadmap

| Sprint | Tema | Duração | Valor entregue |
|---|---|---|---|
| **S0** | 🔴 **Destravar a devolutiva** | 2 dias | O PDI passa a ser gerado, gravado e entregue. Backfill dos órfãos. Alerta em toda falha. Paywall desarmado. **Bloqueia todo o resto.** |
| **S1** | DISC com olhar técnico + 360 | 1,5 sem | Persona de psicólogo organizacional com guarda-corpos éticos, cruzamento autoavaliação × avaliação executiva, mapa DISC → 8 módulos Lidera → ferramentas |
| **S2** | Cultura organizacional | 1 sem | Manifesto de cultura da Lidera (público) + devolutiva de cultura para o cliente sobre `/pesquisa/cultura` |

**Total: ~3 semanas.** Mas o S0 entrega valor em 2 dias, e é o que o Claudemir está esperando.

---

## Sequenciamento e dependências

```
S0 (destrava)  ──────►  S1 (DISC/360)  ──────►  S2b (cultura cliente)
     │                                              ▲
     │                                              │
     └──► S2a (manifesto Lidera — independente) ────┘
```

O manifesto de cultura (S2a) não depende de código e pode correr em paralelo com o S0 — é a única coisa que pode andar enquanto o cano é desentupido.

---

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| `after()` do Next não sobrevive ao timeout da Vercel em PDIs longos (LLM até 30s) | Alto — volta o bug | Rota dedicada de geração + polling no cliente como plano B (ver PDI.0.1). `maxDuration = 60` obrigatório. |
| Migration 58 já rodou parcialmente em prod | Médio — paywall trava | Verificar `information_schema` antes de qualquer coisa; flag desligada primeiro, migration depois |
| PDI gerado pela IA violar guarda-corpo ético (rotular pessoa) | **Crítico — risco jurídico e de marca** | Teste automatizado de output contra lista de termos proibidos, rodando em CI. Falha = build vermelho. |
| Custo de LLM escalar com volume | Baixo por ora | NVIDIA NIM é barato; monitorar. Fallback determinístico continua existindo como rede de segurança. |
| Dois motores de PDI divergirem mais | Médio — dívida técnica | Documentado como PDI.2.4. Não resolver agora, mas não piorar. |

---

## O que este epic NÃO faz

- Não constrói instrumento DISC próprio nem faz validação psicométrica.
- Não unifica os dois motores de PDI (fica como dívida explícita).
- Não reativa a monetização do PDI — isso volta com dados, depois do S1.
- Não gera PDF de verdade (hoje é `window.print()`). Se o PDF virar requisito comercial, é story separada — **e o paywall atual promete "PDF completo" que não existe**, o que reforça a decisão de desligá-lo.
