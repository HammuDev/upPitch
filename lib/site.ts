export const siteConfig = {
  siteName: 'UpPitch',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://uppitch.vercel.app',
  feedbackEmail: process.env.NEXT_PUBLIC_FEEDBACK_EMAIL?.trim() || null,
  social: {
    github: 'https://github.com/HammuDev/upPitch' as string | null,
    twitter: process.env.NEXT_PUBLIC_TWITTER_HANDLE
      ? `https://x.com/${process.env.NEXT_PUBLIC_TWITTER_HANDLE.replace(/^@/, '')}`
      : null,
    linkedin: null as string | null,
    upwork: null as string | null,
  },
};
