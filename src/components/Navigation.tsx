import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../ThemeContext';

export const Navigation: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, toggleMode } = useTheme();
  const isLight = mode === 'light';

  return (
    <header className="fixed top-7 left-0 right-0 z-40 px-6 sm:px-10 pointer-events-none">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between py-2 border px-4 rounded-xs pointer-events-auto transition-all duration-700 ${
          isLight
            ? 'border-black/10 bg-[#edeae3]/85 backdrop-blur-md shadow-sm'
            : 'border-white/10 bg-[#0d0e10]/80 backdrop-blur-md'
        }`}
      >
        {/* Brand / Identifier */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-xs bg-[#e65100] group-hover:bg-[#ff6f00] transition-colors shadow-[0_0_8px_#e65100]" />
          <span className={`font-mono text-xs font-bold tracking-widest transition-colors duration-700 ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
            DETOX
          </span>
          <span className={`hidden sm:inline-block font-mono text-[9px] tracking-wider pl-2 border-l transition-colors duration-700 ${isLight ? 'text-zinc-600 border-zinc-300' : 'text-zinc-500 border-zinc-800'}`}>
            ENGINEERING COLLECTIVE
          </span>
        </a>

        {/* Center Technical Telemetry (Desktop) */}
        <div className={`hidden lg:flex items-center gap-3 font-mono text-[9px] tracking-wider transition-colors duration-700 ${isLight ? 'text-zinc-600' : 'text-zinc-500'}`}>
          <span>LAT: 28°38'N</span>
          <span>•</span>
          <span>LON: 77°13'E</span>
          <span>•</span>
          <span className="text-[#388e3c] flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#388e3c] animate-pulse" />
            WORKBENCH ACTIVE
          </span>
        </div>

        {/* Desktop Navigation Links + Mode Switcher */}
        <nav className={`hidden md:flex items-center gap-5 font-mono text-[10px] tracking-wider transition-colors duration-700 ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          <a href="#about" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-zinc-100'}`}>
            // ABOUT
          </a>
          <a href="#disciplines" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-zinc-100'}`}>
            // DISCIPLINES
          </a>
          <a href="#philosophy" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-zinc-100'}`}>
            // PHILOSOPHY
          </a>
          <a href="#what-we-do" className={`transition-colors ${isLight ? 'hover:text-zinc-950' : 'hover:text-zinc-100'}`}>
            // WHAT WE DO
          </a>

          {/* Mode Switcher Button */}
          <button
            onClick={toggleMode}
            className={`flex items-center gap-2 px-2.5 py-1 rounded-xs font-mono text-[9px] tracking-wider transition-all duration-300 border ${
              isLight
                ? 'bg-zinc-200/90 hover:bg-zinc-300/80 text-zinc-900 border-zinc-400/80 shadow-2xs'
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60 shadow-2xs'
            }`}
            title={`Switch to ${isLight ? 'Dark' : 'Light'} Mode`}
          >
            {isLight ? (
              <>
                <Sun size={11} className="text-[#d84315]" />
                <span className="font-semibold">MODE: LIGHT</span>
              </>
            ) : (
              <>
                <Moon size={11} className="text-[#f9a825]" />
                <span className="font-semibold">MODE: DARK</span>
              </>
            )}
          </button>

          <a
            href="#colophon"
            className={`px-2.5 py-1 rounded-xs transition-colors border ${
              isLight
                ? 'bg-zinc-900 hover:bg-black text-white border-zinc-900'
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 border-zinc-700/60'
            }`}
          >
            INDEX & CONTACT
          </a>
        </nav>

        {/* Mobile Controls: Mode Switcher + Menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleMode}
            className={`p-1.5 rounded-xs border transition-colors ${
              isLight
                ? 'bg-zinc-200 text-zinc-900 border-zinc-400'
                : 'bg-zinc-800 text-zinc-200 border-zinc-700'
            }`}
            aria-label="Toggle Mode"
          >
            {isLight ? <Sun size={15} className="text-[#d84315]" /> : <Moon size={15} className="text-[#f9a825]" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-1 transition-colors ${isLight ? 'text-zinc-800 hover:text-black' : 'text-zinc-400 hover:text-white'}`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`md:hidden mt-2 p-4 border rounded-xs font-mono text-xs space-y-3 pointer-events-auto shadow-2xl transition-colors duration-700 ${
            isLight
              ? 'bg-[#f4f2ec] border-zinc-300 text-zinc-800'
              : 'bg-[#121316] border-zinc-800 text-zinc-300'
          }`}
        >
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:underline"
          >
            // ABOUT
          </a>
          <a
            href="#disciplines"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:underline"
          >
            // DISCIPLINES
          </a>
          <a
            href="#philosophy"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:underline"
          >
            // PHILOSOPHY
          </a>
          <a
            href="#what-we-do"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:underline"
          >
            // WHAT WE DO
          </a>
          <div className="pt-2 border-t border-zinc-700/40 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">WORKBENCH MODE:</span>
            <button
              onClick={toggleMode}
              className={`px-2 py-1 rounded-xs text-[10px] flex items-center gap-1.5 border ${
                isLight
                  ? 'bg-zinc-200 text-zinc-900 border-zinc-400'
                  : 'bg-zinc-800 text-zinc-200 border-zinc-700'
              }`}
            >
              {isLight ? <Sun size={12} className="text-[#d84315]" /> : <Moon size={12} className="text-[#f9a825]" />}
              <span>{isLight ? 'LIGHT MAT' : 'DARK MAT'}</span>
            </button>
          </div>
          <a
            href="#colophon"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-[#f9a825] font-semibold pt-1"
          >
            INDEX & CONTACT →
          </a>
        </div>
      )}
    </header>
  );
};
