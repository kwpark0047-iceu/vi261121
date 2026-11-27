import type {
  AppLanguage,
  CatalogProject,
  ContentType,
  ProjectCategory,
} from '../types/vibeatlas';
import { PROJECT_CATEGORY_LABELS } from '../data/i18n';
import { computeRelevanceScore, normalizeQueryText, tokenizeBilingualQuery } from './catalogEngine';
import {
  CANONICAL_PROJECT_CATEGORIES,
  CATEGORY_TAG_ALIASES,
  matchesSingleCategoryOrTag,
  resolveCanonicalCategoryTag,
} from './projectTags';

export interface NavProjectSuggestion {
  kind: 'project';
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  contentType: ContentType;
  githubStars: number;
  hasSyncedStars: boolean;
  score: number;
}

export interface NavTagSuggestion {
  kind: 'tag';
  tag: string;
  displayLabel: string;
  count: number;
  isCanonical: boolean;
  score: number;
}

export type NavSearchSuggestionItem = NavProjectSuggestion | NavTagSuggestion;

export interface NavSearchSuggestionsResult {
  query: string;
  projects: NavProjectSuggestion[];
  tags: NavTagSuggestion[];
  flatItems: NavSearchSuggestionItem[];
}

interface TagCandidate {
  tag: string;
  displayLabel: string;
  count: number;
  isCanonical: boolean;
  searchableTerms: string[];
}

function collectTagCandidates(
  allProjects: ReadonlyArray<CatalogProject>,
  language: AppLanguage
): TagCandidate[] {
  const candidates: TagCandidate[] = [];
  const seenLower = new Set<string>();

  for (const canonical of CANONICAL_PROJECT_CATEGORIES) {
    const count = allProjects.filter((p) => matchesSingleCategoryOrTag(p, canonical)).length;
    if (count <= 0) continue;

    const terms = new Set<string>([
      canonical.toLowerCase(),
      PROJECT_CATEGORY_LABELS.en[canonical].toLowerCase(),
      PROJECT_CATEGORY_LABELS.ko[canonical].toLowerCase(),
      PROJECT_CATEGORY_LABELS.zh[canonical].toLowerCase(),
      PROJECT_CATEGORY_LABELS.ja[canonical].toLowerCase(),
      ...CATEGORY_TAG_ALIASES[canonical].tags.map((t) => t.toLowerCase()),
    ]);

    candidates.push({
      tag: canonical,
      displayLabel: PROJECT_CATEGORY_LABELS[language][canonical] || canonical,
      count,
      isCanonical: true,
      searchableTerms: Array.from(terms),
    });
    seenLower.add(canonical.toLowerCase());
  }

  const customMap = new Map<string, { label: string; count: number }>();
  for (const project of allProjects) {
    for (const raw of project.categories) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      if (resolveCanonicalCategoryTag(trimmed)) continue;
      const key = trimmed.toLowerCase();
      if (seenLower.has(key)) continue;
      const prev = customMap.get(key);
      if (prev) {
        prev.count += 1;
      } else {
        customMap.set(key, { label: trimmed, count: 1 });
      }
    }
  }

  for (const { label, count } of customMap.values()) {
    candidates.push({
      tag: label,
      displayLabel: label,
      count,
      isCanonical: false,
      searchableTerms: [label.toLowerCase()],
    });
  }

  return candidates;
}

function scoreTagCandidate(
  candidate: TagCandidate,
  normalizedQuery: string,
  expandedTokens: ReadonlyArray<string>
): number {
  let best = 0;

  for (const term of candidate.searchableTerms) {
    if (term === normalizedQuery) {
      best = Math.max(best, 140);
    } else if (term.startsWith(normalizedQuery)) {
      best = Math.max(best, 105);
    } else if (term.includes(normalizedQuery)) {
      best = Math.max(best, 72);
    }
  }

  if (expandedTokens.length > 0) {
    let tokenMatches = 0;
    for (const token of expandedTokens) {
      if (candidate.searchableTerms.some((term) => term === token)) {
        tokenMatches += 2;
      } else if (candidate.searchableTerms.some((term) => term.includes(token))) {
        tokenMatches += 1;
      }
    }
    if (tokenMatches > 0) {
      best = Math.max(best, 38 + tokenMatches * 14);
    }
  }

  if (best === 0) return 0;
  if (candidate.isCanonical) best += 8;
  return best;
}

export function buildNavSearchSuggestions(
  rawQuery: string,
  allProjects: ReadonlyArray<CatalogProject>,
  language: AppLanguage,
  options?: { maxProjects?: number; maxTags?: number }
): NavSearchSuggestionsResult {
  const trimmed = rawQuery.trim();
  if (!trimmed) {
    return {
      query: '',
      projects: [],
      tags: [],
      flatItems: [],
    };
  }

  const maxProjects = Math.max(1, options?.maxProjects ?? 5);
  const maxTags = Math.max(1, options?.maxTags ?? 4);
  const normalized = normalizeQueryText(trimmed);
  const expandedTokens = tokenizeBilingualQuery(trimmed);

  const projects: NavProjectSuggestion[] = allProjects
    .map((project) => ({
      project,
      score: computeRelevanceScore(project, trimmed),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const verifiedDiff =
        (b.project.verificationStatus === 'verified' ? 1 : 0) -
        (a.project.verificationStatus === 'verified' ? 1 : 0);
      if (verifiedDiff !== 0) return verifiedDiff;
      return (
        b.project.bookmarksCount +
        b.project.likesCount -
        (a.project.bookmarksCount + a.project.likesCount)
      );
    })
    .slice(0, maxProjects)
    .map(({ project, score }) => ({
      kind: 'project',
      id: project.id,
      slug: project.slug,
      name: project.name,
      subtitle:
        language === 'ko' && project.taglineKo ? project.taglineKo : project.tagline,
      contentType: project.contentType,
      githubStars: project.githubStars,
      hasSyncedStars: Boolean(project.githubRepo && project.lastSyncedAt),
      score,
    }));

  const tagCandidates = collectTagCandidates(allProjects, language);
  const tags: NavTagSuggestion[] = tagCandidates
    .map((candidate) => ({
      candidate,
      score: scoreTagCandidate(candidate, normalized, expandedTokens),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.candidate.count !== a.candidate.count) return b.candidate.count - a.candidate.count;
      return a.candidate.displayLabel.localeCompare(b.candidate.displayLabel);
    })
    .slice(0, maxTags)
    .map(({ candidate, score }) => ({
      kind: 'tag',
      tag: candidate.tag,
      displayLabel: candidate.displayLabel,
      count: candidate.count,
      isCanonical: candidate.isCanonical,
      score,
    }));

  return {
    query: trimmed,
    projects,
    tags,
    flatItems: [...projects, ...tags],
  };
}

export function resolveTagSelectionLabel(tag: string, language: AppLanguage): string {
  const canonical = resolveCanonicalCategoryTag(tag);
  if (canonical) {
    return PROJECT_CATEGORY_LABELS[language][canonical as ProjectCategory] || canonical;
  }
  return tag;
}
