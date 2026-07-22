# Fathom Layer — Lacunas, Soluções e Priorização

Terceiro documento de handoff. Ler junto com `fathom_layer_schema.sql`, `fathom-layer-content-spec.md` e `fathom-layer-design-system.md`. Este documento cobre o que falta para o Fathom Layer operar e escalar de verdade, não só existir.

---

## Como ler este documento

Cada lacuna tem: solução escolhida, alteração de schema (se houver) e prioridade — **MVP** (bloqueante para lançar) ou **Fase 2** (só depois de tração inicial).

---

## 0. Sequenciamento em Camadas — o que toca primeiro, de verdade

Este documento lista tudo que o Fathom Layer eventualmente precisa. **Não constrói tudo de uma vez.** Com 15-30h/semana e sem escrever código, o lançamento real é só a Camada 1 — o resto entra depois de 90 dias operando com dado real, não por decisão antecipada.

### Camada 1 — Launch v1 (o que sai primeiro, ~3-4 meses)
- Schema base completo (`fathom_layer_schema.sql`) + só os itens deste roadmap marcados MVP: #1 (staging simples, pode ser semi-manual no início), #2 (fila de revisão — versão simples, seção 2.2 do `fathom-layer-dashboard-spec.md`, sem agentes ainda), #4 (`/out/{link_id}`), #5 (`launch_phase`), #7 (`/methodology` + `/about`), #8 (legal), #11 (segurança operacional de pSEO — regra mecânica de ritmo, vale pra todas as categorias), #16 (estratégia de rede de afiliados)
- **Todas as categorias de maior volume de busca abertas desde o início** (ver item #5) — decisão consciente do operador de aceitar prazo mais longo de autoridade em troca de tráfego orgânico amplo, mesmo em categorias de monetização mais difícil
- Design system aplicado na base "quiet luxury" (dark mode, tipografia, hover com profundidade) — **sem a peça 3D flagship ainda**
- **1 única ferramenta interativa:** a Calculadora de Hardware (seção 4 do content-spec)
- Nenhum agente automatizado, nenhum servidor MCP próprio, nenhuma API, nenhuma conta de usuário público

### Camada 2 — construção em etapas sequenciais, dentro da própria janela de lançamento (não é mais "esperar 90 dias de tração")

**Decisão atualizada:** as 5 features técnicas antes adiadas para depois de validação externa entram todas no plano de construção do lançamento, mas em etapas sequenciais, não simultâneas — ordenadas por exposição operacional crescente (a de menor risco primeiro), para não multiplicar pontos de falha técnica de uma vez só num operador que depende 100% de IA para codar:

1. **2 agentes automatizados primeiro** (Triagem de Quality Gate + Vigia de Indexação) — são internos, não expõem nada ao público, e reduzem a carga de revisão manual cedo, sustentando a construção das etapas seguintes
2. **Painel (`fathom-layer-dashboard-spec.md`) cresce junto de cada agente**, como já definido
3. **Peça 3D flagship** (home + calculadora, design system seção 5.2) — isolada visualmente, não toca integridade de dado
4. **Servidor MCP próprio curado por segurança** (#13) — primeiro serviço voltado ao público externo, exige monitoramento ativo
5. **API pública freemium** (#12) — autenticação, rate limit, documentação
6. **Contas de usuário público** — "My Stack" (#10) e UGC controlado (#14) — última etapa, maior exposição (spam, autenticação pública, moderação)
- Demais 3 agentes (Vigia de Preço/Link, Vigia de Segurança MCP, Rascunhador de Radar de Lançamentos) entram junto das etapas 4-5, quando já fizer sentido ter mais sinal automatizado alimentando o painel

### Camada 3 — só depois que as etapas da Camada 2 estiverem estáveis em produção
- `category_facets`/Recomendador Universal (#15), licenciamento de dados, otimização de custo de IA em camadas (#9), expansão de newsletter (#6) e monitoramento de link rot (#3)

---

## 1. Aquisição de dados em escala — MVP

**Problema:** ninguém popula milhares de produtos manualmente; IA sem dados reais alucina specs.

**Solução:** tabela de staging separada das tabelas públicas. Fontes automatizadas alimentam o staging; a IA só sintetiza texto em cima do que já foi extraído — nunca inventa números.

```sql
create table ingestion_staging (
    id              uuid primary key default gen_random_uuid(),
    target_table    text not null check (target_table in ('products', 'software')),
    source_name     text not null,       -- ex: 'amazon_pa_api', 'github_api', 'manual'
    raw_payload     jsonb not null,      -- dados crus da fonte, sem edição
    proposed_category_id uuid references categories(id),
    ai_synthesis    jsonb,               -- description/editorial_notes gerados, aguardando revisão
    status          text not null default 'pending' check (status in ('pending', 'synthesized', 'approved', 'rejected')),
    fetched_at      timestamptz not null default now()
);
```

Fontes por pilar, em ordem de esforço/retorno:
- `ecosystem_mobility` e `compute`: Amazon Product Advertising API (já é programa de afiliado necessário mesmo assim) — specs estruturadas + preço em tempo real
- `intelligence`: GitHub API (estrelas, releases, linguagem) para frameworks open-source; Hugging Face API para benchmarks de modelos; Product Hunt API para SaaS novos
- Regra dura para o prompt de síntese: a IA só pode escrever o que está em `raw_payload`. Qualquer número fora da fonte é rejeitado no code review do pipeline, não é uma sugestão — é uma regra de sistema.

## 2. Fila de revisão humana — MVP

**Problema:** publicar direto do pipeline é risco de erro caro; erro de spec destrói a credibilidade que é a proposta de valor do Fathom Layer.

**Solução:** ajustar o `status` de `products`/`software` para incluir estágio intermediário, e uma tela simples de aprovação em lote.

```sql
alter table products drop constraint products_status_check;
alter table products add constraint products_status_check
    check (status in ('draft', 'pending_review', 'published', 'archived'));

alter table software drop constraint software_status_check;
alter table software add constraint software_status_check
    check (status in ('draft', 'pending_review', 'published', 'archived'));
```

Interface: uma rota protegida no próprio Next.js (`/admin/review`, autenticação simples via Supabase Auth com seu único usuário) listando `pending_review`, com aprovar/rejeitar em lote e atalhos de teclado — não precisa de ferramenta de admin separada. Tempo do operador solo é o recurso mais caro do projeto.

## 3. Link rot e dados obsoletos — Fase 2 (monitorar manualmente nos primeiros 90 dias)

**Problema:** preços mudam, links de afiliado quebram (receita vazando em silêncio), modelos de IA ficam desatualizados em semanas.

**Solução:** campo de idade + job periódico.

```sql
alter table products add column last_verified_at timestamptz not null default now();
alter table software add column last_verified_at timestamptz not null default now();
alter table links add column link_status text not null default 'ok' check (link_status in ('ok', 'broken', 'unchecked'));
```

Supabase Edge Function agendada (cron semanal): faz `HEAD` request em cada `links.url`, marca `broken` se status ≥ 400; marca itens com `last_verified_at` > 90 dias como candidatos a `pending_review`. Adiar para Fase 2 é aceitável porque no lançamento o volume de links é pequeno o suficiente para checagem manual ocasional.

## 4. Analytics de conversão — MVP

**Problema:** sem rastrear cliques, não há como saber o que converte — decisão vira achismo.

**Solução:** todo link de afiliado passa por uma rota de redirecionamento própria em vez de apontar direto para o destino. Resolve rastreamento **e** permite trocar a URL de afiliado sem reindexar páginas.

```sql
create table link_clicks (
    id              uuid primary key default gen_random_uuid(),
    link_id         uuid not null references links(id) on delete cascade,
    referrer_path   text,
    region_detected text,
    clicked_at      timestamptz not null default now()
);
create index idx_link_clicks_link on link_clicks (link_id, clicked_at);
```

Fluxo: card de produto aponta para `/out/{link_id}` → route handler do Next.js grava em `link_clicks` e responde com `302` para `links.url`. Zero JavaScript de tracking client-side, funciona mesmo com ad-blocker, e vira a fonte de dado para decidir onde investir as próximas horas de curadoria.

## 5. Estratégia de lançamento por clusters — MVP (decisão operacional, sem custo de dev)

**Problema:** publicar dezenas de milhares de páginas no dia 1 em domínio novo lê como spam para o Google.

**Solução:** campo de fase controla indexação independentemente da contagem de listagens.

```sql
alter table categories add column launch_phase integer not null default 2;
-- 1 = cluster de lançamento (indexável desde já), 2 = aguardando fase 2, 3 = fase 3
```

O trigger de Quality Gate (já existente) passa a checar `launch_phase = 1 AND active_listing_count >= 3` para `is_indexable`. **Decisão final:** o lançamento inclui todas as categorias de maior volume de busca identificadas na pesquisa, cruzando os 3 pilares — Hardware para IA Local, SaaS de IA, Servidores MCP, Laptops Premium, Smartphones, Áudio Premium, EVs/Carregamento, Óculos de RA, Jogos, Apps, Impressão 3D, Wearables/Biohacking e Automação Doméstica. Decisão consciente: aceitar que autoridade em categorias de saturação editorial alta (smartphones, jogos, áudio) demora mais a se consolidar do que nas categorias de monetização/diferencial mais fácil — mas o volume de tráfego orgânico compensa o prazo mais longo, segundo avaliação do operador. Monetização por categoria segue a hierarquia de redes do item #16 (PartnerStack/Impact como motor principal onde disponível, Amazon como cobertura secundária, nunca a única rede) — categorias sem programa de afiliado viável no momento ainda geram valor de tráfego/autoridade/citação por IA, mesmo sem receita direta imediata.

**A única regra que não muda, porque é mecânica e não estratégica:** o ritmo de publicação do item #11 (ligado à taxa de indexação real, não a um calendário fixo) continua valendo para todas as categorias, independente de quantas estejam abertas ao mesmo tempo — é proteção técnica contra penalização do Google, não uma limitação de ambição competitiva.

## 6. Moat contra a própria IA generativa — Fase 2

**Problema:** se o Fathom Layer é bom demais sendo citado por ChatGPT/Perplexity, o usuário nunca clica — toda a receita depende de tráfego que pode nem chegar ao site.

**Solução:** captura de e-mail simples, sem popup/interstitial (contraria a filosofia "zero fricção" do design system) — bloco inline discreto no rodapé de páginas de alto valor (comparativos, calculadora).

```sql
create table newsletter_subscribers (
    id              uuid primary key default gen_random_uuid(),
    email           text not null unique,
    source_page     text,
    subscribed_at   timestamptz not null default now()
);
```

Envio via Resend (já em uso na Infinity — reaproveita infraestrutura). Licenciamento de dados estruturados para empresas de IA como receita B2B adicional: fica como nota estratégica para quando houver volume de dados relevante, não é trabalho de engenharia agora.

## 7. Página de metodologia/confiança — MVP (baixo custo, alto retorno de credibilidade)

**Problema:** a arma competitiva do Fathom Layer é ser mais confiável que os concorrentes com credibilidade em queda — mas isso só funciona se for visível e verificável. Isso inclui um problema real de E-E-A-T (critério do próprio Google para conteúdo de recomendação de compra): site de curadoria 100% anônimo é exatamente o padrão que algoritmos de qualidade têm penalizado.

**Solução:** duas páginas estáticas, não uma:
- `/methodology` — como `design_score` é calculado, que não há venda de posição no ranking, e os critérios do Quality Gate
- `/about` — quem está por trás do Fathom Layer, com credencial real (não anônimo) — nome, experiência relevante, ligação transparente com a Infinity Soluções (reforça em vez de esconder — é prova de operação real, não projeto fantasma). Isso conta tanto pra confiança do usuário quanto pra sinal de qualidade E-E-A-T

Sem alteração de schema — conteúdo editorial fixo, mas linkado no rodapé de toda página de produto/software (reforça também GEO: fonte que se explica é mais citável pelas técnicas `cite_sources`/transparência mencionadas nas pesquisas).

## 8. Legal mínimo — MVP (não é feature, é risco jurídico)

**Problema:** disclosure de afiliado é obrigatório (Suíça/UE/EUA); operar sem isso expõe o operador solo.

**Solução:** páginas estáticas `/privacy` e `/affiliate-disclosure`, mais um componente de disclosure discreto (ex: "Este site pode ganhar comissão por compras via links") no rodapé global e em qualquer bloco que renderize um link de `/out/{link_id}`. Entra no design system como componente padrão, não como exceção.

## 9. Custo de IA em escala — Fase 2 (relevante só a partir de volume real)

**Problema:** sintetizar dezenas de milhares de páginas via IA tem custo real e cresce com a escala.

**Solução:** estratégia de modelo em camadas — modelo mais barato/rápido para síntese em massa de itens de cauda longa (specs simples, baixo tráfego esperado), modelo premium reservado para páginas de alta intenção comercial (comparativos "X vs Y", conteúdo da calculadora de hardware). Rastrear custo real:

```sql
create table content_synthesis_log (
    id              uuid primary key default gen_random_uuid(),
    staging_id      uuid references ingestion_staging(id),
    model_used      text not null,
    tokens_used     integer,
    estimated_cost_usd numeric(10,4),
    created_at      timestamptz not null default now()
);
```

---

## 10. "My Stack" — usuário monta e salva o próprio setup — Fase 2

**Problema:** feature de retenção real (motivo de o usuário voltar), mas é a primeira do produto que exige conta de usuário **público** — diferente do login único de admin já previsto para `/admin/review`. Traz superfície nova de spam/moderação que contradiz "zero suporte ao cliente complexo" se malfeita.

**Solução:** Supabase Auth para usuários públicos (magic link, sem senha — menor fricção e menor superfície de ataque), tabelas simples de posse e compartilhamento:

```sql
create table user_stacks (
    id              uuid primary key default gen_random_uuid(),
    user_id         uuid not null references auth.users(id) on delete cascade,
    title           text not null,
    share_slug      text unique,  -- gerado só quando o usuário torna público
    is_public       boolean not null default false,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table user_stack_items (
    id              uuid primary key default gen_random_uuid(),
    stack_id        uuid not null references user_stacks(id) on delete cascade,
    item_type       text not null check (item_type in ('product', 'software')),
    item_id         uuid not null,
    position        integer not null default 0
);

alter table user_stacks enable row level security;
alter table user_stack_items enable row level security;

create policy "owner_full_access_stacks" on user_stacks
    for all using (auth.uid() = user_id);
create policy "public_read_shared_stacks" on user_stacks
    for select using (is_public = true);
```

Sem moderação de conteúdo livre (usuário só combina produtos/software já curados pelo Fathom Layer, não escreve texto livre público) — isso elimina a maior parte do risco de spam/abuso sem precisar de fila de revisão humana para essa feature especificamente.

---

## 11. Segurança operacional de pSEO — MVP (previne morte do domínio, não é opcional)

**Problema:** casos reais documentados — HouseFresh perdeu 91% do tráfego orgânico e Retro Dodo 85%, ambos por publicar conteúdo em escala sem densidade de dados suficiente por página, ficando vulneráveis a atualizações de qualidade do Google (spam de conteúdo em escala). Volume de páginas sem controle de ritmo é risco existencial para um site novo, não só questão de qualidade.

**Solução:** duas regras operacionais, sem necessidade de tabela nova (usa campos já existentes):

1. **Gate mínimo de dados por página**, reforçando o Unique Data Gate já definido: nenhum `product`/`software` publica com menos de 5 campos de `specs`/`pros`/`cons`/`ideal_for` preenchidos combinados — abaixo disso, fica em `pending_review` indefinidamente, nunca vira `published` por padrão/timeout.
2. **Ritmo de publicação amarrado à taxa de indexação**, não a um calendário fixo:
   - Início: 10–25 páginas novas indexáveis por semana (domínio novo, sem autoridade)
   - Crescimento máximo: +25%/semana sobre o ritmo anterior
   - Se a taxa de indexação (páginas indexadas / páginas publicadas nos últimos 30 dias, verificável via Search Console) cair abaixo de 50%: cortar o ritmo de publicação pela metade
   - Se cair abaixo de 30%: parar novas publicações e revisar densidade de dados antes de continuar

Isso é uma disciplina operacional do lançamento por cluster (seção 5) — o cluster "Hardware para IA Local" só expande pra próxima categoria depois de manter indexação saudável, não só depois de bater 3 itens `published`.

## 12. API pública freemium — Fase 2

**Problema:** monetização hoje é só afiliado + patrocínio — dependência de canal único é o mesmo risco que matou HouseFresh/Retro Dodo, só que na receita em vez do tráfego.

**Solução:** expor os dados estruturados (`products`, `software` publicados) via API REST read-only, tier gratuito com rate limit generoso (ex: 100 requisições/mês), tier pago para volume — mesmo padrão de RapidAPI/NewsData.io. Usa Stripe (já no stack) pra cobrança de upgrade. Não modela pricing agora — só reserva a decisão arquitetural: a API lê das mesmas tabelas RLS já publicadas, nenhuma tabela nova.

## 13. Servidor MCP próprio, curado e com nota de segurança — Fase 2 (alta prioridade estratégica)

**Problema/oportunidade:** os registros de MCP existentes (Smithery, Glama, PulseMCP) competem por volume — Glama sozinho lista 22.775 servidores — sem curadoria de segurança real: 36,7% dos servidores públicos têm vulnerabilidade SSRF, 41% não têm autenticação nenhuma. Nenhum concorrente filtra por isso.

**Solução:** dois produtos em um:
1. **Curadoria por segurança na categoria MCP já existente:** usar `tags` reservadas (`security-verified`, `oauth-required`, `no-known-cve`) como critério adicional de publicação para itens dessa categoria — sem tabela nova, reaproveitando o padrão já definido.
2. **Servidor MCP próprio do Fathom Layer**, expondo os dados curados (produtos/software/comparativos) como ferramentas MCP — é canal de distribuição (aparece direto no Claude/ChatGPT/Cursor de quem usa), prova de conceito do próprio critério de segurança que você defende, e ativo de licenciamento futuro ao mesmo tempo.

## 14. UGC controlado — reviews/notas de usuário — Fase 2 (revisão de decisão anterior)

**Contexto da mudança:** este item tinha sido descartado no planejamento original por risco de moderação. Pesquisa de mercado mostra que conteúdo gerado por usuário (padrão Reddit) é a fonte mais citada por IA generativa em praticamente todos os motores — descartar UGC por completo abre mão do tipo de conteúdo com maior taxa de citação comprovada.

**Solução de baixo risco:** amarrar reviews à mesma conta leve do "My Stack" (item #10, magic link via Supabase Auth) em vez de campo de texto livre público anônimo — reduz spam sem precisar de fila de moderação humana constante. Nota numérica + comentário curto, nunca texto longo livre. Fica com o mesmo gate de Fase 2 do "My Stack", não bloqueia MVP.

---

## 15. `category_facets` — suporte ao Recomendador Universal — Fase 2

**Problema:** `tags`/`ideal_for` são texto livre — funcionam bem para exibição, mas não dão pra montar um formulário de perguntas dinâmico e confiável em qualquer categoria sem curadoria manual por vertical.

**Solução:** tabela pequena, opcional, só para categorias que já tiverem o Recomendador ativado (começando pelo cluster "Hardware para IA Local"):

```sql
create table category_facets (
    id              uuid primary key default gen_random_uuid(),
    category_id     uuid not null references categories(id) on delete cascade,
    facet_key       text not null,       -- ex: 'vram_gb', 'use_case'
    facet_label     text not null,       -- ex: 'Quanta VRAM você precisa?'
    facet_type      text not null check (facet_type in ('range', 'single_select', 'multi_select')),
    facet_options   jsonb,               -- opções para select, ou {min, max, step} para range
    display_order   integer not null default 0
);

create index idx_category_facets_category on category_facets (category_id, display_order);
```

Não bloqueia MVP — o Recomendador só precisa disso quando sair do cluster inicial curado à mão.

## 16. Estratégia de Rede de Afiliados e Logística Fiscal Internacional — MVP

**Problema:** nem toda rede de afiliado é acessível ou segura pra site novo — algumas cancelam conta por baixa performance, outras têm regra de desativação que pune justamente a fase inicial.

**Solução — hierarquia de redes por risco:**
- **Amazon Associates:** usar com cautela, nunca como rede principal — regra de 3 vendas em 180 dias cancela a conta se não bater a meta, comissão baixa (1-3%) mesmo quando ativa. Serve como cobertura genérica, não como motor de receita.
- **PartnerStack:** motor principal pra categoria SaaS de IA (pilar `intelligence`) — comissão recorrente alta, cookie de 90 dias, aprovação mais tranquila para propriedade com visual profissional.
- **Impact (B&H Photo, outros retalhistas especializados de hardware):** motor principal pra categoria Hardware de IA Local (pilar `compute`) — comissão superior à Amazon, aprovação moderada (exige site com aparência profissional e conteúdo robusto — reforça a importância do design system nível Awwwards mesmo na Camada 1).
- **ShareASale / Awin:** rede de entrada mais acessível para domínio novo em geral — útil como 2ª onda ao expandir pra Automação Doméstica/Smart Home (ver nota de expansão abaixo).
- **CJ Affiliate: evitar na fase inicial** — cancela contas sem receita constante em ~6 meses, incompatível com o horizonte de paciência do operador.

O campo `links.program_name` já existente no schema comporta isso sem mudança estrutural — só precisa registrar qual rede cada link pertence, pra facilitar auditoria/diversificação depois.

**Logística fiscal (operador no Brasil recebendo comissão de redes americanas/europeias):**
- **W-8BEN:** formulário obrigatório de conformidade fiscal americana pra pessoa física estrangeira — evita retenção penalizada na fonte. Preencher antes de ativar qualquer rede dos EUA.
- **Recebimento internacional:** Wise ou Payoneer (rede preferencial da Awin) para receber em IBAN europeu (SEPA) ou ACH americano sem fricção cambial.
- **Tributação no Brasil:** como pessoa física, receita internacional recorrente entra no Carnê-Leão mensal, com alíquota progressiva penalizando valores altos em moeda forte. Considerar pessoa jurídica (regime de exportação de serviços, Simples Nacional) assim que o volume justificar — não é decisão do MVP, mas vale já saber que existe esse caminho pra quando a receita crescer.

**Nota de expansão (não é MVP, fica registrado pra Camada 2):** Automação Doméstica/Smart Home (Matter, câmeras) surgiu na pesquisa como o candidato mais fácil de monetizar de todos (ShareASale/Awin, aprovação rápida, baixo risco de concentração) — bom candidato a 2º cluster.

---

---

## Resumo de priorização para o Claude Code

**Bloqueante para MVP (implementar junto com o schema base):** #1 staging de ingestão, #2 fila de revisão (`pending_review`), #4 rastreamento de cliques (`/out/{link_id}`), #5 `launch_phase` nas categorias, #7 página de metodologia, #8 disclosure legal, `editorial_pages` (glossário/guias/radar de lançamentos), `price_from` para o recomendador por orçamento, exibição do selo de verificação (`last_verified_at`), #11 segurança operacional de pSEO (gate de dados mínimo + ritmo de publicação amarrado à indexação), #16 estratégia de rede de afiliados (PartnerStack/Impact como motor principal, Amazon como cobertura secundária, W-8BEN antes de ativar redes americanas).

**Fase 2 (depois de tração no cluster inicial):** #3 monitoramento de link rot, #6 newsletter/licenciamento de dados, #9 otimização de custo de IA por camada de modelo, #10 "My Stack" (contas de usuário público), #12 API freemium, #13 servidor MCP próprio curado por segurança, #14 UGC controlado (reviews via conta leve), #15 `category_facets` (Recomendador Universal).
