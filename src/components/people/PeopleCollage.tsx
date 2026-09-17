import React, { useState } from 'react';
import { useRouter } from '../../router';
import type { PersonItem } from '../../cms/types';
import { Tag, type TagVariant } from '../../design-system/primitives';
import { useTheme } from '../../ThemeContext';
import { ArrowUpRight, Terminal, Cpu, Compass, Shield, Wrench, Users, CameraOff } from 'lucide-react';

interface PeopleCollageProps {
  people: PersonItem[];
  onSelectPerson?: (person: PersonItem) => void;
  className?: string;
}

const getRoleIcon = (roleArea: string) => {
  switch (roleArea) {
    case 'Technical':
      return Terminal;
    case 'Projects':
      return Cpu;
    case 'Research':
      return Compass;
    case 'Operations':
      return Shield;
    case 'Open Source':
      return Wrench;
    case 'Community':
    default:
      return Users;
  }
};

// Subtle organic rotation angles for controlled irregularity
const ROTATION_ANGLES = [-1.5, 1.2, -0.8, 1.6, -1.1, 0.9, -1.4, 1.3];

export const PeopleCollage: React.FC<PeopleCollageProps> = ({
  people,
  onSelectPerson,
  className = '',
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { navigate } = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedMobileId, setSelectedMobileId] = useState<string | null>(null);

  const activeFocusId = hoveredId || selectedMobileId;

  const handleCardClick = (person: PersonItem) => {
    if (onSelectPerson) {
      onSelectPerson(person);
      return;
    }
    // On touch/mobile: if first tap, focus; if already focused, navigate
    if (window.innerWidth < 768) {
      if (selectedMobileId === person.id) {
        navigate(`/people/${person.slug || person.id}`);
      } else {
        setSelectedMobileId(person.id);
      }
      return;
    }

    // On desktop click: navigate to their profile page
    navigate(`/people/${person.slug || person.id}`);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Mobile Interaction Hint */}
      <div className="sm:hidden mb-4 text-center text-xs text-zinc-500 font-sans">
        Tap a person to focus · Tap again to view profile
      </div>

      {/* Asymmetric Organic Collage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 items-start">
        {people.map((person, index) => {
          const isFocused = activeFocusId === person.id;
          const isReceded = activeFocusId !== null && !isFocused;
          const rotationAngle = ROTATION_ANGLES[index % ROTATION_ANGLES.length];
          const Icon = getRoleIcon(person.roleArea);
          const accent = person.paletteAccent || '#235347';

          // Asymmetric grid layout spans for controlled irregularity
          const spanClass = (() => {
            switch (person.collageSize) {
              case 'featured':
                return 'lg:col-span-6 lg:row-span-2';
              case 'lg':
                return 'lg:col-span-4 lg:row-span-2';
              case 'sm':
                return 'lg:col-span-3';
              case 'md':
              default:
                return 'lg:col-span-4';
            }
          })();

          // Height / aspect ratio based on collage size & crop ratio
          const heightClass = (() => {
            if (person.collageSize === 'featured') return 'min-h-[380px] sm:min-h-[440px]';
            if (person.collageSize === 'lg') return 'min-h-[340px] sm:min-h-[380px]';
            if (person.aspectRatio === 'landscape') return 'min-h-[260px] sm:min-h-[290px]';
            return 'min-h-[300px] sm:min-h-[340px]';
          })();

          return (
            <div
              key={person.id}
              className={`relative transition-all duration-500 ease-out cursor-pointer group ${spanClass}`}
              style={{
                zIndex: isFocused ? 40 : 10 + (index % 5),
                transform: isFocused
                  ? 'scale(1.03) rotate(0deg)'
                  : isReceded
                  ? 'scale(0.96)'
                  : `rotate(${rotationAngle}deg)`,
                opacity: isReceded ? (isLight ? 0.45 : 0.35) : 1,
                filter: isReceded ? 'blur(1.5px)' : 'none',
              }}
              onMouseEnter={() => setHoveredId(person.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleCardClick(person)}
            >
              {/* Photo Card Surface */}
              <div
                className={`relative w-full ${heightClass} rounded-2xl overflow-hidden border transition-all duration-500 shadow-md ${
                  isLight
                    ? 'bg-white border-zinc-200 hover:border-zinc-400'
                    : 'bg-[#121317] border-zinc-800 hover:border-zinc-600'
                }`}
                style={{
                  borderColor: isFocused ? accent : undefined,
                  boxShadow: isFocused
                    ? `0 20px 40px -15px ${accent}40, 0 0 0 1.5px ${accent}`
                    : undefined,
                }}
              >
                {/* Visual Image / Placeholder */}
                {person.photoUrl ? (
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img
                      src={person.photoUrl}
                      alt={person.name}
                      className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                        isFocused ? 'scale-105' : 'scale-100'
                      }`}
                      loading="lazy"
                    />
                    {/* Natural subtle vignette overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                      style={{
                        background: isLight
                          ? 'linear-gradient(to top, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.1) 45%, transparent 100%)'
                          : 'linear-gradient(to top, rgba(11,12,14,0.95) 0%, rgba(11,12,14,0.2) 50%, transparent 100%)',
                      }}
                    />
                  </div>
                ) : (
                  /* Tasteful Temporary Missing Photo Placeholder (Rule #9) */
                  <div
                    className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center transition-colors ${
                      isLight
                        ? 'bg-gradient-to-br from-[#CFD6C4]/30 via-[#faf8f5] to-[#FDE8D3]/40 text-zinc-700'
                        : 'bg-gradient-to-br from-[#163B32]/30 via-[#121316] to-[#0B2B26]/50 text-zinc-300'
                    }`}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-display font-bold text-2xl mb-3 border shadow-inner"
                      style={{
                        borderColor: accent,
                        backgroundColor: isLight ? `${accent}20` : `${accent}30`,
                        color: accent,
                      }}
                    >
                      {person.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-sans uppercase tracking-wider">
                      <CameraOff size={13} />
                      <span>Awaiting Lab Photo</span>
                    </div>
                  </div>
                )}

                {/* Always-Visible Subtle Top Corner Badge */}
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2">
                  <Tag
                    label={person.roleArea}
                    variant={(person.tagVariant as TagVariant) || 'sage'}
                    className="shadow-xs backdrop-blur-xs"
                  />
                </div>

                {/* Subtle Color Dot Anchor */}
                <div
                  className="absolute top-4 right-4 z-20 w-3 h-3 rounded-full border border-white/60 dark:border-black/60 shadow-xs"
                  style={{ backgroundColor: accent }}
                  title={`Color Accent: ${accent}`}
                />

                {/* Bottom Information (Transforms smoothly on focus) */}
                <div className="absolute bottom-0 inset-x-0 p-5 z-20 flex flex-col justify-end">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-[11px] tracking-wide text-zinc-600 dark:text-zinc-400">
                      {person.focusTag}
                    </span>
                    <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
                      <Icon size={12} />
                      <span>{person.roleArea}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-2xl tracking-tight text-zinc-950 dark:text-zinc-50 mb-1.5">
                    {person.name}
                  </h3>

                  {/* Expanded details revealed on hover or tap */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isFocused ? 'max-h-48 opacity-100 pt-2' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="font-sans text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 mb-3 line-clamp-2">
                      {person.oneSentence}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-300/60 dark:border-zinc-700/60">
                      <span className="text-[11px] font-mono text-zinc-500 truncate max-w-[160px]">
                        Active: {person.activeProject}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-xs font-semibold hover:underline shrink-0"
                        style={{ color: accent }}
                      >
                        <span>View Profile</span>
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
