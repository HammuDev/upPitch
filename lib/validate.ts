import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string().min(1).max(64),
  title: z.string().min(1).max(120),
  metricOrLink: z.string().max(200).default(''),
  tags: z.array(z.string().min(1).max(40)).max(10).default([]),
  link: z.string().max(300).optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  role: z.string().max(150).default(''),
  bio: z.string().max(1500).default(''),
  experience: z.string().max(300).optional().default(''),
  defaultCta: z.string().max(300).optional().default(''),
  projects: z.array(projectSchema).max(10).default([]),
});

export const generatePitchSchema = z.object({
  jobText: z.string().trim().min(40).max(8000),
  profile: profileSchema,
  selectedProjects: z.array(projectSchema).max(10).default([]),
  channel: z.enum(['upwork', 'cold-email', 'linkedin', 'twitter']).default('upwork'),
  tone: z.enum(['direct', 'consultative', 'casual']).default('direct'),
  apiKey: z.string().max(200).optional(),
});

// Lenient schemas for localStorage persistence & backward compatibility
export const storedProjectSchema = z.object({
  id: z.string().default(() => 'proj-' + Math.random().toString(36).slice(2, 9)),
  title: z.string().default('Untitled Project'),
  metricOrLink: z.string().default(''),
  tags: z.array(z.string()).default([]),
  link: z.string().optional(),
});

export const storedProfileSchema = z.object({
  name: z.string().default(''),
  role: z.string().default(''),
  bio: z.string().default(''),
  experience: z.string().optional().default(''),
  defaultCta: z.string().optional().default(''),
  projects: z.array(storedProjectSchema).default([]),
});

export const storedHistoryItemSchema = z.object({
  id: z.string().default(() => 'hist-' + Date.now()),
  timestamp: z.string().default(''),
  channel: z.enum(['upwork', 'cold-email', 'linkedin', 'twitter']).default('upwork'),
  tone: z.enum(['direct', 'consultative', 'casual']).default('direct'),
  variationName: z.string().default('Variation A (Direct)'),
  pitchText: z.string().default(''),
  jobSnippet: z.string().default(''),
  pitchTextB: z.string().optional(),
  subjectLine: z.string().optional(),
  createdAt: z.string().optional(),
});

export const storedHistorySchema = z.array(storedHistoryItemSchema);

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type GeneratePitchInput = z.infer<typeof generatePitchSchema>;
