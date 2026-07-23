import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase/server";
import { ReviewForm } from "@/components/admin/ReviewForm";
import { CheckCircle2, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = supabaseAdmin() || supabasePublic();

  const { data: submissions } = await supabase
    .from("tool_submissions")
    .select("*")
    .eq("review_status", "pending")
    .order("created_at", { ascending: true });

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, pillar")
    .order("name");

  // Format categories so admin knows what pillar it belongs to
  const formattedCategories = categories?.map(c => ({
    id: c.id,
    name: `${c.pillar.toUpperCase()} - ${c.name}`
  })) || [];

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-10">
      <header className="rise-group border-b border-edge pb-6 pt-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-ink flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-accent-bright" />
            Admin Operations
          </h1>
          <p className="mt-2 text-dim">
            Manage Fathom Layer submissions and content.
          </p>
        </div>
        <Link href="/" className="text-sm font-medium text-dim hover:text-ink">
          View Live Site →
        </Link>
      </header>

      <section>
        <h2 className="text-xl font-display font-semibold mb-4 text-ink flex items-center gap-2">
          Moderation Queue
          <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs">
            {submissions?.length || 0} Pending
          </span>
        </h2>
        
        {submissions && submissions.length > 0 ? (
          <div className="space-y-4">
            {submissions.map(sub => (
              <ReviewForm key={sub.id} submission={sub} categories={formattedCategories} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-edge rounded-xl p-12 text-center bg-surface">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <p className="font-medium text-ink">Queue is empty</p>
            <p className="text-sm text-dim mt-1">All submissions have been processed.</p>
          </div>
        )}
      </section>
    </div>
  );
}
