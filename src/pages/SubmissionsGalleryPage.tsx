import React, { useState, useMemo } from 'react';
import { useRouter, Link } from '../router';
import { useCms } from '../cms/CmsContext';
import { useTheme } from '../ThemeContext';
import { PageContainer, Tag, type TagVariant } from '../design-system/primitives';
import {
  ArrowLeft,
  Search,
  X,
  Trophy,
  Users,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface SubmissionsGalleryPageProps {
  eventId: string;
}

export const SubmissionsGalleryPage: React.FC<SubmissionsGalleryPageProps> = ({ eventId }) => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { navigate, searchParams } = useRouter();
  const { events, submissions, isLoadingData } = useCms();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  
  // Tab state: 'ALL' vs 'WINNERS' vs 'OVERVIEW'
  const initialTab = searchParams.get('tab') === 'results' ? 'WINNERS' : 'ALL';
  const [activeTab, setActiveTab] = useState<'ALL' | 'WINNERS'>(initialTab);

  // Find corresponding event
  const event = useMemo(() => {
    return (
      events.find(
        (e) =>
          e.id.toLowerCase() === eventId.toLowerCase() ||
          e.code.toLowerCase() === eventId.toLowerCase() ||
          e.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').includes(eventId.toLowerCase())
      ) || {
        id: eventId,
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
  }, [events, eventId]);

  // Filter submissions for this event (only published submissions for public visitors)
  const eventSubmissions = useMemo(() => {
    return submissions.filter(
      (s) =>
        s.published &&
        (s.eventId.toLowerCase() === eventId.toLowerCase() ||
          s.eventId.toLowerCase() === event.id.toLowerCase() ||
          eventId === 'game-building-hackathon-2026' ||
          s.eventId === 'game-building-hackathon-2026')
    );
  }, [submissions, eventId, event.id]);

  // Extract unique categories for category pills
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    eventSubmissions.forEach((s) => {
      if (s.category && s.category.trim()) {
        cats.add(s.category.trim());
      }
    });
    return ['ALL', ...Array.from(cats)];
  }, [eventSubmissions]);

  // Filtered submissions based on search, tab, and category
  const filteredSubmissions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return eventSubmissions.filter((sub) => {
      // 1. Tab filter (Winners only vs All)
      if (activeTab === 'WINNERS' && !sub.resultBadge) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'ALL' && sub.category !== selectedCategory) {
        return false;
      }

      // 3. Search query filter: title, teamName, participantNames, category, techStack
      if (query) {
        const titleMatch = sub.title.toLowerCase().includes(query);
        const teamMatch = sub.teamName ? sub.teamName.toLowerCase().includes(query) : false;
        const participantMatch = sub.participantNames.some((name) =>
          name.toLowerCase().includes(query)
        );
        const categoryMatch = sub.category ? sub.category.toLowerCase().includes(query) : false;
        const techMatch = sub.techStack ? sub.techStack.some((t) => t.toLowerCase().includes(query)) : false;

        return titleMatch || teamMatch || participantMatch || categoryMatch || techMatch;
      }

      return true;
    });
  }, [eventSubmissions, activeTab, selectedCategory, searchQuery]);

  const winnerCount = useMemo(() => {
    return eventSubmissions.filter((s) => Boolean(s.resultBadge)).length;
  }, [eventSubmissions]);

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

  return (
    <PageContainer maxWidth="6xl">
      {/* 1. Contextual Return Bar */}
      <div className="mb-6">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-[#235347] dark:hover:text-[#99CDD8] transition-colors py-1.5"
        >
          <ArrowLeft size={14} />
          <span>Back to All Events & Sprints</span>
        </Link>
      </div>

      {/* 2. Hackathon Context Header */}
      <div className={`border-b pb-8 mb-8 transition-colors duration-500 ${isLight ? 'border-zinc-300' : 'border-zinc-800'}`}>
        {/* Event Meta Strip */}
        <div className="flex flex-wrap items-center justify-between text-xs mb-3 gap-2">
          <div className="flex items-center gap-2.5">
            <span
              className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: isLight ? '#CFD6C4' : '#163B32',
                color: isLight ? '#0B2B26' : '#99CDD8',
              }}
            >
              {event.category || 'HACKATHON'}
            </span>
            <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[11px]">
              <Calendar size={12} className="text-[#235347] dark:text-[#38B2A2]" />
              <span>{event.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span className="w-2 h-2 rounded-full bg-[#235347] animate-pulse" />
            <span>ARCHIVE RECORD • {event.code || 'DTX-HACK'}</span>
          </div>
        </div>

        {/* Main Event Title */}
        <h1
          className={`text-3xl sm:text-5xl font-bold tracking-tight font-display leading-[1.08] mb-3 transition-colors ${
            isLight ? 'text-zinc-950' : 'text-zinc-50'
          }`}
        >
          {event.title.toUpperCase()}
        </h1>

        <p
          className={`font-sans text-sm sm:text-base max-w-3xl leading-relaxed mb-6 ${
            isLight ? 'text-zinc-700' : 'text-zinc-400'
          }`}
        >
          {event.description}
        </p>

        {/* Contextual Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Link
            to="/events"
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
              isLight
                ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border-zinc-300'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
          >
            Overview
          </Link>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'ALL'
                ? 'bg-[#235347] text-white shadow-xs'
                : isLight
                ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Layers size={13} />
            <span>All Submissions ({eventSubmissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('WINNERS')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'WINNERS'
                ? 'bg-[#235347] text-white shadow-xs'
                : isLight
                ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            <Trophy size={13} className={activeTab === 'WINNERS' ? 'text-amber-300' : 'text-amber-500'} />
            <span>Award Winners ({winnerCount})</span>
          </button>
        </div>
      </div>

      {/* 3. Section Controls & Search Toolbar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-zinc-950 dark:text-zinc-100">
                {activeTab === 'WINNERS' ? 'AWARD-WINNING ENTRIES' : 'ALL SUBMISSIONS'}
              </h2>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#235347]/15 text-[#235347] dark:text-[#99CDD8] font-bold">
                {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'project' : 'projects'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Public exhibition of student games, custom physics runtimes, and engineering projects.
            </p>
          </div>

          {/* Client-Side Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects, builders, tech..."
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-xs font-sans border transition-all outline-hidden ${
                isLight
                  ? 'bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-[#235347] focus:ring-1 focus:ring-[#235347]'
                  : 'bg-[#121316] border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-[#38B2A2] focus:ring-1 focus:ring-[#38B2A2]'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Category Genre Filter Pills */}
        {availableCategories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 font-mono text-xs">
            <span className="text-zinc-500 mr-1 flex items-center gap-1 text-[10px] shrink-0">
              <Filter size={11} />
              <span>GENRE:</span>
            </span>
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#235347] text-white shadow-xs'
                      : isLight
                      ? 'bg-zinc-200/70 text-zinc-700 hover:bg-zinc-300/80'
                      : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Submissions Responsive Showcase Gallery */}
      {isLoadingData ? (
        <div className="py-24 text-center space-y-4">
          <div className="inline-block w-8 h-8 border-2 border-[#235347] dark:border-[#38B2A2] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-sans">
            Loading hackathon submissions gallery...
          </p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        /* Empty / No Match State */
        <div
          className={`p-12 text-center rounded-2xl border ${
            isLight ? 'bg-white border-zinc-200 text-zinc-600' : 'bg-[#121316] border-zinc-800 text-zinc-400'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#235347]/10 flex items-center justify-center mx-auto mb-3 text-[#235347] dark:text-[#38B2A2]">
            <Layers size={24} />
          </div>
          <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {searchQuery || selectedCategory !== 'ALL' || activeTab === 'WINNERS'
              ? 'No matching submissions found'
              : 'No submissions yet.'}
          </h3>
          <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
            {searchQuery || selectedCategory !== 'ALL' || activeTab === 'WINNERS'
              ? 'Try adjusting your search query, genre filter, or viewing all submissions.'
              : 'The build window is currently open or submissions are awaiting publication by event organizers.'}
          </p>
          {(searchQuery || selectedCategory !== 'ALL' || activeTab === 'WINNERS') && (
            <div className="pt-4">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setActiveTab('ALL');
                }}
                className="px-4 py-2 rounded-full bg-[#235347] dark:bg-[#38B2A2] text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Curated Project Showcase Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredSubmissions.map((sub) => {
            const categoryTagVariant = getCategoryTagVariant(sub.category);
            const detailUrl = `/events/${encodeURIComponent(event.id)}/submissions/${encodeURIComponent(sub.id)}`;

            return (
              <div
                key={sub.id}
                onClick={() => navigate(detailUrl)}
                className={`group cursor-pointer rounded-2xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isLight
                    ? 'bg-white border-zinc-200/90 shadow-sm hover:border-zinc-400'
                    : 'bg-[#121316] border-zinc-800/90 shadow-lg hover:border-zinc-700'
                }`}
              >
                {/* Top: Cover Image with Result / Category Badges */}
                <div className="relative w-full aspect-16/10 overflow-hidden bg-zinc-900/10">
                  {sub.coverImage ? (
                    <img
                      src={sub.coverImage}
                      alt={sub.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    /* Fallback Composition */
                    <div
                      className={`w-full h-full flex flex-col justify-between p-5 ${
                        isLight
                          ? 'bg-gradient-to-br from-[#CFD6C4]/30 via-[#faf8f5] to-[#FDE8D3]/40 text-zinc-800'
                          : 'bg-gradient-to-br from-[#163B32]/40 via-[#101114] to-[#0B2B26]/60 text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#235347]" />
                        <span className="text-[10px] font-mono uppercase text-zinc-500">
                          {sub.category || 'PROJECT'}
                        </span>
                      </div>
                      <div className="font-display font-bold text-lg leading-snug">
                        {sub.title}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-500">
                        {sub.teamName || (sub.participantNames.length > 0 ? sub.participantNames[0] : 'DETOX Build')}
                      </div>
                    </div>
                  )}

                  {/* Overlay Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 pointer-events-none">
                    {sub.category ? (
                      <Tag
                        label={sub.category}
                        variant={categoryTagVariant}
                        className="shadow-sm backdrop-blur-xs font-semibold"
                      />
                    ) : (
                      <span />
                    )}

                    {sub.resultBadge && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-amber-400 text-zinc-950 shadow-md">
                        <Trophy size={11} className="shrink-0" />
                        <span className="truncate max-w-[150px]">{sub.resultBadge}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Project Title */}
                    <h3
                      className={`text-lg font-bold font-sans tracking-tight leading-snug group-hover:text-[#235347] dark:group-hover:text-[#38B2A2] transition-colors ${
                        isLight ? 'text-zinc-950' : 'text-zinc-100'
                      }`}
                    >
                      {sub.title}
                    </h3>

                    {/* Team or Participant Line */}
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                      <Users size={12} className="text-[#235347] dark:text-[#38B2A2] shrink-0" />
                      <span className="truncate">
                        {sub.teamName ? (
                          <>
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {sub.teamName}
                            </span>
                            {sub.participantNames.length > 0 && (
                              <span className="text-zinc-400 dark:text-zinc-500 text-[11px] ml-1">
                                ({sub.participantNames.join(', ')})
                              </span>
                            )}
                          </>
                        ) : sub.participantNames.length > 0 ? (
                          sub.participantNames.join(', ')
                        ) : (
                          'Independent Builder'
                        )}
                      </span>
                    </div>

                    {/* Short Description */}
                    <p
                      className={`text-xs leading-relaxed line-clamp-3 ${
                        isLight ? 'text-zinc-600' : 'text-zinc-400'
                      }`}
                    >
                      {sub.description}
                    </p>
                  </div>

                  {/* Tech Stack Pills (if available) */}
                  {sub.techStack && sub.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {sub.techStack.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] border ${
                            isLight
                              ? 'bg-zinc-100 border-zinc-200 text-zinc-700'
                              : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                      {sub.techStack.length > 4 && (
                        <span className="text-[10px] font-mono text-zinc-400 self-center">
                          +{sub.techStack.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Card Bottom: View Submission CTA */}
                  <div
                    className={`pt-3 border-t flex items-center justify-between text-xs font-semibold ${
                      isLight ? 'border-zinc-100 text-[#235347]' : 'border-zinc-800/80 text-[#99CDD8]'
                    }`}
                  >
                    <span className="group-hover:underline">View Submission</span>
                    <ArrowUpRight
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};
