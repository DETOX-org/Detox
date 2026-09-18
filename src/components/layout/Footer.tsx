import React, { useState } from 'react';
import { Check, ArrowUpRight, Mail } from 'lucide-react';
import { useTheme } from '../../ThemeContext';
import { Link } from '../../router';
import { DETOX_PALETTE } from '../../design-system/primitives';

export const Footer: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activePaletteIndex, setActivePaletteIndex] = useState<number | null>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText('collective@detox.build');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0e1014] text-zinc-900 dark:text-zinc-100 transition-colors duration-500 font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-2xl tracking-tight text-zinc-950 dark:text-white">
                DETOX
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#235347]/10 text-[#235347] dark:bg-[#99CDD8]/20 dark:text-[#99CDD8] font-medium font-sans">
                Student Engineering Collective
              </span>
            </div>

            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-sm leading-relaxed">
              A student community building low-level systems, hardware prototypes, machine learning foundations, and security verification. Rigor at Layer N-1.
            </p>

            {/* Email Contact + Social Pill */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={copyEmail}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs border transition-all ${
                  isLight
                    ? 'bg-white border-zinc-300 text-zinc-800 hover:border-[#235347]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-[#235347]'
                }`}
              >
                {copiedEmail ? <Check size={13} className="text-[#235347]" /> : <Mail size={13} />}
                <span>collective@detox.build</span>
                {copiedEmail && <span className="text-[10px] text-[#235347] font-bold">Copied</span>}
              </button>
              <a
                href="https://github.com/detox-build"
                target="_blank"
                rel="noreferrer"
                className={`p-2 rounded-full border transition-colors ${
                  isLight
                    ? 'bg-white border-zinc-300 text-zinc-700 hover:text-black'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
                title="GitHub Organization"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            {/* Explore Column */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider">
                Explore
              </div>
              <div className="flex flex-col space-y-2 text-zinc-600 dark:text-zinc-400">
                <Link to="/about" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">About DETOX</Link>
                <Link to="/projects" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Projects Archive</Link>
                <Link to="/community" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Living Community</Link>
                <Link to="/events" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Event Timeline</Link>
                <Link to="/minds" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Minds Behind DETOX</Link>
              </div>
            </div>

            {/* Opportunities */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider">
                Get Involved
              </div>
              <div className="flex flex-col space-y-2 text-zinc-600 dark:text-zinc-400">
                <Link to="/collaborate" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Build With Us</Link>
                <Link to="/events" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Attend Next Sprint</Link>
                <Link to="/members" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Member Portal</Link>
                <Link to="/admin" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Admin Gateway</Link>
              </div>
            </div>

            {/* Principles */}
            <div className="space-y-3 col-span-2 sm:col-span-1">
              <div className="text-xs font-semibold text-zinc-950 dark:text-zinc-200 uppercase tracking-wider">
                Philosophy
              </div>
              <p className="text-xs leading-relaxed text-zinc-500">
                Layer N-1. Zero marketing slop. Reproducible test suites and open physical prototypes.
              </p>
              <div className="pt-1">
                <Link
                  to="/collaborate"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#235347] dark:text-[#99CDD8] hover:underline"
                >
                  <span>Join the collective</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Full 21-Color Palette Rhythm Accent */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-sans">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              DETOX 21-Tone Identity Spectrum
            </span>
            <span>
              {activePaletteIndex !== null
                ? `${DETOX_PALETTE[activePaletteIndex].name} (${DETOX_PALETTE[activePaletteIndex].hex}) · ${DETOX_PALETTE[activePaletteIndex].role}`
                : 'Hover any tone to inspect visual role'}
            </span>
          </div>
          <div className="grid grid-cols-7 sm:grid-cols-21 h-3 rounded-full overflow-hidden shadow-xs border border-zinc-200 dark:border-zinc-800">
            {DETOX_PALETTE.map((color, idx) => (
              <div
                key={color.hex}
                onMouseEnter={() => setActivePaletteIndex(idx)}
                onMouseLeave={() => setActivePaletteIndex(null)}
                style={{ backgroundColor: color.hex }}
                title={`${color.name} (${color.hex}) - ${color.role}`}
                className="h-full hover:scale-y-150 transition-all origin-bottom cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Creator Signature & Direct Contact */}
        <div className="pt-8 pb-3 border-t border-zinc-200/70 dark:border-zinc-800/80 flex flex-col items-center justify-center text-center gap-1.5 text-xs">
          <div className="text-zinc-600 dark:text-zinc-400">
            Built &amp; maintained by <span className="font-semibold text-zinc-900 dark:text-zinc-100">Ekansh Gharde</span>
          </div>
          <a
            href="https://www.linkedin.com/in/ekansh-gharde/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 font-medium text-[#235347] dark:text-[#99CDD8] hover:text-[#163B32] dark:hover:text-[#C8B6FE] transition-colors"
          >
            <span>Contact / Connect</span>
            <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4 pt-2">
          <div>
            © {new Date().getFullYear()} DETOX Student Engineering Collective. Open Source & Open Hardware.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/about" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Founding Statement</Link>
            <span>•</span>
            <Link to="/collaborate" className="hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors">Co-Building Tracks</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
