import React from 'react';
import { useCms } from '../cms/CmsContext';
import { useTheme } from '../ThemeContext';
import { PageContainer, SectionHeader } from '../design-system/primitives';
import { Link } from '../router';
import { Trophy, Calendar, MapPin, ArrowUpRight, Sparkles, FolderGit2 } from 'lucide-react';

export const HackathonsDirectoryPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { hackathons, hackathonProjects } = useCms();

  // Filter published hackathons for public visitors
  const publishedHackathons = hackathons.filter((h) => h.isPublished);

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header */}
      <SectionHeader
        categoryTag="DETOX Sprints & Marathons"
        title="Hackathons Archive."
        lead="A dedicated visual archive of competitive engineering sprints, hardware bring-ups, and game architecture hackathons conducted by DETOX."
        statusText="Verified Builds"
      />

      {/* Hackathons Grid */}
      {publishedHackathons.length === 0 ? (
        <div
          className={`p-16 text-center rounded-3xl border transition-all duration-300 my-12 ${
            isLight
              ? 'bg-white/80 border-zinc-200/80 shadow-xs'
              : 'bg-[#121316]/80 border-zinc-800 shadow-md'
          }`}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#235347]/10 text-[#235347] dark:text-[#38B2A2] flex items-center justify-center">
            <Trophy size={32} />
          </div>
          <h3 className={`text-xl font-bold font-sans tracking-tight mb-2 ${isLight ? 'text-zinc-900' : 'text-zinc-100'}`}>
            No Hackathon Archives Published Yet
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto leading-relaxed">
            DETOX hackathon records, winning teams, and project showcases will be cataloged here once published by the collective.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/projects"
              className="px-4 py-2 rounded-full bg-[#235347] hover:bg-[#163B32] text-white text-xs font-semibold transition-colors"
            >
              Browse General Projects
            </Link>
            <Link
              to="/events"
              className="px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-xs font-semibold hover:border-zinc-500 transition-colors"
            >
              View Upcoming Events
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {publishedHackathons.map((hackathon) => {
            const projects = hackathonProjects.filter(
              (p) =>
                p.published &&
                (p.hackathonId === hackathon.id || (hackathon.slug && p.hackathonId === hackathon.slug))
            );
            const winners = projects.filter((p) => p.isWinner || Boolean(p.placement));

            return (
              <Link
                key={hackathon.id}
                to={`/hackathons/${hackathon.slug || hackathon.id}`}
                className={`group flex flex-col rounded-3xl border overflow-hidden transition-all duration-500 hover:-translate-y-1.5 ${
                  isLight
                    ? 'bg-[#faf8f5] hover:bg-white border-zinc-200/90 hover:border-[#235347]/50 shadow-xs hover:shadow-xl hover:shadow-[#235347]/5'
                    : 'bg-[#121316] hover:bg-[#181a1f] border-zinc-800/80 hover:border-[#38B2A2]/40 shadow-md hover:shadow-2xl hover:shadow-black/50'
                }`}
              >
                {/* Poster / Cover Image */}
                <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-900">
                  {hackathon.coverImage ? (
                    <img
                      src={hackathon.coverImage}
                      alt={hackathon.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-radial from-zinc-800 to-zinc-950 text-zinc-500 p-6 text-center">
                      <Trophy size={40} className="mb-2 opacity-30 text-[#38B2A2]" />
                      <span className="font-mono text-xs tracking-wider uppercase opacity-60">
                        DETOX Engineering Sprint
                      </span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                      <Calendar size={11} className="text-[#38B2A2]" />
                      <span>{hackathon.date}</span>
                    </span>

                    {winners.length > 0 && (
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-400 text-zinc-950 flex items-center gap-1 shadow-sm">
                        <Sparkles size={11} />
                        <span>{winners.length} {winners.length === 1 ? 'Winner' : 'Winners'}</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Strip on Image */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/90">
                    {hackathon.location && (
                      <span className="text-[11px] font-mono flex items-center gap-1 opacity-90 drop-shadow-xs">
                        <MapPin size={11} className="text-[#38B2A2]" />
                        <span className="truncate">{hackathon.location}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold font-sans tracking-tight group-hover:text-[#235347] dark:group-hover:text-[#38B2A2] transition-colors line-clamp-2 ${
                      isLight ? 'text-zinc-950' : 'text-zinc-50'
                    }`}>
                      {hackathon.title}
                    </h3>

                    {hackathon.tagline && (
                      <p className={`text-xs font-medium mt-1.5 line-clamp-1 ${
                        isLight ? 'text-zinc-700' : 'text-zinc-300'
                      }`}>
                        {hackathon.tagline}
                      </p>
                    )}

                    <p className={`text-xs leading-relaxed mt-2.5 line-clamp-3 font-sans ${
                      isLight ? 'text-zinc-600' : 'text-zinc-400'
                    }`}>
                      {hackathon.description}
                    </p>
                  </div>

                  {/* Card Footer Interaction */}
                  <div className="pt-4 border-t border-inherit flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
                      <FolderGit2 size={13} className="text-[#235347] dark:text-[#38B2A2]" />
                      <span>{projects.length} {projects.length === 1 ? 'Project' : 'Projects'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-semibold text-[#235347] dark:text-[#38B2A2] group-hover:translate-x-0.5 transition-transform">
                      <span>Explore Results</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};
