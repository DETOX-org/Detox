import React, { useMemo } from 'react';
import { useCms } from '../cms/CmsContext';
import { useTheme } from '../ThemeContext';
import { PageContainer } from '../design-system/primitives';
import { Link } from '../router';
import {
  Trophy,
  ArrowLeft,
  Calendar,
  MapPin,
  ArrowRight,
} from 'lucide-react';

interface HackathonDetailPageProps {
  hackathonSlug: string;
}

export const HackathonDetailPage: React.FC<HackathonDetailPageProps> = ({ hackathonSlug }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { hackathons, hackathonProjects, isLoadingData } = useCms();

  // Find hackathon by slug or id
  const hackathon = useMemo(() => {
    return hackathons.find(
      (h) =>
        h.slug.toLowerCase() === hackathonSlug.toLowerCase() ||
        h.id.toLowerCase() === hackathonSlug.toLowerCase()
    );
  }, [hackathons, hackathonSlug]);

  // All published projects for this hackathon
  const projects = useMemo(() => {
    if (!hackathon) return [];
    return hackathonProjects.filter(
      (p) =>
        p.published &&
        (p.hackathonId === hackathon.id || (hackathon.slug && p.hackathonId === hackathon.slug))
    );
  }, [hackathonProjects, hackathon]);

  // Filter and sort winners
  const winners = useMemo(() => {
    const list = projects.filter((p) => p.isWinner || Boolean(p.placement));

    // Priority sorting: 1st, 2nd, 3rd, others
    return list.sort((a, b) => {
      const getRank = (placement?: string) => {
        if (!placement) return 99;
        const p = placement.toLowerCase();
        if (p.includes('1st') || p.includes('first') || p.includes('winner') || p.includes('champion')) return 1;
        if (p.includes('2nd') || p.includes('second') || p.includes('runner')) return 2;
        if (p.includes('3rd') || p.includes('third')) return 3;
        return 10;
      };
      return getRank(a.placement) - getRank(b.placement);
    });
  }, [projects]);

  if (!hackathon && !isLoadingData) {
    return (
      <PageContainer maxWidth="5xl">
        <div className="py-20 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
            <Trophy size={28} />
          </div>
          <h2 className="text-2xl font-bold font-sans">Hackathon Record Not Found</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            The requested hackathon archive record does not exist or may have been unlisted.
          </p>
          <div className="pt-2">
            <Link
              to="/hackathons"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#235347] text-white rounded-full text-xs font-semibold hover:bg-[#163B32] transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Hackathons Archive</span>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!hackathon) {
    return (
      <PageContainer maxWidth="5xl">
        <div className="py-24 text-center text-xs font-mono text-zinc-500">
          Loading hackathon record...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="6xl">
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link
          to="/hackathons"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-[#235347] dark:hover:text-[#38B2A2] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>All Hackathons Archive</span>
        </Link>
      </div>

      {/* Hero / Hackathon Information Banner */}
      <div
        className={`rounded-3xl border overflow-hidden p-6 sm:p-10 mb-14 relative ${
          isLight
            ? 'bg-[#faf8f5] border-zinc-200/90 shadow-sm'
            : 'bg-[#121316] border-zinc-800 shadow-xl'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Information Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-0.5 rounded-full bg-[#235347]/10 text-[#235347] dark:text-[#38B2A2] font-bold">
                CONDUCTED HACKATHON
              </span>
              <span className="flex items-center gap-1 text-zinc-500">
                <Calendar size={12} className="text-[#235347] dark:text-[#38B2A2]" />
                <span>{hackathon.date}</span>
              </span>
              {hackathon.location && (
                <span className="flex items-center gap-1 text-zinc-500">
                  <MapPin size={12} className="text-zinc-400" />
                  <span>{hackathon.location}</span>
                </span>
              )}
            </div>

            <h1 className={`text-2xl sm:text-4xl font-extrabold font-sans tracking-tight ${
              isLight ? 'text-zinc-950' : 'text-zinc-50'
            }`}>
              {hackathon.title}
            </h1>

            {hackathon.tagline && (
              <p className="text-sm sm:text-base font-medium text-[#235347] dark:text-[#38B2A2]">
                {hackathon.tagline}
              </p>
            )}

            <p className={`text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-zinc-700' : 'text-zinc-300'
            }`}>
              {hackathon.description}
            </p>

            {/* Quick Stats & Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to={`/hackathons/${hackathon.slug || hackathon.id}/projects`}
                className="px-5 py-2.5 rounded-full bg-[#235347] hover:bg-[#163B32] text-white text-xs font-bold tracking-wide transition-all flex items-center gap-2 shadow-xs group"
              >
                <span>View All Projects ({projects.length})</span>
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pl-2">
                <span>{projects.length} Total Submissions</span>
                <span>•</span>
                <span className="text-amber-600 dark:text-amber-400 font-semibold">
                  {winners.length} Winners Recognized
                </span>
              </div>
            </div>
          </div>

          {/* Poster Visual Frame */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-inherit shadow-md aspect-16/10 bg-zinc-900 relative">
              {hackathon.coverImage ? (
                <img
                  src={hackathon.coverImage}
                  alt={hackathon.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500">
                  <Trophy size={48} className="text-[#38B2A2] opacity-40 mb-2" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    DETOX Engineering Sprint
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Winners Section */}
      <section className="mb-16">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <Trophy size={14} />
              <span>Results & Podium</span>
            </div>
            <h2 className={`text-xl sm:text-2xl font-bold font-sans tracking-tight ${
              isLight ? 'text-zinc-950' : 'text-zinc-100'
            }`}>
              Hackathon Winners
            </h2>
          </div>

          {/* View All Button */}
          <Link
            to={`/hackathons/${hackathon.slug || hackathon.id}/projects`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-[#235347] dark:hover:border-[#38B2A2] text-xs font-semibold transition-colors"
          >
            <span>View All {projects.length} Projects</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {winners.length === 0 ? (
          <div
            className={`p-10 text-center rounded-2xl border ${
              isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'
            }`}
          >
            <Trophy size={32} className="mx-auto text-zinc-400 mb-2 opacity-50" />
            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
              No Winners Specially Marked Yet
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              All submitted student builds and prototypes can be browsed in the complete project archive.
            </p>
            <Link
              to={`/hackathons/${hackathon.slug || hackathon.id}/projects`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#235347] text-white text-xs font-semibold rounded-full hover:bg-[#163B32] transition-colors"
            >
              <span>Browse All Projects</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {winners.map((winner, idx) => {
              const placement = winner.placement || (idx === 0 ? '1st Place' : idx === 1 ? '2nd Place' : idx === 2 ? '3rd Place' : 'Winner');
              const isFirst = placement.toLowerCase().includes('1st') || placement.toLowerCase().includes('first') || placement.toLowerCase().includes('champion');
              const isSecond = placement.toLowerCase().includes('2nd') || placement.toLowerCase().includes('second');
              const isThird = placement.toLowerCase().includes('3rd') || placement.toLowerCase().includes('third');

              const badgeColor = isFirst
                ? 'bg-amber-400 text-zinc-950 shadow-amber-400/20'
                : isSecond
                ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-300 dark:text-zinc-950'
                : isThird
                ? 'bg-amber-700/80 text-white'
                : 'bg-[#235347] text-white';

              return (
                <Link
                  key={winner.id}
                  to={`/hackathons/${hackathon.slug || hackathon.id}/projects/${winner.slug}`}
                  className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${
                    isLight
                      ? 'bg-white hover:border-[#235347]/60 shadow-xs hover:shadow-xl'
                      : 'bg-[#15171c] hover:border-[#38B2A2]/50 shadow-md hover:shadow-2xl hover:shadow-black/60'
                  } border-zinc-200/90 dark:border-zinc-800`}
                >
                  {/* Winner Visual Poster */}
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-900">
                    {winner.coverImage ? (
                      <img
                        src={winner.coverImage}
                        alt={winner.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                        NO PREVIEW
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Prominent Placement Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md ${badgeColor}`}>
                        <Trophy size={12} />
                        <span>{placement}</span>
                      </span>
                    </div>

                    {/* Team tag over image */}
                    {winner.teamName && (
                      <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-mono font-medium truncate drop-shadow-xs">
                        Team: {winner.teamName}
                      </div>
                    )}
                  </div>

                  {/* Winner Card Info */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className={`text-base font-bold font-sans tracking-tight group-hover:text-[#235347] dark:group-hover:text-[#38B2A2] transition-colors line-clamp-2 ${
                        isLight ? 'text-zinc-900' : 'text-zinc-100'
                      }`}>
                        {winner.title}
                      </h3>

                      {winner.teamMembers && winner.teamMembers.length > 0 && (
                        <p className="text-[11px] text-zinc-500 font-mono mt-1 truncate">
                          By: {winner.teamMembers.join(', ')}
                        </p>
                      )}

                      <p className={`text-xs leading-relaxed mt-2 line-clamp-3 ${
                        isLight ? 'text-zinc-600' : 'text-zinc-400'
                      }`}>
                        {winner.description}
                      </p>
                    </div>

                    {/* Tech Stack Chips & Link Action */}
                    <div className="pt-3 border-t border-inherit flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1 min-w-0">
                        {winner.techStack && winner.techStack.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className={`text-[9px] font-mono px-2 py-0.5 rounded-xs ${
                              isLight
                                ? 'bg-zinc-100 text-zinc-700 border border-zinc-200'
                                : 'bg-zinc-800 text-zinc-300 border border-zinc-700/60'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="text-xs font-semibold text-[#235347] dark:text-[#38B2A2] shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                        <span>Details</span>
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* View All Projects Callout Section */}
      <section className="mb-20">
        <div
          className={`p-8 sm:p-10 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 ${
            isLight
              ? 'bg-[#f4f1ea] border-zinc-200'
              : 'bg-[#14161a] border-zinc-800'
          }`}
        >
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className={`text-lg sm:text-xl font-bold font-sans ${
              isLight ? 'text-zinc-950' : 'text-zinc-50'
            }`}>
              Browse Every Project From This Hackathon
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 max-w-xl">
              Explore the full archive of {projects.length} submissions, prototypes, custom engines, and code repositories created during {hackathon.title}.
            </p>
          </div>

          <Link
            to={`/hackathons/${hackathon.slug || hackathon.id}/projects`}
            className="px-6 py-3 rounded-full bg-[#235347] hover:bg-[#163B32] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <span>View All ({projects.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </PageContainer>
  );
};
