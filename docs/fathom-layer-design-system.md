# Fathom Layer — Design System (Quiet Luxury / Tech Premium)

Documento de handoff para implementação via Claude Code. Stack: Next.js 15 (App Router) + Tailwind CSS. Ler em conjunto com `fathom-layer-content-spec.md`.

## 0. Posicionamento: irmão de design da Infinity, com ambição própria

O Fathom Layer é o segundo produto do mesmo operador que já mantém a **Infinity Soluções** (agência premium, React + Tailwind + framer-motion, também dark-mode/"Quiet Luxury"). O Fathom Layer precisa ser reconhecível como parte da mesma família de padrão de qualidade — mesma disciplina, mesmo critério de "elite silenciosa" — **sem ser um clone visual**, e com teto de ambição mais alto: **nível Awwwards Site of the Day/Honorable Mention**, não apenas "SaaS premium" tipo Linear/Stripe. Esta seção substitui a diretriz anterior que limitava o projeto ao teto "SaaS premium" sem 3D — decisão explícita do usuário: o Fathom Layer precisa ser reconhecido pelo próprio design, não só pela utilidade.

- **O que herda da Infinity (não negociável):** dark mode como base, um único acento de cor saturado, tipografia como hierarquia (não decoração), hover com profundidade real (nunca só troca de cor), zero fricção.
- **O que é próprio do Fathom Layer:** identidade visual distinta o suficiente para não confundir os dois produtos — acento de cor próprio (azul elétrico `#0052FF`, ver seção 2) — e agora também um nível de execução técnica/visual acima do que a Infinity precisa, com peça 3D central autoral (seção 5.1) e coreografia de movimento real (seção 5.2), não decoração.
- **Stack diferente:** Infinity usa React + react-router-dom; Fathom Layer usa Next.js 15 App Router. Componentes não são portáveis 1:1 — o *vocabulário* de design (bento grid, dark mode 2.0, tipografia cinética) é o que se compartilha, não o código.

## 0.1 Como o Awwwards realmente pontua — isso guia toda decisão abaixo

18+ jurados avaliam cada site em 4 critérios, com peso: **Design 40%, Usabilidade 30%, Criatividade 20%, Conteúdo 10%** (as 3 notas mais distantes da média são descartadas). Honorable Mention = nota ≥ 6.5.

**Implicação direta:** Usabilidade pesa mais que Criatividade. A maioria dos sites que falha em ganhar prêmio falha por usabilidade fraca, não por falta de efeito. Antes de qualquer 3D/WebGL, a base (hierarquia tipográfica, legibilidade, navegação, performance real em mobile) precisa estar impecável — são 30 pontos garantidos de usabilidade contra 20 possíveis de criatividade. O que separa "vencedor" de "site bonito", segundo jurador real: direção de arte onde cada escolha serve uma ideia central (teste: tirar toda animação — se os frames estáticos ainda parecem intencionais, a base está certa); movimento coreografado com significado, não "animação porque dá para animar"; performance testada em dispositivo real (um hero 3D a 18fps em Android médio não ganha, por mais bonito que seja).

Referências reais de 2026 (não suposição): Lando Norris (site oficial, estúdio OFF+BRAND) foi Site of the Year Awwwards; tendências dominantes nas galerias premiadas incluem tipografia cinética em escala de "cartaz de filme", cenas 3D com física real e câmera em profundidade Z verdadeira, e microinterações em cada elemento pequeno — não só um cursor customizado.

---

## 1. Filosofia

**Luxo Silencioso / Autoridade Tranquila.** Excelência comunica-se pela ausência de fricção, não pelo excesso de elementos. O Fathom Layer é um indexador de curadoria — a interface precisa transmitir precisão técnica e critério editorial, não hype de e-commerce. Nada de badges piscando, contadores de urgência falsa ou linguagem promocional.

**Show, don't tell.** Dados numéricos verificados e tabelas comparativas substituem adjetivos ("autonomia de 18,4h", não "autonomia excepcional").

## 2. Paleta de cores

- Base: dark mode estrito — `#0A0A0B` (fundo principal), `#131316` (superfícies/cards), grafite `#1C1C1F` (bordas sutis)
- Acento único: azul elétrico `#0052FF` — usado com moderação (CTAs, links ativos, destaques de dados). Não introduzir uma segunda cor de acento saturada.
- Texto: branco `#F5F5F7` (primário), cinza `#8A8A8E` (secundário/metadados)
- Semântico (uso pontual, nunca decorativo): verde para "em estoque/disponível", âmbar para "descontinuado" — sempre dessaturados para não competir com o azul

## 3. Tipografia

- 1–2 famílias no máximo. Sugestão: uma sans-serif geométrica para headings (peso 600–700) + a mesma família ou uma irmã para corpo (peso 400–500)
- Hierarquia forte: contraste real de tamanho entre H1/H2 e corpo — não decoração, é o que organiza a leitura de páginas densas em dados
- Números/specs em fonte monoespaçada ou tabular-nums — reforça a leitura de tabelas comparativas (VRAM, tokens/s, preços)

## 4. Padrões visuais dominantes (vocabulário, adaptar — não copiar literalmente)

| Padrão | Uso no Fathom Layer |
|---|---|
| Bento Grid Ativa | Grid de categorias na home e blocos de "produtos relacionados" — hover revela specs extras, não só muda cor |
| Dark Mode 2.0 | Base do site inteiro, já definido acima |
| Minimalismo extremo | Páginas de produto individual — specs em tabela limpa, sem ruído visual ao redor |
| Tipografia cinética (leve) | No máximo 1 headline por página reage ao scroll (ex: home) — nunca no corpo de texto ou em páginas pSEO em massa |

Nível-alvo: **Awwwards SOTD/HM** para as páginas flagship (home, calculadora, setups) — ver seção 0.1 para o critério real de julgamento. Isso significa peça 3D central autoral com física real (não decoração genérica), tipografia em escala de impacto, coreografia de movimento com significado. Para as páginas programáticas (produto/software individuais, escala pSEO), ver seção 5.3 — mesma linguagem visual e mesma disciplina de direção de arte, sem a peça 3D pesada, por razão técnica real (Core Web Vitals é parte do próprio critério de SEO/GEO que sustenta o negócio), não por timidez de design.

## 5. Camada técnica de movimento

### 5.1 Ordem de uso por tipo de página

- **Páginas flagship (home, calculadora, setups):** Three.js autoral + GSAP para coreografia — ver 5.2
- **Transições de rota (listagem → produto):** View Transitions API nativa (já suportada por App Router)
- **Reveals simples em páginas editoriais:** framer-motion, com moderação
- **Páginas programáticas pSEO:** CSS nativo (`animation-timeline: view()`) — zero dependência, compositor thread — ver 5.3 para o porquê

### 5.2 Elementos imersivos e interativos (Three.js) — peças flagship

Peça central única, com física real (inércia, peso, câmera em profundidade Z verdadeira — não parallax 2D disfarçado), no padrão dos vencedores reais 2026 (Lusion/Oryzo AI, Unseen Studio/Hubtown). Onde usar:
- **Home** — hero com objeto 3D central (ex: representação abstrata da malha de dados conectando os 3 pilares — Inteligência/Computação/Ecossistema)
- **Calculadora de Hardware para IA local** — visualização volumétrica interativa (ex: VRAM/RAM preenchendo em 3D conforme o usuário escolhe o modelo de IA)
- **Páginas de Setups** — espaço aceitável para peça de destaque, curadoria editorial de baixo volume

**Padrão técnico real, não aproximação:**
- Para controle fino de física e continuidade de transição de câmera entre cenas, usar **Three.js puro**, não React Three Fiber — R3F abstrai demais para esse nível de trabalho autoral (é a técnica real usada por Lusion em projetos desse calibre)
- **Orçamento de performance, não "testar depois":** menos de 100 draw calls (meta de 60fps estável na maioria dos devices); orçamento de frame de 16.67ms dividido em JS 2ms / travessia de cena 1ms / draw calls 4ms / shader 6ms / compositor 2ms / margem 1.6ms; memória de GPU orçada para 512MB no pior caso mobile, não para os 16GB de uma desktop de estúdio
- Técnicas de redução de draw call: `InstancedMesh` (1 draw call para N objetos idênticos), `BatchedMesh`
- WebGPU (Three.js r171+) traz ganho de 2-10x em cenas pesadas, com fallback automático para WebGL2 — perfilar antes de assumir que é sempre melhor, alguns casos mobile performam melhor em WebGL2 puro
- **GSAP com parâmetros reais:** `ScrollSmoother` (scroll nativo do navegador, não fake scrollbar — não pode sacrificar usabilidade). Curvas cinematográficas prontas: `cinematicSilk` (`.45,.05,.55,.95`, transições de câmera longas), `cinematicSmooth` (`.25,.1,.25,1`, uso geral), `cinematicFlow` (`.33,0,.2,1`, reveals de conteúdo), `cinematicLinear` (`.4,0,.6,1`, movimento contínuo). Animar só `transform`/`opacity` (compositor thread) — nunca `width`/`height`/`top`/`left` via GSAP. Registrar plugins uma vez só, no nível mais alto do app
- Peça única e bem executada > várias peças espalhadas — 7.66/10 já é SOTD real (Hubtown/Unseen Studio); perfeição não é o alvo, execução consistente de uma ideia forte é

**Acessibilidade em WebGL (é usabilidade = 30% da nota, não opcional):**
- Toda informação/ação disponível na cena 3D precisa existir também em HTML real por trás/ao redor do canvas — nunca conteúdo que só existe dentro do WebGL (leitor de tela não lê canvas)
- Operável por teclado com foco visível; todo movimento pausável e respeitando `prefers-reduced-motion` (WCAG 2.2.2)
- Contraste AA em qualquer texto sobreposto à cena
- Fallback mobile/`prefers-reduced-motion` precisa ter o CONTEÚDO real presente (não só um gradiente decorativo no lugar da peça 3D)

### 5.3 Páginas programáticas pSEO — mesma disciplina, sem a peça 3D pesada

As dezenas de milhares de páginas de produto/software geradas via pSEO mantêm a mesma direção de arte (tipografia, paleta, hover com profundidade) mas **não** carregam a peça 3D central — Core Web Vitals é literalmente parte da estratégia de SEO/GEO que sustenta o negócio (ver `fathom-layer-content-spec.md`), e um objeto 3D por página nessa escala derruba isso. Isso não é uma limitação de ambição: os próprios critérios do Awwwards recompensam a experiência flagship (home, peças autorais) — um site inscrito é avaliado pelas páginas que definem sua identidade, não pela totalidade de um catálogo de 50 mil páginas.

### 5.4 Microinterações

Consenso 2026: cursor customizado sozinho não é mais suficiente. O que diferencia é feedback instantâneo em cada elemento pequeno interativo — botão, link, toggle — não só um efeito de destaque no hero. Todo componente clicável do design system (seção 6) precisa de uma micro-resposta própria ao hover/clique.

## 6. Rotas inteligentes (Next.js App Router)

- **Segmentos dinâmicos por taxonomia:** `/[pilar]/[categoria]/[slug]` gerado via `generateStaticParams` a partir das tabelas `categories`/`products`/`software` — URL reflete a estrutura de dados, não uma árvore de pastas manual
- **Rotas de ranking anual:** `/[pilar]/[categoria]/melhores-[ano]` — mesma lógica de `generateStaticParams`, cruzando `release_year` + `design_score`, cobre "Melhores jogos de 2026", "Melhores aplicativos de 2026" etc. sem página manual nova (ver `fathom-layer-content-spec.md` seção 7.6)
- **ISR com `revalidate` diferenciado por tipo de página:** páginas de produto individual revalidam com menor frequência (specs mudam pouco); páginas de categoria/listagem revalidam mais rápido (contagem de `active_listing_count` muda com publicações novas)
- **Rotas paralelas/interceptadas** para modais (ex: abrir um produto em quick-view sobre a listagem sem sair da página, mas com URL própria e compartilhável)
- **Prefetch inteligente:** usar `<Link prefetch>` padrão do App Router nos cards de listagem, mas desativar prefetch automático em grids muito longos (pSEO) para não gerar tráfego de rede desnecessário — prefetch sob demanda (hover/viewport) em vez de tudo de uma vez
- **`generateSitemaps` segmentado** (já definido na spec de conteúdo) é parte dessa mesma lógica de roteamento em escala
- **`noindex` obrigatório em ferramentas interativas de comparação livre** (`/tools/compare`, motor "X vs Y vs Z" — ver `fathom-layer-content-spec.md` seção 7.9): evita duplicar/canibalizar as páginas fixas de comparativo geradas via pSEO

## 7. Componentes-chave a especificar no Claude Code

- **Product Card** (grid/listagem): imagem, título, `design_score`, 1 spec de destaque, tag de categoria — hover revela 2ª spec, não estado hover genérico
- **Tabela comparativa** (páginas "X vs Y"): HTML/Markdown estruturado, tabular-nums, linha de destaque para o "veredito" do Fathom Layer
- **Bloco de Prós/Contras/Ideal Para**: lista dupla (vantagens à esquerda, desvantagens à direita) + tag "ideal para" abaixo — direto dos campos `pros`/`cons`/`ideal_for`, sem parafrasear; usado em toda página de produto/software e nos comparativos lado a lado
- **Bloco de resposta atômica** (topo de página de produto/hardware): síntese do veredito técnico em até 150 palavras — formato exigido pelas pesquisas para retrieval por IA generativa
- **Bloco "Contexto Técnico"**: card simples ligando um software/modelo de IA a 1 produto de hardware recomendado (via `related_context_product_id`) — visual discreto, não é seção de "produtos relacionados" genérica de e-commerce
- **Setup Card**: capa + lista de itens do setup, layout editorial (mais parecido com artigo curado do que com carrinho de compras)
- **Card de Lançamento** (`editorial_pages` tipo `launch`): data esperada, selo de confiança (`rumored`/`announced`/`confirmed` — cores dessaturadas, nunca alarme visual), link de fonte sempre visível
- **Bloco de Alternativas**: 2-3 cards horizontais compactos, mesmo padrão do Product Card mas com menos informação — "considere também" discreto, nunca like pop-up ou interstitial
- **Selo de Verificação**: pequeno, texto ("Dados verificados há X dias"), cor neutra — nunca vira badge chamativo tipo e-commerce
- **Cartão de Spec Compartilhável**: gerado via `next/og`, formato quadrado/social, specs + `design_score` + logo discreto — pensado pra Reddit/X, não pra decoração da própria página
- **Motor de Comparação Livre**: seletor de 2-4 itens de qualquer categoria + tabela de comparação em tempo real — rota sempre `noindex` (ver rotas inteligentes)

## 8. Performance como requisito de design, não só técnico

Regra de ouro válida em qualquer stack: nenhum efeito visual vale a pena se causar frame drop em mobile. Testar sempre em dispositivo médio, nunca só no monitor de desenvolvimento. Nas páginas flagship isso é orçamento de draw call (seção 5.2); nas páginas pSEO é Core Web Vitals puro (seção 5.3) — os dois são não-negociáveis, por razões diferentes.

## 9. Checklist antes de considerar uma página pronta

**Base (vale para toda página, flagship ou pSEO):** um único acento de cor (`#0052FF`). Tipografia como hierarquia, não decoração. Hover com profundidade real (specs extras ou microinteração própria — seção 5.4), não só troca de cor. Dado numérico antes de adjetivo. Zero fricção — sem formulários desnecessários antes do link de afiliado. Performance testada em mobile. Teste "tire a animação — ainda parece intencional?": se os frames estáticos não parecem feitos de propósito, a direção de arte não está pronta.

**Flagship (home, calculadora, setups) — nível Awwwards:** peça 3D central com física real, não decoração genérica (seção 5.2). Movimento coreografado com significado, não "animação porque dá para animar". Orçamento de draw call e frame respeitado (seção 5.2). Acessibilidade WebGL completa (conteúdo real em HTML, teclado, `prefers-reduced-motion`). Nenhuma dependência nova sem essa especificação — mas aqui, diferente das páginas pSEO, Three.js/GSAP são esperados, não exceção.
