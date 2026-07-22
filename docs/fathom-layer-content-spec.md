# Fathom Layer — Spec de Conteúdo, Taxonomia e Regras de Negócio

Documento de handoff para implementação via Claude Code. Schema SQL de referência: `fathom_layer_schema.sql` (já entregue — tabelas `categories`, `products`, `software`, `links`, `setups`, `setup_items`). Ler em conjunto com `fathom-layer-design-system.md`.

## 0. Contexto do projeto (para o Claude Code)

- **O que é:** Fathom Layer é um indexador/diretório de curadoria independente de tecnologia global — softwares, apps de IA, frameworks, hardware, gadgets, eletrônicos e veículos elétricos. Não é loja (sem estoque, sem carrinho): monetiza via links de afiliado e patrocínios pagos via Stripe.
- **Por que existe:** é o segundo negócio de um operador solo que já opera a Infinity Soluções (agência de estratégia digital e IA aplicada, alto ticket, mercado suíço, React+Vercel+Supabase). O Fathom Layer é a diversificação de receita — precisa ser 100% self-service, sem prospecção ativa, sem suporte ao cliente complexo, custo de infraestrutura próximo de zero.
- **Operação:** 1 único humano, amparado por automação e scripts de ingestão assistidos por IA (Claude/Gemini) para sintetizar conteúdo a partir de specs brutas.
- **Stack:** Next.js 15 (App Router) + Tailwind CSS + Supabase (Postgres/RLS) + Stripe. Deploy Vercel. ISR para todas as páginas dinâmicas — banco de dados é a fonte única da verdade, páginas são apenas views estáticas/incrementais.
- **Escala-alvo:** dezenas de milhares de páginas via Programmatic SEO (pSEO), com Quality Gates automáticos no build para evitar penalização por thin-content (ver seção 5).
- **Relação com a Infinity:** projeto irmão — mesma família de padrão de qualidade e filosofia de design ("Quiet Luxury"/autoridade tranquila, ver `fathom-layer-design-system.md`), mas produto, stack de frontend (Next.js vs React puro da Infinity) e identidade visual próprias, não um clone.
- **Idioma do conteúdo do site:** **inglês** por padrão (`content_language = 'en'` no schema) — decisão alinhada ao domínio `.com`, ao volume de busca global mapeado nas pesquisas de mercado e ao alcance de motores de IA generativa (majoritariamente em inglês). Documentos de arquitetura/handoff continuam em português (comunicação interna); o `content_language` no schema já deixa a porta aberta para localização futura (ex: `pt-BR`) sem mudança estrutural.

---

## 1. Taxonomia de Pilares e Categorias

Três pilares (`categories.pillar`), populados a partir das duas pesquisas de mercado:

### `intelligence` — Softwares, apps, jogos, IA e frameworks

Pilar ampliado: cobre todo software digital, não só IA — SaaS de IA continua o carro-chefe editorial (é o gancho de maior intenção comercial das pesquisas), mas jogos e aplicativos gerais entram como categorias próprias dentro do mesmo pilar, porque tecnicamente usam a mesma tabela `software` sem exigir nenhuma mudança de schema.

- SaaS de IA com tração (ex: Lindy, Perplexity)
- Modelos de linguagem / comparativos (Gemini, GPT, Claude, Llama)
- Frameworks de orquestração de agentes (LangGraph, Mastra, CrewAI, Pydantic AI)
- Servidores MCP — subcategorias: Produtividade (Zapier, Notion, Slack, Google Calendar, Jira), Dados/Infraestrutura (Supabase, Postgres), Automação de navegador (Playwright, Puppeteer), Redução de alucinações (Context7)
- **Jogos** (nova categoria) — PC, console, mobile; cobre lançamentos de alta procura e também jogos com componente de IA (NPCs generativos, etc.) quando fizer sentido conectar com o restante do hub
- **Aplicativos Gerais** (nova categoria) — produtividade, utilitários, entretenimento, não necessariamente ligados a IA — mesma régua de curadoria (`design_score`, `editorial_notes`, Quality Gate)

### `compute` — Hardware para processamento e produtividade
- Mini-PCs / workstations de IA local (GMKtec EVO-X2, Mac Mini M4 Pro, Minisforum MS-01)
- Componentes e workstations de alto ticket (GPUs, peças)
- Periféricos premium (Keychron, Razer)
- Referência técnica: os 4 escalões de hardware (Entrada / Gama Média / Entusiasta-PME / Profissional-Enterprise) do relatório de mercado servem como **conteúdo editorial de uma calculadora/guia**, não como tabela relacional — ver seção 4.

### `ecosystem_mobility` — Eletrônicos de consumo, gadgets e EVs
- Laptops e smartphones de topo (NPU, autonomia)
- Áudio premium (Sony WF-1000XM6)
- Óculos de RA (XREAL 1S, TCL RayNeo Air 4 Pro)
- Periféricos de alta rotação: carregadores sem fio, câmeras de campainha, sistemas de segurança/vigilância, automação doméstica (Matter)
- Wearables de biohacking (anéis inteligentes, bandas sem tela)
- Veículos elétricos (Tesla, Rivian, Lucid) e acessórios de carregamento doméstico
- Nicho viral de baixa barreira (ex: massageadores de couro cabeludo) — incluir só se houver dado proprietário real, não é prioridade editorial

**Regra de categorização:** cada categoria pertence a exatamente um pilar. Subcategorias usam `parent_id`. Não criar categoria sem plano de ter ≥3 itens publicáveis no curto prazo (ver Quality Gate, seção 5).

---

## 2. Regras de negócio — `products`

- `specs` (jsonb): dados técnicos puros e verificáveis (ex: `{"vram_gb": 16, "ram_gb": 64, "battery_hours": 18.4}`). Nunca texto de marketing dentro de `specs`.
- `design_score` (0–10): nota própria do Fathom Layer — é o dado proprietário que justifica indexação (Unique Data Gate). Sem `design_score` ou `editorial_notes` preenchidos, o item não deve ser publicado.
- `tags`: livres, minúsculas, sem acento (ex: `ia-local`, `mobilidade-eletrica`).
- `related_context_product_id`: uso pontual e manual — ex: página de um framework de IA aponta para 1 produto de hardware recomendado. Não é sistema de compatibilidade, é uma sugestão editorial simples.
- `pros` / `cons` / `ideal_for` (arrays): análise estruturada de vantagens, desvantagens e "para quem é ideal" — nunca texto livre dentro desses campos, cada item é uma afirmação curta e factual (ex: `"contexto de 1 milhão de tokens"`, não `"contexto excepcional"`). É o que alimenta as páginas de comparativo "X vs Y" (seção 3) e o bloco de resposta atômica, sem precisar reescrever prosa a cada comparação — o mesmo dado estruturado serve para múltiplas páginas geradas dinamicamente.
- `status`: `draft` → `published` → (`archived` se descontinuado). Só `published` entra no cálculo do Quality Gate.

## 3. Regras de negócio — `software`

- `pricing_model` + `price_text`: sempre os dois — o primeiro para filtros, o segundo para exibição (ex: "Grátis até 10k execuções/mês").
- Mesma exigência de `editorial_notes` antes de publicar.
- Comparativos "X vs Y" (ex: LangGraph vs Mastra) mencionados nas pesquisas como conteúdo de alta conversão: modelar como **página gerada dinamicamente** cruzando 2+ registros de `software` da mesma categoria, lendo `pros`/`cons`/`ideal_for` de cada um lado a lado — não precisa de tabela própria no MVP.

## 4. Calculadora de Hardware para IA Local (ferramenta interativa do roadmap)

Não requer tabela nova. É uma feature de front-end que:
1. Lê os produtos da categoria `compute` com `specs.vram_gb` / `specs.ram_gb` preenchidos
2. Aplica a lógica editorial dos 4 escalões (Entrada/Gama Média/Entusiasta-PME/Profissional-Enterprise) como regras de exibição, comparando com os modelos de IA (via `tags` como `suporta-llama-70b`, `suporta-gemma-27b` etc.)
3. Output: recomenda produtos publicados que atendem ao modelo escolhido pelo usuário

## 5. Quality Gate — parâmetros definitivos

Limiar já implementado no schema: **mínimo de 3 itens `published` por categoria** para `is_indexable = true` (trigger `refresh_category_listing_count`).

Regra adicional para o script de ingestão (Banned-Phrase Blocklist), a aplicar em `description`/`editorial_notes` antes de gravar como `published`:
- Bloquear termos vagos: "revolucionário", "pioneiro", "solução topo de gama", "incrível", "transforme", "resultados garantidos"
- Preferir dado numérico verificado a adjetivo (ex: "autonomia de 18,4h" em vez de "autonomia superior")

## 6. Setups/Receitas

Uso: guias temáticos manuais (ex: "Setup de Mesa para Rodar IA Local com 128GB", "Kit de Segurança Residencial com Matter"). Mistura livre de `product` e `software` via `setup_items`. Curadoria 100% manual — sem geração automática no MVP.

## 7. Ferramentas e Conteúdo de Utilidade (o que faz o usuário voltar)

Além da indexação/curadoria básica, o Fathom Layer precisa de utilidade ativa — motivo real para alguém acompanhar tecnologia voltar à plataforma, não só chegar via busca pontual.

### 7.1 Recomendador por Orçamento
Feature de front-end (sem tabela nova): filtra `products`/`software` publicados por `price_from` dentro de uma faixa informada pelo usuário, cruzando os 3 pilares — não só hardware de IA (que já tem a Calculadora dedicada, seção 4). Ex: "o que comprar com $500" retorna os melhores itens publicados abaixo desse teto, ordenados por `design_score`.

### 7.2 Buscador de Alternativas
Também sem tabela nova — computado na hora: mesma `category_id` + interseção de `tags` + `design_score` próximo ao item que o usuário está vendo, ordenado por relevância. Aparece como bloco "Alternativas a considerar" na página de produto/software. Não é sistema de recomendação complexo, é uma query simples sobre dados que já existem.

### 7.3 Radar de Lançamentos, Glossário e Guias de Compra
As três ideias compartilham a mesma tabela `editorial_pages` (`content_type`: `launch` / `glossary` / `guide`) — conteúdo editorial de formato livre, sem virar 3 tabelas separadas:
- **`launch`**: produtos/tecnologias ainda não lançados (ex: "MacBook Neo — o que se sabe até agora"). Usa `expected_release_date`, `launch_confidence` (`rumored`/`announced`/`confirmed`) e `source_url` — nunca publicar rumor sem fonte linkada, é o mesmo padrão de credibilidade do resto do site. Quando o produto lança de verdade, vira um registro normal em `products`/`software` (a página de lançamento pode linkar para ele via `related_context_product_id` do produto novo, não o contrário).
- **`glossary`**: definições técnicas curtas ("o que é VRAM", "o que é MCP", "o que é on-device AI") — baixa concorrência de SEO, alto volume de busca definicional, conteúdo barato de gerar/manter e com alta taxa de citação por IA generativa.
- **`guide`**: guias editoriais como timing de compra ("melhor época para comprar X"), não atrelados a um produto único.

### 7.4 Selo de Verificação
`last_verified_at` (já definido no roadmap de lacunas, seção 3) passa a ser exibido publicamente na página do produto/software ("Dados verificados há X dias") — não é só um campo interno de controle, é prova de confiança visível. Pode entrar em produção mesmo antes do cron de verificação automática existir (a data só precisa ser atualizada manualmente por enquanto).

### 7.5 "My Stack" (usuário monta e salva o próprio setup) — Fase 2, ver `fathom-layer-gaps-roadmap.md`
Essa é a única ideia desta lista que exige contas de usuário público (diferente do login único de admin já previsto) — muda o modelo de "site sem conta de usuário" e traz risco de moderação/spam. Não bloqueia o MVP; ver roadmap para o desenho completo.

### 7.6 "Melhores X de [ano]" — pSEO gerado, não artigo manual
Conecta diretamente com a expansão do pilar `intelligence` (jogos, apps gerais) e com qualquer outra categoria dos 3 pilares: página `/[pilar]/[categoria]/melhores-[ano]` gerada via `generateStaticParams`, cruzando `category_id` + `release_year` + ordenação por `design_score` entre os itens `published`. Zero curadoria manual extra além da já exigida para publicar o item — é o mesmo Quality Gate de sempre (seção 5) reaproveitado como ranking automático. Exemplos que essa mesma lógica cobre sem trabalho adicional: "Best games of 2026", "Best apps of 2026", "Best laptops of 2026", "Best agent frameworks of 2026" — mesma query, categoria diferente.

**Regra obrigatória contra canibalização de conteúdo:** a página de ranking anual não pode ser um clone da página de categoria (mesma lista, mesma ordem) — Google/GEO tratam isso como conteúdo fino duplicado. Diferenciação mínima obrigatória no template:
- Corte fixo (ex: top 10, não a listagem completa da categoria)
- 1 parágrafo editorial de abertura específico do ano (o que mudou, lançamentos-chave do período) — não reaproveitar a descrição da categoria
- `canonical` da página de ranking aponta pra si mesma, nunca redireciona pra categoria
- Categoria continua existindo como listagem completa/filtráveis; ranking anual é a curadoria editorial em cima dela — são dois ativos diferentes, não duplicata

### 7.7 Ferramentas interativas adicionais (defesa contra zero-click)
Pesquisa de mercado confirma: ferramentas que a IA não consegue "rodar" e resumir (calculadoras, configuradores) retêm tráfego melhor que conteúdo estático, porque geram resultado condicional aos dados do usuário. Além da Calculadora de Hardware (seção 4), duas ferramentas adicionais, ligadas aos próprios gaps de mercado que identificamos:
- **Configurador de Carregamento Doméstico de EV** — usuário informa modelo do carro, painel elétrico disponível e distância até a garagem; ferramenta recomenda amperagem/carregador compatível com o código NEC 2026 (que passou a exigir "qualified person" para instalação permanente e GFCI de 5mA) e produtos publicados que atendem. Conecta diretamente os pilares `ecosystem_mobility` (carro) e `compute`/periféricos (carregador).
- **Comparador de Servidores MCP por Segurança** — lê os itens `published` da categoria de servidores MCP, filtráveis pelas `tags` reservadas de segurança (ver `fathom-layer-gaps-roadmap.md` seção 13: `security-verified`, `oauth-required`, `no-known-cve`). É a materialização direta do diferencial competitivo identificado (a maioria dos registros de MCP não filtra por segurança nenhuma).

### 7.8 Duas camadas de conteúdo — autoridade vs. conversão
Distinção editorial que orienta como `editorial_pages` e páginas de produto/software são escritas: **camada de autoridade** (glossário, guias técnicos, radar de lançamentos — feita pra ser citada por IA, sem intenção comercial direta) e **camada de conversão** (comparativos "X vs Y", "melhor X para [caso]", páginas de produto com link de afiliado — onde a IA raramente resolve a pergunta sozinha, porque exige decisão pessoal de compra). As duas são necessárias: a primeira constrói citação/autoridade, a segunda constrói receita — não são a mesma página fazendo os dois papéis mal feitos.

### 7.9 Ferramentas de escala — priorização e viabilidade
Avaliação técnica antes de qualquer uma dessas entrar em desenvolvimento:

- **Cartão de spec compartilhável — MVP, construir primeiro.** Usa geração de imagem nativa do Next.js (`next/og`), roda na edge, cacheável via ISR — zero infraestrutura nova. Gera 1 imagem (specs + `design_score`) por `product`/`software` publicado, pensada pra compartilhamento em Reddit/X/fóruns.
- **Motor "X vs Y vs Z" livre — MVP, com regra obrigatória.** Usuário escolhe livremente 2-4 itens de qualquer categoria e a ferramenta monta a comparação em tempo real a partir de `pros`/`cons`/`specs` já existentes — sem gerar página nova por combinação (resolve a explosão combinatória que o pSEO fixo de "Melhores X" não cobre). **Regra obrigatória: essa rota é sempre `noindex`.** É utilidade interativa, não conteúdo indexável — se indexar, duplica/canibaliza as páginas fixas de comparativo "X vs Y" já geradas via pSEO (ver seção 7.6), reabrindo o problema que a regra anticanibalização já resolveu.
- **Recomendador universal ("me recomende algo") — Fase 2, restrito ao cluster inicial primeiro.** `tags`/`ideal_for` são texto livre, não uma taxonomia estruturada de perguntas — funcionar bem em qualquer categoria sem curadoria manual exige uma tabela pequena nova (`category_facets`, ver `fathom-layer-gaps-roadmap.md` item 15). Lançar só para "Hardware para IA Local" (onde já há dado rico e curado à mão) antes de generalizar.
- **Widget embutível — Fase 2, com cache obrigatório.** Versão miniatura de calculadora/comparador para outros sites incorporarem via iframe/script — cada embed é backlink e menção de marca (correlação com citação por IA ~3x mais forte que backlink puro, segundo a pesquisa). **Deve nascer estático/cacheado (ISR), nunca com query viva por view** — sem isso, viralizar em outro site vira custo de infraestrutura variável, o oposto do modelo de custo zero.
- **Verificador de compatibilidade — cortado na forma original.** "X é compatível com Y" exige lógica relacional real, que é exatamente a complexidade de compatibilidade sistêmica descartada no início do projeto (ver seção 0). Uma versão baseada só em cruzamento de `tags` é enganosa — se errar uma afirmação de compatibilidade, ataca a credibilidade que é o próprio moat do produto. Se reintroduzido, deve ser rotulado como "compartilham característica X" (ex: ambos suportam Matter), nunca como afirmação de "compatível" — e mesmo assim fica fora do MVP.

## 8. Checklist de GEO por tipo de página (aplicar em todo template)

- [ ] Bloco de resposta atômica no topo (≤150 palavras, síntese direta — já especificado no design system)
- [ ] `pros`/`cons`/`ideal_for` estruturados, nunca só prosa
- [ ] Pelo menos 1 fonte externa citada com link, quando o dado técnico não é primário (`cite_sources`) — não tem medo de linkar pra fora, é sinal de confiabilidade que se propaga
- [ ] JSON-LD específico do tipo certo (`Product` para hardware/gadgets, `SoftwareApplication` para software/jogos/apps, `FAQPage` quando houver seção de perguntas, `Organization` só na home) — nunca um schema genérico aplicado a tudo
- [ ] Títulos de seção em formato de pergunta direta quando fizer sentido (ex: "Qual hardware roda Llama 70B localmente?"), não título genérico
- [ ] `last_verified_at` exibido (selo de verificação, seção 7.4)
- [ ] Dado numérico verificado antes de adjetivo (regra já existente do Quality Gate, seção 5)
- [ ] **8-12 links internos contextuais por página**, apontando para categoria, comparativos relacionados e `editorial_pages` relevantes — nunca página órfã sem link de entrada; distribui autoridade entre páginas novas e estabiliza posicionamento de cauda longa

## 9. Ângulo de ataque em categorias de alta saturação editorial

Categorias como Smartphones, Laptops Premium, Áudio e Jogos têm concorrentes com anos de autoridade acumulada (Wirecutter, The Verge, IGN) — não são evitadas, mas a entrada não é pelo termo-cabeça genérico ("melhor smartphone 2026"), porque isso não é vencível no ano 1 por ninguém, novo ou não. A entrada é pela pergunta técnica específica de cauda longa que o concorrente grande não responde com profundidade, porque exige cruzamento entre pilares ou opinião editorial real — não reciclagem de ficha técnica de fabricante:

- **Smartphones:** não "review do modelo X" — "quais smartphones rodam modelo de IA localmente sem depender de nuvem" (cruza com pilar `intelligence`)
- **Laptops:** não ficha técnica de NPU — matriz de decisão por workflow real (edição de vídeo, dev, IA local), respondendo se a NPU entrega ganho real ou é só marketing
- **Áudio:** não "melhor fone 2026" — como o item se integra com o resto do setup do usuário (cruza com automação doméstica/gadgets)
- **Jogos:** não cobertura de lançamento genérico — jogos que rodam bem no hardware que o próprio site já cura em profundidade (cruza com pilar `compute`)

**A vitória de médio prazo:** acumular autoridade de domínio via volume de cauda longa (onde o concorrente grande não presta atenção porque o volume individual parece pequeno pra eles) antes de disputar o termo-cabeça. Isso não é medo de concorrência — é sequência realista de como autoridade de domínio se constrói, inclusive para os próprios concorrentes que hoje dominam.

**Vantagem estrutural real contra publisher grande, disponível desde o mês 1:** portais com anos de conteúdo acumulado têm milhares de páginas desatualizadas nunca revisadas. O selo de verificação (`last_verified_at`, seção 7.4) é prova pública de estar mais atualizado que eles em itens específicos — vencível imediatamente, não depende de anos de autoridade acumulada.

## 10. Nota de precisão — `/llms.txt`

As pesquisas de mercado enviadas tratam `/llms.txt` e `/llms-full.txt` como peça central da estratégia GEO. Pesquisa mais recente e verificada indica que a adoção real gira em torno de 8–10% dos sites, e que os principais crawlers de IA (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) majoritariamente **não leem esse arquivo** — rastreiam o HTML direto. O Google já confirmou que não o usa como sinal. Onde ele ajuda de fato: ferramentas de IA para desenvolvedores (Claude Code, Cursor) apontadas para documentação técnica — não é mecanismo geral de visibilidade em sites comerciais.
**Recomendação:** manter `/llms.txt` como item de baixa prioridade/baixo custo (é barato gerar), mas não tratar como pilar da estratégia. O que tem impacto real e deve ser prioridade: JSON-LD completo (Product/SoftwareApplication/FAQPage/Organization), `<head>` completo (title/description/canonical/OG/Twitter), tabelas HTML/Markdown estruturadas e dados numéricos verificados no corpo do texto — como as próprias pesquisas também apontam nas técnicas `statistics_addition` e `cite_sources`.
