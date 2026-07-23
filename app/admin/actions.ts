"use server";

import { requireAdmin } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveSubmission(submissionId: string, data: any) {
  await requireAdmin();
  const supabase = supabaseAdmin();
  if (!supabase) throw new Error("Admin client not configured");

  // 1. Insert into software
  const { error: insertError } = await supabase.from("software").insert({
    name: data.name,
    slug: data.slug,
    description: data.description,
    website_url: data.website_url,
    category_id: data.category_id,
    pricing_model: data.pricing_model,
    status: "active",
  });

  if (insertError) {
    console.error("Failed to insert software:", insertError);
    throw new Error("Failed to insert software: " + insertError.message);
  }

  // 2. Update submission status
  const { error: updateError } = await supabase
    .from("tool_submissions")
    .update({ review_status: "approved" })
    .eq("id", submissionId);

  if (updateError) {
    console.error("Failed to update submission status:", updateError);
    throw new Error("Failed to update submission status.");
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/software");
  
  return { success: true };
}

export async function rejectSubmission(submissionId: string) {
  await requireAdmin();
  const supabase = supabaseAdmin();
  if (!supabase) throw new Error("Admin client not configured");

  const { error } = await supabase
    .from("tool_submissions")
    .update({ review_status: "rejected" })
    .eq("id", submissionId);

  if (error) throw new Error("Failed to reject submission.");

  revalidatePath("/admin/dashboard");
  return { success: true };
}
