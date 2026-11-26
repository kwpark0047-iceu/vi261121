import test from 'node:test';
import assert from 'node:assert/strict';
import type { CatalogProject } from '../types/vibeatlas.ts';
import { recordStarSnapshot } from './starHistory.ts';
import { loadAllStarSnapshots } from './trendingStars.ts';
import { buildSevenDayStarSparkline, computeSparklineYDomain } from './starSparkline.ts';

function makeMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? (map.get(key) ?? null) : null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, value);
    },
  };
}

function makeProject(
  overrides: Partial<
    Pick<CatalogProject, 'githubRepo' | 'githubStars' | 'lastSyncedAt' | 'historicalSignals'>
  > = {}
) {
  return {
    githubRepo: 'modelcontextprotocol/servers',
    githubStars: 0,
    lastSyncedAt: '',
    historicalSignals: undefined,
    ...overrides,
  };
}

const NOW_MS = Date.parse('2026-11-26T12:00:00.000Z');

test('buildSevenDayStarSparkline builds a 7-day trend from stored star snapshots', () => {
  const storage = makeMemoryStorage();
  recordStarSnapshot('modelcontextprotocol/servers', '2026-11-20T09:00:00.000Z', 14000, storage);
  recordStarSnapshot('modelcontextprotocol/servers', '2026-11-21T09:00:00.000Z', 14040, storage);
  recordStarSnapshot('modelcontextprotocol/servers', '2026-11-23T09:00:00.000Z', 14120, storage);
  recordStarSnapshot('modelcontextprotocol/servers', '2026-11-26T09:00:00.000Z', 14250, storage);

  const allSnapshots = loadAllStarSnapshots(storage);
  const sparkline = buildSevenDayStarSparkline(
    makeProject(),
    allSnapshots['modelcontextprotocol/servers'],
    NOW_MS
  );

  assert.equal(sparkline.status, 'trend');
  assert.equal(sparkline.points.length, 7);
  assert.equal(sparkline.latestStars, 14250);
  assert.equal(sparkline.netDelta7d, 250);
  assert.deepEqual(
    sparkline.points.map((p) => p.date),
    [
      '2026-11-20',
      '2026-11-21',
      '2026-11-22',
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
      '2026-11-26',
    ]
  );
  assert.deepEqual(
    sparkline.points.map((p) => p.stars),
    [14000, 14040, 14040, 14120, 14120, 14120, 14250]
  );
});

test('buildSevenDayStarSparkline anchors day 1 to a pre-window snapshot when available', () => {
  const sparkline = buildSevenDayStarSparkline(
    makeProject({ githubStars: 1120, lastSyncedAt: '2026-11-26T08:00:00.000Z' }),
    {
      '2026-11-18': 950,
      '2026-11-22': 1030,
      '2026-11-26': 1120,
    },
    NOW_MS
  );

  assert.equal(sparkline.status, 'trend');
  assert.equal(sparkline.netDelta7d, 170);
  assert.deepEqual(
    sparkline.points.map((p) => p.stars),
    [950, 950, 1030, 1030, 1030, 1030, 1120]
  );
});

test('buildSevenDayStarSparkline does not drop to zero before the first in-window snapshot', () => {
  const sparkline = buildSevenDayStarSparkline(
    makeProject({ githubStars: 560, lastSyncedAt: '2026-11-26T08:00:00.000Z' }),
    {
      '2026-11-23': 500,
      '2026-11-26': 560,
    },
    NOW_MS
  );

  assert.equal(sparkline.status, 'trend');
  assert.equal(sparkline.netDelta7d, 60);
  assert.deepEqual(
    sparkline.points.map((p) => p.stars),
    [500, 500, 500, 500, 500, 500, 560]
  );
});

test('buildSevenDayStarSparkline returns honest flat baseline for single-snapshot synced projects', () => {
  const sparkline = buildSevenDayStarSparkline(
    makeProject({ githubStars: 1200, lastSyncedAt: '2026-11-26T08:00:00.000Z' }),
    { '2026-11-26': 1200 },
    NOW_MS
  );

  assert.equal(sparkline.status, 'baseline');
  assert.equal(sparkline.netDelta7d, 0);
  assert.equal(sparkline.latestStars, 1200);
  assert.deepEqual(
    sparkline.points.map((p) => p.stars),
    [1200, 1200, 1200, 1200, 1200, 1200, 1200]
  );
});

test('buildSevenDayStarSparkline returns unsynced with empty points when no snapshots or repo exist', () => {
  const unsyncedRepo = buildSevenDayStarSparkline(makeProject(), {}, NOW_MS);
  assert.equal(unsyncedRepo.status, 'unsynced');
  assert.equal(unsyncedRepo.points.length, 0);
  assert.equal(unsyncedRepo.latestStars, 0);

  const noRepo = buildSevenDayStarSparkline(
    makeProject({ githubRepo: '', githubStars: 500 }),
    { '2026-11-26': 500 },
    NOW_MS
  );
  assert.equal(noRepo.status, 'unsynced');
  assert.equal(noRepo.points.length, 0);
});

test('buildSevenDayStarSparkline reconstructs 7-day trend from historicalSignals deltas when snapshots absent', () => {
  const sparkline = buildSevenDayStarSparkline(
    makeProject({
      githubStars: 200,
      lastSyncedAt: '2026-11-26T00:00:00.000Z',
      historicalSignals: [
        { date: '2026-11-24', githubStarsDelta: 15, internalLikes: 4, internalBookmarks: 8 },
        { date: '2026-11-25', githubStarsDelta: 20, internalLikes: 5, internalBookmarks: 9 },
        { date: '2026-11-26', githubStarsDelta: 25, internalLikes: 6, internalBookmarks: 12 },
      ],
    }),
    {},
    NOW_MS
  );

  assert.equal(sparkline.status, 'trend');
  assert.equal(sparkline.netDelta7d, 60);
  assert.deepEqual(
    sparkline.points.map((p) => p.stars),
    [140, 140, 140, 140, 155, 175, 200]
  );
});

test('computeSparklineYDomain frames tight range for trends and centered band for baselines', () => {
  const trendDomain = computeSparklineYDomain([
    { date: '2026-11-20', shortDate: '11-20', stars: 14000, delta: 0 },
    { date: '2026-11-26', shortDate: '11-26', stars: 14250, delta: 250 },
  ]);
  assert.ok(trendDomain[0] >= 13900 && trendDomain[0] < 14000);
  assert.ok(trendDomain[1] > 14250 && trendDomain[1] <= 14350);

  const baselineDomain = computeSparklineYDomain([
    { date: '2026-11-20', shortDate: '11-20', stars: 1000, delta: 0 },
    { date: '2026-11-26', shortDate: '11-26', stars: 1000, delta: 0 },
  ]);
  assert.equal(baselineDomain[0], 950);
  assert.equal(baselineDomain[1], 1050);
});
