'use strict';
import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
      {/* Top Center Glow (Indigo/Violet) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-b from-indigo-600/20 via-violet-600/10 to-transparent blur-[120px] rounded-full animate-float-slow transform-gpu" />

      {/* Left Mid Glow (Cyan/Sky) */}
      <div className="absolute top-[40%] -left-48 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-600/15 via-indigo-600/15 to-transparent blur-[130px] rounded-full animate-float-reverse transform-gpu" />

      {/* Right Lower Glow (Violet/Purple) */}
      <div className="absolute top-[65%] -right-48 w-[600px] h-[600px] bg-gradient-to-bl from-violet-600/15 via-fuchsia-600/10 to-transparent blur-[140px] rounded-full animate-float-slow transform-gpu" />

      {/* Subtle Fine Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />
    </div>
  );
};
