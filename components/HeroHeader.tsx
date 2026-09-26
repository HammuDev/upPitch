'use strict';
import React from 'react';
import { ShieldCheck, Zap, TrendingUp } from 'lucide-react';

interface HeroHeaderProps {
  savedPitchesCount: number;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ savedPitchesCount }) => {
  return (
    <section className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-1 sm:pb-2" aria-labelledby="hero-title">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 sm:gap-5">
        
        {/* Left: Main Heading & Value Proposition */}
        <div className="max-w-2xl space-y-2.5 sm:space-y-3 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-300 font-mono shadow-xs hover:border-indigo-500/50 transition-colors">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-radar shrink-0" />
            <span>#1 AI Proposal Writer &amp; Portfolio Proof Engine</span>
          </div>

          <h1
            id="hero-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight"
          >
            Win high-ticket Upwork contracts &amp; client bids in{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent animate-text-gradient">
              10 seconds
            </span>
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed max-w-xl">
            UpPitch analyzes the client&apos;s exact technical bottleneck, matches your verified project proof, and generates high-converting proposals guaranteed to hook clients in sentence 1.
          </p>
        </div>

        {/* Right: Key Trust & Benefit Pills */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] sm:text-xs text-slate-200 shadow-2xs hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all duration-300 card-hover-lift cursor-default">
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>34.8% Avg. Reply Rate</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] sm:text-xs text-slate-200 shadow-2xs hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all duration-300 card-hover-lift cursor-default">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>100% Problem-First Opening</span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] sm:text-xs text-slate-200 shadow-2xs hover:border-indigo-500/40 hover:bg-white/[0.06] transition-all duration-300 card-hover-lift cursor-default">
            <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>{savedPitchesCount} Proposals Synthesized</span>
          </div>
        </div>

      </div>
    </section>
  );
};
