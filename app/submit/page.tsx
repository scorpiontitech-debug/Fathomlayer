"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Rocket, Sparkles, CheckCircle2 } from "lucide-react";

export default function SubmitToolPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [session, setSession] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from("tool_submissions").insert({
      name,
      website_url: url,
      description,
      category,
      user_id: session?.user?.id || null,
      payment_status: "pending",
      review_status: "pending",
    });

    setLoading(false);
    if (!error) {
      setSuccess(true);
    } else {
      alert("Error submitting tool. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-edge bg-surface p-12 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">Submission Received!</h1>
          <p className="mt-4 text-dim">
            Your tool is now in the review queue. We will notify you once it's approved and listed on Fathom Layer.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 rounded-lg bg-ink px-6 py-2 font-medium text-surface transition hover:bg-ink/90"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-24 space-y-12">
      <header className="rise-group border-b border-edge pb-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-bright mb-6 shadow-xl">
          <Rocket className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl text-ink">
          Submit your tool
        </h1>
        <p className="mt-4 text-xl text-dim">
          Get featured on the industry's most trusted directory.
        </p>
      </header>

      <div className="grid md:grid-cols-5 gap-12">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-edge bg-surface p-6">
            <h3 className="font-display font-medium text-ink flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-accent-bright" />
              Why list on Fathom?
            </h3>
            <ul className="space-y-3 text-sm text-dim">
              <li>• Access to high-intent technical buyers</li>
              <li>• Powerful "dofollow" backlink (DA 70+)</li>
              <li>• Featured in our weekly newsletter</li>
              <li>• Earn the Fathom "Badge of Excellence"</li>
            </ul>
          </div>
          
          {!session && (
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-6 text-sm">
              <p className="text-ink font-medium">Want to track your submission?</p>
              <p className="text-dim mt-1 mb-4">Log in to manage your submissions and fast-track payments.</p>
              <a href="/login" className="font-medium text-accent hover:underline">Sign in with GitHub →</a>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Tool Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Fathom Analytics"
              className="w-full rounded-lg border border-edge bg-surface p-3 text-ink focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Website URL</label>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-edge bg-surface p-3 text-ink focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Category / Tags</label>
            <input
              required
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., AI Video, Next.js, API"
              className="w-full rounded-lg border border-edge bg-surface p-3 text-ink focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">Brief Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What problem does it solve?"
              className="w-full rounded-lg border border-edge bg-surface p-3 text-ink focus:border-accent-bright focus:outline-none focus:ring-1 focus:ring-accent-bright"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-ink py-4 font-medium text-surface transition hover:bg-ink/90 disabled:opacity-50 text-lg"
            >
              {loading ? "Submitting..." : "Submit to Fathom Layer"}
            </button>
            <p className="text-center text-xs text-faint mt-4">
              By submitting, you agree to our editorial guidelines.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
