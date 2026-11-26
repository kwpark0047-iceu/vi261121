import { useMemo } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from 'recharts';
import type { AppLanguage, CatalogProject } from '../types/vibeatlas';
import { UI_STRINGS } from '../data/i18n';
import { formatCompactCount } from '../lib/catalogEngine';
import {
  computeSparklineYDomain,
  type SevenDaySparklinePoint,
  type SevenDayStarSparkline,
} from '../lib/starSparkline';

interface StarHistorySparklineProps {
  project: CatalogProject;
  language: AppLanguage;
  sparkline: SevenDayStarSparkline;
  className?: string;
}

interface SparklineTooltipItem {
  payload?: SevenDaySparklinePoint;
}

interface SparklineTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<SparklineTooltipItem>;
}

function SparklineTooltip({ active, payload }: SparklineTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const pt = payload[0]?.payload;
  if (!pt) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 px-2 py-1 text-[11px] shadow-sm backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
      <div className="flex items-center gap-2 font-mono tabular-nums">
        <span className="text-slate-500 dark:text-slate-400">{pt.shortDate}</span>
        <span className="font-semibold text-amber-700 dark:text-amber-400">
          ★ {pt.stars.toLocaleString()}
        </span>
        {pt.delta > 0 && (
          <span className="text-emerald-700 dark:text-emerald-400">
            (+{pt.delta.toLocaleString()})
          </span>
        )}
      </div>
    </div>
  );
}

export function StarHistorySparkline({
  project,
  language,
  sparkline,
  className = '',
}: StarHistorySparklineProps) {
  const copy = UI_STRINGS[language].card;
  const yDomain = useMemo(() => computeSparklineYDomain(sparkline.points), [sparkline.points]);

  if (!project.githubRepo) {
    return null;
  }

  const isTrend = sparkline.status === 'trend';
  const isBaseline = sparkline.status === 'baseline';
  const hasChart = (isTrend || isBaseline) && sparkline.points.length > 0;

  const summaryText = isTrend
    ? sparkline.netDelta7d > 0
      ? `+${formatCompactCount(sparkline.netDelta7d)}`
      : sparkline.netDelta7d < 0
        ? `-${formatCompactCount(Math.abs(sparkline.netDelta7d))}`
        : '0'
    : isBaseline
      ? copy.starHistoryBaseline
      : copy.starHistoryNoSnapshots;

  const accessibleSummary = `${copy.starHistory7d}: ${summaryText}`;

  return (
    <div
      data-testid={`star-sparkline-${project.slug}`}
      data-sparkline-status={sparkline.status}
      aria-label={accessibleSummary}
      className={`w-full border-b border-slate-100 pb-2.5 dark:border-slate-800/80 ${className}`}
    >
      <div className="flex items-center justify-between gap-2 text-[11px]">
        <span className="truncate font-medium text-slate-500 dark:text-slate-400">
          {copy.starHistory7d}
        </span>
        <span
          className={`shrink-0 tabular-nums ${
            isTrend && sparkline.netDelta7d > 0
              ? 'font-mono font-semibold text-emerald-700 dark:text-emerald-400'
              : isTrend
                ? 'font-mono text-slate-500 dark:text-slate-400'
                : 'text-slate-400 dark:text-slate-500'
          }`}
        >
          {summaryText}
        </span>
      </div>

      {hasChart && (
        <div className="mt-1 h-10 w-full min-w-0">
          <ResponsiveContainer
            width="100%"
            height={40}
            initialDimension={{ width: 240, height: 40 }}
          >
            <LineChart data={sparkline.points} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
              <YAxis hide domain={yDomain} />
              <Tooltip
                content={<SparklineTooltip />}
                cursor={{ stroke: 'rgba(148, 163, 184, 0.35)', strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="stars"
                stroke={isTrend ? '#d97706' : '#94a3b8'}
                strokeWidth={isTrend ? 2 : 1.5}
                strokeDasharray={isBaseline ? '4 3' : undefined}
                dot={false}
                activeDot={{ r: 3, fill: '#d97706', strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
