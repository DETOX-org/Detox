import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const mottoSteps = [
  { step: '01', verb: 'LEARN', desc: 'Read the spec, deconstruct the original research paper, trace the standard.' },
  { step: '02', verb: 'EXPERIMENT', desc: 'Solder the breadboard, draft the prototype, test the hypothesis in isolation.' },
  { step: '03', verb: 'BUILD', desc: 'Lay down copper traces, write the low-level code, assemble the physical unit.' },
  { step: '04', verb: 'BREAK', desc: 'Push to failure, stress-test memory barriers, fuzz the network packet parser.' },
  { step: '05', verb: 'FIX', desc: 'Probe with the oscilloscope, run GDB backtraces, fix the root cause.' },
  { step: '06', verb: 'SHIP', desc: 'Publish open schematics, release clean git commits, pass on knowledge.' },
];

const philosophyAxioms = [
  {
    num: 'AXIOM 01',
    title: 'The Anti-Slop Thesis',
    summary: 'Substance over buzzwords. No vaporware, no hype, no empty presentations.',
    detail:
      'We reject the modern obsession with slide-deck engineering and superficial AI wrappers. We value latency numbers, memory footprint metrics, clean git trees, and hardware that physically boots. If you cannot explain how your system works without repeating marketing jargon, you do not understand it.',
    borderAccent: '#d84315',
  },
  {
    num: 'AXIOM 02',
    title: 'Layer N-1 Rigor',
    summary: 'When an abstraction leaks or fails, we dive down one layer to the metal.',
    detail:
      'Modern computer education encourages students to stack black boxes on top of black boxes. When things break, people guess. In DETOX, we go down a layer: from web frameworks to runtime engines, from runtimes to system calls, from system calls to kernel drivers, and from drivers to the transistor logic.',
    borderAccent: '#f9a825',
  },
  {
    num: 'AXIOM 03',
    title: 'The Workbench Over The Podium',
    summary: 'Authority is earned at the desk, not on a conference stage.',
    detail:
      'We don’t care about executive titles, LinkedIn clout, or corporate networking rituals. Within DETOX, respect is commanded by the quality of your code reviews, the elegance of your PCB routing, and your willingness to sit with a peer at 2 AM to solve a baffling timing race condition.',
    borderAccent: '#388e3c',
  },
  {
    num: 'AXIOM 04',
    title: 'Radical Peer Craftsmanship',
    summary: 'Engineering is a collaborative discipline practiced in the open.',
    detail:
      'Everything we design is intended to be inspected, criticized, and improved by peers. We publish all schematics, benchmark suites, and post-mortems. We believe that true technical mastery comes from honest peer feedback and intense collaborative building.',
    borderAccent: '#1976d2',
  },
];

export const OurMottoPhilosophy: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <section
      id="philosophy"
      className={`relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 transition-colors duration-700 border-b ${
        isLight ? 'bg-[#f4f1ea] border-zinc-300' : 'bg-[#101114] border-zinc-800'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* ============================================================ */}
        {/* PART 1: THE MOTTO                                            */}
        {/* ============================================================ */}
        <div>
          <div
            className={`border-b pb-4 mb-8 flex flex-wrap items-center justify-between font-mono text-xs gap-2 transition-colors duration-700 ${
              isLight ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <span className="text-[#d84315] uppercase tracking-widest font-semibold">// 03. Our Motto</span>
            <span>CYCLE: CONTINUOUS RECURSION</span>
          </div>

          <div className="mb-10">
            <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight font-sans transition-colors duration-700 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              The Workbench Cycle
            </h2>
            <p className={`mt-3 font-sans text-sm sm:text-base max-w-2xl transition-colors duration-700 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
              Building things is not a straight line. It is a rigorous, tactile loop that every true engineer recognizes.
            </p>
          </div>

          {/* Sequential State Machine Flow */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {mottoSteps.map((item, idx) => (
              <div
                key={idx}
                className={`border p-4 rounded-xs font-mono space-y-2 flex flex-col justify-between transition-colors duration-200 ${
                  isLight
                    ? 'bg-[#faf8f5] border-zinc-300 hover:border-zinc-500 shadow-xs'
                    : 'bg-[#15171b] border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <div>
                  <div className={`flex items-center justify-between text-[10px] mb-2 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    <span>{item.step}</span>
                    <ArrowRight size={12} className={isLight ? 'text-zinc-500' : 'text-zinc-600'} />
                  </div>
                  <div className={`text-sm font-bold tracking-wider font-sans ${isLight ? 'text-zinc-950' : 'text-zinc-200'}`}>
                    {item.verb}
                  </div>
                </div>
                <p className={`text-[10px] font-sans leading-relaxed pt-2 border-t ${isLight ? 'text-zinc-600 border-zinc-300' : 'text-zinc-400 border-zinc-800/80'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Loop Statement */}
          <div
            className={`mt-4 p-3 border rounded-xs font-mono text-[10px] flex items-center justify-between transition-colors duration-700 ${
              isLight
                ? 'bg-[#ece9e2] border-zinc-300 text-zinc-600'
                : 'bg-[#0c0d10] border-zinc-800/80 text-zinc-500'
            }`}
          >
            <span>TERMINATION CONDITION: NONE (RETURN TO STEP 01)</span>
            <span className="text-[#d84315] font-semibold">TRUE CRAFTSMANSHIP IS LIFELONG</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* PART 2: THE PHILOSOPHY / AXIOMS                              */}
        {/* ============================================================ */}
        <div>
          <div
            className={`border-b pb-4 mb-8 flex flex-wrap items-center justify-between font-mono text-xs gap-2 transition-colors duration-700 ${
              isLight ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-500'
            }`}
          >
            <span className="text-[#d84315] uppercase tracking-widest font-semibold">// 04. Our Philosophy</span>
            <span>FOUNDATIONAL CORE CODES</span>
          </div>

          <div className="mb-10">
            <h2 className={`text-3xl sm:text-5xl font-bold tracking-tight font-sans transition-colors duration-700 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
              The Workbench Axioms
            </h2>
            <p className={`mt-3 font-sans text-sm sm:text-base max-w-2xl transition-colors duration-700 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
              These principles govern how DETOX operates, how we evaluate projects, and what we stand for in an era of superficial tech culture.
            </p>
          </div>

          {/* Axioms 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {philosophyAxioms.map((ax, idx) => (
              <div
                key={idx}
                className={`border p-6 sm:p-8 rounded-xs relative flex flex-col justify-between transition-colors duration-700 ${
                  isLight
                    ? 'bg-[#faf8f5] border-zinc-300 shadow-md'
                    : 'bg-[#14161a] border-zinc-800/90 shadow-xl'
                }`}
                style={{ borderLeftColor: ax.borderAccent, borderLeftWidth: '3px' }}
              >
                <div>
                  <div className={`font-mono text-[10px] tracking-wider mb-1 ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
                    {ax.num}
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold font-sans mb-2 transition-colors duration-700 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
                    {ax.title}
                  </h3>
                  <div className={`font-mono text-xs mb-4 pb-3 border-b text-[#d84315] font-medium transition-colors duration-700 ${isLight ? 'border-zinc-300' : 'border-zinc-800'}`}>
                    “{ax.summary}”
                  </div>
                  <p className={`text-sm font-sans leading-relaxed transition-colors duration-700 ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                    {ax.detail}
                  </p>
                </div>

                <div
                  className={`mt-6 pt-3 border-t flex items-center justify-between font-mono text-[9px] transition-colors duration-700 ${
                    isLight ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-500'
                  }`}
                >
                  <span>STANDARD: NON-NEGOTIABLE</span>
                  <span className={isLight ? 'text-zinc-800 font-semibold' : 'text-zinc-400'}>ENFORCED IN CODE REVIEWS</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
