'use strict';
import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { ProjectItem } from '@/types';
import { SkillTagInput } from './SkillTagInput';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: ProjectItem) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = React.memo(({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [metricOrLink, setMetricOrLink] = useState('');
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript', 'Next.js']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !metricOrLink.trim()) return;

    const newProject: ProjectItem = {
      id: 'proj-' + Date.now(),
      title: title.trim(),
      metricOrLink: metricOrLink.trim(),
      tags: tags.length > 0 ? tags : ['Next.js', 'TypeScript'],
    };

    onAdd(newProject);
    setTitle('');
    setMetricOrLink('');
    setTags(['React', 'TypeScript', 'Next.js']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3.5 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0B0F1A] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[95vh] overflow-y-auto animate-modal-scale">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <FolderPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Add Project / Case Study</h3>
              <p className="text-[11px] text-slate-400">Add proof to rank against client job briefs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-white hover:bg-white/[0.05] rounded-lg p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Project Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rebuilt payment gateway & webhook pipeline for fintech SaaS"
              className="cursor-text w-full rounded-xl border border-white/[0.08] bg-[#070A14] px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Measurable Metric */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Measurable Metric or Proof Link *
            </label>
            <input
              type="text"
              required
              value={metricOrLink}
              onChange={(e) => setMetricOrLink(e.target.value)}
              placeholder="e.g. 0.8s load time & $1.5M processed with zero webhook errors"
              className="cursor-text w-full rounded-xl border border-white/[0.08] bg-[#070A14] px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Intelligent Skill & Tech Tags Selector with Autocomplete */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Tech Stack &amp; Skills Tagged (Used for AI Matching)
            </label>
            <SkillTagInput
              tags={tags}
              onChange={setTags}
              placeholder="Type letter or skill (e.g. j, react, python)..."
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-3.5 py-2 font-medium text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-500 px-4 py-2 font-semibold text-white shadow-md shadow-indigo-500/20 transition-all"
            >
              Save to Project Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AddProjectModal.displayName = 'AddProjectModal';
