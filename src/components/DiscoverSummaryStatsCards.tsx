import { ArrowUpRight } from 'lucide-react';
import type { AppLanguage } from '../types/vibeatlas';
import { UI_STRINGS } from '../data/i18n';
import { formatCompactCount } from '../lib/catalogEngine';
import type { DiscoverCategoryTabId } from '../lib/discoverCategoryTabs';
import type { DiscoverSummaryStats } from '../lib/discoverSummaryStats';
import { playUiSound } from '../lib/soundEffects';
import { PastelCategoryIcon } from './PastelCategoryIcon';

interface DiscoverSummaryStatsCardsProps {
  language: AppLanguage;
  stats: DiscoverSummaryStats;
  hasActiveFilters: boolean;
  isLoading?: boolean;
  onSelectCategoryTab: (tabId: DiscoverCategoryTabId) => void;
  onInspectProjectById: (projectId: string) => void;
}

export function DiscoverSummaryStatsCards({
  language,
  stats,
  hasActiveFilters,
  isLoading = false,
  onSelectCategoryTab,
  onInspectProjectById,
}: DiscoverSummaryStatsCardsProps) {
  const copy = UI_STRINGS[language].discover;
  const popular = stats.mostPopularCategory;
  const growth = stats.recentGrowth;

  return (
    <section
      aria-label={copy.summaryRegionLabel}
      data-testid="discover-summary-stats"
      className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-3"
    >
      {/* Card 1: Total Projects */}
      <article
        data-testid="summary-card-total-projects"
        className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {copy.summaryTotalProjectsLabel}
          </h2>
          <PastelCategoryIcon role="stacks" size="sm" animated={false} />
        </div>

        <div className="mt-2.5">
          {isLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
          ) : (
            <p
              data-testid="summary-total-projects-value"
              className="font-mono text-2xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white"
            >
              {stats.totalProjects.toLocaleString()}
            </p>
          )}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="tabular-nums">
            {stats.verifiedCount.toLocaleString()} {copy.summaryVerifiedSuffix}
          </span>
          {hasActiveFilters && stats.filteredProjects !== stats.totalProjects && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium tabular-nums text-blue-700 dark:text-sky-400">
                {stats.filteredProjects.toLocaleString()} {copy.summaryMatchingSuffix}
              </span>
            </>
          )}
        </div>
      </article>

      {/* Card 2: Most Popular Category */}
      <article
        data-testid="summary-card-popular-category"
        className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {copy.summaryPopularCategoryLabel}
          </h2>
          <PastelCategoryIcon role="discover" size="sm" animated={false} />
        </div>

        <div className="mt-2.5">
          {isLoading ? (
            <div className="h-8 w-32 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
          ) : (
            <p
              data-testid="summary-popular-category-value"
              className="truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white"
            >
              {popular ? popular.labels[language] : '—'}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          {popular ? (
            <>
              <span className="truncate tabular-nums">
                {popular.count.toLocaleString()} {copy.summaryCategoryShareUnit} · {popular.sharePct}%
              </span>
              <button
                type="button"
                data-testid="summary-popular-category-action"
                onClick={() => {
                  playUiSound('tap');
                  onSelectCategoryTab(popular.tabId);
                }}
                className="inline-flex shrink-0 items-center gap-0.5 whitespace-nowrap font-medium text-blue-700 hover:underline dark:text-sky-400"
              >
                <span>{copy.summaryFilterCategoryAction}</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </>
          ) : (
            <span>—</span>
          )}
        </div>
      </article>

      {/* Card 3: Recent Growth Trends */}
      <article
        data-testid="summary-card-growth-trends"
        className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {copy.summaryGrowthTrendsLabel}
          </h2>
          <PastelCategoryIcon role="trending" size="sm" animated={false} />
        </div>

        <div className="mt-2.5">
          {isLoading ? (
            <div className="h-8 w-28 animate-pulse rounded-md bg-slate-100 dark:bg-slate-800" />
          ) : growth.metricKind === 'none' ? (
            <p
              data-testid="summary-growth-trends-value"
              className="text-lg font-semibold text-slate-600 dark:text-slate-300"
            >
              {copy.summaryNoGrowthYet}
            </p>
          ) : (
            <p
              data-testid="summary-growth-trends-value"
              className="flex items-baseline gap-1.5 whitespace-nowrap"
            >
              <span
                className={`font-mono text-2xl font-bold tracking-tight tabular-nums ${
                  growth.metricKind === 'stars'
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-sky-700 dark:text-sky-400'
                }`}
              >
                +{formatCompactCount(growth.totalGain7d)}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {growth.metricKind === 'stars'
                  ? copy.summaryGrowthStarsUnit
                  : copy.summaryGrowthSignalsUnit}
              </span>
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
          {growth.topProject ? (
            <>
              <span className="shrink-0 tabular-nums">
                {growth.risingProjectsCount} {copy.summaryRisingProjectsSuffix}
              </span>
              <button
                type="button"
                data-testid="summary-growth-top-project-btn"
                onClick={() => {
                  playUiSound('tap');
                  onInspectProjectById(growth.topProject!.id);
                }}
                title={growth.topProject.name}
                className="inline-flex min-w-0 items-center gap-0.5 truncate font-medium text-slate-700 hover:text-blue-700 hover:underline dark:text-slate-300 dark:hover:text-sky-400"
              >
                <span className="truncate">{growth.topProject.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </button>
            </>
          ) : (
            <span>{copy.summaryNoGrowthYet}</span>
          )}
        </div>
      </article>
    </section>
  );
}
