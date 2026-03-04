# Lidera Treinamentos - Arquitetura Tecnica Brownfield v2

## 1. Direcao Arquitetural
A plataforma sera evoluida como **monolito modular com fronteiras claras de dominio**, priorizando entrega continua sem reescrita total.

Objetivos tecnicos:
- suportar operacao hibrida (digital + presencial),
- manter performance para experiencia de stream,
- garantir isolamento B2B por tenant,
- reduzir risco operacional em checkout e matricula.

## 2. Stack Base (Mantida e Expandida)

### 2.1 Frontend
- Next.js App Router (SSR + Server Actions)
- TypeScript
- Tailwind CSS + componentes acessiveis existentes

### 2.2 Backend / BFF
- Next.js Route Handlers + Server Actions para dominio de negocio
- Supabase Auth para identidade e sessao
- Webhooks Stripe para conciliacao financeira

### 2.3 Dados
- PostgreSQL (Supabase)
- RLS para isolamento de dados corporativos
- Storage para midias e materiais

### 2.4 Pagamentos
- Stripe para checkout de curso, assinatura, evento e pacotes
- Idempotencia de eventos de pagamento

### 2.5 Streaming
- Player HTML5 atual (evolucao para HLS quando necessario)
- CDN para thumbnails e assets
- Modelo de "rails" no frontend para descoberta rapida

## 3. Modulos de Dominio

1. `catalog-domain`
- programas, trilhas, modulos e aulas
- descoberta por tema, nivel e formato

2. `commerce-domain`
- produtos, pedidos, assinaturas, cupons
- fluxo unico de autorizacao e concessao de acesso

3. `learning-domain`
- matriculas, progresso, certificados, gamificacao
- continuar assistindo

4. `events-domain`
- imersoes, lotes, ingressos, check-in, material pos-evento

5. `b2b-domain`
- empresas, usuarios corporativos, leads, propostas, contratos

6. `ops-domain`
- auditoria, notificacoes, conciliacao, suporte

## 4. Modelo de Seguranca

### 4.1 RBAC
- `admin`
- `instructor`
- `student`
- `company_admin`
- `company_manager`

### 4.2 RLS (Obrigatorio)
- leitura e escrita restritas por `tenant_id` no contexto corporativo
- trilhas B2C publicas apenas quando `is_published = true`

### 4.3 Controles Criticos
- idempotencia em webhooks de pagamento
- trilha de auditoria para matricula, cancelamento, estorno e check-in

## 5. Performance e Escala
- consultas com indices por `created_at`, `tenant_id`, `user_id`, `program_id`
- paginação por cursor nas listagens grandes
- cache de vitrine publica (TTL curto)
- carregamento incremental nos rails de streaming

## 6. Observabilidade
- logs de dominio por modulo
- metricas minimas: taxa de conversao, erro de pagamento, tempo medio de carregamento, taxa de conclusao
- alertas para falha de webhook e queda de ingestao de progresso

## 7. Entregas Tecnicas por Fase

### Fase 1
- consolidar `catalog-domain` + `commerce-domain` + `learning-domain` basico

### Fase 2
- ativar `events-domain` e comunidade

### Fase 3
- fortalecer `b2b-domain` com analytics de RH e app mobile
