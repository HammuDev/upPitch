export interface ProjectItem {
  id: string;
  title: string;
  metricOrLink: string; // e.g., "0.9s load (from 4.2s)" or "figma.com/@you/design-system"
  tags: string[];
  link?: string;
}

export interface FreelancerProfile {
  name: string;
  role: string;
  bio: string;
  experience?: string;
  defaultCta?: string;
  projects: ProjectItem[];
}

export type Channel = 'upwork' | 'cold-email' | 'linkedin' | 'twitter';
export type Tone = 'direct' | 'consultative' | 'casual';

export interface GeneratedPitches {
  'var-a': string;
  'var-b': string;
  subjectLine?: string;
  detectedProblems?: string[];
  matchedProject?: ProjectItem;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  channel: Channel;
  tone: Tone;
  variationName: string;
  pitchText: string;
  jobSnippet: string;
}
