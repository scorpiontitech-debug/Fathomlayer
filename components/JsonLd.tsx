// Renderiza JSON-LD com escape de "<" — nunca interpolar HTML cru.
export function JsonLd({
  data,
  type = "Product",
  title,
  description,
  image,
  url,
  price,
  currency,
  aggregateRating,
}: {
  data?: Record<string, unknown>;
  type?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  price?: string | null;
  currency?: string | null;
  aggregateRating?: {
    ratingValue: string;
    reviewCount: number;
  } | null;
}) {
  const schema: Record<string, any> = data || {
    "@context": "https://schema.org",
    "@type": type,
    name: title,
    description: description,
    image: image,
    url: url,
  };

  if (price && currency) {
    schema.offers = {
      "@type": "Offer",
      price: price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    };
  }

  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
