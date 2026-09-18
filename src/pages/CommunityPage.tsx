import React, { useState } from 'react';
import { PageContainer, SectionHeader, DossierCard, Tag, PhotoFrame, MetricBlock, type TagVariant } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { Link } from '../router';
import { RotateCw, KeyRound, ArrowRight, Sparkles } from 'lucide-react';

interface LoopStage {
  step: string;
  verb: string;
  subtitle: string;
  summary: string;
  labAction: string;
  deliverable: string;
}

const ecosystemLoop: LoopStage[] = [
  {
    step: 'PHASE 01',
    verb: 'LEARN',
    subtitle: 'First Principles & Paper Deconstruction',
    summary: 'Line-by-line deconstruction of primary research papers (Paxos, seL4, FlashAttention) on physical whiteboards.',
    labAction: 'Deriving state transitions and algorithmic bounds directly from academic preprints.',
    deliverable: 'Annotated paper notes, formal math verification, minimal toy implementations.',
  },
  {
    step: 'PHASE 02',
    verb: 'BUILD',
    subtitle: 'Bare Metal & Physical Prototyping',
    summary: 'Translating theory into routed multi-layer copper traces, SMT component assembly, and microkernel C.',
    labAction: 'Hands-on workbench bring-ups using solder stations, oscilloscopes, and logic analyzers.',
    deliverable: 'Physical PCBs, functional kernel images, reproducible benchmark suites.',
  },
  {
    step: 'PHASE 03',
    verb: 'CONTRIBUTE',
    subtitle: 'Brutally Honest Peer Review',
    summary: 'Every pull request and schematic is inspected by peers for memory safety, cache locality, and thermal limits.',
    labAction: 'Live code review rounds where architecture choices are defended with empirical profiling data.',
    deliverable: 'Clean Git histories, documented failure modes, upstream patches.',
  },
  {
    step: 'PHASE 04',
    verb: 'GROW',
    subtitle: 'Architectural Mastery & Mentorship',
    summary: 'Students evolve from consumers to creators, guiding junior peers through their first PCB or compiler bring-up.',
    labAction: 'Late-night pair-programming and hardware debugging in the workbench lab.',
    deliverable: 'Deep layer N-1 intuition, independent engineering leadership.',
  },
  {
    step: 'PHASE 05',
    verb: 'COMMUNITY',
    subtitle: 'The Living Interdisciplinary Sanctuary',
    summary: 'A self-sustaining student collective where embedded hackers and ML researchers sharpen each other.',
    labAction: 'Self-governed student collective preserving open engineering craft across graduation cohorts.',
    deliverable: 'An enduring institution of student craftsmanship that survives graduation cycles.',
  },
];

const communityPhotos = [
  {
    label: 'Lab Workbench Alpha · 02:40 AM',
    caption: 'Late-night hardware bring-up session probing STM32 high-speed SPI bus with a 200MHz oscilloscope.',
    aspectRatio: '4/3' as const,
    src: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Whiteboard Derivation Salon',
    caption: 'Students decomposing FlashAttention-2 memory tiling and shared SRAM bank conflicts on the seminar room board.',
    aspectRatio: '4/3' as const,
    src: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Hardware Bench & Solder Station',
    caption: 'Active workbench covered in KiCad schematics, lead-free solder wire, wire strippers, and espresso cups.',
    aspectRatio: '4/3' as const,
    src: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?auto=format&fit=crop&w=1000&q=80',
  },
  {
    label: 'Weekend Prototyping Marathon',
    caption: 'Student teams collaborating across tables assembling a discrete 7400-series TTL 8-bit computer architecture.',
    aspectRatio: '4/3' as const,
    src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80',
  },
];

const workingGroups = [
  {
    name: 'Systems & Runtime Architecture',
    tag: 'SYSTEMS',
    variant: 'laurel' as TagVariant,
    accent: '#6B9080',
    lead: 'Dev P. & Arjun M.',
    meeting: 'Every Thursday · 20:00 IST',
    focus: 'Microkernels, lock-free queues, JIT bytecode virtual machines, zero-copy IPC.',
  },
  {
    name: 'Embedded Hardware & Silicon',
    tag: 'HARDWARE',
    variant: 'peach' as TagVariant,
    accent: '#F3C3B2',
    lead: 'Sneha T. & Rohan K.',
    meeting: 'Every Saturday · 14:00 IST',
    focus: '4-layer PCB design in KiCad, STM32 firmware, oscilloscope signal integrity, telemetry.',
  },
  {
    name: 'Applied Mathematics & Tensors',
    tag: 'INTELLIGENCE',
    variant: 'wisteria' as TagVariant,
    accent: '#C8B6FE',
    lead: 'Meera R. & Aditya N.',
    meeting: 'Every Tuesday · 19:30 IST',
    focus: 'Loss surface geometry, FlashAttention memory tiling, low-bit integer quantization.',
  },
  {
    name: 'Protocol Security & Verification',
    tag: 'SECURITY',
    variant: 'sky' as TagVariant,
    accent: '#A2D2FF',
    lead: 'Vikram S. & Tanya L.',
    meeting: 'Every Wednesday · 21:00 IST',
    focus: 'eBPF kernel packet monitoring, cryptographic key exchange audits, binary disassembly.',
  },
];

export const CommunityPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [selectedPhase, setSelectedPhase] = useState<number>(0);

  const activePhase = ecosystemLoop[selectedPhase];

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header */}
      <SectionHeader
        categoryTag="PEOPLE BUILDING TOGETHER"
        title="People Building Things Together."
        lead="Nobody at DETOX works in isolation. We are a student sanctuary where compiler developers sit beside robotics engineers and cryptography researchers, turning abstract theory into physical copper traces and running silicon."
      />

      {/* Factual Metrics Strip */}
      <div className="mb-16">
        <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-3 mb-6 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#235347] dark:text-[#99CDD8] font-semibold">Community Snapshot</span>
            <span className="text-zinc-500">· Real builder data across cohorts</span>
          </div>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Updated weekly</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricBlock
            value="48"
            label="Active Student Builders"
            detail="Committing code and assembling boards weekly"
          />
          <MetricBlock
            value="14"
            label="Hardware Prototypes Built"
            detail="From bare silicon bring-up to custom PCBs"
          />
          <MetricBlock
            value="08"
            label="Open Repositories Maintained"
            detail="Permissively licensed on GitHub under MIT/Apache"
          />
          <MetricBlock
            value="19"
            label="Internal Build Sprints Completed"
            detail="36-hour weekend marathons with zero slides"
          />
        </div>
      </div>

      {/* Real Community Photos Gallery */}
      <div className="mb-20">
        <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4 mb-8 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#235347] dark:text-[#38B2A2]" />
            <span className="text-zinc-950 dark:text-zinc-100 font-semibold font-display">In the Lab & on the Benches</span>
            <span className="text-zinc-500">· Visual moments from campus sessions</span>
          </div>
          <span className="text-zinc-500 text-xs">Campus Labs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {communityPhotos.map((photo, i) => (
            <PhotoFrame
              key={i}
              src={photo.src}
              label={photo.label}
              caption={photo.caption}
              aspectRatio={photo.aspectRatio}
            />
          ))}
        </div>
      </div>

      {/* The 5-Stage Ecosystem Loop (Compact & Visual) */}
      <div className="mb-20">
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-4 mb-8 text-xs gap-2">
          <div className="flex items-center gap-2">
            <RotateCw size={14} className="text-[#235347] dark:text-[#38B2A2] animate-spin" style={{ animationDuration: '14s' }} />
            <span className="text-zinc-950 dark:text-zinc-100 font-semibold font-display">The 5-Stage Cycle</span>
            <span className="text-zinc-500">· Learn → Build → Contribute → Grow → Community</span>
          </div>
          <span className="text-zinc-500 text-xs">Click any phase</span>
        </div>

        {/* Phase Stepper Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-6">
          {ecosystemLoop.map((stage, idx) => {
            const isSelected = selectedPhase === idx;
            return (
              <button
                key={stage.verb}
                onClick={() => setSelectedPhase(idx)}
                className={`p-3.5 rounded-xs border text-left transition-all duration-200 font-mono ${
                  isSelected
                    ? isLight
                      ? 'bg-[#faf8f5] border-[#235347] text-zinc-950 shadow-sm ring-1 ring-[#235347]/30'
                      : 'bg-[#14161a] border-[#38B2A2] text-white shadow-md ring-1 ring-[#38B2A2]/50'
                    : isLight
                      ? 'bg-[#edeae3] border-zinc-300/80 text-zinc-600 hover:border-zinc-400'
                      : 'bg-[#111215] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between text-[9px] text-zinc-500 mb-1">
                  <span>{stage.step}</span>
                  <span className="text-[#235347] dark:text-[#38B2A2] font-bold">0{idx + 1}</span>
                </div>
                <div className="text-base font-bold font-sans tracking-tight">
                  {stage.verb}
                </div>
                <div className="text-[10px] text-zinc-500 truncate mt-1">
                  {stage.subtitle.split('&')[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Phase Compact Card */}
        <DossierCard
          clipLabel={`${activePhase.step} · ${activePhase.verb}`}
          className="p-6 sm:p-7"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs text-[#235347] dark:text-[#99CDD8] font-bold uppercase tracking-wider">
                {activePhase.subtitle}
              </div>
              <h3 className={`text-xl sm:text-2xl font-bold font-sans ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
                {activePhase.verb}: Rigor at Layer N-1
              </h3>
              <p className={`font-sans text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                {activePhase.summary}
              </p>
            </div>

            <div
              className={`lg:col-span-5 p-4 rounded-xs border text-xs space-y-3 transition-colors duration-500 ${
                isLight ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-800' : 'bg-[#0e0f12] border-zinc-800 text-zinc-300'
              }`}
            >
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-1">
                  Lab Discipline
                </div>
                <p className="font-sans text-xs leading-relaxed">
                  {activePhase.labAction}
                </p>
              </div>

              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold border-b border-zinc-200 dark:border-zinc-800 pb-1 mb-1">
                  Deliverable Artifact
                </div>
                <p className="font-sans text-xs text-[#235347] dark:text-[#38B2A2] font-semibold leading-relaxed">
                  {activePhase.deliverable}
                </p>
              </div>
            </div>
          </div>
        </DossierCard>
      </div>

      {/* Active Working Groups Section */}
      <div className="mb-20">
        <div className="border-b border-zinc-200 dark:border-zinc-800/80 pb-4 mb-8 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="text-zinc-950 dark:text-zinc-100 font-semibold font-display">Active Working Groups</span>
            <span className="text-zinc-500">· Organized & run by student leads</span>
          </div>
          <span className="text-zinc-500 text-xs">Open benches weekly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {workingGroups.map((wg) => (
            <DossierCard
              key={wg.name}
              className="p-6 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800/80 pb-3 mb-4 text-xs text-zinc-500">
                <Tag label={wg.tag} variant={wg.variant} />
                <span className="text-[11px] font-mono text-zinc-500">{wg.meeting}</span>
              </div>

              <h3 className={`text-lg sm:text-xl font-bold font-sans mb-2 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
                {wg.name}
              </h3>

              <p className={`font-sans text-xs sm:text-sm leading-relaxed mb-4 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                {wg.focus}
              </p>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span>Leads: {wg.lead}</span>
                <span className="font-semibold text-[11px]" style={{ color: wg.accent }}>Open benches</span>
              </div>
            </DossierCard>
          ))}
        </div>
      </div>

      {/* Entry into Members Ecosystem Banner */}
      <div
        className={`p-8 rounded-xs border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors duration-500 ${
          isLight
            ? 'bg-[#faf8f5] border-zinc-300 text-zinc-900 shadow-sm'
            : 'bg-[#14161a] border-zinc-800 text-zinc-200'
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#235347] dark:text-[#99CDD8] font-semibold uppercase tracking-wider">
            <KeyRound size={14} />
            <span>Internal Members Platform</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold font-sans">
            Ready to pull a bench and build with DETOX?
          </h4>
          <p className={`font-sans text-xs sm:text-sm max-w-xl ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Explore member project tracking, bench bookings, reading salon archives, and working group repos.
          </p>
        </div>

        <Link
          to="/members"
          className="px-5 py-2.5 bg-[#163B32] hover:bg-[#235347] dark:bg-[#38B2A2] dark:hover:bg-[#4ecdc4] text-white dark:text-zinc-950 font-mono text-xs font-bold rounded-xs tracking-wider transition-colors shrink-0 flex items-center gap-2"
        >
          <span>ENTER MEMBERS PORTAL</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </PageContainer>
  );
};
