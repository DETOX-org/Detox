import React, { useState, useMemo } from 'react';
import { Link } from '../router';
import { useCms } from '../cms/CmsContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../ThemeContext';
import { PageContainer } from '../design-system/primitives';
import { classifyHackathon } from '../cms/hackathonUtils';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  X,
  Play,
} from 'lucide-react';

function formatDateRange(startDateStr: string, endDateStr: string): string {
  try {
    const s = new Date(startDateStr);
    const e = new Date(endDateStr);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) {
      return `${startDateStr} — ${endDateStr}`;
    }
    const sDay = s.getDate().toString().padStart(2, '0');
    const sMonth = s.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const eDay = e.getDate().toString().padStart(2, '0');
    const eMonth = e.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = e.getFullYear();

    return `${sDay} ${sMonth} — ${eDay} ${eMonth} ${year}`;
  } catch {
    return `${startDateStr} — ${endDateStr}`;
  }
}

function formatSimpleDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = d.getDate().toString().padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    return `${day} ${month}`;
  } catch {
    return dateStr;
  }
}

interface HackathonDetailPageProps {
  hackathonId: string;
}

export const HackathonDetailPage: React.FC<HackathonDetailPageProps> = ({ hackathonId }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { user, profile } = useAuth();
  const {
    hackathons,
    submissions,
    hackathonRegistrations,
    registerForHackathon,
    addSubmission,
  } = useCms();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PROJECTS' | 'RULES'>('OVERVIEW');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Find hackathon
  const hackathon = useMemo(() => {
    return (
      hackathons.find(
        (h) =>
          h.id.toLowerCase() === hackathonId.toLowerCase() ||
          h.slug.toLowerCase() === hackathonId.toLowerCase()
      ) || {
        id: hackathonId,
        title: 'DETOX Game Building Hackathon 2026',
        slug: 'game-building-hackathon-2026',
        tagline: 'Build. Play. Ship.',
        description:
          'A 48-hour student game development marathon focused on bespoke graphics engines, raymarched shaders, fixed-point deterministic physics, and mechanical arcade controls.',
        coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80',
        status: 'ONGOING' as const,
        startDate: '2026-10-01T09:00:00Z',
        endDate: '2026-10-07T21:00:00Z',
        registrationDeadline: '2026-10-05T23:59:00Z',
        submissionDeadline: '2026-10-07T20:00:00Z',
        rules:
          '1. All source code must be written during the sprint or clearly attributed.\n2. No commercial closed engines — custom C/C++, Rust, WebGPU, or lightweight open-source frameworks only.\n3. Games must be playable in-browser or provide verified binaries.',
        theme: 'Zero Bloat: Custom Engines, Deterministic Physics & Arcade Action',
        categories: ['Physics Simulation', 'Arcade / Action', 'Graphics & Engine', 'Roguelike / Retro', 'Experimental / Audio'],
        organizer: 'DETOX Engineering Collective',
        location: 'DETOX Hardware Lab & Online Discord',
        capacity: '64 Builders / 18 Teams',
        isPublished: true,
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-10-04T00:00:00Z',
      }
    );
  }, [hackathons, hackathonId]);

  const classification = classifyHackathon(hackathon);
  const isPrevious = classification === 'PREVIOUS';
  const isOngoing = classification === 'ONGOING';
  const isUpcoming = classification === 'UPCOMING';

  // Submissions for this hackathon
  const publishedSubmissions = useMemo(() => {
    return submissions.filter(
      (s) =>
        s.published &&
        (s.hackathonId === hackathon.id ||
          s.eventId === hackathon.id ||
          (hackathon.slug && (s.hackathonId === hackathon.slug || s.eventId === hackathon.slug)))
    );
  }, [submissions, hackathon.id, hackathon.slug]);

  // Check user registration
  const userRegistration = useMemo(() => {
    if (!user && !profile) return null;
    return hackathonRegistrations.find(
      (r) =>
        (r.hackathonId === hackathon.id || r.hackathonId === hackathon.slug) &&
        ((user && r.userId === user.id) || (profile && r.email.toLowerCase() === profile.email.toLowerCase()))
    );
  }, [hackathonRegistrations, hackathon.id, hackathon.slug, user, profile]);

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

  // Project Submission Form State
  const [subForm, setSubForm] = useState({
    title: '',
    slug: '',
    teamName: '',
    participantNames: profile?.name || '',
    category: hackathon.categories[0] || 'General',
    description: '',
    coverImage: '',
    demoUrl: '',
    repositoryUrl: '',
    techStack: '',
    screenshots: '',
  });
  const [subStatus, setSubStatus] = useState<{ loading: boolean; success: boolean; error: string | null }>({
    loading: false,
    success: false,
    error: null,
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName.trim() || !regForm.email.trim()) {
      setRegStatus({ loading: false, success: false, error: 'Full name and email are required.' });
      return;
    }

    setRegStatus({ loading: true, success: false, error: null });
    try {
      const res = await registerForHackathon({
        hackathonId: hackathon.id,
        userId: user?.id,
        fullName: regForm.fullName.trim(),
        email: regForm.email.trim(),
        discordHandle: regForm.discordHandle.trim() || undefined,
        teamName: regForm.teamName.trim() || undefined,
        skills: regForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
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

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subForm.title.trim() || !subForm.description.trim()) {
      setSubStatus({ loading: false, success: false, error: 'Project title and description are required.' });
      return;
    }

    setSubStatus({ loading: true, success: false, error: null });
    try {
      const slug = subForm.slug.trim() || subForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const participants = subForm.participantNames
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      const techStack = subForm.techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const screenshots = subForm.screenshots
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      await addSubmission({
        hackathonId: hackathon.id,
        eventId: hackathon.id,
        title: subForm.title.trim(),
        slug,
        teamName: subForm.teamName.trim() || undefined,
        participantNames: participants.length > 0 ? participants : [profile?.name || 'Anonymous'],
        category: subForm.category,
        description: subForm.description.trim(),
        coverImage: subForm.coverImage.trim() || undefined,
        demoUrl: subForm.demoUrl.trim() || undefined,
        repositoryUrl: subForm.repositoryUrl.trim() || undefined,
        techStack,
        screenshots,
        published: true, // Mark submitted project published or reviewable
      });

      setSubStatus({ loading: false, success: true, error: null });
    } catch (err: any) {
      setSubStatus({ loading: false, success: false, error: err.message || 'Error submitting project.' });
    }
  };

  const submissionsUrl = `/hackathons/${hackathon.slug || hackathon.id}/submissions`;

  return (
    <PageContainer maxWidth="6xl">
      {/* 1. Context Return Bar */}
      <div className="mb-6">
        <Link
          to="/hackathons"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors py-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to All Hackathons</span>
        </Link>
      </div>

      {/* 2. Banner & Hero Header */}
      <div className="relative rounded-3xl overflow-hidden mb-8 border border-zinc-300 dark:border-zinc-800 bg-zinc-950">
        {hackathon.bannerImage || hackathon.coverImage ? (
          <div className="relative aspect-21/9 min-h-[260px] w-full">
            <img
              src={hackathon.bannerImage || hackathon.coverImage}
              alt={hackathon.title}
              className="w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          </div>
        ) : (
          <div className="p-8 bg-zinc-900 border-b border-zinc-800" />
        )}

        {/* Hero Overlay Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span
              className={`text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${
                isOngoing
                  ? 'bg-emerald-500 text-black font-extrabold'
                  : isUpcoming
                  ? 'bg-amber-400 text-black font-extrabold'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
              }`}
            >
              {isOngoing ? 'ONGOING SPRINT' : isUpcoming ? 'UPCOMING SPRINT' : 'ARCHIVED SPRINT'}
            </span>

            {hackathon.organizer && (
              <span className="text-xs font-mono text-zinc-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                {hackathon.organizer}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-2">
            {hackathon.title}
          </h1>

          {hackathon.tagline && (
            <p className="font-mono text-xs sm:text-sm font-semibold text-[#99CDD8] uppercase tracking-wider max-w-2xl">
              {hackathon.tagline}
            </p>
          )}
        </div>
      </div>

      {/* 3. Event Meta Bar & Primary Actions Strip */}
      <div
        className={`p-6 rounded-2xl border mb-10 transition-colors ${
          isLight ? 'bg-white border-zinc-300' : 'bg-[#14161a] border-zinc-800'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs font-mono flex-1">
            <div className="flex items-start gap-2.5">
              <Calendar size={16} className="text-[#235347] dark:text-[#99CDD8] shrink-0 mt-0.5" />
              <div>
                <div className="text-zinc-500 text-[10px] uppercase">Sprint Window</div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {formatDateRange(hackathon.startDate, hackathon.endDate)}
                </div>
              </div>
            </div>

            {hackathon.location && (
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-[#235347] dark:text-[#99CDD8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">Location</div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {hackathon.location}
                  </div>
                </div>
              </div>
            )}

            {hackathon.capacity && (
              <div className="flex items-start gap-2.5">
                <Users size={16} className="text-[#235347] dark:text-[#99CDD8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-zinc-500 text-[10px] uppercase">Capacity</div>
                  <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {hackathon.capacity}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {/* Direct Projects Link */}
            <Link
              to={submissionsUrl}
              className={`py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide border flex items-center gap-1.5 transition-all ${
                isLight
                  ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-300'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700'
              }`}
            >
              <FolderGit2 size={14} />
              <span>Browse All Submissions ({publishedSubmissions.length})</span>
            </Link>

            {/* Registration / Project Submission CTA for Ongoing/Upcoming */}
            {!isPrevious && (
              <>
                {userRegistration ? (
                  <button
                    onClick={() => setShowSubmitModal(true)}
                    className="py-2.5 px-5 rounded-xl text-xs font-semibold tracking-wide text-white bg-[#235347] hover:bg-[#1a3f36] transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Submit Project</span>
                    <ArrowRight size={13} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="py-2.5 px-5 rounded-xl text-xs font-semibold tracking-wide text-white bg-[#235347] hover:bg-[#1a3f36] transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Register to Participate</span>
                    <ArrowRight size={13} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Registered status alert */}
        {userRegistration && !isPrevious && (
          <div className="mt-4 pt-4 border-t border-inherit flex items-center justify-between text-xs font-mono text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} />
              <span>You are officially registered as <strong>{userRegistration.fullName}</strong> {userRegistration.teamName ? `(${userRegistration.teamName})` : ''}</span>
            </div>
            <button
              onClick={() => setShowSubmitModal(true)}
              className="underline hover:opacity-80 font-semibold"
            >
              Submit your build now &rarr;
            </button>
          </div>
        )}

        {/* Concluded Archival Notice for Previous */}
        {isPrevious && (
          <div className="mt-4 pt-4 border-t border-inherit text-xs font-mono text-zinc-500 flex items-center justify-between">
            <span>This hackathon has concluded. Registration is closed. Explore the student project archive below.</span>
            <Link to={submissionsUrl} className="underline hover:text-[#235347] dark:hover:text-[#99CDD8]">
              View All Submitted Games & Projects &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* 4. Detail Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-inherit pb-3 font-mono text-xs">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#235347] text-white'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-500/10'
          }`}
        >
          Overview & Brief
        </button>

        <button
          onClick={() => setActiveTab('PROJECTS')}
          className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'PROJECTS'
              ? 'bg-[#235347] text-white'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-500/10'
          }`}
        >
          <span>Submissions & Projects</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
            {publishedSubmissions.length}
          </span>
        </button>

        {hackathon.rules && (
          <button
            onClick={() => setActiveTab('RULES')}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              activeTab === 'RULES'
                ? 'bg-[#235347] text-white'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-500/10'
            }`}
          >
            Rules & Requirements
          </button>
        )}
      </div>

      {/* 5. TAB CONTENT: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-10">
          {/* Main Description & Theme */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
                  ABOUT THIS SPRINT
                </h3>
                <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}>
                  {hackathon.description}
                </p>
              </div>

              {hackathon.theme && (
                <div
                  className={`p-6 rounded-2xl border ${
                    isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/50 border-zinc-800'
                  }`}
                >
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">
                    HACKATHON THEME
                  </div>
                  <div className="font-display text-xl font-bold text-[#235347] dark:text-[#99CDD8]">
                    {hackathon.theme}
                  </div>
                </div>
              )}

              {/* Categories */}
              {hackathon.categories.length > 0 && (
                <div>
                  <h4 className="font-display text-lg font-bold tracking-tight mb-3">
                    COMPETITION CATEGORIES & TRACKS
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {hackathon.categories.map((cat, idx) => (
                      <div
                        key={cat}
                        className={`p-4 rounded-xl border flex items-center gap-3 ${
                          isLight ? 'bg-white border-zinc-200' : 'bg-[#181a20] border-zinc-800'
                        }`}
                      >
                        <span className="font-mono text-xs font-bold text-[#235347] dark:text-[#99CDD8]">
                          0{idx + 1}
                        </span>
                        <span className="font-sans text-xs font-semibold">{cat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Metadata */}
            <div className="space-y-6">
              {/* Deadlines Box */}
              {(hackathon.registrationDeadline || hackathon.submissionDeadline) && (
                <div
                  className={`p-6 rounded-2xl border ${
                    isLight ? 'bg-white border-zinc-300' : 'bg-[#181a20] border-zinc-800'
                  }`}
                >
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                    CRITICAL DEADLINES
                  </h4>

                  <div className="space-y-4 text-xs font-mono">
                    {hackathon.registrationDeadline && (
                      <div className="border-b border-inherit pb-3">
                        <div className="text-zinc-500">Registration Closes</div>
                        <div className="text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                          {formatSimpleDate(hackathon.registrationDeadline)}
                        </div>
                      </div>
                    )}

                    {hackathon.submissionDeadline && (
                      <div>
                        <div className="text-zinc-500">Final Submissions Due</div>
                        <div className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                          {formatSimpleDate(hackathon.submissionDeadline)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Submissions Preview Banner */}
              <div
                className={`p-6 rounded-2xl border text-center ${
                  isLight ? 'bg-[#CFD6C4]/30 border-[#235347]/30' : 'bg-[#163B32]/30 border-[#235347]/50'
                }`}
              >
                <FolderGit2 size={32} className="mx-auto mb-2 text-[#235347] dark:text-[#99CDD8]" />
                <h4 className="font-display text-lg font-bold mb-1">
                  {publishedSubmissions.length} Submissions Cataloged
                </h4>
                <p className="text-xs text-zinc-500 mb-4">
                  Browse real games, simulators, and bare-metal systems built by student builders.
                </p>
                <Link
                  to={submissionsUrl}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-[#235347] text-white hover:bg-[#1a3f36] transition-all"
                >
                  <span>Explore Gallery</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB CONTENT: PROJECTS PREVIEW */}
      {activeTab === 'PROJECTS' && (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-display text-2xl font-bold tracking-tight">
                ALL SUBMITTED PROJECTS
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-0.5">
                SHOWCASING EVERY STUDENT ENTRY WITHOUT EXCLUSION
              </p>
            </div>

            <Link
              to={submissionsUrl}
              className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-semibold bg-[#235347] text-white hover:bg-[#1a3f36] transition-all"
            >
              <span>Open Dedicated Fullscreen Gallery</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {publishedSubmissions.length === 0 ? (
            <div
              className={`p-10 rounded-2xl border text-center ${
                isLight ? 'bg-zinc-100/60 border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'
              }`}
            >
              <FolderGit2 size={32} className="mx-auto mb-3 text-zinc-400" />
              <h4 className="font-sans font-semibold text-base mb-1">No submissions yet.</h4>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                Participants have not submitted their projects yet, or entries are currently undergoing organizer review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedSubmissions.map((sub) => {
                const subDetailUrl = `/hackathons/${hackathon.slug || hackathon.id}/submissions/${sub.slug || sub.id}`;

                return (
                  <div
                    key={sub.id}
                    className={`group rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${
                      isLight
                        ? 'bg-white border-zinc-300 hover:border-[#235347]'
                        : 'bg-[#14161a] border-zinc-800 hover:border-[#99CDD8]/70'
                    }`}
                  >
                    {sub.coverImage && (
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-950">
                        <img
                          src={sub.coverImage}
                          alt={sub.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {sub.resultBadge && (
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400 text-black shadow-md">
                              {sub.resultBadge}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {sub.category && (
                          <span className="text-[10px] font-mono uppercase text-zinc-500 mb-1 block">
                            {sub.category}
                          </span>
                        )}

                        <h4 className="font-display text-lg font-bold tracking-tight mb-1 group-hover:text-[#235347] dark:group-hover:text-[#99CDD8] transition-colors">
                          {sub.title}
                        </h4>

                        {(sub.teamName || sub.participantNames.length > 0) && (
                          <p className="text-xs font-mono text-[#235347] dark:text-[#99CDD8] mb-3">
                            by {sub.teamName || sub.participantNames.join(', ')}
                          </p>
                        )}

                        <p
                          className={`text-xs leading-relaxed mb-4 line-clamp-3 ${
                            isLight ? 'text-zinc-600' : 'text-zinc-400'
                          }`}
                        >
                          {sub.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-inherit flex items-center justify-between">
                        <Link
                          to={subDetailUrl}
                          className="text-xs font-semibold text-[#235347] dark:text-[#99CDD8] hover:underline flex items-center gap-1"
                        >
                          <span>View Project</span>
                          <ArrowRight size={12} />
                        </Link>

                        {sub.demoUrl && (
                          <a
                            href={sub.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                            title="Play Demo"
                          >
                            <Play size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 7. TAB CONTENT: RULES */}
      {activeTab === 'RULES' && hackathon.rules && (
        <div
          className={`p-8 rounded-2xl border leading-relaxed ${
            isLight ? 'bg-white border-zinc-300 text-zinc-800' : 'bg-[#14161a] border-zinc-800 text-zinc-200'
          }`}
        >
          <h3 className="font-display text-2xl font-bold tracking-tight mb-4">
            RULES & PARTICIPATION REQUIREMENTS
          </h3>
          <div className="font-sans text-sm whitespace-pre-line space-y-2">
            {hackathon.rules}
          </div>
        </div>
      )}

      {/* 8. Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl relative ${
              isLight ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-[#15171c] border-zinc-800 text-zinc-100'
            }`}
          >
            <button
              onClick={() => setShowRegisterModal(false)}
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
                {hackathon.title}
              </h3>
            </div>

            {regStatus.success ? (
              <div className="text-center py-6">
                <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-3" />
                <h4 className="font-display text-xl font-bold mb-2">Registration Confirmed!</h4>
                <p className="text-xs text-zinc-500 mb-6 max-w-sm mx-auto">
                  You are registered for {hackathon.title}. You can now submit your project during the active build period.
                </p>
                <button
                  onClick={() => setShowRegisterModal(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#235347] text-white hover:bg-[#1a3f36] transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4 text-xs font-sans">
                {regStatus.error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{regStatus.error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    value={regForm.fullName}
                    onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">DISCORD / HANDLE</label>
                    <input
                      type="text"
                      value={regForm.discordHandle}
                      onChange={(e) => setRegForm({ ...regForm, discordHandle: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                        isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">TEAM NAME (OPTIONAL)</label>
                    <input
                      type="text"
                      value={regForm.teamName}
                      onChange={(e) => setRegForm({ ...regForm, teamName: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                        isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">SKILLS / STACK</label>
                  <input
                    type="text"
                    value={regForm.skills}
                    onChange={(e) => setRegForm({ ...regForm, skills: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border font-sans text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="e.g. Rust, WebGPU, Shaders, Physics"
                  />
                </div>

                <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={regStatus.loading}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#235347] hover:bg-[#1a3f36] disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {regStatus.loading ? 'Registering...' : 'Confirm Registration'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. Submit Project Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div
            className={`w-full max-w-2xl rounded-2xl border p-6 sm:p-8 shadow-2xl relative my-8 ${
              isLight ? 'bg-white border-zinc-300 text-zinc-900' : 'bg-[#15171c] border-zinc-800 text-zinc-100'
            }`}
          >
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              title="Close"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#235347]/15 text-[#235347] dark:text-[#99CDD8] font-bold">
                PROJECT SUBMISSION PORTAL
              </span>
              <h3 className="font-display text-2xl font-bold tracking-tight mt-1.5">
                Submit Your Project to {hackathon.title}
              </h3>
              <p className="text-xs text-zinc-500 font-mono mt-1">
                Your submission will be published to the public gallery for everyone to play and review.
              </p>
            </div>

            {subStatus.success ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                <h4 className="font-display text-2xl font-bold mb-2">Project Submitted!</h4>
                <p className="text-xs text-zinc-500 mb-6 max-w-sm mx-auto">
                  Your project has been received and added to the hackathon showcase.
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setShowSubmitModal(false);
                      setActiveTab('PROJECTS');
                    }}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold bg-[#235347] text-white hover:bg-[#1a3f36] transition-all"
                  >
                    View All Projects
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitProject} className="space-y-4 text-xs font-sans">
                {subStatus.error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    <span>{subStatus.error}</span>
                  </div>
                )}

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
                      placeholder="e.g. Orbit: N-Body Slingshot"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">CATEGORY / TRACK</label>
                    <select
                      value={subForm.category}
                      onChange={(e) => setSubForm({ ...subForm, category: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                        isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      }`}
                    >
                      {hackathon.categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
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
                      placeholder="e.g. Team Kepler-42"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">TEAM MEMBERS / BUILDERS *</label>
                    <input
                      type="text"
                      required
                      value={subForm.participantNames}
                      onChange={(e) => setSubForm({ ...subForm, participantNames: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                        isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      }`}
                      placeholder="Comma separated: Dev P., Aditya N."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 mb-1">DESCRIPTION & TECHNICAL ARCHITECTURE *</label>
                  <textarea
                    rows={3}
                    required
                    value={subForm.description}
                    onChange={(e) => setSubForm({ ...subForm, description: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                      isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                    placeholder="Explain what you built, how your engine or physics works, and technical post-mortem..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-500 mb-1">LIVE DEMO / PLAY URL</label>
                    <input
                      type="url"
                      value={subForm.demoUrl}
                      onChange={(e) => setSubForm({ ...subForm, demoUrl: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border text-xs outline-none ${
                        isLight ? 'bg-zinc-50 border-zinc-300' : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                      }`}
                      placeholder="https://..."
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
                      placeholder="https://github.com/..."
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
                      placeholder="https://images.unsplash.com/..."
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
                      placeholder="Comma separated: Rust, Bevy, Wasm, WebGPU"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-inherit flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-zinc-300 dark:border-zinc-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={subStatus.loading}
                    className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#235347] hover:bg-[#1a3f36] disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {subStatus.loading ? 'Submitting...' : 'Publish Project'}
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
