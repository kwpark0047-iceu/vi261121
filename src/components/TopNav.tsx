import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Hash, Menu, Plus, Search, Star, X } from 'lucide-react';
import type { ActivePage, AppLanguage, CatalogProject } from '../types/vibeatlas';
import { CONTENT_TYPE_LABELS, UI_STRINGS } from '../data/i18n';
import { formatCompactCount } from '../lib/catalogEngine';
import {
  buildNavSearchSuggestions,
  type NavSearchSuggestionItem,
} from '../lib/navSearchSuggestions';
import { playUiSound } from '../lib/soundEffects';
import { PastelCategoryIcon } from './PastelCategoryIcon';

interface TopNavProps {
  language: AppLanguage;
  activePage: ActivePage;
  projects: ReadonlyArray<CatalogProject>;
  onNavigate: (page: ActivePage) => void;
  onSelectProject: (project: CatalogProject) => void;
  onSelectTag: (tag: string) => void;
  onSubmitSearch: (query: string) => void;
}

function renderHighlightedText(text: string, query: string) {
  const trimmed = query.trim();
  if (!trimmed) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = trimmed.toLowerCase();
  const matchIdx = lowerText.indexOf(lowerQuery);
  if (matchIdx < 0) return text;

  const before = text.slice(0, matchIdx);
  const match = text.slice(matchIdx, matchIdx + trimmed.length);
  const after = text.slice(matchIdx + trimmed.length);

  return (
    <>
      {before}
      <mark className="rounded-xs bg-sky-100 px-0.5 text-blue-800 dark:bg-sky-900/60 dark:text-sky-200">
        {match}
      </mark>
      {after}
    </>
  );
}

export function TopNav({
  language,
  activePage,
  projects,
  onNavigate,
  onSelectProject,
  onSelectTag,
  onSubmitSearch,
}: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeVariant, setActiveVariant] = useState<'desktop' | 'mobile'>('desktop');
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const mobileSearchWrapperRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const listboxId = useId();
  const copy = UI_STRINGS[language].nav;

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'home', label: copy.home },
    { id: 'discover', label: copy.discover },
    { id: 'stars', label: copy.githubStars },
    { id: 'maker', label: copy.makers },
  ];

  const isSubmitActive = activePage === 'submit';

  const suggestions = useMemo(
    () => buildNavSearchSuggestions(query, projects, language, { maxProjects: 5, maxTags: 4 }),
    [query, projects, language]
  );

  const showDropdown = focused && query.trim().length > 0;
  const totalSelectableCount = suggestions.flatItems.length + 1; // +1 for "Search all results"

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (!focused) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      const inDesktop = searchWrapperRef.current?.contains(target) ?? false;
      const inMobile = mobileSearchWrapperRef.current?.contains(target) ?? false;
      if (!inDesktop && !inMobile) {
        setFocused(false);
      }
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [focused]);

  useEffect(() => {
    if (mobileSearchOpen) {
      window.requestAnimationFrame(() => {
        mobileInputRef.current?.focus();
      });
    }
  }, [mobileSearchOpen]);

  const handleNav = (page: ActivePage) => {
    playUiSound('tap');
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setFocused(false);
    onNavigate(page);
  };

  const handlePickSuggestion = (item: NavSearchSuggestionItem) => {
    playUiSound('tap');
    setFocused(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    setActiveIndex(-1);

    if (item.kind === 'project') {
      const target = projects.find((p) => p.id === item.id || p.slug === item.slug);
      if (target) {
        setQuery(target.name);
        onSelectProject(target);
      }
      return;
    }

    setQuery('');
    onSelectTag(item.tag);
  };

  const handleTriggerFullSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    playUiSound('tap');
    setFocused(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
    onSubmitSearch(trimmed);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setFocused(false);
      setActiveIndex(-1);
      (e.currentTarget as HTMLInputElement).blur();
      return;
    }

    if (e.key === 'ArrowDown') {
      if (!query.trim()) return;
      e.preventDefault();
      setFocused(true);
      setActiveIndex((prev) => (prev + 1) % totalSelectableCount);
      return;
    }

    if (e.key === 'ArrowUp') {
      if (!query.trim()) return;
      e.preventDefault();
      setFocused(true);
      setActiveIndex((prev) => (prev <= 0 ? totalSelectableCount - 1 : prev - 1));
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.flatItems.length) {
        handlePickSuggestion(suggestions.flatItems[activeIndex]);
      } else {
        handleTriggerFullSearch();
      }
    }
  };

  const renderSuggestionsDropdown = (variant: 'desktop' | 'mobile') => {
    if (!showDropdown || activeVariant !== variant) return null;

    const projectOffset = 0;
    const tagOffset = suggestions.projects.length;
    const footerIndex = suggestions.flatItems.length;

    return (
      <div
        id={`${listboxId}-${variant}`}
        role="listbox"
        aria-label={copy.searchAriaLabel}
        data-testid={`topnav-search-dropdown-${variant}`}
        className={
          variant === 'desktop'
            ? 'absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-slate-900/5 lg:w-96 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10'
            : 'mt-2 max-h-[60vh] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-slate-900/5 dark:border-slate-700 dark:bg-slate-900 dark:ring-white/10'
        }
      >
        {suggestions.projects.length === 0 && suggestions.tags.length === 0 ? (
          <div
            data-testid="topnav-search-empty"
            className="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400"
          >
            {copy.searchNoResults}
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.projects.length > 0 && (
              <div data-testid="topnav-search-projects-group">
                <p className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {copy.searchProjectsHeading}
                </p>
                <div className="space-y-0.5">
                  {suggestions.projects.map((proj, idx) => {
                    const optionIdx = projectOffset + idx;
                    const isHighlighted = activeIndex === optionIdx;
                    return (
                      <button
                        key={proj.id}
                        type="button"
                        role="option"
                        id={`${listboxId}-${variant}-opt-${optionIdx}`}
                        aria-selected={isHighlighted}
                        data-testid="topnav-search-project-item"
                        onMouseEnter={() => setActiveIndex(optionIdx)}
                        onClick={() => handlePickSuggestion(proj)}
                        className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${
                          isHighlighted
                            ? 'bg-sky-50 text-slate-900 dark:bg-sky-950/60 dark:text-white'
                            : 'text-slate-800 hover:bg-slate-100/90 dark:text-slate-100 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <PastelCategoryIcon
                          contentType={proj.contentType}
                          size="xs"
                          animated={false}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs font-semibold">
                              {renderHighlightedText(proj.name, query)}
                            </span>
                            {proj.hasSyncedStars && (
                              <span className="inline-flex shrink-0 items-center gap-0.5 font-mono text-[11px] tabular-nums text-amber-600 dark:text-amber-400">
                                <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                                {formatCompactCount(proj.githubStars)}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {CONTENT_TYPE_LABELS[language][proj.contentType]} · {proj.subtitle}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {suggestions.tags.length > 0 && (
              <div
                data-testid="topnav-search-tags-group"
                className={
                  suggestions.projects.length > 0
                    ? 'border-t border-slate-100 pt-2 dark:border-slate-800'
                    : ''
                }
              >
                <p className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {copy.searchTagsHeading}
                </p>
                <div className="space-y-0.5">
                  {suggestions.tags.map((tagItem, idx) => {
                    const optionIdx = tagOffset + idx;
                    const isHighlighted = activeIndex === optionIdx;
                    return (
                      <button
                        key={tagItem.tag}
                        type="button"
                        role="option"
                        id={`${listboxId}-${variant}-opt-${optionIdx}`}
                        aria-selected={isHighlighted}
                        data-testid="topnav-search-tag-item"
                        onMouseEnter={() => setActiveIndex(optionIdx)}
                        onClick={() => handlePickSuggestion(tagItem)}
                        className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition-colors ${
                          isHighlighted
                            ? 'bg-sky-50 text-blue-800 dark:bg-sky-950/60 dark:text-sky-200'
                            : 'text-slate-700 hover:bg-slate-100/90 dark:text-slate-200 dark:hover:bg-slate-800/80'
                        }`}
                      >
                        <span className="inline-flex min-w-0 items-center gap-2">
                          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <Hash className="h-3.5 w-3.5" aria-hidden="true" />
                          </span>
                          <span className="truncate text-xs font-medium">
                            {renderHighlightedText(tagItem.displayLabel, query)}
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-[11px] tabular-nums text-slate-500 dark:text-slate-400">
                          {tagItem.count} {copy.searchTagCountSuffix}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-2 border-t border-slate-100 pt-1.5 dark:border-slate-800">
          <button
            type="button"
            role="option"
            id={`${listboxId}-${variant}-opt-${footerIndex}`}
            aria-selected={activeIndex === footerIndex}
            data-testid="topnav-search-submit-all"
            onMouseEnter={() => setActiveIndex(footerIndex)}
            onClick={handleTriggerFullSearch}
            className={`flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-xs font-medium transition-colors ${
              activeIndex === footerIndex
                ? 'bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-sky-200'
                : 'text-blue-700 hover:bg-slate-100 dark:text-sky-400 dark:hover:bg-slate-800'
            }`}
          >
            <span className="inline-flex items-center gap-1.5 truncate">
              <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{copy.searchActionSubmit}</span>
            </span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-5 sm:px-6">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNav('home');
          }}
          className="font-display group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          <PastelCategoryIcon role="brand" size="sm" />
          <span>W-Vibe</span>
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-4 lg:gap-6 md:flex"
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

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {/* Desktop Real-Time Search Combobox */}
          <div
            ref={searchWrapperRef}
            className="relative hidden md:block md:w-48 lg:w-64 xl:w-72"
            data-testid="topnav-search-container"
          >
            <div className="relative flex items-center">
              <Search
                className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500"
                aria-hidden="true"
              />
              <input
                ref={desktopInputRef}
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveVariant('desktop');
                  setFocused(true);
                }}
                onFocus={() => {
                  setActiveVariant('desktop');
                  setFocused(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={copy.searchPlaceholder}
                aria-label={copy.searchAriaLabel}
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={showDropdown && activeVariant === 'desktop'}
                aria-controls={
                  showDropdown && activeVariant === 'desktop' ? `${listboxId}-desktop` : undefined
                }
                aria-activedescendant={
                  showDropdown && activeVariant === 'desktop' && activeIndex >= 0
                    ? `${listboxId}-desktop-opt-${activeIndex}`
                    : undefined
                }
                data-testid="topnav-search-input"
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50/90 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:bg-slate-950"
              />
              {query.length > 0 && (
                <button
                  type="button"
                  aria-label={copy.searchClear}
                  data-testid="topnav-search-clear"
                  onClick={() => {
                    setQuery('');
                    setActiveIndex(-1);
                    desktopInputRef.current?.focus();
                  }}
                  className="absolute right-2 inline-flex h-5 w-5 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {renderSuggestionsDropdown('desktop')}
          </div>

          {/* Mobile Search Toggle */}
          <button
            type="button"
            aria-label={copy.searchToggle}
            aria-expanded={mobileSearchOpen}
            data-testid="topnav-mobile-search-btn"
            onClick={() => {
              playUiSound('tap');
              setMobileMenuOpen(false);
              setMobileSearchOpen((prev) => {
                const next = !prev;
                if (next) {
                  setActiveVariant('mobile');
                  setFocused(true);
                } else {
                  setFocused(false);
                }
                return next;
              });
            }}
            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors md:hidden ${
              mobileSearchOpen
                ? 'border-blue-400 bg-blue-50 text-blue-700 dark:border-sky-500 dark:bg-sky-950/60 dark:text-sky-300'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900'
            }`}
          >
            <Search className="h-4 w-4" />
          </button>

          <motion.button
            type="button"
            data-testid="topnav-submit-btn"
            aria-current={isSubmitActive ? 'page' : undefined}
            whileHover={{ y: -1, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 24 }}
            onClick={() => handleNav('submit')}
            className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors sm:px-4 sm:text-sm ${
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
              setMobileSearchOpen(false);
              setMobileMenuOpen((prev) => !prev);
            }}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Collapsible Mobile Search Drawer */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.16 }}
            className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <div ref={mobileSearchWrapperRef}>
              <div className="relative flex items-center">
                <Search
                  className="pointer-events-none absolute left-3 h-4 w-4 text-slate-400 dark:text-slate-500"
                  aria-hidden="true"
                />
                <input
                  ref={mobileInputRef}
                  type="text"
                  inputMode="search"
                  enterKeyHint="search"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveVariant('mobile');
                    setFocused(true);
                  }}
                  onFocus={() => {
                    setActiveVariant('mobile');
                    setFocused(true);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={copy.searchPlaceholder}
                  aria-label={copy.searchAriaLabel}
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={showDropdown && activeVariant === 'mobile'}
                  aria-controls={
                    showDropdown && activeVariant === 'mobile' ? `${listboxId}-mobile` : undefined
                  }
                  data-testid="topnav-mobile-search-input"
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-400 dark:focus:bg-slate-950"
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    aria-label={copy.searchClear}
                    onClick={() => {
                      setQuery('');
                      setActiveIndex(-1);
                      mobileInputRef.current?.focus();
                    }}
                    className="absolute right-2.5 inline-flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {renderSuggestionsDropdown('mobile')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
