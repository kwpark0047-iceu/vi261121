import type { CatalogProject } from '../types/vibeatlas';

export interface ProjectSubmissionDayPoint {
  date: string;
  shortDate: string;
  dailySubmissions: number;
  makerSubmissions: number;
  curatedOrSynced: number;
  cumulativeProjects: number;
  rolling7dAvg: number;
  projectNames: string[];
  projectSlugs: string[];
}

export interface ProjectSubmissionPeakDay {
  date: string;
  shortDate: string;
  count: number;
  projectNames: string[];
}

export interface ProjectSubmissionsGrowthSummary {
  windowDays: number;
  windowStartDate: string;
  windowEndDate: string;
  points: ProjectSubmissionDayPoint[];
  baselineBeforeWindow: number;
  totalSubmissions30d: number;
  makerSubmissions30d: number;
  totalCatalogProjects: number;
  recentHalfCount: number;
  previousHalfCount: number;
  growthRatePct: number;
  avgPerWeek: number;
  activeSubmissionDays: number;
  peakDay: ProjectSubmissionPeakDay | null;
}

export interface ComputeProjectSubmissionsGrowthOptions {
  referenceDate?: Date | string;
  windowDays?: number;
}

export function toUtcDateKey(input: Date | string | undefined | null): string | null {
  if (!input) return null;
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return null;
    return input.toISOString().slice(0, 10);
  }
  const trimmed = String(input).trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parsed = new Date(`${trimmed}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== trimmed) {
      return null;
    }
    return trimmed;
  }
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function addUtcDays(dateKey: string, offsetDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + offsetDays));
  return dt.toISOString().slice(0, 10);
}

export function computeProjectSubmissionsGrowth(
  projects: ReadonlyArray<CatalogProject>,
  options: ComputeProjectSubmissionsGrowthOptions = {}
): ProjectSubmissionsGrowthSummary {
  const windowDays = Math.max(1, Math.min(365, Math.round(options.windowDays ?? 30)));
  const windowEndDate =
    toUtcDateKey(options.referenceDate) ?? new Date().toISOString().slice(0, 10);
  const windowStartDate = addUtcDays(windowEndDate, -(windowDays - 1));

  const buckets = new Map<string, CatalogProject[]>();
  let baselineBeforeWindow = 0;

  for (const proj of projects) {
    const dayKey = toUtcDateKey(proj.createdAtIso);
    if (!dayKey) continue;
    if (dayKey < windowStartDate) {
      baselineBeforeWindow += 1;
      continue;
    }
    if (dayKey > windowEndDate) {
      continue;
    }
    const existing = buckets.get(dayKey);
    if (existing) {
      existing.push(proj);
    } else {
      buckets.set(dayKey, [proj]);
    }
  }

  const points: ProjectSubmissionDayPoint[] = [];
  let runningCumulative = baselineBeforeWindow;
  let totalSubmissions30d = 0;
  let makerSubmissions30d = 0;
  let activeSubmissionDays = 0;
  let peakDay: ProjectSubmissionPeakDay | null = null;

  for (let i = 0; i < windowDays; i += 1) {
    const date = addUtcDays(windowStartDate, i);
    const items = buckets.get(date) ?? [];
    const dailySubmissions = items.length;
    const makerSubmissions = items.filter(
      (p) => p.provenanceSource === 'maker_submitted' || !p.isCuratedSeed
    ).length;
    const curatedOrSynced = dailySubmissions - makerSubmissions;

    runningCumulative += dailySubmissions;
    totalSubmissions30d += dailySubmissions;
    makerSubmissions30d += makerSubmissions;
    if (dailySubmissions > 0) {
      activeSubmissionDays += 1;
    }

    const trailingStart = Math.max(0, i - 6);
    let trailingSum = dailySubmissions;
    for (let j = trailingStart; j < i; j += 1) {
      trailingSum += points[j].dailySubmissions;
    }
    const trailingCount = i - trailingStart + 1;
    const rolling7dAvg = Math.round((trailingSum / trailingCount) * 100) / 100;

    const projectNames = items.map((p) => p.name);
    const projectSlugs = items.map((p) => p.slug);
    const shortDate = date.slice(5);

    points.push({
      date,
      shortDate,
      dailySubmissions,
      makerSubmissions,
      curatedOrSynced,
      cumulativeProjects: runningCumulative,
      rolling7dAvg,
      projectNames,
      projectSlugs,
    });

    if (
      dailySubmissions > 0 &&
      (!peakDay ||
        dailySubmissions > peakDay.count ||
        (dailySubmissions === peakDay.count && date > peakDay.date))
    ) {
      peakDay = {
        date,
        shortDate,
        count: dailySubmissions,
        projectNames,
      };
    }
  }

  const splitIdx = Math.floor(windowDays / 2);
  const previousHalfCount = points
    .slice(0, splitIdx)
    .reduce((acc, pt) => acc + pt.dailySubmissions, 0);
  const recentHalfCount = points
    .slice(splitIdx)
    .reduce((acc, pt) => acc + pt.dailySubmissions, 0);

  const growthRatePct =
    baselineBeforeWindow > 0
      ? Math.round((totalSubmissions30d / baselineBeforeWindow) * 100)
      : totalSubmissions30d > 0
        ? 100
        : 0;

  const weeks = windowDays / 7;
  const avgPerWeek =
    weeks > 0 ? Math.round((totalSubmissions30d / weeks) * 10) / 10 : 0;

  return {
    windowDays,
    windowStartDate,
    windowEndDate,
    points,
    baselineBeforeWindow,
    totalSubmissions30d,
    makerSubmissions30d,
    totalCatalogProjects: baselineBeforeWindow + totalSubmissions30d,
    recentHalfCount,
    previousHalfCount,
    growthRatePct,
    avgPerWeek,
    activeSubmissionDays,
    peakDay,
  };
}
