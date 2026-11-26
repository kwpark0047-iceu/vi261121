import type { ContentType } from '../types/vibeatlas';

export type PastelTone = 'sky' | 'lavender' | 'mint' | 'peach' | 'rose' | 'butter' | 'aqua';

export type PastelIconRole =
  | 'brand'
  | 'promo'
  | 'activity'
  | 'trending'
  | 'mcp'
  | 'stacks'
  | 'makers'
  | 'submit'
  | 'newsletter'
  | 'discover'
  | 'stars'
  | 'edit';

export interface PastelTokenStyle {
  tone: PastelTone;
  containerClass: string;
  iconClass: string;
  surfaceGradientClass: string;
  ringClass: string;
}

export const PASTEL_TONE_STYLES: Record<PastelTone, PastelTokenStyle> = {
  sky: {
    tone: 'sky',
    containerClass:
      'bg-sky-100/90 text-sky-700 ring-1 ring-inset ring-sky-200/80 dark:bg-sky-950/70 dark:text-sky-300 dark:ring-sky-800/70',
    iconClass: 'text-sky-600 dark:text-sky-300',
    surfaceGradientClass:
      'from-sky-50 via-blue-50/70 to-indigo-50/80 dark:from-sky-950/60 dark:via-slate-900 dark:to-indigo-950/50',
    ringClass: 'ring-sky-200/70 dark:ring-sky-800/60',
  },
  lavender: {
    tone: 'lavender',
    containerClass:
      'bg-violet-100/90 text-violet-700 ring-1 ring-inset ring-violet-200/80 dark:bg-violet-950/70 dark:text-violet-300 dark:ring-violet-800/70',
    iconClass: 'text-violet-600 dark:text-violet-300',
    surfaceGradientClass:
      'from-violet-50 via-fuchsia-50/50 to-sky-50/80 dark:from-violet-950/60 dark:via-slate-900 dark:to-slate-950',
    ringClass: 'ring-violet-200/70 dark:ring-violet-800/60',
  },
  mint: {
    tone: 'mint',
    containerClass:
      'bg-emerald-100/90 text-emerald-700 ring-1 ring-inset ring-emerald-200/80 dark:bg-emerald-950/70 dark:text-emerald-300 dark:ring-emerald-800/70',
    iconClass: 'text-emerald-600 dark:text-emerald-300',
    surfaceGradientClass:
      'from-emerald-50 via-teal-50/60 to-sky-50/70 dark:from-emerald-950/60 dark:via-slate-900 dark:to-teal-950/40',
    ringClass: 'ring-emerald-200/70 dark:ring-emerald-800/60',
  },
  peach: {
    tone: 'peach',
    containerClass:
      'bg-orange-100/90 text-orange-700 ring-1 ring-inset ring-orange-200/80 dark:bg-orange-950/70 dark:text-orange-300 dark:ring-orange-800/70',
    iconClass: 'text-orange-600 dark:text-orange-300',
    surfaceGradientClass:
      'from-orange-50 via-amber-50/60 to-rose-50/70 dark:from-orange-950/50 dark:via-slate-900 dark:to-amber-950/40',
    ringClass: 'ring-orange-200/70 dark:ring-orange-800/60',
  },
  rose: {
    tone: 'rose',
    containerClass:
      'bg-rose-100/90 text-rose-700 ring-1 ring-inset ring-rose-200/80 dark:bg-rose-950/70 dark:text-rose-300 dark:ring-rose-800/70',
    iconClass: 'text-rose-600 dark:text-rose-300',
    surfaceGradientClass:
      'from-rose-50 via-pink-50/60 to-orange-50/60 dark:from-rose-950/55 dark:via-slate-900 dark:to-slate-950',
    ringClass: 'ring-rose-200/70 dark:ring-rose-800/60',
  },
  butter: {
    tone: 'butter',
    containerClass:
      'bg-amber-100/90 text-amber-800 ring-1 ring-inset ring-amber-200/80 dark:bg-amber-950/70 dark:text-amber-300 dark:ring-amber-800/70',
    iconClass: 'text-amber-600 dark:text-amber-300',
    surfaceGradientClass:
      'from-amber-50 via-yellow-50/60 to-orange-50/60 dark:from-amber-950/50 dark:via-slate-900 dark:to-slate-950',
    ringClass: 'ring-amber-200/70 dark:ring-amber-800/60',
  },
  aqua: {
    tone: 'aqua',
    containerClass:
      'bg-cyan-100/90 text-cyan-700 ring-1 ring-inset ring-cyan-200/80 dark:bg-cyan-950/70 dark:text-cyan-300 dark:ring-cyan-800/70',
    iconClass: 'text-cyan-600 dark:text-cyan-300',
    surfaceGradientClass:
      'from-cyan-50 via-teal-50/60 to-sky-50/70 dark:from-cyan-950/55 dark:via-slate-900 dark:to-slate-950',
    ringClass: 'ring-cyan-200/70 dark:ring-cyan-800/60',
  },
};

const CONTENT_TYPE_TO_TONE: Record<ContentType, PastelTone> = {
  web_app: 'sky',
  ai_tool: 'lavender',
  mcp_server: 'mint',
  ai_skill: 'butter',
  ai_agent: 'peach',
  template: 'aqua',
  open_source: 'rose',
};

const ROLE_TO_TONE: Record<PastelIconRole, PastelTone> = {
  brand: 'sky',
  promo: 'lavender',
  activity: 'aqua',
  trending: 'mint',
  mcp: 'mint',
  stacks: 'peach',
  makers: 'rose',
  submit: 'sky',
  newsletter: 'butter',
  discover: 'lavender',
  stars: 'butter',
  edit: 'sky',
};

export function getContentTypePastelStyle(contentType: ContentType): PastelTokenStyle {
  return PASTEL_TONE_STYLES[CONTENT_TYPE_TO_TONE[contentType] ?? 'sky'];
}

export function getRolePastelStyle(role: PastelIconRole): PastelTokenStyle {
  return PASTEL_TONE_STYLES[ROLE_TO_TONE[role] ?? 'sky'];
}
