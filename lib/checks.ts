import { Channel, FreelancerProfile, ProjectItem } from '@/types';
import { ExtractedJob } from '@/lib/prompts';

/**
 * Strips markdown formatting (bold, backticks, and italic word wrappers)
 * while preserving legitimate single-asterisk usage (e.g., 5*3, bullets).
 */
export function sanitizePlainText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold markdown
    .replace(/`(.*?)`/g, '$1') // remove backticks
    // remove italics wrapped in single asterisks (*word* or *some phrase*)
    .replace(/(^|[\s(])\*([^*\n]+?)\*([\s).,!?:;]|$)/g, '$1$2$3')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Banned generic buzzwords / boilerplate phrases.
 */
const BANNED_FLUFF_PHRASES = [
  'thrilled',
  'passionate',
  'perfect fit',
  'hard-working',
  'hard working',
  'i am writing to',
  "i'm writing to",
  'dear hiring manager',
  'excited to apply',
  'game-changer',
  'game changer',
];

const GREETING_STARTS = [
  'hi',
  'hello',
  'hey',
  'dear',
  'greetings',
  'good morning',
  'good afternoon',
  'good evening',
  'to the hiring team',
];

const SIGN_OFF_PHRASES = [
  'best regards',
  'warm regards',
  'sincerely',
  'thanks',
  'thank you',
  'cheers',
  'best,',
  'regards,',
  'respectfully',
];

/**
 * Pure code quality check for generated proposals.
 * Returns an array of detected issues/rule violations.
 */
export function checkProposalQuality({
  pitch,
  channel,
  jobText,
  profile,
  matchedProjects,
  extractedJob,
}: {
  pitch: string;
  channel: Channel;
  jobText: string;
  profile: FreelancerProfile;
  matchedProjects: ProjectItem[];
  extractedJob?: ExtractedJob;
}): string[] {
  const issues: string[] = [];
  const cleanPitch = sanitizePlainText(pitch);
  if (!cleanPitch) {
    issues.push('Proposal is empty.');
    return issues;
  }

  const lowerPitch = cleanPitch.toLowerCase();
  const words = cleanPitch.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // 1. Upwork specific checks: No greetings, No sign-offs
  if (channel === 'upwork') {
    const firstWord = words[0]?.toLowerCase().replace(/[^a-z]/g, '') || '';
    const firstFewWords = words.slice(0, 3).join(' ').toLowerCase();

    for (const greeting of GREETING_STARTS) {
      if (firstWord === greeting || firstFewWords.startsWith(greeting)) {
        issues.push(
          `Do not start Upwork proposals with greetings like "${greeting}". Open directly with the client's problem.`
        );
        break;
      }
    }

    // Check last 20 words for sign-offs
    const endSnippet = words.slice(-20).join(' ').toLowerCase();
    for (const signoff of SIGN_OFF_PHRASES) {
      if (endSnippet.includes(signoff)) {
        issues.push(
          `Do not include sign-offs like "${signoff}" in Upwork proposals. Keep the ending focused on a single CTA.`
        );
        break;
      }
    }
  }

  // 2. Banned fluff phrases
  for (const phrase of BANNED_FLUFF_PHRASES) {
    if (lowerPitch.includes(phrase)) {
      issues.push(`Remove banned fluff phrase: "${phrase}".`);
    }
  }

  // 3. First line length check
  const firstLine = cleanPitch.split('\n')[0]?.trim() || '';
  if (firstLine.length > 180) {
    issues.push(
      `First line is ${firstLine.length} characters long. Keep the hook punchy and under 180 characters.`
    );
  }

  // 4. Required opening word/phrase check
  if (extractedJob?.required_opening) {
    const requiredOp = extractedJob.required_opening.trim().toLowerCase();
    const pitchStart = cleanPitch.trim().toLowerCase();
    if (!pitchStart.startsWith(requiredOp)) {
      issues.push(
        `The proposal MUST start with the client's required opening: "${extractedJob.required_opening}".`
      );
    }
  }

  // 5. Word count check (100 to 260 words for Upwork / standard pitches)
  if (channel === 'upwork' || channel === 'cold-email' || channel === 'linkedin') {
    if (wordCount < 100) {
      issues.push(`Word count (${wordCount} words) is too short. Target 110-240 words.`);
    } else if (wordCount > 260) {
      issues.push(`Word count (${wordCount} words) is too long. Keep under 240 words.`);
    }
  }

  // 6. Invented Numbers Audit
  // Collect all known numbers from source inputs
  const sourceText = [
    jobText,
    profile.name,
    profile.role,
    profile.bio,
    profile.experience || '',
    profile.defaultCta || '',
    ...profile.projects.flatMap((p) => [p.title, p.metricOrLink, ...p.tags]),
    ...matchedProjects.flatMap((p) => [p.title, p.metricOrLink, ...p.tags]),
  ]
    .join(' ')
    .toLowerCase();

  // Find all number tokens in the pitch (e.g., "10", "99.9", "500", "24-48")
  const numberMatches = cleanPitch.match(/\b\d+(?:[.,]\d+)?\b/g) || [];
  const checkedNumbers = new Set<string>();

  for (const numStr of numberMatches) {
    if (checkedNumbers.has(numStr)) continue;
    checkedNumbers.add(numStr);

    // Number 3 is allowed for the standard 3-minute Loom offer
    if (numStr === '3') continue;

    // Check if the number string or clean digits exist anywhere in source text
    const cleanNum = numStr.replace(/,/g, '');
    const inSource = sourceText.includes(numStr) || sourceText.includes(cleanNum);

    if (!inSource) {
      issues.push(
        `Invented number detected: "${numStr}". Only cite numbers explicitly found in the job post or your profile/projects.`
      );
    }
  }

  // 7. Screening questions answered
  if (extractedJob?.screening_questions && extractedJob.screening_questions.length > 0) {
    if (extractedJob.screening_questions.length > 0 && wordCount < 90) {
      issues.push('Ensure all screening questions from the client are clearly answered.');
    }
  }

  return issues;
}
