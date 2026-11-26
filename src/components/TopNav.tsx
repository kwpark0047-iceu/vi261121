import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu, Plus, X } from 'lucide-react';
import type { ActivePage, AppLanguage } from '../types/vibeatlas';
import { UI_STRINGS } from '../data/i18n';
import { playUiSound } from '../lib/soundEffects';
import { PastelCategoryIcon } from './PastelCategoryIcon';

interface TopNavProps {
  language: AppLanguage;
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export function TopNav({ language, activePage, onNavigate }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const copy = UI_STRINGS[language].nav;

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: copy.home },
    { id: 'discover', label: copy.discover },
    { id: 'stars', label: copy.githubStars },
    { id: 'maker', label: copy.makers },
  ];

  const isSubmitActive = activePage === 'submit';

  const handleNav = (page: ActivePage) => {
    playUiSound('tap');
    setMobileMenuOpen(false);
    onNavigate(page);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:gap-8 sm:px-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="font-display group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <PastelCategoryIcon role="brand" size="sm" />
          <span>VibeAtlas</span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 md:flex"
        >
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative shrink-0 whitespace-nowrap py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-blue-700 dark:text-sky-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="top-nav-indicator"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-sky-400 via-blue-600 to-violet-500 dark:from-sky-400 dark:to-violet-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
          <motion.button
            type="button"
            data-testid="topnav-submit-btn"
            aria-current={isSubmitActive ? 'page' : undefined}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            onClick={() => handleNav('submit')}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-colors sm:px-4 sm:text-sm ${
              isSubmitActive
                ? 'bg-blue-700 ring-2 ring-blue-300 ring-offset-2 ring-offset-white dark:bg-blue-500 dark:ring-sky-400/70 dark:ring-offset-slate-950'
                : 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-700 dark:bg-blue-600 dark:shadow-blue-500/15 dark:hover:bg-blue-500'
            }`}
          >
            <Plus className="h-4 w-4 stroke-[2.5]" aria-hidden="true" />
            <span>{copy.submit}</span>
          </motion.button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => {
              playUiSound('tap');
              setMobileMenuOpen((prev) => !prev);
            }}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.16 }}
            className="overflow-hidden border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                    activePage === item.id
                      ? 'bg-sky-50 text-blue-700 dark:bg-sky-950/60 dark:text-sky-300'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
