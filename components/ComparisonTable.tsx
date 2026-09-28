'use strict';
import React, { useState } from 'react';
import {
  Check,
  X,
  Zap,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Flame,
  Smartphone,
  Layers,
  Sliders,
  Eye,
  UserX,
} from 'lucide-react';

export const ComparisonTable: React.FC = React.memo(() => {
  const [activeTab, setActiveTab] = useState<'cards' | 'simulator' | 'matrix'>('cards');

  return (
    <section
      className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12"
      aria-labelledby="comparison-title"
    >
      {/* 1. Header with Subtle Glass Badge, High-End Typography & Tab Bar */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-[11px] font-semibold text-indigo-700 font-mono shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span>PROPOSAL BENCHMARK &amp; AUDIT</span>
        </div>

        <h2
          id="comparison-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          Why Generic ChatGPT Proposals Get{' '}
          <span className="bg-gradient-to-r from-rose-600 via-amber-600 to-indigo-600 bg-clip-text text-transparent">
            Rejected on Upwork
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Upwork hiring managers receive 50+ bids in under 20 minutes. Learn why generic AI gets archived in the 140-character mobile search preview, and how UpPitch engineers top 1% winning hooks.
        </p>

        {/* Responsive Segmented Control */}
        <div className="w-full max-w-xl mx-auto p-1 rounded-2xl border border-indigo-100 bg-white shadow-lg shadow-indigo-500/5 mt-4">
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2 sm:py-2.5 px-2 text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
                activeTab === 'cards'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Strategy Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2 sm:py-2.5 px-2 text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Client Inbox Teardown</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2 sm:py-2.5 px-2 text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sliders className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Feature Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TAB A: 3-WAY STRATEGY CARDS                              */}
      {/* ============================================================ */}
      {activeTab === 'cards' && (
        <div className="space-y-6 animate-slide-fade">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">

            {/* CARD 1: GENERIC CHATGPT (THE BOT REJECT) */}
            <div className="group rounded-2xl border border-rose-200 bg-white p-5 sm:p-6 space-y-5 shadow-lg shadow-rose-500/5 flex flex-col justify-between transition-all duration-300 hover:border-rose-300 hover:shadow-xl hover:-translate-y-1">
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-[11px] font-bold text-rose-700 font-mono">
                    <UserX className="h-3.5 w-3.5 text-rose-600" />
                    <span>Generic ChatGPT AI</span>
                  </div>
                  <span className="text-[10.5px] font-mono font-medium text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded border border-rose-200">
                    High Spam Risk
                  </span>
                </div>

                {/* Score & Meter Box */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-rose-600 font-mono tracking-tight">
                        &lt; 8%
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1.5 font-sans">reply rate</span>
                    </div>
                    <span className="text-[10.5px] font-mono font-semibold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      92% Archived
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-500 h-1.5 rounded-full w-[12%]"></div>
                  </div>

                  <p className="text-[11.5px] text-slate-600 leading-snug">
                    Clients spot generic greeting fluff in 2 seconds and archive without opening the bid.
                  </p>
                </div>

                {/* Feature Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                    <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Robotic Opening Hook</span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        &quot;Dear Hiring Manager, I am thrilled to apply...&quot; (wastes the 140-char search preview)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                    <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Hallucinated Buzzwords</span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Vague claims with zero real project revenue numbers, speed metrics, or case studies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                    <X className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">High Friction Call-to-Action</span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Demands a 30-minute Zoom call immediately instead of proposing a low-friction fix.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Meta */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Draft: 3-5 min
                </span>
                <span className="text-rose-600 font-semibold">Low Conversion</span>
              </div>
            </div>

            {/* CARD 2: UPPITCH ENGINE (THE TOP 1% WINNER) */}
            <div className="group relative rounded-2xl border-2 border-indigo-500 bg-white p-5 sm:p-6 space-y-5 shadow-2xl shadow-indigo-500/15 flex flex-col justify-between lg:-translate-y-2 transition-all duration-300 hover:border-indigo-600 hover:shadow-indigo-500/25">
              {/* Floating Top Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 px-3.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-white shadow-md font-mono flex items-center gap-1.5 whitespace-nowrap">
                <Flame className="h-3.5 w-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                <span>TOP 1% WINNING ENGINE</span>
              </div>

              <div className="space-y-4 pt-1">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-700 font-mono">
                    <Zap className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
                    <span>UpPitch Proposal Engine</span>
                  </div>
                  <span className="text-[10.5px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                    Human Flow Verified
                  </span>
                </div>

                {/* Score & Meter Box */}
                <div className="rounded-xl bg-indigo-50/70 border border-indigo-200 p-3.5 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-indigo-900 font-mono tracking-tight">
                        34.8%
                      </span>
                      <span className="text-[11px] text-emerald-700 font-bold ml-1.5 font-sans">avg. reply rate</span>
                    </div>
                    <span className="text-[10.5px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      4.3x Higher
                    </span>
                  </div>

                  <div className="w-full bg-indigo-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 via-emerald-500 to-emerald-400 h-1.5 rounded-full w-[85%] animate-pulse"></div>
                  </div>

                  <p className="text-[11.5px] text-indigo-900 leading-snug font-medium">
                    Hooks hiring managers in the first sentence within Upwork&apos;s 140-character search preview.
                  </p>
                </div>

                {/* Feature Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <div>
                      <span className="font-semibold text-slate-900 block">Problem-First Technical Hook</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Immediate diagnosis of their exact bug and turnaround time in the opening line.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <div>
                      <span className="font-semibold text-slate-900 block">Auto-Injected Proof</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Selects matching project metrics from your personal bank ($1.5M processed, 99.9% uptime).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-50/40 border border-indigo-100">
                    <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                    <div>
                      <span className="font-semibold text-slate-900 block">Low-Friction Loom Video CTA</span>
                      <p className="text-[11px] text-slate-600 leading-snug">
                        Offers a 3-minute video breakdown with zero high-pressure call scheduling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Meta */}
              <div className="pt-4 border-t border-indigo-100 flex items-center justify-between text-[11px] text-indigo-700 font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                  <Zap className="h-3.5 w-3.5 text-indigo-600" /> Speed: &lt; 10s
                </span>
                <span className="text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  Interviews Won
                </span>
              </div>
            </div>

            {/* CARD 3: MANUAL 45-MIN DRAFTING */}
            <div className="group rounded-2xl border border-amber-200 bg-white p-5 sm:p-6 space-y-5 shadow-lg shadow-amber-500/5 flex flex-col justify-between transition-all duration-300 hover:border-amber-300 hover:shadow-xl hover:-translate-y-1">
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-[11px] font-bold text-amber-700 font-mono">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span>45-Min Manual Bidding</span>
                  </div>
                  <span className="text-[10.5px] font-mono font-medium text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-200">
                    High Burnout
                  </span>
                </div>

                {/* Score & Meter Box */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-amber-700 font-mono tracking-tight">
                        12-15%
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1.5 font-sans">reply rate</span>
                    </div>
                    <span className="text-[10.5px] font-mono font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                      Slow Turnaround
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-1.5 rounded-full w-[35%]"></div>
                  </div>

                  <p className="text-[11.5px] text-slate-600 leading-snug">
                    High quality, but misses the critical 20-minute client hiring window.
                  </p>
                </div>

                {/* Feature Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Misses Speed Advantage</span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Takes 35-45 minutes while faster competitors bid and get shortlisted first.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Portfolio Search Fatigue</span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Requires searching past Google Docs, Notion pages, and GitHub repos manually.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/60 border border-slate-100">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Freelancer Burnout</span>
                      <p className="text-[11px] text-slate-500 leading-snug">
                        Mentally draining to maintain 5+ customized bids every day alongside project work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Meta */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" /> Draft: 45 min
                </span>
                <span className="text-amber-700 font-semibold">Max 2-3 Bids / Day</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. TAB B: UPWORK INBOX SIMULATOR                             */}
      {/* ============================================================ */}
      {activeTab === 'simulator' && (
        <div className="rounded-2xl border border-indigo-100 bg-white p-4 sm:p-7 space-y-6 animate-slide-fade shadow-xl shadow-indigo-500/5">

          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-0.5 text-[11px] font-bold text-indigo-700 font-mono">
              <Eye className="h-3 w-3" />
              <span>UPWORK HIRING DASHBOARD SIMULATION</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              What the Client Sees in the Critical 140-Character Search Preview
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When clients scan proposals on the Upwork mobile app, only the first 140 characters appear before clicking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

            {/* REJECTED BID */}
            <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 sm:p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-rose-200">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    <span className="text-xs font-bold text-rose-800 font-mono">
                      GENERIC CHATGPT BID
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                    ARCHIVED IN 2 SECONDS
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>First 140 Characters:</span>
                    <span className="text-rose-600 font-semibold">0% Problem Solved</span>
                  </div>
                  <p className="text-xs font-mono text-rose-800 leading-relaxed bg-rose-50 p-2.5 rounded-lg border border-rose-200 line-through">
                    &quot;Dear Hiring Manager, I am writing to express my strong interest in your Next.js project. I have 8+ years of experience in building...&quot;
                  </p>
                  <p className="text-[11px] text-slate-500 italic">
                    ⚠️ Client scrolls past because the preview burns valuable space on polite generic filler.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-rose-200 flex items-center justify-between text-[11px] font-mono text-rose-700 font-semibold">
                <span>Client Status: Archived</span>
                <span>0 Interviews Won</span>
              </div>
            </div>

            {/* WINNING BID */}
            <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-4 sm:p-5 space-y-4 flex flex-col justify-between shadow-md">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-800 font-mono">
                      UPPITCH PROBLEM-FIRST PITCH
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    INTERVIEW SENT &amp; HIRED
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700">
                    <span>First 140 Characters:</span>
                    <span className="text-emerald-700 font-bold">100% Technical Match</span>
                  </div>
                  <p className="text-xs font-mono text-emerald-900 leading-relaxed bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 font-semibold">
                    &quot;Saw the duplicate Stripe billing race condition in your Next.js API. Can lock Redis idempotency keys within 24h. Processed $1.5M with 0 drops.&quot;
                  </p>
                  <p className="text-[11px] text-emerald-800 font-medium">
                    ⚡ Client immediately clicks into the proposal because the exact solution is in line 1.
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200 flex items-center justify-between text-[11px] font-mono text-emerald-800 font-bold">
                <span>Client Status: Interview Booked</span>
                <span>34.8% Reply Rate</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. TAB C: FULL FEATURE MATRIX TABLE                          */}
      {/* ============================================================ */}
      {activeTab === 'matrix' && (
        <div className="rounded-2xl border border-indigo-100 bg-white p-4 sm:p-6 space-y-4 animate-slide-fade shadow-xl shadow-indigo-500/5 overflow-hidden">

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-mono text-[10.5px] sm:text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 font-semibold text-slate-900">Feature &amp; Metric</th>
                  <th className="py-3 px-3 font-semibold text-rose-600">Generic ChatGPT</th>
                  <th className="py-3 px-3 font-semibold text-indigo-700 bg-indigo-50/70 rounded-t-xl border-x border-indigo-200">
                    ⚡ UpPitch Engine
                  </th>
                  <th className="py-3 px-3 font-semibold text-amber-700">Manual 45-Min</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-medium text-slate-900">
                    <strong>Opening Hook Strategy</strong>
                    <p className="text-[11px] text-slate-500">Mobile search preview fit</p>
                  </td>
                  <td className="py-3.5 px-3 text-rose-600">
                    <span className="inline-flex items-center gap-1">
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0" /> Generic greeting fluff
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-indigo-900 font-semibold bg-indigo-50/70 border-x border-indigo-200">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 font-bold" /> Direct technical diagnosis
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-amber-700">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Custom but slow
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-medium text-slate-900">
                    <strong>Proof &amp; Metrics Matching</strong>
                    <p className="text-[11px] text-slate-500">Past work relevance</p>
                  </td>
                  <td className="py-3.5 px-3 text-rose-600">
                    <span className="inline-flex items-center gap-1">
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0" /> Hallucinated generic claims
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-indigo-900 font-semibold bg-indigo-50/70 border-x border-indigo-200">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 font-bold" /> Auto-matches project bank
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-amber-700">
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Manual link digging
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-3 font-medium text-slate-900">
                    <strong>Call-to-Action (CTA)</strong>
                    <p className="text-[11px] text-slate-500">Client response friction</p>
                  </td>
                  <td className="py-3.5 px-3 text-rose-600">
                    <span className="inline-flex items-center gap-1">
                      <X className="h-3.5 w-3.5 text-rose-500 shrink-0" /> Demands 30m Zoom
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-indigo-900 font-semibold bg-indigo-50/70 border-x border-indigo-200">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 font-bold" /> Low-friction 3-min Loom
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-amber-700">
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Inconsistent CTA
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 5. RESPONSIVE METRIC TILES                                   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        <div className="rounded-2xl border border-indigo-100 bg-white p-4 text-center space-y-1.5 transition-all duration-300 hover:border-indigo-300 hover:-translate-y-1 shadow-sm">
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono flex items-center justify-center gap-1">
            <span className="text-indigo-600">140</span> chars
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Upwork Mobile Preview</p>
          <span className="inline-block text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono font-semibold">
            Line 1 Priority
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-white p-4 text-center space-y-1.5 transition-all duration-300 hover:border-emerald-300 hover:-translate-y-1 shadow-sm">
          <div className="text-xl sm:text-2xl font-black text-emerald-600 font-mono flex items-center justify-center gap-1">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            34.8%
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Average Reply Rate</p>
          <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-mono font-semibold">
            4.3x Above ChatGPT
          </span>
        </div>

        <div className="rounded-2xl border border-indigo-100 bg-white p-4 text-center space-y-1.5 transition-all duration-300 hover:border-indigo-300 hover:-translate-y-1 shadow-sm">
          <div className="text-xl sm:text-2xl font-black text-indigo-600 font-mono flex items-center justify-center gap-1">
            <Zap className="h-5 w-5 text-indigo-600 fill-indigo-600" />
            &lt; 10s
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Generation Speed</p>
          <span className="inline-block text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-mono font-semibold">
            First-Mover Edge
          </span>
        </div>

        <div className="rounded-2xl border border-purple-100 bg-white p-4 text-center space-y-1.5 transition-all duration-300 hover:border-purple-300 hover:-translate-y-1 shadow-sm">
          <div className="text-xl sm:text-2xl font-black text-purple-600 font-mono flex items-center justify-center gap-1">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            100%
          </div>
          <p className="text-[11px] text-slate-500 font-medium">Zero Generic Fluff</p>
          <span className="inline-block text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded font-mono font-semibold">
            Human Flow Standard
          </span>
        </div>

      </div>

    </section>
  );
});

ComparisonTable.displayName = 'ComparisonTable';
