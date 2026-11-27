import assert from 'node:assert/strict';
import test from 'node:test';
import { CURATED_SEED_PROJECTS } from '../data/seedCatalog';
import { DEFAULT_SEARCH_FILTERS } from './urlSync';
import {
  buildFilterPatchForTypePill,
  computeDiscoverTypeCounts,
  DISCOVER_TYPE_PILLS,
  resolveActiveTypePill,
} from './discoverTypeFilterBar';

test('DISCOVER_TYPE_PILLS places All, AI Agent, MCP Server, Open Source, and AI Tool first', () => {
  const ids = DISCOVER_TYPE_PILLS.map((pill) => pill.id);
  assert.deepEqual(ids.slice(0, 5), [
    'all',
    'ai_agent',
    'mcp_server',
    'open_source',
    'ai_tool',
  ]);

  const englishLabels = DISCOVER_TYPE_PILLS.slice(0, 5).map((pill) => pill.labels.en);
  assert.deepEqual(englishLabels, ['All', 'AI Agent', 'MCP Server', 'Open Source', 'AI Tool']);
});

test('buildFilterPatchForTypePill toggles types cleanly and clears conflicting categories', () => {
  assert.deepEqual(
    buildFilterPatchForTypePill('ai_agent', { type: 'all', category: 'MCP Server' }),
    { type: 'ai_agent', category: 'all', page: 1 }
  );

  assert.deepEqual(
    buildFilterPatchForTypePill('mcp_server', { type: 'ai_agent', category: 'all' }),
    { type: 'mcp_server', category: 'all', page: 1 }
  );

  // Clicking active pill toggles back to All
  assert.deepEqual(
    buildFilterPatchForTypePill('open_source', { type: 'open_source', category: 'all' }),
    { type: 'all', category: 'all', page: 1 }
  );

  assert.deepEqual(
    buildFilterPatchForTypePill('all', { type: 'ai_tool', category: 'Workflow' }),
    { type: 'all', category: 'all', page: 1 }
  );
});

test('resolveActiveTypePill and computeDiscoverTypeCounts match seed catalog counts', () => {
  assert.equal(resolveActiveTypePill({ type: 'all' }), 'all');
  assert.equal(resolveActiveTypePill({ type: 'mcp_server' }), 'mcp_server');

  const counts = computeDiscoverTypeCounts(CURATED_SEED_PROJECTS, DEFAULT_SEARCH_FILTERS);
  assert.equal(counts.all, CURATED_SEED_PROJECTS.length);
  assert.ok(counts.ai_agent > 0, 'Expected AI Agent entries');
  assert.ok(counts.mcp_server > 0, 'Expected MCP Server entries');
  assert.ok(counts.open_source > 0, 'Expected Open Source entries');
  assert.ok(counts.ai_tool > 0, 'Expected AI Tool entries');

  const sumByType =
    counts.ai_agent +
    counts.mcp_server +
    counts.open_source +
    counts.ai_tool +
    counts.web_app +
    counts.mobile_app +
    counts.ai_skill +
    counts.template;
  assert.equal(sumByType, counts.all);

  // Secondary filters narrow all type pill counts accurately
  const krCounts = computeDiscoverTypeCounts(CURATED_SEED_PROJECTS, {
    ...DEFAULT_SEARCH_FILTERS,
    country: 'KR',
  });
  assert.ok(krCounts.all > 0 && krCounts.all < counts.all);
  assert.equal(krCounts.open_source, 0);
  assert.ok(krCounts.mcp_server > 0);
});
