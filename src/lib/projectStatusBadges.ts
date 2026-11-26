import type { CatalogProject, VerificationStatus } from '../types/vibeatlas';
import type { EngagementTrendingInfo } from './trendingEngagement';
import type { TrendingProjectInfo } from './trendingStars';

export type ProjectStatusBadgeKind =
  | 'verified'
  | 'pending'
  | 'unverified'
  | 'open_source'
  | 'trending';

export interface ProjectStatusBadge {
  kind: ProjectStatusBadgeKind;
  license?: string;
  trendingMetricKind?: 'engagement' | 'stars';
  trendingDelta7d?: number;
}

const OSI_OPEN_SOURCE_LICENSES = new Set([
  'mit',
  'apache-2.0',
  'apache 2.0',
  'gpl-3.0',
  'gpl-2.0',
  'lgpl-3.0',
  'agpl-3.0',
  'bsd-2-clause',
  'bsd-3-clause',
  'isc',
  'mpl-2.0',
  'unlicense',
  '0bsd',
  'cc0-1.0',
]);

export function normalizeDisplayLicense(rawLicense: string | undefined): string {
  const trimmed = (rawLicense ?? '').trim();
  if (!trimmed || trimmed.toLowerCase() === 'unknown') return '';
  return trimmed;
}

export function isProjectOpenSource(
  project: Pick<CatalogProject, 'contentType' | 'pricingModel' | 'license'>
): boolean {
  if (project.contentType === 'open_source' || project.pricingModel === 'open_source') {
    return true;
  }

  const normalizedLicense = normalizeDisplayLicense(project.license).toLowerCase();
  if (!normalizedLicense) return false;

  return project.pricingModel === 'free' && OSI_OPEN_SOURCE_LICENSES.has(normalizedLicense);
}

export function normalizeVerificationStatus(
  status: VerificationStatus | undefined
): VerificationStatus {
  if (status === 'verified' || status === 'pending' || status === 'unverified') {
    return status;
  }
  return 'unverified';
}

export interface ResolveProjectStatusBadgesOptions {
  engagementTrending?: EngagementTrendingInfo;
  starTrending?: TrendingProjectInfo;
}

/**
 * Derives ordered visual status badges directly from verifiable project metadata
 * ('verified' | 'pending' | 'unverified', 'open_source', and 'trending').
 */
export function resolveProjectStatusBadges(
  project: Pick<CatalogProject, 'verificationStatus' | 'contentType' | 'pricingModel' | 'license'>,
  options: ResolveProjectStatusBadgesOptions = {}
): ProjectStatusBadge[] {
  const badges: ProjectStatusBadge[] = [];

  badges.push({
    kind: normalizeVerificationStatus(project.verificationStatus),
  });

  if (isProjectOpenSource(project)) {
    const license = normalizeDisplayLicense(project.license);
    badges.push({
      kind: 'open_source',
      ...(license ? { license } : {}),
    });
  }

  const hasEngagement = Boolean(
    options.engagementTrending && options.engagementTrending.totalGained7d > 0
  );
  const hasStars = Boolean(options.starTrending && options.starTrending.starsGained7d > 0);

  if (hasEngagement && options.engagementTrending) {
    badges.push({
      kind: 'trending',
      trendingMetricKind: 'engagement',
      trendingDelta7d: options.engagementTrending.totalGained7d,
    });
  } else if (hasStars && options.starTrending) {
    badges.push({
      kind: 'trending',
      trendingMetricKind: 'stars',
      trendingDelta7d: options.starTrending.starsGained7d,
    });
  }

  return badges;
}
