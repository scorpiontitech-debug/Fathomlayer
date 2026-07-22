// Banned-Phrase Blocklist (content-spec section 5): vague marketing language
// never reaches `published`. Enforced server-side at publish time and in the
// synthesis pipeline — a system rule, not a suggestion.
// PT terms kept from the spec; EN terms are their equivalents (platform is EN).

const BANNED_PHRASES = [
  // From the spec (PT)
  "revolucionário",
  "revolucionaria",
  "pioneiro",
  "solução topo de gama",
  "incrível",
  "transforme",
  "resultados garantidos",
  // EN equivalents
  "revolutionary",
  "groundbreaking",
  "game-changer",
  "game-changing",
  "incredible",
  "amazing",
  "unbelievable",
  "must-have",
  "top-of-the-line",
  "best-in-class",
  "world-class",
  "cutting-edge",
  "guaranteed results",
  "transform your",
  "next-level",
  "unmatched",
  "unparalleled",
];

export function findBannedPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  return BANNED_PHRASES.filter((phrase) => lower.includes(phrase));
}
