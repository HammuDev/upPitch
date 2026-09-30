'use client';

import React, { useState } from 'react';
import {
  ChevronDown,
  Trash2,
  Pencil,
  Link as LinkIcon,
} from 'lucide-react';
import { FreelancerProfile, ProjectItem } from '@/types';

interface ProfilePanelProps {
  profile: FreelancerProfile;
  setProfile: React.Dispatch<React.SetStateAction<FreelancerProfile>>;
  selectedProjectIds: string[];
  setSelectedProjectIds: React.Dispatch<React.SetStateAction<string[]>>;
  onSaveProfile: (p: FreelancerProfile) => void;
  onOpenAddProject: () => void;
  onOpenEditProject: (project: ProjectItem) => void;
  onDeleteProject: (id: string) => void;
}

export const ProfilePanel: React.FC<ProfilePanelProps> = React.memo(({
  profile,
  setProfile,
  selectedProjectIds,
  setSelectedProjectIds,
  onSaveProfile,
  onOpenAddProject,
  onOpenEditProject,
  onDeleteProject,
}) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);

  const handleToggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const selectedCount = profile.projects.filter((p) =>
    selectedProjectIds.includes(p.id)
  ).length;

  return (
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
                            onChange={() => {}}
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
                            className="cursor-pointer p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                            title="Edit project details & skills"
                            aria-label={`Edit project ${proj.title}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProject(proj.id)}
                            className="cursor-pointer p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                            title="Delete project"
                            aria-label={`Delete project ${proj.title}`}
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
  );
});

ProfilePanel.displayName = 'ProfilePanel';
