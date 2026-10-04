import React, { useState, useMemo } from 'react';
import { Link } from '../router';
import { useCms } from '../cms/CmsContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../ThemeContext';
import { PageContainer } from '../design-system/primitives';
import type { HackathonItem } from '../cms/types';
import {
  classifyHackathon,
  formatDateRange,
  formatSimpleDate,
} from '../cms/hackathonUtils';
import {
  Calendar,
  Search,
  X,
  ArrowRight,
  Trophy,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
} from 'lucide-react';

export const HackathonsDirectoryPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { user, profile } = useAuth();
  const { hackathons, submissions, registerForHackathon } = useCms();

  const [searchQuery, setSearchQuery] = useState('');
  const [registeringHackathon, setRegisteringHackathon] = useState<HackathonItem | null>(null);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: profile?.name || '',
    email: profile?.email || user?.email || '',
    discordHandle: '',
    teamName: '',
    skills: '',
  });
  const [regStatus, setRegStatus] = useState<{ loading: boolean; success: boolean; error: string | null }>({
    loading: false,
    success: false,
    error: null,
  });

  // Filter published hackathons for public view
  const publishedHackathons = useMemo(() => {
    return hackathons.filter((h) => h.isPublished);
  }, [hackathons]);

  // Client-side search filtering
  const filteredHackathons = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return publishedHackathons;

    return publishedHackathons.filter((h) => {
      const matchTitle = h.title.toLowerCase().includes(q);
      const matchTagline = h.tagline.toLowerCase().includes(q);
      const matchDesc = h.description.toLowerCase().includes(q);
      const matchTheme = (h.theme || '').toLowerCase().includes(q);
      const matchOrg = h.organizer.toLowerCase().includes(q);
      const matchCats = h.categories.some((c) => c.toLowerCase().includes(q));
      return matchTitle || matchTagline || matchDesc || matchTheme || matchOrg || matchCats;
    });
  }, [publishedHackathons, searchQuery]);

  // Partition into Upcoming/Ongoing vs Previous
  const upcomingOngoing = useMemo(() => {
    return filteredHackathons.filter((h) => {
      const classification = classifyHackathon(h);
      return classification === 'UPCOMING' || classification === 'ONGOING';
    });
  }, [filteredHackathons]);

  const previousHackathons = useMemo(() => {
    return filteredHackathons.filter((h) => {
      const classification = classifyHackathon(h);
      return classification === 'PREVIOUS';
    });
  }, [filteredHackathons]);

  // Count submissions for each hackathon
  const getSubmissionCount = (hackathonId: string, slug?: string) => {
    return submissions.filter(
      (s) =>
        s.published &&
        (s.hackathonId === hackathonId ||
          s.eventId === hackathonId ||
          (slug && (s.hackathonId === slug || s.eventId === slug)))
    ).length;
  };

  const handleOpenRegister = (h: HackathonItem) => {
    setRegisteringHackathon(h);
    setRegForm({
      fullName: profile?.name || '',
      email: profile?.email || user?.email || '',
      discordHandle: '',
      teamName: '',
      skills: '',
    });
    setRegStatus({ loading: false, success: false, error: null });
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registeringHackathon) return;
    if (!regForm.fullName.trim() || !regForm.email.trim()) {
      setRegStatus({ loading: false, success: false, error: 'Name and email are required.' });
      return;
    }

    setRegStatus({ loading: true, success: false, error: null });
    try {
      const res = await registerForHackathon({
        hackathonId: registeringHackathon.id,
        userId: user?.id,
        fullName: regForm.fullName.trim(),
        email: regForm.email.trim(),
        discordHandle: regForm.discordHandle.trim() || undefined,
        teamName: regForm.teamName.trim() || undefined,
        skills: regForm.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });

      if (!res.success) {
        setRegStatus({ loading: false, success: false, error: res.error || 'Registration failed.' });
      } else {
        setRegStatus({ loading: false, success: true, error: null });
      }
    } catch (err: any) {
      setRegStatus({ loading: false, success: false, error: err.message || 'An error occurred.' });
    }
  };

  return (
    <PageContainer maxWidth="6xl">
      {/* 1. Header & Title Block */}
      <div
        className={`border-b pb-8 mb-10 transition-colors duration-500 ${
          isLight ? 'border-zinc-300' : 'border-zinc-800'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isLight ? '#CFD6C4' : '#163B32',
                color: isLight ? '#0B2B26' : '#99CDD8',
              }}
            >
              HACKATHON SPRINTS & BUILD ARCHIVE
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              [{publishedHackathons.length} TOTAL INITIATIVES]
            </span>
          </div>

          <div className="text-xs font-mono text-zinc-500">
            PUBLIC SHOWCASE — NO LOGIN REQUIRED TO BROWSE
          </div>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          HACKATHONS
        </h1>
        <p className={`text-base sm:text-lg max-w-3xl leading-relaxed font-sans ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
          High-intensity engineering marathons designed around bespoke engines, zero bloat, bare-metal hardware, and deterministic systems.
          Explore active competitions or dive into the full student project archive.
        </p>

        {/* Search bar */}
        <div className="mt-8 relative max-w-md">
          <Search
            size={16}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          />
          <input
            type="text"
            placeholder="Search hackathons by title, theme, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-9 py-2.5 text-xs rounded-full border transition-all outline-none font-mono ${
              isLight
                ? 'bg-white border-zinc-300 text-zinc-900 focus:border-[#235347] focus:ring-1 focus:ring-[#235347]'
                : 'bg-[#181a20] border-zinc-700 text-zinc-100 focus:border-[#99CDD8] focus:ring-1 focus:ring-[#99CDD8]'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. SECTION 1: UPCOMING / ONGOING HACKATHONS */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-inherit">
          <div className="flex items-center gap-3">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              UPCOMING & ONGOING HACKATHONS
            </h2>
            <span
              className={`text-xs font-mono px-2.5 py-0.5 rounded-full ${
                upcomingOngoing.length > 0
                  ? isLight
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
              }`}
            >
              {upcomingOngoing.length} ACTIVE
            </span>
          </div>
        </div>

        {upcomingOngoing.length === 0 ? (
          <div
            className={`p-10 rounded-2xl border text-center transition-colors ${
              isLight ? 'bg-zinc-100/60 border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'
            }`}
          >
            <Calendar size={32} className="mx-auto mb-3 text-zinc-400" />
            <h3 className="font-sans font-semibold text-base mb-1">No upcoming hackathons.</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              All ongoing sprints have concluded. New engineering marathons will be announced soon by the DETOX Engineering Collective.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingOngoing.map((hackathon) => {
              const classification = classifyHackathon(hackathon);
              const isOngoing = classification === 'ONGOING';
              const hackathonUrl = `/hackathons/${hackathon.slug || hackathon.id}`;

              return (
                <div
                  key={hackathon.id}
                  className={`group rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isLight
                      ? 'bg-white border-zinc-300 hover:border-[#235347]'
                      : 'bg-[#14161a] border-zinc-800 hover:border-[#99CDD8]/70'
                  }`}
                >
                  {/* Card Cover Banner */}
                  {hackathon.coverImage && (
                    <div className="relative aspect-16/9 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={hackathon.coverImage}
                        alt={hackathon.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Status Pill on Cover */}
                      <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                        <span
                          className={`flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md backdrop-blur-md ${
                            isOngoing
                              ? 'bg-emerald-500 text-black font-extrabold'
                              : 'bg-amber-400 text-black font-extrabold'
                          }`}
                        >
                          {isOngoing && <span className="w-2 h-2 rounded-full bg-black animate-ping" />}
                          <span>{isOngoing ? 'ONGOING' : 'UPCOMING'}</span>
                        </span>
                      </div>

                      {/* Date Badge */}
                      <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-zinc-200 font-mono">
                        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md">
                          {formatDateRange(hackathon.startDate, hackathon.endDate)}
                        </span>
                        {hackathon.organizer && (
                          <span className="hidden sm:inline bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px]">
                            {hackathon.organizer}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Theme / Category Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {hackathon.categories.slice(0, 3).map((cat) => (
                          <span
                            key={cat}
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${
                              isLight
                                ? 'bg-zinc-100 border-zinc-200 text-zinc-700'
                                : 'bg-zinc-800/60 border-zinc-700 text-zinc-300'
                            }`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-2 group-hover:text-[#235347] dark:group-hover:text-[#99CDD8] transition-colors">
                        {hackathon.title}
                      </h3>

                      {hackathon.tagline && (
                        <p className="text-xs font-mono font-semibold text-[#235347] dark:text-[#99CDD8] mb-3 uppercase tracking-wider">
                          {hackathon.tagline}
                        </p>
                      )}

                      <p
                        className={`text-xs sm:text-sm leading-relaxed mb-5 line-clamp-3 ${
                          isLight ? 'text-zinc-600' : 'text-zinc-400'
                        }`}
                      >
                        {hackathon.description}
                      </p>

                      {/* Deadlines Strip */}
                      {(hackathon.registrationDeadline || hackathon.submissionDeadline) && (
                        <div
                          className={`p-3 rounded-xl mb-5 text-xs font-mono space-y-1 ${
                            isLight ? 'bg-zinc-100/80 text-zinc-700' : 'bg-zinc-900/80 text-zinc-300'
                          }`}
                        >
                          {hackathon.registrationDeadline && (
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500">Registration closes:</span>
                              <span className="font-semibold text-amber-600 dark:text-amber-400">
                                {formatSimpleDate(hackathon.registrationDeadline)}
                              </span>
                            </div>
                          )}
                          {hackathon.submissionDeadline && (
                            <div className="flex items-center justify-between">
                              <span className="text-zinc-500">Submission deadline:</span>
                              <span className="font-semibold text-rose-600 dark:text-rose-400">
                                {formatSimpleDate(hackathon.submissionDeadline)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-inherit flex items-center justify-between gap-3">
                      <Link
                        to={hackathonUrl}
                        className={`flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide border transition-all ${
                          isLight
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700'
                        }`}
                      >
                        View Hackathon
                      </Link>

                      <button
                        onClick={() => handleOpenRegister(hackathon)}
                        className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide text-white bg-[#235347] hover:bg-[#1a3f36] transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <span>Register</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. SECTION 2: PREVIOUS HACKATHONS ARCHIVE */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-inherit">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              PREVIOUS HACKATHONS
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-0.5">
              THE DETOX ARCHIVE OF COMPLETED HACKATHONS AND STUDENT PROJECTS
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            {previousHackathons.length} ARCHIVED
          </span>
        </div>

        {previousHackathons.length === 0 ? (
          <div
            className={`p-10 rounded-2xl border text-center transition-colors ${
              isLight ? 'bg-zinc-100/60 border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'
            }`}
          >
            <Trophy size={32} className="mx-auto mb-3 text-zinc-400" />
            <h3 className="font-sans font-semibold text-base mb-1">No previous hackathons yet.</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              When hackathons conclude, their full student project archives and winning submissions are cataloged here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousHackathons.map((hackathon) => {
              const hackathonUrl = `/hackathons/${hackathon.slug || hackathon.id}`;
              const submissionsUrl = `/hackathons/${hackathon.slug || hackathon.id}/submissions`;
              const submissionCount = getSubmissionCount(hackathon.id, hackathon.slug);

              return (
                <div
                  key={hackathon.id}
                  className={`group rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    isLight
                      ? 'bg-white border-zinc-300 hover:border-zinc-500'
                      : 'bg-[#14161a] border-zinc-800 hover:border-zinc-600'
                  }`}
                >
                  {/* Banner / Cover */}
                  {hackathon.coverImage && (
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={hackathon.coverImage}
                        alt={hackathon.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-900/90 text-zinc-300 border border-zinc-700">
                          COMPLETED ARCHIVE
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 text-xs text-zinc-300 font-mono">
                        {formatDateRange(hackathon.startDate, hackathon.endDate)}
                      </div>
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-tight mb-1.5 group-hover:text-[#235347] dark:group-hover:text-[#99CDD8] transition-colors">
                        {hackathon.title}
                      </h3>

                      {hackathon.theme && (
                        <p className="text-[11px] font-mono text-zinc-500 mb-2 truncate">
                          Theme: {hackathon.theme}
                        </p>
                      )}

                      <p
                        className={`text-xs leading-relaxed mb-4 line-clamp-2 ${
                          isLight ? 'text-zinc-600' : 'text-zinc-400'
                        }`}
                      >
                        {hackathon.description}
                      </p>

                      {/* Project count badge */}
                      <div className="flex items-center gap-2 mb-4">
                        <span
                          className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1.5 ${
                            submissionCount > 0
                              ? isLight
                                ? 'bg-[#CFD6C4]/40 border-[#235347]/30 text-[#0B2B26]'
                                : 'bg-[#163B32]/40 border-[#235347]/50 text-[#99CDD8]'
                              : 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-500'
                          }`}
                        >
                          <FolderGit2 size={13} />
                          <span>
                            {submissionCount > 0
                              ? `${submissionCount} projects submitted`
                              : 'Submissions archived'}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-inherit flex items-center gap-2">
                      <Link
                        to={hackathonUrl}
                        className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          isLight
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-300'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                        }`}
                      >
                        View Hackathon
                      </Link>

                      {submissionCount > 0 && (
                        <Link
                          to={submissionsUrl}
                          className="flex-1 text-center py-2 px-3 rounded-xl text-xs font-semibold text-white bg-[#235347] hover:bg-[#1a3f36] transition-all flex items-center justify-center gap-1"
                        >
                          <span>Projects</span>
                          <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Registration Modal */}
      {registeringHackathon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl relative transition-all ${
              isLight ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-[#15171c] border-zinc-800 text-zinc-100'
            }`}
          >
            <button
              onClick={() => setRegisteringHackathon(null)}
              className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              title="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#235347]/15 text-[#235347] dark:text-[#99CDD8] font-bold">
                PARTICIPANT REGISTRATION
              </span>
              <h3 className="font-display text-2xl font-bold tracking-tight mt-1.5">
                {registeringHackathon.title}
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Dates: {formatDateRange(registeringHackathon.startDate, registeringHackathon.endDate)}
              </p>
            </div>

            {regStatus.success ? (
              <div className="text-center py-6">
                <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-3" />
                <h4 className="font-display text-xl font-bold mb-2">Registration Confirmed!</h4>
                <p className="text-xs text-zinc-500 mb-6 max-w-sm mx-auto">
                  You are registered for {registeringHackathon.title}. Once the sprint begins, you can submit your project directly through the hackathon portal.
                </p>
                <button
                  onClick={() => setRegisteringHackathon(null)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#235347] text-white hover:bg-[#1a3f36] transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs font-sans">
                {regStatus.error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{regStatus.error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="e.g. Arjun Mehta"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="e.g. arjun.m@detox.build"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                      DISCORD / HANDLE
                    </label>
                    <input
                      type="text"
                      value={regForm.discordHandle}
                      onChange={(e) => setRegForm({ ...regForm, discordHandle: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                        isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      }`}
                      placeholder="e.g. arjun#1337"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                      TEAM NAME (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      value={regForm.teamName}
                      onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                        isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      }`}
                      placeholder="e.g. Team Kepler-42"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">
                    PRIMARY SKILLS / TECH STACK
                  </label>
                  <input
                    type="text"
                    value={regForm.skills}
                    onChange={(e) => setRegForm({ ...regForm, skills: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="Comma separated: Rust, WebGPU, Shaders, C++"
                  />
                </div>

                <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRegisteringHackathon(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={regStatus.loading}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#235347] hover:bg-[#1a3f36] disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {regStatus.loading ? (
                      <span>Registering...</span>
                    ) : (
                      <>
                        <span>Confirm Registration</span>
                        <ArrowRight size={13} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PageContainer>
  );
};
