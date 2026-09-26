'use strict';
import React, { useState, memo } from 'react';
import { Zap, ArrowRight, Copy, Check } from 'lucide-react';
import { HistoryItem } from '@/types';

interface RecentPitchesProps {
  history: HistoryItem[];
  onOpenHistory: () => void;
  onLoadPitch: (item: HistoryItem) => void;
}

export const RecentPitches: React.FC<RecentPitchesProps> = memo(({
  history,
  onOpenHistory,
  onLoadPitch,
}) => {
  const recentThree = history.slice(0, 3);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.pitchText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-2 sm:py-3">
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F1A] p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 shadow-xl">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
              RECENT PROPOSALS
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenHistory}
            className="cursor-pointer inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors duration-150"
          >
            <span>Open full history</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Body */}
        {recentThree.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/[0.06] bg-[#070A14]/60 p-5 sm:p-6 text-center">
            <p className="text-xs text-slate-400">
              Your last three generated proposals will appear here with one-click copy.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentThree.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/[0.06] bg-[#070A14] p-3 sm:p-3.5 space-y-2 flex flex-col justify-between hover:border-indigo-500/40 transition-colors duration-150 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                      {item.channel}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {item.pitchText}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => onLoadPitch(item)}
                    className="cursor-pointer text-[11px] text-slate-400 hover:text-white font-medium transition-colors duration-150"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className={`cursor-pointer inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-[11px] font-semibold transition-all duration-150 ${
                      copiedId === item.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white/[0.04] text-indigo-300 hover:bg-white/[0.08] hover:text-white'
                    }`}
                  >
                    {copiedId === item.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
});

RecentPitches.displayName = 'RecentPitches';
