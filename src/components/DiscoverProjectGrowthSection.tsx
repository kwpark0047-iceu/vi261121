import { useEffect, useId, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Plus, RotateCcw, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AppLanguage, CatalogProject } from '../types/vibeatlas';
import { UI_STRINGS } from '../data/i18n';
import {
  computeProjectSubmissionsGrowth,
  type ProjectSubmissionDayPoint,
} from '../lib/projectSubmissionsGrowth';
import { playUiSound } from '../lib/soundEffects';
import { PastelCategoryIcon } from './PastelCategoryIcon';

export type ProjectGrowthChartMode = 'daily' | 'cumulative';
export type ProjectGrowthScope = 'all' | 'filtered';

interface DiscoverProjectGrowthSectionProps {
  language: AppLanguage;
  allProjects: ReadonlyArray<CatalogProject>;
  filteredProjects: ReadonlyArray<CatalogProject>;
  hasActiveFilters: boolean;
  isLoading?: boolean;
  onResetFilters?: () => void;
  onNavigateSubmit?: () => void;
}

interface TooltipPayloadItem {
  payload?: ProjectSubmissionDayPoint;
}

interface SubmissionTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadItem>;
  mode: ProjectGrowthChartMode;
  dailyLabel: string;
  rollingAvgLabel: string;
  cumulativeLabel: string;
  submittedLabel: string;
  moreSuffix: string;
}

function SubmissionGrowthTooltip({
  active,
  payload,
  mode,
  dailyLabel,
  rollingAvgLabel,
  cumulativeLabel,
  submittedLabel,
  moreSuffix,
}: SubmissionTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const pt = payload[0]?.payload;
  if (!pt) return null;

  const visibleNames = pt.projectNames.slice(0, 3);
  const extraCount = pt.projectNames.length - visibleNames.length;

  return (
    <div className="max-w-[260px] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-sm backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
      <p className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
        {pt.date}
      </p>

      <div className="mt-1 space-y-0.5 font-mono tabular-nums">
        {mode === 'daily' ? (
          <>
            <p className="text-blue-700 dark:text-sky-400">
              {dailyLabel}: +{pt.dailySubmissions}
            </p>
            <p className="text-emerald-700 dark:text-emerald-400">
              {rollingAvgLabel}: {pt.rolling7dAvg.toFixed(2)}
            </p>
          </>
        ) : (
          <>
            <p className="text-blue-700 dark:text-sky-400">
              {cumulativeLabel}: {pt.cumulativeProjects.toLocaleString()}
            </p>
            {pt.dailySubmissions > 0 && (
              <p className="text-emerald-700 dark:text-emerald-400">
                {dailyLabel}: +{pt.dailySubmissions}
              </p>
            )}
          </>
        )}
      </div>

      {visibleNames.length > 0 && (
        <div className="mt-1.5 border-t border-slate-100 pt-1.5 dark:border-slate-800">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {submittedLabel}
          </p>
          <ul className="mt-0.5 space-y-0.5 text-[11px] text-slate-700 dark:text-slate-200">
            {visibleNames.map((name, idx) => (
              <li key={`${pt.date}-${idx}`} className="truncate">
                · {name}
              </li>
            ))}
            {extraCount > 0 && (
              <li className="text-slate-500 dark:text-slate-400">
                +{extraCount} {moreSuffix}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function DiscoverProjectGrowthSection({
  language,
  allProjects,
  filteredProjects,
  hasActiveFilters,
  isLoading = false,
  onResetFilters,
  onNavigateSubmit,
}: DiscoverProjectGrowthSectionProps) {
  const copy = UI_STRINGS[language].projectGrowth;
  const gradientId = useId().replace(/:/g, '');

  const [chartMode, setChartMode] = useState<ProjectGrowthChartMode>('daily');
  const [scope, setScope] = useState<ProjectGrowthScope>('all');
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const effectiveScope: ProjectGrowthScope = hasActiveFilters ? scope : 'all';
  const scopedProjects = effectiveScope === 'filtered' ? filteredProjects : allProjects;

  const summary = useMemo(
    () => computeProjectSubmissionsGrowth(scopedProjects, { windowDays: 30 }),
    [scopedProjects]
  );

  const barColor = isDark ? '#38bdf8' : '#2563eb';
  const rollingLineColor = isDark ? '#34d399' : '#059669';
  const areaStrokeColor = isDark ? '#60a5fa' : '#1d4ed8';
  const axisTickColor = isDark ? '#94a3b8' : '#64748b';
  const gridStrokeColor = isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(148, 163, 184, 0.25)';

  return (
    <section
      aria-labelledby="discover-project-growth-heading"
      data-testid="discover-project-growth-section"
      className="mt-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <PastelCategoryIcon role="trending" size="sm" animated={false} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h2
                id="discover-project-growth-heading"
                className="text-base font-bold tracking-tight text-slate-900 dark:text-white"
              >
                {copy.title}
              </h2>
              <span className="font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                {summary.windowStartDate} – {summary.windowEndDate}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{copy.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          {hasActiveFilters && (
            <div
              role="group"
              aria-label={copy.title}
              className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-950"
            >
              <button
                type="button"
                data-testid="project-growth-scope-all"
                aria-pressed={effectiveScope === 'all'}
                onClick={() => {
                  playUiSound('tap');
                  setScope('all');
                }}
                className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  effectiveScope === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {copy.scopeAll}
              </button>
              <button
                type="button"
                data-testid="project-growth-scope-filtered"
                aria-pressed={effectiveScope === 'filtered'}
                onClick={() => {
                  playUiSound('tap');
                  setScope('filtered');
                }}
                className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  effectiveScope === 'filtered'
                    ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {copy.scopeFiltered}
              </button>
            </div>
          )}

          <div
            role="tablist"
            aria-label={copy.title}
            className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-950"
          >
            <button
              type="button"
              role="tab"
              aria-selected={chartMode === 'daily'}
              data-testid="project-growth-tab-daily"
              onClick={() => {
                playUiSound('tap');
                setChartMode('daily');
              }}
              className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                chartMode === 'daily'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {copy.modeDaily}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={chartMode === 'cumulative'}
              data-testid="project-growth-tab-cumulative"
              onClick={() => {
                playUiSound('tap');
                setChartMode('cumulative');
              }}
              className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                chartMode === 'cumulative'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {copy.modeCumulative}
            </button>
          </div>

          <button
            type="button"
            data-testid="project-growth-collapse-btn"
            aria-expanded={!collapsed}
            aria-label={collapsed ? copy.toggleExpand : copy.toggleCollapse}
            onClick={() => {
              playUiSound('tap');
              setCollapsed((prev) => !prev);
            }}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {collapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-14 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
              <div className="h-52 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
            </div>
          ) : (
            <>
              {/* 4-Column Tabular KPI Strip */}
              <dl className="grid grid-cols-2 gap-y-2.5 divide-slate-200 rounded-xl border border-slate-200/80 bg-slate-50/70 py-2.5 sm:grid-cols-4 sm:gap-y-0 sm:divide-x dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="px-3">
                  <dt className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {copy.kpiNew30d}
                  </dt>
                  <dd
                    data-testid="project-growth-kpi-new"
                    className="mt-0.5 font-mono text-sm font-bold tabular-nums text-blue-700 dark:text-sky-400"
                  >
                    <span>+{summary.totalSubmissions30d.toLocaleString()}</span>
                    {summary.growthRatePct > 0 && (
                      <span className="mt-0.5 block font-sans text-[11px] font-medium text-emerald-700 sm:mt-0 sm:ml-1.5 sm:inline dark:text-emerald-400">
                        +{summary.growthRatePct}% {copy.catalogGrowthSuffix}
                      </span>
                    )}
                  </dd>
                </div>

                <div className="px-3">
                  <dt className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {copy.kpiPeakDay}
                  </dt>
                  <dd
                    data-testid="project-growth-kpi-peak"
                    className="mt-0.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
                  >
                    {summary.peakDay ? (
                      <span>
                        {summary.peakDay.shortDate} · +{summary.peakDay.count}
                      </span>
                    ) : (
                      <span className="font-sans text-xs font-medium text-slate-500 dark:text-slate-400">
                        {copy.noPeakYet}
                      </span>
                    )}
                  </dd>
                </div>

                <div className="border-t border-slate-200 px-3 pt-2 sm:border-t-0 sm:pt-0 dark:border-slate-800">
                  <dt className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {copy.kpiWeeklyPace}
                  </dt>
                  <dd
                    data-testid="project-growth-kpi-pace"
                    className="mt-0.5 flex items-baseline gap-1.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
                  >
                    <span>
                      {summary.avgPerWeek.toFixed(1)}
                      {copy.perWeekUnit}
                    </span>
                    <span className="font-sans text-[11px] font-normal text-slate-500 dark:text-slate-400">
                      · {summary.activeSubmissionDays} {copy.activeDaysSuffix}
                    </span>
                  </dd>
                </div>

                <div className="border-t border-slate-200 px-3 pt-2 sm:border-t-0 sm:pt-0 dark:border-slate-800">
                  <dt className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                    {copy.kpiCatalogTotal}
                  </dt>
                  <dd
                    data-testid="project-growth-kpi-total"
                    className="mt-0.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
                  >
                    {summary.totalCatalogProjects.toLocaleString()}
                  </dd>
                </div>
              </dl>

              {summary.totalSubmissions30d === 0 && chartMode === 'daily' ? (
                <div
                  data-testid="project-growth-empty-state"
                  className="mt-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-4 py-6 text-center dark:border-slate-700 dark:bg-slate-950/50"
                >
                  <TrendingUp className="mx-auto h-6 w-6 text-slate-400 dark:text-slate-500" />
                  <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">
                    {copy.emptyTitle}
                  </p>
                  <p className="mx-auto mt-1 max-w-md text-xs text-slate-600 dark:text-slate-400">
                    {effectiveScope === 'filtered' ? copy.emptyFilteredBody : copy.emptyCatalogBody}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                    {effectiveScope === 'filtered' && (
                      <button
                        type="button"
                        onClick={() => {
                          playUiSound('tap');
                          setScope('all');
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <span>{copy.scopeAll}</span>
                      </button>
                    )}
                    {hasActiveFilters && onResetFilters && (
                      <button
                        type="button"
                        onClick={() => {
                          playUiSound('tap');
                          onResetFilters();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.resetFilterButton}</span>
                      </button>
                    )}
                    {onNavigateSubmit && (
                      <button
                        type="button"
                        onClick={() => {
                          playUiSound('tap');
                          onNavigateSubmit();
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.submitProjectButton}</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* Recharts 30-Day Visualization */}
                  <div
                    data-testid="project-growth-chart-container"
                    className="mt-3 h-52 w-full min-w-0"
                  >
                    <ResponsiveContainer
                      width="100%"
                      height={208}
                      initialDimension={{ width: 720, height: 208 }}
                    >
                      {chartMode === 'daily' ? (
                        <ComposedChart
                          data={summary.points}
                          margin={{ top: 10, right: 12, left: -14, bottom: 0 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={gridStrokeColor}
                          />
                          <XAxis
                            dataKey="shortDate"
                            tick={{ fontSize: 11, fill: axisTickColor }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                          />
                          <YAxis
                            allowDecimals={false}
                            width={34}
                            domain={[0, (dataMax: number) => Math.max(3, Math.ceil(dataMax * 1.2))]}
                            tick={{ fontSize: 11, fill: axisTickColor }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(241, 245, 249, 0.8)' }}
                            content={
                              <SubmissionGrowthTooltip
                                mode="daily"
                                dailyLabel={copy.dailySeriesLabel}
                                rollingAvgLabel={copy.rollingAvgLabel}
                                cumulativeLabel={copy.cumulativeSeriesLabel}
                                submittedLabel={copy.tooltipProjectsLabel}
                                moreSuffix={copy.tooltipMoreSuffix}
                              />
                            }
                          />
                          <Bar
                            dataKey="dailySubmissions"
                            name={copy.dailySeriesLabel}
                            fill={barColor}
                            radius={[4, 4, 0, 0]}
                            maxBarSize={18}
                            isAnimationActive={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="rolling7dAvg"
                            name={copy.rollingAvgLabel}
                            stroke={rollingLineColor}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 3.5, fill: rollingLineColor, strokeWidth: 0 }}
                            isAnimationActive={false}
                          />
                        </ComposedChart>
                      ) : (
                        <AreaChart
                          data={summary.points}
                          margin={{ top: 10, right: 12, left: -14, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id={`${gradientId}-cum`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={areaStrokeColor} stopOpacity={0.28} />
                              <stop offset="95%" stopColor={areaStrokeColor} stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke={gridStrokeColor}
                          />
                          <XAxis
                            dataKey="shortDate"
                            tick={{ fontSize: 11, fill: axisTickColor }}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={24}
                          />
                          <YAxis
                            allowDecimals={false}
                            width={40}
                            domain={['dataMin', 'auto']}
                            tick={{ fontSize: 11, fill: axisTickColor }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip
                            content={
                              <SubmissionGrowthTooltip
                                mode="cumulative"
                                dailyLabel={copy.dailySeriesLabel}
                                rollingAvgLabel={copy.rollingAvgLabel}
                                cumulativeLabel={copy.cumulativeSeriesLabel}
                                submittedLabel={copy.tooltipProjectsLabel}
                                moreSuffix={copy.tooltipMoreSuffix}
                              />
                            }
                          />
                          <Area
                            type="monotone"
                            dataKey="cumulativeProjects"
                            name={copy.cumulativeSeriesLabel}
                            stroke={areaStrokeColor}
                            strokeWidth={2.25}
                            fill={`url(#${gradientId}-cum)`}
                            activeDot={{ r: 4, fill: areaStrokeColor, strokeWidth: 0 }}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>

                  {/* Clean Legend & Date Bounds */}
                  <div className="mt-2 flex flex-col gap-1.5 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
                    <div className="flex items-center justify-between gap-2 font-mono tabular-nums sm:contents">
                      <span className="sm:order-1">{summary.windowStartDate}</span>
                      <span className="sm:order-3">{summary.windowEndDate}</span>
                    </div>
                    {chartMode === 'daily' ? (
                      <div className="flex flex-wrap items-center gap-4 sm:order-2">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="inline-block h-2.5 w-2.5 rounded-xs bg-blue-600 dark:bg-sky-400"
                          />
                          <span>{copy.dailySeriesLabel}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="inline-block h-0.5 w-4 bg-emerald-600 dark:bg-emerald-400"
                          />
                          <span>{copy.rollingAvgLabel}</span>
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 sm:order-2">
                        <span
                          aria-hidden="true"
                          className="inline-block h-0.5 w-4 bg-blue-700 dark:bg-blue-400"
                        />
                        <span>{copy.cumulativeSeriesLabel}</span>
                      </span>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
