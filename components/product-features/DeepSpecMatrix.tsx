export function DeepSpecMatrix({ specs }: { specs?: any }) {
  if (!specs || Object.keys(specs).length === 0) return null;

  return (
    <div className="rounded-xl border border-edge bg-surface/50 overflow-hidden">
      <div className="border-b border-edge bg-edge-strong/30 p-6">
        <h3 className="font-display text-xl font-semibold tracking-tight text-strong">
          Deep Technical Specs
        </h3>
      </div>
      <div className="divide-y divide-edge">
        {Object.entries(specs).map(([key, value]) => {
          // If value is an object, we can format it nested, but for now we'll stringify or handle flat.
          let displayValue = "";
          if (typeof value === "object" && value !== null) {
            displayValue = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(" • ");
          } else {
            displayValue = String(value);
          }

          // Format key: "polling_rate" -> "Polling Rate"
          const displayKey = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

          return (
            <div key={key} className="flex flex-col sm:flex-row sm:items-baseline p-4 hover:bg-white/5 transition-colors">
              <div className="sm:w-1/3 font-mono text-xs uppercase tracking-widest text-faint mb-1 sm:mb-0">
                {displayKey}
              </div>
              <div className="sm:w-2/3 text-sm text-dim leading-relaxed">
                {displayValue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
