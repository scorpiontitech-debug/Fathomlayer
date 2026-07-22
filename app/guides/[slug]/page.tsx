import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialArticle } from "@/components/editorial";
import { getEditorialPageBySlug, getEditorialPages } from "@/lib/queries";

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const pages = await getEditorialPages("guide");
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getEditorialPageBySlug(slug);
  if (!page || page.content_type !== "guide") return {};
  return {
    title: page.title,
    description: page.body_markdown.replace(/[#*_`>[\]]/g, "").slice(0, 160),
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getEditorialPageBySlug(slug);
  if (!page || page.content_type !== "guide") notFound();
  return <EditorialArticle page={page} listLabel="Buying guides" listPath="/guides" />;
}
