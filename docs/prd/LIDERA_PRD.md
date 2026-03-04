# Lidera Treinamentos - PRD Brownfield v2

## 1. Contexto do Produto
A **Lidera Treinamentos** sera posicionada como uma EdTech hibrida (digital + presencial) focada em desenvolvimento humano e corporativo.
O produto deixa de ser apenas um LMS de cursos isolados e passa a operar como **ecossistema de experiencias de aprendizado**:

- **Digital (escala):** assinatura tipo streaming, trilhas certificadas e masterclasses ao vivo.
- **Presencial/Corporativo (alto impacto):** imersoes, palestras in-company e workshops sob medida.
- **Hub unico (orquestracao):** vitrine institucional, ecommerce unificado, area do aluno gamificada e funil B2B integrado.

Proposta central da marca:
**"Lidera Treinamentos eleva mentes e inspira resultados aplicaveis no trabalho real."**

## 2. Arquitetura e Dados (Mental Model)

### 2.1 Entidades Principais
| Entidade | Finalidade | Observacoes |
|---|---|---|
| `users` | Identidade unica de aluno, gestor e admin | Vinculo com auth |
| `companies` | Empresas clientes B2B | Base de contratos corporativos |
| `company_users` | Vinculo usuario x empresa x papel | RBAC por tenant |
| `programs` | Produto educacional (academy, trilha, imersao, workshop) | Entidade comercial unificada |
| `program_modules` | Organizacao pedagogica do programa | Ordem e dependencias |
| `program_lessons` | Conteudo consumivel (video, pdf, aula ao vivo) | Suporte a streaming |
| `enrollments` | Matricula do usuario no programa | B2C e B2B |
| `lesson_progress` | Progresso detalhado por aula | Continuar assistindo |
| `subscriptions` | Assinatura recorrente da Academy | Receita previsivel |
| `orders` | Checkout de cursos, eventos e pacotes hibridos | Ecommerce central |
| `events` | Imersoes e eventos presenciais | Turmas, local e capacidade |
| `event_tickets` | Ingressos por lote | Lote, status, check-in |
| `certificates` | Certificacao validavel | Verificacao publica |
| `community_posts` | Comunidade interna de alunos | Engajamento e networking |
| `b2b_leads` | Leads corporativos capturados no site | Funil comercial |
| `proposals` | Orcamentos de palestras/workshops | Esteira comercial B2B |

### 2.2 Hierarquia do Dominio
1. `programs` e a raiz de conteudo comercial.
2. Cada programa possui `program_modules` e `program_lessons`.
3. `orders` podem gerar `enrollments`, `subscriptions` ou `event_tickets`.
4. `companies` contratam pacotes e distribuem acessos via `company_users`.
5. `lesson_progress` alimenta gamificacao, certificacao e analytics.

### 2.3 Acoes de Usuario por Frente
- **Aluno B2C:** explorar catalogo stream, comprar, assinar, consumir aulas, participar da comunidade, emitir certificado.
- **Gestor/RH B2B:** solicitar proposta, contratar pacote, distribuir licencas, acompanhar progresso por colaborador e area.
- **Operacao/Admin:** publicar programas, configurar lotes e check-in, gerir matriculas, aprovar/acompanhar leads B2B.

## 3. Design System Atomico (Base)

### 3.1 Grid
- Grid responsivo de 12 colunas (desktop), 8 (tablet), 4 (mobile).
- Gutter fixo de 24px desktop, 16px mobile.
- Containers principais: `max-w-[1280px]` para vitrine e `max-w-[1440px]` para experiencia stream.

### 3.2 Tipografia Funcional
- `H1`: 48-56px, alto contraste para secao hero.
- `H2`: 32-40px, secao de modulo.
- `H3`: 24-28px, titulos de cards/rails.
- `Body`: 16-18px, leitura de negocio.
- `Caption`: 12-14px, metadados e status.
- `Mono`: 12-14px para IDs, codigos e logs administrativos.

### 3.3 Tokens de Cor Semantica
- `Primary`: azul institucional Lidera (`#1565C0`).
- `Neutral`: escala de cinzas para estrutura e legibilidade.
- `Success`: confirmacoes (matricula, pagamento, check-in).
- `Warning`: lotes perto de encerramento, prazos.
- `Error`: falha de pagamento, permissao e rede.

### 3.4 Componentes Nucleares
- `Button` (primary/secondary/ghost/destructive).
- `Input` (texto, busca, mascara empresarial).
- `Card` (programa, evento, empresa).
- `Table` (analytics RH, alunos, vendas).
- `Modal` (confirmacoes de compra, acao critica).
- `Stepper` (checkout em etapas).
- `ProgressBar` (jornada do aluno).
- `Rail` horizontal (stream estilo Netflix).

## 4. Estrutura de Navegacao

### 4.1 Vitrine Publica (Topbar)
- Inicio
- Academy (stream de treinamentos)
- Trilhas Certificadas
- Imersoes Presenciais
- Para Empresas
- Sobre Aline Gabriela
- Contato

### 4.2 Area do Aluno (Sidebar)
- Dashboard
- Continuar Assistindo
- Minha Jornada (niveis e metas)
- Certificados
- Comunidade
- Agenda de Masterclasses
- Perfil e Configuracoes

### 4.3 Area Corporativa (Sidebar)
- Visao Geral RH
- Times e Colaboradores
- Progresso por Trilha
- Eventos In-Company
- Relatorios Exportaveis
- Financeiro/Contrato

### 4.4 Admin Operacional (Sidebar)
- Catalogo e Conteudo
- Turmas e Eventos
- Pedidos e Assinaturas
- Leads B2B e Propostas
- Suporte e Auditoria

### 4.5 Breadcrumbs
- Publico: `Inicio > Academy > Nome do Programa`
- Aluno: `Dashboard > Minha Jornada > Trilha X > Aula Y`
- B2B: `Corporativo > Empresa X > Time Y > Progresso`

## 5. Layout da Interface (UI)

### 5.1 Home Institucional
- Hero com proposta de valor e autoridade da marca.
- Blocos de conversao separados para B2C e B2B.
- Destaques de programas, imersoes e provas sociais.
- CTA principal para assinatura Academy e CTA secundario para proposta corporativa.

### 5.2 Academy Stream (Inspiracao Netflix)
- Hero destaque com programa principal da semana.
- Barras horizontais (`rails`) por contexto:
  - Lancamentos
  - Continuar assistindo
  - Mais vistos por lideres
  - Trilhas certificadas
  - Masterclasses ao vivo
- Card denso com thumbnail 16:9, progresso, nivel, duracao e CTA rapido.
- Busca com filtros por tema, formato e nivel.

### 5.3 Checkout de Experiencias
- Checkout unificado para curso, assinatura, ingresso e pacote hibrido.
- Passos claros: dados > pagamento > confirmacao.
- Tratamento de cupom, nota fiscal, politica de cancelamento e retry de pagamento.

### 5.4 Area do Aluno Premium
- Dashboard com progresso total e proximas acoes.
- Gamificacao por niveis (nao apenas "aula concluida").
- Visualizacao de metas semanais e conquistas.
- Acesso rapido a certificados e agenda ao vivo.

### 5.5 Funil B2B Integrado
- Landing corporativa com catalogo de palestras/workshops.
- Formulario rico com contexto da empresa e urgencia.
- Pipeline interno com SLA, etapa da proposta e historico.

### 5.6 Operacao de Imersoes Presenciais
- Gestao de lotes, capacidade, lista de espera e check-in.
- Entrega de materiais e conteudo pos-evento pela mesma plataforma.

## 6. Engenharia de Estados (QA First)

### 6.1 Academy Stream (rails)
1. **Ideal:** rails preenchidos, progresso correto, CTA de continuar.
2. **Loading:** skeleton de hero + cards por rail.
3. **Empty:** sem programas publicados, CTA "ver agenda de eventos".
4. **Error:** falha de consulta com retry e fallback para contato.
5. **Partial/Max:**
   - 1 item: rail centralizado sem scroll.
   - 10.000 itens: paginacao por cursor e carregamento incremental.

### 6.2 Checkout
1. **Ideal:** pagamento autorizado e acesso liberado em segundos.
2. **Loading:** spinner contextual por etapa (nao bloqueio global cego).
3. **Empty:** carrinho vazio com recomendacoes reais do catalogo.
4. **Error:** recusa, timeout, antifraude; mensagens acionaveis.
5. **Partial/Max:**
   - 1 item: checkout simplificado.
   - muitos itens: resumo agrupado por tipo de produto.

### 6.3 Area do Aluno
1. **Ideal:** progresso, certificados e agenda atualizados.
2. **Loading:** placeholders por widget.
3. **Empty:** novo aluno sem historico com onboarding orientado.
4. **Error:** falha por permissao/matricula, com trilha de suporte.
5. **Partial/Max:**
   - 1 programa: foco em proxima aula.
   - 10.000 registros: tabelas com virtual scroll e filtros server-side.

### 6.4 Funil B2B
1. **Ideal:** lead criado, roteado e com SLA iniciado.
2. **Loading:** envio assincrono com feedback imediato.
3. **Empty:** sem leads no periodo, destaque para campanhas.
4. **Error:** validacao de campos e falha de integracao CRM.
5. **Partial/Max:**
   - poucos leads: visao em kanban.
   - muitos leads: busca, segmentacao e exportacao.

## 7. Estrategia de Monetizacao
- **High Ticket:** imersoes e contratos corporativos.
- **Recorrencia:** assinatura Academy mensal/anual.
- **Cross-sell:** assinatura + ingresso presencial.
- **Upsell B2B2C:** palestra in-company + acesso Academy para colaboradores.

## 8. Roadmap de Produto

### Fase 1 - Fundacao e Autoridade
- Landing institucional robusta.
- Catalogo B2C inicial com checkout integrado.
- Captura B2B com pipeline basico.
- Area do aluno para consumo de conteudo digital.

### Fase 2 - Expansao e Comunidade
- Assinatura `Lidera Academy`.
- Venda de ingressos presenciais + check-in.
- Comunidade interna + gamificacao de jornada.

### Fase 3 - Escala e Dados
- Dashboard corporativo para RH.
- Aplicativo mobile com consumo offline.
- Programa de afiliados e crescimento de aquisicao.

## 9. Checklist de Validacao (UX/Performance)
1. **Percepcao de velocidade resolvida:** skeletons e feedback imediato em stream, dashboard e checkout.
2. **Escalabilidade de dados resolvida:** paginação por cursor, filtros server-side e virtualizacao para volumes altos.
3. **Confianca operacional resolvida:** estados de erro acionaveis, trilhas de suporte e auditoria de eventos criticos.
