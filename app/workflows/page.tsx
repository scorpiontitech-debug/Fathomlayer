import { Metadata } from "next";
import Link from "next/link";
import { getWorkflows } from "@/lib/queries";
import { Clock, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Workflow Blueprints | Fathom Layer",
  description: "Learn how to combine the best AI tools into powerful workflows that save you time and make you money.",
};

export const revalidate = 3600;

export default async function WorkflowsIndexPage() {
  const workflows = await getWorkflows();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Workflow Blueprints
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-dim">
          Stop searching for tools. Start solving problems. Step-by-step guides on how to combine AI software to automate your work.
        </p>
      </header>

      {workflows.length === 0 ? (
        <div className="py-12 text-center text-dim border border-edge/50 rounded-xl bg-surface/50 border-dashed">
          <p>No workflows have been published yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((wf) => (
            <Link
              key={wf.id}
              href={`/workflows/${wf.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-edge bg-surface p-6 transition-colors hover:border-accent hover:shadow-[0_0_20px_rgba(0,82,255,0.1)] tilt"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    {wf.difficulty}
                  </span>
                  <span className="flex items-center text-xs text-faint">
                    <Clock className="w-3 h-3 mr-1" />
                    {wf.estimated_time}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-ink group-hover:text-accent transition-colors">
                  {wf.title}
                </h3>
                <p className="mt-3 text-sm text-dim line-clamp-3">
                  {wf.description}
                </p>
              </div>
              <div className="mt-6 flex items-center text-sm font-medium text-accent-bright group-hover:underline">
                View Blueprint <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
