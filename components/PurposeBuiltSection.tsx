'use client';
import React, { useState, memo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface PurposeBuiltSectionProps {
  onLoadSampleProposal?: (sampleText: string) => void;
  onScrollToWorkspace?: () => void;
}

export const PurposeBuiltSection: React.FC<PurposeBuiltSectionProps> = memo(({
  onLoadSampleProposal,
  onScrollToWorkspace,
}) => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'proposal' | 'cover-letter'>('analysis');
  const [copied, setCopied] = useState(false);

  const sampleProposal = `Hi there,\n\nI reviewed your brief regarding the duplicate Stripe billing race condition. Having built and debugged high-volume webhook listeners, here is the exact resolution plan:\n\n• Audit: Inspect idempotent key validation and concurrent webhook arrival in Redis lock table.\n• Fix: Wrap customer payment update in an atomic serializable PostgreSQL transaction with mutex locks.\n• Verify: Execute automated 100-event concurrent test script in staging within 24 hours.\n\nWould you be open to a quick 3-minute video walkthrough showing how we solved this exact lock contention last month?\n\nBest regards,\n[Your Name]\n[Your Title]`;

  const handleUseProposal = () => {
    if (onLoadSampleProposal) {
      onLoadSampleProposal(sampleProposal);
    }
    if (onScrollToWorkspace) {
      onScrollToWorkspace();
    } else {
      const el = document.getElementById('workspace');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleProposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="purpose-built"
      className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 scroll-mt-20"
      aria-labelledby="purpose-built-title"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Value Proposition & Checklist */}
        <div className="lg:col-span-5 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 font-mono">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Tailored for Upwork Success</span>
          </div>

          <h2
            id="purpose-built-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
          >
            Purpose-Built for{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
              High-Ticket Clients
            </span>
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            UpPitch helps you stand out in a crowded marketplace with personalized, data-driven proposals that get replies and land high-value contracts.
          </p>

          {/* Checklist */}
          <div className="space-y-3 pt-1">
            {[
              'Client-specific proposal analysis',
              'Tailored cover letters & portfolios',
              'Track proposal performance',
              'Save templates for faster applications',
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 border border-indigo-200">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          {/* Action CTA Button */}
          <div className="pt-3">
            <button
              type="button"
              onClick={handleUseProposal}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.02] active:scale-95 transition-all duration-200 btn-shine-effect"
            >
              <span>Start Winning on Upwork</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Dashboard Preview Card matching mockup */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-indigo-100 bg-white p-4 sm:p-6 shadow-2xl shadow-indigo-500/8 space-y-4 relative overflow-hidden card-hover-lift">
            
            {/* Top Interactive Tabs matching mockup */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {[
                  { id: 'analysis', label: 'Job Analysis' },
                  { id: 'proposal', label: 'Proposal' },
                  { id: 'cover-letter', label: 'Cover Letter' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as 'analysis' | 'proposal' | 'cover-letter')}
                    className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 border border-indigo-300 text-indigo-700 shadow-2xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>AI Live Engine</span>
              </div>
            </div>

            {/* Analysis Complete Status Box */}
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-800">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold">Analysis Complete: </span>
                <span className="text-emerald-700 truncate">Your proposal is optimized for this client&apos;s exact tech stack.</span>
              </div>
            </div>

            {/* 3 Metrics Cards Row matching mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Metric 1: Match Score Circular Gauge */}
              <div className="rounded-xl border border-indigo-100 bg-slate-50/70 p-3 flex items-center justify-between space-x-2">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    Match Score (Sample)
                  </div>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">82%</div>
                </div>

                {/* Circular SVG Ring */}
                <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
                  <svg className="h-10 w-10 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="82, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-emerald-600 font-mono">82%</span>
                </div>
              </div>

              {/* Metric 2: Key Skills Found */}
              <div className="rounded-xl border border-indigo-100 bg-slate-50/70 p-3 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Sample Skills Found
                </div>
                <div className="text-xs font-bold text-indigo-700 truncate">
                  React, Next.js, Node.js
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Sample matching
                </div>
              </div>

              {/* Metric 3: Estimated Rate */}
              <div className="rounded-xl border border-indigo-100 bg-slate-50/70 p-3 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Estimated Rate (Sample)
                </div>
                <div className="text-base font-extrabold text-purple-700">
                  $90+/hr
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Sample output
                </div>
              </div>

            </div>

            {/* Generated Proposal Box Preview matching mockup */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Generated Proposal</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
                  title="Copy Proposal"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed font-sans bg-white p-3 rounded-lg border border-slate-200 max-h-36 overflow-y-auto">
                <p className="text-slate-900 font-semibold mb-1">Hi there,</p>
                <p className="text-slate-700 mb-2">
                  I reviewed your brief regarding the duplicate Stripe billing race condition. Having built high-volume webhook listeners processing $2M+/mo, here is the resolution plan:
                </p>
                <p className="text-slate-700">• <strong className="text-indigo-700">Audit:</strong> Inspect idempotent key validation in Redis lock table.</p>
                <p className="text-slate-700">• <strong className="text-indigo-700">Fix:</strong> Wrap payment update in atomic serializable PostgreSQL transaction.</p>
                <p className="text-slate-700">• <strong className="text-indigo-700">Verify:</strong> Execute 100-event concurrent staging test suite within 24 hours.</p>
              </div>

              {/* Action Buttons: Use This Proposal & Edit */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleUseProposal}
                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95"
                >
                  <Zap className="h-3 w-3" />
                  <span>Use This Proposal</span>
                </button>

                <button
                  type="button"
                  onClick={handleUseProposal}
                  className="cursor-pointer inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span>Edit in Engine</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
});

PurposeBuiltSection.displayName = 'PurposeBuiltSection';
