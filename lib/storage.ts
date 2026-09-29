import { FreelancerProfile, HistoryItem } from '@/types';
import { storedProfileSchema, storedHistorySchema } from '@/lib/validate';

export const DEFAULT_PROFILE: FreelancerProfile = {
  name: '',
  role: '',
  bio: '',
  experience: '',
  defaultCta: '',
  projects: [],
};

const PROFILE_KEY = 'uppitch_profile_v1';
const HISTORY_KEY = 'uppitch_history_v1';

/**
 * Migrates legacy history items (which only had pitchText) so both
 * Variation A and Variation B tabs display the proposal, while preserving
 * distinct pitchText and pitchTextB in modern dual-variation items.
 */
export function migrateHistoryItem(
  item: Partial<HistoryItem> & { pitchText?: string; pitchTextB?: string }
): HistoryItem {
  const pitchA = item.pitchText || '';
  const pitchB = item.pitchTextB !== undefined ? item.pitchTextB : pitchA;

  return {
    id: item.id || `hist-${Date.now()}`,
    timestamp: item.timestamp || new Date().toISOString(),
    channel: item.channel || 'upwork',
    tone: item.tone || 'direct',
    variationName: item.variationName || 'Variation A (Direct)',
    pitchText: pitchA,
    pitchTextB: pitchB,
    jobSnippet: item.jobSnippet || '',
    subjectLine: item.subjectLine,
  };
}

export function getStoredProfile(): FreelancerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    const result = storedProfileSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    console.warn('Invalid profile structure in localStorage, falling back to default');
    return DEFAULT_PROFILE;
  } catch (e) {
    console.error('Failed to load profile:', e);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: FreelancerProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile:', e);
  }
}

export function getStoredHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const result = storedHistorySchema.safeParse(parsed);
    if (result.success) {
      return (result.data as HistoryItem[]).map((item) => migrateHistoryItem(item));
    }
    console.warn('Invalid history structure in localStorage, falling back to empty list');
    return [];
  } catch {
    return [];
  }
}

export function saveStoredHistory(history: HistoryItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history:', e);
  }
}
