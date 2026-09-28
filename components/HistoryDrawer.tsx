'use strict';
import React, { useState } from 'react';
import { X, Clock, Copy, ArrowUpRight, Check } from 'lucide-react';
import { HistoryItem } from '@/types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onLoadPitch: (item: HistoryItem) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = React.memo(({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onLoadPitch,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.pitchText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="cursor-pointer absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-indigo-100 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Proposal History</h3>
              <span className="rounded-full bg-indigo-100 px-2 py-0.2 text-[10px] font-bold text-indigo-700 font-mono">
                {history.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={onClearHistory}
                  className="cursor-pointer text-xs text-rose-600 hover:underline mr-1 sm:mr-2 font-medium"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-16 space-y-2 text-slate-500">
                <p className="text-xs">No proposals saved yet.</p>
                <p className="text-[11px] text-slate-400">
                  Every pitch you generate in UpPitch will be automatically preserved here.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 space-y-2.5 shadow-2xs card-hover-lift"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="rounded bg-indigo-100 border border-indigo-200 px-2 py-0.5 text-indigo-700 uppercase font-bold">
                      {item.channel}
                    </span>
                    <span className="text-slate-400">{item.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-800 line-clamp-4 leading-relaxed whitespace-pre-line">
                    {item.pitchText}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadPitch(item);
                        onClose();
                      }}
                      className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <span>Load into Workspace</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(item)}
                      className={`cursor-pointer inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                        copiedId === item.id
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {copiedId === item.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
});

HistoryDrawer.displayName = 'HistoryDrawer';
