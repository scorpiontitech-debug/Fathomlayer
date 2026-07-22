// Bloco de Prós/Contras/Ideal Para (design system §7): direto dos campos
// estruturados, sem parafrasear — alimenta GEO e os futuros comparativos.
export function ProsCons({
  pros,
  cons,
  idealFor,
}: {
  pros: string[];
  cons: string[];
  idealFor: string[];
}) {
  if (pros.length === 0 && cons.length === 0 && idealFor.length === 0) return null;

  return (
    <section className="reveal max-w-2xl space-y-5">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        Where it wins, where it doesn&apos;t
      </h2>
      <div className="grid gap-px overflow-hidden rounded-lg border border-edge bg-edge sm:grid-cols-2">
        <div className="bg-bg p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ok">Pros</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed">
            {pros.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-ok" />
                <span>{item}</span>
              </li>
            ))}
            {pros.length === 0 ? <li className="text-faint">—</li> : null}
          </ul>
        </div>
        <div className="bg-bg p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-warn">Cons</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed">
            {cons.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span aria-hidden className="mt-[9px] h-px w-3 shrink-0 bg-warn" />
                <span>{item}</span>
              </li>
            ))}
            {cons.length === 0 ? <li className="text-faint">—</li> : null}
          </ul>
        </div>
      </div>
      {idealFor.length > 0 ? (
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
            Ideal for
          </span>
          {idealFor.map((item) => (
            <span
              key={item}
              className="rounded-full border border-edge bg-surface px-3 py-1 text-xs text-dim"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
