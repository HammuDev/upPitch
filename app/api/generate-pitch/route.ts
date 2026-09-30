import { NextRequest, NextResponse } from 'next/server';
import { generatePitchSchema } from '@/lib/validate';
import { checkRateLimit } from '@/lib/ratelimit';
import { runPitchPipeline } from '@/lib/generate';
import { PROMPT_VERSION } from '@/lib/prompts';
import {
  GeminiAuthError,
  GeminiBlockedContentError,
  GeminiRateLimitError,
  GeminiServiceError,
} from '@/lib/gemini';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    // 1. Strict Payload Validation with Zod (Server-only)
    const validation = generatePitchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const { jobText, profile, selectedProjects, channel, tone, apiKey } =
      validation.data;

    // 2. IP-based Sliding Window Rate Limiting
    const xForwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 'unknown';
    const hasCustomKey = Boolean(apiKey?.trim());

    const rateLimit = await checkRateLimit(clientIp, hasCustomKey);
    if (!rateLimit.success) {
      const retryAfterSeconds = Math.max(
        1,
        Math.ceil((rateLimit.reset - Date.now()) / 1000)
      );
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(retryAfterSeconds),
          },
        }
      );
    }

    // 3. Retrieve and Validate Gemini Key
    const geminiKey = apiKey?.trim() || process.env.GEMINI_API_KEY?.trim();
    if (!geminiKey) {
      return NextResponse.json(
        { error: 'No valid Gemini API key configured.' },
        { status: 401 }
      );
    }

    // 4. Run Pipeline (Extract -> Rank -> Write -> Check -> Retry)
    try {
      const result = await runPitchPipeline({
        jobText,
        profile,
        selectedProjects,
        channel,
        tone,
        geminiKey,
      });

      // Empty-output guard: if both variations are empty after trimming, return 502
      if (!result.variationA?.trim() && !result.variationB?.trim()) {
        return NextResponse.json(
          { error: 'AI service error. Please try again.' },
          { status: 502 }
        );
      }

      // Cost & Operations Visibility: Log ONE structured server line per request (never log content/keys)
      const durationMs = Date.now() - startTime;
      console.log(
        JSON.stringify({
          promptVersion: PROMPT_VERSION,
          channel,
          calls: result.metrics?.calls ?? 1,
          promptTokenCount: result.metrics?.promptTokens ?? 0,
          candidatesTokenCount: result.metrics?.candidateTokens ?? 0,
          totalTokenCount: result.metrics?.totalTokens ?? 0,
          retryUsed: result.metrics?.retryUsed ?? false,
          durationMs,
        })
      );

      return NextResponse.json(result);
    } catch (pipelineErr: unknown) {
      if (pipelineErr instanceof GeminiAuthError) {
        return NextResponse.json(
          { error: 'No valid Gemini API key configured.' },
          { status: 401 }
        );
      }
      if (pipelineErr instanceof GeminiBlockedContentError) {
        return NextResponse.json(
          {
            error:
              'The AI could not process this job post. Try editing the text and generating again.',
          },
          { status: 422 }
        );
      }
      if (pipelineErr instanceof GeminiRateLimitError) {
        return NextResponse.json(
          { error: 'AI service is busy. Try again shortly.' },
          { status: 429 }
        );
      }
      if (pipelineErr instanceof GeminiServiceError) {
        return NextResponse.json(
          { error: 'AI service error. Please try again.' },
          { status: 502 }
        );
      }

      const errName = pipelineErr instanceof Error ? pipelineErr.name : 'Error';
      console.error(`Pipeline Execution Error: ${errName}`);
      return NextResponse.json(
        { error: 'Something went wrong.' },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const errName = err instanceof Error ? err.name : 'Error';
    console.error(`Unhandled API Route Error: ${errName}`);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
