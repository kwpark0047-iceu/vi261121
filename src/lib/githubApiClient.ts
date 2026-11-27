import { computeDailyStarMetric } from './githubTrendingBubbles';
import type {
  AppLanguage,
  GitHubAiTrendingRepo,
  GitHubCommitEvent,
  GitHubMilestonesPayload,
  GitHubRankedRepo,
  GitHubReleaseEvent,
  GitHubRepoMetadata,
  GitHubTopRepoPreset,
} from '../types/vibeatlas';

const CACHE_TTL_MS = 15 * 60 * 1000;
const DIRECT_GITHUB_TIMEOUT_MS = 10_000;
const STORAGE_PREFIX = 'vibeatlas:gh_api_cache:v1:';
const STORAGE_HISTORY_KEY = 'vibeatlas:gh_ai_history:v1';

export const TOP_STARRED_PRESET_QUERIES: Record<GitHubTopRepoPreset, string> = {
  all: 'stars:>50000',
  web_apps: 'topic:webapp stars:>500',
  ai_agents: 'topic:ai stars:>3000',
  typescript: 'language:TypeScript stars:>10000',
  python: 'language:Python stars:>15000',
  rust: 'language:Rust stars:>5000',
  go: 'language:Go stars:>10000',
};

export interface SafeJsonParseResult<T> {
  ok: boolean;
  status: number;
  isNonJsonHtml: boolean;
  data: T | null;
  error?: string;
}

export interface TopStarredResult {
  preset: GitHubTopRepoPreset;
  fetchedAt: string;
  staleCache: boolean;
  items: GitHubRankedRepo[];
  source: 'backend' | 'github_direct' | 'client_cache';
}

export interface AiTrendingResult {
  fetchedAt: string;
  staleCache: boolean;
  items: GitHubAiTrendingRepo[];
  source: 'backend' | 'github_direct' | 'client_cache';
}

export interface TranslateDescriptionsResult {
  ok: boolean;
  status: number;
  translations: Record<string, string>;
  errorCode?: string;
  error?: string;
}

export type GitHubApiErrorCode =
  | 'DATA_UNAVAILABLE'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'NETWORK_ERROR';

export class GitHubApiClientError extends Error {
  readonly status: number;
  readonly resetAtIso: string | null;
  readonly errorCode: GitHubApiErrorCode;

  constructor(
    message: string,
    status = 500,
    resetAtIso: string | null = null,
    errorCode: GitHubApiErrorCode = 'NETWORK_ERROR'
  ) {
    super(message);
    this.name = 'GitHubApiClientError';
    this.status = status;
    this.resetAtIso = resetAtIso;
    this.errorCode = errorCode;
  }
}

interface StoredCachePayload<T> {
  expiresAt: number;
  fetchedAt: string;
  items: T[];
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException
    ? err.name === 'AbortError'
    : Boolean(err && typeof err === 'object' && (err as { name?: string }).name === 'AbortError');
}

export function buildBackendApiUrl(apiPath: string, baseUrlOverride?: string): string {
  const normalizedPath = apiPath.replace(/^\/+/, '');
  const metaEnv =
    typeof import.meta !== 'undefined'
      ? (import.meta as { env?: { BASE_URL?: string } }).env
      : undefined;
  const rawBase = baseUrlOverride ?? metaEnv?.BASE_URL ?? '/';
  const normalizedBase = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  return `${normalizedBase}${normalizedPath}`;
}

export function looksLikeHtmlPayload(rawText: string): boolean {
  const trimmed = rawText.trimStart().toLowerCase();
  return (
    trimmed.startsWith('<!doctype') ||
    trimmed.startsWith('<html') ||
    trimmed.startsWith('<head') ||
    trimmed.startsWith('<body') ||
    trimmed.startsWith('<?xml') ||
    trimmed.startsWith('<')
  );
}

export async function readJsonResponseSafely<T>(resp: Response): Promise<SafeJsonParseResult<T>> {
  const contentType = (resp.headers.get('content-type') || '').toLowerCase();
  const rawText = await resp.text();
  const htmlContentType = contentType.includes('text/html') || contentType.includes('application/xhtml');
  const htmlBody = looksLikeHtmlPayload(rawText);

  if (htmlContentType || htmlBody) {
    return {
      ok: false,
      status: resp.status,
      isNonJsonHtml: true,
      data: null,
      error: 'Backend API endpoint is unavailable on this deployment (received HTML fallback).',
    };
  }

  if (!rawText.trim()) {
    return {
      ok: false,
      status: resp.status,
      isNonJsonHtml: false,
      data: null,
      error: `Empty API response (HTTP ${resp.status}).`,
    };
  }

  try {
    const parsed = JSON.parse(rawText) as T;
    return {
      ok: resp.ok,
      status: resp.status,
      isNonJsonHtml: false,
      data: parsed,
    };
  } catch {
    return {
      ok: false,
      status: resp.status,
      isNonJsonHtml: htmlBody,
      data: null,
      error: `Invalid JSON payload received from API (HTTP ${resp.status}).`,
    };
  }
}

function readClientCache<T>(cacheKey: string): StoredCachePayload<T> | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${cacheKey}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredCachePayload<T>>;
    if (
      typeof parsed.expiresAt === 'number' &&
      typeof parsed.fetchedAt === 'string' &&
      Array.isArray(parsed.items) &&
      parsed.items.length > 0
    ) {
      return {
        expiresAt: parsed.expiresAt,
        fetchedAt: parsed.fetchedAt,
        items: parsed.items as T[],
      };
    }
  } catch {
    // Ignore corrupt localStorage entries
  }
  return null;
}

function writeClientCache<T>(cacheKey: string, fetchedAt: string, items: T[]): void {
  if (typeof localStorage === 'undefined' || items.length === 0) return;
  try {
    const payload: StoredCachePayload<T> = {
      expiresAt: Date.now() + CACHE_TTL_MS,
      fetchedAt,
      items,
    };
    localStorage.setItem(`${STORAGE_PREFIX}${cacheKey}`, JSON.stringify(payload));
  } catch {
    // Non-fatal if storage quota exceeded or disabled
  }
}

function readClientAiHistory(): Record<string, Record<string, number>> {
  if (typeof localStorage === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, Record<string, number>>;
    }
  } catch {
    // Ignore corrupt history
  }
  return {};
}

function writeClientAiHistory(history: Record<string, Record<string, number>>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    const entries = Object.entries(history).slice(-120);
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    // Ignore storage errors
  }
}

function parseRateLimitResetIso(resp: Response): string | null {
  const resetHeader = resp.headers.get('x-ratelimit-reset');
  const resetEpoch = resetHeader ? Number(resetHeader) : NaN;
  return Number.isFinite(resetEpoch) && resetEpoch > 0
    ? new Date(resetEpoch * 1000).toISOString()
    : null;
}

function createLinkedAbortSignal(externalSignal?: AbortSignal, timeoutMs = DIRECT_GITHUB_TIMEOUT_MS): {
  signal: AbortSignal;
  cleanup: () => void;
} {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const onExternalAbort = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', onExternalAbort);
    },
  };
}

export function mapGitHubSearchItemToRankedRepo(entry: unknown, idx: number): GitHubRankedRepo {
  const repo = (entry && typeof entry === 'object' ? entry : {}) as Record<string, unknown>;
  const ownerObj = repo.owner as Record<string, unknown> | null | undefined;
  const licenseObj = repo.license as Record<string, unknown> | null | undefined;
  const fullName = String(repo.full_name || '');

  return {
    rank: idx + 1,
    id: Number(repo.id || idx + 1),
    fullName,
    name: String(repo.name || fullName),
    ownerLogin:
      ownerObj && typeof ownerObj.login === 'string'
        ? ownerObj.login
        : fullName.split('/')[0] || '',
    ownerAvatarUrl:
      ownerObj && typeof ownerObj.avatar_url === 'string' ? ownerObj.avatar_url : '',
    description: typeof repo.description === 'string' ? repo.description : '',
    htmlUrl:
      typeof repo.html_url === 'string' ? repo.html_url : `https://github.com/${fullName}`,
    homepage: typeof repo.homepage === 'string' ? repo.homepage : '',
    stars: Number(repo.stargazers_count || 0),
    forks: Number(repo.forks_count || 0),
    openIssues: Number(repo.open_issues_count || 0),
    language: typeof repo.language === 'string' ? repo.language : '',
    license:
      licenseObj && typeof licenseObj.spdx_id === 'string' && licenseObj.spdx_id !== 'NOASSERTION'
        ? licenseObj.spdx_id
        : 'Unknown',
    topics: Array.isArray(repo.topics) ? repo.topics.slice(0, 6).map(String) : [],
    pushedAt: typeof repo.pushed_at === 'string' ? repo.pushed_at : '',
  };
}

export function mapGitHubRepoToMetadata(raw: Record<string, unknown>, slug: string): GitHubRepoMetadata {
  const [owner, repo] = slug.split('/');
  const licenseObj = raw.license as Record<string, unknown> | null | undefined;
  const ownerObj = raw.owner as Record<string, unknown> | null | undefined;

  return {
    fullName: String(raw.full_name || slug),
    name: String(raw.name || repo || slug),
    description: String(raw.description || ''),
    homepage: typeof raw.homepage === 'string' ? raw.homepage : '',
    htmlUrl: String(raw.html_url || `https://github.com/${slug}`),
    stars: Number(raw.stargazers_count || 0),
    forks: Number(raw.forks_count || 0),
    license:
      licenseObj && typeof licenseObj.spdx_id === 'string' && licenseObj.spdx_id !== 'NOASSERTION'
        ? licenseObj.spdx_id
        : 'Unknown',
    language: typeof raw.language === 'string' ? raw.language : '',
    topics: Array.isArray(raw.topics) ? raw.topics.slice(0, 8).map(String) : [],
    ownerLogin: ownerObj && typeof ownerObj.login === 'string' ? ownerObj.login : owner || '',
    pushedAt: typeof raw.pushed_at === 'string' ? raw.pushed_at : new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  };
}

export function mapGitHubReleasesToEvents(rawReleases: unknown[], slug: string): GitHubReleaseEvent[] {
  return rawReleases
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .filter((item) => !item.draft)
    .slice(0, 8)
    .map((item) => {
      const authorObj = item.author as Record<string, unknown> | null | undefined;
      const tagName = String(item.tag_name || '').slice(0, 48);
      const name = String(item.name || tagName || 'Release').slice(0, 140);
      const rawBody = typeof item.body === 'string' ? item.body : '';
      return {
        id: String(item.id || tagName || name),
        tagName,
        name,
        bodySummary: rawBody.slice(0, 600),
        htmlUrl:
          typeof item.html_url === 'string'
            ? item.html_url
            : `https://github.com/${slug}/releases`,
        publishedAtIso:
          typeof item.published_at === 'string' && item.published_at
            ? item.published_at
            : typeof item.created_at === 'string'
              ? item.created_at
              : '',
        prerelease: Boolean(item.prerelease),
        authorLogin: authorObj && typeof authorObj.login === 'string' ? authorObj.login : '',
      };
    })
    .filter((rel) => Boolean(rel.publishedAtIso));
}

export function mapGitHubCommitsToEvents(rawCommits: unknown[], slug: string): GitHubCommitEvent[] {
  return rawCommits
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === 'object'))
    .slice(0, 10)
    .map((item) => {
      const sha = String(item.sha || '');
      const commitObj = item.commit as Record<string, unknown> | null | undefined;
      const commitAuthorObj = commitObj?.author as Record<string, unknown> | null | undefined;
      const ghAuthorObj = item.author as Record<string, unknown> | null | undefined;
      const rawMessage = commitObj && typeof commitObj.message === 'string' ? commitObj.message : '';
      const firstLine = rawMessage.split('\n')[0]?.trim() || 'Repository commit';
      const dateIso = commitAuthorObj && typeof commitAuthorObj.date === 'string' ? commitAuthorObj.date : '';
      const authorName =
        commitAuthorObj && typeof commitAuthorObj.name === 'string' ? commitAuthorObj.name : 'Contributor';
      return {
        sha,
        shortSha: sha.slice(0, 7),
        messageHeadline: firstLine.slice(0, 160),
        authorLogin: ghAuthorObj && typeof ghAuthorObj.login === 'string' ? ghAuthorObj.login : '',
        authorName: authorName.slice(0, 80),
        htmlUrl:
          typeof item.html_url === 'string'
            ? item.html_url
            : `https://github.com/${slug}/commit/${sha}`,
        committedAtIso: dateIso,
      };
    })
    .filter((c) => Boolean(c.sha && c.committedAtIso));
}

export function buildAiTrendingReposFromSearchPayloads(
  activeItems: unknown[],
  risingItems: unknown[],
  historyInput: Record<string, Record<string, number>> = {},
  nowMs: number = Date.now()
): { items: GitHubAiTrendingRepo[]; updatedHistory: Record<string, Record<string, number>> } {
  const dedupedRaw: unknown[] = [];
  const seenRepoKeys = new Set<string>();
  for (const entry of [...risingItems, ...activeItems]) {
    if (!entry || typeof entry !== 'object') continue;
    const rec = entry as Record<string, unknown>;
    const fullName = String(rec.full_name || '').toLowerCase();
    if (!fullName || seenRepoKeys.has(fullName)) continue;
    seenRepoKeys.add(fullName);
    dedupedRaw.push(entry);
  }

  const history: Record<string, Record<string, number>> = { ...historyInput };
  const todayUtc = new Date(nowMs).toISOString().slice(0, 10);

  const items: GitHubAiTrendingRepo[] = dedupedRaw
    .slice(0, 75)
    .map((entry, idx) => {
      const repo = entry as Record<string, unknown>;
      const ownerObj = repo.owner as Record<string, unknown> | null | undefined;
      const licenseObj = repo.license as Record<string, unknown> | null | undefined;
      const fullName = String(repo.full_name || '');
      const stars = Number(repo.stargazers_count || 0);
      const createdAt = typeof repo.created_at === 'string' ? repo.created_at : '';
      const pushedAt = typeof repo.pushed_at === 'string' ? repo.pushed_at : '';

      const historyKey = fullName.toLowerCase();
      if (historyKey && stars > 0) {
        const existingSnapshots = history[historyKey] ? { ...history[historyKey] } : {};
        existingSnapshots[todayUtc] = stars;
        history[historyKey] = existingSnapshots;
      }

      const metric = computeDailyStarMetric({
        stars,
        createdAt,
        pushedAt,
        snapshots: history[historyKey],
        nowMs,
      });

      return {
        rank: idx + 1,
        id: Number(repo.id || idx + 1),
        fullName,
        name: String(repo.name || fullName),
        ownerLogin:
          ownerObj && typeof ownerObj.login === 'string'
            ? ownerObj.login
            : fullName.split('/')[0] || '',
        ownerAvatarUrl:
          ownerObj && typeof ownerObj.avatar_url === 'string' ? ownerObj.avatar_url : '',
        description: typeof repo.description === 'string' ? repo.description : '',
        htmlUrl:
          typeof repo.html_url === 'string' ? repo.html_url : `https://github.com/${fullName}`,
        homepage: typeof repo.homepage === 'string' ? repo.homepage : '',
        stars,
        forks: Number(repo.forks_count || 0),
        openIssues: Number(repo.open_issues_count || 0),
        language: typeof repo.language === 'string' ? repo.language : '',
        license:
          licenseObj && typeof licenseObj.spdx_id === 'string' && licenseObj.spdx_id !== 'NOASSERTION'
            ? licenseObj.spdx_id
            : 'Unknown',
        topics: Array.isArray(repo.topics) ? repo.topics.slice(0, 6).map(String) : [],
        createdAt,
        pushedAt,
        dailyStars: metric.dailyStars,
        dailyRateSource: metric.dailyRateSource,
      } satisfies GitHubAiTrendingRepo;
    })
    .filter((item) => Boolean(item.fullName))
    .sort((a, b) => b.dailyStars - a.dailyStars || b.stars - a.stars)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  return { items, updatedHistory: history };
}

function shouldFallbackFromBackend(parsed: SafeJsonParseResult<unknown>): boolean {
  if (parsed.isNonJsonHtml) return true;
  if (parsed.status === 404 || parsed.status === 405 || parsed.status >= 500) {
    // If the backend intentionally responded with structured JSON 404 for a specific missing repo, don't retry
    if (
      parsed.status === 404 &&
      parsed.data &&
      typeof parsed.data === 'object' &&
      'error' in parsed.data &&
      typeof (parsed.data as { error?: unknown }).error === 'string' &&
      (parsed.data as { error: string }).error.toLowerCase().includes('repository')
    ) {
      return false;
    }
    return true;
  }
  return !parsed.data || typeof parsed.data !== 'object';
}

export async function fetchTopStarredRepos(
  preset: GitHubTopRepoPreset,
  options?: { forceRefresh?: boolean; signal?: AbortSignal; fetchImpl?: typeof fetch }
): Promise<TopStarredResult> {
  const fetchFn = options?.fetchImpl ?? fetch;
  const forceRefresh = Boolean(options?.forceRefresh);
  const cacheKey = `top-starred:${preset}`;
  const cached = readClientCache<GitHubRankedRepo>(cacheKey);

  // 1. Try backend endpoint first
  let backendRateLimited: { error: string; resetAtIso: string | null } | null = null;
  try {
    const refreshParam = forceRefresh ? '&refresh=1' : '';
    const backendUrl = buildBackendApiUrl(
      `/api/github/top-starred?preset=${encodeURIComponent(preset)}${refreshParam}`
    );
    const resp = await fetchFn(backendUrl, { signal: options?.signal });
    const parsed = await readJsonResponseSafely<{
      preset?: GitHubTopRepoPreset;
      fetchedAt?: string;
      staleCache?: boolean;
      items?: GitHubRankedRepo[];
      error?: string;
      resetAtIso?: string | null;
    }>(resp);

    if (parsed.ok && parsed.data && Array.isArray(parsed.data.items)) {
      const fetchedAt = parsed.data.fetchedAt || new Date().toISOString();
      writeClientCache(cacheKey, fetchedAt, parsed.data.items);
      return {
        preset: parsed.data.preset ?? preset,
        fetchedAt,
        staleCache: Boolean(parsed.data.staleCache),
        items: parsed.data.items,
        source: 'backend',
      };
    }

    if (!shouldFallbackFromBackend(parsed)) {
      if (parsed.status === 429 || parsed.status === 403) {
        backendRateLimited = {
          error: parsed.data?.error || 'GitHub Search API rate limit reached.',
          resetAtIso: parsed.data?.resetAtIso ?? null,
        };
      } else if (parsed.status >= 400) {
        throw new GitHubApiClientError(
          parsed.data?.error || parsed.error || `Request failed with status ${parsed.status}`,
          parsed.status,
          parsed.data?.resetAtIso ?? null,
          parsed.status === 404 ? 'NOT_FOUND' : 'DATA_UNAVAILABLE'
        );
      }
      // If status was 200 OK JSON without an items array (unexpected schema), continue to fallback
    }
  } catch (err) {
    if (isAbortError(err)) throw err;
    if (err instanceof GitHubApiClientError && err.status !== 429 && err.status !== 403) {
      throw err;
    }
    // Network or HTML parse error -> proceed to client cache / direct GitHub fallback
  }

  // 2. If backend unavailable or rate-limited and fresh local cache satisfies non-forced request, serve it immediately
  if (!forceRefresh && cached && cached.expiresAt > Date.now()) {
    return {
      preset,
      fetchedAt: cached.fetchedAt,
      staleCache: false,
      items: cached.items,
      source: 'client_cache',
    };
  }

  // 3. Direct CORS call to GitHub's public REST API
  const query = TOP_STARRED_PRESET_QUERIES[preset] ?? TOP_STARRED_PRESET_QUERIES.all;
  const directEndpoint = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=100&page=1`;
  const { signal, cleanup } = createLinkedAbortSignal(options?.signal);

  try {
    const resp = await fetchFn(directEndpoint, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    });

    const parsed = await readJsonResponseSafely<{ items?: unknown[]; message?: string }>(resp);

    if (resp.status === 403 || resp.status === 429) {
      if (cached) {
        return {
          preset,
          fetchedAt: cached.fetchedAt,
          staleCache: true,
          items: cached.items,
          source: 'client_cache',
        };
      }
      if (parsed.isNonJsonHtml || !parsed.data) {
        throw new GitHubApiClientError(
          'Data unavailable',
          resp.status,
          null,
          'DATA_UNAVAILABLE'
        );
      }
      throw new GitHubApiClientError(
        backendRateLimited?.error || 'GitHub Search API rate limit reached. Please try again in a minute.',
        429,
        parseRateLimitResetIso(resp) ?? backendRateLimited?.resetAtIso ?? null,
        'RATE_LIMITED'
      );
    }

    if (!resp.ok || parsed.isNonJsonHtml || !parsed.ok || !parsed.data || !Array.isArray(parsed.data.items)) {
      if (cached) {
        return {
          preset,
          fetchedAt: cached.fetchedAt,
          staleCache: true,
          items: cached.items,
          source: 'client_cache',
        };
      }
      const status = !resp.ok ? resp.status : parsed.isNonJsonHtml ? 503 : 502;
      throw new GitHubApiClientError('Data unavailable', status, null, 'DATA_UNAVAILABLE');
    }

    const rawItems = parsed.data.items;
    const items = rawItems.slice(0, 100).map((entry, idx) => mapGitHubSearchItemToRankedRepo(entry, idx));
    const fetchedAt = new Date().toISOString();
    writeClientCache(cacheKey, fetchedAt, items);

    return {
      preset,
      fetchedAt,
      staleCache: false,
      items,
      source: 'github_direct',
    };
  } catch (err) {
    if (isAbortError(err)) throw err;
    if (cached) {
      return {
        preset,
        fetchedAt: cached.fetchedAt,
        staleCache: true,
        items: cached.items,
        source: 'client_cache',
      };
    }
    if (err instanceof GitHubApiClientError) throw err;
    throw new GitHubApiClientError(
      backendRateLimited?.error ||
        (err instanceof Error ? err.message : 'Unable to reach GitHub Search API.'),
      502,
      backendRateLimited?.resetAtIso ?? null,
      'NETWORK_ERROR'
    );
  } finally {
    cleanup();
  }
}

export async function fetchAiTrendingRepos(options?: {
  forceRefresh?: boolean;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}): Promise<AiTrendingResult> {
  const fetchFn = options?.fetchImpl ?? fetch;
  const forceRefresh = Boolean(options?.forceRefresh);
  const cacheKey = 'ai-trending';
  const cached = readClientCache<GitHubAiTrendingRepo>(cacheKey);

  // 1. Try backend endpoint first
  try {
    const backendUrl = buildBackendApiUrl(
      forceRefresh ? '/api/github/ai-trending?refresh=1' : '/api/github/ai-trending'
    );
    const resp = await fetchFn(backendUrl, { signal: options?.signal });
    const parsed = await readJsonResponseSafely<{
      fetchedAt?: string;
      staleCache?: boolean;
      items?: GitHubAiTrendingRepo[];
      error?: string;
      resetAtIso?: string | null;
    }>(resp);

    if (parsed.ok && parsed.data && Array.isArray(parsed.data.items)) {
      const fetchedAt = parsed.data.fetchedAt || new Date().toISOString();
      writeClientCache(cacheKey, fetchedAt, parsed.data.items);
      return {
        fetchedAt,
        staleCache: Boolean(parsed.data.staleCache),
        items: parsed.data.items,
        source: 'backend',
      };
    }

    if (!shouldFallbackFromBackend(parsed) && parsed.status !== 429 && parsed.status !== 403) {
      throw new GitHubApiClientError(
        parsed.data?.error || parsed.error || `HTTP ${parsed.status}`,
        parsed.status,
        parsed.data?.resetAtIso ?? null
      );
    }
  } catch (err) {
    if (isAbortError(err)) throw err;
    if (err instanceof GitHubApiClientError && err.status !== 429 && err.status !== 403) {
      throw err;
    }
  }

  // 2. Fresh localStorage cache when backend is absent
  if (!forceRefresh && cached && cached.expiresAt > Date.now()) {
    return {
      fetchedAt: cached.fetchedAt,
      staleCache: false,
      items: cached.items,
      source: 'client_cache',
    };
  }

  // 3. Direct GitHub public search API fallback
  const sinceDate = new Date(Date.now() - 14 * 86_400_000).toISOString().slice(0, 10);
  const risingSinceDate = new Date(Date.now() - 90 * 86_400_000).toISOString().slice(0, 10);
  const activeQuery = `topic:ai pushed:>=${sinceDate} stars:>500`;
  const risingQuery = `topic:ai created:>=${risingSinceDate} stars:>250`;
  const activeEndpoint = `https://api.github.com/search/repositories?q=${encodeURIComponent(activeQuery)}&sort=stars&order=desc&per_page=60&page=1`;
  const risingEndpoint = `https://api.github.com/search/repositories?q=${encodeURIComponent(risingQuery)}&sort=stars&order=desc&per_page=30&page=1`;

  const { signal, cleanup } = createLinkedAbortSignal(options?.signal);

  try {
    const [activeResp, risingResp] = await Promise.all([
      fetchFn(activeEndpoint, { headers: { Accept: 'application/vnd.github+json' }, signal }),
      fetchFn(risingEndpoint, { headers: { Accept: 'application/vnd.github+json' }, signal }).catch(
        () => null
      ),
    ]);

    if (activeResp.status === 403 || activeResp.status === 429) {
      if (cached) {
        return {
          fetchedAt: cached.fetchedAt,
          staleCache: true,
          items: cached.items,
          source: 'client_cache',
        };
      }
      throw new GitHubApiClientError(
        'GitHub Search API rate limit reached. Try again shortly.',
        429,
        parseRateLimitResetIso(activeResp)
      );
    }

    if (!activeResp.ok) {
      if (cached) {
        return {
          fetchedAt: cached.fetchedAt,
          staleCache: true,
          items: cached.items,
          source: 'client_cache',
        };
      }
      throw new GitHubApiClientError(
        `GitHub Search API returned status ${activeResp.status}.`,
        activeResp.status
      );
    }

    const activeParsed = await readJsonResponseSafely<{ items?: unknown[] }>(activeResp);
    if (activeParsed.isNonJsonHtml || !activeParsed.ok || !activeParsed.data || !Array.isArray(activeParsed.data.items)) {
      if (cached) {
        return {
          fetchedAt: cached.fetchedAt,
          staleCache: true,
          items: cached.items,
          source: 'client_cache',
        };
      }
      throw new GitHubApiClientError(
        'Data unavailable',
        activeParsed.isNonJsonHtml ? 503 : 502,
        null,
        'DATA_UNAVAILABLE'
      );
    }

    const activeItems = activeParsed.data.items;
    let risingItems: unknown[] = [];
    if (risingResp && risingResp.ok) {
      const risingParsed = await readJsonResponseSafely<{ items?: unknown[] }>(risingResp);
      if (risingParsed.ok && Array.isArray(risingParsed.data?.items)) {
        risingItems = risingParsed.data.items;
      }
    }

    const history = readClientAiHistory();
    const { items, updatedHistory } = buildAiTrendingReposFromSearchPayloads(
      activeItems,
      risingItems,
      history
    );

    if (items.length === 0) {
      if (cached) {
        return {
          fetchedAt: cached.fetchedAt,
          staleCache: true,
          items: cached.items,
          source: 'client_cache',
        };
      }
      throw new GitHubApiClientError('GitHub Search API returned no active AI repositories.', 502);
    }

    writeClientAiHistory(updatedHistory);
    const fetchedAt = new Date().toISOString();
    writeClientCache(cacheKey, fetchedAt, items);

    return {
      fetchedAt,
      staleCache: false,
      items,
      source: 'github_direct',
    };
  } catch (err) {
    if (isAbortError(err)) throw err;
    if (cached) {
      return {
        fetchedAt: cached.fetchedAt,
        staleCache: true,
        items: cached.items,
        source: 'client_cache',
      };
    }
    if (err instanceof GitHubApiClientError) throw err;
    throw new GitHubApiClientError(
      err instanceof Error ? err.message : 'Failed to reach GitHub Search API.',
      502
    );
  } finally {
    cleanup();
  }
}

export async function fetchGitHubRepoMetadata(
  slug: string,
  options?: { signal?: AbortSignal; fetchImpl?: typeof fetch }
): Promise<GitHubRepoMetadata> {
  const fetchFn = options?.fetchImpl ?? fetch;

  // 1. Try backend endpoint first
  try {
    const backendUrl = buildBackendApiUrl(`/api/github/repo?repo=${encodeURIComponent(slug)}`);
    const resp = await fetchFn(backendUrl, { signal: options?.signal });
    const parsed = await readJsonResponseSafely<{
      repo?: GitHubRepoMetadata;
      error?: string;
    }>(resp);

    if (parsed.ok && parsed.data?.repo) {
      return parsed.data.repo;
    }

    if (!shouldFallbackFromBackend(parsed)) {
      throw new GitHubApiClientError(
        parsed.data?.error || parsed.error || `GitHub API returned status ${parsed.status}.`,
        parsed.status
      );
    }
  } catch (err) {
    if (isAbortError(err)) throw err;
    if (err instanceof GitHubApiClientError) throw err;
  }

  // 2. Fallback to direct GitHub REST API
  const [owner, repo] = slug.split('/');
  if (!owner || !repo) {
    throw new GitHubApiClientError('Invalid GitHub repository format (expected owner/repo).', 400);
  }

  const endpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  const { signal, cleanup } = createLinkedAbortSignal(options?.signal, 8500);
  try {
    const resp = await fetchFn(endpoint, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    });
    if (resp.status === 404) {
      throw new GitHubApiClientError(`GitHub repository "${slug}" was not found.`, 404);
    }
    if (resp.status === 403 || resp.status === 429) {
      throw new GitHubApiClientError('GitHub API rate limit reached. Try again later.', 429);
    }
    if (!resp.ok) {
      throw new GitHubApiClientError(`GitHub API returned status ${resp.status}.`, resp.status);
    }
    const parsed = await readJsonResponseSafely<Record<string, unknown>>(resp);
    if (!parsed.data) {
      throw new GitHubApiClientError(parsed.error || 'Invalid repository payload from GitHub.', 502);
    }
    return mapGitHubRepoToMetadata(parsed.data, slug);
  } finally {
    cleanup();
  }
}

export async function fetchGitHubMilestones(
  slug: string,
  options?: { forceRefresh?: boolean; signal?: AbortSignal; fetchImpl?: typeof fetch }
): Promise<GitHubMilestonesPayload> {
  const fetchFn = options?.fetchImpl ?? fetch;
  const forceRefresh = Boolean(options?.forceRefresh);

  // 1. Try backend endpoint first
  try {
    const refreshParam = forceRefresh ? '&refresh=1' : '';
    const backendUrl = buildBackendApiUrl(
      `/api/github/milestones?repo=${encodeURIComponent(slug)}${refreshParam}`
    );
    const resp = await fetchFn(backendUrl, { signal: options?.signal });
    const parsed = await readJsonResponseSafely<GitHubMilestonesPayload & { error?: string }>(resp);

    if (parsed.ok && parsed.data && Array.isArray(parsed.data.releases) && Array.isArray(parsed.data.commits)) {
      return parsed.data;
    }

    if (!shouldFallbackFromBackend(parsed)) {
      throw new GitHubApiClientError(
        parsed.data?.error || parsed.error || `HTTP ${parsed.status}`,
        parsed.status
      );
    }
  } catch (err) {
    if (isAbortError(err)) throw err;
    if (err instanceof GitHubApiClientError) throw err;
  }

  // 2. Fallback to direct GitHub releases + commits REST API
  const [owner, repo] = slug.split('/');
  if (!owner || !repo) {
    throw new GitHubApiClientError('Invalid GitHub repository format (expected owner/repo).', 400);
  }

  const releasesEndpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/releases?per_page=8`;
  const commitsEndpoint = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=10`;
  const { signal, cleanup } = createLinkedAbortSignal(options?.signal, 8500);

  try {
    const [releasesResp, commitsResp] = await Promise.all([
      fetchFn(releasesEndpoint, { headers: { Accept: 'application/vnd.github+json' }, signal }),
      fetchFn(commitsEndpoint, { headers: { Accept: 'application/vnd.github+json' }, signal }),
    ]);

    if (
      releasesResp.status === 403 ||
      releasesResp.status === 429 ||
      commitsResp.status === 403 ||
      commitsResp.status === 429
    ) {
      throw new GitHubApiClientError(
        'GitHub API rate limit reached while fetching repository milestones. Try again shortly.',
        429
      );
    }

    if (commitsResp.status === 404 && releasesResp.status === 404) {
      throw new GitHubApiClientError(`GitHub repository "${slug}" was not found.`, 404);
    }

    let releases: GitHubReleaseEvent[] = [];
    if (releasesResp.ok) {
      const parsedReleases = await readJsonResponseSafely<unknown[]>(releasesResp);
      if (Array.isArray(parsedReleases.data)) {
        releases = mapGitHubReleasesToEvents(parsedReleases.data, slug);
      }
    }

    let commits: GitHubCommitEvent[] = [];
    if (commitsResp.ok) {
      const parsedCommits = await readJsonResponseSafely<unknown[]>(commitsResp);
      if (Array.isArray(parsedCommits.data)) {
        commits = mapGitHubCommitsToEvents(parsedCommits.data, slug);
      }
    }

    return {
      repo: slug,
      fetchedAt: new Date().toISOString(),
      releases,
      commits,
      staleCache: false,
    };
  } finally {
    cleanup();
  }
}

export async function translateRepoDescriptionsSafely(options: {
  targetLanguage: AppLanguage;
  items: { id: number | string; text: string }[];
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}): Promise<TranslateDescriptionsResult> {
  const fetchFn = options.fetchImpl ?? fetch;
  try {
    const resp = await fetchFn(buildBackendApiUrl('/api/github/translate-descriptions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetLanguage: options.targetLanguage,
        items: options.items,
      }),
      signal: options.signal,
    });

    const parsed = await readJsonResponseSafely<{
      translations?: Record<string, string>;
      error?: string;
      errorCode?: string;
    }>(resp);

    if (parsed.isNonJsonHtml) {
      return {
        ok: false,
        status: resp.status,
        translations: {},
        errorCode: 'BACKEND_UNAVAILABLE',
        error: 'Translation API is not available on static deployments.',
      };
    }

    const translations = parsed.data?.translations ?? {};
    if (!resp.ok) {
      return {
        ok: false,
        status: resp.status,
        translations,
        errorCode: parsed.data?.errorCode,
        error: parsed.data?.error || parsed.error || `Translation failed (${resp.status})`,
      };
    }

    return {
      ok: true,
      status: resp.status,
      translations,
    };
  } catch (err) {
    if (isAbortError(err)) throw err;
    return {
      ok: false,
      status: 0,
      translations: {},
      errorCode: 'NETWORK_ERROR',
      error: err instanceof Error ? err.message : 'Translation request failed.',
    };
  }
}
