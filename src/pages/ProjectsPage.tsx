import React from 'react';
import { PageContainer, SectionHeader, DossierCard, Tag, PhotoFrame } from '../design-system/primitives';
import { useTheme } from '../ThemeContext';
import { useRouter } from '../router';
import { useCms } from '../cms/CmsContext';
import { ExternalLink, Code2, Filter, CheckCircle } from 'lucide-react';
import type { ProjectCategory } from '../cms/types';

export const ProjectsPage: React.FC = () => {
  const { mode } = useTheme();
  const isLight = mode === 'light';
  const { searchParams, navigate } = useRouter();
  const { projects } = useCms();

  const publishedProjects = projects.filter((p) => p.status === 'PUBLISHED');

  const activeCategory = (searchParams.get('category')?.toUpperCase() as 'ALL' | ProjectCategory) || 'ALL';

  const setCategory = (cat: 'ALL' | ProjectCategory) => {
    navigate('/projects', cat === 'ALL' ? {} : { category: cat.toLowerCase() });
  };

  const filteredProjects = activeCategory === 'ALL'
    ? publishedProjects
    : publishedProjects.filter((p) => p.category === activeCategory);

  const categories: Array<'ALL' | ProjectCategory> = ['ALL', 'STUDENT', 'RESEARCH', 'OSS', 'CODING'];

  return (
    <PageContainer maxWidth="6xl">
      {/* Editorial Header */}
      <SectionHeader
        docId="DTX-PRJ-2026"
        categoryTag="PUBLIC PROJECT ARCHIVE"
        title="Built Artifacts."
        lead="Running code, physical circuit boards, compiler IR, and distributed protocols. Every project here is verified through reproducible benchmarks, schematics, and open Git commits."
        statusText={`${publishedProjects.length} VERIFIED ARTIFACTS`}
      />

      {/* Category Filter Strip */}
      <div className="flex flex-wrap items-center justify-between border-b pb-4 mb-10 gap-4">
        <div className="flex items-center gap-1.5 font-mono text-xs overflow-x-auto">
          <span className="text-zinc-500 mr-2 flex items-center gap-1 text-[10px]">
            <Filter size={12} />
            <span>CATEGORY:</span>
          </span>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            const catColors: Record<string, string> = {
              ALL: '#235347',
              STUDENT: '#FFB7C3',
              RESEARCH: '#C8B6FE',
              OSS: '#ECA6B7',
              CODING: '#38B2A2',
            };
            const accentColor = catColors[cat] || '#235347';

            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1 rounded-full transition-all duration-200 text-[11px] font-semibold tracking-wider flex items-center gap-1.5 ${
                  isSelected
                    ? 'text-white shadow-xs'
                    : isLight
                    ? 'bg-[#edeae3] text-zinc-700 hover:bg-zinc-200'
                    : 'bg-[#14161a] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
                style={{
                  backgroundColor: isSelected ? accentColor : undefined,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: isSelected ? '#ffffff' : accentColor }}
                />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        <div className="font-mono text-[10px] text-zinc-500">
          SHOWING {filteredProjects.length} OF {publishedProjects.length} ARTIFACTS
        </div>
      </div>

      {/* Asymmetric Exhibition Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {filteredProjects.map((proj, idx) => {
          // Asymmetric layout logic: alternate emphasis
          const isFeatured = idx % 3 === 0;

          const tagVariant =
            proj.category === 'STUDENT'
              ? 'coral'
              : proj.category === 'RESEARCH'
              ? 'wisteria'
              : proj.category === 'OSS'
              ? 'dustyRose'
              : 'laurel';

          const accentColor =
            proj.category === 'STUDENT'
              ? '#FFB7C3'
              : proj.category === 'RESEARCH'
              ? '#C8B6FE'
              : proj.category === 'OSS'
              ? '#ECA6B7'
              : '#38B2A2';

          return (
            <DossierCard
              key={proj.id}
              clipLabel={proj.category}
              className={`p-6 flex flex-col justify-between transition-all duration-300 ${isFeatured ? 'md:col-span-2' : ''}`}
            >
              <div>
                {/* Visual Preview Frame */}
                <div className="mb-4">
                  <PhotoFrame
                    src={proj.visualUrl}
                    label={proj.visualLabel || proj.title}
                    badge={proj.category}
                    badgeVariant={tagVariant}
                    accentBorderColor={accentColor}
                    location={proj.metrics?.value || 'Lab Verified'}
                    caption={proj.visualCaption || proj.description}
                    aspectRatio={isFeatured ? 'aspect-[21/9]' : 'aspect-[16/9]'}
                  />
                </div>

                {/* Title & Category Strip */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <Tag
                      label={proj.category}
                      variant={tagVariant}
                    />
                    <span className="text-zinc-500 font-medium">{proj.metrics?.label || 'VERIFIED'}</span>
                  </div>
                  <span className="text-zinc-400 text-[11px]">Updated {proj.updatedAt}</span>
                </div>

                <h3 className={`text-xl sm:text-2xl font-bold font-sans mb-2 ${isLight ? 'text-zinc-950' : 'text-zinc-100'}`}>
                  {proj.title}
                </h3>

                <p className={`font-sans text-xs sm:text-sm leading-relaxed mb-4 ${isLight ? 'text-zinc-700' : 'text-zinc-400'}`}>
                  {proj.description}
                </p>

                {/* Technical Specs Tags */}
                {proj.specs && proj.specs.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.specs.map((spec, sIdx) => (
                      <span
                        key={sIdx}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-2xs font-mono text-[10px] border ${
                          isLight
                            ? 'bg-[#f4f1ea] border-zinc-300 text-zinc-800'
                            : 'bg-[#0e0f12] border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <CheckCircle size={10} className="text-[#235347]" />
                        <span>{spec}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer: Contributors & Git Link */}
              <div
                className={`pt-3 border-t flex items-center justify-between font-mono text-[10px] ${
                  isLight ? 'border-zinc-300 text-zinc-600' : 'border-zinc-800 text-zinc-500'
                }`}
              >
                <div>
                  BUILDERS: <span className="font-semibold text-zinc-300">{proj.contributors.join(', ')}</span>
                </div>

                {proj.gitUrl && (
                  <a
                    href={proj.gitUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#235347] font-bold hover:underline"
                  >
                    <Code2 size={12} />
                    <span>GIT REPO</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </DossierCard>
          );
        })}
      </div>
    </PageContainer>
  );
};
