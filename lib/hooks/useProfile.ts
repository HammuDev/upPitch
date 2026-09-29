'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FreelancerProfile, ProjectItem } from '@/types';
import { getStoredProfile, saveStoredProfile, DEFAULT_PROFILE } from '@/lib/storage';

export function useProfile() {
  const [profile, setProfile] = useState<FreelancerProfile>(DEFAULT_PROFILE);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const isHydratedRef = useRef(false);

  // Hydrate from localStorage on initial mount
  useEffect(() => {
    const saved = getStoredProfile();
    setProfile(saved);
    if (saved.projects && saved.projects.length > 0) {
      setSelectedProjectIds(saved.projects.map((p) => p.id));
    }
    isHydratedRef.current = true;
  }, []);

  // Persist to localStorage whenever profile changes (skipping initial pre-hydration write)
  useEffect(() => {
    if (!isHydratedRef.current) return;
    saveStoredProfile(profile);
  }, [profile]);

  const handleSaveProfile = useCallback((updated: FreelancerProfile) => {
    setProfile(updated);
  }, []);

  const handleAddProject = useCallback((newProject: ProjectItem) => {
    setProfile((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
    }));
    setSelectedProjectIds((prev) => [...prev, newProject.id]);
  }, []);

  const handleUpdateProject = useCallback((updatedProject: ProjectItem) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      ),
    }));
  }, []);

  const handleDeleteProject = useCallback((id: string) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    setSelectedProjectIds((prev) => prev.filter((pId) => pId !== id));
  }, []);

  return {
    profile,
    setProfile,
    selectedProjectIds,
    setSelectedProjectIds,
    handleSaveProfile,
    handleAddProject,
    handleUpdateProject,
    handleDeleteProject,
  };
}
