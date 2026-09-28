'use strict';
import React, { memo } from 'react';
import { SlidersHorizontal, Clock, Sparkles } from 'lucide-react';
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
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-100/80 bg-white/85 backdrop-blur-xl transition-all duration-200 shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8">
        
        {/* Left: UpPitch SVG Logo */}
        <Logo showTagline={true} />

        {/* Center: Navigation Links (matching template) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-700">
          <button
            type="button"
            onClick={() => scrollTo('workspace')}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-150 py-1"
          >
            Proposal Engine
          </button>
          <button
            type="button"
            onClick={() => scrollTo('purpose-built')}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-150 py-1"
          >
            Features
          </button>
          <button
            type="button"
            onClick={() => scrollTo('conversion-framework')}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-150 py-1"
          >
            Framework
          </button>
          <button
            type="button"
            onClick={() => scrollTo('testimonials')}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-150 py-1"
          >
            Results
          </button>
          <button
            type="button"
            onClick={() => scrollTo('faq')}
            className="cursor-pointer hover:text-indigo-600 transition-colors duration-150 py-1"
          >
            FAQ
          </button>
        </nav>

        {/* Right: Actions (Export / History & API Settings) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="cursor-pointer inline-flex items-center gap-1.5 sm:gap-2 rounded-xl border border-indigo-100 bg-white px-3 sm:px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-all duration-150 shadow-xs shrink-0 active:scale-95"
            title="View Proposal History"
          >
            <Clock className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="hidden sm:inline">Export / History</span>
            <span className="sm:hidden">History</span>
            <span className="rounded-full bg-indigo-100 px-1.5 py-0.2 text-[10px] text-indigo-700 font-mono font-bold">
              {historyCount}
            </span>
          </button>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 sm:px-3.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 hover:border-indigo-400 transition-all duration-150 shadow-xs shrink-0 active:scale-95"
            title="Google Gemini API Settings"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span className="hidden sm:inline">API Settings</span>
            <span className="sm:hidden">Settings</span>
          </button>
        </div>

      </div>
    </header>
  );
});

Header.displayName = 'Header';
