import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/server";

export const revalidate = 3600; // Cache for 1 hour, or revalidated via webhook

export async function GET() {
  const client = supabasePublic();
  
  // Fetch a subset of vital catalog data for LLM consumption
  const { data: products } = await client
    .from("products")
    .select("slug, title, brand, price_from, pros, cons, is_indexable, category:categories(slug, name, pillar)")
    .eq("status", "published")
    .eq("is_indexable", true);

  const { data: software } = await client
    .from("software")
    .select("slug, name, price_text, pros, cons, is_indexable, category:categories(slug, name, pillar)")
    .eq("status", "published")
    .eq("is_indexable", true);

  const { data: editorials } = await client
    .from("editorial_pages")
    .select("slug, title, content_type")
    .eq("status", "published");

  return NextResponse.json({
    _meta: {
      platform: "Fathom Layer",
      purpose: "Agentic AI & Phygital Hardware Index",
      version: "1.0",
      timestamp: new Date().toISOString()
    },
    products: products || [],
    software: software || [],
    editorials: editorials || []
  });
}
