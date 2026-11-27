import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStarSnapshotChartSeries, computeSnapshotStarDomain } from './starSnapshotChart';

test('returns no_repo status when project has no GitHub repository', () => {
  const series = buildStarSnapshotChartSeries({
    githubRepo: '',
    githubStars: 0,
    lastSyncedAt: '',
  });
  assert.equal(series.status, 'no_repo');
  assert.equal(series.points.length, 0);
  assert.equal(series.snapshotCount, 0);
});

test('returns unsynced status when repo has no snapshots and has never been synced', () => {
  const series = buildStarSnapshotChartSeries(
    {
      githubRepo: 'org/example',
      githubStars: 0,
      lastSyncedAt: '',
    },
    '30d',
    {}
  );
  assert.equal(series.status, 'unsynced');
  assert.equal(series.points.length, 0);
});

test('returns single_snapshot when synced once without prior snapshots', () => {
  const series = buildStarSnapshotChartSeries(
    {
      githubRepo: 'org/example',
      githubStars: 1450,
      lastSyncedAt: '2026-11-27T04:00:00.000Z',
    },
    '30d',
    {}
  );
  assert.equal(series.status, 'single_snapshot');
  assert.equal(series.snapshotCount, 1);
  assert.equal(series.latestStars, 1450);
  assert.equal(series.points[0]?.date, '2026-11-27');
  assert.equal(series.periodNetDelta, 0);
});

test('builds multi-day trend series and calculates net delta, avg velocity, peak day, and range slicing', () => {
  const snapshots: Record<string, number> = {
    '2026-11-10': 1000,
    '2026-11-15': 1080,
    '2026-11-21': 1150,
    '2026-11-23': 1210,
    '2026-11-25': 1310,
    '2026-11-27': 1350,
  };

  const allSeries = buildStarSnapshotChartSeries(
    {
      githubRepo: 'org/example',
      githubStars: 1350,
      lastSyncedAt: '2026-11-27T04:00:00.000Z',
    },
    'all',
    snapshots
  );

  assert.equal(allSeries.status, 'trend');
  assert.equal(allSeries.snapshotCount, 6);
  assert.equal(allSeries.points.length, 6);
  assert.equal(allSeries.periodNetDelta, 350);
  assert.equal(allSeries.periodPctChange, 35);
  assert.equal(allSeries.peakDailyGain?.date, '2026-11-25');
  assert.equal(allSeries.peakDailyGain?.delta, 100);

  const sevenDaySeries = buildStarSnapshotChartSeries(
    {
      githubRepo: 'org/example',
      githubStars: 1350,
      lastSyncedAt: '2026-11-27T04:00:00.000Z',
    },
    '7d',
    snapshots
  );

  assert.equal(sevenDaySeries.points.length, 4);
  assert.equal(sevenDaySeries.firstDate, '2026-11-21');
  assert.equal(sevenDaySeries.lastDate, '2026-11-27');
  assert.equal(sevenDaySeries.periodNetDelta, 200);
});

test('computes padded Y domain so small star gains remain visually legible', () => {
  const domain = computeSnapshotStarDomain([
    { date: '2026-11-25', shortDate: '11-25', stars: 1000, dailyDelta: 0, cumulativeGain: 0 },
    { date: '2026-11-26', shortDate: '11-26', stars: 1020, dailyDelta: 20, cumulativeGain: 20 },
  ]);
  assert.ok(domain[0] >= 990 && domain[0] < 1000);
  assert.ok(domain[1] > 1020 && domain[1] <= 1030);
});
