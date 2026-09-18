import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { 
  PersonItem, 
  CollageStageSettings, 
  DecorativeElement, 
  CutoutArtStyle, 
  EdgeOutlineStyle, 
  LabelEditorialStyle,
  StageBackgroundType,
  StagePatternType
} from '../../cms/types';
import { resolvePersonCutout } from '../../cms/imageUtils';
import { useTheme } from '../../ThemeContext';
import { useCms } from '../../cms/CmsContext';
import { DETOX_PALETTE } from '../../design-system/primitives';
import { PeopleCutoutCollage } from '../people/PeopleCutoutCollage';
import { 
  Check, 
  Layers, 
  ZoomIn, 
  RotateCw, 
  Star,
  Eye,
  EyeOff,
  Sliders,
  Palette,
  LayoutTemplate,
  Smartphone,
  Monitor,
  Tablet,
  Undo2,
  Redo2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Info,
  X,
  AlertTriangle
} from 'lucide-react';

interface ArrangeCollageViewProps {
  people: PersonItem[];
  onSaveArrangement: (updatedPeople: PersonItem[], settings?: Partial<CollageStageSettings>) => void;
  onClose: () => void;
}

type StudioTab = 'arrange' | 'style' | 'people' | 'stage' | 'responsive' | 'preview';

interface HistorySnapshot {
  people: PersonItem[];
  settings: CollageStageSettings;
}

export const ArrangeCollageView: React.FC<ArrangeCollageViewProps> = ({
  people: initialPeople,
  onSaveArrangement,
  onClose,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { collageSettings: globalCollageSettings } = useCms();

  // Baseline initial state
  const baselinePeople = useMemo(() => {
    return initialPeople.map((p, idx) => ({
      ...p,
      stagePosition: p.stagePosition || { 
        x: Math.round(8 + (idx * 84) / Math.max(1, initialPeople.length - 1)), 
        y: idx % 2 === 0 ? 10 : 3 
      },
      stageScale: p.stageScale ?? 1.15,
      stageRotation: p.stageRotation ?? (idx % 2 === 0 ? -2 : 2),
      stageZIndex: p.stageZIndex ?? (idx + 1),
      isForegroundAnchor: !!p.isForegroundAnchor,
      isVisibleInCollage: p.isVisibleInCollage !== false,
      cutoutStyle: p.cutoutStyle || 'natural',
      edgeOutline: p.edgeOutline || 'none',
      labelStyle: p.labelStyle || 'editorial',
      paletteAccent: p.paletteAccent || '#38B2A2',
    }));
  }, [initialPeople]);

  // Working mutable state
  const [people, setPeople] = useState<PersonItem[]>(baselinePeople);
  const [stageSettings, setStageSettings] = useState<CollageStageSettings>(globalCollageSettings);
  
  // Navigation & Viewport State
  const [activeTab, setActiveTab] = useState<StudioTab>('arrange');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(people[0]?.id || null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<HistorySnapshot[]>([
    { people: baselinePeople, settings: globalCollageSettings }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Feedback & Modal States
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Dragging refs
  const stageRef = useRef<HTMLDivElement>(null);
  const isDraggingPersonRef = useRef(false);
  const isDraggingElementRef = useRef(false);

  // Record history snapshot helper
  const pushHistory = useCallback((newPeople: PersonItem[], newSettings: CollageStageSettings) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, { people: newPeople, settings: newSettings }];
    });
    setHistoryIndex((prev) => prev + 1);
    setIsDirty(true);
    setIsSaved(false);
  }, [historyIndex]);

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      const target = history[nextIdx];
      setPeople(target.people);
      setStageSettings(target.settings);
      setHistoryIndex(nextIdx);
      setIsDirty(true);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      const target = history[nextIdx];
      setPeople(target.people);
      setStageSettings(target.settings);
      setHistoryIndex(nextIdx);
      setIsDirty(true);
    }
  }, [historyIndex, history]);

  // Keyboard shortcut listener (Ctrl+Z / Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Protect against accidental refresh if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const selectedPerson = people.find((p) => p.id === selectedPersonId);

  // Update selected person
  const updatePersonData = useCallback((personId: string, updates: Partial<PersonItem>) => {
    setPeople((prev) => {
      const next = prev.map((p) => (p.id === personId ? { ...p, ...updates } : p));
      pushHistory(next, stageSettings);
      return next;
    });
  }, [stageSettings, pushHistory]);

  // Update stage settings
  const updateSettingsData = useCallback((updates: Partial<CollageStageSettings>) => {
    setStageSettings((prev) => {
      const next = { ...prev, ...updates };
      pushHistory(people, next);
      return next;
    });
  }, [people, pushHistory]);

  // Layering Depth Helpers
  const handleBringForward = () => {
    if (!selectedPerson) return;
    const currentZ = selectedPerson.stageZIndex || 10;
    updatePersonData(selectedPerson.id, { stageZIndex: Math.min(60, currentZ + 2) });
  };

  const handleSendBackward = () => {
    if (!selectedPerson) return;
    const currentZ = selectedPerson.stageZIndex || 10;
    updatePersonData(selectedPerson.id, { stageZIndex: Math.max(1, currentZ - 2) });
  };

  const handleBringToFront = () => {
    if (!selectedPerson) return;
    const maxZ = Math.max(...people.map((p) => p.stageZIndex || 10), 20);
    updatePersonData(selectedPerson.id, { stageZIndex: maxZ + 2 });
  };

  const handleSendToBack = () => {
    if (!selectedPerson) return;
    const minZ = Math.min(...people.map((p) => p.stageZIndex || 10), 10);
    updatePersonData(selectedPerson.id, { stageZIndex: Math.max(1, minZ - 2) });
  };

  // Direct Drag-and-Drop on Visual Canvas
  const handlePersonPointerDown = (personId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedPersonId(personId);
    setSelectedElementId(null);
    isDraggingPersonRef.current = true;

    const stageEl = stageRef.current;
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingPersonRef.current) return;
      const relX = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const relY = ((rect.bottom - moveEvent.clientY) / rect.height) * 100;

      const clampedX = Math.round(Math.max(4, Math.min(94, relX)));
      const clampedY = Math.round(Math.max(0, Math.min(32, relY)));

      setPeople((prev) =>
        prev.map((p) =>
          p.id === personId
            ? viewportMode === 'mobile'
              ? { ...p, mobilePosition: { x: clampedX, y: clampedY } }
              : { ...p, stagePosition: { x: clampedX, y: clampedY } }
            : p
        )
      );
      setIsDirty(true);
    };

    const handlePointerUp = () => {
      isDraggingPersonRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      // Push history after drag completes
      setPeople((current) => {
        pushHistory(current, stageSettings);
        return current;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Decorative Element Dragging
  const handleElementPointerDown = (elemId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedElementId(elemId);
    setSelectedPersonId(null);
    isDraggingElementRef.current = true;

    const stageEl = stageRef.current;
    if (!stageEl) return;
    const rect = stageEl.getBoundingClientRect();

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingElementRef.current) return;
      const relX = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const relY = ((moveEvent.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.round(Math.max(2, Math.min(98, relX)));
      const clampedY = Math.round(Math.max(2, Math.min(98, relY)));

      setStageSettings((prev) => ({
        ...prev,
        decorativeElements: prev.decorativeElements.map((el) =>
          el.id === elemId ? { ...el, x: clampedX, y: clampedY } : el
        ),
      }));
      setIsDirty(true);
    };

    const handlePointerUp = () => {
      isDraggingElementRef.current = false;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      setStageSettings((current) => {
        pushHistory(people, current);
        return current;
      });
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Collage Layout Presets
  const applyPreset = (presetType: 'balanced' | 'dense' | 'editorial' | 'scattered' | 'group' | 'reset') => {
    const total = people.length;

    let updated: PersonItem[] = [];

    switch (presetType) {
      case 'balanced':
        updated = people.map((p, idx) => ({
          ...p,
          stagePosition: {
            x: Math.round(8 + (idx * 84) / Math.max(1, total - 1)),
            y: idx % 2 === 0 ? 10 : 3,
          },
          stageScale: p.isForegroundAnchor ? 1.25 : 1.12,
          stageRotation: idx % 2 === 0 ? -2.2 : 2.2,
          stageZIndex: idx + 5,
        }));
        break;

      case 'dense':
        updated = people.map((p, idx) => ({
          ...p,
          stagePosition: {
            x: Math.round(18 + (idx * 64) / Math.max(1, total - 1)),
            y: (idx % 3) * 5 + 3,
          },
          stageScale: p.isForegroundAnchor ? 1.28 : 1.16,
          stageRotation: idx % 2 === 0 ? -1.5 : 1.8,
          stageZIndex: idx + 6,
        }));
        break;

      case 'editorial':
        updated = people.map((p, idx) => {
          const isLead = p.isForegroundAnchor || idx < 3;
          return {
            ...p,
            stagePosition: isLead
              ? { x: Math.round(25 + idx * 25), y: 12 + (idx % 2) * 2 }
              : { x: Math.round(6 + (idx * 88) / Math.max(1, total - 1)), y: 2 },
            stageScale: isLead ? 1.30 : 1.02,
            stageRotation: isLead ? (idx % 2 === 0 ? -2 : 2) : (idx % 2 === 0 ? 1 : -1),
            stageZIndex: isLead ? 15 + idx : 4 + idx,
          };
        });
        break;

      case 'scattered':
        updated = people.map((p, idx) => {
          const rotations = [-4.5, 3.8, -3.2, 4.2, -2.5, 3.5, -4.0, 2.8, -1.8];
          const heights = [14, 4, 11, 2, 13, 3, 12, 1, 10];
          return {
            ...p,
            stagePosition: {
              x: Math.round(6 + (idx * 88) / Math.max(1, total - 1)),
              y: heights[idx % heights.length],
            },
            stageScale: 1.08 + (idx % 3) * 0.08,
            stageRotation: rotations[idx % rotations.length],
            stageZIndex: (idx % 4) * 3 + 4,
          };
        });
        break;

      case 'group':
        updated = people.map((p, idx) => {
          const cluster = idx % 2 === 0 ? 32 : 68;
          const offset = ((idx % 4) - 1.5) * 10;
          return {
            ...p,
            stagePosition: {
              x: Math.round(cluster + offset),
              y: idx % 2 === 0 ? 10 : 4,
            },
            stageScale: p.isForegroundAnchor ? 1.25 : 1.12,
            stageRotation: idx % 2 === 0 ? -2 : 2,
            stageZIndex: idx + 5,
          };
        });
        break;

      case 'reset':
      default:
        updated = baselinePeople;
        break;
    }

    setPeople(updated);
    pushHistory(updated, stageSettings);
  };

  // Reset single person
  const handleResetPerson = () => {
    if (!selectedPerson) return;
    const base = baselinePeople.find((b) => b.id === selectedPerson.id);
    if (base) {
      updatePersonData(selectedPerson.id, base);
    }
  };

  // Reset whole collage
  const handleResetCollage = () => {
    setPeople(baselinePeople);
    setStageSettings(globalCollageSettings);
    pushHistory(baselinePeople, globalCollageSettings);
    setShowResetConfirm(false);
  };

  // Reorder list move helper
  const movePersonOrder = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= people.length) return;
    const reordered = [...people];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    const withUpdatedOrder = reordered.map((p, idx) => ({ ...p, order: idx }));
    setPeople(withUpdatedOrder);
    pushHistory(withUpdatedOrder, stageSettings);
  };

  // Save / Publish
  const handleSaveDraft = () => {
    onSaveArrangement(people, stageSettings);
    setIsDirty(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePublishLive = () => {
    onSaveArrangement(
      people.map((p) => ({ ...p, status: 'PUBLISHED' })),
      stageSettings
    );
    setIsDirty(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDiscard = () => {
    setPeople(baselinePeople);
    setStageSettings(globalCollageSettings);
    setIsDirty(false);
    setShowCloseConfirm(false);
  };

  const handleClose = () => {
    if (isDirty) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  // Add decorative element
  const handleAddDecorativeElement = (type: DecorativeElement['type']) => {
    const newEl: DecorativeElement = {
      id: `dec_${Date.now()}`,
      type,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0,
      text: type === 'stamp' ? 'VERIFIED' : type === 'tape' ? 'LAB BENCH' : undefined,
      color: '#38B2A2',
    };
    const nextList = [...(stageSettings.decorativeElements || []), newEl];
    updateSettingsData({ decorativeElements: nextList });
    setSelectedElementId(newEl.id);
    setSelectedPersonId(null);
  };

  const handleDeleteElement = (elemId: string) => {
    const nextList = (stageSettings.decorativeElements || []).filter((e) => e.id !== elemId);
    updateSettingsData({ decorativeElements: nextList });
    if (selectedElementId === elemId) setSelectedElementId(null);
  };

  // Viewport container sizing
  const viewportWidthClass = {
    desktop: 'w-full',
    tablet: 'max-w-[768px] mx-auto',
    mobile: 'max-w-[390px] mx-auto',
  }[viewportMode];

  return (
    <div className="space-y-6">
      {/* 1. TOP STUDIO BAR */}
      <div className={`p-4 rounded-3xl border shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-colors ${
        isLight ? 'bg-white/95 border-zinc-200 shadow-zinc-200/50' : 'bg-[#121419]/95 border-zinc-800 shadow-black/50'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#235347] flex items-center justify-center text-white shadow-xs">
            <Palette size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
                Minds Behind DETOX — Visual Art Director
              </h3>
              {isDirty ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Draft Modified</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Synced
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">
              Drag builders directly on the stage, fine-tune cut-out styling, accents, and preview responsive viewports.
            </p>
          </div>
        </div>

        {/* Viewport Switcher + Undo/Redo + Publish Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Undo / Redo */}
          <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl p-0.5 bg-zinc-50 dark:bg-zinc-900">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className={`p-1.5 rounded-lg transition-colors ${
                historyIndex > 0 ? 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800' : 'text-zinc-400 opacity-40 cursor-not-allowed'
              }`}
              title="Undo change (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className={`p-1.5 rounded-lg transition-colors ${
                historyIndex < history.length - 1 ? 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800' : 'text-zinc-400 opacity-40 cursor-not-allowed'
              }`}
              title="Redo change (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
          </div>

          {/* Viewport Mode Switcher */}
          <div className="flex items-center border border-zinc-300 dark:border-zinc-700 rounded-xl p-0.5 bg-zinc-50 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewportMode === 'desktop'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Monitor size={13} />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('tablet')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewportMode === 'tablet'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Tablet size={13} />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewportMode === 'mobile'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Action buttons */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handlePublishLive}
            className={`px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-sm transition-all ${
              isSaved ? 'bg-emerald-600' : 'bg-[#163B32] hover:bg-[#235347]'
            }`}
          >
            <Check size={14} />
            <span>{isSaved ? 'Published Live!' : 'Publish Live'}</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 rounded-xl"
            title="Exit Art Director"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 2. STUDIO NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/70">
        {[
          { id: 'arrange', label: '📐 Canvas & Arrange', icon: Sliders },
          { id: 'style', label: '🎨 Cut-Out Style & Shadows', icon: Palette },
          { id: 'people', label: '👥 Builders & Layer Order', icon: Star },
          { id: 'stage', label: '🖼️ Stage & Decorative Elements', icon: LayoutTemplate },
          { id: 'responsive', label: '📱 Responsive Positioning', icon: Smartphone },
          { id: 'preview', label: '👁️ Visitor Preview Mode', icon: Eye },
        ].map((t) => {
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as StudioTab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isSelected
                  ? 'bg-white dark:bg-zinc-800 text-[#235347] dark:text-[#38B2A2] shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. MAIN WORKSPACE VIEW */}
      {activeTab === 'preview' ? (
        /* Visitor Preview Sandbox */
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-[#38B2A2]" />
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">Live Visitor Experience Preview</span>
              <span className="text-zinc-500">· Admin controls hidden; hover and click to test real public behavior.</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('arrange')}
              className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded-lg font-semibold text-xs"
            >
              Return to Studio Controls
            </button>
          </div>

          <div className={`${viewportWidthClass} transition-all duration-500`}>
            <PeopleCutoutCollage
              people={people}
              stageSettings={stageSettings}
              viewportMode={viewportMode}
            />
          </div>
        </div>
      ) : (
        /* Visual Editor Stage Canvas */
        <div className="space-y-6">
          {/* Quick Layout Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <LayoutTemplate size={14} className="text-[#38B2A2]" />
              <span>Layout Presets:</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'balanced', label: 'Balanced' },
                { id: 'dense', label: 'Dense & Overlapping' },
                { id: 'editorial', label: 'Editorial Hierarchy' },
                { id: 'scattered', label: 'Scattered Scrapbook' },
                { id: 'group', label: 'Collaborative Pods' },
                { id: 'reset', label: 'Reset Composition' },
              ].map((pst) => (
                <button
                  key={pst.id}
                  type="button"
                  onClick={() => applyPreset(pst.id as any)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-[#38B2A2] hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all"
                >
                  {pst.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Drag Stage */}
          <div className={`${viewportWidthClass} transition-all duration-500`}>
            <div
              ref={stageRef}
              onClick={() => {
                setSelectedPersonId(null);
                setSelectedElementId(null);
              }}
              className={`relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden border shadow-xl select-none cursor-default transition-colors ${
                (stageSettings.bgType || 'garden') === 'garden'
                  ? 'border-emerald-900/30 shadow-2xl'
                  : isLight
                  ? 'bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EA] to-[#ECE7DE] border-zinc-300'
                  : 'bg-gradient-to-b from-[#0e1014] via-[#111419] to-[#0a0c0e] border-zinc-800'
              }`}
            >
              {/* Garden Background (when active) */}
              {(stageSettings.bgType || 'garden') === 'garden' && (
                <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
                  <img
                    src="/garden-bg.jpg"
                    alt="Garden Background"
                    className={`absolute inset-0 w-full h-full object-cover object-[center_56%] pointer-events-none select-none transition-all duration-700 ${
                      isLight
                        ? 'brightness-[0.97] contrast-[0.98] saturate-[0.88]'
                        : 'brightness-[0.45] contrast-[1.10] saturate-[0.72]'
                    }`}
                    draggable={false}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: isLight
                        ? 'linear-gradient(to bottom, rgba(250, 248, 245, 0.40) 0%, rgba(250, 248, 245, 0.08) 35%, rgba(16, 36, 24, 0.22) 100%)'
                        : 'linear-gradient(to bottom, rgba(12, 13, 16, 0.55) 0%, rgba(12, 13, 16, 0.15) 30%, rgba(3, 9, 6, 0.78) 100%)',
                    }}
                  />
                </div>
              )}

              {/* Stage Pattern */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-15"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, ${isLight ? '#23534720' : '#38B2A225'} 1px, transparent 0)`,
                  backgroundSize: '32px 32px',
                }}
              />

              {/* Ambient Stage Lighting */}
              {(stageSettings.bgType || 'garden') !== 'garden' && (
                <>
                  <div className="absolute -top-20 left-1/4 w-96 h-96 rounded-full bg-[#38B2A2]/10 blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full bg-[#F3C3B2]/12 blur-3xl pointer-events-none" />
                </>
              )}

              {/* Studio Floor Horizon Line (non-garden) */}
              {(stageSettings.bgType || 'garden') !== 'garden' && (
                <div
                  className="absolute bottom-0 inset-x-0 h-28 pointer-events-none"
                  style={{
                    background: isLight
                      ? 'linear-gradient(to top, rgba(200, 195, 185, 0.45) 0%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(0, 0, 0, 0.65) 0%, transparent 100%)',
                  }}
                />
              )}

              {/* Top Hint Pill */}
              <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/10 shadow-lg">
                <Info size={13} className="text-[#38B2A2]" />
                <span>Drag any person or element · Select to edit size, tilt, shadows and outline</span>
              </div>

              {/* Decorative Elements */}
              {stageSettings?.decorativeElements?.map((elem) => {
                const isSelected = selectedElementId === elem.id;
                return (
                  <div
                    key={elem.id}
                    onPointerDown={(e) => handleElementPointerDown(elem.id, e)}
                    className={`absolute cursor-grab active:cursor-grabbing transition-transform duration-75 select-none ${
                      isSelected ? 'ring-2 ring-[#38B2A2] rounded-lg p-1' : ''
                    }`}
                    style={{
                      left: `${elem.x}%`,
                      top: `${elem.y}%`,
                      transform: `translate(-50%, -50%) rotate(${elem.rotation ?? 0}deg) scale(${elem.scale ?? 1})`,
                      zIndex: 8,
                    }}
                  >
                    {elem.type === 'tape' && (
                      <div
                        className="px-3 py-1 rounded-xs shadow-xs font-mono text-[9px] uppercase tracking-widest font-bold border border-black/10"
                        style={{
                          backgroundColor: elem.color ? `${elem.color}CC` : 'rgba(253, 232, 211, 0.9)',
                          color: isLight ? '#382010' : '#101010',
                        }}
                      >
                        {elem.text || 'DETOX // TAPE'}
                      </div>
                    )}
                    {elem.type === 'stamp' && (
                      <div
                        className="px-2.5 py-1 rounded-md border-2 border-dashed font-mono text-[9px] uppercase tracking-wider font-extrabold"
                        style={{
                          borderColor: elem.color || '#38B2A2',
                          color: elem.color || '#38B2A2',
                          backgroundColor: `${elem.color || '#38B2A2'}15`,
                        }}
                      >
                        {elem.text || 'VERIFIED'}
                      </div>
                    )}
                    {elem.type === 'paper-scrap' && (
                      <div className="p-2 rounded shadow border font-mono text-[8px] uppercase tracking-wider bg-amber-50 text-amber-900 border-amber-200">
                        {elem.text || 'LAB LOG'}
                      </div>
                    )}
                    {elem.type === 'color-chip' && (
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/70 text-white font-mono text-[8px] uppercase border border-white/20">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: elem.color || '#38B2A2' }} />
                        <span>PALETTE CHIP</span>
                      </div>
                    )}
                    {elem.type === 'mark' && (
                      <div className="font-mono text-xs font-black" style={{ color: elem.color || '#38B2A2' }}>
                        {elem.text || '✕'}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Stage Cut-Out People */}
              {people
                .filter((p) => p.isVisibleInCollage !== false)
                .map((person) => {
                  const isSelected = selectedPersonId === person.id;
                  const isMobileView = viewportMode === 'mobile';

                  const posX = (isMobileView && person.mobilePosition?.x !== undefined)
                    ? person.mobilePosition.x
                    : (person.stagePosition?.x ?? 50);

                  const posY = (isMobileView && person.mobilePosition?.y !== undefined)
                    ? person.mobilePosition.y
                    : (person.stagePosition?.y ?? 10);

                  const scale = (isMobileView && person.mobileScale !== undefined)
                    ? person.mobileScale
                    : (person.stageScale ?? 1.15);

                  const rotation = (isMobileView && person.mobileRotation !== undefined)
                    ? person.mobileRotation
                    : (person.stageRotation ?? 0);

                  const zIndex = isSelected ? 60 : (person.stageZIndex ?? 10);
                  const accent = person.paletteAccent || '#38B2A2';
                  const cutoutSrc = resolvePersonCutout(person);

                  return (
                    <div
                      key={person.id}
                      onPointerDown={(e) => handlePersonPointerDown(person.id, e)}
                      className={`absolute transition-transform duration-75 cursor-grab active:cursor-grabbing group ${
                        isSelected ? 'ring-2 ring-[#38B2A2] rounded-3xl' : ''
                      }`}
                      style={{
                        left: `${posX}%`,
                        bottom: `${posY}%`,
                        transform: `translate3d(-50%, 0, 0) scale(${scale}) rotate(${rotation}deg)`,
                        transformOrigin: 'bottom center',
                        zIndex,
                        filter: isSelected
                          ? `drop-shadow(0 0 16px ${accent}) drop-shadow(0 20px 24px rgba(0,0,0,0.35))`
                          : 'drop-shadow(0 12px 18px rgba(0,0,0,0.22))',
                        willChange: 'transform',
                      }}
                    >
                      <div className="relative pointer-events-auto">
                        {cutoutSrc ? (
                          <img
                            src={cutoutSrc}
                            alt={person.name}
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                            className="max-h-[300px] sm:max-h-[360px] w-auto object-contain pointer-events-none"
                            draggable={false}
                          />
                        ) : (
                          <div
                            className="w-28 h-48 rounded-t-full flex flex-col items-center justify-center p-3 text-center border-2 border-dashed shadow-md"
                            style={{
                              borderColor: accent,
                              backgroundColor: isLight ? `${accent}18` : `${accent}25`,
                            }}
                          >
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2"
                              style={{ backgroundColor: accent }}
                            >
                              {person.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </div>
                            <span className="text-[10px] font-semibold text-zinc-700 dark:text-zinc-300">
                              {person.name}
                            </span>
                          </div>
                        )}

                        {/* Floating Name Badge */}
                        <div
                          className={`absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-lg flex items-center gap-1.5 whitespace-nowrap border border-white/20 backdrop-blur-md ${
                            isSelected ? 'opacity-100 scale-105' : 'opacity-0 group-hover:opacity-100'
                          } transition-all`}
                          style={{ backgroundColor: accent }}
                        >
                          <span>{person.name}</span>
                          {(person.isForegroundAnchor || person.isFeatured) && (
                            <span className="text-[8px] bg-black/40 px-1 rounded-full uppercase tracking-wider">
                              ★ Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 4. CONTEXTUAL INSPECTORS & CONTROLS BASED ON ACTIVE TAB */}

          {/* TAB: ARRANGE (Position, Size, Rotation, Depth) */}
          {activeTab === 'arrange' && selectedPerson && (
            <div className={`p-6 rounded-3xl border shadow-lg space-y-6 transition-colors ${
              isLight ? 'bg-white border-zinc-200' : 'bg-[#14161b] border-zinc-800'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: selectedPerson.paletteAccent || '#38B2A2' }}
                  />
                  <div>
                    <h4 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
                      {selectedPerson.name}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      {selectedPerson.roleArea} · {selectedPerson.focusTag}
                    </p>
                  </div>
                </div>

                {/* Depth & Prominence Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updatePersonData(selectedPerson.id, {
                        isFeatured: !selectedPerson.isFeatured,
                        isForegroundAnchor: !selectedPerson.isForegroundAnchor,
                      })
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                      selectedPerson.isFeatured || selectedPerson.isForegroundAnchor
                        ? 'bg-[#235347] text-white border-[#235347]'
                        : isLight
                        ? 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:bg-zinc-200'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    <Star size={13} />
                    <span>
                      {selectedPerson.isFeatured || selectedPerson.isForegroundAnchor
                        ? '★ Featured Builder'
                        : 'Mark as Featured'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBringForward}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1"
                    title="Bring forward"
                  >
                    <Layers size={13} />
                    <span>Bring Forward</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendBackward}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors flex items-center gap-1"
                    title="Send backward"
                  >
                    <Layers size={13} className="rotate-180" />
                    <span>Send Backward</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBringToFront}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    Bring to Front
                  </button>

                  <button
                    type="button"
                    onClick={handleSendToBack}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    Send to Back
                  </button>

                  <button
                    type="button"
                    onClick={handleResetPerson}
                    className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                    title="Reset to default position"
                  >
                    Reset Person
                  </button>
                </div>
              </div>

              {/* Friendly Sliders Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {/* Horizontal Position X */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>Horizontal Position</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="94"
                    value={selectedPerson.stagePosition?.x ?? 50}
                    onChange={(e) =>
                      updatePersonData(selectedPerson.id, {
                        stagePosition: {
                          x: Number(e.target.value),
                          y: selectedPerson.stagePosition?.y ?? 10,
                        },
                      })
                    }
                    className="w-full accent-[#38B2A2] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Left</span>
                    <span>Center</span>
                    <span>Right</span>
                  </div>
                </div>

                {/* Vertical Position Y */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>Vertical Floor Anchor</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={selectedPerson.stagePosition?.y ?? 10}
                    onChange={(e) =>
                      updatePersonData(selectedPerson.id, {
                        stagePosition: {
                          x: selectedPerson.stagePosition?.x ?? 50,
                          y: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full accent-[#38B2A2] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Floor Level</span>
                    <span>Mid-Depth</span>
                    <span>High Stance</span>
                  </div>
                </div>

                {/* Size / Scale */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center gap-1">
                      <ZoomIn size={13} className="text-[#38B2A2]" />
                      <span>Size</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.45"
                    step="0.02"
                    value={selectedPerson.stageScale ?? 1.15}
                    onChange={(e) => updatePersonData(selectedPerson.id, { stageScale: Number(e.target.value) })}
                    className="w-full accent-[#38B2A2] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Subtle</span>
                    <span>Standard</span>
                    <span>Prominent</span>
                  </div>
                </div>

                {/* Tilt Rotation */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span className="flex items-center gap-1">
                      <RotateCw size={13} className="text-[#38B2A2]" />
                      <span>Subtle Tilt</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => updatePersonData(selectedPerson.id, { stageRotation: 0 })}
                      className="text-[10px] text-zinc-400 hover:text-zinc-700"
                    >
                      Straight
                    </button>
                  </div>
                  <input
                    type="range"
                    min="-6"
                    max="6"
                    step="0.5"
                    value={selectedPerson.stageRotation ?? 0}
                    onChange={(e) => updatePersonData(selectedPerson.id, { stageRotation: Number(e.target.value) })}
                    className="w-full accent-[#38B2A2] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Tilt Left</span>
                    <span>0°</span>
                    <span>Tilt Right</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STYLE & CUT-OUT (Cut-out Style, Edge Outlines, Shadows, Colors, Hover Behavior) */}
          {activeTab === 'style' && selectedPerson && (
            <div className={`p-6 rounded-3xl border shadow-lg space-y-6 transition-colors ${
              isLight ? 'bg-white border-zinc-200' : 'bg-[#14161b] border-zinc-800'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h4 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
                    Cut-Out Aesthetics & Focus Behavior: {selectedPerson.name}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Choose physical contour styling, edge highlights, shadows, and hover transitions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Cut-Out Style */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Cut-Out Style Treatment
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'natural', label: 'Natural', desc: 'Clean transparent contour' },
                      { id: 'paper', label: 'Paper Edge', desc: 'Subtle tactile paper border' },
                      { id: 'sticker', label: 'Sticker Silhouette', desc: 'Slight solid white edge' },
                      { id: 'raw-cut', label: 'Raw Scissor Cut', desc: 'Crisp handmade silhouette' },
                      { id: 'shadowed', label: 'Physical Shadowed', desc: 'Deep grounded stage shadow' },
                    ].map((st) => {
                      const isSelected = (selectedPerson.cutoutStyle || 'natural') === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => updatePersonData(selectedPerson.id, { cutoutStyle: st.id as CutoutArtStyle })}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#235347]/10 border-[#235347] text-[#235347] dark:text-[#38B2A2] font-semibold'
                              : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 text-zinc-700 dark:text-zinc-300'
                          }`}
                        >
                          <div>
                            <div>{st.label}</div>
                            <div className="text-[10px] text-zinc-400 font-normal">{st.desc}</div>
                          </div>
                          {isSelected && <Check size={14} className="text-[#38B2A2]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Edge Outline & Shadow */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Silhouette Outline / Edge
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'none', label: 'None' },
                        { id: 'thin-paper', label: 'Paper Edge' },
                        { id: 'white', label: 'White Edge' },
                        { id: 'palette-accent', label: 'Palette Tint' },
                      ].map((ed) => {
                        const isSelected = (selectedPerson.edgeOutline || 'none') === ed.id;
                        return (
                          <button
                            key={ed.id}
                            type="button"
                            onClick={() => updatePersonData(selectedPerson.id, { edgeOutline: ed.id as EdgeOutlineStyle })}
                            className={`p-2 rounded-xl border text-xs text-center transition-all ${
                              isSelected
                                ? 'bg-[#235347] text-white border-[#235347] font-semibold'
                                : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                            }`}
                          >
                            {ed.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shadow Customization */}
                  <div className="space-y-3 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      <span>Shadow Controls</span>
                      <button
                        type="button"
                        onClick={() =>
                          updatePersonData(selectedPerson.id, {
                            shadowSettings: {
                              enabled: !(selectedPerson.shadowSettings?.enabled !== false),
                              strength: selectedPerson.shadowSettings?.strength ?? 30,
                              softness: selectedPerson.shadowSettings?.softness ?? 18,
                              offset: selectedPerson.shadowSettings?.offset ?? 12,
                            },
                          })
                        }
                        className="text-[11px] text-[#38B2A2] font-semibold hover:underline"
                      >
                        {selectedPerson.shadowSettings?.enabled !== false ? 'Disable Shadow' : 'Enable Shadow'}
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-zinc-500">
                        <span>Shadow Depth</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="70"
                        value={selectedPerson.shadowSettings?.strength ?? 30}
                        onChange={(e) =>
                          updatePersonData(selectedPerson.id, {
                            shadowSettings: {
                              enabled: true,
                              strength: Number(e.target.value),
                              softness: selectedPerson.shadowSettings?.softness ?? 18,
                              offset: selectedPerson.shadowSettings?.offset ?? 12,
                            },
                          })
                        }
                        className="w-full accent-[#38B2A2] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Individual Color Accent Picker */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    <span>Individual Color Accent</span>
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: selectedPerson.paletteAccent || '#38B2A2' }}
                    />
                  </div>

                  <p className="text-[11px] text-zinc-400">
                    Used for focused identity tag, paper highlights, and subtle hover halos.
                  </p>

                  <div className="grid grid-cols-7 gap-1.5 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                    {DETOX_PALETTE.map((c) => {
                      const isSelected = (selectedPerson.paletteAccent || '#38B2A2').toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updatePersonData(selectedPerson.id, { paletteAccent: c.hex, tagVariant: c.id })}
                          title={`${c.name} (${c.hex})`}
                          className={`aspect-square rounded-lg transition-transform ${
                            isSelected ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      );
                    })}
                  </div>

                  {/* Information Label Style */}
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                      Hover Information Style
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: 'minimal', label: 'Minimal Pill' },
                        { id: 'editorial', label: 'Editorial Lead' },
                        { id: 'label', label: 'Floating Badge' },
                        { id: 'side-note', label: 'Side Story' },
                      ].map((lb) => {
                        const isSelected = (selectedPerson.labelStyle || 'editorial') === lb.id;
                        return (
                          <button
                            key={lb.id}
                            type="button"
                            onClick={() => updatePersonData(selectedPerson.id, { labelStyle: lb.id as LabelEditorialStyle })}
                            className={`px-2 py-1.5 rounded-lg border text-xs text-center transition-all ${
                              isSelected
                                ? 'bg-[#235347] text-white border-[#235347] font-semibold'
                                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100'
                            }`}
                          >
                            {lb.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PEOPLE (List, Reorder, Visibility, Add) */}
          {activeTab === 'people' && (
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 transition-colors ${
              isLight ? 'bg-white border-zinc-200' : 'bg-[#14161b] border-zinc-800'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h4 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
                    Builders in Collage ({people.filter((p) => p.isVisibleInCollage !== false).length} Visible)
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Reorder layer priorities or toggle visibility for builders in the collective.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {people.map((p, idx) => {
                  const isSelected = selectedPersonId === p.id;
                  const isVisible = p.isVisibleInCollage !== false;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPersonId(p.id)}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#38B2A2] bg-[#38B2A2]/10 shadow-xs'
                          : isLight
                          ? 'border-zinc-200 bg-zinc-50/70 hover:bg-zinc-100'
                          : 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-400 w-5 text-center">
                          {idx + 1}
                        </span>
                        <div
                          className="w-3.5 h-3.5 rounded-full"
                          style={{ backgroundColor: p.paletteAccent || '#38B2A2' }}
                        />
                        <div>
                          <div className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <span>{p.name}</span>
                            {(p.isForegroundAnchor || p.isFeatured) && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-sm bg-[#38B2A2]/20 text-[#38B2A2] uppercase font-bold">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {p.roleArea} · {p.focusTag}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Move Up/Down */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            movePersonOrder(idx, idx - 1);
                          }}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-800 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === people.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            movePersonOrder(idx, idx + 1);
                          }}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-800 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown size={13} />
                        </button>

                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            updatePersonData(p.id, { isVisibleInCollage: !isVisible });
                          }}
                          className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isVisible
                              ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                              : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
                          }`}
                          title={isVisible ? 'Visible on public collage' : 'Hidden from public collage'}
                        >
                          {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                          <span className="text-[11px]">{isVisible ? 'Visible' : 'Hidden'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: STAGE & DECOR (Stage Background, Patterns, Decorative Elements) */}
          {activeTab === 'stage' && (
            <div className={`p-6 rounded-3xl border shadow-lg space-y-6 transition-colors ${
              isLight ? 'bg-white border-zinc-200' : 'bg-[#14161b] border-zinc-800'
            }`}>
              <div className="pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <h4 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
                  Stage Architecture & Decorative Elements
                </h4>
                <p className="text-xs text-zinc-500">
                  Customize the background surface, pattern overlay, and add tactile editorial tape/stamps.
                </p>
              </div>

              {/* Title & Intro Customization */}
              <div className="space-y-3 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                  Collage Page Headlines
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Main Title
                    </label>
                    <input
                      type="text"
                      value={stageSettings.title || 'Minds Behind DETOX.'}
                      onChange={(e) => updateSettingsData({ title: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={stageSettings.categoryTag || 'Active Student Collective'}
                      onChange={(e) => updateSettingsData({ categoryTag: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Stage Background Type & Pattern */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Background Surface Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'garden', label: 'Empty Garden' },
                      { id: 'gradient', label: 'Subtle Gradient' },
                      { id: 'paper', label: 'Paper Texture' },
                      { id: 'solid', label: 'Solid Matte' },
                      { id: 'palette', label: 'Palette Tint' },
                    ].map((bg) => {
                      const isSelected = (stageSettings.bgType || 'garden') === bg.id;
                      return (
                        <button
                          key={bg.id}
                          type="button"
                          onClick={() => updateSettingsData({ bgType: bg.id as StageBackgroundType })}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-[#235347] text-white border-[#235347]'
                              : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {bg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Stage Pattern Overlay
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'grid', label: 'Architectural Grid' },
                      { id: 'dots', label: 'Fine Dots' },
                      { id: 'grain', label: 'Paper Grain' },
                      { id: 'none', label: 'None (Clean)' },
                    ].map((pt) => {
                      const isSelected = (stageSettings.pattern || 'grid') === pt.id;
                      return (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => updateSettingsData({ pattern: pt.id as StagePatternType })}
                          className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                            isSelected
                              ? 'bg-[#235347] text-white border-[#235347]'
                              : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {pt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Decorative Elements Manager */}
              <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                    Tactile Decorative Elements
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddDecorativeElement('tape')}
                      className="px-2.5 py-1 rounded-lg border text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 hover:border-[#38B2A2]"
                    >
                      + Tape Strip
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddDecorativeElement('stamp')}
                      className="px-2.5 py-1 rounded-lg border text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 hover:border-[#38B2A2]"
                    >
                      + Stamp
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddDecorativeElement('color-chip')}
                      className="px-2.5 py-1 rounded-lg border text-xs font-semibold bg-zinc-50 dark:bg-zinc-800 hover:border-[#38B2A2]"
                    >
                      + Palette Chip
                    </button>
                  </div>
                </div>

                {stageSettings.decorativeElements && stageSettings.decorativeElements.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stageSettings.decorativeElements.map((el) => (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer ${
                          selectedElementId === el.id
                            ? 'border-[#38B2A2] bg-[#38B2A2]/10'
                            : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900'
                        }`}
                      >
                        <div>
                          <div className="font-mono text-xs font-bold uppercase text-zinc-900 dark:text-zinc-100">
                            {el.type}: {el.text || 'Element'}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            Pos: ({el.x}%, {el.y}%)
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteElement(el.id);
                          }}
                          className="p-1 text-zinc-400 hover:text-red-500 rounded"
                          title="Remove element"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed text-center text-xs text-zinc-400">
                    No decorative elements added. Click "+ Tape Strip" or "+ Stamp" above to place subtle paper accents.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: RESPONSIVE (Independent Mobile Positioning) */}
          {activeTab === 'responsive' && (
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 transition-colors ${
              isLight ? 'bg-white border-zinc-200' : 'bg-[#14161b] border-zinc-800'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h4 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50">
                    Mobile & Small Screen Art Direction
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Custom coordinates and scales for phones to guarantee an impeccably balanced composition.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile')}
                  className="px-3 py-1.5 bg-[#235347] text-white rounded-xl text-xs font-semibold"
                >
                  Switch Canvas to Mobile
                </button>
              </div>

              {selectedPerson ? (
                <div className="space-y-4">
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Adjusting Mobile Placement: {selectedPerson.name}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Mobile Horizontal Position</label>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        value={selectedPerson.mobilePosition?.x ?? selectedPerson.stagePosition?.x ?? 50}
                        onChange={(e) =>
                          updatePersonData(selectedPerson.id, {
                            mobilePosition: {
                              x: Number(e.target.value),
                              y: selectedPerson.mobilePosition?.y ?? selectedPerson.stagePosition?.y ?? 10,
                            },
                          })
                        }
                        className="w-full accent-[#38B2A2] cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-zinc-500">Mobile Scale Multiplier</label>
                      <input
                        type="range"
                        min="0.7"
                        max="1.3"
                        step="0.05"
                        value={selectedPerson.mobileScale ?? selectedPerson.stageScale ?? 1.1}
                        onChange={(e) =>
                          updatePersonData(selectedPerson.id, {
                            mobileScale: Number(e.target.value),
                          })
                        }
                        className="w-full accent-[#38B2A2] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed text-center text-xs text-zinc-400">
                  Select a person on the stage canvas above to fine-tune their mobile-specific position.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. CONFIRMATION MODALS */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle size={24} />
              <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                Reset entire collage arrangement?
              </h4>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              This will restore all builders, positions, sizes, and rotations back to the default seed composition. You can still undo this with Ctrl+Z.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-500 hover:text-zinc-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetCollage}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}

      {showCloseConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle size={24} />
              <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
                You have unsaved changes
              </h4>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Leaving now without saving will discard your latest adjustments to the collage arrangement.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleDiscard}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50"
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveDraft();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#235347] text-white"
              >
                Save Draft & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
