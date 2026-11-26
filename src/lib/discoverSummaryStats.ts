import type { AppLanguage, CatalogProject } from '../types/vibeatlas';
import type { EngagementTrendingInfo } from './trendingEngagement';
import {
  DISCOVER_CATEGORY_TABS,
  matchesDiscoverTab,
  type DiscoverCategoryTabId,
} from './discoverCategoryTabs';

export interface PopularCategoryStat {
  tabId: DiscoverCategoryTabId;
  count: number;
  sharePct: number;
  labels: Record<AppLanguage, string>;
}

export interface RecentGrowthSummaryStat {
  metricKind: 'stars' | 'engagement' | 'none';
  totalGain7d: number;
  risingProjectsCount: number;
  topProject: {
    id: string;
    slug: string;
    name: string;
    gain7d: number;
  } | null;
}

export interface DiscoverSummaryStats {
  totalProjects: number;
  filteredProjects: number;
  verifiedCount: number;
  mostPopularCategory: PopularCategoryStat | null;
  recentGrowth: RecentGrowthSummaryStat;
}

export interface ComputeDiscoverSummaryOptions {
  filteredProjects?: ReadonlyArray<CatalogProject>;
  starGains7dMap?: ReadonlyMap<string, number>;
  engagementScoresMap?: ReadonlyMap<string, Omit<EngagementTrendingInfo, 'rank'>>;
}

export function computeDiscoverSummaryStats(
  allProjects: ReadonlyArray<CatalogProject>,
  options: ComputeDiscoverSummaryOptions = {}
): DiscoverSummaryStats {
  const filtered = options.filteredProjects ?? allProjects;
  const totalProjects = allProjects.length;
  const filteredProjects = filtered.length;
  const verifiedCount = allProjects.filter((p) => p.verificationStatus === 'verified').length;

  let mostPopularCategory: PopularCategoryStat | null = null;
  if (totalProjects > 0) {
    let bestScore = -1;
    let bestTieBreaker = -1;

    for (const tab of DISCOVER_CATEGORY_TABS) {
      if (tab.id === 'all') continue;
      const matched = allProjects.filter((p) => matchesDiscoverTab(p, tab));
      if (matched.length === 0) continue;

      const tieBreaker = matched.reduce(
        (acc, proj) =>
          acc +
          Math.max(0, Number(proj.githubStars) || 0) +
          Math.max(0, Number(proj.likesCount) || 0) * 5 +
          Math.max(0, Number(proj.bookmarksCount) || 0) * 8,
        0
      );

      if (
        matched.length > bestScore ||
        (matched.length === bestScore && tieBreaker > bestTieBreaker)
      ) {
        bestScore = matched.length;
        bestTieBreaker = tieBreaker;
        mostPopularCategory = {
          tabId: tab.id,
          count: matched.length,
          sharePct: Math.round((matched.length / totalProjects) * 100),
          labels: tab.labels,
        };
      }
    }
  }

  // Recent Growth Trends: prefer real 7d GitHub star deltas when recorded,
  // otherwise honestly reflect verified 7d community engagement signals.
  let totalStarGain7d = 0;
  let starRisingCount = 0;
  let topStarProject: RecentGrowthSummaryStat['topProject'] = null;

  if (options.starGains7dMap) {
    for (const project of allProjects) {
      const gain = Math.max(0, Number(options.starGains7dMap.get(project.id)) || 0);
      if (gain > 0) {
        totalStarGain7d += gain;
        starRisingCount += 1;
        if (!topStarProject || gain > topStarProject.gain7d) {
          topStarProject = {
            id: project.id,
            slug: project.slug,
            name: project.name,
            gain7d: gain,
          };
        }
      }
    }
  }

  let totalEngGain7d = 0;
  let engRisingCount = 0;
  let topEngProject: RecentGrowthSummaryStat['topProject'] = null;

  if (options.engagementScoresMap) {
    for (const project of allProjects) {
      const info = options.engagementScoresMap.get(project.id);
      const gain = Math.max(0, Number(info?.totalGained7d) || 0);
      if (gain > 0) {
        totalEngGain7d += gain;
        engRisingCount += 1;
        if (!topEngProject || gain > topEngProject.gain7d) {
          topEngProject = {
            id: project.id,
            slug: project.slug,
            name: project.name,
            gain7d: gain,
          };
        }
      }
    }
  }

  const recentGrowth: RecentGrowthSummaryStat =
    totalStarGain7d > 0
      ? {
          metricKind: 'stars',
          totalGain7d: totalStarGain7d,
          risingProjectsCount: starRisingCount,
          topProject: topStarProject,
        }
      : totalEngGain7d > 0
        ? {
            metricKind: 'engagement',
            totalGain7d: totalEngGain7d,
            risingProjectsCount: engRisingCount,
            topProject: topEngProject,
          }
        : {
            metricKind: 'none',
            totalGain7d: 0,
            risingProjectsCount: 0,
            topProject: null,
          };

  return {
    totalProjects,
    filteredProjects,
    verifiedCount,
    mostPopularCategory,
    recentGrowth,
  };
}
