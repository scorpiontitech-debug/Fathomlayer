import { requireUser } from "@/lib/supabase/auth";
import { supabasePublic } from "@/lib/supabase/server";
import Link from "next/link";
import { getProductById } from "@/lib/queries";

// This is a basic implementation of the profile page
export default async function ProfilePage() {
  const user = await requireUser();
  const client = supabasePublic();

  // Fetch the user's saved items
  const { data: saves } = await client
    .from("user_saves")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // For MVP, we will manually resolve products. In a real app we'd do a join or parallel fetch.
  // Here we just fetch them individually.
  const savedItems = await Promise.all(
    (saves ?? []).map(async (save) => {
      if (save.entity_type === "product") {
        const product = await getProductById(save.entity_id);
        if (product) {
          return { ...save, name: product.title, url: `/hardware/gpu/${product.slug}` }; // hardcoded URL structure for MVP
        }
      }
      return null;
    })
  );

  const resolvedItems = savedItems.filter(Boolean);

  return (
    <div className="space-y-12 pb-24 max-w-4xl mx-auto">
      <header className="rise-group border-b border-edge pb-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          My Stack
        </h1>
        <p className="mt-4 text-lg text-dim">
          Logged in as <span className="text-ink font-medium">{user.email}</span>
        </p>
      </header>

      <section className="reveal">
        <h2 className="text-xl font-display font-medium text-ink mb-6">Saved Tools & Hardware</h2>
        
        {resolvedItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-edge-strong bg-surface p-12 text-center">
            <p className="text-dim">You haven't saved any items to your stack yet.</p>
            <Link href="/" className="mt-4 inline-block text-accent-bright hover:underline">
              Explore the directory →
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {resolvedItems.map((item) => (
              <li key={item!.id}>
                <Link
                  href={item!.url!}
                  className="flex items-center justify-between rounded-lg border border-edge bg-surface p-5 hover:border-edge-strong"
                >
                  <span className="font-medium text-ink">{item!.name}</span>
                  <span className="text-accent-bright">View →</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
