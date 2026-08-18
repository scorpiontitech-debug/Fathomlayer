// Selo de verificação (content-spec 7.4): prova de confiança visível, texto
// pequeno e neutro — nunca badge chamativo de e-commerce.
//
// `verifiedAt` é null quando ninguém conferiu as specs contra a fonte do
// fabricante, e nesse caso o componente diz isso. O estado anterior era pior
// que não ter selo nenhum: a coluna era NOT NULL DEFAULT now(), então todo
// item criado por script de seed exibia "Data verified today" sem que ninguém
// tivesse verificado nada. Um selo de confiança que mente custa mais do que a
// ausência dele.
export function VerifiedBadge({ verifiedAt }: { verifiedAt: string | null }) {
  if (!verifiedAt) {
    return (
      <span
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint"
        title="Specifications are taken from published sources but have not been checked against the manufacturer by us."
      >
        <span aria-hidden className="h-1 w-1 rounded-full bg-amber-400/70" />
        Specs not independently verified
      </span>
    );
  }

  const days = Math.max(
    0,
    Math.floor((Date.now() - new Date(verifiedAt).getTime()) / 86_400_000)
  );
  const label =
    days === 0
      ? "Data verified today"
      : days === 1
        ? "Data verified 1 day ago"
        : `Data verified ${days} days ago`;

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
      <span aria-hidden className="h-1 w-1 rounded-full bg-ok" />
      {label}
    </span>
  );
}
