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
