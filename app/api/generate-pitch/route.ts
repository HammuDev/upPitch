import { NextRequest, NextResponse } from 'next/server';
import { generatePitchSchema } from '@/lib/validate';
import { checkRateLimit } from '@/lib/ratelimit';

function sanitizeUpworkText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold markdown
    .replace(/\*(.*?)\*/g, '$1')     // remove italic markdown
    .replace(/`(.*?)`/g, '$1')      // remove backticks
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    // 1. Strict Payload Validation with Zod
    const validation = generatePitchSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    const { jobText, profile, selectedProjects, channel, tone, apiKey } = validation.data;

    // 2. IP-based Sliding Window Rate Limiting
    const xForwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = xForwardedFor ? xForwardedFor.split(',')[0].trim() : 'unknown';
    const hasCustomKey = Boolean(apiKey?.trim());

    const rateLimit = await checkRateLimit(clientIp, hasCustomKey);
    if (!rateLimit.success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((rateLimit.reset - Date.now()) / 1000));
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

    const freelancerName = profile.name.trim();
    const freelancerRole = profile.role?.trim() || '';
    const userBio = profile.bio?.trim() || '';
    const platform = channel;
    const chosenTone = tone;

    const projectsContext =
      selectedProjects.length > 0
        ? selectedProjects
            .map(
              (p, i) =>
                `Project ${i + 1}: ${p.title} | Metric/Link: ${p.metricOrLink} | Tech Tags: ${p.tags.join(', ')}`
            )
            .join('\n')
        : 'No specific project selected. Use general expertise matching the role.';

    const promptText = `You are an elite freelance proposal specialist for UpPitch.
Analyze the real job posting below and generate two distinct, high-converting, professional proposals following these STRICT REFINEMENT RULES:

==============================
REAL JOB DESCRIPTION:
"""
${jobText}
"""
==============================
FREELANCER PROFILE CONTEXT:
- Name: ${freelancerName}
- Primary Title/Role: ${freelancerRole}
- Bio Summary: ${userBio}
- Selected Past Projects & Metrics:
${projectsContext}
- Target Platform: ${platform}
- Selected Tone: ${chosenTone}
==============================

MANDATORY PROPOSAL REFINEMENT RULES (PLAIN TEXT ONLY):
CRITICAL: DO NOT use markdown asterisks (**), underscores (_), or backticks (\`) anywhere in the output. Upwork's client proposal box does not render markdown, so raw asterisks look unpolished. Format bullets cleanly in plain text (e.g., "• Audit: ..." instead of "• **Audit:** ...").

1. UPWORK PREVIEW HOOK (First Sentence):
   - Start with a natural greeting: "Hi there," (or "Hi [Name]," if client name/company is in the brief) followed by \\n\\n.
   - The very first sentence MUST directly state the root cause and the specific technical fix before any general claims.
   - Keep the first 160 characters extremely punchy, high-intent, and tailored to the job's core bottleneck.

2. OUTCOME-FIRST BULLETS (Exactly 3 Bullets in PLAIN TEXT):
   - Provide exactly 3 short, scannable action bullets in clean plain text (NO asterisks):
     • Audit: [1-sentence root cause inspection tailored to their tech stack]
     • Fix: [1-sentence concrete implementation / code fix]
     • Verify: [1-sentence staging verification / delivery timeline commitment]

3. RELEVANT PROOF (1 Sentence):
   - 1 concise sentence tying in relevant metrics or past work from the freelancer's profile context.

4. LOW-FRICTION CTA:
   - Closing question MUST offer an immediate micro-action (e.g., "Open to a quick 5-min review or sharing a code snippet of the fix before starting?").

5. PROFESSIONAL SIGN-OFF:
   - "Best regards,\\n${freelancerName}\\n${freelancerRole}"

6. STRICT LENGTH CONSTRAINT:
   - Total proposal length MUST be strictly under 140 words. No fluff, no robotic filler.

VARIATIONS INSTRUCTION:
- "variationA" (Direct Problem-Solver): Leads with immediate root-cause diagnosis, action bullets (• Audit:, • Fix:, • Verify:), and rapid delivery.
- "variationB" (Consultative Architecture Angle): Highlights an edge-case risk in their architecture, action bullets (• Inspect:, • Implement:, • Test:), and offers a 5-minute Loom video review.

OUTPUT JSON SPECIFICATION:
Return ONLY a valid JSON object matching this schema:
{
  "variationA": "Full formatted proposal text in clean PLAIN TEXT with greeting, \\n\\n paragraph breaks, plain bullets (• Audit:), and sign-off (strictly < 140 words, NO markdown ** stars)",
  "variationB": "Full formatted proposal text in clean PLAIN TEXT with greeting, \\n\\n paragraph breaks, plain bullets (• Inspect:), and sign-off (strictly < 140 words, NO markdown ** stars)",
  "subjectLine": "Short 4-6 word punchy subject line",
  "detectedProblems": ["Core Problem 1 identified from brief", "Core Problem 2", "Core Problem 3"]
}`;

    // 4. Model Selection (Primary & Fallback, Max 2 models)
    const primaryModel = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';
    const fallbackModel = process.env.GEMINI_FALLBACK_MODEL?.trim() || 'gemini-3.1-flash-lite';
    const candidateModels = Array.from(new Set([primaryModel, fallbackModel])).slice(0, 2);

    let parsedResult = null;
    let lastErrorCategory: '401' | '429' | '502' | '500' = '500';

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: promptText,
                  },
                ],
              },
            ],
            generationConfig: {
              responseMimeType: 'application/json',
            },
          }),
          signal: AbortSignal.timeout(25000),
        });

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            try {
              parsedResult = JSON.parse(rawText);
              break;
            } catch {
              parsedResult = {
                variationA: rawText,
                variationB: rawText,
                subjectLine: `Quick observation regarding ${jobText.slice(0, 30)}`,
                detectedProblems: ['Requirements Analysis'],
              };
              break;
            }
          }
        } else {
          console.error(`Gemini API Error: Status ${response.status}`);
          // Do not retry on client auth errors (400, 401, 403)
          if (response.status === 400 || response.status === 401 || response.status === 403) {
            return NextResponse.json(
              { error: 'No valid Gemini API key configured.' },
              { status: 401 }
            );
          }
          if (response.status === 429) {
            lastErrorCategory = '429';
          } else if (response.status >= 500) {
            lastErrorCategory = '502';
          } else {
            lastErrorCategory = '500';
          }
        }
      } catch (err: any) {
        console.error(`Gemini Fetch Error: ${err?.name || 'Error'}`);
        if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
          lastErrorCategory = '502';
        } else {
          lastErrorCategory = '500';
        }
      }
    }

    if (!parsedResult) {
      if (lastErrorCategory === '429') {
        return NextResponse.json(
          { error: 'AI service is busy. Try again shortly.' },
          { status: 429 }
        );
      }
      if (lastErrorCategory === '502') {
        return NextResponse.json(
          { error: 'AI service error. Please try again.' },
          { status: 502 }
        );
      }
      return NextResponse.json(
        { error: 'Something went wrong.' },
        { status: 500 }
      );
    }

    // Clean up any stray markdown symbols for a 100% clean copy-paste into Upwork
    const sanitizedOutput = {
      variationA: sanitizeUpworkText(parsedResult.variationA || ''),
      variationB: sanitizeUpworkText(parsedResult.variationB || ''),
      subjectLine: parsedResult.subjectLine || undefined,
      detectedProblems: Array.isArray(parsedResult.detectedProblems)
        ? parsedResult.detectedProblems
        : [],
    };

    return NextResponse.json(sanitizedOutput);
  } catch (err: any) {
    console.error(`Unhandled API Route Error: ${err?.name || 'Error'}`);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 }
    );
  }
}
