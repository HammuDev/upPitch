import { NextRequest, NextResponse } from 'next/server';
import { FreelancerProfile, ProjectItem, Channel, Tone } from '@/types';

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
    const body = await req.json();
    const {
      jobText,
      profile,
      selectedProjects,
      channel,
      tone,
      apiKey,
    }: {
      jobText: string;
      profile: FreelancerProfile;
      selectedProjects: ProjectItem[];
      channel: Channel;
      tone: Tone;
      apiKey?: string;
    } = body;

    const jobDescription = jobText?.trim();
    if (!jobDescription) {
      return NextResponse.json(
        { error: 'Please provide a job posting description.' },
        { status: 400 }
      );
    }

    // Securely retrieve Gemini API key from environment or user settings
    const geminiKey =
      process.env.GEMINI_API_KEY?.trim() ||
      apiKey?.trim();

    if (!geminiKey) {
      return NextResponse.json(
        {
          error:
            'No Gemini API Key found. Please configure GEMINI_API_KEY in .env.local or enter your key in API Settings.',
        },
        { status: 401 }
      );
    }

    const freelancerName = profile?.name?.trim() || 'Hammad';
    const freelancerRole = profile?.role?.trim() || 'Full-Stack Engineer';
    const userBio = profile?.bio?.trim() || '';
    const platform = channel || 'upwork';
    const chosenTone = tone || 'direct';

    const projectsContext = selectedProjects && selectedProjects.length > 0
      ? selectedProjects.map((p, i) => `Project ${i+1}: ${p.title} | Metric/Link: ${p.metricOrLink} | Tech Tags: ${p.tags.join(', ')}`).join('\n')
      : 'No specific project selected. Use general expertise matching the role.';

    const promptText = `You are an elite freelance proposal specialist for UpPitch.
Analyze the real job posting below and generate two distinct, high-converting, professional proposals following these STRICT REFINEMENT RULES:

==============================
REAL JOB DESCRIPTION:
"""
${jobDescription}
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

    const candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash',
      'gemini-3.8-flash',
    ].filter(Boolean) as string[];

    let parsedResult = null;
    let lastError = '';

    for (const model of candidateModels) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
                subjectLine: `quick observation regarding ${jobDescription.slice(0, 30)}`,
                detectedProblems: ['Requirements Analysis'],
              };
              break;
            }
          }
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData?.error?.message || `Status ${response.status}: ${response.statusText}`;
        }
      } catch (err: any) {
        lastError = err?.message || 'Network error connecting to Gemini API';
      }
    }

    if (!parsedResult) {
      return NextResponse.json(
        { error: lastError || 'No response received from Gemini AI. Please check your API key or connection.' },
        { status: 500 }
      );
    }

    // Clean up any stray markdown symbols for a 100% clean copy-paste into Upwork
    const sanitizedOutput = {
      ...parsedResult,
      variationA: sanitizeUpworkText(parsedResult.variationA),
      variationB: sanitizeUpworkText(parsedResult.variationB),
    };

    return NextResponse.json(sanitizedOutput);
  } catch (err: any) {
    console.error('Error generating pitch:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while generating pitch.' },
      { status: 500 }
    );
  }
}
