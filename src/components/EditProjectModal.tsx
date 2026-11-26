import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  Github,
  Info,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldAlert,
  X,
} from 'lucide-react';
import type {
  AppLanguage,
  BackendTech,
  CatalogProject,
  ContentType,
  DevelopmentPlatform,
  GitHubRepoMetadata,
  HostingProvider,
  PricingModel,
} from '../types/vibeatlas';
import {
  BACKEND_LABELS,
  CONTENT_TYPE_LABELS,
  HOSTING_LABELS,
  PLATFORM_LABELS,
  PRICING_LABELS,
  PROJECT_CATEGORY_LABELS,
  UI_STRINGS,
  VERIFICATION_LABELS,
} from '../data/i18n';
import {
  CANONICAL_PROJECT_CATEGORIES,
  parseCommaSeparatedTags,
  resolveCanonicalCategoryTag,
  toggleCommaSeparatedTag,
} from '../lib/projectTags';
import { parseGitHubRepoSlug, sanitizeExternalUrl } from '../lib/validation';
import {
  buildEditDraftFromProject,
  buildFirestoreProjectUpdatePayload,
  getChangedProjectFields,
  validateEditProjectDraft,
  type EditProjectDraftFields,
  type EditValidationField,
  type FirestoreProjectUpdatePayload,
  type ProjectEditPermissionReason,
} from '../lib/projectEdit';
import { PastelCategoryIcon } from './PastelCategoryIcon';

interface EditProjectModalProps {
  project: CatalogProject | null;
  language: AppLanguage;
  permissionReason?: ProjectEditPermissionReason;
  onClose: () => void;
  onSaveProject: (
    project: CatalogProject,
    payload: FirestoreProjectUpdatePayload
  ) => Promise<void>;
}

const EDIT_FIELD_ELEMENT_IDS: Record<EditValidationField, string> = {
  name: 'edit-name',
  tagline: 'edit-tagline',
  taglineKo: 'edit-tagline-ko',
  description: 'edit-desc',
  descriptionKo: 'edit-desc-ko',
  country: 'edit-country',
  license: 'edit-license',
  categories: 'edit-cats',
  techStack: 'edit-stack',
  liveDemoUrl: 'edit-demo',
  websiteUrl: 'edit-web',
  githubUrl: 'edit-gh',
  thumbnailUrl: 'edit-thumb',
  makerName: 'edit-maker',
  makerHandle: 'edit-handle',
};

const DRAFT_KEY_TO_ERROR_KEY: Partial<Record<keyof EditProjectDraftFields, EditValidationField>> = {
  name: 'name',
  tagline: 'tagline',
  taglineKo: 'taglineKo',
  description: 'description',
  descriptionKo: 'descriptionKo',
  categoriesRaw: 'categories',
  techStackRaw: 'techStack',
  country: 'country',
  license: 'license',
  liveDemoUrl: 'liveDemoUrl',
  websiteUrl: 'websiteUrl',
  githubUrl: 'githubUrl',
  thumbnailUrl: 'thumbnailUrl',
  makerName: 'makerName',
  makerHandle: 'makerHandle',
};

export function EditProjectModal({
  project,
  language,
  permissionReason = 'owner',
  onClose,
  onSaveProject,
}: EditProjectModalProps) {
  const copy = UI_STRINGS[language].editModal;
  const submitCopy = UI_STRINGS[language].submit;

  const [draft, setDraft] = useState<EditProjectDraftFields>(() =>
    project
      ? buildEditDraftFromProject(project)
      : {
          githubInput: '',
          name: '',
          tagline: '',
          taglineKo: '',
          description: '',
          descriptionKo: '',
          contentType: 'web_app',
          categoriesRaw: '',
          techStackRaw: '',
          platform: 'lovable',
          hosting: 'vercel',
          backend: 'supabase',
          country: 'KR',
          projLang: 'bilingual',
          license: 'MIT',
          pricingModel: 'open_source',
          liveDemoUrl: '',
          websiteUrl: '',
          githubUrl: '',
          thumbnailUrl: '',
          makerName: '',
          makerHandle: '',
        }
  );

  const [ghMeta, setGhMeta] = useState<GitHubRepoMetadata | null>(null);
  const [fetchingGh, setFetchingGh] = useState(false);
  const [ghFeedback, setGhFeedback] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<EditValidationField, string>>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [thumbPreviewError, setThumbPreviewError] = useState(false);

  useEffect(() => {
    if (!project) return;
    setDraft(buildEditDraftFromProject(project));
    setGhMeta(null);
    setGhFeedback(null);
    setFieldErrors({});
    setSaveError(null);
    setThumbPreviewError(false);
  }, [project]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, saving, onClose]);

  const changedFields = useMemo(() => {
    if (!project) return [];
    return getChangedProjectFields(project, draft, ghMeta);
  }, [project, draft, ghMeta]);

  const isDirty = changedFields.length > 0;

  const updateField = useCallback(
    <K extends keyof EditProjectDraftFields>(key: K, value: EditProjectDraftFields[K]) => {
      setDraft((prev) => ({ ...prev, [key]: value }));
      if (key === 'thumbnailUrl') {
        setThumbPreviewError(false);
      }
      const errKey = DRAFT_KEY_TO_ERROR_KEY[key];
      if (errKey) {
        setFieldErrors((prev) => {
          if (!prev[errKey]) return prev;
          const next = { ...prev };
          delete next[errKey];
          return next;
        });
      }
      setSaveError(null);
    },
    []
  );

  const handleReset = () => {
    if (!project) return;
    setDraft(buildEditDraftFromProject(project));
    setGhMeta(null);
    setGhFeedback(null);
    setFieldErrors({});
    setSaveError(null);
    setThumbPreviewError(false);
  };

  const handleFetchGithub = async () => {
    setGhFeedback(null);
    const slug = parseGitHubRepoSlug(draft.githubInput || draft.githubUrl);
    if (!slug) {
      setGhFeedback('owner/repo 또는 https://github.com/owner/repo 형식으로 입력하세요.');
      return;
    }

    setFetchingGh(true);
    try {
      const resp = await fetch(`/api/github/repo?repo=${encodeURIComponent(slug)}`);
      const data = await resp.json();
      if (!resp.ok || !data.repo) {
        setGhFeedback(data.error || 'GitHub 조회에 실패했습니다.');
        return;
      }
      const repo = data.repo as GitHubRepoMetadata;
      setGhMeta(repo);
      setDraft((prev) => ({
        ...prev,
        githubInput: repo.fullName,
        githubUrl: repo.htmlUrl,
        websiteUrl: !prev.websiteUrl.trim() && repo.homepage ? repo.homepage : prev.websiteUrl,
        tagline:
          !prev.tagline.trim() && repo.description
            ? repo.description.slice(0, 220)
            : prev.tagline,
        description:
          !prev.description.trim() && repo.description
            ? repo.description.length >= 20
              ? repo.description
              : `${repo.description} — Verified repository hosted on GitHub (${repo.fullName}).`
            : prev.description,
        license:
          repo.license && repo.license !== 'Unknown'
            ? repo.license
            : prev.license || 'Unknown',
        techStackRaw:
          !prev.techStackRaw.trim() && repo.topics.length > 0
            ? repo.topics.slice(0, 8).join(', ')
            : !prev.techStackRaw.trim() && repo.language
              ? repo.language
              : prev.techStackRaw,
      }));
      setGhFeedback(
        `GitHub 동기화 완료: ★ ${repo.stars.toLocaleString()} · Forks ${repo.forks.toLocaleString()} · ${repo.license}`
      );
    } catch (err) {
      setGhFeedback(err instanceof Error ? err.message : 'Network error fetching GitHub.');
    } finally {
      setFetchingGh(false);
    }
  };

  if (!project) return null;

  const safeThumbPreview = sanitizeExternalUrl(draft.thumbnailUrl);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    const validation = validateEditProjectDraft(project, draft, language);
    if (!validation.success) {
      setFieldErrors(validation.fieldErrors);
      setSaveError(
        `${submitCopy.validationSummaryPrefix} (${Object.keys(validation.fieldErrors).length}): ${validation.summaryMessage}`
      );
      const firstInvalid = (Object.keys(EDIT_FIELD_ELEMENT_IDS) as EditValidationField[]).find(
        (key) => Boolean(validation.fieldErrors[key])
      );
      if (firstInvalid && typeof document !== 'undefined') {
        const el = document.getElementById(EDIT_FIELD_ELEMENT_IDS[firstInvalid]);
        el?.focus({ preventScroll: true });
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      return;
    }

    setFieldErrors({});
    const payload = buildFirestoreProjectUpdatePayload(project, validation.data, {
      thumbnailUrl: validation.thumbnailUrl,
      syncedGithubMeta: ghMeta,
    });

    setSaving(true);
    try {
      await onSaveProject(project, payload);
      onClose();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to update project.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (field?: EditValidationField, extra = 'text-sm') =>
    `mt-1 w-full rounded-lg border bg-white px-3 py-2 text-slate-900 dark:bg-slate-950 dark:text-white ${extra} ${
      field && fieldErrors[field]
        ? 'border-rose-500 focus:border-rose-600 focus:outline-none dark:border-rose-500'
        : 'border-slate-300 dark:border-slate-700'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      data-testid="edit-project-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/65 p-3 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-project-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex min-w-0 items-center gap-3">
            <PastelCategoryIcon role="edit" size="md" />
            <div className="min-w-0">
              <h2
                id="edit-project-modal-title"
                className="text-lg font-bold text-slate-900 sm:text-xl dark:text-white"
              >
                {copy.title} · <span className="text-blue-700 dark:text-sky-400">{project.name}</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">{copy.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            aria-label={copy.closeLabel}
            disabled={saving}
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form id="edit-project-form" noValidate onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-6">
            {/* Immutable Metadata Context */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-700 dark:text-slate-300">
                <span>
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    {copy.slugLabel}:
                  </strong>{' '}
                  <code className="font-mono text-[11px]">{project.slug}</code>
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <span>
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    {copy.statusLabel}:
                  </strong>{' '}
                  {VERIFICATION_LABELS[language][project.verificationStatus]}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                  ·
                </span>
                <span>
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    {copy.lastUpdatedLabel}:
                  </strong>{' '}
                  <span className="font-mono tabular-nums">
                    {project.updatedAtIso ? project.updatedAtIso.slice(0, 10) : '—'}
                  </span>
                </span>
              </div>
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Info className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{copy.immutableNote}</span>
              </p>
              {permissionReason === 'admin' && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{copy.adminModeNote}</span>
                </p>
              )}
            </div>

            {/* GitHub Sync Helper */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-slate-800 dark:text-slate-200" aria-hidden="true" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  {copy.githubSyncHeading}
                </h3>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                {copy.githubSyncHint}
              </p>
              <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  aria-label={copy.githubSyncHeading}
                  value={draft.githubInput}
                  onChange={(e) => updateField('githubInput', e.target.value)}
                  placeholder={submitCopy.githubImportPlaceholder}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="button"
                  disabled={fetchingGh}
                  onClick={handleFetchGithub}
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${fetchingGh ? 'animate-spin' : ''}`} />
                  <span>{fetchingGh ? submitCopy.fetchingGithub : copy.githubFillEmptyButton}</span>
                </button>
              </div>
              {ghFeedback && (
                <p className="mt-2 font-mono text-[11px] text-blue-700 dark:text-blue-400">
                  {ghFeedback}
                </p>
              )}
            </div>

            {/* Section 1: Basic Info & Descriptions */}
            <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <legend className="px-1.5 text-xs font-bold text-slate-900 dark:text-white">
                {copy.sectionBasic}
              </legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-name"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.nameLabel}
                  </label>
                  <input
                    id="edit-name"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.name)}
                    aria-describedby={fieldErrors.name ? 'edit-name-error' : undefined}
                    value={draft.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={inputClass('name')}
                  />
                  {fieldErrors.name && (
                    <p
                      id="edit-name-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-type"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.contentTypeLabel}
                  </label>
                  <select
                    id="edit-type"
                    value={draft.contentType}
                    onChange={(e) => updateField('contentType', e.target.value as ContentType)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {(Object.keys(CONTENT_TYPE_LABELS[language]) as ContentType[]).map((key) => (
                      <option key={key} value={key}>
                        {CONTENT_TYPE_LABELS[language][key]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-tagline"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.taglineEnLabel}
                  </label>
                  <input
                    id="edit-tagline"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.tagline)}
                    aria-describedby={fieldErrors.tagline ? 'edit-tagline-error' : undefined}
                    value={draft.tagline}
                    onChange={(e) => updateField('tagline', e.target.value)}
                    className={inputClass('tagline')}
                  />
                  {fieldErrors.tagline && (
                    <p
                      id="edit-tagline-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.tagline}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-tagline-ko"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.taglineKoLabel}
                  </label>
                  <input
                    id="edit-tagline-ko"
                    aria-invalid={Boolean(fieldErrors.taglineKo)}
                    aria-describedby={fieldErrors.taglineKo ? 'edit-tagline-ko-error' : undefined}
                    value={draft.taglineKo}
                    onChange={(e) => updateField('taglineKo', e.target.value)}
                    className={inputClass('taglineKo')}
                  />
                  {fieldErrors.taglineKo && (
                    <p
                      id="edit-tagline-ko-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.taglineKo}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-desc"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {submitCopy.descriptionEnLabel}
                </label>
                <textarea
                  id="edit-desc"
                  rows={3}
                  required
                  aria-required="true"
                  aria-invalid={Boolean(fieldErrors.description)}
                  aria-describedby={fieldErrors.description ? 'edit-desc-error' : undefined}
                  value={draft.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  className={inputClass('description')}
                />
                {fieldErrors.description && (
                  <p
                    id="edit-desc-error"
                    role="alert"
                    className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                  >
                    {fieldErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-desc-ko"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {submitCopy.descriptionKoLabel}
                </label>
                <textarea
                  id="edit-desc-ko"
                  rows={3}
                  aria-invalid={Boolean(fieldErrors.descriptionKo)}
                  aria-describedby={fieldErrors.descriptionKo ? 'edit-desc-ko-error' : undefined}
                  value={draft.descriptionKo}
                  onChange={(e) => updateField('descriptionKo', e.target.value)}
                  className={inputClass('descriptionKo')}
                />
                {fieldErrors.descriptionKo && (
                  <p
                    id="edit-desc-ko-error"
                    role="alert"
                    className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                  >
                    {fieldErrors.descriptionKo}
                  </p>
                )}
              </div>
            </fieldset>

            {/* Section 2: Classification & Stack */}
            <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <legend className="px-1.5 text-xs font-bold text-slate-900 dark:text-white">
                {copy.sectionClassification}
              </legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-cats"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.categoriesLabel}
                  </label>
                  <input
                    id="edit-cats"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.categories)}
                    aria-describedby={fieldErrors.categories ? 'edit-cats-error' : undefined}
                    value={draft.categoriesRaw}
                    onChange={(e) => updateField('categoriesRaw', e.target.value)}
                    className={inputClass('categories')}
                  />
                  {fieldErrors.categories && (
                    <p
                      id="edit-cats-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.categories}
                    </p>
                  )}
                  <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                    {submitCopy.categoriesQuickTagsHint}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5" data-testid="edit-quick-tags">
                    {CANONICAL_PROJECT_CATEGORIES.map((tag) => {
                      const parsedCurrent = parseCommaSeparatedTags(draft.categoriesRaw);
                      const isSelected = parsedCurrent.some(
                        (item) =>
                          (resolveCanonicalCategoryTag(item) ?? item).toLowerCase() ===
                          tag.toLowerCase()
                      );
                      return (
                        <button
                          key={tag}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            const res = toggleCommaSeparatedTag(draft.categoriesRaw, tag, 6);
                            if (!res.limitReached) {
                              updateField('categoriesRaw', res.nextRaw);
                            }
                          }}
                          className={`rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors ${
                            isSelected
                              ? 'border-blue-700 bg-blue-700 text-white dark:border-blue-500 dark:bg-blue-600'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800'
                          }`}
                        >
                          {PROJECT_CATEGORY_LABELS[language][tag]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="edit-stack"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.techStackLabel}
                  </label>
                  <input
                    id="edit-stack"
                    aria-invalid={Boolean(fieldErrors.techStack)}
                    aria-describedby={fieldErrors.techStack ? 'edit-stack-error' : undefined}
                    value={draft.techStackRaw}
                    onChange={(e) => updateField('techStackRaw', e.target.value)}
                    className={inputClass('techStack')}
                  />
                  {fieldErrors.techStack && (
                    <p
                      id="edit-stack-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.techStack}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="edit-platform"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.platformLabel}
                  </label>
                  <select
                    id="edit-platform"
                    value={draft.platform}
                    onChange={(e) =>
                      updateField('platform', e.target.value as DevelopmentPlatform)
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {(Object.keys(PLATFORM_LABELS) as DevelopmentPlatform[]).map((k) => (
                      <option key={k} value={k}>
                        {PLATFORM_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-hosting"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.hostingLabel}
                  </label>
                  <select
                    id="edit-hosting"
                    value={draft.hosting}
                    onChange={(e) => updateField('hosting', e.target.value as HostingProvider)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {(Object.keys(HOSTING_LABELS) as HostingProvider[]).map((k) => (
                      <option key={k} value={k}>
                        {HOSTING_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-backend"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.backendLabel}
                  </label>
                  <select
                    id="edit-backend"
                    value={draft.backend}
                    onChange={(e) => updateField('backend', e.target.value as BackendTech)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {(Object.keys(BACKEND_LABELS) as BackendTech[]).map((k) => (
                      <option key={k} value={k}>
                        {BACKEND_LABELS[k]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div>
                  <label
                    htmlFor="edit-country"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.countryLabel}
                  </label>
                  <input
                    id="edit-country"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.country)}
                    aria-describedby={fieldErrors.country ? 'edit-country-error' : undefined}
                    value={draft.country}
                    onChange={(e) => updateField('country', e.target.value.toUpperCase())}
                    className={inputClass('country', 'text-xs font-mono')}
                  />
                  {fieldErrors.country && (
                    <p
                      id="edit-country-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-lang"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.languageLabel}
                  </label>
                  <select
                    id="edit-lang"
                    value={draft.projLang}
                    onChange={(e) =>
                      updateField('projLang', e.target.value as 'ko' | 'en' | 'bilingual' | 'other')
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    <option value="ko">ko</option>
                    <option value="en">en</option>
                    <option value="bilingual">bilingual</option>
                    <option value="other">other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-license"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.licenseLabel}
                  </label>
                  <input
                    id="edit-license"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.license)}
                    aria-describedby={fieldErrors.license ? 'edit-license-error' : undefined}
                    value={draft.license}
                    onChange={(e) => updateField('license', e.target.value)}
                    className={inputClass('license', 'text-xs font-mono')}
                  />
                  {fieldErrors.license && (
                    <p
                      id="edit-license-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.license}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-pricing"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.pricingLabel}
                  </label>
                  <select
                    id="edit-pricing"
                    value={draft.pricingModel}
                    onChange={(e) => updateField('pricingModel', e.target.value as PricingModel)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                  >
                    {(Object.keys(PRICING_LABELS[language]) as PricingModel[]).map((k) => (
                      <option key={k} value={k}>
                        {PRICING_LABELS[language][k]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Section 3: Links, Thumbnail & Maker */}
            <fieldset className="space-y-4 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <legend className="px-1.5 text-xs font-bold text-slate-900 dark:text-white">
                {copy.sectionLinksMaker}
              </legend>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="edit-demo"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.liveDemoLabel}
                  </label>
                  <input
                    id="edit-demo"
                    type="url"
                    aria-invalid={Boolean(fieldErrors.liveDemoUrl)}
                    aria-describedby={fieldErrors.liveDemoUrl ? 'edit-demo-error' : undefined}
                    value={draft.liveDemoUrl}
                    onChange={(e) => updateField('liveDemoUrl', e.target.value)}
                    className={inputClass('liveDemoUrl', 'text-xs')}
                  />
                  {fieldErrors.liveDemoUrl && (
                    <p
                      id="edit-demo-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.liveDemoUrl}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-web"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.websiteLabel}
                  </label>
                  <input
                    id="edit-web"
                    type="url"
                    aria-invalid={Boolean(fieldErrors.websiteUrl)}
                    aria-describedby={fieldErrors.websiteUrl ? 'edit-web-error' : undefined}
                    value={draft.websiteUrl}
                    onChange={(e) => updateField('websiteUrl', e.target.value)}
                    className={inputClass('websiteUrl', 'text-xs')}
                  />
                  {fieldErrors.websiteUrl && (
                    <p
                      id="edit-web-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.websiteUrl}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-gh"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.githubUrlLabel}
                  </label>
                  <input
                    id="edit-gh"
                    type="url"
                    aria-invalid={Boolean(fieldErrors.githubUrl)}
                    aria-describedby={fieldErrors.githubUrl ? 'edit-gh-error' : undefined}
                    value={draft.githubUrl}
                    onChange={(e) => updateField('githubUrl', e.target.value)}
                    className={inputClass('githubUrl', 'text-xs')}
                  />
                  {fieldErrors.githubUrl && (
                    <p
                      id="edit-gh-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.githubUrl}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-thumb"
                  className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {copy.thumbnailUrlLabel}
                </label>
                <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    id="edit-thumb"
                    type="url"
                    aria-invalid={Boolean(fieldErrors.thumbnailUrl)}
                    aria-describedby={fieldErrors.thumbnailUrl ? 'edit-thumb-error' : undefined}
                    value={draft.thumbnailUrl}
                    onChange={(e) => updateField('thumbnailUrl', e.target.value)}
                    placeholder="https://..."
                    className={`w-full rounded-lg border bg-white px-3 py-2 text-xs text-slate-900 dark:bg-slate-950 dark:text-white ${
                      fieldErrors.thumbnailUrl
                        ? 'border-rose-500 focus:border-rose-600 focus:outline-none dark:border-rose-500'
                        : 'border-slate-300 dark:border-slate-700'
                    }`}
                  />
                  {safeThumbPreview && !thumbPreviewError && (
                    <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                      <img
                        src={safeThumbPreview}
                        alt={copy.thumbnailPreviewLabel}
                        referrerPolicy="no-referrer"
                        onError={() => setThumbPreviewError(true)}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>
                {fieldErrors.thumbnailUrl && (
                  <p
                    id="edit-thumb-error"
                    role="alert"
                    className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                  >
                    {fieldErrors.thumbnailUrl}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-maker"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.makerNameLabel}
                  </label>
                  <input
                    id="edit-maker"
                    required
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.makerName)}
                    aria-describedby={fieldErrors.makerName ? 'edit-maker-error' : undefined}
                    value={draft.makerName}
                    onChange={(e) => updateField('makerName', e.target.value)}
                    className={inputClass('makerName')}
                  />
                  {fieldErrors.makerName && (
                    <p
                      id="edit-maker-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.makerName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="edit-handle"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    {submitCopy.makerHandleLabel}
                  </label>
                  <input
                    id="edit-handle"
                    aria-invalid={Boolean(fieldErrors.makerHandle)}
                    aria-describedby={fieldErrors.makerHandle ? 'edit-handle-error' : undefined}
                    value={draft.makerHandle}
                    onChange={(e) => updateField('makerHandle', e.target.value)}
                    className={inputClass('makerHandle')}
                  />
                  {fieldErrors.makerHandle && (
                    <p
                      id="edit-handle-error"
                      role="alert"
                      className="mt-1 text-xs text-rose-600 dark:text-rose-400"
                    >
                      {fieldErrors.makerHandle}
                    </p>
                  )}
                </div>
              </div>
            </fieldset>

            {saveError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{saveError}</span>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {isDirty ? (
              <span className="font-medium text-blue-700 dark:text-blue-400">
                <span className="font-mono tabular-nums">{changedFields.length}</span>{' '}
                {copy.changedCountSuffix}
              </span>
            ) : (
              <span>{copy.noChangesHint}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isDirty && (
              <button
                type="button"
                disabled={saving}
                onClick={handleReset}
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>{copy.resetButton}</span>
              </button>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={onClose}
              className="inline-flex shrink-0 items-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {copy.cancelButton}
            </button>

            <button
              type="submit"
              form="edit-project-form"
              data-testid="edit-project-save-btn"
              disabled={saving || !isDirty}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? copy.savingButton : copy.saveButton}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
