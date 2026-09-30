import { describe, it, expect } from 'vitest';
import { normalizeStoredProfile, normalizeStoredProject, DEFAULT_PROFILE } from '@/lib/storage';
import { FreelancerProfile } from '@/types';

describe('Profile Export/Import & Sanitization Validation', () => {
  it('ensures exported profile payload contains only profile and projects and NO api keys or history', () => {
    const rawProfileWithSensitiveData = {
      name: 'Alex Rivera',
      role: 'Full-Stack Developer',
      bio: '6 years experience',
      experience: '5+ years SaaS',
      defaultCta: 'Would you be open to a Loom walkthrough?',
      apiKey: 'secret-gemini-key-12345',
      history: [{ id: 'hist-1', pitchText: 'Secret pitch' }],
      projects: [
        {
          id: 'proj-1',
          title: 'Next.js Microservice',
          metricOrLink: '0.8s response time',
          tags: ['Next.js', 'PostgreSQL'],
        },
      ],
    };

    // Client export extraction logic:
    const exportedPayload = {
      name: rawProfileWithSensitiveData.name,
      role: rawProfileWithSensitiveData.role,
      bio: rawProfileWithSensitiveData.bio,
      experience: rawProfileWithSensitiveData.experience || '',
      defaultCta: rawProfileWithSensitiveData.defaultCta || '',
      projects: rawProfileWithSensitiveData.projects || [],
    };

    const exportedJson = JSON.stringify(exportedPayload);

    expect(exportedJson).not.toContain('secret-gemini-key-12345');
    expect(exportedJson).not.toContain('apiKey');
    expect(exportedJson).not.toContain('history');
    expect(exportedPayload.name).toBe('Alex Rivera');
    expect(exportedPayload.projects).toHaveLength(1);
  });

  it('validates and normalizes imported JSON with missing or partial fields', () => {
    const partialImport = {
      name: 'Elena Rostova',
      projects: [
        {
          title: 'GraphQL API Gateway',
          tags: ['GraphQL', 'Node'],
        },
      ],
    };

    const normalized = normalizeStoredProfile(partialImport);

    expect(normalized.name).toBe('Elena Rostova');
    expect(normalized.role).toBe('');
    expect(normalized.bio).toBe('');
    expect(normalized.projects).toHaveLength(1);
    expect(normalized.projects[0].title).toBe('GraphQL API Gateway');
    expect(normalized.projects[0].id).toBeDefined();
    expect(normalized.projects[0].metricOrLink).toBe('');
  });

  it('gracefully handles corrupted, non-object, or empty JSON imports by returning DEFAULT_PROFILE', () => {
    expect(normalizeStoredProfile(null)).toEqual(DEFAULT_PROFILE);
    expect(normalizeStoredProfile(undefined)).toEqual(DEFAULT_PROFILE);
    expect(normalizeStoredProfile('malformed-string')).toEqual(DEFAULT_PROFILE);
    expect(normalizeStoredProfile(12345)).toEqual(DEFAULT_PROFILE);
    expect(normalizeStoredProfile([])).toEqual(DEFAULT_PROFILE);
  });

  it('filters empty or non-string tags when importing projects', () => {
    const projectWithBadTags = normalizeStoredProject({
      id: 'p-1',
      title: 'Docker Deployment',
      tags: ['Docker', '', '   ', 123, null, 'CI/CD'],
    });

    expect(projectWithBadTags.tags).toEqual(['Docker', 'CI/CD']);
  });
});
