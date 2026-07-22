// Central map between database pillars (categories.pillar) and URL/presentation.
// The single place to change if pillar URL slugs ever need to move before launch.

export const PILLARS = {
  intelligence: {
    slug: "intelligence",
    name: "Intelligence",
    tagline: "AI software, apps, games and frameworks",
  },
  compute: {
    slug: "compute",
    name: "Compute",
    tagline: "Hardware for processing and productivity",
  },
  ecosystem_mobility: {
    slug: "ecosystem",
    name: "Ecosystem & Mobility",
    tagline: "Consumer electronics, gadgets and electric vehicles",
  },
} as const;

export type PillarKey = keyof typeof PILLARS;

// Tags editoriais que pertencem a cada pilar. Serve para a página de pilar
// mostrar glossário e guias relevantes mesmo antes de existir categoria
// indexável — sem isso, um pilar sem produto publicado é beco sem saída.
// As páginas editoriais nascem sem `category_id`; a tag é o único vínculo.
export const PILLAR_TAGS: Record<PillarKey, string[]> = {
  // "ai" de propósito fora: é tag genérica demais e arrastava conceitos de
  // hardware (NPU) para cá, deixando Intelligence e Compute quase idênticos.
  intelligence: ["llm", "mcp", "local-ai", "privacy", "security", "fundamentals"],
  compute: ["hardware", "laptops", "memory", "npu", "local-ai", "benchmarks", "optimization"],
  ecosystem_mobility: ["smart-home", "matter", "standards", "wearables", "audio", "ev"],
};

// Um item pertence ao pilar se compartilhar qualquer tag. A sobreposição é
// intencional: "local-ai" é legítimo em Intelligence e em Compute.
export function matchesPillar(tags: string[], key: PillarKey): boolean {
  const set = new Set(PILLAR_TAGS[key]);
  return tags.some((t) => set.has(t));
}

export const PILLAR_KEYS = Object.keys(PILLARS) as PillarKey[];

export function pillarBySlug(slug: string) {
  for (const key of PILLAR_KEYS) {
    if (PILLARS[key].slug === slug) return { key, ...PILLARS[key] };
  }
  return null;
}

export function pillarByKey(key: string) {
  if (key in PILLARS) return { key: key as PillarKey, ...PILLARS[key as PillarKey] };
  return null;
}
