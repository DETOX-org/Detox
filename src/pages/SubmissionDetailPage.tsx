import React, { useState, useMemo } from 'react';
import { useRouter, Link } from '../router';
import { useCms } from '../cms/CmsContext';
import { useTheme } from '../ThemeContext';
import { PageContainer, Tag, type TagVariant } from '../design-system/primitives';
import {
  ArrowLeft,
  ExternalLink,
  Play,
  Trophy,
  Users,
  Code2,
  Layers,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react';

const GitHubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GitHub">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface SubmissionDetailPageProps {
  eventId?: string;
  hackathonId?: string;
  submissionId: string;
}

export const SubmissionDetailPage: React.FC<SubmissionDetailPageProps> = ({
  eventId,
  hackathonId,
  submissionId,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { navigate, path } = useRouter();
  const { events, hackathons, submissions, isLoadingData } = useCms();

  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const isHackathonRoute = Boolean(hackathonId) || path.startsWith('/hackathons');
  const targetId = hackathonId || eventId || 'game-building-hackathon-2026';

  // Find corresponding hackathon or event
  const hackathon = useMemo(() => {
    return hackathons.find(
      (h) =>
        h.id.toLowerCase() === targetId.toLowerCase() ||
        h.slug.toLowerCase() === targetId.toLowerCase()
    );
  }, [hackathons, targetId]);

  const event = useMemo(() => {
    if (hackathon) {
      return {
        id: hackathon.id,
        code: 'DTX-HACK',
        title: hackathon.title,
        category: 'HACKATHON' as const,
        date: hackathon.startDate,
        time: 'Hybrid Sprint',
        location: hackathon.location || 'DETOX Hardware Lab',
        description: hackathon.description,
        deliverables: ['Playable game/system build', 'Public Git repository'],
        status: 'PUBLISHED' as const,
        isUpcoming: false,
        photoLabel: hackathon.title,
        photoCaption: hackathon.tagline || 'Student build sprint.',
        createdAt: hackathon.createdAt,
        updatedAt: hackathon.updatedAt,
      };
    }

    return (
      events.find(
        (e) =>
          e.id.toLowerCase() === targetId.toLowerCase() ||
          e.code.toLowerCase() === targetId.toLowerCase() ||
          e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(targetId.toLowerCase())
      ) || {
        id: targetId,
        code: 'DTX-HACK',
        title: 'DETOX Game Building Hackathon 2026',
        category: 'HACKATHON' as const,
        date: 'OCTOBER 24-26, 2026',
        time: '48-Hour Hybrid Build Sprint',
        location: 'DETOX Hardware Lab & Online Discord',
        description: 'A 48-hour student game building marathon focused on custom physics engines, GLSL shaders, and web-playable games without corporate engine bloat.',
        deliverables: ['Playable game build', 'Public Git repository'],
        status: 'PUBLISHED' as const,
        isUpcoming: false,
        photoLabel: 'Game Building Hackathon',
        photoCaption: '48-hour student game building sprint.',
        createdAt: '2026-09-01',
        updatedAt: '2026-10-02',
      }
    );
  }, [events, hackathon, targetId]);

  // All published submissions for this event or hackathon
  const eventSubmissions = useMemo(() => {
    return submissions.filter(
      (s) =>
        s.published &&
        (s.hackathonId?.toLowerCase() === targetId.toLowerCase() ||
          s.eventId?.toLowerCase() === targetId.toLowerCase() ||
          (hackathon && (s.hackathonId?.toLowerCase() === hackathon.id.toLowerCase() || s.hackathonId?.toLowerCase() === hackathon.slug.toLowerCase())) ||
          (event && s.eventId?.toLowerCase() === event.id.toLowerCase()) ||
          targetId === 'game-building-hackathon-2026' ||
          s.hackathonId === 'game-building-hackathon-2026')
    );
  }, [submissions, targetId, hackathon, event]);

  // Current submission matching submissionId or slug
  const submissionIndex = useMemo(() => {
    return eventSubmissions.findIndex(
      (s) =>
        s.id.toLowerCase() === submissionId.toLowerCase() ||
        (s.slug && s.slug.toLowerCase() === submissionId.toLowerCase())
    );
  }, [eventSubmissions, submissionId]);

  const submission = submissionIndex >= 0 ? eventSubmissions[submissionIndex] : null;

  // Previous and Next submissions for smooth gallery navigation
  const prevSubmission = submissionIndex > 0 ? eventSubmissions[submissionIndex - 1] : null;
  const nextSubmission =
    submissionIndex >= 0 && submissionIndex < eventSubmissions.length - 1
      ? eventSubmissions[submissionIndex + 1]
      : null;

  const getCategoryTagVariant = (category?: string): TagVariant => {
    if (!category) return 'green';
    const lower = category.toLowerCase();
    if (lower.includes('physics')) return 'teal';
    if (lower.includes('arcade') || lower.includes('action')) return 'coral';
    if (lower.includes('graphics') || lower.includes('engine')) return 'wisteria';
    if (lower.includes('retro') || lower.includes('rogue')) return 'peach';
    if (lower.includes('puzzle') || lower.includes('strategy')) return 'sky';
    if (lower.includes('audio')) return 'lilac';
    return 'sage';
  };

  const galleryUrl = isHackathonRoute
    ? `/hackathons/${encodeURIComponent(hackathon?.slug || targetId)}/submissions`
    : `/events/${encodeURIComponent(event.id)}/submissions`;

  // Loading state
  if (isLoadingData && !submission) {
    return (
      <PageContainer maxWidth="6xl">
        <div className="py-24 text-center space-y-4">
          <div className="inline-block w-8 h-8 border-2 border-[#235347] dark:border-[#38B2A2] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading submission showcase...</p>
        </div>
      </PageContainer>
    );
  }

  // Submission Not Found state
  if (!submission) {
    return (
      <PageContainer maxWidth="6xl">
        <div className="py-20 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-500/10 flex items-center justify-center mx-auto text-zinc-400">
            <Layers size={24} />
          </div>
          <h2 className="font-display text-3xl font-bold text-zinc-950 dark:text-zinc-50">
            Submission not found
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-md mx-auto">
            The project you are looking for may have been unpublished, moved, or the link may be incorrect.
          </p>
          <div className="pt-4">
            <Link
              to={galleryUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#235347] dark:bg-[#38B2A2] text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <ArrowLeft size={14} />
              <span>Return to {event.title} Submissions</span>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const categoryTagVariant = getCategoryTagVariant(submission.category);

  return (
    <PageContainer maxWidth="6xl">
      {/* 1. Contextual Return Bar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to={galleryUrl}
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors py-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to {event.title} submissions</span>
        </Link>

        {/* Prev / Next Pagination */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {prevSubmission && (
            <button
              onClick={() =>
                navigate(
                  isHackathonRoute
                    ? `/hackathons/${encodeURIComponent(hackathon?.slug || targetId)}/submissions/${encodeURIComponent(prevSubmission.slug || prevSubmission.id)}`
                    : `/events/${encodeURIComponent(event.id)}/submissions/${encodeURIComponent(prevSubmission.slug || prevSubmission.id)}`
                )
              }
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                isLight
                  ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  : 'bg-[#14161a] border-zinc-800 text-zinc-300 hover:bg-zinc-800'
              }`}
              title={`Previous: ${prevSubmission.title}`}
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Prev</span>
            </button>
          )}

          <span className="text-zinc-400 text-[11px] px-1">
            {submissionIndex + 1} of {eventSubmissions.length}
          </span>

          {nextSubmission && (
            <button
              onClick={() =>
                navigate(
                  isHackathonRoute
                    ? `/hackathons/${encodeURIComponent(hackathon?.slug || targetId)}/submissions/${encodeURIComponent(nextSubmission.slug || nextSubmission.id)}`
                    : `/events/${encodeURIComponent(event.id)}/submissions/${encodeURIComponent(nextSubmission.slug || nextSubmission.id)}`
                )
              }
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 ${
                isLight
                  ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                  : 'bg-[#14161a] border-zinc-800 text-zinc-300 hover:bg-zinc-800'
              }`}
              title={`Next: ${nextSubmission.title}`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Editorial Header */}
      <div className={`border-b pb-8 mb-10 transition-colors ${isLight ? 'border-zinc-300' : 'border-zinc-800'}`}>
        {/* Badges strip: Category & Result Badge */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {submission.category && (
            <Tag
              label={submission.category}
              variant={categoryTagVariant}
              className="text-xs font-semibold px-3 py-1"
            />
          )}

          {submission.resultBadge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-400 text-zinc-950 shadow-sm">
              <Trophy size={13} className="shrink-0" />
              <span>{submission.resultBadge}</span>
            </div>
          )}

          <span className="text-zinc-400 text-xs hidden sm:inline">•</span>

          <div className="text-xs text-zinc-500 font-mono">
            {event.title}
          </div>
        </div>

        {/* Project Title */}
        <h1
          className={`text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight font-display leading-[1.06] mb-4 transition-colors ${
            isLight ? 'text-zinc-950' : 'text-zinc-50'
          }`}
        >
          {submission.title}
        </h1>

        {/* Builder / Team Line */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#235347] dark:text-[#38B2A2]" />
            <span className="font-semibold text-zinc-900 dark:text-zinc-200">
              {submission.teamName || 'Builder'}
            </span>
          </div>

          {submission.participantNames && submission.participantNames.length > 0 && (
            <>
              <span className="text-zinc-400">•</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-zinc-400 uppercase tracking-wider font-mono">Team Members:</span>
                <span className="font-medium text-zinc-800 dark:text-zinc-300">
                  {submission.participantNames.join(', ')}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Direct Action Buttons: ONLY render fields that actually exist! */}
        {(submission.demoUrl || submission.repositoryUrl) && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {submission.demoUrl && (
              <a
                href={submission.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#235347] hover:bg-[#163B32] dark:bg-[#38B2A2] dark:hover:bg-[#4ecdc4] text-white dark:text-zinc-950 text-xs font-bold tracking-wide shadow-md transition-all duration-200 group"
              >
                <Play size={13} className="fill-current" />
                <span>PLAY / LAUNCH DEMO</span>
                <ExternalLink size={12} className="opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}

            {submission.repositoryUrl && (
              <a
                href={submission.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide border transition-all duration-200 group ${
                  isLight
                    ? 'bg-white border-zinc-300 text-zinc-800 hover:border-zinc-500 hover:bg-zinc-50'
                    : 'bg-[#14161a] border-zinc-700 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800'
                }`}
              >
                <GitHubIcon size={14} />
                <span>VIEW SOURCE CODE</span>
                <ExternalLink size={12} className="opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            )}
          </div>
        )}
      </div>

      {/* 3. Hero Visual Preview */}
      {submission.coverImage && (
        <div className="mb-12">
          <div
            className={`w-full rounded-2xl overflow-hidden border shadow-xl relative aspect-16/9 sm:aspect-21/9 max-h-[500px] bg-zinc-900/10 ${
              isLight ? 'border-zinc-300/80' : 'border-zinc-800'
            }`}
          >
            <img
              src={submission.coverImage}
              alt={submission.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* 4. Main Detail Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left Column: Full Editorial Description & Screenshots */}
        <div className="lg:col-span-8 space-y-10">
          {/* Project Description */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#235347] dark:text-[#99CDD8] font-mono">
              PROJECT OVERVIEW & SPECIFICATIONS
            </div>
            <p className="font-sans text-base sm:text-lg leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-line">
              {submission.description}
            </p>
          </div>

          {/* Screenshots Gallery: ONLY render if screenshots actually exist! */}
          {submission.screenshots && submission.screenshots.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
                  ARTIFACT GALLERY & SCREENSHOTS ({submission.screenshots.length})
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">Click to inspect</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {submission.screenshots.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedScreenshot(imgUrl)}
                    className={`group cursor-pointer relative rounded-xl overflow-hidden border aspect-16/10 transition-all duration-300 hover:shadow-lg ${
                      isLight ? 'border-zinc-200 hover:border-zinc-400' : 'border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${submission.title} screenshot ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Maximize2 size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Technical Metadata & Event Context */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tech Stack Box: ONLY render if techStack actually exists! */}
          {submission.techStack && submission.techStack.length > 0 && (
            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#121316] border-zinc-800'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
                <Code2 size={14} className="text-[#235347] dark:text-[#38B2A2]" />
                <span>TECHNOLOGY STACK</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {submission.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-lg font-mono text-xs font-medium border ${
                      isLight
                        ? 'bg-zinc-100 border-zinc-300 text-zinc-800'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                    }`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Result / Award Badge Callout (if placed) */}
          {submission.resultBadge && (
            <div
              className={`p-6 rounded-2xl border transition-colors ${
                isLight
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50/40 border-amber-300 text-amber-950'
                  : 'bg-gradient-to-br from-amber-950/30 to-[#121316] border-amber-800/80 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono mb-2">
                <Trophy size={15} />
                <span>HACKATHON COMMENDATION</span>
              </div>
              <div className="font-display text-xl font-bold">
                {submission.resultBadge}
              </div>
            </div>
          )}

          {/* Submitter & Team Details Card */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#121316] border-zinc-800'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
              SUBMITTING TEAM
            </div>

            <div className="space-y-2">
              <div className="font-display font-bold text-lg text-zinc-950 dark:text-zinc-50">
                {submission.teamName || 'Independent Builder'}
              </div>

              {submission.participantNames && submission.participantNames.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[11px] text-zinc-400 uppercase font-mono">Builders:</div>
                  <ul className="text-xs font-sans text-zinc-700 dark:text-zinc-300 space-y-1 list-disc list-inside">
                    {submission.participantNames.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Event Context Card */}
          <div
            className={`p-6 rounded-2xl border space-y-3 font-mono text-xs ${
              isLight ? 'bg-[#faf8f5] border-zinc-200' : 'bg-[#0e0f12] border-zinc-800'
            }`}
          >
            <div className="text-[10px] text-zinc-500 uppercase font-semibold">
              EVENT CONTEXT
            </div>

            <div className="font-sans font-bold text-sm text-zinc-950 dark:text-zinc-100">
              {event.title}
            </div>

            <div className="text-zinc-500 text-[11px] space-y-1">
              <div>DATE: {event.date}</div>
              <div>LOCATION: {event.location}</div>
            </div>

            <div className="pt-2 border-t border-inherit">
              <Link
                to={galleryUrl}
                className="text-[#235347] dark:text-[#99CDD8] font-semibold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>Browse all {eventSubmissions.length} submissions →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Screenshot Lightbox Modal */}
      {selectedScreenshot && (
        <div
          onClick={() => setSelectedScreenshot(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          <button
            onClick={() => setSelectedScreenshot(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
          <img
            src={selectedScreenshot}
            alt="Enlarged screenshot"
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </PageContainer>
  );
};
