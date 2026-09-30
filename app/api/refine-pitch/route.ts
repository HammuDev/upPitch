import { NextRequest, NextResponse } from 'next/server';
import { refinePitchSchema } from '@/lib/validate';
import { checkRateLimit } from '@/lib/ratelimit';
import {
  callGemini,
  GeminiAuthError,
  GeminiBlockedContentError,
  GeminiRateLimitError,
  GeminiServiceError,
} from '@/lib/gemini';
import { validateShortenedProposal } from '@/lib/checks';

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const validation = refinePitchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const { text, channel, apiKey } = validation.data;

    // Rate Limiting
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

    const geminiKey = apiKey?.trim() || process.env.GEMINI_API_KEY?.trim();
    if (!geminiKey) {
      return NextResponse.json(
        { error: 'No valid Gemini API key configured.' },
        { status: 401 }
      );
    }

    const prompt = `You are UpPitch's proposal editor.
Shorten this proposal by about 30 percent. Keep the opening line, the answers to screening questions, and every number and project name exactly. Do not add any facts, numbers, tools or claims. Return only the text.

Outreach Channel: ${channel}

Original Proposal:
"""
${text}
"""

Return JSON format:
{
  "shortenedText": "the shortened proposal text here"
}`;

    try {
      const rawResult = await callGemini<{ shortenedText?: string }>({
        apiKey: geminiKey,
        prompt,
        temperature: 0.3,
      });

      const candidateText = rawResult?.shortenedText?.trim() || '';
      const validationCheck = validateShortenedProposal(text, candidateText);

      if (!validationCheck.isValid) {
        return NextResponse.json({
          text,
          message: 'Could not shorten proposal without losing key details. Preserved original text.',
        });
      }

      return NextResponse.json({
        text: candidateText,
      });
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
      console.error(`Refine Execution Error: ${errName}`);
      return NextResponse.json(
        { error: 'Something went wrong.' },
        { status: 500 }
      );
    }
  } catch (err: unknown) {
    const errName = err instanceof Error ? err.name : 'Error';
    console.error(`Unhandled Refine Route Error: ${errName}`);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
