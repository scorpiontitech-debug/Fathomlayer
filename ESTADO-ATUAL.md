# Fathom Layer — Estado do Projeto

> **Handoff de sessão.** Atualizado em **2026-07-21**.
> Leia isto primeiro, depois `fathom-layer-readme.md` e os documentos em `docs/`.

---

## 1. Onde paramos, em uma frase

**Todo o código da Camada 1 está pronto e verificado.** O que trava o lançamento não é
código — é configuração de ambiente (2 itens, ~10 min) e curadoria de conteúdo.

---

## 2. Bloqueios — só o operador pode resolver

Em ordem de dependência. O item 1 trava os demais.

### 2.1 `SUPABASE_SECRET_KEY` (bloqueia tudo)
Dashboard do Supabase → projeto **Fathom Layer** (`etpqfcbwyosplyaiqxhm`) →
Project Settings → API Keys → copiar a chave `sb_secret_...` para `SUPABASE_SECRET_KEY`
em `.env.local`.

Sem ela: `/admin/review` e `/admin/editorial` mostram aviso de configuração em vez do
conteúdo, e `/out/{link_id}` redireciona mas **não grava cliques**.

### 2.2 Usuário admin
Supabase → Authentication → Users → **Add user** (e-mail + senha). Em Auth → Settings,
**desativar signups públicos**. Opcional: repetir o e-mail em `ADMIN_EMAIL` no `.env.local`
(cinto extra — o middleware já protege).

### 2.3 Conteúdo (o trabalho real, recorrente)
- Revisar os **6 produtos** em `pending_review` no `/admin/review`
- Cada um exige: `design_score`, nota editorial **e** prós/contras/ideal-for —
  o gate #11 recusa publicação com menos de **5 campos estruturados combinados**
  (specs + pros + cons + ideal_for)
- **As specs vieram da pesquisa de mercado, não são verificadas.** Confirmar no site do
  fabricante antes de publicar — é exatamente para isso que o `pending_review` existe
- Meta da Camada 1: **15–20 itens** antes do lançamento
- Ritmo (roadmap #11): 10–25 páginas novas/semana; +25%/semana no máximo;
  cortar pela metade se a indexação cair de 50%; parar abaixo de 30%

### 2.4 Antes de monetizar (roadmap #16)
- **W-8BEN antes de ativar qualquer rede americana** (evita retenção penalizada)
- PartnerStack (SaaS) e Impact (hardware) como motores; Amazon só como cobertura;
  **evitar CJ Affiliate** na fase inicial
- Wise ou Payoneer para receber; Carnê-Leão mensal enquanto pessoa física

### 2.5 Publicação
Domínio `fathomlayer.com` + projeto Vercel (plano Hobby por decisão consciente, com
upgrade para Pro **imediato** ao primeiro aviso de limite). Deploy ainda não feito.

---

## 3. Estado do banco (verificado nesta data)

Projeto Supabase: **`etpqfcbwyosplyaiqxhm`** · `https://etpqfcbwyosplyaiqxhm.supabase.co`

| Tabela | Estado |
|---|---|
| `categories` | **16**, todas `launch_phase = 1`, **0 indexáveis** (nenhuma tem 3 itens publicados) |
| `products` | **6** em `pending_review`, 0 publicados |
| `software` | 0 |
| `editorial_pages` | **13 publicadas** — 9 glossário + 4 guias, 0 radar |
| `links` / `link_clicks` | 0 / 0 |
| `setups` | 0 |
| `ingestion_staging` | 6 (todos `approved`, já promovidos) |

### As 16 categorias
- **compute (4):** `local-ai-workstations` (nome: Local AI Hardware), `premium-laptops`, `3d-printing`, `setup-peripherals`
- **intelligence (5):** `ai-software`, `agent-frameworks`, `mcp-servers`, `games`, `apps`
- **ecosystem_mobility (7):** `smartphones`, `premium-audio`, `electric-vehicles`, `ev-charging`, `ar-glasses`, `wearables`, `smart-home`

> **Por que o site parece vazio:** a RLS só expõe categoria com `is_indexable = true`, que
> exige `launch_phase = 1 AND active_listing_count >= 3`. É o Quality Gate funcionando —
> **não é bug**. As categorias aparecem sozinhas quando cada uma tiver 3 itens publicados.

### Migrations aplicadas (espelhadas em `supabase/migrations/`)
1. `0001_base_schema.sql` — 6 tabelas, triggers, RLS
2. `0002_mvp_gaps.sql` — staging, `pending_review`, `link_clicks`, `launch_phase`
3. `0003_security_hardening.sql` — `search_path` nas funções, `pg_trgm` → schema `extensions`
4. `0004_camada1_deltas.sql` — `pros`/`cons`/`ideal_for`, `price_from`, `release_year`, `content_language`, `last_verified_at`, tabela `editorial_pages`

Advisors de segurança: **limpos** (os 2 avisos restantes são intencionais — `ingestion_staging`
e `link_clicks` são internas, sem policy pública por design).

---

## 4. O que está construído (Camada 1 completa)

### Rotas públicas
| Rota | Tipo |
|---|---|
| `/` | ISR 1h — hero 3D, bento, manifesto |
| `/[pilar]` · `/[pilar]/[categoria]` | ISR 1h |
| `/[pilar]/[categoria]/[slug]` | ISR 24h — produto/software |
| `/calculator` | Calculadora de Hardware + visualização 3D |
| `/glossary` · `/guides` · `/radar` (+ `[slug]`) | editorial |
| `/setups` (+ `[slug]`) | curadoria manual |
| `/out/{link_id}` | 302 + grava clique, `noindex` |
| `/methodology` `/about` `/privacy` `/affiliate-disclosure` | confiança + legal |
| `/sitemap/{core,categories,products,software,editorial}.xml` · `/robots.txt` · `/llms.txt` | SEO |
| `opengraph-image` (raiz e por item) | cartão de spec via `next/og` |

### Admin (protegido por middleware + Supabase Auth)
- `/admin/review` — fila com gate #11, atalhos **A** aprova / **R** rejeita / **j-k** navega, publicação em lote
- `/admin/editorial` — CRUD de glossário/guias/radar (radar exige URL de fonte)

### Regras de negócio no servidor (nunca no cliente)
- **Unique Data Gate**: sem `design_score` + nota editorial não publica
- **Gate #11**: mínimo de 5 campos estruturados combinados
- **Banned-Phrase Blocklist**: `lib/banned-phrases.ts`, aplicada na publicação e na síntese
- **Aterramento numérico**: o pipeline rejeita texto da IA com número ausente do `raw_payload`

### Design (nível Awwwards)
Dark mode estrito, acento único `#0052FF`, Space Grotesk / Instrument Sans / JetBrains Mono.
Peça 3D em **Three.js puro** (~8 draw calls, física com springs, dolly de câmera em Z),
cursor autoral, tilt 3D, botões magnéticos, spotlight, marquee, grain, View Transitions,
reveals scroll-driven em CSS nativo.

> **Decisão importante sobre movimento:** o site **não** usa `prefers-reduced-motion` do SO
> como interruptor geral (muita gente tem efeitos desligados no Windows e via o site estático).
> O controle é o toggle **Motion on/off** no canto inferior, persistido em `localStorage`
> (classe `.motion-off` no `<html>`). Decisão explícita do operador.

---

## 5. Armadilhas conhecidas (não perder tempo de novo)

1. **Cache de ISR entre builds** — inserir dado direto no banco não atualiza a página já
   gerada. Em produção resolve pelo `revalidate` ou pelo `revalidatePath` das server actions.
   Em dev, apagar `.next` e rebuildar.
2. **Cache HTTP em verificação** — usar `fetch(url, { cache: "no-store" })` ao verificar
   conteúdo novo, senão parece que o dado não chegou (já causou um falso "bug").
3. **PowerShell 5.1 corrompe acentos** — `Get-Content`/`Set-Content` sem encoding explícito
   faz double-encoding e injeta BOM (quebrou o `package.json`). Usar
   `[System.IO.File]::ReadAllText(path, [System.Text.Encoding]::UTF8)` e
   `WriteAllText(..., new UTF8Encoding($false))`.
4. **`.next` misturando Turbopack (dev) e Webpack (build)** → `MODULE_NOT_FOUND` em série
   e 500 em rotas de imagem. Limpar `.next`.
5. **`dynamicParams = false` + ISR** quebra o prefetch RSC (`NoFallbackError`). Já corrigido —
   não reintroduzir.
6. **Conector MCP do Supabase é org-scoped** — aponta para a conta do Fathom Layer.
   Trabalhar no banco da Infinity exige reautorizar (inversão rara).

---

## 6. Próximos passos sugeridos

**Assim que 2.1 e 2.2 estiverem feitos:**
1. Revisar e publicar os 6 produtos → a primeira categoria fica visível com 3 deles
2. Cadastrar `links` de afiliado (a coluna `program_name` registra a rede — roadmap #16)
3. Completar o cluster até 15–20 itens
4. Deploy na Vercel

**Conteúdo que posso continuar produzindo (não depende de você):**
- Mais glossário/guias em outras categorias (cauda longa, seção 9 do content-spec)
- **Radar de lançamentos:** precisa de fontes atuais e verificáveis — indique as fontes,
  porque rumor sem procedência é proibido pelo próprio content-spec

**Camada 2** (ordem definida no roadmap, dentro da janela de lançamento):
2 agentes internos (Triagem de Quality Gate + Vigia de Indexação) → painel cresce junto →
*(peça 3D já feita, adiantada)* → servidor MCP próprio → API freemium → contas de usuário.

---

## 7. Comandos

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção
npm run start        # servir o build
npm run synthesize   # pipeline de ingestão (staging -> pending_review)
node scripts/logo-assets.js   # regenera assets do logo a partir do PNG oficial
```

Se o build travar (aconteceu uma vez, transitório): matar os processos `node`,
apagar `.next`, rebuildar.
