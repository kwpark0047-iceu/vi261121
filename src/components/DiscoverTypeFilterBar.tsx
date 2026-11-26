import { motion } from 'motion/react';
import {
  Bot,
  Code2,
  Globe,
  LayoutGrid,
  LayoutTemplate,
  Plug,
  RotateCcw,
  Sparkles,
  Wrench,
} from 'lucide-react';
import type { AppLanguage, ProjectCategory } from '../types/vibeatlas';
import { PROJECT_CATEGORY_LABELS, UI_STRINGS } from '../data/i18n';
import {
  DISCOVER_TYPE_PILLS,
  type DiscoverTypeFilterId,
} from '../lib/discoverTypeFilterBar';
import { PASTEL_TONE_STYLES } from '../lib/pastelIcons';
import { playUiSound } from '../lib/soundEffects';

interface DiscoverTypeFilterBarProps {
  language: AppLanguage;
  activeType: DiscoverTypeFilterId;
  activeCategory: ProjectCategory | 'all';
  counts: Record<DiscoverTypeFilterId, number>;
  filteredCount: number;
  totalCount: number;
  hasActiveFilters: boolean;
  onSelectType: (typeId: DiscoverTypeFilterId) => void;
  onResetFilters: () => void;
}

function renderTypePillIcon(typeId: DiscoverTypeFilterId, className: string) {
  switch (typeId) {
    case 'all':
      return <LayoutGrid className={className} aria-hidden="true" />;
    case 'ai_agent':
      return <Bot className={className} aria-hidden="true" />;
    case 'mcp_server':
      return <Plug className={className} aria-hidden="true" />;
    case 'open_source':
      return <Code2 className={className} aria-hidden="true" />;
    case 'ai_tool':
      return <Wrench className={className} aria-hidden="true" />;
    case 'web_app':
      return <Globe className={className} aria-hidden="true" />;
    case 'ai_skill':
      return <Sparkles className={className} aria-hidden="true" />;
    case 'template':
      return <LayoutTemplate className={className} aria-hidden="true" />;
  }
}

export function DiscoverTypeFilterBar({
  language,
  activeType,
  activeCategory,
  counts,
  filteredCount,
  totalCount,
  hasActiveFilters,
  onSelectType,
  onResetFilters,
}: DiscoverTypeFilterBarProps) {
  const copy = UI_STRINGS[language].discover;

  return (
    <div
      data-testid="discover-type-filter-bar"
      className="sticky top-[65px] z-20 -mx-4 mt-4 border-y border-slate-200/80 bg-[#F7F9FC]/92 px-4 py-1.5 backdrop-blur-md sm:-mx-6 sm:px-6 sm:py-2 md:top-[61px] dark:border-slate-800/80 dark:bg-slate-950/92"
    >
      <div className="flex items-center justify-between gap-2.5">
        <div
          role="group"
          aria-label={copy.typeFilterBarLabel}
          className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-0.5 lg:flex-wrap lg:overflow-visible"
        >
          {DISCOVER_TYPE_PILLS.map((pill) => {
            const isSelected =
              pill.id === 'all'
                ? activeType === 'all' && activeCategory === 'all'
                : activeType === pill.id;
            const toneStyle = PASTEL_TONE_STYLES[pill.tone];
            const count = counts[pill.id] ?? 0;

            return (
              <motion.button
                key={pill.id}
                type="button"
                data-testid={`discover-type-pill-${pill.id}`}
                aria-pressed={isSelected}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  playUiSound('tap');
                  onSelectType(pill.id);
                }}
                className={`relative inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                  isSelected
                    ? 'border-blue-600 text-white shadow-xs dark:border-blue-500 dark:text-white'
                    : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800'
                }`}
              >
                {isSelected && (
                  <motion.span
                    layoutId="discover-type-filter-active-pill"
                    transition={{ type: 'spring', stiffness: 440, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-blue-600 dark:bg-blue-600"
                  />
                )}
                <span
                  className={`relative z-10 inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : toneStyle.containerClass
                  }`}
                >
                  {renderTypePillIcon(pill.id, 'h-2.5 w-2.5')}
                </span>
                <span className="relative z-10">{pill.labels[language]}</span>
                <span
                  className={`relative z-10 font-mono text-[10px] tabular-nums ${
                    isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-2 sm:flex">
          {activeCategory !== 'all' && activeType === 'all' && (
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {PROJECT_CATEGORY_LABELS[language][activeCategory]}
            </span>
          )}
          <span
            data-testid="discover-type-bar-count"
            className="font-mono text-[11px] font-medium tabular-nums text-slate-500 dark:text-slate-400"
          >
            {filteredCount} / {totalCount}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              data-testid="discover-type-bar-reset"
              onClick={() => {
                playUiSound('tap');
                onResetFilters();
              }}
              className="inline-flex h-7 shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              <span>{copy.typeFilterClearLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
