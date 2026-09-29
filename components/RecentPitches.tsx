'use client';
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
      <div className="rounded-2xl border border-indigo-100 bg-white p-3.5 sm:p-5 space-y-3 shadow-xl shadow-indigo-500/5">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-600" />
            <span className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              RECENT PROPOSALS
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenHistory}
            className="cursor-pointer inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-150"
          >
            <span>Open full history</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Body */}
        {recentThree.length === 0 ? (
          <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/20 p-5 sm:p-6 text-center">
            <p className="text-xs text-slate-500">
              Your last three generated proposals will appear here with one-click copy.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentThree.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:p-3.5 space-y-2 flex flex-col justify-between hover:border-indigo-300 hover:bg-white transition-all duration-150 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 border border-indigo-200 font-mono">
                      {item.channel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
                    {item.pitchText}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => onLoadPitch(item)}
                    className="cursor-pointer text-[11px] text-slate-600 hover:text-indigo-600 font-medium transition-colors duration-150"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(item)}
                    className={`cursor-pointer inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 ${
                      copiedId === item.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-indigo-700 hover:bg-indigo-50 shadow-2xs'
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
