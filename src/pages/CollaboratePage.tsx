import React, { useState } from 'react';
import { PageContainer, SectionHeader, DossierCard, Tag, type TagVariant } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { Building2, Users2, GraduationCap, Cpu, ArrowUpRight, Check, Hammer, Wrench, ShieldAlert } from 'lucide-react';

interface Track {
  id: string;
  name: string;
  tag: string;
  icon: React.ElementType;
  headline: string;
  accent: string;
  tagVariant: TagVariant;
  buildTogether: string[];
  detoxProvides: string[];
  whatWeExpect: string[];
  contactEmail: string;
}

const tracks: Track[] = [
  {
    id: 'organizations',
    name: 'Open Organizations & Foundations',
    tag: 'OPEN INFRASTRUCTURE',
    icon: Building2,
    headline: 'Hardening public developer tools and open protocols.',
    accent: '#38B2A2',
    tagVariant: 'teal',
    buildTogether: [
      'Stress-testing zero-copy eBPF socket telemetry in multi-node clusters',
      'Auditing cryptographic primitives for side-channel timing leaks',
      'Porting embedded HAL drivers to emerging RISC-V and ARM platforms',
    ],
    detoxProvides: [
      'Motivated student builders writing bare-metal tests and reproducible benchmarks',
      'Public pull requests directly merged into upstream open-source codebases',
      'Detailed bug reproduction logs and performance profiling traces',
    ],
    whatWeExpect: [
      'Permissive licensing (MIT / Apache 2.0 / BSD / CERN-OHL)',
      'Direct peer technical access to core maintainers (no PR intermediaries)',
      'Honest technical review on student pull requests',
    ],
    contactEmail: 'orgs@detox.build',
  },
  {
    id: 'communities',
    name: 'Student Communities & Hackerspaces',
    tag: 'PEER CRAFTSMANSHIP',
    icon: Users2,
    headline: 'Shared workbenches, joint hackathons, and tool libraries.',
    accent: '#FFB7C3',
    tagVariant: 'coral',
    buildTogether: [
      'Joint 36-hour unhinged hardware sprint building homebrew computing systems',
      'Cross-campus paper salons deconstructing distributed consensus and compilers',
      'Inter-lab tool sharing: sharing oscilloscopes, logic analyzers, and reflow ovens',
    ],
    detoxProvides: [
      'Open access to our workbench lab equipment, soldering stations, and scopes',
      'Curated reading deconstructions and paper study guides',
      'Sprint logistics frameworks and project tracking tools',
    ],
    whatWeExpect: [
      'Active physical building culture with zero commercial pitching',
      'Collaborative spirit and mutual respect on shared benches',
      'Open sharing of hardware schematics and code artifacts',
    ],
    contactEmail: 'communities@detox.build',
  },
  {
    id: 'institutions',
    name: 'Academic & Research Laboratories',
    tag: 'FIRST PRINCIPLES',
    icon: GraduationCap,
    headline: 'Reproducing seminal papers and testing novel hypotheses.',
    accent: '#C8B6FE',
    tagVariant: 'wisteria',
    buildTogether: [
      'Line-by-line reproduction and empirical benchmarking of systems papers',
      'Synthesizing experimental FPGA logic for novel network topologies',
      'Co-supervising student-driven research papers targeting top systems venues',
    ],
    detoxProvides: [
      'Undergraduate researchers eager to deconstruct theory and verify bounds',
      'Clean, reproducible benchmark suites and open-source artifact repositories',
      'Rapid prototype development in C, Rust, CUDA, and KiCad',
    ],
    whatWeExpect: [
      'Transparent research collaboration with student author attribution',
      'Open-access preprint publication commitments',
      'Rigorous mathematical and experimental feedback',
    ],
    contactEmail: 'labs@detox.build',
  },
  {
    id: 'industry',
    name: 'Hardware & Silicon Industry',
    tag: 'SILICON BRING-UP',
    icon: Cpu,
    headline: 'Real silicon bring-up and upstream driver bug discovery.',
    accent: '#F3C3B2',
    tagVariant: 'peach',
    buildTogether: [
      'Stress-testing engineering sample microcontrollers on robotic test benches',
      'Benchmarking custom edge-inference silicon against baseline CUDA kernels',
      'Direct peer code reviews between practicing engineers and student builders',
    ],
    detoxProvides: [
      'Rigorous edge-case silicon stress tests under harsh lab conditions',
      'Verified board bring-up schematics, test firmware, and bug reports',
      'Unvarnished technical evaluations based purely on measurement data',
    ],
    whatWeExpect: [
      'Hardware developer kits, evaluation boards, and uncrippled documentation',
      'Direct engineering Slack/Discord or email contact with silicon designers',
      'Zero sponsorship banners or marketing-booth recruitment setups',
    ],
    contactEmail: 'silicon@detox.build',
  },
];

export const CollaboratePage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [selectedTrack, setSelectedTrack] = useState<string>('organizations');

  const activeTrack = tracks.find((t) => t.id === selectedTrack) || tracks[0];

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header */}
      <SectionHeader
        categoryTag="Co-Building & Partnerships"
        title="Want to Build Something With Us?"
        lead="We are not looking for corporate sponsors to print logos on event t-shirts. We partner with organizations, hackerspaces, research labs, and silicon teams who want to build real systems, share physical equipment, and stress-test ideas with students."
      />

      {/* The 4 Collaborative Tracks */}
      <div className="mb-20">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8 flex flex-wrap items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-2">
            <span className="text-zinc-950 dark:text-zinc-100 font-semibold font-display">Collaboration Tracks</span>
            <span className="text-zinc-500">· Four direct avenues for co-building</span>
          </div>
          <span className="text-zinc-500 text-xs">Open for 2026</span>
        </div>

        {/* Track Selectors */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {tracks.map((track) => {
            const isSelected = track.id === selectedTrack;
            const Icon = track.icon;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track.id)}
                className={`p-4 rounded-xs border text-left transition-all duration-200 ${
                  isSelected
                    ? isLight
                      ? 'bg-[#faf8f5] text-zinc-950 shadow-sm ring-1'
                      : 'bg-[#14161a] text-white shadow-md ring-1'
                    : isLight
                      ? 'bg-[#edeae3] border-zinc-300/80 text-zinc-600 hover:border-zinc-400'
                      : 'bg-[#111215] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                }`}
                style={{
                  borderColor: isSelected ? track.accent : undefined,
                }}
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
                  <span className="font-semibold" style={{ color: track.accent }}>{track.tag}</span>
                  <Icon size={14} style={{ color: isSelected ? track.accent : undefined }} />
                </div>
                <div className="font-display font-bold text-sm tracking-tight">
                  {track.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Track Specification */}
        <DossierCard clipLabel={activeTrack.tag} className="p-6 sm:p-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3 text-xs text-zinc-500 gap-2">
              <div className="flex items-center gap-2">
                <Tag label={activeTrack.tag} variant={activeTrack.tagVariant} />
                <span className="font-semibold" style={{ color: activeTrack.accent }}>{activeTrack.name}</span>
              </div>
              <span>Open Hardware & Permissive Licenses</span>
            </div>

            <h2 className={`text-xl sm:text-2xl font-bold font-sans ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              {activeTrack.headline}
            </h2>

            {/* 3 Concrete Columns: What We Build, What DETOX Provides, What We Expect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Column 1: What We Can Build Together */}
              <div
                className={`p-5 rounded-xs border text-xs space-y-3 transition-colors duration-500 ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-800' : 'bg-[#0e0f12] border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-[#235347] dark:text-[#99CDD8] uppercase font-bold border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                  <Hammer size={12} />
                  <span>What We Can Build Together</span>
                </div>
                <div className="space-y-2 font-sans text-xs">
                  {activeTrack.buildTogether.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-[#235347] dark:text-[#38B2A2] font-bold text-xs pt-0.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: What DETOX Provides */}
              <div
                className={`p-5 rounded-xs border text-xs space-y-3 transition-colors duration-500 ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-800' : 'bg-[#0e0f12] border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-[#235347] dark:text-[#99CDD8] uppercase font-bold border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                  <Wrench size={12} />
                  <span>What DETOX Provides</span>
                </div>
                <div className="space-y-2 font-sans text-xs">
                  {activeTrack.detoxProvides.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check size={13} className="text-[#235347] dark:text-[#38B2A2] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: What We Expect */}
              <div
                className={`p-5 rounded-xs border text-xs space-y-3 transition-colors duration-500 ${
                  isLight ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-800' : 'bg-[#0e0f12] border-zinc-800 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs text-[#235347] dark:text-[#99CDD8] uppercase font-bold border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                  <ShieldAlert size={12} />
                  <span>What We Expect</span>
                </div>
                <div className="space-y-2 font-sans text-xs">
                  {activeTrack.whatWeExpect.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-500 text-xs pt-0.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Contact Button */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="text-zinc-500 text-xs">
                Direct Track Contact: <span className="text-[#235347] dark:text-[#99CDD8] font-semibold">{activeTrack.contactEmail}</span>
              </div>

              <a
                href={`mailto:${activeTrack.contactEmail}?subject=Co-Building%20Proposal%20via%20DETOX`}
                className="px-5 py-2.5 bg-[#163B32] hover:bg-[#235347] dark:bg-[#38B2A2] dark:hover:bg-[#4ecdc4] text-white dark:text-zinc-950 font-sans text-xs font-semibold rounded-xs tracking-wider transition-colors flex items-center gap-2 shrink-0"
              >
                <span>Submit {activeTrack.name} Proposal</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </DossierCard>
      </div>

      {/* The Co-Building Covenant (3 Concise Principles) */}
      <div className="mb-20">
        <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-8 text-xs flex items-center justify-between">
          <span className="text-[#235347] dark:text-[#99CDD8] font-semibold">The Co-Building Principles</span>
          <span className="text-zinc-500">Non-negotiable values</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            className={`p-6 rounded-xs border transition-colors duration-500 ${
              isLight ? 'bg-[#faf8f5] border-zinc-300 text-zinc-800' : 'bg-[#14161a] border-zinc-800 text-zinc-300'
            }`}
          >
            <div className="text-xs text-[#235347] dark:text-[#38B2A2] font-semibold mb-2">01 · Substance Over Logos</div>
            <h3 className={`font-sans font-bold text-base mb-2 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              No Marketing Vanity
            </h3>
            <p className={`font-sans text-xs leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              We don't print corporate logos on banners or trade swag. When you donate test equipment or evaluation chips, your contribution is credited directly in git commits and hardware schematics.
            </p>
          </div>

          <div
            className={`p-6 rounded-xs border transition-colors duration-500 ${
              isLight ? 'bg-[#faf8f5] border-zinc-300 text-zinc-800' : 'bg-[#14161a] border-zinc-800 text-zinc-300'
            }`}
          >
            <div className="text-xs text-[#235347] dark:text-[#38B2A2] font-semibold mb-2">02 · Student Ownership</div>
            <h3 className={`font-sans font-bold text-base mb-2 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              Permissive Open Source
            </h3>
            <p className={`font-sans text-xs leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Students own their work. Project outputs are published under open permissive licenses (MIT / Apache 2.0 / CERN OHL) so the broader global engineering community benefits.
            </p>
          </div>

          <div
            className={`p-6 rounded-xs border transition-colors duration-500 ${
              isLight ? 'bg-[#faf8f5] border-zinc-300 text-zinc-800' : 'bg-[#14161a] border-zinc-800 text-zinc-300'
            }`}
          >
            <div className="text-xs text-[#235347] dark:text-[#38B2A2] font-semibold mb-2">03 · Engineer to Engineer</div>
            <h3 className={`font-sans font-bold text-base mb-2 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              Direct Technical Discourse
            </h3>
            <p className={`font-sans text-xs leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Collaborations are coordinated by student leads and practicing engineers. We talk about bus timing, latency curves, and assembly traces, never corporate buzzwords.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
