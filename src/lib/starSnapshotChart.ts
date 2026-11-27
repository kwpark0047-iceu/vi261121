import type { CatalogProject } from '../types/vibeatlas';
import { loadStarSnapshots } from './starHistory';

export type StarSnapshotRange = '7d' | '30d' | 'all';

export type StarSnapshotChartStatus = 'trend' | 'single_snapshot' | 'unsynced' | 'no_repo';

export interface StarSnapshotChartPoint {
  date: string;
  shortDate: string;
  stars: number;
  dailyDelta: number;
  cumulativeGain: number;
}

export interface StarSnapshotChartSeries {
  status: StarSnapshotChartStatus;
  range: StarSnapshotRange;
  allPoints: StarSnapshotChartPoint[];
  points: StarSnapshotChartPoint[];
  snapshotCount: number;
  latestStars: number;
  periodNetDelta: number;
  periodPctChange: number | null;
  avgDailyDelta: number;
  peakDailyGain: {
    date: string;
    shortDate: string;
    delta: number;
  } | null;
  firstDate: string | null;
  lastDate: string | null;
}

const DAY_MS = 86_400_000;

function parseIsoDayMs(dayStr: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayStr)) return null;
  const parsed = Date.parse(`${dayStr}T00:00:00.000Z`);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatShortDate(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[1]}-${parts[2]}`;
  }
  return isoDate.slice(5, 10) || isoDate;
}

function toIsoDay(timestamp: string): string | null {
  if (!timestamp) return null;
  const ms = Date.parse(timestamp);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString().slice(0, 10);
}

export function buildStarSnapshotChartSeries(
  project: Pick<CatalogProject, 'githubRepo' | 'githubStars' | 'lastSyncedAt'>,
  range: StarSnapshotRange = '30d',
  explicitSnapshots?: Record<string, number>
): StarSnapshotChartSeries {
  const repo = project.githubRepo?.trim() || '';
  if (!repo) {
    return {
      status: 'no_repo',
      range,
      allPoints: [],
      points: [],
      snapshotCount: 0,
      latestStars: 0,
      periodNetDelta: 0,
      periodPctChange: null,
      avgDailyDelta: 0,
      peakDailyGain: null,
      firstDate: null,
      lastDate: null,
    };
  }

  const stored = explicitSnapshots ?? loadStarSnapshots(repo);
  const mergedMap = new Map<string, number>();

  for (const [day, count] of Object.entries(stored)) {
    if (parseIsoDayMs(day) !== null && Number.isFinite(count) && count >= 0) {
      mergedMap.set(day, Math.round(count));
    }
  }

  const syncedDay = toIsoDay(project.lastSyncedAt);
  const syncedStars = Math.max(0, Math.round(Number(project.githubStars) || 0));
  if (syncedDay && syncedStars > 0) {
    const existingForDay = mergedMap.get(syncedDay);
    if (existingForDay === undefined || syncedStars > existingForDay) {
      mergedMap.set(syncedDay, syncedStars);
    }
  }

  const sortedEntries = Array.from(mergedMap.entries())
    .map(([date, stars]) => ({
      date,
      ms: parseIsoDayMs(date)!,
      stars,
    }))
    .sort((a, b) => a.ms - b.ms);

  if (sortedEntries.length === 0) {
    return {
      status: 'unsynced',
      range,
      allPoints: [],
      points: [],
      snapshotCount: 0,
      latestStars: 0,
      periodNetDelta: 0,
      periodPctChange: null,
      avgDailyDelta: 0,
      peakDailyGain: null,
      firstDate: null,
      lastDate: null,
    };
  }

  const firstAllStars = sortedEntries[0].stars;
  const allPoints: StarSnapshotChartPoint[] = sortedEntries.map((entry, idx) => {
    const prevStars = idx > 0 ? sortedEntries[idx - 1].stars : entry.stars;
    const dailyDelta = idx > 0 ? entry.stars - prevStars : 0;
    return {
      date: entry.date,
      shortDate: formatShortDate(entry.date),
      stars: entry.stars,
      dailyDelta,
      cumulativeGain: entry.stars - firstAllStars,
    };
  });

  let slicedEntries = sortedEntries;
  if (range !== 'all' && sortedEntries.length > 1) {
    const latestMs = sortedEntries[sortedEntries.length - 1].ms;
    const windowDays = range === '7d' ? 7 : 30;
    const cutoffMs = latestMs - (windowDays - 1) * DAY_MS;
    const withinRange = sortedEntries.filter((e) => e.ms >= cutoffMs);
    slicedEntries = withinRange.length > 0 ? withinRange : sortedEntries.slice(-1);
  }

  const firstWindowStars = slicedEntries[0].stars;
  const points: StarSnapshotChartPoint[] = slicedEntries.map((entry) => {
    const match = allPoints.find((p) => p.date === entry.date)!;
    return {
      ...match,
      cumulativeGain: entry.stars - firstWindowStars,
    };
  });

  const latestPoint = points[points.length - 1];
  const firstPoint = points[0];
  const periodNetDelta = latestPoint.stars - firstPoint.stars;
  const periodPctChange =
    firstPoint.stars > 0 && points.length >= 2
      ? Number(((periodNetDelta / firstPoint.stars) * 100).toFixed(2))
      : null;

  const firstMs = parseIsoDayMs(firstPoint.date)!;
  const lastMs = parseIsoDayMs(latestPoint.date)!;
  const elapsedDays = Math.max(1, Math.round((lastMs - firstMs) / DAY_MS));
  const avgDailyDelta =
    points.length >= 2 ? Number((periodNetDelta / elapsedDays).toFixed(1)) : 0;

  let peakDailyGain: StarSnapshotChartSeries['peakDailyGain'] = null;
  for (let i = 1; i < points.length; i += 1) {
    const pt = points[i];
    if (!peakDailyGain || pt.dailyDelta > peakDailyGain.delta) {
      peakDailyGain = {
        date: pt.date,
        shortDate: pt.shortDate,
        delta: pt.dailyDelta,
      };
    }
  }

  const status: StarSnapshotChartStatus =
    allPoints.length >= 2 ? 'trend' : 'single_snapshot';

  return {
    status,
    range,
    allPoints,
    points,
    snapshotCount: allPoints.length,
    latestStars: latestPoint.stars,
    periodNetDelta,
    periodPctChange,
    avgDailyDelta,
    peakDailyGain,
    firstDate: firstPoint.date,
    lastDate: latestPoint.date,
  };
}

export function computeSnapshotStarDomain(
  points: ReadonlyArray<StarSnapshotChartPoint>
): [number, number] {
  if (points.length === 0) return [0, 100];
  let min = points[0].stars;
  let max = points[0].stars;
  for (const pt of points) {
    if (pt.stars < min) min = pt.stars;
    if (pt.stars > max) max = pt.stars;
  }
  if (min === max) {
    const pad = Math.max(10, Math.round(max * 0.08));
    return [Math.max(0, min - pad), max + pad];
  }
  const span = max - min;
  const pad = Math.max(2, Math.ceil(span * 0.16));
  return [Math.max(0, min - pad), max + pad];
}
