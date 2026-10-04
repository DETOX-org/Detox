import React, { useState, useMemo } from 'react';
import { useCms } from '../../cms/CmsContext';
import { useTheme } from '../../ThemeContext';
import type { HackathonItem, HackathonProjectItem } from '../../cms/types';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  X,
  ExternalLink,
  MapPin,
  FolderGit2,
  Sparkles,
} from 'lucide-react';
import { Link } from '../../router';

export const AdminHackathonsSection: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';

  const {
    hackathons,
    hackathonProjects,
    addHackathon,
    updateHackathon,
    deleteHackathon,
    addHackathonProject,
    updateHackathonProject,
    deleteHackathonProject,
    setHackathonProjectPublished,
  } = useCms();

  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Hackathon Modal state
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<HackathonItem | null>(null);
  const [hackForm, setHackForm] = useState({
    title: '',
    slug: '',
    tagline: '',
    description: '',
    date: '',
    coverImage: '',
    location: '',
    isPublished: true,
  });

  // Project Modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<HackathonProjectItem | null>(null);
  const [projForm, setProjForm] = useState({
    title: '',
    slug: '',
    description: '',
    teamName: '',
    teamMembers: '',
    coverImage: '',
    screenshots: '',
    techStack: '',
    repositoryUrl: '',
    demoUrl: '',
    placement: '',
    isWinner: false,
    isFeatured: false,
    published: true,
  });

  // Selected Hackathon
  const selectedHackathon = useMemo(() => {
    if (!selectedHackathonId && hackathons.length > 0) {
      return hackathons[0];
    }
    return hackathons.find((h) => h.id === selectedHackathonId) || null;
  }, [hackathons, selectedHackathonId]);

  // Projects for selected hackathon
  const currentProjects = useMemo(() => {
    if (!selectedHackathon) return [];
    return hackathonProjects.filter(
      (p) =>
        p.hackathonId === selectedHackathon.id ||
        (selectedHackathon.slug && p.hackathonId === selectedHackathon.slug)
    );
  }, [hackathonProjects, selectedHackathon]);

  // Filtered hackathons
  const filteredHackathons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return hackathons;
    return hackathons.filter(
      (h) =>
        h.title.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        (h.tagline && h.tagline.toLowerCase().includes(q)) ||
        h.date.toLowerCase().includes(q)
    );
  }, [hackathons, searchQuery]);

  // Open Create/Edit Hackathon
  const handleOpenHackathonModal = (h?: HackathonItem) => {
    if (h) {
      setEditingHackathon(h);
      setHackForm({
        title: h.title,
        slug: h.slug,
        tagline: h.tagline || '',
        description: h.description,
        date: h.date,
        coverImage: h.coverImage || '',
        location: h.location || '',
        isPublished: h.isPublished,
      });
    } else {
      setEditingHackathon(null);
      setHackForm({
        title: '',
        slug: '',
        tagline: '',
        description: '',
        date: '',
        coverImage: '',
        location: '',
        isPublished: true,
      });
    }
    setShowHackathonModal(true);
  };

  const handleSaveHackathon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hackForm.title.trim()) return;

    const slug =
      hackForm.slug.trim() ||
      hackForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    if (editingHackathon) {
      await updateHackathon(editingHackathon.id, {
        title: hackForm.title.trim(),
        slug,
        tagline: hackForm.tagline.trim() || undefined,
        description: hackForm.description.trim(),
        date: hackForm.date.trim(),
        coverImage: hackForm.coverImage.trim() || undefined,
        location: hackForm.location.trim() || undefined,
        isPublished: hackForm.isPublished,
      });
    } else {
      await addHackathon({
        title: hackForm.title.trim(),
        slug,
        tagline: hackForm.tagline.trim() || undefined,
        description: hackForm.description.trim(),
        date: hackForm.date.trim(),
        coverImage: hackForm.coverImage.trim() || undefined,
        location: hackForm.location.trim() || undefined,
        isPublished: hackForm.isPublished,
      });
      setSelectedHackathonId(slug);
    }
    setShowHackathonModal(false);
  };

  // Open Create/Edit Project
  const handleOpenProjectModal = (p?: HackathonProjectItem) => {
    if (p) {
      setEditingProject(p);
      setProjForm({
        title: p.title,
        slug: p.slug,
        description: p.description,
        teamName: p.teamName || '',
        teamMembers: (p.teamMembers || []).join(', '),
        coverImage: p.coverImage || '',
        screenshots: (p.screenshots || []).join(', '),
        techStack: (p.techStack || []).join(', '),
        repositoryUrl: p.repositoryUrl || '',
        demoUrl: p.demoUrl || '',
        placement: p.placement || '',
        isWinner: p.isWinner,
        isFeatured: p.isFeatured || false,
        published: p.published,
      });
    } else {
      setEditingProject(null);
      setProjForm({
        title: '',
        slug: '',
        description: '',
        teamName: '',
        teamMembers: '',
        coverImage: '',
        screenshots: '',
        techStack: '',
        repositoryUrl: '',
        demoUrl: '',
        placement: '',
        isWinner: false,
        isFeatured: false,
        published: true,
      });
    }
    setShowProjectModal(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathon || !projForm.title.trim()) return;

    const slug =
      projForm.slug.trim() ||
      projForm.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const teamMembers = projForm.teamMembers
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const screenshots = projForm.screenshots
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const techStack = projForm.techStack
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const isWinner = projForm.isWinner || Boolean(projForm.placement.trim());

    if (editingProject) {
      await updateHackathonProject(editingProject.id, {
        title: projForm.title.trim(),
        slug,
        description: projForm.description.trim(),
        teamName: projForm.teamName.trim() || undefined,
        teamMembers,
        coverImage: projForm.coverImage.trim() || undefined,
        screenshots,
        techStack,
        repositoryUrl: projForm.repositoryUrl.trim() || undefined,
        demoUrl: projForm.demoUrl.trim() || undefined,
        placement: projForm.placement.trim() || undefined,
        isWinner,
        isFeatured: projForm.isFeatured,
        published: projForm.published,
      });
    } else {
      await addHackathonProject({
        hackathonId: selectedHackathon.id,
        title: projForm.title.trim(),
        slug,
        description: projForm.description.trim(),
        teamName: projForm.teamName.trim() || undefined,
        teamMembers,
        coverImage: projForm.coverImage.trim() || undefined,
        screenshots,
        techStack,
        repositoryUrl: projForm.repositoryUrl.trim() || undefined,
        demoUrl: projForm.demoUrl.trim() || undefined,
        placement: projForm.placement.trim() || undefined,
        isWinner,
        isFeatured: projForm.isFeatured,
        published: projForm.published,
      });
    }
    setShowProjectModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold font-sans flex items-center gap-2">
            <Trophy size={18} className="text-[#235347] dark:text-[#38B2A2]" />
            <span>Hackathons & Projects Archive</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Manage DETOX hackathon records, winners, and project showcases.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/hackathons"
            className="px-3 py-1.5 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Eye size={13} />
            <span>View Public Archive</span>
          </Link>

          <button
            onClick={() => handleOpenHackathonModal()}
            className="px-3 py-1.5 bg-[#235347] hover:bg-[#163B32] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus size={14} />
            <span>Create Hackathon</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Hackathons List & Selected Hackathon Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Hackathons List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              Conducted Hackathons ({hackathons.length})
            </span>
          </div>

          {hackathons.length > 3 && (
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search hackathons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs border ${
                  isLight
                    ? 'bg-white border-zinc-300 text-zinc-900 focus:border-[#235347]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-[#38B2A2]'
                } outline-hidden`}
              />
            </div>
          )}

          {filteredHackathons.length === 0 ? (
            <div
              className={`p-6 rounded-xl border text-center ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'
              }`}
            >
              <Trophy size={28} className="mx-auto text-zinc-400 mb-2 opacity-50" />
              <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                No hackathons recorded yet
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 mb-3">
                Click "Create Hackathon" to add the first conducted hackathon to the archive.
              </p>
              <button
                onClick={() => handleOpenHackathonModal()}
                className="px-3 py-1 bg-[#235347] text-white text-xs font-semibold rounded-md hover:bg-[#163B32] transition-colors"
              >
                + Add Hackathon
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHackathons.map((h) => {
                const isSelected = selectedHackathon?.id === h.id;
                const projectCount = hackathonProjects.filter(
                  (p) => p.hackathonId === h.id || (h.slug && p.hackathonId === h.slug)
                ).length;
                const winnerCount = hackathonProjects.filter(
                  (p) =>
                    (p.hackathonId === h.id || (h.slug && p.hackathonId === h.slug)) &&
                    (p.isWinner || Boolean(p.placement))
                ).length;

                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHackathonId(h.id)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all duration-200 relative ${
                      isSelected
                        ? isLight
                          ? 'bg-white border-[#235347] shadow-sm ring-1 ring-[#235347]'
                          : 'bg-zinc-900 border-[#38B2A2] shadow-sm ring-1 ring-[#38B2A2]'
                        : isLight
                        ? 'bg-white hover:bg-zinc-50 border-zinc-200'
                        : 'bg-zinc-900/60 hover:bg-zinc-900 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded-xs font-bold ${
                              h.isPublished
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {h.isPublished ? 'PUBLIC' : 'DRAFT'}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {h.date || 'No Date'}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs truncate text-zinc-900 dark:text-zinc-100">
                          {h.title}
                        </h4>
                        {h.tagline && (
                          <p className="text-[11px] text-zinc-500 truncate mt-0.5">{h.tagline}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-[10px] font-mono text-zinc-400">
                          <span>{projectCount} projects</span>
                          {winnerCount > 0 && (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold">
                              ★ {winnerCount} winners
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleOpenHackathonModal(h)}
                          className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Edit hackathon"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete hackathon "${h.title}" and all its projects?`)) {
                              deleteHackathon(h.id);
                              if (selectedHackathonId === h.id) {
                                setSelectedHackathonId(null);
                              }
                            }
                          }}
                          className="p-1 text-zinc-400 hover:text-red-500"
                          title="Delete hackathon"
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

        {/* Right Column: Selected Hackathon & Projects Workbench */}
        <div className="lg:col-span-8">
          {selectedHackathon ? (
            <div
              className={`p-5 rounded-2xl border ${
                isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-zinc-900/80 border-zinc-800'
              }`}
            >
              {/* Selected Hackathon Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#235347]/10 text-[#235347] dark:text-[#38B2A2] font-bold">
                      HACKATHON ARCHIVE
                    </span>
                    <span className="text-xs font-mono text-zinc-500">{selectedHackathon.date}</span>
                    {selectedHackathon.location && (
                      <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <MapPin size={11} /> {selectedHackathon.location}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 font-sans">
                    {selectedHackathon.title}
                  </h3>
                  {selectedHackathon.tagline && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {selectedHackathon.tagline}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/hackathons/${selectedHackathon.slug}`}
                    className="px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Eye size={12} />
                    <span>View Page</span>
                  </Link>

                  <button
                    onClick={() => handleOpenHackathonModal(selectedHackathon)}
                    className="px-2.5 py-1.5 border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 rounded-md text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleOpenProjectModal()}
                    className="px-3 py-1.5 bg-[#235347] hover:bg-[#163B32] text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Plus size={14} />
                    <span>Add Project</span>
                  </button>
                </div>
              </div>

              {/* Projects Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold font-mono uppercase tracking-wider text-zinc-500">
                  <span>Projects & Results ({currentProjects.length})</span>
                  <span>
                    Winners: {currentProjects.filter((p) => p.isWinner || Boolean(p.placement)).length}
                  </span>
                </div>

                {currentProjects.length === 0 ? (
                  <div
                    className={`p-8 text-center rounded-xl border border-dashed ${
                      isLight ? 'border-zinc-300 bg-zinc-50' : 'border-zinc-800 bg-zinc-900/30'
                    }`}
                  >
                    <FolderGit2 size={32} className="mx-auto text-zinc-400 mb-2 opacity-50" />
                    <div className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      No projects added to this hackathon yet
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-1 mb-3">
                      Add winning entries, hardware builds, and student projects conducted during this hackathon.
                    </p>
                    <button
                      onClick={() => handleOpenProjectModal()}
                      className="px-3 py-1.5 bg-[#235347] text-white text-xs font-semibold rounded-md hover:bg-[#163B32] transition-colors"
                    >
                      + Add First Project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentProjects.map((proj) => (
                      <div
                        key={proj.id}
                        className={`p-3.5 rounded-xl border flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 transition-colors ${
                          proj.isWinner
                            ? isLight
                              ? 'bg-amber-50/50 border-amber-200'
                              : 'bg-amber-950/20 border-amber-900/50'
                            : isLight
                            ? 'bg-zinc-50/50 border-zinc-200'
                            : 'bg-zinc-900/50 border-zinc-800'
                        } ${!proj.published ? 'opacity-60' : ''}`}
                      >
                        {/* Thumbnail & Basic Info */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-10 rounded-md bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
                            {proj.coverImage ? (
                              <img
                                src={proj.coverImage}
                                alt={proj.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-500 font-mono">
                                NO IMG
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                              {proj.placement && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-zinc-950">
                                  <Trophy size={10} />
                                  <span>{proj.placement}</span>
                                </span>
                              )}
                              {proj.isWinner && !proj.placement && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-zinc-950">
                                  <Sparkles size={10} />
                                  <span>Winner</span>
                                </span>
                              )}
                              <span className="text-[10px] font-mono text-zinc-500">
                                {proj.teamName || 'Solo Project'}
                              </span>
                            </div>

                            <h5 className="font-bold text-xs truncate text-zinc-900 dark:text-zinc-100 font-sans">
                              {proj.title}
                            </h5>

                            <p className="text-[11px] text-zinc-500 truncate max-w-md">
                              {proj.description}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setHackathonProjectPublished(proj.id, !proj.published)}
                            className={`px-2 py-0.5 rounded-xs text-[10px] font-bold transition-colors ${
                              proj.published
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-zinc-500/20 text-zinc-500'
                            }`}
                            title="Toggle public visibility"
                          >
                            {proj.published ? 'PUBLISHED' : 'DRAFT'}
                          </button>

                          <Link
                            to={`/hackathons/${selectedHackathon.slug}/projects/${proj.slug}`}
                            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="View project page"
                          >
                            <ExternalLink size={13} />
                          </Link>

                          <button
                            onClick={() => handleOpenProjectModal(proj)}
                            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                            title="Edit project"
                          >
                            <Edit2 size={13} />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`Delete project "${proj.title}"?`)) {
                                deleteHackathonProject(proj.id);
                              }
                            }}
                            className="p-1 text-zinc-400 hover:text-red-500"
                            title="Delete project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className={`p-12 text-center rounded-2xl border ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'
              }`}
            >
              <Trophy size={36} className="mx-auto text-zinc-400 mb-2 opacity-50" />
              <div className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                No Hackathon Selected
              </div>
              <p className="text-xs text-zinc-500 mt-1 mb-4">
                Select a hackathon on the left or create a new one to manage its projects.
              </p>
              <button
                onClick={() => handleOpenHackathonModal()}
                className="px-4 py-2 bg-[#235347] text-white text-xs font-semibold rounded-lg hover:bg-[#163B32] transition-colors"
              >
                + Create New Hackathon
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Hackathon Create / Edit */}
      {showHackathonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-xl p-6 rounded-2xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#181a20] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Trophy size={16} className="text-[#235347] dark:text-[#38B2A2]" />
                <span>{editingHackathon ? 'Edit Hackathon' : 'Create Hackathon Record'}</span>
              </h3>
              <button
                onClick={() => setShowHackathonModal(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveHackathon} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Hackathon Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Game Building Hackathon 2026"
                    value={hackForm.title}
                    onChange={(e) => setHackForm({ ...hackForm, title: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Slug (URL identifier)
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated from name"
                    value={hackForm.slug}
                    onChange={(e) => setHackForm({ ...hackForm, slug: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Date / Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. October 2026 or 2025"
                    value={hackForm.date}
                    onChange={(e) => setHackForm({ ...hackForm, date: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Short Tagline
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 48 hours of bare-metal game dev & custom physics engines."
                    value={hackForm.tagline}
                    onChange={(e) => setHackForm({ ...hackForm, tagline: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Overview of what was built, themes explored, and the atmosphere of the hackathon..."
                    value={hackForm.description}
                    onChange={(e) => setHackForm({ ...hackForm, description: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Cover Image URL / Poster
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={hackForm.coverImage}
                    onChange={(e) => setHackForm({ ...hackForm, coverImage: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DETOX Hardware Lab, In-Person"
                    value={hackForm.location}
                    onChange={(e) => setHackForm({ ...hackForm, location: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t">
                <input
                  type="checkbox"
                  id="hackPublished"
                  checked={hackForm.isPublished}
                  onChange={(e) => setHackForm({ ...hackForm, isPublished: e.target.checked })}
                  className="rounded-sm"
                />
                <label htmlFor="hackPublished" className="text-xs cursor-pointer font-sans">
                  Published (Visible to public visitors)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowHackathonModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-zinc-500/10 transition-colors font-sans text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#235347] hover:bg-[#163B32] text-white rounded-lg font-bold transition-colors font-sans text-xs"
                >
                  {editingHackathon ? 'Save Changes' : 'Create Hackathon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Project Create / Edit */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-2xl p-6 rounded-2xl border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
              isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#181a20] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base flex items-center gap-2">
                <FolderGit2 size={16} className="text-[#235347] dark:text-[#38B2A2]" />
                <span>{editingProject ? 'Edit Project' : 'Add Project to Hackathon'}</span>
              </h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Orbital Decay: N-Body Gravity Slingshot"
                    value={projForm.title}
                    onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    placeholder="auto-generated from title"
                    value={projForm.slug}
                    onChange={(e) => setProjForm({ ...projForm, slug: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Team Kepler-42"
                    value={projForm.teamName}
                    onChange={(e) => setProjForm({ ...projForm, teamName: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Team Members / Builders (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dev P., Aditya N., Sneha T."
                    value={projForm.teamMembers}
                    onChange={(e) => setProjForm({ ...projForm, teamMembers: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Project Description *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe what was engineered, technical challenges solved, algorithms implemented..."
                    value={projForm.description}
                    onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Placement / Award Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1st Place, 2nd Place, 3rd Place, Best Architecture"
                    value={projForm.placement}
                    onChange={(e) => setProjForm({ ...projForm, placement: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={projForm.coverImage}
                    onChange={(e) => setProjForm({ ...projForm, coverImage: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Repository URL (Git)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={projForm.repositoryUrl}
                    onChange={(e) => setProjForm({ ...projForm, repositoryUrl: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Live Demo / Web Build URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://demo.detox.build"
                    value={projForm.demoUrl}
                    onChange={(e) => setProjForm({ ...projForm, demoUrl: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rust, Bevy, WebGPU, Wasm, Verlet Integration"
                    value={projForm.techStack}
                    onChange={(e) => setProjForm({ ...projForm, techStack: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[10px] text-zinc-500 uppercase font-bold mb-1">
                    Screenshot Image URLs (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="https://..., https://..."
                    value={projForm.screenshots}
                    onChange={(e) => setProjForm({ ...projForm, screenshots: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-800'
                    } outline-hidden`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2 border-t">
                <label className="flex items-center gap-2 text-xs cursor-pointer font-sans">
                  <input
                    type="checkbox"
                    checked={projForm.isWinner}
                    onChange={(e) => setProjForm({ ...projForm, isWinner: e.target.checked })}
                    className="rounded-sm"
                  />
                  <span>Mark as Winner (Display in Hackathon Winners Podium)</span>
                </label>

                <label className="flex items-center gap-2 text-xs cursor-pointer font-sans">
                  <input
                    type="checkbox"
                    checked={projForm.published}
                    onChange={(e) => setProjForm({ ...projForm, published: e.target.checked })}
                    className="rounded-sm"
                  />
                  <span>Published (Publicly Visible)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-zinc-500/10 transition-colors font-sans text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#235347] hover:bg-[#163B32] text-white rounded-lg font-bold transition-colors font-sans text-xs"
                >
                  {editingProject ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
