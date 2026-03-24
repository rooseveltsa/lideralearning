# IDENTIDADE VISUAL — Lidera Treinamentos (Identidade Decifre)

## Stack Técnica
- Tailwind CSS para toda estilização (sem arquivos .css separados)
- shadcn/ui como base de componentes, customizados via className
- Todos os valores visuais definidos como TOKENS SEMÂNTICOS no tailwind.config
- Nunca usar valores hardcoded no código — sempre tokens semânticos
- Nunca usar cores/radius/sombras padrão do Tailwind — apenas tokens deste documento
- A paleta usa UMA cor accent forte (Ouro/Mostarda) + neutros. Não criar arco-íris de categorias.
- A IA que implementa é responsável por criar SVGs originais e composições visuais únicas baseadas nas descrições abaixo — sem decoração genérica como substituto de conceito.

## Setup Necessário (instalar antes de buildar)

### Libs adicionais
- `next/font/google` para importação nativa de fontes otimizadas.
- `lucide-react` para iconografia geométrica unificada.

### Assets externos
- Fontes: **Playfair Display** (Headings serifados clássicos) e **Inter** (Textos limpos de interface).

***

## A Alma do App
O Lidera é um fólio confidencial de alta gerência, um clube restrito de conhecimento executivo. A plataforma não deve parecer uma ferramenta SaaS colorida e lúdica; ela deve evocar o magnetismo do conhecimento restrito, da elegância implacável e da clareza absoluta das decisões difíceis.

***

## Referências e Princípios
- **Decifre-se (Screenshot):** Preto abissal absoluto interagindo dramaticamente com um bloco de Ouro texturizado maciço. Tipografias serifadas luminosas saltam do breu como manchetes de um jornal premium antiquado e misterioso. O botão de ação mergulha levemente na mesma cor de destaque (mostarda escuro) criando hierarquia sem adicionar um milhão de cores.
  → Princípio: **O Contraste do Monólito.** Em 90% das vezes, a interface deve ser negra e invisível. O que brilha e se destaca (os 10% de ouro), o faz agressivamente.
  → Aplicação: O fundo não terá cards brancos arredondados convivendo com azuis de "login". Os destaques serão lingotes de ouro vibrantes. Tudo ao redor some na escuridão.

***

## Decisões de Identidade

### ESTRUTURA
- Nenhuma sidebar genérica cinza. Menus de topo ocultos ou extremamente fluidos (vidro fumê/backdrop minimalista).
- Layout focado em grandes respiros (whitespace) pretos e tipografia monumental (H1 e H2 muito maiores e mais contrastantes que o resto).
- Quando há quadros ou "cards", eles são virtualmente invisíveis (apenas um `#111111` muito discreto, quase imperceptível perante o fundo negro `#050505`).

### LINGUAGEM
- Tipografia Híbrida: `Playfair Display` (Serif, aristocrática) comandando títulos grandiosos. `Inter` (Sans, afiada) conduzindo o microscópico (tags, datas, botões pequenos).
- Cores: Preta e Ouro. Ponto. Todo o resto varia entre opacidades de branco (cinzas).
- Geometria: Botões não muito arredondados para não infantilizar (nada de pílulas perfeitas de radius infinito a não ser para selos decorativos de status). Cards com raios de `12px` (`rounded-xl` do Tailwind) a `16px`.
- Profundidade: Nenhum "border" ou "shadow" óbvio em cards comuns. No card principal, um Drop/Core glow colossal com as bordas apagadas exala autoridade do centro.
- Iconografia: Fina (Stroke 1.5).

### RIQUEZA VISUAL

#### Textura Ambiente
**O que:** Halo estelar/Teatral.  
**Temática:** Uma luz de projetor acendendo no escuro imenso.  
**Tratamento:** Gradiente radial roxo-púrpura abissal para o negro (exatamente atrás do texto "Escolha seu plano"). Uma fumaça escura levíssima no topo, sumindo em 10% do viewport, indicando materialidade digital sem tirar atenção da interface primária.

#### Conceitos Visuais por Componente

##### O Card Dourado de Checkout (Pricing Growth)
**Representa:** O cálice inquestionável do compromisso corporativo.  
**Metáfora visual:** Um bloco de ouro escavado.  
**Cena detalhada:** Fundo totalmente Amarelo/Mostarda escuro (`#DEAE34` base). Fundo interno liso e um botão que é apenas a mesma cor, multiplicada. O texto e os ícones de check são pretos. O Badge "MAIS POPULAR" rompe o topo como se fosse esculpido. Ao fundo de tudo, um glow ouro expande as bordas (`shadow-[0_0_80px_currentColor]`).  
**Viabilidade:** CÓDIGO PURO.  

##### O Card Submisso (Pricing Starter/Enterprise)
**Representa:** A âncora para a decisão; a comparação.  
**Metáfora visual:** Um pedaço de obsidiana fosca que existe em função de ancorar o ouro.  
**Cena detalhada:** Cinza extremamente escuro (`#101010` a `#151515`), com textos esmaecidos. O botão principal desse card é igualmente opaco e recuado (`#18181A` ou similar). Nenhuma borda viva. Ele permite que o Dourado roube a cena por completo.  
**Viabilidade:** CÓDIGO PURO.

##### Painel "Lidera Academy" (Galeria)
**Representa:** A estante de arquivos da liderança de ponta.  
**Metáfora visual:** Silhuetas e feixes de luz cruzando telas cinematográficas no escuro.  
**Cena detalhada:** Sem descrições genéricas longas. Um H1 colossal em Playfair. Abaixo dele, apenas a thumb fotográfica enegrecida e o progresso dourado extremamente raso de quem está assistindo. Nenhum frame branco para cards de treinamento.  
**Viabilidade:** CÓDIGO PURO.

***

## Tokens de Design

### Cores — Fundos
- Fundo Imersivo (Base das páginas): `#030303` ou `#050505`. (Jamais `#ffffff` em lugar algum da raiz).
- Fundo Secundário (Backdrop para quadros): `#0F0F0F`.
- Fundo de Relevo (Hover): `#1A1A1A`.

### Cores — Texto
- Tipografia de Contraste Max: `#FAFAFA` e `#FFFFFF` em títulos.
- Silêncio Operacional (Subtextos/Tags): `#A1A1A1` e `#71717A`.
- Sobre o Ouro (Contraste inverso absoluto): `#000000` nativo; no máximo um `#1C1917` para botões do card Ouro.

### Cores — Accent (uma cor apenas)
- Ouro "Decifre" Destaque/Radiante: `#EAB308` e suas variações.
  - Para o Card Cheio: `#D2970E` ou similar à referência visual, um amarelo-mostarda rico (não limão).

### Bordas
- Fronteira invisível: `rgba(255,255,255,0.03)`
- Não há borders evidentes em momento algum; preferência por contrastes de bg-color subtis.

### Geometria
- `rounded-2xl` para blocos grandes de conteúdo primário para tirar a aspereza analítica.
- Nenhuma curva excessiva no card "Growth" principal, um raio coeso (`1rem` / 16px).

### Sombras
- O resplendor do Rei: `0px 10px 80px -15px rgba(226, 172, 45, 0.4)` (Somente para o Destaque Gold)
- A imersão das Sombras (Soft drop): `0px 40px 60px -20px black`

***

## Componentes Shadcn — Overrides

Nenhuma cor branda de "primary/secondary" default é permitida.
Reescrever o Variant Primary do Button para abraçar o Mostarda/Preto.
Reescrever o Card para adotar as fronteiras invisíveis e matar a sombra `#e2e8f0` ou congênere típica do light-theme do Shadcn.

***

## Regra de Ouro
1. **Derrubem as caixas com contorno azul** A web IA padrão ama botar "uma linha de borda sutil com bg-surface". Nós trabalhamos em contrastes maciços (Preto absoluto para espaço negativo + Caixas de Ouro para urgência tática).
2. **Tipografia substitui decoração:** Em caso de dúvida, adicione espaço vazio (`margin/padding`) absurdo e defina a fonte Serifa grande. Ponto. A interface estará chique e não-sobrecarregada.
3. Não insira ilustrações cartunescas "startupeiras". Somos uma plataforma aristocrática, pragmática, resolutiva e altamente sênior.
4. Cards e Modais neutros nunca brilham, apenas o Ouro brilha.

## Teste Final
Analise os pricing plans pós-design: O plano destacado salta à sua cara, exigindo que você clique, com seu amarelo denso e glow luxuoso? Sim. Os outros planos ao lado fogem paras as sombras e parecem escolhas "mornas", ancorando e servindo escada para a venda vital? Sim. E acima de tudo, nada lembra o Tailwind das massas, nem azul com raio mole? Se todas as respostas forem confirmadas, a interface foi decifrada.
