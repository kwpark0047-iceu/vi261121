import type {
  AppLanguage,
  BackendTech,
  CatalogProject,
  ContentType,
  DevelopmentPlatform,
  GitHubRepoMetadata,
  HostingProvider,
  PricingModel,
  ProvenanceSource,
} from '../types/vibeatlas';
import {
  isSafeHttpUrl,
  parseGitHubRepoSlug,
  validateProjectSubmissionInput,
  type ProjectSubmissionValidated,
  type SubmitValidationField,
} from './validation';

export const ADMIN_EMAIL = 'kwpark0047@iceu.kr';

export type ProjectEditPermissionReason =
  | 'owner'
  | 'admin'
  | 'curated_readonly'
  | 'unauthenticated'
  | 'not_owner';

export interface ProjectEditPermission {
  allowed: boolean;
  reason: ProjectEditPermissionReason;
}

export interface ProjectEditUserIdentity {
  uid: string;
  email?: string | null;
}

export interface EditProjectDraftFields {
  githubInput: string;
  name: string;
  tagline: string;
  taglineKo: string;
  description: string;
  descriptionKo: string;
  contentType: ContentType;
  categoriesRaw: string;
  techStackRaw: string;
  platform: DevelopmentPlatform;
  hosting: HostingProvider;
  backend: BackendTech;
  country: string;
  projLang: 'ko' | 'en' | 'bilingual' | 'other';
  license: string;
  pricingModel: PricingModel;
  liveDemoUrl: string;
  websiteUrl: string;
  githubUrl: string;
  thumbnailUrl: string;
  makerName: string;
  makerHandle: string;
}

export type EditValidationField = SubmitValidationField | 'thumbnailUrl';

export interface FirestoreProjectUpdatePayload {
  name: string;
  tagline: string;
  taglineKo: string;
  description: string;
  descriptionKo: string;
  contentType: ContentType;
  categories: string[];
  techStack: string[];
  developmentPlatform: DevelopmentPlatform;
  hostingProvider: HostingProvider;
  backendTech: BackendTech;
  country: string;
  language: 'ko' | 'en' | 'bilingual' | 'other';
  license: string;
  pricingModel: PricingModel;
  liveDemoUrl: string;
  websiteUrl: string;
  githubRepo: string;
  githubUrl: string;
  thumbnailUrl: string;
  makerName: string;
  makerHandle: string;
  githubStars: number;
  githubForks: number;
  lastSyncedAt: string;
  provenanceSource: ProvenanceSource;
}

export const THUMBNAIL_URL_ERROR_COPY: Record<AppLanguage, string> = {
  ko: '올바른 http:// 또는 https:// 썸네일 이미지 URL 형식을 입력하세요.',
  en: 'Enter a valid http:// or https:// thumbnail image URL.',
  zh: '请输入有效的 http:// 或 https:// 缩略图 URL。',
  ja: '有効な http:// または https:// サムネイル画像 URL を入力してください。',
};

export function isAdminIdentity(user: ProjectEditUserIdentity | null | undefined): boolean {
  if (!user?.email) return false;
  return user.email.trim().toLowerCase() === ADMIN_EMAIL;
}

/**
 * Mirrors firestore.rules `/projects/{projectId}` allow update policy:
 * - Curated in-memory seed entries (`isCuratedSeed === true`) do not have a Firestore doc.
 * - Authenticated direct owners (`project.ownerUid === user.uid`) or admins can edit Firestore entries.
 */
export function canUserEditProject(
  project: Pick<CatalogProject, 'ownerUid' | 'isCuratedSeed'> | null | undefined,
  user: ProjectEditUserIdentity | null | undefined
): ProjectEditPermission {
  if (!project || project.isCuratedSeed) {
    return { allowed: false, reason: 'curated_readonly' };
  }
  if (!user || !user.uid) {
    return { allowed: false, reason: 'unauthenticated' };
  }
  if (project.ownerUid === user.uid) {
    return { allowed: true, reason: 'owner' };
  }
  if (isAdminIdentity(user)) {
    return { allowed: true, reason: 'admin' };
  }
  return { allowed: false, reason: 'not_owner' };
}

export function getOwnedEditableProjects(
  projects: ReadonlyArray<CatalogProject>,
  user: ProjectEditUserIdentity | null | undefined
): CatalogProject[] {
  if (!user?.uid) return [];
  return projects.filter((p) => !p.isCuratedSeed && p.ownerUid === user.uid);
}

export function buildEditDraftFromProject(project: CatalogProject): EditProjectDraftFields {
  return {
    githubInput: project.githubRepo || project.githubUrl || '',
    name: project.name || '',
    tagline: project.tagline || '',
    taglineKo: project.taglineKo || '',
    description: project.description || '',
    descriptionKo: project.descriptionKo || '',
    contentType: project.contentType,
    categoriesRaw: (project.categories || []).join(', '),
    techStackRaw: (project.techStack || []).join(', '),
    platform: project.developmentPlatform,
    hosting: project.hostingProvider,
    backend: project.backendTech,
    country: (project.country || 'KR').toUpperCase(),
    projLang: project.language || 'bilingual',
    license: project.license || 'MIT',
    pricingModel: project.pricingModel,
    liveDemoUrl: project.liveDemoUrl || '',
    websiteUrl: project.websiteUrl || '',
    githubUrl: project.githubUrl || '',
    thumbnailUrl: project.thumbnailUrl || '',
    makerName: project.makerName || '',
    makerHandle: project.makerHandle || '',
  };
}

function parseList(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function listsEqual(a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i]?.trim() !== b[i]?.trim()) return false;
  }
  return true;
}

export function getChangedProjectFields(
  original: CatalogProject,
  draft: EditProjectDraftFields,
  syncedGithubMeta: GitHubRepoMetadata | null = null
): string[] {
  const changed: string[] = [];

  if (draft.name.trim() !== (original.name || '').trim()) changed.push('name');
  if (draft.contentType !== original.contentType) changed.push('contentType');
  if (draft.tagline.trim() !== (original.tagline || '').trim()) changed.push('tagline');
  if (draft.taglineKo.trim() !== (original.taglineKo || '').trim()) changed.push('taglineKo');
  if (draft.description.trim() !== (original.description || '').trim()) changed.push('description');
  if (draft.descriptionKo.trim() !== (original.descriptionKo || '').trim())
    changed.push('descriptionKo');
  if (!listsEqual(parseList(draft.categoriesRaw), original.categories || []))
    changed.push('categories');
  if (!listsEqual(parseList(draft.techStackRaw), original.techStack || []))
    changed.push('techStack');
  if (draft.platform !== original.developmentPlatform) changed.push('platform');
  if (draft.hosting !== original.hostingProvider) changed.push('hosting');
  if (draft.backend !== original.backendTech) changed.push('backend');
  if (draft.country.trim().toUpperCase() !== (original.country || '').trim().toUpperCase())
    changed.push('country');
  if (draft.projLang !== original.language) changed.push('language');
  if (draft.license.trim() !== (original.license || '').trim()) changed.push('license');
  if (draft.pricingModel !== original.pricingModel) changed.push('pricingModel');
  if (draft.liveDemoUrl.trim() !== (original.liveDemoUrl || '').trim())
    changed.push('liveDemoUrl');
  if (draft.websiteUrl.trim() !== (original.websiteUrl || '').trim()) changed.push('websiteUrl');
  if (draft.githubUrl.trim() !== (original.githubUrl || '').trim()) changed.push('githubUrl');
  if (draft.thumbnailUrl.trim() !== (original.thumbnailUrl || '').trim())
    changed.push('thumbnailUrl');
  if (draft.makerName.trim() !== (original.makerName || '').trim()) changed.push('makerName');
  if (draft.makerHandle.trim() !== (original.makerHandle || '').trim()) changed.push('makerHandle');

  if (syncedGithubMeta && !changed.includes('githubUrl')) {
    const starsChanged = syncedGithubMeta.stars !== original.githubStars;
    const forksChanged = syncedGithubMeta.forks !== original.githubForks;
    const repoChanged = syncedGithubMeta.fullName !== original.githubRepo;
    if (starsChanged || forksChanged || repoChanged) {
      changed.push('githubSync');
    }
  }

  return changed;
}

export function hasProjectEditChanges(
  original: CatalogProject,
  draft: EditProjectDraftFields,
  syncedGithubMeta: GitHubRepoMetadata | null = null
): boolean {
  return getChangedProjectFields(original, draft, syncedGithubMeta).length > 0;
}

export type EditDraftValidationResult =
  | {
      success: true;
      data: ProjectSubmissionValidated;
      thumbnailUrl: string;
    }
  | {
      success: false;
      fieldErrors: Partial<Record<EditValidationField, string>>;
      summaryMessage: string;
    };

export function validateEditProjectDraft(
  original: Pick<CatalogProject, 'slug'>,
  draft: EditProjectDraftFields,
  language: AppLanguage
): EditDraftValidationResult {
  const categories = parseList(draft.categoriesRaw);
  const techStack = parseList(draft.techStackRaw);
  const baseValidation = validateProjectSubmissionInput(
    {
      slug: original.slug,
      name: draft.name,
      tagline: draft.tagline,
      taglineKo: draft.taglineKo,
      description: draft.description,
      descriptionKo: draft.descriptionKo,
      contentType: draft.contentType,
      categories,
      techStack,
      developmentPlatform: draft.platform,
      hostingProvider: draft.hosting,
      backendTech: draft.backend,
      country: draft.country,
      language: draft.projLang,
      license: draft.license,
      pricingModel: draft.pricingModel,
      liveDemoUrl: draft.liveDemoUrl,
      websiteUrl: draft.websiteUrl,
      githubUrl: draft.githubUrl,
      makerName: draft.makerName,
      makerHandle: draft.makerHandle,
    },
    language
  );

  const trimmedThumb = draft.thumbnailUrl.trim();
  const thumbValid = trimmedThumb.length <= 500 && isSafeHttpUrl(trimmedThumb);

  if (baseValidation.success && thumbValid) {
    return {
      success: true,
      data: baseValidation.data,
      thumbnailUrl: trimmedThumb,
    };
  }

  const fieldErrors: Partial<Record<EditValidationField, string>> = baseValidation.success
    ? {}
    : { ...baseValidation.fieldErrors };

  if (!thumbValid) {
    fieldErrors.thumbnailUrl = THUMBNAIL_URL_ERROR_COPY[language];
  }

  const firstError =
    Object.values(fieldErrors).find((msg): msg is string => Boolean(msg)) ||
    (!baseValidation.success ? baseValidation.summaryMessage : 'Invalid input');

  return {
    success: false,
    fieldErrors,
    summaryMessage: firstError,
  };
}

/**
 * Builds the exact Firestore `updateDoc` payload adhering strictly to
 * `firestore.rules` owner-update key allowlist and field length bounds.
 * Immutable fields (`slug`, `ownerUid`, `createdAt`, `likesCount`, `bookmarksCount`,
 * `verificationStatus`, `historicalSignals`) are never included.
 */
export function buildFirestoreProjectUpdatePayload(
  original: Pick<
    CatalogProject,
    'githubRepo' | 'githubStars' | 'githubForks' | 'lastSyncedAt' | 'provenanceSource'
  >,
  validated: ProjectSubmissionValidated,
  options: {
    thumbnailUrl?: string;
    syncedGithubMeta?: GitHubRepoMetadata | null;
  } = {}
): FirestoreProjectUpdatePayload {
  const cleanGithubUrl = validated.githubUrl.trim().slice(0, 500);
  const parsedRepoSlug = parseGitHubRepoSlug(cleanGithubUrl) || '';
  const ghMeta = options.syncedGithubMeta ?? null;

  let githubStars = Math.max(0, Math.floor(original.githubStars || 0));
  let githubForks = Math.max(0, Math.floor(original.githubForks || 0));
  let lastSyncedAt = (original.lastSyncedAt || '').slice(0, 64);
  let provenanceSource: ProvenanceSource = original.provenanceSource;

  if (!cleanGithubUrl) {
    githubStars = 0;
    githubForks = 0;
    lastSyncedAt = '';
  } else if (
    ghMeta &&
    (!parsedRepoSlug || ghMeta.fullName.toLowerCase() === parsedRepoSlug.toLowerCase())
  ) {
    githubStars = Math.max(0, Math.floor(ghMeta.stars));
    githubForks = Math.max(0, Math.floor(ghMeta.forks));
    lastSyncedAt = (ghMeta.fetchedAt || new Date().toISOString()).slice(0, 64);
    provenanceSource = 'github_sync';
  } else if (parsedRepoSlug.toLowerCase() !== (original.githubRepo || '').toLowerCase()) {
    // Repo URL changed without fetching fresh stats yet: avoid attributing old repo stars to new repo
    githubStars = 0;
    githubForks = 0;
    lastSyncedAt = '';
  }

  return {
    name: validated.name.slice(0, 120),
    tagline: validated.tagline.slice(0, 220),
    taglineKo: validated.taglineKo.slice(0, 220),
    description: validated.description.slice(0, 4000),
    descriptionKo: validated.descriptionKo.slice(0, 4000),
    contentType: validated.contentType,
    categories: validated.categories.slice(0, 6),
    techStack: validated.techStack.slice(0, 12),
    developmentPlatform: validated.developmentPlatform,
    hostingProvider: validated.hostingProvider,
    backendTech: validated.backendTech,
    country: validated.country.slice(0, 12),
    language: validated.language,
    license: validated.license.slice(0, 64),
    pricingModel: validated.pricingModel,
    liveDemoUrl: validated.liveDemoUrl.slice(0, 500),
    websiteUrl: validated.websiteUrl.slice(0, 500),
    githubRepo: parsedRepoSlug.slice(0, 160),
    githubUrl: cleanGithubUrl,
    thumbnailUrl: (options.thumbnailUrl ?? '').trim().slice(0, 500),
    makerName: validated.makerName.slice(0, 100),
    makerHandle: validated.makerHandle.slice(0, 80),
    githubStars: Math.min(10_000_000, githubStars),
    githubForks: Math.min(10_000_000, githubForks),
    lastSyncedAt,
    provenanceSource,
  };
}
