// Apresentação de specs: rótulos humanos e formatação de valores.
// Dados continuam crus no banco; isto é só camada de exibição.

const LABELS: Record<string, string> = {
  vram_gb: "VRAM",
  vram_gb_total: "Total VRAM",
  ram_gb: "RAM",
  unified_memory_gb: "Unified memory",
  tokens_per_second: "Throughput",
  example_models: "Runs",
  chip: "Chip",
  cpu: "CPU",
  gpu: "GPU",
  tier: "Tier",
  form_factor: "Form factor",
  expandable: "Expandable",
  switches: "Switches",
  profile: "Profile",
  type: "Type",
  battery_hours: "Battery",
};

// Ordem de prioridade para o destaque do card (design system seção 7:
// 1 spec visível, a 2ª aparece no hover).
const CARD_PRIORITY = [
  "unified_memory_gb",
  "vram_gb",
  "vram_gb_total",
  "ram_gb",
  "tokens_per_second",
  "chip",
  "gpu",
  "switches",
  "battery_hours",
  "form_factor",
  "type",
];

export function specLabel(key: string): string {
  return LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function specValue(key: string, value: unknown): string {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (key.endsWith("_gb")) return `${value} GB`;
  if (key === "tokens_per_second") return `${value} tok/s`;
  if (key === "battery_hours") return `${value} h`;
  return String(value);
}

export type SpecEntry = { key: string; label: string; value: string };

export function specEntries(specs: unknown): SpecEntry[] {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return [];
  return Object.entries(specs as Record<string, unknown>)
    .filter(([key]) => key !== "tier")
    .map(([key, value]) => ({ key, label: specLabel(key), value: specValue(key, value) }));
}

// As duas specs do card: destaque fixo + a revelada no hover.
export function cardSpecs(specs: unknown): { primary: SpecEntry | null; secondary: SpecEntry | null } {
  const entries = specEntries(specs);
  const byKey = new Map(entries.map((e) => [e.key, e]));
  const ranked = CARD_PRIORITY.map((k) => byKey.get(k)).filter(
    (e): e is SpecEntry => e !== undefined
  );
  const rest = entries.filter((e) => !CARD_PRIORITY.includes(e.key));
  const ordered = [...ranked, ...rest];
  return { primary: ordered[0] ?? null, secondary: ordered[1] ?? null };
}

export function tierLabel(specs: unknown): string | null {
  if (!specs || typeof specs !== "object" || Array.isArray(specs)) return null;
  const tier = (specs as Record<string, unknown>).tier;
  if (typeof tier !== "string") return null;
  const map: Record<string, string> = {
    entry: "Entry",
    mid: "Sweet spot",
    enthusiast: "Enthusiast",
    professional: "Professional",
  };
  return map[tier] ?? tier;
}
