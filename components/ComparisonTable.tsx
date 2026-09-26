'use strict';
import React, { useState } from 'react';
import {
  Check,
  X,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight,
  Smartphone,
  Layers,
  Sliders,
  CheckCircle2,
  XCircle,
  Eye,
  MessageSquare,
  ChevronRight,
  UserCheck,
  UserX,
  Target,
  FileCheck2,
  Lock,
} from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'simulator' | 'matrix'>('cards');
  const [activeCardView, setActiveCardView] = useState<'all' | 'uppitch' | 'chatgpt' | 'manual'>('all');

  return (
    <section
      className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8 sm:space-y-12"
      aria-labelledby="comparison-title"
    >
      {/* 1. Header with Subtle Glass Badge, High-End Typography & Tab Bar */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 px-3.5 py-1 text-[11px] font-semibold text-indigo-300 font-mono backdrop-blur-md shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
          </span>
          {/* <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> */}
          <span>PROPOSAL BENCHMARK &amp; AUDIT</span>
        </div>

        <h2
          id="comparison-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight"
        >
          Why Generic ChatGPT Proposals Get{' '}
          <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
            Rejected on Upwork
          </span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upwork hiring managers receive 50+ bids in under 20 minutes. Learn why generic AI gets archived in the 140-character mobile search preview, and how UpPitch engineers top 1% winning hooks.
        </p>

        {/* Responsive Segmented Control */}
        <div className="w-full max-w-xl mx-auto p-1 rounded-2xl border border-white/[0.08] bg-[#0A0E1A]/90 backdrop-blur-xl shadow-2xl mt-4">
          <div className="grid grid-cols-3 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('cards')}
              className={`cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2 sm:py-2.5 px-2 text-[11px] sm:text-xs font-semibold transition-all duration-300 ${activeTab === 'cards'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.01]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
            >
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Strategy Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2 sm:py-2.5 px-2 text-[11px] sm:text-xs font-semibold transition-all duration-300 ${activeTab === 'simulator'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.01]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
            >
              <Smartphone className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Client Inbox Teardown</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('matrix')}
              className={`cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl py-2 sm:py-2.5 px-2 text-[11px] sm:text-xs font-semibold transition-all duration-300 ${activeTab === 'matrix'
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.01]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
            >
              <Sliders className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Feature Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. TAB A: 3-WAY STRATEGY CARDS (RESPONSIVE & POLISHED)       */}
      {/* ============================================================ */}
      {activeTab === 'cards' && (
        <div className="space-y-6 animate-slide-fade">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">

            {/* CARD 1: GENERIC CHATGPT (THE BOT REJECT) */}
            <div className="group rounded-2xl border border-rose-500/20 bg-gradient-to-b from-[#120D15]/90 via-[#0B0E1A]/90 to-[#070A12] p-5 sm:p-6 space-y-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-rose-500/40 hover:shadow-2xl hover:shadow-rose-950/30 hover:-translate-y-1">
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 text-[11px] font-bold text-rose-300 font-mono">
                    <UserX className="h-3.5 w-3.5 text-rose-400" />
                    <span>Generic ChatGPT AI</span>
                  </div>
                  <span className="text-[10.5px] font-mono font-medium text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-900/40">
                    High Spam Risk
                  </span>
                </div>

                {/* Score & Meter Box */}
                <div className="rounded-xl bg-black/40 border border-white/[0.05] p-3.5 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-rose-400 font-mono tracking-tight">
                        &lt; 8%
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-sans">reply rate</span>
                    </div>
                    <span className="text-[10.5px] font-mono font-semibold text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded">
                      92% Archived
                    </span>
                  </div>

                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-500/80 h-1.5 rounded-full w-[12%]"></div>
                  </div>

                  <p className="text-[11.5px] text-slate-400 leading-snug">
                    Clients spot generic greeting fluff in 2 seconds and archive without opening the bid.
                  </p>
                </div>

                {/* Feature Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Robotic Opening Hook</span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        &quot;Dear Hiring Manager, I am thrilled to apply...&quot; (wastes the 140-char search preview)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Hallucinated Buzzwords</span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Vague claims with zero real project revenue numbers, speed metrics, or case studies.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">High Friction Call-to-Action</span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Demands a 30-minute Zoom call immediately instead of proposing a low-friction fix.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <X className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Fluff Text Wall</span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        350+ words of generic corporate jargon that hiring managers instantly skip.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Meta */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" /> Draft: 3-5 min
                </span>
                <span className="text-rose-400 font-semibold">Low Conversion</span>
              </div>
            </div>

            {/* CARD 2: UPPITCH ENGINE (THE TOP 1% WINNER - ELEVATED) */}
            <div className="group relative rounded-2xl border-2 border-indigo-500/60 bg-gradient-to-b from-[#11182E] via-[#0E1528] to-[#080C18] p-5 sm:p-6 space-y-5 shadow-2xl shadow-indigo-500/20 flex flex-col justify-between lg:-translate-y-2 transition-all duration-300 hover:border-indigo-400 hover:shadow-indigo-500/30">
              {/* Floating Top Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 px-3.5 py-1 text-[10.5px] font-extrabold uppercase tracking-wider text-white shadow-lg border border-white/20 font-mono flex items-center gap-1.5 whitespace-nowrap">
                <Flame className="h-3.5 w-3.5 text-amber-300 fill-amber-300 animate-pulse" />
                <span>TOP 1% WINNING ENGINE</span>
              </div>

              <div className="space-y-4 pt-1">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/35 px-2.5 py-1 text-[11px] font-bold text-emerald-300 font-mono">
                    <Zap className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
                    <span>UpPitch Proposal Engine</span>
                  </div>
                  <span className="text-[10.5px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/40">
                    Human Flow Verified
                  </span>
                </div>

                {/* Score & Meter Box */}
                <div className="rounded-xl bg-indigo-950/40 border border-indigo-500/30 p-3.5 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                        34.8%
                      </span>
                      <span className="text-[11px] text-emerald-400 font-bold ml-1.5 font-sans">avg. reply rate</span>
                    </div>
                    <span className="text-[10.5px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                      4.3x Higher
                    </span>
                  </div>

                  <div className="w-full bg-white/[0.08] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-emerald-300 h-1.5 rounded-full w-[85%] animate-pulse"></div>
                  </div>

                  <p className="text-[11.5px] text-indigo-200 leading-snug">
                    Hooks hiring managers in sentence 1 within Upwork&apos;s 140-char search preview.
                  </p>
                </div>

                {/* Feature Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 font-bold" />
                    <div>
                      <span className="font-semibold text-white block">Problem-First Technical Hook</span>
                      <p className="text-[11px] text-indigo-200 leading-snug">
                        Immediate diagnosis of their exact bug and turnaround time in sentence 1.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 font-bold" />
                    <div>
                      <span className="font-semibold text-white block">Auto-Injected Proof</span>
                      <p className="text-[11px] text-indigo-200 leading-snug">
                        Selects matching project metrics from your personal bank ($1.5M processed, 99.9% uptime).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 font-bold" />
                    <div>
                      <span className="font-semibold text-white block">Low-Friction Loom Video CTA</span>
                      <p className="text-[11px] text-indigo-200 leading-snug">
                        Offers a 3-minute video breakdown with zero high-pressure call scheduling.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-indigo-900/20 border border-indigo-500/20">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5 font-bold" />
                    <div>
                      <span className="font-semibold text-white block">Mobile-Optimized Length</span>
                      <p className="text-[11px] text-indigo-200 leading-snug">
                        Tight 85-130 words structured specifically for busy clients reviewing on mobile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Meta */}
              <div className="pt-4 border-t border-indigo-500/25 flex items-center justify-between text-[11px] text-indigo-200 font-mono">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <Zap className="h-3.5 w-3.5 text-indigo-400" /> Speed: &lt; 10s
                </span>
                <span className="text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                  Interviews Won
                </span>
              </div>
            </div>

            {/* CARD 3: MANUAL 45-MIN DRAFTING (THE BURNOUT ROUTE) */}
            <div className="group rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#14110E]/90 via-[#0B0E1A]/90 to-[#070A12] p-5 sm:p-6 space-y-5 shadow-xl flex flex-col justify-between transition-all duration-300 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-950/30 hover:-translate-y-1">
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 text-[11px] font-bold text-amber-300 font-mono">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>45-Min Manual Bidding</span>
                  </div>
                  <span className="text-[10.5px] font-mono font-medium text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-900/40">
                    High Burnout
                  </span>
                </div>

                {/* Score & Meter Box */}
                <div className="rounded-xl bg-black/40 border border-white/[0.05] p-3.5 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
                        12-15%
                      </span>
                      <span className="text-[11px] text-slate-400 ml-1.5 font-sans">reply rate</span>
                    </div>
                    <span className="text-[10.5px] font-mono font-semibold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded">
                      Slow Turnaround
                    </span>
                  </div>

                  <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
                    <div className="bg-amber-400/80 h-1.5 rounded-full w-[35%]"></div>
                  </div>

                  <p className="text-[11.5px] text-slate-400 leading-snug">
                    High quality, but misses the critical 20-minute client hiring window.
                  </p>
                </div>

                {/* Feature Breakdown */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Misses Speed Advantage</span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Takes 35-45 minutes while faster competitors bid and get shortlisted first.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Portfolio Search Fatigue</span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Requires searching past Google Docs, Notion pages, and GitHub repos manually.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Freelancer Burnout</span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Mentally draining to maintain 5+ customized bids every day alongside project work.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.03]">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-200 block">Inconsistent Hook Quality</span>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Opening line quality drops drastically when bidding tired late in the evening.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Footer Meta */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-500" /> Draft: 45 min
                </span>
                <span className="text-amber-300 font-semibold">Max 2-3 Bids / Day</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. TAB B: UPWORK INBOX SIMULATOR (LIVE VISUAL TEARDOWN)       */}
      {/* ============================================================ */}
      {activeTab === 'simulator' && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0E1A]/95 p-4 sm:p-7 space-y-6 animate-slide-fade shadow-2xl backdrop-blur-xl">

          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-0.5 text-[11px] font-bold text-indigo-300 font-mono">
              <Eye className="h-3 w-3" />
              <span>UPWORK HIRING DASHBOARD SIMULATION</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              What the Client Sees in the Critical 140-Character Search Preview
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When clients scan proposals on the Upwork mobile app, only the first 140 characters appear before clicking.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

            {/* REJECTED BID (GENERIC AI) */}
            <div className="rounded-2xl border border-rose-500/30 bg-[#130A10] p-4 sm:p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3.5">
                {/* Simulated Upwork Header */}
                <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    <span className="text-xs font-bold text-rose-300 font-mono">
                      GENERIC CHATGPT BID
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                    ARCHIVED IN 2 SECONDS
                  </span>
                </div>

                {/* Mobile Preview Box */}
                <div className="p-3.5 rounded-xl bg-black/50 border border-rose-500/20 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>First 140 Characters:</span>
                    <span className="text-rose-400 font-semibold">0% Problem Solved</span>
                  </div>
                  <p className="text-xs font-mono text-rose-300/90 leading-relaxed bg-rose-950/30 p-2.5 rounded-lg border border-rose-900/50 line-through">
                    &quot;Dear Hiring Manager, I am writing to express my strong interest in your Next.js project. I have 8+ years of experience in building...&quot;
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    ⚠️ Client scrolls past because the preview burns valuable space on polite generic filler.
                  </p>
                </div>

                {/* Rest of proposal */}
                <div className="space-y-2 text-xs font-mono text-slate-400">
                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-rose-400 font-bold block text-[10.5px]">❌ Generic Proof Claim:</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      &quot;I am proficient in React, Next.js, Node, PostgreSQL, and Stripe integration.&quot;
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <span className="text-rose-400 font-bold block text-[10.5px]">❌ High Friction CTA:</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      &quot;Let me know your availability for a 30-minute Zoom call tomorrow.&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Result */}
              <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between text-[11px] font-mono text-rose-300">
                <span>Client Status: Archived</span>
                <span className="font-bold text-rose-400">0 Interviews Won</span>
              </div>
            </div>

            {/* WINNING BID (UPPITCH) */}
            <div className="rounded-2xl border-2 border-emerald-500/40 bg-[#071813] p-4 sm:p-5 space-y-4 flex flex-col justify-between shadow-xl shadow-emerald-950/30">
              <div className="space-y-3.5">
                {/* Simulated Upwork Header */}
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-300 font-mono">
                      UPPITCH PROBLEM-FIRST PITCH
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                    INTERVIEW SENT &amp; HIRED
                  </span>
                </div>

                {/* Mobile Preview Box */}
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300">
                    <span>First 140 Characters:</span>
                    <span className="text-emerald-400 font-bold">100% Technical Match</span>
                  </div>
                  <p className="text-xs font-mono text-emerald-200 leading-relaxed bg-emerald-900/30 p-2.5 rounded-lg border border-emerald-500/40 font-semibold">
                    &quot;Saw the duplicate Stripe billing race condition in your Next.js API. Can lock Redis idempotency keys within 24h. Processed $1.5M with 0 drops.&quot;
                  </p>
                  <p className="text-[11px] text-emerald-300/90 font-medium">
                    ⚡ Client immediately clicks into the proposal because the exact solution is in line 1.
                  </p>
                </div>

                {/* Rest of proposal */}
                <div className="space-y-2 text-xs font-mono text-slate-200">
                  <div className="p-2.5 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold block text-[10.5px]">✅ Verified Past Case Study:</span>
                    <p className="text-slate-200 text-[11px] mt-0.5">
                      &quot;Recently rebuilt the payment webhooks for a high-volume SaaS with zero lost events.&quot;
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-900/20 border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold block text-[10.5px]">✅ Low-Friction Video CTA:</span>
                    <p className="text-slate-200 text-[11px] mt-0.5">
                      &quot;Want a quick 3-minute Loom showing the staging idempotency architecture?&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Result */}
              <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                <span>Client Status: Interview Booked</span>
                <span className="font-bold text-emerald-400">34.8% Reply Rate</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. TAB C: FULL FEATURE MATRIX TABLE (FULLY RESPONSIVE)        */}
      {/* ============================================================ */}
      {activeTab === 'matrix' && (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0E1A]/95 p-4 sm:p-6 space-y-4 animate-slide-fade shadow-2xl overflow-hidden backdrop-blur-xl">

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[580px]">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-mono text-[10.5px] sm:text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 font-semibold text-white">Feature &amp; Metric</th>
                  <th className="py-3 px-3 font-semibold text-rose-400">Generic ChatGPT</th>
                  <th className="py-3 px-3 font-semibold text-emerald-300 bg-indigo-500/15 rounded-t-xl border-x border-indigo-500/30">
                    ⚡ UpPitch Engine
                  </th>
                  <th className="py-3 px-3 font-semibold text-amber-300">Manual 45-Min</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05] text-slate-300">
                {/* Row 1 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-medium text-white">
                    <strong>Opening Hook Strategy</strong>
                    <p className="text-[11px] text-slate-400">Mobile search preview fit</p>
                  </td>
                  <td className="py-3.5 px-3 text-rose-300/80">
                    <span className="inline-flex items-center gap-1">
                      <X className="h-3.5 w-3.5 text-rose-400 shrink-0" /> Generic greeting fluff
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-emerald-300 font-semibold bg-indigo-500/15 border-x border-indigo-500/30">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Direct technical diagnosis
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-amber-200/90">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" /> Custom but slow
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-medium text-white">
                    <strong>Proof &amp; Metrics Matching</strong>
                    <p className="text-[11px] text-slate-400">Past work relevance</p>
                  </td>
                  <td className="py-3.5 px-3 text-rose-300/80">
                    <span className="inline-flex items-center gap-1">
                      <X className="h-3.5 w-3.5 text-rose-400 shrink-0" /> Hallucinated generic claims
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-emerald-300 font-semibold bg-indigo-500/15 border-x border-indigo-500/30">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Auto-matches project bank
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-amber-200/90">
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" /> Manual link digging
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-medium text-white">
                    <strong>Call-to-Action (CTA)</strong>
                    <p className="text-[11px] text-slate-400">Client response friction</p>
                  </td>
                  <td className="py-3.5 px-3 text-rose-300/80">
                    <span className="inline-flex items-center gap-1">
                      <X className="h-3.5 w-3.5 text-rose-400 shrink-0" /> Demands 30m Zoom
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-emerald-300 font-semibold bg-indigo-500/15 border-x border-indigo-500/30">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> Low-friction 3-min Loom
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-amber-200/90">
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" /> Inconsistent CTA
                    </span>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-medium text-white">
                    <strong>Draft &amp; Submit Time</strong>
                    <p className="text-[11px] text-slate-400">20-min hiring window</p>
                  </td>
                  <td className="py-3.5 px-3 text-slate-300 font-mono">
                    3 - 5 minutes
                  </td>
                  <td className="py-3.5 px-3 text-emerald-300 font-bold font-mono bg-indigo-500/15 border-x border-indigo-500/30">
                    &lt; 10 seconds
                  </td>
                  <td className="py-3.5 px-3 text-amber-300 font-mono">
                    30 - 45 minutes
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-3 font-medium text-white">
                    <strong>Average Client Reply Rate</strong>
                    <p className="text-[11px] text-slate-400">Platform benchmark</p>
                  </td>
                  <td className="py-3.5 px-3 text-rose-400 font-bold font-mono">
                    &lt; 8%
                  </td>
                  <td className="py-3.5 px-3 text-emerald-300 font-bold font-mono text-sm bg-indigo-500/15 border-x border-indigo-500/30">
                    34.8% (4.3x Winner)
                  </td>
                  <td className="py-3.5 px-3 text-amber-300 font-bold font-mono">
                    12 - 15%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* 5. RESPONSIVE METRIC TILES (4 TILES WITH GLOW)               */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0A0E1A] to-[#060812] p-4 text-center space-y-1.5 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10">
          <div className="text-xl sm:text-2xl font-black text-white font-mono flex items-center justify-center gap-1">
            <span className="text-indigo-400">140</span> chars
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Upwork Mobile Preview</p>
          <span className="inline-block text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
            Line 1 Priority
          </span>
        </div>

        <div className="group rounded-2xl border border-emerald-500/25 bg-gradient-to-b from-[#071713] to-[#060812] p-4 text-center space-y-1.5 transition-all duration-300 hover:border-emerald-500/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10">
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono flex items-center justify-center gap-1">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            34.8%
          </div>
          <p className="text-[11px] text-slate-300 font-medium">Average Reply Rate</p>
          <span className="inline-block text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-mono">
            4.3x Above ChatGPT
          </span>
        </div>

        <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0A0E1A] to-[#060812] p-4 text-center space-y-1.5 transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10">
          <div className="text-xl sm:text-2xl font-black text-indigo-400 font-mono flex items-center justify-center gap-1">
            <Zap className="h-5 w-5 text-indigo-400 fill-indigo-400" />
            &lt; 10s
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Generation Speed</p>
          <span className="inline-block text-[10px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded font-mono">
            First-Mover Edge
          </span>
        </div>

        <div className="group rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0A0E1A] to-[#060812] p-4 text-center space-y-1.5 transition-all duration-300 hover:border-violet-500/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10">
          <div className="text-xl sm:text-2xl font-black text-violet-400 font-mono flex items-center justify-center gap-1">
            <ShieldCheck className="h-5 w-5 text-violet-400" />
            100%
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Zero Generic Fluff</p>
          <span className="inline-block text-[10px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded font-mono">
            Human Flow Standard
          </span>
        </div>

      </div>

    </section>
  );
};
