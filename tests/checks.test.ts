import { describe, it, expect } from 'vitest';
import { sanitizePlainText, checkProposalQuality } from '@/lib/checks';
import { FreelancerProfile, ProjectItem } from '@/types';
import { ExtractedJob } from '@/lib/prompts';

const mockProfile: FreelancerProfile = {
  name: 'Alex Rivera',
  role: 'Full-Stack Engineer',
  bio: 'Specialized in Next.js and high-performance Postgres systems.',
  experience: '6 years of production web development',
  defaultCta: 'Would you be open to a 3-minute video walkthrough?',
  projects: [
    {
      id: 'proj-1',
      title: 'Postgres Concurrency Fix',
      metricOrLink: '0.8s query time, zero deadlock errors',
      tags: ['PostgreSQL', 'Stripe', 'Node.js', 'Next.js'],
    },
  ],
};

const mockExtractedJob: ExtractedJob = {
  core_problem: 'Duplicate webhook billing race conditions in Stripe',
  tech_stack: ['PostgreSQL', 'Stripe', 'Node.js'],
  deliverables: ['Fix lock contention', 'Write integration test'],
  urgency: 'urgent',
  deadline: '24 hours',
  budget: '$500',
  screening_questions: [],
  required_opening: null,
  other_application_instructions: [],
  red_flags: [],
};

describe('lib/checks.ts - sanitizePlainText', () => {
  it('strips bold markdown and backticks', () => {
    const input = 'We use **PostgreSQL** and `Redis` for caching.';
    const output = sanitizePlainText(input);
    expect(output).toBe('We use PostgreSQL and Redis for caching.');
  });

  it('strips single-asterisk italics formatting', () => {
    const input = 'Here is the *exact* resolution step.';
    const output = sanitizePlainText(input);
    expect(output).toBe('Here is the exact resolution step.');
  });

  it('preserves mathematical single-asterisk multiplications like 5*3', () => {
    const input = 'Calculated 5*3 concurrency instances without error.';
    const output = sanitizePlainText(input);
    expect(output).toBe('Calculated 5*3 concurrency instances without error.');
  });

  it('handles empty or blank input cleanly', () => {
    expect(sanitizePlainText('')).toBe('');
    expect(sanitizePlainText('   ')).toBe('');
  });
});

describe('lib/checks.ts - checkProposalQuality', () => {
  it('flags greetings on Upwork proposals', () => {
    const pitch = `Hi there,\n\nI reviewed your brief regarding the duplicate Stripe billing race condition. Having built high-volume webhook listeners, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough showing how we solved this exact lock contention last month?`;

    const issues = checkProposalQuality({
      pitch,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.some((i) => i.includes('greetings'))).toBe(true);
  });

  it('flags sign-offs on Upwork proposals', () => {
    const pitch = `I reviewed your brief regarding the duplicate Stripe billing race condition. Having built high-volume webhook listeners, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough showing how we solved this exact lock contention last month?\n\nBest regards,\nAlex`;

    const issues = checkProposalQuality({
      pitch,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.some((i) => i.includes('sign-offs'))).toBe(true);
  });

  it('flags banned generic fluff phrases', () => {
    const pitch = `I am thrilled to apply for this job. I am a passionate developer and the perfect fit for your game-changer startup. Having built high-volume webhook listeners, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough showing our approach?`;

    const issues = checkProposalQuality({
      pitch,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.some((i) => i.includes('thrilled'))).toBe(true);
    expect(issues.some((i) => i.includes('passionate'))).toBe(true);
    expect(issues.some((i) => i.includes('perfect fit'))).toBe(true);
  });

  it('enforces required opening word when requested by the client', () => {
    const jobWithOpening: ExtractedJob = {
      ...mockExtractedJob,
      required_opening: 'Pipeline',
    };

    const pitchWithoutOpening = `I reviewed your brief regarding the duplicate Stripe billing race condition. Having built high-volume webhook listeners, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issues = checkProposalQuality({
      pitch: pitchWithoutOpening,
      channel: 'upwork',
      jobText: 'Start proposal with the word Pipeline. Fix duplicate Stripe billing race condition.',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: jobWithOpening,
    });

    expect(issues.some((i) => i.includes('Pipeline'))).toBe(true);

    const pitchWithOpening = `Pipeline: I reviewed your brief regarding the duplicate Stripe billing race condition. Having built high-volume webhook listeners, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesPass = checkProposalQuality({
      pitch: pitchWithOpening,
      channel: 'upwork',
      jobText: 'Start proposal with the word Pipeline. Fix duplicate Stripe billing race condition.',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: jobWithOpening,
    });

    expect(issuesPass.some((i) => i.includes('Pipeline'))).toBe(false);
  });

  it('detects unverified invented numbers not present in source input', () => {
    const pitchWithInventedNumber = `I reviewed your brief regarding the duplicate Stripe billing race condition. Having scaled systems to 99999 daily users with 87% improvement, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issues = checkProposalQuality({
      pitch: pitchWithInventedNumber,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.some((i) => i.includes('99999') || i.includes('87'))).toBe(true);
  });

  it('allows valid numbers present in profile, job text, or standard 3-min video CTA', () => {
    // 24 (from jobText deadline), 0.8 (from project metric), 3 (standard 3-minute Loom CTA)
    const validPitch = `I reviewed your brief regarding the duplicate Stripe billing race condition. Having achieved 0.8s query time on previous PostgreSQL databases, here is the plan to wrap customer payment updates in atomic transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issues = checkProposalQuality({
      pitch: validPitch,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.filter((i) => i.includes('Invented number'))).toHaveLength(0);
  });
});
