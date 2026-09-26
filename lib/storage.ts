import { FreelancerProfile, HistoryItem } from '@/types';

export const DEFAULT_PROFILE: FreelancerProfile = {
  name: 'Alex Rivera',
  role: 'Full-Stack Engineer & Next.js Specialist',
  bio: 'Specialist in full-stack web applications, API integrations, and database performance optimization with 6+ years shipping high-converting software.',
  experience: '6+ years freelance, Ex-Frontend Lead',
  defaultCta: 'Open to a 3-minute video breakdown where I walk through the proposed architecture step-by-step?',
  projects: [
    {
      id: 'proj-1',
      title: 'Full-Stack B2B Analytics Dashboard',
      metricOrLink: '0.8s load time & 99.99% uptime',
      tags: ['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'],
    },
    {
      id: 'proj-2',
      title: 'Real-time Payment & Webhook Pipeline',
      metricOrLink: '$1.5M+ processed with zero race conditions',
      tags: ['Stripe', 'Node.js', 'Redis', 'Webhooks'],
    },
  ],
};

const PROFILE_KEY = 'uppitch_profile_v1';
const HISTORY_KEY = 'uppitch_history_v1';

export function getStoredProfile(): FreelancerProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return JSON.parse(raw);
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
    return JSON.parse(raw);
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
