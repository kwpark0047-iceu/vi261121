import { useRef, type KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import {
  Bot,
  Code2,
  Cpu,
  Flag,
  GitBranch,
  Globe,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  Smartphone,
  Sparkles,
  Terminal,
  Wrench,
  Workflow,
} from 'lucide-react';
import type { AppLanguage } from '../types/vibeatlas';
import {
  DISCOVER_CATEGORY_TABS,
  type DiscoverCategoryTabId,
} from '../lib/discoverCategoryTabs';
import { PASTEL_TONE_STYLES } from '../lib/pastelIcons';
import { playUiSound } from '../lib/soundEffects';

interface DiscoverCategoryTabsProps {
  language: AppLanguage;
  activeTab: DiscoverCategoryTabId | null;
  counts: Record<DiscoverCategoryTabId, number>;
  ariaLabel: string;
  onSelectTab: (tabId: DiscoverCategoryTabId) => void;
}

function renderTabIcon(tabId: DiscoverCategoryTabId, className: string) {
  switch (tabId) {
    case 'all':
      return <LayoutGrid className={className} aria-hidden="true" />;
    case 'mcp':
      return <Cpu className={className} aria-hidden="true" />;
    case 'ai_agent':
      return <Bot className={className} aria-hidden="true" />;
    case 'ai_tool':
      return <Wrench className={className} aria-hidden="true" />;
    case 'web_app':
      return <Globe className={className} aria-hidden="true" />;
    case 'mobile_app':
      return <Smartphone className={className} aria-hidden="true" />;
    case 'ai_skills':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'workflow':
      return <Workflow className={className} aria-hidden="true" />;
    case 'cli_tool':
      return <Terminal className={className} aria-hidden="true" />;
    case 'framework':
      return <Layers className={className} aria-hidden="true" />;
    case 'developer_tools':
      return <Code2 className={className} aria-hidden="true" />;
    case 'templates':
      return <LayoutTemplate className={className} aria-hidden="true" />;
    case 'korean_builders':
      return <Flag className={className} aria-hidden="true" />;
    case 'open_source':
      return <GitBranch className={className} aria-hidden="true" />;
  }
}

export function DiscoverCategoryTabs({
  language,
  activeTab,
  counts,
  ariaLabel,
  onSelectTab,
}: DiscoverCategoryTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const total = DISCOVER_CATEGORY_TABS.length;
    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % total;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + total) % total;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = total - 1;
    }
    if (nextIndex >= 0) {
      e.preventDefault();
      const targetTab = DISCOVER_CATEGORY_TABS[nextIndex];
      tabRefs.current[nextIndex]?.focus();
      playUiSound('tap');
      onSelectTab(targetTab.id);
    }
  };

  return (
    <div
      data-testid="discover-category-tabs"
      className="mt-5 rounded-2xl border border-slate-200/90 bg-white/95 p-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900/95"
    >
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex items-center gap-1.5 overflow-x-auto pb-0.5 lg:flex-wrap lg:overflow-visible lg:pb-0"
      >
        {DISCOVER_CATEGORY_TABS.map((tab, idx) => {
          const isSelected = activeTab === tab.id;
          const toneStyle = PASTEL_TONE_STYLES[tab.tone];
          const count = counts[tab.id] ?? 0;

          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              type="button"
              role="tab"
              data-testid={`discover-tab-${tab.id}`}
              aria-selected={isSelected}
              tabIndex={isSelected || (activeTab === null && idx === 0) ? 0 : -1}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onClick={() => {
                playUiSound('tap');
                onSelectTab(isSelected && tab.id !== 'all' ? 'all' : tab.id);
              }}
              className={`relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isSelected
                  ? 'text-white dark:text-white'
                  : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-200 dark:hover:bg-slate-800/80'
              }`}
            >
              {isSelected && (
                <motion.span
                  layoutId="discover-category-tab-pill"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-xl bg-blue-600 shadow-xs shadow-blue-600/20 dark:bg-sky-600"
                />
              )}
              <span
                className={`relative z-10 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-lg transition-colors ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : toneStyle.containerClass
                }`}
              >
                {renderTabIcon(tab.id, 'h-3 w-3')}
              </span>
              <span className="relative z-10">{tab.labels[language]}</span>
              <span
                className={`relative z-10 font-mono text-[10px] tabular-nums ${
                  isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
