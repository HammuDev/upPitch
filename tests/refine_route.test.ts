import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/refine-pitch/route';
import { validateShortenedProposal } from '@/lib/checks';
import { NextRequest } from 'next/server';
import { callGemini, GeminiServiceError } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/ratelimit';

vi.mock('@/lib/gemini', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/gemini')>();
  return {
    ...actual,
    callGemini: vi.fn(),
  };
});

vi.mock('@/lib/ratelimit', () => ({
  checkRateLimit: vi.fn(),
}));

describe('app/api/refine-pitch/route.ts - POST Handler & Validation', () => {
  const validText =
    'I reviewed your brief regarding the duplicate Stripe billing race condition.\n\nHaving resolved similar high-volume concurrency issues in Postgres Concurrency Fix with 0.8s query time, we can wrap payment updates in atomic PostgreSQL transactions. We can deliver and verify the fix within 24 hours. Would you be open to a 3-minute video walkthrough?';

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

  it('validateShortenedProposal enforces unchanged opening line, no fluff, and no invented numbers', () => {
    // 1. Altered opening line fails
    const alteredOpening =
      'Hello there!\n\nFor Postgres Concurrency Fix with 0.8s query time, we fix it in 24 hours.';
    const resAltered = validateShortenedProposal(validText, alteredOpening);
    expect(resAltered.isValid).toBe(false);

    // 2. Introduced unverified numbers fails
    const newNumbers =
      'I reviewed your brief regarding the duplicate Stripe billing race condition.\n\nWe scaled 99999 users with 0.8s query time in 24 hours.';
    const resNumbers = validateShortenedProposal(validText, newNumbers);
    expect(resNumbers.isValid).toBe(false);
    expect(resNumbers.reason).toContain('99999');

    // 3. Clean shortened proposal passes
    const cleanShort =
      'I reviewed your brief regarding the duplicate Stripe billing race condition.\n\nFor Postgres Concurrency Fix with 0.8s query time, we will wrap transactions in atomic PostgreSQL locks and verify within 24 hours. Open to a 3-minute walkthrough?';
    const resClean = validateShortenedProposal(validText, cleanShort);
    expect(resClean.isValid).toBe(true);
  });

  it('returns 400 on invalid or malformed JSON body', async () => {
    const req = new NextRequest('http://localhost:3000/api/refine-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: 'invalid-json{{',
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 when text is too short (< 20 chars)', async () => {
    const req = new NextRequest('http://localhost:3000/api/refine-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: 'Short',
        instruction: 'shorten',
        channel: 'upwork',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 429 when rate limit is exceeded', async () => {
    vi.mocked(checkRateLimit).mockResolvedValueOnce({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 30000,
    });

    const req = new NextRequest('http://localhost:3000/api/refine-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: validText,
        instruction: 'shorten',
        channel: 'upwork',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(429);
    expect(res.headers.get('Retry-After')).toBeDefined();
  });

  it('returns 401 when no Gemini API key is configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const req = new NextRequest('http://localhost:3000/api/refine-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: validText,
        instruction: 'shorten',
        channel: 'upwork',
      }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('returns 502 with generic message on upstream Gemini service error', async () => {
    vi.mocked(callGemini).mockRejectedValueOnce(
      new GeminiServiceError('Internal upstream failure')
    );

    const req = new NextRequest('http://localhost:3000/api/refine-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: validText,
        instruction: 'shorten',
        channel: 'upwork',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(502);
    expect(data.error).toBe('AI service error. Please try again.');
  });

  it('returns original text with message when model output violates checks', async () => {
    vi.mocked(callGemini).mockResolvedValueOnce({
      shortenedText:
        'I am thrilled to apply!\n\nWe scaled systems to 99999 users and resolved Postgres Concurrency Fix with 0.8s query time in 24 hours.',
    });

    const req = new NextRequest('http://localhost:3000/api/refine-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: validText,
        instruction: 'shorten',
        channel: 'upwork',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.text).toBe(validText);
    expect(data.message).toContain('Preserved original text');
  });

  it('returns 200 with shortened text when model output passes all checks', async () => {
    const shortenedCandidate =
      'I reviewed your brief regarding the duplicate Stripe billing race condition.\n\nFor Postgres Concurrency Fix with 0.8s query time, we wrap transactions in atomic PostgreSQL locks and verify within 24 hours. Would you be open to a 3-minute video walkthrough?';

    vi.mocked(callGemini).mockResolvedValueOnce({
      shortenedText: shortenedCandidate,
    });

    const req = new NextRequest('http://localhost:3000/api/refine-pitch', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: validText,
        instruction: 'shorten',
        channel: 'upwork',
      }),
    });
    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.text).toBe(shortenedCandidate);
  });
});
