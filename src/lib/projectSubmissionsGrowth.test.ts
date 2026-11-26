import test from 'node:test';
import assert from 'node:assert/strict';
import type { CatalogProject } from '../types/vibeatlas.ts';
import {
  addUtcDays,
  computeProjectSubmissionsGrowth,
  toUtcDateKey,
} from './projectSubmissionsGrowth.ts';

function makeProject(overrides: Partial<CatalogProject> = {}): CatalogProject {
  return {
    id: 'p1',
    slug: 'p1',
    name: 'Project 1',
    tagline: 'Tagline',
    taglineKo: '소개',
    description: 'Description',
    descriptionKo: '',
    contentType: 'mcp_server',
    categories: ['Developer Tools'],
    techStack: ['TypeScript'],
    developmentPlatform: 'claude_code',
    hostingProvider: 'vercel',
    backendTech: 'nodejs',
    country: 'US',
    language: 'en',
    license: 'MIT',
    pricingModel: 'open_source',
    verificationStatus: 'verified',
    provenanceSource: 'maker_submitted',
    liveDemoUrl: '',
    websiteUrl: '',
    githubRepo: 'org/p1',
    githubUrl: 'https://github.com/org/p1',
    thumbnailUrl: '',
    makerName: 'Maker',
    makerHandle: '@maker',
    ownerUid: 'u1',
    githubStars: 100,
    githubForks: 10,
    likesCount: 5,
    bookmarksCount: 10,
    lastSyncedAt: '2026-11-26T00:00:00.000Z',
    createdAtIso: '2026-11-15T00:00:00.000Z',
    updatedAtIso: '2026-11-26T00:00:00.000Z',
    ...overrides,
  };
}

test('toUtcDateKey and addUtcDays normalize and shift calendar dates reliably', () => {
  assert.equal(toUtcDateKey('2026-11-26T14:30:00.000Z'), '2026-11-26');
  assert.equal(toUtcDateKey('2026-11-01'), '2026-11-01');
  assert.equal(toUtcDateKey('invalid-date'), null);
  assert.equal(toUtcDateKey('2026-02-30'), null);
  assert.equal(addUtcDays('2026-11-26', -29), '2026-10-28');
  assert.equal(addUtcDays('2026-11-01', -1), '2026-10-31');
});

test('computeProjectSubmissionsGrowth builds continuous 30-day series with baseline and cumulative totals', () => {
  const projects = [
    // Prior to 30d window (before 2026-10-28) -> baseline = 2
    makeProject({
      id: 'old-1',
      slug: 'old-1',
      name: 'Older Repo',
      createdAtIso: '2026-09-15T08:00:00.000Z',
      provenanceSource: 'github_sync',
      isCuratedSeed: true,
    }),
    makeProject({
      id: 'old-2',
      slug: 'old-2',
      name: 'Pre-Window Tool',
      createdAtIso: '2026-10-20T08:00:00.000Z',
      provenanceSource: 'github_sync',
      isCuratedSeed: true,
    }),
    // Inside window: first day 2026-10-28 (+1)
    makeProject({
      id: 'w-start',
      slug: 'w-start',
      name: 'Boundary Tool',
      createdAtIso: '2026-10-28T08:00:00.000Z',
      provenanceSource: 'github_sync',
      isCuratedSeed: true,
    }),
    // Inside window: peak day 2026-11-20 (+2)
    makeProject({
      id: 'peak-1',
      slug: 'peak-1',
      name: 'Seoul Agent',
      createdAtIso: '2026-11-20T05:00:00.000Z',
      provenanceSource: 'maker_submitted',
    }),
    makeProject({
      id: 'peak-2',
      slug: 'peak-2',
      name: 'MCP Bridge',
      createdAtIso: '2026-11-20T18:00:00.000Z',
      provenanceSource: 'maker_submitted',
    }),
    // Inside window: last day 2026-11-26 (+1)
    makeProject({
      id: 'today-1',
      slug: 'today-1',
      name: 'Today Launch',
      createdAtIso: '2026-11-26T02:00:00.000Z',
      provenanceSource: 'maker_submitted',
    }),
  ];

  const summary = computeProjectSubmissionsGrowth(projects, {
    referenceDate: '2026-11-26',
    windowDays: 30,
  });

  assert.equal(summary.windowDays, 30);
  assert.equal(summary.windowStartDate, '2026-10-28');
  assert.equal(summary.windowEndDate, '2026-11-26');
  assert.equal(summary.points.length, 30);
  assert.equal(summary.baselineBeforeWindow, 2);
  assert.equal(summary.totalSubmissions30d, 4);
  assert.equal(summary.makerSubmissions30d, 3);
  assert.equal(summary.totalCatalogProjects, 6);
  assert.equal(summary.activeSubmissionDays, 3);
  assert.equal(summary.growthRatePct, 200);
  assert.equal(summary.points[0].date, '2026-10-28');
  assert.equal(summary.points[0].dailySubmissions, 1);
  assert.equal(summary.points[0].cumulativeProjects, 3);
  assert.equal(summary.points[29].date, '2026-11-26');
  assert.equal(summary.points[29].dailySubmissions, 1);
  assert.equal(summary.points[29].cumulativeProjects, 6);
  assert.deepEqual(summary.peakDay, {
    date: '2026-11-20',
    shortDate: '11-20',
    count: 2,
    projectNames: ['Seoul Agent', 'MCP Bridge'],
  });
});

test('computeProjectSubmissionsGrowth computes trailing 7-day rolling averages and handles empty input', () => {
  const empty = computeProjectSubmissionsGrowth([], { referenceDate: '2026-11-26' });
  assert.equal(empty.points.length, 30);
  assert.equal(empty.totalSubmissions30d, 0);
  assert.equal(empty.totalCatalogProjects, 0);
  assert.equal(empty.peakDay, null);
  assert.equal(empty.growthRatePct, 0);
  assert.equal(empty.avgPerWeek, 0);

  const burst = [
    makeProject({ id: 'b1', createdAtIso: '2026-11-20T00:00:00.000Z' }),
    makeProject({ id: 'b2', createdAtIso: '2026-11-21T00:00:00.000Z' }),
    makeProject({ id: 'b3', createdAtIso: '2026-11-22T00:00:00.000Z' }),
    makeProject({ id: 'b4', createdAtIso: '2026-11-23T00:00:00.000Z' }),
    makeProject({ id: 'b5', createdAtIso: '2026-11-24T00:00:00.000Z' }),
    makeProject({ id: 'b6', createdAtIso: '2026-11-25T00:00:00.000Z' }),
    makeProject({ id: 'b7', createdAtIso: '2026-11-26T00:00:00.000Z' }),
  ];

  const burstSummary = computeProjectSubmissionsGrowth(burst, {
    referenceDate: '2026-11-26',
    windowDays: 30,
  });
  assert.equal(burstSummary.points[29].rolling7dAvg, 1);
  assert.equal(burstSummary.recentHalfCount, 7);
  assert.equal(burstSummary.previousHalfCount, 0);
});
