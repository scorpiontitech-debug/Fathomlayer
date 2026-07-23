"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export function SaveButton({ entityId, entityType }: { entityId: string; entityType: string }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const { error } = await supabase.from("user_saves").insert({
      user_id: user.id,
      entity_type: entityType,
      entity_id: entityId,
    });

    if (!error) {
      setSaved(true);
    }
    setSaving(false);
  };

  return (
    <button
      onClick={handleSave}
      disabled={saving || saved}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
        saved 
          ? "border-accent bg-accent/10 text-accent" 
          : "border-edge-strong bg-surface text-ink hover:border-ink"
      }`}
    >
      <Bookmark className={`h-4 w-4 ${saved ? "fill-accent" : ""}`} />
      {saved ? "Saved to Stack" : "Save to Stack"}
    </button>
  );
}
