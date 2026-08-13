import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialArticle } from "@/components/editorial";
import {
  getEditorialPageBySlug,
  getEditorialPages,
  getRelatedEditorialByTags,
} from "@/lib/queries";

import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getEditorialPages("glossary");
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getEditorialPageBySlug(slug);
  if (!page || page.content_type !== "glossary") return {};
  
  const desc = page.body_markdown.replace(/[#*_`>[\]]/g, "").slice(0, 160);
  const url = `${SITE_URL}/glossary/${slug}`;

  return {
    title: page.title,
    description: desc,
    alternates: { 
      canonical: `/glossary/${slug}`,
      languages: {
        [page.content_language]: `${SITE_URL}/glossary/${slug}`
      }
    },
    openGraph: {
      title: page.title,
      description: desc,
      url: url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: page.created_at,
      modifiedTime: page.updated_at,
      authors: ["Fathom Layer Editorial Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: desc,
    },
  };
}

export default async function GlossaryEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getEditorialPageBySlug(slug);
  if (!page || page.content_type !== "glossary") notFound();
  const related = await getRelatedEditorialByTags(page.tags, page.id);
  return (
    <EditorialArticle
      page={page}
      listLabel="Glossary"
      listPath="/glossary"
      related={related}
    />
  );
}
