import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAiTrendingReposFromSearchPayloads,
  buildBackendApiUrl,
  fetchAiTrendingRepos,
  fetchGitHubMilestones,
  fetchGitHubRepoMetadata,
  fetchTopStarredRepos,
  GitHubApiClientError,
  readJsonResponseSafely,
  translateRepoDescriptionsSafely,
} from './githubApiClient';

test('buildBackendApiUrl joins base paths without double slashes', () => {
  assert.equal(buildBackendApiUrl('/api/github/top-starred?preset=all', '/'), '/api/github/top-starred?preset=all');
  assert.equal(
    buildBackendApiUrl('/api/github/top-starred?preset=all', '/vibeatlas'),
    '/vibeatlas/api/github/top-starred?preset=all'
  );
  assert.equal(
    buildBackendApiUrl('api/github/repo?repo=a/b', '/vibeatlas/'),
    '/vibeatlas/api/github/repo?repo=a/b'
  );
});

test('readJsonResponseSafely detects <!doctype html> without throwing SyntaxError', async () => {
  const htmlResp = new Response('<!doctype html><html><body>SPA</body></html>', {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
  const result = await readJsonResponseSafely<{ items: unknown[] }>(htmlResp);
  assert.equal(result.ok, false);
  assert.equal(result.isNonJsonHtml, true);
  assert.equal(result.data, null);

  // Even if content-type is missing or application/json, leading '<' HTML is caught safely
  const mislabeledHtmlResp = new Response('  <!DOCTYPE html><html></html>', {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  const mislabeledResult = await readJsonResponseSafely<{ items: unknown[] }>(mislabeledHtmlResp);
  assert.equal(mislabeledResult.ok, false);
  assert.equal(mislabeledResult.isNonJsonHtml, true);
  assert.equal(mislabeledResult.data, null);
});

test('readJsonResponseSafely parses valid JSON cleanly', async () => {
  const jsonResp = new Response(JSON.stringify({ preset: 'all', items: [{ id: 1 }] }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  const result = await readJsonResponseSafely<{ preset: string; items: { id: number }[] }>(jsonResp);
  assert.equal(result.ok, true);
  assert.equal(result.isNonJsonHtml, false);
  assert.equal(result.data?.preset, 'all');
  assert.equal(result.data?.items[0]?.id, 1);
});

test('fetchTopStarredRepos falls back to direct GitHub API when /api returns <!doctype html>', async () => {
  const calledUrls: string[] = [];
  const mockFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    calledUrls.push(url);

    if (url.includes('/api/github/top-starred')) {
      return new Response('<!doctype html><html><body>VibeAtlas SPA</body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (url.startsWith('https://api.github.com/search/repositories')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 101,
              full_name: 'openai/whisper',
              name: 'whisper',
              owner: { login: 'openai', avatar_url: 'https://avatars.githubusercontent.com/u/14957082' },
              description: 'Robust Speech Recognition',
              html_url: 'https://github.com/openai/whisper',
              homepage: '',
              stargazers_count: 80000,
              forks_count: 9500,
              open_issues_count: 120,
              language: 'Python',
              license: { spdx_id: 'MIT' },
              topics: ['ai', 'speech'],
              pushed_at: '2026-11-20T00:00:00Z',
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await fetchTopStarredRepos('all', { fetchImpl: mockFetch });
  assert.equal(calledUrls.length, 2);
  assert.equal(result.source, 'github_direct');
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.fullName, 'openai/whisper');
  assert.equal(result.items[0]?.stars, 80000);
  assert.equal(result.items[0]?.rank, 1);
});

test('fetchAiTrendingRepos falls back to direct GitHub Search when /api returns <!doctype html>', async () => {
  const mockFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (url.includes('/api/github/ai-trending')) {
      return new Response('<!doctype html><html></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }
    if (url.startsWith('https://api.github.com/search/repositories')) {
      return new Response(
        JSON.stringify({
          items: [
            {
              id: 202,
              full_name: 'langchain-ai/langgraph',
              name: 'langgraph',
              owner: { login: 'langchain-ai', avatar_url: '' },
              description: 'Build resilient language agents as graphs',
              html_url: 'https://github.com/langchain-ai/langgraph',
              stargazers_count: 18000,
              forks_count: 2500,
              open_issues_count: 80,
              language: 'Python',
              license: { spdx_id: 'MIT' },
              topics: ['ai', 'agents'],
              created_at: new Date(Date.now() - 180 * 86_400_000).toISOString(),
              pushed_at: new Date().toISOString(),
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const result = await fetchAiTrendingRepos({ fetchImpl: mockFetch });
  assert.equal(result.source, 'github_direct');
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.fullName, 'langchain-ai/langgraph');
  assert.ok(result.items[0]!.dailyStars >= 1);
});

test('buildAiTrendingReposFromSearchPayloads deduplicates and ranks by dailyStars', () => {
  const nowMs = Date.UTC(2026, 10, 27);
  const tenDaysAgo = new Date(nowMs - 10 * 86_400_000).toISOString();
  const hundredDaysAgo = new Date(nowMs - 100 * 86_400_000).toISOString();

  const { items } = buildAiTrendingReposFromSearchPayloads(
    [
      {
        id: 1,
        full_name: 'org/slow-giant',
        name: 'slow-giant',
        stargazers_count: 5000,
        created_at: hundredDaysAgo,
      },
      {
        id: 2,
        full_name: 'org/fast-rising',
        name: 'fast-rising',
        stargazers_count: 3000,
        created_at: tenDaysAgo,
      },
    ],
    [
      {
        id: 2,
        full_name: 'org/fast-rising',
        name: 'fast-rising',
        stargazers_count: 3000,
        created_at: tenDaysAgo,
      },
    ],
    {},
    nowMs
  );

  assert.equal(items.length, 2);
  assert.equal(items[0]?.fullName, 'org/fast-rising');
  assert.equal(items[0]?.dailyStars, 300);
  assert.equal(items[1]?.fullName, 'org/slow-giant');
  assert.equal(items[1]?.dailyStars, 50);
});

test('fetchGitHubRepoMetadata falls back on HTML and preserves structured 404 from backend', async () => {
  // 1. HTML fallback
  const fallbackFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (url.includes('/api/github/repo')) {
      return new Response('<!doctype html><html></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }
    return new Response(
      JSON.stringify({
        full_name: 'vercel/next.js',
        name: 'next.js',
        description: 'The React Framework',
        homepage: 'https://nextjs.org',
        html_url: 'https://github.com/vercel/next.js',
        stargazers_count: 130000,
        forks_count: 27000,
        license: { spdx_id: 'MIT' },
        language: 'JavaScript',
        topics: ['react', 'nextjs'],
        owner: { login: 'vercel' },
        pushed_at: '2026-11-26T00:00:00Z',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };
  const meta = await fetchGitHubRepoMetadata('vercel/next.js', { fetchImpl: fallbackFetch });
  assert.equal(meta.fullName, 'vercel/next.js');
  assert.equal(meta.stars, 130000);

  // 2. Structured backend 404 should not trigger redundant fallback
  let fallbackCalled = 0;
  const notFoundFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (url.includes('/api/github/repo')) {
      return new Response(JSON.stringify({ error: 'GitHub repository "foo/bar" was not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    fallbackCalled += 1;
    return new Response('{}', { status: 404 });
  };
  await assert.rejects(
    () => fetchGitHubRepoMetadata('foo/bar', { fetchImpl: notFoundFetch }),
    (err: unknown) => err instanceof GitHubApiClientError && err.status === 404
  );
  assert.equal(fallbackCalled, 0);
});

test('fetchGitHubMilestones falls back to direct releases and commits on HTML response', async () => {
  const mockFetch: typeof fetch = async (input) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (url.includes('/api/github/milestones')) {
      return new Response('<!doctype html><html></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      });
    }
    if (url.endsWith('/releases?per_page=8')) {
      return new Response(
        JSON.stringify([
          {
            id: 11,
            tag_name: 'v1.2.0',
            name: 'Release 1.2.0',
            body: 'Added new MCP tools',
            html_url: 'https://github.com/acme/tool/releases/tag/v1.2.0',
            published_at: '2026-11-20T12:00:00Z',
            prerelease: false,
            draft: false,
            author: { login: 'alice' },
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (url.endsWith('/commits?per_page=10')) {
      return new Response(
        JSON.stringify([
          {
            sha: 'abcdef1234567890',
            html_url: 'https://github.com/acme/tool/commit/abcdef1234567890',
            author: { login: 'bob' },
            commit: {
              message: 'fix: handle edge case\n\nmore details',
              author: { name: 'Bob', date: '2026-11-25T10:00:00Z' },
            },
          },
        ]),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    throw new Error(`Unexpected URL: ${url}`);
  };

  const payload = await fetchGitHubMilestones('acme/tool', { fetchImpl: mockFetch });
  assert.equal(payload.repo, 'acme/tool');
  assert.equal(payload.releases.length, 1);
  assert.equal(payload.releases[0]?.tagName, 'v1.2.0');
  assert.equal(payload.commits.length, 1);
  assert.equal(payload.commits[0]?.shortSha, 'abcdef1');
});

test('translateRepoDescriptionsSafely handles HTML response gracefully without throwing', async () => {
  const mockFetch: typeof fetch = async () =>
    new Response('<!doctype html><html><body>404 SPA</body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  const outcome = await translateRepoDescriptionsSafely({
    targetLanguage: 'ko',
    items: [{ id: 1, text: 'Fast AI coding assistant' }],
    fetchImpl: mockFetch,
  });

  assert.equal(outcome.ok, false);
  assert.equal(outcome.errorCode, 'BACKEND_UNAVAILABLE');
  assert.deepEqual(outcome.translations, {});
});

test('fetchTopStarredRepos throws clean DATA_UNAVAILABLE error when APIs return 404 or 503 HTML maintenance pages', async () => {
  const html404Fetch: typeof fetch = async () =>
    new Response('<!doctype html><html><head><title>404 Not Found</title></head><body><h1>404</h1></body></html>', {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });

  await assert.rejects(
    () => fetchTopStarredRepos('all', { fetchImpl: html404Fetch }),
    (err: unknown) =>
      err instanceof GitHubApiClientError &&
      err.errorCode === 'DATA_UNAVAILABLE' &&
      err.message === 'Data unavailable' &&
      err.status === 404
  );

  // Also test HTTP 200 maintenance HTML page (e.g. proxy/captive portal/maintenance page returning 200 text/html)
  const html200MaintenanceFetch: typeof fetch = async () =>
    new Response('<html><body><h1>Service under maintenance</h1></body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  await assert.rejects(
    () => fetchTopStarredRepos('python', { fetchImpl: html200MaintenanceFetch }),
    (err: unknown) =>
      err instanceof GitHubApiClientError &&
      err.errorCode === 'DATA_UNAVAILABLE' &&
      err.message === 'Data unavailable'
  );
});

test('fetchAiTrendingRepos throws clean DATA_UNAVAILABLE error when direct API returns 200 HTML maintenance page', async () => {
  const htmlMaintenanceFetch: typeof fetch = async () =>
    new Response('<!doctype html><html><body>Maintenance</body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });

  await assert.rejects(
    () => fetchAiTrendingRepos({ fetchImpl: htmlMaintenanceFetch }),
    (err: unknown) =>
      err instanceof GitHubApiClientError &&
      err.errorCode === 'DATA_UNAVAILABLE' &&
      err.message === 'Data unavailable'
  );
});
