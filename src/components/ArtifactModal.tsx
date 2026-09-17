import React from 'react';
import { X, Terminal, Cpu, Layers, FileText } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface ArtifactModalProps {
  artifactId: string | null;
  onClose: () => void;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({ artifactId, onClose }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  if (!artifactId) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200 ${
        isLight ? 'bg-black/50' : 'bg-black/80'
      }`}
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-2xl border rounded-sm shadow-2xl p-6 font-mono max-h-[90vh] overflow-y-auto transition-colors duration-300 ${
          isLight
            ? 'bg-[#faf8f5] border-zinc-400 text-zinc-800 shadow-zinc-900/20'
            : 'bg-[#14161a] border-zinc-700 text-zinc-300 shadow-black/80'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-1.5 rounded-xs transition-colors ${
            isLight
              ? 'text-zinc-600 hover:text-black bg-zinc-200 hover:bg-zinc-300'
              : 'text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700'
          }`}
        >
          <X size={16} />
        </button>

        {/* Modal Content based on artifactId */}
        {artifactId === 'pcb' && (
          <div>
            <div className="flex items-center gap-2 text-[#e65100] text-xs font-bold mb-2">
              <Cpu size={16} />
              <span>SPECIMEN: DETOX-HW-01 // ARM CORTEX-M4 HARDWARE PLATFORM</span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-zinc-950' : 'text-white'}`}>Embedded Sensor & Telemetry Core</h3>
            <p className={`text-xs mb-4 font-sans leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Designed in-house by DETOX hardware members for low-latency robotic telemetry and high-frequency inertial sampling. Fabricated with matte-black solder mask and ENIG gold surface plating.
            </p>
            <div className={`border p-3 rounded-xs text-[11px] space-y-1.5 mb-4 ${isLight ? 'bg-[#f0ede5] border-zinc-300 text-zinc-800' : 'bg-[#0c0d10] border-zinc-800 text-zinc-300'}`}>
              <div className={`flex justify-between border-b pb-1 ${isLight ? 'border-zinc-300 text-zinc-500' : 'border-zinc-800/80 text-zinc-500'}`}>
                <span>PARAMETER</span>
                <span>VALUE</span>
              </div>
              <div className="flex justify-between">
                <span>Microcontroller:</span>
                <span className={`font-semibold ${isLight ? 'text-zinc-950' : 'text-white'}`}>STM32F401RE (ARM Cortex-M4 @ 84MHz)</span>
              </div>
              <div className="flex justify-between">
                <span>Memory:</span>
                <span className={`font-semibold ${isLight ? 'text-zinc-950' : 'text-white'}`}>512 KB Flash, 96 KB SRAM</span>
              </div>
              <div className="flex justify-between">
                <span>Bus Interfaces:</span>
                <span className={`font-semibold ${isLight ? 'text-zinc-950' : 'text-white'}`}>SPI, I2C, USART, USB OTG, CAN 2.0B</span>
              </div>
              <div className="flex justify-between">
                <span>Power Delivery:</span>
                <span className="text-[#d84315] font-semibold">3.3V LDO with &lt;15mV ripple</span>
              </div>
            </div>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
              [ STATUS: IN LAB ACTIVE USE // REV 2.3 // TEST JIG PASS: 100% ]
            </div>
          </div>
        )}

        {artifactId === 'code' && (
          <div>
            <div className="flex items-center gap-2 text-[#d84315] text-xs font-bold mb-2">
              <Terminal size={16} />
              <span>KERNEL LOG: SPSC LOCK-FREE RING BUFFER</span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-zinc-950' : 'text-white'}`}>Zero-Allocation Lock-Free Queue</h3>
            <p className={`text-xs mb-4 font-sans leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Implemented in pure C11 for inter-thread message passing with zero lock contention, compiled with Clang under strict memory ordering constraints.
            </p>
            <div className="bg-[#0b0c0e] border border-zinc-800 p-4 rounded-xs text-[10.5px] leading-relaxed text-zinc-300 overflow-x-auto shadow-inner">
              <pre><code>{`// detox_spsc_ring.c
#include <stdatomic.h>
#include <stdbool.h>

typedef struct {
    atomic_uint_fast64_t head;
    atomic_uint_fast64_t tail;
    size_t capacity;
    uint8_t *buffer;
} detox_spsc_ring_t;

bool detox_spsc_push(detox_spsc_ring_t *rb, uint8_t byte) {
    uint64_t current_tail = atomic_load_explicit(&rb->tail, memory_order_relaxed);
    uint64_t current_head = atomic_load_explicit(&rb->head, memory_order_acquire);

    if (current_tail - current_head >= rb->capacity) {
        return false; // Buffer full
    }

    rb->buffer[current_tail % rb->capacity] = byte;
    atomic_store_explicit(&rb->tail, current_tail + 1, memory_order_release);
    return true;
}`}</code></pre>
            </div>
            <div className={`mt-3 flex justify-between text-[10px] ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
              <span>COMMIT: 4a9f12c</span>
              <span>BENCHMARK: 28.4M OPS/SEC (x86_64)</span>
            </div>
          </div>
        )}

        {artifactId === 'ml' && (
          <div>
            <div className="flex items-center gap-2 text-[#d84315] text-xs font-bold mb-2">
              <Layers size={16} />
              <span>THEORY LOG: TRANSFORMER ATTENTION EXPLORATION</span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-zinc-950' : 'text-white'}`}>Multi-Head Scaled Dot-Product & Memory Optimization</h3>
            <p className={`text-xs mb-4 font-sans leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Research notes by the DETOX Machine Learning working group evaluating custom CUDA kernels for flash attention and memory footprint reduction.
            </p>
            <div className={`border p-3 rounded-xs text-xs space-y-2 mb-4 ${isLight ? 'bg-[#f0ede5] border-zinc-300' : 'bg-[#0c0d10] border-zinc-800'}`}>
              <div className={`text-center font-mono py-2 border-b font-semibold ${isLight ? 'text-zinc-950 border-zinc-300' : 'text-zinc-200 border-zinc-800'}`}>
                Attention(Q, K, V) = softmax(Q · Kᵀ / √d_k) · V
              </div>
              <div className={`text-[11px] space-y-1 font-sans ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                <p>• Standard self-attention scales O(N²) in memory due to storing the full attention weight matrix.</p>
                <p>• FlashAttention tiles softmax computation into GPU SRAM blocks, reducing HBM memory transfers to O(N).</p>
                <p>• Investigating custom integer quantization (INT4/FP8) for edge deployment on low-power ARM units.</p>
              </div>
            </div>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
              [ WORKING GROUP: APPLIED INTELLIGENCE // WEEK 08 EXPERIMENT ]
            </div>
          </div>
        )}

        {artifactId === 'security' && (
          <div>
            <div className="flex items-center gap-2 text-[#388e3c] text-xs font-bold mb-2">
              <Terminal size={16} />
              <span>NETWORK LOG: CRYPTOGRAPHIC HANDSHAKE AUDIT</span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-zinc-950' : 'text-white'}`}>TLS 1.3 Key Exchange & Packet Header Inspection</h3>
            <p className={`text-xs mb-4 font-sans leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              Wireshark packet capture analysis conducted during a DETOX network security sprint, tracing Curve25519 ephemeral key exchanges.
            </p>
            <div className="bg-[#0b0c0e] border border-zinc-800 p-3 rounded-xs text-[10.5px] leading-relaxed text-zinc-300 font-mono space-y-1 mb-4 shadow-inner">
              <div className="text-zinc-500">// Wireshark Frame 1042</div>
              <div>&gt; TLSv1.3 Record Layer: Handshake Protocol: Client Hello</div>
              <div>&gt; Supported Group: x25519 (0x001d)</div>
              <div>&gt; Cipher Suite: TLS_AES_256_GCM_SHA384 (0x1302)</div>
              <div>&gt; Key Exchange Data: 32 bytes ephemeral public key</div>
            </div>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
              [ LAB: PROTOCOL ANALYSIS & SECURE SYSTEMS ]
            </div>
          </div>
        )}

        {artifactId === 'sticky' && (
          <div>
            <div className="flex items-center gap-2 text-[#d84315] text-xs font-bold mb-2">
              <FileText size={16} />
              <span>LAB NOTEBOOK SCRAP // 20:00 IST</span>
            </div>
            <h3 className={`text-lg font-bold mb-2 ${isLight ? 'text-zinc-950' : 'text-white'}`}>Real Student Engineering Notes</h3>
            <p className={`text-xs mb-4 font-sans leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
              The everyday reality of DETOX: real students in labs, dealing with baud rates, GPIO voltage levels, broken breadboard wires, and late-night deadlines.
            </p>
            <div className="bg-[#fff9c4] text-zinc-900 p-4 rounded-xs font-mono text-xs space-y-2 mb-4 shadow-inner border border-amber-200">
              <div className="font-bold border-b border-zinc-400 pb-1">TODO BEFORE SUBMISSION:</div>
              <div>1. Flash bootloader onto board #2 via ST-Link v2.</div>
              <div>2. Confirm logic level: 3.3V ONLY! Do not fry MCU with 5V.</div>
              <div>3. Clean up PR #18 for lock-free queue benchmarks.</div>
              <div>4. Return logic analyzer probes to lab shelf B-4.</div>
            </div>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-500'}`}>
              [ HUMAN ARTIFACT // NO MARKETING VENEER ]
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className={`mt-6 pt-3 border-t flex justify-end ${isLight ? 'border-zinc-300' : 'border-zinc-800'}`}>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xs transition-colors ${
              isLight
                ? 'bg-zinc-900 hover:bg-black text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-white'
            }`}
          >
            DISMISS SPECIMEN
          </button>
        </div>
      </div>
    </div>
  );
};
