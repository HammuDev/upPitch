import React, { memo } from 'react';
import {
  Zap,
  Target,
  Sparkles,
  Bot,
  Layers,
  Video,
  Cpu,
  ShieldCheck,
  Tag,
  Sparkle,
} from 'lucide-react';

export const ConversionSection: React.FC = memo(() => {
  return (
    <section
      id="conversion-framework"
      className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12 scroll-mt-20 relative z-10"
      aria-labelledby="conversion-title"
    >
      {/* ========================================================= */}
      {/* 1. WHY UPPITCH CONVERTS UPWORK JOBS (3-Column Features)    */}
      {/* ========================================================= */}
      <div className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 font-mono">
            <Zap className="h-3.5 w-3.5 text-indigo-600" />
            <span>The Smarter Way to Bid</span>
          </div>

          <h2
            id="conversion-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Why UpPitch Converts Upwork Job Posts into{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              High-Paying Clients
            </span>
          </h2>

          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Most freelancers lose bids in the first 5 seconds. UpPitch analyzes jobs, the client&apos;s tone, and creates a winning proposal in seconds.
          </p>
        </div>

        {/* 3 Pillars Cards matching mockup exactly */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1: Instant Problem Extraction */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-7 sm:p-8 space-y-5 shadow-lg shadow-indigo-500/5 card-hover-lift flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200/80 text-indigo-600 shadow-inner">
                <Zap className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900">
                Instant Problem Extraction
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Finds what the client really needs and what they&apos;re struggling with.
              </p>
            </div>
          </div>

          {/* Card 2: Proof & Match Injection */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-7 sm:p-8 space-y-5 shadow-lg shadow-indigo-500/5 card-hover-lift flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-600 shadow-inner">
                <Target className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900">
                Proof &amp; Match Injection
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Adds relevant experience, skills and proof points that build trust.
              </p>
            </div>
          </div>

          {/* Card 3: Dual High-Converting Angles */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-7 sm:p-8 space-y-5 shadow-lg shadow-indigo-500/5 card-hover-lift flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 border border-violet-200/80 text-violet-600 shadow-inner">
                <Sparkles className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900">
                Dual High-Converting Angles
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Creates both a personalized pitch and a value-driven solution.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. ENGINEERED FOR TOP 1% FREELANCERS (6-Grid Horizontal) */}
      {/* ========================================================= */}
      <div id="features" className="space-y-10 pt-4 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Engineered for Top 1% Freelancers, Agencies &amp; Consultants
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Everything you need to scale client acquisition across Upwork, LinkedIn, and cold outreach.
          </p>
        </div>

        {/* 6 Horizontal Cards matching mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* 1. Zero-Generic Phrasing */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 flex items-start gap-4 card-hover-lift shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-600">
              <Bot className="h-5 w-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Zero-Generic Phrasing</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                No robotic templates — every proposal feels human and relevant.
              </p>
            </div>
          </div>

          {/* 2. Channel-Specific Format */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 flex items-start gap-4 card-hover-lift shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 border border-purple-200/80 text-purple-600">
              <Layers className="h-5 w-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Channel-Specific Format</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Optimized for Upwork, LinkedIn, and email outreach.
              </p>
            </div>
          </div>

          {/* 3. Low-Friction Video CTAs */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 flex items-start gap-4 card-hover-lift shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 border border-blue-200/80 text-blue-600">
              <Video className="h-5 w-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Low-Friction Video CTAs</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Optional video intros that build trust and increase replies.
              </p>
            </div>
          </div>

          {/* 4. Multi-Model Generative AI */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 flex items-start gap-4 card-hover-lift shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Multi-Model Generative AI</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Powered by advanced LLMs for higher-quality, natural content.
              </p>
            </div>
          </div>

          {/* 5. Browser-First Privacy */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 flex items-start gap-4 card-hover-lift shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 border border-teal-200/80 text-teal-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Browser-First Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Profile and history remain in your browser (localStorage). Generation requests are processed via Gemini API with no database storage.
              </p>
            </div>
          </div>

          {/* 6. Skill Auto-complete */}
          <div className="rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 flex items-start gap-4 card-hover-lift shadow-sm">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600">
              <Tag className="h-5 w-5" />
            </div>
            <div className="space-y-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Skill Auto-complete</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Quickly add your skills and tech stack from a searchable database.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});

ConversionSection.displayName = 'ConversionSection';
