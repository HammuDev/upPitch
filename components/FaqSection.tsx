'use strict';
import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does UpPitch write proposals that stand out from generic AI?',
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

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-9 space-y-4 sm:space-y-6"
      aria-labelledby="faq-title"
    >
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-300 font-mono">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2
          id="faq-title"
          className="text-xl sm:text-2xl font-extrabold text-white tracking-tight"
        >
          Everything You Need to Know About UpPitch
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Learn how high-earning freelancers use UpPitch to win competitive Upwork bids and scale outreach.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-2.5">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-xl border border-white/[0.08] bg-[#0B0F1A] overflow-hidden transition-all shadow-md"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="cursor-pointer w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-indigo-400 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-indigo-300' : ''
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-white/[0.04]">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
