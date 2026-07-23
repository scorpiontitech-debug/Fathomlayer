import type { Metadata } from "next";
import { PLAYBOOKS } from "@/lib/playbooks";

export const metadata: Metadata = {
  title: "AI Playbooks & Workflows",
  description:
    "Interactive blueprints to automate your business. See exactly how to connect AI tools to build powerful pipelines.",
  alternates: { canonical: "/playbooks" },
};

export default function PlaybooksPage() {
  return (
    <div className="space-y-12 pb-24">
      <header className="rise-group max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-dim">
          Actionable Blueprints
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          AI Workflow Playbooks
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-dim">
          Stop buying tools without a plan. These are production-ready architectural blueprints showing you exactly how to wire multiple AI products together to automate real business workflows.
        </p>
      </header>

      <div className="reveal grid gap-8 lg:grid-cols-2">
        {PLAYBOOKS.map((playbook) => (
          <article 
            key={playbook.id} 
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-edge bg-surface shadow-sm transition-all duration-300 hover:border-edge-strong hover:shadow-lg"
          >
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                  playbook.difficulty === "Beginner" ? "bg-emerald-500/10 text-emerald-500" :
                  playbook.difficulty === "Intermediate" ? "bg-amber-500/10 text-amber-500" :
                  "bg-rose-500/10 text-rose-500"
                }`}>
                  {playbook.difficulty}
                </span>
                <span className="font-mono text-xs tabular-nums text-faint">
                  ~${playbook.estimatedMonthlyCost}/mo
                </span>
              </div>
              
              <h2 className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink">
                {playbook.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-dim">
                {playbook.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {playbook.toolsUsed.map((tool) => (
                  <span key={tool} className="rounded-md border border-edge bg-bg px-2.5 py-1 text-xs text-dim">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-edge bg-bg/50 p-6 md:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint mb-4">
                The Pipeline
              </p>
              <div className="space-y-4">
                {playbook.flowchart.map((node, index) => (
                  <div key={node.step} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-edge-strong bg-surface text-xs font-medium text-ink">
                        {node.step}
                      </div>
                      {index !== playbook.flowchart.length - 1 && (
                        <div className="my-1 w-px flex-1 bg-edge-strong" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-ink">{node.action}</p>
                      <p className="font-mono text-xs text-dim mt-1">via {node.tool}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
