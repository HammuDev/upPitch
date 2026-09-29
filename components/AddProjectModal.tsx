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

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-3.5 sm:p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-project-modal-title"
        className="w-full max-w-lg rounded-2xl border border-indigo-100 bg-white p-5 sm:p-6 shadow-2xl shadow-indigo-500/10 space-y-4 max-h-[95vh] overflow-y-auto animate-modal-scale"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <FolderPlus className="h-4 w-4" />
            </div>
            <div>
              <h3 id="add-project-modal-title" className="text-sm font-bold text-slate-900">Add Project / Case Study</h3>
              <p className="text-[11px] text-slate-500">Add proof to rank against client job briefs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1.5 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Project Title */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Project Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Rebuilt payment gateway & webhook pipeline for fintech SaaS"
              className="cursor-text w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Measurable Metric */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Measurable Metric or Proof Link *
            </label>
            <input
              type="text"
              required
              value={metricOrLink}
              onChange={(e) => setMetricOrLink(e.target.value)}
              placeholder="e.g. 0.8s load time & 99.9% uptime with zero webhook errors"
              className="cursor-text w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* Intelligent Skill & Tech Tags Selector with Autocomplete */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Tech Stack &amp; Skills Tagged (Used for AI Matching)
            </label>
            <SkillTagInput
              tags={tags}
              onChange={setTags}
              placeholder="Type letter or skill (e.g. j, react, python)..."
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-3.5 py-2 font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 font-semibold text-white shadow-md shadow-indigo-500/20 transition-all"
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
