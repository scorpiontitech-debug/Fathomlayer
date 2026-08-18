import React from 'react';
import { supabasePublic } from '@/lib/supabase/server';
import { Clock, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Hardware Lifecycle Tracker | Fathom Layer',
  description: 'Predictive timeline for hardware obsolescence and upcoming launches.',
};

export default async function LifecycleTrackerPage() {
  const supabase = supabasePublic();
  
  // Fetch launch radar data
  const { data: launches } = await supabase
    .from('editorial_pages')
    .select('id, title, expected_release_date, launch_confidence, body_markdown, slug')
    .eq('content_type', 'launch')
    .eq('status', 'published')
    .order('expected_release_date', { ascending: true });

  const activeLaunches = launches || [];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent selection:text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <Link href="/" className="font-mono text-xs uppercase tracking-widest text-dim hover:text-white transition-colors mb-2 block">
              ← Return to Fathom Layer
            </Link>
            <h1 className="text-3xl font-display font-bold uppercase tracking-tight">Lifecycle Tracker</h1>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="px-4 py-2 border border-white/10 bg-white/5 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-dim">Live Radar</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Intro Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 border border-white/10 bg-white/5 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Clock className="w-24 h-24" />
              </div>
              <h2 className="text-xl font-display font-semibold mb-4 text-accent-bright">Obsolescence Horizon</h2>
              <p className="text-dim text-sm leading-relaxed mb-6 font-mono">
                Hardware depreciates rapidly. This matrix tracks confirmed and heavily rumored silicon and systems, allowing you to time your capital expenditure accurately and avoid purchasing end-of-lifecycle architectures.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-xs font-mono uppercase text-dim">
                  <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/50" />
                  <span>High Confidence</span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono uppercase text-dim">
                  <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/50" />
                  <span>Rumored / Leaked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Column */}
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {activeLaunches.length === 0 ? (
                <div className="p-12 border border-dashed border-white/20 rounded-2xl text-center text-dim font-mono text-sm">
                  NO UPCOMING LAUNCHES DETECTED IN INDEX.
                </div>
              ) : (
                activeLaunches.map((launch) => {
                  const isHighConfidence = launch.launch_confidence === 'high' || launch.launch_confidence === 'confirmed';
                  const dateColor = isHighConfidence ? 'text-green-400' : 'text-yellow-400';
                  const borderColor = isHighConfidence ? 'border-green-500/30' : 'border-yellow-500/30';
                  const bgColor = isHighConfidence ? 'bg-green-500/5' : 'bg-yellow-500/5';

                  return (
                    <div key={launch.id} className={`group flex flex-col md:flex-row gap-6 p-6 border ${borderColor} ${bgColor} rounded-2xl hover:bg-white/5 transition-all duration-300 relative overflow-hidden`}>
                      {/* Date Block */}
                      <div className="md:w-48 flex-shrink-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className={`w-4 h-4 ${dateColor}`} />
                          <span className={`font-mono text-xs uppercase tracking-widest ${dateColor}`}>
                            {launch.launch_confidence}
                          </span>
                        </div>
                        <div className="font-display text-2xl font-bold">
                          {launch.expected_release_date ? new Date(launch.expected_release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : 'TBA'}
                        </div>
                      </div>

                      {/* Content Block */}
                      <div className="flex-1 flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-2 group-hover:text-accent-bright transition-colors">
                          {launch.title}
                        </h3>
                        <p className="text-dim text-sm line-clamp-2 leading-relaxed mb-4">
                          {launch.body_markdown?.substring(0, 150)}...
                        </p>
                      </div>
                      
                      {/* Action */}
                      <div className="md:w-12 flex items-center justify-end">
                        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
