'use strict';
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HeroHeader } from '@/components/HeroHeader';
import { Workspace } from '@/components/Workspace';
import { RecentPitches } from '@/components/RecentPitches';
import { RuleTicker } from '@/components/RuleTicker';
import { SeoFeatures } from '@/components/SeoFeatures';
import { ComparisonTable } from '@/components/ComparisonTable';
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

    // Filter ONLY the projects currently selected by the user
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

      // Save to history
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

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050811] text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-300 overflow-x-hidden">

      {/* Background Animated Gradient Mesh */}
      <AmbientBackground />

      {/* 1. Header Navigation Bar */}
      <Header
        historyCount={history.length}
        onOpenHistory={handleOpenHistory}
        onOpenSettings={handleOpenSettings}
      />

      {/* 2. Hero Header Section with SEO H1 */}
      <HeroHeader savedPitchesCount={history.length} />

      {/* 3. Main Two-Column Workspace Tool */}
      <main className="flex-1 relative z-10">
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

        {/* 4. Recent Pitches Archive */}
        <ScrollReveal delay={100}>
          <RecentPitches
            history={history}
            onOpenHistory={handleOpenHistory}
            onLoadPitch={handleLoadPitchFromHistory}
          />
        </ScrollReveal>

        {/* 5. Golden Rule Ticker */}
        <ScrollReveal delay={50}>
          <RuleTicker />
        </ScrollReveal>

        {/* 6. Comprehensive SEO Features & Framework */}
        <ScrollReveal delay={100}>
          <SeoFeatures />
        </ScrollReveal>

        {/* 7. Benchmark Comparison Matrix */}
        <ScrollReveal delay={100}>
          <ComparisonTable />
        </ScrollReveal>

        {/* 8. Frequently Asked Questions (FAQ) */}
        <ScrollReveal delay={100}>
          <FaqSection />
        </ScrollReveal>
      </main>

      {/* 9. Comprehensive SEO Footer */}
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
