import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  Bookmark,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Flag,
  GitFork,
  Heart,
  HelpCircle,
  Link2,
  Package,
  Pencil,
  RefreshCw,
  RotateCw,
  ShieldCheck,
  Smartphone,
  Star,
  X,
} from 'lucide-react';
import type { User } from 'firebase/auth';
import type {
  AppLanguage,
  CatalogProject,
  MobileDemoOrientation,
  OwnershipClaimRecord,
  ProjectActivityRecord,
  ProjectMilestoneRecord,
  ProjectReportRecord,
} from '../types/vibeatlas';
import {
  BACKEND_LABELS,
  CONTENT_TYPE_LABELS,
  HOSTING_LABELS,
  PLATFORM_LABELS,
  PRICING_LABELS,
  PROJECT_CATEGORY_LABELS,
  UI_STRINGS,
  VERIFICATION_LABELS,
} from '../data/i18n';
import {
  computeFreshnessState,
  detectMissingFields,
  formatCompactCount,
  getRelatedProjects,
} from '../lib/catalogEngine';
import { getProjectTags, resolveCanonicalCategoryTag } from '../lib/projectTags';
import { mergeAndSortCommunityActivities } from '../lib/communityActivity';
import {
  createProjectMilestoneInFirestore,
  deleteProjectMilestoneInFirestore,
  subscribeToProjectActivities,
  subscribeToProjectMilestones,
} from '../lib/firestoreRepo';
import { sanitizeExternalUrl, ownershipClaimSchema, reportSubmissionSchema } from '../lib/validation';
import { resolveMakerVerification } from '../lib/makerVerification';
import { canUserEditProject } from '../lib/projectEdit';
import {
  computeCatalogHighlightContext,
  resolveProjectHighlightBadges,
} from '../lib/projectHighlightBadges';
import { playUiSound } from '../lib/soundEffects';
import { buildProjectShareUrl, buildPromotionCopy } from '../lib/submissionPromotion';
import {
  extractMobileStoreLinks,
  getSmartphoneAspectSpec,
  hasMobileDemoSupport,
  resolveProjectDemoIframeUrl,
} from '../lib/mobileAppDemo';
import { MakerTrustPanel, MakerVerificationBadge } from './MakerVerificationBadge';
import { MobileDeviceDemoViewer } from './MobileDeviceDemoViewer';
import { PastelCategoryIcon } from './PastelCategoryIcon';
import { ProjectCommunityActivity } from './ProjectCommunityActivity';
import { ProjectGrowthChart } from './ProjectGrowthChart';
import { ProjectHighlightBadges } from './ProjectHighlightBadges';
import { ProjectInsightsDashboard } from './ProjectInsightsDashboard';
import { ProjectMilestoneTimeline } from './ProjectMilestoneTimeline';
import { ResilientProjectImage } from './ResilientProjectImage';
import { StarGrowthModalChart } from './StarGrowthModalChart';
import { VibeScoreGauge } from './VibeScoreGauge';
import { VibeVolatilityTrendChart } from './VibeVolatilityTrendChart';

interface ProjectDetailModalProps {
  project: CatalogProject | null;
  allProjects: CatalogProject[];
  language: AppLanguage;
  user: User | null;
  isLiked: boolean;
  isBookmarked: boolean;
  isSyncing: boolean;
  localActivities?: ReadonlyArray<ProjectActivityRecord>;
  userReports?: ReadonlyArray<ProjectReportRecord>;
  userClaims?: ReadonlyArray<OwnershipClaimRecord>;
  onClose: () => void;
  onSelectProject: (project: CatalogProject) => void;
  onToggleLike: (project: CatalogProject) => void;
  onToggleBookmark: (project: CatalogProject) => void;
  onSyncSingleGithub: (project: CatalogProject) => void;
  onSubmitReport: (
    project: CatalogProject,
    reason: ProjectReportRecord['reason'],
    details: string
  ) => Promise<void>;
  onSubmitClaim: (
    project: CatalogProject,
    method: OwnershipClaimRecord['verificationMethod'],
    proofNote: string
  ) => Promise<void>;
  onSignIn: () => void;
  onSelectTag?: (tag: string) => void;
  onEditProject?: (project: CatalogProject) => void;
  editSuccessMessage?: string | null;
  snapshotRevision?: number;
}

export function ProjectDetailModal({
  project,
  allProjects,
  language,
  user,
  isLiked,
  isBookmarked,
  isSyncing,
  localActivities = [],
  userReports = [],
  userClaims = [],
  onClose,
  onSelectProject,
  onToggleLike,
  onToggleBookmark,
  onSyncSingleGithub,
  onSubmitReport,
  onSubmitClaim,
  onSignIn,
  onSelectTag,
  onEditProject,
  editSuccessMessage = null,
  snapshotRevision = 0,
}: ProjectDetailModalProps) {
  const [activeActionForm, setActiveActionForm] = useState<'none' | 'report' | 'claim'>('none');
  const [reportReason, setReportReason] =
    useState<ProjectReportRecord['reason']>('stale_metadata');
  const [reportDetails, setReportDetails] = useState('');
  const [claimMethod, setClaimMethod] =
    useState<OwnershipClaimRecord['verificationMethod']>('github_repo');
  const [claimProof, setClaimProof] = useState('');
  const [formFeedback, setFormFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [firestoreActivities, setFirestoreActivities] = useState<ProjectActivityRecord[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [creatorMilestones, setCreatorMilestones] = useState<ProjectMilestoneRecord[]>([]);
  const [milestonesLoading, setMilestonesLoading] = useState(false);
  const [promoCopied, setPromoCopied] = useState<'none' | 'link' | 'pitch'>('none');
  const [mobileViewOpen, setMobileViewOpen] = useState(false);
  const [mobileViewOrientation, setMobileViewOrientation] =
    useState<MobileDemoOrientation>('portrait');
  const [mobileIframeLoaded, setMobileIframeLoaded] = useState(false);
  const [viewerMode, setViewerMode] = useState<'card' | 'iframe'>('card');

  useEffect(() => {
    if (promoCopied === 'none') return;
    const timer = window.setTimeout(() => setPromoCopied('none'), 2200);
    return () => window.clearTimeout(timer);
  }, [promoCopied]);

  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  useEffect(() => {
    setActiveActionForm('none');
    setFormFeedback(null);
    setFormError(null);
    setReportDetails('');
    setClaimProof('');
    setMobileViewOpen(false);
    setMobileViewOrientation('portrait');
    setMobileIframeLoaded(false);
    setViewerMode('card');
  }, [project?.id]);

  useEffect(() => {
    if (!project) {
      setFirestoreActivities([]);
      setActivityLoading(false);
      setActivityError(null);
      return;
    }
    setActivityLoading(true);
    setActivityError(null);
    const unsub = subscribeToProjectActivities(
      project.id,
      (list) => {
        setFirestoreActivities(list);
        setActivityLoading(false);
      },
      (err) => {
        setActivityError(err.message);
        setActivityLoading(false);
      }
    );
    return () => unsub();
  }, [project?.id]);

  useEffect(() => {
    if (!project) {
      setCreatorMilestones([]);
      setMilestonesLoading(false);
      return;
    }
    setMilestonesLoading(true);
    const unsub = subscribeToProjectMilestones(
      project.id,
      (list) => {
        setCreatorMilestones(list);
        setMilestonesLoading(false);
      },
      () => {
        setMilestonesLoading(false);
      }
    );
    return () => unsub();
  }, [project?.id]);

  const related = useMemo(() => {
    if (!project) return [];
    return getRelatedProjects(project, allProjects, 3);
  }, [project, allProjects]);

  const communityActivities = useMemo(() => {
    if (!project) return [];
    return mergeAndSortCommunityActivities({
      projectId: project.id,
      firestoreActivities,
      localActivities,
      userReports,
      currentUserLabel: user
        ? { uid: user.uid, name: user.displayName || 'W-Vibe Member', handle: '' }
        : null,
    });
  }, [project, firestoreActivities, localActivities, userReports, user]);

  const highlightContext = useMemo(
    () => computeCatalogHighlightContext(allProjects),
    [allProjects]
  );

  if (!project) return null;

  const copy = UI_STRINGS[language].detail;
  const cardCopy = UI_STRINGS[language].card;
  const mobileDemoCopy = UI_STRINGS[language].mobileDemo;
  const missing = detectMissingFields(project);
  const freshness = computeFreshnessState(project.lastSyncedAt);
  const safeDemo = sanitizeExternalUrl(project.liveDemoUrl);
  const demoIframeUrl = resolveProjectDemoIframeUrl(project);
  const safeWebsite = sanitizeExternalUrl(project.websiteUrl);
  const safeGithub = sanitizeExternalUrl(project.githubUrl);
  const showMobileDemoViewer = hasMobileDemoSupport(project);
  const mobileAspectSpec = getSmartphoneAspectSpec(mobileViewOrientation);
  const isMobileViewActive = showMobileDemoViewer ? viewerMode === 'iframe' : mobileViewOpen;
  const mobileStoreLinks = extractMobileStoreLinks(project).filter(
    (link) => link.url !== safeDemo
  );
  const fullDesc =
    language === 'ko' && project.descriptionKo ? project.descriptionKo : project.description;
  const tagline = language === 'ko' && project.taglineKo ? project.taglineKo : project.tagline;
  const makerVerification = resolveMakerVerification(project, userClaims, user?.uid ?? null);
  const editPermission = canUserEditProject(project, user);
  const highlightBadges = resolveProjectHighlightBadges(project, {
    context: highlightContext,
    activities: communityActivities,
    maxBadges: 3,
  });

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormFeedback(null);
    if (!user) {
      onSignIn();
      return;
    }
    const parsed = reportSubmissionSchema.safeParse({
      reason: reportReason,
      details: reportDetails,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || 'Invalid report details');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitReport(project, parsed.data.reason, parsed.data.details);
      setFormFeedback(copy.actionSubmitted);
      setReportDetails('');
      setActiveActionForm('none');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormFeedback(null);
    if (!user) {
      onSignIn();
      return;
    }
    const parsed = ownershipClaimSchema.safeParse({
      verificationMethod: claimMethod,
      proofNote: claimProof,
    });
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message || 'Invalid proof details');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmitClaim(project, parsed.data.verificationMethod, parsed.data.proofNote);
      setFormFeedback(copy.actionSubmitted);
      setClaimProof('');
      setActiveActionForm('none');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[2px] sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
      >
        {/* Top Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/95">
          <div className="flex min-w-0 items-center gap-3">
            <PastelCategoryIcon contentType={project.contentType} size="md" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{CONTENT_TYPE_LABELS[language][project.contentType]}</span>
                <span aria-hidden="true">·</span>
                <span>{project.makerName}</span>
                {project.makerHandle && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono">{project.makerHandle}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{VERIFICATION_LABELS[language][project.verificationStatus]}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2.5">
                <h2
                  id="detail-modal-title"
                  className="truncate text-xl font-bold text-slate-900 dark:text-white"
                >
                  {project.name}
                </h2>
                <MakerVerificationBadge
                  verification={makerVerification}
                  language={language}
                  variant="header"
                />
                <ProjectHighlightBadges
                  badges={highlightBadges}
                  language={language}
                  variant="detail"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label={copy.close}
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-8 p-6">
          {/* Concise Visual Preview + Description */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <ResilientProjectImage
                src={project.thumbnailUrl}
                alt={project.name}
                contentType={project.contentType}
                subtitle={CONTENT_TYPE_LABELS[language][project.contentType]}
                aspectClassName="aspect-[16/10]"
              />
            </div>
            <div className="md:col-span-7">
              <p className="text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
                {tagline}
              </p>
              <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {fullDesc}
              </p>

              {demoIframeUrl && (
                <div className="mt-4 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    data-testid="detail-mobile-view-toggle"
                    aria-pressed={isMobileViewActive}
                    onClick={() => {
                      playUiSound('tap');
                      if (showMobileDemoViewer) {
                        const nextMode = viewerMode === 'iframe' ? 'card' : 'iframe';
                        setViewerMode(nextMode);
                        if (nextMode === 'iframe') {
                          window.requestAnimationFrame(() => {
                            document
                              .querySelector('[data-testid="mobile-device-demo-viewer"]')
                              ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          });
                        }
                      } else {
                        setMobileIframeLoaded(false);
                        setMobileViewOpen((prev) => !prev);
                      }
                    }}
                    className={`inline-flex min-h-[38px] items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors ${
                      isMobileViewActive
                        ? 'border-cyan-600 bg-cyan-700 text-white hover:bg-cyan-800 dark:border-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-500'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{copy.mobileViewToggle}</span>
                  </button>

                  <a
                    href={demoIframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <span>{copy.liveDemo}</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Mobile View Smartphone Frame (for non-mobile-app projects with a Demo URL) */}
          {mobileViewOpen && !showMobileDemoViewer && demoIframeUrl && (
            <section
              data-testid="detail-mobile-view-panel"
              className="rounded-2xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/40 via-white to-slate-50 p-4 sm:p-5 dark:border-cyan-900/60 dark:from-slate-900 dark:via-slate-950 dark:to-cyan-950/20"
            >
              <div className="flex flex-col gap-3 border-b border-slate-200/80 pb-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
                <div className="flex min-w-0 items-start gap-2.5">
                  <PastelCategoryIcon contentType="mobile_app" size="sm" animated={false} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {copy.mobileViewTitle}
                      </h3>
                      <span className="font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-400">
                        {mobileAspectSpec.viewportWidth}×{mobileAspectSpec.viewportHeight} ·{' '}
                        {mobileAspectSpec.ratioLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {copy.mobileViewSubtitle}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 sm:flex-nowrap">
                  <button
                    type="button"
                    data-testid="detail-mobile-view-rotate"
                    aria-pressed={mobileViewOrientation === 'landscape'}
                    onClick={() => {
                      playUiSound('tap');
                      setMobileViewOrientation((prev) =>
                        prev === 'portrait' ? 'landscape' : 'portrait'
                      );
                    }}
                    className="inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {mobileViewOrientation === 'portrait'
                        ? mobileDemoCopy.orientationPortrait
                        : mobileDemoCopy.orientationLandscape}
                    </span>
                  </button>

                  <a
                    href={demoIframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center gap-1.5 whitespace-nowrap rounded-xl bg-slate-900 px-3 text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                  >
                    <span>{mobileDemoCopy.openExternalButton}</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>

                  <button
                    type="button"
                    aria-label={copy.mobileViewClose}
                    onClick={() => {
                      playUiSound('tap');
                      setMobileViewOpen(false);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <div
                  data-testid="detail-mobile-view-frame"
                  data-orientation={mobileViewOrientation}
                  className={`w-full rounded-[38px] border-[6px] border-slate-800 bg-slate-950 p-1.5 shadow-xl transition-all dark:border-slate-700 ${
                    mobileViewOrientation === 'portrait'
                      ? 'max-w-[276px] sm:max-w-[292px]'
                      : 'max-w-[540px]'
                  }`}
                >
                  <div
                    data-testid="detail-mobile-view-screen"
                    className={`relative flex w-full flex-col overflow-hidden rounded-[30px] bg-white dark:bg-slate-900 ${mobileAspectSpec.aspectClass}`}
                  >
                    {/* Smartphone Status Bar & Dynamic Island */}
                    <div className="relative flex shrink-0 items-center justify-between border-b border-slate-100 bg-white/95 px-5 pt-2.5 pb-1.5 text-[10px] font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
                      <span className="font-mono tabular-nums">9:41</span>
                      <span
                        aria-hidden="true"
                        className="h-3.5 w-20 rounded-full bg-slate-900 dark:bg-black"
                      />
                      <span className="font-mono text-[9px] text-slate-500 dark:text-slate-400">
                        {mobileAspectSpec.ratioLabel}
                      </span>
                    </div>

                    {!mobileIframeLoaded && (
                      <div className="flex items-center justify-between gap-2 border-b border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200">
                        <span className="truncate">{mobileDemoCopy.iframeFallbackNotice}</span>
                        <a
                          href={demoIframeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 font-semibold underline"
                        >
                          {mobileDemoCopy.openExternalButton}
                        </a>
                      </div>
                    )}

                    <iframe
                      data-testid="detail-mobile-view-iframe"
                      title={`${project.name} ${copy.mobileViewToggle}`}
                      src={demoIframeUrl}
                      sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                      onLoad={() => setMobileIframeLoaded(true)}
                      className="h-full w-full flex-1 border-0 bg-white"
                    />

                    {/* Smartphone Home Gesture Bar */}
                    <div className="flex shrink-0 justify-center bg-white py-1.5 dark:bg-slate-950">
                      <span
                        aria-hidden="true"
                        className="h-1 w-20 rounded-full bg-slate-300 dark:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Separated Metric Summary (Never Blended!) */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400">{cardCopy.githubStars}</p>
              <p
                className={`mt-1 inline-flex items-center gap-1.5 text-slate-900 dark:text-white ${
                  project.githubRepo && project.lastSyncedAt
                    ? 'font-mono text-lg font-bold tabular-nums'
                    : 'font-sans text-sm font-semibold'
                }`}
              >
                <Star className="h-4 w-4 text-amber-500" />
                {project.githubRepo
                  ? project.lastSyncedAt
                    ? formatCompactCount(project.githubStars)
                    : cardCopy.notSynced
                  : 'N/A'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400">GitHub Forks</p>
              <p
                className={`mt-1 inline-flex items-center gap-1.5 text-slate-900 dark:text-white ${
                  project.githubRepo && project.lastSyncedAt
                    ? 'font-mono text-lg font-bold tabular-nums'
                    : 'font-sans text-sm font-semibold'
                }`}
              >
                <GitFork className="h-4 w-4 text-slate-500" />
                {project.githubRepo
                  ? project.lastSyncedAt
                    ? formatCompactCount(project.githubForks)
                    : cardCopy.notSynced
                  : 'N/A'}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400">{cardCopy.internalLikes}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                <Heart className="h-4 w-4 text-rose-600" />
                {project.likesCount}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cardCopy.internalBookmarks}
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-lg font-bold tabular-nums text-slate-900 dark:text-white">
                <Bookmark className="h-4 w-4 text-blue-700 dark:text-blue-400" />
                {project.bookmarksCount}
              </p>
            </div>
          </div>

          {editSuccessMessage && (
            <div
              role="status"
              data-testid="detail-edit-success-banner"
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{editSuccessMessage}</span>
            </div>
          )}

          {/* Maker Verification & Ownership Trust Panel */}
          <MakerTrustPanel
            verification={makerVerification}
            language={language}
            claimFormOpen={activeActionForm === 'claim'}
            canEdit={editPermission.allowed && Boolean(onEditProject)}
            onRequestClaim={() =>
              setActiveActionForm((prev) => (prev === 'claim' ? 'none' : 'claim'))
            }
            onEditProject={onEditProject ? () => onEditProject(project) : undefined}
          />

          {activeActionForm === 'claim' && (
            <form
              data-testid="detail-claim-form"
              onSubmit={handleClaimSubmit}
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{copy.claimTitle}</h3>
              <select
                value={claimMethod}
                onChange={(e) =>
                  setClaimMethod(e.target.value as OwnershipClaimRecord['verificationMethod'])
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="github_repo">GitHub Repository Maintainer</option>
                <option value="domain_dns">Domain DNS TXT Verification</option>
                <option value="demo_meta">Live Demo Meta Tag</option>
              </select>
              <textarea
                rows={3}
                value={claimProof}
                onChange={(e) => setClaimProof(e.target.value)}
                placeholder="Provide your GitHub handle or verification DNS/URL note..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
              />
              <div className="flex items-center justify-between">
                {!user && <span className="text-xs text-slate-500">{copy.signInRequired}</span>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="ml-auto rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                >
                  {copy.submitClaim}
                </button>
              </div>
            </form>
          )}

          {/* Interactive Mobile Device Demo & QR Viewer */}
          {showMobileDemoViewer && (
            <MobileDeviceDemoViewer
              project={project}
              language={language}
              mode={viewerMode}
              onModeChange={setViewerMode}
            />
          )}

          {/* Recharts Star Growth Historical Snapshot Chart */}
          <StarGrowthModalChart
            project={project}
            language={language}
            isSyncing={isSyncing}
            snapshotRevision={snapshotRevision}
            onSyncSingleGithub={onSyncSingleGithub}
          />

          {/* Project Insights Dashboard (D3 7-Day Likes & Bookmarks Trend) */}
          <ProjectInsightsDashboard
            project={project}
            activities={communityActivities}
            language={language}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            onToggleLike={onToggleLike}
            onToggleBookmark={onToggleBookmark}
          />

          {/* D3 Community Vibe Score & Activity Health Gauge */}
          <VibeScoreGauge
            project={project}
            allProjects={allProjects}
            activities={communityActivities}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            language={language}
          />

          {/* D3 Vibe Score Volatility vs Repository Star Growth Rate Trend */}
          <VibeVolatilityTrendChart
            project={project}
            allProjects={allProjects}
            activities={communityActivities}
            isLiked={isLiked}
            isBookmarked={isBookmarked}
            isSyncing={isSyncing}
            onSyncSingleGithub={onSyncSingleGithub}
            language={language}
          />

          {/* Clearly Separated External Links vs Internal Actions */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {copy.externalLinksTitle}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {safeDemo && (
                  <a
                    href={safeDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800"
                  >
                    <span>{copy.liveDemo}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {safeWebsite && (
                  <a
                    href={safeWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <span>{copy.officialWebsite}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {safeGithub && (
                  <a
                    href={safeGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <span>{copy.githubRepository}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {mobileStoreLinks.map((item) => (
                  <a
                    key={`${item.kind}-${item.url}`}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50/70 px-3.5 py-2 text-xs font-semibold text-cyan-900 hover:bg-cyan-100/70 dark:border-cyan-900 dark:bg-cyan-950/40 dark:text-cyan-200 dark:hover:bg-cyan-950/70"
                  >
                    {item.kind === 'ios' && <Smartphone className="h-3.5 w-3.5" />}
                    {item.kind === 'android' && <Download className="h-3.5 w-3.5" />}
                    {item.kind === 'package' && <Package className="h-3.5 w-3.5" />}
                    <span>{item.providerBadge}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
                {!safeDemo && !safeWebsite && !safeGithub && mobileStoreLinks.length === 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">No verified URLs listed.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {copy.internalActionsTitle}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onToggleLike(project)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium ${
                    isLiked
                      ? 'border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{cardCopy.likeAction}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleBookmark(project)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium ${
                    isBookmarked
                      ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{cardCopy.bookmarkAction}</span>
                </button>

                {editPermission.allowed && onEditProject && (
                  <button
                    type="button"
                    data-testid="detail-edit-project-btn"
                    onClick={() => onEditProject(project)}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-200 dark:hover:bg-blue-900/50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>{copy.editProject}</span>
                  </button>
                )}

                {project.githubRepo && (
                  <button
                    type="button"
                    disabled={isSyncing}
                    onClick={() => onSyncSingleGithub(project)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? copy.syncing : copy.syncGithubNow}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    playUiSound('tap');
                    setActiveActionForm((prev) => (prev === 'claim' ? 'none' : 'claim'));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{copy.claimButton}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playUiSound('tap');
                    setActiveActionForm((prev) => (prev === 'report' ? 'none' : 'report'));
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span>{copy.reportButton}</span>
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {copy.sharePromoteTitle}:
                </span>
                <button
                  type="button"
                  data-testid="detail-copy-link-btn"
                  onClick={() => {
                    const url = buildProjectShareUrl(
                      typeof window !== 'undefined' ? window.location.href : 'https://vibeatlas.app',
                      project.slug
                    );
                    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                      void navigator.clipboard.writeText(url).catch(() => undefined);
                    }
                    playUiSound('sparkle');
                    setPromoCopied('link');
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {promoCopied === 'link' ? (
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Link2 className="h-3 w-3" />
                  )}
                  <span>
                    {promoCopied === 'link' ? copy.copiedFeedback : copy.copyDirectLink}
                  </span>
                </button>
                <button
                  type="button"
                  data-testid="detail-copy-pitch-btn"
                  onClick={() => {
                    const url = buildProjectShareUrl(
                      typeof window !== 'undefined' ? window.location.href : 'https://vibeatlas.app',
                      project.slug
                    );
                    const text = buildPromotionCopy(project, language, url, 'community');
                    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
                      void navigator.clipboard.writeText(text).catch(() => undefined);
                    }
                    playUiSound('sparkle');
                    setPromoCopied('pitch');
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {promoCopied === 'pitch' ? (
                    <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>
                    {promoCopied === 'pitch' ? copy.copiedFeedback : copy.copyPromoPitch}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {formFeedback && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              <span>{formFeedback}</span>
            </div>
          )}

          {formError && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
              {formError}
            </div>
          )}

          {/* Inline Report or Ownership Claim Form */}
          {activeActionForm === 'report' && (
            <form
              onSubmit={handleReportSubmit}
              className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{copy.reportTitle}</h3>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value as ProjectReportRecord['reason'])}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
              >
                <option value="broken_link">Broken link</option>
                <option value="stale_metadata">Stale metadata</option>
                <option value="misattribution">Wrong stack/creator attribution</option>
                <option value="spam">Spam</option>
                <option value="security_concern">Security concern</option>
              </select>
              <textarea
                rows={3}
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe the discrepancy (min 5 characters)..."
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
              />
              <div className="flex items-center justify-between">
                {!user && <span className="text-xs text-slate-500">{copy.signInRequired}</span>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                >
                  {copy.submitReport}
                </button>
              </div>
            </form>
          )}

          {/* Stack Attribution & Metadata Provenance */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {copy.techAndPlatformTitle}
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{copy.platformLabel}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {PLATFORM_LABELS[project.developmentPlatform]}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{copy.hostingLabel}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {HOSTING_LABELS[project.hostingProvider]}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{copy.backendLabel}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {BACKEND_LABELS[project.backendTech]}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{copy.licenseLabel}</dt>
                  <dd className="font-mono font-medium text-slate-900 dark:text-white">
                    {project.license}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{copy.pricingLabel}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {PRICING_LABELS[language][project.pricingModel]}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{copy.countryLangLabel}</dt>
                  <dd className="font-medium text-slate-900 dark:text-white">
                    {project.country} · {project.language}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                {project.techStack.join(' · ')}
              </p>
              {getProjectTags(project, 6).length > 0 && (
                <div
                  data-testid="detail-project-tags"
                  className="mt-2.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs"
                >
                  {getProjectTags(project, 6).map((tag, idx) => {
                    const canonical = resolveCanonicalCategoryTag(tag);
                    const displayLabel = canonical
                      ? PROJECT_CATEGORY_LABELS[language][canonical]
                      : tag;
                    return (
                      <span key={tag} className="inline-flex items-center gap-2.5">
                        {idx > 0 && (
                          <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">
                            ·
                          </span>
                        )}
                        {onSelectTag ? (
                          <button
                            type="button"
                            onClick={() => onSelectTag(tag)}
                            className="text-blue-700 hover:underline dark:text-blue-400"
                          >
                            #{displayLabel}
                          </button>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-300">#{displayLabel}</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {copy.provenanceTitle}
              </h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">
                    {copy.provenanceSourceLabel}
                  </dt>
                  <dd className="font-mono text-slate-900 dark:text-white">
                    {project.provenanceSource}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{copy.lastSyncedLabel}</dt>
                  <dd
                    className={`inline-flex items-center gap-1 text-slate-900 dark:text-white ${
                      project.lastSyncedAt ? 'font-mono tabular-nums' : 'font-sans'
                    }`}
                  >
                    {freshness === 'stale' && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                    {freshness === 'unknown' && <HelpCircle className="h-3.5 w-3.5 text-slate-400" />}
                    <span>
                      {project.lastSyncedAt
                        ? new Date(project.lastSyncedAt).toISOString().slice(0, 10)
                        : cardCopy.notSynced}
                    </span>
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt className="text-slate-500 dark:text-slate-400">{copy.missingFieldsLabel}</dt>
                  <dd className="text-right font-mono text-slate-700 dark:text-slate-300">
                    {missing.length > 0 ? missing.join(', ') : copy.noneMissing}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* 14-Day Recharts Historical Growth Chart */}
          <ProjectGrowthChart
            project={project}
            language={language}
            isSyncing={isSyncing}
            onSyncSingleGithub={onSyncSingleGithub}
          />

          {/* Vertical Timeline Visualization (GitHub Activity + Creator Logs + Provenance) */}
          <ProjectMilestoneTimeline
            project={project}
            makerVerification={makerVerification}
            language={language}
            user={user}
            creatorMilestones={creatorMilestones}
            milestonesLoading={milestonesLoading}
            onCreateMilestone={async (payload) => {
              if (!user) throw new Error('Sign in required');
              await createProjectMilestoneInFirestore(user, project, payload);
            }}
            onDeleteMilestone={async (milestoneId) => {
              await deleteProjectMilestoneInFirestore(milestoneId);
            }}
            onSignIn={onSignIn}
            onOpenClaimForm={() => {
              setActiveActionForm('claim');
              window.requestAnimationFrame(() => {
                document
                  .querySelector('[data-testid="detail-claim-form"]')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              });
            }}
          />

          {/* Chronological Community Activity Feed */}
          <ProjectCommunityActivity
            language={language}
            activities={communityActivities}
            loading={activityLoading}
            error={activityError}
          />

          {/* Related Projects */}
          {related.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {copy.relatedTitle}
              </h3>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {related.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectProject(rel)}
                    className="rounded-xl border border-slate-200 p-3.5 text-left transition-colors hover:border-blue-400 dark:border-slate-800 dark:hover:border-blue-700"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {CONTENT_TYPE_LABELS[language][rel.contentType]} · {rel.country}
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {rel.name}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                      {language === 'ko' && rel.taglineKo ? rel.taglineKo : rel.tagline}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
