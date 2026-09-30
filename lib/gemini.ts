import { DEFAULT_GEMINI_MODELS } from '@/lib/config';

export class GeminiAuthError extends Error {
  constructor(message = 'No valid Gemini API key configured.') {
    super(message);
    this.name = 'GeminiAuthError';
  }
}

export class GeminiRateLimitError extends Error {
  constructor(message = 'AI service is busy. Try again shortly.') {
    super(message);
    this.name = 'GeminiRateLimitError';
  }
}

export class GeminiBlockedContentError extends Error {
  constructor(
    message = 'The AI could not process this job post. Try editing the text and generating again.'
  ) {
    super(message);
    this.name = 'GeminiBlockedContentError';
  }
}

export class GeminiServiceError extends Error {
  constructor(message = 'AI service error. Please try again.') {
    super(message);
    this.name = 'GeminiServiceError';
  }
}

export interface GeminiUsage {
  promptTokenCount: number;
  candidatesTokenCount: number;
  totalTokenCount: number;
}

/**
 * Safely parses JSON string, stripping markdown code fences if present.
 */
export function safeParseJson<T = unknown>(rawText: string): T {
  if (!rawText) {
    throw new Error('Empty JSON response');
  }
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

/**
 * Checks whether an error response from Gemini indicates an invalid or unauthorized API key.
 */
function isApiKeyError(status: number, data: unknown): boolean {
  if (status === 401 || status === 403) return true;
  if (!data || typeof data !== 'object') return false;

  const errObj = (data as { error?: Record<string, unknown> }).error;
  if (!errObj) return false;

  const msg = typeof errObj.message === 'string' ? errObj.message.toLowerCase() : '';
  const statusStr = typeof errObj.status === 'string' ? errObj.status.toLowerCase() : '';

  if (
    statusStr === 'unauthenticated' ||
    msg.includes('api_key_invalid') ||
    msg.includes('api key not valid') ||
    msg.includes('api key expired')
  ) {
    return true;
  }

  if (Array.isArray(errObj.details)) {
    for (const detail of errObj.details) {
      if (
        detail &&
        typeof detail === 'object' &&
        (detail.reason === 'API_KEY_INVALID' || detail.reason === 'API_KEY_SERVICE_BLOCKED')
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Executes a Gemini API call with x-goog-api-key header, 25s timeout,
 * JSON mode, model fallbacks, safety block handling, and safe JSON parsing with single retry.
 */
export async function callGemini<T = unknown>({
  apiKey,
  prompt,
  temperature = 0.7,
  onUsage,
}: {
  apiKey: string;
  prompt: string;
  temperature?: number;
  onUsage?: (usage: GeminiUsage) => void;
}): Promise<T> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new GeminiAuthError();
  }

  const primaryModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODELS.primary;
  const fallbackModel =
    process.env.GEMINI_FALLBACK_MODEL?.trim() || DEFAULT_GEMINI_MODELS.fallback;
  const candidateModels = Array.from(new Set([primaryModel, fallbackModel])).slice(0, 2);

  let lastCategory: '401' | '422' | '429' | '502' | '500' = '500';

  for (const model of candidateModels) {
    // Attempt up to 2 times for JSON parsing recovery
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': cleanKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature,
            },
          }),
          signal: AbortSignal.timeout(25000),
        });

        if (response.ok) {
          const data = await response.json();

          // Capture token usage if present
          if (data?.usageMetadata && onUsage) {
            onUsage({
              promptTokenCount: data.usageMetadata.promptTokenCount || 0,
              candidatesTokenCount: data.usageMetadata.candidatesTokenCount || 0,
              totalTokenCount: data.usageMetadata.totalTokenCount || 0,
            });
          }

          // Check prompt level block reason
          if (data?.promptFeedback?.blockReason) {
            console.warn(
              `Gemini Prompt Blocked: Reason ${data.promptFeedback.blockReason}`
            );
            throw new GeminiBlockedContentError();
          }

          const candidate = data?.candidates?.[0];
          const finishReason = candidate?.finishReason;

          // Check safety blocks or stop reasons that produce empty output
          if (
            finishReason &&
            finishReason !== 'STOP' &&
            finishReason !== 'MAX_TOKENS'
          ) {
            console.warn(`Gemini Candidate Finished With Reason: ${finishReason}`);
            throw new GeminiBlockedContentError();
          }

          const rawText = candidate?.content?.parts?.[0]?.text;
          if (!rawText || !rawText.trim()) {
            if (finishReason === 'SAFETY' || finishReason === 'RECITATION' || finishReason === 'BLOCKLIST') {
              throw new GeminiBlockedContentError();
            }
            throw new Error('Empty candidates text in Gemini response');
          }

          try {
            const parsed = safeParseJson<T>(rawText);
            return parsed;
          } catch {
            console.error(`Gemini JSON Parse Error: Attempt ${attempt + 1}`);
            if (attempt === 0) {
              continue; // Retry once
            }
            throw new GeminiServiceError();
          }
        } else {
          let errorData: unknown = null;
          try {
            errorData = await response.json();
          } catch {
            // Ignore json parse error of error response
          }

          console.error(`Gemini API Error: Status ${response.status}`);

          if (isApiKeyError(response.status, errorData)) {
            throw new GeminiAuthError();
          }

          if (response.status === 429) {
            lastCategory = '429';
            break; // Try fallback model
          } else if (response.status >= 500 || response.status === 400) {
            lastCategory = '502';
            break; // Try fallback model
          } else {
            lastCategory = '500';
            break;
          }
        }
      } catch (err: unknown) {
        if (err instanceof GeminiAuthError || err instanceof GeminiBlockedContentError) {
          throw err;
        }
        if (err instanceof GeminiServiceError) {
          throw err;
        }
        const errName = err instanceof Error ? err.name : 'Error';
        console.error(`Gemini Fetch Error: ${errName}`);
        if (errName === 'TimeoutError' || errName === 'AbortError') {
          lastCategory = '502';
        }
        break; // Move to next model
      }
    }
  }

  if (lastCategory === '429') {
    throw new GeminiRateLimitError();
  }
  if (lastCategory === '502') {
    throw new GeminiServiceError();
  }
  throw new GeminiServiceError();
}
