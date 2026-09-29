'use client';
import React, { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from './Logo';
import { ShieldCheck, ArrowUp, Send, Check, Mail, ChevronRight } from 'lucide-react';
import { siteConfig } from '@/lib/site';

export const Footer: React.FC = memo(() => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full border-t border-indigo-100/90 bg-gradient-to-b from-white/40 via-[#F3F5FD] to-[#EAEFFD] pt-12 sm:pt-16 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 mt-auto text-xs overflow-hidden z-10">
      
      {/* ======================================================= */}
      {/* BACKGROUND 3D ARTWORK: WAVES, CRYSTALS & DOT PATTERNS   */}
      {/* ======================================================= */}
      
      {/* 1. Top-Left Organic Purple Liquid Wave */}
      <div className="absolute -top-12 -left-16 w-80 h-80 pointer-events-none -z-10 opacity-70">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M 50,0 C 150,20 220,100 240,200 C 260,300 180,380 50,400 C 0,350 0,50 50,0 Z"
            fill="url(#footerTopLeftWaveGrad)"
          />
          <defs>
            <linearGradient id="footerTopLeftWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C4B5FD" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 2. Bottom-Right Organic Purple Liquid Wave */}
      <div className="absolute -bottom-16 -right-16 w-96 h-96 pointer-events-none -z-10 opacity-80">
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M 120,500 C 200,380 280,300 400,260 C 470,230 520,280 500,500 Z"
            fill="url(#footerBottomRightWaveGrad)"
          />
          <defs>
            <linearGradient id="footerBottomRightWaveGrad" x1="50%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" stopOpacity="0.65" />
              <stop offset="40%" stopColor="#A855F7" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.75" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* 3. Mid-Left Dot Matrix Grid */}
      <div className="absolute top-1/3 left-3 sm:left-6 w-24 h-24 pointer-events-none -z-10 opacity-35 hidden md:block">
        <svg width="100" height="100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="footerDotsLeft" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.8" fill="#818CF8" />
          </pattern>
          <rect width="100" height="100" fill="url(#footerDotsLeft)" />
        </svg>
      </div>

      {/* 4. Top-Right Dot Matrix Grid */}
      <div className="absolute top-4 right-8 w-28 h-28 pointer-events-none -z-10 opacity-40 hidden md:block">
        <svg width="120" height="120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <pattern id="footerDotsRight" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.8" fill="#818CF8" />
          </pattern>
          <rect width="120" height="120" fill="url(#footerDotsRight)" />
        </svg>
      </div>

      {/* 5. Left Floating 3D Crystal Gem */}
      <div className="absolute top-1/2 -left-3 sm:left-4 w-9 h-9 sm:w-11 sm:h-11 pointer-events-none -z-10 animate-float-slow hidden xs:block">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_8px_16px_rgba(99,102,241,0.35)] -rotate-12">
          <polygon points="50,10 90,45 50,90 10,45" fill="#C4B5FD" fillOpacity="0.85" />
          <polygon points="50,10 90,45 50,55" fill="#FFFFFF" fillOpacity="0.95" />
          <polygon points="50,10 10,45 50,55" fill="#DDD6FE" fillOpacity="0.9" />
          <polygon points="10,45 50,90 50,55" fill="#8B5CF6" fillOpacity="0.9" />
          <polygon points="90,45 50,90 50,55" fill="#6366F1" fillOpacity="0.85" />
        </svg>
      </div>

      {/* 6. Right Floating 3D Crystal Cube */}
      <div className="absolute top-16 right-4 sm:right-10 w-10 h-10 sm:w-12 sm:h-12 pointer-events-none -z-10 animate-float-reverse hidden sm:block">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_10px_20px_rgba(139,92,246,0.35)] rotate-12">
          <polygon points="50,8 15,45 50,50" fill="#FFFFFF" fillOpacity="0.95" />
          <polygon points="50,8 85,45 50,50" fill="#DDD6FE" fillOpacity="0.9" />
          <polygon points="15,45 50,92 50,50" fill="#C4B5FD" fillOpacity="0.85" />
          <polygon points="85,45 50,92 50,50" fill="#8B5CF6" fillOpacity="0.9" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl space-y-10 sm:space-y-12">
        
        {/* ======================================================= */}
        {/* MAIN GRID: BRAND (4), NAV (6: 2+2+2), NEWSLETTER (4/3)  */}
        {/* ======================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          
          {/* ===================================================== */}
          {/* BRAND INFO & SOCIALS (Cols 1-4)                       */}
          {/* ===================================================== */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" theme="light" />
            
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed font-normal">
              UpPitch is the AI-powered proposal engine and portfolio builder for freelancers, agencies, and consultants. Win high-ticket Upwork contracts and cold outreach in seconds.
            </p>
            
            {/* Storage & Privacy Pill Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/90 px-3.5 py-1 text-[11px] text-indigo-700 font-medium shadow-2xs">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span>Client-Side Storage • Direct Gemini API</span>
            </div>

            {/* Social & Channel Icon Squircles (matching mockup) */}
            <div className="flex items-center gap-2 pt-1 text-slate-700">
              {/* X / Twitter */}
              {siteConfig.social.twitter && (
                <a
                  href={siteConfig.social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-xl border border-indigo-100/90 bg-white/80 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:scale-105 shadow-2xs flex items-center justify-center transition-all duration-200"
                  aria-label="X / Twitter"
                  title="Twitter / X"
                >
                  <svg className="h-3.5 w-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}

              {/* LinkedIn */}
              {siteConfig.social.linkedin && (
                <a
                  href={siteConfig.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-xl border border-indigo-100/90 bg-white/80 hover:bg-white hover:border-indigo-300 hover:scale-105 shadow-2xs flex items-center justify-center p-1.5 transition-all duration-200 group"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <Image
                    src="/images/linkedin-icon.png"
                    alt="LinkedIn"
                    width={24}
                    height={24}
                    className="h-full w-full object-contain rounded-xs group-hover:drop-shadow-[0_0_6px_rgba(10,102,194,0.5)]"
                  />
                </a>
              )}

              {/* GitHub */}
              {siteConfig.social.github && (
                <a
                  href={siteConfig.social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-xl border border-indigo-100/90 bg-white/80 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:scale-105 shadow-2xs flex items-center justify-center transition-all duration-200"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <svg className="h-3.5 w-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              )}

              {/* Upwork / Direct Link */}
              {siteConfig.social.upwork && (
                <a
                  href={siteConfig.social.upwork}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 rounded-xl border border-indigo-100/90 bg-white/80 hover:bg-white hover:border-indigo-300 hover:scale-105 shadow-2xs flex items-center justify-center p-1.5 transition-all duration-200 group"
                  aria-label="Upwork"
                  title="Upwork"
                >
                  <Image
                    src="/images/upwork-icon.png"
                    alt="Upwork"
                    width={24}
                    height={24}
                    className="h-full w-full object-contain group-hover:drop-shadow-[0_0_6px_rgba(22,163,74,0.5)]"
                  />
                </a>
              )}
            </div>
          </div>

          {/* ===================================================== */}
          {/* COL: PRODUCT (Cols 5-6)                               */}
          {/* ===================================================== */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 font-mono inline-block border-b-2 border-indigo-600 pb-0.5">
              PRODUCT
            </h4>
            <ul className="space-y-2.5 text-slate-600 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('workspace')}
                  className="cursor-pointer hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group text-left"
                >
                  <span className="group-hover:font-medium">Proposal Engine</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('purpose-built')}
                  className="cursor-pointer hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group text-left"
                >
                  <span className="group-hover:font-medium">Features</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('conversion-framework')}
                  className="cursor-pointer hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group text-left"
                >
                  <span className="group-hover:font-medium">Conversion Framework</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('testimonials')}
                  className="cursor-pointer hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group text-left"
                >
                  <span className="group-hover:font-medium">Testimonials</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              </li>
            </ul>
          </div>

          {/* ===================================================== */}
          {/* COL: RESOURCES (Cols 7-8)                             */}
          {/* ===================================================== */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 font-mono inline-block border-b-2 border-indigo-600 pb-0.5">
              RESOURCES
            </h4>
            <ul className="space-y-2.5 text-slate-600 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('faq')}
                  className="cursor-pointer hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group text-left"
                >
                  <span className="group-hover:font-medium">Help Center &amp; FAQ</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('conversion-framework')}
                  className="cursor-pointer hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group text-left"
                >
                  <span className="group-hover:font-medium">Upwork Winning Guide</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('comparison')}
                  className="cursor-pointer hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group text-left"
                >
                  <span className="group-hover:font-medium">Video Walkthroughs</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('testimonials')}
                  className="cursor-pointer hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group text-left"
                >
                  <span className="group-hover:font-medium">Freelancer Community</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </button>
              </li>
            </ul>
          </div>

          {/* ===================================================== */}
          {/* COL: COMPANY (Cols 9-10)                               */}
          {/* ===================================================== */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 font-mono inline-block border-b-2 border-indigo-600 pb-0.5">
              COMPANY
            </h4>
            <ul className="space-y-2.5 text-slate-600 text-xs">
              <li>
                <a
                  href="#purpose-built"
                  onClick={(e) => { e.preventDefault(); scrollTo('purpose-built'); }}
                  className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group"
                >
                  <span className="group-hover:font-medium">About UpPitch</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </a>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group"
                >
                  <span className="group-hover:font-medium">Terms of Service</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group"
                >
                  <span className="group-hover:font-medium">Privacy Policy</span>
                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                </Link>
              </li>
              {siteConfig.feedbackEmail && (
                <li>
                  <a
                    href={`mailto:${siteConfig.feedbackEmail}`}
                    className="hover:text-indigo-600 hover:translate-x-1 transition-all flex items-center justify-between w-full group"
                  >
                    <span className="group-hover:font-medium">Contact Support</span>
                    <ChevronRight className="h-3.5 w-3.5 text-indigo-400 group-hover:text-indigo-600 transition-colors shrink-0" />
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* ===================================================== */}
          {/* COL: GET UPDATES (ELEVATED CARD) (Cols 11-12)         */}
          {/* ===================================================== */}
          <div className="lg:col-span-2 w-full">
            <div className="rounded-3xl border border-white/95 bg-white/95 p-5 shadow-[0_20px_50px_rgba(99,102,241,0.14)] backdrop-blur-xl space-y-3.5">
              
              {/* Header with paper plane icon */}
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-600 shrink-0">
                  <Send className="h-4 w-4 fill-purple-600/30" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    Get Updates
                  </h4>
                  <p className="text-[10.5px] text-slate-500 leading-tight">
                    Join our newsletter for high-converting proposal tips and platform updates.
                  </p>
                </div>
              </div>

              {/* Newsletter Form */}
              <form onSubmit={handleSubscribe} className="space-y-2 pt-0.5">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-purple-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full rounded-xl border border-indigo-100 bg-[#F4F6FF] pl-9 pr-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/25 flex items-center justify-center gap-1.5 hover:scale-[1.01] active:scale-95 transition-all"
                >
                  {subscribed ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-200" />
                      <span>Subscribed! 🎉</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Subscribe &rarr;</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

        {/* ======================================================= */}
        {/* BOTTOM SUB-FOOTER: COPYRIGHT, AUTHOR & BACK TO TOP      */}
        {/* ======================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-indigo-100/80 text-[11px] text-slate-500">
          <div>
            <span>&copy; {new Date().getFullYear()} UpPitch. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 font-medium text-slate-600">
              <span>Built with</span>
              <span className="text-rose-500 font-bold">&hearts;</span>
              <span>for Freelancers by</span>
              <span className="font-bold text-slate-900">
                Hammad
              </span>
            </div>

            {/* Circular Back to Top Button matching mockup */}
            <button
              type="button"
              onClick={scrollToTop}
              className="cursor-pointer h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
              title="Back to Top"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
