import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAuthorizedDomainsConsoleUrl,
  extractFirebaseAuthCode,
  normalizeAuthHostname,
  parseAuthError,
  resolveFirebaseConfig,
  type FirebaseWebConfig,
} from './authErrors';

const BASE_CONFIG: FirebaseWebConfig = {
  projectId: 'gen-lang-client-0577669884',
  appId: '1:626928960962:web:090b8dd238dc395c91c25b',
  apiKey: 'AIzaTestKey',
  authDomain: 'gen-lang-client-0577669884.firebaseapp.com',
  firestoreDatabaseId: 'ai-studio-db',
  storageBucket: 'gen-lang-client-0577669884.firebasestorage.app',
  messagingSenderId: '626928960962',
};

test('resolveFirebaseConfig preserves base config when env overrides are absent', () => {
  const resolved = resolveFirebaseConfig(BASE_CONFIG, {});
  assert.equal(resolved.projectId, 'gen-lang-client-0577669884');
  assert.equal(resolved.authDomain, 'gen-lang-client-0577669884.firebaseapp.com');
  assert.equal(resolved.firestoreDatabaseId, 'ai-studio-db');
});

test('resolveFirebaseConfig applies trimmed VITE_FIREBASE overrides cleanly', () => {
  const resolved = resolveFirebaseConfig(BASE_CONFIG, {
    VITE_FIREBASE_PROJECT_ID: ' custom-prod-id ',
    VITE_FIREBASE_AUTH_DOMAIN: 'custom-prod-id.firebaseapp.com',
    VITE_FIREBASE_API_KEY: 'AIzaProdKey',
  });
  assert.equal(resolved.projectId, 'custom-prod-id');
  assert.equal(resolved.authDomain, 'custom-prod-id.firebaseapp.com');
  assert.equal(resolved.apiKey, 'AIzaProdKey');
  assert.equal(resolved.appId, BASE_CONFIG.appId);
});

test('extractFirebaseAuthCode reads code property or raw Firebase error string', () => {
  assert.equal(
    extractFirebaseAuthCode({ code: 'auth/unauthorized-domain', message: 'Firebase error' }),
    'auth/unauthorized-domain'
  );
  assert.equal(
    extractFirebaseAuthCode(new Error('Firebase: Error (auth/unauthorized-domain).')),
    'auth/unauthorized-domain'
  );
  assert.equal(
    extractFirebaseAuthCode('Firebase: Error (auth/popup-blocked).'),
    'auth/popup-blocked'
  );
  assert.equal(extractFirebaseAuthCode(new Error('Something unexpected')), 'unknown');
});

test('parseAuthError flags unauthorized-domain with exact host and Firebase Console URL', () => {
  const parsed = parseAuthError(new Error('Firebase: Error (auth/unauthorized-domain).'), {
    hostname: 'W-Vibe.Vercel.App:443',
    projectId: 'gen-lang-client-0577669884',
  });

  assert.equal(parsed.code, 'auth/unauthorized-domain');
  assert.equal(parsed.isUnauthorizedDomain, true);
  assert.equal(parsed.isPopupBlocked, false);
  assert.equal(parsed.hostname, 'w-vibe.vercel.app');
  assert.equal(
    parsed.consoleAuthorizedDomainsUrl,
    'https://console.firebase.google.com/project/gen-lang-client-0577669884/authentication/settings'
  );
});

test('parseAuthError handles GitHub Pages hostnames and popup/network errors', () => {
  const ghPages = parseAuthError(
    { code: 'auth/unauthorized-domain', message: 'Firebase: Error (auth/unauthorized-domain).' },
    { hostname: 'kwpark0047.github.io', projectId: 'gen-lang-client-0577669884' }
  );
  assert.equal(ghPages.isUnauthorizedDomain, true);
  assert.equal(ghPages.hostname, 'kwpark0047.github.io');

  const blocked = parseAuthError({ code: 'auth/popup-blocked', message: 'Popup blocked' });
  assert.equal(blocked.isPopupBlocked, true);
  assert.equal(blocked.isUnauthorizedDomain, false);

  const cancelled = parseAuthError({ code: 'auth/popup-closed-by-user', message: 'Closed' });
  assert.equal(cancelled.isUserCancelled, true);

  const network = parseAuthError({ code: 'auth/network-request-failed', message: 'Offline' });
  assert.equal(network.isNetworkError, true);
});

test('normalizeAuthHostname and console URL fallback safely on empty values', () => {
  assert.equal(normalizeAuthHostname(''), 'localhost');
  assert.equal(normalizeAuthHostname('MyApp.GitHub.IO'), 'myapp.github.io');
  assert.equal(buildAuthorizedDomainsConsoleUrl(''), 'https://console.firebase.google.com/');
});
