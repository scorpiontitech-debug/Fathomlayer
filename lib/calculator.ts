// Calculadora de Hardware para IA Local.
// Usa os 4 escalões (tiers) para lógica visual, e cruza com os produtos via tags (runs-*).
// Adiciona o cálculo real matemático de VRAM (Parameters * Quantization).

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
  paramsBillions: number;
  tag: string;
  minTier: number; // índice em TIERS
};

export const CALC_MODELS: CalcModel[] = [
  { id: "phi-4-mini", label: "Phi-4-mini", params: "3.8B", paramsBillions: 3.8, tag: "runs-phi-4-mini", minTier: 0 },
  { id: "gemma-3-4b", label: "Gemma 3 4B", params: "4B", paramsBillions: 4, tag: "runs-gemma-4b", minTier: 0 },
  { id: "gemma-3-27b", label: "Gemma 3 27B", params: "27B", paramsBillions: 27, tag: "runs-gemma-27b", minTier: 1 },
  { id: "qwen3-30b", label: "Qwen3 30B", params: "30B", paramsBillions: 30, tag: "runs-qwen3-30b", minTier: 1 },
  { id: "deepseek-r1-70b", label: "DeepSeek R1 70B", params: "70B", paramsBillions: 70, tag: "runs-llama-70b", minTier: 2 },
  { id: "llama-3-3-70b", label: "Llama 3.3 70B", params: "70B", paramsBillions: 70, tag: "runs-llama-70b", minTier: 2 },
  { id: "deepseek-v3", label: "DeepSeek V3", params: "236B", paramsBillions: 236, tag: "runs-gpt-oss-120b", minTier: 3 },
  { id: "llama-3-1-405b", label: "Llama 3.1 405B", params: "405B", paramsBillions: 405, tag: "runs-llama-405b", minTier: 3 },
];

export function calculateRequiredVram(paramsBillions: number, quantizationBits: number = 4): number {
  // Formula: (Billions * Bits) / 8 + 20% overhead for Context Window
  const baseVram = (paramsBillions * quantizationBits) / 8;
  const overhead = baseVram * 0.20;
  return Math.ceil(baseVram + overhead);
}
