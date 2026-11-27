import { useEffect, useId, useMemo, useState } from 'react';
import { RefreshCw, Star, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AppLanguage, CatalogProject } from '../types/vibeatlas';
import { UI_STRINGS } from '../data/i18n';
import { formatCompactCount } from '../lib/catalogEngine';
import { playUiSound } from '../lib/soundEffects';
import { recordStarSnapshot } from '../lib/starHistory';
import {
  buildStarSnapshotChartSeries,
  computeSnapshotStarDomain,
  type StarSnapshotChartPoint,
  type StarSnapshotRange,
} from '../lib/starSnapshotChart';

interface StarGrowthModalChartProps {
  project: CatalogProject;
  language: AppLanguage;
  isSyncing: boolean;
  snapshotRevision?: number;
  onSyncSingleGithub: (project: CatalogProject) => void;
}

type SeriesMode = 'total' | 'delta';

interface TooltipPayloadItem {
  payload?: StarSnapshotChartPoint;
}

interface StarSnapshotTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<TooltipPayloadItem>;
  totalLabel: string;
  deltaLabel: string;
  cumulativeLabel: string;
}

function StarSnapshotTooltip({
  active,
  payload,
  totalLabel,
  deltaLabel,
  cumulativeLabel,
}: StarSnapshotTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  const deltaPrefix = point.dailyDelta > 0 ? '+' : '';
  const gainPrefix = point.cumulativeGain > 0 ? '+' : '';

  return (
    <div className="rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-xs shadow-sm backdrop-blur-xs dark:border-slate-700 dark:bg-slate-900/95">
      <p className="font-mono font-semibold tabular-nums text-slate-900 dark:text-white">
        {point.date}
      </p>
      <div className="mt-1 space-y-0.5 font-mono tabular-nums">
        <p className="text-amber-700 dark:text-amber-400">
          {totalLabel}: ★ {point.stars.toLocaleString()}
        </p>
        <p
          className={
            point.dailyDelta > 0
              ? 'text-emerald-700 dark:text-emerald-400'
              : point.dailyDelta < 0
                ? 'text-rose-700 dark:text-rose-400'
                : 'text-slate-500 dark:text-slate-400'
          }
        >
          {deltaLabel}: {deltaPrefix}
          {point.dailyDelta.toLocaleString()}
        </p>
        {point.cumulativeGain !== 0 && (
          <p className="text-blue-700 dark:text-sky-400">
            {cumulativeLabel}: {gainPrefix}
            {point.cumulativeGain.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}

export function StarGrowthModalChart({
  project,
  language,
  isSyncing,
  snapshotRevision = 0,
  onSyncSingleGithub,
}: StarGrowthModalChartProps) {
  const copy = UI_STRINGS[language].detail;
  const gradientId = useId().replace(/:/g, '');

  const [range, setRange] = useState<StarSnapshotRange>('30d');
  const [seriesMode, setSeriesMode] = useState<SeriesMode>('total');
  const [localSyncBump, setLocalSyncBump] = useState(0);
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

  // Ensure live synced projects write a snapshot into vibeatlas_star_snapshots_v1 cleanly
  useEffect(() => {
    if (project.githubRepo && project.lastSyncedAt && project.githubStars > 0) {
      recordStarSnapshot(project.githubRepo, project.lastSyncedAt, project.githubStars);
      setLocalSyncBump((v) => v + 1);
    }
  }, [project.githubRepo, project.lastSyncedAt, project.githubStars]);

  const series = useMemo(() => {
    void snapshotRevision;
    void localSyncBump;
    return buildStarSnapshotChartSeries(project, range);
  }, [project, range, snapshotRevision, localSyncBump]);

  const yDomain = useMemo(() => computeSnapshotStarDomain(series.points), [series.points]);

  const strokeColor = isDark ? '#fbbf24' : '#d97706';
  const positiveBarColor = isDark ? '#34d399' : '#059669';
  const neutralBarColor = isDark ? '#475569' : '#cbd5e1';
  const negativeBarColor = isDark ? '#fb7185' : '#e11d48';
  const axisTickColor = isDark ? '#94a3b8' : '#64748b';
  const gridStrokeColor = isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(148, 163, 184, 0.25)';

  const rangeOptions: Array<{ id: StarSnapshotRange; label: string }> = [
    { id: '7d', label: copy.starGrowthRange7d },
    { id: '30d', label: copy.starGrowthRange30d },
    { id: 'all', label: copy.starGrowthRangeAll },
  ];

  const netPrefix = series.periodNetDelta > 0 ? '+' : '';
  const avgPrefix = series.avgDailyDelta > 0 ? '+' : '';

  return (
    <section
      aria-labelledby="detail-star-growth-heading"
      data-testid="modal-star-growth-section"
      className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900"
    >
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3
              id="detail-star-growth-heading"
              className="text-sm font-bold text-slate-900 dark:text-white"
            >
              {copy.starGrowthTitle}
            </h3>
            {project.githubRepo && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {project.githubRepo}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {copy.starGrowthSubtitle}
          </p>
        </div>

        {(series.status === 'trend' || series.status === 'single_snapshot') && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <div
              role="group"
              aria-label={copy.starGrowthTitle}
              className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-950"
            >
              {rangeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  data-testid={`star-growth-range-${opt.id}`}
                  aria-pressed={range === opt.id}
                  onClick={() => {
                    playUiSound('tap');
                    setRange(opt.id);
                  }}
                  className={`whitespace-nowrap shrink-0 rounded-md px-2 py-1 text-[11px] font-medium transition-colors ${
                    range === opt.id
                      ? 'bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {series.status === 'trend' && (
              <div
                role="tablist"
                aria-label={copy.starGrowthTitle}
                className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 dark:border-slate-800 dark:bg-slate-950"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={seriesMode === 'total'}
                  data-testid="star-growth-mode-total"
                  onClick={() => {
                    playUiSound('tap');
                    setSeriesMode('total');
                  }}
                  className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    seriesMode === 'total'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {copy.starGrowthModeTotal}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={seriesMode === 'delta'}
                  data-testid="star-growth-mode-delta"
                  onClick={() => {
                    playUiSound('tap');
                    setSeriesMode('delta');
                  }}
                  className={`whitespace-nowrap shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                    seriesMode === 'delta'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {copy.starGrowthModeDelta}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* State: No GitHub Repo */}
      {series.status === 'no_repo' && (
        <div
          data-testid="star-growth-no-repo"
          className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-400"
        >
          {copy.starGrowthNoRepo}
        </div>
      )}

      {/* State: Unsynced GitHub Repo */}
      {series.status === 'unsynced' && (
        <div
          data-testid="star-growth-unsynced"
          className="mt-4 flex flex-col items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/80 px-4 py-5 text-center sm:flex-row sm:text-left dark:border-slate-700 dark:bg-slate-950/60"
        >
          <p className="text-xs text-slate-600 dark:text-slate-300">{copy.starGrowthUnsynced}</p>
          <button
            type="button"
            disabled={isSyncing}
            data-testid="star-growth-sync-btn"
            onClick={() => {
              playUiSound('tap');
              onSyncSingleGithub(project);
            }}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? copy.syncing : copy.syncGithubNow}</span>
          </button>
        </div>
      )}

      {/* States: Trend or Single Snapshot */}
      {(series.status === 'trend' || series.status === 'single_snapshot') && (
        <div className="mt-4">
          {/* 4-Column Tabular KPI Strip */}
          <dl className="grid grid-cols-2 gap-y-2.5 divide-slate-200 rounded-xl border border-slate-200/80 bg-slate-50/70 py-2.5 sm:grid-cols-4 sm:gap-y-0 sm:divide-x dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="px-3">
              <dt className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                {copy.starGrowthKpiCurrent}
              </dt>
              <dd
                data-testid="star-growth-kpi-current"
                className="mt-0.5 inline-flex items-center gap-1 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
              >
                <Star className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>{series.latestStars.toLocaleString()}</span>
              </dd>
            </div>

            <div className="px-3">
              <dt className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                {copy.starGrowthKpiNet}
              </dt>
              <dd
                data-testid="star-growth-kpi-net"
                className={`mt-0.5 font-mono text-sm font-bold tabular-nums ${
                  series.periodNetDelta > 0
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : series.periodNetDelta < 0
                      ? 'text-rose-700 dark:text-rose-400'
                      : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <span>
                  {netPrefix}
                  {series.periodNetDelta.toLocaleString()}
                </span>
                {series.periodPctChange !== null && (
                  <span className="ml-1 text-[11px] font-medium">
                    ({netPrefix}
                    {series.periodPctChange}%)
                  </span>
                )}
              </dd>
            </div>

            <div className="border-t border-slate-200 px-3 pt-2 sm:border-t-0 sm:pt-0 dark:border-slate-800">
              <dt className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                {copy.starGrowthKpiAvgDay}
              </dt>
              <dd
                data-testid="star-growth-kpi-avg"
                className="mt-0.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
              >
                {avgPrefix}
                {series.avgDailyDelta.toLocaleString()}
                <span className="ml-0.5 font-sans text-[11px] font-normal text-slate-500 dark:text-slate-400">
                  {copy.starGrowthPerDaySuffix}
                </span>
              </dd>
            </div>

            <div className="border-t border-slate-200 px-3 pt-2 sm:border-t-0 sm:pt-0 dark:border-slate-800">
              <dt className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                {copy.starGrowthKpiSnapshots}
              </dt>
              <dd
                data-testid="star-growth-kpi-snapshots"
                className="mt-0.5 font-mono text-sm font-bold tabular-nums text-slate-900 dark:text-white"
              >
                {series.snapshotCount}
                <span className="ml-0.5 font-sans text-[11px] font-normal text-slate-500 dark:text-slate-400">
                  {copy.starGrowthDaysSuffix}
                </span>
              </dd>
            </div>
          </dl>

          {series.status === 'single_snapshot' && (
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              <span>{copy.starGrowthSingleBaseline}</span>
              <button
                type="button"
                disabled={isSyncing}
                onClick={() => {
                  playUiSound('tap');
                  onSyncSingleGithub(project);
                }}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-amber-300 bg-white px-2 py-1 text-[11px] font-medium text-amber-900 hover:bg-amber-100 disabled:opacity-60 dark:border-amber-800 dark:bg-slate-900 dark:text-amber-200 dark:hover:bg-amber-950"
              >
                <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? copy.syncing : copy.syncGithubNow}</span>
              </button>
            </div>
          )}

          {/* Recharts Container */}
          <div
            data-testid="modal-star-growth-chart-container"
            className="mt-3 h-52 w-full min-w-0"
          >
            <ResponsiveContainer
              width="100%"
              height={208}
              initialDimension={{ width: 640, height: 208 }}
            >
              {seriesMode === 'total' || series.status === 'single_snapshot' ? (
                <AreaChart
                  data={series.points}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id={`${gradientId}-stars`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0.02} />
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
                    minTickGap={20}
                  />
                  <YAxis
                    width={52}
                    domain={yDomain}
                    tickFormatter={formatCompactCount}
                    tick={{ fontSize: 11, fill: axisTickColor }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    content={
                      <StarSnapshotTooltip
                        totalLabel={copy.starGrowthTooltipTotal}
                        deltaLabel={copy.starGrowthTooltipDelta}
                        cumulativeLabel={copy.starGrowthTooltipCumulative}
                      />
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="stars"
                    name={copy.starGrowthTooltipTotal}
                    stroke={strokeColor}
                    strokeWidth={2.25}
                    dot={series.points.length <= 16 ? { r: 3.5, fill: strokeColor, strokeWidth: 0 } : false}
                    activeDot={{ r: 5, fill: strokeColor, strokeWidth: 0 }}
                    fill={`url(#${gradientId}-stars)`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              ) : (
                <BarChart
                  data={series.points}
                  margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
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
                    minTickGap={20}
                  />
                  <YAxis
                    width={46}
                    tickFormatter={formatCompactCount}
                    tick={{ fontSize: 11, fill: axisTickColor }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(241, 245, 249, 0.8)' }}
                    content={
                      <StarSnapshotTooltip
                        totalLabel={copy.starGrowthTooltipTotal}
                        deltaLabel={copy.starGrowthTooltipDelta}
                        cumulativeLabel={copy.starGrowthTooltipCumulative}
                      />
                    }
                  />
                  <Bar
                    dataKey="dailyDelta"
                    name={copy.starGrowthTooltipDelta}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={22}
                    isAnimationActive={false}
                  >
                    {series.points.map((pt) => (
                      <Cell
                        key={pt.date}
                        fill={
                          pt.dailyDelta > 0
                            ? positiveBarColor
                            : pt.dailyDelta < 0
                              ? negativeBarColor
                              : neutralBarColor
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
            <span>{series.firstDate}</span>
            <span className="inline-flex items-center gap-1.5 font-sans">
              <span
                aria-hidden="true"
                className={`inline-block h-2 w-2 rounded-full ${
                  seriesMode === 'total' || series.status === 'single_snapshot'
                    ? 'bg-amber-600 dark:bg-amber-400'
                    : 'bg-emerald-600 dark:bg-emerald-400'
                }`}
              />
              <span>
                {seriesMode === 'total' || series.status === 'single_snapshot'
                  ? copy.starGrowthModeTotal
                  : copy.starGrowthModeDelta}
              </span>
            </span>
            <span>{series.lastDate}</span>
          </div>
        </div>
      )}
    </section>
  );
}
