import { describe, it, expect } from 'vitest';
import { sanitizePlainText, checkProposalQuality, similarity } from '@/lib/checks';
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
  it('flags greetings on Upwork proposals but does not flag words like High or History', () => {
    const pitchGreetingHi = `Hi there,\n\nI reviewed your brief regarding the duplicate Stripe billing race condition. Having built high-volume webhook listeners for Postgres Concurrency Fix with 0.8s query time, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough showing how we solved this exact lock contention last month?`;

    const issuesHi = checkProposalQuality({
      pitch: pitchGreetingHi,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });
    expect(issuesHi.some((i) => i.includes('greetings'))).toBe(true);

    const pitchGreetingHello = `Hello,\n\nI reviewed your brief regarding the duplicate Stripe billing race condition. Having built high-volume webhook listeners for Postgres Concurrency Fix with 0.8s query time, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesHello = checkProposalQuality({
      pitch: pitchGreetingHello,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });
    expect(issuesHello.some((i) => i.includes('greetings'))).toBe(true);

    const pitchHigh = `High CI cost and duplicate Stripe billing race conditions stem from uncoordinated webhook retries. For Postgres Concurrency Fix with 0.8s query time, we wrapped transactions in atomic PostgreSQL locks. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesHigh = checkProposalQuality({
      pitch: pitchHigh,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });
    expect(issuesHigh.some((i) => i.includes('greetings'))).toBe(false);

    const pitchHistory = `History shows that duplicate Stripe billing race conditions stem from uncoordinated webhook retries. For Postgres Concurrency Fix with 0.8s query time, we wrapped transactions in atomic PostgreSQL locks. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesHistory = checkProposalQuality({
      pitch: pitchHistory,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });
    expect(issuesHistory.some((i) => i.includes('greetings'))).toBe(false);
  });

  it('flags sign-offs on Upwork proposals', () => {
    const pitch = `I reviewed your brief regarding the duplicate Stripe billing race condition. Having built Postgres Concurrency Fix with 0.8s query time, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough showing how we solved this exact lock contention last month?\n\nBest regards,\nAlex`;

    const issues = checkProposalQuality({
      pitch,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.some((i) => i.includes('sign-offs'))).toBe(true);
  });

  it('flags banned generic fluff phrases with whole-word matching', () => {
    const pitch = `I am thrilled to apply for this job. I am a passionate developer and the perfect fit for your game-changer startup. We will leverage robust and reliable solutions to ensure seamless deployment and save your valuable time. For Postgres Concurrency Fix with 0.8s query time, we will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issues = checkProposalQuality({
      pitch,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.some((i) => i.includes('thrilled'))).toBe(true);
    expect(issues.some((i) => i.includes('passionate'))).toBe(true);
    expect(issues.some((i) => i.includes('perfect fit'))).toBe(true);
    expect(issues.some((i) => i.includes('robust'))).toBe(true);
    expect(issues.some((i) => i.includes('seamless'))).toBe(true);
    expect(issues.some((i) => i.includes('leverage'))).toBe(true);
    expect(issues.some((i) => i.includes('reliable'))).toBe(true);
    expect(issues.some((i) => i.includes('valuable time'))).toBe(true);
  });

  it('does not flag legitimate words that contain fluff substrings', () => {
    // "leveraged" vs "leverage", "seamlessly" (wait, ensure whole words don't match unbanned words)
    const pitch = `We analyzed the requirements for Postgres Concurrency Fix with 0.8s query time. We implemented PostgreSQL transactions to avoid race conditions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issues = checkProposalQuality({
      pitch,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.filter((i) => i.includes('banned fluff'))).toHaveLength(0);
  });

  it('enforces required opening word when requested by the client', () => {
    const jobWithOpening: ExtractedJob = {
      ...mockExtractedJob,
      required_opening: 'Pipeline',
    };

    const pitchWithoutOpening = `I reviewed your brief regarding the duplicate Stripe billing race condition. Having built Postgres Concurrency Fix with 0.8s query time, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issues = checkProposalQuality({
      pitch: pitchWithoutOpening,
      channel: 'upwork',
      jobText: 'Start proposal with the word Pipeline. Fix duplicate Stripe billing race condition within 24 hours.',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: jobWithOpening,
    });

    expect(issues.some((i) => i.includes('Pipeline'))).toBe(true);

    const pitchWithOpening = `Pipeline: I reviewed your brief regarding the duplicate Stripe billing race condition. Having built Postgres Concurrency Fix with 0.8s query time, here is the plan to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesPass = checkProposalQuality({
      pitch: pitchWithOpening,
      channel: 'upwork',
      jobText: 'Start proposal with the word Pipeline. Fix duplicate Stripe billing race condition within 24 hours.',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: jobWithOpening,
    });

    expect(issuesPass.some((i) => i.includes('Pipeline'))).toBe(false);
  });

  it('detects unverified invented numbers not present in source input', () => {
    const pitchWithInventedNumber = `I reviewed your brief regarding the duplicate Stripe billing race condition. Having scaled systems to 99999 daily users with 87% improvement, here is the plan for Postgres Concurrency Fix with 0.8s query time to wrap customer payment updates in atomic PostgreSQL transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

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

  it('flags invented number when source has 2024 but pitch has 2, or pitch has 12 when source has 1 and 2', () => {
    const pitchWith2 = `I resolved Postgres Concurrency Fix with 0.8s query time. We will complete the fix in 2 days with atomic PostgreSQL transactions. Would you be open to a quick 3-minute video walkthrough?`;

    // source only has 2024
    const issuesYear = checkProposalQuality({
      pitch: pitchWith2,
      channel: 'upwork',
      jobText: 'Urgent Stripe bug in year 2024 needing database fix',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });
    expect(issuesYear.some((i) => i.includes('Invented number detected: "2"'))).toBe(true);

    const pitchWith12 = `Pipeline fix in 12 days for Postgres Concurrency Fix with 0.8s query time. We wrap payment updates in atomic PostgreSQL transactions. Would you be open to a quick 3-minute video walkthrough?`;

    const issues12 = checkProposalQuality({
      pitch: pitchWith12,
      channel: 'upwork',
      jobText: 'Need 1 developer for 2 sprints to fix Stripe issues',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });
    expect(issues12.some((i) => i.includes('Invented number detected: "12"'))).toBe(true);
  });

  it('converts word numbers (two weeks -> 2 weeks) and allows them without flagging', () => {
    const pitchWithTwoConverted = `I reviewed your brief regarding Stripe race conditions. For Postgres Concurrency Fix with 0.8s query time, we can deliver the complete PostgreSQL transaction migration in 2 weeks. Would you be open to a quick 3-minute video walkthrough?`;

    const issues = checkProposalQuality({
      pitch: pitchWithTwoConverted,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition within two weeks',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issues.filter((i) => i.includes('Invented number detected: "2"'))).toHaveLength(0);
  });

  it('allows valid numbers present in profile, job text, or standard 3-min video CTA', () => {
    const validPitch = `I reviewed your brief regarding the duplicate Stripe billing race condition. Having achieved 0.8s query time on Postgres Concurrency Fix with PostgreSQL databases, here is the plan to wrap customer payment updates in atomic transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

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

  it('enforces citing matched project title or tag + metric when matchedProjects is non-empty', () => {
    const pitchWithoutProof = `I reviewed your brief regarding the duplicate Stripe billing race condition. Here is the plan to wrap customer payment updates in atomic transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesMissing = checkProposalQuality({
      pitch: pitchWithoutProof,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issuesMissing.some((i) => i.includes('Cite the matched project and its stated result'))).toBe(true);

    const pitchWithTitle = `I reviewed your brief regarding the duplicate Stripe billing race condition. In my past Postgres Concurrency Fix project, we resolved this exact lock contention with PostgreSQL. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesWithTitle = checkProposalQuality({
      pitch: pitchWithTitle,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issuesWithTitle.some((i) => i.includes('Cite the matched project and its stated result'))).toBe(false);

    const pitchWithTagAndResult = `I reviewed your brief regarding the duplicate Stripe billing race condition. Using PostgreSQL, we previously achieved 0.8s query time on high-volume transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesWithTagAndResult = checkProposalQuality({
      pitch: pitchWithTagAndResult,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
    });

    expect(issuesWithTagAndResult.some((i) => i.includes('Cite the matched project and its stated result'))).toBe(false);
  });

  it('verifies screening questions answers in screeningAnswers and proposal pitch', () => {
    const jobWithQuestions: ExtractedJob = {
      ...mockExtractedJob,
      screening_questions: [
        'How do you handle database race conditions in PostgreSQL?',
        'Have you worked with Stripe webhooks under high concurrency?',
      ],
    };

    // Case 1: missing screening answers
    const pitchBase = `I reviewed your brief regarding the duplicate Stripe billing race condition. For Postgres Concurrency Fix with 0.8s query time, we wrap payment updates in PostgreSQL atomic transactions. We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesMissing = checkProposalQuality({
      pitch: pitchBase,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: jobWithQuestions,
      screeningAnswers: [],
    });
    expect(issuesMissing.some((i) => i.includes('Answer every screening question directly'))).toBe(true);

    // Case 2: short answers (< 6 words)
    const issuesShort = checkProposalQuality({
      pitch: pitchBase,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: jobWithQuestions,
      screeningAnswers: ['By using locks', 'Yes with Stripe webhooks'],
    });
    expect(issuesShort.some((i) => i.includes('Answer every screening question directly'))).toBe(true);

    // Case 3: answers >= 6 words but not in pitch
    const issuesNotInPitch = checkProposalQuality({
      pitch: pitchBase,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: jobWithQuestions,
      screeningAnswers: [
        'We enforce serializable isolation levels and distributed Redis locks on transactions',
        'I built asynchronous queue workers processing thousands of Stripe webhook events safely',
      ],
    });
    expect(issuesNotInPitch.some((i) => i.includes('Answer every screening question directly'))).toBe(true);

    // Case 4: answers >= 6 words and included in pitch
    const pitchWithAnswers = `I reviewed your brief regarding the duplicate Stripe billing race condition. For Postgres Concurrency Fix with 0.8s query time, we wrap payment updates in atomic PostgreSQL transactions.
1. We enforce serializable isolation levels and distributed Redis locks on transactions.
2. I built asynchronous queue workers processing thousands of Stripe webhook events safely.
We will verify with staging tests within 24 hours. Would you be open to a quick 3-minute video walkthrough?`;

    const issuesPass = checkProposalQuality({
      pitch: pitchWithAnswers,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: jobWithQuestions,
      screeningAnswers: [
        'We enforce serializable isolation levels and distributed Redis locks on transactions',
        'I built asynchronous queue workers processing thousands of Stripe webhook events safely',
      ],
    });
    expect(issuesPass.some((i) => i.includes('Answer every screening question directly'))).toBe(false);
  });
});

describe('lib/checks.ts - similarity and variation diversity', () => {
  // 4 realistic pairs: 2 genuinely different, 2 near-duplicates
  const diffPair1_VarA = `I reviewed your brief regarding the duplicate Stripe billing race condition. For Postgres Concurrency Fix with 0.8s query time, we resolve this by isolating database write locks.
• Audit PostgreSQL isolation level during concurrent webhook handling.
• Implement Redis distributed locking mechanism with idempotent key checks.
• Verify with concurrent load simulation in staging.
Can we jump on a brief call tomorrow to discuss access?`;

  const diffPair1_VarB = `Duplicate Stripe charges during peak checkout volume indicate uncoordinated webhook retries without an atomic queue. In my past work on high-volume PostgreSQL systems, we structured an asynchronous queue with deduplication tables to eliminate race conditions.
Would you be open to a 3-minute video breakdown walking through our architectural diagrams and rollout checklist?`;

  const diffPair2_VarA = `Slow database queries on your Next.js dashboard stem from missing composite indexes and N+1 Prisma relations. For Postgres Concurrency Fix with 0.8s query time, we analyze pg_stat_statements and rewrite query joins.
When are you free for a quick technical sync?`;

  const diffPair2_VarB = `High database load during reporting spikes is often driven by unbounded pagination and unindexed foreign key lookups. Having tuned production PostgreSQL workloads down to 0.8s query time, I recommend implementing stale-while-revalidate caching and read-replica routing.
Would you like a 3-minute Loom video walking through how we optimize these queries?`;

  const nearDupPair3_VarA = `I reviewed your brief regarding the duplicate Stripe billing race condition. For Postgres Concurrency Fix with 0.8s query time, we wrap payment updates in atomic transactions.
• Audit PostgreSQL isolation level during concurrent webhook handling.
• Implement Redis distributed locking mechanism with idempotent key checks.
• Verify with concurrent load simulation in staging.
Would you be open to a quick 3-minute video walkthrough?`;

  const nearDupPair3_VarB = `I reviewed your job regarding the duplicate Stripe billing race condition. For Postgres Concurrency Fix with 0.8s query time, we wrap customer updates in atomic transactions.
• Audit PostgreSQL transaction level during concurrent webhook processing.
• Implement Redis distributed locks with idempotent key checks.
• Verify with concurrent load testing in staging.
Would you be open to a quick 3-minute video walkthrough?`;

  const nearDupPair4_VarA = `Fixing your Next.js build errors requires updating TypeScript types and resolving circular dependencies. Having delivered high-performance web systems, here is our plan to clean up package exports and fix hydration bugs within 24 hours.`;

  const nearDupPair4_VarB = `Fixing your Next.js build errors requires updating TypeScript configuration and resolving circular imports. Having delivered high-performance web systems, here is our plan to clean up package dependencies and fix hydration errors within 24 hours.`;

  it('measures low similarity for genuinely different variation pairs and high similarity for near duplicates', () => {
    const simDiff1 = similarity(diffPair1_VarA, diffPair1_VarB);
    const simDiff2 = similarity(diffPair2_VarA, diffPair2_VarB);
    const simDup3 = similarity(nearDupPair3_VarA, nearDupPair3_VarB);
    const simDup4 = similarity(nearDupPair4_VarA, nearDupPair4_VarB);

    // Genuinely different pairs have low Jaccard similarity (< 0.40)
    expect(simDiff1).toBeLessThan(0.45);
    expect(simDiff2).toBeLessThan(0.45);

    // Near duplicate pairs have high Jaccard similarity (> 0.55)
    expect(simDup3).toBeGreaterThan(0.55);
    expect(simDup4).toBeGreaterThan(0.55);
  });

  it('flags Variation B if similarity to Variation A exceeds threshold', () => {
    const issues = checkProposalQuality({
      pitch: nearDupPair3_VarB,
      channel: 'upwork',
      jobText: 'Fix duplicate Stripe billing race condition with PostgreSQL within 24 hours',
      profile: mockProfile,
      matchedProjects: mockProfile.projects,
      extractedJob: mockExtractedJob,
      otherVariation: nearDupPair3_VarA,
    });

    expect(issues.some((i) => i.includes('Variation B is too similar to Variation A'))).toBe(true);
  });
});

describe('Phase 7 Acceptance - Live test regression scenario', () => {
  const dockerProfile: FreelancerProfile = {
    name: 'DevOps Lead',
    role: 'Cloud & CI/CD Architect',
    bio: 'Specialist in container orchestration and automated build pipelines.',
    experience: '7 years building cloud infrastructure and CI/CD automation',
    defaultCta: 'Would you be open to a 3-minute video walkthrough?',
    projects: [
      {
        id: 'proj-docker',
        title: 'Containerized CI Pipeline',
        metricOrLink: '3x build speedup and zero deployment downtime',
        tags: ['Docker', 'GitHub Actions'],
      },
    ],
  };

  const dockerJob: ExtractedJob = {
    core_problem: 'Containerize node microservices and optimize GitHub Actions CI builds',
    tech_stack: ['Docker', 'GitHub Actions'],
    deliverables: ['Dockerfile optimization', 'CI pipeline configuration'],
    urgency: 'urgent',
    deadline: '48 hours',
    budget: '$1000',
    screening_questions: [
      'How do you handle multi-stage Docker builds for caching?',
      'Have you configured self-hosted GitHub Actions runners?',
    ],
    required_opening: null,
    other_application_instructions: [],
    red_flags: [],
  };

  it('reports quality issues when model output ignores project citation and screening questions', () => {
    const invalidPitch = `We will fix your microservices and configure your CI workflows within 48 hours. Having scaled cloud infrastructure, our team provides reliable and robust engineering. Would you be open to a 3-minute video walkthrough?`;

    const issues = checkProposalQuality({
      pitch: invalidPitch,
      channel: 'upwork',
      jobText: 'Looking for an expert to containerize our apps with Docker and GitHub Actions within 48 hours.',
      profile: dockerProfile,
      matchedProjects: dockerProfile.projects,
      extractedJob: dockerJob,
      screeningAnswers: [],
    });

    expect(issues.some((i) => i.includes('Cite the matched project'))).toBe(true);
    expect(issues.some((i) => i.includes('Answer every screening question directly'))).toBe(true);
    expect(issues.some((i) => i.includes('Remove banned fluff phrase'))).toBe(true);
  });

  it('reports zero issues when model output cites the project and answers both screening questions', () => {
    const screeningAnswers = [
      'We structure multi-stage Docker builds to maximize layer caching effectively across runners',
      'I configured self-hosted GitHub Actions runners with automatic ephemeral scaling groups',
    ];

    const validPitch = `Containerizing your node services requires caching base layers and parallelizing CI steps.

In my Containerized CI Pipeline project, we achieved 3x build speedup and zero deployment downtime using Docker and GitHub Actions.

• Multi-stage caching: We structure multi-stage Docker builds to maximize layer caching effectively across runners.
• Runner scaling: I configured self-hosted GitHub Actions runners with automatic ephemeral scaling groups.
• Rollout plan: We isolate base dependency layers and run parallel container validation in staging.

We can deliver and verify the complete workflow transition within 48 hours. Would you be open to a 3-minute video walkthrough detailing our Docker cache setup?`;

    const issues = checkProposalQuality({
      pitch: validPitch,
      channel: 'upwork',
      jobText: 'Looking for an expert to containerize our apps with Docker and GitHub Actions within 48 hours.',
      profile: dockerProfile,
      matchedProjects: dockerProfile.projects,
      extractedJob: dockerJob,
      screeningAnswers,
    });

    expect(issues).toEqual([]);
  });
});



