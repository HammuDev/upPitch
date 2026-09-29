'use client';
import React, { memo, useState } from 'react';
import Image from 'next/image';
import { Sparkles, ArrowRight, Play, CheckCircle2, Copy, Check } from 'lucide-react';

interface HeroHeaderProps {
  savedPitchesCount: number;
  onLoadSampleBrief?: () => void;
  onScrollToWorkspace?: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = memo(({
  savedPitchesCount: _savedPitchesCount,
  onLoadSampleBrief,
  onScrollToWorkspace,
}) => {
  const [copied, setCopied] = useState(false);

  const handleScroll = () => {
    if (onScrollToWorkspace) {
      onScrollToWorkspace();
    } else {
      const el = document.getElementById('workspace');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSampleClick = () => {
    if (onLoadSampleBrief) {
      onLoadSampleBrief();
    }
    handleScroll();
  };

  const handleQuickCopy = () => {
    const text = `Hi,\nI analyzed your duplicate Stripe billing race condition. Having built and audited similar Next.js multi-tenant checkout pipelines, this happens when webhooks process concurrently without an idempotent distributed lock.\n\n• Implemented Redis distributed locks for 3 high-volume SaaS apps\n• Verified test coverage in staging within 24 hours`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 pt-2 sm:pt-6 pb-6 sm:pb-10 z-10" aria-labelledby="hero-title">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

        {/* ========================================================= */}
        {/* LEFT COLUMN: HERO HEADLINE, CTAS & SOCIAL PROOF           */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col items-start text-left space-y-4 sm:space-y-6 z-10">

          {/* 1. Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/90 px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-indigo-700 shadow-xs hover:border-indigo-300 transition-all duration-200">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>AI-Powered Writer &amp; Portfolio Proposals</span>
          </div>

          {/* 2. Main Title */}
          <h1
            id="hero-title"
            className="text-2xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[50px] font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.15]"
          >
            Win high-ticket Upwork contracts &amp; client bids in{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              10 seconds
            </span>
          </h1>

          {/* 3. Subtitle */}
          <p className="text-xs sm:text-base text-slate-600 font-normal leading-relaxed max-w-xl">
            UpPitch analyzes the client&apos;s project, crafts hyper-personalized proposals, and generates high-converting outreach — all in seconds. No more guesswork. Just better proposals.
          </p>

          {/* 4. Four Key Feature Pills with Checkmarks */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pt-1 w-full">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>AI-Powered</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>Job-Specific</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>Tailored Outreach</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-white px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium text-slate-700 shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>Proven Results</span>
            </div>
          </div>

          {/* 5. Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleScroll}
              className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 sm:px-7 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-95 transition-all duration-200 btn-shine-effect"
            >
              <span>Generate Winning Proposal</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleSampleClick}
              className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 sm:px-6 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:border-indigo-300 hover:scale-[1.01] active:scale-95 transition-all duration-200"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Play className="h-2.5 w-2.5 fill-indigo-600 ml-0.5" />
              </div>
              <span>Try Sample Brief</span>
            </button>
          </div>

          {/* 6. Social Proof */}
          <div className="flex items-center gap-3 pt-2">
            <p className="text-[11px] sm:text-xs text-slate-700 font-medium">
              <span className="font-bold text-slate-900">Free while in beta</span>
              <span className="block text-[10px] sm:text-[11px] text-slate-500 font-normal">Generate tailored proposals with zero generic templates</span>
            </p>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: 3D ISOMETRIC FLOATING PROPOSAL ARTWORK      */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 relative flex items-center justify-center pt-6 sm:pt-8 lg:pt-0">

          {/* ======================================================= */}
          {/* UNCROPPED ORGANIC PURPLE WAVE BACKDROP (FULL CANVAS)    */}
          {/* ======================================================= */}
          <div className="absolute -top-16 -right-12 -bottom-16 -left-28 sm:-top-20 sm:-right-16 sm:-bottom-20 sm:-left-44 pointer-events-none -z-10 overflow-visible flex items-center justify-center">
            <svg
              viewBox="0 0 1200 850"
              className="w-full h-full transform scale-105"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="uncroppedPurpleGrad" x1="85%" y1="10%" x2="10%" y2="90%">
                  <stop offset="0%" stopColor="#D8B4FE" stopOpacity="0.95" />
                  <stop offset="25%" stopColor="#C084FC" stopOpacity="0.9" />
                  <stop offset="55%" stopColor="#A855F7" stopOpacity="0.85" />
                  <stop offset="80%" stopColor="#818CF8" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.4" />
                </linearGradient>

                <linearGradient id="uncroppedSilkGrad" x1="75%" y1="15%" x2="25%" y2="85%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
                  <stop offset="35%" stopColor="#E9D5FF" stopOpacity="0.45" />
                  <stop offset="70%" stopColor="#C084FC" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Master Wave Silhouette with Full Padding so Right Flank is 100% Smoothly Rounded without Crop */}
              <path
                d="M 660,60 
                   C 880,30 1040,50 1100,190 
                   C 1140,330 1100,520 1000,630 
                   C 900,740 700,750 540,690 
                   C 370,640 210,710 100,610 
                   C 10,520 50,400 190,340 
                   C 340,280 410,80 660,60 Z"
                fill="url(#uncroppedPurpleGrad)"
                className="opacity-95"
              />

              {/* Inner Luminous Silk Flow */}
              <path
                d="M 700,90 
                   C 870,70 990,95 1030,220 
                   C 1060,340 1020,490 930,570 
                   C 830,660 660,665 520,620 
                   C 360,570 230,560 160,480 
                   C 110,410 220,340 330,310 
                   C 480,260 510,105 700,90 Z"
                fill="url(#uncroppedSilkGrad)"
              />
            </svg>
          </div>

          {/* ======================================================= */}
          {/* 3D UPWORK EMERALD GREEN SQUIRCLE (FLOATING TOP-LEFT)    */}
          {/* ======================================================= */}
          <div className="absolute -top-5 -left-2 sm:-top-8 sm:-left-5 z-30 w-13 h-13 sm:w-18 sm:h-18 md:animate-float-subtle">
            <div className="relative w-full h-full rounded-[18px] sm:rounded-[24px] bg-gradient-to-br from-[#22c55e] via-[#16a34a] to-[#15803d] p-[2px] sm:p-[2.5px] shadow-[0_16px_36px_rgba(22,163,74,0.55),0_0_0_1px_rgba(255,255,255,0.45)_inset] -rotate-12 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <div className="w-full h-full rounded-[15px] sm:rounded-[20px] bg-white flex items-center justify-center shadow-inner overflow-hidden p-1.5 sm:p-2.5">
                <Image
                  src="/images/upwork-icon.png"
                  alt="Upwork"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain select-none"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* 3D LINKEDIN BLUE SQUIRCLE (FIXED BOTTOM-RIGHT OF CARD)  */}
          {/* ======================================================= */}
          <div className="absolute -bottom-5 -right-2 sm:-bottom-8 sm:-right-5 z-30 w-13 h-13 sm:w-17 sm:h-17 md:animate-float-reverse">
            <div className="relative w-full h-full rounded-[18px] sm:rounded-[24px] bg-gradient-to-br from-[#0A66C2] via-[#004182] to-[#002952] p-[2px] sm:p-[2.5px] shadow-[0_16px_36px_rgba(10,102,194,0.55),0_0_0_1px_rgba(255,255,255,0.45)_inset] rotate-12 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <div className="w-full h-full rounded-[15px] sm:rounded-[20px] bg-white flex items-center justify-center shadow-inner overflow-hidden p-1.5 sm:p-2">
                <Image
                  src="/images/linkedin-icon.png"
                  alt="LinkedIn"
                  width={48}
                  height={48}
                  className="w-full h-full object-contain select-none rounded-[10px]"
                  draggable={false}
                />
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* 3D FACETED CRYSTAL DIAMONDS                            */}
          {/* ======================================================= */}

          {/* 1. Mid-Left Diamond */}
          <div className="absolute top-1/2 -left-6 sm:-left-8 z-20 w-10 h-10 sm:w-13 sm:h-13 opacity-90 animate-float-slow hidden xs:block pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_12px_24px_rgba(139,92,246,0.45)] -rotate-12">
              <polygon points="50,6 12,45 50,50" fill="#FFFFFF" fillOpacity="0.95" />
              <polygon points="50,6 88,45 50,50" fill="#DDD6FE" fillOpacity="0.9" />
              <polygon points="12,45 50,94 50,50" fill="#C4B5FD" fillOpacity="0.85" />
              <polygon points="88,45 50,94 50,50" fill="#8B5CF6" fillOpacity="0.9" />
            </svg>
          </div>

          {/* 2. Top-Right Prism */}
          <div className="absolute -top-5 right-2 sm:-top-7 sm:right-4 z-20 w-9 h-9 sm:w-12 sm:h-12 opacity-90 animate-float-slow hidden xs:block pointer-events-none">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_10px_20px_rgba(99,102,241,0.4)] rotate-45">
              <polygon points="50,10 90,45 50,90 10,45" fill="#C4B5FD" fillOpacity="0.8" />
              <polygon points="50,10 90,45 50,55" fill="#FFFFFF" fillOpacity="0.95" />
              <polygon points="50,10 10,45 50,55" fill="#DDD6FE" fillOpacity="0.85" />
              <polygon points="10,45 50,90 50,55" fill="#8B5CF6" fillOpacity="0.9" />
              <polygon points="90,45 50,90 50,55" fill="#6D28D9" fillOpacity="0.75" />
            </svg>
          </div>

          {/* ======================================================= */}
          {/* THE 3D ISOMETRIC FLOATING PROPOSAL MOCKUP CARD          */}
          {/* (Exact layout preserved with polished styling)          */}
          {/* ======================================================= */}
          <div className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl border border-white/95 bg-white/95 p-4 sm:p-6 sm:p-7 shadow-[0_30px_70px_-15px_rgba(124,58,237,0.22)] backdrop-blur-xl z-10 transform -rotate-1 sm:-rotate-2 hover:rotate-0 transition-transform duration-500 space-y-3 sm:space-y-5">

            {/* macOS Window Controls & Filename Tag */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 sm:pb-3.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-400/90 shadow-xs" />
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400/90 shadow-xs" />
                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400/90 shadow-xs" />
                <span className="ml-1.5 sm:ml-2 font-mono text-[10px] sm:text-xs font-semibold text-slate-500 truncate">
                  proposal_analysis.ai
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200/80 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-indigo-700 font-mono shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span>AI Hook Active</span>
              </div>
            </div>

            {/* Proposal Hook & Skeleton Preview Lines */}
            <div className="space-y-2.5 sm:space-y-3 pt-0.5 sm:pt-1">
              <div className="rounded-xl border border-indigo-100/80 bg-indigo-50/40 p-3 sm:p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="font-bold text-slate-900 font-mono">Target Proposal Preview</span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-1.5 sm:px-2 py-0.5 rounded-md shrink-0">
                    First Sentence Optimized
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-700 leading-relaxed font-normal">
                  <strong className="text-slate-900 font-bold">&ldquo;Hi,</strong> I analyzed your duplicate Stripe billing race condition. Having built and audited similar Next.js multi-tenant checkout pipelines, this happens when webhooks process concurrently without an idempotent distributed lock...&rdquo;
                </p>
              </div>

              {/* Verified Proof Points */}
              <div className="grid grid-cols-2 gap-2 pt-0.5 sm:pt-1">
                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-2 sm:p-2.5 space-y-0.5">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">Proof Injected</p>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-800 truncate">3 Verified Projects</p>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-2 sm:p-2.5 space-y-0.5">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-mono">Delivery Speed</p>
                  <p className="text-[11px] sm:text-xs font-bold text-indigo-600 font-mono">10 Seconds</p>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[11px] sm:text-xs font-bold text-emerald-700 font-mono tracking-tight">
                  Sample Match
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleQuickCopy}
                  className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2 sm:px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold text-slate-700 shadow-xs transition-all"
                  title="Copy Sample Proposal"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <span className="rounded-lg bg-indigo-50 border border-indigo-200/90 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-indigo-700 font-mono shadow-xs">
                  Ready to Send
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
});

HeroHeader.displayName = 'HeroHeader';
