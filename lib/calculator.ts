// Calculadora de Hardware para IA Local (content-spec seção 4).
// Não há tabela nova: os 4 escalões são lógica editorial de exibição,
// e o cruzamento com produtos usa as tags técnicas (runs-*).
// Os pares modelo→escalão vêm da pesquisa de mercado do seed.

export type Tier = {
  id: "entry" | "mid" | "enthusiast" | "professional";
  label: string;
  memoryGb: number;
  memoryKind: string;
  example: string;
};

export const TIERS: Tier[] = [
  {
    id: "entry",
    label: "Entry",
    memoryGb: 16,
    memoryKind: "VRAM",
    example: "RTX 4060 Ti-class build",
  },
  {
    id: "mid",
    label: "Sweet spot",
    memoryGb: 64,
    memoryKind: "unified memory",
    example: "Mac Mini M4 Pro class",
  },
  {
    id: "enthusiast",
    label: "Enthusiast",
    memoryGb: 128,
    memoryKind: "unified memory",
    example: "Ryzen AI Max+ class",
  },
  {
    id: "professional",
    label: "Professional",
    memoryGb: 256,
    memoryKind: "RAM + dual-GPU VRAM",
    example: "Threadripper Pro class",
  },
];

export type CalcModel = {
  id: string;
  label: string;
  params: string;
  tag: string;
  minTier: number; // índice em TIERS
};

export const CALC_MODELS: CalcModel[] = [
  { id: "phi-4-mini", label: "Phi-4-mini", params: "3.8B", tag: "runs-phi-4-mini", minTier: 0 },
  { id: "gemma-3-4b", label: "Gemma 3 4B", params: "4B", tag: "runs-gemma-4b", minTier: 0 },
  { id: "gemma-3-27b", label: "Gemma 3 27B", params: "27B", tag: "runs-gemma-27b", minTier: 1 },
  { id: "qwen3-30b", label: "Qwen3 30B-A3B", params: "30B MoE", tag: "runs-qwen3-30b", minTier: 1 },
  { id: "llama-3-3-70b", label: "Llama 3.3 70B", params: "70B", tag: "runs-llama-70b", minTier: 2 },
  { id: "mistral-small-3-1", label: "Mistral Small 3.1", params: "24B", tag: "runs-mistral-small", minTier: 2 },
  { id: "gpt-oss-120b", label: "gpt-oss-120b", params: "120B", tag: "runs-gpt-oss-120b", minTier: 3 },
  { id: "llama-3-1-405b", label: "Llama 3.1 405B", params: "405B", tag: "runs-llama-405b", minTier: 3 },
];
