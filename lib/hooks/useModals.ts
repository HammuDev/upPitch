'use client';

import { useState, useCallback } from 'react';
import { ProjectItem } from '@/types';

export function useModals() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  const handleOpenHistory = useCallback(() => setIsHistoryOpen(true), []);
  const handleCloseHistory = useCallback(() => setIsHistoryOpen(false), []);
  const handleOpenSettings = useCallback(() => setIsSettingsOpen(true), []);
  const handleCloseSettings = useCallback(() => setIsSettingsOpen(false), []);
  const handleOpenAddProject = useCallback(() => setIsAddProjectOpen(true), []);
  const handleCloseAddProject = useCallback(() => setIsAddProjectOpen(false), []);

  const handleOpenEditProject = useCallback((projectToEdit: ProjectItem) => {
    setEditingProject(projectToEdit);
    setIsEditProjectOpen(true);
  }, []);

  const handleCloseEditProject = useCallback(() => {
    setIsEditProjectOpen(false);
    setEditingProject(null);
  }, []);

  return {
    isHistoryOpen,
    isSettingsOpen,
    isAddProjectOpen,
    isEditProjectOpen,
    editingProject,
    handleOpenHistory,
    handleCloseHistory,
    handleOpenSettings,
    handleCloseSettings,
    handleOpenAddProject,
    handleCloseAddProject,
    handleOpenEditProject,
    handleCloseEditProject,
  };
}
