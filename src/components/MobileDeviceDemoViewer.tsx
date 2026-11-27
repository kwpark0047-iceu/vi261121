import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Globe,
  Layers,
  Package,
  QrCode,
  RotateCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TabletSmartphone,
} from 'lucide-react';
import type {
  AppLanguage,
  CatalogProject,
  MobileDemoOrientation,
  MobileDevicePreset,
} from '../types/vibeatlas';
import {
  BACKEND_LABELS,
  CONTENT_TYPE_LABELS,
  PLATFORM_LABELS,
  PRICING_LABELS,
  UI_STRINGS,
} from '../data/i18n';
import {
  buildQrSvgMatrix,
  extractMobileStoreLinks,
  formatMobilePlatformLabel,
  getMobileFrameGeometry,
  resolveMobileQrTargetUrl,
  resolvePrimaryMobilePreviewUrl,
} from '../lib/mobileAppDemo';
import { buildProjectShareUrl } from '../lib/submissionPromotion';
import { playUiSound } from '../lib/soundEffects';
import { PastelCategoryIcon } from './PastelCategoryIcon';

interface MobileDeviceDemoViewerProps {
  project: CatalogProject;
  language: AppLanguage;
  compact?: boolean;
  mode?: PreviewMode;
  onModeChange?: (mode: PreviewMode) => void;
}

type PreviewMode = 'card' | 'iframe';
type MockScreenTab = 'overview' | 'stack' | 'release';

async function copyTextSafe(value: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      // fallback below
    }
  }
  if (typeof document === 'undefined') return false;
  try {
    const el = document.createElement('textarea');
    el.value = value;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}

export function MobileDeviceDemoViewer({
  project,
  language,
  compact = false,
  mode: controlledMode,
  onModeChange,
}: MobileDeviceDemoViewerProps) {
  const copy = UI_STRINGS[language].mobileDemo;
  const cfg = project.mobileConfig;

  const [preset, setPreset] = useState<MobileDevicePreset>(cfg?.devicePreset ?? 'iphone_16');
  const [orientation, setOrientation] = useState<MobileDemoOrientation>(
    cfg?.orientation ?? 'portrait'
  );
  const previewUrl = useMemo(() => resolvePrimaryMobilePreviewUrl(project), [project]);
  const [internalMode, setInternalMode] = useState<PreviewMode>('card');
  const mode = controlledMode ?? internalMode;
  const setMode = (nextMode: PreviewMode) => {
    setInternalMode(nextMode);
    onModeChange?.(nextMode);
  };
  const [mockTab, setMockTab] = useState<MockScreenTab>('overview');
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync preset & orientation when inspecting a different project or editing live preview
  useEffect(() => {
    setPreset(cfg?.devicePreset ?? 'iphone_16');
    setOrientation(cfg?.orientation ?? 'portrait');
  }, [project.id, cfg?.devicePreset, cfg?.orientation]);

  useEffect(() => {
    setIframeLoaded(false);
  }, [previewUrl, mode]);

  useEffect(() => {
    if (!copiedLink) return;
    const t = window.setTimeout(() => setCopiedLink(false), 2000);
    return () => window.clearTimeout(t);
  }, [copiedLink]);

  const baseOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://vibeatlas.app';
  const shareUrl = useMemo(
    () => buildProjectShareUrl(baseOrigin, project.slug || 'preview'),
    [baseOrigin, project.slug]
  );

  const qrTarget = useMemo(
    () => resolveMobileQrTargetUrl(project, shareUrl),
    [project, shareUrl]
  );
  const qrMatrix = useMemo(() => buildQrSvgMatrix(qrTarget.url), [qrTarget.url]);
  const storeLinks = useMemo(() => extractMobileStoreLinks(project), [project]);
  const geometry = useMemo(
    () => getMobileFrameGeometry(preset, orientation),
    [preset, orientation]
  );

  const tagline =
    language === 'ko' && project.taglineKo.trim() ? project.taglineKo : project.tagline;
  const fullDesc =
    language === 'ko' && project.descriptionKo.trim()
      ? project.descriptionKo
      : project.description;

  const qrCaption =
    qrTarget.sourceKind === 'mobile_demo' || qrTarget.sourceKind === 'live_demo'
      ? copy.qrSubtitleDemo
      : qrTarget.sourceKind === 'share_page'
        ? copy.qrSubtitleShare
        : copy.qrSubtitleStore;

  const platforms = cfg?.platforms ?? [];

  return (
    <section
      data-testid="mobile-device-demo-viewer"
      className="rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/50 via-white to-sky-50/40 p-4 sm:p-5 dark:border-cyan-900/60 dark:from-slate-900 dark:via-slate-950 dark:to-cyan-950/20"
    >
      {/* Header + Simulator Controls */}
      <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div className="flex items-start gap-2.5">
          <PastelCategoryIcon contentType="mobile_app" size="sm" animated={false} />
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {compact ? copy.liveSubmitPreviewTitle : copy.simulatorTitle}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {compact ? copy.liveSubmitPreviewSubtitle : copy.simulatorSubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Device Frame Switcher */}
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              data-testid="mobile-sim-preset-iphone"
              aria-pressed={preset === 'iphone_16'}
              onClick={() => {
                playUiSound('tap');
                setPreset('iphone_16');
              }}
              className={`min-h-[34px] whitespace-nowrap rounded-lg px-2.5 text-[11px] font-medium transition-colors ${
                preset === 'iphone_16'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {copy.presetIphone}
            </button>
            <button
              type="button"
              data-testid="mobile-sim-preset-pixel"
              aria-pressed={preset === 'pixel_9'}
              onClick={() => {
                playUiSound('tap');
                setPreset('pixel_9');
              }}
              className={`min-h-[34px] whitespace-nowrap rounded-lg px-2.5 text-[11px] font-medium transition-colors ${
                preset === 'pixel_9'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {copy.presetPixel}
            </button>
          </div>

          {/* Orientation Toggle */}
          <button
            type="button"
            data-testid="mobile-sim-rotate-btn"
            aria-pressed={orientation === 'landscape'}
            onClick={() => {
              playUiSound('tap');
              setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'));
            }}
            className="inline-flex min-h-[36px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {orientation === 'portrait' ? copy.orientationPortrait : copy.orientationLandscape}
            </span>
          </button>

          {/* Interactive Card vs Live Web Frame Mode */}
          {previewUrl && !compact && (
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-0.5 dark:border-slate-800 dark:bg-slate-900">
              <button
                type="button"
                data-testid="mobile-sim-mode-card"
                aria-pressed={mode === 'card'}
                onClick={() => {
                  playUiSound('tap');
                  setMode('card');
                }}
                className={`min-h-[34px] whitespace-nowrap rounded-lg px-2.5 text-[11px] font-medium transition-colors ${
                  mode === 'card'
                    ? 'bg-cyan-700 text-white dark:bg-cyan-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {copy.modeAppCard}
              </button>
              <button
                type="button"
                data-testid="mobile-sim-mode-iframe"
                aria-pressed={mode === 'iframe'}
                onClick={() => {
                  playUiSound('tap');
                  setMode('iframe');
                }}
                className={`min-h-[34px] whitespace-nowrap rounded-lg px-2.5 text-[11px] font-medium transition-colors ${
                  mode === 'iframe'
                    ? 'bg-cyan-700 text-white dark:bg-cyan-600'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {copy.modeLiveFrame}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Device Bezel Left + QR & Store Links Right */}
      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Device Bezel Stage */}
        <div className="flex flex-col items-center justify-center lg:col-span-7">
          <div
            data-testid="mobile-device-frame"
            data-preset={preset}
            data-orientation={orientation}
            className={`relative mx-auto w-full border-[6px] border-slate-800 bg-slate-950 p-1.5 shadow-xl transition-all dark:border-slate-700 ${
              geometry.bezelClass
            } ${
              orientation === 'portrait'
                ? 'max-w-[260px] sm:max-w-[276px]'
                : 'max-w-[500px]'
            }`}
          >
            {/* Screen Canvas with Fixed Smartphone Aspect Ratio */}
            <div
              className={`relative flex w-full flex-col overflow-hidden bg-white dark:bg-slate-900 ${
                preset === 'iphone_16' ? 'rounded-[30px]' : 'rounded-[21px]'
              } ${geometry.aspectClass}`}
            >
              {/* Status Bar + Notch / Punch Hole */}
              <div className="relative flex shrink-0 items-center justify-between border-b border-slate-100 bg-white/95 px-5 pt-2.5 pb-1.5 text-[10px] font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                <span className="font-mono tabular-nums">9:41</span>
                {geometry.notchType === 'dynamic_island' ? (
                  <span
                    aria-hidden="true"
                    className="h-3.5 w-20 rounded-full bg-slate-900 dark:bg-black"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="h-3 w-3 rounded-full bg-slate-900 ring-2 ring-slate-700 dark:bg-black"
                  />
                )}
                <span className="font-mono text-[9px] text-slate-500 dark:text-slate-400">
                  {geometry.viewportWidth}×{geometry.viewportHeight}
                </span>
              </div>

              {/* Screen Body */}
              {mode === 'iframe' && previewUrl && !compact ? (
                <div className="relative flex flex-1 flex-col bg-slate-50 dark:bg-slate-950">
                  {!iframeLoaded && (
                    <div className="flex items-center justify-between border-b border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                      <span className="truncate">{copy.iframeFallbackNotice}</span>
                      <button
                        type="button"
                        onClick={() => setMode('card')}
                        className="ml-2 shrink-0 font-semibold underline"
                      >
                        {copy.iframeBlockedButton}
                      </button>
                    </div>
                  )}
                  <iframe
                    title={`${project.name} mobile demo`}
                    src={previewUrl}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    onLoad={() => setIframeLoaded(true)}
                    className="h-full w-full flex-1 border-0 bg-white"
                  />
                </div>
              ) : (
                <div className="flex flex-1 flex-col justify-between overflow-y-auto p-3.5">
                  <div>
                    {/* App Header inside simulated phone */}
                    <div className="flex items-start gap-2.5">
                      <PastelCategoryIcon contentType={project.contentType} size="md" animated={false} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-400">
                          {CONTENT_TYPE_LABELS[language][project.contentType]}
                        </p>
                        <h4 className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {project.name}
                        </h4>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                          {project.makerName}
                          {project.makerHandle ? ` · ${project.makerHandle}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Simulated in-app segmented tabs */}
                    <div
                      role="tablist"
                      aria-label={project.name}
                      className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80"
                    >
                      {(
                        [
                          ['overview', copy.previewTabOverview],
                          ['stack', copy.previewTabFeatures],
                          ['release', copy.previewTabRelease],
                        ] as const
                      ).map(([tabKey, tabLabel]) => {
                        const active = mockTab === tabKey;
                        return (
                          <button
                            key={tabKey}
                            type="button"
                            role="tab"
                            aria-selected={active}
                            onClick={() => {
                              playUiSound('tap');
                              setMockTab(tabKey);
                            }}
                            className={`rounded-lg py-1.5 text-[11px] font-semibold transition-colors ${
                              active
                                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white'
                                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                          >
                            {tabLabel}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab Panel Content */}
                    {mockTab === 'overview' && (
                      <div className="mt-3 space-y-2.5">
                        <p className="text-xs font-medium leading-snug text-slate-800 dark:text-slate-100">
                          {tagline}
                        </p>
                        <p className="line-clamp-4 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                          {fullDesc}
                        </p>
                        {platforms.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {platforms.map((os) => (
                              <span
                                key={os}
                                className="inline-flex items-center gap-1 rounded-md border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-800 dark:border-cyan-900 dark:bg-cyan-950/50 dark:text-cyan-300"
                              >
                                <Smartphone className="h-2.5 w-2.5" aria-hidden="true" />
                                {formatMobilePlatformLabel(os, language)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {mockTab === 'stack' && (
                      <div className="mt-3 space-y-2">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                            {PLATFORM_LABELS[project.developmentPlatform]} ·{' '}
                            {BACKEND_LABELS[project.backendTech]}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {project.techStack.slice(0, 8).map((item) => (
                              <span
                                key={item}
                                className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {PRICING_LABELS[language][project.pricingModel]} · {project.license}
                        </p>
                      </div>
                    )}

                    {mockTab === 'release' && (
                      <div className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-[11px] dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 dark:text-slate-400">
                            {copy.bundleIdLabel}
                          </span>
                          <span className="truncate font-mono font-medium text-slate-800 dark:text-slate-200">
                            {cfg?.bundleId || '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 dark:text-slate-400">
                            {copy.minOsLabel}
                          </span>
                          <span className="truncate font-mono font-medium text-slate-800 dark:text-slate-200">
                            {cfg?.minOsVersion || '—'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-500 dark:text-slate-400">Status</span>
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400">
                            <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                            {project.verificationStatus}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Simulated bottom in-app action bar */}
                  <div className="mt-3 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                    {previewUrl && !compact ? (
                      <button
                        type="button"
                        onClick={() => {
                          playUiSound('tap');
                          setMode('iframe');
                        }}
                        className="flex min-h-[38px] w-full items-center justify-center gap-1.5 rounded-xl bg-cyan-700 px-3 text-xs font-semibold text-white transition-colors hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{copy.previewInteractiveCta}</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-2 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <TabletSmartphone className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {geometry.viewportWidth} × {geometry.viewportHeight}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Home Gesture Indicator */}
              <div className="flex shrink-0 justify-center bg-white py-1.5 dark:bg-slate-950">
                <span aria-hidden="true" className="h-1 w-20 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scannable QR Code + Direct Store Links + Specs */}
        <div className="space-y-4 lg:col-span-5">
          {/* QR Card */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2">
              <QrCode className="h-4 w-4 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{copy.qrTitle}</h4>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              {qrCaption}
            </p>

            <div className="mt-3 flex flex-col gap-2.5">
              {qrMatrix && (
                <div className="flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50/80 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                  <div
                    data-testid="mobile-demo-qr-svg"
                    className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs"
                  >
                    <svg
                      width={120}
                      height={120}
                      viewBox={`0 0 ${qrMatrix.size} ${qrMatrix.size}`}
                      role="img"
                      aria-label={copy.qrTitle}
                      shapeRendering="crispEdges"
                    >
                      <rect width={qrMatrix.size} height={qrMatrix.size} fill="#ffffff" />
                      {qrMatrix.modules.map((dark, idx) => {
                        if (!dark) return null;
                        const x = idx % qrMatrix.size;
                        const y = Math.floor(idx / qrMatrix.size);
                        return <rect key={idx} x={x} y={y} width={1} height={1} fill="#0f172a" />;
                      })}
                    </svg>
                  </div>
                </div>
              )}

              <p
                title={qrTarget.url}
                className="truncate rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                {qrTarget.url}
              </p>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  data-testid="mobile-demo-copy-link-btn"
                  onClick={async () => {
                    await copyTextSafe(qrTarget.url);
                    playUiSound('sparkle');
                    setCopiedLink(true);
                  }}
                  className="inline-flex min-h-[38px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {copiedLink ? (
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span>{copiedLink ? copy.copiedLinkLabel : copy.copyDemoLinkButton}</span>
                </button>
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    <span>{copy.openExternalButton}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Store & Build Distribution Buttons */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              {copy.storeLinksTitle}
            </h4>
            {storeLinks.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {copy.noStoreLinksNote}
              </p>
            ) : (
              <div className="mt-2.5 flex flex-col gap-2">
                {storeLinks.map((item) => (
                  <a
                    key={`${item.kind}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`mobile-store-link-${item.kind}`}
                    className="flex min-h-[42px] items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-medium text-slate-800 transition-colors hover:border-cyan-300 hover:bg-cyan-50/50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-cyan-800 dark:hover:bg-cyan-950/30"
                  >
                    <span className="inline-flex items-center gap-2 truncate">
                      {item.kind === 'ios' && (
                        <Smartphone className="h-3.5 w-3.5 shrink-0 text-slate-700 dark:text-slate-300" />
                      )}
                      {item.kind === 'android' && (
                        <Download className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {item.kind === 'package' && (
                        <Package className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-400" />
                      )}
                      {item.kind === 'demo' && (
                        <Globe className="h-3.5 w-3.5 shrink-0 text-cyan-600 dark:text-cyan-400" />
                      )}
                      <span className="truncate font-semibold">{item.providerBadge}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}

            {/* Mobile App Technical Specs */}
            {(platforms.length > 0 || cfg?.bundleId || cfg?.minOsVersion) && (
              <div className="mt-3.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{copy.specsTitle}</span>
                </p>
                <dl className="mt-2 space-y-1.5 text-xs">
                  {platforms.length > 0 && (
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-slate-500 dark:text-slate-400">OS</dt>
                      <dd className="font-medium text-slate-800 dark:text-slate-200">
                        {platforms.map((os) => formatMobilePlatformLabel(os, language)).join(' · ')}
                      </dd>
                    </div>
                  )}
                  {cfg?.bundleId && (
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-slate-500 dark:text-slate-400">{copy.bundleIdLabel}</dt>
                      <dd className="truncate font-mono text-[11px] text-slate-800 dark:text-slate-200">
                        {cfg.bundleId}
                      </dd>
                    </div>
                  )}
                  {cfg?.minOsVersion && (
                    <div className="flex items-center justify-between gap-2">
                      <dt className="text-slate-500 dark:text-slate-400">{copy.minOsLabel}</dt>
                      <dd className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                        {cfg.minOsVersion}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
