import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UpPitch | Smart Proposals for Upwork & Outreach',
  description:
    'Generate winning Upwork proposals, freelance cover letters, and high-converting cold outreach pitches in 10 seconds. UpPitch matches your verified portfolio proof directly against client technical bottlenecks with zero generic AI fluff.',
  keywords: [
    'UpPitch',
    'Upwork proposal generator',
    'AI proposal writer for freelancers',
    'Upwork cover letter AI',
    'freelance proposal generator',
    'cold email pitch generator',
    'freelancer portfolio proof assistant',
    'high converting Upwork proposals',
    'freelance bidding tool',
    'AI freelance proposal writer',
    'LinkedIn InMail pitch generator',
    'Upwork pitch assistant',
    'freelance client outreach tool',
  ],
  authors: [{ name: 'Hammad' }],
  creator: 'UpPitch AI',
  publisher: 'UpPitch',
  metadataBase: new URL('https://uppitch.ai'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://uppitch.ai',
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
    url: 'https://uppitch.ai',
    title: 'UpPitch | Smart Proposals for Upwork & Outreach',
    description:
      'Turn client job postings into high-converting pitches in 10s with real-time Gemini AI matching and proof project ranking.',
    siteName: 'UpPitch',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UpPitch | Smart Proposals for Upwork & Outreach',
    description:
      'Generate high-converting freelance proposals and cold outreach pitches backed by your real project proof.',
    creator: '@UpPitchAI',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050811',
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://uppitch.ai/#software',
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
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '1480',
        bestRating: '5',
        worstRating: '1',
      },
      author: {
        '@type': 'Organization',
        name: 'UpPitch AI',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://uppitch.ai/#website',
      url: 'https://uppitch.ai',
      name: 'UpPitch',
      description: 'The #1 AI Proposal Writer & Portfolio Matching Engine for Freelancers',
      publisher: {
        '@type': 'Organization',
        name: 'UpPitch',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://uppitch.ai/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does UpPitch write proposals that stand out from generic AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'UpPitch analyzes the client\'s exact technical problem in the job post and addresses it in the very first sentence. It injects verified case studies and quantifiable metrics from your project bank with zero robotic template fluff.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I generate proposals for Upwork, Cold Email, and LinkedIn?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! UpPitch provides custom formatting and character-optimized output for Upwork cover letters, cold email outreach (including subject lines), LinkedIn DMs, and Twitter/X messages.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the Project Bank proof ranking work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You add your completed client projects with verified metrics. UpPitch dynamically selects and injects relevant proof into the proposal so clients see immediate evidence of your ability to solve their problem.',
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#F8F9FE] text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-600">
        {children}
      </body>
    </html>
  );
}
