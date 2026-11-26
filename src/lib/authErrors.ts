export interface FirebaseWebConfig {
  projectId: string;
  appId: string;
  apiKey: string;
  authDomain: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  measurementId?: string;
  oAuthClientId?: string;
  recaptchaSiteKey?: string;
}

export interface FirebaseEnvOverrides {
  VITE_FIREBASE_API_KEY?: string;
  VITE_FIREBASE_AUTH_DOMAIN?: string;
  VITE_FIREBASE_PROJECT_ID?: string;
  VITE_FIREBASE_APP_ID?: string;
  VITE_FIREBASE_STORAGE_BUCKET?: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
  VITE_FIREBASE_DATABASE_ID?: string;
}

export interface ParsedAuthError {
  code: string;
  rawMessage: string;
  isUnauthorizedDomain: boolean;
  isPopupBlocked: boolean;
  isUserCancelled: boolean;
  isNetworkError: boolean;
  hostname: string;
  projectId: string;
  consoleAuthorizedDomainsUrl: string;
}

function pickOverride(override: string | undefined, fallback: string): string {
  const trimmed = typeof override === 'string' ? override.trim() : '';
  return trimmed || fallback;
}

export function resolveFirebaseConfig(
  baseConfig: FirebaseWebConfig,
  env: FirebaseEnvOverrides = {}
): FirebaseWebConfig {
  const projectId = pickOverride(env.VITE_FIREBASE_PROJECT_ID, baseConfig.projectId);
  const defaultAuthDomain = projectId ? `${projectId}.firebaseapp.com` : baseConfig.authDomain;
  const authDomain = pickOverride(
    env.VITE_FIREBASE_AUTH_DOMAIN,
    baseConfig.authDomain || defaultAuthDomain
  );

  return {
    ...baseConfig,
    projectId,
    authDomain,
    apiKey: pickOverride(env.VITE_FIREBASE_API_KEY, baseConfig.apiKey),
    appId: pickOverride(env.VITE_FIREBASE_APP_ID, baseConfig.appId),
    storageBucket: pickOverride(env.VITE_FIREBASE_STORAGE_BUCKET, baseConfig.storageBucket ?? ''),
    messagingSenderId: pickOverride(
      env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      baseConfig.messagingSenderId ?? ''
    ),
    firestoreDatabaseId: pickOverride(
      env.VITE_FIREBASE_DATABASE_ID,
      baseConfig.firestoreDatabaseId ?? ''
    ),
  };
}

export function extractFirebaseAuthCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code;
    if (typeof code === 'string' && code.trim()) {
      return code.trim();
    }
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : '';

  const match = message.match(/\((auth\/[a-z0-9-]+)\)/i) || message.match(/\b(auth\/[a-z0-9-]+)\b/i);
  if (match && match[1]) {
    return match[1].toLowerCase();
  }

  return 'unknown';
}

export function buildAuthorizedDomainsConsoleUrl(projectId: string): string {
  const cleanId = projectId.trim();
  if (!cleanId) {
    return 'https://console.firebase.google.com/';
  }
  return `https://console.firebase.google.com/project/${encodeURIComponent(cleanId)}/authentication/settings`;
}

export function normalizeAuthHostname(rawHostname?: string): string {
  const trimmed = (rawHostname ?? '').trim().toLowerCase();
  if (!trimmed) return 'localhost';
  return trimmed.replace(/:\d+$/, '');
}

export function parseAuthError(
  error: unknown,
  options: { hostname?: string; projectId?: string } = {}
): ParsedAuthError {
  const code = extractFirebaseAuthCode(error);
  const rawMessage =
    error instanceof Error
      ? error.message
      : typeof error === 'string' && error.trim()
        ? error.trim()
        : 'Google Sign-In failed';
  const projectId = (options.projectId ?? '').trim();
  const runtimeHost =
    options.hostname ??
    (typeof window !== 'undefined' && window.location ? window.location.hostname : '');
  const hostname = normalizeAuthHostname(runtimeHost);

  return {
    code,
    rawMessage,
    isUnauthorizedDomain: code === 'auth/unauthorized-domain',
    isPopupBlocked: code === 'auth/popup-blocked',
    isUserCancelled:
      code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request',
    isNetworkError: code === 'auth/network-request-failed',
    hostname,
    projectId,
    consoleAuthorizedDomainsUrl: buildAuthorizedDomainsConsoleUrl(projectId),
  };
}

export function canAttemptRedirectFallback(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.self === window.top;
  } catch {
    return false;
  }
}
