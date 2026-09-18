import React from 'react';
import { useRouter, Link } from '../router';
import { useCms } from '../cms/CmsContext';
import { resolvePersonCutout } from '../cms/imageUtils';
import { useTheme } from '../ThemeContext';
import { PageContainer, Tag, type TagVariant } from '../design-system/primitives';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Mail, 
  Terminal, 
  Cpu, 
  Compass, 
  Shield, 
  Wrench, 
  Users, 
  Calendar, 
  Layers,
  Sparkles,
  CameraOff
} from 'lucide-react';

const GitHubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GitHub">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const getRoleIcon = (roleArea: string) => {
  switch (roleArea) {
    case 'Technical':
      return Terminal;
    case 'Projects':
      return Cpu;
    case 'Research':
      return Compass;
    case 'Operations':
      return Shield;
    case 'Open Source':
      return Wrench;
    case 'Community':
    default:
      return Users;
  }
};

export const PersonProfilePage: React.FC = () => {
  const { path } = useRouter();
  const { people, projects, events } = useCms();
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // Extract slug from URL: e.g. "/people/dev-p" -> "dev-p"
  const slugOrId = path.replace(/^\/people\//, '').trim();

  const person = people.find(
    (p) => (p.slug && p.slug.toLowerCase() === slugOrId.toLowerCase()) || p.id === slugOrId
  );

  // If person not found, render clean return state
  if (!person) {
    return (
      <PageContainer maxWidth="6xl">
        <div className="py-20 text-center space-y-4">
          <h2 className="font-display text-3xl font-bold">Builder profile not found</h2>
          <p className="text-zinc-500 text-sm">
            The profile you are looking for may have moved or been updated.
          </p>
          <div className="pt-4">
            <Link
              to="/minds"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#235347] text-white text-xs font-semibold hover:bg-[#163B32] transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Return to Minds Behind DETOX</span>
            </Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const accent = person.paletteAccent || '#235347';

  // Resolve linked projects
  const linkedProjects = projects.filter((prj) => {
    if (person.contributedProjectIds && person.contributedProjectIds.includes(prj.id)) {
      return true;
    }
    // Also match by contributor name
    return prj.contributors.some(
      (c) => c.toLowerCase().includes(person.name.toLowerCase()) || person.name.toLowerCase().includes(c.toLowerCase())
    );
  });

  // Resolve linked events
  const linkedEvents = events.filter((evt) => {
    if (person.participatedEventIds && person.participatedEventIds.includes(evt.id)) {
      return true;
    }
    return false;
  });

  return (
    <PageContainer maxWidth="6xl">
      {/* Return Bar */}
      <div className="mb-10">
        <Link
          to="/minds"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors py-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to Minds Behind DETOX collage</span>
        </Link>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left Column: Portrait & Direct Contact */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`relative w-full aspect-[4/5] rounded-3xl overflow-hidden border shadow-xl flex items-end justify-center transition-all duration-500 ${
              isLight
                ? 'bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EA] to-[#ECE7DE] border-zinc-200'
                : 'bg-gradient-to-b from-[#0e1014] via-[#121419] to-[#0a0c0e] border-zinc-800'
            }`}
            style={{
              borderColor: `${accent}80`,
              boxShadow: `0 24px 48px -18px ${accent}30`,
            }}
          >
            {/* Subtle Grid backdrop */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${isLight ? '#23534720' : '#38B2A225'} 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />

            {(() => {
              const profileCutoutSrc = resolvePersonCutout(person);
              return profileCutoutSrc ? (
                <img
                  src={profileCutoutSrc}
                  alt={person.name}
                  onError={(e) => {
                    console.warn(`Profile image failed to load for ${person.name}: "${profileCutoutSrc}"`);
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                  className="relative z-10 max-h-[92%] w-auto object-contain transition-transform duration-500"
                  style={{
                    filter: `drop-shadow(0 20px 28px rgba(0,0,0,0.24)) drop-shadow(0 0 16px ${accent}30)`,
                  }}
                />
              ) : (
                <div
                  className={`w-full h-full flex flex-col items-center justify-center p-8 text-center ${
                    isLight
                      ? 'bg-gradient-to-br from-[#CFD6C4]/30 via-[#faf8f5] to-[#FDE8D3]/40 text-zinc-700'
                      : 'bg-gradient-to-br from-[#163B32]/30 via-[#121316] to-[#0B2B26]/50 text-zinc-300'
                  }`}
                >
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center font-display font-bold text-4xl mb-4 border shadow-inner"
                    style={{
                      borderColor: accent,
                      backgroundColor: `${accent}25`,
                      color: accent,
                    }}
                  >
                    {person.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-sans uppercase tracking-wider">
                    <CameraOff size={14} />
                    <span>Awaiting Lab Portrait</span>
                  </div>
                </div>
              );
            })()}

            {/* Subtle Gradient & Corner Tag */}
            <div className="absolute top-4 left-4">
              <Tag
                label={person.roleArea}
                variant={(person.tagVariant as TagVariant) || 'sage'}
                className="shadow-sm backdrop-blur-xs"
              />
            </div>

            <div
              className="absolute top-4 right-4 w-3.5 h-3.5 rounded-full border border-white/60 dark:border-black/60 shadow-xs"
              style={{ backgroundColor: accent }}
            />

            {person.photoCaption && (
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white text-[11px] leading-relaxed">
                {person.photoCaption}
              </div>
            )}
          </div>

          {/* Direct Communication Channels */}
          <div
            className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white/80 border-zinc-200' : 'bg-[#121316] border-zinc-800'
            }`}
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Direct Contact & Channels
            </div>

            <div className="flex flex-col space-y-2.5 text-xs font-mono">
              <a
                href={`mailto:${person.email}`}
                className="inline-flex items-center justify-between p-2.5 rounded-xl border border-inherit hover:border-[#235347] transition-colors group"
              >
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <Mail size={14} className="text-[#235347]" />
                  <span>{person.email}</span>
                </div>
                <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-[#235347]" />
              </a>

              {person.githubUrl && (
                <a
                  href={person.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between p-2.5 rounded-xl border border-inherit hover:border-[#235347] transition-colors group"
                >
                  <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                    <GitHubIcon size={14} />
                    <span>GitHub Profile / Repos</span>
                  </div>
                  <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-[#235347]" />
                </a>
              )}

              {person.socialLinks?.website && (
                <a
                  href={person.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between p-2.5 rounded-xl border border-inherit hover:border-[#235347] transition-colors group"
                >
                  <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                    <Sparkles size={14} style={{ color: accent }} />
                    <span className="truncate max-w-[200px]">{person.socialLinks.website}</span>
                  </div>
                  <ArrowUpRight size={13} className="text-zinc-400 group-hover:text-[#235347]" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Editorial Profile Content */}
        <div className="lg:col-span-7 space-y-10">
          {/* Header */}
          <div className="space-y-3 border-b border-zinc-200 dark:border-zinc-800 pb-8">
            <div className="flex flex-wrap items-center gap-2.5">
              {person.focusTag && (
                <span className="text-xs font-semibold uppercase tracking-wider text-[#235347] dark:text-[#99CDD8]">
                  {person.focusTag}
                </span>
              )}
              {person.focusTag && person.roleArea && <span className="text-zinc-400">·</span>}
              {person.roleArea && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                  {React.createElement(getRoleIcon(person.roleArea), { size: 13 })}
                  <span>{person.roleArea}</span>
                </div>
              )}
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              {person.name}
            </h1>

            {person.oneSentence && (
              <p className="text-base sm:text-lg font-sans text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
                {person.oneSentence}
              </p>
            )}
          </div>

          {/* Area of Contribution */}
          {person.areaOfContribution && (
            <div
              className={`p-6 rounded-2xl border transition-colors ${
                isLight
                  ? 'bg-gradient-to-br from-[#CFD6C4]/20 to-[#FDE8D3]/20 border-zinc-200'
                  : 'bg-gradient-to-br from-[#163B32]/25 to-[#0B2B26]/35 border-zinc-800'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-[#235347] dark:text-[#99CDD8] mb-1.5">
                Primary Craft & Contribution
              </div>
              <div className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {person.areaOfContribution}
              </div>
            </div>
          )}

          {/* Full Biography */}
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Student Story & Philosophy
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 font-sans whitespace-pre-line">
              {person.biography || person.oneSentence}
            </p>
          </div>

          {/* Contributed Projects */}
          {linkedProjects.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  <Layers size={14} className="text-[#235347]" />
                  <span>Projects Contributed To</span>
                </div>
                <Link to="/projects" className="text-xs text-[#235347] hover:underline">
                  All projects →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {linkedProjects.map((prj) => (
                  <div
                    key={prj.id}
                    className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-md ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-[#121316] border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <Tag label={prj.category} variant="green" />
                      {prj.metrics && (
                        <span className="font-mono text-[10px] text-[#235347] font-semibold">
                          {prj.metrics.value}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-base text-zinc-950 dark:text-zinc-50 mb-1.5">
                      {prj.title}
                    </h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3 leading-relaxed">
                      {prj.description}
                    </p>
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 font-mono">{prj.id}</span>
                      {prj.gitUrl && (
                        <a
                          href={prj.gitUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#235347] hover:underline"
                        >
                          <span>Repository</span>
                          <ArrowUpRight size={11} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Participated Events / Workshops */}
          {linkedEvents.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                <Calendar size={14} className="text-[#235347]" />
                <span>Workshops & Sprints Led / Attended</span>
              </div>

              <div className="space-y-3">
                {linkedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isLight ? 'bg-white border-zinc-200' : 'bg-[#121316] border-zinc-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-1">
                        <Tag label={evt.category} variant="peach" />
                        <span>{evt.date}</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-zinc-950 dark:text-zinc-100">
                        {evt.title}
                      </h4>
                    </div>

                    <Link
                      to="/events"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#235347] hover:underline shrink-0"
                    >
                      <span>Event details</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};
