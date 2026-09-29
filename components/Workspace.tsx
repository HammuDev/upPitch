'use strict';
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ClipboardPaste,
  ChevronDown,
  Trash2,
  Pencil,
  Link as LinkIcon,
  Copy,
  Check,
  RotateCw,
  Scissors,
  Video,
  Sliders,
  Sparkle,
  AlertCircle,
  Key,
  Mail,
} from 'lucide-react';
import { Channel, Tone, FreelancerProfile, ProjectItem, GeneratedPitches } from '@/types';

interface WorkspaceProps {
  channel: Channel;
  setChannel: (c: Channel) => void;
  tone: Tone;
  setTone: (t: Tone) => void;
  jobText: string;
  setJobText: (txt: string) => void;
  profile: FreelancerProfile;
  setProfile: React.Dispatch<React.SetStateAction<FreelancerProfile>>;
  selectedProjectIds: string[];
  setSelectedProjectIds: React.Dispatch<React.SetStateAction<string[]>>;
  onSaveProfile: (p: FreelancerProfile) => void;
  onOpenAddProject: () => void;
  onOpenEditProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  generatedPitches: GeneratedPitches | null;
  errorMessage: string | null;
  onOpenSettings: () => void;
  onLoadSampleBrief: () => void;
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

export const Workspace: React.FC<WorkspaceProps> = React.memo(({
  channel,
  setChannel,
  tone,
  setTone,
  jobText,
  setJobText,
  profile,
  setProfile,
  selectedProjectIds,
  setSelectedProjectIds,
  onSaveProfile,
  onOpenAddProject,
  onOpenEditProject,
  onDeleteProject,
  isGenerating,
  onGenerate,
  generatedPitches,
  errorMessage,
  onOpenSettings,
  onLoadSampleBrief,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'var-a' | 'var-b' | 'portfolio'>('var-a');
  const [copied, setCopied] = useState(false);
  const [editableVarA, setEditableVarA] = useState('');
  const [editableVarB, setEditableVarB] = useState('');

  // Sync generated pitches into editable state
  useEffect(() => {
    if (generatedPitches) {
      setEditableVarA(generatedPitches['var-a'] || '');
      setEditableVarB(generatedPitches['var-b'] || '');
      setActiveTab('var-a');
    }
  }, [generatedPitches]);

  const handleToggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setJobText(text);
    } catch {
      // Browser fallback
    }
  };

  const currentPitchText = activeTab === 'var-a' ? editableVarA : editableVarB;

  const handleCopy = () => {
    if (!currentPitchText) return;
    let textToCopy = currentPitchText;
    if (channel === 'cold-email' && generatedPitches?.subjectLine) {
      textToCopy = `Subject: ${generatedPitches.subjectLine}\n\n${currentPitchText}`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quick Modifiers
  const handleShorten = () => {
    if (!currentPitchText) return;
    const lines = currentPitchText.split('\n');
    const condensed = lines
      .filter((l) => !l.toLowerCase().includes('furthermore') && !l.toLowerCase().includes('in addition to that'))
      .join('\n');

    if (activeTab === 'var-a') {
      setEditableVarA(condensed);
    } else {
      setEditableVarB(condensed);
    }
  };

  const handleAddLoom = () => {
    if (
      !currentPitchText ||
      currentPitchText.includes('Loom') ||
      currentPitchText.includes('video breakdown') ||
      currentPitchText.includes('video walkthrough')
    ) {
      return;
    }
    const loomOffer = `Would you be open to a quick 3-minute video walkthrough where I demonstrate the proposed architecture step-by-step?`;
    let updated = currentPitchText;
    if (currentPitchText.match(/Best regards,|Best,|Regards,|Thanks,/i)) {
      updated = currentPitchText.replace(
        /(Best regards,|Best,|Regards,|Thanks,)/i,
        `${loomOffer}\n\n$1`
      );
    } else {
      updated = `${currentPitchText}\n\n${loomOffer}`;
    }

    if (activeTab === 'var-a') {
      setEditableVarA(updated);
    } else {
      setEditableVarB(updated);
    }
  };

  const wordCount = currentPitchText ? currentPitchText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = jobText.length;
  const selectedCount = profile.projects.filter((p) => selectedProjectIds.includes(p.id)).length;
  const displayedProofProjects = generatedPitches
    ? (generatedPitches.matchedProjects || (generatedPitches.matchedProject ? [generatedPitches.matchedProject] : []))
    : profile.projects.filter((p) => selectedProjectIds.includes(p.id));
  const proofCount = generatedPitches
    ? (generatedPitches.matchedProjects?.length ?? (generatedPitches.matchedProject ? 1 : 0))
    : selectedCount;

  return (
    <div id="workspace" className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-3 sm:py-4 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">

        {/* ==================================================== */}
        {/* LEFT COLUMN: User Inputs & Profile Context           */}
        {/* ==================================================== */}
        <section className="lg:col-span-5 space-y-3 sm:space-y-4" aria-label="Proposal Configuration">

          <div className="rounded-2xl border border-indigo-100/90 bg-white p-4 sm:p-5 space-y-4 shadow-xl shadow-indigo-500/5">

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
                      <img
                        src="/images/upwork-icon.png"
                        alt="Upwork"
                        className="h-3.5 w-3.5 object-contain shrink-0"
                      />
                    )}
                    {item.id === 'linkedin' && (
                      <img
                        src="/images/linkedin-icon.png"
                        alt="LinkedIn"
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

            {/* 4. COLLAPSIBLE: Profile & Verified Case Studies */}
            <div className="rounded-xl border border-indigo-100 bg-slate-50/60 overflow-hidden transition-all shadow-xs">
              <button
                type="button"
                onClick={() => setIsAccordionOpen(!isAccordionOpen)}
                className="cursor-pointer w-full flex items-center justify-between p-3 sm:p-3.5 text-left hover:bg-indigo-50/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Freelancer Profile &amp; Project Proof Vault
                  </span>
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.2 text-[9.5px] sm:text-[10px] font-semibold text-emerald-700 font-mono">
                    Ready
                  </span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-300 ${
                    isAccordionOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isAccordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="p-3 sm:p-3.5 pt-0 space-y-3.5 border-t border-slate-200/80">

                    {/* Freelancer Name & Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block mb-1">
                          NAME
                        </label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => {
                            const updated = { ...profile, name: e.target.value };
                            setProfile(updated);
                            onSaveProfile(updated);
                          }}
                          placeholder="e.g. Jane Doe"
                          className="cursor-text w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block mb-1">
                          TITLE / PRIMARY ROLE
                        </label>
                        <input
                          type="text"
                          value={profile.role}
                          onChange={(e) => {
                            const updated = { ...profile, role: e.target.value };
                            setProfile(updated);
                            onSaveProfile(updated);
                          }}
                          placeholder="Full-Stack Engineer & Next.js Specialist"
                          className="cursor-text w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono block">
                        CORE BIO &amp; VALUE STATEMENT
                      </label>
                      <textarea
                        rows={2}
                        value={profile.bio}
                        onChange={(e) => {
                          const updated = { ...profile, bio: e.target.value };
                          setProfile(updated);
                          onSaveProfile(updated);
                        }}
                        className="cursor-text w-full rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed"
                      />
                    </div>

                    {/* Verified Project Proof with Checkbox & Edit */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                          VERIFIED CASE STUDIES ({selectedCount}/{profile.projects.length} included)
                        </span>
                        <span className="text-[10px] text-indigo-600 font-mono font-semibold">
                          Check to include
                        </span>
                      </div>

                      <div className="space-y-2">
                        {profile.projects.map((proj, idx) => {
                          const isChecked = selectedProjectIds.includes(proj.id);
                          return (
                            <div
                              key={proj.id}
                              className={`rounded-lg border p-2.5 sm:p-3 space-y-1.5 transition-all ${
                                isChecked
                                  ? 'border-indigo-300 bg-indigo-50/70 shadow-2xs'
                                  : 'border-slate-200 bg-white opacity-85'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <label
                                  onClick={() => handleToggleProject(proj.id)}
                                  className="cursor-pointer flex items-center gap-2 flex-1 min-w-0"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => { }}
                                    className="cursor-pointer h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 accent-indigo-600"
                                  />
                                  <span className="text-xs font-bold text-slate-800 truncate">
                                    #{idx + 1} {proj.title}
                                  </span>
                                </label>

                                {/* Project Action Buttons: Edit & Delete */}
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => onOpenEditProject(proj)}
                                    className="cursor-pointer p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                                    title="Edit project details & skills"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onDeleteProject(proj.id)}
                                    className="cursor-pointer p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors"
                                    title="Delete project"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 rounded bg-white px-2 py-1 text-[10.5px] sm:text-[11px] font-mono text-slate-700 border border-slate-200">
                                <LinkIcon className="h-3 w-3 text-indigo-500 shrink-0" />
                                <span className="truncate">{proj.metricOrLink}</span>
                              </div>

                              <div className="flex flex-wrap gap-1 pt-0.5">
                                {proj.tags.map((t, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 border border-indigo-100 font-medium"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={onOpenAddProject}
                          className="cursor-pointer w-full rounded-lg border border-dashed border-indigo-200 bg-indigo-50/30 py-2 text-center text-xs font-semibold text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                        >
                          + Add Case Study to Bank
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. PRIMARY CTA BUTTON */}
            <div className="space-y-2 pt-1">
              {!profile.name?.trim() && (
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

        </section>

        {/* ==================================================== */}
        {/* RIGHT COLUMN: Output Card & Proposal Variations      */}
        {/* ==================================================== */}
        <section className="lg:col-span-7 space-y-3 sm:space-y-4 lg:sticky lg:top-20 lg:self-start transition-all" aria-label="Generated Proposal Output">

          <div className="rounded-2xl border border-indigo-100/90 bg-white p-4 sm:p-5 shadow-2xl shadow-indigo-500/8 space-y-4 min-h-[460px] sm:min-h-[490px] flex flex-col justify-between">

            <div>
              {/* Top Tab Bar inside Card */}
              <div className="grid grid-cols-3 gap-1 sm:gap-1.5 border-b border-slate-200 pb-3">
                {[
                  { id: 'var-a', short: 'Variation A', full: 'Variation A (Problem-First Fix)' },
                  { id: 'var-b', short: 'Variation B', full: 'Variation B (Consultative Loom)' },
                  { id: 'portfolio', short: `Proof (${proofCount})`, full: `Matched Proof (${proofCount})` },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id as any)}
                    className={`cursor-pointer rounded-lg py-1.5 sm:py-2 px-1 sm:px-2.5 text-center text-xs font-semibold transition-all duration-200 ${
                      activeTab === t.id
                        ? 'bg-indigo-600 text-white shadow-xs scale-[1.01]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="sm:hidden text-[11px] font-bold block truncate">{t.short}</span>
                    <span className="hidden sm:inline font-bold">{t.full}</span>
                  </button>
                ))}
              </div>

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 sm:p-3.5 space-y-2 animate-fade-in-up">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                    <span>Proposal Generation Notice</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    {errorMessage}
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={onOpenSettings}
                      className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 px-3 py-1 text-xs font-bold text-white shadow-xs transition-all hover:scale-[1.02]"
                    >
                      <Key className="h-3 w-3" />
                      <span>Configure Gemini API Key in Settings</span>
                    </button>
                  </div>
                </div>
              )}

              {/* GENERATING SKELETON STATE */}
              {isGenerating ? (
                <div className="py-6 sm:py-8 space-y-5 max-w-xl mx-auto animate-slide-fade">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-indigo-200 bg-indigo-50">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600" />
                      </span>
                      <span className="text-xs font-bold text-indigo-900">
                        Synthesizing Problem-First Proposal via Gemini AI...
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-700 font-semibold animate-pulse">
                      Analyzing brief
                    </span>
                  </div>

                  {/* Shimmer skeleton blocks */}
                  <div className="space-y-3.5 pt-1">
                    <div className="h-4 rounded-md w-3/4 animate-shimmer-bar bg-slate-200" />
                    <div className="h-3.5 rounded-md w-full animate-shimmer-bar bg-slate-200" />
                    <div className="h-3.5 rounded-md w-5/6 animate-shimmer-bar bg-slate-200" />
                    <div className="h-3.5 rounded-md w-4/5 animate-shimmer-bar bg-slate-200" />
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[11px] font-semibold text-slate-700">
                        Matching case study proof &amp; verified metrics...
                      </span>
                    </div>
                    <div className="h-3 rounded w-2/3 animate-shimmer-bar bg-slate-200" />
                  </div>
                </div>
              ) : !generatedPitches && !errorMessage ? (
                /* EMPTY STATE */
                <div className="py-4 sm:py-5 space-y-4 max-w-xl mx-auto animate-slide-fade">

                  {/* Top Status & Title */}
                  <div className="text-center space-y-2 pt-1">
                    <div className="mx-auto flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                      <Sliders className="h-5 w-5" />
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">
                        Your high-converting proposal is 1 click away
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                        UpPitch extracts the client&apos;s real-world technical problem and synthesizes two distinct high-converting bids backed by your verified project metrics.
                      </p>
                    </div>
                  </div>

                  {/* 2 Strategic Angle Blueprint Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">

                    {/* Angle 1 Card */}
                    <div className="rounded-xl border border-indigo-100 bg-slate-50/70 p-3 sm:p-3.5 space-y-2 hover:border-indigo-300 hover:bg-white transition-all card-hover-lift">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-mono flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-indigo-600" />
                          <span>VARIATION A</span>
                        </span>
                        <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[9px] font-mono font-bold text-indigo-700">
                          Direct Fix
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900">
                        Problem-First Solution
                      </h3>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Leads in the opening sentence with the client&apos;s exact technical bug, commit timeline, and verified metrics.
                      </p>
                    </div>

                    {/* Angle 2 Card */}
                    <div className="rounded-xl border border-purple-100 bg-slate-50/70 p-3 sm:p-3.5 space-y-2 hover:border-purple-300 hover:bg-white transition-all card-hover-lift">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 font-mono flex items-center gap-1">
                          <Video className="h-3 w-3 text-purple-600" />
                          <span>VARIATION B</span>
                        </span>
                        <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[9px] font-mono font-bold text-purple-700">
                          Consultative
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900">
                        Consultant &amp; Loom CTA
                      </h3>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Explores architecture &amp; edge cases, closing with a low-friction 3-minute Loom video walkthrough offer.
                      </p>
                    </div>

                  </div>

                  {/* 3 Quick Step Guide */}
                  <div className="space-y-1.5 text-left pt-1">
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-700 font-mono">
                        1
                      </span>
                      <span className="truncate">Paste any Upwork job post, client brief, or RFP</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-700 font-mono">
                        2
                      </span>
                      <span className="truncate">Select target outreach channel &amp; strategic tone</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-bold text-indigo-700 font-mono">
                        3
                      </span>
                      <span className="truncate">Include 1 to 2 case studies from your project bank for instant proof</span>
                    </div>
                  </div>

                  {/* Live Strategy & Action Pill */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 text-[11px] font-mono text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Mode: <strong className="text-slate-900 capitalize">{channel}</strong></span>
                      <span className="text-slate-400">/</span>
                      <span>Tone: <strong className="text-indigo-700 capitalize">{tone}</strong></span>
                      <span className="text-slate-400">/</span>
                      <span>Proof: <strong className="text-emerald-700">{selectedCount} Projects</strong></span>
                    </div>

                    <button
                      type="button"
                      onClick={onLoadSampleBrief}
                      className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Load Sample Brief</span>
                    </button>
                  </div>

                </div>
              ) : activeTab === 'portfolio' ? (
                /* MICRO-PORTFOLIO PREVIEW VIEW */
                <div className="py-4 sm:py-6 space-y-4 animate-slide-fade">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        Client-Facing Matched Case Studies
                      </h3>
                      <p className="text-[10.5px] sm:text-[11px] text-slate-500">
                        Verified projects woven into this proposal
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-700 font-mono font-bold">
                      {displayedProofProjects.length > 0 ? `${displayedProofProjects.length} Project(s) Matched` : 'No Matched Projects'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {displayedProofProjects.length === 0 ? (
                      <div className="text-center py-10 space-y-1.5 text-slate-500">
                        <p className="text-xs font-semibold text-slate-700">No matching project proof was used.</p>
                        <p className="text-[11px] text-slate-400">
                          {profile.projects.length === 0
                            ? 'Add projects in your profile with tags matching the client tech stack to cite verified proof.'
                            : 'None of your selected project tags overlapped with the client requirements.'}
                        </p>
                      </div>
                    ) : (
                      displayedProofProjects.map((p) => (
                        <div
                          key={p.id}
                          className="rounded-xl border border-indigo-100 bg-slate-50/70 p-3.5 sm:p-4 space-y-2 card-hover-lift"
                        >
                          <h4 className="text-xs font-bold text-slate-900">{p.title}</h4>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono">
                            <LinkIcon className="h-3 w-3 shrink-0" />
                            <span className="truncate">{p.metricOrLink}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {p.tags.map((t, idx) => (
                              <span
                                key={idx}
                                className="rounded bg-white px-2 py-0.5 text-[10px] text-slate-700 border border-slate-200"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* LIVE GENERATED PITCH VIEW */
                <div className="py-3 sm:py-4 space-y-3 sm:space-y-4 animate-slide-fade">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200">
                    <div className="flex items-center justify-between sm:justify-start gap-1.5 w-full sm:w-auto">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handleShorten}
                          className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Scissors className="h-3 w-3" />
                          <span>Shorten 30%</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleAddLoom}
                          className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Video className="h-3 w-3" />
                          <span>+ Loom Hook</span>
                        </button>
                      </div>

                      {/* Mobile Word Count Badge */}
                      <span className={`sm:hidden text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                        wordCount > 0 && wordCount <= 140
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : wordCount > 140
                          ? 'text-amber-700 bg-amber-50 border border-amber-200'
                          : 'text-slate-600'
                      }`}>
                        {wordCount}w {wordCount > 0 && wordCount <= 140 ? '✓' : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
                      {/* Desktop Word Count Badge */}
                      <span className={`hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded transition-colors ${
                        wordCount > 0 && wordCount <= 140
                          ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                          : wordCount > 140
                          ? 'text-amber-700 bg-amber-50 border border-amber-200'
                          : 'text-slate-600'
                      }`}>
                        {wordCount} words {wordCount > 0 && wordCount <= 140 ? '✓ optimal' : ''}
                      </span>
                      <button
                        type="button"
                        onClick={onGenerate}
                        className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <RotateCw className="h-3 w-3" />
                        <span>Regenerate</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCopy}
                        className={`cursor-pointer inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1 text-xs font-bold transition-all ${
                          copied
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                        }`}
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        <span>{copied ? 'Copied ✓' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Subject Line for Cold Email */}
                  {channel === 'cold-email' && generatedPitches?.subjectLine && (
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-2.5 text-xs flex items-center gap-2">
                      <span className="font-bold text-indigo-700 shrink-0">Subject:</span>
                      <span className="text-slate-900 font-medium truncate">{generatedPitches.subjectLine}</span>
                    </div>
                  )}

                  {/* Editable Textarea */}
                  <textarea
                    rows={12}
                    value={currentPitchText}
                    onChange={(e) => {
                      if (activeTab === 'var-a') {
                        setEditableVarA(e.target.value);
                      } else {
                        setEditableVarB(e.target.value);
                      }
                    }}
                    className="cursor-text w-full bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 sm:p-4 text-xs sm:text-[13px] text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:border-indigo-500 resize-y font-normal"
                  />

                  {/* Subtle Notice if No Project Proof Matched */}
                  {generatedPitches && (!generatedPitches.matchedProjects || generatedPitches.matchedProjects.length === 0) && !generatedPitches.matchedProject && (
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5 pt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                      <span>No matching project proof was used.</span>
                    </div>
                  )}

                  {/* Warnings as small amber chips */}
                  {generatedPitches?.warnings && generatedPitches.warnings.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {generatedPitches.warnings.map((w, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-medium text-amber-800"
                        >
                          <AlertCircle className="h-3 w-3 shrink-0 text-amber-600" />
                          <span>{w}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Gaps List */}
                  {generatedPitches?.gaps && generatedPitches.gaps.length > 0 && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 space-y-1 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-[11px]">
                        <AlertCircle className="h-3 w-3 text-slate-500 shrink-0" />
                        <span>Not proven in your profile:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 pl-1">
                        {generatedPitches.gaps.map((gap, idx) => (
                          <li key={idx}>{gap}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Footer: Disclaimer & Brand Mark */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-3 sm:pt-4 border-t border-slate-200">
              <p className="text-[10.5px] text-slate-500 font-normal text-center sm:text-left">
                AI drafts can be wrong. Review before sending. Not affiliated with Upwork.
              </p>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-[10px] text-slate-600 font-mono shrink-0">
                <span>Built for Freelancers by</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" /> Hammad
                </span>
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
});

Workspace.displayName = 'Workspace';
