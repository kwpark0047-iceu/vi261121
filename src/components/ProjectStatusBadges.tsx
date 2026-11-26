import { CheckCircle2, Clock, GitBranch, HelpCircle } from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import type { ProjectStatusBadge } from '../lib/projectStatusBadges';
import type { EngagementTrendingInfo } from '../lib/trendingEngagement';
import type { TrendingProjectInfo } from '../lib/trendingStars';
import type { AppLanguage } from '../types/vibeatlas';
import { TrendingBadge } from './TrendingBadge';

interface ProjectStatusBadgesProps {
  badges: ReadonlyArray<ProjectStatusBadge>;
  language: AppLanguage;
  engagementTrending?: EngagementTrendingInfo;
  starTrending?: TrendingProjectInfo;
  className?: string;
}

export function ProjectStatusBadges({
  badges,
  language,
  engagementTrending,
  starTrending,
  className = '',
}: ProjectStatusBadgesProps) {
  const copy = UI_STRINGS[language].card;

  if (badges.length === 0) return null;

  return (
    <div
      data-testid="card-status-badges"
      aria-label={copy.statusBadgesLabel}
      className={`flex flex-wrap items-center gap-1.5 ${className}`.trim()}
    >
      {badges.map((badge) => {
        if (badge.kind === 'verified') {
          return (
            <span
              key="verified"
              data-testid="status-badge-verified"
              title={copy.verifiedTooltip}
              aria-label={copy.verifiedTooltip}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-emerald-200 bg-emerald-50/90 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-emerald-800 dark:border-emerald-800/80 dark:bg-emerald-950/60 dark:text-emerald-200"
            >
              <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{copy.verifiedLabel}</span>
            </span>
          );
        }

        if (badge.kind === 'pending') {
          return (
            <span
              key="pending"
              data-testid="status-badge-pending"
              title={copy.pendingTooltip}
              aria-label={copy.pendingTooltip}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-amber-200 bg-amber-50/95 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-amber-800 dark:border-amber-800/80 dark:bg-amber-950/60 dark:text-amber-200"
            >
              <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{copy.pendingLabel}</span>
            </span>
          );
        }

        if (badge.kind === 'unverified') {
          return (
            <span
              key="unverified"
              data-testid="status-badge-unverified"
              title={copy.unverifiedTooltip}
              aria-label={copy.unverifiedTooltip}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-slate-200 bg-slate-100/80 px-1.5 py-0.5 text-[11px] font-medium leading-none text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
            >
              <HelpCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{copy.unverifiedLabel}</span>
            </span>
          );
        }

        if (badge.kind === 'open_source') {
          const tooltip = badge.license
            ? copy.openSourceWithLicenseTooltip.replace('{license}', badge.license)
            : copy.openSourceTooltip;

          return (
            <span
              key="open_source"
              data-testid="status-badge-open-source"
              title={tooltip}
              aria-label={tooltip}
              className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-cyan-200 bg-cyan-50/90 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-cyan-800 dark:border-cyan-800/80 dark:bg-cyan-950/60 dark:text-cyan-200"
            >
              <GitBranch className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{copy.openSourceBadge}</span>
            </span>
          );
        }

        if (badge.kind === 'trending') {
          return (
            <TrendingBadge
              key="trending"
              language={language}
              engagementTrending={engagementTrending}
              starTrending={starTrending}
              variant="card"
            />
          );
        }

        return null;
      })}
    </div>
  );
}
