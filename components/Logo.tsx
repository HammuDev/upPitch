'use strict';
import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = true,
  size = 'md',
}) => {
  const iconSizes = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9 sm:h-10 sm:w-10',
    lg: 'h-11 w-11 sm:h-12 sm:w-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Icon Mark: Squircle with Indigo-to-Violet gradient & neon glow */}
      <div
        className={`relative flex ${iconSizes[size]} shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-lg shadow-indigo-500/25 border border-white/20 transition-transform hover:scale-105`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 text-white"
        >
          {/* Document Folded Base */}
          <path
            d="M5 19.5C5 18.1193 6.11929 17 7.5 17H18.5M5 19.5C5 20.8807 6.11929 22 7.5 22H18.5C19.0523 22 19.5 21.5523 19.5 21V5C19.5 3.89543 18.6046 3 17.5 3H7.5C6.11929 3 5 4.11929 5 5.5V19.5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          {/* Dynamic 45-degree Upward Growth Pitch Arrow */}
          <path
            d="M9 13L16 6M16 6H11.5M16 6V10.5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Subtle glowing highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/5 to-white/20 pointer-events-none" />
      </div>

      {/* Wordmark: Up (white) + Pitch (indigo-400) */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight text-white ${textSizes[size]}`}>
            Up<span className="text-indigo-400">Pitch</span>
          </span>
          {/* Pulsing indicator dot */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        </div>

        {showTagline && (
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 tracking-normal truncate">
            Smart Proposals for Upwork &amp; Outreach
          </span>
        )}
      </div>
    </div>
  );
};
