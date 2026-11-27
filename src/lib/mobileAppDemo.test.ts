import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildQrSvgMatrix,
  extractMobileStoreLinks,
  formatMobilePlatformsSummary,
  getMobileFrameGeometry,
  getSmartphoneAspectSpec,
  hasMobileDemoSupport,
  normalizeMobileConfig,
  normalizeMobilePlatforms,
  resolveMobileQrTargetUrl,
  resolvePrimaryMobilePreviewUrl,
  resolveProjectDemoIframeUrl,
} from './mobileAppDemo';
import type { CatalogProject } from '../types/vibeatlas';

function makeBaseProject(overrides: Partial<CatalogProject> = {}): CatalogProject {
  return {
    id: 'test-mob',
    slug: 'test-mob',
    name: 'PocketPulse',
    tagline: 'Mobile vibe tracker',
    taglineKo: '모바일 바이브 트래커',
    description: 'Cross-platform mobile application for live AI coding tracking.',
    descriptionKo: '실시간 AI 코딩 트래킹 크로스플랫폼 모바일 앱입니다.',
    contentType: 'mobile_app',
    categories: ['Mobile App'],
    techStack: ['React Native', 'Expo'],
    developmentPlatform: 'cursor',
    hostingProvider: 'vercel',
    backendTech: 'supabase',
    country: 'KR',
    language: 'bilingual',
    license: 'MIT',
    pricingModel: 'free',
    verificationStatus: 'verified',
    provenanceSource: 'maker_submitted',
    liveDemoUrl: 'https://snack.expo.dev/@wvibe/pocketpulse',
    websiteUrl: 'https://pocketpulse.example.com',
    githubRepo: 'wvibe/pocketpulse',
    githubUrl: 'https://github.com/wvibe/pocketpulse',
    thumbnailUrl: '',
    makerName: 'Minseo',
    makerHandle: '@minseo',
    ownerUid: 'u1',
    githubStars: 120,
    githubForks: 15,
    likesCount: 10,
    bookmarksCount: 5,
    lastSyncedAt: '2026-11-20T00:00:00.000Z',
    createdAtIso: '2026-11-01T00:00:00.000Z',
    updatedAtIso: '2026-11-20T00:00:00.000Z',
    ...overrides,
  };
}

test('normalizeMobilePlatforms deduplicates and orders ios, android, pwa cleanly', () => {
  assert.deepEqual(normalizeMobilePlatforms(['pwa', 'IOS', 'invalid', 'android', 'ios']), [
    'ios',
    'android',
    'pwa',
  ]);
  assert.deepEqual(normalizeMobilePlatforms([]), []);
});

test('normalizeMobileConfig trims values and returns undefined when completely empty', () => {
  assert.equal(normalizeMobileConfig(undefined), undefined);
  assert.equal(
    normalizeMobileConfig({
      platforms: [],
      mobileDemoUrl: '   ',
      iosAppStoreUrl: '',
      androidPlayStoreUrl: '',
      mobilePackageUrl: '',
      bundleId: '',
      minOsVersion: '',
    }),
    undefined
  );

  const normalized = normalizeMobileConfig({
    platforms: ['android', 'ios'],
    mobileDemoUrl: '  https://demo.wvibe.app  ',
    iosAppStoreUrl: 'https://apps.apple.com/app/id12345',
    androidPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.wvibe.app',
    mobilePackageUrl: '',
    bundleId: 'com.wvibe.app',
    minOsVersion: 'iOS 16+ / Android 13+',
    devicePreset: 'pixel_9',
    orientation: 'landscape',
  });
  assert.ok(normalized);
  assert.deepEqual(normalized.platforms, ['ios', 'android']);
  assert.equal(normalized.mobileDemoUrl, 'https://demo.wvibe.app');
  assert.equal(normalized.devicePreset, 'pixel_9');
  assert.equal(normalized.orientation, 'landscape');
});

test('hasMobileDemoSupport detects mobile_app contentType and mobile-enabled web apps', () => {
  assert.equal(hasMobileDemoSupport(makeBaseProject({ contentType: 'mobile_app' })), true);
  assert.equal(
    hasMobileDemoSupport(makeBaseProject({ contentType: 'web_app', mobileConfig: undefined })),
    false
  );
  assert.equal(
    hasMobileDemoSupport(
      makeBaseProject({
        contentType: 'web_app',
        mobileConfig: {
          platforms: ['pwa'],
          mobileDemoUrl: 'https://pwa.example.com',
          iosAppStoreUrl: '',
          androidPlayStoreUrl: '',
          mobilePackageUrl: '',
          bundleId: '',
          minOsVersion: '',
          devicePreset: 'iphone_16',
          orientation: 'portrait',
        },
      })
    ),
    true
  );
});

test('extractMobileStoreLinks classifies TestFlight, App Store, Google Play, Expo, and Live Mobile safely', () => {
  const proj = makeBaseProject({
    liveDemoUrl: 'https://snack.expo.dev/@demo/app',
    mobileConfig: {
      platforms: ['ios', 'android'],
      mobileDemoUrl: '',
      iosAppStoreUrl: 'https://testflight.apple.com/join/abc123',
      androidPlayStoreUrl: 'https://play.google.com/store/apps/details?id=dev.wvibe',
      mobilePackageUrl: 'https://expo.dev/@demo/app',
      bundleId: 'dev.wvibe',
      minOsVersion: 'iOS 17+',
      devicePreset: 'iphone_16',
      orientation: 'portrait',
    },
  });

  const links = extractMobileStoreLinks(proj);
  assert.deepEqual(
    links.map((l) => [l.kind, l.providerBadge]),
    [
      ['demo', 'Expo Snack'],
      ['ios', 'TestFlight'],
      ['android', 'Google Play'],
      ['package', 'Expo Build'],
    ]
  );

  // Deduplicate identical demo & package URLs
  const dupProj = makeBaseProject({
    liveDemoUrl: 'https://expo.dev/@demo/app',
    mobileConfig: {
      platforms: ['ios'],
      mobileDemoUrl: '',
      iosAppStoreUrl: '',
      androidPlayStoreUrl: '',
      mobilePackageUrl: 'https://expo.dev/@demo/app',
      bundleId: '',
      minOsVersion: '',
      devicePreset: 'iphone_16',
      orientation: 'portrait',
    },
  });
  assert.deepEqual(
    extractMobileStoreLinks(dupProj).map((l) => [l.kind, l.providerBadge]),
    [['demo', 'Expo Demo']]
  );

  // Reject javascript: schemes safely
  const unsafeProj = makeBaseProject({
    liveDemoUrl: 'javascript:alert(1)',
    mobileConfig: {
      platforms: ['ios'],
      mobileDemoUrl: 'javascript:alert(1)',
      iosAppStoreUrl: 'data:text/html,<script>',
      androidPlayStoreUrl: '',
      mobilePackageUrl: '',
      bundleId: '',
      minOsVersion: '',
      devicePreset: 'iphone_16',
      orientation: 'portrait',
    },
  });
  assert.deepEqual(extractMobileStoreLinks(unsafeProj), []);
  assert.equal(resolvePrimaryMobilePreviewUrl(unsafeProj), 'https://pocketpulse.example.com/');
});

test('resolveMobileQrTargetUrl picks mobile demo URL first and falls back to share page', () => {
  const withDemo = makeBaseProject({
    mobileConfig: {
      platforms: ['ios'],
      mobileDemoUrl: 'https://m.pocketpulse.dev',
      iosAppStoreUrl: 'https://apps.apple.com/app/id99',
      androidPlayStoreUrl: '',
      mobilePackageUrl: '',
      bundleId: '',
      minOsVersion: '',
      devicePreset: 'iphone_16',
      orientation: 'portrait',
    },
  });
  assert.deepEqual(resolveMobileQrTargetUrl(withDemo, 'https://wvibe.app/?project=test-mob'), {
    url: 'https://m.pocketpulse.dev/',
    sourceKind: 'mobile_demo',
  });

  const storeOnly = makeBaseProject({
    liveDemoUrl: '',
    websiteUrl: '',
    mobileConfig: {
      platforms: ['android'],
      mobileDemoUrl: '',
      iosAppStoreUrl: '',
      androidPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.a',
      mobilePackageUrl: '',
      bundleId: '',
      minOsVersion: '',
      devicePreset: 'pixel_9',
      orientation: 'portrait',
    },
  });
  assert.deepEqual(resolveMobileQrTargetUrl(storeOnly, 'https://wvibe.app/?project=test-mob'), {
    url: 'https://play.google.com/store/apps/details?id=com.a',
    sourceKind: 'play_store',
  });
});

test('getMobileFrameGeometry and buildQrSvgMatrix return valid deterministic dimensions', () => {
  const portrait = getMobileFrameGeometry('iphone_16', 'portrait');
  assert.equal(portrait.viewportWidth, 390);
  assert.equal(portrait.viewportHeight, 844);
  assert.equal(portrait.notchType, 'dynamic_island');

  const landscape = getMobileFrameGeometry('pixel_9', 'landscape');
  assert.equal(landscape.viewportWidth, 844);
  assert.equal(landscape.viewportHeight, 390);
  assert.equal(landscape.notchType, 'punch_hole');

  const qr = buildQrSvgMatrix('https://wvibe.app/?project=pocketpulse');
  assert.ok(qr !== null);
  assert.ok(qr.size >= 21);
  assert.equal(qr.modules.length, qr.size * qr.size);
  assert.equal(buildQrSvgMatrix('   '), null);

  assert.equal(formatMobilePlatformsSummary(['ios', 'pwa'], 'ko'), 'iOS · PWA / 모바일 웹');
  assert.equal(formatMobilePlatformsSummary(['ios', 'android'], 'en'), 'iOS · Android');
});

test('resolveProjectDemoIframeUrl and getSmartphoneAspectSpec validate demo URLs and fixed smartphone ratios', () => {
  const webProj = makeBaseProject({
    contentType: 'web_app',
    liveDemoUrl: 'https://demo.wvibe.app/ledger',
    websiteUrl: 'https://wvibe.app',
    mobileConfig: undefined,
  });
  assert.equal(resolveProjectDemoIframeUrl(webProj), 'https://demo.wvibe.app/ledger');

  const noDemoProj = makeBaseProject({
    contentType: 'web_app',
    liveDemoUrl: '',
    websiteUrl: 'https://wvibe.app',
    mobileConfig: undefined,
  });
  assert.equal(resolveProjectDemoIframeUrl(noDemoProj), null);

  const unsafeDemoProj = makeBaseProject({
    contentType: 'web_app',
    liveDemoUrl: 'javascript:alert(1)',
    mobileConfig: {
      platforms: ['pwa'],
      mobileDemoUrl: 'https://m.wvibe.app',
      iosAppStoreUrl: '',
      androidPlayStoreUrl: '',
      mobilePackageUrl: '',
      bundleId: '',
      minOsVersion: '',
      devicePreset: 'iphone_16',
      orientation: 'portrait',
    },
  });
  assert.equal(resolveProjectDemoIframeUrl(unsafeDemoProj), 'https://m.wvibe.app/');

  const portraitSpec = getSmartphoneAspectSpec('portrait');
  assert.equal(portraitSpec.aspectClass, 'aspect-[9/19.5]');
  assert.equal(portraitSpec.aspectRatioCss, '9 / 19.5');
  assert.equal(portraitSpec.ratioLabel, '9:19.5');

  const landscapeSpec = getSmartphoneAspectSpec('landscape');
  assert.equal(landscapeSpec.aspectClass, 'aspect-[19.5/9]');
  assert.equal(landscapeSpec.aspectRatioCss, '19.5 / 9');
  assert.equal(landscapeSpec.ratioLabel, '19.5:9');
});
