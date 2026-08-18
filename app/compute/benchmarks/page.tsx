import type { Metadata } from "next";

// Página deliberadamente fora do índice enquanto os números forem de
// referência e não medições nossas. Prometer "verificado pela comunidade"
// sobre uma constante escrita à mão custa mais credibilidade do que a página
// entrega — e o Google audita exatamente isso.
export const metadata: Metadata = {
  title: "Inference Benchmarks | Compute",
  description: "Reference token-generation figures for local AI hardware, pending first-party verification.",
  robots: { index: false, follow: true },
};

// Figuras de referência publicadas por terceiros. NÃO são medições nossas.
// Substituir por leitura de tabela quando o laboratório de benchmark existir;
// até lá a página é honesta sobre a procedência.
const REFERENCE_FIGURES = [
  { id: 1, hardware: "Mac Studio M2 Ultra (192GB)", model: "Llama-3-70B-Instruct", quant: "Q4_K_M", tps: 18.5, framework: "MLX" },
  { id: 2, hardware: "NVIDIA RTX 4090 (24GB)", model: "Llama-3-8B-Instruct", quant: "FP16", tps: 145.2, framework: "vLLM" },
  { id: 3, hardware: "AMD RX 7900 XTX (24GB)", model: "Mixtral 8x7B", quant: "Q4_K_M", tps: 22.1, framework: "llama.cpp" },
  { id: 4, hardware: "Intel Core i9-14900K", model: "Llama-3-8B-Instruct", quant: "Q4_K_M", tps: 12.4, framework: "llama.cpp" },
];

export default function BenchmarksPage() {
  return (
    <div className="space-y-12 pb-24 max-w-6xl mx-auto px-4">
      <header className="rise-group pt-10">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent-bright mb-4">
          Reference data
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-white">
          Inference Benchmarks
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dim max-w-2xl font-light">
          Token-generation figures for local AI hardware, to size a build before you buy it.
        </p>
        <p className="mt-4 max-w-2xl rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-200/90">
          <strong className="font-semibold">Not yet verified by us.</strong> These are figures
          published by hardware vendors and the open-source community, collected for orientation.
          We have not reproduced them on our own bench. Treat them as an order of magnitude, not a
          measurement — and expect them to be replaced by first-party numbers.
        </p>
      </header>

      <div className="reveal overflow-hidden rounded-xl border border-edge bg-surface shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-edge bg-surface-dim font-mono text-xs uppercase tracking-widest text-faint">
              <tr>
                <th className="px-6 py-4">Hardware Setup</th>
                <th className="px-6 py-4">Model & Quantization</th>
                <th className="px-6 py-4">Framework</th>
                <th className="px-6 py-4 text-right">Tokens / Sec</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {REFERENCE_FIGURES.map((b) => (
                <tr key={b.id} className="group transition-colors hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-medium text-white group-hover:text-accent-bright transition-colors">
                    {b.hardware}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-zinc-300">{b.model}</span>
                      <span className="font-mono text-[10px] text-dim">{b.quant}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-dim">
                    {b.framework}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="inline-flex items-center gap-2 rounded bg-accent-bright/10 px-3 py-1 font-mono text-lg font-bold text-accent-bright">
                      {b.tps} <span className="text-xs font-normal opacity-70">t/s</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
