import React from 'react';
import { CuttingMatBackground } from './CuttingMatBackground';
import { DetoxWordmark3D } from './DetoxWordmark3D';
import { WorkbenchArtifacts } from './WorkbenchArtifacts';
import { RoboticArm } from './RoboticArm';
import { ArrowDown } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface HeroSectionProps {
  onSelectArtifact: (artifactId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectArtifact }) => {
  const { mode, toggleMode } = useTheme();
  const isLight = mode === 'light';

  return (
    <section className="relative w-full h-[100svh] min-h-[640px] flex flex-col justify-between overflow-hidden">
      {/* 1. Procedural Cutting Mat Background */}
      <CuttingMatBackground />

      {/* 2. Layered Physical Workbench Artifacts (PCBs, C receipts, Attention math, etc.) */}
      <WorkbenchArtifacts onSelectArtifact={onSelectArtifact} />

      {/* 3. Physical Desktop Robotic Arm (Bottom-Left Quadrant) */}
      <RoboticArm />

      {/* Top Spacer to account for fixed navigation */}
      <div className="pt-20" />

      {/* 4. Centerpiece: Hovering 3D DETOX Wordmark */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pointer-events-none px-4">
        {/* The 3D Canvas with extrusion and soft shadow */}
        <DetoxWordmark3D mode={mode} className="w-full max-w-5xl" />

        {/* Supporting subtitle */}
        <div className="text-center mt-4 pointer-events-auto transition-colors duration-700 max-w-xl">
          <p
            className={`font-sans text-sm sm:text-base font-normal tracking-normal transition-colors duration-700 leading-relaxed ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}
          >
            A student engineering collective. Learning, building, and contributing from first principles.
          </p>
        </div>
      </div>

      {/* 5. Bottom Cue & Mode Switch */}
      <div className="relative z-20 pb-8 px-6 sm:px-12 flex items-end justify-between font-sans text-xs pointer-events-none select-none">
        
        {/* Left space reserved for the physical robotic arm */}
        <div className="hidden sm:block w-48" />

        {/* Center Scroll Prompt */}
        <a
          href="#explore"
          className={`pointer-events-auto mx-auto flex flex-col items-center gap-2 transition-all duration-300 group ${
            isLight ? 'text-zinc-600 hover:text-[#235347]' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <span className="text-[11px] font-medium tracking-wide">Scroll to explore</span>
          <ArrowDown size={14} className="animate-bounce group-hover:translate-y-0.5 transition-transform" />
        </a>

        {/* Right Scale / Mode Indicator */}
        <div
          onClick={toggleMode}
          className={`text-right hidden sm:flex items-center gap-2 transition-colors duration-300 pointer-events-auto cursor-pointer group py-1 px-2.5 rounded-full border ${
            isLight
              ? 'border-zinc-300 bg-white/70 text-zinc-700 hover:text-zinc-950'
              : 'border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:text-zinc-200'
          }`}
          title="Toggle Day/Night view"
        >
          <span className="w-2 h-2 rounded-full bg-[#235347]" />
          <span className="text-[11px] font-medium tracking-wide">
            {isLight ? 'Day Mode' : 'Night Mode'}
          </span>
        </div>

      </div>
    </section>
  );
};

