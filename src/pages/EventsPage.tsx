import React from 'react';
import { PageContainer, SectionHeader, DossierCard, PhotoFrame, Tag, type TagVariant } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { Calendar, Clock, MapPin, ArrowUpRight, CheckCircle2, FileText, Camera } from 'lucide-react';
import { useRouter } from '../router';
import { useCms } from '../cms/CmsContext';

export const EventsPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { searchParams, navigate } = useRouter();
  const { events } = useCms();

  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED');

  const activeTab = searchParams.get('tab') === 'archive' ? 'archive' : 'upcoming';

  const displayedEvents = publishedEvents.filter((e) =>
    activeTab === 'upcoming' ? e.isUpcoming : !e.isUpcoming
  );

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header */}
      <SectionHeader
        categoryTag="Events & Sprints"
        title="Workshops, Paper Salons & Unhinged Builds."
        lead="A living photographic and chronological record of hardware bring-ups, paper deconstruction salons, security audits, and 36-hour weekend lab marathons held at DETOX."
        statusText="Active Schedule"
      />

      {/* Tabs: Upcoming vs Archive */}
      <div className="flex items-center justify-between border-b pb-4 mb-10">
        <div className="flex items-center gap-2 text-xs font-semibold">
          <button
            onClick={() => navigate('/events', { tab: 'upcoming' })}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              activeTab === 'upcoming'
                ? 'bg-[#235347] text-white shadow-xs'
                : isLight
                ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Upcoming Schedule ({publishedEvents.filter((e) => e.isUpcoming).length})
          </button>
          <button
            onClick={() => navigate('/events', { tab: 'archive' })}
            className={`px-4 py-2 rounded-full transition-all duration-200 ${
              activeTab === 'archive'
                ? 'bg-[#235347] text-white shadow-xs'
                : isLight
                ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Archive & Past Sprints ({publishedEvents.filter((e) => !e.isUpcoming).length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
          <Camera size={13} className="text-[#235347]" />
          <span>Photo-Verified Records</span>
        </div>
      </div>

      {/* Events List with Photographic Records */}
      <div className="space-y-8 mb-20">
        {displayedEvents.length === 0 ? (
          <div
            className={`p-12 text-center rounded-2xl border ${
              isLight ? 'bg-white border-zinc-200 text-zinc-600' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <div className="text-base font-bold">No events scheduled in this timeline</div>
            <div className="text-xs text-zinc-500 mt-1">
              Check back soon or create new events via the Admin Control Room.
            </div>
          </div>
        ) : (
          displayedEvents.map((evt) => {
            const evtTagVariant: TagVariant =
              evt.category === 'WORKSHOP'
                ? 'cream'
                : evt.category === 'WEEKEND BUILD'
                ? 'cottonPink'
                : evt.category === 'PAPER SALON'
                ? 'wisteria'
                : evt.category === 'SECURITY AUDIT'
                ? 'sky'
                : 'lavender';

            const evtAccentColor =
              evt.category === 'WORKSHOP'
                ? '#FDE8D3'
                : evt.category === 'WEEKEND BUILD'
                ? '#FFC8DD'
                : evt.category === 'PAPER SALON'
                ? '#C8B6FE'
                : evt.category === 'SECURITY AUDIT'
                ? '#A2D2FF'
                : '#E7C5FF';

            return (
              <DossierCard
                key={evt.id}
                clipLabel={evt.category}
                className="p-6 sm:p-8 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Event Visual Record */}
                  <div className="lg:col-span-4">
                    <PhotoFrame
                      src={evt.photoUrl}
                      label={evt.photoLabel}
                      badge={evt.category}
                      badgeVariant={evtTagVariant}
                      accentBorderColor={evtAccentColor}
                      caption={evt.photoCaption}
                      aspectRatio="aspect-[4/3]"
                    />
                  </div>

                  {/* Middle Column: Event Details */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Header Strip */}
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-zinc-500">
                      <Tag label={evt.category} variant={evtTagVariant} />
                      <div className="flex items-center gap-1.5 text-[#235347] dark:text-[#38B2A2] font-bold">
                        <Calendar size={13} />
                        <span>{evt.date}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} />
                        <span>{evt.time}</span>
                      </div>
                    </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                    <MapPin size={13} className="text-zinc-500" />
                    <span>{evt.location}</span>
                  </div>

                  {/* Title */}
                  <h2 className={`text-lg sm:text-xl font-bold font-sans tracking-tight ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
                    {evt.title}
                  </h2>

                  <p className={`font-sans text-xs leading-relaxed ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                    {evt.description}
                  </p>

                  {/* Deliverables Produced / Expected */}
                  {evt.deliverables && evt.deliverables.length > 0 && (
                    <div className="pt-2">
                      <div className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider mb-2 font-semibold">
                        {evt.isUpcoming ? 'TANGIBLE ARTIFACTS TO BE BUILT:' : 'VERIFIED DELIVERABLES PRODUCED:'}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {evt.deliverables.map((del, i) => (
                          <div
                            key={i}
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs font-mono text-[10px] border ${
                              isLight
                                ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-800'
                                : 'bg-[#0e0f12] border-zinc-800 text-zinc-300'
                            }`}
                          >
                            <CheckCircle2 size={11} className="text-[#235347]" />
                            <span>{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Status & Direct Action */}
                <div className="lg:col-span-3 shrink-0 flex flex-col justify-between pt-4 lg:pt-0 lg:border-l lg:pl-6 border-zinc-700/40 font-mono text-xs space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] text-zinc-500">
                      <span>RECORD STATUS:</span>
                      <span className="font-bold text-[#235347]">{evt.status}</span>
                    </div>

                    {evt.capacity && (
                      <div className="flex items-center justify-between text-[10px] text-zinc-500">
                        <span>CAPACITY:</span>
                        <span className={`font-bold ${isLight ? 'text-zinc-900' : 'text-zinc-300'}`}>{evt.capacity}</span>
                      </div>
                    )}
                  </div>

                  {evt.isUpcoming ? (
                    <a
                      href={`mailto:collective@detox.build?subject=Event%20RSVP:%20${encodeURIComponent(evt.title)}`}
                      className="w-full py-2 bg-[#163B32] hover:bg-[#235347] text-white text-center font-mono text-xs font-bold rounded-xs tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>RESERVE BENCH</span>
                      <ArrowUpRight size={13} />
                    </a>
                  ) : (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="text-[10px] text-zinc-500 uppercase font-semibold">PRESERVED ARTIFACTS:</div>
                      {evt.resources?.map((res, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[#235347] font-semibold hover:underline cursor-pointer">
                          <FileText size={12} />
                          <span>{res.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DossierCard>
          );
        })
      )}
      </div>
    </PageContainer>
  );
};
