import React, { useState, useMemo } from 'react';
import { useCms } from '../cms/CmsContext';
import { useTheme } from '../ThemeContext';
import { PageContainer } from '../design-system/primitives';
import { Link } from '../router';
import {
  Trophy,
  ArrowLeft,
  Users,
  Maximize2,
  X,
  Play,
} from 'lucide-react';

const GitHubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GitHub">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

interface HackathonProjectDetailPageProps {
  hackathonSlug: string;
  projectSlug: string;
}

export const HackathonProjectDetailPage: React.FC<HackathonProjectDetailPageProps> = ({
  hackathonSlug,
  projectSlug,
}) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { hackathons, hackathonProjects, isLoadingData } = useCms();

  const [activeScreenshot, setActiveScreenshot] = useState<string | null>(null);

  // Find hackathon
  const hackathon = useMemo(() => {
    return hackathons.find(
      (h) =>
        h.slug.toLowerCase() === hackathonSlug.toLowerCase() ||
        h.id.toLowerCase() === hackathonSlug.toLowerCase()
    );
  }, [hackathons, hackathonSlug]);

  // Find project
  const project = useMemo(() => {
    return hackathonProjects.find(
      (p) =>
        (p.slug.toLowerCase() === projectSlug.toLowerCase() ||
          p.id.toLowerCase() === projectSlug.toLowerCase()) &&
        (!hackathon ||
          p.hackathonId === hackathon.id ||
          (hackathon.slug && p.hackathonId === hackathon.slug))
    );
  }, [hackathonProjects, hackathon, projectSlug]);

  if (!project && !isLoadingData) {
    return (
      <PageContainer maxWidth="5xl">
        <div className="py-20 text-center space-y-4">
          <h2 className="text-xl font-bold font-sans">Project Showcase Not Found</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            The requested hackathon project could not be found or has not been published yet.
          </p>
          <div className="pt-2">
            <Link
              to={hackathon ? `/hackathons/${hackathon.slug || hackathon.id}/projects` : '/hackathons'}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#235347] text-white rounded-full text-xs font-semibold"
            >
              <ArrowLeft size={13} />
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer maxWidth="5xl">
        <div className="py-24 text-center text-xs font-mono text-zinc-500">
          Loading project showcase...
        </div>
      </PageContainer>
    );
  }



  return (
    <PageContainer maxWidth="5xl">
      {/* Breadcrumb strip */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link to="/hackathons" className="hover:text-[#235347] dark:hover:text-[#38B2A2] transition-colors">
          Hackathons
        </Link>
        <span>/</span>
        {hackathon && (
          <>
            <Link
              to={`/hackathons/${hackathon.slug || hackathon.id}`}
              className="hover:text-[#235347] dark:hover:text-[#38B2A2] transition-colors truncate max-w-xs"
            >
              {hackathon.title}
            </Link>
            <span>/</span>
            <Link
              to={`/hackathons/${hackathon.slug || hackathon.id}/projects`}
              className="hover:text-[#235347] dark:hover:text-[#38B2A2] transition-colors"
            >
              Projects
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-800 dark:text-zinc-200 font-bold truncate max-w-xs">
          {project.title}
        </span>
      </div>

      {/* Main Project Dossier */}
      <div
        className={`rounded-3xl border overflow-hidden p-6 sm:p-10 mb-12 ${
          isLight
            ? 'bg-[#faf8f5] border-zinc-200/90 shadow-sm'
            : 'bg-[#121316] border-zinc-800 shadow-xl'
        }`}
      >
        {/* Header Block */}
        <div className="space-y-4 mb-8 border-b pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {project.placement && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-zinc-950 shadow-sm">
                  <Trophy size={13} />
                  <span>{project.placement}</span>
                </span>
              )}
              {project.isWinner && !project.placement && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-400 text-zinc-950 shadow-sm">
                  <Trophy size={13} />
                  <span>Hackathon Winner</span>
                </span>
              )}
              {hackathon && (
                <span className="text-xs font-mono text-zinc-500">
                  Built during {hackathon.title} ({hackathon.date})
                </span>
              )}
            </div>

            {/* External Links */}
            <div className="flex items-center gap-2">
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-zinc-500 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <GitHubIcon size={14} />
                  <span>Source Code</span>
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-[#235347] hover:bg-[#163B32] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Play size={12} fill="currentColor" />
                  <span>Launch Demo</span>
                </a>
              )}
            </div>
          </div>

          <h1 className={`text-2xl sm:text-4xl font-extrabold font-sans tracking-tight ${
            isLight ? 'text-zinc-950' : 'text-zinc-50'
          }`}>
            {project.title}
          </h1>

          {/* Team / Author Details */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 pt-1">
            {project.teamName && (
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                Team: {project.teamName}
              </span>
            )}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <span className="flex items-center gap-1">
                <Users size={12} className="text-[#235347] dark:text-[#38B2A2]" />
                <span>Builders: {project.teamMembers.join(', ')}</span>
              </span>
            )}
          </div>
        </div>

        {/* Featured Visual Presentation */}
        {project.coverImage && (
          <div className="rounded-2xl overflow-hidden border border-inherit shadow-md aspect-16/9 bg-zinc-900 mb-8 relative group">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setActiveScreenshot(project.coverImage || null)}
              className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity"
              title="View full resolution"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        )}

        {/* Tech Stack Chips */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="mb-8">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-2">
              TECHNOLOGIES & ARCHITECTURE:
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, i) => (
                <span
                  key={i}
                  className={`text-xs font-mono px-3 py-1 rounded-md border ${
                    isLight
                      ? 'bg-zinc-100 border-zinc-200 text-zinc-800'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Full Project Description / Narrative */}
        <div className="space-y-4 mb-10">
          <h3 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
            ENGINEERING SPECIFICATION & RETROSPECTIVE:
          </h3>
          <div className={`text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans ${
            isLight ? 'text-zinc-800' : 'text-zinc-200'
          }`}>
            {project.description}
          </div>
        </div>

        {/* Screenshots / Artifact Gallery */}
        {project.screenshots && project.screenshots.length > 0 && (
          <div className="pt-6 border-t border-inherit">
            <h3 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-4">
              VISUAL ARTIFACTS & SCREENSHOTS ({project.screenshots.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.screenshots.map((shot, i) => (
                <div
                  key={i}
                  onClick={() => setActiveScreenshot(shot)}
                  className="rounded-xl overflow-hidden border border-inherit aspect-16/10 bg-zinc-900 relative group cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
                >
                  <img
                    src={shot}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6 mb-20">
        {hackathon && (
          <Link
            to={`/hackathons/${hackathon.slug || hackathon.id}/projects`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-[#235347] dark:hover:text-[#38B2A2] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back to All {hackathon.title} Projects</span>
          </Link>
        )}

        <Link
          to="/hackathons"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-[#235347] dark:hover:text-[#38B2A2] transition-colors"
        >
          <span>All Hackathons Archive</span>
        </Link>
      </div>

      {/* Lightbox Modal for High-Resolution Screenshot Inspection */}
      {activeScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setActiveScreenshot(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setActiveScreenshot(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-zinc-300 transition-colors"
              title="Close inspection"
            >
              <X size={24} />
            </button>
            <img
              src={activeScreenshot}
              alt="High resolution inspect"
              className="max-h-[85vh] w-auto object-contain rounded-xl border border-zinc-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
};
