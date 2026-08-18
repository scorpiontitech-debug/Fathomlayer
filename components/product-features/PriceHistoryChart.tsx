"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function PriceHistoryChart({ data, currency = "$" }: { data: { price: number, recorded_at: string }[], currency?: string }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-edge bg-surface/50 p-6 flex flex-col items-center justify-center min-h-[250px] text-faint h-full">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-2 opacity-50"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        <p className="font-mono text-xs uppercase tracking-widest">Pricing History Tracking Starting</p>
      </div>
    );
  }

  // format data
  const chartData = data.map(d => ({
    ...d,
    date: new Date(d.recorded_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="rounded-xl border border-edge bg-surface/50 p-6 h-full flex flex-col">
      <h3 className="font-display text-lg font-semibold tracking-tight text-strong mb-6 flex items-center gap-2">
        Price History
        <span className="rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent-bright uppercase">Tracker</span>
      </h3>
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis dataKey="date" stroke="#3e3e4a" fontSize={10} tickMargin={10} />
            <YAxis stroke="#3e3e4a" fontSize={10} tickFormatter={(val) => `${currency}${val}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0a0a0c', borderColor: '#2d2d3a', borderRadius: '8px' }}
              itemStyle={{ color: '#00ffcc', fontWeight: 600, fontFamily: 'monospace' }}
              formatter={(value: any) => [`${currency}${value}`, 'Price']}
            />
            <Line type="stepAfter" dataKey="price" stroke="#00ffcc" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#00ffcc' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
