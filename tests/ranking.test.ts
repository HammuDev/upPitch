import { describe, it, expect } from 'vitest';
import { rankProof } from '@/lib/generate';
import { ExtractedJob } from '@/lib/prompts';
import { ProjectItem } from '@/types';

describe('lib/generate.ts - rankProof', () => {
  const mockExtractedJob: ExtractedJob = {
    core_problem: 'Migrate legacy Vue app to Next.js with Tailwind CSS',
    tech_stack: ['Next.js', 'Tailwind', 'TypeScript', 'React'],
    deliverables: ['Responsive design', 'Server components migration'],
    urgency: 'normal',
    deadline: null,
    budget: null,
    screening_questions: [],
    required_opening: null,
    other_application_instructions: [],
    red_flags: [],
  };

  const projectNextJs: ProjectItem = {
    id: 'p1',
    title: 'Enterprise Next.js SaaS Platform',
    metricOrLink: '0.8s load time',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
  };

  const projectPython: ProjectItem = {
    id: 'p2',
    title: 'Python Data Pipeline',
    metricOrLink: '10k events/sec',
    tags: ['Python', 'Pandas', 'AWS S3'],
  };

  it('ranks project with matching tags first and gives reasons', () => {
    const jobText = 'Looking for an expert to rebuild our web frontend in Next.js and Tailwind CSS.';
    const ranked = rankProof([projectPython, projectNextJs], mockExtractedJob, jobText);

    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].project.id).toBe('p1');
    expect(ranked[0].matchedBecause.length).toBeGreaterThan(0);
  });

  it('returns empty array if no projects provided', () => {
    const ranked = rankProof([], mockExtractedJob, 'Job text');
    expect(ranked).toEqual([]);
  });
});
