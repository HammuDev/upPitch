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

export type ProjectInput = z.infer<typeof projectSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type GeneratePitchInput = z.infer<typeof generatePitchSchema>;
