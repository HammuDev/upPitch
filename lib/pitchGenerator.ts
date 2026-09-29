import { FreelancerProfile, Channel, Tone, ProjectItem, GeneratedPitches } from '@/types';

export async function generatePitchWithGemini({
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
}): Promise<GeneratedPitches> {
  const jobDescription = jobText.trim();
  if (!jobDescription) {
    throw new Error('Please paste a job description first.');
  }

  const response = await fetch('/api/generate-pitch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jobText: jobDescription,
      profile,
      selectedProjects,
      channel,
      tone,
      apiKey:
        apiKey?.trim() ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('uppitch_api_key') || ''
          : ''),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMsg =
      data?.error || `Generation failed (Status ${response.status})`;
    throw new Error(errorMsg);
  }

  const matchedProjects: ProjectItem[] = Array.isArray(data.matchedProjects)
    ? data.matchedProjects
    : [];

  const primaryMatched: ProjectItem | undefined =
    data.matchedProject ||
    (matchedProjects.length > 0 ? matchedProjects[0] : undefined);

  return {
    'var-a': data.variationA,
    'var-b': data.variationB,
    subjectLine: data.subjectLine,
    detectedProblems:
      data.detectedProblems || ['Technical Requirements Analysis'],
    matchedProject: primaryMatched,
    matchedProjects,
    warnings: Array.isArray(data.warnings) ? data.warnings : undefined,
    gaps: Array.isArray(data.gaps) ? data.gaps : undefined,
  };
}
