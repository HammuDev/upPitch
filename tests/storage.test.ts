import { describe, it, expect } from 'vitest';
import {
  migrateHistoryItem,
  normalizeStoredProfile,
  normalizeStoredProject,
  DEFAULT_PROFILE,
} from '@/lib/storage';

describe('lib/storage.ts - migrateHistoryItem', () => {
  it('migrates legacy history item with only pitchText into both Variation A and B tabs', () => {
    const legacyItem = {
      id: 'legacy-1',
      timestamp: '2026-09-01T12:00:00.000Z',
      channel: 'upwork' as const,
      tone: 'direct' as const,
      variationName: 'Variation A (Direct)',
      pitchText: 'Here is the single legacy proposal draft text.',
      jobSnippet: 'Looking for a Next.js developer',
    };

    const migrated = migrateHistoryItem(legacyItem);

    expect(migrated.pitchText).toBe('Here is the single legacy proposal draft text.');
    expect(migrated.pitchTextB).toBe('Here is the single legacy proposal draft text.');
  });

  it('preserves distinct Variation A and Variation B in modern dual-pitch items', () => {
    const modernItem = {
      id: 'modern-1',
      timestamp: '2026-09-29T12:00:00.000Z',
      channel: 'upwork' as const,
      tone: 'direct' as const,
      variationName: 'Variation A (Direct)',
      pitchText: 'Variation A Problem-First Pitch',
      pitchTextB: 'Variation B Consultative Loom Pitch',
      jobSnippet: 'Looking for a Next.js developer',
      subjectLine: 'Next.js Performance Fix',
    };

    const migrated = migrateHistoryItem(modernItem);

    expect(migrated.pitchText).toBe('Variation A Problem-First Pitch');
    expect(migrated.pitchTextB).toBe('Variation B Consultative Loom Pitch');
    expect(migrated.subjectLine).toBe('Next.js Performance Fix');
  });
});

describe('lib/storage.ts - normalizeStoredProfile & normalizeStoredProject', () => {
  it('gracefully normalizes partial or malformed project objects with safe defaults', () => {
    const malformed = {
      title: 'Missing other fields',
    };
    const normalized = normalizeStoredProject(malformed);
    expect(normalized.title).toBe('Missing other fields');
    expect(normalized.id).toBeDefined();
    expect(normalized.metricOrLink).toBe('');
    expect(normalized.tags).toEqual([]);
  });

  it('gracefully normalizes null or corrupted profile objects with DEFAULT_PROFILE', () => {
    expect(normalizeStoredProfile(null)).toEqual(DEFAULT_PROFILE);
    expect(normalizeStoredProfile(undefined)).toEqual(DEFAULT_PROFILE);
    expect(normalizeStoredProfile('not an object')).toEqual(DEFAULT_PROFILE);
  });

  it('normalizes valid profile and preserves project lists cleanly', () => {
    const validRaw = {
      name: 'Hammad',
      role: 'Full-Stack Developer',
      bio: 'Building web apps',
      experience: '5 years',
      defaultCta: 'Let us connect',
      projects: [
        {
          id: 'p-1',
          title: 'Docker CI',
          metricOrLink: '3x speedup',
          tags: ['Docker', 'CI'],
        },
      ],
    };

    const normalized = normalizeStoredProfile(validRaw);
    expect(normalized.name).toBe('Hammad');
    expect(normalized.projects).toHaveLength(1);
    expect(normalized.projects[0].title).toBe('Docker CI');
  });
});
