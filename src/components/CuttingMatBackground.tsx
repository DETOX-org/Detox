import React from 'react';
import { useTheme } from '../ThemeContext';

export const CuttingMatBackground: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Base cutting mat surface layer (dark charcoal vs warm archival off-white) */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ease-in-out ${
          isLight ? 'bg-[#ece9e2]' : 'bg-[#111215]'
        }`}
      />

      {/* Subtle PVC matte texture & micro-noise (Dark mode) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${
          isLight ? 'opacity-0' : 'opacity-[0.035]'
        }`}
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Subtle PVC matte texture & micro-noise (Light mode) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ${
          isLight ? 'opacity-[0.04]' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `radial-gradient(#000000 1px, transparent 1px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Vignette lighting simulating overhead bench lamp (Dark mode) */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isLight ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          background: 'radial-gradient(ellipse 75% 65% at 50% 40%, rgba(32, 35, 42, 0.45) 0%, rgba(10, 11, 13, 0.85) 80%, #090a0c 100%)',
        }}
      />

      {/* Vignette lighting simulating overhead warm daylight lamp (Light mode) */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isLight ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(ellipse 75% 65% at 50% 40%, rgba(255, 255, 255, 0.6) 0%, rgba(232, 228, 220, 0.4) 75%, rgba(208, 204, 194, 0.75) 100%)',
        }}
      />

      {/* ============================================================ */}
      {/* 1. DARK MODE SVG GRID & TECHNICAL MARKINGS                    */}
      {/* ============================================================ */}
      <svg 
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
          isLight ? 'opacity-0' : 'opacity-65'
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="darkMinorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.035)" strokeWidth="0.75" />
          </pattern>

          <pattern id="darkMajorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#darkMinorGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <path d="M -4 0 L 4 0 M 0 -4 L 0 4" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
            <path d="M 96 0 L 104 0 M 100 -4 L 100 4" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
            <path d="M -4 100 L 4 100 M 0 96 L 0 104" stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" />
          </pattern>

          <pattern id="darkIsoGrid" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 200 200" stroke="rgba(255,255,255,0.015)" strokeWidth="0.75" strokeDasharray="3 6" fill="none" />
            <path d="M 200 0 L 0 200" stroke="rgba(255,255,255,0.015)" strokeWidth="0.75" strokeDasharray="3 6" fill="none" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#darkMajorGrid)" />
        <rect width="100%" height="100%" fill="url(#darkIsoGrid)" />

        <g stroke="rgba(255,255,255,0.04)" fill="none" strokeWidth="1">
          <circle cx="100" cy="100" r="140" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="280" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="420" strokeDasharray="4 8" />
          
          <line x1="100" y1="100" x2="600" y2="234" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 6" />
          <line x1="100" y1="100" x2="500" y2="331" stroke="rgba(255,255,255,0.05)" />
          <line x1="100" y1="100" x2="400" y2="400" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2" />
          <line x1="100" y1="100" x2="331" y2="500" stroke="rgba(255,255,255,0.05)" />
          <line x1="100" y1="100" x2="234" y2="600" stroke="rgba(255,255,255,0.04)" strokeDasharray="4 6" />
        </g>

        <g stroke="rgba(255,255,255,0.03)" fill="none" strokeWidth="1">
          <circle cx="95%" cy="85%" r="200" strokeDasharray="4 8" />
          <circle cx="95%" cy="85%" r="350" strokeDasharray="4 8" />
        </g>

        <g stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" fill="none">
          <path d="M 280 340 L 410 338 L 470 341" />
          <path d="M 640 180 L 638 310" />
          <path d="M 850 490 L 730 492" strokeWidth="0.6" />
          <path d="M 190 620 L 320 622 L 350 619" strokeWidth="0.5" />
        </g>
      </svg>

      {/* ============================================================ */}
      {/* 2. LIGHT MODE SVG GRID & TECHNICAL MARKINGS                   */}
      {/* ============================================================ */}
      <svg 
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
          isLight ? 'opacity-75' : 'opacity-0'
        }`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="lightMinorGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(30,35,45,0.05)" strokeWidth="0.75" />
          </pattern>

          <pattern id="lightMajorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#lightMinorGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(30,35,45,0.11)" strokeWidth="1" />
            <path d="M -4 0 L 4 0 M 0 -4 L 0 4" stroke="rgba(30,35,45,0.26)" strokeWidth="1" fill="none" />
            <path d="M 96 0 L 104 0 M 100 -4 L 100 4" stroke="rgba(30,35,45,0.26)" strokeWidth="1" fill="none" />
            <path d="M -4 100 L 4 100 M 0 96 L 0 104" stroke="rgba(30,35,45,0.26)" strokeWidth="1" fill="none" />
          </pattern>

          <pattern id="lightIsoGrid" width="200" height="200" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 200 200" stroke="rgba(30,35,45,0.035)" strokeWidth="0.75" strokeDasharray="3 6" fill="none" />
            <path d="M 200 0 L 0 200" stroke="rgba(30,35,45,0.035)" strokeWidth="0.75" strokeDasharray="3 6" fill="none" />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#lightMajorGrid)" />
        <rect width="100%" height="100%" fill="url(#lightIsoGrid)" />

        <g stroke="rgba(30,35,45,0.06)" fill="none" strokeWidth="1">
          <circle cx="100" cy="100" r="140" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="280" strokeDasharray="4 8" />
          <circle cx="100" cy="100" r="420" strokeDasharray="4 8" />
          
          <line x1="100" y1="100" x2="600" y2="234" stroke="rgba(30,35,45,0.06)" strokeDasharray="4 6" />
          <line x1="100" y1="100" x2="500" y2="331" stroke="rgba(30,35,45,0.08)" />
          <line x1="100" y1="100" x2="400" y2="400" stroke="rgba(30,35,45,0.11)" strokeWidth="1.2" />
          <line x1="100" y1="100" x2="331" y2="500" stroke="rgba(30,35,45,0.08)" />
          <line x1="100" y1="100" x2="234" y2="600" stroke="rgba(30,35,45,0.06)" strokeDasharray="4 6" />
        </g>

        <g stroke="rgba(30,35,45,0.05)" fill="none" strokeWidth="1">
          <circle cx="95%" cy="85%" r="200" strokeDasharray="4 8" />
          <circle cx="95%" cy="85%" r="350" strokeDasharray="4 8" />
        </g>

        {/* Subtle realistic knife score scratches */}
        <g stroke="rgba(30,35,45,0.05)" strokeWidth="0.8" fill="none">
          <path d="M 280 340 L 410 338 L 470 341" />
          <path d="M 640 180 L 638 310" />
          <path d="M 850 490 L 730 492" strokeWidth="0.6" />
          <path d="M 190 620 L 320 622 L 350 619" strokeWidth="0.5" />
        </g>
      </svg>

      {/* Top Precision Machinist Ruler (Metric mm) */}
      <div
        className={`absolute top-0 left-0 right-0 h-7 border-b flex items-center px-4 font-mono text-[9px] overflow-hidden transition-colors duration-700 ${
          isLight
            ? 'border-black/15 bg-[#dedcd4]/95 text-zinc-600'
            : 'border-white/10 bg-[#0d0e10]/95 text-zinc-500'
        }`}
      >
        <span className="text-[#d84315] font-semibold mr-3 tracking-widest text-[8px]">MM // SCALE 1:1</span>
        <div className="flex-1 flex justify-between tracking-tighter select-none opacity-75">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="flex items-end gap-1 relative">
              <span className={`font-mono text-[8px] ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-400'}`}>
                {(i * 5).toString().padStart(2, '0')}
              </span>
              <div className={`w-[1px] h-3 ${isLight ? 'bg-zinc-700' : 'bg-zinc-400'}`} />
              <div className="hidden sm:flex items-end gap-[3px]">
                <div className={`w-[1px] h-1.5 ${isLight ? 'bg-zinc-500' : 'bg-zinc-600'}`} />
                <div className={`w-[1px] h-1.5 ${isLight ? 'bg-zinc-500' : 'bg-zinc-600'}`} />
                <div className={`w-[1px] h-2 ${isLight ? 'bg-zinc-600' : 'bg-zinc-500'}`} />
                <div className={`w-[1px] h-1.5 ${isLight ? 'bg-zinc-500' : 'bg-zinc-600'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Left Precision Ruler (Imperial Inch) */}
      <div
        className={`absolute top-7 bottom-0 left-0 w-8 border-r flex flex-col justify-between py-4 items-center font-mono text-[8px] select-none transition-colors duration-700 ${
          isLight
            ? 'border-black/15 bg-[#dedcd4]/95 text-zinc-600'
            : 'border-white/10 bg-[#0d0e10]/95 text-zinc-500'
        }`}
      >
        <span className={`-rotate-90 origin-center text-[7px] tracking-widest whitespace-nowrap mt-4 ${isLight ? 'text-zinc-700 font-semibold' : 'text-zinc-400'}`}>
          INCH // 1/16"
        </span>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 w-full px-1">
            <span className={`font-mono text-[8px] ${isLight ? 'text-zinc-700 font-medium' : 'text-zinc-400'}`}>
              {(i * 2).toString().padStart(2, '0')}
            </span>
            <div className={`w-full h-[1px] ${isLight ? 'bg-zinc-600' : 'bg-zinc-500'}`} />
            <div className={`w-3/4 h-[1px] my-0.5 ${isLight ? 'bg-zinc-400' : 'bg-zinc-700'}`} />
          </div>
        ))}
      </div>

      {/* Mat Manufacturer Silk-screen Stamps (Teenage Engineering / Industrial aesthetic) */}
      <div
        className={`absolute top-12 left-14 font-mono text-[9px] tracking-wider space-y-1 select-none pointer-events-none border-l-2 pl-3 transition-colors duration-700 ${
          isLight ? 'border-zinc-400 text-zinc-600' : 'border-zinc-700 text-zinc-600'
        }`}
      >
        <div className={`font-semibold tracking-widest flex items-center gap-2 ${isLight ? 'text-zinc-800' : 'text-zinc-400'}`}>
          <span>DETOX ENGINEERING WORKBENCH</span>
          <span
            className={`px-1.5 py-0.2 text-[8px] rounded-xs font-mono ${
              isLight
                ? 'bg-[#f9a825]/15 text-[#9a6408] border border-[#f9a825]/40 font-bold'
                : 'bg-zinc-800 text-[#f9a825]'
            }`}
          >
            SPEC 001-A
          </span>
        </div>
        <div className={`text-[8px] ${isLight ? 'text-zinc-600 font-medium' : 'text-zinc-500'}`}>
          {isLight
            ? 'MAT: 5-PLY ESD-DISSIPATIVE SELF-HEALING ARCHIVAL // 900x600mm'
            : 'MAT: 5-PLY ESD-DISSIPATIVE SELF-HEALING GRAPHITE // 900x600mm'}
        </div>
        <div className={`text-[8px] ${isLight ? 'text-zinc-500' : 'text-zinc-600'}`}>
          TOLERANCE: ±0.05mm // MAX SURFACE LOAD: 250N/cm² // TEMP: 20°C - 24°C
        </div>
      </div>

      {/* Bottom-right Industrial Mat Warning & Angle Compass */}
      <div
        className={`absolute bottom-6 right-8 font-mono text-[9px] text-right select-none pointer-events-none hidden sm:block transition-colors duration-700 ${
          isLight ? 'text-zinc-600' : 'text-zinc-600'
        }`}
      >
        <div className={`font-semibold tracking-wider ${isLight ? 'text-zinc-700' : 'text-zinc-500'}`}>
          COORDINATES: X [00 - 120] // Y [00 - 80]
        </div>
        <div className={`text-[8px] mt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-600'}`}>
          CAUTION: HEAVY PROTOTYPING ZONE // ESD GROUNDS VERIFIED
        </div>
        <div className={`inline-flex items-center gap-2 mt-1 text-[8px] ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#388e3c] animate-pulse" />
          <span>EARTH GROUND: ACTIVE (1.2Ω)</span>
        </div>
      </div>
    </div>
  );
};
