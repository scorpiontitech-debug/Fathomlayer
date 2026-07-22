import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { getEditorialPages, getIndexableCategories, getPublishedSetups } from "@/lib/queries";
import { organizationLd, websiteLd } from "@/lib/seo";
import { PILLARS, PILLAR_KEYS } from "@/lib/taxonomy";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const PRINCIPLES = [
  {
    n: "01",
    title: "No paid placement",
    text: "Ranking positions, scores and badges are not for sale. Sponsored content, when it exists, is labeled and kept apart from the index.",
  },
  {
    n: "02",
    title: "Human review on every item",
    text: "Nothing is published without an editor's design score and a written note. The pipeline drafts; a person decides.",
  },
  {
    n: "03",
    title: "Numbers before adjectives",
    text: "Specifications come from primary sources and are stated as data — “18.4 h of battery”, never “great battery life”.",
  },
];

// Faixa tipográfica: o vocabulário do índice em movimento contínuo.
const MARQUEE = [
  "local AI hardware",
  "agent frameworks",
  "MCP servers",
  "premium laptops",
  "on-device AI",
  "EV charging",
  "AR glasses",
  "smart home",
  "wearables",
  "audio",
];

export default async function HomePage() {
  const [categories, glossary, guides, launches, setups] = await Promise.all([
    getIndexableCategories(),
    getEditorialPages("glossary"),
    getEditorialPages("guide"),
    getEditorialPages("launch"),
    getPublishedSetups(),
  ]);
  const indexedItems = categories.reduce((n, c) => n + c.active_listing_count, 0);
  const referenceEntries = glossary.length + guides.length + launches.length;

  return (
    <div className="space-y-28">
      {/* JSON-LD: Organization só na home (checklist GEO §8) */}
      <JsonLd data={organizationLd()} />
      <JsonLd data={websiteLd()} />

      {/* HERO — palco da peça 3D. A headline recua em Z conforme o scroll
          (tipografia cinética, 1 por página — design system §4). */}
      <section className="relative isolate -mx-5 flex min-h-[86vh] flex-col justify-center overflow-hidden px-5 pb-20 pt-16">
        <div className="layer-field" aria-hidden />
        <HeroCanvas />

        {/* z-10 explícito: sem ele o canvas pintava por cima da headline e o
            texto ficava ilegível atrás das partículas. Ordem no HTML não
            bastou — a camada precisa ser declarada. */}
        <div className="rise-group kinetic-scroll relative z-10 max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-dim">
            Independent technology index
          </p>
          <h1 className="mt-6 font-display text-[3.4rem] font-semibold leading-[0.94] tracking-[-0.03em] sm:text-[5.5rem] lg:text-[6.75rem]">
            The technology index
            <br />
            built on{" "}
            <span className="text-outline">verified</span>{" "}
            <span className="text-accent-bright">numbers.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-dim">
            Hardware, software and AI — human-reviewed, design-scored, documented with data
            from primary sources. Never a paid ranking.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/compute"
              data-magnetic
              className="magnetic group inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 font-medium text-white hover:bg-accent-bright hover:shadow-[0_0_38px_rgba(0,82,255,0.45)] active:scale-[0.98]"
            >
              Browse the index
              <span
                aria-hidden
                className="transition-transform duration-200 ease-flow group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              href="/methodology"
              className="nav-link text-sm text-dim transition-colors hover:text-ink"
            >
              How scoring works
            </Link>
          </div>
        </div>

        {/* Régua de dados: números reais do banco, no rodapé do hero */}
        <dl className="relative z-10 mt-16 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-edge bg-edge">
          {[
            // "Items indexed: 0" anunciava o vazio antes de o site se
            // apresentar. Enquanto não houver acervo, a régua mostra o que
            // de fato existe — nada aqui é número inventado.
            indexedItems > 0
              ? { k: "Items indexed", v: indexedItems.toString() }
              : { k: "Reference entries", v: referenceEntries.toString() },
            indexedItems > 0
              ? { k: "Reference entries", v: referenceEntries.toString() }
              : { k: "Primary-source specs", v: "100%" },
            { k: "Paid placements", v: "0" },
          ].map((stat) => (
            <div key={stat.k} className="bg-bg/80 px-5 py-4 backdrop-blur-sm">
              <dd className="font-mono text-2xl tabular-nums text-ink">{stat.v}</dd>
              <dt className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-faint">
                {stat.k}
              </dt>
            </div>
          ))}
        </dl>
      </section>

      {/* MARQUEE — vocabulário do índice em movimento contínuo */}
      <section aria-hidden className="marquee -mx-5 border-y border-edge py-5">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {MARQUEE.map((word) => (
                <span key={word} className="flex items-center">
                  <span className="px-6 font-display text-lg font-medium text-faint">
                    {word}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-accent/50" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* PRINCÍPIOS — a arma competitiva é a confiança (roadmap #7) */}
      <section
        aria-label="Principles"
        className="reveal grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-3"
      >
        {PRINCIPLES.map((p) => (
          <div key={p.n} data-spot className="spot-card relative bg-bg p-7">
            <span className="ghost-numeral">{p.n}</span>
            <span className="relative font-mono text-xs text-accent-bright">{p.n}</span>
            <h2 className="relative mt-4 font-display text-lg font-semibold">{p.title}</h2>
            <p className="relative mt-2.5 text-sm leading-relaxed text-dim">{p.text}</p>
          </div>
        ))}
      </section>

      {/* BENTO ATIVA — pilares com dados reais */}
      <section aria-label="The index" className="reveal space-y-5">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            The index
          </h2>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Three pillars
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {PILLAR_KEYS.map((key, i) => {
            const pillar = PILLARS[key];
            const pillarCategories = categories.filter((c) => c.pillar === key);
            const itemCount = pillarCategories.reduce((n, c) => n + c.active_listing_count, 0);
            return (
              <Link
                key={key}
                href={`/${pillar.slug}`}
                data-spot
                data-tilt
                className="spot-card glow-hover tilt group relative flex min-h-[250px] flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-edge-strong lg:col-span-2"
              >
                <span className="ghost-numeral">0{i + 1}</span>
                <div className="relative">
                  <span className="font-mono text-xs text-faint">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight">
                    {pillar.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-dim">{pillar.tagline}</p>
                </div>

                <div className="relative mt-8">
                  {pillarCategories.length > 0 ? (
                    <ul className="space-y-1.5 text-sm">
                      {pillarCategories.slice(0, 3).map((c) => (
                        <li key={c.id} className="flex items-baseline justify-between gap-3">
                          <span className="text-dim">{c.name}</span>
                          <span className="font-mono text-xs tabular-nums text-faint">
                            {c.active_listing_count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="relative mt-3 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
                    <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                      {pillarCategories.length > 0
                        ? `${itemCount} item${itemCount === 1 ? "" : "s"} indexed`
                        : "In curation"}
                    </span>
                    <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                      Enter →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Setups quando houver; até lá, os guias — que já têm páginas
              publicadas e não apareciam no bento. Card nenhum deve levar a
              uma seção vazia. */}
          <Link
            href={setups.length > 0 ? "/setups" : "/guides"}
            data-spot
            data-tilt
            className="spot-card glow-hover tilt group relative flex min-h-[180px] flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-edge-strong lg:col-span-2"
          >
            <span className="ghost-numeral">04</span>
            <div className="relative">
              <span className="font-mono text-xs text-faint">04</span>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                {setups.length > 0 ? "Setups" : "Buying guides"}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-dim">
                {setups.length > 0
                  ? "Hand-curated combinations that work together, with the reasoning behind each pick."
                  : "Decision frameworks for the questions a spec sheet does not answer — how much hardware you actually need, and when to buy."}
              </p>
            </div>
            <div className="relative mt-6 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
              <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                {setups.length > 0 ? "Editorial guides" : `${guides.length} guides`}
              </span>
              <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                Enter →
              </span>
            </div>
          </Link>

          {/* Calculadora — ferramenta flagship */}
          <Link
            href="/calculator"
            data-spot
            data-tilt
            className="spot-card glow-hover tilt group relative flex min-h-[180px] flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-accent lg:col-span-2"
          >
            <span className="ghost-numeral">05</span>
            <div className="relative">
              <span className="font-mono text-xs text-accent-bright">05</span>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                Local AI Calculator
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-dim">
                Pick a model, see the memory tier it needs — and the hardware that runs it.
              </p>
            </div>
            <div className="relative mt-6 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
              <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                Interactive tool
              </span>
              <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                Try it →
              </span>
            </div>
          </Link>

          {/* Glossário — camada de autoridade, conteúdo já publicado */}
          <Link
            href="/glossary"
            data-spot
            data-tilt
            className="spot-card glow-hover tilt group relative flex min-h-[180px] flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-edge-strong lg:col-span-3"
          >
            <span className="ghost-numeral">06</span>
            <div className="relative">
              <span className="font-mono text-xs text-faint">06</span>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                Glossary
              </h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-dim">
                What the terms actually mean — VRAM, quantization, MCP, on-device AI — written
                to be precise, not promotional.
              </p>
            </div>
            <div className="relative mt-6 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
              <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                {glossary.length} definition{glossary.length === 1 ? "" : "s"}
              </span>
              <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                Read →
              </span>
            </div>
          </Link>

          {/* Metodologia */}
          <Link
            href="/methodology"
            data-spot
            data-tilt
            className="spot-card glow-hover tilt group relative flex min-h-[180px] flex-col justify-between rounded-lg border border-edge bg-surface p-6 hover:border-edge-strong lg:col-span-3"
          >
            <span className="ghost-numeral">07</span>
            <div className="relative">
              <span className="font-mono text-xs text-faint">07</span>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">
                Methodology
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-dim">
                How the design score is assigned, and why no one can buy a position here.
              </p>
            </div>
            <div className="relative mt-6 h-5 overflow-hidden font-mono text-xs uppercase tracking-[0.14em]">
              <span className="absolute inset-x-0 text-faint transition-transform duration-300 ease-flow group-hover:-translate-y-5">
                Public criteria
              </span>
              <span className="absolute inset-x-0 translate-y-5 text-accent-bright transition-transform duration-300 ease-flow group-hover:translate-y-0">
                Read →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* MANIFESTO — os gates como afirmação tipográfica */}
      <section className="reveal relative -mx-5 overflow-hidden border-y border-edge px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-faint">
            The gate every item passes
          </p>
          <p className="mt-6 font-display text-3xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
            <span className="text-accent-bright">3</span> published items before a category is
            indexed. <span className="text-accent-bright">5</span> structured data points
            before an item is published.{" "}
            <span className="text-dim">Everything else waits.</span>
          </p>
        </div>
      </section>
    </div>
  );
}
