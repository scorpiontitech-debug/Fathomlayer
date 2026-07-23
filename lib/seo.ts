// SEO/GEO (content-spec seção 7): JSON-LD completo + head completo são a
// prioridade real de visibilidade — não llms.txt. Builders centralizados.

import type { Category, Product, Software } from "@/lib/queries";

export const SITE_URL = "https://fathomlayer.com";
export const SITE_NAME = "Fathom Layer";

type JsonLdObject = Record<string, unknown>;

export function organizationLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description:
      "An independent technology index: hardware, software and AI evaluated with verified data and in-house editorial criteria.",
  };
}

export function websiteLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// Product: design_score vira Review da própria organização (dado
// proprietário, é isso que justifica indexação). Sem Offers — não
// armazenamos preço verificado no MVP.
export function productLd(product: Product, category: Category, path: string, aggregateRating?: { ratingValue: string; reviewCount: number } | null): JsonLdObject {
  const ld: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    url: `${SITE_URL}${path}`,
    description: product.description ?? undefined,
    category: category.name,
  };
  if (product.brand) {
    ld.brand = { "@type": "Brand", name: product.brand };
  }
  if (aggregateRating) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
    };
  }
  if (product.design_score !== null) {
    ld.review = {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: product.design_score,
        bestRating: 10,
        worstRating: 0,
      },
      author: { "@type": "Organization", name: SITE_NAME },
      ...(product.editorial_notes ? { reviewBody: product.editorial_notes } : {}),
    };
  }
  return ld;
}

export function softwareLd(software: Software, category: Category, path: string, aggregateRating?: { ratingValue: string; reviewCount: number } | null): JsonLdObject {
  const ld: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: software.name,
    url: `${SITE_URL}${path}`,
    description: software.description ?? undefined,
    applicationCategory: category.name,
  };
  if (aggregateRating) {
    ld.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
    };
  }
  if (software.website_url) ld.sameAs = software.website_url;
  if (software.pricing_model === "free" || software.pricing_model === "open_source") {
    ld.offers = { "@type": "Offer", price: 0, priceCurrency: "USD" };
  }
  return ld;
}

export function itemListLd(
  items: { name: string; path: string }[],
  listName: string
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: `${SITE_URL}${item.path}`,
    })),
  };
}
