import { useState } from 'react';
import { AlertTriangle, Check, Copy, ExternalLink, X } from 'lucide-react';
import { UI_STRINGS } from '../data/i18n';
import type { ParsedAuthError } from '../lib/authErrors';
import type { AppLanguage } from '../types/vibeatlas';

interface AuthErrorBannerProps {
  language: AppLanguage;
  authError: ParsedAuthError;
  canUseRedirectFallback: boolean;
  onRetryRedirect: () => void;
  onDismiss: () => void;
}

export function AuthErrorBanner({
  language,
  authError,
  canUseRedirectFallback,
  onRetryRedirect,
  onDismiss,
}: AuthErrorBannerProps) {
  const [copiedDomain, setCopiedDomain] = useState(false);
  const copy = UI_STRINGS[language].workspace;

  const handleCopyHostname = async () => {
    try {
      await navigator.clipboard.writeText(authError.hostname);
      setCopiedDomain(true);
      window.setTimeout(() => setCopiedDomain(false), 2000);
    } catch {
      // Fallback ignored if clipboard permission denied
    }
  };

  if (authError.isUnauthorizedDomain) {
    return (
      <div className="mx-auto mt-3 max-w-7xl px-4 sm:px-6">
        <div
          role="alert"
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-950 shadow-sm dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-100"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-amber-950 dark:text-amber-50">
                    {copy.authUnauthorizedTitle}
                  </p>
                  <p className="mt-1 leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                    {copy.authUnauthorizedBody}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded-md border border-amber-300 bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-900 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-100">
                    {authError.hostname}
                  </code>
                  <button
                    type="button"
                    onClick={() => void handleCopyHostname()}
                    className="inline-flex items-center gap-1 rounded-md border border-amber-300 bg-white px-2.5 py-1 text-[11px] font-medium text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-100 dark:hover:bg-amber-900/50"
                  >
                    {copiedDomain ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{copy.authUnauthorizedCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>{copy.authUnauthorizedCopyDomain}</span>
                      </>
                    )}
                  </button>
                  <a
                    href={authError.consoleAuthorizedDomainsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-amber-900 px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-amber-800 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400"
                  >
                    <span>{copy.authUnauthorizedOpenConsole}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <p className="font-mono text-[11px] text-amber-800 dark:text-amber-300">
                  {copy.authUnauthorizedSteps}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onDismiss}
              aria-label={copy.authErrorClose}
              className="rounded-md p-1 text-amber-800 transition-colors hover:bg-amber-200/70 dark:text-amber-200 dark:hover:bg-amber-900/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const title = authError.isPopupBlocked
    ? copy.authPopupBlockedTitle
    : authError.isUserCancelled
      ? copy.authCancelledNotice
      : authError.isNetworkError
        ? copy.authNetworkErrorBody
        : copy.authGenericErrorTitle;

  const detail = authError.isPopupBlocked
    ? copy.authPopupBlockedBody
    : authError.isUserCancelled || authError.isNetworkError
      ? null
      : authError.rawMessage;

  return (
    <div className="mx-auto mt-3 max-w-7xl px-4 sm:px-6">
      <div
        role="alert"
        className="flex items-start justify-between gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200"
      >
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-700 dark:text-rose-400" />
          <div className="space-y-1.5">
            <p className="font-medium">{title}</p>
            {detail && <p className="text-[11px] opacity-90">{detail}</p>}
            {authError.isPopupBlocked && canUseRedirectFallback && (
              <button
                type="button"
                onClick={onRetryRedirect}
                className="inline-flex items-center rounded-md border border-rose-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-rose-900 transition-colors hover:bg-rose-100 dark:border-rose-700 dark:bg-slate-900 dark:text-rose-100 dark:hover:bg-rose-900/40"
              >
                {copy.authPopupRedirectButton}
              </button>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={copy.authErrorClose}
          className="rounded-md p-1 text-rose-700 transition-colors hover:bg-rose-200/70 dark:text-rose-300 dark:hover:bg-rose-900/60"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
