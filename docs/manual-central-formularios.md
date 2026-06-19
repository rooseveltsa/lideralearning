# Manual da Central de Formulários
### Lidera Treinamentos — Avaliações de Liderança, Clima e Saúde Organizacional

> Guia completo para o gestor/RH operar a central de formulários: o que cada
> instrumento mede, para quem enviar, como acompanhar e como agir sobre os
> resultados. Versão 1.0.

---

## 1. Visão geral

A Central de Formulários reúne, em um só lugar, os instrumentos de avaliação da
Lidera. Cada formulário é um **link** que o gestor envia para as pessoas
responderem pelo celular ou computador — sem instalar nada. As respostas chegam
prontas em **telas de análise** no painel administrativo, com notas, faixas de
interpretação e alertas.

Há dois tipos de instrumento:

- **Anônimos** (Clima, Psicossociais, Cultura Preventiva): ninguém é
  identificado; o recorte é só por **setor**. Servem para medir o ambiente de
  trabalho em grupo.
- **Identificados** (Formação, Autoavaliação, Avaliação Executiva, PDI):
  vinculados à pessoa, para desenvolvimento individual.

Tudo é **multi-cliente**: a mesma plataforma atende várias empresas sem misturar
dados, usando um **código de empresa** no link.

---

## 2. Conceitos-chave

| Conceito | O que significa |
|---|---|
| **Empresa (org)** | Cada cliente/empresa tem um código (ex.: `acme`). Esse código vai no link (`?org=acme`) e separa os dados por empresa. |
| **Setor** | Recorte interno (Produção, Manutenção, Logística…). Nos formulários anônimos, a pessoa escolhe o setor — sem se identificar. |
| **Anônimo** | Não pede nome, crachá nem matrícula. Só o setor. |
| **Identificado** | Pede nome/e-mail. Usado para desenvolvimento individual (com consentimento LGPD). |
| **Regra dos 5** | Resultado por setor só aparece quando há **5 ou mais respostas** naquele setor. Abaixo disso, entra só no "Geral" — para ninguém ser identificado. |
| **Item crítico** | Pergunta que dispara **alerta** mesmo que a média esteja boa (ex.: assédio, EPI, segurança psicológica). |

---

## 3. Acesso e papéis

- **Gestor / Admin**: acessa o painel em `/admin`, cadastra empresas, envia links
  e lê os resultados. Exige login com perfil de administrador.
- **Respondente** (colaborador/supervisor): só recebe o link e responde. Não
  precisa de conta nos formulários anônimos.

---

## 4. Formulários disponíveis

| Formulário | Tipo | Para quem | Tempo | O que mede |
|---|---|---|---|---|
| **Pesquisa de Clima** | Anônimo + setor | Todos os colaboradores | ~10 min | Ambiente, liderança, reconhecimento, pertencimento (8 dimensões, 47 perguntas, eNPS) |
| **Indicadores Psicossociais** | Anônimo + setor/turno | Todos os colaboradores | ~12 min | Riscos psicossociais (NR-1 / ISO 45003): carga, apoio, assédio, saúde (13 blocos) |
| **Cultura Preventiva** | Anônimo + setor | Todos os colaboradores | ~7 min | Maturidade da cultura de prevenção e segurança psicológica (7 dimensões) |
| **Formação de Supervisores** | Identificado + LGPD | Supervisores/líderes | ~10 min | Necessidade de desenvolvimento nos 8 módulos LIDERA → alimenta o PDI |
| **Autoavaliação (1.4.1)** | Identificado | Líder/supervisor | ~5 min | Perfil de liderança (Reativo / Transição / Líder de Valor) |
| **Avaliação Executiva (1.3.1)** | Identificado | Gestor/RH sobre o líder | ~10 min | Visão da empresa sobre o líder (10 dimensões) |
| **PDI** | Auto-gerado | — | — | Plano de Desenvolvimento Individual (cruza autoavaliação × executiva) |

---

## 5. Passo a passo de uso (o ciclo completo)

### Passo 1 — Cadastrar a empresa
1. Acesse **`/admin/empresas`**.
2. Clique em **Nova empresa** e preencha:
   - **Código**: identificador curto na URL (ex.: `acme-industria`). Use letras
     minúsculas, números e hífen.
   - **Nome**: nome da empresa (ex.: ACME Indústria Ltda).
   - **Canais de encaminhamento** (opcional, mas recomendado): Ouvidoria, CIPA,
     SESMT e RH. Esses contatos aparecem para o colaborador nos Indicadores
     Psicossociais, em caso de assédio/risco.
3. Salve. A empresa aparece na lista com os **links prontos**.

### Passo 2 — Copiar os links
Na lista da empresa, cada formulário tem seu link já com o `?org=` da empresa e
um botão **Copiar**:
- Clima → `…/pesquisa/clima?org=acme-industria`
- Psicossociais → `…/pesquisa/psicossocial?org=acme-industria`
- Cultura Preventiva → `…/pesquisa/cultura?org=acme-industria`
- Formação → `…/formacao/diagnostico?org=acme-industria`

### Passo 3 — Enviar para o público certo
| Formulário | Enviar para | Canais sugeridos |
|---|---|---|
| Clima / Psicossociais / Cultura | **Todos** da empresa | Grupo de WhatsApp, QR code no mural, tablet/totem no setor |
| Formação | **Só supervisores/líderes** | Mensagem individual (é identificado) |

> **Importante:** dê tempo dentro do expediente para responder e **não cobre
> nominalmente** quem respondeu — isso preserva o anonimato e a sinceridade.

### Passo 4 — Acompanhar os resultados
Abra a análise de cada instrumento **filtrando pela empresa**:
- `/admin/clima?org=acme-industria`
- `/admin/psicossocial?org=acme-industria`
- `/admin/cultura?org=acme-industria`
- `/admin/formacao?org=acme-industria`

Sem o `?org=`, você vê **todas as empresas** somadas.

### Passo 5 — Agir e devolver
- Priorize as dimensões em **vermelho/amarelo** e os **itens críticos** em alerta.
- **Devolva o resultado ao time em até 30 dias** com 1–3 ações concretas. Pesquisa
  sem devolutiva vira descrédito.
- Riscos psicossociais altos → registrar no **PGR/GRO** com SESMT/CIPA.

---

## 6. Detalhe de cada instrumento

### 6.1 Pesquisa de Clima
- **Objetivo:** medir clima e engajamento — como o time vê o ambiente, a
  liderança imediata, o reconhecimento e o quanto se sente parte da empresa.
- **8 dimensões:** Liderança e gestão imediata · Comunicação · Reconhecimento e
  valorização · Relacionamento e trabalho em equipe · Desenvolvimento e carreira
  · Orgulho e pertencimento · Segurança psicológica · Remuneração e benefícios.
- **Escala:** concordância (Discordo totalmente → Concordo totalmente) e, em
  alguns itens, frequência (Nunca → Sempre), além de **Não sei / Não se aplica**.
- **Extras:** **eNPS** (recomendaria a empresa? 0–10) e 2 perguntas abertas.
- **Leitura:** nota 0–100 por dimensão → faixas Crítico / Atenção / Saudável /
  Excelente, com ação sugerida.

### 6.2 Indicadores Psicossociais (NR-1 / ISO 45003)
- **Objetivo:** mapear **riscos psicossociais** do trabalho para a gestão de
  risco exigida pela **NR-1** (PGR/GRO), alinhado à **ISO 45003**. **Não** é
  diagnóstico clínico nem avaliação individual.
- **Parte 1 — 12 fatores de risco:** carga e ritmo · controle e autonomia · apoio
  da chefia · apoio dos colegas · clareza de papel · respeito e convivência ·
  ambiente físico e segurança · mudanças no trabalho · segurança no emprego ·
  reconhecimento e recompensa · trabalho e vida pessoal · desgaste emocional.
- **Parte 2 — situações graves (janela de 12 meses):** assédio moral e sexual,
  violência, discriminação e sinais de adoecimento. Esses itens **disparam alerta
  imediato**, independentemente da média.
- **Escala:** frequência (Nunca → Sempre). Itens de risco e de proteção são
  tratados de forma que **nota alta = mais risco**.
- **Recorte:** setor **e turno** (com a regra dos 5 por célula).
- **LGPD:** respostas sobre saúde e assédio são dado sensível; tratadas de forma
  agregada, com acesso restrito (RH/SESMT). Os **canais de encaminhamento** da
  empresa aparecem para o respondente.
- **Leitura:** nível de risco (baixo / médio / alto) por fator + alertas da
  Parte 2.

### 6.3 Cultura Preventiva
- **Objetivo:** medir a **maturidade** da cultura de prevenção (segurança
  comportamental + segurança psicológica) — o quanto a prevenção é viva no dia a
  dia, não só no papel.
- **7 dimensões:** liderança que dá o exemplo · comunicação de riscos e
  quase-acidentes · voz e participação do time · aprender com o erro (cultura
  justa vs cultura de culpa) · segurança psicológica · proatividade vs reação ·
  discurso × prática.
- **Escala:** concordância (5 pontos) + Não sei. Alguns itens são reversos
  (medem o lado negativo) e são tratados automaticamente na pontuação.
- **Leitura:** estágios de maturidade — Reativo → Em desenvolvimento → Proativo
  → Cultura madura.

### 6.4 Formação de Supervisores
- **Objetivo:** diagnosticar a necessidade de desenvolvimento de cada supervisor
  e recomendar **quais módulos LIDERA priorizar**. É **identificado** e exige
  consentimento LGPD.
- **8 módulos LIDERA:** (1) Função Estratégica · (2) Inteligência Comportamental
  · (3) Ética e Responsabilidade · (4) Gestão Geracional · (5) Desenvolvimento e
  Sucessão · (6) Dados e IA · (7) Senso de Dono · (8) Estratégia de Carreira.
- **Como mede:** para cada módulo, **competência atual** × **prioridade de
  desenvolver**. O sistema calcula o gap ponderado e recomenda os **3 módulos
  prioritários**.
- **Integração:** os módulos recomendados **alimentam o motor de PDI**.

### 6.5 Instrumentos reaproveitados (já existentes)
- **Autoavaliação (1.4.1):** o líder se avalia → gera perfil (Reativo /
  Transição / Líder de Valor) e um PDI parcial.
- **Avaliação Executiva (1.3.1):** o gestor/RH avalia o líder em 10 dimensões.
- **PDI:** gerado automaticamente do cruzamento Autoavaliação × Executiva; mostra
  forças, gaps, pontos cegos, forças ocultas e plano de 90 dias.
- **Avaliação comportamental (DISC):** parte do diagnóstico pessoal.

---

## 7. Como ler os resultados

- **Nota por dimensão (0–100):** quanto maior, melhor (exceto nos Psicossociais,
  onde maior = mais risco — lá o vermelho é alerta).
- **Faixas/Cores:** cada instrumento traduz a nota em uma faixa com ação sugerida
  (ex.: Crítico → Atenção → Saudável → Excelente; ou níveis de risco; ou estágios
  de maturidade).
- **Itens críticos:** aparecem em destaque quando a média do item fica abaixo do
  limiar — não são diluídos pela média da dimensão.
- **eNPS (Clima):** de −100 a +100 (% de promotores − % de detratores).
- **Geral × por setor:** o "Geral" soma toda a empresa; por setor só aparece com
  5+ respostas.

---

## 8. Privacidade, anonimato e LGPD

- Formulários anônimos **não coletam** nome, crachá ou matrícula — apenas setor.
- **Regra dos 5:** resultados por setor (e por setor×turno no psicossocial) só
  são exibidos com 5+ respostas; abaixo disso, agregam-se no Geral.
- **Formação** é identificado e exige **consentimento LGPD** explícito.
- **Psicossociais:** dados de saúde/assédio são sensíveis (LGPD); uso restrito à
  gestão de risco (PGR/GRO), acesso limitado a RH/SESMT.
- A pesquisa **não substitui** denúncia individual: em casos graves, o
  respondente é orientado a procurar os **canais da empresa** (Ouvidoria, CIPA,
  SESMT, RH) cadastrados no `/admin/empresas`.

---

## 9. Boas práticas de aplicação

1. **Comunique antes:** explique por que a pesquisa existe, que é anônima e que
   vai gerar ações.
2. **Janela de 7 a 10 dias** para responder, com tempo liberado no expediente.
3. **Não pressione** respostas nominais — contamina o anonimato.
4. **Garanta volume:** incentive a participação para passar da regra dos 5 por
   setor.
5. **Devolva o resultado** ao time em até 30 dias com ações concretas.
6. **Repita** a cada 6–12 meses para comparar a evolução por setor.

---

## 10. Administração técnica (para o responsável pelo sistema)

- **Onde ficam os dados (Supabase):**
  - Clima → `climate_survey_responses`
  - Psicossociais → `psychosocial_survey_responses`
  - Cultura → `preventive_culture_responses`
  - Formação → `training_needs_assessments`
  - Empresas → `survey_orgs`
- **Migrations** (aplicadas no SQL Editor do Supabase): `53` clima · `54`
  psicossocial · `55` cultura · `56` formação · `57` empresas/`org_code`.
- **Acesso:** as tabelas têm RLS — só administradores leem; as respostas entram
  pela API com chave de serviço.
- **Conteúdo dos instrumentos:** `docs/formularios/instrumentos.md` (perguntas,
  escalas e pontuação de cada formulário).

---

## 11. Perguntas frequentes

**Posso usar o mesmo link para duas empresas?**
Não. Cada empresa tem seu código (`?org=`). Use o link da empresa certa, senão
os dados se misturam.

**Por que o resultado de um setor não aparece?**
Porque tem menos de 5 respostas. Espere acumular ou ele entra só no Geral.

**O colaborador precisa criar conta?**
Não, nos formulários anônimos. Só a Formação (e Autoavaliação) pedem
identificação.

**A pesquisa identifica quem respondeu coisas graves?**
Não. É anônima e agregada. Por isso ela orienta a procurar os canais da empresa
para tratar casos individuais.

**Posso editar as perguntas?**
O conteúdo está em `docs/formularios/instrumentos.md`; alterações são feitas no
sistema pela equipe técnica.

---

## 12. Glossário

- **eNPS** — Employee Net Promoter Score; lealdade do colaborador.
- **NR-1 / GRO / PGR** — norma e programas brasileiros de gerenciamento de riscos
  ocupacionais (inclui riscos psicossociais).
- **ISO 45003** — diretriz internacional de saúde e segurança psicológica no
  trabalho.
- **PDI** — Plano de Desenvolvimento Individual.
- **DISC** — modelo de perfil comportamental (Dominância, Influência,
  Estabilidade, Conformidade).
- **Segurança psicológica** — poder falar, errar e discordar sem medo de
  retaliação (conceito de Amy Edmondson).

---

*Lidera Treinamentos — Central de Formulários. Documento operacional; o conteúdo
detalhado de cada instrumento está em `docs/formularios/instrumentos.md`.*
