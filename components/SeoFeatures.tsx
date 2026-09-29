'use strict';
import React, { memo } from 'react';
import {
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  Cpu,
  Layers,
  Video,
  Database,
} from 'lucide-react';

export const SeoFeatures: React.FC = memo(() => {
  return (
    <section
      className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-9 space-y-8 sm:space-y-10"
      aria-labelledby="features-title"
    >
      {/* 1. THREE-STEP WINNING FRAMEWORK */}
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-300 font-mono">
            <span>THE 3-STEP CONVERSION ENGINE</span>
          </div>
          <h2
            id="features-title"
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight"
          >
            How UpPitch Converts Upwork Job Posts into High-Paying Clients
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Most freelancers lose bids in the first 5 words. UpPitch is engineered around the core psychology of client decision-making on Upwork, LinkedIn, and cold email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Step 1 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F1A] p-5 sm:p-6 space-y-3.5 relative overflow-hidden group hover:border-indigo-500/50 transition-colors duration-200 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-xs font-bold text-indigo-300 font-mono">
                01
              </span>
              <Target className="h-5 w-5 text-indigo-400 transition-transform duration-200" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Instant Problem Extraction
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Pinpoints the client&apos;s core technical obstacle and frames the first sentence directly around solving that exact bottleneck.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F1A] p-5 sm:p-6 space-y-3.5 relative overflow-hidden group hover:border-emerald-500/50 transition-colors duration-200 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-300 font-mono">
                02
              </span>
              <Database className="h-5 w-5 text-emerald-400 transition-transform duration-200" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Proof &amp; Metric Injection
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Injects verified case studies with hard numbers from your project bank matching the client&apos;s exact tech stack.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F1A] p-5 sm:p-6 space-y-3.5 relative overflow-hidden group hover:border-violet-500/50 transition-colors duration-200 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/30 text-xs font-bold text-violet-300 font-mono">
                03
              </span>
              <Sparkles className="h-5 w-5 text-violet-400 transition-transform duration-200" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Dual High-Converting Angles
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates Variation A (Direct technical fix &amp; timeline) and Variation B (Consultative architecture analysis &amp; Loom CTA).
            </p>
          </div>
        </div>
      </div>

      {/* 2. SIX PILLARS OF HIGH-CONVERTING OUTREACH */}
      <div className="space-y-4 sm:space-y-6 pt-1">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Engineered for Top 1% Freelancers, Agencies &amp; Consultants
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Everything you need to scale client acquisition across Upwork, LinkedIn, and cold outreach.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/[0.06] bg-[#070A14] p-4 sm:p-5 space-y-2 transition-colors duration-150 hover:border-indigo-500/40">
            <div className="flex items-center gap-2 text-indigo-400">
              <Zap className="h-4 w-4 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-white">Zero Generic Fluff</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              No robotic greetings. Every sentence directly addresses the client&apos;s technical requirements.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#070A14] p-4 sm:p-5 space-y-2 transition-colors duration-150 hover:border-emerald-500/40">
            <div className="flex items-center gap-2 text-emerald-400">
              <Layers className="h-4 w-4 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-white">Channel-Specific Format</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optimized for Upwork preview limits, Cold Email subject lines, and LinkedIn InMail formats.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#070A14] p-4 sm:p-5 space-y-2 transition-colors duration-150 hover:border-violet-500/40">
            <div className="flex items-center gap-2 text-violet-400">
              <Video className="h-4 w-4 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-white">Low-Friction Video CTAs</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Replaces high-friction calls with a high-converting 3-minute Loom video teardown offer.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#070A14] p-4 sm:p-5 space-y-2 transition-colors duration-150 hover:border-amber-500/40">
            <div className="flex items-center gap-2 text-amber-400">
              <Cpu className="h-4 w-4 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-white">Multi-Model Gemini AI</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by ultra-fast Google Gemini Flash models with instant proposal generation under 10s.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#070A14] p-4 sm:p-5 space-y-2 transition-colors duration-150 hover:border-cyan-500/40">
            <div className="flex items-center gap-2 text-cyan-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-white">Browser-First Privacy</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              All profiles, project proofs, and proposal history are stored locally in your browser (localStorage).
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-[#070A14] p-4 sm:p-5 space-y-2 transition-colors duration-150 hover:border-rose-500/40">
            <div className="flex items-center gap-2 text-rose-400">
              <Database className="h-4 w-4 shrink-0" />
              <h3 className="text-xs sm:text-sm font-bold text-white">Skill Autocomplete</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quickly tag case studies with 80+ curated modern technologies in 1 click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

SeoFeatures.displayName = 'SeoFeatures';
