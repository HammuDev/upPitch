import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  callGemini,
  GeminiAuthError,
  GeminiServiceError,
  GeminiBlockedContentError,
} from '@/lib/gemini';

describe('lib/gemini.ts - Error Mapping & Safety Block Handling', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('maps HTTP 401 and explicit API_KEY_INVALID error payloads to GeminiAuthError', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: {
          code: 400,
          message: 'API key not valid. Please pass a valid API key.',
          status: 'INVALID_ARGUMENT',
          details: [{ reason: 'API_KEY_INVALID' }],
        },
      }),
    });

    await expect(
      callGemini({ apiKey: 'bad-key', prompt: 'test' })
    ).rejects.toBeInstanceOf(GeminiAuthError);
  });

  it('maps generic HTTP 400 errors (without API key invalid indicators) to GeminiServiceError (status 502 upstream rejection)', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: {
          code: 400,
          message: 'Invalid JSON payload received. Unknown field.',
          status: 'INVALID_ARGUMENT',
        },
      }),
    });

    await expect(
      callGemini({ apiKey: 'valid-key', prompt: 'test' })
    ).rejects.toBeInstanceOf(GeminiServiceError);
  });

  it('throws GeminiBlockedContentError when promptFeedback.blockReason is present', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        promptFeedback: {
          blockReason: 'SAFETY',
          safetyRatings: [{ category: 'HARM_CATEGORY_DANGEROUS', probability: 'HIGH' }],
        },
        candidates: [],
      }),
    });

    await expect(
      callGemini({ apiKey: 'valid-key', prompt: 'test' })
    ).rejects.toBeInstanceOf(GeminiBlockedContentError);
  });

  it('throws GeminiBlockedContentError when candidate finishReason indicates a safety block or stop with no text', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        candidates: [
          {
            finishReason: 'SAFETY',
            content: { parts: [] },
          },
        ],
      }),
    });

    await expect(
      callGemini({ apiKey: 'valid-key', prompt: 'test' })
    ).rejects.toBeInstanceOf(GeminiBlockedContentError);
  });
});
