'use strict';
import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#050811] pt-8 sm:pt-10 pb-6 px-3.5 sm:px-6 lg:px-8 mt-auto text-xs">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        
        {/* Top Grid: Brand & Categorized SEO Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          
          {/* Brand Info (Cols 1-2) */}
          <div className="lg:col-span-2 space-y-3">
            <Logo />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              UpPitch is the #1 AI-powered proposal generator and portfolio proof assistant for top 1% freelancers, agencies, and technical consultants. Win high-ticket Upwork contracts and cold outreach in seconds.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>100% Private: Stored locally in your browser</span>
            </div>
          </div>

          {/* Col 3: Supported Channels */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
              SUPPORTED CHANNELS
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Upwork Cover Letters
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Cold Email Sequences
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                LinkedIn InMail Pitches
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Twitter / X Outreach DMs
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                RFP &amp; Contract Proposals
              </li>
            </ul>
          </div>

          {/* Col 4: Core Capabilities */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
              AI CAPABILITIES
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Problem-First Opening Hook
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Proof &amp; Case Study Ranking
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Dual Strategic Angles (A/B)
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Low-Friction Loom CTAs
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Skill Tag Autocomplete (80+)
              </li>
            </ul>
          </div>

          {/* Col 5: Freelancer Resources */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
              GOLDEN RULES
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Lead with the Bottleneck
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Quote Exact Tech Metrics
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Keep Under 180 Words
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Replace Calendly with Loom
              </li>
              <li className="hover:text-indigo-300 transition-colors cursor-default">
                Zero Generic Salutations
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/[0.08] text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} UpPitch AI. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <span>Built with precision for freelancers by</span>
            <span className="font-bold text-slate-300 hover:text-white transition-colors cursor-pointer">
              Hammad
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
