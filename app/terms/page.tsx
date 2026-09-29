import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Service | UpPitch',
  description: 'Terms and conditions for using UpPitch AI proposal generation tool.',
};

/**
 * NOTICE: Draft document for UpPitch. Not formal legal advice.
 * Please review and adapt to your jurisdiction's legal requirements.
 */
export default function TermsPage() {
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
              <FileText className="h-4 w-4" />
              <span>User Agreement</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 font-medium">
              Notice: This is a draft term sheet describing actual usage conditions. It is not formal legal advice.
            </p>
          </div>

          <div className="space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using UpPitch, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                2. Nature of the Tool &amp; User Verification
              </h2>
              <p>
                UpPitch is an AI-powered drafting assistant designed to help freelancers articulate technical proposals and outreach pitches. You acknowledge that AI-generated text may contain errors, inaccuracies, or hallucinations. You are solely responsible for reviewing, verifying, and editing all proposals before submitting them to clients, platforms, or third parties.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                3. Third-Party Independence
              </h2>
              <p>
                UpPitch is an independent productivity software tool. It is not affiliated, endorsed, sponsored, or certified by Upwork Global Inc., LinkedIn Corporation, X Corp., or Google LLC. All trademarks and brand names belong to their respective owners.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                4. Acceptable Use &amp; Rate Limits
              </h2>
              <p>
                You agree not to use UpPitch for sending unlawful, harassing, or spam communications. To protect service availability for all users, standard IP-based rate limiting is enforced on API endpoints. Circumventing rate limits through proxies or automated scraping scripts is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-bold text-slate-900">
                5. Disclaimer of Warranties &amp; Limitation of Liability
              </h2>
              <p>
                UpPitch is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied, including but not limited to the success or response rate of submitted freelance proposals. Under no circumstances shall UpPitch or its creators be liable for indirect, incidental, or consequential damages resulting from your use of the tool.
              </p>
            </section>

            <section className="space-y-2 pt-2 border-t border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                6. Contact Information
              </h2>
              <p>
                For questions regarding these terms, please contact us at{' '}
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
