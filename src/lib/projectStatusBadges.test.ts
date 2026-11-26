import assert from 'node:assert/strict';
import test from 'node:test';
import { CURATED_SEED_PROJECTS } from '../data/seedCatalog';
import {
  isProjectOpenSource,
  resolveProjectStatusBadges,
} from './projectStatusBadges';

test('isProjectOpenSource accurately identifies open-source models and OSI licenses without false positives', () => {
  const mcpServer = CURATED_SEED_PROJECTS.find((p) => p.id === 'mcp-reference-servers')!;
  const kFounder = CURATED_SEED_PROJECTS.find((p) => p.id === 'seoul-vibe-ops-lovable')!;
  const supabase = CURATED_SEED_PROJECTS.find((p) => p.id === 'supabase-studio-stack')!;
  const hangulSkill = CURATED_SEED_PROJECTS.find((p) => p.id === 'hangul-prompt-lint-skill')!;
  const n8n = CURATED_SEED_PROJECTS.find((p) => p.id === 'n8n-ai-automation')!;
  const receiptMcp = CURATED_SEED_PROJECTS.find((p) => p.id === 'seoul-mcp-receipt-scanner')!;

  assert.equal(isProjectOpenSource(mcpServer), true);
  assert.equal(isProjectOpenSource(supabase), true);
  assert.equal(isProjectOpenSource(hangulSkill), true);
  assert.equal(isProjectOpenSource(kFounder), false);
  assert.equal(isProjectOpenSource(n8n), false);
  assert.equal(isProjectOpenSource(receiptMcp), false);
});

test('resolveProjectStatusBadges derives Verified, Pending, Unverified, Open Source, and Trending badges cleanly', () => {
  const mcpServer = CURATED_SEED_PROJECTS.find((p) => p.id === 'mcp-reference-servers')!;
  const receiptMcp = CURATED_SEED_PROJECTS.find((p) => p.id === 'seoul-mcp-receipt-scanner')!;
  const boltKit = CURATED_SEED_PROJECTS.find((p) => p.id === 'bolt-vite-starter-kit')!;

  const verifiedOpenTrending = resolveProjectStatusBadges(mcpServer, {
    engagementTrending: {
      rank: 1,
      likesGained7d: 3,
      bookmarksGained7d: 5,
      totalGained7d: 8,
      growthRatePct7d: 12,
      trendingScore: 10.5,
      source: 'signals_7d',
    },
  });
  assert.deepEqual(
    verifiedOpenTrending.map((b) => b.kind),
    ['verified', 'open_source', 'trending']
  );
  assert.equal(verifiedOpenTrending[1].license, 'MIT');
  assert.equal(verifiedOpenTrending[2].trendingDelta7d, 8);

  const pendingBadges = resolveProjectStatusBadges(receiptMcp);
  assert.deepEqual(
    pendingBadges.map((b) => b.kind),
    ['pending']
  );

  const unverifiedOpenBadges = resolveProjectStatusBadges(boltKit, {
    starTrending: {
      rank: 2,
      starsGained7d: 140,
    },
  });
  assert.deepEqual(
    unverifiedOpenBadges.map((b) => b.kind),
    ['unverified', 'open_source', 'trending']
  );
  assert.equal(unverifiedOpenBadges[2].trendingMetricKind, 'stars');
  assert.equal(unverifiedOpenBadges[2].trendingDelta7d, 140);
});
