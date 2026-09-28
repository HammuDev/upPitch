'use strict';
import React, { useState, memo } from 'react';
import { ChevronRight, HelpCircle, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does UpPitch work with proposals that stand out from generic AI?',
    answer:
      'Most AI tools generate robotic greetings like "Dear Hiring Manager, I am writing to express my enthusiasm...". UpPitch strictly eliminates all pleasantries and addresses the client\'s core technical problem and timeline in the very first sentence. It also integrates verified metrics and case studies directly from your personal Project Bank, establishing instant credibility.',
  },
  {
    question: 'Why is the first sentence so critical on Upwork and LinkedIn?',
    answer:
      'On Upwork, clients only see the first 140 to 180 characters of your proposal in the search preview before deciding whether to open your bid or archive it. On LinkedIn and mobile email, notifications truncate after the first sentence. If you start with generic greetings, you lose 80% of your potential interview invitations before the client even reads your qualifications.',
  },
  {
    question: 'How does the Project Bank and Proof Matching system work?',
    answer:
      'You add your completed projects, technical stack tags, and quantifiable results (e.g. "$1.5M processed", "0.8s load time", "99.99% uptime") to your Project Bank. When you paste a job posting, UpPitch matches your selected case studies directly to the client’s stated requirements and weaves them naturally into the proposal narrative.',
  },
  {
    question: 'Can I customize proposals for different platforms like Upwork, Cold Email, and LinkedIn?',
    answer:
      'Yes! UpPitch provides 4 dedicated outreach modes: Upwork Proposals (structured, mobile-preview optimized), Cold Email (generates compelling subject lines + high-reply body), LinkedIn DMs (concise InMail format), and Twitter/X (direct and conversational).',
  },
  {
    question: 'Is my personal data and Gemini API key secure?',
    answer:
      'Yes, 100%. UpPitch is designed with a privacy-first architecture. All your profile information, project case studies, and proposal history are stored locally in your browser\'s local storage. Your Gemini API key is either securely stored in your local .env or browser configuration and is never logged or transmitted to third-party databases.',
  },
  {
    question: 'What is the difference between Variation A and Variation B?',
    answer:
      'Variation A focuses on a direct, problem-first technical fix with clear turnaround timelines (ideal for high-urgency or bug-fix jobs). Variation B provides a consultative architecture breakdown paired with a low-friction 3-minute Loom video teardown offer (ideal for high-budget, long-term contracts).',
  },
];

export const FaqSection: React.FC = memo(() => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faq"
      className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 scroll-mt-20 relative z-10"
      aria-labelledby="faq-title"
    >
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 font-mono">
          <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </div>

        <h2
          id="faq-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          Everything You Need to Know About UpPitch
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Side: 3D Isometric Illustration matching mockup */}
        <div className="lg:col-span-5 flex items-center justify-center relative">
          <div className="relative w-full max-w-sm aspect-[4/3] flex items-center justify-center">
            
            {/* Background Radiant Purple Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-400/20 via-indigo-500/20 to-cyan-400/10 rounded-3xl blur-2xl transform scale-90" />

            {/* 3D Floating Proposal Graphic Mockup */}
            <div className="relative z-10 w-[85%] rounded-2xl border border-indigo-100 bg-white/90 backdrop-blur-xl p-5 shadow-2xl shadow-indigo-500/15 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2.5 mb-3">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-slate-400 ml-2">proposal_analysis.ai</span>
              </div>

              <div className="space-y-2">
                <div className="h-3 w-3/4 rounded bg-indigo-100 animate-pulse" />
                <div className="h-2.5 w-full rounded bg-slate-100" />
                <div className="h-2.5 w-5/6 rounded bg-slate-100" />
                <div className="h-2.5 w-2/3 rounded bg-slate-100" />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-700 font-mono">100% Match</span>
                </div>
                <span className="rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700">
                  Ready to Send
                </span>
              </div>
            </div>

            {/* Floating Upwork Squircle Badge */}
            <div className="absolute -top-3 -left-2 z-20 w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 p-[2px] shadow-lg shadow-emerald-500/30 -rotate-12 animate-float-slow">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center p-2">
                <img src="/images/upwork-icon.png" alt="Upwork" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Floating 3D Crystal Gem */}
            <div className="absolute -bottom-4 right-2 z-20 w-12 h-12 opacity-85 animate-float-reverse">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md rotate-12">
                <polygon points="50,6 94,50 50,94 6,50" fill="#DDD6FE" fillOpacity="0.8" />
                <polygon points="50,6 94,50 50,50" fill="#FFFFFF" fillOpacity="0.95" />
                <polygon points="6,50 50,6 50,50" fill="#C4B5FD" fillOpacity="0.8" />
                <polygon points="50,50 94,50 50,94" fill="#8B5CF6" fillOpacity="0.9" />
              </svg>
            </div>

          </div>
        </div>

        {/* Right Side: Clean White Accordion List */}
        <div className="lg:col-span-7 space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 shadow-xs ${
                  isOpen
                    ? 'border-indigo-300 bg-indigo-50/20'
                    : 'border-indigo-100 bg-white hover:border-indigo-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="cursor-pointer w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors"
                >
                  <span className={`text-xs sm:text-sm font-bold pr-4 transition-colors ${
                    isOpen ? 'text-indigo-700' : 'text-slate-900'
                  }`}>
                    {faq.question}
                  </span>
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-all ${
                    isOpen ? 'text-indigo-700 rotate-90' : 'text-indigo-500'
                  }`}>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-indigo-100/50">
                      <p className="text-xs text-slate-600 leading-relaxed font-normal pt-2">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
});

FaqSection.displayName = 'FaqSection';
