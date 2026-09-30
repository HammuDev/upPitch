import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRateLimit, resetInMemoryRateLimiterForTesting } from '@/lib/ratelimit';

describe('lib/ratelimit.ts - checkRateLimit', () => {
  beforeEach(() => {
    resetInMemoryRateLimiterForTesting();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it('allows requests within default server limit (10/hr)', async () => {
    const ip = '192.168.1.1';
    for (let i = 0; i < 10; i++) {
      const result = await checkRateLimit(ip, false);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(10 - (i + 1));
    }
  });

  it('blocks requests exceeding server limit and returns success: false with reset timestamp', async () => {
    const ip = '192.168.1.2';
    for (let i = 0; i < 10; i++) {
      await checkRateLimit(ip, false);
    }

    const overLimit = await checkRateLimit(ip, false);
    expect(overLimit.success).toBe(false);
    expect(overLimit.remaining).toBe(0);
    expect(overLimit.reset).toBeGreaterThan(Date.now());
  });

  it('allows higher limit (30/hr) when custom API key is present', async () => {
    const ip = '192.168.1.3';
    for (let i = 0; i < 30; i++) {
      const result = await checkRateLimit(ip, true);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(30 - (i + 1));
    }

    const overLimit = await checkRateLimit(ip, true);
    expect(overLimit.success).toBe(false);
  });

  it('respects RATE_LIMIT_SERVER_PER_HOUR environment variable', async () => {
    process.env.RATE_LIMIT_SERVER_PER_HOUR = '3';
    const ip = '192.168.1.4';

    expect((await checkRateLimit(ip, false)).success).toBe(true);
    expect((await checkRateLimit(ip, false)).success).toBe(true);
    expect((await checkRateLimit(ip, false)).success).toBe(true);

    const overLimit = await checkRateLimit(ip, false);
    expect(overLimit.success).toBe(false);

    delete process.env.RATE_LIMIT_SERVER_PER_HOUR;
  });

  it('falls back to in-memory limiter if Upstash is configured but fails/throws', async () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://mock-redis.upstash.io';
    process.env.UPSTASH_REDIS_REST_TOKEN = 'mock-token';

    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockRejectedValue(new Error('Upstash connection error'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // checkRateLimit should not throw when Upstash fails, and fall back to in-memory limiter
    const result = await checkRateLimit('192.168.1.5', false);
    expect(result).toBeDefined();
    expect(result.success).toBe(true);

    warnSpy.mockRestore();
    global.fetch = originalFetch;
  });
});
