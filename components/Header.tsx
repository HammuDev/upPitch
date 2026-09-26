'use strict';
import React, { memo } from 'react';
import { SlidersHorizontal, Clock } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = memo(({
  historyCount,
  onOpenHistory,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#050811]/95">
      <div className="mx-auto flex h-14 sm:h-15 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
        
        {/* Left: UpPitch SVG Logo */}
        <Logo showTagline={true} />

        {/* Center Tagline (desktop) */}
        <div className="hidden lg:block text-xs font-medium text-slate-400">
          Turn job briefs into winning bids in <span className="font-bold text-indigo-400">10s</span>
        </div>

        {/* Right: Actions (History + API Settings only) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition-colors duration-150 shadow-2xs shrink-0"
            title="View Proposal History"
          >
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Export / History</span>
            <span className="sm:hidden">History</span>
            <span className="rounded-full bg-indigo-500/20 px-1.5 py-0.2 text-[10px] text-indigo-300 font-mono font-bold">
              {historyCount}
            </span>
          </button>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] hover:text-white transition-colors duration-150 shadow-2xs shrink-0"
            title="Google Gemini API Settings"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">API Settings</span>
            <span className="sm:hidden">Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
});

Header.displayName = 'Header';
