// Selo de Verificação (content-spec 7.4): prova de confiança visível,
// texto pequeno e neutro — nunca badge chamativo de e-commerce.
export function VerifiedBadge({ verifiedAt }: { verifiedAt: string }) {
  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(verifiedAt).getTime()) / 86_400_000)
  );
  const label =
    days === 0 ? "Data verified today" : days === 1 ? "Data verified 1 day ago" : `Data verified ${days} days ago`;

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
      <span aria-hidden className="h-1 w-1 rounded-full bg-ok" />
      {label}
    </span>
  );
}
