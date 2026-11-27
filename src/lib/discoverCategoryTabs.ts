import type {
  AppLanguage,
  CatalogProject,
  ContentType,
  ProjectCategory,
  SearchFilters,
} from '../types/vibeatlas';
import { filterProjects, matchesProjectCategory } from './catalogEngine';
import type { PastelTone } from './pastelIcons';

export type DiscoverCategoryTabId =
  | 'all'
  | 'mcp'
  | 'ai_agent'
  | 'ai_tool'
  | 'web_app'
  | 'mobile_app'
  | 'ai_skills'
  | 'workflow'
  | 'cli_tool'
  | 'framework'
  | 'developer_tools'
  | 'templates'
  | 'korean_builders'
  | 'open_source';

export interface DiscoverCategoryTabDef {
  id: DiscoverCategoryTabId;
  typeFilter: ContentType | 'all';
  categoryFilter: ProjectCategory | 'all';
  tone: PastelTone;
  labels: Record<AppLanguage, string>;
}

export const DISCOVER_CATEGORY_TABS: ReadonlyArray<DiscoverCategoryTabDef> = [
  {
    id: 'all',
    typeFilter: 'all',
    categoryFilter: 'all',
    tone: 'sky',
    labels: {
      ko: '전체',
      en: 'All',
      zh: '全部',
      ja: 'すべて',
    },
  },
  {
    id: 'mcp',
    typeFilter: 'all',
    categoryFilter: 'MCP Server',
    tone: 'mint',
    labels: {
      ko: 'MCP',
      en: 'MCP',
      zh: 'MCP',
      ja: 'MCP',
    },
  },
  {
    id: 'ai_agent',
    typeFilter: 'all',
    categoryFilter: 'AI Agent',
    tone: 'peach',
    labels: {
      ko: 'AI 에이전트',
      en: 'AI Agent',
      zh: 'AI 智能体',
      ja: 'AI エージェント',
    },
  },
  {
    id: 'ai_tool',
    typeFilter: 'ai_tool',
    categoryFilter: 'all',
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
    typeFilter: 'web_app',
    categoryFilter: 'all',
    tone: 'sky',
    labels: {
      ko: '웹 앱',
      en: 'Web App',
      zh: 'Web 应用',
      ja: 'Web アプリ',
    },
  },
  {
    id: 'mobile_app',
    typeFilter: 'mobile_app',
    categoryFilter: 'all',
    tone: 'aqua',
    labels: {
      ko: '모바일 앱',
      en: 'Mobile App',
      zh: '移动应用',
      ja: 'モバイルアプリ',
    },
  },
  {
    id: 'ai_skills',
    typeFilter: 'all',
    categoryFilter: 'AI Skills',
    tone: 'butter',
    labels: {
      ko: 'AI Skills',
      en: 'AI Skills',
      zh: 'AI Skills',
      ja: 'AI Skills',
    },
  },
  {
    id: 'workflow',
    typeFilter: 'all',
    categoryFilter: 'Workflow',
    tone: 'aqua',
    labels: {
      ko: '워크플로우',
      en: 'Workflow',
      zh: '工作流',
      ja: 'ワークフロー',
    },
  },
  {
    id: 'cli_tool',
    typeFilter: 'all',
    categoryFilter: 'CLI Tool',
    tone: 'mint',
    labels: {
      ko: 'CLI 도구',
      en: 'CLI Tool',
      zh: 'CLI 工具',
      ja: 'CLI ツール',
    },
  },
  {
    id: 'framework',
    typeFilter: 'all',
    categoryFilter: 'Framework',
    tone: 'lavender',
    labels: {
      ko: '프레임워크',
      en: 'Framework',
      zh: '开发框架',
      ja: 'フレームワーク',
    },
  },
  {
    id: 'developer_tools',
    typeFilter: 'all',
    categoryFilter: 'Developer Tools',
    tone: 'aqua',
    labels: {
      ko: '개발자 도구',
      en: 'Dev Tools',
      zh: '开发工具',
      ja: '開発ツール',
    },
  },
  {
    id: 'templates',
    typeFilter: 'all',
    categoryFilter: 'Templates',
    tone: 'butter',
    labels: {
      ko: '템플릿',
      en: 'Templates',
      zh: '模板',
      ja: 'テンプレート',
    },
  },
  {
    id: 'korean_builders',
    typeFilter: 'all',
    categoryFilter: 'Korean Builders',
    tone: 'rose',
    labels: {
      ko: '한국 메이커',
      en: 'K-Makers',
      zh: '韩国创作者',
      ja: '韓国メイカー',
    },
  },
  {
    id: 'open_source',
    typeFilter: 'open_source',
    categoryFilter: 'all',
    tone: 'rose',
    labels: {
      ko: '오픈소스',
      en: 'Open Source',
      zh: '开源项目',
      ja: 'オープンソース',
    },
  },
];

const CATEGORY_TO_TAB_ID: Partial<Record<ProjectCategory, DiscoverCategoryTabId>> = {
  'MCP Server': 'mcp',
  'AI Agent': 'ai_agent',
  'Mobile App': 'mobile_app',
  'AI Skills': 'ai_skills',
  Workflow: 'workflow',
  'CLI Tool': 'cli_tool',
  Framework: 'framework',
  'Developer Tools': 'developer_tools',
  Templates: 'templates',
  'Korean Builders': 'korean_builders',
};

const TYPE_TO_TAB_ID: Partial<Record<ContentType, DiscoverCategoryTabId>> = {
  mcp_server: 'mcp',
  ai_agent: 'ai_agent',
  ai_tool: 'ai_tool',
  web_app: 'web_app',
  mobile_app: 'mobile_app',
  ai_skill: 'ai_skills',
  template: 'templates',
  open_source: 'open_source',
};

export function resolveActiveDiscoverTab(
  filters: Pick<SearchFilters, 'type' | 'category'>
): DiscoverCategoryTabId | null {
  if (filters.type === 'all' && filters.category === 'all') {
    return 'all';
  }
  if (filters.type === 'all' && filters.category !== 'all') {
    return CATEGORY_TO_TAB_ID[filters.category] ?? null;
  }
  if (filters.category === 'all' && filters.type !== 'all') {
    return TYPE_TO_TAB_ID[filters.type] ?? null;
  }
  return null;
}

export function buildFilterPatchForDiscoverTab(
  tabId: DiscoverCategoryTabId
): Partial<SearchFilters> {
  const def = DISCOVER_CATEGORY_TABS.find((t) => t.id === tabId) ?? DISCOVER_CATEGORY_TABS[0];
  return {
    type: def.typeFilter,
    category: def.categoryFilter,
    page: 1,
  };
}

export function matchesDiscoverTab(
  project: CatalogProject,
  tab: DiscoverCategoryTabDef
): boolean {
  if (tab.typeFilter !== 'all' && project.contentType !== tab.typeFilter) {
    return false;
  }
  if (!matchesProjectCategory(project, tab.categoryFilter)) {
    return false;
  }
  return true;
}

export function computeDiscoverTabCounts(
  projects: CatalogProject[],
  filters: SearchFilters,
  nowMs: number = Date.now()
): Record<DiscoverCategoryTabId, number> {
  const baseMatched = filterProjects(
    projects,
    {
      ...filters,
      type: 'all',
      category: 'all',
    },
    nowMs
  );

  const counts = {} as Record<DiscoverCategoryTabId, number>;
  for (const tab of DISCOVER_CATEGORY_TABS) {
    if (tab.id === 'all') {
      counts[tab.id] = baseMatched.length;
    } else {
      counts[tab.id] = baseMatched.filter((p) => matchesDiscoverTab(p, tab)).length;
    }
  }
  return counts;
}
