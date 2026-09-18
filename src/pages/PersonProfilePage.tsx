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
  CameraOff,
  Globe,
  BookOpen,
  Link as LinkIcon
} from 'lucide-react';

const GitHubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="GitHub">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="LinkedIn">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const TwitterXIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="X (Twitter)">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DiscordIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Discord">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const TelegramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Telegram">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
  </svg>
);

const InstagramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="Instagram">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTubeIcon: React.FC<{ size?: number; className?: string }> = ({ size = 14, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="YouTube">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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

  // Comprehensive list of communication & social links
  const contactLinks = React.useMemo(() => {
    const list: Array<{
      id: string;
      label: string;
      subtitle?: string;
      url: string;
      icon: React.ReactNode;
      isExternal: boolean;
    }> = [];

    // 1. Primary Email
    if (person.email) {
      list.push({
        id: 'email',
        label: person.email,
        subtitle: 'Email',
        url: `mailto:${person.email}`,
        icon: <Mail size={14} className="text-[#235347] dark:text-[#38B2A2]" />,
        isExternal: false,
      });
    }

    // 2. GitHub Profile / Repos
    const gh = person.githubUrl || person.socialLinks?.github;
    if (gh) {
      const cleanGh = gh.replace(/^https?:\/\/(www\.)?github\.com\/?/, '').replace(/\/$/, '');
      list.push({
        id: 'github',
        label: cleanGh ? `@${cleanGh}` : 'GitHub Profile / Repos',
        subtitle: 'GitHub',
        url: gh.startsWith('http') ? gh : `https://github.com/${cleanGh}`,
        icon: <GitHubIcon size={14} />,
        isExternal: true,
      });
    }

    // 3. LinkedIn Profile
    const li = person.socialLinks?.linkedin || (person as any).linkedinUrl;
    if (li) {
      const cleanLi = li.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/, '').replace(/\/$/, '');
      list.push({
        id: 'linkedin',
        label: cleanLi ? `in/${cleanLi}` : 'LinkedIn Profile',
        subtitle: 'LinkedIn',
        url: li.startsWith('http') ? li : `https://linkedin.com/in/${cleanLi}`,
        icon: <LinkedInIcon size={14} className="text-[#0A66C2]" />,
        isExternal: true,
      });
    }

    // 4. X / Twitter
    const tw = person.socialLinks?.twitter || person.socialLinks?.x || (person as any).twitterUrl;
    if (tw) {
      const cleanTw = tw.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\/?/, '').replace(/^@/, '').replace(/\/$/, '');
      list.push({
        id: 'twitter',
        label: cleanTw ? `@${cleanTw}` : 'X (formerly Twitter)',
        subtitle: 'X',
        url: tw.startsWith('http') ? tw : `https://x.com/${cleanTw}`,
        icon: <TwitterXIcon size={13} />,
        isExternal: true,
      });
    }

    // 5. Personal Website / Portfolio
    const web = person.socialLinks?.website || (person as any).websiteUrl;
    if (web) {
      const cleanWeb = web.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      list.push({
        id: 'website',
        label: cleanWeb || 'Personal Website',
        subtitle: 'Portfolio',
        url: web.startsWith('http') ? web : `https://${web}`,
        icon: <Globe size={14} className="text-[#38B2A2]" />,
        isExternal: true,
      });
    }

    // 6. Discord
    const disc = person.socialLinks?.discord;
    if (disc) {
      const cleanDisc = disc.replace(/^https?:\/\/(www\.)?discord\.(gg|com\/invite)\/?/, '').replace(/\/$/, '');
      list.push({
        id: 'discord',
        label: cleanDisc.startsWith('http') ? 'Discord Server' : cleanDisc.includes('#') ? cleanDisc : `discord.gg/${cleanDisc}`,
        subtitle: 'Discord',
        url: disc.startsWith('http') ? disc : `https://discord.gg/${cleanDisc}`,
        icon: <DiscordIcon size={14} className="text-[#5865F2]" />,
        isExternal: true,
      });
    }

    // 7. Telegram
    const tg = person.socialLinks?.telegram;
    if (tg) {
      const cleanTg = tg.replace(/^https?:\/\/(www\.)?t\.me\/?/, '').replace(/^@/, '').replace(/\/$/, '');
      list.push({
        id: 'telegram',
        label: cleanTg ? `@${cleanTg}` : 'Telegram',
        subtitle: 'Telegram',
        url: tg.startsWith('http') ? tg : `https://t.me/${cleanTg}`,
        icon: <TelegramIcon size={14} className="text-[#229ED9]" />,
        isExternal: true,
      });
    }

    // 8. Instagram
    const insta = person.socialLinks?.instagram;
    if (insta) {
      const cleanInsta = insta.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '').replace(/^@/, '').replace(/\/$/, '');
      list.push({
        id: 'instagram',
        label: cleanInsta ? `@${cleanInsta}` : 'Instagram',
        subtitle: 'Instagram',
        url: insta.startsWith('http') ? insta : `https://instagram.com/${cleanInsta}`,
        icon: <InstagramIcon size={14} className="text-[#E1306C]" />,
        isExternal: true,
      });
    }

    // 9. YouTube Channel
    const yt = person.socialLinks?.youtube;
    if (yt) {
      const cleanYt = yt.replace(/^https?:\/\/(www\.)?youtube\.com\/(@|c\/)?/, '').replace(/\/$/, '');
      list.push({
        id: 'youtube',
        label: cleanYt ? `@${cleanYt}` : 'YouTube Channel',
        subtitle: 'YouTube',
        url: yt.startsWith('http') ? yt : `https://youtube.com/@${cleanYt}`,
        icon: <YouTubeIcon size={14} className="text-[#FF0000]" />,
        isExternal: true,
      });
    }

    // 10. Blog / Substack / Writing
    const blog = person.socialLinks?.blog || person.socialLinks?.substack;
    if (blog) {
      const cleanBlog = blog.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      list.push({
        id: 'blog',
        label: cleanBlog || 'Writing & Articles',
        subtitle: 'Articles',
        url: blog.startsWith('http') ? blog : `https://${blog}`,
        icon: <BookOpen size={14} className="text-[#FF6719]" />,
        isExternal: true,
      });
    }

    // 11. Any arbitrary extra keys in socialLinks
    if (person.socialLinks) {
      const standardKeys = new Set([
        'github', 'twitter', 'x', 'linkedin', 'website',
        'discord', 'telegram', 'instagram', 'youtube', 'blog', 'substack'
      ]);
      Object.entries(person.socialLinks).forEach(([key, val]) => {
        if (val && !standardKeys.has(key)) {
          const cleanVal = val.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
          list.push({
            id: key,
            label: cleanVal,
            subtitle: key.charAt(0).toUpperCase() + key.slice(1),
            url: val.startsWith('http') ? val : `https://${val}`,
            icon: <LinkIcon size={14} className="text-zinc-500" />,
            isExternal: true,
          });
        }
      });
    }

    return list;
  }, [person]);

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
            className={`relative rounded-3xl overflow-hidden border aspect-3/4 flex items-end justify-center transition-colors duration-500 ${
              isLight
                ? 'bg-gradient-to-b from-[#FAF8F5] via-[#F4F1EA] to-[#ECE7DE] border-zinc-300/80 shadow-md'
                : 'bg-gradient-to-b from-[#14161a] via-[#101215] to-[#0a0c0e] border-zinc-800 shadow-xl'
            }`}
          >
            {/* Background Texture Overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-10"
              style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, ${accent} 1px, transparent 0)`,
                backgroundSize: '24px 24px',
              }}
            />

            {/* Ambient Lighting Bubble */}
            <div
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-25"
              style={{ backgroundColor: accent }}
            />

            {/* Scissors-Cut Silhouette / Placeholder */}
            {(() => {
              const cutout = resolvePersonCutout(person);
              return cutout ? (
                <img
                  src={cutout}
                  alt={person.name}
                  onError={(e) => {
                    console.warn(`Failed to render cutout for ${person.name}: "${cutout}"`);
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
              isLight ? 'bg-white/80 border-zinc-200 shadow-xs' : 'bg-[#121316] border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Direct Contact & Channels
              </span>
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
                {contactLinks.length} {contactLinks.length === 1 ? 'Channel' : 'Channels'}
              </span>
            </div>

            {contactLinks.length === 0 ? (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">
                No public contact channels configured yet.
              </p>
            ) : (
              <div className="flex flex-col space-y-2 text-xs font-mono">
                {contactLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-between p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 hover:border-[#235347] dark:hover:border-[#38B2A2] hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="shrink-0 flex items-center justify-center w-4 h-4 text-zinc-700 dark:text-zinc-300 group-hover:text-[#235347] dark:group-hover:text-[#38B2A2] transition-colors">
                        {link.icon}
                      </div>
                      <span className="text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-950 dark:group-hover:text-white font-medium truncate">
                        {link.label}
                      </span>
                      {link.subtitle && (
                        <span className="text-zinc-400 dark:text-zinc-500 text-[10px] truncate hidden sm:inline">
                          · {link.subtitle}
                        </span>
                      )}
                    </div>
                    <ArrowUpRight
                      size={13}
                      className="text-zinc-400 group-hover:text-[#235347] dark:group-hover:text-[#38B2A2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                    />
                  </a>
                ))}
              </div>
            )}
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
