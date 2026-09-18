import React, { useState } from 'react';
import { PageContainer, SectionHeader } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { Link } from '../router';
import { useCms } from '../cms/CmsContext';
import { PeopleCutoutCollage } from '../components/people/PeopleCutoutCollage';

export const MindsBehindDetoxPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { people, collageSettings } = useCms();
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('ALL');

  // Filter published and visible people and sort by order
  const publishedPeople = people
    .filter((p) => p.status === 'PUBLISHED' && p.isVisibleInCollage !== false)
    .sort((a, b) => (a.order || 99) - (b.order || 99));

  const filteredPeople =
    selectedDiscipline === 'ALL'
      ? publishedPeople
      : publishedPeople.filter(
          (p) =>
            p.roleArea &&
            (p.roleArea.toUpperCase() === selectedDiscipline.toUpperCase() ||
              p.roleArea.toUpperCase().includes(selectedDiscipline.toUpperCase()))
        );

  const disciplineFilterOptions = [
    { label: 'All Minds', value: 'ALL', color: '#235347' },
    { label: 'Technical & Systems', value: 'Technical', color: '#38B2A2' },
    { label: 'Hardware & Silicon', value: 'Projects', color: '#F3C3B2' },
    { label: 'Applied Research', value: 'Research', color: '#C8B6FE' },
    { label: 'Network Operations', value: 'Operations', color: '#99CDD8' },
    { label: 'Open Source', value: 'Open Source', color: '#ECA6B7' },
    { label: 'Community & Lab', value: 'Community', color: '#E8BBCF' },
  ];

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header - Configurable from Super Admin CMS */}
      <SectionHeader
        categoryTag={collageSettings?.categoryTag || 'Active Student Collective'}
        title={collageSettings?.title || 'Minds Behind DETOX.'}
        lead={
          collageSettings?.leadText ||
          'No executives, directors, or marketing figureheads. DETOX is conceived, engineered, and maintained entirely by undergraduate students who spend their evenings designing microkernels, routing PCBs, and running 36-hour weekend marathons.'
        }
        statusText={collageSettings?.statusText || `Cohort 2026 • ${publishedPeople.length} Active Builders`}
      />

      {/* Role Filter Pills & Interaction Cue */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            <Compass size={14} className="text-[#235347] dark:text-[#38B2A2]" />
            <span>Interactive Collective Collage</span>
            <span className="text-zinc-500 font-normal">· Hover to focus, click for individual story</span>
          </div>
          <div className="text-xs text-zinc-500 hidden sm:block">
            Showing {filteredPeople.length} of {publishedPeople.length} builders
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {disciplineFilterOptions.map((opt) => {
            const isSelected = selectedDiscipline === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedDiscipline(opt.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : isLight
                    ? 'bg-white border border-zinc-300/80 text-zinc-700 hover:border-zinc-400'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
                style={{
                  backgroundColor: isSelected ? opt.color : undefined,
                  borderColor: isSelected ? opt.color : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: isSelected ? '#ffffff' : opt.color,
                  }}
                />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Signature Interactive Cut-Out Collective Stage */}
      <div className="mb-24">
        <PeopleCutoutCollage people={filteredPeople} />
      </div>

      {/* Direct Invitation Strip */}
      <div
        className={`p-8 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors duration-500 ${
          isLight
            ? 'bg-gradient-to-br from-[#faf8f5] via-white to-[#FDE8D3]/30 border-zinc-300 text-zinc-900 shadow-sm'
            : 'bg-gradient-to-br from-[#14161a] via-[#0f1013] to-[#163B32]/30 border-zinc-800 text-zinc-200'
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-[#235347] dark:text-[#99CDD8] font-semibold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>No Résumés · No Corporate Interviews</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold font-sans">
            Want to build with the minds behind DETOX?
          </h4>
          <p className={`font-sans text-xs sm:text-sm max-w-xl ${isLight ? 'text-zinc-600' : 'text-zinc-400'}`}>
            Show up to a Thursday reading salon, clone an active repository, or pull up a stool at the hardware bench. We evaluate people strictly by running code, working hardware, and honest peer mentorship.
          </p>
        </div>

        <Link
          to="/collaborate"
          className="px-5 py-2.5 bg-[#163B32] hover:bg-[#235347] dark:bg-[#38B2A2] dark:hover:bg-[#4ecdc4] text-white dark:text-zinc-950 font-sans text-xs font-semibold rounded-full tracking-wider transition-colors shrink-0 flex items-center gap-2 shadow-xs"
        >
          <span>BUILD WITH US</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </PageContainer>
  );
};
