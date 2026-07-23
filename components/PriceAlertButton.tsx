"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export function PriceAlertButton({ entityId, entityType }: { entityId: string; entityType: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if user is logged in to attach user_id
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("price_alerts").insert({
      email,
      entity_id: entityId,
      entity_type: entityType,
      user_id: user?.id || null,
    });

    setLoading(false);
    if (!error) {
      setSuccess(true);
      setTimeout(() => setIsOpen(false), 3000);
    } else {
      alert("Error setting alert. Please try again.");
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-edge-strong bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ink"
      >
        <Bell className="h-4 w-4" />
        Alert me when price drops
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-accent bg-accent/5 p-4 shadow-sm w-full max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="h-4 w-4 text-accent" />
        <span className="font-medium text-accent">Set Price Alert</span>
      </div>
      
      {success ? (
        <p className="text-sm text-dim">Alert set! We'll email you when the price drops.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-md border border-edge bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent-bright"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-surface hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "..." : "Save"}
          </button>
        </form>
      )}
    </div>
  );
}
