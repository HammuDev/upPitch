'use strict';
import React, { memo } from 'react';

export const AmbientBackground: React.FC = memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transform-gpu"
      aria-hidden="true"
    >
      {/* ========================================================== */}
      {/* 1. VIBRANT SILK LAVENDER / PURPLE GRADIENT AURA WAVES       */}
      {/* ========================================================== */}

      {/* Top-Right Radiant Lavender / Purple Wave Aura (Visible & Rich) */}
      <div
        className="absolute -top-16 right-0 w-[950px] h-[850px] rounded-full blur-[65px] opacity-85 animate-float-slow"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 75% 30%, rgba(192, 132, 252, 0.45) 0%, rgba(168, 85, 247, 0.35) 35%, rgba(129, 140, 248, 0.22) 65%, transparent 85%)',
        }}
      />

      {/* Top-Center Violet Ambient Glow behind Hero */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 w-[1050px] h-[650px] rounded-full blur-[80px] opacity-75 animate-float-reverse"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 35%, rgba(216, 180, 254, 0.35) 0%, rgba(147, 51, 234, 0.2) 45%, transparent 80%)',
        }}
      />

      {/* Left Sweeping Purple Wave Mesh (Mid-Section & Purpose-Built) */}
      <div
        className="absolute top-[28%] -left-36 w-[880px] h-[880px] rounded-full blur-[75px] opacity-75 animate-float-slow"
        style={{
          background:
            'radial-gradient(circle at center, rgba(168, 85, 247, 0.32) 0%, rgba(139, 92, 246, 0.22) 45%, rgba(99, 102, 241, 0.1) 70%, transparent 85%)',
        }}
      />

      {/* Right Sweeping Violet Wave Mesh (Comparison & Features) */}
      <div
        className="absolute top-[48%] -right-36 w-[850px] h-[850px] rounded-full blur-[80px] opacity-70 animate-float-reverse"
        style={{
          background:
            'radial-gradient(circle at center, rgba(147, 51, 234, 0.3) 0%, rgba(192, 132, 252, 0.2) 45%, transparent 80%)',
        }}
      />

      {/* Lower Left Purple Ambient Glow (Testimonials & FAQ) */}
      <div
        className="absolute top-[68%] -left-32 w-[900px] h-[900px] rounded-full blur-[80px] opacity-75 animate-float-slow"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.32) 0%, rgba(99, 102, 241, 0.18) 50%, transparent 80%)',
        }}
      />

      {/* Lower Right Soft Violet Glow */}
      <div
        className="absolute top-[84%] -right-28 w-[800px] h-[800px] rounded-full blur-[75px] opacity-70 animate-float-reverse"
        style={{
          background:
            'radial-gradient(circle at center, rgba(139, 92, 246, 0.28) 0%, rgba(217, 70, 239, 0.12) 50%, transparent 80%)',
        }}
      />

      {/* ========================================================== */}
      {/* 2. 3D FLOATING POLYHEDRAL CRYSTALS                         */}
      {/* ========================================================== */}

      {/* Mid-Page Left 3D Diamond Crystal */}
      <div className="absolute top-[34%] left-[3%] w-14 h-14 opacity-85 animate-float-slow hidden md:block">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_12px_24px_rgba(139,92,246,0.4)] -rotate-12">
          <polygon points="50,4 96,36 50,96 4,36" fill="url(#bgGem1)" fillOpacity="0.85" />
          <polygon points="50,4 96,36 50,52" fill="url(#bgGem2)" fillOpacity="0.95" />
          <polygon points="4,36 50,4 50,52" fill="url(#bgGem3)" fillOpacity="0.8" />
          <polygon points="50,52 96,36 50,96" fill="url(#bgGem4)" fillOpacity="0.9" />
        </svg>
      </div>

      {/* Mid-Page Right 3D Octahedron Crystal */}
      <div className="absolute top-[52%] right-[4%] w-16 h-16 opacity-80 animate-float-reverse hidden lg:block">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_14px_28px_rgba(124,58,237,0.4)] rotate-12">
          <polygon points="50,10 90,40 75,90 25,90 10,40" fill="url(#bgGem2)" fillOpacity="0.9" />
          <polygon points="50,10 90,40 50,55" fill="url(#bgGem1)" fillOpacity="0.95" />
          <polygon points="50,10 10,40 50,55" fill="url(#bgGem3)" fillOpacity="0.8" />
          <polygon points="10,40 25,90 50,55" fill="url(#bgGem4)" fillOpacity="0.9" />
        </svg>
      </div>

      {/* Lower Right 3D Glass Prism near Testimonials */}
      <div className="absolute top-[75%] right-[5%] w-14 h-14 opacity-80 animate-float-slow hidden md:block">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_12px_24px_rgba(168,85,247,0.35)] rotate-45">
          <polygon points="50,6 94,50 50,94 6,50" fill="url(#bgGem2)" fillOpacity="0.8" />
          <polygon points="50,6 94,50 50,50" fill="url(#bgGem1)" fillOpacity="0.9" />
          <polygon points="6,50 50,6 50,50" fill="url(#bgGem3)" fillOpacity="0.7" />
          <polygon points="50,50 94,50 50,94" fill="url(#bgGem4)" fillOpacity="0.85" />
        </svg>
      </div>

      {/* SVG Linear Gradient definitions */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="bgGem1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F5F3FF" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="bgGem2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
          <linearGradient id="bgGem3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="100%" stopColor="#6D28D9" />
          </linearGradient>
          <linearGradient id="bgGem4" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#4C1D95" />
          </linearGradient>
        </defs>
      </svg>

      {/* Subtle organic flowing wave contour lines */}
      <svg className="absolute inset-0 w-full h-full opacity-35 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M-100,220 C350,120 700,480 1300,180 C1700,0 2000,320 2300,160"
          fill="none"
          stroke="url(#bgGem2)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />
        <path
          d="M-100,880 C450,680 850,1100 1450,780 C1850,560 2100,920 2400,820"
          fill="none"
          stroke="url(#bgGem1)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        />
      </svg>
    </div>
  );
});

AmbientBackground.displayName = 'AmbientBackground';
