import React, { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';

interface WorkbenchArtifactsProps {
  onSelectArtifact?: (artifactId: string) => void;
}

export const WorkbenchArtifacts: React.FC<WorkbenchArtifactsProps> = ({ onSelectArtifact }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Parallax offsets by depth layer
  const p1 = { x: mousePos.x * -8, y: mousePos.y * -8 }; // Background mat plane
  const p2 = { x: mousePos.x * -16, y: mousePos.y * -14 }; // Midground papers & boards
  const p3 = { x: mousePos.x * -24, y: mousePos.y * -20 }; // Foreground rulers & tools

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">

      {/* ============================================================ */}
      {/* ARTIFACT 1: TOP-LEFT — CUSTOM MICROCONTROLLER DEV BOARD (PCB) */}
      {/* ============================================================ */}
      <div
        className="absolute top-16 left-10 md:left-24 lg:left-32 w-64 md:w-72 bg-[#121417] border border-zinc-700/80 rounded-sm p-3.5 shadow-2xl transition-transform duration-300 ease-out cursor-pointer pointer-events-auto hover:border-zinc-500 hover:scale-[1.02] group"
        style={{
          transform: `translate3d(${p2.x}px, ${p2.y}px, 0) rotate(-4.5deg)`,
          boxShadow: isLight
            ? '0 20px 35px -10px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)'
            : '0 20px 35px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
        onClick={() => onSelectArtifact?.('pcb')}
      >
        {/* PCB Screws in 4 corners */}
        <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
          <div className="w-1 h-[1px] bg-zinc-400 rotate-45" />
        </div>
        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
          <div className="w-1 h-[1px] bg-zinc-400 -rotate-45" />
        </div>
        <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
          <div className="w-1 h-[1px] bg-zinc-400 rotate-12" />
        </div>
        <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full border border-zinc-600 bg-zinc-800 flex items-center justify-center">
          <div className="w-1 h-[1px] bg-zinc-400 rotate-75" />
        </div>

        {/* Silkscreen Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2 font-mono text-[9px]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e65100] shadow-[0_0_6px_#e65100]" />
            <span className="text-zinc-300 font-semibold tracking-wider">DETOX-HW-01</span>
          </div>
          <span className="text-zinc-500 text-[8px]">REV 2.3 // CORTEX-M4</span>
        </div>

        {/* Central MCU Chip */}
        <div className="relative my-2 bg-[#1b1d22] border border-zinc-600/60 rounded-xs p-2.5 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-[10px] font-mono font-bold text-zinc-200 tracking-wider">STM32F401RE</div>
            <div className="text-[8px] font-mono text-zinc-500">84MHz // 512KB FLASH</div>
          </div>
          {/* Micro Pin 1 indicator dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-400/40" />
        </div>

        {/* Traces & Surface Mount Components */}
        <div className="grid grid-cols-3 gap-2 my-2 font-mono text-[8px] text-zinc-500">
          <div className="border border-zinc-800 p-1 rounded-xs bg-[#15171b]">
            <span className="text-zinc-400 block text-[7px]">XTAL</span>
            <span>16.000 MHz</span>
          </div>
          <div className="border border-zinc-800 p-1 rounded-xs bg-[#15171b]">
            <span className="text-zinc-400 block text-[7px]">VDD_IO</span>
            <span className="text-[#f9a825]">3.30V REG</span>
          </div>
          <div className="border border-zinc-800 p-1 rounded-xs bg-[#15171b]">
            <span className="text-zinc-400 block text-[7px]">BUS</span>
            <span>SPI / I2C / CAN</span>
          </div>
        </div>

        {/* Gold Test Pads */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-800/80 font-mono text-[7px] text-zinc-400">
          <div className="flex gap-1.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#b39029]" />
            <span>TP_CLK</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#b39029]" />
            <span>TP_SWDIO</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] border border-[#b39029]" />
            <span>GND</span>
          </div>
        </div>

        {/* Hover Hint */}
        <div className="absolute -bottom-5 left-2 font-mono text-[8px] text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
          [CLICK TO INSPECT HARDWARE LOGS]
        </div>
      </div>

      {/* ============================================================ */}
      {/* ARTIFACT 2: TOP-RIGHT — THERMAL TERMINAL C CODE PRINTOUT     */}
      {/* ============================================================ */}
      <div
        className="absolute top-12 right-6 sm:right-12 md:right-20 lg:right-28 w-72 md:w-80 bg-[#f4f3ed] text-[#1c1d1f] p-3.5 shadow-2xl transition-transform duration-300 ease-out cursor-pointer pointer-events-auto hover:scale-[1.02] group"
        style={{
          transform: `translate3d(${p2.x * 0.9}px, ${p2.y * 0.9}px, 0) rotate(3.2deg)`,
          boxShadow: isLight
            ? '0 18px 30px -8px rgba(0,0,0,0.2)'
            : '0 18px 30px -8px rgba(0,0,0,0.85)',
          fontFamily: 'var(--font-mono)',
        }}
        onClick={() => onSelectArtifact?.('code')}
      >
        {/* Drafting Tape strip holding the receipt */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#e3d7b8]/60 backdrop-blur-xs rotate-1 border-t border-b border-[#cfc39f]/40 shadow-xs" />

        {/* Receipt Header */}
        <div className="border-b border-dashed border-zinc-400 pb-1.5 mb-2 flex items-center justify-between text-[9px] text-zinc-600">
          <span>// DETOX KERNEL EXPERIMENT #042</span>
          <span>BRANCH: MAIN</span>
        </div>

        {/* Code Snippet */}
        <div className="text-[9.5px] leading-[14px] text-zinc-800 font-mono overflow-hidden">
          <div className="text-zinc-500">// Lock-free SPSC Ring Buffer</div>
          <div><span className="text-[#b71c1c] font-bold">typedef struct</span> &#123;</div>
          <div className="pl-2">atomic_uint64_t head;</div>
          <div className="pl-2">atomic_uint64_t tail;</div>
          <div className="pl-2">size_t capacity;</div>
          <div className="pl-2">uint8_t *buffer;</div>
          <div>&#125; <span className="font-semibold text-[#1565c0]">spsc_ring_t</span>;</div>
          <div className="text-zinc-500 mt-1">// memory_order_acquire</div>
          <div>uint64_t h = atomic_load_explicit(&rb-&gt;head, memory_order_acquire);</div>
        </div>

        {/* Bottom Perforation marks */}
        <div className="mt-3 pt-1 border-t border-dotted border-zinc-400 flex justify-between text-[8px] text-zinc-500">
          <span>SHA: 4a9f12c</span>
          <span>COMPILED WITH CLANG -O3</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ARTIFACT 3: TOP-CENTER — PRECISION STAINLESS STEEL RULER      */}
      {/* ============================================================ */}
      <div
        className="hidden lg:flex absolute top-4 left-1/2 -translate-x-1/2 w-[420px] h-7 bg-gradient-to-b from-zinc-300 via-zinc-200 to-zinc-400 border-t border-zinc-100 border-b border-zinc-500 shadow-xl items-center px-4 font-mono text-[8px] text-zinc-700 select-none pointer-events-none"
        style={{
          transform: `translate3d(${p3.x}px, ${p3.y}px, 0) rotate(-1.5deg)`,
          boxShadow: isLight ? '0 8px 18px rgba(0,0,0,0.25)' : '0 8px 18px rgba(0,0,0,0.6)',
        }}
      >
        <span className="font-bold tracking-widest text-[8px] text-zinc-800 mr-4">STAINLESS STEEL 150mm</span>
        <div className="flex-1 flex justify-between tracking-tighter">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-[7px] text-zinc-800 font-bold">{i * 10}</span>
              <div className="w-[1px] h-2.5 bg-zinc-700" />
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* ARTIFACT 4: MIDDLE-RIGHT — AI/ML TRANSFORMER MATH LEAF       */}
      {/* ============================================================ */}
      <div
        className="absolute top-1/2 -translate-y-12 right-4 sm:right-10 md:right-16 lg:right-24 w-68 md:w-76 bg-[#16181d] border border-zinc-700/70 p-3.5 shadow-2xl transition-transform duration-300 ease-out cursor-pointer pointer-events-auto hover:border-zinc-500 hover:scale-[1.02] group"
        style={{
          transform: `translate3d(${p2.x * 1.1}px, ${p2.y * 1.1}px, 0) rotate(5deg)`,
          boxShadow: isLight
            ? '0 20px 35px -10px rgba(0,0,0,0.22)'
            : '0 20px 35px -10px rgba(0,0,0,0.85)',
        }}
        onClick={() => onSelectArtifact?.('ml')}
      >
        {/* Corner tape */}
        <div className="absolute -top-2 -right-2 w-8 h-4 bg-[#d7ccc8]/40 -rotate-45" />

        <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2 font-mono text-[9px]">
          <span className="text-[#f9a825] font-semibold tracking-wider">// ATTENTION MECHANICS</span>
          <span className="text-zinc-500 text-[8px]">NOTEBOOK 03</span>
        </div>

        {/* Attention formula */}
        <div className="bg-[#0f1013] p-2 rounded-xs border border-zinc-800 font-mono text-[10px] text-zinc-200 text-center my-1.5">
          Attention(Q, K, V) = softmax(Q·Kᵀ / √dₖ) V
        </div>

        <div className="font-mono text-[8.5px] text-zinc-400 space-y-1 mt-2">
          <div className="flex justify-between">
            <span>• d_model = 512, h = 8 heads</span>
            <span className="text-zinc-500">dₖ = 64</span>
          </div>
          <div>• Entropy collapse checked @ step 42k</div>
          <div className="text-[#d84315]">• Note: FlashAttention kernel cuts memory O(N)</div>
        </div>

        {/* Mini loss chart sketch */}
        <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between font-mono text-[8px] text-zinc-500">
          <span>LOSS CURVE: 4.82 → 1.14</span>
          <span className="text-[#388e3c]">CONVERGED ✓</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ARTIFACT 6: BOTTOM-CENTER-RIGHT — REALISTIC COFFEE MUG STAIN */}
      {/* ============================================================ */}
      <div
        className={`absolute bottom-16 right-1/3 w-28 h-28 pointer-events-none select-none transition-all duration-700 ${
          isLight ? 'opacity-55 mix-blend-multiply' : 'opacity-40 mix-blend-screen'
        }`}
        style={{
          transform: `translate3d(${p1.x}px, ${p1.y}px, 0) rotate(18deg)`,
        }}
      >
        {/* Circular coffee ring with capillary dried edges */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke={isLight ? '#795548' : '#bcaaa4'}
            strokeWidth="2.5"
            strokeOpacity={isLight ? 0.6 : 0.4}
            strokeDasharray="95 15 40 10"
          />
          <circle
            cx="50.5"
            cy="49.5"
            r="41"
            fill="none"
            stroke={isLight ? '#5d4037' : '#8d6e63'}
            strokeWidth="1.2"
            strokeOpacity={isLight ? 0.5 : 0.35}
          />
          <path
            d="M 48 8 L 52 14"
            stroke={isLight ? '#5d4037' : '#8d6e63'}
            strokeWidth="1.8"
            strokeOpacity={isLight ? 0.45 : 0.3}
          />
        </svg>
      </div>

      {/* ============================================================ */}
      {/* ARTIFACT 7: BOTTOM-RIGHT — NETWORKING & SECURITY DOSSIER     */}
      {/* ============================================================ */}
      <div
        className="hidden md:block absolute bottom-10 right-6 sm:right-10 md:right-16 lg:right-24 w-64 md:w-72 bg-[#16171b] border border-zinc-700/80 p-3 shadow-2xl transition-transform duration-300 ease-out cursor-pointer pointer-events-auto hover:scale-[1.02] group z-10"
        style={{
          transform: `translate3d(${p2.x * 0.95}px, ${p2.y * 0.95}px, 0) rotate(-2deg)`,
          boxShadow: isLight
            ? '0 20px 35px -10px rgba(0,0,0,0.22)'
            : '0 20px 35px -10px rgba(0,0,0,0.85)',
        }}
        onClick={() => onSelectArtifact?.('security')}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2 font-mono text-[9px]">
          <span className="text-zinc-300 font-semibold tracking-wider">// PACKET TOPOLOGY</span>
          <span className="text-[#388e3c] text-[8px]">TLS 1.3 // X25519</span>
        </div>

        {/* TCP packet header block */}
        <div className="bg-[#0e1013] p-2 rounded-xs border border-zinc-800 font-mono text-[8px] text-zinc-400 space-y-1">
          <div className="flex justify-between border-b border-zinc-800/80 pb-0.5 text-zinc-500">
            <span>SRC_PORT: 443</span>
            <span>DST_PORT: 51240</span>
          </div>
          <div className="text-zinc-300">FLAGS: [SYN, ACK] SEQ: 0x3b89a1</div>
          <div className="text-[7.5px] text-zinc-500 font-mono">
            HEX: 45 00 00 3c 1c 46 40 00 40 06 ...
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between font-mono text-[8px] text-zinc-500">
          <span>DECRYPT STATUS: VERIFIED</span>
          <span className="text-[#f9a825]">RTT: 0.84ms</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* ARTIFACT 8: YELLOW DRAFTING STICKY NOTE                      */}
      {/* ============================================================ */}
      <div
        className="absolute top-1/3 left-6 sm:left-14 md:left-20 w-44 md:w-52 bg-[#fff59d] text-zinc-900 p-2.5 shadow-xl transition-transform duration-300 ease-out cursor-pointer pointer-events-auto hover:scale-[1.05] z-10"
        style={{
          transform: `translate3d(${p3.x * 1.2}px, ${p3.y * 1.2}px, 0) rotate(-7deg)`,
          boxShadow: isLight
            ? '0 12px 24px -6px rgba(0,0,0,0.18)'
            : '0 12px 24px -6px rgba(0,0,0,0.7)',
        }}
        onClick={() => onSelectArtifact?.('sticky')}
      >
        <div className="font-mono text-[8.5px] font-bold text-zinc-800 border-b border-zinc-400/60 pb-1 mb-1">
          LAB BENCH REMINDER // 20:00
        </div>
        <div className="font-mono text-[9px] leading-tight text-zinc-900 space-y-1">
          <div>• Baud rate: <span className="font-bold">115200</span> (NOT 9600)</div>
          <div>• 3.3V Logic ONLY! No 5V on GPIO4</div>
          <div>• Return logic analyzer to Arjun</div>
        </div>
      </div>
    </div>
  );
};
