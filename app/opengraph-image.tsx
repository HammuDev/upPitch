import { ImageResponse } from 'next/og';

export const alt = 'UpPitch | AI Upwork Proposal Generator for Freelancers';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #050811 0%, #0F172A 50%, #1E1B4B 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '40px 60px',
          position: 'relative',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '25%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Brand Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(129, 140, 248, 0.3)',
            borderRadius: '9999px',
            padding: '8px 24px',
            marginBottom: '28px',
          }}
        >
          <span
            style={{
              color: '#818CF8',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            UpPitch • Proposal Engine
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '54px',
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-0.02em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <span>AI Upwork Proposal Generator</span>
          <span
            style={{
              background: 'linear-gradient(90deg, #818CF8 0%, #C084FC 100%)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Built on Real Project Proof
          </span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            color: '#94A3B8',
            textAlign: 'center',
            maxWidth: '850px',
            lineHeight: 1.4,
          }}
        >
          Generate problem-first bids in seconds with zero generic fluff. Backed by verified case studies.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
