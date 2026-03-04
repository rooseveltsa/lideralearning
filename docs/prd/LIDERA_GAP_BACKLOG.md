# Lidera Treinamentos - Gap Analysis e Backlog Priorizado (Brownfield)

## 1. Contexto da Analise
Objetivo: avaliar o estado atual do projeto e converter a visao da plataforma hibrida (digital + presencial + B2B) em backlog executavel.

Data da leitura tecnica: 04/03/2026.

## 2. Diagnostico do Estado Atual

### 2.1 Modulos ja existentes
| Modulo | Estado | Evidencia tecnica |
|---|---|---|
| Vitrine institucional | Implementado | `src/app/page.tsx`, `src/app/cursos/page.tsx`, `src/app/empresas/page.tsx`, `src/app/contato/page.tsx` |
| Autenticacao e perfil | Implementado | `src/app/auth/*`, `src/app/dashboard/perfil/*`, `src/app/dashboard/actions.ts` |
| LMS base (curso/modulo/aula/progresso) | Implementado | `src/lib/actions/lms.ts`, `src/app/dashboard/cursos/*` |
| Admin de cursos | Implementado (basico) | `src/app/admin/cursos/*`, `src/app/admin/actions.ts` |
| Checkout curso avulso (Stripe) | Implementado (parcial) | `src/app/curso/[course_id]/actions.ts` |
| Webhook de liberacao de acesso | Implementado (duplicado) | `src/app/api/stripe/webhook/route.ts` e `src/app/api/webhooks/stripe/route.ts` |
| Autoavaliacao inicial | Implementado | `src/lib/actions/assessment.ts`, `src/app/dashboard/cursos/[course_id]/avaliacao-inicial/page.tsx` |

### 2.2 Modulos ausentes ou incompletos para a visao alvo
| Capacidade alvo | Gap atual |
|---|---|
| Assinatura estilo Academy (recorrencia) | Nao existe modelo de assinatura nem tela de gestao de plano |
| Eventos presenciais / ingressos / check-in | Nao existe dominio de eventos/tickets |
| Funil B2B interno | Captura atual vai para WhatsApp; nao persiste lead/proposta em banco |
| Ecommerce unificado (curso + evento + pacote hibrido) | Checkout atual e apenas curso avulso |
| Comunidade interna | Nao existe feed/forum |
| Analytics RH B2B | Nao existe painel por empresa/time |
| Certificado com validacao real | Pagina de validacao e placeholder por prefixo (`LIDERA-`) |
| Continuar assistindo estilo stream | Rails publicos existem, mas sem trilho personalizado por usuario |

## 3. Riscos Tecnicos Prioritarios (P0)
1. **Webhook duplicado de Stripe**: duas rotas com comportamento semelhante aumentam risco de manutencao e inconsistencias.
2. **Bypass de Stripe no server action**: fluxo de demo pode conceder matricula sem pagamento em ambiente mal configurado.
3. **Certificado sem rastreabilidade oficial**: validacao publica ainda nao consulta registro persistido.
4. **Funil B2B sem historico**: leads se perdem fora da plataforma (dependencia de WhatsApp).
5. **Baseline de qualidade**: lint do app ainda com erros em varios arquivos (`any`, links, entidades nao escapadas).

## 4. Backlog Priorizado

## 4.1 P0 - Fundacao Comercial e Operacional (obrigatorio)

### EPIC P0.1 - Consolidacao de Checkout e Pedidos
**Objetivo:** transformar compra avulsa atual em esteira robusta de pedido/pagamento/acesso.

Historias:
- Como aluno, quero concluir compra com rastreabilidade para receber acesso sem falha.
- Como operacao, quero auditar status do pedido e reconciliar pagamento.

Entregas:
- Criar tabelas `orders`, `order_items`, `payments`.
- Registrar pedido antes de abrir checkout Stripe.
- Unificar webhook em uma unica rota com idempotencia por `event.id`.
- Atualizar matricula com base no status de pagamento confirmado.

Criterios de aceite:
- Todo checkout gera `order` persistido antes do redirect ao Stripe.
- Evento repetido do webhook nao duplica matricula.
- Pagamento aprovado atualiza pedido para `paid` e libera acesso em ate 10s.

### EPIC P0.2 - Funil B2B interno (lead -> proposta)
**Objetivo:** tirar dependencia de WhatsApp como unica trilha de conversao.

Historias:
- Como RH, quero enviar demanda corporativa e receber protocolo.
- Como comercial, quero acompanhar etapa da oportunidade na plataforma.

Entregas:
- Criar tabelas `b2b_leads` e `proposals`.
- Trocar formulario de `LeadFormB2B` para submissao em banco.
- Criar pagina admin de pipeline B2B (novo, contato, proposta, fechado, perdido).
- Notificacao de novo lead para time interno (email/alerta).

Criterios de aceite:
- Todo lead submetido gera registro com status inicial.
- Time admin consegue mudar etapa e registrar observacao.
- Historico da oportunidade fica auditavel.

### EPIC P0.3 - Certificacao rastreavel
**Objetivo:** garantir autenticidade e verificacao real.

Historias:
- Como aluno, quero emitir certificado oficial com codigo unico.
- Como terceiro, quero validar autenticidade com dados reais.

Entregas:
- Criar tabela `certificates` com `verification_code`, `issued_at`, `pdf_url`.
- Emitir certificado somente com 100% de progresso.
- Alterar `/certificado/verificar/[id]` para consulta real no banco.

Criterios de aceite:
- Certificado so e emitido uma vez por matricula concluida.
- Verificacao publica mostra valido/invalido com base no banco.
- Codigo invalido retorna estado de erro claro.

### EPIC P0.4 - Hardening do baseline
**Objetivo:** reduzir risco de regressao e facilitar escala.

Entregas:
- Corrigir erros de lint do app (fora `aios-core`).
- Adicionar script `typecheck` no `package.json`.
- Remover logs sensiveis em middleware.
- Criar smoke tests dos fluxos: login, compra, acesso, progresso.

Criterios de aceite:
- `npm run lint` sem erros.
- `npm run typecheck` passando.
- Fluxos criticos validados em ambiente de homologacao.

## 4.2 P1 - Experiencia Hibrida e Retencao

### EPIC P1.1 - Lidera Academy (assinatura)
- Modelagem `subscriptions` + `subscription_items`.
- Plano mensal/anual com gestao de cancelamento e renovacao.
- Area "Meu Plano" no dashboard.

### EPIC P1.2 - Eventos presenciais e check-in
- Modelagem `events`, `event_batches`, `event_tickets`, `event_checkins`.
- Checkout de ingresso por lote.
- Check-in via painel admin e registro de presenca.

### EPIC P1.3 - Stream personalizado
- Rail "Continuar assistindo" por usuario.
- Rail "Recomendado para voce" com base em progresso e categoria.
- Filtros por nivel, tema e formato.

## 4.3 P2 - Escala B2B e Comunidade

### EPIC P2.1 - Analytics RH por empresa
- Tenant corporativo com visao por colaborador/time.
- Indicadores de progresso, conclusao e engajamento.
- Exportacao CSV/PDF.

### EPIC P2.2 - Comunidade interna
- Posts, comentarios, moderacao e sinalizacao.
- Comunidades por trilha/programa.

### EPIC P2.3 - Growth
- Afiliados e codigos de indicacao.
- Upsell automatizado digital -> presencial -> corporativo.

## 5. Ordem Recomendada de Execucao (6 sprints)
1. Sprint 1: EPIC P0.1 (pedido/webhook unico/idempotencia)
2. Sprint 2: EPIC P0.2 (lead/proposta B2B)
3. Sprint 3: EPIC P0.3 (certificados reais)
4. Sprint 4: EPIC P0.4 (lint/typecheck/smoke)
5. Sprint 5: EPIC P1.1 + inicio P1.3
6. Sprint 6: EPIC P1.2 + fechamento P1.3

## 6. Checklist de Validacao (UX/Performance)
1. **Confianca transacional:** pedido, pagamento e concessao de acesso sempre rastreaveis.
2. **Operacao comercial B2B:** lead nao se perde e possui etapa/owner/SLA.
3. **Qualidade percebida no stream:** loading, empty e error states consistentes nos rails e no dashboard.
