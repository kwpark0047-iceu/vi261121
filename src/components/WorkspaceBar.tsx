import { motion } from 'motion/react';
import {
  Bookmark,
  LogIn,
  LogOut,
  Moon,
  Sun,
  User as UserIcon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type { ActivePage, AppLanguage } from '../types/vibeatlas';
import { UI_STRINGS } from '../data/i18n';
import { playUiSound } from '../lib/soundEffects';

interface WorkspaceBarProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  user: User | null;
  authLoading: boolean;
  bookmarkCount: number;
  onSignIn: () => void;
  onSignOut: () => void;
  onNavigate: (page: ActivePage) => void;
}

export function WorkspaceBar({
  language,
  onLanguageChange,
  darkMode,
  onToggleDarkMode,
  soundEnabled,
  onToggleSound,
  user,
  authLoading,
  bookmarkCount,
  onSignIn,
  onSignOut,
  onNavigate,
}: WorkspaceBarProps) {
  const copy = UI_STRINGS[language].workspace;

  return (
    <div className="border-b border-slate-200/80 bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5 px-4 py-2 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950"
          >
            {(
              [
                { code: 'ko', label: '한국어' },
                { code: 'en', label: 'EN' },
                { code: 'zh', label: '中文' },
                { code: 'ja', label: '日本語' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.code}
                type="button"
                aria-pressed={language === opt.code}
                onClick={() => {
                  playUiSound('tap');
                  onLanguageChange(opt.code);
                }}
                className={`shrink-0 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  language === opt.code
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              playUiSound('tap');
              onToggleDarkMode();
            }}
            aria-label={darkMode ? copy.lightMode : copy.darkMode}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-amber-100/90 text-amber-700 dark:bg-indigo-950 dark:text-indigo-300">
              {darkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
            </span>
            <span>{darkMode ? copy.lightMode : copy.darkMode}</span>
          </motion.button>

          <motion.button
            type="button"
            data-testid="sound-toggle-btn"
            aria-pressed={soundEnabled}
            aria-label={soundEnabled ? copy.soundOn : copy.soundOff}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSound}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border px-2.5 py-1.5 text-xs font-medium shadow-2xs transition-colors ${
              soundEnabled
                ? 'border-emerald-200/90 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/70'
                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <span
              className={`inline-flex h-5 w-5 items-center justify-center rounded-lg ${
                soundEnabled
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/80 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
            </span>
            <span>{soundEnabled ? copy.soundOn : copy.soundOff}</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              playUiSound('tap');
              onNavigate('maker');
            }}
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-lg bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
              <Bookmark className="h-3 w-3" />
            </span>
            <span>{copy.savedBookmarks}</span>
            <span className="tabular-nums font-mono text-slate-500 dark:text-slate-400">
              ({bookmarkCount})
            </span>
          </motion.button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playUiSound('tap');
                  onNavigate('maker');
                }}
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-2xs hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <UserIcon className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
                <span className="max-w-[140px] truncate">
                  {user.displayName || user.email || copy.makerAccount}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playUiSound('close');
                  onSignOut();
                }}
                aria-label={copy.signOut}
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{copy.signOut}</span>
              </button>
            </div>
          ) : (
            <motion.button
              type="button"
              disabled={authLoading}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                playUiSound('tap');
                onSignIn();
              }}
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-2xs transition-colors hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <LogIn className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400" />
              <span>{copy.signInGoogle}</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
