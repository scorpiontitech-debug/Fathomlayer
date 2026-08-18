export function RightToRepairTicker() {
  const UPDATES = [
    "EU mandates user-replaceable smartphone batteries by 2027",
    "Apple opens parts pairing for third-party repairs under pressure",
    "US DOJ sues Apple for smartphone monopoly and lock-in practices",
    "Google extends Pixel support to 7 years, setting new standard",
    "Colorado passes comprehensive Right to Repair legislation",
    "Matter 1.3 protocol adds support for EV chargers and appliances",
  ];

  return (
    <div className="w-full bg-[#111113] border-y border-edge py-3 overflow-hidden">
      <div className="flex whitespace-nowrap marquee">
        <div className="marquee-track flex gap-8 items-center text-xs font-mono uppercase tracking-[0.14em] text-faint">
          {/* Duplicate the list to create an infinite scroll illusion */}
          {[...UPDATES, ...UPDATES].map((update, i) => (
            <div key={i} className="flex items-center gap-8">
              <span>{update}</span>
              <span className="w-1.5 h-1.5 bg-accent-bright/50 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
