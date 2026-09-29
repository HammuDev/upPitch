import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy | UpPitch',
  description: 'Understand how UpPitch handles your data, local storage, and AI processing.',
};

/**
 * NOTICE: Draft document for UpPitch. Not formal legal advice.
 * Please review and adapt to your jurisdiction's legal requirements.
 */
export default function PrivacyPage() {
  const contactEmail = siteConfig.feedbackEmail || 'support@uppitch.app';

  return (
    <div className="min-h-screen bg-[#F8F9FE] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to UpPitch Workspace</span>
          </Link>
          <span className="text-[11px] font-mono text-slate-400">
            Last Updated: September 2026
          </span>
        </div>

        {/* Card Container */}
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 sm:p-10 shadow-xl shadow-indigo-500/5 space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-5">
            <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider font-mono">
              <Shield className="h-4 w-4" />
              <span>Legal &amp; Privacy Transparency</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 font-medium">
              Notice: This is a plain-language draft describing our actual technical architecture. It is not formal legal advice.
            </p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                1. Browser-First Architecture (No Accounts)
              </h2>
              <p>
                UpPitch does not require user accounts, logins, or passwords. Your profile data (name, role, bio, and case studies) and proposal generation history are stored solely in your local browser storage (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-indigo-700 text-xs">localStorage</code>). We do not operate a user database.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                2. AI Proposal Generation &amp; Google Gemini
              </h2>
              <p>
                When you click &quot;Generate Winning Proposal&quot;, your job brief text, profile details, and selected case study tags are transmitted over an encrypted HTTPS connection to our API endpoint, which forwards the prompt to Google&apos;s Gemini API to synthesize proposal drafts. We do not store, log, or resell your job postings or proposal text in any database.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                3. API Keys (Bring Your Own Key)
              </h2>
              <p>
                If you configure a custom Gemini API key in Settings, it is saved strictly in your local browser storage. It is only included in the request headers to authenticate your calls directly with Google Gemini.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                4. No Advertising or Invasive Tracking
              </h2>
              <p>
                UpPitch does not display third-party advertisements or sell user telemetry. We collect only standard, aggregate server-level traffic logs (e.g. status codes and rate limiting timestamps) necessary for preventing abuse and maintaining service availability.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                5. Clearing Your Data
              </h2>
              <p>
                Because your data resides on your own device, you can completely erase all stored profiles and proposal history at any time by clicking &quot;Clear All&quot; in the History drawer or by clearing your browser&apos;s site data for this domain.
              </p>
            </section>

            <section className="space-y-2 pt-2 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                6. Contact &amp; Questions
              </h2>
              <p>
                If you have questions regarding this privacy policy or UpPitch&apos;s data practices, please reach out via email at{' '}
                <a
                  href={`mailto:${contactEmail}`}
                  className="font-semibold text-indigo-600 hover:underline"
                >
                  {contactEmail}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
