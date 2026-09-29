import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: 'UpPitch | AI Upwork Proposal Generator for Freelancers',
  description:
    "Paste an Upwork job post and get two proposal drafts in seconds, each opening with the client's real problem and backed by your own portfolio proof.",
  authors: [{ name: 'Hammad' }],
  creator: 'UpPitch AI',
  publisher: 'UpPitch',
  metadataBase: new URL(siteConfig.siteUrl),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.siteUrl,
    title: 'UpPitch | AI Upwork Proposal Generator for Freelancers',
    description:
      "Paste an Upwork job post and get two proposal drafts in seconds, each opening with the client's real problem and backed by your own portfolio proof.",
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UpPitch | AI Upwork Proposal Generator for Freelancers',
    description:
      "Paste an Upwork job post and get two proposal drafts in seconds, each opening with the client's real problem and backed by your own portfolio proof.",
    creator: '@UpPitchAI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050811',
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': `${siteConfig.siteUrl}/#software`,
      name: 'UpPitch',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      description:
        'AI-powered freelance proposal generator and portfolio proof assistant for Upwork, LinkedIn, and cold email outreach.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      author: {
        '@type': 'Organization',
        name: 'UpPitch AI',
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.siteUrl}/#website`,
      url: siteConfig.siteUrl,
      name: 'UpPitch',
      description: 'AI Upwork Proposal Generator for Freelancers',
      publisher: {
        '@type': 'Organization',
        name: 'UpPitch',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${siteConfig.siteUrl}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does UpPitch work with proposals that stand out from generic AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Most AI tools generate robotic greetings like "Dear Hiring Manager, I am writing to express my enthusiasm...". UpPitch strictly eliminates all pleasantries and addresses the client\'s core technical problem and timeline in the very first sentence. It also integrates verified metrics and case studies directly from your personal Project Bank, establishing instant credibility.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is the first sentence so critical on Upwork and LinkedIn?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'On Upwork, clients only see the first 140 to 180 characters of your proposal in the search preview before deciding whether to open your bid or archive it. On LinkedIn and mobile email, notifications truncate after the first sentence. If you start with generic greetings, you lose 80% of your potential interview invitations before the client even reads your qualifications.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the Project Bank and Proof Matching system work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You add your completed projects, technical stack tags, and quantifiable results (e.g. "0.8s load time", "99.9% uptime", "zero webhook errors") to your Project Bank. When you paste a job posting, UpPitch matches your selected case studies directly to the client’s stated requirements and weaves them naturally into the proposal narrative.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I customize proposals for different platforms like Upwork, Cold Email, and LinkedIn?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! UpPitch provides 4 dedicated outreach modes: Upwork Proposals (structured, mobile-preview optimized), Cold Email (generates compelling subject lines + high-reply body), LinkedIn DMs (concise InMail format), and Twitter/X (direct and conversational).',
          },
        },
        {
          '@type': 'Question',
          name: 'How is my personal data and Gemini API key handled?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'UpPitch uses a browser-first architecture. Your profile information, project case studies, and proposal history are stored locally in your browser (localStorage). When generating a pitch, request details are sent to our server and forwarded directly to the Google Gemini API without database persistence.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between Variation A and Variation B?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Variation A focuses on a direct, problem-first technical fix with clear turnaround timelines (ideal for high-urgency or bug-fix jobs). Variation B provides a consultative architecture breakdown paired with a low-friction 3-minute Loom video teardown offer (ideal for high-budget, long-term contracts).',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <meta
          name="google-site-verification"
          content="mjomWrUet4rPeRB_Ix9DMdp9azi7MOjVB2YbnXmL0vg"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLdSchema).replace(/</g, '\\u003c'),
          }}
        />
      </head>
      <body className="min-h-screen bg-[#F8F9FE] text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-600">
        {children}
      </body>
    </html>
  );
}
