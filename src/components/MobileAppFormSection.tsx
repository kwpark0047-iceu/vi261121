import { Check, Smartphone } from 'lucide-react';
import type {
  AppLanguage,
  ContentType,
  MobileDemoOrientation,
  MobileDevicePreset,
  MobileTargetPlatform,
} from '../types/vibeatlas';
import { UI_STRINGS } from '../data/i18n';
import {
  formatMobilePlatformLabel,
  MOBILE_QUICK_TECH_STACK,
  MOBILE_TARGET_PLATFORM_ORDER,
} from '../lib/mobileAppDemo';
import { parseCommaSeparatedTags, toggleCommaSeparatedTag } from '../lib/projectTags';
import type { SubmitValidationField } from '../lib/validation';

export interface MobileFormValues {
  contentType: ContentType;
  enableMobileDemo: boolean;
  mobilePlatforms: MobileTargetPlatform[];
  mobileDemoUrl: string;
  iosAppStoreUrl: string;
  androidPlayStoreUrl: string;
  mobilePackageUrl: string;
  mobileBundleId: string;
  mobileMinOsVersion: string;
  mobileDevicePreset: MobileDevicePreset;
  mobileOrientation: MobileDemoOrientation;
  techStackRaw: string;
}

interface MobileAppFormSectionProps {
  language: AppLanguage;
  idPrefix: 'sub' | 'edit';
  values: MobileFormValues;
  fieldErrors: Partial<Record<SubmitValidationField, string>>;
  onToggleEnable: (enabled: boolean) => void;
  onChangePlatforms: (platforms: MobileTargetPlatform[]) => void;
  onChangeField: (
    field:
      | 'mobileDemoUrl'
      | 'iosAppStoreUrl'
      | 'androidPlayStoreUrl'
      | 'mobilePackageUrl'
      | 'mobileBundleId'
      | 'mobileMinOsVersion'
      | 'mobileDevicePreset'
      | 'mobileOrientation'
      | 'techStackRaw',
    value: string
  ) => void;
}

export function MobileAppFormSection({
  language,
  idPrefix,
  values,
  fieldErrors,
  onToggleEnable,
  onChangePlatforms,
  onChangeField,
}: MobileAppFormSectionProps) {
  const copy = UI_STRINGS[language].mobileDemo;
  const isNativeMobileType = values.contentType === 'mobile_app';
  const isExpanded = isNativeMobileType || values.enableMobileDemo;

  const togglePlatform = (platform: MobileTargetPlatform) => {
    const exists = values.mobilePlatforms.includes(platform);
    const next = exists
      ? values.mobilePlatforms.filter((p) => p !== platform)
      : [...values.mobilePlatforms, platform];
    onChangePlatforms(next);
  };

  const urlInputClass = (errorKey: SubmitValidationField) =>
    `mt-1 w-full rounded-lg border bg-white px-3 py-2 text-xs text-slate-900 dark:bg-slate-950 dark:text-white ${
      fieldErrors[errorKey]
        ? 'border-rose-500 focus:border-rose-600 focus:outline-none dark:border-rose-500'
        : 'border-slate-300 dark:border-slate-700'
    }`;

  return (
    <div
      data-testid={`${idPrefix}-mobile-config-section`}
      className={`rounded-xl border p-4 transition-colors ${
        isExpanded
          ? 'border-cyan-200 bg-cyan-50/40 dark:border-cyan-900/70 dark:bg-cyan-950/15'
          : 'border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950/50'
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-100 text-cyan-700 ring-1 ring-inset ring-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-300 dark:ring-cyan-800">
            <Smartphone className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              {copy.sectionTitle}
            </h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              {isExpanded ? copy.sectionSubtitle : copy.enableToggleHint}
            </p>
          </div>
        </div>

        {!isNativeMobileType && (
          <button
            type="button"
            data-testid={`${idPrefix}-enable-mobile-toggle`}
            aria-pressed={values.enableMobileDemo}
            onClick={() => onToggleEnable(!values.enableMobileDemo)}
            className={`inline-flex min-h-[38px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition-colors ${
              values.enableMobileDemo
                ? 'border-cyan-700 bg-cyan-700 text-white dark:border-cyan-600 dark:bg-cyan-600'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {values.enableMobileDemo && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            <span>{copy.enableToggleLabel}</span>
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4 border-t border-cyan-200/70 pt-4 dark:border-cyan-900/50">
          {/* Target Mobile Platforms + Quick Mobile Framework Chips */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {copy.targetPlatformsLabel}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {MOBILE_TARGET_PLATFORM_ORDER.map((platform) => {
                  const selected = values.mobilePlatforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      type="button"
                      data-testid={`${idPrefix}-mobile-platform-${platform}`}
                      aria-pressed={selected}
                      onClick={() => togglePlatform(platform)}
                      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
                        selected
                          ? 'border-cyan-700 bg-cyan-700 text-white dark:border-cyan-600 dark:bg-cyan-600'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                      }`}
                    >
                      {selected && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                      <span>{formatMobilePlatformLabel(platform, language)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {copy.quickMobileStackLabel}
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {MOBILE_QUICK_TECH_STACK.map((stackItem) => {
                  const currentList = parseCommaSeparatedTags(values.techStackRaw);
                  const active = currentList.some(
                    (item) => item.toLowerCase() === stackItem.toLowerCase()
                  );
                  return (
                    <button
                      key={stackItem}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        const res = toggleCommaSeparatedTag(values.techStackRaw, stackItem, 12);
                        if (!res.limitReached) {
                          onChangeField('techStackRaw', res.nextRaw);
                        }
                      }}
                      className={`min-h-[34px] rounded-lg border px-2.5 text-[11px] font-medium transition-colors ${
                        active
                          ? 'border-blue-700 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-600'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                      }`}
                    >
                      {stackItem}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Demo & Store Links */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`${idPrefix}-mobile-demo-url`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copy.mobileDemoUrlLabel}
              </label>
              <input
                id={`${idPrefix}-mobile-demo-url`}
                type="url"
                placeholder={copy.mobileDemoUrlPlaceholder}
                aria-invalid={Boolean(fieldErrors.mobileDemoUrl)}
                aria-describedby={
                  fieldErrors.mobileDemoUrl ? `${idPrefix}-mobile-demo-url-error` : undefined
                }
                value={values.mobileDemoUrl}
                onChange={(e) => onChangeField('mobileDemoUrl', e.target.value)}
                className={urlInputClass('mobileDemoUrl')}
              />
              {fieldErrors.mobileDemoUrl && (
                <p
                  id={`${idPrefix}-mobile-demo-url-error`}
                  role="alert"
                  className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                >
                  {fieldErrors.mobileDemoUrl}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-ios-store-url`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copy.iosAppStoreLabel}
              </label>
              <input
                id={`${idPrefix}-ios-store-url`}
                type="url"
                placeholder={copy.iosAppStorePlaceholder}
                aria-invalid={Boolean(fieldErrors.iosAppStoreUrl)}
                aria-describedby={
                  fieldErrors.iosAppStoreUrl ? `${idPrefix}-ios-store-url-error` : undefined
                }
                value={values.iosAppStoreUrl}
                onChange={(e) => onChangeField('iosAppStoreUrl', e.target.value)}
                className={urlInputClass('iosAppStoreUrl')}
              />
              {fieldErrors.iosAppStoreUrl && (
                <p
                  id={`${idPrefix}-ios-store-url-error`}
                  role="alert"
                  className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                >
                  {fieldErrors.iosAppStoreUrl}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-android-store-url`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copy.androidPlayStoreLabel}
              </label>
              <input
                id={`${idPrefix}-android-store-url`}
                type="url"
                placeholder={copy.androidPlayStorePlaceholder}
                aria-invalid={Boolean(fieldErrors.androidPlayStoreUrl)}
                aria-describedby={
                  fieldErrors.androidPlayStoreUrl
                    ? `${idPrefix}-android-store-url-error`
                    : undefined
                }
                value={values.androidPlayStoreUrl}
                onChange={(e) => onChangeField('androidPlayStoreUrl', e.target.value)}
                className={urlInputClass('androidPlayStoreUrl')}
              />
              {fieldErrors.androidPlayStoreUrl && (
                <p
                  id={`${idPrefix}-android-store-url-error`}
                  role="alert"
                  className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                >
                  {fieldErrors.androidPlayStoreUrl}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-mobile-package-url`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copy.mobilePackageUrlLabel}
              </label>
              <input
                id={`${idPrefix}-mobile-package-url`}
                type="url"
                placeholder={copy.mobilePackageUrlPlaceholder}
                aria-invalid={Boolean(fieldErrors.mobilePackageUrl)}
                aria-describedby={
                  fieldErrors.mobilePackageUrl ? `${idPrefix}-mobile-package-url-error` : undefined
                }
                value={values.mobilePackageUrl}
                onChange={(e) => onChangeField('mobilePackageUrl', e.target.value)}
                className={urlInputClass('mobilePackageUrl')}
              />
              {fieldErrors.mobilePackageUrl && (
                <p
                  id={`${idPrefix}-mobile-package-url-error`}
                  role="alert"
                  className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                >
                  {fieldErrors.mobilePackageUrl}
                </p>
              )}
            </div>
          </div>

          {/* Bundle ID, Min OS, Device Preset, Default Orientation */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label
                htmlFor={`${idPrefix}-bundle-id`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copy.bundleIdLabel}
              </label>
              <input
                id={`${idPrefix}-bundle-id`}
                placeholder={copy.bundleIdPlaceholder}
                aria-invalid={Boolean(fieldErrors.bundleId)}
                value={values.mobileBundleId}
                onChange={(e) => onChangeField('mobileBundleId', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              {fieldErrors.bundleId && (
                <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {fieldErrors.bundleId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-min-os`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copy.minOsLabel}
              </label>
              <input
                id={`${idPrefix}-min-os`}
                placeholder={copy.minOsPlaceholder}
                aria-invalid={Boolean(fieldErrors.minOsVersion)}
                value={values.mobileMinOsVersion}
                onChange={(e) => onChangeField('mobileMinOsVersion', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              />
              {fieldErrors.minOsVersion && (
                <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {fieldErrors.minOsVersion}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-device-preset`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copy.devicePresetLabel}
              </label>
              <select
                id={`${idPrefix}-device-preset`}
                value={values.mobileDevicePreset}
                onChange={(e) => onChangeField('mobileDevicePreset', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="iphone_16">{copy.presetIphone}</option>
                <option value="pixel_9">{copy.presetPixel}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`${idPrefix}-orientation`}
                className="block text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {copy.orientationLabel}
              </label>
              <select
                id={`${idPrefix}-orientation`}
                value={values.mobileOrientation}
                onChange={(e) => onChangeField('mobileOrientation', e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="portrait">{copy.orientationPortrait}</option>
                <option value="landscape">{copy.orientationLandscape}</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
