# Fathom Layer — Deep Research Brief

> Prompt para pesquisa profunda (Gemini Deep Research, ou equivalente).
> Escrito em inglês de propósito: a plataforma é internacional e o conteúdo
> sintetizado nasce em inglês. Reutilizável a cada ciclo de curadoria —
> ajuste a seção `CURRENT STATE` antes de rodar.
>
> Criado em 2026-07-22.

---

## Como usar

1. Atualize **CURRENT STATE** com o que já está publicado.
2. Cole tudo abaixo da linha em Deep Research.
3. O bloco JSON da saída mapeia direto no schema do Supabase — os campos
   têm exatamente os nomes das colunas de `products` / `software`.
4. **Nada do que voltar é publicável direto.** Continua exigindo
   `design_score` e nota editorial suas (Unique Data Gate), e conferência
   das specs na fonte primária.

---

# ROLE

You are a senior market and SEO research analyst producing an acquisition
brief for an independent technology index. Your output will be used to
decide which products a small editorial operation should catalogue first.
Precision matters more than volume of text. Every numeric claim must carry
a source URL. Where you cannot verify something, say so explicitly rather
than estimating.

# THE BUSINESS

**Fathom Layer** (fathomlayer.com) is an independent, English-language
technology index. It is not a store and not a blog. It catalogues hardware,
software and AI tools with verified specifications, an in-house 0–10 design
score and a written editorial note. Revenue comes from affiliate
commissions. Ranking positions are never for sale.

It is operated by one person, part-time (15–30 h/week). It has no brand
authority yet: the domain is new, and it is launching from zero.

**Three pillars and their categories:**

- **Compute** — local AI workstations, premium laptops, 3D printing,
  setup peripherals
- **Intelligence** — AI software, agent frameworks, MCP servers, games, apps
- **Ecosystem & Mobility** — smartphones, premium audio, electric vehicles,
  EV charging, AR glasses, wearables, smart home

**Hard mechanic that drives everything:** a category becomes publicly
visible only after **3 items** are fully published. Below three, the entire
category stays invisible. So items must be selected in **clusters of at
least 3 within one category**, never scattered one per category.

# CURRENT STATE

- Published items: **0**
- Categories visible: **0 of 16**
- Editorial reference pages already live: **13** (9 glossary entries, 4
  buying guides), all concentrated on local AI, memory, NPUs, MCP and
  purchase timing
- Items awaiting review, all in *local AI workstations*: Mac Mini M4 Pro
  (64 GB), GMKtec EVO-X2 (128 GB), Minisforum MS-01
- Launch target: **15–20 published items**
- Publishing capacity: **10–25 new pages per week**, hard-capped at +25%
  growth per week

# WHAT I NEED FROM YOU

## Part 1 — Which categories to attack first

Recommend **2 or 3 categories** (from the 16 above) for the launch cluster.
Do not cover all sixteen. For each recommended category, justify with:

- Estimated monthly search demand, given **both** as the head-term volume
  and as the long-tail question-space volume, with the tool or dataset each
  figure comes from
- Competitive density: who currently ranks, how entrenched, and whether the
  top results are genuinely thorough or thin affiliate content
- Affiliate monetisation depth: do real programs exist, at what commission
  rate, and through which network
- Whether the 13 existing reference pages already support that category
  (this lowers the cost of entry substantially)

Explicitly name categories you recommend **against** entering first, and why.

## Part 2 — The product shortlist

For each recommended category, propose **5–8 candidate products**, ranked.
Rank them by a composite of the four factors below — and **show the score
for each factor**, not just the final ordering:

1. **Search demand** — monthly volume for the product name and for the
   question-shaped queries it answers
2. **Winnability** — can a zero-authority domain realistically rank for the
   long-tail queries around this product within 6 months? A product with
   500 searches/month and weak incumbent coverage is worth more here than
   one with 50,000 and Wirecutter in position one.
3. **Affiliate availability** — is there an actual program, with what
   commission, on which network. A product nobody will pay a commission on
   is a cost centre.
4. **Unique-data potential** — is there a real, defensible editorial angle,
   or would any page about it be a restatement of the manufacturer spec
   sheet? State the specific angle.

**Preferred networks, in order:** PartnerStack (software/SaaS), Impact
(specialist hardware retail), Amazon Associates (general coverage only).
Flag anything that is **CJ Affiliate exclusive** — that network is being
avoided in the early phase.

### Present the shortlist twice

Give me **two separate tables**, over the same candidate set:

**Table A — ranked by raw search demand.** Highest monthly volume first,
composite score ignored. Include the volume figure, the tool it came from,
and the current top-ranking site for that term. This table answers "what
is most searched", plainly, with nothing filtered out.

**Table B — ranked by the four-factor composite.** The acquisition order I
would actually publish in.

Then, in no more than 150 words, explain where the two tables disagree and
why. If a high-volume product is ranked low in Table B, say exactly what
would have to be true for it to be worth pursuing anyway — for example an
affiliate commission large enough to justify competing, or an incumbent
weak enough to displace. I want to see the trade-off, not have it decided
for me.

Do not omit a high-volume product from Table A because you judge it
unwinnable. Rank it low in Table B and explain why there.

## Part 3 — The query map

For each recommended category, list **15–25 long-tail queries** with
purchase or research intent that the incumbents answer badly or not at all.
Favour question-shaped queries and comparisons. For each: estimated volume,
and one line on why the current top result is weak.

These become buying guides and glossary entries — they are the traffic
entry point. Product pages are the destination, not the doorway.

## Part 4 — Competitive gap

Name the 3–5 sites currently owning these categories. For each: what they
cover well, and **specifically what they do not cover**. Pay particular
attention to pages that are stale — outdated prices, discontinued products
still presented as current, specifications that no longer match the
manufacturer. Staleness in an incumbent is the fastest opening for a new
site, because it can be beaten immediately rather than out-waited.

## Part 5 — Risks

What would make this plan fail? Be specific and unsentimental. Include at
minimum: category seasonality, product refresh cycles that would make pages
stale within months, affiliate programs with poor cookie windows or
approval requirements a new site would fail, and any regulatory or
disclosure requirement that applies to affiliate content in the US, EU
or UK.

# OUTPUT FORMAT

Deliver in this order:

1. **Executive summary** — under 200 words. Which categories, which
   products, expected time to first ranking, biggest risk.
2. **Part 1** — category recommendation with the scoring table
3. **Part 2** — Table A (raw search demand), Table B (four-factor
   composite), and the reconciliation between them
4. **Part 3** — query map, grouped by category
5. **Part 4** — competitive gap
6. **Part 5** — risks
7. **Structured data block** — see below

## Structured data block

For every shortlisted product, emit one JSON object in this exact shape.
Field names match the destination database, so do not rename them.

```json
{
  "title": "Manufacturer model name, exactly as the manufacturer writes it",
  "brand": "Manufacturer",
  "slug": "lowercase-hyphenated",
  "category": "one of the 16 category slugs listed above",
  "description": "One paragraph, max 60 words, factual, no marketing adjectives",
  "specs": {
    "spec_key": "value with unit"
  },
  "price_from": 0,
  "price_currency": "USD",
  "release_year": 2026,
  "tags": ["lowercase-hyphenated"],
  "pros": ["Specific, falsifiable, tied to a number where possible"],
  "cons": ["Real limitation, not a disguised compliment"],
  "ideal_for": ["Concrete user situation, not a demographic"],
  "sources": {
    "manufacturer_spec_url": "https://…",
    "price_checked_url": "https://…",
    "affiliate_program": "PartnerStack | Impact | Amazon | none",
    "commission_rate": "e.g. 4% or $30 flat, or unknown"
  },
  "unique_angle": "The one thing this page can say that the spec sheet cannot",
  "confidence": "high | medium | low — for the specs block specifically"
}
```

**`specs` must contain at least 5 keys.** Items with fewer than five
structured data points are rejected by the publishing gate, so a product
you cannot describe with five verified specifications is not usable.

# RULES

**Sources.** Every specification must come from a primary source — the
manufacturer's own page or official technical documentation. Retailer
listings and review-site summaries are acceptable for **price only**, never
for specifications. Give the URL for each. If a figure appears only in
secondary coverage, mark that spec `"confidence": "low"` and say where it
came from.

**Recency.** Prefer products current as of today. Flag anything announced
but not shipping, and anything with a known successor imminent. A product
about to be replaced is a page that will be stale on arrival.

**No estimated numbers presented as fact.** If you cannot find a verified
figure, write `unknown` rather than approximating. An unknown is usable; a
wrong number destroys the credibility the whole index is built on.

**Language.** All output in English, including product descriptions,
pros/cons and angles. This is the platform's publishing language.

**Tone for any prose that may be reused.** Plain, technical, specific.
State numbers before adjectives — "18.4 h battery", never "great battery
life". The following words are rejected automatically by the publishing
system and must not appear anywhere in your output: *revolutionary,
groundbreaking, game-changer, game-changing, incredible, amazing,
unbelievable, must-have, top-of-the-line, best-in-class, world-class,
cutting-edge, guaranteed results, next-level, unmatched, unparalleled*.

**Do not optimise for my apparent preference.** If the correct answer is
that the categories currently being pursued are the wrong ones, say so
directly and name the better alternative. A shortlist I like and that fails
is worth less than one I dislike and that works.
