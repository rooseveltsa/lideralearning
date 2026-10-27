# Avaliação da experiência de treinamentos Lidera

Data: 26/10/2026. Escopo implementado: área do aluno, biblioteca e sala de aula.

## Diagnóstico

A aplicação tem uma base funcional de LMS em Next.js 16/React 19, com matrículas,
conteúdo em módulos, progresso de aulas e emissão de certificados. Também contém
site comercial, diagnósticos, eventos, CRM e administração. Esses domínios exigem
fluxos próprios; o aluno precisa chegar rapidamente ao conteúdo contratado.

Os problemas encontrados na inspeção do código foram:

1. A navegação lateral era escondida no celular sem um menu equivalente.
2. O item `/dashboard` usava correspondência por prefixo e permanecia ativo em
   todas as páginas internas, junto com o item correto.
3. A biblioteca não oferecia busca, filtros nem paginação.
4. A página inicial usava frases como “dinâmica de stream” e métricas de XP
   calculadas localmente, diferentes da gamificação persistida.
5. O layout claro do dashboard coexistia com uma sala de aula em texto branco.
   A identidade também variava entre azul, amarelo, índigo e laranja.
6. O vídeo e sua lista de aulas estavam dentro de uma coluna que ainda dividia
   espaço com um segundo painel. O player perdia largura útil.
7. Falhas na consulta de progresso eram convertidas em listas vazias, confundindo
   indisponibilidade do serviço com ausência de treinamentos.
8. O botão de conclusão não liberava seu estado de envio se a chamada lançasse erro.
9. O layout raiz desabilitava o zoom do usuário.

## Referência de produto

A engenharia reversa foi feita dos padrões públicos de experiência, sem acesso
à conta de aluno, ao código interno ou à infraestrutura da Hotmart.

- [Área de membros Hotmart](https://hotmart.com/pt-br/area-de-membros):
  cursos, organização do conteúdo, personalização e experiência de aprendizagem.
- [Trilhas de conhecimento](https://suportehotmart.zendesk.com/hc/pt-br/articles/17310210527757-Como-criar-Trilhas-de-Conhecimento-na-%C3%81rea-de-Membros):
  organização temática e percursos estruturados.

A adaptação para a Lidera prioriza: entrar → localizar treinamento → abrir aula →
registrar conclusão → retomar conteúdo → acessar certificado. A identidade e as
regras de avaliação inicial existentes foram preservadas.

## Implementação entregue

- Navegação consistente com Início, Meus treinamentos e Certificados; conta e
  gestão separadas; menu expansível no celular com saída da conta.
- Início orientado ao treinamento pendente mais recentemente acessado, com dados
  reais de aulas; remoção do cálculo paralelo de XP dessa página.
- Busca tolerante a acentos, filtros de situação, ordenação por acesso/nome e
  paginação de apresentação de 12 itens na biblioteca.
- Cartões distinguem começar, continuar, revisar e conteúdo ainda em preparação.
- Índice do curso e sala de aula com módulos recolhíveis, situação textual das
  aulas e identificação da aula atual; player com uma única lista lateral.
- Página agregadora de certificados, com acesso à emissão existente por curso.
- Erros com tentativa de recarga, carregamento acessível, orientação para conta
  sem matrícula e busca sem resultados.
- Tokens de interface, foco visível, controles principais com 44px e zoom permitido.
- Guia em `/style-guide/treinamentos` com exemplos explicitamente identificados,
  sem dados de alunos; marcado para não indexação.

## Validação e limites

- TypeScript e ESLint dos arquivos de interface alterados: aprovados.
- Testes automatizados: 7 casos de situação, busca, filtros e ordenação aprovados.
  Execução: `npm run test:learning` (Node 22.18+ ou 24).
- Build de produção: aprovado. Há avisos existentes sobre a convenção middleware,
  raiz de workspace e consultas ao Supabase durante geração de outras páginas.
- Prévia local: resposta HTTP 200 e geração pelo Next.js confirmadas.
- A política da ferramenta bloqueou acesso do navegador ao host local. Portanto,
  inspeção visual e interações de navegador não foram verificadas.
- Não houve sessão autenticada de aluno para validar reprodução, persistência de
  conclusão e emissão real de certificado. Essa validação permanece pendente.
- A paginação limita os cartões renderizados; a consulta ainda carrega o resumo
  das matrículas. Volumes grandes pedem paginação no servidor.

## Próximas prioridades

1. Validar com uma conta de aluno os fluxos de avaliação inicial, vídeos,
   conclusão/desmarcação e certificado em desktop e celular.
2. Revisar a autorização das ações de progresso e emissão junto às políticas RLS.
   A emissão tem dois caminhos atuais, que devem compartilhar as mesmas regras
   de matrícula ativa e conclusão por IDs de aulas válidas.
3. Unificar o restante das telas de conta, avaliação e certificado individual
   com os tokens da área de treinamentos.
4. Revisar a gestão de conteúdo com quem publica treinamentos: rascunho,
   publicação, materiais e liberação de módulos.
5. Planejar retomada por posição do vídeo, anotações sincronizadas e avaliações
   pedagógicas por módulo, conforme a demanda real dos alunos.

## Revisão da home e do diagnóstico

A home passou a usar fundos sólidos claros, hierarquia editorial, ações diretas e
identidade Lidera. Foram removidos efeitos de fundo, animações de apresentação,
marcas de exemplo, avaliações, números e depoimentos sem comprovação identificada.
O conteúdo agora apresenta formatos, etapas e contato com o responsável.

A janela de escolha do diagnóstico era renderizada dentro de componentes que
aplicam transformações, alterando o contexto de posicionamento de elementos
fixos. Foi substituída por Radix Dialog com Portal no body, controle de foco,
fechamento por Escape, altura limitada e rolagem interna. A correção vale para
todos os botões que usam DiagnosticoCTA, inclusive em outras páginas.

Validação: build, TypeScript e lint aprovados. Três testes em DOM simulado
confirmam o Portal fora do ancestral transformado, os destinos dos formulários,
o fechamento/restauração de foco e a reabertura. Executar com
`npm run test:diagnostico`. A inspeção visual continua indisponível porque a
ferramenta de navegador bloqueou o host.
