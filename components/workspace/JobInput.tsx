'use client';

import React from 'react';
import Image from 'next/image';
import {
  Sparkles,
  ClipboardPaste,
  Sparkle,
  AlertCircle,
  Mail,
} from 'lucide-react';
import { Channel, Tone } from '@/types';

interface JobInputProps {
  channel: Channel;
  setChannel: (c: Channel) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
  jobText: string;
  setJobText: (txt: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  onLoadSampleBrief: () => void;
  profileName?: string;
}

const CHANNELS: { id: Channel; label: string; limit: string }[] = [
  { id: 'upwork', label: 'Upwork', limit: '5,000 chars (Problem-first)' },
  { id: 'cold-email', label: 'Cold Email', limit: 'Subject + High-reply body' },
  { id: 'linkedin', label: 'LinkedIn DM', limit: 'Concise InMail format' },
  { id: 'twitter', label: 'X / Twitter', limit: 'Direct message format' },
];

const TONES: { id: Tone; label: string; desc: string }[] = [
  { id: 'direct', label: 'Direct & Problem-First', desc: 'Addresses exact bug/blocker in sentence one' },
  { id: 'consultative', label: 'Technical Consultant', desc: 'Deep architecture analysis with video offer' },
  { id: 'casual', label: 'Agile & High-Urgency', desc: 'Fast 24-48h turnaround execution pitch' },
];

export const JobInput: React.FC<JobInputProps> = React.memo(({
  channel,
  setChannel,
  tone,
  setTone,
  jobText,
  setJobText,
  isGenerating,
  onGenerate,
  onLoadSampleBrief,
  profileName,
}) => {
  const charCount = jobText.length;

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setJobText(text);
    } catch {
      // Browser fallback
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. CHANNEL SELECTOR */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            TARGET OUTREACH CHANNEL
          </label>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
            {CHANNELS.find((c) => c.id === channel)?.limit}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1">
          {CHANNELS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setChannel(item.id)}
              className={`cursor-pointer rounded-lg py-2 px-1 text-center text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                channel === item.id
                  ? 'bg-indigo-600 text-white shadow-xs scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {item.id === 'upwork' && (
                <Image
                  src="/images/upwork-icon.png"
                  alt="Upwork"
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5 object-contain shrink-0"
                />
              )}
              {item.id === 'linkedin' && (
                <Image
                  src="/images/linkedin-icon.png"
                  alt="LinkedIn"
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5 object-contain rounded-[2px] shrink-0"
                />
              )}
              {item.id === 'cold-email' && (
                <Mail className="h-3.5 w-3.5 shrink-0" />
              )}
              {item.id === 'twitter' && (
                <svg className="h-3 w-3 fill-currentColor shrink-0" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <p className="text-[11px] text-slate-500">
          Clients skim the first 2 lines. We lead directly with their technical bottleneck, not your résumé.
        </p>
      </div>

      {/* 2. PROPOSAL TONE & STRATEGY */}
      <div className="space-y-2">
        <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
          STRATEGY &amp; TONE
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {TONES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTone(item.id)}
              className={`cursor-pointer rounded-lg border px-2.5 py-2 text-center text-xs font-semibold transition-all duration-200 ${
                tone === item.id
                  ? 'border-indigo-400 bg-indigo-50/90 text-indigo-700 font-bold shadow-xs scale-[1.02]'
                  : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. CLIENT JOB BRIEF */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            CLIENT JOB BRIEF &amp; REQUIREMENTS
          </label>
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
            {charCount} chars
          </span>
        </div>

        <div className="relative rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <textarea
            rows={5}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            placeholder="Paste the full client brief or Upwork posting here.&#10;&#10;Include the core bottleneck, tech stack requirements, and deadline. UpPitch mirrors this exact technical language in your opening pitch."
            className="cursor-text w-full bg-transparent p-3 sm:p-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none leading-relaxed resize-y min-h-[120px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-t border-slate-200/80 bg-white/70">
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-indigo-600 transition-colors"
            >
              <ClipboardPaste className="h-3 w-3 text-slate-400" />
              <span>Paste from Clipboard</span>
            </button>

            <button
              type="button"
              onClick={onLoadSampleBrief}
              className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              <span>Try Sample Brief</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. PRIMARY CTA BUTTON */}
      <div className="space-y-2 pt-1">
        {(!profileName || !profileName.trim()) && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/90 p-2.5 sm:p-3 flex items-start gap-2 text-xs text-amber-800 animate-fade-in-up">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <span>Add your name and title in the profile section so proposals are signed correctly.</span>
          </div>
        )}

        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerate}
          className="cursor-pointer disabled:cursor-not-allowed w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-3 sm:py-3.5 px-4 text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all disabled:opacity-50 btn-shine-effect"
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
              <span>Synthesizing Tailored Proposal via Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkle className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-white shrink-0" />
              <span>Generate Winning Proposal ⚡</span>
              <Sparkle className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-white shrink-0" />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-slate-500">
          Dynamic AI generation with zero canned templates.
        </p>
      </div>
    </div>
  );
});

JobInput.displayName = 'JobInput';
