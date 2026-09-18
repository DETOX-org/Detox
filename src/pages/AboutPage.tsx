import React, { useState } from 'react';
import { PageContainer, SectionHeader, DossierCard, Tag, type TagVariant } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { Layers, ArrowRight } from 'lucide-react';
import { Link } from '../router';

interface LayerSpec {
  layer: string;
  name: string;
  boundary: string;
  reality: string;
  tools: string[];
  variant: TagVariant;
  accentColor: string;
}

const layerDissection: LayerSpec[] = [
  {
    layer: 'LAYER 04',
    name: 'Applications & Runtimes',
    boundary: 'User Interfaces & Client Logic',
    reality: 'We write native zero-dependency runtimes and high-throughput zero-copy protocols.',
    tools: ['WebAssembly', 'Native UI', 'Zero-Copy IPC'],
    variant: 'sky',
    accentColor: '#A2D2FF',
  },
  {
    layer: 'LAYER 03',
    name: 'Compilers & VMs',
    boundary: 'IR Optimization & Bytecode',
    reality: 'We build toy compilers and trace AST lowering down to machine assembly.',
    tools: ['LLVM IR', 'Tree-sitter', 'Bytecode JIT', 'Rust'],
    variant: 'dustyRose',
    accentColor: '#ECA6B7',
  },
  {
    layer: 'LAYER 02',
    name: 'Operating System & Kernel',
    boundary: 'Virtual Memory & Scheduling',
    reality: 'We inspect kernel traps, context switch costs, and cache line invalidations.',
    tools: ['eBPF', 'C11 Atomics', 'Microkernels', 'GDB'],
    variant: 'laurel',
    accentColor: '#6B9080',
  },
  {
    layer: 'LAYER 01',
    name: 'Microarchitecture & CUDA',
    boundary: 'Instruction Pipelines & Registers',
    reality: 'We profile L1/L2 cache misses and tile raw GPU SRAM matrix blocks.',
    tools: ['STM32 ARM', 'FPGA Verilog', 'CUDA PTX', 'SPI/I2C'],
    variant: 'wisteria',
    accentColor: '#C8B6FE',
  },
  {
    layer: 'LAYER 00',
    name: 'Physical Electronics & Copper',
    boundary: 'Impedance & Thermal Dissipation',
    reality: 'We route 4-layer PCBs, stencil solder paste, and probe with oscilloscopes.',
    tools: ['KiCad PCB', 'Rigol Oscilloscope', 'Soldering Station'],
    variant: 'peach',
    accentColor: '#F3C3B2',
  },
];

export const AboutPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [activeLayer, setActiveLayer] = useState<number>(2);

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header */}
      <SectionHeader
        categoryTag="Statement of Craft"
        title="Built from Layer N-1."
        lead="A concise statement on what we are, why we exist, and what we stand for."
        statusText="Founding Principles"
      />

      {/* The 3 Core Answers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {/* Answer 1: What is DETOX? */}
        <DossierCard clipLabel="01. Identity" className="p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className={`text-xl font-bold font-display ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              An Engineering Workbench
            </h3>
            <p className={`font-sans text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
              DETOX is a student-led community where ideas become physical prototypes and low-level code. We build across systems software, embedded hardware, machine learning, and security.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-inherit text-xs text-[#235347] dark:text-[#38B2A2] font-semibold">
            Student Operated
          </div>
        </DossierCard>

        {/* Answer 2: Why Does It Exist? */}
        <DossierCard clipLabel="02. Purpose" className="p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className={`text-xl font-bold font-display ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              The Antidote to Black Boxes
            </h3>
            <p className={`font-sans text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
              Most student clubs are resume factories pushing commercial API wrappers. We exist because if you don’t understand how something works at layer N-1, you don't really know how it works.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-inherit text-xs text-[#235347] dark:text-[#38B2A2] font-semibold">
            Zero Marketing Slop
          </div>
        </DossierCard>

        {/* Answer 3: What Does It Believe In? */}
        <DossierCard clipLabel="03. Values" className="p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className={`text-xl font-bold font-display ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              Peer Craftsmanship
            </h3>
            <p className={`font-sans text-xs sm:text-sm leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
              Respect is commanded by the quality of your code reviews and solder joints, not by titles. We evaluate people strictly by running code, working hardware, and honest peer mentorship.
            </p>
          </div>
          <div className="pt-4 mt-4 border-t border-inherit text-xs text-[#235347] dark:text-[#38B2A2] font-semibold">
            Code Over Titles
          </div>
        </DossierCard>
      </div>

      {/* Visual System Diagram: The Layer N-1 Dissection */}
      <div className="mb-20">
        <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-8 text-xs gap-2">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-[#235347] dark:text-[#38B2A2]" />
            <span className="text-[#235347] dark:text-[#99CDD8] font-bold uppercase tracking-wider">The Layer N-1 System Map</span>
            <span className="text-zinc-500">Select a boundary to inspect</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Layer Selector Column */}
          <div className="lg:col-span-5 space-y-2 font-mono">
            {layerDissection.map((l, index) => {
              const isSelected = activeLayer === index;
              return (
                <button
                  key={l.layer}
                  onClick={() => setActiveLayer(index)}
                  className={`w-full text-left p-3.5 rounded-xs border transition-all duration-200 ${
                    isSelected
                      ? isLight
                        ? 'bg-[#faf8f5] text-zinc-950 shadow-sm ring-1'
                        : 'bg-[#14161a] text-white shadow-md ring-1'
                      : isLight
                        ? 'bg-[#edeae3] border-zinc-300/80 text-zinc-700 hover:border-zinc-400'
                        : 'bg-[#111215] border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                  }`}
                  style={{
                    borderColor: isSelected ? l.accentColor : undefined,
                  }}
                >
                  <div className="flex items-center justify-between text-[9px] mb-1 text-zinc-500">
                    <span className="font-bold" style={{ color: l.accentColor }}>{l.layer}</span>
                    <span>{l.boundary}</span>
                  </div>
                  <div className="font-sans font-bold text-sm tracking-tight">
                    {l.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Layer Inspection Panel */}
          <div className="lg:col-span-7">
            <DossierCard
              className="p-6 sm:p-8 h-full flex flex-col justify-between"
              clipLabel={layerDissection[activeLayer].layer}
            >
              <div>
                <div
                  className="font-mono text-xs font-bold mb-1"
                  style={{ color: layerDissection[activeLayer].accentColor }}
                >
                  {layerDissection[activeLayer].boundary.toUpperCase()}
                </div>
                <h3 className={`text-2xl font-bold font-sans mb-3 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
                  {layerDissection[activeLayer].name}
                </h3>
                <p className={`font-sans text-sm leading-relaxed mb-6 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {layerDissection[activeLayer].reality}
                </p>

                <div className="space-y-2 pt-4 border-t border-zinc-700/40">
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider">
                    Verified Tools & Standards:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layerDissection[activeLayer].tools.map((t) => (
                      <Tag
                        key={t}
                        label={t}
                        variant={layerDissection[activeLayer].variant}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className={`mt-6 pt-3 border-t flex items-center justify-between font-mono text-[10px] text-zinc-500 ${isLight ? 'border-zinc-300' : 'border-zinc-800'}`}>
                <span>VERIFICATION: DATA OVER PROMISES</span>
                <span className="text-[#235347] dark:text-[#38B2A2] font-bold">100% REPRODUCIBLE</span>
              </div>
            </DossierCard>
          </div>
        </div>
      </div>

      {/* Pathway to Meet the Builders */}
      <div
        className={`p-6 rounded-xs border flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
          isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
        }`}
      >
        <div>
          <div className="text-xs text-[#235347] dark:text-[#99CDD8] font-semibold uppercase tracking-wider">People Behind the Benches</div>
          <h4 className={`text-lg font-bold font-sans ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
            Meet the students operating the benches.
          </h4>
        </div>

        <Link
          to="/minds"
          className="px-4 py-2 bg-[#163B32] hover:bg-[#235347] dark:bg-[#38B2A2] dark:hover:bg-[#4ecdc4] text-white dark:text-zinc-950 font-mono text-xs font-bold rounded-xs tracking-wider transition-colors flex items-center gap-2 shrink-0"
        >
          <span>Meet the Minds</span>
          <ArrowRight size={13} />
        </Link>
      </div>
    </PageContainer>
  );
};
