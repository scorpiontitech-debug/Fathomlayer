# Fathom Layer — Documento Único de Estratégia (substitui os 4 documentos anteriores)

**Marca:** Fathom Layer. **Domínio:** fathomlayer.com.

## O que é
Diretório de curadoria de tecnologia. Monetiza via afiliado/patrocínio. Operado por 1 pessoa com Claude + Gemini fazendo toda a síntese de conteúdo — sem teste manual/benchmark próprio.

## Cluster de lançamento: pilar `intelligence` (IA)
Maior volume de busca disponível — ChatGPT ~94,6M buscas/mês (EUA), ordens de magnitude acima de qualquer outro nicho avaliado.

**Conteúdo, em ordem de publicação:**
1. Comparativos de LLM (ChatGPT vs Claude vs Gemini vs Llama) — maior volume, mais concorrência
2. "Melhores ferramentas de IA [ano]" — cauda longa de uso geral
3. Frameworks de agentes (LangGraph, CrewAI, AutoGen, Pydantic AI) e servidores MCP — volume menor, concorrência baixa, cresce rápido
4. Hardware para IA local (Mac Mini, GMKtec, etc.) — fica como sub-cluster de nicho/alto ticket, alimenta a Calculadora de Hardware, não é prioridade de tráfego

**Complemento (pesquisa Gemini, jul/2026) — assimetria de risco AI Overviews:** consultas informacionais puras de IA (ex: comparativos de LLM, "o que é X") disparam AI Overviews em ~82% dos casos — o usuário fica satisfeito sem clicar. Consultas de compra de hardware/eletrônicos/VE de alto ticket disparam AIO em só ~3,2% — IA generativa evita recomendar compra cara sem contexto visual/comparativo. **Implicação:** dentro do pilar `intelligence`, priorizar formatos que levam à ação/decisão (frameworks + afiliado de SaaS, "qual escolher para meu caso") sobre definição pura de conceito. O sub-cluster de hardware e o pilar `ecosystem_mobility` (Fase 2) merecem mais peso editorial do que a prioridade original sugeria, por serem estruturalmente mais resistentes a zero-click.

## Como o conteúdo é feito
Claude/Gemini sintetizam a partir de documentação oficial, changelogs e reviews públicos. Sem benchmark próprio. Diferencial vem de: veredito editorial claro (recomendação direta, não só fato), velocidade de atualização (frameworks de IA mudam toda semana), e cobertura de nicho técnico onde a concorrência ainda é fraca.

## Monetização
- **SaaS de IA com programa de afiliado tradicional** (comissão recorrente) — prioridade nº1, mais parecido com afiliado de e-commerce
- **Patrocínio direto via Stripe** — empresas de IA/frameworks pagam para aparecer em destaque num comparativo, sem comprar posição no ranking
- **Afiliado de infraestrutura** (Vercel, Supabase, hospedagem) usada pelos frameworks cobertos
- **Amazon Associates** para o sub-cluster de hardware — ticket alto, ainda que baixo volume

## Programas de afiliado reais (pesquisa Gemini, jul/2026 — dado concreto para popular o seed)

**SaaS de IA (Pilar Intelligence):**
| Produto | Comissão | Cookie | Rede |
|---|---|---|---|
| Notion AI | 50% recorrente 12m | 90 dias | PartnerStack |
| Lindy AI | 30% recorrente **vitalício** | 30 dias | PartnerStack |
| Surfer SEO | 25% recorrente **vitalício** | 60 dias | In-house |
| Copy.ai | 45% recorrente 12m | 60 dias | Várias |
| Jasper AI | 25-30% recorrente 12m | 45 dias | Impact |
| Gamma | 25-30% recorrente 12m | 90 dias | PartnerStack |
| Writesonic | 20% recorrente 12m | 60 dias | FirstPromoter |
| CustomGPT.ai | 15-20% recorrente 24m | 30 dias | In-house |
| Descript | 30% ano inicial | 90 dias | PartnerStack |
| Perplexity Pro | $15-20 fixo | 30 dias | Dub.co |
| Activepieces | 10% primeiro ano | — | PartnerStack |
| ClickUp AI | Até $25 fixo/registro | 30 dias | In-house |

**Hardware/Periféricos (Pilar Compute):**
| Marca | Comissão | Cookie | Rede |
|---|---|---|---|
| GMKtec | 5% | 15 dias | ShareASale/Awin |
| Keychron | 5% | 30 dias | In-house/Mastex |
| Logitech G | 4-10% | 30 dias | Impact |
| Razer | 3-10% | 30 dias | Post Affiliate Pro |
| Adorama | 2-8% | 30 dias | In-house/Impact |
| B&H Photo Video | 2-8% | 60 horas (curto!) | Impact/CJ |
| Minisforum | 1-3% (AOV alto compensa) | 30 dias | Webgains |
| Amazon Associates | 1-4% | 24 horas | Amazon |

**Mobilidade/VE (Pilar Ecosystem_Mobility):**
| Marca | Comissão | Cookie | Rede |
|---|---|---|---|
| WenStorm | Até 12% + bônus por volume | 60 dias | In-house |
| Lectron EV | 8% | 30 dias | Awin/In-house |
| LENZ Charging | 7% | 30 dias | In-house/Awin |
| Autel Energy | Elevada (até $10K/mês para afiliados corporativos) | Variável | In-house |
| EVANNEX | Variável | 30 dias | Rakuten |
| EV Sportline | Variável (AOV pode passar $2.000) | 30 dias | In-house |

**Regra prática:** comissão recorrente/vitalícia (Lindy, Surfer SEO) supera bounty único a partir de poucos meses de retenção — priorizar esses programas na ordem de publicação dentro do motor de tráfego SaaS.

## GEO — validação técnica (pesquisa Gemini, jul/2026)
Confirma e reforça o que já está no design system, sem mudar nada nele:
- Resposta atômica de 134-167 palavras aumenta extração por mecanismos RAG (~2,1x) — bloco de resposta ≤150 palavras já especificado está alinhado
- Estatística com fonte nomeada no corpo do texto aumenta taxa de citação por IA generativa (~40%, estudo Princeton) — reforça a regra de "dado numérico antes de adjetivo"
- Conteúdo atualizado há menos de 30 dias tem vantagem de citação (~3,2x) sobre conteúdo parado — `last_verified_at` visível já cobre isso
- Schema JSON-LD específico por tipo (Product/SoftwareApplication/FAQPage) já é regra existente — confirmado como prioritário sobre `/llms.txt`

## Concorrência direta por vertical (pesquisa Gemini, jul/2026)
- **Eletrônicos/hardware:** The Verge, TechRadar, CNET, Tom's Guide — DA >90, mas prosa hiperbólica e Core Web Vitals ruins (anúncios intersticiais, autoplay). Abertura: dados estruturados (specs booleanas, tabelas) em vez de adjetivo.
- **Mobilidade/VE:** ev-database.org domina (~816K visitas/mês, DA 51), mas é uma "ilha" só de veículo. Abertura: cruzar VE com ecossistema (carregador + smart home + compatibilidade Matter), eixo que o concorrente não cobre.

## Sazonalidade — calendário editorial (pesquisa Gemini, jul/2026)
- **Jan-Maio:** aquisições corporativas SaaS/B2B, frameworks e agentes em alta, WWDC/Google I/O alimentam páginas de "Radar/Lançamentos"
- **Jul-Set:** lançamentos de VEs do ano-modelo, pico de busca por carregadores/conectores (NACS vs CCS)
- **Nov-Dez:** Black Friday — hardware (laptops NPU, fones premium) com desconto agressivo; Amazon Associates paga pior nesse período, priorizar afiliados diretos (B&H, Keychron, Logitech G)

## Patrocínio B2B — benchmark de preço (pesquisa Gemini, jul/2026)
- CPM de newsletter/publicação tech nichada: $25-150 (SaaS B2B/IA/Finanças no topo da faixa)
- CPC em canais hiperfocados: $1,56-2,50
- Taxa fixa mensal (modelo "Daring Fireball"): $3.500-10.000+ por posição exclusiva de topo
- Formato recomendado para o Fathom Layer: menção nativa de topo de página ("A curadoria desta semana é patrocinada por [Marca]"), nunca venda de posição no ranking/`design_score` — preserva credibilidade E-E-A-T

## Plano editorial inicial — 15 primeiros conteúdos (pesquisa Gemini, jul/2026, cruzando os 3 pilares)
1. Mini-PCs locais capazes de rodar Llama-70B sem nuvem (Hardware x IA)
2. Servidores MCP verificados com segurança empresarial (SaaS)
3. Adaptação doméstica de VE: NACS vs CCS (Mobilidade)
4. Laptops com NPU nativa: ganho real ou marketing? (Hardware)
5. Ferramentas com afiliação vitalícia vs assinatura contínua, foco Lindy AI (SaaS)
6. GMKtec EVO vs configurações Mac Mini (Hardware)
7. Acústica para devs: Bose QuietComfort Ultra vs fones abertos (Eletrônica)
8. Writesonic (recorrente) vs adoção isolada de integração (SaaS)
9. Wearables biológicos: Oura Ring 4 vs Galaxy Ring vs Ultrahuman (Mobilidade/Eletrônica)
10. Teclados Keychron nas integrações físicas de estação de IA (Hardware)
11. Lançamentos smart home com Matter (Mobilidade)
12. Óculos XREAL vs Vision Pro (Eletrônica)
13. CustomGPT/Jasper para equipes B2B vs acesso individual (SaaS)
14. Estações de carregamento residencial Autel/LENZ para condomínios (Mobilidade, ticket alto)
15. Glossário técnico (VRAM, FLOPs, Agentes, NPU) — FAQPage Schema, conteúdo "link-bait" para citação por IA, sem monetização direta

## Ordem de execução
1. Banco de dados (schema + `launch_phase`, fila de revisão, tracking de clique `/out/{link_id}`)
2. Rotas básicas + páginas legais (`/privacidade`, `/aviso-de-afiliados`, `/metodologia`)
3. Publicar os primeiros 10-15 itens do cluster `intelligence` (comparativos + frameworks/MCP)
4. Design/estilo só depois de ter conteúdo real publicado
5. Calculadora de Hardware + polish visual, por último

## Meta prática
10-15 itens publicados no pilar `intelligence` antes de ativar indexação (`launch_phase = 1`). Sem teste próprio — velocidade e qualidade editorial de síntese são o diferencial, não benchmark exclusivo.

## Nota de confiabilidade dos dados (pesquisa Gemini, jul/2026)
Estatística de zero-click (68,01%, SparkToro/Datos) verificada e confirmada via busca própria — dado real. Percentuais mais específicos (2,1x extração RAG, 40% aumento de citação, 3,2x vantagem de frescor, 35% preferência de clique pós-AIO) são plausíveis e citam estudos reais (Princeton, Pew Research, Bain), mas devem ser tratados como direcionais, não como constantes exatas a prometer a terceiros (patrocinadores, parceiros de afiliado).
