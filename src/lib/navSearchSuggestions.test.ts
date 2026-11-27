import test from 'node:test';
import assert from 'node:assert/strict';
import type { CatalogProject } from '../types/vibeatlas';
import { buildNavSearchSuggestions } from './navSearchSuggestions';

function makeProject(partial: Partial<CatalogProject> & Pick<CatalogProject, 'id' | 'slug' | 'name'>): CatalogProject {
  return {
    tagline: 'AI project tagline',
    taglineKo: 'AI 프로젝트 설명',
    description: 'Detailed project description for testing',
    descriptionKo: '테스트용 상세 설명',
    contentType: 'ai_tool',
    categories: ['Developer Tools'],
    techStack: ['TypeScript'],
    developmentPlatform: 'cursor',
    hostingProvider: 'vercel',
    backendTech: 'none',
    country: 'KR',
    language: 'bilingual',
    license: 'MIT',
    pricingModel: 'open_source',
    verificationStatus: 'verified',
    provenanceSource: 'editorial_curated',
    liveDemoUrl: '',
    websiteUrl: '',
    githubRepo: 'org/repo',
    githubUrl: 'https://github.com/org/repo',
    thumbnailUrl: '',
    makerName: 'Maker',
    makerHandle: '@maker',
    ownerUid: '',
    githubStars: 120,
    githubForks: 12,
    likesCount: 10,
    bookmarksCount: 8,
    lastSyncedAt: '2026-11-26T00:00:00.000Z',
    createdAtIso: '2026-11-01T00:00:00.000Z',
    updatedAtIso: '2026-11-26T00:00:00.000Z',
    ...partial,
  };
}

const SAMPLE_CATALOG: CatalogProject[] = [
  makeProject({
    id: 'p1',
    slug: 'mcp-compass',
    name: 'MCP Compass',
    tagline: 'Discover Model Context Protocol servers fast',
    taglineKo: 'MCP 서버 탐색 도우미',
    contentType: 'mcp_server',
    categories: ['MCP Server', 'Workflow', 'code-search'],
  }),
  makeProject({
    id: 'p2',
    slug: 'cline-agent',
    name: 'Cline Autonomous Agent',
    tagline: 'Autonomous coding agent in IDE',
    taglineKo: '자율 코딩 에이전트',
    contentType: 'ai_agent',
    categories: ['AI Agent', 'CLI Tool'],
    bookmarksCount: 30,
  }),
  makeProject({
    id: 'p3',
    slug: 'lovable-kit',
    name: 'Lovable Starter Kit',
    tagline: 'Full-stack React starter template',
    taglineKo: '풀스택 스타터 템플릿',
    contentType: 'template',
    categories: ['Templates', 'Framework'],
  }),
];

test('returns empty suggestion lists when query is empty or whitespace', () => {
  const res = buildNavSearchSuggestions('   ', SAMPLE_CATALOG, 'en');
  assert.equal(res.query, '');
  assert.equal(res.projects.length, 0);
  assert.equal(res.tags.length, 0);
  assert.equal(res.flatItems.length, 0);
});

test('matches both project names and tags in real time', () => {
  const res = buildNavSearchSuggestions('mcp', SAMPLE_CATALOG, 'en');
  assert.equal(res.projects[0]?.slug, 'mcp-compass');
  assert.ok(res.tags.some((t) => t.tag === 'MCP Server' && t.count === 1));
  assert.equal(res.flatItems.length, res.projects.length + res.tags.length);
});

test('supports bilingual Korean queries matching English tags and projects', () => {
  const res = buildNavSearchSuggestions('에이전트', SAMPLE_CATALOG, 'ko');
  assert.ok(res.projects.some((p) => p.slug === 'cline-agent'));
  const agentTag = res.tags.find((t) => t.tag === 'AI Agent');
  assert.ok(agentTag);
  assert.equal(agentTag?.displayLabel, 'AI 에이전트');
  assert.equal(agentTag?.count, 1);
});

test('matches custom non-canonical project tags with accurate counts', () => {
  const res = buildNavSearchSuggestions('code-search', SAMPLE_CATALOG, 'en');
  assert.ok(res.tags.some((t) => t.tag === 'code-search' && !t.isCanonical && t.count === 1));
});

test('respects maxProjects and maxTags limits', () => {
  const manyProjects = Array.from({ length: 12 }, (_, idx) =>
    makeProject({
      id: `id-${idx}`,
      slug: `mcp-tool-${idx}`,
      name: `MCP Tool ${idx}`,
      categories: ['MCP Server', `mcp-tag-${idx}`],
    })
  );
  const res = buildNavSearchSuggestions('mcp', manyProjects, 'en', {
    maxProjects: 3,
    maxTags: 2,
  });
  assert.equal(res.projects.length, 3);
  assert.equal(res.tags.length, 2);
  assert.equal(res.flatItems.length, 5);
});
