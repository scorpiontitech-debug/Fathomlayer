import { CheckCircle2, DollarSign, Plug, Sparkles } from "lucide-react";

type MatrixItem = {
  title: string;
  price_from: number | null;
  integrations: string[] | null;
  key_features: string[] | null;
};

export function DecisionMatrix({ itemA, itemB }: { itemA: MatrixItem; itemB: MatrixItem }) {
  // Budget Winner
  let budgetWinner = "Tie";
  if (itemA.price_from !== null && itemB.price_from !== null) {
    if (itemA.price_from < itemB.price_from) budgetWinner = itemA.title;
    else if (itemB.price_from < itemA.price_from) budgetWinner = itemB.title;
  } else if (itemA.price_from === 0 || itemB.price_from === 0) {
    budgetWinner = itemA.price_from === 0 ? itemA.title : itemB.title;
  }

  // Ecosystem Winner (Integrations)
  let ecosystemWinner = "Tie";
  const intA = itemA.integrations?.length || 0;
  const intB = itemB.integrations?.length || 0;
  if (intA > intB) ecosystemWinner = itemA.title;
  else if (intB > intA) ecosystemWinner = itemB.title;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-12">
      {/* Budget Card */}
      <div className="rounded-xl border border-edge bg-surface p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
          <DollarSign className="w-16 h-16 text-accent" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint mb-1">Budget Winner</p>
        <p className="font-display text-2xl font-semibold text-ink">{budgetWinner}</p>
        <p className="text-sm text-dim mt-2">Based on starting monthly price.</p>
      </div>

      {/* Ecosystem Card */}
      <div className="rounded-xl border border-edge bg-surface p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
          <Plug className="w-16 h-16 text-accent" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint mb-1">Best Ecosystem</p>
        <p className="font-display text-2xl font-semibold text-ink">{ecosystemWinner}</p>
        <p className="text-sm text-dim mt-2">
          {intA > 0 || intB > 0 ? `Connects with more native platforms.` : `Neither has native integrations listed.`}
        </p>
      </div>

      {/* Unique Features Card */}
      <div className="rounded-xl border border-edge bg-surface p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
          <Sparkles className="w-16 h-16 text-accent" />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint mb-1">Unique Edge</p>
        <ul className="mt-2 space-y-1">
          {itemA.key_features?.[0] && (
            <li className="flex items-start text-sm text-dim">
              <CheckCircle2 className="w-4 h-4 text-accent mr-2 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{itemA.title}: {itemA.key_features[0]}</span>
            </li>
          )}
          {itemB.key_features?.[0] && (
            <li className="flex items-start text-sm text-dim">
              <CheckCircle2 className="w-4 h-4 text-accent mr-2 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{itemB.title}: {itemB.key_features[0]}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
