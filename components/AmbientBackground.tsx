'use strict';
import React, { memo } from 'react';

export const AmbientBackground: React.FC = memo(() => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none transform-gpu"
      aria-hidden="true"
    >
      {/* Top Header & Hero Static Radial Glow (Zero CPU/GPU Animation Overhead) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.05) 50%, transparent 80%)',
        }}
      />

      {/* Mid Left Subtle Accent (Static Gradient) */}
      <div
        className="absolute top-[40%] -left-32 w-[500px] h-[500px] opacity-40"
        style={{
          background:
            'radial-gradient(circle at center, rgba(6, 182, 212, 0.08), rgba(99, 102, 241, 0.03) 60%, transparent 80%)',
        }}
      />

      {/* Lower Right Subtle Accent (Static Gradient) */}
      <div
        className="absolute top-[70%] -right-32 w-[500px] h-[500px] opacity-40"
        style={{
          background:
            'radial-gradient(circle at center, rgba(139, 92, 246, 0.08), rgba(217, 70, 239, 0.02) 60%, transparent 80%)',
        }}
      />

      {/* Subtle Grid Lines Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
    </div>
  );
});

AmbientBackground.displayName = 'AmbientBackground';
