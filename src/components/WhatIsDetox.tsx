import React from 'react';
import { Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export const WhatIsDetox: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <section
      id="about"
      className={`relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 transition-colors duration-700 border-t border-b ${
        isLight
          ? 'bg-[#f4f1ea] border-zinc-300/80 text-zinc-800'
          : 'bg-[#0f1013] border-zinc-800/80 text-zinc-300'
      }`}
    >
      {/* Background mat grid continuity */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isLight ? 0.25 : 0.15,
          backgroundImage: isLight
            ? `
              linear-gradient(to right, rgba(30,35,45,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(30,35,45,0.08) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">

        {/* Technical Blueprint Header Block (Archival Drafting Sheet) */}
        <div
          className={`border p-6 sm:p-10 shadow-2xl relative rounded-xs transition-colors duration-700 ${
            isLight
              ? 'border-zinc-300 bg-[#faf8f5] shadow-zinc-300/50'
              : 'border-zinc-700 bg-[#14161a]'
          }`}
        >
          {/* Top Brass Binder Clip Graphic */}
          <div
            className={`absolute -top-3 left-12 w-24 h-6 rounded-t-sm shadow-md flex items-center justify-center font-mono text-[8px] transition-colors duration-700 ${
              isLight
                ? 'bg-[#d8d3c7] border border-zinc-400 text-zinc-700'
                : 'bg-[#2a2c33] border border-zinc-600 text-zinc-400'
            }`}
          >
            [ ARCHIVE SECURE ]
          </div>

          {/* Document Telemetry Strip */}
          <div
            className={`flex flex-wrap items-center justify-between border-b pb-4 mb-8 font-mono text-[10px] gap-4 transition-colors duration-700 ${
              isLight ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-[#d84315] font-bold">DOC: DTX-2026-001</span>
              <span>//</span>
              <span className={isLight ? 'text-zinc-900 font-semibold' : 'text-zinc-300 font-semibold'}>
                SUBJECT: SYSTEM IDENTITY
              </span>
            </div>
            <div className="flex items-center gap-4 text-[9px]">
              <span>CLEARANCE: OPEN-SOURCE</span>
              <span>STATUS: PRODUCTION</span>
              <span className="text-[#388e3c] font-semibold">REVISION 3.4 ACTIVE</span>
            </div>
          </div>

          {/* Section Question & Main Statement */}
          <div className="space-y-6">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#d84315] font-semibold">
              // 01. What is DETOX?
            </span>
            
            <h2
              className={`text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans leading-[1.15] transition-colors duration-700 ${
                isLight ? 'text-zinc-950' : 'text-zinc-100'
              }`}
            >
              DETOX is an engineering workbench where ideas are built from first principles.
            </h2>

            <div
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 font-sans text-sm sm:text-base leading-relaxed transition-colors duration-700 ${
                isLight ? 'text-zinc-700' : 'text-zinc-300'
              }`}
            >
              <div className="lg:col-span-7 space-y-4">
                <p>
                  Most student organizations are resume factories: endless slide decks, generic hackathon clones, and marketing buzzwords. They teach students how to consume APIs and talk about technology without ever understanding the underlying physics, operating system, or silicon.
                </p>
                <p className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>
                  <strong className={isLight ? 'text-zinc-900 font-semibold' : 'text-zinc-200 font-medium'}>
                    DETOX is the antidote.
                  </strong>{' '}
                  We are a student-led collective built around one physical truth:{' '}
                  <em className={isLight ? 'text-zinc-900 font-medium' : 'text-zinc-200'}>
                    if you don't understand how something works at layer N-1, you don't really know how it works.
                  </em>
                </p>
                <p className={isLight ? 'text-zinc-600' : 'text-zinc-400'}>
                  Here, compiler developers sit next to robotics designers, cryptography researchers debug alongside embedded firmware hackers, and ML engineers profile raw CUDA memory access.
                </p>
              </div>

              <div
                className={`lg:col-span-5 border p-5 rounded-xs space-y-4 font-mono text-xs transition-colors duration-700 ${
                  isLight
                    ? 'bg-[#f0ede5] border-zinc-300 shadow-inner'
                    : 'bg-[#0e0f12] border-zinc-800/90'
                }`}
              >
                <div
                  className={`font-semibold border-b pb-2 flex items-center justify-between transition-colors duration-700 ${
                    isLight ? 'text-zinc-700 border-zinc-300' : 'text-zinc-400 border-zinc-800'
                  }`}
                >
                  <span>COLLECTIVE MANIFEST</span>
                  <span className="text-[#d84315] text-[10px]">VERIFIED 2026</span>
                </div>
                
                <div className={`space-y-3 text-[11px] ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                  <div className="flex items-start gap-2.5">
                    <Terminal size={14} className="text-[#d84315] shrink-0 mt-0.5" />
                    <div>
                      <strong className={`block ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>Zero Slop Policy</strong>
                      <span>No hollow vaporware. We evaluate people and projects strictly by running code and functional hardware.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Cpu size={14} className="text-[#388e3c] shrink-0 mt-0.5" />
                    <div>
                      <strong className={`block ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>Physical & Computational Depth</strong>
                      <span>From solder irons and logic analyzers to compiler IR and distributed consensus protocols.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <ShieldCheck size={14} className="text-[#1976d2] shrink-0 mt-0.5" />
                    <div>
                      <strong className={`block ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>Peer Craftsmanship</strong>
                      <span>Rigorous code reviews, transparent schematics, and open-source releases for the global engineering community.</span>
                    </div>
                  </div>
                </div>

                {/* Stamped Footer on Document */}
                <div
                  className={`pt-2 border-t text-[9px] flex justify-between transition-colors duration-700 ${
                    isLight ? 'border-zinc-300 text-zinc-500' : 'border-zinc-800 text-zinc-500'
                  }`}
                >
                  <span>FACILITY: HARDWARE + SYSTEMS LAB</span>
                  <span>OPEN TO ALL STUDENTS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stamp */}
          <div
            className={`mt-8 pt-4 border-t flex flex-wrap items-center justify-between font-mono text-[9px] gap-2 transition-colors duration-700 ${
              isLight ? 'border-zinc-300 text-zinc-500' : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <div>DETOX PROTOCOL // ESTABLISHED BY STUDENTS // OPERATED BY STUDENTS</div>
            <div className={`font-semibold ${isLight ? 'text-zinc-800' : 'text-zinc-400'}`}>“THINGS ARE MADE HERE.”</div>
          </div>

        </div>

      </div>
    </section>
  );
};
