import React from 'react';
import { useTheme } from '../ThemeContext';

/**
 * Reusable Page Container
 * Provides consistent margins, coordinate rulers, and theme transitions
 */
export const PageContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  maxWidth?: '5xl' | '6xl' | '7xl' | 'full';
}> = ({ children, className = '', maxWidth = '6xl' }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const maxWClass = {
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div
      className={`relative w-full min-h-[calc(100vh-140px)] pt-36 sm:pt-40 pb-32 px-6 sm:px-12 lg:px-20 transition-colors duration-700 ${
        isLight ? 'bg-[#faf8f5] text-[#18181b]' : 'bg-[#0b0c0e] text-[#d4d4d8]'
      } ${className}`}
    >
      <div className={`relative ${maxWClass} mx-auto z-10`}>
        {children}
      </div>
    </div>
  );
};

/**
 * Editorial Section Header
 */
export const SectionHeader: React.FC<{
  docId?: string;
  categoryTag?: string;
  title: string;
  lead?: string;
  statusText?: string;
  className?: string;
}> = ({ categoryTag, title, lead, statusText, className = '' }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div className={`border-b pb-8 mb-12 transition-colors duration-700 ${isLight ? 'border-zinc-300' : 'border-zinc-800'} ${className}`}>
      {/* Category / Status Strip */}
      {(categoryTag || statusText) && (
        <div className="flex flex-wrap items-center justify-between text-xs mb-4 gap-2">
          {categoryTag && (
            <span
              className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isLight ? '#CFD6C4' : '#163B32',
                color: isLight ? '#0B2B26' : '#99CDD8',
              }}
            >
              {categoryTag}
            </span>
          )}

          {statusText && (
            <div className="flex items-center gap-2 text-zinc-500 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#235347]" />
              <span>{statusText}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Editorial Headline */}
      <h1
        className={`text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight font-display leading-[1.08] transition-colors duration-700 ${
          isLight ? 'text-zinc-950' : 'text-zinc-100'
        }`}
      >
        {title}
      </h1>

      {lead && (
        <p
          className={`mt-4 font-sans text-base sm:text-lg max-w-3xl leading-relaxed transition-colors duration-700 ${
            isLight ? 'text-zinc-700' : 'text-zinc-400'
          }`}
        >
          {lead}
        </p>
      )}
    </div>
  );
};

/**
 * Clean Editorial Exhibition Card
 */
export const DossierCard: React.FC<{
  children: React.ReactNode;
  clipLabel?: string;
  className?: string;
  onClick?: () => void;
}> = ({ children, clipLabel, className = '', onClick }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  return (
    <div
      onClick={onClick}
      className={`border relative rounded-xl transition-all duration-300 overflow-hidden ${
        isLight
          ? 'bg-white/80 border-zinc-200/80 shadow-sm text-zinc-900 hover:shadow-md'
          : 'bg-[#121316] border-zinc-800 shadow-xl text-zinc-200 hover:border-zinc-700'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {clipLabel && (
        <div
          className={`text-[10px] font-semibold tracking-wider uppercase px-4 pt-3 pb-1 transition-colors ${
            isLight ? 'text-zinc-500' : 'text-zinc-400'
          }`}
        >
          {clipLabel}
        </div>
      )}
      {children}
    </div>
  );
};

export type TagVariant =
  | 'green'
  | 'pine'
  | 'night'
  | 'laurel'
  | 'slate'
  | 'sage'
  | 'cream'
  | 'peach'
  | 'blue'
  | 'lilac'
  | 'wisteria'
  | 'lavender'
  | 'pinkCloud'
  | 'coral'
  | 'sky'
  | 'mauve'
  | 'cottonPink'
  | 'dustyRose'
  | 'orchid'
  | 'teal'
  | 'mint';

export interface PaletteColorDef {
  id: TagVariant;
  name: string;
  hex: string;
  group: 'structural' | 'editorial' | 'lavender_pink_blue' | 'accent_green';
  role: string;
}

export const DETOX_PALETTE: PaletteColorDef[] = [
  // Primary / Structural
  { id: 'green', name: 'Deep Forest', hex: '#235347', group: 'structural', role: 'Primary structural anchor & buttons' },
  { id: 'pine', name: 'Pine', hex: '#163B32', group: 'structural', role: 'Deep structural surface & contrast frames' },
  { id: 'night', name: 'Night Green', hex: '#0B2B26', group: 'structural', role: 'Deepest container background & dark badges' },
  { id: 'laurel', name: 'Laurel Green', hex: '#6B9080', group: 'structural', role: 'Systems software category & subtle borders' },
  { id: 'slate', name: 'Slate Sage', hex: '#657166', group: 'structural', role: 'Security protocols & metadata labels' },

  // Soft / Editorial
  { id: 'sage', name: 'Soft Sage', hex: '#CFD6C4', group: 'editorial', role: 'Light mode card borders & subtle surface tints' },
  { id: 'cream', name: 'Warm Cream', hex: '#FDE8D3', group: 'editorial', role: 'Editorial card backgrounds & workshop highlights' },
  { id: 'peach', name: 'Peach Terracotta', hex: '#F3C3B2', group: 'editorial', role: 'Hardware & silicon category badge & event pills' },
  { id: 'blue', name: 'Mist Blue', hex: '#99CDD8', group: 'editorial', role: 'Telemetry tags, image overlays & scroll indicators' },

  // Lavender / Pink / Blue
  { id: 'lilac', name: 'Soft Lilac', hex: '#B8C0FF', group: 'lavender_pink_blue', role: 'Research projects & bio modal accents' },
  { id: 'wisteria', name: 'Wisteria', hex: '#C8B6FE', group: 'lavender_pink_blue', role: 'Machine learning cards & collage highlight aura' },
  { id: 'lavender', name: 'Lavender Mist', hex: '#E7C5FF', group: 'lavender_pink_blue', role: 'Paper reading salon badges & study notes' },
  { id: 'pinkCloud', name: 'Pink Cloud', hex: '#FED5FF', group: 'lavender_pink_blue', role: 'Open bench weekend tags & light surface tint' },
  { id: 'coral', name: 'Blush Coral', hex: '#FFB7C3', group: 'lavender_pink_blue', role: 'Hardware prototype badge & sprint ribbon' },
  { id: 'sky', name: 'Sky Pastel', hex: '#A2D2FF', group: 'lavender_pink_blue', role: 'Security verification badge & link hover glow' },
  { id: 'mauve', name: 'Mauve Mist', hex: '#CDB4DB', group: 'lavender_pink_blue', role: 'Audio / DSP / Tooling projects' },
  { id: 'cottonPink', name: 'Cotton Pink', hex: '#FFC8DD', group: 'lavender_pink_blue', role: '36h unhinged sprint badge' },
  { id: 'dustyRose', name: 'Dusty Rose', hex: '#ECA6B7', group: 'lavender_pink_blue', role: 'Compiler & LLVM toolchain badges' },
  { id: 'orchid', name: 'Soft Orchid', hex: '#E8BBCF', group: 'lavender_pink_blue', role: 'Lab operations & equipment calibration' },

  // Accent Greens
  { id: 'teal', name: 'Emerald Teal', hex: '#38B2A2', group: 'accent_green', role: 'Active builder status & verified indicators' },
  { id: 'mint', name: 'Spring Mint', hex: '#4CC8A3', group: 'accent_green', role: 'Benchmark performance pill & live metrics' },
];

/**
 * Curated Palette Tag
 */
export const Tag: React.FC<{
  label: string;
  variant?: TagVariant;
  className?: string;
}> = ({ label, variant = 'green', className = '' }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // Palette variant lookup
  const tagStyles: Record<TagVariant, { bg: string; color: string; border: string }> = {
    green: {
      bg: isLight ? 'rgba(35, 83, 71, 0.1)' : 'rgba(35, 83, 71, 0.35)',
      color: isLight ? '#0B2B26' : '#CFD6C4',
      border: isLight ? 'rgba(35, 83, 71, 0.25)' : '#235347',
    },
    pine: {
      bg: isLight ? 'rgba(22, 59, 50, 0.12)' : 'rgba(22, 59, 50, 0.45)',
      color: isLight ? '#0B2B26' : '#99CDD8',
      border: isLight ? 'rgba(22, 59, 50, 0.3)' : '#163B32',
    },
    night: {
      bg: isLight ? 'rgba(11, 43, 38, 0.1)' : 'rgba(11, 43, 38, 0.55)',
      color: isLight ? '#0B2B26' : '#CFD6C4',
      border: isLight ? 'rgba(11, 43, 38, 0.3)' : '#0B2B26',
    },
    laurel: {
      bg: isLight ? 'rgba(107, 144, 128, 0.15)' : 'rgba(107, 144, 128, 0.28)',
      color: isLight ? '#1f3c31' : '#CFD6C4',
      border: isLight ? 'rgba(107, 144, 128, 0.35)' : '#6B9080',
    },
    slate: {
      bg: isLight ? 'rgba(101, 113, 102, 0.12)' : 'rgba(101, 113, 102, 0.25)',
      color: isLight ? '#2d332d' : '#CFD6C4',
      border: isLight ? 'rgba(101, 113, 102, 0.25)' : '#657166',
    },
    sage: {
      bg: isLight ? 'rgba(207, 214, 196, 0.4)' : 'rgba(207, 214, 196, 0.15)',
      color: isLight ? '#163B32' : '#CFD6C4',
      border: isLight ? '#CFD6C4' : 'rgba(207, 214, 196, 0.3)',
    },
    cream: {
      bg: isLight ? 'rgba(253, 232, 211, 0.55)' : 'rgba(253, 232, 211, 0.15)',
      color: isLight ? '#5c3a1c' : '#FDE8D3',
      border: isLight ? 'rgba(253, 232, 211, 0.8)' : 'rgba(253, 232, 211, 0.3)',
    },
    peach: {
      bg: isLight ? 'rgba(243, 195, 178, 0.35)' : 'rgba(243, 195, 178, 0.18)',
      color: isLight ? '#7c3826' : '#FDE8D3',
      border: isLight ? 'rgba(243, 195, 178, 0.5)' : 'rgba(243, 195, 178, 0.3)',
    },
    blue: {
      bg: isLight ? 'rgba(153, 205, 216, 0.25)' : 'rgba(153, 205, 216, 0.18)',
      color: isLight ? '#1a5460' : '#99CDD8',
      border: isLight ? 'rgba(153, 205, 216, 0.4)' : 'rgba(153, 205, 216, 0.3)',
    },
    lilac: {
      bg: isLight ? 'rgba(184, 192, 255, 0.28)' : 'rgba(184, 192, 255, 0.2)',
      color: isLight ? '#38407a' : '#B8C0FF',
      border: isLight ? 'rgba(184, 192, 255, 0.45)' : 'rgba(184, 192, 255, 0.35)',
    },
    wisteria: {
      bg: isLight ? 'rgba(200, 182, 254, 0.28)' : 'rgba(200, 182, 254, 0.2)',
      color: isLight ? '#4c397c' : '#C8B6FE',
      border: isLight ? 'rgba(200, 182, 254, 0.45)' : 'rgba(200, 182, 254, 0.35)',
    },
    lavender: {
      bg: isLight ? 'rgba(231, 197, 255, 0.3)' : 'rgba(231, 197, 255, 0.18)',
      color: isLight ? '#5a2d7a' : '#E7C5FF',
      border: isLight ? 'rgba(231, 197, 255, 0.45)' : 'rgba(231, 197, 255, 0.3)',
    },
    pinkCloud: {
      bg: isLight ? 'rgba(254, 213, 255, 0.35)' : 'rgba(254, 213, 255, 0.16)',
      color: isLight ? '#662b66' : '#FED5FF',
      border: isLight ? 'rgba(254, 213, 255, 0.5)' : 'rgba(254, 213, 255, 0.28)',
    },
    coral: {
      bg: isLight ? 'rgba(255, 183, 195, 0.35)' : 'rgba(255, 183, 195, 0.18)',
      color: isLight ? '#7c2838' : '#FFB7C3',
      border: isLight ? 'rgba(255, 183, 195, 0.5)' : 'rgba(255, 183, 195, 0.3)',
    },
    sky: {
      bg: isLight ? 'rgba(162, 210, 255, 0.28)' : 'rgba(162, 210, 255, 0.18)',
      color: isLight ? '#1a4e7a' : '#A2D2FF',
      border: isLight ? 'rgba(162, 210, 255, 0.45)' : 'rgba(162, 210, 255, 0.3)',
    },
    mauve: {
      bg: isLight ? 'rgba(205, 180, 219, 0.3)' : 'rgba(205, 180, 219, 0.2)',
      color: isLight ? '#543b60' : '#CDB4DB',
      border: isLight ? 'rgba(205, 180, 219, 0.45)' : 'rgba(205, 180, 219, 0.35)',
    },
    cottonPink: {
      bg: isLight ? 'rgba(255, 200, 221, 0.35)' : 'rgba(255, 200, 221, 0.18)',
      color: isLight ? '#7a314b' : '#FFC8DD',
      border: isLight ? 'rgba(255, 200, 221, 0.5)' : 'rgba(255, 200, 221, 0.3)',
    },
    dustyRose: {
      bg: isLight ? 'rgba(236, 166, 183, 0.32)' : 'rgba(236, 166, 183, 0.2)',
      color: isLight ? '#6b273b' : '#ECA6B7',
      border: isLight ? 'rgba(236, 166, 183, 0.48)' : 'rgba(236, 166, 183, 0.32)',
    },
    orchid: {
      bg: isLight ? 'rgba(232, 187, 207, 0.32)' : 'rgba(232, 187, 207, 0.2)',
      color: isLight ? '#662d47' : '#E8BBCF',
      border: isLight ? 'rgba(232, 187, 207, 0.48)' : 'rgba(232, 187, 207, 0.32)',
    },
    teal: {
      bg: isLight ? 'rgba(56, 178, 162, 0.2)' : 'rgba(56, 178, 162, 0.25)',
      color: isLight ? '#0f4f46' : '#38B2A2',
      border: isLight ? 'rgba(56, 178, 162, 0.4)' : '#38B2A2',
    },
    mint: {
      bg: isLight ? 'rgba(76, 200, 163, 0.2)' : 'rgba(76, 200, 163, 0.25)',
      color: isLight ? '#0f5240' : '#4CC8A3',
      border: isLight ? 'rgba(76, 200, 163, 0.4)' : '#4CC8A3',
    },
  };

  const current = tagStyles[variant] || tagStyles.green;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide border transition-colors ${className}`}
      style={{
        backgroundColor: current.bg,
        color: current.color,
        borderColor: current.border,
      }}
    >
      {label}
    </span>
  );
};

/**
 * Editorial Photographic Frame
 * Displays real photographs with elegant captioning or clean contextual visual fallbacks
 */
export const PhotoFrame: React.FC<{
  src?: string;
  alt?: string;
  label?: string;
  aspectRatio?: string;
  badge?: string;
  badgeVariant?: TagVariant;
  caption?: string;
  location?: string;
  date?: string;
  accentBorderColor?: string;
  className?: string;
}> = ({
  src,
  alt,
  label,
  aspectRatio = 'aspect-[16/10]',
  badge,
  badgeVariant = 'green',
  caption,
  location,
  date,
  accentBorderColor,
  className = '',
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const displayTitle = label || alt || 'Project Exploration';

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all duration-300 relative group border ${
        isLight
          ? 'bg-white/80 border-zinc-200 shadow-sm'
          : 'bg-[#121316] border-zinc-800/80 shadow-md'
      } ${className}`}
      style={accentBorderColor ? { borderColor: accentBorderColor } : undefined}
    >
      {/* Top Header if badge or date present */}
      {(badge || location) && (
        <div className="flex items-center justify-between text-xs text-zinc-500 py-2 px-3 border-b border-inherit">
          <Tag label={badge || ''} variant={badgeVariant} />
          <span className="text-[11px]">{location || date}</span>
        </div>
      )}

      {/* Image container */}
      <div className={`w-full ${aspectRatio} relative overflow-hidden bg-zinc-900/10`}>
        {src ? (
          <img
            src={src}
            alt={alt || displayTitle}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Clean graphic composition fallback */
          <div
            className={`w-full h-full flex flex-col justify-between p-6 transition-colors ${
              isLight
                ? 'bg-gradient-to-br from-[#CFD6C4]/30 via-[#faf8f5] to-[#FDE8D3]/40 text-zinc-800'
                : 'bg-gradient-to-br from-[#163B32]/40 via-[#101114] to-[#0B2B26]/60 text-zinc-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="w-2.5 h-2.5 rounded-full bg-[#235347]" />
              <span className="text-[11px] font-sans tracking-wide text-zinc-500 uppercase">
                {badge || 'Lab Activity'}
              </span>
            </div>

            <div>
              <div className="font-display text-lg font-bold tracking-tight mb-1">
                {displayTitle}
              </div>
              {caption && (
                <div className="text-xs text-zinc-500 leading-relaxed max-w-sm">
                  {caption}
                </div>
              )}
            </div>

            <div className="text-[10px] text-zinc-500">
              {location || date || 'DETOX Lab Session'}
            </div>
          </div>
        )}
      </div>

      {/* Caption strip */}
      {caption && src && (
        <div className="py-2.5 px-3.5 flex items-center justify-between text-xs text-zinc-500 border-t border-inherit">
          <span className="text-zinc-600 dark:text-zinc-400 truncate pr-2">{caption}</span>
          {date && <span className="text-[11px] shrink-0 text-zinc-400">{date}</span>}
        </div>
      )}
    </div>
  );
};

/**
 * Clear Metric Block
 */
export const MetricBlock: React.FC<{
  value: string;
  label: string;
  subnote?: string;
  detail?: string;
}> = ({ value, label, subnote, detail }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const displayNote = subnote || detail;

  return (
    <div
      className={`p-6 rounded-xl border transition-all duration-300 ${
        isLight
          ? 'bg-white/80 border-zinc-200 text-zinc-900 shadow-sm'
          : 'bg-[#121316] border-zinc-800 text-zinc-100 shadow-md'
      }`}
    >
      <div className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-[#235347] mb-1">
        {value}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wider mb-1.5 text-zinc-700 dark:text-zinc-300">
        {label}
      </div>
      {displayNote && (
        <div className="text-xs font-sans text-zinc-500 leading-relaxed">
          {displayNote}
        </div>
      )}
    </div>
  );
};

