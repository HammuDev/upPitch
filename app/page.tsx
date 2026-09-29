'use strict';
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HeroHeader } from '@/components/HeroHeader';
import { Workspace } from '@/components/Workspace';
import { PurposeBuiltSection } from '@/components/PurposeBuiltSection';
import { ComparisonSection } from '@/components/ComparisonSection';
import { ConversionSection } from '@/components/ConversionSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { AmbientBackground } from '@/components/AmbientBackground';
import { ScrollReveal } from '@/components/ScrollReveal';
import { HistoryDrawer } from '@/components/HistoryDrawer';
import { SettingsModal } from '@/components/SettingsModal';
import { AddProjectModal } from '@/components/AddProjectModal';
import { EditProjectModal } from '@/components/EditProjectModal';
import {
  Channel,
  Tone,
  FreelancerProfile,
  ProjectItem,
  GeneratedPitches,
  HistoryItem,
} from '@/types';
import {
  getStoredProfile,
  saveStoredProfile,
  getStoredHistory,
  saveStoredHistory,
  DEFAULT_PROFILE,
} from '@/lib/storage';
import { generatePitchWithGemini } from '@/lib/pitchGenerator';

export default function Home() {
  const [channel, setChannel] = useState<Channel>('upwork');
  const [tone, setTone] = useState<Tone>('direct');
  const [jobText, setJobText] = useState('');
  const [profile, setProfile] = useState<FreelancerProfile>(DEFAULT_PROFILE);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [generatedPitches, setGeneratedPitches] = useState<GeneratedPitches | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Modals & Drawers
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedProfile = getStoredProfile();
    setProfile(savedProfile);
    if (savedProfile.projects.length > 0) {
      setSelectedProjectIds(savedProfile.projects.map((p) => p.id));
    }

    const savedHistory = getStoredHistory();
    setHistory(savedHistory);
  }, []);

  const handleOpenHistory = useCallback(() => setIsHistoryOpen(true), []);
  const handleCloseHistory = useCallback(() => setIsHistoryOpen(false), []);
  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);
  const handleOpenAddProject = useCallback(() => setIsAddProjectOpen(true), []);
  const handleCloseAddProject = useCallback(() => setIsAddProjectOpen(false), []);

  const handleSaveProfile = useCallback((updated: FreelancerProfile) => {
    setProfile(updated);
    saveStoredProfile(updated);
  }, []);

  const handleAddProject = useCallback((newProject: ProjectItem) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        projects: [newProject, ...prev.projects],
      };
      saveStoredProfile(updated);
      return updated;
    });
    setSelectedProjectIds((prev) => [...prev, newProject.id]);
  }, []);

  const handleOpenEditProject = useCallback((projectToEdit: ProjectItem) => {
    setEditingProject(projectToEdit);
    setIsEditProjectOpen(true);
  }, []);

  const handleCloseEditProject = useCallback(() => {
    setIsEditProjectOpen(false);
    setEditingProject(null);
  }, []);

  const handleUpdateProject = useCallback((updatedProject: ProjectItem) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === updatedProject.id ? updatedProject : p
        ),
      };
      saveStoredProfile(updated);
      return updated;
    });
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        projects: prev.projects.filter((p) => p.id !== id),
      };
      saveStoredProfile(updated);
      return updated;
    });
    setSelectedProjectIds((prev) => prev.filter((pId) => pId !== id));
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!jobText.trim()) {
      alert('Please paste a job description or click "Try Sample Brief" first.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    const selectedProjects = profile.projects.filter((p) =>
      selectedProjectIds.includes(p.id)
    );

    try {
      const res = await generatePitchWithGemini({
        jobText,
        profile,
        selectedProjects,
        channel,
        tone,
      });

      setGeneratedPitches(res);

      const newHistoryItem: HistoryItem = {
        id: 'hist-' + Date.now(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel,
        tone,
        variationName: 'Variation A (Direct)',
        pitchText: res['var-a'],
        jobSnippet: jobText.substring(0, 120),
      };

      setHistory((prevHistory) => {
        const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 25);
        saveStoredHistory(updatedHistory);
        return updatedHistory;
      });
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage(err.message || 'Failed to generate proposal via Gemini AI.');
      setGeneratedPitches(null);
    } finally {
      setIsGenerating(false);
    }
  }, [jobText, profile, selectedProjectIds, channel, tone]);

  const handleLoadSampleBrief = useCallback(() => {
    const sample = `Looking for an experienced Next.js developer to fix a broken Stripe webhook race condition and resolve an urgent database migration issue. Customers are experiencing duplicate billing records during concurrent checkout events. Need this resolved and cleanly tested in our staging environment within 24-48 hours.`;
    setJobText(sample);
    setChannel('upwork');
    setTone('direct');
    setErrorMessage(null);
  }, []);

  const handleLoadSampleProposal = useCallback((proposalText: string) => {
    handleLoadSampleBrief();
    setGeneratedPitches({
      'var-a': proposalText,
      'var-b': `Hi there,\n\nI reviewed your brief regarding the duplicate Stripe billing race condition. Having analyzed similar multi-tenant billing pipelines, this is typically caused by webhook concurrency without an atomic distributed lock.\n\n• Inspect: Audit PostgreSQL isolation level during concurrent webhook handling.\n• Implement: Redis-backed distributed lock with idempotent key verification.\n• Test: Run 100-event concurrent staging simulation.\n\nWould you be open to a 3-minute video breakdown of our reference architecture?\n\nBest regards,\n[Your Name]\n[Your Title]`,
      detectedProblems: [
        'Stripe webhook race condition during concurrent checkouts',
        'Duplicate customer billing records in database',
        'Urgent 24-48h turnaround requirement in staging'
      ],
    });
  }, [handleLoadSampleBrief]);

  const handleLoadPitchFromHistory = useCallback((item: HistoryItem) => {
    setChannel(item.channel);
    setTone(item.tone);
    setJobText(item.jobSnippet || '');
    setGeneratedPitches({
      'var-a': item.pitchText,
      'var-b': item.pitchText,
      detectedProblems: ['Loaded from archive'],
    });
    setErrorMessage(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (confirm('Clear all proposal history?')) {
      setHistory([]);
      saveStoredHistory([]);
    }
  }, []);

  const scrollToWorkspace = useCallback(() => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Also focus the textarea for instant user delight
      setTimeout(() => {
        const textarea = el.querySelector('textarea');
        if (textarea) textarea.focus();
      }, 400);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8F9FE] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-700 overflow-x-clip">

      {/* Background Animated Gradient Mesh with 3D Crystals & Waves */}
      <AmbientBackground />

      {/* 1. Header Navigation Bar */}
      <Header
        historyCount={history.length}
        onOpenHistory={handleOpenHistory}
        onOpenSettings={handleOpenSettings}
      />

      {/* 2. Hero Header Section (2-Column Studio Layout matching template) */}
      <HeroHeader
        savedPitchesCount={history.length}
        onLoadSampleBrief={handleLoadSampleBrief}
        onScrollToWorkspace={scrollToWorkspace}
      />

      {/* Main Page Content */}
      <main className="flex-1 relative z-10 space-y-4 sm:space-y-6">
        
        {/* 3. Main Workspace Proposal Generator Tool (100% Functionality Intact) */}
        <ScrollReveal delay={50}>
          <Workspace
            channel={channel}
            setChannel={setChannel}
            tone={tone}
            setTone={setTone}
            jobText={jobText}
            setJobText={setJobText}
            profile={profile}
            setProfile={setProfile}
            selectedProjectIds={selectedProjectIds}
            setSelectedProjectIds={setSelectedProjectIds}
            onSaveProfile={handleSaveProfile}
            onOpenAddProject={handleOpenAddProject}
            onOpenEditProject={handleOpenEditProject}
            onDeleteProject={handleDeleteProject}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            generatedPitches={generatedPitches}
            errorMessage={errorMessage}
            onOpenSettings={handleOpenSettings}
            onLoadSampleBrief={handleLoadSampleBrief}
          />
        </ScrollReveal>

        {/* 4. Purpose-Built for High-Ticket Clients (Matching Mockup Section 2) */}
        <ScrollReveal delay={50}>
          <PurposeBuiltSection
            onLoadSampleProposal={handleLoadSampleProposal}
            onScrollToWorkspace={scrollToWorkspace}
          />
        </ScrollReveal>

        {/* 5. Why Generic ChatGPT Proposals Get Rejected (3 Cards Comparison) */}
        <ScrollReveal delay={50}>
          <ComparisonSection />
        </ScrollReveal>

        {/* 6. Why UpPitch Converts & Engineered for Top 1% (Matching Mockup Sections 3 & 4) */}
        <ScrollReveal delay={50}>
          <ConversionSection />
        </ScrollReveal>

        {/* 7. Real People. Real Results. Testimonials Interactive Carousel */}
        <ScrollReveal delay={50}>
          <TestimonialsSection />
        </ScrollReveal>

        {/* 8. Frequently Asked Questions with 3D Artwork (Matching Mockup Section 6) */}
        <ScrollReveal delay={50}>
          <FaqSection />
        </ScrollReveal>

      </main>

      {/* 9. Comprehensive SEO Dark Footer (Matching Mockup Section 7) */}
      <Footer />

      {/* Modals & Drawers */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={handleCloseHistory}
        history={history}
        onClearHistory={handleClearHistory}
        onLoadPitch={handleLoadPitchFromHistory}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
      />

      <AddProjectModal
        isOpen={isAddProjectOpen}
        onClose={handleCloseAddProject}
        onAdd={handleAddProject}
      />

      <EditProjectModal
        isOpen={isEditProjectOpen}
        project={editingProject}
        onClose={handleCloseEditProject}
        onSave={handleUpdateProject}
      />

    </div>
  );
}
