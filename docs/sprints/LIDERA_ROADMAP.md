# Lidera Treinamentos - Roadmap de Execucao v2

## 1. Principios de Execucao
- Sprints de 2 semanas
- Entrega incremental sempre deployavel
- Prioridade por impacto em receita + risco tecnico
- QA por estados (ideal/loading/empty/error/partial-max)

## 2. Fase 1 - Fundacao e Autoridade (Sprints 1-4)
Objetivo: validar aquisicao, conversao e consumo digital inicial.

### Sprint 1 - Reposicionamento e Base de Produto
- Atualizar narrativa da marca para ecossistema hibrido
- Estruturar IA de navegacao publica (Academy, Imersoes, B2B)
- Definir contratos de dados para programas e trilhas
- Revisar copy e CTAs B2C/B2B

### Sprint 2 - Academy Stream (MVP)
- Experiencia de catalogo em rails horizontais (estilo streaming)
- Hero de destaque e busca por programas
- Inicio de tracking de "continuar assistindo"
- Empty/loading/error estados dedicados

### Sprint 3 - Ecommerce Unificado
- Checkout para curso avulso e assinatura
- Webhook resiliente para liberacao de acesso
- Tratamento de recusa e retry de pagamento
- Confirmacao de compra e onboarding de aluno

### Sprint 4 - Area do Aluno Basica
- Dashboard com progresso e proximas aulas
- Emissao/validacao de certificados
- Configuracoes de perfil e seguranca
- Endurecimento de permissao e auditoria

Marco Fase 1:
- receita digital ativa,
- onboarding funcional,
- experiencia de consumo estavel.

## 3. Fase 2 - Expansao e Comunidade (Sprints 5-8)
Objetivo: ampliar ticket medio e retencao com presencial + comunidade.

### Sprint 5 - Imersoes e Eventos
- Cadastro de eventos presenciais
- Lotes de ingressos e controle de capacidade
- Jornada de check-in operacional
- Entrega de material pos-evento

### Sprint 6 - Funil B2B Integrado
- Landing corporativa com formulario rico
- Pipeline de leads e propostas
- SLA comercial e historico de contatos
- Exportacao para CRM externo (quando habilitado)

### Sprint 7 - Comunidade e Engajamento
- Feed/fórum por tema e programa
- Regras de moderacao
- Metricas de participacao

### Sprint 8 - Gamificacao da Jornada
- Niveis, metas semanais e conquistas
- Widgets de progresso para retorno recorrente
- Cross-sell contextual (digital -> presencial)

Marco Fase 2:
- operacao hibrida em producao,
- aumento de retencao,
- tracao B2B inicial.

## 4. Fase 3 - Escala e Dados (Sprints 9-12)
Objetivo: escalar B2B e eficiencia operacional.

### Sprint 9 - Analytics RH (B2B)
- Dashboard por empresa, time e colaborador
- Indicadores de adocao e conclusao
- Relatorios exportaveis

### Sprint 10 - App Mobile
- Consumo de conteudo e progresso no mobile
- Sincronizacao de retomada entre dispositivos
- Base para modo offline

### Sprint 11 - Programa de Afiliados
- Link de indicacao e comissionamento
- Regras antifraude e conciliacao

### Sprint 12 - Hardening de Escala
- Otimizacao de consultas de alto volume
- Testes de carga e plano de contingencia
- Revisao de custos de infra e margem por produto

Marco Fase 3:
- maturidade operacional,
- previsibilidade de receita,
- base pronta para expansao regional.

## 5. Criterios de Pronto por Sprint
- funcionalidades com telemetria minima
- cobertura de estados principais e de falha
- validacao de acessibilidade (teclado, contraste, labels)
- sem regressao em login, compra e consumo de aula
