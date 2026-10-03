import React, { useState } from 'react';
import { useCms } from '../../cms/CmsContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../ThemeContext';
import { Link } from '../../router';
import type {
  ContentStatus,
  PersonItem,
  CollageVisualSize,
  PersonCropRatio,
} from '../../cms/types';
import { DETOX_PALETTE } from '../../design-system/primitives';
import { ImageCutoutUploader } from '../../components/admin/ImageCutoutUploader';
import { ArrangeCollageView } from '../../components/admin/ArrangeCollageView';
import { resolvePersonCutout } from '../../cms/imageUtils';
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  Shield,
  Settings,
  Plus,
  Trash2,
  Upload,
  ArrowRight,
  RefreshCw,
  Filter,
  X,
  GripVertical,
  Edit2,
  Sliders,
  Sparkles,
  Eye,
  Lock,
  AlertTriangle,
  Search,
  Database,
  Trophy,
} from 'lucide-react';

type AdminTab = 'OVERVIEW' | 'PEOPLE' | 'CONTENT' | 'MEDIA' | 'MEMBERS' | 'ACCESS' | 'SYSTEM';
type ContentSubTab = 'PROJECTS' | 'EVENTS' | 'SUBMISSIONS' | 'PEOPLE' | 'ACCOMPLISHMENTS' | 'ANNOUNCEMENTS';

export const AdminDashboard: React.FC = () => {
  const { user, profile, isAdmin, isSuperAdmin, isLoading: isAuthLoading } = useAuth();

  const {
    projects,
    events,
    submissions,
    mediaItems,
    people,
    accomplishments,
    announcements,
    roles,
    users,
    settings,
    auditLogs,
    addProject,
    deleteProject,
    setProjectStatus,
    addEvent,
    deleteEvent,
    setEventStatus,
    deleteSubmission,
    setSubmissionPublished,
    addMedia,
    deleteMedia,
    addPerson,
    updatePerson,
    deletePerson,
    setPersonStatus,
    reorderPeople,
    addAccomplishment,
    deleteAccomplishment,
    addAnnouncement,
    deleteAnnouncement,
    updateUserRole,
    updateUserStatus,
    refreshMembers,
    updateSettings,
    syncSeedToSupabase,
    resetToSeedData,
    publishCollageChanges,
  } = useCms();

  const { mode } = useTheme();
  const isLight = mode === 'light';

  const [activeTab, setActiveTab] = useState<AdminTab>('OVERVIEW');
  const [contentSubTab, setContentSubTab] = useState<ContentSubTab>('PROJECTS');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [peopleViewMode, setPeopleViewMode] = useState<'stage' | 'table'>('stage');

  // Member Management state
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'role' | 'status';
    userId: string;
    userName: string;
    targetValue: string;
  } | null>(null);
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message: string | null; error: boolean }>({
    loading: false,
    message: null,
    error: false,
  });

  // Modals
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [selectedMediaCategory, setSelectedMediaCategory] = useState<string>('ALL');
  const [showPersonModal, setShowPersonModal] = useState(false);
  const [showAccomplishmentModal, setShowAccomplishmentModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Form states
  const [projForm, setProjForm] = useState({
    title: '',
    category: 'STUDENT' as const,
    description: '',
    visualLabel: '',
    contributors: '',
    gitUrl: '',
    specs: '',
    status: 'DRAFT' as ContentStatus,
  });

  const [eventForm, setEventForm] = useState({
    title: '',
    code: '',
    category: 'WORKSHOP' as const,
    date: '',
    time: '',
    location: '',
    capacity: '',
    description: '',
    photoLabel: '',
    photoCaption: '',
    deliverables: '',
    status: 'DRAFT' as ContentStatus,
    isUpcoming: true,
  });

  const [mediaForm, setMediaForm] = useState({
    name: '',
    category: 'COMMUNITY' as any,
    tags: '',
    caption: '',
    size: '1.5 MB',
    dimensions: '1920x1080',
  });

  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [draggedPersonIdx, setDraggedPersonIdx] = useState<number | null>(null);

  const initialPersonForm = {
    name: '',
    slug: '',
    roleArea: '',
    focusTag: '',
    oneSentence: '',
    biography: '',
    areaOfContribution: '',
    activeProject: '',
    contributedProjectIds: [] as string[],
    participatedEventIds: [] as string[],
    githubUrl: '',
    linkedin: '',
    email: '',
    website: '',
    twitter: '',
    discord: '',
    telegram: '',
    instagram: '',
    youtube: '',
    blog: '',
    photoUrl: '',
    cutoutUrl: '',
    originalPhotoUrl: '',
    stagePositionX: 50,
    stagePositionY: 10,
    stageScale: 1.15,
    stageRotation: 0,
    stageZIndex: 10,
    isForegroundAnchor: false,
    cutoutContour: 'natural' as 'natural' | 'paper-edge' | 'palette-glow',
    collageSize: 'md' as CollageVisualSize,
    aspectRatio: 'portrait' as PersonCropRatio,
    paletteAccent: '#38B2A2',
    tagVariant: 'teal',
    status: 'PUBLISHED' as ContentStatus,
  };

  const [personForm, setPersonForm] = useState(initialPersonForm);

  const handleOpenAddPerson = () => {
    setEditingPersonId(null);
    setPersonForm(initialPersonForm);
    setShowPersonModal(true);
  };

  const handleOpenEditPerson = (p: PersonItem) => {
    setEditingPersonId(p.id);
    const resolvedCutout = resolvePersonCutout(p);
    setPersonForm({
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      roleArea: p.roleArea,
      focusTag: p.focusTag || '',
      oneSentence: p.oneSentence || '',
      biography: p.biography || '',
      areaOfContribution: p.areaOfContribution || '',
      activeProject: p.activeProject || '',
      contributedProjectIds: p.contributedProjectIds || [],
      participatedEventIds: p.participatedEventIds || [],
      githubUrl: p.githubUrl || p.socialLinks?.github || '',
      linkedin: p.socialLinks?.linkedin || '',
      email: p.email || '',
      website: p.socialLinks?.website || '',
      twitter: p.socialLinks?.twitter || p.socialLinks?.x || '',
      discord: p.socialLinks?.discord || '',
      telegram: p.socialLinks?.telegram || '',
      instagram: p.socialLinks?.instagram || '',
      youtube: p.socialLinks?.youtube || '',
      blog: p.socialLinks?.blog || p.socialLinks?.substack || '',
      photoUrl: resolvedCutout,
      cutoutUrl: resolvedCutout,
      originalPhotoUrl: p.originalPhotoUrl || resolvedCutout,
      stagePositionX: p.stagePosition?.x ?? 50,
      stagePositionY: p.stagePosition?.y ?? 10,
      stageScale: p.stageScale ?? 1.15,
      stageRotation: p.stageRotation ?? 0,
      stageZIndex: p.stageZIndex ?? 10,
      isForegroundAnchor: !!p.isForegroundAnchor,
      cutoutContour: p.cutoutContour || 'natural',
      collageSize: p.collageSize || 'md',
      aspectRatio: p.aspectRatio || 'portrait',
      paletteAccent: p.paletteAccent || '#38B2A2',
      tagVariant: p.tagVariant || 'teal',
      status: p.status,
    });
    setShowPersonModal(true);
  };

  const handleMovePerson = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= people.length) return;
    const reordered = [...people];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    reorderPeople(reordered);
  };

  const handleDragStart = (idx: number) => {
    setDraggedPersonIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (draggedPersonIdx === null || draggedPersonIdx === idx) return;
  };

  const handleDrop = (dropIdx: number) => {
    if (draggedPersonIdx === null || draggedPersonIdx === dropIdx) {
      setDraggedPersonIdx(null);
      return;
    }
    handleMovePerson(draggedPersonIdx, dropIdx);
    setDraggedPersonIdx(null);
  };

  const renderPeopleManagementSection = () => (
    <div className="space-y-6">
      {/* Header with clear human actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h3 className="font-display font-bold text-xl text-zinc-950 dark:text-zinc-50 flex items-center gap-2">
            <span>Minds Behind DETOX</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#235347]/15 text-[#235347] dark:text-[#99CDD8] font-sans font-semibold">
              {people.length} {people.length === 1 ? 'Person' : 'People'}
            </span>
          </h3>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Manage student builders, lab leads, cut-out portraits, and collective stage arrangement.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Switcher: List Directory vs Arrange Collage */}
          <div className="flex items-center p-1 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 text-xs">
            <button
              type="button"
              onClick={() => setPeopleViewMode('table')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                peopleViewMode === 'table'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <FileText size={13} />
              <span>Directory List</span>
            </button>
            <button
              type="button"
              onClick={() => setPeopleViewMode('stage')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                peopleViewMode === 'stage'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              <Sliders size={13} />
              <span>Arrange Collage</span>
            </button>
          </div>

          <button
            onClick={handleOpenAddPerson}
            className="px-4 py-2 bg-[#163B32] hover:bg-[#235347] text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Add Person</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {people.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/30 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#38B2A2]/15 flex items-center justify-center text-[#235347] dark:text-[#38B2A2] mx-auto">
            <Users size={28} />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-100">
              No people added yet
            </h4>
            <p className="text-xs text-zinc-500 font-sans">
              Add the people behind DETOX to build the Minds Behind DETOX experience.
            </p>
          </div>
          <button
            onClick={handleOpenAddPerson}
            className="px-5 py-2.5 bg-[#163B32] hover:bg-[#235347] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2 shadow-sm"
          >
            <Plus size={14} />
            <span>Add Person</span>
          </button>
        </div>
      ) : (
        <>
          {/* MODE 1: VISUAL DRAG-AND-DROP ARRANGE COLLAGE */}
          {peopleViewMode === 'stage' && (
            <ArrangeCollageView
              people={people}
              onSaveArrangement={(updated, newSettings) => {
                publishCollageChanges(updated, newSettings);
              }}
              onClose={() => setPeopleViewMode('table')}
            />
          )}

          {/* MODE 2: DIRECTORY LIST / TABLE VIEW */}
          {peopleViewMode === 'table' && (
            <div
              className={`border rounded-2xl overflow-hidden shadow-sm transition-colors ${
                isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/60 border-zinc-800'
              }`}
            >
              <table className="w-full text-left text-xs">
                <thead
                  className={`border-b text-[10px] uppercase tracking-wider font-semibold text-zinc-500 ${
                    isLight ? 'bg-zinc-50' : 'bg-zinc-900'
                  }`}
                >
                  <tr>
                    <th className="p-3.5 w-14 text-center">ORDER</th>
                    <th className="p-3.5">PHOTO</th>
                    <th className="p-3.5">NAME</th>
                    <th className="p-3.5">ROLE & DISCIPLINE</th>
                    <th className="p-3.5">STATUS</th>
                    <th className="p-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {people.map((p, idx) => {
                    const accent = p.paletteAccent || '#38B2A2';
                    const thumbnailSrc = resolvePersonCutout(p);

                    return (
                      <tr
                        key={p.id}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        className={`transition-colors cursor-move ${
                          draggedPersonIdx === idx
                            ? 'opacity-40 bg-[#235347]/20'
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                        }`}
                      >
                        {/* Drag Handle & Order */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1 text-zinc-400">
                            <GripVertical size={14} className="hover:text-zinc-600 dark:hover:text-zinc-200" />
                            <span className="font-mono text-xs font-semibold">
                              {String(idx + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </td>

                        {/* Photo Cutout Thumbnail */}
                        <td className="p-3.5">
                          <div className="w-12 h-14 rounded-xl overflow-hidden bg-black/5 dark:bg-black/30 border border-zinc-200 dark:border-zinc-800 flex items-end justify-center p-1 shrink-0">
                            {thumbnailSrc ? (
                              <img
                                src={thumbnailSrc}
                                alt={p.name}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                                className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                              />
                            ) : (
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white my-auto"
                                style={{ backgroundColor: accent }}
                              >
                                {p.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Name & Lead Spotlight Badge */}
                        <td className="p-3.5 font-sans">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-sm text-zinc-950 dark:text-zinc-50">
                              {p.name}
                            </span>
                            {p.isForegroundAnchor && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#235347] text-white font-medium">
                                ★ Lead
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-zinc-500 font-sans line-clamp-1 max-w-sm mt-0.5">
                            {p.oneSentence}
                          </div>
                        </td>

                        {/* Role & Discipline */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: accent }}
                            />
                            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {p.roleArea}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-500 font-sans mt-0.5">
                            {p.focusTag || p.areaOfContribution}
                          </div>
                        </td>

                        {/* Status Toggle (Published / Hidden) */}
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() =>
                              setPersonStatus(
                                p.id,
                                p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
                              )
                            }
                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                              p.status === 'PUBLISHED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700'
                            }`}
                            title="Click to toggle public visibility"
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                p.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-zinc-400'
                              }`}
                            />
                            <span>{p.status === 'PUBLISHED' ? 'Published' : 'Hidden'}</span>
                          </button>
                        </td>

                        {/* Actions: Edit, Preview, Arrange, Delete */}
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Preview */}
                          <a
                            href={`#/people/${p.slug || p.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium inline-flex items-center gap-1"
                            title="Preview student profile"
                          >
                            <Eye size={12} />
                            <span className="hidden sm:inline">Preview</span>
                          </a>

                          {/* Arrange */}
                          <button
                            type="button"
                            onClick={() => setPeopleViewMode('stage')}
                            className="px-2.5 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-medium inline-flex items-center gap-1"
                            title="Arrange in collage"
                          >
                            <Sliders size={12} />
                            <span className="hidden sm:inline">Arrange</span>
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditPerson(p)}
                            className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove ${p.name} from Minds Behind DETOX?`)) {
                                deletePerson(p.id);
                              }
                            }}
                            className="px-2.5 py-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-xs font-medium inline-flex items-center gap-1"
                            title="Delete person"
                          >
                            <Trash2 size={12} />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );

  const [accForm, setAccForm] = useState({
    title: '',
    date: '',
    category: 'MILESTONE' as any,
    description: '',
    impact: '',
    status: 'PUBLISHED' as ContentStatus,
  });

  const [annForm, setAnnForm] = useState({
    title: '',
    content: '',
    type: 'INFO' as any,
    status: 'PUBLISHED' as ContentStatus,
  });

  // Calculate statistics
  const totalPublishedProjects = projects.filter((p) => p.status === 'PUBLISHED').length;
  const totalDraftProjects = projects.filter((p) => p.status !== 'PUBLISHED').length;
  const totalPublishedEvents = events.filter((e) => e.status === 'PUBLISHED').length;
  const totalDraftEvents = events.filter((e) => e.status !== 'PUBLISHED').length;

  if (isAuthLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-mono ${isLight ? 'bg-[#f4f1ea] text-zinc-800' : 'bg-[#0d0e11] text-zinc-200'}`}>
        <div className="flex items-center gap-3">
          <RefreshCw className="animate-spin text-[#235347]" size={20} />
          <span className="text-xs uppercase tracking-wider">Verifying Security Clearance...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className={`min-h-screen font-mono flex items-center justify-center p-6 ${isLight ? 'bg-[#f4f1ea] text-zinc-900' : 'bg-[#0d0e11] text-zinc-100'}`}>
        <div className={`max-w-md w-full p-8 rounded-2xl border shadow-xl space-y-6 ${isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'}`}>
          <div className="flex items-center gap-3 border-b border-red-500/20 pb-4">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
              <Lock size={20} />
            </div>
            <div>
              <div className="font-bold text-red-500 text-sm">// CLEARANCE REQUIRED</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">DETOX Control Room Security</div>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
            <p>
              Access to this administrative workspace is strictly restricted to verified <strong className="text-zinc-200">Admin</strong> and <strong className="text-zinc-200">Super Admin</strong> accounts.
            </p>
            {user ? (
              <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-yellow-300 text-[11px] space-y-1">
                <div className="font-bold">Signed in as: {profile?.name || user?.email}</div>
                <div className="text-zinc-400">Current clearance level: <span className="font-mono text-zinc-200 font-bold uppercase">{profile?.role || 'MEMBER'}</span></div>
                <div className="text-[10px] text-zinc-500 mt-1">If you require elevated administrative clearance, ask an existing Super Admin or run the PostgreSQL bootstrap procedure in Supabase.</div>
              </div>
            ) : (
              <p className="text-zinc-400">
                You are currently unauthenticated. Please sign in with an authorized administrator account in the Members Portal.
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/members"
              className="flex-1 py-2.5 px-4 bg-[#163B32] hover:bg-[#235347] text-white rounded-xl font-bold text-center text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Go to Members Portal</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              to="/"
              className="py-2.5 px-4 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold text-center text-xs transition-colors"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen font-mono text-xs transition-colors duration-300 ${
        isLight ? 'bg-[#f4f1ea] text-zinc-900' : 'bg-[#0d0e11] text-zinc-200'
      }`}
    >
      {/* Top Engineering Command Header */}
      <header
        className={`border-b sticky top-0 z-40 transition-colors ${
          isLight ? 'bg-[#faf8f5] border-zinc-300 shadow-xs' : 'bg-[#111215] border-zinc-800 shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-[#235347] font-bold text-sm tracking-wider flex items-center gap-1.5 hover:opacity-80"
            >
              <span>DETOX</span>
              <span className="text-[10px] text-zinc-500 font-normal">/ CONTROL ROOM</span>
            </Link>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-2 text-[10px]">
              <span className="w-2 h-2 rounded-full bg-[#235347] animate-pulse" />
              <span className="text-zinc-500">OPERATING AS:</span>
              <span className="font-bold text-[#235347]">{profile?.name || user?.email?.split('@')[0] || 'ADMIN'}</span>
              <span
                className={`px-1.5 py-0.5 rounded-2xs text-[9px] font-bold ${
                  isSuperAdmin
                    ? 'bg-[#235347] text-white'
                    : 'bg-zinc-800 text-zinc-300'
                }`}
              >
                {isSuperAdmin ? 'SUPER ADMIN' : isAdmin ? 'ADMIN' : 'MEMBER'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            <button
              onClick={async () => {
                if (window.confirm('Sync default verified seed data (projects, events, cutouts, stage settings) to Supabase tables?')) {
                  setSyncStatus({ loading: true, message: 'Syncing seed records...', error: false });
                  const res = await syncSeedToSupabase();
                  setSyncStatus({ loading: false, message: res.message, error: !res.success });
                  setTimeout(() => setSyncStatus({ loading: false, message: null, error: false }), 4000);
                }
              }}
              disabled={syncStatus.loading}
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1 px-2.5 py-1 rounded-xs border border-zinc-300 dark:border-zinc-800"
              title="Sync initial seed data into Supabase database"
            >
              <Database size={11} className={syncStatus.loading ? 'animate-spin' : ''} />
              <span className="hidden md:inline">{syncStatus.loading ? 'Syncing...' : 'Sync Seed to DB'}</span>
            </button>

            {syncStatus.message && (
              <span className={`text-[10px] px-2 py-0.5 rounded ${syncStatus.error ? 'text-red-400 bg-red-950/50' : 'text-emerald-400 bg-emerald-950/50'}`}>
                {syncStatus.message}
              </span>
            )}

            <button
              onClick={() => {
                if (window.confirm('Reset all CMS data in memory to default verified seed data?')) {
                  resetToSeedData();
                }
              }}
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center gap-1 px-2 py-1 rounded-xs border border-zinc-300 dark:border-zinc-800"
              title="Reset in-memory state to authentic default seed records"
            >
              <RefreshCw size={11} />
              <span className="hidden lg:inline">Reset State</span>
            </button>

            <Link
              to="/"
              className="flex items-center gap-1 px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold tracking-wider transition-colors"
            >
              <span>PUBLIC SITE</span>
              <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 border-b pb-px mb-6 overflow-x-auto text-[11px]">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-3.5 py-2 rounded-t-xs border-b-2 font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'OVERVIEW'
                ? 'border-[#235347] text-[#235347] bg-zinc-200/50 dark:bg-zinc-800/40'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <LayoutDashboard size={13} />
            <span>OVERVIEW</span>
          </button>

          <button
            onClick={() => setActiveTab('PEOPLE')}
            className={`px-3.5 py-2 rounded-t-xs border-b-2 font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'PEOPLE'
                ? 'border-[#235347] text-[#235347] bg-zinc-200/50 dark:bg-zinc-800/40'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Sparkles size={13} />
            <span>PEOPLE / MINDS ({people.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CONTENT')}
            className={`px-3.5 py-2 rounded-t-xs border-b-2 font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'CONTENT'
                ? 'border-[#235347] text-[#235347] bg-zinc-200/50 dark:bg-zinc-800/40'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <FileText size={13} />
            <span>CONTENT</span>
          </button>

          <button
            onClick={() => setActiveTab('MEDIA')}
            className={`px-3.5 py-2 rounded-t-xs border-b-2 font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'MEDIA'
                ? 'border-[#235347] text-[#235347] bg-zinc-200/50 dark:bg-zinc-800/40'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Image size={13} />
            <span>MEDIA LIBRARY ({mediaItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('MEMBERS')}
            className={`px-3.5 py-2 rounded-t-xs border-b-2 font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'MEMBERS'
                ? 'border-[#235347] text-[#235347] bg-zinc-200/50 dark:bg-zinc-800/40'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Users size={13} />
            <span>MEMBERS ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ACCESS')}
            className={`px-3.5 py-2 rounded-t-xs border-b-2 font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'ACCESS'
                ? 'border-[#235347] text-[#235347] bg-zinc-200/50 dark:bg-zinc-800/40'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Shield size={13} />
            <span>ACCESS & ROLES</span>
          </button>

          <button
            onClick={() => setActiveTab('SYSTEM')}
            className={`px-3.5 py-2 rounded-t-xs border-b-2 font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'SYSTEM'
                ? 'border-[#235347] text-[#235347] bg-zinc-200/50 dark:bg-zinc-800/40'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
            }`}
          >
            <Settings size={13} />
            <span>AUDIT & SETTINGS</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                className={`p-4 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                }`}
              >
                <div className="text-[10px] text-zinc-500 uppercase font-medium">ACTIVE PROJECTS</div>
                <div className="text-2xl font-bold font-sans text-[#235347] mt-1">
                  {totalPublishedProjects}
                </div>
                <div className="text-[9px] text-zinc-500 mt-1">
                  {totalDraftProjects} pending draft / in review
                </div>
              </div>

              <div
                className={`p-4 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                }`}
              >
                <div className="text-[10px] text-zinc-500 uppercase font-medium">SCHEDULED EVENTS</div>
                <div className="text-2xl font-bold font-sans text-[#235347] mt-1">
                  {totalPublishedEvents}
                </div>
                <div className="text-[9px] text-zinc-500 mt-1">
                  {totalDraftEvents} pending draft / in review
                </div>
              </div>

              <div
                className={`p-4 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                }`}
              >
                <div className="text-[10px] text-zinc-500 uppercase font-medium">MINDS BEHIND DETOX</div>
                <div className="text-2xl font-bold font-sans text-[#235347] mt-1">
                  {people.filter((p) => p.status === 'PUBLISHED').length}
                </div>
                <div className="text-[9px] text-zinc-500 mt-1">
                  {people.filter((p) => p.status !== 'PUBLISHED').length} draft / hidden
                </div>
              </div>

              <div
                className={`p-4 rounded-xs border transition-colors ${
                  isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                }`}
              >
                <div className="text-[10px] text-zinc-500 uppercase font-medium">COMMUNITY MEMBERS</div>
                <div className="text-2xl font-bold font-sans text-[#235347] mt-1">
                  {users.length}
                </div>
                <div className="text-[9px] text-zinc-500 mt-1">Registered members</div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div
              className={`p-4 rounded-xs border flex flex-wrap items-center justify-between gap-3 ${
                isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
              }`}
            >
              <div className="font-bold text-xs text-[#235347]">// RAPID PUBLISHING WORKSPACE</div>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={handleOpenAddPerson}
                  className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus size={13} />
                  <span>Add Person</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('CONTENT');
                    setContentSubTab('PROJECTS');
                    setShowProjectModal(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={12} />
                  <span>New Project</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('CONTENT');
                    setContentSubTab('EVENTS');
                    setShowEventModal(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1"
                >
                  <Plus size={12} />
                  <span>New Event</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('MEDIA');
                    setShowMediaModal(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1"
                >
                  <Upload size={12} />
                  <span>Upload Media</span>
                </button>
              </div>
            </div>

            {/* Recent Audit Activity Stream */}
            <div
              className={`p-5 rounded-xs border space-y-3 ${
                isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-[#235347]">// RECENT AUDIT LOG ACTIVITY</span>
                <span className="text-zinc-500 text-[9px]">REAL-TIME OPERATIONAL LOGS</span>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {auditLogs.slice(0, 8).map((log) => (
                  <div
                    key={log.id}
                    className={`p-2.5 rounded-xs border text-[10px] flex items-center justify-between gap-4 ${
                      isLight ? 'bg-[#f4f1ea] border-zinc-200' : 'bg-[#0e0f12] border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`px-1.5 py-0.5 rounded-2xs font-bold text-[8px] ${
                          log.action === 'PUBLISH'
                            ? 'bg-[#235347] text-white'
                            : log.action === 'CREATE'
                            ? 'bg-blue-900 text-blue-200'
                            : log.action === 'DELETE'
                            ? 'bg-red-900 text-red-200'
                            : 'bg-zinc-700 text-zinc-300'
                        }`}
                      >
                        {log.action}
                      </span>
                      <span className="text-zinc-500">{log.timestamp}</span>
                      <span className="font-semibold text-zinc-300">{log.actorName}:</span>
                      <span className="text-zinc-400 truncate">{log.details}</span>
                    </div>
                    <span className="text-zinc-500 text-[9px] shrink-0 font-mono">[{log.targetType}]</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MINDS BEHIND DETOX (PEOPLE) */}
        {activeTab === 'PEOPLE' && renderPeopleManagementSection()}

        {/* TAB 3: CONTENT MANAGEMENT */}
        {activeTab === 'CONTENT' && (
          <div className="space-y-6">
            {/* Sub-Tabs Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <div className="flex items-center gap-1 text-[10px]">
                {(['PROJECTS', 'EVENTS', 'SUBMISSIONS', 'PEOPLE', 'ACCOMPLISHMENTS', 'ANNOUNCEMENTS'] as ContentSubTab[]).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setContentSubTab(tab)}
                      className={`px-3 py-1.5 rounded-xs font-semibold transition-colors ${
                        contentSubTab === tab
                          ? 'bg-[#163B32] text-white'
                          : isLight
                          ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-[10px]">
                <Filter size={11} className="text-zinc-500" />
                <span>FILTER:</span>
                {['ALL', 'PUBLISHED', 'REVIEW', 'DRAFT'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2 py-1 rounded-xs font-bold ${
                      statusFilter === st
                        ? 'bg-[#235347] text-white'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* PROJECTS SUB-TAB */}
            {contentSubTab === 'PROJECTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#235347] dark:text-[#99CDD8]">
                    // PROJECTS ({projects.length})
                  </div>
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>CREATE PROJECT</span>
                  </button>
                </div>

                <div
                  className={`border rounded-xs overflow-hidden ${
                    isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                  }`}
                >
                  <table className="w-full text-left text-[11px]">
                    <thead
                      className={`border-b text-[9px] uppercase tracking-wider text-zinc-500 ${
                        isLight ? 'bg-zinc-100' : 'bg-[#0e0f12]'
                      }`}
                    >
                      <tr>
                        <th className="p-3">TITLE / ID</th>
                        <th className="p-3">CATEGORY</th>
                        <th className="p-3">STATUS</th>
                        <th className="p-3">CONTRIBUTORS</th>
                        <th className="p-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700/40">
                      {projects
                        .filter((p) => (statusFilter === 'ALL' ? true : p.status === statusFilter))
                        .map((p) => (
                          <tr key={p.id} className="hover:bg-zinc-500/5">
                            <td className="p-3 font-sans font-bold">
                              <div>{p.title}</div>
                              <div className="font-mono text-[9px] text-zinc-500 font-normal">
                                {p.id}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="px-1.5 py-0.5 rounded-2xs border text-[9px] font-bold">
                                {p.category}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-2xs text-[9px] font-bold ${
                                  p.status === 'PUBLISHED'
                                    ? 'bg-[#235347] text-white'
                                    : p.status === 'REVIEW'
                                    ? 'bg-yellow-900 text-yellow-200'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="p-3 text-zinc-400">{p.contributors.join(', ')}</td>
                            <td className="p-3 text-right space-x-1">
                              {p.status !== 'PUBLISHED' && (
                                <button
                                  onClick={() => setProjectStatus(p.id, 'PUBLISHED')}
                                  className="px-2 py-1 bg-[#235347] text-white rounded-xs text-[9px] hover:bg-[#163B32]"
                                  title="Publish directly to live public website"
                                >
                                  Publish
                                </button>
                              )}
                              {p.status === 'PUBLISHED' && (
                                <button
                                  onClick={() => setProjectStatus(p.id, 'DRAFT')}
                                  className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-xs text-[9px] hover:bg-zinc-700"
                                  title="Unpublish back to draft"
                                >
                                  Unpublish
                                </button>
                              )}
                              <button
                                onClick={() => deleteProject(p.id)}
                                className="px-2 py-1 bg-red-950 text-red-300 rounded-xs text-[9px] hover:bg-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EVENTS SUB-TAB */}
            {contentSubTab === 'EVENTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#235347]">
                    // EVENTS & WORKSHOPS ({events.length})
                  </div>
                  <button
                    onClick={() => setShowEventModal(true)}
                    className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>CREATE EVENT</span>
                  </button>
                </div>

                <div
                  className={`border rounded-xs overflow-hidden ${
                    isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                  }`}
                >
                  <table className="w-full text-left text-[11px]">
                    <thead
                      className={`border-b text-[9px] uppercase tracking-wider text-zinc-500 ${
                        isLight ? 'bg-zinc-100' : 'bg-[#0e0f12]'
                      }`}
                    >
                      <tr>
                        <th className="p-3">CODE / TITLE</th>
                        <th className="p-3">DATE & TIME</th>
                        <th className="p-3">CATEGORY</th>
                        <th className="p-3">STATUS</th>
                        <th className="p-3 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700/40">
                      {events
                        .filter((e) => (statusFilter === 'ALL' ? true : e.status === statusFilter))
                        .map((e) => (
                          <tr key={e.id} className="hover:bg-zinc-500/5">
                            <td className="p-3 font-sans font-bold">
                              <div>{e.title}</div>
                              <div className="font-mono text-[9px] text-zinc-500 font-normal">
                                {e.code} // {e.location}
                              </div>
                            </td>
                            <td className="p-3 font-mono text-[10px]">
                              <div>{e.date}</div>
                              <div className="text-zinc-500">{e.time}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-1.5 py-0.5 rounded-2xs border text-[9px] font-bold">
                                {e.category}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-2xs text-[9px] font-bold ${
                                  e.status === 'PUBLISHED'
                                    ? 'bg-[#235347] text-white'
                                    : e.status === 'REVIEW'
                                    ? 'bg-yellow-900 text-yellow-200'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {e.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              {e.status !== 'PUBLISHED' && (
                                <button
                                  onClick={() => setEventStatus(e.id, 'PUBLISHED')}
                                  className="px-2 py-1 bg-[#235347] text-white rounded-xs text-[9px] hover:bg-[#163B32]"
                                >
                                  Publish
                                </button>
                              )}
                              {e.status === 'PUBLISHED' && (
                                <button
                                  onClick={() => setEventStatus(e.id, 'DRAFT')}
                                  className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-xs text-[9px] hover:bg-zinc-700"
                                >
                                  Draft
                                </button>
                              )}
                              <button
                                onClick={() => deleteEvent(e.id)}
                                className="px-2 py-1 bg-red-950 text-red-300 rounded-xs text-[9px] hover:bg-red-900"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUBMISSIONS SUB-TAB (HACKATHONS / SHOWCASE) */}
            {contentSubTab === 'SUBMISSIONS' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-[#235347] dark:text-[#99CDD8]">
                      // HACKATHON & EVENT SUBMISSIONS ({submissions.length})
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      Manage public visibility, team entries, and results for hackathons.
                    </div>
                  </div>

                  <Link
                    to="/events/game-building-hackathon-2026/submissions"
                    className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1.5 text-xs transition-colors"
                  >
                    <Eye size={12} />
                    <span>VIEW PUBLIC GALLERY</span>
                  </Link>
                </div>

                <div
                  className={`rounded-xl border overflow-x-auto ${
                    isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#121316] border-zinc-800 shadow-md'
                  }`}
                >
                  <table className="w-full text-left text-xs font-mono">
                    <thead
                      className={`border-b text-[10px] uppercase font-bold ${
                        isLight ? 'bg-zinc-50 text-zinc-500 border-zinc-200' : 'bg-zinc-900/50 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      <tr>
                        <th className="p-3">Cover</th>
                        <th className="p-3">Project Title</th>
                        <th className="p-3">Team / Submitter</th>
                        <th className="p-3">Event</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Award / Badge</th>
                        <th className="p-3">Public Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit">
                      {submissions
                        .filter((s) => {
                          if (statusFilter === 'PUBLISHED') return s.published;
                          if (statusFilter === 'DRAFT') return !s.published;
                          return true;
                        })
                        .map((sub) => (
                          <tr
                            key={sub.id}
                            className={`hover:bg-zinc-500/5 transition-colors ${
                              !sub.published ? 'opacity-70' : ''
                            }`}
                          >
                            <td className="p-3">
                              <div className="w-12 h-9 rounded-md bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
                                {sub.coverImage ? (
                                  <img
                                    src={sub.coverImage}
                                    alt={sub.title}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[8px] text-zinc-500 font-mono">
                                    N/A
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-bold font-sans text-sm text-zinc-900 dark:text-zinc-100">
                                {sub.title}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">
                                id: {sub.id}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-zinc-800 dark:text-zinc-200">
                                {sub.teamName || '—'}
                              </div>
                              <div className="text-[10px] text-zinc-500">
                                {sub.participantNames.join(', ') || 'Independent'}
                              </div>
                            </td>
                            <td className="p-3 text-zinc-500 text-[11px]">
                              {sub.eventId}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                                {sub.category || 'General'}
                              </span>
                            </td>
                            <td className="p-3">
                              {sub.resultBadge ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-zinc-950">
                                  <Trophy size={10} />
                                  <span>{sub.resultBadge}</span>
                                </span>
                              ) : (
                                <span className="text-zinc-400">—</span>
                              )}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => setSubmissionPublished(sub.id, !sub.published)}
                                className={`px-2 py-0.5 rounded-xs text-[10px] font-bold transition-colors ${
                                  sub.published
                                    ? 'bg-[#235347]/20 text-[#235347] dark:text-[#38B2A2] hover:bg-[#235347]/30'
                                    : 'bg-zinc-500/20 text-zinc-500 hover:bg-zinc-500/30'
                                }`}
                                title="Click to toggle public visibility"
                              >
                                {sub.published ? 'PUBLISHED' : 'UNPUBLISHED'}
                              </button>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  to={`/events/${encodeURIComponent(sub.eventId)}/submissions/${encodeURIComponent(sub.id)}`}
                                  className="p-1 rounded-md hover:bg-zinc-500/10 text-[#235347] dark:text-[#99CDD8]"
                                  title="View on public website"
                                >
                                  <Eye size={14} />
                                </Link>
                                <button
                                  onClick={() => deleteSubmission(sub.id)}
                                  className="p-1 rounded-md hover:bg-red-500/10 text-red-500"
                                  title="Delete submission"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PEOPLE SUB-TAB (MINDS BEHIND DETOX) */}
            {contentSubTab === 'PEOPLE' && renderPeopleManagementSection()}

            {/* ACCOMPLISHMENTS SUB-TAB */}
            {contentSubTab === 'ACCOMPLISHMENTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#235347]">
                    // GENUINE ACCOMPLISHMENTS ({accomplishments.length})
                  </div>
                  <button
                    onClick={() => setShowAccomplishmentModal(true)}
                    className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>RECORD MILESTONE</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {accomplishments.map((acc) => (
                    <div
                      key={acc.id}
                      className={`p-4 rounded-xs border flex items-start justify-between gap-4 ${
                        isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                          <span className="font-bold text-[#235347]">{acc.category}</span>
                          <span>•</span>
                          <span>{acc.date}</span>
                        </div>
                        <h4 className="font-sans font-bold text-sm text-zinc-100">{acc.title}</h4>
                        <p className="font-sans text-xs text-zinc-400">{acc.description}</p>
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Impact: <span className="text-zinc-200">{acc.impact}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteAccomplishment(acc.id)}
                        className="px-2 py-1 bg-red-950 text-red-300 rounded-xs text-[9px]"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ANNOUNCEMENTS SUB-TAB */}
            {contentSubTab === 'ANNOUNCEMENTS' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#235347]">
                    // LAB ANNOUNCEMENTS ({announcements.length})
                  </div>
                  <button
                    onClick={() => setShowAnnouncementModal(true)}
                    className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1"
                  >
                    <Plus size={12} />
                    <span>NEW ANNOUNCEMENT</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={`p-4 rounded-xs border flex items-start justify-between gap-4 ${
                        isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                          <span className="font-bold text-[#235347]">{ann.type}</span>
                          <span>•</span>
                          <span>{ann.date}</span>
                        </div>
                        <h4 className="font-sans font-bold text-sm">{ann.title}</h4>
                        <p className="font-sans text-xs text-zinc-400">{ann.content}</p>
                      </div>

                      <button
                        onClick={() => deleteAnnouncement(ann.id)}
                        className="px-2 py-1 bg-red-950 text-red-300 rounded-xs text-[9px]"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEDIA LIBRARY */}
        {activeTab === 'MEDIA' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
              <div>
                <div className="font-bold text-[#235347] text-sm">// MEDIA ASSET REPOSITORY</div>
                <div className="text-[10px] text-zinc-500">
                  Physical photographs and laboratory bench capture archives
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px]">
                  {['ALL', 'EVENTS', 'PROJECTS', 'COMMUNITY', 'PEOPLE'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedMediaCategory(cat)}
                      className={`px-2.5 py-1 rounded-xs font-bold ${
                        selectedMediaCategory === cat
                          ? 'bg-[#163B32] text-white'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowMediaModal(true)}
                  className="px-3 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-semibold flex items-center gap-1 text-xs"
                >
                  <Upload size={12} />
                  <span>UPLOAD ASSET</span>
                </button>
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaItems
                .filter((m) =>
                  selectedMediaCategory === 'ALL' ? true : m.category === selectedMediaCategory
                )
                .map((media) => (
                  <div
                    key={media.id}
                    className={`border rounded-xs p-3 flex flex-col justify-between ${
                      isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                    }`}
                  >
                    {/* Simulated Archival Photograph Container */}
                    <div
                      className={`w-full aspect-[4/3] rounded-2xs border flex flex-col justify-between p-3 mb-3 ${
                        isLight ? 'bg-[#edeae3] border-zinc-300' : 'bg-[#0d0e11] border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[8px] text-zinc-500">
                        <span>{media.dimensions}</span>
                        <span>{media.size}</span>
                      </div>

                      <div className="text-center my-auto">
                        <div className="text-[#235347] font-bold text-[10px]">[ PHOTO ASSET ]</div>
                        <div className="text-zinc-200 font-sans font-bold text-xs mt-1 truncate">
                          {media.name}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[8px] text-zinc-500">
                        <span>CAT: {media.category}</span>
                        <span>TAGS: {media.tags.join(', ')}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[10px]">
                      {media.caption && (
                        <p className="font-sans text-zinc-400 italic text-[11px] leading-tight">
                          "{media.caption}"
                        </p>
                      )}
                      <div className="flex items-center justify-between text-zinc-500 border-t pt-2 border-zinc-700/40">
                        <span>By {media.uploadedBy.split('@')[0]}</span>
                        <button
                          onClick={() => deleteMedia(media.id)}
                          className="text-red-400 hover:underline flex items-center gap-1"
                        >
                          <Trash2 size={10} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 4: MEMBERS */}
        {activeTab === 'MEMBERS' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div>
                <div className="font-bold text-[#235347] text-sm flex items-center gap-2">
                  <span>// MEMBER DIRECTORY & ACCESS CONTROL</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#235347]/15 text-[#235347] dark:text-[#99CDD8] font-sans font-semibold">
                    {users.length} {users.length === 1 ? 'Account' : 'Accounts'}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-500">
                  Registered members, role assignments, and laboratory security statuses.
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Search Box */}
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    placeholder="Search name, email, role..."
                    className="pl-7 pr-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-hidden focus:border-[#235347]"
                  />
                </div>

                <button
                  onClick={() => refreshMembers()}
                  className="px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800 flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 transition-colors"
                  title="Reload member profiles from Supabase database"
                >
                  <RefreshCw size={12} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {!isSuperAdmin && (
              <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-300 text-xs flex items-center gap-2.5">
                <Shield size={16} className="text-blue-400 shrink-0" />
                <span>
                  <strong>Admin View Mode:</strong> You can inspect member accounts. Modification of security roles and account suspension requires <strong>Super Admin</strong> clearance.
                </span>
              </div>
            )}

            <div
              className={`border rounded-xl overflow-hidden shadow-xs ${
                isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
              }`}
            >
              <table className="w-full text-left text-[11px]">
                <thead
                  className={`border-b text-[9px] uppercase tracking-wider text-zinc-500 ${
                    isLight ? 'bg-zinc-100' : 'bg-[#0e0f12]'
                  }`}
                >
                  <tr>
                    <th className="p-3">MEMBER IDENTITY</th>
                    <th className="p-3">EMAIL</th>
                    <th className="p-3">ROLE CLEARANCE</th>
                    <th className="p-3">ACCOUNT STATUS</th>
                    <th className="p-3">JOINED</th>
                    <th className="p-3 text-right">ADMIN ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/40">
                  {users
                    .filter((u) => {
                      if (!memberSearchQuery.trim()) return true;
                      const q = memberSearchQuery.toLowerCase();
                      return (
                        u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q) ||
                        u.roleId.toLowerCase().includes(q) ||
                        u.status.toLowerCase().includes(q) ||
                        (u.username && u.username.toLowerCase().includes(q))
                      );
                    })
                    .map((u) => {
                      const isCurrentUser = user?.id === u.userId || user?.id === u.id;
                      const roleDisplay = u.roleId === 'superadmin' || u.roleId === 'super_admin' ? 'SUPER ADMIN' : u.roleId === 'admin' ? 'ADMIN' : 'MEMBER';
                      const statusColor =
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : u.status === 'SUSPENDED'
                          ? 'bg-red-500/15 text-red-400 border-red-500/30'
                          : 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';

                      return (
                        <tr key={u.id} className="hover:bg-zinc-500/5 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-[#235347]/20 border border-[#235347]/40 flex items-center justify-center text-[11px] font-bold text-[#235347] dark:text-[#99CDD8]">
                                {u.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold font-sans flex items-center gap-1.5">
                                  <span>{u.name}</span>
                                  {isCurrentUser && (
                                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-zinc-700 text-zinc-300 font-mono">
                                      YOU
                                    </span>
                                  )}
                                </div>
                                {u.username && (
                                  <div className="text-zinc-500 text-[9px] font-mono">@{u.username}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3 text-zinc-400 font-mono text-[10px]">{u.email}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md border text-[9px] font-bold tracking-wider ${
                                u.roleId === 'superadmin' || u.roleId === 'super_admin'
                                  ? 'bg-[#235347]/20 text-[#235347] dark:text-[#99CDD8] border-[#235347]/40'
                                  : u.roleId === 'admin'
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                              }`}
                            >
                              {roleDisplay}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md border text-[9px] font-bold ${statusColor}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3 text-zinc-500 text-[10px]">{u.joinedDate}</td>
                          <td className="p-3 text-right">
                            {isSuperAdmin ? (
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Role Selector */}
                                <select
                                  value={u.roleId}
                                  onChange={(e) => {
                                    const nextRole = e.target.value;
                                    if (nextRole !== u.roleId) {
                                      setConfirmModal({
                                        isOpen: true,
                                        type: 'role',
                                        userId: u.id,
                                        userName: u.name,
                                        targetValue: nextRole,
                                      });
                                    }
                                  }}
                                  className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 py-1 px-2 rounded border border-zinc-300 dark:border-zinc-700 text-[10px] focus:outline-hidden focus:border-[#235347]"
                                >
                                  <option value="member">Set: Member</option>
                                  <option value="admin">Set: Admin</option>
                                  <option value="superadmin">Set: Super Admin</option>
                                </select>

                                {/* Status Selector */}
                                <select
                                  value={u.status}
                                  onChange={(e) => {
                                    const nextStatus = e.target.value;
                                    if (nextStatus !== u.status) {
                                      setConfirmModal({
                                        isOpen: true,
                                        type: 'status',
                                        userId: u.id,
                                        userName: u.name,
                                        targetValue: nextStatus,
                                      });
                                    }
                                  }}
                                  className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 py-1 px-2 rounded border border-zinc-300 dark:border-zinc-700 text-[10px] focus:outline-hidden focus:border-[#235347]"
                                >
                                  <option value="ACTIVE">ACTIVE</option>
                                  <option value="PENDING">PENDING</option>
                                  <option value="SUSPENDED">SUSPENDED</option>
                                </select>
                              </div>
                            ) : (
                              <span className="text-[10px] text-zinc-500 italic">Read-Only</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {users.length === 0 && (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No member records found.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: ACCESS & PERMISSIONS */}
        {activeTab === 'ACCESS' && (
          <div className="space-y-6">
            <div className="border-b pb-4">
              <div className="font-bold text-[#235347] text-sm">// ROLE & PERMISSION HIERARCHY</div>
              <div className="text-[10px] text-zinc-500">
                Granular capability matrix underlying the 3 primary clearance tiers
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-4 rounded-xs border space-y-3 ${
                    isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-sans font-bold text-sm">{role.name}</span>
                    <span className="text-[9px] text-zinc-500 font-mono">ID: {role.id}</span>
                  </div>

                  <p className="font-sans text-xs text-zinc-400">{role.description}</p>

                  <div>
                    <div className="text-[9px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">
                      GRANULAR CAPABILITIES:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-1.5 py-0.5 rounded-2xs bg-[#0e0f12] border border-zinc-800 text-[#235347] font-bold text-[9px]"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: AUDIT LOG & SITE SETTINGS */}
        {activeTab === 'SYSTEM' && (
          <div className="space-y-6">
            {/* Site Settings Configuration */}
            <div
              className={`p-5 rounded-xs border space-y-4 ${
                isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
              }`}
            >
              <div className="font-bold text-[#235347] text-sm border-b pb-2">
                // GLOBAL PLATFORM SETTINGS
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">
                    Site Headline Identity:
                  </label>
                  <input
                    type="text"
                    value={settings.siteTitle}
                    onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                    className="w-full p-2 rounded-xs border bg-transparent text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">
                    Official Contact Dispatch:
                  </label>
                  <input
                    type="text"
                    value={settings.contactEmail}
                    onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                    className="w-full p-2 rounded-xs border bg-transparent text-xs"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase mb-1">
                    Hero Supporting Tagline:
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => updateSettings({ tagline: e.target.value })}
                    className="w-full p-2 rounded-xs border bg-transparent text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Complete Chronological Audit Log Table */}
            <div
              className={`p-5 rounded-xs border space-y-3 ${
                isLight ? 'bg-[#faf8f5] border-zinc-300' : 'bg-[#14161a] border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-[#235347]">// IMMUTABLE AUDIT LOG</span>
                <span className="text-zinc-500 text-[9px]">{auditLogs.length} LOGGED EVENTS</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-[10px]">
                  <thead className="border-b text-[8px] uppercase text-zinc-500">
                    <tr>
                      <th className="p-2">TIMESTAMP</th>
                      <th className="p-2">ACTOR</th>
                      <th className="p-2">ACTION</th>
                      <th className="p-2">TARGET</th>
                      <th className="p-2">DETAILS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700/30">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-zinc-500/5">
                        <td className="p-2 text-zinc-500 font-mono">{log.timestamp}</td>
                        <td className="p-2">
                          <span className="font-bold">{log.actorName}</span>
                          <span className="text-zinc-500 ml-1">({log.actorRole})</span>
                        </td>
                        <td className="p-2">
                          <span className="px-1.5 py-0.5 rounded-2xs bg-zinc-800 text-zinc-200 font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-2 text-[#235347] font-bold">{log.targetType}</td>
                        <td className="p-2 text-zinc-300">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: CREATE PROJECT */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg p-6 rounded-xs border space-y-4 shadow-xl ${
              isLight ? 'bg-[#faf8f5] border-zinc-400 text-zinc-900' : 'bg-[#14161a] border-zinc-700 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-[#235347]">// NEW ENGINEERING PROJECT</span>
              <button onClick={() => setShowProjectModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addProject({
                  title: projForm.title,
                  category: projForm.category,
                  description: projForm.description,
                  visualLabel: projForm.visualLabel || 'PHOTO // ARTIFACT PREVIEW',
                  contributors: projForm.contributors.split(',').map((s) => s.trim()),
                  status: projForm.status,
                  gitUrl: projForm.gitUrl || 'https://github.com/detox-build',
                  specs: projForm.specs.split(',').map((s) => s.trim()),
                });
                setShowProjectModal(false);
              }}
              className="space-y-3 text-xs font-mono"
            >
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Project Title:</label>
                <input
                  required
                  type="text"
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  placeholder="e.g. detox-net: Zero-Copy Packet Sockets"
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase">Category:</label>
                  <select
                    value={projForm.category}
                    onChange={(e) => setProjForm({ ...projForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="RESEARCH">RESEARCH</option>
                    <option value="OSS">OSS</option>
                    <option value="CODING">CODING</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase">Publication Status:</label>
                  <select
                    value={projForm.status}
                    onChange={(e) => setProjForm({ ...projForm, status: e.target.value as any })}
                    className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-bold text-[#235347] dark:text-[#38B2A2]"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="PUBLISHED">PUBLISHED (LIVE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">1-Sentence Description:</label>
                <textarea
                  required
                  rows={2}
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  placeholder="Brief factual summary of what is built."
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Contributors (comma-separated):</label>
                <input
                  type="text"
                  value={projForm.contributors}
                  onChange={(e) => setProjForm({ ...projForm, contributors: e.target.value })}
                  placeholder="Dev P., Sneha T."
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Technical Specs (comma-separated):</label>
                <input
                  type="text"
                  value={projForm.specs}
                  onChange={(e) => setProjForm({ ...projForm, specs: e.target.value })}
                  placeholder="C11, 4-Layer PCB, 10Gbps"
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-3 py-1.5 rounded-xs border text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE EVENT */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-lg p-6 rounded-xs border space-y-4 shadow-xl ${
              isLight ? 'bg-[#faf8f5] border-zinc-400 text-zinc-900' : 'bg-[#14161a] border-zinc-700 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-[#235347]">// CREATE LAB EVENT</span>
              <button onClick={() => setShowEventModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addEvent({
                  title: eventForm.title,
                  code: eventForm.code || `EVT-${Date.now().toString().slice(-4)}`,
                  category: eventForm.category,
                  date: eventForm.date || 'OCTOBER 25, 2026',
                  time: eventForm.time || '18:00 - 21:00 IST',
                  location: eventForm.location || 'DETOX HARDWARE LAB',
                  capacity: eventForm.capacity || '20 BENCHES',
                  description: eventForm.description,
                  photoLabel: eventForm.photoLabel || 'PHOTO // LAB BENCH SESSION',
                  photoCaption: eventForm.photoCaption || 'Physical hands-on engineering deconstruction.',
                  deliverables: eventForm.deliverables
                    ? eventForm.deliverables.split(',').map((s) => s.trim())
                    : ['Verified prototype artifact'],
                  status: eventForm.status,
                  isUpcoming: eventForm.isUpcoming,
                });
                setShowEventModal(false);
              }}
              className="space-y-3 text-xs font-mono"
            >
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Event Title:</label>
                <input
                  required
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. RISC-V Custom Instructions Bring-Up"
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase">Category:</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="WORKSHOP">WORKSHOP</option>
                    <option value="PAPER SALON">PAPER SALON</option>
                    <option value="WEEKEND BUILD">WEEKEND BUILD</option>
                    <option value="SECURITY AUDIT">SECURITY AUDIT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase">Status & Timeline:</label>
                  <div className="flex gap-2">
                    <select
                      value={eventForm.status}
                      onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as any })}
                      className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-bold text-[#235347] dark:text-[#38B2A2]"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="REVIEW">REVIEW</option>
                      <option value="PUBLISHED">PUBLISHED (LIVE)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase">Date (e.g. OCTOBER 25, 2026):</label>
                  <input
                    type="text"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="OCTOBER 25, 2026"
                    className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase">Timeline Group:</label>
                  <select
                    value={eventForm.isUpcoming ? 'UPCOMING' : 'ARCHIVE'}
                    onChange={(e) => setEventForm({ ...eventForm, isUpcoming: e.target.value === 'UPCOMING' })}
                    className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="UPCOMING">UPCOMING SCHEDULE</option>
                    <option value="ARCHIVE">ARCHIVE / WHAT WE BUILT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">1-2 Sentence Description:</label>
                <textarea
                  required
                  rows={2}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Crisp factual description of the hands-on event."
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Deliverables (comma-separated):</label>
                <input
                  type="text"
                  value={eventForm.deliverables}
                  onChange={(e) => setEventForm({ ...eventForm, deliverables: e.target.value })}
                  placeholder="Assembled board, Verified test suite"
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-3 py-1.5 rounded-xs border text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-bold"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD MEDIA */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-xs border space-y-4 shadow-xl ${
              isLight ? 'bg-[#faf8f5] border-zinc-400 text-zinc-900' : 'bg-[#14161a] border-zinc-700 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-[#235347]">// UPLOAD PHOTO ASSET</span>
              <button onClick={() => setShowMediaModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMedia({
                  name: mediaForm.name || `photo_${Date.now()}.jpg`,
                  category: mediaForm.category,
                  tags: mediaForm.tags ? mediaForm.tags.split(',').map((s) => s.trim()) : ['lab'],
                  caption: mediaForm.caption,
                  size: mediaForm.size,
                  dimensions: mediaForm.dimensions,
                });
                setShowMediaModal(false);
              }}
              className="space-y-3 text-xs font-mono"
            >
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Asset Filename:</label>
                <input
                  required
                  type="text"
                  value={mediaForm.name}
                  onChange={(e) => setMediaForm({ ...mediaForm, name: e.target.value })}
                  placeholder="e.g. solder_bench_macro.jpg"
                  className="w-full p-2 rounded-xs border bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Category Tag:</label>
                <select
                  value={mediaForm.category}
                  onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value as any })}
                  className="w-full p-2 rounded-xs border bg-transparent"
                >
                  <option value="EVENTS">EVENTS</option>
                  <option value="PROJECTS">PROJECTS</option>
                  <option value="COMMUNITY">COMMUNITY</option>
                  <option value="PEOPLE">PEOPLE</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Tags (comma-separated):</label>
                <input
                  type="text"
                  value={mediaForm.tags}
                  onChange={(e) => setMediaForm({ ...mediaForm, tags: e.target.value })}
                  placeholder="workbench, oscilloscope, 35mm"
                  className="w-full p-2 rounded-xs border bg-transparent"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Caption / Physical Context:</label>
                <input
                  type="text"
                  value={mediaForm.caption}
                  onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                  placeholder="Probing differential clock signals on board rev 2."
                  className="w-full p-2 rounded-xs border bg-transparent"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMediaModal(false)}
                  className="px-3 py-1.5 rounded-xs border text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-bold"
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PERSON (Minds Behind DETOX Clean CMS Form) */}
      {showPersonModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`w-full max-w-3xl p-6 sm:p-8 rounded-3xl border space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto ${
              isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#14161a] border-zinc-800 text-zinc-100'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shadow-xs"
                  style={{ backgroundColor: personForm.paletteAccent }}
                />
                <h3 className="font-display font-bold text-xl text-zinc-950 dark:text-zinc-50">
                  {editingPersonId ? 'Edit Person' : 'Add Person'}
                </h3>
                <span className="text-xs text-zinc-500 font-sans">
                  · Minds Behind DETOX
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPersonModal(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const trimmedName = personForm.name.trim();
                if (!trimmedName) return;

                const computedSlug =
                  personForm.slug.trim() ||
                  trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ||
                  `builder-${Date.now()}`;

                const role = personForm.roleArea.trim() || 'Member';
                const focus = personForm.focusTag.trim() || role;
                const sentence = personForm.oneSentence.trim();

                const personData: any = {
                  name: trimmedName,
                  slug: computedSlug,
                  roleArea: role,
                  focusTag: focus,
                  oneSentence: sentence,
                  biography: personForm.biography.trim(),
                  areaOfContribution: personForm.areaOfContribution.trim(),
                  activeProject: personForm.activeProject.trim() || (projects[0]?.title || 'detox-os'),
                  contributedProjectIds: personForm.contributedProjectIds,
                  participatedEventIds: personForm.participatedEventIds,
                  githubUrl: personForm.githubUrl.trim(),
                  email: personForm.email.trim() || `${computedSlug}@detox.build`,
                  socialLinks: {
                    github: personForm.githubUrl.trim() || undefined,
                    linkedin: personForm.linkedin.trim() || undefined,
                    website: personForm.website.trim() || undefined,
                    twitter: personForm.twitter.trim() || undefined,
                    discord: personForm.discord?.trim() || undefined,
                    telegram: personForm.telegram?.trim() || undefined,
                    instagram: personForm.instagram?.trim() || undefined,
                    youtube: personForm.youtube?.trim() || undefined,
                    blog: personForm.blog?.trim() || undefined,
                  },
                  photoUrl: personForm.cutoutUrl || personForm.photoUrl || undefined,
                  cutoutUrl: personForm.cutoutUrl || personForm.photoUrl || undefined,
                  originalPhotoUrl: personForm.originalPhotoUrl || undefined,
                  stagePosition: { x: Number(personForm.stagePositionX), y: Number(personForm.stagePositionY) },
                  stageScale: Number(personForm.stageScale),
                  stageRotation: Number(personForm.stageRotation),
                  stageZIndex: Number(personForm.stageZIndex),
                  isForegroundAnchor: Boolean(personForm.isForegroundAnchor),
                  cutoutContour: personForm.cutoutContour,
                  photoLabel: trimmedName,
                  photoCaption: sentence,
                  collageSize: personForm.collageSize,
                  aspectRatio: personForm.aspectRatio,
                  paletteAccent: personForm.paletteAccent,
                  tagVariant: personForm.tagVariant,
                  status: personForm.status,
                };

                if (editingPersonId) {
                  updatePerson(editingPersonId, personData);
                } else {
                  addPerson(personData);
                }

                setShowPersonModal(false);
              }}
              className="space-y-6 text-xs font-sans"
            >
              {/* 1. PHOTO SECTION (OPTIONAL) */}
              <div className="space-y-2 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                  Photo & Cut-Out (Optional)
                </label>
                <p className="text-xs text-zinc-500 mb-3">
                  Upload a photo now or add it later. One-click background removal isolates silhouettes for the collective stage.
                </p>
                <ImageCutoutUploader
                  currentCutoutUrl={personForm.cutoutUrl || personForm.photoUrl}
                  currentOriginalUrl={personForm.originalPhotoUrl}
                  personName={personForm.name || 'Builder'}
                  paletteAccent={personForm.paletteAccent}
                  onChange={({ cutoutUrl, originalPhotoUrl }) =>
                    setPersonForm({
                      ...personForm,
                      cutoutUrl,
                      originalPhotoUrl: originalPhotoUrl || personForm.originalPhotoUrl,
                      photoUrl: cutoutUrl,
                    })
                  }
                />
              </div>

              {/* 2. BASIC INFORMATION */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800 pb-1.5 flex items-center justify-between">
                  <span>Basic Information</span>
                  <span className="text-[11px] font-normal text-zinc-500 lowercase">only name is required to save</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={personForm.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                        setPersonForm({
                          ...personForm,
                          name,
                          slug: editingPersonId ? personForm.slug : autoSlug,
                        });
                      }}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={personForm.roleArea}
                      onChange={(e) => setPersonForm({ ...personForm, roleArea: e.target.value })}
                      placeholder="e.g. Founder, AI Researcher, Developer, Core Member..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Discipline / Focus Tag
                  </label>
                  <input
                    type="text"
                    value={personForm.focusTag}
                    onChange={(e) => setPersonForm({ ...personForm, focusTag: e.target.value })}
                    placeholder="e.g. Microkernel IPC, CUDA & Matrix Math, Hardware, Distributed Systems"
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Short Description / Teaser
                  </label>
                  <textarea
                    rows={2}
                    value={personForm.oneSentence}
                    onChange={(e) => setPersonForm({ ...personForm, oneSentence: e.target.value })}
                    placeholder="1-2 sentences on what they build or lead (optional, can be added later)."
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Areas of Contribution
                  </label>
                  <input
                    type="text"
                    value={personForm.areaOfContribution}
                    onChange={(e) => setPersonForm({ ...personForm, areaOfContribution: e.target.value })}
                    placeholder="e.g. Multi-Layer PCB Layout, Lock-Free Concurrency, CUDA Shared Memory"
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Student Story & Biography
                  </label>
                  <textarea
                    rows={3}
                    value={personForm.biography}
                    onChange={(e) => setPersonForm({ ...personForm, biography: e.target.value })}
                    placeholder="Student background, what motivated them, what they built from layer N-1, and craft philosophy."
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs"
                  />
                </div>

                {/* Identity Color Picker */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Identity Color</span>
                    <span className="font-mono text-[11px]" style={{ color: personForm.paletteAccent }}>
                      Selected: {personForm.paletteAccent}
                    </span>
                  </label>
                  <div className="grid grid-cols-7 sm:grid-cols-11 gap-1.5 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    {DETOX_PALETTE.map((c) => {
                      const isPicked = personForm.paletteAccent.toLowerCase() === c.hex.toLowerCase();
                      return (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() =>
                            setPersonForm({
                              ...personForm,
                              paletteAccent: c.hex,
                              tagVariant: c.id,
                            })
                          }
                          className={`h-7 rounded-lg transition-transform relative flex items-center justify-center ${
                            isPicked ? 'scale-110 ring-2 ring-black dark:ring-white z-10' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={`${c.name} (${c.hex}) - ${c.role}`}
                        >
                          {isPicked && <span className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 3. DETOX CONNECTIONS (PROJECTS & EVENTS) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                  DETOX Connections
                </h4>
                <p className="text-xs text-zinc-500">
                  Select existing projects and events from the CMS that this builder contributes to.
                </p>

                {/* Projects Selector */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Connected Projects ({personForm.contributedProjectIds.length} selected)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                    {projects.map((proj) => {
                      const isSelected = personForm.contributedProjectIds.includes(proj.id);
                      return (
                        <label
                          key={proj.id}
                          className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#235347] bg-[#235347]/10 text-zinc-900 dark:text-white font-medium'
                              : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPersonForm({
                                  ...personForm,
                                  contributedProjectIds: [...personForm.contributedProjectIds, proj.id],
                                  activeProject: personForm.activeProject || proj.title,
                                });
                              } else {
                                setPersonForm({
                                  ...personForm,
                                  contributedProjectIds: personForm.contributedProjectIds.filter(
                                    (id) => id !== proj.id
                                  ),
                                });
                              }
                            }}
                            className="accent-[#38B2A2] rounded cursor-pointer shrink-0"
                          />
                          <span className="truncate">{proj.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Events Selector */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                    Workshops & Sprints Led or Attended ({personForm.participatedEventIds.length} selected)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                    {events.map((evt) => {
                      const isSelected = personForm.participatedEventIds.includes(evt.id);
                      return (
                        <label
                          key={evt.id}
                          className={`p-2 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-[#235347] bg-[#235347]/10 text-zinc-900 dark:text-white font-medium'
                              : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPersonForm({
                                  ...personForm,
                                  participatedEventIds: [...personForm.participatedEventIds, evt.id],
                                });
                              } else {
                                setPersonForm({
                                  ...personForm,
                                  participatedEventIds: personForm.participatedEventIds.filter(
                                    (id) => id !== evt.id
                                  ),
                                });
                              }
                            }}
                            className="accent-[#38B2A2] rounded cursor-pointer shrink-0"
                          />
                          <span className="truncate">{evt.title}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. PUBLIC LINKS */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
                  Public Links & Channels (Optional)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={personForm.githubUrl}
                      onChange={(e) => setPersonForm({ ...personForm, githubUrl: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={personForm.linkedin}
                      onChange={(e) => setPersonForm({ ...personForm, linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Website / Portfolio URL
                    </label>
                    <input
                      type="url"
                      value={personForm.website}
                      onChange={(e) => setPersonForm({ ...personForm, website: e.target.value })}
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Twitter / X URL
                    </label>
                    <input
                      type="url"
                      value={personForm.twitter}
                      onChange={(e) => setPersonForm({ ...personForm, twitter: e.target.value })}
                      placeholder="https://twitter.com/..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Discord (Invite or Handle)
                    </label>
                    <input
                      type="text"
                      value={personForm.discord || ''}
                      onChange={(e) => setPersonForm({ ...personForm, discord: e.target.value })}
                      placeholder="https://discord.gg/... or username"
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Telegram URL / Username
                    </label>
                    <input
                      type="text"
                      value={personForm.telegram || ''}
                      onChange={(e) => setPersonForm({ ...personForm, telegram: e.target.value })}
                      placeholder="https://t.me/... or @username"
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Instagram Profile URL
                    </label>
                    <input
                      type="url"
                      value={personForm.instagram || ''}
                      onChange={(e) => setPersonForm({ ...personForm, instagram: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      YouTube / Channel URL
                    </label>
                    <input
                      type="url"
                      value={personForm.youtube || ''}
                      onChange={(e) => setPersonForm({ ...personForm, youtube: e.target.value })}
                      placeholder="https://youtube.com/@..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Blog / Substack / Technical Writing URL
                    </label>
                    <input
                      type="url"
                      value={personForm.blog || ''}
                      onChange={(e) => setPersonForm({ ...personForm, blog: e.target.value })}
                      placeholder="https://substack.com/... or https://..."
                      className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 5. VISIBILITY STATUS & SPOTLIGHT */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Visibility
                  </label>
                  <select
                    value={personForm.status}
                    onChange={(e) => setPersonForm({ ...personForm, status: e.target.value as ContentStatus })}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold"
                  >
                    <option value="PUBLISHED">Published (Visible in Minds Behind DETOX)</option>
                    <option value="DRAFT">Draft (Hidden from Public)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-center">
                  <label className="flex items-center gap-2 cursor-pointer mt-3 sm:mt-0">
                    <input
                      type="checkbox"
                      checked={personForm.isForegroundAnchor}
                      onChange={(e) => setPersonForm({ ...personForm, isForegroundAnchor: e.target.checked })}
                      className="accent-[#38B2A2] rounded cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Spotlight Lead Anchor
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        Places this builder in the prominent foreground of the collage.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPersonModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  {editingPersonId ? 'Save Changes' : 'Save Person'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ACCOMPLISHMENT */}
      {showAccomplishmentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-xs border space-y-4 shadow-xl ${
              isLight ? 'bg-[#faf8f5] border-zinc-400 text-zinc-900' : 'bg-[#14161a] border-zinc-700 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-[#235347]">// RECORD GENUINE ACCOMPLISHMENT</span>
              <button onClick={() => setShowAccomplishmentModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAccomplishment({
                  title: accForm.title,
                  date: accForm.date || 'SEPTEMBER 2026',
                  category: accForm.category,
                  description: accForm.description,
                  impact: accForm.impact,
                  status: accForm.status,
                });
                setShowAccomplishmentModal(false);
              }}
              className="space-y-3 text-xs font-mono"
            >
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Title:</label>
                <input
                  required
                  type="text"
                  value={accForm.title}
                  onChange={(e) => setAccForm({ ...accForm, title: e.target.value })}
                  placeholder="e.g. FPGA Ethernet Core Verified on Hardware"
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase">Category:</label>
                  <select
                    value={accForm.category}
                    onChange={(e) => setAccForm({ ...accForm, category: e.target.value as any })}
                    className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                  >
                    <option value="MILESTONE">MILESTONE</option>
                    <option value="AWARD">AWARD</option>
                    <option value="HACKATHON">HACKATHON</option>
                    <option value="SELECTION">SELECTION</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase">Date (e.g. SEPT 2026):</label>
                  <input
                    type="text"
                    value={accForm.date}
                    onChange={(e) => setAccForm({ ...accForm, date: e.target.value })}
                    placeholder="SEPTEMBER 2026"
                    className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Factual Description:</label>
                <textarea
                  required
                  rows={2}
                  value={accForm.description}
                  onChange={(e) => setAccForm({ ...accForm, description: e.target.value })}
                  placeholder="What was physically achieved or proven."
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Measurable Impact:</label>
                <input
                  type="text"
                  value={accForm.impact}
                  onChange={(e) => setAccForm({ ...accForm, impact: e.target.value })}
                  placeholder="100% packet transmission at line rate."
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAccomplishmentModal(false)}
                  className="px-3 py-1.5 rounded-xs border text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-bold"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ANNOUNCEMENT */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-xs border space-y-4 shadow-xl ${
              isLight ? 'bg-[#faf8f5] border-zinc-400 text-zinc-900' : 'bg-[#14161a] border-zinc-700 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-bold text-[#235347] dark:text-[#99CDD8]">// DISPATCH ANNOUNCEMENT</span>
              <button onClick={() => setShowAnnouncementModal(false)}>
                <X size={14} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addAnnouncement({
                  title: annForm.title,
                  content: annForm.content,
                  type: annForm.type,
                  date: new Date().toISOString().split('T')[0],
                  active: true,
                  status: annForm.status,
                });
                setShowAnnouncementModal(false);
              }}
              className="space-y-3 text-xs font-mono"
            >
              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Announcement Headline:</label>
                <input
                  required
                  type="text"
                  value={annForm.title}
                  onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                  placeholder="e.g. New Oscilloscope Arrived in Lab 2"
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Type:</label>
                <select
                  value={annForm.type}
                  onChange={(e) => setAnnForm({ ...annForm, type: e.target.value as any })}
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100"
                >
                  <option value="INFO">INFO</option>
                  <option value="RELEASE">RELEASE</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-zinc-500 uppercase">Body Content:</label>
                <textarea
                  required
                  rows={3}
                  value={annForm.content}
                  onChange={(e) => setAnnForm({ ...annForm, content: e.target.value })}
                  placeholder="Concise operational details."
                  className="w-full p-2 rounded-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAnnouncementModal(false)}
                  className="px-3 py-1.5 rounded-xs border text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#163B32] hover:bg-[#235347] text-white rounded-xs font-bold"
                >
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM ROLE / STATUS CHANGE */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`w-full max-w-md p-6 rounded-2xl border space-y-4 shadow-2xl ${
              isLight ? 'bg-[#faf8f5] border-zinc-400 text-zinc-900' : 'bg-[#14161a] border-zinc-700 text-zinc-100'
            }`}
          >
            <div className="flex items-center gap-3 border-b border-zinc-700/50 pb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  confirmModal.targetValue === 'SUSPENDED' || confirmModal.targetValue === 'superadmin' || confirmModal.targetValue === 'super_admin'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-[#235347]/20 text-[#235347] dark:text-[#99CDD8]'
                }`}
              >
                <AlertTriangle size={18} />
              </div>
              <div>
                <span className="font-bold text-sm">
                  {confirmModal.type === 'role' ? '// CONFIRM ROLE ELEVATION' : '// CONFIRM ACCOUNT STATUS'}
                </span>
                <div className="text-[10px] text-zinc-500">Security Clearance Authorization</div>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
              <p>
                Are you sure you want to change <strong className="text-white font-semibold">{confirmModal.userName}</strong>'s {confirmModal.type} to:
              </p>
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-700/60 text-center">
                <span className="font-mono text-sm font-bold text-[#235347] dark:text-[#99CDD8] uppercase">
                  {confirmModal.targetValue}
                </span>
              </div>
              {(confirmModal.targetValue === 'superadmin' || confirmModal.targetValue === 'super_admin') && (
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                  <strong>Warning:</strong> Super Admins possess full authority over the platform including member promotion, database mutations, and system configuration.
                </div>
              )}
              {confirmModal.targetValue === 'SUSPENDED' && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[11px]">
                  <strong>Warning:</strong> Suspending this account will immediately revoke all dashboard and lab privileges.
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (confirmModal.type === 'role') {
                    await updateUserRole(confirmModal.userId, confirmModal.targetValue);
                  } else {
                    await updateUserStatus(confirmModal.userId, confirmModal.targetValue as any);
                  }
                  setConfirmModal(null);
                }}
                className="px-5 py-2 bg-[#163B32] hover:bg-[#235347] text-white rounded-xl font-bold text-xs transition-colors"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
