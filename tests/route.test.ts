import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/generate-pitch/route';
import { NextRequest } from 'next/server';
import { runPitchPipeline } from '@/lib/generate';
import { checkRateLimit } from '@/lib/ratelimit';
import {
  GeminiAuthError,
  GeminiBlockedContentError,
  GeminiRateLimitError,
  GeminiServiceError,
} from '@/lib/gemini';

vi.mock('@/lib/generate', () => ({
  runPitchPipeline: vi.fn(),
}));

vi.mock('@/lib/ratelimit', () => ({
  checkRateLimit: vi.fn(),
}));

describe('app/api/generate-pitch/route.ts - POST Handler', () => {
  const validPayload = {
    jobText: 'Need a senior Next.js and TypeScript developer to build a SaaS dashboard.',
    profile: {
      name: 'Alex Rivera',
      role: 'Full-Stack Engineer',
      bio: '6 years of experience in React and Node.js',
      experience: '5+ years building SaaS',
      defaultCta: 'Would you be open to a 3-minute video walkthrough?',
      projects: [
        {
          id: 'p-1',
          title: 'Enterprise Next.js SaaS',
          metricOrLink: '0.8s load time',
          tags: ['Next.js', 'React', 'TypeScript'],
        },
      ],
    },
    selectedProjects: [
      {
        id: 'p-1',
        title: 'Enterprise Next.js SaaS',
        metricOrLink: '0.8s load time',
        tags: ['Next.js', 'React', 'TypeScript'],
      },
    ],
    channel: 'upwork',
    tone: 'direct',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test-server-gemini-key';
    vi.mocked(checkRateLimit).mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: Date.now() + 3600000,
    });
  });

  it('returns 400 when body is invalid or unparseable JSON', async () => {
    const req = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'this is not json { [',
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid request.');
  });

  it('returns 400 when jobText exceeds maximum character limit (10,000 chars)', async () => {
    const oversizedPayload = {
      ...validPayload,
      jobText: 'A'.repeat(10001),
    };

    const req = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(oversizedPayload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid request.');
  });

  it('returns 400 when required freelancer profile name is missing or empty', async () => {
    const missingNamePayload = {
      ...validPayload,
      profile: {
        ...validPayload.profile,
        name: '   ',
      },
    };

    const req = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(missingNamePayload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Invalid request.');
  });

  it('returns 429 with Retry-After header when rate limit is exceeded', async () => {
    const resetTime = Date.now() + 45000;
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: resetTime,
    });

    const req = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.195',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(429);
    expect(data.error).toBe('Too many requests. Please try again later.');
    expect(res.headers.get('Retry-After')).toBeDefined();
    const retryAfterSec = Number(res.headers.get('Retry-After'));
    expect(retryAfterSec).toBeGreaterThan(0);
    expect(retryAfterSec).toBeLessThanOrEqual(46);
  });

  it('returns 401 when no Gemini API key is configured on server or in request', async () => {
    delete process.env.GEMINI_API_KEY;

    const req = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('No valid Gemini API key configured.');
  });

  it('returns generic 502 message with no upstream text on upstream failure', async () => {
    vi.mocked(runPitchPipeline).mockRejectedValueOnce(
      new GeminiServiceError('Internal upstream socket hangup in Gemini cluster us-central1')
    );

    const req = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe('AI service error. Please try again.');
    // Ensure no upstream details are leaked
    expect(JSON.stringify(data)).not.toContain('us-central1');
    expect(JSON.stringify(data)).not.toContain('socket hangup');
  });

  it('maps GeminiAuthError to 401 and GeminiBlockedContentError to 422', async () => {
    vi.mocked(runPitchPipeline).mockRejectedValueOnce(new GeminiAuthError());

    const reqAuth = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    });
    const resAuth = await POST(reqAuth);
    expect(resAuth.status).toBe(401);

    vi.mocked(runPitchPipeline).mockRejectedValueOnce(new GeminiBlockedContentError());
    const reqBlocked = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    });
    const resBlocked = await POST(reqBlocked);
    const dataBlocked = await resBlocked.json();
    expect(resBlocked.status).toBe(422);
    expect(dataBlocked.error).toBe(
      'The AI could not process this job post. Try editing the text and generating again.'
    );
  });

  it('returns 502 when pipeline returns empty variations (empty-output guard)', async () => {
    vi.mocked(runPitchPipeline).mockResolvedValueOnce({
      variationA: '   ',
      variationB: '',
      detectedProblems: [],
      matchedProjects: [],
    });

    const req = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(502);
    expect(data.error).toBe('AI service error. Please try again.');
  });

  it('returns 200 with the documented shape on valid request', async () => {
    vi.mocked(runPitchPipeline).mockResolvedValueOnce({
      variationA: 'Direct proposal draft text for variation A',
      variationB: 'Consultative proposal draft text for variation B',
      subjectLine: 'Next.js SaaS Dashboard Proposal',
      detectedProblems: ['Migrate Vue to Next.js', 'Performance bottlenecks'],
      matchedProject: validPayload.selectedProjects[0],
      matchedProjects: validPayload.selectedProjects,
      warnings: undefined,
      metrics: {
        calls: 2,
        promptTokens: 1200,
        candidateTokens: 300,
        totalTokens: 1500,
        retryUsed: false,
      },
    });

    const req = new NextRequest('http://localhost:3000/api/generate-pitch', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '198.51.100.42',
      },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.variationA).toBe('Direct proposal draft text for variation A');
    expect(data.variationB).toBe('Consultative proposal draft text for variation B');
    expect(data.subjectLine).toBe('Next.js SaaS Dashboard Proposal');
    expect(data.detectedProblems).toHaveLength(2);
    expect(data.matchedProject?.id).toBe('p-1');
  });
});
