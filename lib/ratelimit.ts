import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp in ms when window resets
}

let redisClient: Redis | null = null;
let serverKeyLimiter: Ratelimit | null = null;
let customKeyLimiter: Ratelimit | null = null;
let warnedInMemoryFallback = false;

// In-memory fallback rate limiter
interface InMemoryRecord {
  count: number;
  resetTime: number;
}
const inMemoryStore = new Map<string, InMemoryRecord>();

const ONE_HOUR_MS = 60 * 60 * 1000;

function initUpstashLimiters() {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (url && token && !redisClient) {
    try {
      redisClient = new Redis({ url, token });
      serverKeyLimiter = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(5, '1 h'),
        prefix: 'uppitch_rl_server',
      });
      customKeyLimiter = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(30, '1 h'),
        prefix: 'uppitch_rl_custom',
      });
    } catch (e) {
      console.error('Failed to initialize Upstash Redis rate limiter:', e);
      redisClient = null;
    }
  }
}

export async function checkRateLimit(
  ip: string,
  hasCustomApiKey: boolean
): Promise<RateLimitResult> {
  initUpstashLimiters();

  if (redisClient && serverKeyLimiter && customKeyLimiter) {
    const limiter = hasCustomApiKey ? customKeyLimiter : serverKeyLimiter;
    const result = await limiter.limit(ip);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  // In-Memory Fallback
  if (!warnedInMemoryFallback) {
    console.warn(
      'Warning: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not configured. Falling back to in-memory rate limiting (per-instance only).'
    );
    warnedInMemoryFallback = true;
  }

  const now = Date.now();
  const maxLimit = hasCustomApiKey ? 30 : 5;
  const storeKey = `${hasCustomApiKey ? 'custom' : 'server'}:${ip}`;

  const record = inMemoryStore.get(storeKey);

  if (!record || now > record.resetTime) {
    const resetTime = now + ONE_HOUR_MS;
    inMemoryStore.set(storeKey, { count: 1, resetTime });
    return {
      success: true,
      limit: maxLimit,
      remaining: maxLimit - 1,
      reset: resetTime,
    };
  }

  if (record.count >= maxLimit) {
    return {
      success: false,
      limit: maxLimit,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit: maxLimit,
    remaining: maxLimit - record.count,
    reset: record.resetTime,
  };
}
