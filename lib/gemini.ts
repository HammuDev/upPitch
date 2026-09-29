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

export class GeminiServiceError extends Error {
  constructor(message = 'AI service error. Please try again.') {
    super(message);
    this.name = 'GeminiServiceError';
  }
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
 * Executes a Gemini API call with x-goog-api-key header, 25s timeout,
 * JSON mode, model fallbacks, and safe JSON parsing with single retry.
 */
export async function callGemini<T = unknown>({
  apiKey,
  prompt,
  temperature = 0.7,
}: {
  apiKey: string;
  prompt: string;
  temperature?: number;
}): Promise<T> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    throw new GeminiAuthError();
  }

  const primaryModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';
  const fallbackModel = process.env.GEMINI_FALLBACK_MODEL?.trim() || 'gemini-3.1-flash-lite';
  const candidateModels = Array.from(new Set([primaryModel, fallbackModel])).slice(0, 2);

  let lastCategory: '401' | '429' | '502' | '500' = '500';

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
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) {
            throw new Error('Empty candidates in Gemini response');
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
          console.error(`Gemini API Error: Status ${response.status}`);
          // Never retry on 400, 401, 403
          if (response.status === 400 || response.status === 401 || response.status === 403) {
            throw new GeminiAuthError();
          }
          if (response.status === 429) {
            lastCategory = '429';
            break; // Try fallback model
          } else if (response.status >= 500) {
            lastCategory = '502';
            break; // Try fallback model
          } else {
            lastCategory = '500';
            break;
          }
        }
      } catch (err: unknown) {
        if (err instanceof GeminiAuthError) {
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
