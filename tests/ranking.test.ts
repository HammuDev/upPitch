import { describe, it, expect } from 'vitest';
import { rankProof } from '@/lib/generate';
import { ExtractedJob } from '@/lib/prompts';
import { ProjectItem } from '@/types';

describe('lib/generate.ts - rankProof', () => {
  const mockExtractedJob: ExtractedJob = {
    core_problem: 'Migrate legacy Vue app to Next.js with Tailwind CSS',
    tech_stack: ['Next.js', 'Tailwind', 'TypeScript', 'React'],
    deliverables: ['Responsive design', 'Server components migration'],
    urgency: 'normal',
    deadline: null,
    budget: null,
    screening_questions: [],
    required_opening: null,
    other_application_instructions: [],
    red_flags: [],
  };

  const projectNextJs: ProjectItem = {
    id: 'p1',
    title: 'Enterprise Next.js SaaS Platform',
    metricOrLink: '0.8s load time',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
  };

  const projectPython: ProjectItem = {
    id: 'p2',
    title: 'Python Data Pipeline',
    metricOrLink: '10k events/sec',
    tags: ['Python', 'Pandas', 'AWS S3'],
  };

  it('ranks project with matching tags first and gives reasons', () => {
    const jobText = 'Looking for an expert to rebuild our web frontend in Next.js and Tailwind CSS.';
    const ranked = rankProof([projectPython, projectNextJs], mockExtractedJob, jobText);

    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0].project.id).toBe('p1');
    expect(ranked[0].matchedBecause.length).toBeGreaterThan(0);
  });

  it('returns empty array if no projects provided', () => {
    const ranked = rankProof([], mockExtractedJob, 'Job text');
    expect(ranked).toEqual([]);
  });

  it('does NOT match 2-character tag "Go" against free prose words like "good" or "going"', () => {
    const projectGo: ProjectItem = {
      id: 'p-go',
      title: 'High Concurrency Microservice',
      metricOrLink: '50k rps',
      tags: ['Go', 'gRPC'],
    };

    const extractedJobNoGo: ExtractedJob = {
      core_problem: 'Looking for a developer to have a good time going through Python scripts',
      tech_stack: ['Python', 'Django'],
      deliverables: ['Fix bugs'],
      urgency: 'normal',
      deadline: null,
      budget: null,
      screening_questions: [],
      required_opening: null,
      other_application_instructions: [],
      red_flags: [],
    };

    const jobText = 'We are going to have a good rollout with our Python backend team.';
    const ranked = rankProof([projectGo], extractedJobNoGo, jobText);
    expect(ranked).toEqual([]);
  });

  it('matches 2-character tag "Go" when explicitly present in tech_stack or deliverables', () => {
    const projectGo: ProjectItem = {
      id: 'p-go',
      title: 'High Concurrency Microservice',
      metricOrLink: '50k rps',
      tags: ['Go'],
    };

    const extractedJobWithGo: ExtractedJob = {
      core_problem: 'Build backend microservices in Go',
      tech_stack: ['Go', 'PostgreSQL'],
      deliverables: ['API endpoint'],
      urgency: 'normal',
      deadline: null,
      budget: null,
      screening_questions: [],
      required_opening: null,
      other_application_instructions: [],
      red_flags: [],
    };

    const ranked = rankProof([projectGo], extractedJobWithGo, 'Backend engineer in Go');
    expect(ranked.length).toBe(1);
    expect(ranked[0].project.id).toBe('p-go');
  });

  it('ignores 1-character tags like "R" and does not match "React"', () => {
    const projectR: ProjectItem = {
      id: 'p-r',
      title: 'Statistical Modeling Analysis',
      metricOrLink: 'p < 0.01 significance',
      tags: ['R', 'Statistics'],
    };

    const extractedJobReact: ExtractedJob = {
      core_problem: 'Build React UI components',
      tech_stack: ['React', 'CSS'],
      deliverables: ['Design implementation'],
      urgency: 'normal',
      deadline: null,
      budget: null,
      screening_questions: [],
      required_opening: null,
      other_application_instructions: [],
      red_flags: [],
    };

    const ranked = rankProof([projectR], extractedJobReact, 'Need React frontend developer');
    expect(ranked).toEqual([]);
  });

  it('does not match any project when tech_stack contains empty strings or whitespace', () => {
    const projectAny: ProjectItem = {
      id: 'p-any',
      title: 'Any Project',
      metricOrLink: '100% uptime',
      tags: ['Java', 'Spring'],
    };

    const extractedJobEmpty: ExtractedJob = {
      core_problem: 'General consulting',
      tech_stack: ['', '   '],
      deliverables: [''],
      urgency: 'normal',
      deadline: null,
      budget: null,
      screening_questions: [],
      required_opening: null,
      other_application_instructions: [],
      red_flags: [],
    };

    const ranked = rankProof([projectAny], extractedJobEmpty, 'Need advice on server setup');
    expect(ranked).toEqual([]);
  });

  it('matches aliases correctly (postgres<->postgresql, nextjs<->next, k8s<->kubernetes, node<->nodejs, etc.)', () => {
    const projectPostgres: ProjectItem = {
      id: 'p-pg',
      title: 'PostgreSQL Database Optimization',
      metricOrLink: '0.8s query time',
      tags: ['PostgreSQL', 'k8s', 'node'],
    };

    const extractedJobAliases: ExtractedJob = {
      core_problem: 'Tune postgres queries and deploy on kubernetes with nodejs',
      tech_stack: ['postgres', 'kubernetes', 'nodejs'],
      deliverables: ['Config optimization'],
      urgency: 'normal',
      deadline: null,
      budget: null,
      screening_questions: [],
      required_opening: null,
      other_application_instructions: [],
      red_flags: [],
    };

    const ranked = rankProof([projectPostgres], extractedJobAliases, 'Job brief');
    expect(ranked.length).toBe(1);
    expect(ranked[0].matchedBecause).toEqual(expect.arrayContaining(['PostgreSQL', 'k8s', 'node']));
  });

  it('matches Docker when job tech_stack includes Docker', () => {
    const projectDocker: ProjectItem = {
      id: 'p-docker',
      title: 'Containerized CI Pipeline',
      metricOrLink: '3x build speedup',
      tags: ['Docker', 'GitHub Actions'],
    };

    const extractedJobDocker: ExtractedJob = {
      core_problem: 'Set up Docker containers and CI workflows',
      tech_stack: ['Docker', 'ghactions'],
      deliverables: ['Dockerfile', 'CI workflow'],
      urgency: 'normal',
      deadline: null,
      budget: null,
      screening_questions: [],
      required_opening: null,
      other_application_instructions: [],
      red_flags: [],
    };

    const ranked = rankProof([projectDocker], extractedJobDocker, 'Job brief with Docker');
    expect(ranked.length).toBe(1);
    expect(ranked[0].project.id).toBe('p-docker');
  });
});
