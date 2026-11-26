import assert from 'node:assert/strict';
import test from 'node:test';
import { CURATED_SEED_PROJECTS } from '../data/seedCatalog';
import { DEFAULT_SEARCH_FILTERS } from './urlSync';
import {
  buildFilterPatchForDiscoverTab,
  computeDiscoverTabCounts,
  DISCOVER_CATEGORY_TABS,
  resolveActiveDiscoverTab,
} from './discoverCategoryTabs';

test('resolveActiveDiscoverTab resolves both category-backed and type-backed filters cleanly', () => {
  assert.equal(resolveActiveDiscoverTab({ type: 'all', category: 'all' }), 'all');
  assert.equal(resolveActiveDiscoverTab({ type: 'all', category: 'MCP Server' }), 'mcp');
  assert.equal(resolveActiveDiscoverTab({ type: 'mcp_server', category: 'all' }), 'mcp');
  assert.equal(resolveActiveDiscoverTab({ type: 'all', category: 'AI Agent' }), 'ai_agent');
  assert.equal(resolveActiveDiscoverTab({ type: 'ai_agent', category: 'all' }), 'ai_agent');
  assert.equal(resolveActiveDiscoverTab({ type: 'ai_tool', category: 'all' }), 'ai_tool');
  assert.equal(resolveActiveDiscoverTab({ type: 'web_app', category: 'all' }), 'web_app');
  assert.equal(resolveActiveDiscoverTab({ type: 'open_source', category: 'all' }), 'open_source');
  assert.equal(resolveActiveDiscoverTab({ type: 'all', category: 'Backend' }), null);
  assert.equal(resolveActiveDiscoverTab({ type: 'ai_tool', category: 'MCP Server' }), null);
});

test('buildFilterPatchForDiscoverTab clears conflicting axis and resets page to 1', () => {
  assert.deepEqual(buildFilterPatchForDiscoverTab('mcp'), {
    type: 'all',
    category: 'MCP Server',
    page: 1,
  });
  assert.deepEqual(buildFilterPatchForDiscoverTab('ai_agent'), {
    type: 'all',
    category: 'AI Agent',
    page: 1,
  });
  assert.deepEqual(buildFilterPatchForDiscoverTab('ai_tool'), {
    type: 'ai_tool',
    category: 'all',
    page: 1,
  });
  assert.deepEqual(buildFilterPatchForDiscoverTab('all'), {
    type: 'all',
    category: 'all',
    page: 1,
  });
});

test('computeDiscoverTabCounts produces accurate counts across seed catalog and respects active search query', () => {
  const countsAll = computeDiscoverTabCounts(CURATED_SEED_PROJECTS, DEFAULT_SEARCH_FILTERS);
  assert.equal(countsAll.all, CURATED_SEED_PROJECTS.length);
  assert.ok(countsAll.mcp > 0, 'Expected MCP projects in seed catalog');
  assert.ok(countsAll.ai_agent > 0, 'Expected AI Agent projects in seed catalog');
  assert.ok(countsAll.ai_tool > 0, 'Expected AI Tool projects in seed catalog');
  assert.equal(Object.keys(countsAll).length, DISCOVER_CATEGORY_TABS.length);

  const countsFiltered = computeDiscoverTabCounts(CURATED_SEED_PROJECTS, {
    ...DEFAULT_SEARCH_FILTERS,
    q: 'mcp',
  });
  assert.ok(countsFiltered.all < countsAll.all);
  assert.ok(countsFiltered.mcp > 0);
});
