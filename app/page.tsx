'use client';

import React, { useState, useCallback } from 'react';
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
import { Channel, Tone, GeneratedPitches, HistoryItem } from '@/types';
import { useProfile } from '@/lib/hooks/useProfile';
import { useHistory } from '@/lib/hooks/useHistory';
import { useModals } from '@/lib/hooks/useModals';
import { generatePitchWithGemini } from '@/lib/pitchGenerator';
import { SAMPLE_BRIEF, SAMPLE_PROPOSAL_B, SAMPLE_DETECTED_PROBLEMS } from '@/lib/constants';

export default function Home() {
  const [channel, setChannel] = useState<Channel>('upwork');
  const [tone, setTone] = useState<Tone>('direct');
  const [jobText, setJobText] = useState('');
  const [generatedPitches, setGeneratedPitches] = useState<GeneratedPitches | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    profile,
    setProfile,
    selectedProjectIds,
    setSelectedProjectIds,
    handleSaveProfile,
    handleAddProject,
    handleUpdateProject,
    handleDeleteProject,
  } = useProfile();

  const { history, addHistoryItem, clearHistory } = useHistory();
  const modals = useModals();

  const handleGenerate = useCallback(async () => {
    if (!jobText.trim()) {
      setErrorMessage('Please paste a job description or click "Try Sample Brief" first.');
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

      const now = new Date();
      const newHistoryItem: HistoryItem = {
        id: 'hist-' + Date.now(),
        timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: now.toISOString(),
        channel,
        tone,
        variationName: 'Variation A (Direct)',
        pitchText: res['var-a'],
        pitchTextB: res['var-b'],
        subjectLine: res.subjectLine,
        jobSnippet: jobText.substring(0, 120),
      };

      addHistoryItem(newHistoryItem);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setErrorMessage(err.message || 'Failed to generate proposal via Gemini AI.');
      setGeneratedPitches(null);
    } finally {
      setIsGenerating(false);
    }
  }, [jobText, profile, selectedProjectIds, channel, tone, addHistoryItem]);

  const handleLoadSampleBrief = useCallback(() => {
    setJobText(SAMPLE_BRIEF);
    setChannel('upwork');
    setTone('direct');
    setErrorMessage(null);
  }, []);

  const handleLoadSampleProposal = useCallback((proposalText: string) => {
    handleLoadSampleBrief();
    setGeneratedPitches({
      'var-a': proposalText,
      'var-b': SAMPLE_PROPOSAL_B,
      detectedProblems: SAMPLE_DETECTED_PROBLEMS,
    });
  }, [handleLoadSampleBrief]);

  const handleLoadPitchFromHistory = useCallback((item: HistoryItem) => {
    setChannel(item.channel);
    setTone(item.tone);
    setJobText(item.jobSnippet || '');
    setGeneratedPitches({
      'var-a': item.pitchText,
      'var-b': item.pitchTextB || item.pitchText,
      subjectLine: item.subjectLine,
      detectedProblems: ['Loaded from archive'],
    });
    setErrorMessage(null);
  }, []);

  const handleClearHistory = useCallback(() => {
    if (confirm('Clear all proposal history?')) {
      clearHistory();
    }
  }, [clearHistory]);

  const scrollToWorkspace = useCallback(() => {
    const el = document.getElementById('workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const textarea = el.querySelector('textarea');
        if (textarea) textarea.focus();
      }, 400);
    }
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F8F9FE] text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-700 overflow-x-clip">
      <AmbientBackground />

      <Header
        historyCount={history.length}
        onOpenHistory={modals.handleOpenHistory}
        onOpenSettings={modals.handleOpenSettings}
      />

      <HeroHeader
        savedPitchesCount={history.length}
        onLoadSampleBrief={handleLoadSampleBrief}
        onScrollToWorkspace={scrollToWorkspace}
      />

      <main className="flex-1 relative z-10 space-y-4 sm:space-y-6">
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
          onOpenAddProject={modals.handleOpenAddProject}
          onOpenEditProject={modals.handleOpenEditProject}
          onDeleteProject={handleDeleteProject}
          isGenerating={isGenerating}
          onGenerate={handleGenerate}
          generatedPitches={generatedPitches}
          errorMessage={errorMessage}
          onOpenSettings={modals.handleOpenSettings}
          onLoadSampleBrief={handleLoadSampleBrief}
        />

        <ScrollReveal delay={50}>
          <PurposeBuiltSection
            onLoadSampleProposal={handleLoadSampleProposal}
            onScrollToWorkspace={scrollToWorkspace}
          />
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <ComparisonSection />
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <ConversionSection />
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <TestimonialsSection />
        </ScrollReveal>

        <ScrollReveal delay={50}>
          <FaqSection />
        </ScrollReveal>
      </main>

      <Footer />

      <HistoryDrawer
        isOpen={modals.isHistoryOpen}
        onClose={modals.handleCloseHistory}
        history={history}
        onClearHistory={handleClearHistory}
        onLoadPitch={handleLoadPitchFromHistory}
      />

      <SettingsModal isOpen={modals.isSettingsOpen} onClose={modals.handleCloseSettings} />

      <AddProjectModal
        isOpen={modals.isAddProjectOpen}
        onClose={modals.handleCloseAddProject}
        onAdd={handleAddProject}
      />

      <EditProjectModal
        isOpen={modals.isEditProjectOpen}
        project={modals.editingProject}
        onClose={modals.handleCloseEditProject}
        onSave={handleUpdateProject}
      />
    </div>
  );
}
