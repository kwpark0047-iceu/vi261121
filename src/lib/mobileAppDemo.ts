import QRCode from 'qrcode';
import type {
  AppLanguage,
  CatalogProject,
  MobileAppConfig,
  MobileDemoOrientation,
  MobileDevicePreset,
  MobileTargetPlatform,
} from '../types/vibeatlas';
import { sanitizeExternalUrl } from './validation';

export const MOBILE_TARGET_PLATFORM_ORDER: ReadonlyArray<MobileTargetPlatform> = [
  'ios',
  'android',
  'pwa',
];

export const MOBILE_QUICK_TECH_STACK: ReadonlyArray<string> = [
  'React Native',
  'Expo',
  'Flutter',
  'SwiftUI',
  'Kotlin',
  'Capacitor',
  'PWA',
];

export const DEFAULT_MOBILE_APP_CONFIG: MobileAppConfig = {
  platforms: ['ios', 'android'],
  mobileDemoUrl: '',
  iosAppStoreUrl: '',
  androidPlayStoreUrl: '',
  mobilePackageUrl: '',
  bundleId: '',
  minOsVersion: '',
  devicePreset: 'iphone_16',
  orientation: 'portrait',
};

export function normalizeMobilePlatforms(
  platforms: ReadonlyArray<string> | undefined | null
): MobileTargetPlatform[] {
  if (!Array.isArray(platforms)) return [];
  const valid = new Set<MobileTargetPlatform>();
  for (const raw of platforms) {
    const trimmed = String(raw || '').trim().toLowerCase();
    if (trimmed === 'ios' || trimmed === 'android' || trimmed === 'pwa') {
      valid.add(trimmed);
    }
  }
  return MOBILE_TARGET_PLATFORM_ORDER.filter((item) => valid.has(item));
}

export function normalizeMobileConfig(
  raw: Partial<MobileAppConfig> | null | undefined
): MobileAppConfig | undefined {
  if (!raw || typeof raw !== 'object') return undefined;

  const platforms = normalizeMobilePlatforms(raw.platforms);
  const mobileDemoUrl = String(raw.mobileDemoUrl || '').trim().slice(0, 500);
  const iosAppStoreUrl = String(raw.iosAppStoreUrl || '').trim().slice(0, 500);
  const androidPlayStoreUrl = String(raw.androidPlayStoreUrl || '').trim().slice(0, 500);
  const mobilePackageUrl = String(raw.mobilePackageUrl || '').trim().slice(0, 500);
  const bundleId = String(raw.bundleId || '').trim().slice(0, 120);
  const minOsVersion = String(raw.minOsVersion || '').trim().slice(0, 64);
  const devicePreset: MobileDevicePreset =
    raw.devicePreset === 'pixel_9' ? 'pixel_9' : 'iphone_16';
  const orientation: MobileDemoOrientation =
    raw.orientation === 'landscape' ? 'landscape' : 'portrait';

  const hasAnyContent =
    platforms.length > 0 ||
    Boolean(mobileDemoUrl) ||
    Boolean(iosAppStoreUrl) ||
    Boolean(androidPlayStoreUrl) ||
    Boolean(mobilePackageUrl) ||
    Boolean(bundleId) ||
    Boolean(minOsVersion);

  if (!hasAnyContent) {
    return undefined;
  }

  return {
    platforms,
    mobileDemoUrl,
    iosAppStoreUrl,
    androidPlayStoreUrl,
    mobilePackageUrl,
    bundleId,
    minOsVersion,
    devicePreset,
    orientation,
  };
}

export function parseMobileConfigFromFirestore(raw: unknown): MobileAppConfig | undefined {
  if (!raw || typeof raw !== 'object') return undefined;
  return normalizeMobileConfig(raw as Partial<MobileAppConfig>);
}

export function hasMobileDemoSupport(
  project: Pick<CatalogProject, 'contentType' | 'mobileConfig'>
): boolean {
  if (project.contentType === 'mobile_app') return true;
  const cfg = project.mobileConfig;
  if (!cfg) return false;
  return Boolean(
    cfg.platforms.length > 0 ||
      sanitizeExternalUrl(cfg.mobileDemoUrl) ||
      sanitizeExternalUrl(cfg.iosAppStoreUrl) ||
      sanitizeExternalUrl(cfg.androidPlayStoreUrl) ||
      sanitizeExternalUrl(cfg.mobilePackageUrl)
  );
}

export function resolvePrimaryMobilePreviewUrl(
  project: Pick<CatalogProject, 'liveDemoUrl' | 'websiteUrl' | 'mobileConfig'>
): string | null {
  const candidates = [
    project.mobileConfig?.mobileDemoUrl || '',
    project.liveDemoUrl || '',
    project.websiteUrl || '',
  ];
  for (const candidate of candidates) {
    const safe = sanitizeExternalUrl(candidate);
    if (safe) return safe;
  }
  return null;
}

export function resolveMobileQrTargetUrl(
  project: Pick<CatalogProject, 'slug' | 'liveDemoUrl' | 'websiteUrl' | 'mobileConfig'>,
  fallbackShareUrl: string
): {
  url: string;
  sourceKind: 'mobile_demo' | 'app_store' | 'play_store' | 'package_build' | 'live_demo' | 'share_page';
} {
  const cfg = project.mobileConfig;
  const mobileDemo = sanitizeExternalUrl(cfg?.mobileDemoUrl || '');
  if (mobileDemo) return { url: mobileDemo, sourceKind: 'mobile_demo' };

  const liveDemo = sanitizeExternalUrl(project.liveDemoUrl || '');
  if (liveDemo) return { url: liveDemo, sourceKind: 'live_demo' };

  const packageBuild = sanitizeExternalUrl(cfg?.mobilePackageUrl || '');
  if (packageBuild) return { url: packageBuild, sourceKind: 'package_build' };

  const iosStore = sanitizeExternalUrl(cfg?.iosAppStoreUrl || '');
  if (iosStore) return { url: iosStore, sourceKind: 'app_store' };

  const playStore = sanitizeExternalUrl(cfg?.androidPlayStoreUrl || '');
  if (playStore) return { url: playStore, sourceKind: 'play_store' };

  const safeShare = sanitizeExternalUrl(fallbackShareUrl) || `https://vibeatlas.app/?project=${encodeURIComponent(project.slug)}`;
  return { url: safeShare, sourceKind: 'share_page' };
}

export interface MobileStoreLinkItem {
  kind: 'ios' | 'android' | 'package' | 'demo';
  url: string;
  providerBadge:
    | 'App Store'
    | 'TestFlight'
    | 'Google Play'
    | 'Expo Snack'
    | 'Expo Demo'
    | 'Expo Build'
    | 'APK / Build'
    | 'Live Mobile';
}

export function extractMobileStoreLinks(
  project: Pick<CatalogProject, 'liveDemoUrl' | 'mobileConfig'>
): MobileStoreLinkItem[] {
  const links: MobileStoreLinkItem[] = [];
  const cfg = project.mobileConfig;

  const demoUrl =
    sanitizeExternalUrl(cfg?.mobileDemoUrl || '') || sanitizeExternalUrl(project.liveDemoUrl || '');
  if (demoUrl) {
    const isSnack = /snack\.expo/i.test(demoUrl);
    const isExpo = /expo\.dev/i.test(demoUrl);
    links.push({
      kind: 'demo',
      url: demoUrl,
      providerBadge: isSnack ? 'Expo Snack' : isExpo ? 'Expo Demo' : 'Live Mobile',
    });
  }

  const iosUrl = sanitizeExternalUrl(cfg?.iosAppStoreUrl || '');
  if (iosUrl) {
    const isTestFlight = /testflight\.apple\.com/i.test(iosUrl);
    links.push({
      kind: 'ios',
      url: iosUrl,
      providerBadge: isTestFlight ? 'TestFlight' : 'App Store',
    });
  }

  const androidUrl = sanitizeExternalUrl(cfg?.androidPlayStoreUrl || '');
  if (androidUrl) {
    links.push({
      kind: 'android',
      url: androidUrl,
      providerBadge: 'Google Play',
    });
  }

  const pkgUrl = sanitizeExternalUrl(cfg?.mobilePackageUrl || '');
  if (pkgUrl && pkgUrl !== demoUrl) {
    const isExpo = /expo\.dev|snack\.expo/i.test(pkgUrl);
    links.push({
      kind: 'package',
      url: pkgUrl,
      providerBadge: isExpo ? 'Expo Build' : 'APK / Build',
    });
  }

  return links;
}

export function resolveProjectDemoIframeUrl(
  project: Pick<CatalogProject, 'liveDemoUrl' | 'mobileConfig'>
): string | null {
  const candidates = [
    project.liveDemoUrl || '',
    project.mobileConfig?.mobileDemoUrl || '',
  ];
  for (const candidate of candidates) {
    const safe = sanitizeExternalUrl(candidate);
    if (safe) return safe;
  }
  return null;
}

export interface SmartphoneAspectSpec {
  orientation: MobileDemoOrientation;
  aspectClass: string;
  aspectRatioCss: string;
  ratioLabel: string;
  viewportWidth: number;
  viewportHeight: number;
}

export function getSmartphoneAspectSpec(
  orientation: MobileDemoOrientation
): SmartphoneAspectSpec {
  const isPortrait = orientation === 'portrait';
  return {
    orientation,
    aspectClass: isPortrait ? 'aspect-[9/19.5]' : 'aspect-[19.5/9]',
    aspectRatioCss: isPortrait ? '9 / 19.5' : '19.5 / 9',
    ratioLabel: isPortrait ? '9:19.5' : '19.5:9',
    viewportWidth: isPortrait ? 390 : 844,
    viewportHeight: isPortrait ? 844 : 390,
  };
}

export interface MobileFrameGeometry {
  preset: MobileDevicePreset;
  orientation: MobileDemoOrientation;
  viewportWidth: number;
  viewportHeight: number;
  aspectClass: string;
  aspectRatioCss: string;
  bezelClass: string;
  notchType: 'dynamic_island' | 'punch_hole';
}

export function getMobileFrameGeometry(
  preset: MobileDevicePreset,
  orientation: MobileDemoOrientation
): MobileFrameGeometry {
  const aspect = getSmartphoneAspectSpec(orientation);
  return {
    preset,
    orientation,
    viewportWidth: aspect.viewportWidth,
    viewportHeight: aspect.viewportHeight,
    aspectClass: aspect.aspectClass,
    aspectRatioCss: aspect.aspectRatioCss,
    bezelClass: preset === 'iphone_16' ? 'rounded-[38px]' : 'rounded-[28px]',
    notchType: preset === 'iphone_16' ? 'dynamic_island' : 'punch_hole',
  };
}

export interface QrMatrixData {
  size: number;
  modules: boolean[];
}

export function buildQrSvgMatrix(value: string): QrMatrixData | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    const qr = QRCode.create(trimmed, { errorCorrectionLevel: 'M' });
    const size = qr.modules.size;
    const modules: boolean[] = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        modules.push(Boolean(qr.modules.get(row, col)));
      }
    }
    return { size, modules };
  } catch {
    return null;
  }
}

export function formatMobilePlatformLabel(
  platform: MobileTargetPlatform,
  language: AppLanguage
): string {
  switch (platform) {
    case 'ios':
      return 'iOS';
    case 'android':
      return 'Android';
    case 'pwa':
      if (language === 'ko') return 'PWA / 모바일 웹';
      if (language === 'zh') return 'PWA / 移动网页';
      if (language === 'ja') return 'PWA / モバイルWeb';
      return 'PWA / Mobile Web';
  }
}

export function formatMobilePlatformsSummary(
  platforms: ReadonlyArray<MobileTargetPlatform>,
  language: AppLanguage
): string {
  if (platforms.length === 0) return '';
  return platforms.map((p) => formatMobilePlatformLabel(p, language)).join(' · ');
}
