import React, { useState, useMemo } from 'react';
import { useCms } from '../../cms/CmsContext';
import { useTheme } from '../../ThemeContext';
import { classifyHackathon } from '../../cms/hackathonUtils';
import type { HackathonItem, HackathonStatus, SubmissionItem } from '../../cms/types';
import {
  Users,
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Layers,
  ArrowRight,
  Search,
  X,
  Archive,
  Play,
} from 'lucide-react';

export const AdminHackathonsSection: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const {
    hackathons,
    hackathonRegistrations,
    submissions,
    addHackathon,
    updateHackathon,
    deleteHackathon,
    setHackathonStatus,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    setSubmissionPublished,
    updateRegistrationStatus,
  } = useCms();

  // Selected Hackathon Workspace
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [hackathonSubTab, setHackathonSubTab] = useState<'SUBMISSIONS' | 'REGISTRATIONS' | 'SETTINGS'>('SUBMISSIONS');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [submissionFilter, setSubmissionFilter] = useState<'ALL' | 'PUBLISHED' | 'UNPUBLISHED' | 'WINNERS'>('ALL');

  // Modals
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<HackathonItem | null>(null);

  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<SubmissionItem | null>(null);

  // Hackathon Form State
  const [hackForm, setHackForm] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    status: 'UPCOMING' as HackathonStatus,
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    submissionDeadline: '',
    theme: '',
    categories: '',
    organizer: 'DETOX Engineering Collective',
    location: 'DETOX Hardware Lab & Discord',
    capacity: '64 Builders / 18 Teams',
    coverImage: '',
    bannerImage: '',
    rules: '',
    isPublished: true,
  });

  // Submission Form State
  const [subForm, setSubForm] = useState({
    title: '',
    slug: '',
    teamName: '',
    participantNames: '',
    category: '',
    description: '',
    coverImage: '',
    demoUrl: '',
    repositoryUrl: '',
    techStack: '',
    resultBadge: '',
    published: true,
  });

  // Selected Hackathon Entity
  const selectedHackathon = useMemo(() => {
    if (!selectedHackathonId) return null;
    return hackathons.find((h) => h.id === selectedHackathonId) || null;
  }, [hackathons, selectedHackathonId]);

  // Submissions for the selected hackathon
  const hackathonSubmissions = useMemo(() => {
    if (!selectedHackathon) return [];
    return submissions.filter(
      (s) =>
        s.hackathonId === selectedHackathon.id ||
        s.eventId === selectedHackathon.id ||
        (selectedHackathon.slug && (s.hackathonId === selectedHackathon.slug || s.eventId === selectedHackathon.slug))
    );
  }, [submissions, selectedHackathon]);

  // Registrations for the selected hackathon
  const hackathonRegistrationsList = useMemo(() => {
    if (!selectedHackathon) return [];
    return hackathonRegistrations.filter(
      (r) =>
        r.hackathonId === selectedHackathon.id ||
        (selectedHackathon.slug && r.hackathonId === selectedHackathon.slug)
    );
  }, [hackathonRegistrations, selectedHackathon]);

  // Filtered hackathon list
  const filteredHackathons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return hackathons;
    return hackathons.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        (h.theme || '').toLowerCase().includes(q)
    );
  }, [hackathons, searchQuery]);

  const upcomingOngoing = useMemo(() => {
    return filteredHackathons.filter((h) => {
      const c = classifyHackathon(h);
      return c === 'UPCOMING' || c === 'ONGOING';
    });
  }, [filteredHackathons]);

  const previousHackathons = useMemo(() => {
    return filteredHackathons.filter((h) => {
      const c = classifyHackathon(h);
      return c === 'PREVIOUS';
    });
  }, [filteredHackathons]);

  // Open Create Hackathon Modal
  const handleOpenCreateHackathon = () => {
    setEditingHackathon(null);
    setHackForm({
      title: '',
      slug: '',
      tagline: '',
      description: '',
      status: 'UPCOMING',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      registrationDeadline: '',
      submissionDeadline: '',
      theme: '',
      categories: 'Systems, Game Engine, Bare-Metal',
      organizer: 'DETOX Engineering Collective',
      location: 'DETOX Hardware Lab & Discord',
      capacity: '64 Builders / 18 Teams',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
      rules: '1. All code built during the sprint.\n2. Open source with clean architecture.\n3. Playable demo required.',
      isPublished: true,
    });
    setShowHackathonModal(true);
  };

  // Open Edit Hackathon Modal
  const handleOpenEditHackathon = (h: HackathonItem) => {
    setEditingHackathon(h);
    setHackForm({
      title: h.title,
      slug: h.slug,
      tagline: h.tagline,
      description: h.description,
      status: h.status,
      startDate: h.startDate.split('T')[0],
      endDate: h.endDate.split('T')[0],
      registrationDeadline: h.registrationDeadline ? h.registrationDeadline.split('T')[0] : '',
      submissionDeadline: h.submissionDeadline ? h.submissionDeadline.split('T')[0] : '',
      theme: h.theme || '',
      categories: h.categories.join(', '),
      organizer: h.organizer,
      location: h.location || '',
      capacity: h.capacity || '',
      coverImage: h.coverImage || '',
      bannerImage: h.bannerImage || '',
      rules: h.rules || '',
      isPublished: h.isPublished,
    });
    setShowHackathonModal(true);
  };

  // Save Hackathon
  const handleSaveHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hackForm.title.trim()) return;

    const slug =
      hackForm.slug.trim() ||
      hackForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const categories = hackForm.categories
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    if (editingHackathon) {
      await updateHackathon(editingHackathon.id, {
        title: hackForm.title.trim(),
        slug,
        tagline: hackForm.tagline.trim(),
        description: hackForm.description.trim(),
        status: hackForm.status,
        startDate: hackForm.startDate,
        endDate: hackForm.endDate,
        registrationDeadline: hackForm.registrationDeadline || undefined,
        submissionDeadline: hackForm.submissionDeadline || undefined,
        theme: hackForm.theme.trim(),
        categories,
        organizer: hackForm.organizer.trim(),
        location: hackForm.location.trim() || undefined,
        capacity: hackForm.capacity.trim() || undefined,
        coverImage: hackForm.coverImage.trim() || undefined,
        bannerImage: hackForm.bannerImage.trim() || undefined,
        rules: hackForm.rules.trim(),
        isPublished: hackForm.isPublished,
      });
    } else {
      await addHackathon({
        title: hackForm.title.trim(),
        slug,
        tagline: hackForm.tagline.trim(),
        description: hackForm.description.trim(),
        status: hackForm.status,
        startDate: hackForm.startDate,
        endDate: hackForm.endDate,
        registrationDeadline: hackForm.registrationDeadline || undefined,
        submissionDeadline: hackForm.submissionDeadline || undefined,
        theme: hackForm.theme.trim(),
        categories,
        organizer: hackForm.organizer.trim(),
        location: hackForm.location.trim() || undefined,
        capacity: hackForm.capacity.trim() || undefined,
        coverImage: hackForm.coverImage.trim() || undefined,
        bannerImage: hackForm.bannerImage.trim() || undefined,
        rules: hackForm.rules.trim(),
        isPublished: hackForm.isPublished,
      });
    }

    setShowHackathonModal(false);
  };

  // Delete Hackathon
  const handleDeleteHackathon = async (h: HackathonItem) => {
    if (confirm(`Are you sure you want to delete hackathon "${h.title}"? This will remove its associated registrations and submissions.`)) {
      await deleteHackathon(h.id);
      if (selectedHackathonId === h.id) {
        setSelectedHackathonId(null);
      }
    }
  };

  // Open Edit Submission Modal
  const handleOpenEditSubmission = (s: SubmissionItem) => {
    setEditingSubmission(s);
    setSubForm({
      title: s.title,
      slug: s.slug || s.id,
      teamName: s.teamName || '',
      participantNames: s.participantNames.join(', '),
      category: s.category || '',
      description: s.description,
      coverImage: s.coverImage || '',
      demoUrl: s.demoUrl || '',
      repositoryUrl: s.repositoryUrl || '',
      techStack: (s.techStack || []).join(', '),
      resultBadge: s.resultBadge || '',
      published: s.published,
    });
    setShowSubmissionModal(true);
  };

  // Open Add Submission Modal
  const handleOpenAddSubmission = () => {
    if (!selectedHackathon) return;
    setEditingSubmission(null);
    setSubForm({
      title: '',
      slug: '',
      teamName: '',
      participantNames: '',
      category: selectedHackathon.categories[0] || 'General',
      description: '',
      coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      demoUrl: '',
      repositoryUrl: '',
      techStack: 'Rust, WebGPU',
      resultBadge: '',
      published: true,
    });
    setShowSubmissionModal(true);
  };

  // Save Submission
  const handleSaveSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.title.trim()) return;

    const participants = subForm.participantNames
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
    const techStack = subForm.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingSubmission) {
      await updateSubmission(editingSubmission.id, {
        title: subForm.title.trim(),
        slug: subForm.slug.trim() || undefined,
        teamName: subForm.teamName.trim() || undefined,
        participantNames: participants,
        category: subForm.category.trim() || undefined,
        description: subForm.description.trim(),
        coverImage: subForm.coverImage.trim() || undefined,
        demoUrl: subForm.demoUrl.trim() || undefined,
        repositoryUrl: subForm.repositoryUrl.trim() || undefined,
        techStack,
        resultBadge: subForm.resultBadge.trim() || undefined,
        published: subForm.published,
      });
    } else if (selectedHackathon) {
      await addSubmission({
        hackathonId: selectedHackathon.id,
        eventId: selectedHackathon.id,
        title: subForm.title.trim(),
        slug: subForm.slug.trim() || subForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        teamName: subForm.teamName.trim() || undefined,
        participantNames: participants,
        category: subForm.category.trim() || undefined,
        description: subForm.description.trim(),
        coverImage: subForm.coverImage.trim() || undefined,
        demoUrl: subForm.demoUrl.trim() || undefined,
        repositoryUrl: subForm.repositoryUrl.trim() || undefined,
        techStack,
        resultBadge: subForm.resultBadge.trim() || undefined,
        published: subForm.published,
      });
    }

    setShowSubmissionModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#235347]/15 text-[#235347] dark:text-[#99CDD8] font-bold">
              ADMIN CONTROL ROOM
            </span>
            <span className="text-xs font-mono text-zinc-500">
              [{hackathons.length} HACKATHONS RECORDED]
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold text-zinc-950 dark:text-zinc-50">
            Hackathons & Build Sprint Management
          </h2>
          <p className="text-xs text-zinc-500 font-sans mt-0.5">
            Manage upcoming and previous competitions, curate project archives, review submissions, and manage registrations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleOpenCreateHackathon}
            className="px-4 py-2 bg-[#235347] hover:bg-[#1a3f36] text-white rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus size={14} />
            <span>Create Hackathon</span>
          </button>
        </div>
      </div>

      {/* 2. Workspace View (if a hackathon is selected) OR Directory View */}
      {selectedHackathon ? (
        /* ================= SELECTED HACKATHON WORKSPACE ================= */
        <div className="space-y-6">
          {/* Breadcrumb & Hackathon Info Header */}
          <div
            className={`p-6 rounded-2xl border transition-colors ${
              isLight ? 'bg-white border-zinc-200' : 'bg-[#14161a] border-zinc-800'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <button
                onClick={() => setSelectedHackathonId(null)}
                className="text-xs font-mono text-[#235347] dark:text-[#99CDD8] hover:underline flex items-center gap-1"
              >
                &larr; Return to All Hackathons
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`#/hackathons/${selectedHackathon.slug || selectedHackathon.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-mono flex items-center gap-1"
                >
                  <Eye size={12} />
                  <span>Public Page</span>
                </a>

                <button
                  onClick={() => handleOpenEditHackathon(selectedHackathon)}
                  className="px-3 py-1.5 bg-[#235347] hover:bg-[#1a3f36] text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 size={12} />
                  <span>Edit Hackathon</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      selectedHackathon.status === 'ONGOING'
                        ? 'bg-emerald-500 text-black'
                        : selectedHackathon.status === 'UPCOMING'
                        ? 'bg-amber-400 text-black'
                        : 'bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    {selectedHackathon.status}
                  </span>
                  <span className="text-xs font-mono text-zinc-500">
                    {selectedHackathon.startDate.split('T')[0]} &rarr; {selectedHackathon.endDate.split('T')[0]}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold tracking-tight">
                  {selectedHackathon.title}
                </h3>
                {selectedHackathon.tagline && (
                  <p className="text-xs font-mono text-zinc-500 mt-0.5">
                    {selectedHackathon.tagline}
                  </p>
                )}
              </div>

              {/* Counts Stats */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-center">
                  <div className="text-zinc-500 text-[10px]">SUBMISSIONS</div>
                  <div className="text-lg font-bold text-[#235347] dark:text-[#99CDD8]">
                    {hackathonSubmissions.length}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-center">
                  <div className="text-zinc-500 text-[10px]">REGISTRATIONS</div>
                  <div className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
                    {hackathonRegistrationsList.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Tabs: Submissions vs Registrations vs Settings */}
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-inherit text-xs font-mono">
              <button
                onClick={() => setHackathonSubTab('SUBMISSIONS')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  hackathonSubTab === 'SUBMISSIONS'
                    ? 'bg-[#235347] text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <FolderGit2 size={13} />
                <span>Submissions & Projects ({hackathonSubmissions.length})</span>
              </button>

              <button
                onClick={() => setHackathonSubTab('REGISTRATIONS')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  hackathonSubTab === 'REGISTRATIONS'
                    ? 'bg-[#235347] text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Users size={13} />
                <span>Registrations ({hackathonRegistrationsList.length})</span>
              </button>

              <button
                onClick={() => setHackathonSubTab('SETTINGS')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
                  hackathonSubTab === 'SETTINGS'
                    ? 'bg-[#235347] text-white'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Layers size={13} />
                <span>Sprint Brief & Rules</span>
              </button>
            </div>
          </div>

          {/* SUB-TAB: SUBMISSIONS */}
          {hackathonSubTab === 'SUBMISSIONS' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-zinc-500">Filter:</span>
                  {(['ALL', 'PUBLISHED', 'UNPUBLISHED', 'WINNERS'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setSubmissionFilter(f)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                        submissionFilter === f
                          ? 'bg-[#235347] text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleOpenAddSubmission}
                  className="px-3 py-1.5 bg-[#235347] hover:bg-[#1a3f36] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Plus size={13} />
                  <span>Add Project Submission</span>
                </button>
              </div>

              {hackathonSubmissions.length === 0 ? (
                <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 text-xs">
                  No submissions recorded for this hackathon yet. Click &quot;Add Project Submission&quot; to add one.
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-100/70 dark:bg-zinc-900/70 border-b border-inherit font-mono text-[11px] text-zinc-500">
                      <tr>
                        <th className="p-3">Project</th>
                        <th className="p-3">Team / Builders</th>
                        <th className="p-3">Track</th>
                        <th className="p-3">Award / Badge</th>
                        <th className="p-3 text-center">Public Visibility</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit font-sans">
                      {hackathonSubmissions
                        .filter((s) => {
                          if (submissionFilter === 'PUBLISHED') return s.published;
                          if (submissionFilter === 'UNPUBLISHED') return !s.published;
                          if (submissionFilter === 'WINNERS') return Boolean(s.resultBadge);
                          return true;
                        })
                        .map((s) => (
                          <tr
                            key={s.id}
                            className={`hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors ${
                              !s.published ? 'opacity-60 bg-zinc-50/30 dark:bg-zinc-900/30' : ''
                            }`}
                          >
                            <td className="p-3">
                              <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                                <span>{s.title}</span>
                                {s.demoUrl && (
                                  <a
                                    href={s.demoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                    title="Play Demo"
                                  >
                                    <Play size={11} />
                                  </a>
                                )}
                              </div>
                              <div className="text-[11px] text-zinc-500 font-mono truncate max-w-xs">
                                {s.description}
                              </div>
                            </td>

                            <td className="p-3 font-mono text-[11px]">
                              <div className="font-semibold text-zinc-800 dark:text-zinc-200">
                                {s.teamName || 'Solo'}
                              </div>
                              <div className="text-zinc-500 truncate max-w-[160px]">
                                {s.participantNames.join(', ')}
                              </div>
                            </td>

                            <td className="p-3 font-mono text-[11px] text-zinc-500">
                              {s.category || 'General'}
                            </td>

                            <td className="p-3 font-mono text-[11px]">
                              {s.resultBadge ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold border border-amber-400/40">
                                  {s.resultBadge}
                                </span>
                              ) : (
                                <span className="text-zinc-400">&mdash;</span>
                              )}
                            </td>

                            {/* Public Visibility Toggle */}
                            <td className="p-3 text-center">
                              <button
                                onClick={() => setSubmissionPublished(s.id, !s.published)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold transition-all ${
                                  s.published
                                    ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                    : 'bg-zinc-500/15 text-zinc-500 border border-zinc-500/30 hover:bg-zinc-500/30'
                                }`}
                                title={s.published ? 'Published to website visitors' : 'Hidden from public'}
                              >
                                {s.published ? 'PUBLISHED' : 'DRAFT (HIDDEN)'}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <a
                                  href={`#/hackathons/${selectedHackathon.slug || selectedHackathon.id}/submissions/${s.slug || s.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                  title="View Public Project Page"
                                >
                                  <Eye size={13} />
                                </a>

                                <button
                                  onClick={() => handleOpenEditSubmission(s)}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                  title="Edit Project"
                                >
                                  <Edit2 size={13} />
                                </button>

                                <button
                                  onClick={() => {
                                    if (confirm(`Delete project "${s.title}"?`)) {
                                      deleteSubmission(s.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                                  title="Delete Project"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB: REGISTRATIONS */}
          {hackathonSubTab === 'REGISTRATIONS' && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-500 font-mono">
                {hackathonRegistrationsList.length} PARTICIPANTS REGISTERED FOR THIS SPRINT
              </div>

              {hackathonRegistrationsList.length === 0 ? (
                <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 text-xs">
                  No participants have registered for this hackathon yet.
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-zinc-100/70 dark:bg-zinc-900/70 border-b border-inherit font-mono text-[11px] text-zinc-500">
                      <tr>
                        <th className="p-3">Participant</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Team Name</th>
                        <th className="p-3">Skills / Stack</th>
                        <th className="p-3">Registered At</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-inherit font-sans">
                      {hackathonRegistrationsList.map((r) => (
                        <tr key={r.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40">
                          <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">
                            {r.fullName}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                            <div>{r.email}</div>
                            {r.discordHandle && (
                              <div className="text-zinc-500 text-[10px]">Discord: {r.discordHandle}</div>
                            )}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
                            {r.teamName || <span className="text-zinc-400">Solo</span>}
                          </td>
                          <td className="p-3 font-mono text-[11px]">
                            {r.skills.length > 0 ? (
                              <span className="text-zinc-500">{r.skills.join(', ')}</span>
                            ) : (
                              <span className="text-zinc-400">&mdash;</span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-[11px] text-zinc-500">
                            {r.createdAt ? r.createdAt.split('T')[0] : 'Recent'}
                          </td>
                          <td className="p-3 text-right">
                            <select
                              value={r.status}
                              onChange={(e) => updateRegistrationStatus(r.id, e.target.value as any)}
                              className={`p-1 rounded-md text-[10px] font-mono font-bold outline-none border ${
                                isLight ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                              }`}
                            >
                              <option value="REGISTERED">REGISTERED</option>
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="CANCELLED">CANCELLED</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB: SETTINGS & BRIEF */}
          {hackathonSubTab === 'SETTINGS' && (
            <div
              className={`p-6 rounded-2xl border space-y-4 text-xs font-sans ${
                isLight ? 'bg-white border-zinc-200' : 'bg-[#14161a] border-zinc-800'
              }`}
            >
              <h4 className="font-display text-lg font-bold">Rules & Submission Guidelines</h4>
              <p className="whitespace-pre-line text-zinc-600 dark:text-zinc-400">
                {selectedHackathon.rules || 'No custom rules defined.'}
              </p>

              <div className="pt-4 border-t border-inherit flex items-center justify-between">
                <span className="text-zinc-500 font-mono">
                  Theme: <strong>{selectedHackathon.theme || 'None'}</strong>
                </span>
                <button
                  onClick={() => handleOpenEditHackathon(selectedHackathon)}
                  className="px-3 py-1.5 bg-[#235347] text-white rounded-lg text-xs font-semibold"
                >
                  Edit Details
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ================= DIRECTORY OF ALL HACKATHONS ================= */
        <div className="space-y-8">
          {/* Quick Search */}
          <div className="flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Filter hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none font-mono ${
                  isLight ? 'bg-white border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                }`}
              />
            </div>
          </div>

          {/* 1. UPCOMING & ONGOING HACKATHONS */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-inherit">
              <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100">
                UPCOMING & ONGOING HACKATHONS ({upcomingOngoing.length})
              </h3>
            </div>

            {upcomingOngoing.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 text-xs">
                No active or upcoming hackathons found. Click &quot;Create Hackathon&quot; above to start a new sprint.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingOngoing.map((h) => {
                  const subCount = submissions.filter((s) => s.hackathonId === h.id || s.eventId === h.id).length;
                  const regCount = hackathonRegistrations.filter((r) => r.hackathonId === h.id).length;

                  return (
                    <div
                      key={h.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isLight ? 'bg-white border-zinc-200 hover:border-[#235347]' : 'bg-[#14161a] border-zinc-800 hover:border-[#99CDD8]/70'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full ${
                              h.status === 'ONGOING'
                                ? 'bg-emerald-500 text-black'
                                : 'bg-amber-400 text-black'
                            }`}
                          >
                            {h.status}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500">
                            {h.startDate.split('T')[0]} &rarr; {h.endDate.split('T')[0]}
                          </span>
                        </div>

                        <h4 className="font-display text-lg font-bold tracking-tight mb-1">
                          {h.title}
                        </h4>
                        <p className="text-xs text-zinc-500 line-clamp-2 mb-4">
                          {h.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 mb-4">
                          <span>{subCount} submissions</span>
                          <span>&bull;</span>
                          <span>{regCount} registered</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-inherit flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedHackathonId(h.id)}
                          className="px-3 py-1.5 bg-[#235347] text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-[#1a3f36]"
                        >
                          <span>Manage Workspace</span>
                          <ArrowRight size={12} />
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditHackathon(h)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="Edit Hackathon"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => setHackathonStatus(h.id, 'PREVIOUS')}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-500"
                            title="Move to Previous Archive"
                          >
                            <Archive size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteHackathon(h)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                            title="Delete Hackathon"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* 2. PREVIOUS HACKATHONS ARCHIVE */}
          <div>
            <div className="flex items-center justify-between mb-3 pb-1 border-b border-inherit">
              <h3 className="font-display text-base font-bold text-zinc-900 dark:text-zinc-100">
                PREVIOUS HACKATHONS ARCHIVE ({previousHackathons.length})
              </h3>
            </div>

            {previousHackathons.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 text-xs">
                No previous hackathons archived yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {previousHackathons.map((h) => {
                  const subCount = submissions.filter((s) => s.hackathonId === h.id || s.eventId === h.id).length;

                  return (
                    <div
                      key={h.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isLight ? 'bg-white border-zinc-200' : 'bg-[#14161a] border-zinc-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-2">
                          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
                            ARCHIVED
                          </span>
                          <span>{h.startDate.split('T')[0]}</span>
                        </div>

                        <h4 className="font-display text-base font-bold tracking-tight mb-1">
                          {h.title}
                        </h4>
                        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">
                          {h.description}
                        </p>

                        <div className="text-xs font-mono text-[#235347] dark:text-[#99CDD8] font-semibold mb-3">
                          {subCount} projects cataloged
                        </div>
                      </div>

                      <div className="pt-3 border-t border-inherit flex items-center justify-between">
                        <button
                          onClick={() => setSelectedHackathonId(h.id)}
                          className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-500/10"
                        >
                          Manage Submissions
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEditHackathon(h)}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteHackathon(h)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Create / Edit Hackathon Modal */}
      {showHackathonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-2xl relative my-8 ${
              isLight ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-[#15171c] border-zinc-800 text-zinc-100'
            }`}
          >
            <button
              onClick={() => setShowHackathonModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              title="Close"
            >
              <X size={18} />
            </button>

            <h3 className="font-display text-2xl font-bold tracking-tight mb-4">
              {editingHackathon ? 'Edit Hackathon Details' : 'Create New Hackathon Sprint'}
            </h3>

            <form onSubmit={handleSaveHackathon} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">TITLE *</label>
                  <input
                    type="text"
                    required
                    value={hackForm.title}
                    onChange={(e) => setHackForm({ ...hackForm, title: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="e.g. GAME BUILDING HACKATHON 2026"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">SLUG (URL KEY)</label>
                  <input
                    type="text"
                    value={hackForm.slug}
                    onChange={(e) => setHackForm({ ...hackForm, slug: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="e.g. game-building-hackathon-2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">TAGLINE / SLOGAN</label>
                  <input
                    type="text"
                    value={hackForm.tagline}
                    onChange={(e) => setHackForm({ ...hackForm, tagline: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="e.g. Build. Play. Ship."
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">STATUS *</label>
                  <select
                    value={hackForm.status}
                    onChange={(e) => setHackForm({ ...hackForm, status: e.target.value as HackathonStatus })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  >
                    <option value="UPCOMING">UPCOMING</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="PREVIOUS">PREVIOUS (ARCHIVED)</option>
                    <option value="ARCHIVED">ARCHIVED (HIDDEN)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">DESCRIPTION *</label>
                <textarea
                  rows={3}
                  required
                  value={hackForm.description}
                  onChange={(e) => setHackForm({ ...hackForm, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                  placeholder="Comprehensive description of the competition..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">START DATE *</label>
                  <input
                    type="date"
                    required
                    value={hackForm.startDate}
                    onChange={(e) => setHackForm({ ...hackForm, startDate: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">END DATE *</label>
                  <input
                    type="date"
                    required
                    value={hackForm.endDate}
                    onChange={(e) => setHackForm({ ...hackForm, endDate: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">REGISTRATION DEADLINE</label>
                  <input
                    type="date"
                    value={hackForm.registrationDeadline}
                    onChange={(e) => setHackForm({ ...hackForm, registrationDeadline: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">SUBMISSION DEADLINE</label>
                  <input
                    type="date"
                    value={hackForm.submissionDeadline}
                    onChange={(e) => setHackForm({ ...hackForm, submissionDeadline: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">THEME</label>
                  <input
                    type="text"
                    value={hackForm.theme}
                    onChange={(e) => setHackForm({ ...hackForm, theme: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="e.g. Zero Bloat & Determinism"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">CATEGORIES / TRACKS</label>
                  <input
                    type="text"
                    value={hackForm.categories}
                    onChange={(e) => setHackForm({ ...hackForm, categories: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="Comma separated: Physics, Arcade, Shaders"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">ORGANIZER</label>
                  <input
                    type="text"
                    value={hackForm.organizer}
                    onChange={(e) => setHackForm({ ...hackForm, organizer: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">LOCATION / PLATFORM</label>
                  <input
                    type="text"
                    value={hackForm.location}
                    onChange={(e) => setHackForm({ ...hackForm, location: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">COVER IMAGE URL</label>
                <input
                  type="url"
                  value={hackForm.coverImage}
                  onChange={(e) => setHackForm({ ...hackForm, coverImage: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">RULES & SPECIFICATIONS</label>
                <textarea
                  rows={3}
                  value={hackForm.rules}
                  onChange={(e) => setHackForm({ ...hackForm, rules: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                  placeholder="1. Code written during event..."
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={hackForm.isPublished}
                  onChange={(e) => setHackForm({ ...hackForm, isPublished: e.target.checked })}
                  className="rounded text-[#235347]"
                />
                <label htmlFor="isPublishedCheck" className="text-xs font-semibold cursor-pointer">
                  Publish to public website immediately
                </label>
              </div>

              <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowHackathonModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#235347] hover:bg-[#1a3f36] transition-all"
                >
                  {editingHackathon ? 'Save Changes' : 'Create Hackathon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Edit / Add Submission Modal */}
      {showSubmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-2xl relative my-8 ${
              isLight ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-[#15171c] border-zinc-800 text-zinc-100'
            }`}
          >
            <button
              onClick={() => setShowSubmissionModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              title="Close"
            >
              <X size={18} />
            </button>

            <h3 className="font-display text-2xl font-bold tracking-tight mb-4">
              {editingSubmission ? 'Edit Project Submission' : 'Add Project Submission'}
            </h3>

            <form onSubmit={handleSaveSubmission} className="space-y-4 text-xs font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">PROJECT TITLE *</label>
                  <input
                    type="text"
                    required
                    value={subForm.title}
                    onChange={(e) => setSubForm({ ...subForm, title: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">SLUG (URL KEY)</label>
                  <input
                    type="text"
                    value={subForm.slug}
                    onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">TEAM NAME</label>
                  <input
                    type="text"
                    value={subForm.teamName}
                    onChange={(e) => setSubForm({ ...subForm, teamName: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">BUILDERS / MEMBERS *</label>
                  <input
                    type="text"
                    required
                    value={subForm.participantNames}
                    onChange={(e) => setSubForm({ ...subForm, participantNames: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="Dev P., Aditya N."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">TRACK / CATEGORY</label>
                  <input
                    type="text"
                    value={subForm.category}
                    onChange={(e) => setSubForm({ ...subForm, category: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                    AWARD / RESULT BADGE (OPTIONAL)
                  </label>
                  <input
                    type="text"
                    value={subForm.resultBadge}
                    onChange={(e) => setSubForm({ ...subForm, resultBadge: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="e.g. 1st Place / Overall Winner"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-zinc-500 mb-1">DESCRIPTION *</label>
                <textarea
                  rows={3}
                  required
                  value={subForm.description}
                  onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                  className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                    isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">DEMO / PLAY URL</label>
                  <input
                    type="url"
                    value={subForm.demoUrl}
                    onChange={(e) => setSubForm({ ...subForm, demoUrl: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">GIT REPOSITORY URL</label>
                  <input
                    type="url"
                    value={subForm.repositoryUrl}
                    onChange={(e) => setSubForm({ ...subForm, repositoryUrl: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">COVER IMAGE URL</label>
                  <input
                    type="url"
                    value={subForm.coverImage}
                    onChange={(e) => setSubForm({ ...subForm, coverImage: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">TECH STACK</label>
                  <input
                    type="text"
                    value={subForm.techStack}
                    onChange={(e) => setSubForm({ ...subForm, techStack: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="Rust, Bevy, Wasm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="subPublishedCheck"
                  checked={subForm.published}
                  onChange={(e) => setSubForm({ ...subForm, published: e.target.checked })}
                  className="rounded text-[#235347]"
                />
                <label htmlFor="subPublishedCheck" className="text-xs font-semibold cursor-pointer">
                  Publicly visible in showcase
                </label>
              </div>

              <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmissionModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#235347] hover:bg-[#1a3f36] transition-all"
                >
                  Save Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
