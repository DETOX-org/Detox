import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from '../../router';
import type { PersonItem, CollageStageSettings, DecorativeElement } from '../../cms/types';
import { resolvePersonCutout } from '../../cms/imageUtils';
import { useTheme } from '../../ThemeContext';
import { useCms } from '../../cms/CmsContext';
import { ArrowUpRight, Sparkles, Compass } from 'lucide-react';

interface PeopleCutoutCollageProps {
  people: PersonItem[];
  stageSettings?: CollageStageSettings;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
  onSelectPerson?: (person: PersonItem) => void;
  className?: string;
  stageHeightClass?: string;
}

interface CutoutItemProps {
  person: PersonItem;
  index: number;
  totalCount: number;
  isFocused: boolean;
  isReceded: boolean;
  isLight: boolean;
  isGardenBg: boolean;
  cutoutSrc: string;
  isImageFailed: boolean;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
  stageSettings?: CollageStageSettings;
  onImageError: (id: string) => void;
  onHover: (id: string) => void;
  onSelect: (person: PersonItem, e: React.MouseEvent | React.KeyboardEvent) => void;
  isReducedMotion: boolean;
}

// Memoized individual builder cutout to avoid re-rendering untouched people
const PersonCutoutItem = React.memo<CutoutItemProps>(({
  person,
  index,
  totalCount,
  isFocused,
  isReceded,
  isLight,
  isGardenBg,
  cutoutSrc,
  isImageFailed,
  viewportMode = 'desktop',
  stageSettings,
  onImageError,
  onHover,
  onSelect,
  isReducedMotion,
}) => {
  const accent = person.paletteAccent || '#38B2A2';
  const isMobileView = viewportMode === 'mobile';

  // Responsive stage coordinate positioning (with mobile override if defined)
  const posX = (isMobileView && person.mobilePosition?.x !== undefined)
    ? person.mobilePosition.x
    : (person.stagePosition?.x ?? (8 + (index * 84) / Math.max(1, totalCount - 1)));

  const posY = (isMobileView && person.mobilePosition?.y !== undefined)
    ? person.mobilePosition.y
    : (person.stagePosition?.y ?? (index % 2 === 0 ? 10 : 3));

  const baseScale = (isMobileView && person.mobileScale !== undefined)
    ? person.mobileScale
    : ((person.stageScale || 1.1) * (person.isForegroundAnchor || person.isFeatured ? 1.08 : 1.0));

  const baseRotation = isReducedMotion
    ? 0
    : (isMobileView && person.mobileRotation !== undefined)
    ? person.mobileRotation
    : (person.stageRotation ?? (index % 2 === 0 ? -2.2 : 2.2));

  const zIndex = isFocused ? 50 : (person.stageZIndex || (person.isForegroundAnchor ? 15 : 10));

  // Focus behavior settings from stage or person
  const hoverConfig = stageSettings?.hoverBehavior;
  const focusScaleMultiplier = hoverConfig?.focusScale === 'subtle' ? 1.03 : hoverConfig?.focusScale === 'prominent' ? 1.10 : 1.06;
  const recessionOpacityVal = hoverConfig?.recession === 'subtle' ? (isLight ? 0.65 : 0.55) : hoverConfig?.recession === 'strong' ? (isLight ? 0.32 : 0.22) : (isLight ? 0.50 : 0.38);
  const liftDistancePx = hoverConfig?.lift === 'low' ? '-8px' : hoverConfig?.lift === 'high' ? '-20px' : '-14px';

  // Compute transform and visual styling with GPU acceleration (translate3d)
  const currentScale = isReducedMotion
    ? 1
    : isFocused
    ? baseScale * focusScaleMultiplier
    : isReceded
    ? baseScale * 0.96
    : baseScale;

  const currentTranslateY = isReducedMotion
    ? '0px'
    : isFocused
    ? liftDistancePx
    : '0px';

  const currentRotation = isReducedMotion
    ? 0
    : isFocused
    ? 0
    : isReceded
    ? baseRotation * 0.85
    : baseRotation;

  const currentOpacity = isReceded ? recessionOpacityVal : (person.customOpacity ?? 1);

  // Style filters based on cutoutStyle, shadowSettings, and edgeOutline
  const getFilterStyles = () => {
    if (isReceded) {
      return hoverConfig?.blur === 'soft' ? 'blur(1.5px) grayscale(20%)' : hoverConfig?.blur === 'subtle' ? 'blur(0.8px) grayscale(15%)' : 'grayscale(15%)';
    }

    const filters: string[] = [];

    // Base drop shadow - tinted to garden greens / ambient ground when garden is active
    if (person.shadowSettings?.enabled !== false) {
      if (person.shadowSettings) {
        const str = (person.shadowSettings.strength ?? 30) / 100;
        const sft = person.shadowSettings.softness ?? 18;
        const off = person.shadowSettings.offset ?? 12;
        filters.push(`drop-shadow(0 ${off}px ${sft}px rgba(${isGardenBg ? '6,18,12' : '0,0,0'},${str}))`);
      } else if (person.cutoutStyle === 'shadowed') {
        filters.push(`drop-shadow(0 24px 32px rgba(${isGardenBg ? '6,18,12' : '0,0,0'},0.38))`);
      } else if (isGardenBg) {
        filters.push('drop-shadow(0 14px 22px rgba(6,20,14,0.30))');
      } else {
        filters.push('drop-shadow(0 12px 18px rgba(0,0,0,0.18))');
      }
    }

    // Edge outline style
    const edge = person.edgeOutline || (person.cutoutStyle === 'sticker' ? 'white' : person.cutoutStyle === 'paper' ? 'thin-paper' : person.cutoutStyle === 'raw-cut' ? 'palette-accent' : 'none');
    if (edge === 'white') {
      filters.push('drop-shadow(0 0 1.5px #ffffff)');
    } else if (edge === 'thin-paper') {
      filters.push('drop-shadow(0 0 1px rgba(245,240,230,0.85))');
    } else if (edge === 'palette-accent') {
      filters.push(`drop-shadow(0 0 2px ${accent})`);
    }

    // Focused halo
    if (isFocused) {
      filters.push(`drop-shadow(0 20px 28px rgba(${isGardenBg ? '4,16,10' : '0,0,0'},0.36))`);
      filters.push(`drop-shadow(0 0 14px ${accent}70)`);
    }

    return filters.join(' ');
  };

  const currentFilter = getFilterStyles();

  const handlePointerEnter = (e: React.PointerEvent) => {
    // Only trigger hover on mouse/pen pointers, avoid touch device phantom events
    if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
      onHover(person.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(person, e);
    }
  };

  const hasCutout = !!cutoutSrc && !isImageFailed;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Builder: ${person.name}, ${person.roleArea} · ${person.focusTag}`}
      onPointerEnter={handlePointerEnter}
      onClick={(e) => onSelect(person, e)}
      onKeyDown={handleKeyDown}
      onFocus={() => onHover(person.id)}
      className="absolute cursor-pointer transition-all duration-300 ease-out group outline-none focus-visible:ring-2 focus-visible:ring-[#38B2A2] focus-visible:rounded-2xl"
      style={{
        left: `${posX}%`,
        bottom: `${posY}%`,
        transform: `translate3d(-50%, ${currentTranslateY}, 0) scale(${currentScale}) rotate(${currentRotation}deg)`,
        transformOrigin: 'bottom center',
        zIndex,
        opacity: currentOpacity,
        filter: currentFilter,
        willChange: 'transform, opacity',
      }}
    >
      {/* Physical Scissor-Cut Silhouette (STRICTLY NO BOX CONTAINER) */}
      <div className="relative inline-block pointer-events-auto">
        {/* Environmental Ground Contact Shadow (Soft organic grass occlusion beneath feet) */}
        {isGardenBg && (
          <div
            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-none rounded-[100%] transition-all duration-300 ${
              isFocused
                ? 'w-[70%] h-4 opacity-35 blur-sm translate-y-3'
                : isReceded
                ? 'w-[80%] h-3.5 opacity-30 blur-xs'
                : 'w-[90%] h-4 opacity-75 blur-[2.5px]'
            }`}
            style={{
              background: isLight
                ? 'radial-gradient(ellipse at center, rgba(12, 30, 20, 0.75) 0%, rgba(18, 45, 28, 0.35) 50%, transparent 75%)'
                : 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(4, 14, 8, 0.55) 50%, transparent 75%)',
              zIndex: -1,
            }}
          />
        )}

        {hasCutout ? (
          <img
            src={cutoutSrc}
            alt={person.name}
            onError={() => {
              console.warn(`Failed to load cutout image for ${person.name}: "${cutoutSrc}"`);
              onImageError(person.id);
            }}
            className="block max-h-[380px] sm:max-h-[440px] md:max-h-[500px] lg:max-h-[560px] w-auto object-contain pointer-events-auto transition-transform duration-300 select-none"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        ) : (
          /* Small, intentional "Photo needed" placeholder */
          <div
            className="w-28 sm:w-32 h-44 sm:h-52 rounded-t-full flex flex-col items-center justify-center p-3 text-center border-2 border-dashed shadow-md transition-transform"
            style={{
              borderColor: accent,
              backgroundColor: isLight ? `${accent}18` : `${accent}25`,
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg mb-2 text-white shadow-md"
              style={{ backgroundColor: accent }}
            >
              {person.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-600 dark:text-zinc-300 mb-1">
              {person.focusTag}
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-zinc-500 dark:text-zinc-400">
              Photo needed
            </span>
          </div>
        )}

        {/* Physical Paper Edge Contour Highlight on Focus */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: `drop-shadow(0 0 1.5px ${accent}) drop-shadow(0 0 8px ${accent}60)`,
          }}
        />
      </div>

      {/* Floating Editorial Label on Focus */}
      <div
        className={`absolute pointer-events-none transition-all duration-200 whitespace-nowrap ${
          (person.labelStyle || stageSettings?.hoverBehavior?.labelStyle) === 'side-note'
            ? 'left-[102%] top-1/3'
            : 'left-1/2 -translate-x-1/2 bottom-[82%]'
        } ${
          isFocused
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95'
        }`}
        style={{ zIndex: 60 }}
      >
        {(() => {
          const lStyle = person.labelStyle || stageSettings?.hoverBehavior?.labelStyle || 'editorial';

          if (lStyle === 'minimal') {
            return (
              <div
                className={`px-3 py-1.5 rounded-xl border shadow-lg flex items-center gap-2 backdrop-blur-md ${
                  isLight
                    ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/20'
                    : 'bg-[#121316]/95 border-zinc-700/80 text-white shadow-black/60'
                }`}
                style={{ borderLeftColor: accent, borderLeftWidth: '3px' }}
              >
                <span className="font-display font-bold text-xs">{person.name}</span>
                <span className="text-[10px] text-zinc-400">·</span>
                <span className="text-[10px] font-mono" style={{ color: accent }}>{person.focusTag}</span>
              </div>
            );
          }

          if (lStyle === 'label') {
            return (
              <div
                className="px-3 py-1 rounded-full text-white text-[11px] font-bold shadow-xl flex items-center gap-1.5 backdrop-blur-md"
                style={{ backgroundColor: accent }}
              >
                <span>{person.name}</span>
                <span className="text-[9px] font-mono opacity-80 uppercase tracking-wider">{person.roleArea}</span>
              </div>
            );
          }

          if (lStyle === 'side-note') {
            return (
              <div
                className={`px-3.5 py-2 rounded-2xl border shadow-xl text-left backdrop-blur-md max-w-[180px] ${
                  isLight
                    ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/20'
                    : 'bg-[#121316]/95 border-zinc-700/80 text-white shadow-black/60'
                }`}
                style={{ borderTopColor: accent, borderTopWidth: '3px' }}
              >
                <div className="font-display font-bold text-xs">{person.name}</div>
                <div className="text-[10px] font-mono text-zinc-500 truncate" style={{ color: accent }}>{person.focusTag}</div>
                <div className="text-[9px] text-zinc-400 line-clamp-2 mt-0.5 leading-tight">{person.oneSentence}</div>
              </div>
            );
          }

          // Default: Editorial
          return (
            <>
              <div
                className={`px-4 py-2.5 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-md ${
                  isLight
                    ? 'bg-white/95 border-zinc-200 text-zinc-900 shadow-zinc-400/20'
                    : 'bg-[#121316]/95 border-zinc-700/80 text-white shadow-black/60'
                }`}
                style={{
                  borderTopColor: accent,
                  borderTopWidth: '3px',
                }}
              >
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm tracking-tight">
                      {person.name}
                    </span>
                    {(person.isForegroundAnchor || person.isFeatured) && (
                      <span
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm uppercase tracking-wider font-semibold"
                        style={{
                          backgroundColor: `${accent}20`,
                          color: accent,
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span>{person.roleArea}</span>
                    <span>·</span>
                    <span className="font-mono text-[10px]" style={{ color: accent }}>
                      {person.focusTag}
                    </span>
                  </div>
                </div>

                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: accent }}
                >
                  <ArrowUpRight size={13} />
                </div>
              </div>

              {/* Tail notch */}
              <div
                className={`w-2.5 h-2.5 mx-auto rotate-45 -mt-1.5 border-r border-b ${
                  isLight ? 'bg-white border-zinc-200' : 'bg-[#121316] border-zinc-700/80'
                }`}
              />
            </>
          );
        })()}
      </div>
    </div>
  );
});

PersonCutoutItem.displayName = 'PersonCutoutItem';

export const PeopleCutoutCollage: React.FC<PeopleCutoutCollageProps> = ({
  people,
  stageSettings: customStageSettings,
  viewportMode = 'desktop',
  onSelectPerson,
  className = '',
  stageHeightClass = 'h-[580px] sm:h-[660px] md:h-[720px] lg:h-[780px]',
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { collageSettings: globalStageSettings } = useCms();
  const stageSettings = customStageSettings || globalStageSettings;

  const { navigate } = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTouchId, setActiveTouchId] = useState<string | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Record<string, boolean>>({});
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRafRef = useRef<number | null>(null);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setIsReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, []);

  // Preload all cut-out assets into browser cache on mount
  useEffect(() => {
    people.forEach((p) => {
      const src = resolvePersonCutout(p);
      if (src && !src.startsWith('data:')) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [people]);

  // Clean up RAF on unmount
  useEffect(() => {
    return () => {
      if (hoverRafRef.current) {
        cancelAnimationFrame(hoverRafRef.current);
      }
    };
  }, []);

  const activeId = hoveredId || activeTouchId;

  // Throttled hover handler using requestAnimationFrame for instant, stutter-free response
  const handleHover = useCallback((id: string) => {
    if (hoverRafRef.current) {
      cancelAnimationFrame(hoverRafRef.current);
    }
    hoverRafRef.current = requestAnimationFrame(() => {
      setHoveredId(id);
    });
  }, []);

  // Stable stage leave handler
  const handleStagePointerLeave = useCallback(() => {
    if (hoverRafRef.current) {
      cancelAnimationFrame(hoverRafRef.current);
    }
    hoverRafRef.current = requestAnimationFrame(() => {
      setHoveredId(null);
    });
  }, []);

  const handleImageError = useCallback((id: string) => {
    setFailedImageIds((prev) => ({ ...prev, [id]: true }));
  }, []);

  const handlePersonSelect = useCallback(
    (person: PersonItem, e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      if (onSelectPerson) {
        onSelectPerson(person);
        return;
      }

      // Touch device two-tap flow
      const isTouch = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
      if (isTouch) {
        if (activeTouchId === person.id) {
          navigate(`/people/${person.slug || person.id}`);
        } else {
          setActiveTouchId(person.id);
        }
        return;
      }

      navigate(`/people/${person.slug || person.id}`);
    },
    [onSelectPerson, activeTouchId, navigate]
  );

  const handleStageClick = useCallback(() => {
    setActiveTouchId(null);
  }, []);

  // Filter visible people and sort by order/zIndex
  const visiblePeople = useMemo(() => {
    return people.filter((p) => p.isVisibleInCollage !== false);
  }, [people]);

  const sortedPeople = useMemo(() => {
    return [...visiblePeople].sort(
      (a, b) => (a.stageZIndex || a.order || 5) - (b.stageZIndex || b.order || 5)
    );
  }, [visiblePeople]);

  const cutoutSrcMap = useMemo(() => {
    const map: Record<string, string> = {};
    visiblePeople.forEach((p) => {
      map[p.id] = resolvePersonCutout(p);
    });
    return map;
  }, [visiblePeople]);

  // Stage background styling
  const isGardenBg = (stageSettings?.bgType || 'garden') === 'garden';

  const stageBgStyle = useMemo(() => {
    const bgType = stageSettings?.bgType || 'garden';
    const bgColor = stageSettings?.bgColor || '#235347';

    if (bgType === 'garden') {
      return {
        backgroundColor: isLight ? '#E7EFEA' : '#0B120E',
        borderColor: isLight ? 'rgba(35, 83, 71, 0.22)' : 'rgba(56, 178, 162, 0.20)',
      };
    }
    if (bgType === 'solid') {
      return {
        backgroundColor: isLight ? '#F4F1EA' : '#111419',
        borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      };
    }
    if (bgType === 'palette') {
      return {
        backgroundColor: isLight ? `${bgColor}15` : `${bgColor}25`,
        borderColor: `${bgColor}40`,
      };
    }
    if (bgType === 'paper') {
      return {
        backgroundColor: isLight ? '#FAF7F0' : '#121418',
        borderColor: isLight ? '#E5DFC8' : '#2A2E38',
      };
    }
    // Gradient
    return {};
  }, [stageSettings, isLight]);

  // Pattern styling
  const patternStyle = useMemo(() => {
    const pat = stageSettings?.pattern || 'grid';
    if (pat === 'none') return { display: 'none' };
    if (pat === 'dots') {
      return {
        backgroundImage: `radial-gradient(circle at 1px 1px, ${isLight ? '#23534725' : '#38B2A225'} 1px, transparent 0)`,
        backgroundSize: '20px 20px',
      };
    }
    if (pat === 'grain') {
      return {
        backgroundImage: `radial-gradient(${isLight ? '#00000010' : '#ffffff10'} 1px, transparent 0)`,
        backgroundSize: '6px 6px',
      };
    }
    // Grid
    return {
      backgroundImage: `linear-gradient(${isLight ? '#00000008' : '#ffffff08'} 1px, transparent 1px), linear-gradient(90deg, ${isLight ? '#00000008' : '#ffffff08'} 1px, transparent 1px)`,
      backgroundSize: '36px 36px',
    };
  }, [stageSettings, isLight]);

  return (
    <div
      className={`relative w-full select-none ${className}`}
      onClick={handleStageClick}
    >
      {/* Mobile Hint Cue */}
      <div className="md:hidden flex items-center justify-between px-2 mb-3 text-[11px] text-zinc-500 font-sans">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#38B2A2]" />
          <span>Tap a builder to lift · Tap again to explore story</span>
        </div>
        <span className="font-mono text-[10px] text-zinc-400">
          {sortedPeople.length} Builders
        </span>
      </div>

      {/* Editorial Cut-Out Stage Canvas (NO RECTANGULAR CARDS / NO FRAMES) */}
      <div
        ref={containerRef}
        onPointerLeave={handleStagePointerLeave}
        style={stageBgStyle}
        className={`relative w-full ${stageHeightClass} rounded-3xl overflow-hidden transition-colors duration-700 ${
          isGardenBg
            ? 'border shadow-2xl ring-1 ring-black/5 dark:ring-white/5'
            : stageSettings?.bgType === 'gradient'
            ? isLight
              ? 'bg-gradient-to-b from-[#FAF8F5]/90 via-[#F4F1EA]/70 to-[#ECE7DE]/90 border border-zinc-200/80 shadow-inner'
              : 'bg-gradient-to-b from-[#0e1014] via-[#111419] to-[#0a0c0e] border border-zinc-800/80 shadow-2xl'
            : 'border shadow-xl'
        }`}
      >
        {/* Calm Environmental Garden Background Layer */}
        {isGardenBg && (
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
            {/* High-fidelity responsive garden foundation image */}
            <img
              src="/garden-bg.jpg"
              alt="DETOX Garden Environment"
              className={`absolute inset-0 w-full h-full object-cover object-[center_58%] sm:object-[center_54%] pointer-events-none select-none transition-all duration-700 ${
                isLight
                  ? 'brightness-[0.97] contrast-[0.98] saturate-[0.88]'
                  : 'brightness-[0.45] contrast-[1.10] saturate-[0.72]'
              }`}
              loading="eager"
              decoding="async"
              draggable={false}
            />

            {/* Atmospheric Environment Tone Washes */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-700"
              style={{
                background: isLight
                  ? 'linear-gradient(to bottom, rgba(250, 248, 245, 0.40) 0%, rgba(250, 248, 245, 0.08) 35%, rgba(20, 48, 32, 0.06) 70%, rgba(16, 36, 24, 0.22) 100%)'
                  : 'linear-gradient(to bottom, rgba(12, 13, 16, 0.55) 0%, rgba(12, 13, 16, 0.15) 30%, rgba(6, 18, 12, 0.48) 70%, rgba(3, 9, 6, 0.78) 100%)',
              }}
            />

            {/* Atmospheric Depth Horizon Mist (Layer between distant trees and open foreground lawn) */}
            <div
              className="absolute inset-x-0 top-[28%] h-[32%] pointer-events-none transition-opacity duration-700"
              style={{
                background: isLight
                  ? 'linear-gradient(to bottom, transparent 0%, rgba(246, 249, 244, 0.25) 50%, transparent 100%)'
                  : 'linear-gradient(to bottom, transparent 0%, rgba(16, 30, 24, 0.32) 50%, transparent 100%)',
              }}
            />

            {/* Calm Vignette Frame */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isLight
                  ? 'radial-gradient(ellipse 92% 88% at 50% 50%, transparent 55%, rgba(35, 83, 71, 0.15) 100%)'
                  : 'radial-gradient(ellipse 92% 88% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.60) 100%)',
              }}
            />
          </div>
        )}

        {/* Stage Pattern Overlay */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isGardenBg ? 'opacity-15 dark:opacity-10' : 'opacity-40 dark:opacity-25'
          }`}
          style={patternStyle}
        />

        {/* Ambient Atmosphere Glows */}
        {!isGardenBg ? (
          <>
            <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-[#38B2A2]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-[#F3C3B2]/12 blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-[#C8B6FE]/8 blur-3xl pointer-events-none" />
          </>
        ) : (
          <div className="absolute top-0 right-1/4 w-96 h-64 rounded-full bg-[#99CDD8]/10 blur-3xl pointer-events-none" />
        )}

        {/* Decorative Editorial Elements (Tape, Stamps, Paper scraps, Color chips) */}
        {stageSettings?.decorativeElements?.map((elem: DecorativeElement) => {
          const elemRotation = elem.rotation ?? 0;
          const elemScale = elem.scale ?? 1;
          const elemColor = elem.color || '#38B2A2';

          return (
            <div
              key={elem.id}
              className="absolute pointer-events-none select-none transition-transform duration-300"
              style={{
                left: `${elem.x}%`,
                top: `${elem.y}%`,
                transform: `translate(-50%, -50%) rotate(${elemRotation}deg) scale(${elemScale})`,
                zIndex: 7,
              }}
            >
              {elem.type === 'tape' && (
                <div
                  className="px-3 py-1 rounded-xs shadow-xs font-mono text-[9px] uppercase tracking-widest font-bold border border-black/10 backdrop-blur-xs"
                  style={{
                    backgroundColor: elem.color ? `${elem.color}B0` : 'rgba(253, 232, 211, 0.85)',
                    color: isLight ? '#382010' : '#101010',
                  }}
                >
                  {elem.text || 'DETOX // VERIFIED'}
                </div>
              )}

              {elem.type === 'stamp' && (
                <div
                  className="px-2.5 py-1 rounded-md border-2 border-dashed font-mono text-[9px] uppercase tracking-wider font-extrabold shadow-xs"
                  style={{
                    borderColor: elemColor,
                    color: elemColor,
                    backgroundColor: `${elemColor}12`,
                  }}
                >
                  {elem.text || 'COHORT 2026'}
                </div>
              )}

              {elem.type === 'paper-scrap' && (
                <div
                  className="p-2 rounded shadow-md border font-mono text-[8px] uppercase tracking-wider max-w-[120px] text-center"
                  style={{
                    backgroundColor: isLight ? '#FAF7E8' : '#1C1F26',
                    borderColor: isLight ? '#E2DCBE' : '#323846',
                    color: isLight ? '#5C543A' : '#C0B89C',
                  }}
                >
                  {elem.text || 'LAB LOG // ACTIVE'}
                </div>
              )}

              {elem.type === 'color-chip' && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 text-white font-mono text-[8px] uppercase tracking-wider border border-white/20 shadow-md">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: elemColor }} />
                  <span>{elem.text || 'PALETTE'}</span>
                </div>
              )}

              {elem.type === 'mark' && (
                <div className="font-mono text-xs font-black opacity-70" style={{ color: elemColor }}>
                  {elem.text || '✕'}
                </div>
              )}
            </div>
          );
        })}

        {/* Studio Floor Line / Shadow Horizon for non-garden backgrounds */}
        {!isGardenBg && (
          <div
            className="absolute bottom-0 inset-x-0 h-28 pointer-events-none transition-opacity duration-700"
            style={{
              background: isLight
                ? 'linear-gradient(to top, rgba(215, 208, 195, 0.45) 0%, rgba(240, 235, 226, 0.1) 60%, transparent 100%)'
                : 'linear-gradient(to top, rgba(8, 10, 12, 0.85) 0%, rgba(14, 16, 20, 0.2) 60%, transparent 100%)',
            }}
          />
        )}

        {/* Builders Cut-Out Assembly */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          {sortedPeople.map((person, index) => {
            const isFocused = activeId === person.id;
            const isReceded = activeId !== null && !isFocused;
            const cutoutSrc = cutoutSrcMap[person.id] || '';
            const isFailed = !!failedImageIds[person.id];

            return (
              <PersonCutoutItem
                key={person.id}
                person={person}
                index={index}
                totalCount={sortedPeople.length}
                isFocused={isFocused}
                isReceded={isReceded}
                isLight={isLight}
                isGardenBg={isGardenBg}
                cutoutSrc={cutoutSrc}
                isImageFailed={isFailed}
                viewportMode={viewportMode}
                stageSettings={stageSettings}
                onImageError={handleImageError}
                onHover={handleHover}
                onSelect={handlePersonSelect}
                isReducedMotion={isReducedMotion}
              />
            );
          })}
        </div>

        {/* Stage Bottom Bar / Editorial Caption */}
        <div
          className={`absolute bottom-3 inset-x-4 sm:inset-x-8 py-2.5 px-4 rounded-2xl flex items-center justify-between text-xs backdrop-blur-md pointer-events-none transition-all duration-500 shadow-md ${
            isLight
              ? 'bg-white/85 border border-white/80 text-zinc-700 shadow-zinc-900/5'
              : 'bg-[#0b100d]/85 border border-emerald-950/60 text-zinc-300 shadow-black/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Compass size={13} className="text-[#38B2A2]" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 hidden sm:inline">
              {stageSettings?.categoryTag || 'Active Student Collective'}
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Hover to lift · Click for individual student story
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span>GARDEN COLLECTIVE</span>
            <span>·</span>
            <span>{sortedPeople.length} BUILDERS</span>
          </div>
        </div>
      </div>
    </div>
  );
};
