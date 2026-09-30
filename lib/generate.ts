import { FreelancerProfile, ProjectItem, Channel, Tone } from '@/types';
import { callGemini } from '@/lib/gemini';
import {
  ExtractedJob,
  MatchedProjectWithReason,
  buildExtractionPrompt,
  buildWriterPrompt,
} from '@/lib/prompts';
import { sanitizePlainText, checkProposalQuality } from '@/lib/checks';

export interface GenerationPipelineInput {
  jobText: string;
  profile: FreelancerProfile;
  selectedProjects: ProjectItem[];
  channel: Channel;
  tone: Tone;
  geminiKey: string;
}

export interface GenerationPipelineOutput {
  variationA: string;
  variationB: string;
  subjectLine?: string;
  detectedProblems: string[];
  matchedProject?: ProjectItem;
  matchedProjects: ProjectItem[];
  warnings?: string[];
  gaps?: string[];
}

interface RawWriterOutput {
  variationA: string;
  variationB: string;
  subjectLine?: string;
  detectedProblems?: string[];
  screeningAnswers?: string[];
  gaps?: string[];
}

const ALIAS_MAP: Record<string, string> = {
  next: 'nextjs',
  nextjs: 'next',
  node: 'nodejs',
  nodejs: 'node',
  k8s: 'kubernetes',
  kubernetes: 'k8s',
  postgres: 'postgresql',
  postgresql: 'postgres',
  js: 'javascript',
  javascript: 'js',
  ts: 'typescript',
  typescript: 'ts',
  ghactions: 'githubactions',
  githubactions: 'ghactions',
};

function normalizeToken(token: string): string {
  if (!token) return '';
  return token.toLowerCase().replace(/[\s.\-_]+/g, '');
}

function tokensMatch(tokenA: string, tokenB: string): boolean {
  const normA = normalizeToken(tokenA);
  const normB = normalizeToken(tokenB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;
  if (ALIAS_MAP[normA] === normB || ALIAS_MAP[normB] === normA) return true;
  return false;
}

/**
 * Ranks selected past projects against the job post and extracted tech stack / deliverables.
 * Compares whole normalized tokens, ignores 1-character tags, and restricts 2-character
 * tags strictly to tech_stack and deliverables.
 */
export function rankProof(
  selectedProjects: ProjectItem[],
  extractedJob: ExtractedJob,
  jobText: string
): MatchedProjectWithReason[] {
  if (!selectedProjects || selectedProjects.length === 0) {
    return [];
  }

  const techStackEntries = (extractedJob.tech_stack || [])
    .map((t) => t.trim())
    .filter(Boolean);
  const deliverablesEntries = (extractedJob.deliverables || [])
    .map((d) => d.trim())
    .filter(Boolean);

  // Extract whole tokens from jobText prose
  const proseTokens = (jobText.match(/[a-zA-Z0-9.\-_]+/g) || [])
    .map((w) => w.trim())
    .filter(Boolean);

  // Also build 2-gram and 3-gram phrases from prose for multi-word technologies (e.g. "github actions", "tailwind css")
  const proseNgrams: string[] = [];
  for (let i = 0; i < proseTokens.length; i++) {
    proseNgrams.push(proseTokens[i]);
    if (i + 1 < proseTokens.length) {
      proseNgrams.push(`${proseTokens[i]} ${proseTokens[i + 1]}`);
    }
    if (i + 2 < proseTokens.length) {
      proseNgrams.push(
        `${proseTokens[i]} ${proseTokens[i + 1]} ${proseTokens[i + 2]}`
      );
    }
  }

  const matched: MatchedProjectWithReason[] = [];

  for (const project of selectedProjects) {
    const matchedReasons: string[] = [];

    for (const tag of project.tags || []) {
      const cleanTag = tag.trim();
      const normTag = normalizeToken(cleanTag);
      if (!normTag || normTag.length < 2) {
        // Tags of 1 character are ignored
        continue;
      }

      // Check tech stack entries
      const inTechStack = techStackEntries.some((entry) =>
        tokensMatch(cleanTag, entry)
      );

      // Check deliverables entries
      const inDeliverables = deliverablesEntries.some((entry) =>
        tokensMatch(cleanTag, entry)
      );

      let inJobText = false;
      // Tags of 2 characters (e.g. "Go") match ONLY against extracted tech_stack/deliverables, never free prose
      if (normTag.length > 2) {
        inJobText = proseNgrams.some((ngram) => tokensMatch(cleanTag, ngram));
      }

      if (inTechStack || inDeliverables || inJobText) {
        matchedReasons.push(tag);
      }
    }

    if (matchedReasons.length > 0) {
      matched.push({
        project,
        matchedBecause: Array.from(new Set(matchedReasons)),
      });
    }
  }

  return matched;
}

/**
 * Orchestrates the full proposal generation pipeline:
 * 1. Extract Step (Low Temperature) -> ExtractedJob
 * 2. Rank Proof -> Matched Projects with matchedBecause
 * 3. Write Step -> Raw Proposal Drafts
 * 4. Check Step (Pure code) -> Quality & Honesty Audit
 * 5. Retry Step (Once if issues found) -> Refined Proposals
 */
export async function runPitchPipeline({
  jobText,
  profile,
  selectedProjects,
  channel,
  tone,
  geminiKey,
}: GenerationPipelineInput): Promise<GenerationPipelineOutput> {
  // Step 1: Extraction (AI Call #1, Low Temp)
  const extractionPrompt = buildExtractionPrompt(jobText);
  const rawExtraction = await callGemini<Partial<ExtractedJob>>({
    apiKey: geminiKey,
    prompt: extractionPrompt,
    temperature: 0.1,
  });

  const extractedJob: ExtractedJob = {
    core_problem:
      rawExtraction?.core_problem ||
      'Technical requirements and implementation described in brief',
    tech_stack: Array.isArray(rawExtraction?.tech_stack)
      ? rawExtraction.tech_stack
      : [],
    deliverables: Array.isArray(rawExtraction?.deliverables)
      ? rawExtraction.deliverables
      : [],
    urgency: rawExtraction?.urgency || 'normal',
    deadline: rawExtraction?.deadline || null,
    budget: rawExtraction?.budget || null,
    screening_questions: Array.isArray(rawExtraction?.screening_questions)
      ? rawExtraction.screening_questions
      : [],
    required_opening: rawExtraction?.required_opening || null,
    other_application_instructions: Array.isArray(
      rawExtraction?.other_application_instructions
    )
      ? rawExtraction.other_application_instructions
      : [],
    red_flags: Array.isArray(rawExtraction?.red_flags)
      ? rawExtraction.red_flags
      : [],
  };

  // Step 2: Rank Proof (Pure Code)
  const matchedProjectsWithReason = rankProof(
    selectedProjects,
    extractedJob,
    jobText
  );
  const matchedProjectsList = matchedProjectsWithReason.map((m) => m.project);

  // Step 3: Write Step (AI Call #2)
  const writerPrompt = buildWriterPrompt({
    extractedJob,
    jobText,
    profile,
    matchedProjects: matchedProjectsWithReason,
    channel,
    tone,
  });

  let writerResult = await callGemini<RawWriterOutput>({
    apiKey: geminiKey,
    prompt: writerPrompt,
    temperature: 0.7,
  });

  // Step 4: Quality Checks (Pure Code)
  let varA = sanitizePlainText(writerResult?.variationA || '');
  let varB = sanitizePlainText(writerResult?.variationB || '');

  const issuesVarA = checkProposalQuality({
    pitch: varA,
    channel,
    jobText,
    profile,
    matchedProjects: matchedProjectsList,
    extractedJob,
    screeningAnswers: writerResult?.screeningAnswers,
  });

  const issuesVarB = checkProposalQuality({
    pitch: varB,
    channel,
    jobText,
    profile,
    matchedProjects: matchedProjectsList,
    extractedJob,
    screeningAnswers: writerResult?.screeningAnswers,
    otherVariation: varA,
  });

  const allIssues = Array.from(
    new Set([
      ...issuesVarA.map((i) => `Variation A: ${i}`),
      ...issuesVarB.map((i) => `Variation B: ${i}`),
    ])
  );

  // Step 5: Retry Once if check issues exist (AI Call #3 Max)
  if (allIssues.length > 0) {
    try {
      const retryPrompt = buildWriterPrompt({
        extractedJob,
        jobText,
        profile,
        matchedProjects: matchedProjectsWithReason,
        channel,
        tone,
        retryIssues: allIssues,
      });

      const refinedResult = await callGemini<RawWriterOutput>({
        apiKey: geminiKey,
        prompt: retryPrompt,
        temperature: 0.6,
      });

      if (refinedResult?.variationA && refinedResult?.variationB) {
        writerResult = refinedResult;
        varA = sanitizePlainText(refinedResult.variationA);
        varB = sanitizePlainText(refinedResult.variationB);
      }
    } catch {
      // If retry fails, keep the sanitized first draft
    }
  }

  // Final Audit for Client-Facing Warnings (Non-blocking)
  const finalWarningsVarA = checkProposalQuality({
    pitch: varA,
    channel,
    jobText,
    profile,
    matchedProjects: matchedProjectsList,
    extractedJob,
    screeningAnswers: writerResult?.screeningAnswers,
  });

  const finalWarnings = Array.from(new Set(finalWarningsVarA)).slice(0, 3);

  const detectedProblems =
    Array.isArray(writerResult?.detectedProblems) &&
    writerResult.detectedProblems.length > 0
      ? writerResult.detectedProblems
      : [extractedJob.core_problem];

  const gaps =
    Array.isArray(writerResult?.gaps) && writerResult.gaps.length > 0
      ? writerResult.gaps.filter(Boolean)
      : undefined;

  return {
    variationA: varA,
    variationB: varB,
    subjectLine: writerResult?.subjectLine?.trim() || undefined,
    detectedProblems,
    matchedProject:
      matchedProjectsList.length > 0 ? matchedProjectsList[0] : undefined,
    matchedProjects: matchedProjectsList,
    warnings: finalWarnings.length > 0 ? finalWarnings : undefined,
    gaps,
  };
}
