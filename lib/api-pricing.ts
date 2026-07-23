export type ApiModel = {
  id: string;
  provider: string;
  name: string;
  inputCostPer1M: number;
  outputCostPer1M: number;
  contextWindow: number;
  description: string;
};

export const API_MODELS: ApiModel[] = [
  {
    id: "gpt-4o",
    provider: "OpenAI",
    name: "GPT-4o",
    inputCostPer1M: 2.50,
    outputCostPer1M: 10.00,
    contextWindow: 128000,
    description: "Flagship model for complex tasks."
  },
  {
    id: "gpt-4o-mini",
    provider: "OpenAI",
    name: "GPT-4o mini",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.60,
    contextWindow: 128000,
    description: "Fast, cost-effective small model."
  },
  {
    id: "claude-3-5-sonnet",
    provider: "Anthropic",
    name: "Claude 3.5 Sonnet",
    inputCostPer1M: 3.00,
    outputCostPer1M: 15.00,
    contextWindow: 200000,
    description: "Best for coding and heavy reasoning."
  },
  {
    id: "claude-3-haiku",
    provider: "Anthropic",
    name: "Claude 3 Haiku",
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    contextWindow: 200000,
    description: "Incredibly fast for simple tasks."
  },
  {
    id: "gemini-1-5-pro",
    provider: "Google",
    name: "Gemini 1.5 Pro",
    inputCostPer1M: 3.50,
    outputCostPer1M: 10.50,
    contextWindow: 2000000,
    description: "Massive context window (up to 2M)."
  },
  {
    id: "gemini-1-5-flash",
    provider: "Google",
    name: "Gemini 1.5 Flash",
    inputCostPer1M: 0.35,
    outputCostPer1M: 1.05,
    contextWindow: 1000000,
    description: "Speed and efficiency at scale."
  },
  {
    id: "deepseek-v3",
    provider: "DeepSeek",
    name: "DeepSeek-V3",
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    contextWindow: 64000,
    description: "Extremely cheap MoE model."
  },
  {
    id: "deepseek-r1",
    provider: "DeepSeek",
    name: "DeepSeek-R1",
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    contextWindow: 64000,
    description: "Open-source reasoning model."
  }
];
