import { describe, it, expect, vi, beforeEach } from 'vitest';
import { runPitchPipeline, rankProof } from '@/lib/generate';
import { callGemini, GeminiServiceError } from '@/lib/gemini';
import { FreelancerProfile, ProjectItem } from '@/types';
import { ExtractedJob } from '@/lib/prompts';

vi.mock('@/lib/gemini', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/gemini')>();
  return {
    ...actual,
    callGemini: vi.fn(),
  };
});

describe('lib/generate.ts - runPitchPipeline', () => {
  const mockProfile: FreelancerProfile = {
    name: 'Alex Rivera',
    role: 'Full-Stack Developer',
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

  const jobText =
    'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('(a) happy path returns both variations and empty warnings', async () => {
    const mockedCallGemini = vi.mocked(callGemini);

    // Call 1: Extraction
    mockedCallGemini.mockResolvedValueOnce(mockExtractedJob);

    // Call 2: Writer
    mockedCallGemini.mockResolvedValueOnce({
      variationA:
        'I reviewed your brief regarding the duplicate Stripe billing race condition.\n\nHaving resolved similar high-volume concurrency and locking issues in Postgres Concurrency Fix with 0.8s query time, here is the implementation plan to wrap payment updates in atomic PostgreSQL transactions. We will isolate the webhook handler execution, add row-level locking with select for update, ensure idempotency keys are tracked reliably in your database, and write automated integration tests to guarantee zero duplicate payment events across concurrent webhooks.\n\nWe can deliver and verify the entire fix in staging within 24 hours. Would you be open to a 3-minute video walkthrough showing how we resolved this exact lock contention last month?',
      variationB:
        'Handling concurrent webhook retries in Stripe requires an architectural audit of database transaction isolation levels and distributed event deduplication.\n\nWhile solving Postgres Concurrency Fix with 0.8s query time, I diagnosed why parallel worker threads create race conditions and structured advisory locks in PostgreSQL to prevent phantom writes. I can run an initial diagnostic on your queue consumers, inspect the webhook listener logs, trace failed transaction rollbacks, and draft the staging database migration script with zero downtime.\n\nWe will also configure Prometheus alerts for deadlocks. Everything can be validated with integration tests within 24 hours. Would you be open to a 3-minute video walkthrough reviewing the proposed architecture and execution plan?',
      subjectLine: 'Fixing Stripe Webhook Race Conditions',
      detectedProblems: ['Duplicate webhook billing race conditions in Stripe'],
      screeningAnswers: [],
      gaps: [],
    });

    const result = await runPitchPipeline({
      jobText,
      profile: mockProfile,
      selectedProjects: mockProfile.projects,
      channel: 'upwork',
      tone: 'direct',
      geminiKey: 'dummy-key',
    });

    expect(result.variationA).toContain('Postgres Concurrency Fix');
    expect(result.variationB).toContain('Postgres Concurrency Fix');
    expect(result.subjectLine).toBe('Fixing Stripe Webhook Race Conditions');
    expect(result.detectedProblems).toEqual([
      'Duplicate webhook billing race conditions in Stripe',
    ]);
    expect(result.matchedProject?.id).toBe('proj-1');
    expect(result.warnings).toBeUndefined();
    expect(result.metrics?.calls).toBe(2);
    expect(result.metrics?.retryUsed).toBe(false);
    expect(mockedCallGemini).toHaveBeenCalledTimes(2);
  });

  it('(b) first draft fails checks -> exactly ONE retry with issue list, and total calls <= 3', async () => {
    const mockedCallGemini = vi.mocked(callGemini);

    // Call 1: Extraction
    mockedCallGemini.mockResolvedValueOnce(mockExtractedJob);

    // Call 2: Writer Draft 1 (contains banned greeting and invented number)
    mockedCallGemini.mockResolvedValueOnce({
      variationA:
        'Hi there,\n\nI am thrilled to apply for your Stripe bug. We scaled systems to 99999 users with Postgres Concurrency Fix with 0.8s query time. We will complete it in 24 hours. Would you be open to a 3-minute video walkthrough?',
      variationB:
        'Hello,\n\nI can resolve your Stripe issue. For Postgres Concurrency Fix with 0.8s query time, we will test within 24 hours. Would you be open to a 3-minute video walkthrough?',
      detectedProblems: ['Duplicate webhook billing race conditions'],
    });

    // Call 3: Retry Draft 2 (clean)
    mockedCallGemini.mockResolvedValueOnce({
      variationA:
        'I reviewed your brief regarding duplicate Stripe race conditions. For Postgres Concurrency Fix with 0.8s query time, we wrapped transactions in atomic PostgreSQL locks within 24 hours. Would you be open to a 3-minute video walkthrough?',
      variationB:
        'Duplicate Stripe race conditions require atomic locking. For Postgres Concurrency Fix with 0.8s query time, we will verify within 24 hours. Would you be open to a 3-minute video walkthrough?',
      detectedProblems: ['Duplicate webhook billing race conditions'],
    });

    const result = await runPitchPipeline({
      jobText,
      profile: mockProfile,
      selectedProjects: mockProfile.projects,
      channel: 'upwork',
      tone: 'direct',
      geminiKey: 'dummy-key',
    });

    expect(mockedCallGemini).toHaveBeenCalledTimes(3);
    expect(result.metrics?.calls).toBe(3);
    expect(result.metrics?.retryUsed).toBe(true);

    // Verify retry prompt contained the issues list
    const retryCallArgs = mockedCallGemini.mock.calls[2][0];
    expect(retryCallArgs.prompt).toContain('CRITICAL FIXES REQUIRED');
    expect(retryCallArgs.prompt).toContain('greetings');
  });

  it('(c) unparseable JSON or writer error -> controlled error propagated', async () => {
    const mockedCallGemini = vi.mocked(callGemini);

    // Call 1: Extraction succeeds
    mockedCallGemini.mockResolvedValueOnce(mockExtractedJob);

    // Call 2: Writer fails with GeminiServiceError
    mockedCallGemini.mockRejectedValueOnce(
      new GeminiServiceError('AI service returned unparseable JSON.')
    );

    await expect(
      runPitchPipeline({
        jobText,
        profile: mockProfile,
        selectedProjects: mockProfile.projects,
        channel: 'upwork',
        tone: 'direct',
        geminiKey: 'dummy-key',
      })
    ).rejects.toThrow(GeminiServiceError);
  });

  it('(d) retry failure preserves first sanitized draft without crashing', async () => {
    const mockedCallGemini = vi.mocked(callGemini);

    // Call 1: Extraction
    mockedCallGemini.mockResolvedValueOnce(mockExtractedJob);

    // Call 2: Writer Draft 1 with greeting
    mockedCallGemini.mockResolvedValueOnce({
      variationA:
        'Hi there,\n\nI reviewed your brief. For Postgres Concurrency Fix with 0.8s query time, we wrap updates in PostgreSQL locks within 24 hours. Would you be open to a 3-minute video walkthrough?',
      variationB:
        'Hello,\n\nDuplicate Stripe race conditions need locking. For Postgres Concurrency Fix with 0.8s query time, we test within 24 hours. Would you be open to a 3-minute video walkthrough?',
      detectedProblems: ['Duplicate Stripe race condition'],
    });

    // Call 3: Retry throws error
    mockedCallGemini.mockRejectedValueOnce(
      new GeminiServiceError('Network failure during retry')
    );

    const result = await runPitchPipeline({
      jobText,
      profile: mockProfile,
      selectedProjects: mockProfile.projects,
      channel: 'upwork',
      tone: 'direct',
      geminiKey: 'dummy-key',
    });

    // Should gracefully return sanitized first draft
    expect(result.variationA).toContain('Postgres Concurrency Fix');
    expect(result.variationB).toContain('Postgres Concurrency Fix');
    expect(result.metrics?.calls).toBe(3);
    expect(result.metrics?.retryUsed).toBe(true);
  });

  it('(e) noProof true when no project matches, and the writer prompt contains NONE', async () => {
    const mockedCallGemini = vi.mocked(callGemini);

    // Unrelated project that does NOT match Stripe/PostgreSQL/Node
    const unrelatedProject: ProjectItem = {
      id: 'p-ruby',
      title: 'Ruby on Rails Monolith',
      metricOrLink: 'Processed 500 requests/min',
      tags: ['Ruby', 'Rails'],
    };

    mockedCallGemini.mockResolvedValueOnce(mockExtractedJob);
    mockedCallGemini.mockResolvedValueOnce({
      variationA:
        'I reviewed your brief regarding duplicate Stripe webhook race conditions. We can implement PostgreSQL row locking within 24 hours. Would you be open to a 3-minute video walkthrough?',
      variationB:
        'Duplicate Stripe billing events occur when webhooks trigger parallel executions. We will build atomic database locks within 24 hours. Would you be open to a 3-minute video walkthrough?',
      detectedProblems: ['Duplicate webhook billing race conditions'],
    });

    const result = await runPitchPipeline({
      jobText,
      profile: mockProfile,
      selectedProjects: [unrelatedProject],
      channel: 'upwork',
      tone: 'direct',
      geminiKey: 'dummy-key',
    });

    expect(result.matchedProject).toBeUndefined();
    expect(result.matchedProjects).toEqual([]);

    // Check writer prompt contains "NONE."
    const writerCallArgs = mockedCallGemini.mock.calls[1][0];
    expect(writerCallArgs.prompt).toContain(
      'NONE. No past projects from the profile matched the job requirements.'
    );
  });

  it('(f) required opening word from job is enforced by checker and triggers retry if missing', async () => {
    const mockedCallGemini = vi.mocked(callGemini);

    const extractedJobWithOpening: ExtractedJob = {
      ...mockExtractedJob,
      required_opening: 'Blueprint',
    };

    // Call 1: Extraction
    mockedCallGemini.mockResolvedValueOnce(extractedJobWithOpening);

    // Call 2: Writer Draft 1 (misses required opening "Blueprint")
    mockedCallGemini.mockResolvedValueOnce({
      variationA:
        'I reviewed your brief regarding duplicate Stripe race conditions. For Postgres Concurrency Fix with 0.8s query time, we wrap updates in PostgreSQL locks within 24 hours. Would you be open to a 3-minute video walkthrough?',
      variationB:
        'Blueprint: Duplicate Stripe race conditions require database locks. For Postgres Concurrency Fix with 0.8s query time, we verify within 24 hours. Would you be open to a 3-minute video walkthrough?',
      detectedProblems: ['Duplicate Stripe race condition'],
    });

    // Call 3: Retry Draft 2 (includes "Blueprint" on both)
    mockedCallGemini.mockResolvedValueOnce({
      variationA:
        'Blueprint: I reviewed your brief regarding duplicate Stripe race conditions. For Postgres Concurrency Fix with 0.8s query time, we wrap updates in PostgreSQL locks within 24 hours. Would you be open to a 3-minute video walkthrough?',
      variationB:
        'Blueprint: Duplicate Stripe race conditions require database locks. For Postgres Concurrency Fix with 0.8s query time, we verify within 24 hours. Would you be open to a 3-minute video walkthrough?',
      detectedProblems: ['Duplicate Stripe race condition'],
    });

    const result = await runPitchPipeline({
      jobText: 'Start proposal with Blueprint. Fix duplicate Stripe billing race condition within 24 hours.',
      profile: mockProfile,
      selectedProjects: mockProfile.projects,
      channel: 'upwork',
      tone: 'direct',
      geminiKey: 'dummy-key',
    });

    expect(mockedCallGemini).toHaveBeenCalledTimes(3);
    expect(result.variationA).toMatch(/^Blueprint/i);
    expect(result.variationB).toMatch(/^Blueprint/i);

    const retryCallArgs = mockedCallGemini.mock.calls[2][0];
    expect(retryCallArgs.prompt).toContain('Blueprint');
  });
});
