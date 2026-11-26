import type {
  AppLanguage,
  CatalogProject,
  ContentType,
  SearchFilters,
} from '../types/vibeatlas';
import { filterProjects } from './catalogEngine';
import type { PastelTone } from './pastelIcons';

export type DiscoverTypeFilterId = ContentType | 'all';

export interface DiscoverTypeFilterOption {
  id: DiscoverTypeFilterId;
  tone: PastelTone;
  labels: Record<AppLanguage, string>;
}

/**
 * Ordered project type filter pills surfacing the primary AI ecosystem types
 * ('AI Agent', 'MCP Server', 'Open Source', 'AI Tool') first after 'All'.
 */
export const DISCOVER_TYPE_PILLS: ReadonlyArray<DiscoverTypeFilterOption> = [
  {
    id: 'all',
    tone: 'sky',
    labels: {
      ko: '전체',
      en: 'All',
      zh: '全部',
      ja: 'すべて',
    },
  },
  {
    id: 'ai_agent',
    tone: 'peach',
    labels: {
      ko: 'AI 에이전트',
      en: 'AI Agent',
      zh: 'AI 智能体',
      ja: 'AI エージェント',
    },
  },
  {
    id: 'mcp_server',
    tone: 'mint',
    labels: {
      ko: 'MCP 서버',
      en: 'MCP Server',
      zh: 'MCP 服务器',
      ja: 'MCP サーバー',
    },
  },
  {
    id: 'open_source',
    tone: 'rose',
    labels: {
      ko: '오픈소스',
      en: 'Open Source',
      zh: '开源项目',
      ja: 'オープンソース',
    },
  },
  {
    id: 'ai_tool',
    tone: 'lavender',
    labels: {
      ko: 'AI 툴',
      en: 'AI Tool',
      zh: 'AI 工具',
      ja: 'AI ツール',
    },
  },
  {
    id: 'web_app',
    tone: 'sky',
    labels: {
      ko: '웹 앱',
      en: 'Web App',
      zh: 'Web 应用',
      ja: 'Web アプリ',
    },
  },
  {
    id: 'ai_skill',
    tone: 'butter',
    labels: {
      ko: 'AI Skills',
      en: 'AI Skills',
      zh: 'AI Skills',
      ja: 'AI Skills',
    },
  },
  {
    id: 'template',
    tone: 'aqua',
    labels: {
      ko: '템플릿',
      en: 'Templates',
      zh: '模板',
      ja: 'テンプレート',
    },
  },
];

export function resolveActiveTypePill(
  filters: Pick<SearchFilters, 'type'>
): DiscoverTypeFilterId {
  return filters.type !== 'all' ? filters.type : 'all';
}

export function buildFilterPatchForTypePill(
  targetId: DiscoverTypeFilterId,
  currentFilters: Pick<SearchFilters, 'type' | 'category'>
): Partial<SearchFilters> {
  if (targetId === 'all' || currentFilters.type === targetId) {
    return {
      type: 'all',
      category: 'all',
      page: 1,
    };
  }

  return {
    type: targetId,
    category: 'all',
    page: 1,
  };
}

export function computeDiscoverTypeCounts(
  projects: CatalogProject[],
  filters: SearchFilters,
  nowMs: number = Date.now()
): Record<DiscoverTypeFilterId, number> {
  const baseMatched = filterProjects(
    projects,
    {
      ...filters,
      type: 'all',
      category: 'all',
    },
    nowMs
  );

  const counts: Record<DiscoverTypeFilterId, number> = {
    all: baseMatched.length,
    ai_agent: 0,
    mcp_server: 0,
    open_source: 0,
    ai_tool: 0,
    web_app: 0,
    ai_skill: 0,
    template: 0,
  };

  for (const project of baseMatched) {
    counts[project.contentType] = (counts[project.contentType] ?? 0) + 1;
  }

  return counts;
}
