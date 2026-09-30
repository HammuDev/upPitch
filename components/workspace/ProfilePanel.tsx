'use client';

import React, { useState, useRef } from 'react';
import {
  ChevronDown,
  Trash2,
  Pencil,
  Link as LinkIcon,
  Download,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { FreelancerProfile, ProjectItem } from '@/types';
import { normalizeStoredProfile } from '@/lib/storage';

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
  const [pendingImport, setPendingImport] = useState<FreelancerProfile | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleToggleProject = (id: string) => {
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const handleExportProfile = () => {
    const cleanProfile = {
      name: profile.name,
      role: profile.role,
      bio: profile.bio,
      experience: profile.experience || '',
      defaultCta: profile.defaultCta || '',
      projects: profile.projects || [],
    };
    const blob = new Blob([JSON.stringify(cleanProfile, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanSlug = profile.name ? profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'profile';
    a.download = `uppitch-${cleanSlug}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers onChange
    e.target.value = '';

    if (file.size > 100 * 1024) {
      setImportError('File exceeds the 100 KB limit. Please select a valid profile JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Invalid file content');
        }
        const parsed = JSON.parse(text);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('JSON root must be an object');
        }
        const normalized = normalizeStoredProfile(parsed);
        setPendingImport(normalized);
      } catch {
        setImportError('Invalid JSON file. Please ensure the file is a valid profile backup.');
      }
    };
    reader.onerror = () => {
      setImportError('Failed to read file.');
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    setProfile(pendingImport);
    onSaveProfile(pendingImport);
    setSelectedProjectIds(pendingImport.projects.map((p) => p.id));
    setPendingImport(null);
    setImportError(null);
  };

  const selectedCount = profile.projects.filter((p) =>
    selectedProjectIds.includes(p.id)
  ).length;

  return (
    <div className="rounded-xl border border-indigo-100 bg-slate-50/60 overflow-hidden transition-all shadow-xs">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".json,application/json"
        className="hidden"
      />

      <div className="w-full flex items-center justify-between p-3 sm:p-3.5 hover:bg-indigo-50/40 transition-colors">
        <button
          type="button"
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="cursor-pointer flex items-center gap-2 text-left flex-1"
        >
          <span className="text-xs font-bold text-slate-800">
            Freelancer Profile &amp; Project Proof Vault
          </span>
          <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.2 text-[9.5px] sm:text-[10px] font-semibold text-emerald-700 font-mono">
            Ready
          </span>
        </button>

        <div className="flex items-center gap-2">
          {/* Export / Import Buttons */}
          <div className="flex items-center gap-1.5 mr-1 text-[11px] font-medium">
            <button
              type="button"
              onClick={handleExportProfile}
              className="cursor-pointer inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors"
              title="Export profile and projects as JSON"
            >
              <Download className="h-3 w-3" />
              <span className="hidden xs:inline">Export</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors"
              title="Import profile from JSON file (max 100 KB)"
            >
              <Upload className="h-3 w-3" />
              <span className="hidden xs:inline">Import</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="cursor-pointer p-0.5 text-slate-500 hover:text-indigo-600 transition-colors"
            aria-label="Toggle profile accordion"
          >
            <ChevronDown
              className={`h-4 w-4 shrink-0 transition-transform duration-300 ${
                isAccordionOpen ? 'rotate-180 text-indigo-600' : ''
              }`}
            />
          </button>
        </div>
      </div>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isAccordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-3 sm:p-3.5 pt-0 space-y-3.5 border-t border-slate-200/80">
            {/* Inline Import Error Alert */}
            {importError && (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 flex items-start justify-between gap-2 text-xs text-rose-800 animate-fade-in-up">
                <div className="flex items-start gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{importError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setImportError(null)}
                  className="cursor-pointer font-bold text-rose-600 hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Inline Pending Import Confirmation */}
            {pendingImport && (
              <div className="mt-3 rounded-lg border border-indigo-200 bg-indigo-50/90 p-3 space-y-2 animate-fade-in-up">
                <div className="text-xs font-bold text-indigo-950">
                  Import profile: &quot;{pendingImport.name || 'Anonymous'}&quot; ({pendingImport.projects.length} case studies)?
                </div>
                <p className="text-[11px] text-indigo-800 leading-tight">
                  This will replace your current profile and case studies in local storage.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmImport}
                    className="cursor-pointer rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-2xs"
                  >
                    Confirm Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingImport(null)}
                    className="cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
