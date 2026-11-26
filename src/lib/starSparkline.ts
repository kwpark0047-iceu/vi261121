import type { CatalogProject } from '../types/vibeatlas';

export interface SevenDaySparklinePoint {
  date: string;
  shortDate: string;
  stars: number;
  delta: number;
}

export type SevenDaySparklineStatus = 'trend' | 'baseline' | 'unsynced';

export interface SevenDayStarSparkline {
  points: SevenDaySparklinePoint[];
  status: SevenDaySparklineStatus;
  latestStars: number;
  netDelta7d: number;
  snapshotCount: number;
}

const DAY_MS = 86_400_000;
const WINDOW_DAYS = 7;

function toUtcDayStartMs(ms: number): number {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function parseIsoDayMs(dayStr: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayStr)) return null;
  const parsed = Date.parse(`${dayStr}T00:00:00.000Z`);
  return Number.isNaN(parsed) ? null : parsed;
}

function formatUtcDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function formatShortDate(isoDate: string): string {
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[1]}-${parts[2]}`;
  }
  return isoDate.slice(5, 10) || isoDate;
}

export function buildSevenDayStarSparkline(
  project: Pick<
    CatalogProject,
    'githubRepo' | 'githubStars' | 'lastSyncedAt' | 'historicalSignals'
  >,
  repoSnapshots: Record<string, number> = {},
  nowMs: number = Date.now()
): SevenDayStarSparkline {
  if (!project.githubRepo || !project.githubRepo.trim()) {
    return {
      points: [],
      status: 'unsynced',
      latestStars: 0,
      netDelta7d: 0,
      snapshotCount: 0,
    };
  }

  const sortedSnapshots = Object.entries(repoSnapshots)
    .map(([day, count]) => ({
      day,
      dayMs: parseIsoDayMs(day),
      stars: Number(count),
    }))
    .filter(
      (item): item is { day: string; dayMs: number; stars: number } =>
        item.dayMs !== null && Number.isFinite(item.stars) && item.stars >= 0
    )
    .sort((a, b) => a.dayMs - b.dayMs);

  const syncedStars =
    project.lastSyncedAt || Number(project.githubStars) > 0
      ? Math.max(0, Math.round(Number(project.githubStars) || 0))
      : 0;

  const latestRecordedStars =
    sortedSnapshots.length > 0 ? Math.round(sortedSnapshots[sortedSnapshots.length - 1].stars) : 0;

  const signalDeltasByDay = new Map<string, number>();
  let hasNonZeroSignalDelta = false;
  if (Array.isArray(project.historicalSignals)) {
    for (const pt of project.historicalSignals) {
      if (parseIsoDayMs(pt.date) === null) continue;
      const delta = Math.max(0, Math.round(Number(pt.githubStarsDelta) || 0));
      if (delta > 0) {
        hasNonZeroSignalDelta = true;
      }
      signalDeltasByDay.set(pt.date, (signalDeltasByDay.get(pt.date) ?? 0) + delta);
    }
  }

  if (sortedSnapshots.length === 0 && syncedStars === 0 && !hasNonZeroSignalDelta) {
    return {
      points: [],
      status: 'unsynced',
      latestStars: 0,
      netDelta7d: 0,
      snapshotCount: 0,
    };
  }

  const todayUtcMs = toUtcDayStartMs(nowMs);
  const latestSnapMs =
    sortedSnapshots.length > 0 ? sortedSnapshots[sortedSnapshots.length - 1].dayMs : todayUtcMs;
  // Allow +1 UTC day ahead for local-timezone snapshot dates on the current day
  const windowEndMs =
    latestSnapMs > todayUtcMs && latestSnapMs - todayUtcMs <= DAY_MS ? latestSnapMs : todayUtcMs;
  const windowStartMs = windowEndMs - (WINDOW_DAYS - 1) * DAY_MS;

  const windowDays: string[] = [];
  for (let i = 0; i < WINDOW_DAYS; i += 1) {
    windowDays.push(formatUtcDay(windowStartMs + i * DAY_MS));
  }

  // Case 1: Multi-day recorded snapshots in vibeatlas_star_snapshots_v1
  if (sortedSnapshots.length >= 2) {
    const beforeWindow = sortedSnapshots.filter((s) => s.dayMs < windowStartMs);
    const inWindow = sortedSnapshots.filter(
      (s) => s.dayMs >= windowStartMs && s.dayMs <= windowEndMs
    );

    if (inWindow.length === 0) {
      const flatStars = Math.max(syncedStars, latestRecordedStars);
      if (flatStars === 0) {
        return {
          points: [],
          status: 'unsynced',
          latestStars: 0,
          netDelta7d: 0,
          snapshotCount: sortedSnapshots.length,
        };
      }
      return {
        points: windowDays.map((day) => ({
          date: day,
          shortDate: formatShortDate(day),
          stars: flatStars,
          delta: 0,
        })),
        status: 'baseline',
        latestStars: flatStars,
        netDelta7d: 0,
        snapshotCount: sortedSnapshots.length,
      };
    }

    const baselineBefore = beforeWindow.length > 0 ? beforeWindow[beforeWindow.length - 1] : null;
    const snapMap = new Map(sortedSnapshots.map((s) => [s.day, Math.round(s.stars)]));

    let running = baselineBefore ? Math.round(baselineBefore.stars) : Math.round(inWindow[0].stars);
    const points: SevenDaySparklinePoint[] = windowDays.map((day, idx) => {
      let nextStars = snapMap.has(day) ? snapMap.get(day)! : running;
      if (idx === WINDOW_DAYS - 1 && !snapMap.has(day) && syncedStars > nextStars) {
        nextStars = syncedStars;
      }
      const prevReference = idx === 0 ? (baselineBefore ? Math.round(baselineBefore.stars) : nextStars) : running;
      const delta = nextStars - prevReference;
      running = nextStars;
      return {
        date: day,
        shortDate: formatShortDate(day),
        stars: nextStars,
        delta,
      };
    });

    const latestStars = points[points.length - 1].stars;
    const baselineStartStars = baselineBefore ? Math.round(baselineBefore.stars) : points[0].stars;
    const netDelta7d = latestStars - baselineStartStars;
    const hasVariation =
      netDelta7d !== 0 || points.some((pt) => pt.stars !== points[0].stars);

    return {
      points,
      status: hasVariation ? 'trend' : 'baseline',
      latestStars,
      netDelta7d,
      snapshotCount: sortedSnapshots.length,
    };
  }

  // Case 2: Reconstruct 7-day trend from historicalSignals star deltas if available
  const latestKnownStars = Math.max(syncedStars, latestRecordedStars);
  const windowSignalDeltas = windowDays.map((day) => signalDeltasByDay.get(day) ?? 0);
  const hasWindowSignalDeltas = windowSignalDeltas.some((d) => d > 0);

  if (hasWindowSignalDeltas) {
    const counts = new Array<number>(WINDOW_DAYS).fill(0);
    let running = latestKnownStars;
    counts[WINDOW_DAYS - 1] = running;
    for (let i = WINDOW_DAYS - 2; i >= 0; i -= 1) {
      running = Math.max(0, running - windowSignalDeltas[i + 1]);
      counts[i] = running;
    }
    const netDelta7d = windowSignalDeltas.reduce((acc, val) => acc + val, 0);
    return {
      points: windowDays.map((day, idx) => ({
        date: day,
        shortDate: formatShortDate(day),
        stars: counts[idx],
        delta: windowSignalDeltas[idx],
      })),
      status: 'trend',
      latestStars: counts[counts.length - 1],
      netDelta7d,
      snapshotCount: sortedSnapshots.length,
    };
  }

  // Case 3: Single snapshot or synced count without multi-day deltas -> honest flat baseline
  if (latestKnownStars > 0) {
    return {
      points: windowDays.map((day) => ({
        date: day,
        shortDate: formatShortDate(day),
        stars: latestKnownStars,
        delta: 0,
      })),
      status: 'baseline',
      latestStars: latestKnownStars,
      netDelta7d: 0,
      snapshotCount: Math.max(sortedSnapshots.length, project.lastSyncedAt ? 1 : 0),
    };
  }

  return {
    points: [],
    status: 'unsynced',
    latestStars: 0,
    netDelta7d: 0,
    snapshotCount: 0,
  };
}

export function computeSparklineYDomain(points: ReadonlyArray<SevenDaySparklinePoint>): [number, number] {
  if (points.length === 0) return [0, 10];
  let min = points[0].stars;
  let max = points[0].stars;
  for (const pt of points) {
    if (pt.stars < min) min = pt.stars;
    if (pt.stars > max) max = pt.stars;
  }
  if (min === max) {
    const pad = Math.max(5, Math.round(max * 0.05));
    return [Math.max(0, min - pad), max + pad];
  }
  const span = max - min;
  const pad = Math.max(1, Math.round(span * 0.14));
  return [Math.max(0, min - pad), max + pad];
}
