import React, { memo } from 'react';
import { XCircle, AlertTriangle, CheckCircle2, Sparkles, Clock, Zap, ShieldAlert, Trophy } from 'lucide-react';

export const ComparisonSection: React.FC = memo(() => {
  return (
    <section
      id="comparison"
      className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-10 scroll-mt-20 relative z-10"
      aria-labelledby="comparison-title"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-700 font-mono">
          <ShieldAlert className="h-3.5 w-3.5 text-rose-600" />
          <span>The Bidding Reality</span>
        </div>

        <h2
          id="comparison-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          Why Generic ChatGPT Proposals Get{' '}
          <span className="bg-gradient-to-r from-rose-500 via-red-600 to-orange-600 bg-clip-text text-transparent">
            Rejected on Upwork
          </span>
        </h2>

        <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Clients review 50+ proposals in under 2 minutes and archive robotic templates in the first 5 seconds. Here is why UpPitch outperforms generic AI.
        </p>
      </div>

      {/* 3 Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        
        {/* ========================================================= */}
        {/* CARD 1: GENERIC CHATGPT / BASIC AI                       */}
        {/* ========================================================= */}
        <div className="rounded-3xl border border-rose-100 bg-white p-6 sm:p-8 space-y-6 shadow-lg shadow-rose-500/5 card-hover-lift flex flex-col justify-between relative">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600">
                <XCircle className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-[11px] font-bold text-rose-700">
                Low Reply Rate
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">Generic ChatGPT</h3>
              <p className="text-xs text-slate-500 font-normal">Basic GPT-4 / Copy-paste templates</p>
            </div>

            <ul className="space-y-3 pt-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Starts with robotic fluff: <em>&ldquo;Dear Hiring Manager, I am thrilled to apply...&rdquo;</em></span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Zero real project proof, verified metrics, or case studies</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Wastes the crucial 140-character mobile search preview</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Easily detected by clients as automated spam</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Result:</span>
            <span className="font-bold text-rose-600">Archived Quickly</span>
          </div>

        </div>

        {/* ========================================================= */}
        {/* CARD 2: MANUAL PROPOSALS (SLOW & EXHAUSTING)             */}
        {/* ========================================================= */}
        <div className="rounded-3xl border border-amber-100 bg-white p-6 sm:p-8 space-y-6 shadow-lg shadow-amber-500/5 card-hover-lift flex flex-col justify-between relative">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-bold text-amber-700">
                Time-Intensive
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900">Manual Writing</h3>
              <p className="text-xs text-slate-500 font-normal">Typing from scratch every time</p>
            </div>

            <ul className="space-y-3 pt-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Takes 25 to 45 minutes per application, causing quick burnout</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Misses the golden 10-minute early submission window</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Tedious to search and copy past project links and proof</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Limits you to only 2-3 proposals per day</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Result:</span>
            <span className="font-bold text-amber-600">Low Volume, High Effort</span>
          </div>

        </div>

        {/* ========================================================= */}
        {/* CARD 3: UPPITCH AI (WINNER / RECOMMENDED)                 */}
        {/* ========================================================= */}
        <div className="rounded-3xl border-2 border-indigo-500 bg-gradient-to-b from-white via-indigo-50/20 to-white p-6 sm:p-8 space-y-6 shadow-xl shadow-indigo-500/15 card-hover-lift flex flex-col justify-between relative transform lg:-translate-y-2">
          
          {/* Top Pill Winner Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
            <Trophy className="h-3 w-3 text-amber-300" />
            <span>Recommended Winner</span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-700 font-mono">
                High Relevance
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>UpPitch AI Engine</span>
                <Zap className="h-4 w-4 text-indigo-600 fill-indigo-600" />
              </h3>
              <p className="text-xs text-indigo-600 font-semibold">Purpose-Built for High-Ticket Bids</p>
            </div>

            <ul className="space-y-3 pt-2 text-xs text-slate-700 leading-relaxed font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Instant First Sentence Hook:</strong> Zero fluff, immediate technical diagnosis</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Project Bank Integration:</strong> Automatically weaves in your relevant case studies</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Fast Generation:</strong> Apply quickly while the client is actively reading bids</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Platform-Tuned:</strong> Formatted specifically for Upwork, LinkedIn &amp; Outreach</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-indigo-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
            <span>Result:</span>
            <span className="font-extrabold text-indigo-700">Proof-Backed &amp; Relevant</span>
          </div>

        </div>

      </div>

      {/* Quick Summary Bar */}
      <div className="rounded-2xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-xs text-slate-500">Proposal Speed</p>
            <p className="text-lg sm:text-xl font-extrabold text-indigo-600 font-mono">Fast</p>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <p className="text-xs text-slate-500">Proof Matching</p>
            <p className="text-lg sm:text-xl font-extrabold text-emerald-600 font-mono">Automated</p>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <p className="text-xs text-slate-500">Mobile Hook</p>
            <p className="text-lg sm:text-xl font-extrabold text-indigo-600 font-mono">140-Char Tuned</p>
          </div>
          <div className="space-y-1 border-l border-slate-100">
            <p className="text-xs text-slate-500">Data Privacy</p>
            <p className="text-lg sm:text-xl font-extrabold text-slate-900 font-mono">Browser Storage</p>
          </div>
        </div>
      </div>

    </section>
  );
});

ComparisonSection.displayName = 'ComparisonSection';
