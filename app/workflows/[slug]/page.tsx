import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getWorkflowBySlug, getSoftwareBySlug } from "@/lib/queries";
import { Clock, BarChart, ArrowRight, ExternalLink, Zap } from "lucide-react";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params;
  const wf = await getWorkflowBySlug(p.slug) as any;
  if (!wf) return {};
  return {
    title: `${wf.title} - AI Workflow Blueprint | Fathom Layer`,
    description: wf.description,
  };
}

export default async function WorkflowDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const wf = await getWorkflowBySlug(p.slug) as any;
  
  if (!wf) notFound();

  // Parse steps if they are valid JSON array
  let steps: any[] = [];
  try {
    steps = Array.isArray(wf.steps) ? wf.steps : JSON.parse(wf.steps as string);
  } catch (e) {
    console.error("Failed to parse steps", e);
  }

  // Fetch software info for each step
  const stepsWithSoftware = await Promise.all(steps.map(async (step) => {
    let software = null;
    if (step.software_slug) {
      software = await getSoftwareBySlug(step.software_slug);
    }
    return { ...step, software };
  }));

  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/workflows" className="inline-flex items-center text-sm text-dim hover:text-ink mb-8 transition-colors">
        <ArrowRight className="w-4 h-4 mr-2 rotate-180" /> Back to Blueprints
      </Link>
      
      <header className="mb-12 border-b border-edge pb-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
            <BarChart className="w-4 h-4 mr-2" />
            {wf.difficulty}
          </span>
          <span className="inline-flex items-center rounded-full bg-subtle px-3 py-1 text-sm text-dim border border-edge">
            <Clock className="w-4 h-4 mr-2" />
            {wf.estimated_time}
          </span>
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl mb-6">
          {wf.title}
        </h1>
        <p className="text-xl text-dim leading-relaxed">
          {wf.description}
        </p>
      </header>

      <div className="space-y-12">
        <h2 className="font-display text-2xl font-semibold flex items-center">
          <Zap className="w-6 h-6 mr-3 text-accent-bright" /> 
          Implementation Steps
        </h2>

        <div className="relative border-l-2 border-edge-strong ml-4 space-y-12 pb-8">
          {stepsWithSoftware.map((step, index) => (
            <div key={index} className="relative pl-8">
              <span className="absolute -left-4 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-surface border-2 border-accent text-sm font-bold text-accent shadow-sm">
                {index + 1}
              </span>
              
              <div className="bg-surface border border-edge rounded-xl p-6 hover:border-edge-strong transition-colors">
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-dim leading-relaxed mb-6 whitespace-pre-wrap">{step.description}</p>
                
                {step.software && (
                  <div className="mt-6 pt-6 border-t border-edge/50">
                    <p className="text-xs uppercase tracking-widest text-faint mb-3 font-mono">Tool Required</p>
                    <Link href={`/software/ai/${step.software.slug}`} className="group flex items-center justify-between p-4 rounded-lg bg-subtle/50 hover:bg-subtle border border-transparent hover:border-edge transition-all">
                      <div className="flex items-center">
                        {step.software.image_url ? (
                          <img src={step.software.image_url} alt={step.software.name} className="w-10 h-10 rounded-md object-cover mr-4" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-edge flex items-center justify-center mr-4 font-bold text-faint">
                            {step.software.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-ink group-hover:text-accent transition-colors">{step.software.name}</p>
                          <p className="text-xs text-dim">{step.software.pricing_model || "View Pricing"} • {step.software.price_text}</p>
                        </div>
                      </div>
                      <ExternalLink className="w-5 h-5 text-faint group-hover:text-ink transition-colors" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Monetization / Matchmaking CTA */}
      <section className="mt-16 bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-2xl p-8 text-center">
        <h2 className="font-display text-2xl font-semibold mb-4">Need help implementing this?</h2>
        <p className="text-dim max-w-xl mx-auto mb-6">
          Our verified agency partners specialize in setting up this exact workflow for enterprise teams. Save time and get it right the first time.
        </p>
        <button className="bg-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-accent-bright transition-colors shadow-[0_0_20px_rgba(0,82,255,0.3)] hover:shadow-[0_0_30px_rgba(0,82,255,0.5)]">
          Talk to an Expert
        </button>
      </section>
    </main>
  );
}
