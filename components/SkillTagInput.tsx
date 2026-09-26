'use strict';
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';

export const COMPREHENSIVE_SKILLS: string[] = [
  // J skills (for exact user example)
  'JavaScript',
  'Java',
  'JSON',
  'JWT (JSON Web Tokens)',
  'Jest',
  'Jira',
  'Jenkins',
  'jQuery',
  'Julia',
  'Jupyter Notebook',
  'JUnit',
  'JOOQ',

  // Frontend & Frameworks
  'React',
  'Next.js',
  'TypeScript',
  'Tailwind CSS',
  'Vue.js',
  'Nuxt.js',
  'Angular',
  'Svelte',
  'SvelteKit',
  'Remix',
  'Astro',
  'HTML5',
  'CSS3',
  'Sass / SCSS',
  'Framer Motion',
  'Shadcn UI',
  'Radix UI',
  'Redux Toolkit',
  'Zustand',
  'React Query (TanStack)',
  'Responsive Design',

  // Backend & APIs
  'Node.js',
  'Express.js',
  'NestJS',
  'Python',
  'Django',
  'FastAPI',
  'Flask',
  'Go (Golang)',
  'Rust',
  'C#',
  'ASP.NET Core',
  'PHP',
  'Laravel',
  'Ruby on Rails',
  'GraphQL',
  'REST APIs',
  'tRPC',
  'WebSockets',
  'gRPC',
  'Microservices',

  // Databases & Storage
  'PostgreSQL',
  'MongoDB',
  'MySQL',
  'Redis',
  'Prisma ORM',
  'Drizzle ORM',
  'Supabase',
  'Firebase',
  'SQLite',
  'DynamoDB',
  'Elasticsearch',
  'Vector DB (Pinecone/Chroma)',

  // Cloud, DevOps & Infra
  'Docker',
  'Kubernetes',
  'AWS (Amazon Web Services)',
  'Google Cloud (GCP)',
  'Microsoft Azure',
  'Vercel',
  'Cloudflare',
  'Linux',
  'CI / CD Pipelines',
  'GitHub Actions',
  'Terraform',
  'Nginx',

  // Payments & Integrations
  'Stripe',
  'Stripe Webhooks',
  'PayPal',
  'Lemon Squeezy',
  'OAuth 2.0',
  'NextAuth / Auth.js',
  'Clerk Auth',
  'Resend',
  'Twilio',
  'SendGrid',

  // AI & Machine Learning
  'Google Gemini API',
  'OpenAI API',
  'Anthropic Claude API',
  'LangChain',
  'LlamaIndex',
  'PyTorch',
  'TensorFlow',
  'Prompt Engineering',
  'Computer Vision',
  'NLP',

  // Testing & Tools
  'Playwright',
  'Cypress',
  'Vitest',
  'Git',
  'GitHub',
  'GitLab',
  'Vite',
  'Webpack',
  'Postman',
  'Figma',
  'UI / UX Design',
];

interface SkillTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const SkillTagInput: React.FC<SkillTagInputProps> = React.memo(({
  tags,
  onChange,
  placeholder = 'Type letter or skill (e.g. j, react, python)...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter skills based on current input text
  const query = inputValue.trim().toLowerCase();
  const suggestions = query
    ? COMPREHENSIVE_SKILLS.filter(
        (skill) =>
          skill.toLowerCase().includes(query) &&
          !tags.some((t) => t.toLowerCase() === skill.toLowerCase())
      ).slice(0, 10)
    : [];

  // Popular / Quick pick skills
  const popularSkills = [
    'JavaScript',
    'TypeScript',
    'Next.js',
    'React',
    'Tailwind CSS',
    'Node.js',
    'PostgreSQL',
    'Stripe',
    'Python',
    'Docker',
  ].filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tagToAdd: string) => {
    const cleanTag = tagToAdd.trim();
    if (!cleanTag) return;
    if (!tags.some((t) => t.toLowerCase() === cleanTag.toLowerCase())) {
      onChange([...tags, cleanTag]);
    }
    setInputValue('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (suggestions.length > 0 && query.length > 0) {
        // If there's an exact or top suggestion, add that
        addTag(suggestions[0]);
      } else if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      {/* Container Box with active tag pills + text input */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="cursor-text min-h-[42px] w-full rounded-xl border border-white/[0.08] bg-[#070A14] p-2 flex flex-wrap items-center gap-1.5 focus-within:border-indigo-500/80 transition-colors"
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 text-xs font-semibold text-indigo-200 animate-slide-fade transition-transform hover:scale-105"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="cursor-pointer text-indigo-300/70 hover:text-white transition-colors ml-0.5 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : 'Add more skills...'}
          className="cursor-text flex-1 min-w-[140px] bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none px-1.5 py-1"
        />
      </div>

      {/* Autocomplete Dropdown Menu */}
      {isOpen && query.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl border border-white/[0.1] bg-[#0E1528] p-1.5 shadow-2xl space-y-1 max-h-56 overflow-y-auto animate-slide-fade backdrop-blur-md">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between">
            <span>Matching Skills ({suggestions.length})</span>
            <span className="text-indigo-400">Press Enter or click</span>
          </div>

          {suggestions.length === 0 ? (
            <div className="p-2 text-center text-xs text-slate-400">
              <span>No exact match. Press </span>
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="cursor-pointer font-bold text-indigo-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Add &quot;{inputValue}&quot;</span>
                <Plus className="h-3 w-3" />
              </button>
            </div>
          ) : (
            suggestions.map((skill) => {
              // Highlight matching letters
              const lowerSkill = skill.toLowerCase();
              const matchIdx = lowerSkill.indexOf(query);
              const before = skill.slice(0, matchIdx);
              const match = skill.slice(matchIdx, matchIdx + query.length);
              const after = skill.slice(matchIdx + query.length);

              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addTag(skill)}
                  className="cursor-pointer w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs text-slate-200 hover:bg-indigo-600 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 group-hover:bg-white" />
                    <span>
                      {before}
                      <span className="font-extrabold text-indigo-300 group-hover:text-white underline decoration-indigo-400">
                        {match}
                      </span>
                      {after}
                    </span>
                  </div>
                  <Plus className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Popular Skills Quick-Pills (when input is empty or focused) */}
      <div className="pt-1">
        <div className="flex items-center gap-1 text-[10.5px] font-medium text-slate-400 mb-1.5">
          <Sparkles className="h-3 w-3 text-indigo-400" />
          <span>Popular suggestions:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {popularSkills.slice(0, 8).map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addTag(skill)}
              className="cursor-pointer inline-flex items-center gap-1 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-200 transition-all"
            >
              <Plus className="h-2.5 w-2.5 text-indigo-400" />
              <span>{skill}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

SkillTagInput.displayName = 'SkillTagInput';
