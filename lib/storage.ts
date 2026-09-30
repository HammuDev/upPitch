import { FreelancerProfile, HistoryItem, ProjectItem, Channel, Tone } from '@/types';

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

const VALID_CHANNELS = new Set<Channel>(['upwork', 'cold-email', 'linkedin', 'twitter']);
const VALID_TONES = new Set<Tone>(['direct', 'consultative', 'casual']);

export function normalizeStoredProject(item: unknown): ProjectItem {
  if (!item || typeof item !== 'object') {
    return {
      id: 'proj-' + Math.random().toString(36).slice(2, 9),
      title: 'Untitled Project',
      metricOrLink: '',
      tags: [],
    };
  }
  const obj = item as Record<string, unknown>;
  const tags = Array.isArray(obj.tags)
    ? obj.tags
        .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
        .map((t) => t.trim())
    : [];

  return {
    id:
      typeof obj.id === 'string' && obj.id.trim()
        ? obj.id.trim()
        : 'proj-' + Math.random().toString(36).slice(2, 9),
    title:
      typeof obj.title === 'string' && obj.title.trim()
        ? obj.title.trim()
        : 'Untitled Project',
    metricOrLink:
      typeof obj.metricOrLink === 'string' ? obj.metricOrLink.trim() : '',
    tags,
    ...(typeof obj.link === 'string' && obj.link.trim()
      ? { link: obj.link.trim() }
      : {}),
  };
}

export function normalizeStoredProfile(data: unknown): FreelancerProfile {
  if (!data || typeof data !== 'object') return DEFAULT_PROFILE;
  const obj = data as Record<string, unknown>;

  const rawProjects = Array.isArray(obj.projects) ? obj.projects : [];
  const projects: ProjectItem[] = rawProjects.map(normalizeStoredProject);

  return {
    name: typeof obj.name === 'string' ? obj.name.trim() : '',
    role: typeof obj.role === 'string' ? obj.role.trim() : '',
    bio: typeof obj.bio === 'string' ? obj.bio.trim() : '',
    experience: typeof obj.experience === 'string' ? obj.experience.trim() : '',
    defaultCta: typeof obj.defaultCta === 'string' ? obj.defaultCta.trim() : '',
    projects,
  };
}

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
    channel: item.channel && VALID_CHANNELS.has(item.channel) ? item.channel : 'upwork',
    tone: item.tone && VALID_TONES.has(item.tone) ? item.tone : 'direct',
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
    return normalizeStoredProfile(parsed);
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
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
      .map((item) => migrateHistoryItem(item as Partial<HistoryItem>));
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
