# Roteiro de testes — Claudemir

Site: https://lideralearning.vercel.app

Executar no computador e no celular. Separar uma conta de aluno com matrícula
ativa e um treinamento com vídeo e aulas cadastradas. Para conferir isolamento,
usar uma segunda conta própria de teste, sem acesso ao mesmo treinamento.
Usar um e-mail que você consiga consultar nos testes de diagnóstico.

Estes são testes manuais pendentes; os resultados ainda devem ser preenchidos.
Os testes automatizados e de permissões do banco já passaram.

## 1. Apresentação e navegação

- [ ] Abrir a home e conferir logo, textos, contraste e alinhamento. O novo fundo
  deve ser claro, sem grade ou efeitos flutuantes. Não deve haver texto cortado.
- [ ] No celular, abrir e fechar o menu. Acessar treinamentos, empresas, contato e
  área do aluno. Nenhum item deve ficar inacessível ou sobrepor o conteúdo.
- [ ] Usar zoom e girar o celular. Textos e botões devem continuar utilizáveis.

## 2. Janela do diagnóstico

- [ ] Clicar em “Fazer diagnóstico gratuito”. A janela deve ficar centralizada,
  legível e completamente acessível, inclusive em tela pequena.
- [ ] Conferir fechamento pelo X, por Escape no computador e pelo fundo externo.
  Reabrir a janela e confirmar que continua funcionando.
- [ ] Usar Tab no computador. O foco deve ficar dentro da janela enquanto aberta
  e retornar ao botão ao fechar.
- [ ] Abrir a opção individual e depois a opção empresa. Cada opção deve levar
  ao formulário correspondente, sem manter a janela sobre a nova página.

## 3. Diagnóstico individual

- [ ] Enviar sem preencher os campos obrigatórios e com e-mail inválido.
  O formulário deve indicar o que corrigir sem apagar as respostas já válidas.
- [ ] Preencher todas as etapas com dados próprios de teste e enviar uma vez.
  Conferir confirmação, resultado/PDI, nome correto e ausência de texto técnico,
  JSON, “undefined” ou mensagens de erro.
- [ ] Consultar a caixa de entrada e spam. Registrar se a mensagem chegou e se
  o link abre o diagnóstico correto. Não há prazo de entrega homologado.

## 4. Diagnóstico da empresa

- [ ] Preencher a avaliação de um supervisor de teste e enviar.
  Conferir empresa, supervisor e resultado. As respostas não podem se misturar
  com as do diagnóstico individual.

## 5. Conta do aluno

- [ ] Entrar com a conta de aluno. A tela deve mostrar os treinamentos da conta.
- [ ] Tentar entrar com senha errada. Deve aparecer uma mensagem compreensível.
- [ ] Sair e tentar abrir `/dashboard` e `/admin`. Deve solicitar login.

## 6. Biblioteca

- [ ] Abrir “Meus treinamentos” e conferir apenas os cursos da conta.
- [ ] Buscar pelo nome e por um nome inexistente. A busca sem resultado deve
  orientar o usuário e permitir limpar os filtros.
- [ ] Conferir os filtros Todos, Em andamento, Não iniciados e Concluídos.
  Testar ordenação por nome e acesso recente. Com mais de 12 treinamentos,
  conferir também a troca de página.

## 7. Avaliação inicial

- [ ] Abrir um curso pela primeira vez, responder a avaliação inicial e salvar.
  Deve liberar o conteúdo do curso.
- [ ] Sair do curso e voltar. A avaliação salva não deve ser exigida novamente.

## 8. Sala de aula

- [ ] Abrir e recolher os módulos. Conferir a indicação da aula atual.
- [ ] Reproduzir e pausar o vídeo; testar áudio e tela cheia no computador e celular.
- [ ] Abrir aulas anterior e próxima. Título, vídeo e materiais devem corresponder
  à aula escolhida. Conferir também aulas somente em texto, se houver.

## 9. Progresso

- [ ] Marcar uma aula como concluída, atualizar a página e entrar novamente.
  A conclusão deve permanecer salva e atualizar o progresso do curso.
- [ ] Desmarcar a conclusão e conferir o recálculo.
- [ ] Voltar ao início e clicar em continuar. Deve abrir uma aula pendente do
  treinamento, mantendo o progresso já registrado.

## 10. Certificados

- [ ] Com aulas pendentes, o certificado não deve ser liberado.
- [ ] Concluir todas as aulas de um curso de teste e abrir “Certificados”.
  Conferir nome do aluno, treinamento, código e data.
- [ ] Abrir a página de verificação e conferir o código. Testar impressão ou
  download usando as opções disponíveis na tela.

## 11. Separação entre contas

- [ ] Em janela anônima, entrar na segunda conta de teste. Ela não deve mostrar
  os cursos, progresso ou certificados exclusivos da primeira conta.
- [ ] Abrir nessa segunda conta um link de aula/certificado da primeira.
  O conteúdo restrito não deve ser liberado. A validação pública de certificado,
  por ser intencionalmente pública, deve ser verificada separadamente.

## 12. Administração — se tiver acesso

- [ ] Entrar como administrador e conferir os diagnósticos enviados nos testes.
- [ ] Conferir cadastro de cursos, módulos, aulas e matrícula do aluno de teste.
  Se publicar um curso, confirmar sua disponibilidade na conta matriculada.

## Como relatar cada resultado

Teste nº:
Resultado: OK / Falhou / Não consegui testar
Celular ou computador:
Navegador:
Link da página:
O que fiz:
O que aconteceu:
O que eu esperava:
Print ou vídeo, se possível:

Não incluir senhas ou chaves de acesso no relato.
