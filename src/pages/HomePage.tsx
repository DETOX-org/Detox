import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { Link } from '../router';
import { useCms } from '../cms/CmsContext';
import { PeopleCutoutCollage } from '../components/people/PeopleCutoutCollage';
import { 
  ArrowRight, 
  Cpu, 
  Sparkles, 
  Calendar, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Shield
} from 'lucide-react';

interface HomePageProps {
  onSelectArtifact: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectArtifact }) => {
  const { projects, events, people, mediaItems } = useCms();

  const publishedProjects = projects.filter((p) => p.status === 'PUBLISHED');
  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED');
  const publishedPeople = people.filter((p) => p.status === 'PUBLISHED');

  return (
    <div className="relative overflow-hidden selection:bg-[#235347] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. HERO ENVIRONMENT (OPENING SCENE: WORKBENCH + ROBOTIC ARM + 3D WORDMARK)*/}
      {/* ========================================================================= */}
      <HeroSection onSelectArtifact={onSelectArtifact} />

      {/* Anchor for smooth scroll */}
      <div id="explore" />

      {/* ========================================================================= */}
      {/* 2. STATEMENT OF IDENTITY & VISUAL MOMENT (CONTINUOUS TRANSITION)          */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 sm:px-12 lg:px-20 transition-colors duration-700">
        <div className="max-w-7xl mx-auto">
          {/* Main Statement Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-16">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-[#235347]/30 bg-[#235347]/10 text-[#235347] dark:text-[#99CDD8]">
                <span className="w-2 h-2 rounded-full bg-[#235347] dark:bg-[#38B2A2]" />
                <span>Student Engineering Collective</span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.05]">
                We are students who actually build things.
              </h2>
            </div>
            <div className="lg:col-span-4 space-y-4">
              <p className="text-base sm:text-lg font-sans text-zinc-600 dark:text-zinc-400 leading-relaxed">
                DETOX is an antidote to passive learning and commercial API wrappers. We design microkernel primitives, route custom 4-layer PCBs, derive CUDA memory tiling, and audit low-level network packets from first principles.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-1.5 text-[#235347] dark:text-[#99CDD8] hover:underline"
                >
                  <span>Read our founding manifesto</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          {/* Asymmetric Visual Moment Collage */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Image 1: Main Workshop Bench (Large, Asymmetrical) */}
            <div className="md:col-span-7 relative group rounded-2xl overflow-hidden shadow-2xl border border-zinc-200/60 dark:border-zinc-800/80 bg-zinc-900/10 aspect-[16/10]">
              <img
                src={mediaItems[0]?.url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'}
                alt="DETOX Hardware Lab Session"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-white">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#235347] text-white">
                    Hardware Lab
                  </span>
                  <p className="text-sm font-medium mt-1 text-zinc-200">
                    Probing high-speed SPI traces during a weekend bench session
                  </p>
                </div>
                <span className="text-xs text-zinc-400 shrink-0">02:40 AM</span>
              </div>
            </div>

            {/* Asymmetric Stack: Image 2 & Identity Pill */}
            <div className="md:col-span-5 space-y-6">
              {/* Image 2: Whiteboard Systems Derivation */}
              <div className="relative group rounded-2xl overflow-hidden shadow-xl border border-zinc-200/60 dark:border-zinc-800/80 aspect-[16/11]">
                <img
                  src={mediaItems[1]?.url || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80'}
                  alt="Paxos Consensus Decomposition"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#163B32] text-white">
                    Systems Salon
                  </span>
                  <p className="text-sm font-medium mt-1 text-zinc-200">
                    Decomposing Lamport Paxos states on blackboard
                  </p>
                </div>
              </div>

              {/* Rhythmic Stat Block Strip */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                  <div className="font-display text-3xl font-bold text-[#235347]">
                    Layer N-1
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    No black-box libraries. We examine what executes underneath.
                  </div>
                </div>
                <div className="p-5 rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md">
                  <div className="font-display text-3xl font-bold text-[#235347]">
                    100%
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Student-operated, student-engineered, and open source.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BUILD — WHAT STUDENTS WORK ON TOGETHER                                 */}
      {/* ========================================================================= */}
      <section className="relative py-20 px-6 sm:px-12 lg:px-20 border-t border-b border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-[#0e1014]/70 transition-colors duration-700">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#235347] mb-2">
                What We Build
              </div>
              <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Four engineering disciplines. Zero fluff.
              </h2>
            </div>
            <p className="text-sm font-sans text-zinc-500 max-w-md">
              Each discipline is operated as an open workshop track with lab benches, hardware tooling, and code reviews.
            </p>
          </div>

          {/* Four Asymmetrical Interactive Discipline Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Discipline 1: Systems */}
            <div className="group p-7 rounded-3xl border transition-all duration-300 relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 hover:border-[#6B9080] hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#6B9080]/15 flex items-center justify-center text-[#235347] dark:text-[#6B9080] mb-6 transition-transform group-hover:scale-110">
                  <Terminal size={22} />
                </div>
                <div className="text-xs font-semibold text-[#235347] dark:text-[#6B9080] uppercase tracking-wider mb-2">
                  Systems & Microkernels
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-3">
                  Zero-Copy Runtimes
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Writing lock-free ring buffers in C11, inspecting x86_64 context-switch latencies, and bare-metal microkernel IPC with Helgrind verification.
                </p>
              </div>
              <div className="pt-4 border-t border-inherit flex items-center justify-between text-xs font-medium text-zinc-500">
                <span>IPC Latency</span>
                <span className="font-mono font-bold text-[#38B2A2]">31.8ns IPC</span>
              </div>
            </div>

            {/* Discipline 2: Hardware */}
            <div className="group p-7 rounded-3xl border transition-all duration-300 relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 hover:border-[#FFB7C3] hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#FFB7C3]/20 flex items-center justify-center text-[#7c2838] dark:text-[#FFB7C3] mb-6 transition-transform group-hover:scale-110">
                  <Cpu size={22} />
                </div>
                <div className="text-xs font-semibold text-[#7c2838] dark:text-[#FFB7C3] uppercase tracking-wider mb-2">
                  Silicon & Hardware
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-3">
                  4-Layer Board Bring-Up
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Designing custom KiCad telemetry boards, impedance matching 50Ω differential RF traces, stenciling solder paste, and hot air reflowing ARM silicon.
                </p>
              </div>
              <div className="pt-4 border-t border-inherit flex items-center justify-between text-xs font-medium text-zinc-500">
                <span>Signal Routing</span>
                <span className="font-mono font-bold text-[#F3C3B2]">480 Mbps USB</span>
              </div>
            </div>

            {/* Discipline 3: AI & Compilers */}
            <div className="group p-7 rounded-3xl border transition-all duration-300 relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 hover:border-[#99CDD8] hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#99CDD8]/20 flex items-center justify-center text-[#1a5460] dark:text-[#99CDD8] mb-6 transition-transform group-hover:scale-110">
                  <Sparkles size={22} />
                </div>
                <div className="text-xs font-semibold text-[#1a5460] dark:text-[#99CDD8] uppercase tracking-wider mb-2">
                  Acceleration & Compilers
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-3">
                  CUDA Memory Tiling
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Reproducing FlashAttention-2 in clean C/CUDA, breaking online softmax normalization across GPU shared memory, and cutting round-trips to HBM.
                </p>
              </div>
              <div className="pt-4 border-t border-inherit flex items-center justify-between text-xs font-medium text-zinc-500">
                <span>PyTorch Baseline</span>
                <span className="font-mono font-bold text-[#4CC8A3]">2.4x Speedup</span>
              </div>
            </div>

            {/* Discipline 4: Security & Protocols */}
            <div className="group p-7 rounded-3xl border transition-all duration-300 relative overflow-hidden bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 hover:border-[#A2D2FF] hover:shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#A2D2FF]/20 flex items-center justify-center text-[#1a4e7a] dark:text-[#A2D2FF] mb-6 transition-transform group-hover:scale-110">
                  <Shield size={22} />
                </div>
                <div className="text-xs font-semibold text-[#1a4e7a] dark:text-[#A2D2FF] uppercase tracking-wider mb-2">
                  Security & Verification
                </div>
                <h3 className="font-display text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-3">
                  Kernel Packet Filters
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  Auditing low-level network packets with eBPF probes in Linux kernel space, formal cryptographic handshake verification, and binary disassembly.
                </p>
              </div>
              <div className="pt-4 border-t border-inherit flex items-center justify-between text-xs font-medium text-zinc-500">
                <span>Throughput</span>
                <span className="font-mono font-bold text-[#A2D2FF]">10 Gbps eBPF</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PROJECTS — EDITORIAL EXHIBITION GALLERY (ASYMMETRIC SCALES & CROPS)     */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 sm:px-12 lg:px-20 transition-colors duration-700">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Section Title & Filter */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#235347] dark:text-[#99CDD8] mb-2">
                Project Exhibition
              </div>
              <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Things we've shipped.
              </h2>
            </div>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:border-[#235347] transition-colors self-start sm:self-auto"
            >
              <span>View all {publishedProjects.length} projects</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Asymmetric Exhibition Gallery */}
          <div className="space-y-12">
            {/* FEATURE 1: Hero Project Exhibition (detox-os) */}
            {publishedProjects[0] && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-10 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xl group">
                <div className="lg:col-span-7 rounded-2xl overflow-hidden aspect-[16/10] relative bg-zinc-900/10">
                  <img
                    src={publishedProjects[0].visualUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'}
                    alt={publishedProjects[0].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#235347] text-white shadow-md">
                      {publishedProjects[0].category}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <div>
                    <div className="text-xs text-zinc-500 font-medium mb-2">
                      Featured Project • {publishedProjects[0].contributors.join(', ')}
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-tight">
                      {publishedProjects[0].title}
                    </h3>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {publishedProjects[0].description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {publishedProjects[0].specs.map((spec, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-[11px] font-mono font-medium border border-zinc-200 dark:border-zinc-700/80 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-inherit flex items-center justify-between">
                    <div className="text-xs text-zinc-500">
                      Benchmark: <span className="font-mono font-bold text-[#235347] dark:text-[#38B2A2]">{publishedProjects[0].metrics?.value}</span>
                    </div>
                    <a
                      href={publishedProjects[0].gitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#235347] dark:text-[#99CDD8] hover:underline"
                    >
                      <span>Open Repository</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {publishedProjects.slice(1, 3).map((proj, idx) => {
                  const isOdd = idx % 2 === 1;
                  const paletteConfig = idx === 0
                    ? { badgeBg: '#FFB7C3', badgeText: '#7c2838', hoverBorder: '#FFB7C3', metricColor: '#FFB7C3' }
                    : { badgeBg: '#C8B6FE', badgeText: '#4c397c', hoverBorder: '#C8B6FE', metricColor: '#99CDD8' };

                  return (
                    <div
                      key={proj.id}
                      className="p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-lg flex flex-col justify-between group transition-all duration-300"
                      style={{
                        borderColor: undefined,
                      }}
                    >
                      <div className="space-y-5">
                        <div className={`rounded-2xl overflow-hidden ${isOdd ? 'aspect-[16/10]' : 'aspect-[4/3]'} relative bg-zinc-900/10`}>
                          <img
                            src={proj.visualUrl}
                            alt={proj.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4">
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold shadow-xs"
                              style={{ backgroundColor: paletteConfig.badgeBg, color: paletteConfig.badgeText }}
                            >
                              {proj.category}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-zinc-500 font-medium mb-1">
                            {proj.contributors.join(', ')}
                          </div>
                          <h4 className="font-display text-xl font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                            {proj.title}
                          </h4>
                        </div>

                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      <div className="pt-6 mt-6 border-t border-inherit flex items-center justify-between text-xs">
                        <span className="font-mono font-bold" style={{ color: paletteConfig.metricColor }}>
                          {proj.metrics?.value || 'VERIFIED'}
                        </span>
                        <Link
                          to="/projects"
                          className="inline-flex items-center gap-1 font-semibold text-[#235347] dark:text-[#99CDD8] hover:underline"
                        >
                          <span>Inspect Specs</span>
                          <ChevronRight size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MINDS BEHIND DETOX — SIGNATURE INTERACTIVE PHOTO WALL (REAL STUDENTS)  */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 sm:px-12 lg:px-20 border-t border-zinc-200/80 dark:border-zinc-800 bg-[#faf8f5] dark:bg-[#0c0d10] transition-colors duration-700">
        <div className="max-w-7xl mx-auto space-y-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-zinc-300 dark:border-zinc-800 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-[#235347]/30 bg-[#235347]/10 text-[#235347] dark:text-[#99CDD8] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#235347] dark:bg-[#38B2A2]" />
                <span>Active Student Collective</span>
              </div>
              <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Minds Behind DETOX.
              </h2>
            </div>
            <div className="flex flex-col sm:items-end gap-2">
              <p className="text-xs sm:text-sm text-zinc-500 max-w-sm sm:text-right">
                Undergraduates designing microkernels, routing PCBs, and running 36-hour weekend marathons.
              </p>
              <Link
                to="/minds"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#235347] dark:text-[#99CDD8] hover:underline"
              >
                <span>Explore all {publishedPeople.length} student builders</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Signature Physical Scissors-Cut Editorial Collage */}
          <PeopleCutoutCollage people={publishedPeople.sort((a, b) => (a.order || 99) - (b.order || 99))} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. COMMUNITY — LIVING PULSE & COLLAGED ACTIVITY                           */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 sm:px-12 lg:px-20 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-700">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <div className="text-xs font-bold uppercase tracking-widest text-[#235347] dark:text-[#99CDD8] mb-2">
                Community Pulse
              </div>
              <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                800+ students building, learning, and contributing.
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Not a resume mill. We are a living network of self-driven students across hardware bring-ups, open-source maintainers, and distributed systems hackers who meet every weekend to build things that work.
              </p>
            </div>
          </div>

          {/* Interactive Community Visual Strip with Intentionally Assigned Palette Borders */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-t-4 border-t-[#38B2A2] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
              <div className="font-display text-4xl font-bold text-[#38B2A2] mb-1">
                4
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-1">
                Working Groups
              </div>
              <div className="text-xs text-zinc-500">
                Systems, Embedded Silicon, ML Math, Cryptographic Protocols
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-t-4 border-t-[#FFB7C3] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
              <div className="font-display text-4xl font-bold text-[#7c2838] dark:text-[#FFB7C3] mb-1">
                14
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-1">
                Hardware Bring-Ups
              </div>
              <div className="text-xs text-zinc-500">
                Custom PCBs routed, stenciled, and verified in our student lab
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-t-4 border-t-[#C8B6FE] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
              <div className="font-display text-4xl font-bold text-[#4c397c] dark:text-[#C8B6FE] mb-1">
                36h
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-1">
                Weekend Builds
              </div>
              <div className="text-xs text-zinc-500">
                Discrete 7400 TTL CPUs and bare-metal marathons
              </div>
            </div>

            <div className="p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 border-t-4 border-t-[#4CC8A3] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md shadow-xs">
              <div className="font-display text-4xl font-bold text-[#0f5240] dark:text-[#4CC8A3] mb-1">
                100%
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-1">
                Open Source
              </div>
              <div className="text-xs text-zinc-500">
                Permissively licensed code with reproducible test suites
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. EVENTS — VISUAL TIMELINE & ARCHIVE (PHOTO -> DATE -> TITLE -> DESC)    */}
      {/* ========================================================================= */}
      <section className="relative py-24 px-6 sm:px-12 lg:px-20 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-[#0c0d10]/70 transition-colors duration-700">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-zinc-300 dark:border-zinc-800 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#235347] dark:text-[#99CDD8] mb-2">
                Timeline
              </div>
              <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                Workshops & Sprints.
              </h2>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:border-[#235347] transition-colors self-start sm:self-auto"
            >
              <span>View full calendar & archive</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Visual Timeline Archive List */}
          <div className="space-y-8">
            {publishedEvents.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center p-6 sm:p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                {/* Large Event Photograph */}
                <div className="md:col-span-5 rounded-2xl overflow-hidden aspect-[16/10] relative bg-zinc-900/10">
                  <img
                    src={event.photoUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs ${
                        event.isUpcoming
                          ? 'bg-[#235347] text-[#FDE8D3] border border-[#FDE8D3]/30'
                          : 'bg-[#163B32] text-[#FED5FF] border border-[#FED5FF]/20'
                      }`}
                    >
                      {event.isUpcoming ? 'UPCOMING SPRINT' : 'ARCHIVED SPRINT'}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="md:col-span-7 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-[#38B2A2]" />
                      <span>{event.date}</span>
                    </span>
                    <span>•</span>
                    <span>{event.location}</span>
                  </div>

                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-zinc-950 dark:text-zinc-50 leading-snug">
                    {event.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="pt-3 flex flex-wrap items-center justify-between gap-4 border-t border-inherit text-xs">
                    <div className="text-zinc-500">
                      Deliverable: <span className="font-semibold text-[#38B2A2] dark:text-[#4CC8A3]">{event.deliverables[0]}</span>
                    </div>
                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1 font-bold text-[#235347] dark:text-[#99CDD8] hover:underline"
                    >
                      <span>Event Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. COLLABORATE — "BUILD WITH US" CALL TO ACTION                           */}
      {/* ========================================================================= */}
      <section className="relative py-28 px-6 sm:px-12 lg:px-20 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-700">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-[#235347]/30 bg-[#235347]/10 text-[#235347] dark:text-[#99CDD8]">
            <span>Get Involved</span>
          </div>

          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Build with us.
          </h2>

          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Whether you are a student hungry to write kernel code, an institution looking to sponsor physical lab benches, or an engineering lab interested in open collaboration, our doors are open.
          </p>

          {/* Pathways Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left pt-6">
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
              <div className="text-xs font-bold text-[#235347] dark:text-[#38B2A2] uppercase tracking-wider mb-1">
                Students
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Join our working groups and attend weekly lab bring-ups.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
              <div className="text-xs font-bold text-[#235347] dark:text-[#38B2A2] uppercase tracking-wider mb-1">
                Institutions
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Host joint student research salons and physical hackathons.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
              <div className="text-xs font-bold text-[#235347] dark:text-[#38B2A2] uppercase tracking-wider mb-1">
                Industry
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Provide test silicon, dev boards, and engineering reviews.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60">
              <div className="text-xs font-bold text-[#235347] dark:text-[#38B2A2] uppercase tracking-wider mb-1">
                Open Source
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Co-develop low-level libraries and benchmark harnesses.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/collaborate"
              className="px-8 py-3.5 rounded-full text-sm font-semibold bg-[#235347] hover:bg-[#163B32] text-white transition-all shadow-lg hover:shadow-xl"
            >
              Explore Co-Building Tracks
            </Link>
            <Link
              to="/members"
              className="px-8 py-3.5 rounded-full text-sm font-semibold border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:border-[#235347] transition-all"
            >
              Enter Member Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
