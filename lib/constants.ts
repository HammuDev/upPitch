export const SAMPLE_BRIEF = `Looking for an experienced Next.js developer to fix a broken Stripe webhook race condition and resolve an urgent database migration issue. Customers are experiencing duplicate billing records during concurrent checkout events. Need this resolved and cleanly tested in our staging environment within 24-48 hours.`;

export const SAMPLE_PROPOSAL_B = `Hi there,\n\nI reviewed your brief regarding the duplicate Stripe billing race condition. Having analyzed similar multi-tenant billing pipelines, this is typically caused by webhook concurrency without an atomic distributed lock.\n\n• Inspect: Audit PostgreSQL isolation level during concurrent webhook handling.\n• Implement: Redis-backed distributed lock with idempotent key verification.\n• Test: Run 100-event concurrent staging simulation.\n\nWould you be open to a 3-minute video breakdown of our reference architecture?\n\nBest regards,\n[Your Name]\n[Your Title]`;

export const SAMPLE_DETECTED_PROBLEMS = [
  'Stripe webhook race condition during concurrent checkouts',
  'Duplicate customer billing records in database',
  'Urgent 24-48h turnaround requirement in staging',
];
