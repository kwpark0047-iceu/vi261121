import test from 'node:test';
import assert from 'node:assert/strict';
import type { CatalogProject } from '../types/vibeatlas.ts';
import type { EngagementTrendingInfo } from './trendingEngagement.ts';
import { computeDiscoverSummaryStats } from './discoverSummaryStats.ts';

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
    createdAtIso: '2026-11-01T00:00:00.000Z',
    updatedAtIso: '2026-11-26T00:00:00.000Z',
    ...overrides,
  };
}

test('computeDiscoverSummaryStats calculates total, verified, filtered counts, and most popular category', () => {
  const projects = [
    makeProject({ id: '1', slug: '1', contentType: 'mcp_server', categories: ['MCP'] }),
    makeProject({ id: '2', slug: '2', contentType: 'mcp_server', categories: ['MCP'] }),
    makeProject({
      id: '3',
      slug: '3',
      contentType: 'mcp_server',
      categories: ['MCP'],
      verificationStatus: 'pending',
    }),
    makeProject({ id: '4', slug: '4', contentType: 'ai_agent', categories: ['AI Agent'] }),
  ];

  const stats = computeDiscoverSummaryStats(projects, {
    filteredProjects: projects.slice(0, 2),
  });

  assert.equal(stats.totalProjects, 4);
  assert.equal(stats.filteredProjects, 2);
  assert.equal(stats.verifiedCount, 3);
  assert.ok(stats.mostPopularCategory);
  assert.equal(stats.mostPopularCategory.tabId, 'mcp');
  assert.equal(stats.mostPopularCategory.count, 3);
  assert.equal(stats.mostPopularCategory.sharePct, 75);
});

test('computeDiscoverSummaryStats prefers verified 7d GitHub star gains when recorded', () => {
  const projects = [
    makeProject({ id: 'a', slug: 'alpha', name: 'Alpha MCP' }),
    makeProject({ id: 'b', slug: 'beta', name: 'Beta Agent', contentType: 'ai_agent' }),
  ];

  const starGains = new Map<string, number>([
    ['a', 120],
    ['b', 450],
  ]);
  const engScores = new Map<string, Omit<EngagementTrendingInfo, 'rank'>>([
    [
      'a',
      {
        likesGained7d: 4,
        bookmarksGained7d: 8,
        totalGained7d: 12,
        growthRatePct7d: 25,
        trendingScore: 20,
        source: 'signals_7d',
      },
    ],
  ]);

  const stats = computeDiscoverSummaryStats(projects, {
    starGains7dMap: starGains,
    engagementScoresMap: engScores,
  });

  assert.equal(stats.recentGrowth.metricKind, 'stars');
  assert.equal(stats.recentGrowth.totalGain7d, 570);
  assert.equal(stats.recentGrowth.risingProjectsCount, 2);
  assert.deepEqual(stats.recentGrowth.topProject, {
    id: 'b',
    slug: 'beta',
    name: 'Beta Agent',
    gain7d: 450,
  });
});

test('computeDiscoverSummaryStats falls back honestly to 7d engagement signals when star deltas are zero', () => {
  const projects = [
    makeProject({ id: 'a', slug: 'alpha', name: 'Alpha Tool' }),
    makeProject({ id: 'b', slug: 'beta', name: 'Beta Tool' }),
  ];

  const engScores = new Map<string, Omit<EngagementTrendingInfo, 'rank'>>([
    [
      'a',
      {
        likesGained7d: 10,
        bookmarksGained7d: 20,
        totalGained7d: 30,
        growthRatePct7d: 40,
        trendingScore: 50,
        source: 'signals_7d',
      },
    ],
    [
      'b',
      {
        likesGained7d: 5,
        bookmarksGained7d: 7,
        totalGained7d: 12,
        growthRatePct7d: 15,
        trendingScore: 20,
        source: 'signals_7d',
      },
    ],
  ]);

  const stats = computeDiscoverSummaryStats(projects, {
    starGains7dMap: new Map(),
    engagementScoresMap: engScores,
  });

  assert.equal(stats.recentGrowth.metricKind, 'engagement');
  assert.equal(stats.recentGrowth.totalGain7d, 42);
  assert.equal(stats.recentGrowth.risingProjectsCount, 2);
  assert.equal(stats.recentGrowth.topProject?.name, 'Alpha Tool');
});

test('computeDiscoverSummaryStats handles empty catalog gracefully', () => {
  const stats = computeDiscoverSummaryStats([]);
  assert.equal(stats.totalProjects, 0);
  assert.equal(stats.filteredProjects, 0);
  assert.equal(stats.verifiedCount, 0);
  assert.equal(stats.mostPopularCategory, null);
  assert.equal(stats.recentGrowth.metricKind, 'none');
  assert.equal(stats.recentGrowth.topProject, null);
});
