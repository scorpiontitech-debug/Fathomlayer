# Fathom Layer — README de Handoff

Índice e ordem de execução para implementação via Claude Code. Este projeto é o segundo negócio de um operador solo (o primeiro é a Infinity Soluções, agência de estratégia digital/IA). Contexto completo de negócio está em `fathom-layer-content-spec.md`, seção 0.

**Marca:** Fathom Layer. **Domínio:** fathomlayer.com. A forma longa "FathomLayer" existe apenas no domínio — em toda a interface, copy e metadados (title, OG, JSON-LD `Organization`), usar sempre "Fathom Layer".

## Documentos, em ordem de leitura

1. **`fathom_layer_schema.sql`** — schema base (categories, products, software, links, setups, setup_items) + triggers de quality gate + RLS
2. **`fathom-layer-content-spec.md`** — contexto de projeto, taxonomia de categorias/pilares, regras de negócio, nota de precisão sobre GEO/llms.txt
3. **`fathom-layer-design-system.md`** — filosofia visual, paleta, tipografia, posicionamento como "irmã" da Infinity, nível-alvo Awwwards SOTD/HM nas páginas flagship (critério real de julgamento, GSAP/Three.js com parâmetros técnicos verificados), rotas inteligentes
4. **`fathom-layer-gaps-roadmap.md`** — lacunas operacionais e suas soluções, com alterações de schema adicionais (`ingestion_staging`, `link_clicks`, `content_synthesis_log`, colunas `launch_phase`/`last_verified_at`/`link_status`), priorizadas MVP vs Fase 2
5. **`fathom-layer-dashboard-spec.md`** — painel operacional "Fathom Layer OS": fila de revisão unificada, agentes automatizados integrados, pensado para operação solo de 15-30h/semana sem escrever código

## Ordem de execução recomendada (não pular etapas nem inverter)

**Antes de tudo: leia `fathom-layer-gaps-roadmap.md` seção 0 (Sequenciamento em Camadas).** O lançamento real é só a Camada 1 ali definida — os demais documentos descrevem o produto completo, mas construir tudo de uma vez não é o objetivo. Ignore, por enquanto, qualquer item marcado Camada 2/3 mesmo que apareça em outros documentos.

1. **Banco de dados primeiro:** aplicar `fathom_layer_schema.sql` completo no Supabase, depois só as alterações da Camada 1 do roadmap
2. **Rotas base do Next.js:** estrutura de `/[pilar]/[categoria]/[slug]`, `/out/{link_id}` (redirect + tracking), páginas estáticas legais (`/privacy`, `/affiliate-disclosure`, `/methodology`, `/about`, `/contact`) — sem estilo avançado ainda, só a arquitetura de dados funcionando ponta a ponta
3. **Pipeline de ingestão simples + fila de revisão:** `/admin/review` funcional na forma mínima (seção 2.2 do `fathom-layer-dashboard-spec.md`), mesmo que feio — é o que faz o site ter conteúdo real
4. **Aplicar o design system:** só depois que existe conteúdo real para estilizar — não antes. Base "quiet luxury" sem peça 3D ainda (Camada 2)
5. **1 ferramenta interativa (Calculadora de Hardware) e polish visual básico**
6. **Sitemaps segmentados + JSON-LD:** depois que o cluster de lançamento tem massa crítica de páginas publicadas

## Por que essa ordem

Estilo antes de dados funcionando é o erro mais comum em projetos solo — o operador passa semanas ajustando visual de uma página que ainda vai mudar de estrutura assim que dados reais entrarem. Dados → fluxo → estilo → polish, nessa ordem, sempre.

## Cluster de lançamento (não lançar tudo de uma vez)

Primeira categoria a ativar (`launch_phase = 1`): **Hardware para IA Local** (pilar `compute`). Ver seed inicial de produtos em `fathom-layer-seed-hardware-ia-local.md`.

## O que o Claude Code vai precisar de você (fora do código)

- Projeto Supabase criado (separado do projeto da Infinity) + chaves de API
- Domínio configurado + projeto Vercel novo (decisão consciente: lançamento no plano **Hobby** — risco assumido de violação de uso comercial/estouro de limite de função durante a rampa de indexação pSEO; upgrade para Pro, US$20/mês, deve ser imediato ao primeiro sinal de aviso de limite, não posterguado, dado o dano de indexação que uma queda causaria nesse período)
- Conta Resend configurada para o Fathom Layer (pode reaproveitar a mesma conta da Infinity, remetente diferente)
- Cadastro no Amazon Associates (alguns programas de afiliado exigem site já publicado com tráfego mínimo — isso pode atrasar a integração de links reais; usar placeholder/link direto sem comissão até aprovação, se necessário)
- Chave de API do Claude ou Gemini para o pipeline de síntese de conteúdo
