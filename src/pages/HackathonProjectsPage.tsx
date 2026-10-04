import React, { useState, useMemo } from 'react';
import { useCms } from '../cms/CmsContext';
import { useTheme } from '../ThemeContext';
import { PageContainer } from '../design-system/primitives';
import { Link } from '../router';
import {
  Trophy,
  ArrowLeft,
  FolderGit2,
  Search,
  ArrowUpRight,
} from 'lucide-react';

interface HackathonProjectsPageProps {
  hackathonSlug: string;
}

export const HackathonProjectsPage: React.FC<HackathonProjectsPageProps> = ({ hackathonSlug }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { hackathons, hackathonProjects, isLoadingData } = useCms();

  const [searchQuery, setSearchQuery] = useState('');
  const [techFilter, setTechFilter] = useState<string>('ALL');

  // Find hackathon
  const hackathon = useMemo(() => {
    return hackathons.find(
      (h) =>
        h.slug.toLowerCase() === hackathonSlug.toLowerCase() ||
        h.id.toLowerCase() === hackathonSlug.toLowerCase()
    );
  }, [hackathons, hackathonSlug]);

  // All published projects for this hackathon
  const allProjects = useMemo(() => {
    if (!hackathon) return [];
    return hackathonProjects.filter(
      (p) =>
        p.published &&
        (p.hackathonId === hackathon.id || (hackathon.slug && p.hackathonId === hackathon.slug))
    );
  }, [hackathonProjects, hackathon]);

  // Extract unique tech tags
  const allTechs = useMemo(() => {
    const set = new Set<string>();
    allProjects.forEach((p) => {
      (p.techStack || []).forEach((t) => set.add(t));
    });
    return Array.from(set);
  }, [allProjects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchSearch =
        !searchQuery.trim() ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.teamName && p.teamName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.teamMembers && p.teamMembers.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchTech = techFilter === 'ALL' || (p.techStack && p.techStack.includes(techFilter));

      return matchSearch && matchTech;
    });
  }, [allProjects, searchQuery, techFilter]);

  if (!hackathon && !isLoadingData) {
    return (
      <PageContainer maxWidth="5xl">
        <div className="py-20 text-center space-y-4">
          <h2 className="text-xl font-bold font-sans">Hackathon Not Found</h2>
          <Link
            to="/hackathons"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#235347] text-white rounded-full text-xs font-semibold"
          >
            <ArrowLeft size={13} />
            <span>Back to Hackathons</span>
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (!hackathon) {
    return (
      <PageContainer maxWidth="5xl">
        <div className="py-24 text-center text-xs font-mono text-zinc-500">
          Loading projects...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="6xl">
      {/* Back to Hackathon Detail Link */}
      <div className="mb-6">
        <Link
          to={`/hackathons/${hackathon.slug || hackathon.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-[#235347] dark:hover:text-[#38B2A2] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to {hackathon.title} Results</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b pb-6 mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#235347] dark:text-[#38B2A2] font-bold uppercase tracking-wider mb-1">
            <FolderGit2 size={14} />
            <span>Complete Showcase</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold font-sans tracking-tight ${
            isLight ? 'text-zinc-950' : 'text-zinc-50'
          }`}>
            All Projects — {hackathon.title}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse all {allProjects.length} published submissions, builds, and engines created during this hackathon.
          </p>
        </div>

        {/* Search input */}
        {allProjects.length > 2 && (
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search projects or teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded-full text-xs border ${
                isLight
                  ? 'bg-white border-zinc-300 text-zinc-900 focus:border-[#235347]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-100 focus:border-[#38B2A2]'
              } outline-hidden transition-colors`}
            />
          </div>
        )}
      </div>

      {/* Tech Filter Chips */}
      {allTechs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-8">
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mr-1">
            Filter:
          </span>
          <button
            onClick={() => setTechFilter('ALL')}
            className={`px-3 py-1 rounded-full text-[11px] font-mono transition-colors ${
              techFilter === 'ALL'
                ? 'bg-[#235347] text-white font-bold'
                : isLight
                ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            All ({allProjects.length})
          </button>
          {allTechs.map((tech) => {
            const count = allProjects.filter((p) => p.techStack && p.techStack.includes(tech)).length;
            return (
              <button
                key={tech}
                onClick={() => setTechFilter(tech)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono transition-colors ${
                  techFilter === tech
                    ? 'bg-[#235347] text-white font-bold'
                    : isLight
                    ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {tech} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div
          className={`p-14 text-center rounded-2xl border mb-20 ${
            isLight ? 'bg-white border-zinc-200' : 'bg-zinc-900/40 border-zinc-800'
          }`}
        >
          <FolderGit2 size={36} className="mx-auto text-zinc-400 mb-2 opacity-50" />
          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
            No Projects Found
          </h3>
          <p className="text-xs text-zinc-500 mt-1">
            {allProjects.length === 0
              ? 'No projects have been cataloged for this hackathon yet.'
              : 'No projects match your current search query or filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/hackathons/${hackathon.slug || hackathon.id}/projects/${project.slug}`}
              className={`group flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${
                isLight
                  ? 'bg-white hover:border-[#235347]/60 border-zinc-200/90 shadow-xs hover:shadow-xl'
                  : 'bg-[#15171c] hover:border-[#38B2A2]/50 border-zinc-800 shadow-md hover:shadow-2xl hover:shadow-black/60'
              }`}
            >
              {/* Cover Image */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-900">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs">
                    DETOX ARTIFACT
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Placement / Award Badge if applicable */}
                {project.placement && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-zinc-950 shadow-sm">
                      <Trophy size={11} />
                      <span>{project.placement}</span>
                    </span>
                  </div>
                )}

                {/* Team Tag */}
                {project.teamName && (
                  <div className="absolute bottom-2.5 left-3 text-white text-xs font-mono font-medium truncate drop-shadow-xs">
                    {project.teamName}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className={`text-base font-bold font-sans tracking-tight group-hover:text-[#235347] dark:group-hover:text-[#38B2A2] transition-colors line-clamp-2 ${
                    isLight ? 'text-zinc-900' : 'text-zinc-100'
                  }`}>
                    {project.title}
                  </h3>

                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <p className="text-[11px] text-zinc-500 font-mono mt-1 truncate">
                      Builders: {project.teamMembers.join(', ')}
                    </p>
                  )}

                  <p className={`text-xs leading-relaxed mt-2 line-clamp-3 ${
                    isLight ? 'text-zinc-600' : 'text-zinc-400'
                  }`}>
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack & Action */}
                <div className="pt-3 border-t border-inherit flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {project.techStack && project.techStack.slice(0, 3).map((tech, i) => (
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
                    <span>Explore</span>
                    <ArrowUpRight size={13} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
