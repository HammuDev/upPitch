import { describe, it, expect } from 'vitest';
import { migrateHistoryItem } from '@/lib/storage';

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
