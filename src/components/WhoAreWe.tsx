import React, { useState } from 'react';
import { Cpu, Terminal, Layers, ShieldCheck, Code, Wrench } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface Discipline {
  id: string;
  name: string;
  category: string;
  tag: string;
  icon: React.ElementType;
  accent: string;
  lead: string;
  description: string;
  specimens: string[];
  projects: string[];
}

const disciplines: Discipline[] = [
  {
    id: 'systems',
    name: 'Systems & Low-Level Computing',
    category: 'INFRASTRUCTURE & RUNTIMES',
    tag: 'RING 0 → COMPILER IR',
    icon: Terminal,
    accent: '#d84315',
    lead: 'We do not treat operating systems or compilers as black boxes.',
    description:
      'Students in this group build and profile systems software from bare metal up. We study cache hierarchies, lock-free synchronization, write toy operating systems, implement memory-safe allocators, and understand the cost of every machine instruction.',
    specimens: [
      'Lock-free Single-Producer Single-Consumer (SPSC) ring buffers with C11 atomic fences',
      'Custom slab memory allocators with zero external fragmentation',
      'Tiny bytecode interpreters and JIT compilers compiling subset languages',
    ],
    projects: [
      'detox-os (Microkernel research operating system targeting x86_64)',
      'fast-ipc (Zero-copy shared memory IPC protocol achieving <35ns message latency)',
    ],
  },
  {
    id: 'hardware',
    name: 'Embedded Systems & Hardware',
    category: 'PHYSICAL ELECTRONICS',
    tag: 'SILICON & SCHEMATICS',
    icon: Cpu,
    accent: '#f9a825',
    lead: 'Turning mathematical logic into copper traces and physical silicon.',
    description:
      'From schematic capture in KiCad to solder paste stenciling and oscilloscope debugging. We design custom micro-controller breakout boards, sensor breakout PCBs, low-power telemetry devices, and experiment with FPGA logic synthesis.',
    specimens: [
      'Custom 4-layer STM32F401 hardware flight computer with ENIG gold surface finish',
      'Solderless breadboard timing circuits verified with analog oscilloscopes',
      'Precision sensor fusion over high-speed differential SPI and I2C buses',
    ],
    projects: [
      'detox-core-v2 (Modular student developer board with integrated SWD debugger)',
      'radio-link (Long-range sub-GHz telemetry transceiver for autonomous vehicles)',
    ],
  },
  {
    id: 'ai-ml',
    name: 'Machine Learning & Mathematics',
    category: 'INTELLIGENCE & OPTIMIZATION',
    tag: 'TENSOR & ATTENTION KERNELS',
    icon: Layers,
    accent: '#e65100',
    lead: 'Understanding deep architectures through mathematical rigor, not API calls.',
    description:
      'We reject the trend of simply wrapping commercial APIs. Our ML group studies training dynamics, loss surfaces, transformer attention geometry, low-bit quantization (INT4/FP8), and writes custom GPU kernels for inference acceleration.',
    specimens: [
      'Mathematical derivations of attention entropy and scaled dot-product stability',
      'Custom FlashAttention tiling kernels written for resource-constrained GPUs',
      'Vector space clustering and cosine distance indexing for local knowledge retrieval',
    ],
    projects: [
      'nano-attn (Minimal pure-C transformer inference engine running on edge CPU)',
      'loss-geom (Visualizer and analyzer for high-dimensional optimization surfaces)',
    ],
  },
  {
    id: 'security',
    name: 'Security, Cryptography & Networks',
    category: 'PROTOCOL RESEARCH',
    tag: 'VERIFICATION & AUDITING',
    icon: ShieldCheck,
    accent: '#388e3c',
    lead: 'Adversarial thinking and formal protocol verification.',
    description:
      'We study network packet topologies, vulnerability research, reverse engineering of stripped binaries, memory corruption exploits, and applied cryptographic primitives like elliptic curves and zero-knowledge proofs.',
    specimens: [
      'Bit-exact TCP/IP packet header decomposition and packet fuzzing suites',
      'TLS 1.3 handshake packet capture audits evaluating Curve25519 key exchanges',
      'Binary reverse engineering dissecting stripped ELF binaries in Ghidra/GDB',
    ],
    projects: [
      'wire-sniff (Lightweight eBPF network packet analyzer with zero-drop packet capture)',
      'crypto-audit (Educational testing bench for verifying timing side-channel resistance)',
    ],
  },
];

export const WhoAreWe: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('systems');
  const activeDiscipline = disciplines.find((d) => d.id === activeTab) || disciplines[0];
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <section
      id="disciplines"
      className={`relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 transition-colors duration-700 ${
        isLight ? 'bg-[#ece9e2]' : 'bg-[#0b0c0e]'
      }`}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className={`border-b pb-6 mb-12 transition-colors duration-700 ${isLight ? 'border-zinc-300' : 'border-zinc-800'}`}>
          <div className="flex items-center gap-2 font-mono text-xs text-[#d84315] uppercase tracking-widest mb-2 font-semibold">
            <span>// 02. Who Are We?</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-sans transition-colors duration-700 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
            The Disciplines on the Workbench
          </h2>
          <p className={`mt-3 font-sans text-sm sm:text-base max-w-2xl transition-colors duration-700 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
            We are students from different disciplines united by one standard: a refusal to accept superficial knowledge. Here is what we actively study and build.
          </p>
        </div>

        {/* Disciplines Grid / Tabs Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Discipline Selectors (Engineering Dossier Index) */}
          <div className="lg:col-span-4 space-y-2 font-mono">
            {disciplines.map((d) => {
              const ItemIcon = d.icon;
              const isSelected = d.id === activeTab;

              return (
                <button
                  key={d.id}
                  onClick={() => setActiveTab(d.id)}
                  className={`w-full text-left p-4 rounded-xs border transition-all duration-200 ${
                    isSelected
                      ? isLight
                        ? 'bg-[#faf8f5] border-zinc-500 text-zinc-950 shadow-md ring-1 ring-zinc-400/40'
                        : 'bg-[#15171c] border-zinc-500 text-white shadow-lg'
                      : isLight
                        ? 'bg-[#f4f1ea] border-zinc-300/80 text-zinc-700 hover:border-zinc-400 hover:text-zinc-950'
                        : 'bg-[#0f1013] border-zinc-800/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className={`flex items-center justify-between text-[9px] mb-1 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    <span>{d.category}</span>
                    <span className="font-semibold" style={{ color: isSelected ? d.accent : undefined }}>
                      {d.tag}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ItemIcon size={16} style={{ color: d.accent }} />
                    <span className="text-xs sm:text-sm font-bold font-sans tracking-tight">
                      {d.name}
                    </span>
                  </div>
                </button>
              );
            })}

            <div
              className={`p-4 border rounded-xs text-[10px] space-y-1 mt-4 transition-colors duration-700 ${
                isLight
                  ? 'border-zinc-300 bg-[#f4f1ea] text-zinc-700'
                  : 'border-zinc-800 bg-[#0e0f12] text-zinc-500'
              }`}
            >
              <div className={`font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-400'}`}>CROSS-POLLINATION:</div>
              <p className="font-sans leading-relaxed">
                No silos. A single project will frequently combine custom hardware boards, kernel drivers, and mathematical models.
              </p>
            </div>
          </div>

          {/* Right Column: Detailed Engineering Dossier for Active Discipline */}
          <div
            className={`lg:col-span-8 border rounded-xs p-6 sm:p-8 relative transition-colors duration-700 ${
              isLight
                ? 'bg-[#faf8f5] border-zinc-300 shadow-md'
                : 'bg-[#131519] border-zinc-700 shadow-2xl'
            }`}
          >
            
            {/* Top Specimen Stamp */}
            <div
              className={`flex flex-wrap items-center justify-between border-b pb-4 mb-6 font-mono text-[10px] gap-2 transition-colors duration-700 ${
                isLight ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeDiscipline.accent }} />
                <span className={`font-bold uppercase tracking-wider ${isLight ? 'text-zinc-950' : 'text-zinc-200'}`}>
                  {activeDiscipline.name}
                </span>
              </div>
              <span className={isLight ? 'text-zinc-600' : 'text-zinc-500'}>
                SPECIMEN DOSSIER // DTX-{activeDiscipline.id.toUpperCase()}
              </span>
            </div>

            {/* Lead Statement */}
            <h3 className={`text-lg sm:text-2xl font-bold font-sans mb-3 transition-colors duration-700 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              {activeDiscipline.lead}
            </h3>

            <p className={`font-sans text-sm sm:text-base leading-relaxed mb-6 transition-colors duration-700 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
              {activeDiscipline.description}
            </p>

            {/* Specimen Evidence List */}
            <div className="space-y-4 mb-6">
              <div className="font-mono text-[10px] text-[#d84315] uppercase tracking-widest flex items-center gap-1.5 font-semibold">
                <Code size={12} />
                <span>Tangible Artifacts & Evidence</span>
              </div>
              <div
                className={`border p-4 rounded-xs space-y-2.5 font-mono text-xs transition-colors duration-700 ${
                  isLight
                    ? 'bg-[#f0ede5] border-zinc-300 text-zinc-800 shadow-inner'
                    : 'bg-[#0b0c0e] border-zinc-800 text-zinc-300'
                }`}
              >
                {activeDiscipline.specimens.map((specimen, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className={`text-[10px] pt-0.5 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>[{idx + 1}]</span>
                    <span className="text-[11px] leading-relaxed">{specimen}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Living Collective Projects */}
            <div className="space-y-3">
              <div className={`font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-semibold ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                <Wrench size={12} />
                <span>Active Workbench Projects</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeDiscipline.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className={`p-3 border rounded-xs font-mono text-[11px] transition-colors duration-700 ${
                      isLight
                        ? 'bg-[#f4f1ea] border-zinc-300'
                        : 'bg-[#181a20] border-zinc-800'
                    }`}
                  >
                    <div className={`font-bold flex items-center gap-1.5 mb-1 ${isLight ? 'text-zinc-950' : 'text-zinc-200'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#388e3c]" />
                      <span>{proj.split(' ')[0]}</span>
                    </div>
                    <div className={`text-[10px] font-sans ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
                      {proj.substring(proj.indexOf(' ') + 1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Verification Tag */}
            <div
              className={`mt-8 pt-4 border-t flex items-center justify-between font-mono text-[9px] transition-colors duration-700 ${
                isLight ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800/90 text-zinc-500'
              }`}
            >
              <span>MAINTAINER: STUDENT WORKING GROUP</span>
              <span className="text-[#d84315] font-semibold">ALL CODE PUBLIC ON GIT</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
