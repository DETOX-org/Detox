import React, { useState, useEffect } from 'react';
import { Terminal, Check, Copy } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export const FooterColophon: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [currentTime, setCurrentTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');
  const [terminalInput, setTerminalInput] = useState<string>('');
  const [terminalLogs, setTerminalLogs] = useState<Array<{ text: string; type?: 'in' | 'out' | 'err' | 'accent' }>>([
    { text: 'DETOX WORKBENCH TTY1 // v2.4-RELEASE (x86_64)', type: 'accent' },
    { text: 'Type "help" to view available workbench commands.', type: 'out' },
  ]);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
      setUtcTime(now.toUTCString().split(' ')[4] + ' UTC');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...terminalLogs, { text: `> ${terminalInput}`, type: 'in' as const }];

    switch (cmd) {
      case 'help':
        newLogs.push(
          { text: 'AVAILABLE COMMANDS:', type: 'accent' },
          { text: '  about        - View identity of DETOX', type: 'out' },
          { text: '  disciplines  - List 4 active research areas', type: 'out' },
          { text: '  motto        - The core workbench cycle', type: 'out' },
          { text: '  contact      - How to reach the student collective', type: 'out' },
          { text: '  clear        - Reset this terminal session', type: 'out' }
        );
        break;
      case 'about':
        newLogs.push({
          text: 'DETOX is a student-led engineering collective. A physical and computational workbench where computer science, silicon, networks, and AI are built from first principles.',
          type: 'out',
        });
        break;
      case 'disciplines':
        newLogs.push(
          { text: '1. Systems & Low-Level Computing (Kernels, Compilers, Concurrency)', type: 'out' },
          { text: '2. Embedded Systems & Hardware (Custom PCBs, Microcontrollers, Signal Analysis)', type: 'out' },
          { text: '3. Machine Learning & Mathematics (Attention Kernels, Loss Dynamics, Quantization)', type: 'out' },
          { text: '4. Security, Cryptography & Networks (Protocol Fuzzing, Binary Auditing, Formal Proofs)', type: 'out' }
        );
        break;
      case 'motto':
        newLogs.push({
          text: 'LEARN → EXPERIMENT → BUILD → BREAK → FIX → SHIP',
          type: 'accent',
        });
        break;
      case 'contact':
        newLogs.push({
          text: 'Direct communication: collective@detox.build // Response SLA: 24h by working group lead',
          type: 'accent',
        });
        break;
      case 'clear':
        setTerminalLogs([]);
        setTerminalInput('');
        return;
      default:
        newLogs.push({
          text: `Unknown command "${cmd}". Type "help" for a list of commands.`,
          type: 'err',
        });
    }

    setTerminalLogs(newLogs);
    setTerminalInput('');
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('collective@detox.build');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer
      id="colophon"
      className={`relative w-full py-20 px-6 sm:px-12 lg:px-20 border-t font-mono transition-colors duration-700 ${
        isLight
          ? 'bg-[#ded9cf] text-zinc-700 border-zinc-300'
          : 'bg-[#08090b] text-zinc-400 border-zinc-800'
      }`}
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Top: Minimalist Technical Terminal Hook */}
        <div
          className={`border p-5 sm:p-6 rounded-xs shadow-2xl transition-colors duration-700 ${
            isLight
              ? 'border-zinc-400 bg-[#16181d] text-zinc-300 shadow-zinc-300/40'
              : 'border-zinc-800 bg-[#0e1014]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-[#388e3c]" />
              <span className="text-zinc-200 font-bold">TTY1: WORKBENCH INTERFACE</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span>STATUS: ONLINE</span>
              <span>BAUD: 115200</span>
            </div>
          </div>

          {/* Terminal log output */}
          <div className="h-36 sm:h-44 overflow-y-auto text-[11px] space-y-1 pr-2 font-mono scrollbar-thin">
            {terminalLogs.map((log, i) => (
              <div
                key={i}
                className={
                  log.type === 'in'
                    ? 'text-zinc-100 font-semibold'
                    : log.type === 'accent'
                    ? 'text-[#f9a825]'
                    : log.type === 'err'
                    ? 'text-[#e53935]'
                    : 'text-zinc-400'
                }
              >
                {log.text}
              </div>
            ))}
          </div>

          {/* Terminal Input Form */}
          <form onSubmit={handleCommand} className="mt-3 pt-3 border-t border-zinc-800 flex items-center gap-2">
            <span className="text-[#388e3c] font-bold text-xs">&gt;</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="type 'help' or 'contact'..."
              className="flex-1 bg-transparent text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] rounded-xs transition-colors"
            >
              EXECUTE
            </button>
          </form>
        </div>

        {/* Middle: Colophon Grid & Outreach Channels */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs font-mono border-b pb-12 transition-colors duration-700 ${
            isLight ? 'border-zinc-300' : 'border-zinc-800'
          }`}
        >
          
          {/* Col 1: Identity */}
          <div className="space-y-3">
            <div className={`font-bold tracking-wider flex items-center gap-2 ${isLight ? 'text-zinc-950' : 'text-zinc-200'}`}>
              <span className="w-2 h-2 bg-[#d84315] rounded-xs" />
              <span>DETOX COLLECTIVE</span>
            </div>
            <p className={`text-[11px] font-sans leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
              A serious, human, student-led engineering environment. Not a corporation. Not a hype incubator.
            </p>
            <div className={`text-[10px] ${isLight ? 'text-zinc-500' : 'text-zinc-600'}`}>
              ORIGIN: 2026 // PUBLIC EDITION
            </div>
          </div>

          {/* Col 2: For Students */}
          <div className="space-y-2">
            <div className={`font-bold text-[11px] tracking-wider ${isLight ? 'text-zinc-950' : 'text-zinc-300'}`}>
              // FOR STUDENTS
            </div>
            <p className={`text-[11px] font-sans leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
              If you want to build hardware, write compilers, or train architectures from first principles:
            </p>
            <a
              href="mailto:collective@detox.build?subject=Student%20Application%20to%20DETOX"
              className="inline-block text-[#d84315] hover:underline text-[11px] font-mono mt-1 font-semibold"
            >
              apply.workbench() →
            </a>
          </div>

          {/* Col 3: For Institutions */}
          <div className="space-y-2">
            <div className={`font-bold text-[11px] tracking-wider ${isLight ? 'text-zinc-950' : 'text-zinc-300'}`}>
              // FOR INSTITUTIONS
            </div>
            <p className={`text-[11px] font-sans leading-relaxed ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
              Colleges, research labs, and technical foundations looking to partner or sponsor physical equipment:
            </p>
            <a
              href="mailto:partnerships@detox.build?subject=Institutional%20Collaboration"
              className="inline-block text-[#388e3c] hover:underline text-[11px] font-mono mt-1 font-semibold"
            >
              partner.institutional() →
            </a>
          </div>

          {/* Col 4: Telemetry & Live Clocks */}
          <div
            className={`space-y-2 p-4 border rounded-xs transition-colors duration-700 ${
              isLight
                ? 'bg-[#faf8f5] border-zinc-300 shadow-xs'
                : 'bg-[#0e1013] border-zinc-800/90'
            }`}
          >
            <div
              className={`font-semibold text-[10px] border-b pb-1 flex justify-between transition-colors duration-700 ${
                isLight ? 'text-zinc-700 border-zinc-300' : 'text-zinc-400 border-zinc-800'
              }`}
            >
              <span>TELEMETRY</span>
              <span className="text-[#388e3c]">LIVE</span>
            </div>
            <div className={`text-[10px] space-y-1 ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
              <div className="flex justify-between">
                <span>LOCAL TIME:</span>
                <span className={`font-bold ${isLight ? 'text-zinc-950' : 'text-zinc-300'}`}>{currentTime || '--:--:--'}</span>
              </div>
              <div className="flex justify-between">
                <span>UTC CLOCK:</span>
                <span className={`font-bold ${isLight ? 'text-zinc-950' : 'text-zinc-300'}`}>{utcTime || '--:--:--'}</span>
              </div>
              <div className="flex justify-between">
                <span>COORDINATES:</span>
                <span className={isLight ? 'text-zinc-700' : 'text-zinc-400'}>28°38'N 77°13'E</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Colophon Bar */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between text-[10px] gap-4 transition-colors duration-700 ${
            isLight ? 'text-zinc-600' : 'text-zinc-600'
          }`}
        >
          <div>
            DETOX ENGINEERING WORKBENCH © 2026 // OPEN HARDWARE & PERMISSIVE SOURCE
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={copyEmail}
              className={`flex items-center gap-1.5 transition-colors ${
                isLight ? 'text-zinc-700 hover:text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {copiedEmail ? <Check size={12} className="text-[#388e3c]" /> : <Copy size={12} />}
              <span>collective@detox.build</span>
            </button>
            <span>•</span>
            <span className={isLight ? 'text-zinc-500' : 'text-zinc-500'}>SCALE: 1:1 METRIC</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
