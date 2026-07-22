// Inline disclosure: accompanies every block that renders /out/{link_id} links
// (roadmap #8). Discreet by design — information, not a banner.
export function AffiliateDisclosure() {
  return (
    <p className="text-xs text-[var(--fl-dim)]">
      Purchase links may earn Fathom Layer a commission, at no extra cost to you.
    </p>
  );
}
