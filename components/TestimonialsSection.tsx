'use strict';
import React, { memo } from 'react';
import { MessageSquare, Heart, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const TestimonialsSection: React.FC = memo(() => {
  const feedbackHref = siteConfig.feedbackEmail
    ? `mailto:${siteConfig.feedbackEmail}?subject=UpPitch Beta Feedback`
    : siteConfig.social.github
    ? `${siteConfig.social.github}/issues`
    : '#workspace';

  return (
    <section
      id="testimonials"
      className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 scroll-mt-20 relative z-10"
      aria-labelledby="testimonials-title"
    >
      <div className="text-center max-w-3xl mx-auto space-y-2.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 font-mono">
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500/20" />
          <span>Beta Community &amp; Feedback</span>
        </div>

        <h2
          id="testimonials-title"
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight"
        >
          Built for Freelancers. Currently in Beta.
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          UpPitch is shaped directly by feedback from independent freelancers and agency owners.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl sm:rounded-3xl border border-indigo-100 bg-white p-6 sm:p-8 space-y-5 text-center card-hover-lift shadow-md shadow-indigo-500/5">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <MessageSquare className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Built by a freelancer, currently in beta.
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
              Tried it? Tell us what worked and what didn&apos;t. Your feedback directly determines upcoming features and improvements.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={feedbackHref}
              target={siteConfig.feedbackEmail ? '_self' : '_blank'}
              rel="noreferrer"
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-purple-700 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <span>Share Beta Feedback</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = 'TestimonialsSection';
