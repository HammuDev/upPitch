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
  'robust',
  'seamless',
  'leverage',
  'reliable',
  'cutting-edge',
  'cutting edge',
  'valuable time',
];

const GREETING_REGEX =
  /^(hi|hello|hey|dear|greetings|good\s+morning|good\s+afternoon|good\s+evening|to\s+the\s+hiring\s+team)\b/i;

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

const WORD_TO_DIGIT: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
  eleven: '11',
  twelve: '12',
  twenty: '20',
  thirty: '30',
  hundred: '100',
};

/**
 * Converts small number words (one..twelve, twenty, thirty, hundred) to digits.
 */
export function convertWordNumbersToDigits(text: string): string {
  if (!text) return '';
  return text.replace(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|twenty|thirty|hundred)\b/gi,
    (match) => WORD_TO_DIGIT[match.toLowerCase()] || match
  );
}

/**
 * Jaccard similarity between two texts over lowercase word tokens.
 */
export function similarity(a: string, b: string): number {
  const tokensA = new Set((a.toLowerCase().match(/[a-z0-9]+/g) || []).filter(Boolean));
  const tokensB = new Set((b.toLowerCase().match(/[a-z0-9]+/g) || []).filter(Boolean));
  if (tokensA.size === 0 && tokensB.size === 0) return 1.0;
  if (tokensA.size === 0 || tokensB.size === 0) return 0.0;

  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount++;
    }
  }
  const unionSize = tokensA.size + tokensB.size - intersectionCount;
  return unionSize === 0 ? 0 : intersectionCount / unionSize;
}

/**
 * Similarity threshold for proposal variations (Jaccard similarity).
 * Tuned against realistic pairs:
 * - Genuinely different pairs (Problem-solver vs Loom consultative): ~0.20 - 0.40
 * - Near-duplicate pairs (swapped words or shared bullet lists): ~0.55 - 0.90
 * Chosen threshold: 0.50 (flags near-duplicates while allowing shared domain terminology).
 */
export const VARIATION_SIMILARITY_THRESHOLD = 0.5;

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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
  screeningAnswers,
  otherVariation,
}: {
  pitch: string;
  channel: Channel;
  jobText: string;
  profile: FreelancerProfile;
  matchedProjects: ProjectItem[];
  extractedJob?: ExtractedJob;
  screeningAnswers?: string[];
  otherVariation?: string;
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
    const greetingMatch = cleanPitch.trim().match(GREETING_REGEX);
    if (greetingMatch) {
      const matchedGreeting = greetingMatch[1];
      issues.push(
        `Do not start Upwork proposals with greetings like "${matchedGreeting}". Open directly with the client's problem.`
      );
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

  // 2. Banned fluff phrases (whole-word matching)
  for (const phrase of BANNED_FLUFF_PHRASES) {
    const pattern = new RegExp(
      `\\b${escapeRegex(phrase).replace(/\\ /g, '\\s+')}\\b`,
      'i'
    );
    if (pattern.test(cleanPitch)) {
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

  // 6. Invented Numbers Audit (whole numeric tokens Set comparison)
  const NUMBER_TOKEN_REGEX = /\b\d+(?:[.,]\d+)?\b/g;

  const rawSource = [
    jobText,
    profile.name,
    profile.role,
    profile.bio,
    profile.experience || '',
    profile.defaultCta || '',
    ...profile.projects.flatMap((p) => [p.title, p.metricOrLink, ...p.tags]),
    ...matchedProjects.flatMap((p) => [p.title, p.metricOrLink, ...p.tags]),
  ].join(' ');

  const digitConvertedSource = convertWordNumbersToDigits(rawSource);
  const sourceNumberMatches = digitConvertedSource.match(NUMBER_TOKEN_REGEX) || [];
  const sourceNumberSet = new Set<string>();

  for (const num of sourceNumberMatches) {
    sourceNumberSet.add(num);
    sourceNumberSet.add(num.replace(/,/g, ''));
  }

  const digitConvertedPitch = convertWordNumbersToDigits(cleanPitch);
  const pitchNumberMatches = digitConvertedPitch.match(NUMBER_TOKEN_REGEX) || [];
  const checkedNumbers = new Set<string>();

  for (const numStr of pitchNumberMatches) {
    if (checkedNumbers.has(numStr)) continue;
    checkedNumbers.add(numStr);

    // Number 3 is allowed for the standard 3-minute Loom offer
    if (numStr === '3') continue;

    const cleanNum = numStr.replace(/,/g, '');
    const inSource = sourceNumberSet.has(numStr) || sourceNumberSet.has(cleanNum);

    if (!inSource) {
      issues.push(
        `Invented number detected: "${numStr}". Only cite numbers explicitly found in the job post or your profile/projects.`
      );
    }
  }

  // 7. Matched project citation requirement
  if (matchedProjects && matchedProjects.length > 0) {
    const topProject = matchedProjects[0];
    const titleLower = topProject.title.toLowerCase();
    const metricLower = (topProject.metricOrLink || '').toLowerCase();

    const hasTitle = lowerPitch.includes(titleLower);

    const hasTag = (topProject.tags || []).some((tag) =>
      lowerPitch.includes(tag.toLowerCase())
    );

    // Phrase from stated result: split into significant words (length >= 3)
    const metricWords = metricLower
      .split(/[^a-z0-9.]+/i)
      .filter((w) => w.length >= 3);
    const hasResultPhrase =
      metricWords.length > 0 &&
      metricWords.some((w) => lowerPitch.includes(w.toLowerCase()));

    if (!hasTitle && !(hasTag && hasResultPhrase)) {
      issues.push('Cite the matched project and its stated result');
    }
  }

  // 8. Screening questions answered
  if (
    extractedJob?.screening_questions &&
    extractedJob.screening_questions.length > 0
  ) {
    const requiredCount = extractedJob.screening_questions.length;
    let questionsPassed = true;

    if (!Array.isArray(screeningAnswers) || screeningAnswers.length < requiredCount) {
      questionsPassed = false;
    } else {
      for (let i = 0; i < requiredCount; i++) {
        const answer = (screeningAnswers[i] || '').trim();
        const ansWords = answer.split(/\s+/).filter(Boolean);

        // Must have at least 6 words
        if (ansWords.length < 6) {
          questionsPassed = false;
          break;
        }

        // Must appear in pitch text (fuzzy: at least half of answer's distinctive words)
        const distinctiveWords = ansWords
          .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''))
          .filter((w) => w.length >= 3);

        if (distinctiveWords.length > 0) {
          const matchedWords = distinctiveWords.filter((w) =>
            lowerPitch.includes(w)
          );
          const matchRatio = matchedWords.length / distinctiveWords.length;
          if (matchRatio < 0.5) {
            questionsPassed = false;
            break;
          }
        }
      }
    }

    if (!questionsPassed) {
      issues.push('Answer every screening question directly');
    }
  }

  // 9. Variation difference / similarity check
  if (otherVariation) {
    const sim = similarity(cleanPitch, otherVariation);
    if (sim > VARIATION_SIMILARITY_THRESHOLD) {
      issues.push('Variation B is too similar to Variation A');
    }
  }

  return issues;
}

/**
 * Validates a shortened proposal against the original text:
 * 1. Checks that the opening line is preserved.
 * 2. Ensures no banned buzzwords/fluff phrases are present.
 * 3. Confirms no new/invented numbers are introduced.
 */
export function validateShortenedProposal(
  originalText: string,
  shortenedText: string
): { isValid: boolean; reason?: string } {
  const cleanOriginal = sanitizePlainText(originalText);
  const cleanShortened = sanitizePlainText(shortenedText);

  if (!cleanShortened) {
    return { isValid: false, reason: 'Shortened proposal was empty.' };
  }

  // 1. Opening line check (must match original opening line)
  const origFirstLine = cleanOriginal.split('\n')[0]?.trim().toLowerCase() || '';
  const shortFirstLine = cleanShortened.split('\n')[0]?.trim().toLowerCase() || '';

  if (origFirstLine && shortFirstLine) {
    const normOrig = origFirstLine.replace(/[^a-z0-9]/g, '');
    const normShort = shortFirstLine.replace(/[^a-z0-9]/g, '');
    if (normOrig && normShort && !normShort.startsWith(normOrig) && !normOrig.startsWith(normShort)) {
      return { isValid: false, reason: 'Opening line was altered.' };
    }
  }

  // 2. Banned fluff check
  for (const phrase of BANNED_FLUFF_PHRASES) {
    const pattern = new RegExp(
      `\\b${escapeRegex(phrase).replace(/\\ /g, '\\s+')}\\b`,
      'i'
    );
    if (pattern.test(cleanShortened)) {
      return { isValid: false, reason: `Contained banned fluff: "${phrase}"` };
    }
  }

  // 3. No new numbers check
  const NUMBER_TOKEN_REGEX = /\b\d+(?:[.,]\d+)?\b/g;

  const digitConvertedOrig = convertWordNumbersToDigits(cleanOriginal);
  const origNumberMatches = digitConvertedOrig.match(NUMBER_TOKEN_REGEX) || [];
  const origNumberSet = new Set<string>();

  for (const num of origNumberMatches) {
    origNumberSet.add(num);
    origNumberSet.add(num.replace(/,/g, ''));
  }

  const digitConvertedShort = convertWordNumbersToDigits(cleanShortened);
  const shortNumberMatches = digitConvertedShort.match(NUMBER_TOKEN_REGEX) || [];

  for (const numStr of shortNumberMatches) {
    if (numStr === '3') continue; // Standard 3-minute Loom walkthrough allowed
    const cleanNum = numStr.replace(/,/g, '');
    if (!origNumberSet.has(numStr) && !origNumberSet.has(cleanNum)) {
      return { isValid: false, reason: `Introduced unverified number: "${numStr}"` };
    }
  }

  return { isValid: true };
}
