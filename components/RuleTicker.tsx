'use strict';
import React, { useState, useEffect, memo } from 'react';

const RULES = [
  'Rule 1 (160-Char Hook): First sentence must state root cause and fix before any general claims.',
  'Rule 2 (Outcome-First Bullets): Keep 3 scannable plain bullets (• Audit:, • Fix:, • Verify:).',
  'Rule 3 (Micro-Action CTA): Offer an immediate low-friction step (quick 5-min review or code snippet).',
  'Rule 4 (Concise Density): Keep total proposal strictly under 140 words. Clients scan on mobile.',
  'Rule 5 (Verified Proof): Anchor credibility with 1 specific metric or project from your vault.',
  'Rule 6 (Zero AI Fluff): Never open with "Dear Hiring Manager" or generic pleasantries.',
];

export const RuleTicker: React.FC = memo(() => {
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % RULES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full border-y border-indigo-100 bg-white/70 backdrop-blur-sm py-2 sm:py-2.5 px-3.5 sm:px-6 lg:px-8 my-2 sm:my-3">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-xs">
        
        {/* Golden Rule Pill */}
        <div className="flex items-center gap-2 bg-white border border-indigo-100 rounded-full px-3.5 py-1.5 shadow-xs max-w-full sm:max-w-3xl overflow-hidden">
          <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.2 text-[9.5px] sm:text-[10px] font-bold text-amber-700 font-mono shrink-0">
            <span>💡</span> GOLDEN RULE
          </span>
          <span
            key={currentIdx}
            className="animate-slide-fade text-slate-700 font-medium truncate text-[11px] sm:text-xs"
          >
            {RULES[currentIdx]}
          </span>
          <div className="hidden md:flex items-center gap-1 pl-2 shrink-0">
            {RULES.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-150 ${
                  i === currentIdx ? 'bg-indigo-600 w-3' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 px-2.5 sm:px-3 py-1 text-[10px] text-slate-600 font-mono shrink-0">
          <span>Formula:</span>
          <span className="font-bold text-indigo-700 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> Top 1% Bids
          </span>
        </div>

      </div>
    </div>
  );
});

RuleTicker.displayName = 'RuleTicker';
