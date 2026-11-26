import test from 'node:test';
import assert from 'node:assert/strict';
import type { CatalogProject, GitHubRepoMetadata } from '../types/vibeatlas';
import {
  ADMIN_EMAIL,
  buildEditDraftFromProject,
  buildFirestoreProjectUpdatePayload,
  canUserEditProject,
  getChangedProjectFields,
  getOwnedEditableProjects,
  hasProjectEditChanges,
  validateEditProjectDraft,
} from './projectEdit';

const BASE_PROJECT: CatalogProject = {
  id: 'proj_12345',
  slug: 'vibe-helper-ab12',
  name: 'Vibe Helper',
  tagline: 'Fast helper utility for MCP servers',
  taglineKo: 'MCP 서버용 빠른 보조 도구',
  description: 'A practical open-source helper tool for building reliable MCP integrations.',
  descriptionKo: '안정적인 MCP 연동을 구축하기 위한 실용적인 오픈소스 보조 도구입니다.',
  contentType: 'mcp_server',
  categories: ['MCP Server', 'Developer Tools'],
  techStack: ['TypeScript', 'Node.js'],
  developmentPlatform: 'cursor',
  hostingProvider: 'vercel',
  backendTech: 'firebase',
  country: 'KR',
  language: 'bilingual',
  license: 'MIT',
  pricingModel: 'open_source',
  verificationStatus: 'unverified',
  provenanceSource: 'maker_submitted',
  liveDemoUrl: 'https://vibehelper.example.com',
  websiteUrl: 'https://docs.vibehelper.example.com',
  githubRepo: 'maker/vibe-helper',
  githubUrl: 'https://github.com/maker/vibe-helper',
  thumbnailUrl: 'https://cdn.example.com/thumb.png',
  makerName: 'Minho Kim',
  makerHandle: '@minho',
  ownerUid: 'uid_owner_1',
  githubStars: 42,
  githubForks: 5,
  likesCount: 9,
  bookmarksCount: 4,
  lastSyncedAt: '2026-11-20T00:00:00.000Z',
  createdAtIso: '2026-11-01T00:00:00.000Z',
  updatedAtIso: '2026-11-20T00:00:00.000Z',
  isCuratedSeed: false,
};

test('canUserEditProject enforces owner/admin permissions and blocks curated seeds', () => {
  assert.deepEqual(canUserEditProject(BASE_PROJECT, null), {
    allowed: false,
    reason: 'unauthenticated',
  });
  assert.deepEqual(canUserEditProject(BASE_PROJECT, { uid: 'uid_owner_1', email: 'a@b.com' }), {
    allowed: true,
    reason: 'owner',
  });
  assert.deepEqual(canUserEditProject(BASE_PROJECT, { uid: 'uid_other', email: 'other@b.com' }), {
    allowed: false,
    reason: 'not_owner',
  });
  assert.deepEqual(canUserEditProject(BASE_PROJECT, { uid: 'uid_admin', email: ADMIN_EMAIL }), {
    allowed: true,
    reason: 'admin',
  });
  assert.deepEqual(
    canUserEditProject(
      { ...BASE_PROJECT, isCuratedSeed: true },
      { uid: 'uid_owner_1', email: ADMIN_EMAIL }
    ),
    { allowed: false, reason: 'curated_readonly' }
  );
});

test('getOwnedEditableProjects filters only Firestore-backed owned projects', () => {
  const seedProject: CatalogProject = { ...BASE_PROJECT, id: 'seed_1', isCuratedSeed: true };
  const otherProject: CatalogProject = { ...BASE_PROJECT, id: 'proj_other', ownerUid: 'uid_other' };
  const owned = getOwnedEditableProjects([seedProject, BASE_PROJECT, otherProject], {
    uid: 'uid_owner_1',
  });
  assert.equal(owned.length, 1);
  assert.equal(owned[0]?.id, 'proj_12345');
});

test('buildEditDraftFromProject & change detection handle unchanged vs modified drafts cleanly', () => {
  const draft = buildEditDraftFromProject(BASE_PROJECT);
  assert.equal(hasProjectEditChanges(BASE_PROJECT, draft), false);
  assert.deepEqual(getChangedProjectFields(BASE_PROJECT, draft), []);

  // Whitespace-only difference is ignored
  const whitespaceDraft = { ...draft, name: '  Vibe Helper  ', country: 'kr' };
  assert.equal(hasProjectEditChanges(BASE_PROJECT, whitespaceDraft), false);

  const editedDraft = {
    ...draft,
    name: 'Vibe Helper Pro',
    categoriesRaw: 'MCP Server, AI Agent',
    thumbnailUrl: 'https://cdn.example.com/new-thumb.png',
  };
  assert.equal(hasProjectEditChanges(BASE_PROJECT, editedDraft), true);
  assert.deepEqual(getChangedProjectFields(BASE_PROJECT, editedDraft), [
    'name',
    'categories',
    'thumbnailUrl',
  ]);
});

test('validateEditProjectDraft validates submission bounds and unsafe thumbnail URLs', () => {
  const badDraft = {
    ...buildEditDraftFromProject(BASE_PROJECT),
    name: 'A',
    thumbnailUrl: 'javascript:alert(1)',
  };
  const invalidRes = validateEditProjectDraft(BASE_PROJECT, badDraft, 'ko');
  assert.equal(invalidRes.success, false);
  if (!invalidRes.success) {
    assert.ok(invalidRes.fieldErrors.name);
    assert.ok(invalidRes.fieldErrors.thumbnailUrl);
  }

  const goodDraft = {
    ...buildEditDraftFromProject(BASE_PROJECT),
    name: 'Vibe Helper v2',
    thumbnailUrl: 'https://cdn.example.com/v2.png',
  };
  const validRes = validateEditProjectDraft(BASE_PROJECT, goodDraft, 'en');
  assert.equal(validRes.success, true);
});

test('buildFirestoreProjectUpdatePayload strictly emits rules-whitelisted keys and manages GitHub sync', () => {
  const draft = {
    ...buildEditDraftFromProject(BASE_PROJECT),
    name: 'Vibe Helper v2',
    thumbnailUrl: 'https://cdn.example.com/v2.png',
  };
  const validation = validateEditProjectDraft(BASE_PROJECT, draft, 'en');
  assert.equal(validation.success, true);
  if (!validation.success) return;

  const freshGhMeta: GitHubRepoMetadata = {
    fullName: 'maker/vibe-helper',
    name: 'vibe-helper',
    description: 'Updated repo description',
    homepage: 'https://vibehelper.example.com',
    htmlUrl: 'https://github.com/maker/vibe-helper',
    stars: 120,
    forks: 18,
    license: 'MIT',
    language: 'TypeScript',
    topics: ['mcp'],
    ownerLogin: 'maker',
    pushedAt: '2026-11-24T12:00:00Z',
    fetchedAt: '2026-11-25T00:00:00Z',
  };

  const payload = buildFirestoreProjectUpdatePayload(BASE_PROJECT, validation.data, {
    thumbnailUrl: validation.thumbnailUrl,
    syncedGithubMeta: freshGhMeta,
  });

  // Never include immutable or prohibited keys
  const payloadRecord = payload as unknown as Record<string, unknown>;
  for (const forbidden of [
    'slug',
    'ownerUid',
    'createdAt',
    'likesCount',
    'bookmarksCount',
    'verificationStatus',
    'historicalSignals',
    'isCuratedSeed',
  ]) {
    assert.equal(forbidden in payloadRecord, false, `${forbidden} must not be sent`);
  }

  assert.equal(payload.githubStars, 120);
  assert.equal(payload.githubForks, 18);
  assert.equal(payload.provenanceSource, 'github_sync');
  assert.equal(payload.thumbnailUrl, 'https://cdn.example.com/v2.png');

  // When GitHub URL changes without fetching fresh metadata, do not carry stale star count from old repo
  const changedRepoDraft = {
    ...buildEditDraftFromProject(BASE_PROJECT),
    githubUrl: 'https://github.com/other/new-repo',
  };
  const changedRepoVal = validateEditProjectDraft(BASE_PROJECT, changedRepoDraft, 'en');
  assert.equal(changedRepoVal.success, true);
  if (changedRepoVal.success) {
    const changedPayload = buildFirestoreProjectUpdatePayload(BASE_PROJECT, changedRepoVal.data);
    assert.equal(changedPayload.githubRepo, 'other/new-repo');
    assert.equal(changedPayload.githubStars, 0);
    assert.equal(changedPayload.githubForks, 0);
    assert.equal(changedPayload.lastSyncedAt, '');
  }
});
