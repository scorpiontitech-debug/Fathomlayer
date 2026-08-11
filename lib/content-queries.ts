import { supabasePublic } from "@/lib/supabase/server";

export type ContentAuthor = {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  avatar_url: string | null;
  social_links: any;
  created_at: string;
  updated_at: string;
};

export type ContentCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type ContentPost = {
  id: string;
  author_id: string;
  category_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  audio_url: string | null;
  status: 'draft' | 'review' | 'published' | 'archived';
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  author?: ContentAuthor;
  category?: ContentCategory;
};

export async function getPublishedPosts(limit = 10, offset = 0): Promise<ContentPost[]> {
  const { data, error } = await supabasePublic()
    .from("content_posts" as any)
    .select(`
      *,
      author:content_authors(*),
      category:content_categories(*)
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[fathom-layer] getPublishedPosts error:", error.message);
    return [];
  }
  
  return data as unknown as ContentPost[];
}

export async function getPostBySlug(slug: string): Promise<ContentPost | null> {
  const { data, error } = await supabasePublic()
    .from("content_posts" as any)
    .select(`
      *,
      author:content_authors(*),
      category:content_categories(*)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("[fathom-layer] getPostBySlug error:", error.message);
  }
  
  return data as unknown as ContentPost | null;
}

export async function getPostsByCategory(categorySlug: string, limit = 10, offset = 0): Promise<ContentPost[]> {
  const { data: category } = await supabasePublic()
    .from("content_categories" as any)
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return [];

  const { data, error } = await supabasePublic()
    .from("content_posts" as any)
    .select(`
      *,
      author:content_authors(*),
      category:content_categories(*)
    `)
    .eq("category_id", (category as any).id)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("[fathom-layer] getPostsByCategory error:", error.message);
    return [];
  }

  return data as unknown as ContentPost[];
}

// ============================================================================
// Busca Semântica (For You Feed)
// ============================================================================

export async function getRecommendedPosts(queryEmbedding: number[], limit = 6): Promise<{ data: ContentPost[] | null; error: any }> {
  const { data, error } = await (supabasePublic() as any).rpc('match_posts_by_embedding', {
    query_embedding: `[${queryEmbedding.join(',')}]`,
    match_threshold: 0.5,
    match_count: limit,
    category_filter: null
  });

  if (error) {
    console.error("Erro ao buscar recomendações semânticas:", error);
    return { data: null, error };
  }

  return { data: data as ContentPost[], error: null };
}
