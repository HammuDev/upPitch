'use client';

import React from 'react';
import { Channel, Tone, FreelancerProfile, ProjectItem, GeneratedPitches } from '@/types';
import { JobInput } from './workspace/JobInput';
import { ProfilePanel } from './workspace/ProfilePanel';
import { OutputPanel } from './workspace/OutputPanel';

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
  return (
    <div id="workspace" className="mx-auto max-w-7xl px-3.5 sm:px-6 lg:px-8 py-3 sm:py-4 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* LEFT COLUMN: User Inputs & Profile Context */}
        <section className="lg:col-span-5 space-y-3 sm:space-y-4" aria-label="Proposal Configuration">
          <div className="rounded-2xl border border-indigo-100/90 bg-white p-4 sm:p-5 space-y-4 shadow-xl shadow-indigo-500/5">
            <JobInput
              channel={channel}
              setChannel={setChannel}
              tone={tone}
              setTone={setTone}
              jobText={jobText}
              setJobText={setJobText}
              isGenerating={isGenerating}
              onGenerate={onGenerate}
              onLoadSampleBrief={onLoadSampleBrief}
              profileName={profile.name}
            />

            <ProfilePanel
              profile={profile}
              setProfile={setProfile}
              selectedProjectIds={selectedProjectIds}
              setSelectedProjectIds={setSelectedProjectIds}
              onSaveProfile={onSaveProfile}
              onOpenAddProject={onOpenAddProject}
              onOpenEditProject={onOpenEditProject}
              onDeleteProject={onDeleteProject}
            />
          </div>
        </section>

        {/* RIGHT COLUMN: Output Card & Proposal Variations */}
        <OutputPanel
          channel={channel}
          tone={tone}
          isGenerating={isGenerating}
          errorMessage={errorMessage}
          generatedPitches={generatedPitches}
          profile={profile}
          selectedProjectIds={selectedProjectIds}
          onGenerate={onGenerate}
          onOpenSettings={onOpenSettings}
          onLoadSampleBrief={onLoadSampleBrief}
        />
      </div>
    </div>
  );
});

Workspace.displayName = 'Workspace';
