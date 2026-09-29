import { describe, it, expect } from 'vitest';
import {
  projectSchema,
  profileSchema,
  generatePitchSchema,
} from '@/lib/validate';

describe('lib/validate.ts - generatePitchSchema', () => {
  const validPayload = {
    jobText: 'We need a senior full-stack Next.js developer to optimize our SaaS dashboard loading performance.',
    profile: {
      name: 'Alex Rivera',
      role: 'Full-Stack Engineer',
      bio: 'Over 6 years of React and Next.js engineering.',
      experience: 'Specialized in frontend performance',
      defaultCta: 'Let us chat on a 3-minute video.',
      projects: [
        {
          id: 'p1',
          title: 'Next.js SaaS Dashboard',
          metricOrLink: 'Improved LCP from 3.2s to 0.8s',
          tags: ['Next.js', 'React', 'Tailwind CSS'],
        },
      ],
    },
    selectedProjects: [
      {
        id: 'p1',
        title: 'Next.js SaaS Dashboard',
        metricOrLink: 'Improved LCP from 3.2s to 0.8s',
        tags: ['Next.js', 'React', 'Tailwind CSS'],
      },
    ],
    channel: 'upwork',
    tone: 'direct',
  };

  it('accepts valid proposal generation payload', () => {
    const parsed = generatePitchSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  it('rejects undersized jobText (< 40 chars)', () => {
    const invalid = {
      ...validPayload,
      jobText: 'Need a developer.', // 17 chars
    };
    const parsed = generatePitchSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('rejects oversized jobText (> 8000 chars)', () => {
    const invalid = {
      ...validPayload,
      jobText: 'A'.repeat(8001),
    };
    const parsed = generatePitchSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('rejects missing or empty profile name', () => {
    const invalid = {
      ...validPayload,
      profile: {
        ...validPayload.profile,
        name: '   ',
      },
    };
    const parsed = generatePitchSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('rejects invalid channel enum value', () => {
    const invalid = {
      ...validPayload,
      channel: 'facebook',
    };
    const parsed = generatePitchSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('rejects invalid tone enum value', () => {
    const invalid = {
      ...validPayload,
      tone: 'aggressive',
    };
    const parsed = generatePitchSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });
});

describe('lib/validate.ts - projectSchema', () => {
  it('accepts valid project item', () => {
    const project = {
      id: 'proj-123',
      title: 'E-commerce Checkout Migration',
      metricOrLink: 'Processed $4M in GMV with 0 transaction losses',
      tags: ['Stripe', 'Node.js', 'PostgreSQL'],
    };
    const parsed = projectSchema.safeParse(project);
    expect(parsed.success).toBe(true);
  });

  it('rejects project with empty title', () => {
    const invalid = {
      id: 'proj-123',
      title: '',
      metricOrLink: 'Some metric',
      tags: [],
    };
    const parsed = projectSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  it('rejects project with excessive tags (> 10 tags)', () => {
    const invalid = {
      id: 'proj-123',
      title: 'High Load Service',
      metricOrLink: '',
      tags: Array.from({ length: 11 }, (_, i) => `tag-${i}`),
    };
    const parsed = projectSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });
});
