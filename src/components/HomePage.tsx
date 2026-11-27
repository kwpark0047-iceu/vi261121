import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  CheckCircle2,
  Search,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type {
  ActivePage,
  AppLanguage,
  CatalogProject,
  ContentType,
  OwnershipClaimRecord,
  ProjectActivityRecord,
  SearchFilters,
} from '../types/vibeatlas';
import {
  CONTENT_TYPE_LABELS,
  PLATFORM_LABELS,
  UI_STRINGS,
} from '../data/i18n';
import {
  HERO_IMAGE_PATH,
  KOREAN_MAKERS_IMAGE,
  MCP_SHOWCASE_IMAGE,
  WORKSPACE_SHOWCASE_IMAGE,
} from '../data/seedCatalog';
import { getSearchSuggestions, sortProjects } from '../lib/catalogEngine';
import { computeCatalogHighlightContext } from '../lib/projectHighlightBadges';
import { playUiSound } from '../lib/soundEffects';
import {
  computeEngagementTrendingScoresMap,
  selectTrendingByEngagement7d,
} from '../lib/trendingEngagement';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { HomeTrending24hSection } from './HomeTrending24hSection';
import { PastelCategoryIcon } from './PastelCategoryIcon';
import { ProjectCard } from './ProjectCard';
import { RecentActivityWidget } from './RecentActivityWidget';
import { ResilientProjectImage } from './ResilientProjectImage';
import { SubmissionPromoShowcase } from './SubmissionPromoShowcase';
import { VoiceSearchButton, VoiceSearchFeedback } from './VoiceSearchButton';

interface HomePageProps {
  language: AppLanguage;
  projects: CatalogProject[];
  likedIds: Set<string>;
  bookmarkedIds: Set<string>;
  user: User | null;
  userClaims?: ReadonlyArray<OwnershipClaimRecord>;
  firestoreActivities?: ReadonlyArray<ProjectActivityRecord>;
  recentActivities?: ReadonlyArray<ProjectActivityRecord>;
  snapshotRevision?: number;
  onOpenDetail: (project: CatalogProject) => void;
  onToggleLike: (project: CatalogProject) => void;
  onToggleBookmark: (project: CatalogProject) => void;
  onSearchAndDiscover: (patch: Partial<SearchFilters>) => void;
  onNavigate: (page: ActivePage) => void;
  onSignIn: () => void;
  onSubscribeNewsletter: (email: string) => Promise<void>;
}

type SpotlightTab = 'trending' | 'new' | 'oss';

export function HomePage({
  language,
  projects,
  likedIds,
  bookmarkedIds,
  user,
  userClaims = [],
  firestoreActivities = [],
  recentActivities = [],
  snapshotRevision = 0,
  onOpenDetail,
  onToggleLike,
  onToggleBookmark,
  onSearchAndDiscover,
  onNavigate,
  onSignIn,
  onSubscribeNewsletter,
}: HomePageProps) {
  const [heroQuery, setHeroQuery] = useState('');
  const [spotlightTab, setSpotlightTab] = useState<SpotlightTab>('trending');
  const [newsletterEmail, setNewsletterEmail] = useState(user?.email ?? '');
  const [newsletterMsg, setNewsletterMsg] = useState<string | null>(null);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);

  const heroCopy = UI_STRINGS[language].hero;
  const homeCopy = UI_STRINGS[language].home;
  const typeLabels = CONTENT_TYPE_LABELS[language];

  const voiceSearch = useVoiceSearch({
    language,
    onInterimTranscript: (transcript) => {
      setHeroQuery(transcript);
    },
    onFinalTranscript: (transcript) => {
      setHeroQuery(transcript);
      onSearchAndDiscover({ q: transcript, page: 1 });
    },
  });

  const suggestions = useMemo(
    () => getSearchSuggestions(heroQuery, projects, language, 5),
    [heroQuery, projects, language]
  );

  const engagementTrendingScores = useMemo(
    () =>
      computeEngagementTrendingScoresMap(projects, {
        activities: recentActivities,
      }),
    [projects, recentActivities]
  );

  const engagementTrendingMap = useMemo(
    () =>
      selectTrendingByEngagement7d(projects, {
        activities: recentActivities,
        maxBadges: 3,
      }),
    [projects, recentActivities]
  );

  const spotlightProjects = useMemo(() => {
    if (spotlightTab === 'new') {
      return sortProjects(projects, 'recently_added', '').slice(0, 3);
    }
    if (spotlightTab === 'oss') {
      const ossOnly = projects.filter(
        (p) => p.pricingModel === 'open_source' || Boolean(p.githubRepo)
      );
      return sortProjects(ossOnly, 'most_starred', '').slice(0, 3);
    }
    return sortProjects(projects, 'trending_7d', '', undefined, engagementTrendingScores).slice(0, 3);
  }, [projects, spotlightTab, engagementTrendingScores]);

  const mcpAndSkillProjects = useMemo(
    () =>
      projects
        .filter((p) => p.contentType === 'mcp_server' || p.contentType === 'ai_skill')
        .slice(0, 3),
    [projects]
  );

  const koreanAndGlobalSpotlights = useMemo(() => {
    const kr = projects.filter((p) => p.country === 'KR');
    const global = projects.filter((p) => p.country !== 'KR');
    return [...kr.slice(0, 2), ...global.slice(0, 1)].slice(0, 3);
  }, [projects]);

  const highlightContext = useMemo(
    () => computeCatalogHighlightContext(projects),
    [projects, snapshotRevision]
  );

  const featuredMakers = useMemo(() => {
    const seen = new Set<string>();
    const makers: { name: string; handle: string; country: string; project: CatalogProject }[] = [];
    for (const p of projects) {
      if (!seen.has(p.makerName)) {
        seen.add(p.makerName);
        makers.push({ name: p.makerName, handle: p.makerHandle, country: p.country, project: p });
      }
      if (makers.length >= 4) break;
    }
    return makers;
  }, [projects]);

  const quickTypes: ContentType[] = [
    'web_app',
    'mobile_app',
    'ai_tool',
    'mcp_server',
    'ai_skill',
    'ai_agent',
    'template',
    'open_source',
  ];

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiSound('tap');
    onSearchAndDiscover({ q: heroQuery.trim(), page: 1 });
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterMsg(null);
    if (!user) {
      playUiSound('tap');
      onSignIn();
      return;
    }
    const emailToSave = (newsletterEmail || user.email || '').trim();
    if (!emailToSave || !emailToSave.includes('@')) return;
    setNewsletterSubmitting(true);
    try {
      await onSubscribeNewsletter(emailToSave);
      setNewsletterMsg(homeCopy.newsletterSuccess);
    } catch (err) {
      setNewsletterMsg(err instanceof Error ? err.message : 'Subscription error');
    } finally {
      setNewsletterSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="border-b border-slate-200/80 bg-gradient-to-b from-white via-white to-[#F7F9FC] py-9 lg:py-12 dark:border-slate-800/80 dark:from-slate-900/60 dark:via-slate-950 dark:to-slate-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-4 sm:px-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="flex flex-col justify-center lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-blue-700 dark:text-sky-300">
              <PastelCategoryIcon role="brand" size="xs" animated={false} />
              <span>{heroCopy.kicker}</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem] dark:text-white">
              {heroCopy.headline}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
              {heroCopy.subheadline}
            </p>

            {/* Universal Search Input */}
            <form onSubmit={handleHeroSubmit} className="relative mt-5 max-w-xl">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 dark:border-slate-700 dark:bg-slate-950">
                <Search className="ml-2.5 h-5 w-5 shrink-0 text-slate-400" />
                <input
                  type="search"
                  value={heroQuery}
                  onChange={(e) => setHeroQuery(e.target.value)}
                  placeholder={heroCopy.searchPlaceholder}
                  aria-label={heroCopy.searchPlaceholder}
                  className="w-full bg-transparent px-2 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white"
                />
                <VoiceSearchButton
                  language={language}
                  isListening={voiceSearch.isListening}
                  onClick={voiceSearch.toggle}
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  className="shrink-0 whitespace-nowrap rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                >
                  {heroCopy.searchButton}
                </motion.button>
              </div>

              <VoiceSearchFeedback
                language={language}
                status={voiceSearch.status}
                errorCode={voiceSearch.errorCode}
                interimTranscript={voiceSearch.interimTranscript}
                onStop={voiceSearch.stop}
                onDismissError={voiceSearch.clearError}
              />

              {suggestions.length > 0 && (
                <div
                  role="listbox"
                  aria-label="Search suggestions"
                  className="absolute left-0 right-0 top-full z-20 mt-1.5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  {suggestions.map((sug) => {
                    const match = projects.find((p) => p.id === sug.id);
                    return (
                      <button
                        key={sug.id}
                        type="button"
                        onClick={() => {
                          setHeroQuery('');
                          if (match) onOpenDetail(match);
                        }}
                        className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-2.5 text-left last:border-b-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <PastelCategoryIcon contentType={sug.contentType} size="xs" animated={false} />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                              {sug.name}
                            </p>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {sug.subtitle}
                            </p>
                          </div>
                        </div>
                        <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                          {typeLabels[sug.contentType]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </form>

            {/* Quick Content Type Shortcuts with Bubbly Pastel Icons */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {heroCopy.quickBrowseLabel}
              </span>
              {quickTypes.map((typeId) => (
                <motion.button
                  key={typeId}
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    playUiSound('tap');
                    onSearchAndDiscover({ type: typeId, page: 1 });
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-2xl border border-slate-200/90 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:border-sky-300 hover:bg-sky-50/50 hover:text-blue-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-sky-800 dark:hover:bg-sky-950/60"
                >
                  <PastelCategoryIcon contentType={typeId} size="xs" animated={false} />
                  <span>{typeLabels[typeId]}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <ResilientProjectImage
              src={HERO_IMAGE_PATH}
              alt="W-Vibe pastel maker studio showcase"
              contentType="web_app"
              subtitle="Web Apps · MCP · AI Skills"
              aspectClassName="aspect-[16/10] lg:aspect-[16/11]"
              className="shadow-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Promoted Submissions Launch Showcase */}
      <SubmissionPromoShowcase
        language={language}
        projects={projects}
        likedIds={likedIds}
        userClaims={userClaims}
        onOpenDetail={onOpenDetail}
        onToggleLike={onToggleLike}
        onNavigate={onNavigate}
      />

      {/* Live Community Recent Activity Feed */}
      <RecentActivityWidget
        language={language}
        projects={projects}
        firestoreActivities={firestoreActivities}
        localActivities={recentActivities}
        onOpenDetail={onOpenDetail}
      />

      {/* Trending: 24h GitHub Star Growth */}
      <HomeTrending24hSection
        language={language}
        catalogProjects={projects}
        snapshotRevision={snapshotRevision}
        onOpenDetail={onOpenDetail}
        onNavigate={onNavigate}
      />

      {/* Section 1: Trending / Newly Launched / Rising OSS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PastelCategoryIcon role="trending" size="sm" />
            <div
              role="tablist"
              aria-label="Discovery spotlight tabs"
              className="inline-flex rounded-2xl border border-slate-200/90 bg-white p-1 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
            >
              <button
                type="button"
                role="tab"
                aria-selected={spotlightTab === 'trending'}
                onClick={() => {
                  playUiSound('tap');
                  setSpotlightTab('trending');
                }}
                className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  spotlightTab === 'trending'
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                {homeCopy.trendingTab}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={spotlightTab === 'new'}
                onClick={() => {
                  playUiSound('tap');
                  setSpotlightTab('new');
                }}
                className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  spotlightTab === 'new'
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                {homeCopy.newlyLaunchedTab}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={spotlightTab === 'oss'}
                onClick={() => {
                  playUiSound('tap');
                  setSpotlightTab('oss');
                }}
                className={`shrink-0 whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  spotlightTab === 'oss'
                    ? 'bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                {homeCopy.risingOssTab}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playUiSound('tap');
              onSearchAndDiscover({ page: 1 });
            }}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-blue-700 hover:underline dark:text-sky-300"
          >
            <span>{homeCopy.viewAllDiscover}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {spotlightProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              language={language}
              isLiked={likedIds.has(proj.id)}
              isBookmarked={bookmarkedIds.has(proj.id)}
              engagementTrending={engagementTrendingMap.get(proj.id)}
              highlightContext={highlightContext}
              makerClaims={userClaims}
              onOpenDetail={onOpenDetail}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      </section>

      {/* Section 2: MCP Servers & AI Skills + Stack Curation */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PastelCategoryIcon role="mcp" size="md" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                    {homeCopy.mcpAndSkillsTitle}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                    {homeCopy.mcpAndSkillsSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playUiSound('tap');
                  onSearchAndDiscover({ type: 'mcp_server', page: 1 });
                }}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-blue-700 hover:underline dark:text-sky-300"
              >
                <span>MCP / Skills</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mcpAndSkillProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  language={language}
                  isLiked={likedIds.has(proj.id)}
                  isBookmarked={bookmarkedIds.has(proj.id)}
                  engagementTrending={engagementTrendingMap.get(proj.id)}
                  highlightContext={highlightContext}
                  makerClaims={userClaims}
                  onOpenDetail={onOpenDetail}
                  onToggleLike={onToggleLike}
                  onToggleBookmark={onToggleBookmark}
                />
              ))}
            </div>
          </div>

          {/* Ecosystem Stack Directory Links */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <PastelCategoryIcon role="stacks" size="sm" />
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {homeCopy.stacksTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {homeCopy.stacksSubtitle}
                </p>
              </div>
            </div>

            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {[
                {
                  label: PLATFORM_LABELS.lovable,
                  count: projects.filter((p) => p.developmentPlatform === 'lovable').length,
                  patch: { platform: 'lovable' as const },
                },
                {
                  label: 'Vercel / v0',
                  count: projects.filter(
                    (p) => p.hostingProvider === 'vercel' || p.developmentPlatform === 'v0'
                  ).length,
                  patch: { hosting: 'vercel' as const },
                },
                {
                  label: 'Supabase',
                  count: projects.filter((p) => p.backendTech === 'supabase').length,
                  patch: { backend: 'supabase' as const },
                },
                {
                  label: PLATFORM_LABELS.cursor,
                  count: projects.filter((p) => p.developmentPlatform === 'cursor').length,
                  patch: { platform: 'cursor' as const },
                },
                {
                  label: PLATFORM_LABELS.claude_code,
                  count: projects.filter((p) => p.developmentPlatform === 'claude_code').length,
                  patch: { platform: 'claude_code' as const },
                },
              ].map((stack) => (
                <button
                  key={stack.label}
                  type="button"
                  onClick={() => {
                    playUiSound('tap');
                    onSearchAndDiscover({ ...stack.patch, page: 1 });
                  }}
                  className="flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-slate-800 transition-colors hover:text-blue-700 dark:text-slate-200 dark:hover:text-sky-300"
                >
                  <span>{stack.label}</span>
                  <span className="tabular-nums font-mono text-xs text-slate-500 dark:text-slate-400">
                    {stack.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <ResilientProjectImage
                src={MCP_SHOWCASE_IMAGE}
                alt="MCP protocol modules"
                contentType="mcp_server"
                aspectClassName="aspect-[4/3]"
              />
              <ResilientProjectImage
                src={WORKSPACE_SHOWCASE_IMAGE}
                alt="AI agent workspace"
                contentType="ai_tool"
                aspectClassName="aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Korean & Global Builders Spotlight */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PastelCategoryIcon role="makers" size="md" />
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-white">
                {homeCopy.koreanGlobalTitle}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                {homeCopy.koreanGlobalSubtitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playUiSound('tap');
              onSearchAndDiscover({ country: 'KR', page: 1 });
            }}
            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-blue-700 hover:underline dark:text-sky-300"
          >
            <span>KR Projects</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {koreanAndGlobalSpotlights.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              language={language}
              isLiked={likedIds.has(proj.id)}
              isBookmarked={bookmarkedIds.has(proj.id)}
              engagementTrending={engagementTrendingMap.get(proj.id)}
              highlightContext={highlightContext}
              makerClaims={userClaims}
              onOpenDetail={onOpenDetail}
              onToggleLike={onToggleLike}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      </section>

      {/* Section 4: Featured Makers + Submit CTA + Newsletter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Featured Makers */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <PastelCategoryIcon role="makers" size="sm" />
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {homeCopy.featuredMakersTitle}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {homeCopy.featuredMakersSubtitle}
                </p>
              </div>
            </div>
            <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
              {featuredMakers.map((m) => (
                <div key={m.name} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {m.name}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {m.handle || 'Maker'} · {m.country} · {m.project.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenDetail(m.project)}
                    className="shrink-0 whitespace-nowrap rounded-xl border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {UI_STRINGS[language].card.openDetail}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit CTA + Seoul Studio Preview */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-4 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <ResilientProjectImage
                src={KOREAN_MAKERS_IMAGE}
                alt="Seoul independent maker workspace"
                contentType="template"
                aspectClassName="aspect-[16/9]"
                className="mb-4"
              />
              <div className="flex items-center gap-2.5">
                <PastelCategoryIcon role="submit" size="sm" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {homeCopy.submitCtaTitle}
                </h2>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {homeCopy.submitCtaBody}
              </p>
            </div>
            <motion.button
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                playUiSound('tap');
                onNavigate('submit');
              }}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <span>{homeCopy.submitCtaButton}</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs lg:col-span-3 dark:border-slate-800 dark:bg-slate-900">
            <div>
              <div className="flex items-center gap-2.5">
                <PastelCategoryIcon role="newsletter" size="sm" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {homeCopy.newsletterTitle}
                </h2>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                {homeCopy.newsletterBody}
              </p>
            </div>

            <form onSubmit={handleNewsletter} className="mt-4 space-y-2.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={homeCopy.newsletterPlaceholder}
                aria-label={homeCopy.newsletterTitle}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-600 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.97 }}
                disabled={newsletterSubmitting}
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                {homeCopy.newsletterButton}
              </motion.button>
              {!user && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {homeCopy.newsletterSignInNotice}
                </p>
              )}
              {newsletterMsg && (
                <p className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{newsletterMsg}</span>
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
