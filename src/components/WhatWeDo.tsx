import React from 'react';
import { Hammer, BookOpen, GitBranch, Radio, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const activities = [
  {
    title: 'Hardware Sprints & Board Bring-Up',
    frequency: 'BI-WEEKLY // LAB 2',
    icon: Hammer,
    accent: '#f9a825',
    summary:
      'We turn schematics into physical hardware. Students learn KiCad layout, high-speed trace length matching, surface-mount soldering with hot air and solder paste, and bring-up debugging using digital oscilloscopes and logic analyzers.',
    output: 'Output: Physical PCBs, open Gerber files, and verified hardware testing suites.',
  },
  {
    title: 'Systems & Theory Paper Deconstruction',
    frequency: 'EVERY THURSDAY // 20:00 IST',
    icon: BookOpen,
    accent: '#d84315',
    summary:
      'We do not read slide summaries. We read original papers line-by-line (Lamport’s Paxos, seL4 verification, FlashAttention, Google Spanner, Attention Is All You Need) and reproduce core algorithms in minimal working code.',
    output: 'Output: Annotated paper summaries, benchmark implementations, and failure modes.',
  },
  {
    title: 'Open-Source Infrastructure & Tools',
    frequency: 'CONTINUOUS // ON GIT',
    icon: GitBranch,
    accent: '#388e3c',
    summary:
      'Everything built at DETOX that has broad utility is released to the public under permissive open-source licenses. We build lightweight benchmarking utilities, embedded drivers, memory debuggers, and networking tools.',
    output: 'Output: Well-documented, tested GitHub repositories with automated CI test runs.',
  },
  {
    title: 'Unhinged Weekend Builds',
    frequency: 'END-OF-MONTH // 36-HOUR LAB SESSIONS',
    icon: Radio,
    accent: '#1976d2',
    summary:
      'The raw spirit of student curiosity. From wire-wrapping a homebrew 8-bit TTL computer to tracking weather satellites with custom antennas, these are passion-driven, technically audacious builds done for the pure joy of engineering.',
    output: 'Output: Working prototypes, war stories, technical post-mortems, and shared pride.',
  },
];

export const WhatWeDo: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <section
      id="what-we-do"
      className={`relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 transition-colors duration-700 border-b ${
        isLight ? 'bg-[#ece9e2] border-zinc-300' : 'bg-[#0c0d10] border-zinc-800'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className={`border-b pb-6 mb-12 transition-colors duration-700 ${isLight ? 'border-zinc-300' : 'border-zinc-800'}`}>
          <div className="flex items-center gap-2 font-mono text-xs text-[#d84315] uppercase tracking-widest mb-2 font-semibold">
            <span>// 05. What We Actually Do</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans transition-colors duration-700 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
            The Living Workshop
          </h2>
          <p className={`mt-3 font-sans text-sm sm:text-base max-w-2xl transition-colors duration-700 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
            No empty talk. Here is how our time is physically spent across benches, terminals, and lab tables.
          </p>
        </div>

        {/* 2x2 Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activities.map((act, idx) => {
            const Icon = act.icon;

            return (
              <div
                key={idx}
                className={`border p-6 sm:p-8 rounded-xs transition-colors duration-200 flex flex-col justify-between group ${
                  isLight
                    ? 'bg-[#faf8f5] border-zinc-300 hover:border-zinc-500 shadow-xs'
                    : 'bg-[#131519] border-zinc-800/90 hover:border-zinc-600'
                }`}
              >
                <div>
                  <div
                    className={`flex items-center justify-between border-b pb-3 mb-4 font-mono text-[10px] transition-colors duration-700 ${
                      isLight ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <span className={`flex items-center gap-2 font-bold ${isLight ? 'text-zinc-800' : 'text-zinc-300'}`}>
                      <Icon size={14} style={{ color: act.accent }} />
                      <span className="tracking-wider">{act.frequency}</span>
                    </span>
                    <span className={isLight ? 'text-zinc-500 font-mono' : 'text-zinc-600 font-mono'}>0{idx + 1}</span>
                  </div>

                  <h3
                    className={`text-xl font-bold font-sans mb-3 transition-colors ${
                      isLight
                        ? 'text-zinc-900 group-hover:text-black'
                        : 'text-zinc-100 group-hover:text-white'
                    }`}
                  >
                    {act.title}
                  </h3>

                  <p className={`text-sm font-sans leading-relaxed mb-4 transition-colors ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    {act.summary}
                  </p>
                </div>

                <div
                  className={`pt-4 border-t font-mono text-[11px] flex items-center justify-between transition-colors duration-700 ${
                    isLight ? 'border-zinc-300 text-zinc-700' : 'border-zinc-800/80 text-zinc-300'
                  }`}
                >
                  <span className={`font-sans italic ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>{act.output}</span>
                  <ArrowUpRight
                    size={14}
                    className={`shrink-0 ml-2 transition-colors ${
                      isLight ? 'text-zinc-500 group-hover:text-black' : 'text-zinc-500 group-hover:text-white'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Concrete Invitation Callout */}
        <div
          className={`mt-12 p-6 sm:p-8 border rounded-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-colors duration-700 ${
            isLight
              ? 'bg-[#faf8f5] border-zinc-300 shadow-md'
              : 'bg-[#15171c] border-zinc-700/80'
          }`}
        >
          <div className="space-y-1">
            <div className="font-mono text-[10px] text-[#d84315] uppercase tracking-widest font-semibold">
              // OPEN BENCH POLICY
            </div>
            <h4 className={`text-lg sm:text-xl font-bold font-sans ${isLight ? 'text-zinc-950' : 'text-white'}`}>
              Have a project you genuinely want to build?
            </h4>
            <p className={`text-xs sm:text-sm font-sans max-w-xl ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              We welcome students, researchers, and institutions who are ready to put in the hours and build with technical honesty.
            </p>
          </div>

          <a
            href="#colophon"
            className={`px-5 py-2.5 font-mono text-xs font-bold rounded-xs tracking-wider transition-colors shrink-0 flex items-center gap-2 ${
              isLight
                ? 'bg-zinc-900 hover:bg-black text-white'
                : 'bg-zinc-200 hover:bg-white text-zinc-950'
            }`}
          >
            <span>JOIN THE WORKBENCH</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

      </div>
    </section>
  );
};
