// @ts-nocheck
"use client";

import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Server, Cloud, Zap, ArrowRight } from "lucide-react";

export function CloudVsLocalClient() {
  const [hardwareCost, setHardwareCost] = useState(3000);
  const [electricityCostPerMonth, setElectricityCostPerMonth] = useState(15);
  const [cloudSubscriptionMonthly, setCloudSubscriptionMonthly] = useState(40); // e.g. 2x $20 subs
  const [apiUsageMonthly, setApiUsageMonthly] = useState(150); // e.g. lots of code generation tokens

  // Generate 60 months (5 years) of data
  const data = useMemo(() => {
    let cloudTotal = 0;
    let localTotal = hardwareCost;
    
    const chartData = [];
    for (let month = 0; month <= 60; month++) {
      chartData.push({
        month: month === 0 ? "Now" : `Mo ${month}`,
        rawMonth: month,
        CloudCost: cloudTotal,
        LocalCost: localTotal,
      });

      // Increment for next month
      cloudTotal += cloudSubscriptionMonthly + apiUsageMonthly;
      localTotal += electricityCostPerMonth;
    }
    return chartData;
  }, [hardwareCost, electricityCostPerMonth, cloudSubscriptionMonthly, apiUsageMonthly]);

  // Calculate Break Even Point
  const monthlyCloudCost = cloudSubscriptionMonthly + apiUsageMonthly;
  const breakEvenMonth = monthlyCloudCost > electricityCostPerMonth 
    ? hardwareCost / (monthlyCloudCost - electricityCostPerMonth)
    : Infinity;
    
  const format = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-4 space-y-8 bg-surface/30 p-8 rounded-2xl border border-edge">
        
        {/* Local Hardware Costs */}
        <div>
          <h3 className="font-display font-semibold text-lg flex items-center gap-2 mb-4 text-ink">
            <Server className="w-5 h-5 text-accent" /> Local Build Setup
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-widest text-faint">Hardware Cost (Upfront)</label>
                <span className="font-mono text-accent">{format(hardwareCost)}</span>
              </div>
              <input 
                type="range" min="500" max="15000" step="100"
                value={hardwareCost} onChange={(e) => setHardwareCost(parseInt(e.target.value))}
                className="w-full h-1 bg-subtle rounded-full appearance-none cursor-pointer accent-accent"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-widest text-faint">Electricity/Maintenance (Mo)</label>
                <span className="font-mono text-accent">{format(electricityCostPerMonth)}</span>
              </div>
              <input 
                type="range" min="0" max="200" step="5"
                value={electricityCostPerMonth} onChange={(e) => setElectricityCostPerMonth(parseInt(e.target.value))}
                className="w-full h-1 bg-subtle rounded-full appearance-none cursor-pointer accent-accent"
              />
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-edge/50" />

        {/* Cloud Costs */}
        <div>
          <h3 className="font-display font-semibold text-lg flex items-center gap-2 mb-4 text-ink">
            <Cloud className="w-5 h-5 text-warn" /> Cloud AI Setup
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-widest text-faint">Subscriptions (Mo)</label>
                <span className="font-mono text-warn">{format(cloudSubscriptionMonthly)}</span>
              </div>
              <input 
                type="range" min="0" max="200" step="10"
                value={cloudSubscriptionMonthly} onChange={(e) => setCloudSubscriptionMonthly(parseInt(e.target.value))}
                className="w-full h-1 bg-subtle rounded-full appearance-none cursor-pointer accent-warn"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-widest text-faint">API Usage (Mo)</label>
                <span className="font-mono text-warn">{format(apiUsageMonthly)}</span>
              </div>
              <input 
                type="range" min="0" max="2000" step="50"
                value={apiUsageMonthly} onChange={(e) => setApiUsageMonthly(parseInt(e.target.value))}
                className="w-full h-1 bg-subtle rounded-full appearance-none cursor-pointer accent-warn"
              />
            </div>
          </div>
        </div>
        
        {/* Total Monthly Difference */}
        <div className="bg-subtle border border-edge rounded-xl p-5">
          <p className="text-xs font-mono uppercase tracking-widest text-dim mb-1">Total Monthly Cloud Burn</p>
          <p className="text-3xl font-mono text-warn mb-4">{format(monthlyCloudCost)}</p>
          <p className="text-xs text-faint">Every month you delay building local, you burn {format(monthlyCloudCost - electricityCostPerMonth)} compared to maintenance costs.</p>
        </div>

      </div>

      {/* Chart */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="bg-surface/50 border border-edge rounded-2xl p-6 flex-1 min-h-[500px] flex flex-col">
          
          {/* Verdict Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-edge gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ink">Deterministic Payoff</h2>
              <p className="text-sm text-dim mt-1">When does the local hardware pay for itself?</p>
            </div>
            
            <div className="flex items-center gap-4 bg-bg border border-edge px-5 py-3 rounded-xl">
              {breakEvenMonth === Infinity || breakEvenMonth > 60 ? (
                <span className="font-mono text-warn">No ROI within 5 years</span>
              ) : (
                <>
                  <div className="text-right">
                    <span className="block text-2xl font-mono text-ok leading-none">{Math.ceil(breakEvenMonth)} Mo</span>
                    <span className="block text-[10px] font-mono uppercase tracking-widest text-faint mt-1">Break-even</span>
                  </div>
                  <Zap className="w-6 h-6 text-ok" />
                </>
              )}
            </div>
          </div>

          <div className="flex-1 w-full h-full relative min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCloud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-warn)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-warn)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLocal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'monospace' }} 
                  tickMargin={10}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12, fontFamily: 'monospace' }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontFamily: 'monospace', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [format(value), '']}
                />
                <Area type="monotone" dataKey="CloudCost" name="Cumulative Cloud Cost" stroke="var(--color-warn)" strokeWidth={2} fillOpacity={1} fill="url(#colorCloud)" />
                <Area type="monotone" dataKey="LocalCost" name="Cumulative Local Cost" stroke="var(--color-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorLocal)" />
                
                {breakEvenMonth < 60 && (
                  <ReferenceLine x={`Mo ${Math.ceil(breakEvenMonth)}`} stroke="var(--color-ok)" strokeDasharray="3 3">
                  </ReferenceLine>
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
