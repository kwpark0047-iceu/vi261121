import type {
  AppLanguage,
  BackendTech,
  ContentType,
  DevelopmentPlatform,
  HostingProvider,
  PricingModel,
  ProjectCategory,
  SortOption,
  VerificationStatus,
} from '../types/vibeatlas';

export const UI_STRINGS: Record<
  AppLanguage,
  {
    nav: {
      home: string;
      discover: string;
      githubStars: string;
      makers: string;
      submit: string;
      primaryCta: string;
      searchPlaceholder: string;
      searchAriaLabel: string;
      searchClear: string;
      searchToggle: string;
      searchProjectsHeading: string;
      searchTagsHeading: string;
      searchTagCountSuffix: string;
      searchNoResults: string;
      searchActionSubmit: string;
    };
    workspace: {
      savedBookmarks: string;
      signInGoogle: string;
      signOut: string;
      makerAccount: string;
      lightMode: string;
      darkMode: string;
      soundOn: string;
      soundOff: string;
      koreanSearchNoteTitle: string;
      koreanSearchNoteBody: string;
      authErrorClose: string;
      authUnauthorizedTitle: string;
      authUnauthorizedBody: string;
      authUnauthorizedSteps: string;
      authUnauthorizedCopyDomain: string;
      authUnauthorizedCopied: string;
      authUnauthorizedOpenConsole: string;
      authPopupBlockedTitle: string;
      authPopupBlockedBody: string;
      authPopupRedirectButton: string;
      authCancelledNotice: string;
      authNetworkErrorBody: string;
      authGenericErrorTitle: string;
    };
    hero: {
      kicker: string;
      headline: string;
      subheadline: string;
      searchPlaceholder: string;
      searchButton: string;
      quickBrowseLabel: string;
    };
    home: {
      trendingTab: string;
      newlyLaunchedTab: string;
      risingOssTab: string;
      viewAllDiscover: string;
      mcpAndSkillsTitle: string;
      mcpAndSkillsSubtitle: string;
      stacksTitle: string;
      stacksSubtitle: string;
      koreanGlobalTitle: string;
      koreanGlobalSubtitle: string;
      featuredMakersTitle: string;
      featuredMakersSubtitle: string;
      submitCtaTitle: string;
      submitCtaBody: string;
      submitCtaButton: string;
      newsletterTitle: string;
      newsletterBody: string;
      newsletterPlaceholder: string;
      newsletterButton: string;
      newsletterSignInNotice: string;
      newsletterSuccess: string;
      promoTitle: string;
      promoSubtitle: string;
      promoTabAll: string;
      promoTabSubmitted: string;
      promoTabDemoReady: string;
      promoCtaSubmit: string;
      promoKitHeading: string;
      promoToneCommunity: string;
      promoToneSocial: string;
      promoCopyLinkButton: string;
      promoCopyPitchButton: string;
      promoCopiedLabel: string;
      promoOpenDetailButton: string;
      promoLiveDemoButton: string;
      promoSubmittedLabel: string;
      promoCuratedLabel: string;
      promoEmptyFilterTitle: string;
      promoEmptyFilterBody: string;
      promoCountLiveSuffix: string;
      trending24hTitle: string;
      trending24hSubtitle: string;
      trending24hAllLanguages: string;
      trending24hRefreshButton: string;
      trending24hViewLeaderboard: string;
      trending24hStarsSuffix: string;
      trending24hSourceSnapshot: string;
      trending24hSourceRate: string;
      trending24hOpenCatalog: string;
      trending24hOpenGithub: string;
      trending24hEmptyTitle: string;
      trending24hEmptyBody: string;
      trending24hResetLanguage: string;
      trending24hErrorTitle: string;
      trending24hRetryButton: string;
      recentActivityTitle: string;
      recentActivitySubtitle: string;
      recentActivityFilterAll: string;
      recentActivityFilterSubmissions: string;
      recentActivityFilterLikes: string;
      recentActivityFilterBookmarks: string;
      recentActivityAutoScrollOn: string;
      recentActivityAutoScrollPaused: string;
      recentActivityActionSubmitted: string;
      recentActivityActionLiked: string;
      recentActivityActionBookmarked: string;
      recentActivityCommunityActor: string;
      recentActivityGuestActor: string;
      recentActivityLiveLabel: string;
      recentActivityDeltaSuffix: string;
      recentActivityOpenProject: string;
      recentActivityEmptyTitle: string;
      recentActivityEmptyBody: string;
      recentActivityLiveCountSuffix: string;
      recentActivityShowAllButton: string;
    };
    discover: {
      title: string;
      subtitle: string;
      filtersHeading: string;
      mobileFiltersButton: string;
      resetFilters: string;
      searchPlaceholder: string;
      sortLabel: string;
      resultsCount: string;
      emptyTitle: string;
      emptyBody: string;
      previousPage: string;
      nextPage: string;
      filterType: string;
      filterCategory: string;
      allCategoriesOption: string;
      filterTags: string;
      clearTags: string;
      activeTagsPrefix: string;
      tagsHint: string;
      filterPlatform: string;
      filterHosting: string;
      filterBackend: string;
      filterCountry: string;
      filterLanguage: string;
      filterLicense: string;
      filterPricing: string;
      filterVerification: string;
      filterMinStars: string;
      filterUpdatedWithin: string;
      allOption: string;
      webAppsTop100Title: string;
      webAppsTop100Subtitle: string;
      webAppsLoading: string;
      webAppsError: string;
      webAppsRetry: string;
      summaryRegionLabel: string;
      summaryTotalProjectsLabel: string;
      summaryVerifiedSuffix: string;
      summaryMatchingSuffix: string;
      summaryPopularCategoryLabel: string;
      summaryCategoryShareUnit: string;
      summaryFilterCategoryAction: string;
      summaryGrowthTrendsLabel: string;
      summaryGrowthStarsUnit: string;
      summaryGrowthSignalsUnit: string;
      summaryRisingProjectsSuffix: string;
      summaryNoGrowthYet: string;
      typeFilterBarLabel: string;
      typeFilterClearLabel: string;
    };
    projectGrowth: {
      title: string;
      subtitle: string;
      toggleExpand: string;
      toggleCollapse: string;
      modeDaily: string;
      modeCumulative: string;
      scopeAll: string;
      scopeFiltered: string;
      kpiNew30d: string;
      kpiPeakDay: string;
      kpiWeeklyPace: string;
      kpiCatalogTotal: string;
      perWeekUnit: string;
      catalogGrowthSuffix: string;
      activeDaysSuffix: string;
      dailySeriesLabel: string;
      rollingAvgLabel: string;
      cumulativeSeriesLabel: string;
      tooltipProjectsLabel: string;
      tooltipMoreSuffix: string;
      noPeakYet: string;
      emptyTitle: string;
      emptyFilteredBody: string;
      emptyCatalogBody: string;
      resetFilterButton: string;
      submitProjectButton: string;
    };
    trendingSection: {
      title: string;
      subtitle: string;
      toggleExpand: string;
      toggleCollapse: string;
      tabStar30d: string;
      tabStar7d: string;
      tabSignalVelocity: string;
      chartHeading: string;
      trajectoryHeading: string;
      unitStars: string;
      unitSignals: string;
      perDaySuffix: string;
      periodDeltaLabel: string;
      dailyVelocityLabel: string;
      currentTotalLabel: string;
      inspectButton: string;
      emptyStarTitle: string;
      emptyStarBody: string;
      switchToSignalButton: string;
      emptyFilteredTitle: string;
      emptyFilteredBody: string;
      fallbackNote: string;
    };
    githubTrendingBubble: {
      title: string;
      subtitle: string;
      toggleExpand: string;
      toggleCollapse: string;
      refreshButton: string;
      refreshing: string;
      allLanguages: string;
      perDaySuffix: string;
      dailyStarsLabel: string;
      totalStarsLabel: string;
      forksLabel: string;
      pushedLabel: string;
      topMoversHeading: string;
      openGithubButton: string;
      inspectVibeAtlasButton: string;
      loadingLabel: string;
      emptyTitle: string;
      emptyBody: string;
      resetLanguageButton: string;
      errorTitle: string;
      retryButton: string;
      cachedNotice: string;
      rateModeVelocity: string;
      rateModeSnapshot: string;
      reposCountLabel: string;
      clickHint: string;
    };
    discoveryMap: {
      title: string;
      subtitle: string;
      toggleExpand: string;
      toggleCollapse: string;
      scopeEcosystem: string;
      scopeDirectory: string;
      scopeVerifiedMakers: string;
      allTypes: string;
      xAxisLabel: string;
      yAxisLabel: string;
      quadrantLeaders: string;
      quadrantActiveBuilders: string;
      quadrantEstablished: string;
      quadrantEmerging: string;
      spotlightHeading: string;
      starsMetricLabel: string;
      activityMetricLabel: string;
      dailyVelocityLabel: string;
      recencyLabel: string;
      todayLabel: string;
      daysAgoSuffix: string;
      sourceDirectory: string;
      sourceEnriched: string;
      sourceEcosystem: string;
      inspectButton: string;
      openGithubButton: string;
      emptyTitle: string;
      emptyBody: string;
      resetMapFilter: string;
      resetFiltersButton: string;
      pointsCountLabel: string;
      interactionHint: string;
      medianGuideNote: string;
    };
    card: {
      githubStars: string;
      internalLikes: string;
      internalBookmarks: string;
      notSynced: string;
      staleLabel: string;
      verifiedLabel: string;
      pendingLabel: string;
      unverifiedLabel: string;
      missingLicense: string;
      openDetail: string;
      likeAction: string;
      bookmarkAction: string;
      trendingBadge: string;
      trending7dTooltip: string;
      trendingEngagementTooltip: string;
      compareAdd: string;
      compareSelected: string;
      starHistory7d: string;
      starHistoryBaseline: string;
      starHistoryNoSnapshots: string;
      statusBadgesLabel: string;
      openSourceBadge: string;
      openSourceTooltip: string;
      openSourceWithLicenseTooltip: string;
      verifiedTooltip: string;
      pendingTooltip: string;
      unverifiedTooltip: string;
    };
    highlights: {
      containerLabel: string;
      featured: string;
      newArrival: string;
      highActivity: string;
      featuredTooltip: string;
      newArrivalTooltip: string;
      highActivityTooltip: string;
      highActivityStarsTooltip: string;
      highActivitySignalsTooltip: string;
    };
    verification: {
      claimedBadge: string;
      claimedTooltip: string;
      pendingBadge: string;
      pendingTooltip: string;
      unclaimedBadge: string;
      panelTitleClaimed: string;
      panelBodyClaimed: string;
      panelTitlePending: string;
      panelBodyPending: string;
      panelTitleUnclaimed: string;
      panelBodyUnclaimed: string;
      attributionLabel: string;
      methodLabel: string;
      statusLabel: string;
      statusClaimed: string;
      statusPending: string;
      statusUnclaimed: string;
      ownerTag: string;
      methodGithub: string;
      methodDns: string;
      methodDemo: string;
      methodDirect: string;
      claimCta: string;
    };
    compare: {
      trayTitle: string;
      trayHintOneMore: string;
      trayLimitNotice: string;
      emptySlotLabel: string;
      compareNowButton: string;
      clearButton: string;
      removeAction: string;
      modalTitle: string;
      modalSubtitle: string;
      closeButton: string;
      colAttribute: string;
      sectionGithub: string;
      sectionMetadata: string;
      sectionCommunity: string;
      rowGithubStars: string;
      rowGithubForks: string;
      rowLicense: string;
      rowRepository: string;
      rowLastSynced: string;
      rowContentType: string;
      rowCategories: string;
      rowPlatform: string;
      rowHostingBackend: string;
      rowTechStack: string;
      rowPricing: string;
      rowVerification: string;
      rowCountryLang: string;
      rowUpdatedAt: string;
      rowEngagement: string;
      rowLinks: string;
      highestBadge: string;
      latestBadge: string;
      openDetail: string;
      notAvailable: string;
    };
    detail: {
      close: string;
      externalLinksTitle: string;
      internalActionsTitle: string;
      liveDemo: string;
      officialWebsite: string;
      githubRepository: string;
      syncGithubNow: string;
      syncing: string;
      provenanceTitle: string;
      provenanceSourceLabel: string;
      lastSyncedLabel: string;
      missingFieldsLabel: string;
      noneMissing: string;
      techAndPlatformTitle: string;
      platformLabel: string;
      hostingLabel: string;
      backendLabel: string;
      licenseLabel: string;
      pricingLabel: string;
      countryLangLabel: string;
      historyChartTitle: string;
      historyChartSubtitle: string;
      chartTabStars: string;
      chartTabInternal: string;
      chartUnsyncedStarsHint: string;
      chartLiveTotalLabel: string;
      chartDeltaLabel: string;
      chartBaselineNote: string;
      relatedTitle: string;
      reportButton: string;
      claimButton: string;
      reportTitle: string;
      claimTitle: string;
      submitReport: string;
      submitClaim: string;
      actionSubmitted: string;
      signInRequired: string;
      communityActivityTitle: string;
      communityActivitySubtitle: string;
      activityFilterAll: string;
      activityFilterLikes: string;
      activityFilterBookmarks: string;
      activityFilterReports: string;
      activityActionLike: string;
      activityActionBookmark: string;
      activityActionReport: string;
      activityGuestActor: string;
      activityEmptyTitle: string;
      activityEmptySubtitle: string;
      activityLoadingLabel: string;
      activityErrorNotice: string;
      activityReasonBrokenLink: string;
      activityReasonStaleMetadata: string;
      activityReasonMisattribution: string;
      activityReasonSpam: string;
      activityReasonSecurityConcern: string;
      vibeScoreTitle: string;
      vibeScoreSubtitle: string;
      vibeScoreOutOf100: string;
      vibeScoreTierThriving: string;
      vibeScoreTierActive: string;
      vibeScoreTierWarm: string;
      vibeScoreTierQuiet: string;
      vibeScorePillarAffinity: string;
      vibeScorePillarMomentum: string;
      vibeScorePillarTraction: string;
      vibeScorePillarHealth: string;
      vibeScoreUnsyncedNote: string;
      vibeScoreReportsPenalty: string;
      vibeScoreFormulaNote: string;
      sharePromoteTitle: string;
      copyDirectLink: string;
      copyPromoPitch: string;
      copiedFeedback: string;
      timelineTitle: string;
      timelineSubtitle: string;
      timelineFilterAll: string;
      timelineFilterReleases: string;
      timelineFilterCommits: string;
      timelineFilterCreatorLogs: string;
      timelineSortNewest: string;
      timelineSortOldest: string;
      timelineAddButton: string;
      timelineCloseComposer: string;
      timelineCadenceLabel: string;
      timelineSpanDaysSuffix: string;
      timelineGapSuffix: string;
      timelineLoadingLabel: string;
      timelineRepoErrorNotice: string;
      timelineNoRepoNote: string;
      timelineEmptyTitle: string;
      timelineEmptyBody: string;
      timelineEmptyCreatorBody: string;
      timelineAuthNoticeSignedOut: string;
      timelineAuthNoticeNotOwner: string;
      timelineSignInCta: string;
      timelineClaimCta: string;
      timelineKindLabel: string;
      timelineKindRelease: string;
      timelineKindLaunch: string;
      timelineKindFeature: string;
      timelineKindUpdate: string;
      timelineKindFix: string;
      timelineVersionLabel: string;
      timelineDateLabel: string;
      timelineEntryTitleLabel: string;
      timelineSummaryLabel: string;
      timelineUrlLabel: string;
      timelinePublishButton: string;
      timelinePublishingButton: string;
      timelineDeleteButton: string;
      timelineExternalLink: string;
      timelineSourceRelease: string;
      timelineSourceCommit: string;
      timelineSourceCreator: string;
      timelineSourceCatalog: string;
      volatilityTitle: string;
      volatilitySubtitle: string;
      volatilityModePace: string;
      volatilityModeSwing: string;
      volatilityMetricStdDev: string;
      volatilityMetricNetVibe: string;
      volatilityMetricStarRate: string;
      volatilityMetricMaxSwing: string;
      volatilityVerdictLabel: string;
      volatilityVerdictKeepingPace: string;
      volatilityVerdictKeepingPaceDesc: string;
      volatilityVerdictSentimentLeading: string;
      volatilityVerdictSentimentLeadingDesc: string;
      volatilityVerdictAdoptionOutpacing: string;
      volatilityVerdictAdoptionOutpacingDesc: string;
      volatilityVerdictUnsynced: string;
      volatilityVerdictUnsyncedDesc: string;
      volatilityVerdictBaseline: string;
      volatilityVerdictBaselineDesc: string;
      volatilityLegendVibeScore: string;
      volatilityLegendBand: string;
      volatilityLegendStarRate: string;
      volatilityLegendSwing: string;
      volatilityLeftAxisLabel: string;
      volatilityRightAxisLabel: string;
      volatilitySwingAxisLabel: string;
      volatilityScrubHint: string;
      volatilityDateLabel: string;
      volatilityVibeDeltaLabel: string;
      volatilityStarGainLabel: string;
      insightsTitle: string;
      insightsSubtitle: string;
      insightsModeDaily: string;
      insightsModeCumulative: string;
      insightsKpiLikes7d: string;
      insightsKpiBookmarks7d: string;
      insightsKpiBookmarkShare: string;
      insightsKpiPeakDay: string;
      insightsTotalPrefix: string;
      insightsAvgPerDay: string;
      insightsNoPeakDay: string;
      insightsScrubHint: string;
      insightsDateLabel: string;
      insightsCombinedLabel: string;
      insightsMixTitle: string;
      insightsEmptyTitle: string;
      insightsEmptyHint: string;
      insightsAxisCount: string;
      editProject: string;
      starGrowthTitle: string;
      starGrowthSubtitle: string;
      starGrowthRange7d: string;
      starGrowthRange30d: string;
      starGrowthRangeAll: string;
      starGrowthModeTotal: string;
      starGrowthModeDelta: string;
      starGrowthKpiCurrent: string;
      starGrowthKpiNet: string;
      starGrowthKpiAvgDay: string;
      starGrowthKpiSnapshots: string;
      starGrowthDaysSuffix: string;
      starGrowthPerDaySuffix: string;
      starGrowthNoRepo: string;
      starGrowthUnsynced: string;
      starGrowthSingleBaseline: string;
      starGrowthTooltipTotal: string;
      starGrowthTooltipDelta: string;
      starGrowthTooltipCumulative: string;
      mobileViewToggle: string;
      mobileViewTitle: string;
      mobileViewSubtitle: string;
      mobileViewClose: string;
    };
    submit: {
      title: string;
      subtitle: string;
      promoPreviewTitle: string;
      promoPreviewSubtitle: string;
      promoPreviewUntitled: string;
      promoPreviewTaglineFallback: string;
      githubImportTitle: string;
      githubImportHint: string;
      githubImportPlaceholder: string;
      githubFetchButton: string;
      fetchingGithub: string;
      nameLabel: string;
      taglineEnLabel: string;
      taglineKoLabel: string;
      descriptionEnLabel: string;
      descriptionKoLabel: string;
      contentTypeLabel: string;
      categoriesLabel: string;
      categoriesQuickTagsHint: string;
      techStackLabel: string;
      platformLabel: string;
      hostingLabel: string;
      backendLabel: string;
      countryLabel: string;
      languageLabel: string;
      licenseLabel: string;
      pricingLabel: string;
      liveDemoLabel: string;
      websiteLabel: string;
      githubUrlLabel: string;
      makerNameLabel: string;
      makerHandleLabel: string;
      submitButton: string;
      submitting: string;
      signInPrompt: string;
      submitSuccess: string;
      draftRestoredNotice: string;
      draftAutosaveHint: string;
      clearDraftButton: string;
      validationSummaryPrefix: string;
    };
    maker: {
      title: string;
      subtitle: string;
      myProjectsTab: string;
      myBookmarksTab: string;
      claimsReportsTab: string;
      signInCtaTitle: string;
      signInCtaBody: string;
      noProjectsYet: string;
      noBookmarksYet: string;
      resyncGithub: string;
      deleteProject: string;
      analyticsTitle: string;
      analyticsSubtitle: string;
      metricOwnedProjects: string;
      metricTotalLikes: string;
      metricTotalBookmarks: string;
      metricTotalEngagement: string;
      metricExternalStarsNote: string;
      analyticsSortEngagement: string;
      analyticsSortLikes: string;
      analyticsSortBookmarks: string;
      analyticsSortRecent: string;
      tableProjectCol: string;
      tableLikesCol: string;
      tableBookmarksCol: string;
      tableTotalCol: string;
      tableSplitCol: string;
      tableGithubCol: string;
      topProjectLabel: string;
      analyticsEmptyHint: string;
      projectListHeading: string;
      likesUnit: string;
      bookmarksUnit: string;
      engagementUnit: string;
      editProject: string;
      editSuccessNotice: string;
      confirmDeleteLabel: string;
      cancelDeleteLabel: string;
      lastUpdatedPrefix: string;
      viewDetail: string;
    };
    editModal: {
      title: string;
      subtitle: string;
      adminModeNote: string;
      immutableNote: string;
      slugLabel: string;
      statusLabel: string;
      lastUpdatedLabel: string;
      githubSyncHeading: string;
      githubSyncHint: string;
      githubFillEmptyButton: string;
      thumbnailUrlLabel: string;
      thumbnailPreviewLabel: string;
      sectionBasic: string;
      sectionClassification: string;
      sectionLinksMaker: string;
      resetButton: string;
      cancelButton: string;
      saveButton: string;
      savingButton: string;
      noChangesHint: string;
      changedCountSuffix: string;
      closeLabel: string;
    };
    mobileDemo: {
      sectionTitle: string;
      sectionSubtitle: string;
      enableToggleLabel: string;
      enableToggleHint: string;
      targetPlatformsLabel: string;
      quickMobileStackLabel: string;
      mobileDemoUrlLabel: string;
      mobileDemoUrlPlaceholder: string;
      iosAppStoreLabel: string;
      iosAppStorePlaceholder: string;
      androidPlayStoreLabel: string;
      androidPlayStorePlaceholder: string;
      mobilePackageUrlLabel: string;
      mobilePackageUrlPlaceholder: string;
      bundleIdLabel: string;
      bundleIdPlaceholder: string;
      minOsLabel: string;
      minOsPlaceholder: string;
      devicePresetLabel: string;
      orientationLabel: string;
      presetIphone: string;
      presetPixel: string;
      orientationPortrait: string;
      orientationLandscape: string;
      liveSubmitPreviewTitle: string;
      liveSubmitPreviewSubtitle: string;
      simulatorTitle: string;
      simulatorSubtitle: string;
      modeAppCard: string;
      modeLiveFrame: string;
      openExternalButton: string;
      copyDemoLinkButton: string;
      copiedLinkLabel: string;
      iframeFallbackNotice: string;
      iframeBlockedButton: string;
      qrTitle: string;
      qrSubtitleDemo: string;
      qrSubtitleStore: string;
      qrSubtitleShare: string;
      storeLinksTitle: string;
      noStoreLinksNote: string;
      specsTitle: string;
      cardBadgeLabel: string;
      previewTabOverview: string;
      previewTabFeatures: string;
      previewTabRelease: string;
      previewInteractiveCta: string;
    };
    footer: {
      tagline: string;
      transparencyNote: string;
    };
    voiceSearch: {
      startLabel: string;
      stopLabel: string;
      listeningStatus: string;
      stopButton: string;
      unsupportedError: string;
      permissionDeniedError: string;
      noSpeechError: string;
      audioCaptureError: string;
      networkError: string;
      unknownError: string;
      dismissError: string;
    };
    githubStarsPage: {
      title: string;
      subtitle: string;
      refreshButton: string;
      refreshing: string;
      presetAll: string;
      presetWebApps: string;
      presetAiAgents: string;
      presetTypescript: string;
      presetPython: string;
      presetRust: string;
      presetGo: string;
      kpiRankedCount: string;
      kpiTopStars: string;
      kpiMedianStars: string;
      kpiLastUpdated: string;
      cachedFallbackBadge: string;
      searchPlaceholder: string;
      allLanguagesOption: string;
      showingCountLabel: string;
      colRank: string;
      colRepository: string;
      colLanguageLicense: string;
      colForks: string;
      colStars: string;
      colActions: string;
      openInVibeAtlas: string;
      openGithub: string;
      emptyFilteredTitle: string;
      emptyFilteredBody: string;
      resetFilterButton: string;
      errorTitle: string;
      dataUnavailableTitle: string;
      dataUnavailableBody: string;
      retryButton: string;
      rateLimitResetPrefix: string;
      translatingDescriptions: string;
      translatedBadge: string;
      showOriginal: string;
      showTranslated: string;
      translationErrorNotice: string;
    };
  }
> = {
  ko: {
    nav: {
      home: '홈',
      discover: '탐색',
      githubStars: 'GitHub 스타',
      makers: '메이커',
      submit: '등록하기',
      primaryCta: '프로젝트 등록',
      searchPlaceholder: '프로젝트 · 태그 검색...',
      searchAriaLabel: '프로젝트 및 태그 실시간 검색',
      searchClear: '검색어 지우기',
      searchToggle: '검색 열기',
      searchProjectsHeading: '일치하는 프로젝트',
      searchTagsHeading: '일치하는 태그',
      searchTagCountSuffix: '개',
      searchNoResults: '일치하는 프로젝트나 태그가 없습니다.',
      searchActionSubmit: '전체 검색 결과 보기 (Enter)',
    },
    workspace: {
      savedBookmarks: '북마크',
      signInGoogle: 'Google 로그인',
      signOut: '로그아웃',
      makerAccount: '메이커 계정',
      lightMode: '라이트 모드',
      darkMode: '다크 모드',
      soundOn: '효과음 켜짐',
      soundOff: '효과음 끔',
      koreanSearchNoteTitle: '한/영 다국어 검색 안내',
      koreanSearchNoteBody:
        '기본 영문 형태소 토크나이저는 한국어 조사·어미를 분리하지 못하므로, W-Vibe는 한국어 부분 문자열 매칭과 기술 용어 한·영 동의어 확장(예: 에이전트↔agent, 서버↔server)을 병행합니다.',
      authErrorClose: '닫기',
      authUnauthorizedTitle: '현재 배포 도메인이 Firebase 인증 허용 도메인에 등록되지 않았습니다',
      authUnauthorizedBody:
        'GitHub(GitHub Pages / Vercel 등)에 새로 배포한 도메인에서 Google 로그인을 사용하려면 Firebase 콘솔의 승인된 도메인 목록에 아래 호스트를 추가해야 합니다. 비로그인 상태에서도 탐색·좋아요·북마크는 계속 이용할 수 있습니다.',
      authUnauthorizedSteps:
        'Firebase 콘솔 → Authentication → Settings → Authorized domains → Add domain',
      authUnauthorizedCopyDomain: '도메인 복사',
      authUnauthorizedCopied: '복사됨',
      authUnauthorizedOpenConsole: 'Firebase 승인 도메인 설정 열기',
      authPopupBlockedTitle: '브라우저에서 Google 로그인 팝업이 차단되었습니다',
      authPopupBlockedBody:
        '브라우저 팝업 차단을 해제한 뒤 다시 시도하거나, 아래 리디렉션 방식으로 로그인을 진행해 주세요.',
      authPopupRedirectButton: '리디렉션으로 로그인',
      authCancelledNotice: 'Google 로그인 창이 닫혀 로그인이 취소되었습니다.',
      authNetworkErrorBody: '네트워크 연결이 불안정해 Google 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.',
      authGenericErrorTitle: 'Google 로그인 중 문제가 발생했습니다',
    },
    hero: {
      kicker: '검증된 메타데이터 · 투명한 지표',
      headline: 'AI 앱과 MCP, 한눈에 탐색',
      subheadline: 'GitHub 스타와 커뮤니티 시그널을 분리해 투명하게 보여주는 W-바이브',
      searchPlaceholder: 'MCP, Lovable, 에이전트, Supabase...',
      searchButton: '검색',
      quickBrowseLabel: '빠른 탐색',
    },
    home: {
      trendingTab: '이번 주 트렌딩',
      newlyLaunchedTab: '신규 런칭',
      risingOssTab: '급상승 OSS',
      viewAllDiscover: '전체 탐색',
      mcpAndSkillsTitle: 'MCP 서버 & AI Skills',
      mcpAndSkillsSubtitle: '검증된 에이전트 도구와 프로토콜',
      stacksTitle: '스택 큐레이션',
      stacksSubtitle: '주요 플랫폼·백엔드 기반 모음',
      koreanGlobalTitle: '글로벌 & 한국 메이커',
      koreanGlobalSubtitle: '서울부터 실리콘밸리까지 인디 빌더 프로덕트',
      featuredMakersTitle: '주목할 메이커',
      featuredMakersSubtitle: '저장소가 확인된 빌더',
      submitCtaTitle: '만든 AI 툴, 바로 알리세요',
      submitCtaBody: '등록 즉시 런칭 쇼케이스와 공유 키트를 제공합니다.',
      submitCtaButton: '등록하고 홍보하기',
      newsletterTitle: '주간 다이제스트',
      newsletterBody: '매주 엄선된 신규 MCP와 AI 프로덕트 소식',
      newsletterPlaceholder: '이메일 입력 (Google 연동)',
      newsletterButton: '구독',
      newsletterSignInNotice: 'Google 로그인 후 구독 저장',
      newsletterSuccess: '구독 완료!',
      promoTitle: '런칭 쇼케이스',
      promoSubtitle: '방금 등록된 프로젝트와 원클릭 홍보 키트',
      promoTabAll: '전체',
      promoTabSubmitted: '신규 등록',
      promoTabDemoReady: '라이브 데모',
      promoCtaSubmit: '프로젝트 등록',
      promoKitHeading: '공유 · 홍보 키트',
      promoToneCommunity: '커뮤니티용',
      promoToneSocial: '소셜 요약',
      promoCopyLinkButton: '링크 복사',
      promoCopyPitchButton: '문구 복사',
      promoCopiedLabel: '복사됨',
      promoOpenDetailButton: '상세',
      promoLiveDemoButton: '데모',
      promoSubmittedLabel: '커뮤니티 등록',
      promoCuratedLabel: '에디터 픽',
      promoEmptyFilterTitle: '등록 프로젝트가 없습니다',
      promoEmptyFilterBody: '첫 프로젝트를 등록하고 쇼케이스에 올려보세요.',
      promoCountLiveSuffix: '건',
      trending24hTitle: '24시간 GitHub 급상승',
      trending24hSubtitle: '최근 24시간 스타 증가 속도 TOP 저장소',
      trending24hAllLanguages: '전체',
      trending24hRefreshButton: '새로고침',
      trending24hViewLeaderboard: '전체 랭킹',
      trending24hStarsSuffix: '/ 24h',
      trending24hSourceSnapshot: '24h 스냅샷',
      trending24hSourceRate: '24h 증가율',
      trending24hOpenCatalog: '상세',
      trending24hOpenGithub: 'GitHub',
      trending24hEmptyTitle: '해당 언어의 급상승 항목이 없습니다',
      trending24hEmptyBody: '전체 언어로 보거나 새로고침해 보세요.',
      trending24hResetLanguage: '전체 보기',
      trending24hErrorTitle: '24시간 지표를 불러오지 못했습니다',
      trending24hRetryButton: '재시도',
      recentActivityTitle: '실시간 커뮤니티 피드',
      recentActivitySubtitle: '신규 등록·좋아요·북마크 실시간 흐름',
      recentActivityFilterAll: '전체',
      recentActivityFilterSubmissions: '신규 등록',
      recentActivityFilterLikes: '좋아요',
      recentActivityFilterBookmarks: '북마크',
      recentActivityAutoScrollOn: '자동 스크롤',
      recentActivityAutoScrollPaused: '일시 정지',
      recentActivityActionSubmitted: '새 프로젝트를 등록했습니다',
      recentActivityActionLiked: '좋아요를 눌렀습니다',
      recentActivityActionBookmarked: '북마크에 저장했습니다',
      recentActivityCommunityActor: 'W-Vibe 커뮤니티',
      recentActivityGuestActor: '게스트 방문자',
      recentActivityLiveLabel: '실시간',
      recentActivityDeltaSuffix: '건 최근 반응',
      recentActivityOpenProject: '상세',
      recentActivityEmptyTitle: '선택한 유형의 최근 활동이 없습니다',
      recentActivityEmptyBody: '프로젝트를 등록하거나 좋아요·북마크를 누르면 실시간 활동이 이곳에 표시됩니다.',
      recentActivityLiveCountSuffix: '건의 활동',
      recentActivityShowAllButton: '전체 활동 보기',
    },
    discover: {
      title: '프로젝트 탐색',
      subtitle: '모든 필터가 URL과 실시간 동기화됩니다.',
      filtersHeading: '필터',
      mobileFiltersButton: '필터',
      resetFilters: '필터 초기화',
      searchPlaceholder: '키워드, 스택, 메이커, 저장소 검색...',
      sortLabel: '정렬',
      resultsCount: '개 결과',
      emptyTitle: '조건에 일치하는 프로젝트가 없습니다',
      emptyBody: '필터 조건을 완화하거나 검색어를 변경해 보세요.',
      previousPage: '이전',
      nextPage: '다음',
      filterType: '콘텐츠 유형',
      filterCategory: '프로젝트 카테고리',
      allCategoriesOption: '전체 카테고리',
      filterTags: '프로젝트 태그',
      clearTags: '태그 해제',
      activeTagsPrefix: '선택된 태그',
      tagsHint: '여러 태그를 조합해 조건을 좁힐 수 있습니다.',
      filterPlatform: '개발 플랫폼',
      filterHosting: '호스팅',
      filterBackend: '백엔드',
      filterCountry: '국가',
      filterLanguage: '지원 언어',
      filterLicense: '라이선스',
      filterPricing: '가격 모델',
      filterVerification: '검증 상태',
      filterMinStars: '최소 GitHub 스타',
      filterUpdatedWithin: '최근 업데이트',
      allOption: '전체',
      webAppsTop100Title: '웹 애플리케이션 Top #1 ~ #100 전체 보기',
      webAppsTop100Subtitle: 'GitHub 공식 REST API 기준 인기 웹 애플리케이션 #1부터 #100까지 한 번에 모두 렌더링합니다.',
      webAppsLoading: '웹 애플리케이션 #1 ~ #100 데이터를 불러오는 중...',
      webAppsError: '웹 애플리케이션 #1 ~ #100 실시간 목록을 불러오지 못해 로컬 등록 프로젝트만 표시 중입니다.',
      webAppsRetry: '다시 불러오기',
      summaryRegionLabel: '카탈로그 주요 요약 지표',
      summaryTotalProjectsLabel: '총 프로젝트',
      summaryVerifiedSuffix: '개 검증됨',
      summaryMatchingSuffix: '개 필터 일치',
      summaryPopularCategoryLabel: '가장 인기 있는 카테고리',
      summaryCategoryShareUnit: '개 프로젝트',
      summaryFilterCategoryAction: '필터 적용',
      summaryGrowthTrendsLabel: '최근 성장 추세',
      summaryGrowthStarsUnit: '7일 스타',
      summaryGrowthSignalsUnit: '7일 커뮤니티 반응',
      summaryRisingProjectsSuffix: '개 상승 중',
      summaryNoGrowthYet: '최근 7일 변화 없음',
      typeFilterBarLabel: '프로젝트 유형 빠른 필터',
      typeFilterClearLabel: '초기화',
    },
    projectGrowth: {
      title: '프로젝트 성장 추이',
      subtitle: '최근 30일간 일별 신규 프로젝트 등록과 7일 이동 평균 흐름을 확인하세요.',
      toggleExpand: '프로젝트 성장 차트 펼치기',
      toggleCollapse: '프로젝트 성장 차트 접기',
      modeDaily: '일별 등록',
      modeCumulative: '누적 추이',
      scopeAll: '전체 카탈로그',
      scopeFiltered: '현재 필터',
      kpiNew30d: '최근 30일 신규',
      kpiPeakDay: '최다 등록일',
      kpiWeeklyPace: '주간 등록 속도',
      kpiCatalogTotal: '누적 전체',
      perWeekUnit: '/주',
      catalogGrowthSuffix: '카탈로그 확장',
      activeDaysSuffix: '일 등록 활동',
      dailySeriesLabel: '신규 등록',
      rollingAvgLabel: '7일 이동 평균',
      cumulativeSeriesLabel: '누적 프로젝트',
      tooltipProjectsLabel: '등록 프로젝트',
      tooltipMoreSuffix: '건 더 보기',
      noPeakYet: '기록 없음',
      emptyTitle: '최근 30일간 신규 등록된 프로젝트가 없습니다',
      emptyFilteredBody: '선택한 필터 조건에 해당하는 최근 30일 등록 건수가 없습니다. 필터를 초기화하거나 전체 카탈로그를 확인해 보세요.',
      emptyCatalogBody: '첫 프로젝트를 등록하면 최근 30일 카탈로그 성장 추이가 이곳에 표시됩니다.',
      resetFilterButton: '필터 초기화',
      submitProjectButton: '등록하기',
    },
    trendingSection: {
      title: '트렌딩 & 성장 속도',
      subtitle: '최근 30일·7일 GitHub 스타 증가량 및 커뮤니티 성장 속도(D3 시각화)로 급상승 프로젝트를 포착하세요.',
      toggleExpand: '차트 펼치기',
      toggleCollapse: '차트 접기',
      tabStar30d: '30일 스타 성장',
      tabStar7d: '7일 급상승',
      tabSignalVelocity: '커뮤니티 성장 속도',
      chartHeading: '상위 급상승 프로젝트 순위',
      trajectoryHeading: '일별 누적 추이',
      unitStars: '스타',
      unitSignals: '시그널',
      perDaySuffix: '/일',
      periodDeltaLabel: '기간 순증가',
      dailyVelocityLabel: '일평균 속도',
      currentTotalLabel: '현재 누적',
      inspectButton: '상세 보기',
      emptyStarTitle: '다중 일자 GitHub 스타 스냅샷이 아직 부족합니다',
      emptyStarBody: '여러 날짜에 걸쳐 GitHub 동기화가 누적되면 30일·7일 스타 증가 속도가 이 D3 차트에 표시됩니다.',
      switchToSignalButton: '커뮤니티 성장 속도 보기',
      emptyFilteredTitle: '현재 필터에 해당하는 성장 데이터가 없습니다',
      emptyFilteredBody: '필터 조건을 완화하면 급상승 프로젝트의 성장 속도 차트를 확인할 수 있습니다.',
      fallbackNote: '현재 목록에 다중 일자 GitHub 스타 변화량이 없어 실측 W-Vibe 참여 성장 속도를 기본으로 표시합니다.',
    },
    githubTrendingBubble: {
      title: 'GitHub Trending · AI 생태계',
      subtitle: '최근 활발히 개발 중인 AI 생태계 GitHub 저장소를 일평균 스타 상승량(D3 버블 차트) 크기로 한눈에 비교하세요.',
      toggleExpand: '버블 차트 펼치기',
      toggleCollapse: '버블 차트 접기',
      refreshButton: '새로고침',
      refreshing: '불러오는 중...',
      allLanguages: '전체 언어',
      perDaySuffix: '/일',
      dailyStarsLabel: '일일 스타 속도',
      totalStarsLabel: '총 GitHub 스타',
      forksLabel: '포크',
      pushedLabel: '최근 푸시',
      topMoversHeading: '상위 급상승 저장소',
      openGithubButton: 'GitHub 열기',
      inspectVibeAtlasButton: 'W-Vibe 상세',
      loadingLabel: 'AI 생태계 GitHub 트렌딩 저장소를 불러오는 중...',
      emptyTitle: '선택한 언어의 트렌딩 저장소가 없습니다',
      emptyBody: '전체 언어 필터로 되돌리면 AI 생태계 전체 버블 차트를 확인할 수 있습니다.',
      resetLanguageButton: '전체 언어 보기',
      errorTitle: 'GitHub 트렌딩 저장소를 불러오지 못했습니다',
      retryButton: '다시 시도',
      cachedNotice: '캐시 스냅샷 표시 중',
      rateModeVelocity: '일일 스타 상승률 기준',
      rateModeSnapshot: '24시간 스냅샷 증감',
      reposCountLabel: '개 활성 저장소',
      clickHint: '버블을 선택해 저장소 상세 정보를 확인하세요',
    },
    discoveryMap: {
      title: '생태계 비주얼 탐색 맵 (Scatter Map)',
      subtitle: 'GitHub 스타 규모(X축·로그)와 최근 업데이트·커뮤니티 활동 빈도(Y축) 기준으로 프로젝트를 탐색하세요.',
      toggleExpand: '탐색 맵 펼치기',
      toggleCollapse: '탐색 맵 접기',
      scopeEcosystem: '전체 생태계',
      scopeDirectory: '디렉터리 필터 결과',
      scopeVerifiedMakers: '메이커 인증만',
      allTypes: '전체 유형',
      xAxisLabel: 'GitHub 스타 (로그 스케일)',
      yAxisLabel: '활동 빈도 지수 (0–100)',
      quadrantLeaders: '생태계 리더',
      quadrantActiveBuilders: '고활동 인디 · 신예',
      quadrantEstablished: '안정 · 성숙기',
      quadrantEmerging: '초기 · 니치',
      spotlightHeading: '선택된 노드 스포트라이트',
      starsMetricLabel: 'GitHub 스타',
      activityMetricLabel: '활동 빈도',
      dailyVelocityLabel: '일일 스타 속도',
      recencyLabel: '최근 활동',
      todayLabel: '오늘',
      daysAgoSuffix: '일 전',
      sourceDirectory: 'W-Vibe 등록',
      sourceEnriched: '디렉터리 + 실시간 GitHub',
      sourceEcosystem: 'GitHub AI 생태계',
      inspectButton: '상세 보기',
      openGithubButton: 'GitHub 열기',
      emptyTitle: '현재 조건에 맞는 맵 노드가 없습니다',
      emptyBody: '범위나 유형 필터를 전체로 전환하면 생태계 전체 분포를 다시 탐색할 수 있습니다.',
      resetMapFilter: '맵 필터 초기화',
      resetFiltersButton: '디렉터리 필터 초기화',
      pointsCountLabel: '개 프로젝트 매핑됨',
      interactionHint: '점(노드)에 마우스를 올리거나 클릭해 상세 지표를 확인하세요',
      medianGuideNote: '점선: 중앙 기준선',
    },
    card: {
      githubStars: 'GitHub 스타',
      internalLikes: '좋아요',
      internalBookmarks: '북마크',
      notSynced: '미동기화',
      staleLabel: '동기화 오래됨',
      verifiedLabel: '검증됨',
      pendingLabel: '검증 대기',
      unverifiedLabel: '미검증',
      missingLicense: '라이선스 미표기',
      openDetail: '상세 보기',
      likeAction: '좋아요',
      bookmarkAction: '북마크',
      trendingBadge: '트렌딩',
      trending7dTooltip: '최근 7일간 GitHub 스타 +{count} 상승',
      trendingEngagementTooltip: '최근 7일간 좋아요 +{likes} · 북마크 +{bookmarks} (총 +{total} 증가)',
      compareAdd: '비교 담기',
      compareSelected: '비교 선택됨',
      starHistory7d: '7일 스타 추이',
      starHistoryBaseline: '단일 스냅샷',
      starHistoryNoSnapshots: '스냅샷 대기',
      statusBadgesLabel: '프로젝트 상태 배지',
      openSourceBadge: '오픈소스',
      openSourceTooltip: '오픈소스 코드로 공개된 프로젝트입니다.',
      openSourceWithLicenseTooltip: '오픈소스 프로젝트 ({license} 라이선스)',
      verifiedTooltip: '저장소 및 메타데이터 검증이 완료된 프로젝트입니다.',
      pendingTooltip: '메타데이터 및 소유권 검증이 진행 중입니다.',
      unverifiedTooltip: '아직 공식 메타데이터 검증이 완료되지 않았습니다.',
    },
    highlights: {
      containerLabel: '프로젝트 주요 배지',
      featured: '주요 추천',
      newArrival: '신규 등록',
      highActivity: '활발한 활동',
      featuredTooltip: '검증된 메타데이터와 커뮤니티 평가를 기준으로 선정된 대표 추천 프로젝트입니다.',
      newArrivalTooltip: '최근 등록된 신규 프로젝트입니다 ({date}).',
      highActivityTooltip: '최근 커밋·커뮤니티 참여 활동이 활발한 프로젝트입니다.',
      highActivityStarsTooltip: '최근 7일간 GitHub 스타 +{count} 상승으로 높은 활동성을 기록했습니다.',
      highActivitySignalsTooltip: '최근 7일간 좋아요·북마크 +{count}건의 활발한 커뮤니티 반응이 모였습니다.',
    },
    verification: {
      claimedBadge: '메이커 인증',
      claimedTooltip: '제작자가 소유권을 직접 인증하고 관리하는 프로젝트입니다.',
      pendingBadge: '소유권 심사 중',
      pendingTooltip: '메이커 소유권 인증 요청이 접수되어 확인 중입니다.',
      unclaimedBadge: '미인증 리스팅',
      panelTitleClaimed: '메이커 소유권 인증 완료',
      panelBodyClaimed:
        '공식 제작자가 W-Vibe에서 소유권을 직접 인증했습니다. 공식 링크, 라이선스 및 메이커 귀속 정보의 신뢰도가 검증되었습니다.',
      panelTitlePending: '메이커 소유권 인증 심사 중',
      panelBodyPending:
        '소유권 인증 증빙이 접수되어 검토 중입니다. 승인이 완료되면 프로젝트 카드와 상세 화면에 메이커 인증 배지가 표시됩니다.',
      panelTitleUnclaimed: '메이커 소유권 미인증 리스팅',
      panelBodyUnclaimed:
        '공개 저장소 동기화 또는 커뮤니티 큐레이션으로 등록된 항목입니다. 공식 제작자라면 소유권 인증을 제출해 신뢰 배지를 받을 수 있습니다.',
      attributionLabel: '메이커',
      methodLabel: '인증 방식',
      statusLabel: '상태',
      statusClaimed: '소유권 인증됨',
      statusPending: '심사 대기 중',
      statusUnclaimed: '미인증',
      ownerTag: '내 등록',
      methodGithub: 'GitHub 저장소 관리자',
      methodDns: '도메인 DNS TXT',
      methodDemo: '라이브 데모 메타 태그',
      methodDirect: '메이커 직접 등록 · 검증',
      claimCta: '소유권 인증하기',
    },
    compare: {
      trayTitle: '프로젝트 비교함',
      trayHintOneMore: '비교표를 열려면 프로젝트를 1개 이상 더 선택하세요 (최대 3개).',
      trayLimitNotice: '한 번에 최대 3개 프로젝트까지 비교할 수 있습니다. 기존 항목을 제거한 뒤 추가해 주세요.',
      emptySlotLabel: '빈 슬롯',
      compareNowButton: '나란히 비교하기',
      clearButton: '전체 비우기',
      removeAction: '비교에서 제거',
      modalTitle: '프로젝트 나란히 비교',
      modalSubtitle: 'GitHub 스타·포크·라이선스 지표와 기술 스택·메타데이터를 항목별로 비교합니다.',
      closeButton: '닫기',
      colAttribute: '비교 항목',
      sectionGithub: 'GitHub 저장소 지표',
      sectionMetadata: '메타데이터 · 기술 스택',
      sectionCommunity: 'W-Vibe 내부 활동 · 링크',
      rowGithubStars: 'GitHub 스타',
      rowGithubForks: 'GitHub 포크',
      rowLicense: '라이선스',
      rowRepository: '저장소',
      rowLastSynced: '마지막 동기화',
      rowContentType: '콘텐츠 유형',
      rowCategories: '카테고리',
      rowPlatform: '개발 플랫폼',
      rowHostingBackend: '호스팅 · 백엔드',
      rowTechStack: '기술 스택',
      rowPricing: '가격 모델',
      rowVerification: '검증 · 출처',
      rowCountryLang: '국가 · 언어',
      rowUpdatedAt: '최근 업데이트',
      rowEngagement: '좋아요 · 북마크',
      rowLinks: '외부 · 상세 링크',
      highestBadge: '최고',
      latestBadge: '최신',
      openDetail: '상세 보기',
      notAvailable: '미등록',
    },
    detail: {
      close: '닫기',
      externalLinksTitle: '외부 링크 (외부 사이트로 이동)',
      internalActionsTitle: 'W-Vibe 내부 액션',
      liveDemo: '라이브 데모',
      officialWebsite: '공식 웹사이트',
      githubRepository: 'GitHub 저장소',
      syncGithubNow: 'GitHub 지금 동기화',
      syncing: '동기화 중...',
      provenanceTitle: '메타데이터 출처 & 신선도',
      provenanceSourceLabel: '출처',
      lastSyncedLabel: '마지막 동기화',
      missingFieldsLabel: '누락 · 미확인 필드',
      noneMissing: '누락된 핵심 필드 없음',
      techAndPlatformTitle: '기술 스택 및 인프라 귀속',
      platformLabel: '개발 플랫폼',
      hostingLabel: '호스팅',
      backendLabel: '백엔드',
      licenseLabel: '라이선스',
      pricingLabel: '가격 정책',
      countryLangLabel: '국가 / 언어',
      historyChartTitle: '최근 14일 성장 추이 (GitHub 스타 · 내부 신호)',
      historyChartSubtitle: 'GitHub 스타 변화량과 W-Vibe 내부 북마크·좋아요는 별도 축으로 구분됩니다.',
      chartTabStars: 'GitHub 스타',
      chartTabInternal: '내부 좋아요·북마크',
      chartUnsyncedStarsHint: 'GitHub 저장소가 아직 동기화되지 않았습니다. 실시간 스타 수를 반영하려면 동기화하세요.',
      chartLiveTotalLabel: '현재 GitHub 스타',
      chartDeltaLabel: '14일 증가',
      chartBaselineNote: '현재 실시간 기준선 (일별 동기화 누적 시 변화 추이가 표시됩니다)',
      relatedTitle: '유사 프로젝트 및 대안',
      reportButton: '정보 오류/신고',
      claimButton: '소유권 인증 요청',
      reportTitle: '프로젝트 정보 오류 및 문제 신고',
      claimTitle: '메이커 소유권 인증 요청',
      submitReport: '신고 접수',
      submitClaim: '인증 요청 제출',
      actionSubmitted: 'Firestore에 안전하게 기록되었습니다.',
      signInRequired: '이 작업을 저장하려면 Google 로그인이 필요합니다.',
      communityActivityTitle: '커뮤니티 활동',
      communityActivitySubtitle: '이 프로젝트의 최근 좋아요, 북마크, 제보 내역을 최신순으로 표시합니다.',
      activityFilterAll: '전체',
      activityFilterLikes: '좋아요',
      activityFilterBookmarks: '북마크',
      activityFilterReports: '제보',
      activityActionLike: '님이 프로젝트를 좋아합니다',
      activityActionBookmark: '님이 프로젝트를 북마크했습니다',
      activityActionReport: '님이 정보 오류/문제를 제보했습니다',
      activityGuestActor: '방문자',
      activityEmptyTitle: '아직 기록된 최근 활동이 없습니다',
      activityEmptySubtitle: '상단의 좋아요, 북마크 또는 신고 버튼을 누르면 이 타임라인에 실시간으로 기록됩니다.',
      activityLoadingLabel: '활동 내역을 불러오는 중...',
      activityErrorNotice: '실시간 커뮤니티 활동 스트림을 불러오지 못해 로컬 기록만 표시 중입니다.',
      activityReasonBrokenLink: '깨진 링크',
      activityReasonStaleMetadata: '오래된 메타데이터',
      activityReasonMisattribution: '잘못된 스택·제작자 표기',
      activityReasonSpam: '스팸',
      activityReasonSecurityConcern: '보안 우려',
      vibeScoreTitle: '바이브 스코어 · 커뮤니티 건강도',
      vibeScoreSubtitle: 'W-Vibe 내부 참여도, 최근 활동 모멘텀, 신뢰·신선도 및 동기화된 GitHub 지표를 종합한 D3 게이지입니다.',
      vibeScoreOutOf100: '/ 100',
      vibeScoreTierThriving: '활발 (Thriving)',
      vibeScoreTierActive: '양호 (Active)',
      vibeScoreTierWarm: '보통 (Warm)',
      vibeScoreTierQuiet: '한산 (Quiet)',
      vibeScorePillarAffinity: '커뮤니티 선호도 (좋아요·북마크)',
      vibeScorePillarMomentum: '최근 활동 모멘텀',
      vibeScorePillarTraction: '외부 GitHub 견인력',
      vibeScorePillarHealth: '검증 및 최신성 건강도',
      vibeScoreUnsyncedNote: 'GitHub 저장소 미동기화 상태 (내부 신호만으로 산출됨)',
      vibeScoreReportsPenalty: '신고·오류 제보 감점 반영',
      vibeScoreFormulaNote: '내부 커뮤니티 신호(최대 75점)와 동기화된 외부 GitHub 지표(최대 25점)를 투명하게 분리 계산합니다.',
      sharePromoteTitle: '프로젝트 홍보 · 공유',
      copyDirectLink: '직접 링크 복사',
      copyPromoPitch: '홍보 문구 복사',
      copiedFeedback: '복사 완료',
      timelineTitle: '프로젝트 타임라인 & 마일스톤',
      timelineSubtitle: 'GitHub 공식 릴리스·커밋 활동과 메이커가 직접 기록한 마일스톤을 시간순으로 시각화합니다.',
      timelineFilterAll: '전체',
      timelineFilterReleases: '릴리스',
      timelineFilterCommits: '커밋',
      timelineFilterCreatorLogs: '메이커 로그',
      timelineSortNewest: '최신순',
      timelineSortOldest: '오래된순',
      timelineAddButton: '마일스톤 기록',
      timelineCloseComposer: '입력 닫기',
      timelineCadenceLabel: '활동 주기 분포',
      timelineSpanDaysSuffix: '일 구간',
      timelineGapSuffix: '일 간격',
      timelineLoadingLabel: 'GitHub 저장소 릴리스·커밋 이력을 불러오는 중...',
      timelineRepoErrorNotice: 'GitHub 저장소 마일스톤을 일시적으로 불러오지 못해 디렉터리·메이커 기록만 표시합니다.',
      timelineNoRepoNote: '연결된 GitHub 저장소가 없어 디렉터리 및 메이커 기록을 기준으로 타임라인을 표시합니다.',
      timelineEmptyTitle: '선택한 분류에 해당하는 마일스톤이 없습니다',
      timelineEmptyBody: '전체 탭으로 전환하면 저장소 및 디렉터리 이력을 확인할 수 있습니다.',
      timelineEmptyCreatorBody: '메이커가 아직 별도 업데이트 로그를 등록하지 않았습니다.',
      timelineAuthNoticeSignedOut: '공식 마일스톤 로그를 게시하려면 프로젝트 소유자 계정으로 Google 로그인해야 합니다.',
      timelineAuthNoticeNotOwner: '등록된 프로젝트 소유자 또는 관리자만 공식 타임라인 로그를 추가할 수 있습니다. 제작자라면 상단에서 소유권 인증을 제출하세요.',
      timelineSignInCta: 'Google 로그인',
      timelineClaimCta: '소유권 인증 열기',
      timelineKindLabel: '유형',
      timelineKindRelease: '정식 릴리스',
      timelineKindLaunch: '신규 런칭',
      timelineKindFeature: '기능 추가',
      timelineKindUpdate: '업데이트',
      timelineKindFix: '버그·보안 수정',
      timelineVersionLabel: '버전 태그 (선택)',
      timelineDateLabel: '발생 일자',
      timelineEntryTitleLabel: '마일스톤 제목 *',
      timelineSummaryLabel: '세부 요약 (선택)',
      timelineUrlLabel: '참고 URL / 릴리스 노트 (선택)',
      timelinePublishButton: '타임라인에 게시',
      timelinePublishingButton: '게시 중...',
      timelineDeleteButton: '마일스톤 삭제',
      timelineExternalLink: '원문 보기',
      timelineSourceRelease: 'GitHub 릴리스',
      timelineSourceCommit: '커밋',
      timelineSourceCreator: '메이커 로그',
      timelineSourceCatalog: '디렉터리 이력',
      volatilityTitle: '바이브 스코어 변동성 vs GitHub 스타 성장률',
      volatilitySubtitle: '시간에 따른 커뮤니티 체감 점수 변동폭(±σ 밴드)과 저장소 일일 스타 증가율(D3 이중 추세선)을 비교합니다.',
      volatilityModePace: '이중 추세 비교',
      volatilityModeSwing: '일간 변동폭',
      volatilityMetricStdDev: '점수 변동성 (σ)',
      volatilityMetricNetVibe: '14일 바이브 변화',
      volatilityMetricStarRate: '14일 스타 성장률',
      volatilityMetricMaxSwing: '최대 일간 등락',
      volatilityVerdictLabel: '채택 속도 대비 정서 정렬',
      volatilityVerdictKeepingPace: '기술 채택과 보조 일치',
      volatilityVerdictKeepingPaceDesc: '커뮤니티 바이브 스코어와 GitHub 스타 증가율이 균형 있게 함께 상승하고 있습니다.',
      volatilityVerdictSentimentLeading: '커뮤니티 정서 선행 · 변동 확대',
      volatilityVerdictSentimentLeadingDesc: '내부 바이브 관심도나 변동성이 최근 저장소 스타 성장 속도보다 빠르게 움직이고 있습니다.',
      volatilityVerdictAdoptionOutpacing: '기술 채택이 정서 상회',
      volatilityVerdictAdoptionOutpacingDesc: 'GitHub 스타 채택 속도가 W-Vibe 내 커뮤니티 모멘텀보다 빠르게 앞서가고 있습니다.',
      volatilityVerdictUnsynced: 'GitHub 미동기화 상태',
      volatilityVerdictUnsyncedDesc: '내부 바이브 변동성은 실시간 추적 중이며, GitHub 동기화 시 스타 성장률 비교선이 활성화됩니다.',
      volatilityVerdictBaseline: '초기 단일 스냅샷 기준선',
      volatilityVerdictBaselineDesc: '현재 시점의 GitHub 스타 기준선이 기록되었습니다. 다중 일자 동기화 누적 시 일일 성장률이 비교됩니다.',
      volatilityLegendVibeScore: '바이브 스코어 (0–100)',
      volatilityLegendBand: '변동성 밴드 (±σ)',
      volatilityLegendStarRate: '일간 스타 성장률 (%)',
      volatilityLegendSwing: '일간 바이브 등락폭 (Δ)',
      volatilityLeftAxisLabel: '바이브 스코어',
      volatilityRightAxisLabel: '스타 성장률 (%)',
      volatilitySwingAxisLabel: '일간 변동 (Δpt)',
      volatilityScrubHint: '각 날짜 노드를 가리키거나 선택해 세부 변동을 확인하세요',
      volatilityDateLabel: '기준일',
      volatilityVibeDeltaLabel: '전일 대비 바이브',
      volatilityStarGainLabel: '일간 스타 증감',
      insightsTitle: '프로젝트 인사이트 · 최근 7일 좋아요 & 북마크',
      insightsSubtitle: '최근 7일간 내부 좋아요(즉각 호응)와 북마크(저장 의도)의 일별 증감 및 누적 추세를 D3로 시각화합니다.',
      insightsModeDaily: '일별 증감',
      insightsModeCumulative: '7일 누적 추이',
      insightsKpiLikes7d: '7일 좋아요 증가',
      insightsKpiBookmarks7d: '7일 북마크 증가',
      insightsKpiBookmarkShare: '북마크 저장 비중',
      insightsKpiPeakDay: '최고 참여일',
      insightsTotalPrefix: '누적',
      insightsAvgPerDay: '일 평균',
      insightsNoPeakDay: '활동 없음',
      insightsScrubHint: '각 날짜 막대나 노드를 가리키거나 선택해 세부 수치를 확인하세요',
      insightsDateLabel: '기준일',
      insightsCombinedLabel: '합계',
      insightsMixTitle: '7일 반응 구성비',
      insightsEmptyTitle: '최근 7일간 기록된 좋아요·북마크 활동이 아직 없습니다.',
      insightsEmptyHint: '좋아요 또는 북마크를 남기면 일별 커뮤니티 참여 추이가 즉시 반영됩니다.',
      insightsAxisCount: '건수',
      editProject: '프로젝트 수정',
      starGrowthTitle: '스타 성장 추이 (Star Growth)',
      starGrowthSubtitle: '스타 스냅샷 시스템에 기록된 일별 GitHub 스타 누적 기록과 일간 증감을 시각화합니다.',
      starGrowthRange7d: '7일',
      starGrowthRange30d: '30일',
      starGrowthRangeAll: '전체',
      starGrowthModeTotal: '누적 스타',
      starGrowthModeDelta: '일간 증감',
      starGrowthKpiCurrent: '최신 스냅샷 스타',
      starGrowthKpiNet: '기간 순증가',
      starGrowthKpiAvgDay: '일평균 증감',
      starGrowthKpiSnapshots: '기록된 스냅샷',
      starGrowthDaysSuffix: '일',
      starGrowthPerDaySuffix: '/일',
      starGrowthNoRepo: '연결된 GitHub 저장소가 없어 스타 스냅샷을 추적할 수 없습니다.',
      starGrowthUnsynced: '저장된 스타 스냅샷이 없습니다. 지금 동기화해 첫 기준 스냅샷을 기록하세요.',
      starGrowthSingleBaseline: '현재 단일 스냅샷만 기록되었습니다. 여러 날짜에 동기화가 누적되면 성장 곡선이 표시됩니다.',
      starGrowthTooltipTotal: '기록된 스타',
      starGrowthTooltipDelta: '전일 대비',
      starGrowthTooltipCumulative: '구간 누적',
      mobileViewToggle: '모바일 뷰',
      mobileViewTitle: '모바일 뷰 미리보기',
      mobileViewSubtitle: '스마트폰 화면 비율(9:19.5) 프레임에서 프로젝트 라이브 데모를 미리봅니다.',
      mobileViewClose: '모바일 뷰 닫기',
    },
    submit: {
      title: '새 프로젝트 등록',
      subtitle: '검증 가능한 메타데이터를 입력하면 즉시 디렉터리에 게시되고 Firestore에 저장됩니다.',
      promoPreviewTitle: '메인 페이지 홍보 미리보기',
      promoPreviewSubtitle: '등록 즉시 메인 페이지 홍보 쇼케이스에 노출되며 아래 소개 문구로 외부 공유가 가능합니다.',
      promoPreviewUntitled: '내 AI 프로젝트 (제목 입력 시 반영)',
      promoPreviewTaglineFallback: '한 줄 소개를 입력하면 홍보 스니펫이 실시간 생성됩니다.',
      githubImportTitle: 'GitHub 저장소에서 메타데이터 가져오기',
      githubImportHint: '예: modelcontextprotocol/servers 또는 https://github.com/cline/cline',
      githubImportPlaceholder: 'owner/repo 또는 GitHub URL 입력',
      githubFetchButton: '실시간 가져오기',
      fetchingGithub: '조회 중...',
      nameLabel: '프로젝트 이름 *',
      taglineEnLabel: '영문 한 줄 소개 (5~220자) *',
      taglineKoLabel: '한국어 한 줄 소개',
      descriptionEnLabel: '영문 상세 설명 (최소 20자) *',
      descriptionKoLabel: '한국어 상세 설명',
      contentTypeLabel: '콘텐츠 유형',
      categoriesLabel: '카테고리 · 태그 (쉼표 구분, 최대 6개) *',
      categoriesQuickTagsHint: '빠른 태그 선택 (클릭하여 추가/제거):',
      techStackLabel: '기술 스택 (쉼표 구분, 최대 12개)',
      platformLabel: '개발 플랫폼',
      hostingLabel: '호스팅 제공자',
      backendLabel: '백엔드 기술',
      countryLabel: '국가 코드 (예: KR, US) *',
      languageLabel: '지원 언어',
      licenseLabel: '라이선스 (예: MIT, Apache-2.0) *',
      pricingLabel: '가격 모델',
      liveDemoLabel: '라이브 데모 URL (https://)',
      websiteLabel: '공식 웹사이트 URL (https://)',
      githubUrlLabel: 'GitHub URL (https://)',
      makerNameLabel: '메이커 / 팀 이름 *',
      makerHandleLabel: '메이커 핸들 (예: @handle)',
      submitButton: '디렉터리에 등록',
      submitting: '등록 중...',
      signInPrompt: '프로젝트를 Firestore에 게시하려면 먼저 Google 계정으로 로그인해 주세요.',
      submitSuccess: '프로젝트가 등록되었습니다!',
      draftRestoredNotice: '이전에 작성 중이던 임시 저장 내용을 로컬 스토리지에서 불러왔습니다.',
      draftAutosaveHint: '입력 중인 내용과 설정은 30초마다 브라우저 로컬 스토리지에 자동 저장됩니다.',
      clearDraftButton: '임시 저장 초기화',
      validationSummaryPrefix: '입력 항목을 확인해 주세요',
    },
    maker: {
      title: '메이커 스튜디오',
      subtitle: '내 프로젝트 · 북마크 · 인증 관리',
      myProjectsTab: '내 프로젝트',
      myBookmarksTab: '북마크 목록',
      claimsReportsTab: '소유권 인증 · 신고 내역',
      signInCtaTitle: 'Google 계정으로 로그인하여 메이커 대시보드 열기',
      signInCtaBody: '내 프로젝트 관리, 북마크 동기화, GitHub 메타데이터 재동기화를 이용할 수 있습니다.',
      noProjectsYet: '아직 등록한 프로젝트가 없습니다.',
      noBookmarksYet: '북마크한 프로젝트가 없습니다.',
      resyncGithub: 'GitHub 재동기화',
      deleteProject: '삭제',
      analyticsTitle: '프로젝트 참여도 애널리틱스',
      analyticsSubtitle: '내부 좋아요·북마크 합계는 외부 GitHub 스타와 분리 집계됩니다.',
      metricOwnedProjects: '등록 프로젝트',
      metricTotalLikes: '누적 좋아요',
      metricTotalBookmarks: '누적 북마크',
      metricTotalEngagement: '총 내부 참여도',
      metricExternalStarsNote: '외부 GitHub 스타 합계',
      analyticsSortEngagement: '총 참여순',
      analyticsSortLikes: '좋아요순',
      analyticsSortBookmarks: '북마크순',
      analyticsSortRecent: '최신순',
      tableProjectCol: '프로젝트',
      tableLikesCol: '좋아요',
      tableBookmarksCol: '북마크',
      tableTotalCol: '참여 합계',
      tableSplitCol: '참여 비중',
      tableGithubCol: 'GitHub 스타',
      topProjectLabel: '최다 참여 프로젝트',
      analyticsEmptyHint: '프로젝트를 등록하면 각 프로젝트별 좋아요·북마크 추이와 합계가 여기에 표시됩니다.',
      projectListHeading: '보유 프로젝트 목록',
      likesUnit: '좋아요',
      bookmarksUnit: '북마크',
      engagementUnit: '합계',
      editProject: '수정',
      editSuccessNotice: '보유 프로젝트 수정 사항이 저장되었습니다.',
      confirmDeleteLabel: '삭제 확인',
      cancelDeleteLabel: '취소',
      lastUpdatedPrefix: '최근 수정',
      viewDetail: '상세 보기',
    },
    editModal: {
      title: '보유 프로젝트 수정',
      subtitle: '메타데이터, 태그, 배포 링크, 설명을 최신 상태로 고도화하고 Firestore에 즉시 반영합니다.',
      adminModeNote: '관리자 권한으로 이 Firestore 등록 프로젝트를 수정하고 있습니다.',
      immutableNote: '고유 식별자(slug), 좋아요·북마크 수, 검증 상태는 무결성을 위해 변경되지 않습니다.',
      slugLabel: '슬러그',
      statusLabel: '검증 상태',
      lastUpdatedLabel: '마지막 수정',
      githubSyncHeading: 'GitHub 저장소 메타데이터 재조회',
      githubSyncHint: '최신 스타·포크·라이선스를 반영합니다. 비어 있는 소개/스택 필드만 자동으로 채워 기존 작성 내용을 보호합니다.',
      githubFillEmptyButton: '최신 GitHub 동기화',
      thumbnailUrlLabel: '썸네일 이미지 URL (https://)',
      thumbnailPreviewLabel: '썸네일 미리보기',
      sectionBasic: '기본 정보 및 소개',
      sectionClassification: '분류 · 기술 스택 · 인프라',
      sectionLinksMaker: '외부 링크 · 썸네일 · 메이커',
      resetButton: '변경 되돌리기',
      cancelButton: '취소',
      saveButton: '변경사항 저장',
      savingButton: '저장 중...',
      noChangesHint: '아직 수정된 항목이 없습니다.',
      changedCountSuffix: '개 항목 수정됨',
      closeLabel: '수정 창 닫기',
    },
    mobileDemo: {
      sectionTitle: '모바일 앱 출시 & 인터랙티브 데모 설정',
      sectionSubtitle: 'iOS · Android · PWA 지원 정보, 스토어 링크, 디바이스 시뮬레이터 및 QR 테스트 URL을 구성하세요.',
      enableToggleLabel: '모바일 앱 / PWA 디바이스 데모 활성화',
      enableToggleHint: '웹 앱이나 AI 툴도 모바일 미리보기 프레임과 QR 테스트 링크를 함께 제공할 수 있습니다.',
      targetPlatformsLabel: '지원 모바일 OS / 환경',
      quickMobileStackLabel: '모바일 프레임워크 빠른 추가',
      mobileDemoUrlLabel: '모바일 인터랙티브 데모 URL (Expo Snack / PWA / 모바일 웹)',
      mobileDemoUrlPlaceholder: 'https://snack.expo.dev/... 또는 https://m.example.com',
      iosAppStoreLabel: 'App Store / TestFlight URL',
      iosAppStorePlaceholder: 'https://apps.apple.com/... 또는 https://testflight.apple.com/...',
      androidPlayStoreLabel: 'Google Play URL',
      androidPlayStorePlaceholder: 'https://play.google.com/store/apps/details?id=...',
      mobilePackageUrlLabel: '직접 빌드 / APK / IPA / Expo URL',
      mobilePackageUrlPlaceholder: 'https://expo.dev/... 또는 https://github.com/.../releases',
      bundleIdLabel: '번들 / 패키지 ID',
      bundleIdPlaceholder: 'com.wvibe.app',
      minOsLabel: '최소 OS 요구사항',
      minOsPlaceholder: 'iOS 16+ / Android 13+',
      devicePresetLabel: '기본 디바이스 프레임',
      orientationLabel: '기본 화면 방향',
      presetIphone: 'iPhone 16',
      presetPixel: 'Pixel 9',
      orientationPortrait: '세로 (Portrait)',
      orientationLandscape: '가로 (Landscape)',
      liveSubmitPreviewTitle: '실시간 모바일 디바이스 프리뷰 & QR 테스트',
      liveSubmitPreviewSubtitle: '입력한 정보가 상세 페이지의 모바일 시뮬레이터에 어떻게 표시되는지 바로 확인하세요.',
      simulatorTitle: '인터랙티브 모바일 데모 시뮬레이터',
      simulatorSubtitle: '디바이스 프레임 전환, 세로/가로 회전 및 스마트폰 QR 즉시 테스트를 지원합니다.',
      modeAppCard: '인터랙티브 앱 카드',
      modeLiveFrame: '실시간 웹/Expo 프레임',
      openExternalButton: '새 탭에서 열기',
      copyDemoLinkButton: '모바일 테스트 링크 복사',
      copiedLinkLabel: '링크 복사됨',
      iframeFallbackNotice: '외부 사이트 보안 정책(X-Frame-Options)으로 임베드가 제한된 경우 앱 카드 모드나 새 탭 열기를 이용하세요.',
      iframeBlockedButton: '앱 카드 프리뷰로 보기',
      qrTitle: '스마트폰에서 바로 테스트 (QR)',
      qrSubtitleDemo: '카메라로 스캔하면 라이브 모바일 데모가 휴대폰에서 바로 열립니다.',
      qrSubtitleStore: '카메라로 스캔하면 스토어/빌드 다운로드 페이지로 이동합니다.',
      qrSubtitleShare: '카메라로 스캔하면 W-Vibe 모바일 프로젝트 페이지로 이동합니다.',
      storeLinksTitle: '스토어 & 빌드 배포 링크',
      noStoreLinksNote: '등록된 스토어 또는 직접 빌드 링크가 아직 없습니다.',
      specsTitle: '모바일 앱 사양',
      cardBadgeLabel: '모바일 데모',
      previewTabOverview: '개요',
      previewTabFeatures: '기술 스택',
      previewTabRelease: '출시 정보',
      previewInteractiveCta: '모바일 데모 실행',
    },
    footer: {
      tagline: 'W-Vibe — AI · MCP · Skills 디렉터리',
      transparencyNote: 'GitHub 스타와 내부 시그널은 분리 집계됩니다.',
    },
    voiceSearch: {
      startLabel: '음성으로 검색',
      stopLabel: '음성 입력 중지',
      listeningStatus: '듣고 있습니다... 검색어를 말씀해 주세요',
      stopButton: '중지',
      unsupportedError: '이 브라우저는 음성 검색(Web Speech API)을 지원하지 않습니다. Chrome 또는 Edge에서 이용해 주세요.',
      permissionDeniedError: '마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 접근을 허용해 주세요.',
      noSpeechError: '음성이 감지되지 않았습니다. 마이크에 대고 다시 말씀해 주세요.',
      audioCaptureError: '마이크 장치를 찾을 수 없습니다. 오디오 입력 장치를 확인해 주세요.',
      networkError: '음성 인식 서버와 연결하지 못했습니다. 네트워크 상태를 확인해 주세요.',
      unknownError: '음성 인식을 완료하지 못했습니다. 잠시 후 다시 시도해 주세요.',
      dismissError: '닫기',
    },
    githubStarsPage: {
      title: 'GitHub 스타 Top 100 랭킹',
      subtitle: 'GitHub 공식 Search REST API 기준 최다 스타 저장소 1위부터 100위까지 실시간 집계입니다 (W-Vibe 내부 좋아요·북마크와 분리 집계).',
      refreshButton: '실시간 새로고침',
      refreshing: '불러오는 중...',
      presetAll: '전체 Top 100',
      presetWebApps: '웹 애플리케이션',
      presetAiAgents: 'AI · 에이전트 · MCP',
      presetTypescript: 'TypeScript',
      presetPython: 'Python',
      presetRust: 'Rust',
      presetGo: 'Go',
      kpiRankedCount: '집계 순위',
      kpiTopStars: '1위 저장소 스타',
      kpiMedianStars: '중앙값 스타 (50위권)',
      kpiLastUpdated: '마지막 동기화',
      cachedFallbackBadge: '캐시 데이터 표시 중',
      searchPlaceholder: 'Top 100 내 저장소명, 설명, 토픽 검색...',
      allLanguagesOption: '모든 언어',
      showingCountLabel: '개 저장소 표시',
      colRank: '순위',
      colRepository: '저장소',
      colLanguageLicense: '언어 · 라이선스',
      colForks: 'Forks',
      colStars: 'GitHub 스타',
      colActions: '링크',
      openInVibeAtlas: 'W-Vibe 상세',
      openGithub: 'GitHub',
      emptyFilteredTitle: '필터 조건에 일치하는 저장소가 없습니다',
      emptyFilteredBody: '검색어나 언어 필터를 초기화해 전체 100위 목록을 확인해 보세요.',
      resetFilterButton: '필터 초기화',
      errorTitle: 'GitHub 스타 랭킹을 불러오지 못했습니다',
      dataUnavailableTitle: '데이터를 사용할 수 없습니다',
      dataUnavailableBody: '랭킹 API가 일시적으로 점검 중이거나 유효하지 않은 응답(HTML 오류 페이지 등)을 반환했습니다. 잠시 후 다시 시도해 주세요.',
      retryButton: '다시 시도',
      rateLimitResetPrefix: 'API 할당량 초기화 예정',
      translatingDescriptions: '저장소 설명 한국어 번역 중...',
      translatedBadge: '번역됨',
      showOriginal: '원문 보기',
      showTranslated: '번역 보기',
      translationErrorNotice: '실시간 번역 서비스 연결이 원활하지 않아 GitHub 원문 설명을 표시하고 있습니다.',
    },
  },
  en: {
    nav: {
      home: 'Home',
      discover: 'Discover',
      githubStars: 'GitHub Stars',
      makers: 'Makers',
      submit: 'Submit',
      primaryCta: 'Submit Project',
      searchPlaceholder: 'Search projects or tags...',
      searchAriaLabel: 'Search projects and tags',
      searchClear: 'Clear search',
      searchToggle: 'Toggle search',
      searchProjectsHeading: 'Projects',
      searchTagsHeading: 'Tags',
      searchTagCountSuffix: 'projects',
      searchNoResults: 'No matching projects or tags found.',
      searchActionSubmit: 'Search all results (Enter)',
    },
    workspace: {
      savedBookmarks: 'Bookmarks',
      signInGoogle: 'Google Sign In',
      signOut: 'Sign Out',
      makerAccount: 'Maker Account',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      soundOn: 'Sound On',
      soundOff: 'Sound Off',
      koreanSearchNoteTitle: 'Multilingual Search Strategy',
      koreanSearchNoteBody:
        'Standard English word stemmers skip Korean agglutinative tokens. W-Vibe pairs case-insensitive Korean/English substring matching with curated bilingual tech term expansion.',
      authErrorClose: 'Dismiss',
      authUnauthorizedTitle: 'This deployed domain is not yet authorized in Firebase Authentication',
      authUnauthorizedBody:
        'To enable Google Sign-In on a newly deployed GitHub / Vercel domain, add the hostname below to Authorized domains in the Firebase Console. Browsing, likes, and local bookmarks still work without signing in.',
      authUnauthorizedSteps:
        'Firebase Console → Authentication → Settings → Authorized domains → Add domain',
      authUnauthorizedCopyDomain: 'Copy domain',
      authUnauthorizedCopied: 'Copied',
      authUnauthorizedOpenConsole: 'Open Firebase Authorized Domains',
      authPopupBlockedTitle: 'Google Sign-In popup was blocked by your browser',
      authPopupBlockedBody:
        'Allow popups for this site and retry, or continue using redirect sign-in below.',
      authPopupRedirectButton: 'Sign in via Redirect',
      authCancelledNotice: 'Google Sign-In was cancelled before completion.',
      authNetworkErrorBody: 'Network connection failed during Google Sign-In. Please retry shortly.',
      authGenericErrorTitle: 'Google Sign-In encountered an error',
    },
    hero: {
      kicker: 'Verifiable AI Atlas',
      headline: 'Discover AI apps, MCP & Skills',
      subheadline: 'Transparent metadata with GitHub stars kept separate from community signals.',
      searchPlaceholder: 'Search MCP, Lovable, Agents, Supabase...',
      searchButton: 'Search',
      quickBrowseLabel: 'Browse',
    },
    home: {
      trendingTab: 'Trending',
      newlyLaunchedTab: 'New Launches',
      risingOssTab: 'Rising OSS',
      viewAllDiscover: 'Explore All',
      mcpAndSkillsTitle: 'MCP Servers & AI Skills',
      mcpAndSkillsSubtitle: 'Verified agent tools and protocols',
      stacksTitle: 'Stack Curation',
      stacksSubtitle: 'Filtered by modern AI build stacks',
      koreanGlobalTitle: 'Global & KR Makers',
      koreanGlobalSubtitle: 'Indie builders shipping from Seoul and worldwide',
      featuredMakersTitle: 'Featured Makers',
      featuredMakersSubtitle: 'Builders with verified repos',
      submitCtaTitle: 'Ship & showcase your AI tool',
      submitCtaBody: 'Instant launch spotlight and one-click share kit.',
      submitCtaButton: 'Submit Project',
      newsletterTitle: 'Weekly Digest',
      newsletterBody: 'Top new MCP servers & AI tools every week',
      newsletterPlaceholder: 'Email (Google sign-in)',
      newsletterButton: 'Subscribe',
      newsletterSignInNotice: 'Sign in with Google to subscribe',
      newsletterSuccess: 'Subscribed!',
      promoTitle: 'Launch Showcase',
      promoSubtitle: 'Fresh submissions with instant share kits',
      promoTabAll: 'All',
      promoTabSubmitted: 'Submitted',
      promoTabDemoReady: 'Live Demo',
      promoCtaSubmit: 'Submit & Share',
      promoKitHeading: 'Share Kit',
      promoToneCommunity: 'Community',
      promoToneSocial: 'Social',
      promoCopyLinkButton: 'Copy Link',
      promoCopyPitchButton: 'Copy Pitch',
      promoCopiedLabel: 'Copied',
      promoOpenDetailButton: 'Details',
      promoLiveDemoButton: 'Live Demo',
      promoSubmittedLabel: 'Maker Submitted',
      promoCuratedLabel: 'Curated',
      promoEmptyFilterTitle: 'No matching launches yet',
      promoEmptyFilterBody: 'Submit your project to feature it here.',
      promoCountLiveSuffix: 'live',
      trending24hTitle: '24h GitHub Surge',
      trending24hSubtitle: 'Fastest-rising repos over the last 24 hours',
      trending24hAllLanguages: 'All',
      trending24hRefreshButton: 'Refresh',
      trending24hViewLeaderboard: 'Leaderboard',
      trending24hStarsSuffix: '/ 24h',
      trending24hSourceSnapshot: '24h Snapshot',
      trending24hSourceRate: '24h Velocity',
      trending24hOpenCatalog: 'Details',
      trending24hOpenGithub: 'GitHub',
      trending24hEmptyTitle: 'No 24h trending repos for this language',
      trending24hEmptyBody: 'Switch to all languages or refresh.',
      trending24hResetLanguage: 'All Languages',
      trending24hErrorTitle: 'Could not load 24h GitHub metrics',
      trending24hRetryButton: 'Retry',
      recentActivityTitle: 'Live Activity',
      recentActivitySubtitle: 'Real-time submissions, likes, and bookmarks',
      recentActivityFilterAll: 'All',
      recentActivityFilterSubmissions: 'Submissions',
      recentActivityFilterLikes: 'Likes',
      recentActivityFilterBookmarks: 'Bookmarks',
      recentActivityAutoScrollOn: 'Auto-scroll',
      recentActivityAutoScrollPaused: 'Paused',
      recentActivityActionSubmitted: 'submitted',
      recentActivityActionLiked: 'liked',
      recentActivityActionBookmarked: 'bookmarked',
      recentActivityCommunityActor: 'W-Vibe Community',
      recentActivityGuestActor: 'Guest Visitor',
      recentActivityLiveLabel: 'Live',
      recentActivityDeltaSuffix: 'recent',
      recentActivityOpenProject: 'Inspect',
      recentActivityEmptyTitle: 'No recent activity in this category',
      recentActivityEmptyBody: 'Submit a project, or click like or bookmark on any listing to see updates stream here.',
      recentActivityLiveCountSuffix: 'events',
      recentActivityShowAllButton: 'Show All Activity',
    },
    discover: {
      title: 'Discover',
      subtitle: 'Filters sync directly with your URL.',
      filtersHeading: 'Filters',
      mobileFiltersButton: 'Filters',
      resetFilters: 'Reset Filters',
      searchPlaceholder: 'Search keywords, stack, makers, repos...',
      sortLabel: 'Sort',
      resultsCount: ' results',
      emptyTitle: 'No matching projects found',
      emptyBody: 'Try broadening your filters or clearing the search query.',
      previousPage: 'Previous',
      nextPage: 'Next',
      filterType: 'Content Type',
      filterCategory: 'Category',
      allCategoriesOption: 'All Categories',
      filterTags: 'Project Tags',
      clearTags: 'Clear tags',
      activeTagsPrefix: 'Active tags',
      tagsHint: 'Select multiple tags to narrow results.',
      filterPlatform: 'Dev Platform',
      filterHosting: 'Hosting',
      filterBackend: 'Backend',
      filterCountry: 'Country',
      filterLanguage: 'Language',
      filterLicense: 'License',
      filterPricing: 'Pricing',
      filterVerification: 'Verification',
      filterMinStars: 'Min GitHub Stars',
      filterUpdatedWithin: 'Last Updated',
      allOption: 'All',
      webAppsTop100Title: 'Web Applications Top #1 – #100 (Full View)',
      webAppsTop100Subtitle: 'Rendering all #1 through #100 open-source web applications directly from the GitHub Search REST API.',
      webAppsLoading: 'Loading Web Applications #1 – #100...',
      webAppsError: 'Unable to fetch live Web Applications #1 – #100; showing local catalog entries.',
      webAppsRetry: 'Retry',
      summaryRegionLabel: 'Catalog summary metrics',
      summaryTotalProjectsLabel: 'Total Projects',
      summaryVerifiedSuffix: 'verified',
      summaryMatchingSuffix: 'matching',
      summaryPopularCategoryLabel: 'Most Popular Category',
      summaryCategoryShareUnit: 'projects',
      summaryFilterCategoryAction: 'Filter',
      summaryGrowthTrendsLabel: 'Recent Growth Trends',
      summaryGrowthStarsUnit: '7d GitHub stars',
      summaryGrowthSignalsUnit: '7d community signals',
      summaryRisingProjectsSuffix: 'rising',
      summaryNoGrowthYet: 'No 7d delta yet',
      typeFilterBarLabel: 'Quick project type filter',
      typeFilterClearLabel: 'Reset',
    },
    projectGrowth: {
      title: 'Project Growth',
      subtitle: 'Daily new project submissions and 7-day rolling pace across the last 30 days.',
      toggleExpand: 'Expand Project Growth',
      toggleCollapse: 'Collapse Project Growth',
      modeDaily: 'Daily',
      modeCumulative: 'Cumulative',
      scopeAll: 'All Catalog',
      scopeFiltered: 'Filtered',
      kpiNew30d: 'New (30d)',
      kpiPeakDay: 'Peak Day',
      kpiWeeklyPace: 'Weekly Pace',
      kpiCatalogTotal: 'Catalog Total',
      perWeekUnit: '/wk',
      catalogGrowthSuffix: 'catalog expansion',
      activeDaysSuffix: 'active days',
      dailySeriesLabel: 'New Submissions',
      rollingAvgLabel: '7d Trend Avg',
      cumulativeSeriesLabel: 'Cumulative Projects',
      tooltipProjectsLabel: 'Submitted',
      tooltipMoreSuffix: 'more',
      noPeakYet: 'None yet',
      emptyTitle: 'No new submissions in the last 30 days',
      emptyFilteredBody: 'No matching projects were submitted during this 30-day window. Reset filters or inspect the full catalog.',
      emptyCatalogBody: 'Submit a project to start plotting 30-day catalog submission momentum.',
      resetFilterButton: 'Reset filters',
      submitProjectButton: 'Submit Project',
    },
    trendingSection: {
      title: 'Trending & Growth Velocity',
      subtitle: 'D3-powered visualization of rising projects by 30-day star delta and verified daily growth velocity.',
      toggleExpand: 'Expand chart',
      toggleCollapse: 'Collapse chart',
      tabStar30d: '30d Star Growth',
      tabStar7d: '7d Rising',
      tabSignalVelocity: 'Community Velocity',
      chartHeading: 'Fastest Rising Projects',
      trajectoryHeading: 'Daily Cumulative Trajectory',
      unitStars: 'stars',
      unitSignals: 'signals',
      perDaySuffix: '/day',
      periodDeltaLabel: 'Period Growth',
      dailyVelocityLabel: 'Daily Velocity',
      currentTotalLabel: 'Current Total',
      inspectButton: 'Inspect',
      emptyStarTitle: 'Multi-day GitHub star snapshots not yet recorded',
      emptyStarBody: 'Sync repositories across multiple days to plot 30-day and 7-day GitHub star growth velocity here.',
      switchToSignalButton: 'View Community Velocity',
      emptyFilteredTitle: 'No velocity data matches active filters',
      emptyFilteredBody: 'Broaden your filters to inspect growth velocity across rising projects.',
      fallbackNote: 'Showing verified W-Vibe engagement velocity while multi-day GitHub star snapshots accumulate.',
    },
    githubTrendingBubble: {
      title: 'GitHub Trending',
      subtitle: 'D3 bubble chart sizing the most active AI ecosystem repositories by daily star count.',
      toggleExpand: 'Expand bubble chart',
      toggleCollapse: 'Collapse bubble chart',
      refreshButton: 'Refresh',
      refreshing: 'Refreshing...',
      allLanguages: 'All Languages',
      perDaySuffix: '/day',
      dailyStarsLabel: 'Daily Stars',
      totalStarsLabel: 'Total Stars',
      forksLabel: 'Forks',
      pushedLabel: 'Last Push',
      topMoversHeading: 'Top Daily Movers',
      openGithubButton: 'Open on GitHub',
      inspectVibeAtlasButton: 'Inspect in W-Vibe',
      loadingLabel: 'Loading active AI ecosystem repositories...',
      emptyTitle: 'No trending repositories match this language',
      emptyBody: 'Reset the language filter to view all active AI ecosystem bubbles.',
      resetLanguageButton: 'Show All Languages',
      errorTitle: 'Unable to load GitHub Trending repositories',
      retryButton: 'Retry',
      cachedNotice: 'Cached snapshot',
      rateModeVelocity: 'Sized by daily star accrual',
      rateModeSnapshot: 'Sized by 24h snapshot delta',
      reposCountLabel: 'active repos',
      clickHint: 'Hover or click any bubble to inspect repository details',
    },
    discoveryMap: {
      title: 'Ecosystem Visual Discovery Map',
      subtitle: 'D3 scatter plot positioning projects by GitHub stars (X-axis, log scale) and activity frequency (Y-axis).',
      toggleExpand: 'Expand discovery map',
      toggleCollapse: 'Collapse discovery map',
      scopeEcosystem: 'Full Ecosystem',
      scopeDirectory: 'Directory Filtered',
      scopeVerifiedMakers: 'Verified Makers',
      allTypes: 'All Types',
      xAxisLabel: 'GitHub Stars (symlog)',
      yAxisLabel: 'Activity Frequency (0–100)',
      quadrantLeaders: 'Ecosystem Leaders',
      quadrantActiveBuilders: 'Active Rising Builders',
      quadrantEstablished: 'Established Steady',
      quadrantEmerging: 'Emerging / Niche',
      spotlightHeading: 'Node Spotlight',
      starsMetricLabel: 'GitHub Stars',
      activityMetricLabel: 'Activity Freq',
      dailyVelocityLabel: 'Daily Velocity',
      recencyLabel: 'Last Active',
      todayLabel: 'Today',
      daysAgoSuffix: 'd ago',
      sourceDirectory: 'W-Vibe Directory',
      sourceEnriched: 'Directory + Live GitHub',
      sourceEcosystem: 'GitHub AI Ecosystem',
      inspectButton: 'Inspect Detail',
      openGithubButton: 'Open GitHub',
      emptyTitle: 'No projects match this map selection',
      emptyBody: 'Switch back to All Types or reset directory filters to explore the full ecosystem scatter map.',
      resetMapFilter: 'Reset Map Filter',
      resetFiltersButton: 'Reset Directory Filters',
      pointsCountLabel: 'mapped nodes',
      interactionHint: 'Hover or click any node to inspect metrics and quadrant fit',
      medianGuideNote: 'Dashed: median split',
    },
    card: {
      githubStars: 'GitHub Stars',
      internalLikes: 'Likes',
      internalBookmarks: 'Bookmarks',
      notSynced: 'Not synced',
      staleLabel: 'Stale sync',
      verifiedLabel: 'Verified',
      pendingLabel: 'Pending',
      unverifiedLabel: 'Unverified',
      missingLicense: 'License unspecified',
      openDetail: 'Inspect',
      likeAction: 'Like',
      bookmarkAction: 'Bookmark',
      trendingBadge: 'Trending',
      trending7dTooltip: 'Gained +{count} GitHub stars in the last 7 days',
      trendingEngagementTooltip: 'Gained +{likes} likes and +{bookmarks} bookmarks (+{total}) in the last 7 days',
      compareAdd: 'Compare',
      compareSelected: 'In Compare',
      starHistory7d: '7d star trend',
      starHistoryBaseline: 'Baseline',
      starHistoryNoSnapshots: 'No snapshots',
      statusBadgesLabel: 'Project status badges',
      openSourceBadge: 'Open Source',
      openSourceTooltip: 'Published as an open-source project.',
      openSourceWithLicenseTooltip: 'Open-source project ({license} license)',
      verifiedTooltip: 'Repository and metadata have been verified.',
      pendingTooltip: 'Metadata and ownership verification is in progress.',
      unverifiedTooltip: 'Not yet officially verified.',
    },
    highlights: {
      containerLabel: 'Project highlights',
      featured: 'Featured',
      newArrival: 'New Arrival',
      highActivity: 'High Activity',
      featuredTooltip: 'Editorial spotlight based on verified metadata and top community standing.',
      newArrivalTooltip: 'Recently added to W-Vibe on {date}.',
      highActivityTooltip: 'Sustained recent engagement and repository update momentum.',
      highActivityStarsTooltip: 'High repository momentum with +{count} GitHub stars in the last 7 days.',
      highActivitySignalsTooltip: 'High community momentum with +{count} likes and bookmarks in the last 7 days.',
    },
    verification: {
      claimedBadge: 'Maker Verified',
      claimedTooltip: 'Maker identity and project ownership are verified on W-Vibe.',
      pendingBadge: 'Claim Pending',
      pendingTooltip: 'Ownership verification claim submitted and currently under review.',
      unclaimedBadge: 'Unclaimed',
      panelTitleClaimed: 'Verified Maker Ownership',
      panelBodyClaimed:
        'The official maker has claimed and verified this listing on W-Vibe, confirming authentic links, license attribution, and stewardship.',
      panelTitlePending: 'Maker Claim Under Review',
      panelBodyPending:
        'An ownership verification claim has been submitted and is awaiting review. Once approved, the verified maker seal appears on all cards.',
      panelTitleUnclaimed: 'Unclaimed Directory Listing',
      panelBodyUnclaimed:
        'Indexed from public metadata or community curation. If you built this project, claim ownership to display the verified maker seal.',
      attributionLabel: 'Maker',
      methodLabel: 'Method',
      statusLabel: 'Status',
      statusClaimed: 'Claimed & Verified',
      statusPending: 'Pending Verification',
      statusUnclaimed: 'Not Yet Claimed',
      ownerTag: 'Your Listing',
      methodGithub: 'GitHub Repository',
      methodDns: 'Domain DNS TXT',
      methodDemo: 'Live Demo Meta Tag',
      methodDirect: 'Verified Maker Submission',
      claimCta: 'Claim This Project',
    },
    compare: {
      trayTitle: 'Compare Projects',
      trayHintOneMore: 'Select at least 1 more project to compare side-by-side (up to 3).',
      trayLimitNotice: 'You can compare up to 3 projects at once. Remove one to add another.',
      emptySlotLabel: 'Empty slot',
      compareNowButton: 'Compare Side-by-Side',
      clearButton: 'Clear All',
      removeAction: 'Remove from comparison',
      modalTitle: 'Side-by-Side Project Comparison',
      modalSubtitle: 'Compare verifiable GitHub metrics (stars, forks, license) alongside build stack and metadata.',
      closeButton: 'Close',
      colAttribute: 'Attribute',
      sectionGithub: 'GitHub Metrics',
      sectionMetadata: 'Stack & Metadata',
      sectionCommunity: 'Community Signals & Links',
      rowGithubStars: 'GitHub Stars',
      rowGithubForks: 'GitHub Forks',
      rowLicense: 'License',
      rowRepository: 'Repository',
      rowLastSynced: 'Last Synced',
      rowContentType: 'Content Type',
      rowCategories: 'Categories',
      rowPlatform: 'Dev Platform',
      rowHostingBackend: 'Hosting & Backend',
      rowTechStack: 'Tech Stack',
      rowPricing: 'Pricing Model',
      rowVerification: 'Verification & Source',
      rowCountryLang: 'Country & Language',
      rowUpdatedAt: 'Last Updated',
      rowEngagement: 'Likes & Bookmarks',
      rowLinks: 'Links',
      highestBadge: 'Highest',
      latestBadge: 'Latest',
      openDetail: 'Inspect',
      notAvailable: 'N/A',
    },
    detail: {
      close: 'Close',
      externalLinksTitle: 'External Links (Leaves W-Vibe)',
      internalActionsTitle: 'W-Vibe Actions',
      liveDemo: 'Live Demo',
      officialWebsite: 'Official Website',
      githubRepository: 'GitHub Repo',
      syncGithubNow: 'Sync GitHub Now',
      syncing: 'Syncing...',
      provenanceTitle: 'Metadata Provenance & Freshness',
      provenanceSourceLabel: 'Source',
      lastSyncedLabel: 'Last Synced',
      missingFieldsLabel: 'Missing / Unverified Fields',
      noneMissing: 'All core metadata fields present',
      techAndPlatformTitle: 'Stack & Platform Attribution',
      platformLabel: 'Platform',
      hostingLabel: 'Hosting',
      backendLabel: 'Backend',
      licenseLabel: 'License',
      pricingLabel: 'Pricing',
      countryLangLabel: 'Country / Language',
      historyChartTitle: '14-Day Growth History (GitHub Stars & Internal Signals)',
      historyChartSubtitle: 'External GitHub stars and internal W-Vibe engagement are plotted on separate charts.',
      chartTabStars: 'GitHub Stars',
      chartTabInternal: 'Internal Signals',
      chartUnsyncedStarsHint: 'GitHub repository has not been synced yet. Sync now to plot live star totals.',
      chartLiveTotalLabel: 'Current GitHub Stars',
      chartDeltaLabel: '14d Gain',
      chartBaselineNote: 'Live baseline snapshot (daily deltas build over multiple sync days)',
      relatedTitle: 'Related Projects & Alternatives',
      reportButton: 'Report Issue',
      claimButton: 'Claim Ownership',
      reportTitle: 'Report Inaccurate or Broken Listing',
      claimTitle: 'Request Maker Ownership Verification',
      submitReport: 'Submit Report',
      submitClaim: 'Submit Claim',
      actionSubmitted: 'Saved securely to Firestore.',
      signInRequired: 'Please sign in with Google to save this action.',
      communityActivityTitle: 'Community Activity',
      communityActivitySubtitle: 'Chronological feed of recent likes, bookmarks, and reports for this project.',
      activityFilterAll: 'All',
      activityFilterLikes: 'Likes',
      activityFilterBookmarks: 'Bookmarks',
      activityFilterReports: 'Reports',
      activityActionLike: 'liked this project',
      activityActionBookmark: 'bookmarked this project',
      activityActionReport: 'submitted a report',
      activityGuestActor: 'Community visitor',
      activityEmptyTitle: 'No recent interactions recorded yet',
      activityEmptySubtitle: 'Like, bookmark, or report this project above to see real-time chronological activity here.',
      activityLoadingLabel: 'Loading recent activity...',
      activityErrorNotice: 'Unable to sync live Firestore activity; showing local interactions.',
      activityReasonBrokenLink: 'Broken link',
      activityReasonStaleMetadata: 'Stale metadata',
      activityReasonMisattribution: 'Wrong attribution',
      activityReasonSpam: 'Spam',
      activityReasonSecurityConcern: 'Security concern',
      vibeScoreTitle: 'Vibe Score · Activity Health',
      vibeScoreSubtitle: 'Transparent D3 health gauge derived from internal W-Vibe engagement, momentum, verification freshness, and synced GitHub traction.',
      vibeScoreOutOf100: '/ 100',
      vibeScoreTierThriving: 'Thriving',
      vibeScoreTierActive: 'Active',
      vibeScoreTierWarm: 'Warm',
      vibeScoreTierQuiet: 'Quiet',
      vibeScorePillarAffinity: 'Community Affinity (Likes · Bookmarks)',
      vibeScorePillarMomentum: 'Recent Activity Momentum',
      vibeScorePillarTraction: 'Synced GitHub Traction',
      vibeScorePillarHealth: 'Verification & Freshness',
      vibeScoreUnsyncedNote: 'GitHub not synced yet (external traction is 0 until synced)',
      vibeScoreReportsPenalty: 'Sentiment deduction from open reports',
      vibeScoreFormulaNote: 'Combines up to 75 internal W-Vibe health points with up to 25 synced GitHub traction points.',
      sharePromoteTitle: 'Promote & Share',
      copyDirectLink: 'Copy Share Link',
      copyPromoPitch: 'Copy Promo Copy',
      copiedFeedback: 'Copied',
      timelineTitle: 'Project Timeline & Milestones',
      timelineSubtitle: 'Chronological vertical timeline combining GitHub releases, recent repository commits, and creator-published logs.',
      timelineFilterAll: 'All',
      timelineFilterReleases: 'Releases',
      timelineFilterCommits: 'Commits',
      timelineFilterCreatorLogs: 'Creator Logs',
      timelineSortNewest: 'Newest first',
      timelineSortOldest: 'Oldest first',
      timelineAddButton: 'Log Milestone',
      timelineCloseComposer: 'Close Form',
      timelineCadenceLabel: 'Activity Cadence',
      timelineSpanDaysSuffix: 'd span',
      timelineGapSuffix: 'd interval',
      timelineLoadingLabel: 'Fetching repository releases and commits from GitHub...',
      timelineRepoErrorNotice: 'GitHub repository activity could not be loaded right now; showing catalog and creator entries.',
      timelineNoRepoNote: 'No linked GitHub repository — showing directory provenance and creator logs.',
      timelineEmptyTitle: 'No milestones match this filter',
      timelineEmptyBody: 'Switch back to All to inspect repository and directory milestones.',
      timelineEmptyCreatorBody: 'No creator-added milestone logs have been published for this listing yet.',
      timelineAuthNoticeSignedOut: 'Sign in with Google as the project owner to publish official milestone logs.',
      timelineAuthNoticeNotOwner: 'Only the registered project owner or an administrator can publish creator logs. Submit an ownership claim above if you built this project.',
      timelineSignInCta: 'Sign in with Google',
      timelineClaimCta: 'Open Ownership Claim',
      timelineKindLabel: 'Milestone Type',
      timelineKindRelease: 'Release',
      timelineKindLaunch: 'Launch',
      timelineKindFeature: 'Feature',
      timelineKindUpdate: 'Update',
      timelineKindFix: 'Fix',
      timelineVersionLabel: 'Version Tag (optional)',
      timelineDateLabel: 'Date',
      timelineEntryTitleLabel: 'Milestone Title *',
      timelineSummaryLabel: 'Summary (optional)',
      timelineUrlLabel: 'Reference URL (optional)',
      timelinePublishButton: 'Publish Milestone',
      timelinePublishingButton: 'Publishing...',
      timelineDeleteButton: 'Delete milestone',
      timelineExternalLink: 'View Source',
      timelineSourceRelease: 'GitHub Release',
      timelineSourceCommit: 'Commit',
      timelineSourceCreator: 'Creator Log',
      timelineSourceCatalog: 'Catalog Event',
      volatilityTitle: 'Vibe Score Volatility vs. GitHub Star Growth Rate',
      volatilitySubtitle: 'D3 dual-trend analysis pairing Vibe Score dispersion (±σ band) against daily repository star growth rate.',
      volatilityModePace: 'Dual Trend',
      volatilityModeSwing: 'Daily Swing',
      volatilityMetricStdDev: 'Volatility (σ)',
      volatilityMetricNetVibe: '14d Vibe Shift',
      volatilityMetricStarRate: '14d Star Growth',
      volatilityMetricMaxSwing: 'Peak Daily Swing',
      volatilityVerdictLabel: 'Sentiment vs. Adoption Pace',
      volatilityVerdictKeepingPace: 'Keeping Pace with Adoption',
      volatilityVerdictKeepingPaceDesc: 'Community Vibe Score is climbing proportionally alongside external GitHub star growth.',
      volatilityVerdictSentimentLeading: 'Sentiment Leading Adoption',
      volatilityVerdictSentimentLeadingDesc: 'W-Vibe community sentiment and swing intensity are moving faster than current star growth.',
      volatilityVerdictAdoptionOutpacing: 'Adoption Outpacing Sentiment',
      volatilityVerdictAdoptionOutpacingDesc: 'Repository star adoption is accelerating faster than internal W-Vibe sentiment momentum.',
      volatilityVerdictUnsynced: 'GitHub Unsynced',
      volatilityVerdictUnsyncedDesc: 'Internal Vibe Score volatility is tracked live; sync GitHub to overlay real star growth rates.',
      volatilityVerdictBaseline: 'Single Snapshot Baseline',
      volatilityVerdictBaselineDesc: 'Baseline star count captured today. Daily star growth rates will plot across multi-day syncs.',
      volatilityLegendVibeScore: 'Vibe Score (0–100)',
      volatilityLegendBand: 'Volatility Band (±σ)',
      volatilityLegendStarRate: 'Star Growth Rate (%)',
      volatilityLegendSwing: 'Daily Vibe Delta (Δ)',
      volatilityLeftAxisLabel: 'Vibe Score',
      volatilityRightAxisLabel: 'Star Rate (%)',
      volatilitySwingAxisLabel: 'Daily Vibe Δ',
      volatilityScrubHint: 'Hover or select any date marker to inspect daily readings',
      volatilityDateLabel: 'Date',
      volatilityVibeDeltaLabel: 'Daily Vibe Δ',
      volatilityStarGainLabel: 'Daily Star Gain',
      insightsTitle: 'Project Insights · 7-Day Likes & Bookmarks',
      insightsSubtitle: 'D3 visualization comparing daily community likes and high-intent bookmarks across the 7-day window.',
      insightsModeDaily: 'Daily Gains',
      insightsModeCumulative: '7d Cumulative',
      insightsKpiLikes7d: '7d Likes Gained',
      insightsKpiBookmarks7d: '7d Bookmarks Gained',
      insightsKpiBookmarkShare: 'Bookmark Share',
      insightsKpiPeakDay: 'Peak Activity Day',
      insightsTotalPrefix: 'Total',
      insightsAvgPerDay: 'avg/day',
      insightsNoPeakDay: 'No activity',
      insightsScrubHint: 'Hover or select a day bar to inspect exact daily metrics',
      insightsDateLabel: 'Date',
      insightsCombinedLabel: 'Combined',
      insightsMixTitle: '7-Day Engagement Mix',
      insightsEmptyTitle: 'No likes or bookmarks recorded in this 7-day window yet.',
      insightsEmptyHint: 'Add a Like or Bookmark below to start tracking daily community velocity.',
      insightsAxisCount: 'Count',
      editProject: 'Edit Project',
      starGrowthTitle: 'Star Growth',
      starGrowthSubtitle: 'Historical GitHub star trajectory tracked in the W-Vibe daily snapshot store.',
      starGrowthRange7d: '7D',
      starGrowthRange30d: '30D',
      starGrowthRangeAll: 'All',
      starGrowthModeTotal: 'Total Stars',
      starGrowthModeDelta: 'Daily Delta',
      starGrowthKpiCurrent: 'Snapshot Stars',
      starGrowthKpiNet: 'Period Net Gain',
      starGrowthKpiAvgDay: 'Avg Daily Pace',
      starGrowthKpiSnapshots: 'Snapshots',
      starGrowthDaysSuffix: 'd',
      starGrowthPerDaySuffix: '/day',
      starGrowthNoRepo: 'No GitHub repository is linked to track star snapshots.',
      starGrowthUnsynced: 'No star snapshots recorded yet. Sync GitHub now to capture the baseline.',
      starGrowthSingleBaseline: 'Single snapshot captured so far. Growth curve builds as multi-day snapshots accumulate.',
      starGrowthTooltipTotal: 'Snapshot Stars',
      starGrowthTooltipDelta: 'Daily Delta',
      starGrowthTooltipCumulative: 'Window Gain',
      mobileViewToggle: 'Mobile View',
      mobileViewTitle: 'Mobile View Preview',
      mobileViewSubtitle: 'Inspect the project live demo wrapped inside a fixed smartphone screen aspect ratio.',
      mobileViewClose: 'Close Mobile View',
    },
    submit: {
      title: 'Submit a Project',
      subtitle: 'Publish verifiable metadata to the W-Vibe directory backed by Firestore.',
      promoPreviewTitle: 'Main Page Promotion Preview',
      promoPreviewSubtitle: 'Once published, your project appears in the Home Launch Showcase with this shareable snippet.',
      promoPreviewUntitled: 'Your AI Project (live preview)',
      promoPreviewTaglineFallback: 'Enter a concise tagline to generate your shareable launch pitch.',
      githubImportTitle: 'Import Metadata from GitHub',
      githubImportHint: 'e.g. modelcontextprotocol/servers or https://github.com/cline/cline',
      githubImportPlaceholder: 'Enter owner/repo or GitHub URL',
      githubFetchButton: 'Fetch Live Metadata',
      fetchingGithub: 'Fetching...',
      nameLabel: 'Project Name *',
      taglineEnLabel: 'English Tagline (5-220 chars) *',
      taglineKoLabel: 'Korean Tagline',
      descriptionEnLabel: 'English Description (min 20 chars) *',
      descriptionKoLabel: 'Korean Description',
      contentTypeLabel: 'Content Type',
      categoriesLabel: 'Categories / Tags (comma-separated, max 6) *',
      categoriesQuickTagsHint: 'Quick tag presets (click to toggle):',
      techStackLabel: 'Tech Stack (comma-separated, max 12)',
      platformLabel: 'Development Platform',
      hostingLabel: 'Hosting Provider',
      backendLabel: 'Backend Tech',
      countryLabel: 'Country Code (e.g. KR, US) *',
      languageLabel: 'Language',
      licenseLabel: 'License (e.g. MIT, Apache-2.0) *',
      pricingLabel: 'Pricing Model',
      liveDemoLabel: 'Live Demo URL (https://)',
      websiteLabel: 'Official Website URL (https://)',
      githubUrlLabel: 'GitHub URL (https://)',
      makerNameLabel: 'Maker / Team Name *',
      makerHandleLabel: 'Maker Handle (e.g. @handle)',
      submitButton: 'Publish Listing',
      submitting: 'Publishing...',
      signInPrompt: 'Sign in with Google to publish a verified listing to Firestore.',
      submitSuccess: 'Project published to the directory!',
      draftRestoredNotice: 'Restored your previous in-progress draft from local storage.',
      draftAutosaveHint: 'Your notes and settings are automatically saved to local storage every 30 seconds.',
      clearDraftButton: 'Discard Draft',
      validationSummaryPrefix: 'Please fix the highlighted fields',
    },
    maker: {
      title: 'Maker Studio',
      subtitle: 'Manage projects, bookmarks, and claims.',
      myProjectsTab: 'My Projects',
      myBookmarksTab: 'Bookmarks',
      claimsReportsTab: 'Claims & Reports',
      signInCtaTitle: 'Sign in with Google to access Maker Dashboard',
      signInCtaBody: 'Manage listings, sync live GitHub metrics, and keep bookmarks across devices.',
      noProjectsYet: 'You have not published any projects yet.',
      noBookmarksYet: 'No bookmarked projects yet.',
      resyncGithub: 'Re-sync GitHub',
      deleteProject: 'Delete',
      analyticsTitle: 'Project Engagement Analytics',
      analyticsSubtitle: 'Internal likes and bookmarks are tallied separately from external GitHub stars.',
      metricOwnedProjects: 'Owned Projects',
      metricTotalLikes: 'Total Likes',
      metricTotalBookmarks: 'Total Bookmarks',
      metricTotalEngagement: 'Total Engagement',
      metricExternalStarsNote: 'Combined external GitHub stars',
      analyticsSortEngagement: 'Engagement',
      analyticsSortLikes: 'Most Liked',
      analyticsSortBookmarks: 'Most Bookmarked',
      analyticsSortRecent: 'Newest',
      tableProjectCol: 'Project',
      tableLikesCol: 'Likes',
      tableBookmarksCol: 'Bookmarks',
      tableTotalCol: 'Total',
      tableSplitCol: 'Engagement Share',
      tableGithubCol: 'GitHub Stars',
      topProjectLabel: 'Top engaging project',
      analyticsEmptyHint: 'Publish a project to inspect likes, bookmarks, and engagement breakdown per listing.',
      projectListHeading: 'Your Listed Projects',
      likesUnit: 'likes',
      bookmarksUnit: 'bookmarks',
      engagementUnit: 'total',
      editProject: 'Edit',
      editSuccessNotice: 'Project updates have been saved.',
      confirmDeleteLabel: 'Confirm Delete',
      cancelDeleteLabel: 'Cancel',
      lastUpdatedPrefix: 'Updated',
      viewDetail: 'Details',
    },
    editModal: {
      title: 'Edit Owned Project',
      subtitle: 'Update metadata, tags, URLs, and descriptions cleanly in Firestore.',
      adminModeNote: 'Editing this Firestore listing with administrator privileges.',
      immutableNote: 'Slug, likes, bookmarks, and verification status are preserved for catalog integrity.',
      slugLabel: 'Slug',
      statusLabel: 'Verification',
      lastUpdatedLabel: 'Last Updated',
      githubSyncHeading: 'Refresh GitHub Repository Metadata',
      githubSyncHint: 'Pulls fresh stars, forks, and license while only filling blank description or stack fields.',
      githubFillEmptyButton: 'Sync Latest GitHub',
      thumbnailUrlLabel: 'Thumbnail Image URL (https://)',
      thumbnailPreviewLabel: 'Thumbnail Preview',
      sectionBasic: 'Core Identity & Copy',
      sectionClassification: 'Classification, Stack & Hosting',
      sectionLinksMaker: 'External Links, Thumbnail & Maker',
      resetButton: 'Discard Changes',
      cancelButton: 'Cancel',
      saveButton: 'Save Changes',
      savingButton: 'Saving...',
      noChangesHint: 'No modified fields yet.',
      changedCountSuffix: 'fields modified',
      closeLabel: 'Close edit modal',
    },
    mobileDemo: {
      sectionTitle: 'Mobile App Release & Interactive Demo Studio',
      sectionSubtitle: 'Configure target OS support, App Store / Google Play links, device simulator frame, and QR mobile test URL.',
      enableToggleLabel: 'Enable Mobile App / PWA Device Demo',
      enableToggleHint: 'Web apps and AI tools can also include a mobile viewport simulator and scannable QR link.',
      targetPlatformsLabel: 'Target Mobile Platforms',
      quickMobileStackLabel: 'Quick-add Mobile Stack',
      mobileDemoUrlLabel: 'Interactive Mobile Demo URL (Expo Snack / PWA / Mobile Web)',
      mobileDemoUrlPlaceholder: 'https://snack.expo.dev/... or https://m.example.com',
      iosAppStoreLabel: 'App Store / TestFlight URL',
      iosAppStorePlaceholder: 'https://apps.apple.com/... or https://testflight.apple.com/...',
      androidPlayStoreLabel: 'Google Play URL',
      androidPlayStorePlaceholder: 'https://play.google.com/store/apps/details?id=...',
      mobilePackageUrlLabel: 'Direct Build / APK / IPA / Expo URL',
      mobilePackageUrlPlaceholder: 'https://expo.dev/... or https://github.com/.../releases',
      bundleIdLabel: 'Bundle / Package ID',
      bundleIdPlaceholder: 'com.wvibe.app',
      minOsLabel: 'Minimum OS',
      minOsPlaceholder: 'iOS 16+ / Android 13+',
      devicePresetLabel: 'Default Simulator Frame',
      orientationLabel: 'Default Orientation',
      presetIphone: 'iPhone 16',
      presetPixel: 'Pixel 9',
      orientationPortrait: 'Portrait',
      orientationLandscape: 'Landscape',
      liveSubmitPreviewTitle: 'Live Mobile Device Preview & QR Test',
      liveSubmitPreviewSubtitle: 'Verify how your mobile simulator and scannable QR card will appear before publishing.',
      simulatorTitle: 'Interactive Mobile Demo Simulator',
      simulatorSubtitle: 'Switch device bezels, rotate orientation, and scan the QR code to test directly on your phone.',
      modeAppCard: 'Interactive App Card',
      modeLiveFrame: 'Live Web / Expo Frame',
      openExternalButton: 'Open in New Tab',
      copyDemoLinkButton: 'Copy Mobile Test Link',
      copiedLinkLabel: 'Link Copied',
      iframeFallbackNotice: 'If an external site blocks iframe embedding (X-Frame-Options), switch to App Card view or open in a new tab.',
      iframeBlockedButton: 'Switch to App Card Preview',
      qrTitle: 'Test on Your Phone (QR)',
      qrSubtitleDemo: 'Scan with your phone camera to launch the live mobile demo directly.',
      qrSubtitleStore: 'Scan with your phone camera to open the store or build download page.',
      qrSubtitleShare: 'Scan with your phone camera to view this project on W-Vibe.',
      storeLinksTitle: 'Store & Build Distribution Links',
      noStoreLinksNote: 'No store or direct build links listed yet.',
      specsTitle: 'Mobile App Specs',
      cardBadgeLabel: 'Mobile Demo',
      previewTabOverview: 'Overview',
      previewTabFeatures: 'Stack',
      previewTabRelease: 'Release',
      previewInteractiveCta: 'Launch Mobile Demo',
    },
    footer: {
      tagline: 'W-Vibe — Verifiable AI, MCP & Skills Index',
      transparencyNote: 'GitHub stars and internal signals are counted separately.',
    },
    voiceSearch: {
      startLabel: 'Search by voice',
      stopLabel: 'Stop voice input',
      listeningStatus: 'Listening... Speak your search query',
      stopButton: 'Stop',
      unsupportedError: 'Voice search (Web Speech API) is not supported in this browser. Please try Chrome or Edge.',
      permissionDeniedError: 'Microphone access was denied. Please allow microphone permission in your browser settings.',
      noSpeechError: 'No speech was detected. Please speak clearly and try again.',
      audioCaptureError: 'No microphone was detected. Check your audio input device.',
      networkError: 'Voice recognition network error. Check your connection and try again.',
      unknownError: 'Could not complete voice recognition. Please try again.',
      dismissError: 'Dismiss',
    },
    githubStarsPage: {
      title: 'GitHub Stars Top 100 Leaderboard',
      subtitle: 'Live top 100 most-starred repositories ranked directly via the GitHub Search REST API, kept separate from internal W-Vibe signals.',
      refreshButton: 'Refresh Live',
      refreshing: 'Loading...',
      presetAll: 'Global Top 100',
      presetWebApps: 'Web Apps',
      presetAiAgents: 'AI, Agents & MCP',
      presetTypescript: 'TypeScript',
      presetPython: 'Python',
      presetRust: 'Rust',
      presetGo: 'Go',
      kpiRankedCount: 'Ranked Repositories',
      kpiTopStars: '#1 Repository Stars',
      kpiMedianStars: 'Median Stars',
      kpiLastUpdated: 'Last Synced',
      cachedFallbackBadge: 'Cached snapshot',
      searchPlaceholder: 'Filter Top 100 by repo, description, or topic...',
      allLanguagesOption: 'All Languages',
      showingCountLabel: 'repositories shown',
      colRank: 'Rank',
      colRepository: 'Repository',
      colLanguageLicense: 'Language & License',
      colForks: 'Forks',
      colStars: 'GitHub Stars',
      colActions: 'Links',
      openInVibeAtlas: 'W-Vibe Detail',
      openGithub: 'GitHub',
      emptyFilteredTitle: 'No repositories match your filter',
      emptyFilteredBody: 'Clear your search query or language filter to inspect the full Top 100 ranking.',
      resetFilterButton: 'Reset Filters',
      errorTitle: 'Unable to load GitHub Top 100 leaderboard',
      dataUnavailableTitle: 'Data unavailable',
      dataUnavailableBody: 'The repository ranking service is temporarily unavailable or returned an unexpected HTML page instead of data. Please try again shortly.',
      retryButton: 'Retry',
      rateLimitResetPrefix: 'Rate limit resets around',
      translatingDescriptions: 'Translating repository descriptions...',
      translatedBadge: 'Translated',
      showOriginal: 'Original',
      showTranslated: 'Translated',
      translationErrorNotice: 'Showing original GitHub descriptions because live translation is currently unavailable.',
    },
  },
  zh: {
    nav: {
      home: '首页',
      discover: '探索',
      githubStars: 'GitHub 星标',
      makers: '创作者',
      submit: '提交项目',
      primaryCta: '提交项目',
      searchPlaceholder: '搜索项目或标签...',
      searchAriaLabel: '实时搜索项目与标签',
      searchClear: '清除搜索',
      searchToggle: '打开搜索',
      searchProjectsHeading: '匹配项目',
      searchTagsHeading: '匹配标签',
      searchTagCountSuffix: '个项目',
      searchNoResults: '未找到匹配的项目或标签。',
      searchActionSubmit: '查看全部搜索结果 (Enter)',
    },
    workspace: {
      savedBookmarks: '收藏夹',
      signInGoogle: 'Google 登录',
      signOut: '退出登录',
      makerAccount: '创作者账号',
      lightMode: '浅色模式',
      darkMode: '深色模式',
      soundOn: '音效开启',
      soundOff: '音效静音',
      koreanSearchNoteTitle: '多语言检索说明',
      koreanSearchNoteBody:
        '常规英文分词器难以切分韩语和东亚粘着语词尾。W-Vibe 结合不区分大小写的多语言子串匹配与技术术语同义词扩展来提升检索准确度。',
      authErrorClose: '关闭',
      authUnauthorizedTitle: '当前部署域名尚未添加到 Firebase 授权域名列表',
      authUnauthorizedBody:
        '在 GitHub Pages 或 Vercel 等新部署域名中使用 Google 登录时，需要在 Firebase 控制台的授权域名中添加下方主机名。未登录状态下仍可继续浏览、点赞与本地收藏。',
      authUnauthorizedSteps:
        'Firebase 控制台 → Authentication → Settings → Authorized domains → Add domain',
      authUnauthorizedCopyDomain: '复制域名',
      authUnauthorizedCopied: '已复制',
      authUnauthorizedOpenConsole: '打开 Firebase 授权域名设置',
      authPopupBlockedTitle: '浏览器拦截了 Google 登录弹窗',
      authPopupBlockedBody:
        '请允许此站点的弹窗后重试，或点击下方按钮改用页面重定向登录。',
      authPopupRedirectButton: '使用重定向登录',
      authCancelledNotice: 'Google 登录窗口已关闭，登录已取消。',
      authNetworkErrorBody: '网络连接异常导致 Google 登录失败，请稍后重试。',
      authGenericErrorTitle: 'Google 登录失败',
    },
    hero: {
      kicker: '可验证 AI 图谱',
      headline: '一站发现 AI 应用、MCP 与 Skills',
      subheadline: 'GitHub 星标与站内社区互动严格分离，透明呈现来源。',
      searchPlaceholder: '搜索 MCP、Lovable、Agent、Supabase...',
      searchButton: '搜索',
      quickBrowseLabel: '快速浏览',
    },
    home: {
      trendingTab: '本周热门',
      newlyLaunchedTab: '最新上线',
      risingOssTab: '飙升开源',
      viewAllDiscover: '浏览全部',
      mcpAndSkillsTitle: 'MCP 服务器 & AI Skills',
      mcpAndSkillsSubtitle: '已验证的智能体协议与技能仓库',
      stacksTitle: '技术栈精选',
      stacksSubtitle: '按现代 AI 构建架构浏览',
      koreanGlobalTitle: '全球 & 韩国创作者',
      koreanGlobalSubtitle: '来自首尔与全球独立开发者的优秀作品',
      featuredMakersTitle: '推荐创作者',
      featuredMakersSubtitle: '代码仓库可验证的建设者',
      submitCtaTitle: '发布并推广您的 AI 工具',
      submitCtaBody: '提交即登首页展示，附带一键分享文案。',
      submitCtaButton: '提交并推广',
      newsletterTitle: '每周精选',
      newsletterBody: '每周获取最新 MCP 与 AI 工具速递',
      newsletterPlaceholder: '输入邮箱（需 Google 登录）',
      newsletterButton: '订阅',
      newsletterSignInNotice: 'Google 登录后保存订阅',
      newsletterSuccess: '订阅成功！',
      promoTitle: '发布推广展示区',
      promoSubtitle: '精选新提交项目与一键分享工具包',
      promoTabAll: '全部',
      promoTabSubmitted: '最新投稿',
      promoTabDemoReady: '在线体验',
      promoCtaSubmit: '提交项目',
      promoKitHeading: '分享工具包',
      promoToneCommunity: '社区介绍',
      promoToneSocial: '社交精简',
      promoCopyLinkButton: '复制链接',
      promoCopyPitchButton: '复制文案',
      promoCopiedLabel: '已复制',
      promoOpenDetailButton: '详情',
      promoLiveDemoButton: '演示',
      promoSubmittedLabel: '社区提交',
      promoCuratedLabel: '编辑精选',
      promoEmptyFilterTitle: '暂无匹配项目',
      promoEmptyFilterBody: '立即提交您的第一个项目登上展示区。',
      promoCountLiveSuffix: '个',
      trending24hTitle: '24小时 GitHub 飙升榜',
      trending24hSubtitle: '过去 24 小时星标增长最快的仓库',
      trending24hAllLanguages: '全部',
      trending24hRefreshButton: '刷新',
      trending24hViewLeaderboard: '完整榜单',
      trending24hStarsSuffix: '/ 24h',
      trending24hSourceSnapshot: '24h 快照',
      trending24hSourceRate: '24h 增速',
      trending24hOpenCatalog: '详情',
      trending24hOpenGithub: 'GitHub',
      trending24hEmptyTitle: '该语言暂无 24 小时热门项目',
      trending24hEmptyBody: '切换全部语言或刷新重试。',
      trending24hResetLanguage: '全部语言',
      trending24hErrorTitle: '无法加载 24 小时数据',
      trending24hRetryButton: '重试',
      recentActivityTitle: '实时社区动态',
      recentActivitySubtitle: '新提交、点赞与收藏的实时信息流',
      recentActivityFilterAll: '全部',
      recentActivityFilterSubmissions: '新提交',
      recentActivityFilterLikes: '点赞',
      recentActivityFilterBookmarks: '收藏',
      recentActivityAutoScrollOn: '自动滚动',
      recentActivityAutoScrollPaused: '已暂停',
      recentActivityActionSubmitted: '提交了新项目',
      recentActivityActionLiked: '点赞了',
      recentActivityActionBookmarked: '收藏了',
      recentActivityCommunityActor: 'W-Vibe 社区',
      recentActivityGuestActor: '访客用户',
      recentActivityLiveLabel: '实时',
      recentActivityDeltaSuffix: '次近期互动',
      recentActivityOpenProject: '详情',
      recentActivityEmptyTitle: '该分类下暂无最近动态',
      recentActivityEmptyBody: '提交新项目或为项目点赞、收藏后，动态将实时显示在这里。',
      recentActivityLiveCountSuffix: '条动态',
      recentActivityShowAllButton: '查看全部动态',
    },
    discover: {
      title: '探索项目',
      subtitle: '筛选条件与 URL 实时同步。',
      filtersHeading: '筛选',
      mobileFiltersButton: '筛选',
      resetFilters: '重置筛选',
      searchPlaceholder: '搜索关键词、技术栈、创作者、仓库...',
      sortLabel: '排序',
      resultsCount: ' 条结果',
      emptyTitle: '未找到匹配的项目',
      emptyBody: '请尝试放宽筛选条件或更换搜索关键词。',
      previousPage: '上一页',
      nextPage: '下一页',
      filterType: '内容类型',
      filterCategory: '项目分类',
      allCategoriesOption: '全部分类',
      filterTags: '项目标签',
      clearTags: '清除标签',
      activeTagsPrefix: '已选标签',
      tagsHint: '可组合多个标签以缩小筛选范围。',
      filterPlatform: '开发平台',
      filterHosting: '托管服务',
      filterBackend: '后端技术',
      filterCountry: '国家/地区',
      filterLanguage: '支持语言',
      filterLicense: '开源协议',
      filterPricing: '定价模式',
      filterVerification: '验证状态',
      filterMinStars: '最低 GitHub 星标',
      filterUpdatedWithin: '最近更新',
      allOption: '全部',
      webAppsTop100Title: 'Web 应用 Top #1 – #100 全量视图',
      webAppsTop100Subtitle: '直接基于 GitHub Search REST API 完整渲染第 #1 至第 #100 名开源 Web 应用。',
      webAppsLoading: '正在加载 Web 应用 #1 – #100...',
      webAppsError: '暂时无法获取实时 Web 应用 Top 100 榜单，仅展示本地目录项目。',
      webAppsRetry: '重新加载',
      summaryRegionLabel: '目录核心统计摘要',
      summaryTotalProjectsLabel: '项目总数',
      summaryVerifiedSuffix: '个已验证',
      summaryMatchingSuffix: '个符合筛选',
      summaryPopularCategoryLabel: '最热门分类',
      summaryCategoryShareUnit: '个项目',
      summaryFilterCategoryAction: '筛选',
      summaryGrowthTrendsLabel: '近期增长趋势',
      summaryGrowthStarsUnit: '7 天星标',
      summaryGrowthSignalsUnit: '7 天社区互动',
      summaryRisingProjectsSuffix: '个上升中',
      summaryNoGrowthYet: '暂无 7 天增量',
      typeFilterBarLabel: '项目类型快速筛选',
      typeFilterClearLabel: '重置',
    },
    projectGrowth: {
      title: '项目增长趋势',
      subtitle: '近 30 天每日新增项目提交与 7 日滚动均值变化趋势。',
      toggleExpand: '展开项目增长图表',
      toggleCollapse: '收起项目增长图表',
      modeDaily: '每日提交',
      modeCumulative: '累计增长',
      scopeAll: '全部目录',
      scopeFiltered: '当前筛选',
      kpiNew30d: '近 30 天新增',
      kpiPeakDay: '峰值日',
      kpiWeeklyPace: '周均提交',
      kpiCatalogTotal: '目录总量',
      perWeekUnit: '/周',
      catalogGrowthSuffix: '目录增幅',
      activeDaysSuffix: '天活跃',
      dailySeriesLabel: '新增提交',
      rollingAvgLabel: '7 日均值',
      cumulativeSeriesLabel: '累计项目',
      tooltipProjectsLabel: '已提交项目',
      tooltipMoreSuffix: '个更多',
      noPeakYet: '暂无记录',
      emptyTitle: '近 30 天内暂无新增项目提交',
      emptyFilteredBody: '当前筛选条件下近 30 天无新增提交。可重置筛选或查看全部目录。',
      emptyCatalogBody: '提交新项目后，这里将展示近 30 天的目录提交增长趋势。',
      resetFilterButton: '重置筛选',
      submitProjectButton: '提交项目',
    },
    trendingSection: {
      title: '趋势与增长速度',
      subtitle: '使用 D3 可视化近 30 天 / 7 天 GitHub 星标增量及日均增长速率，快速发现飙升项目。',
      toggleExpand: '展开图表',
      toggleCollapse: '收起图表',
      tabStar30d: '30 天星标增长',
      tabStar7d: '7 天飙升',
      tabSignalVelocity: '社区互动增速',
      chartHeading: '增长最快项目排行',
      trajectoryHeading: '每日累计增长轨迹',
      unitStars: '星标',
      unitSignals: '互动',
      perDaySuffix: '/天',
      periodDeltaLabel: '周期净增长',
      dailyVelocityLabel: '日均速率',
      currentTotalLabel: '当前总计',
      inspectButton: '查看详情',
      emptyStarTitle: '尚无跨日 GitHub 星标快照记录',
      emptyStarBody: '在不同日期同步仓库后，此处将通过 D3 绘制 30 天与 7 天真实星标增速。',
      switchToSignalButton: '查看社区互动增速',
      emptyFilteredTitle: '当前筛选条件下暂无增长数据',
      emptyFilteredBody: '放宽筛选条件即可查看上升期项目的增长速度可视化。',
      fallbackNote: '正在等待跨日 GitHub 星标快照累积，当前默认展示已验证的站内互动增速。',
    },
    githubTrendingBubble: {
      title: 'GitHub Trending · AI 生态',
      subtitle: '使用 D3 气泡图按每日新增星标数可视化当前最活跃的 AI 生态 GitHub 仓库。',
      toggleExpand: '展开气泡图',
      toggleCollapse: '收起气泡图',
      refreshButton: '刷新',
      refreshing: '加载中...',
      allLanguages: '全部语言',
      perDaySuffix: '/天',
      dailyStarsLabel: '每日星标',
      totalStarsLabel: '累计星标',
      forksLabel: 'Forks',
      pushedLabel: '最近推送',
      topMoversHeading: '每日增速榜首',
      openGithubButton: '在 GitHub 打开',
      inspectVibeAtlasButton: '在 W-Vibe 查看',
      loadingLabel: '正在加载活跃 AI 生态仓库...',
      emptyTitle: '当前语言暂无匹配的趋势仓库',
      emptyBody: '重置语言筛选以查看全部 AI 生态活跃仓库气泡图。',
      resetLanguageButton: '显示全部语言',
      errorTitle: '无法加载 GitHub Trending 仓库',
      retryButton: '重试',
      cachedNotice: '缓存快照',
      rateModeVelocity: '按日均星标增速绘制',
      rateModeSnapshot: '按 24 小时快照增量绘制',
      reposCountLabel: '个活跃仓库',
      clickHint: '悬停或点击任意气泡以查看仓库详情',
    },
    discoveryMap: {
      title: '生态可视化探索散点图',
      subtitle: '通过 D3 散点图按 GitHub 星标规模（X 轴对数）与近期活跃频率（Y 轴）直观探索项目分布。',
      toggleExpand: '展开探索地图',
      toggleCollapse: '收起探索地图',
      scopeEcosystem: '全部生态',
      scopeDirectory: '当前目录筛选',
      scopeVerifiedMakers: '仅作者认证',
      allTypes: '全部类型',
      xAxisLabel: 'GitHub 星标（对数刻度）',
      yAxisLabel: '活跃频率指数 (0–100)',
      quadrantLeaders: '生态领先者',
      quadrantActiveBuilders: '高活跃新锐',
      quadrantEstablished: '成熟稳健型',
      quadrantEmerging: '早期 · 细分',
      spotlightHeading: '节点详情聚焦',
      starsMetricLabel: 'GitHub 星标',
      activityMetricLabel: '活跃频率',
      dailyVelocityLabel: '日均星标速率',
      recencyLabel: '最近活跃',
      todayLabel: '今天',
      daysAgoSuffix: '天前',
      sourceDirectory: 'W-Vibe 收录',
      sourceEnriched: '目录 + 实时 GitHub',
      sourceEcosystem: 'GitHub AI 生态',
      inspectButton: '查看详情',
      openGithubButton: '打开 GitHub',
      emptyTitle: '当前筛选条件下暂无散点数据',
      emptyBody: '切换回全部类型或重置目录筛选即可继续探索生态分布图。',
      resetMapFilter: '重置图内筛选',
      resetFiltersButton: '重置目录筛选',
      pointsCountLabel: '个已映射节点',
      interactionHint: '悬停或点击任意散点以查看详细指标与象限位置',
      medianGuideNote: '虚线：中位数基准线',
    },
    card: {
      githubStars: 'GitHub 星标',
      internalLikes: '点赞',
      internalBookmarks: '收藏',
      notSynced: '未同步',
      staleLabel: '同步较旧',
      verifiedLabel: '已验证',
      pendingLabel: '待验证',
      unverifiedLabel: '未验证',
      missingLicense: '协议未注明',
      openDetail: '查看详情',
      likeAction: '点赞',
      bookmarkAction: '收藏',
      trendingBadge: '热门趋势',
      trending7dTooltip: '近 7 天 GitHub 星标新增 +{count}',
      trendingEngagementTooltip: '近 7 天点赞 +{likes}、收藏 +{bookmarks}（共 +{total}）',
      compareAdd: '加入对比',
      compareSelected: '已选对比',
      starHistory7d: '7 天星标趋势',
      starHistoryBaseline: '基准快照',
      starHistoryNoSnapshots: '暂无快照',
      statusBadgesLabel: '项目状态徽章',
      openSourceBadge: '开源项目',
      openSourceTooltip: '该项目以开源形式发布。',
      openSourceWithLicenseTooltip: '开源项目（{license} 协议）',
      verifiedTooltip: '仓库与元数据已完成验证。',
      pendingTooltip: '正在审核元数据与归属验证。',
      unverifiedTooltip: '尚未完成官方元数据验证。',
    },
    highlights: {
      containerLabel: '项目亮点徽章',
      featured: '精选推荐',
      newArrival: '最新上架',
      highActivity: '高活跃度',
      featuredTooltip: '基于已验证元数据与社区高评价入选的重点推荐项目。',
      newArrivalTooltip: '近期新收录项目（{date}）。',
      highActivityTooltip: '近期仓库更新与社区互动保持高活跃状态。',
      highActivityStarsTooltip: '近 7 天 GitHub 星标新增 +{count}，热度持续走高。',
      highActivitySignalsTooltip: '近 7 天站内点赞与收藏新增 +{count}，社区互动活跃。',
    },
    verification: {
      claimedBadge: '作者已认证',
      claimedTooltip: '该条目已由创作者本人认领并验证所有权。',
      pendingBadge: '认领审核中',
      pendingTooltip: '作者所有权认领申请已提交，正在审核确认。',
      unclaimedBadge: '未认领',
      panelTitleClaimed: '作者所有权已认证',
      panelBodyClaimed:
        '官方创作者已在 W-Vibe 完成所有权认领与核验，确保外部链接、开源协议与作者归属信息的真实可靠。',
      panelTitlePending: '作者所有权认领审核中',
      panelBodyPending:
        '所有权验证凭证已提交审核。审核通过后，该项目卡片与详情弹窗将展示作者认证徽章。',
      panelTitleUnclaimed: '未认领目录条目',
      panelBodyUnclaimed:
        '该条目来自公开仓库同步或社区收录。如果您是该项目作者，可申请认领所有权以获得可信认证徽章。',
      attributionLabel: '创作者',
      methodLabel: '验证方式',
      statusLabel: '状态',
      statusClaimed: '已认领并核验',
      statusPending: '等待验证审核',
      statusUnclaimed: '尚未认领',
      ownerTag: '我提交的',
      methodGithub: 'GitHub 仓库维护者',
      methodDns: '域名 DNS TXT',
      methodDemo: '在线演示 Meta 标签',
      methodDirect: '作者直投 · 已核验',
      claimCta: '认领此项目',
    },
    compare: {
      trayTitle: '项目对比栏',
      trayHintOneMore: '请至少再选择 1 个项目即可横向对比（最多 3 个）。',
      trayLimitNotice: '最多可同时对比 3 个项目，请先移除一个项目后再添加。',
      emptySlotLabel: '空位',
      compareNowButton: '横向对比',
      clearButton: '清空',
      removeAction: '从对比中移除',
      modalTitle: '项目横向对比',
      modalSubtitle: '并排对比 GitHub 统计指标（星标、Fork、协议）及技术栈与元数据。',
      closeButton: '关闭',
      colAttribute: '对比维度',
      sectionGithub: 'GitHub 仓库指标',
      sectionMetadata: '元数据与技术栈',
      sectionCommunity: '站内互动与链接',
      rowGithubStars: 'GitHub 星标',
      rowGithubForks: 'GitHub Forks',
      rowLicense: '开源协议',
      rowRepository: '代码仓库',
      rowLastSynced: '最后同步',
      rowContentType: '内容类型',
      rowCategories: '分类标签',
      rowPlatform: '开发平台',
      rowHostingBackend: '托管与后端',
      rowTechStack: '技术栈',
      rowPricing: '定价模式',
      rowVerification: '验证状态与来源',
      rowCountryLang: '国家与语言',
      rowUpdatedAt: '最近更新',
      rowEngagement: '点赞与收藏',
      rowLinks: '相关链接',
      highestBadge: '最高',
      latestBadge: '最新',
      openDetail: '查看详情',
      notAvailable: '暂无',
    },
    detail: {
      close: '关闭',
      externalLinksTitle: '外部链接（离开 W-Vibe）',
      internalActionsTitle: 'W-Vibe 站内操作',
      liveDemo: '在线演示',
      officialWebsite: '官方网站',
      githubRepository: 'GitHub 仓库',
      syncGithubNow: '立即同步 GitHub',
      syncing: '同步中...',
      provenanceTitle: '元数据来源与时效性',
      provenanceSourceLabel: '来源',
      lastSyncedLabel: '最后同步',
      missingFieldsLabel: '缺失/未验证字段',
      noneMissing: '核心元数据字段完整',
      techAndPlatformTitle: '技术栈与平台归属',
      platformLabel: '开发平台',
      hostingLabel: '托管服务',
      backendLabel: '后端技术',
      licenseLabel: '开源协议',
      pricingLabel: '定价模式',
      countryLangLabel: '国家 / 语言',
      historyChartTitle: '近 14 天增长趋势（GitHub 星标 · 站内信号）',
      historyChartSubtitle: '外部 GitHub 星标增量与 W-Vibe 站内点赞收藏分开统计绘制。',
      chartTabStars: 'GitHub 星标',
      chartTabInternal: '站内点赞 · 收藏',
      chartUnsyncedStarsHint: '该 GitHub 仓库尚未同步，立即同步即可查看实时星标数。',
      chartLiveTotalLabel: '当前 GitHub 星标',
      chartDeltaLabel: '14 天增量',
      chartBaselineNote: '当前实时基准线（随着每日同步累积将展示历史变化曲线）',
      relatedTitle: '相似项目与替代方案',
      reportButton: '反馈错误',
      claimButton: '认领所有权',
      reportTitle: '提交条目错误或失效链接报告',
      claimTitle: '申请创作者所有权验证',
      submitReport: '提交报告',
      submitClaim: '提交认领申请',
      actionSubmitted: '已安全保存至 Firestore。',
      signInRequired: '请先使用 Google 登录以保存此操作。',
      communityActivityTitle: '社区动态',
      communityActivitySubtitle: '按时间顺序列出该项目的近期点赞、收藏与报告记录。',
      activityFilterAll: '全部',
      activityFilterLikes: '点赞',
      activityFilterBookmarks: '收藏',
      activityFilterReports: '报告',
      activityActionLike: '赞了该项目',
      activityActionBookmark: '收藏了该项目',
      activityActionReport: '提交了问题报告',
      activityGuestActor: '社区访客',
      activityEmptyTitle: '暂无近期互动记录',
      activityEmptySubtitle: '点击上方的点赞、收藏或反馈按钮后，这里将实时按时间顺序展示记录。',
      activityLoadingLabel: '正在加载动态...',
      activityErrorNotice: '暂无法同步实时 Firestore 动态，仅显示本地记录。',
      activityReasonBrokenLink: '链接失效',
      activityReasonStaleMetadata: '元数据过时',
      activityReasonMisattribution: '归属信息有误',
      activityReasonSpam: '垃圾内容',
      activityReasonSecurityConcern: '安全隐患',
      vibeScoreTitle: 'Vibe 指数 · 社区健康度',
      vibeScoreSubtitle: '基于 W-Vibe 站内互动、近期活跃动量、验证新鲜度及已同步 GitHub 牵引力的透明 D3 仪表盘。',
      vibeScoreOutOf100: '/ 100',
      vibeScoreTierThriving: '活跃旺盛',
      vibeScoreTierActive: '持续活跃',
      vibeScoreTierWarm: '温和成长',
      vibeScoreTierQuiet: '起步关注',
      vibeScorePillarAffinity: '社区偏好（点赞 · 收藏）',
      vibeScorePillarMomentum: '近期活跃动量',
      vibeScorePillarTraction: '已同步 GitHub 牵引力',
      vibeScorePillarHealth: '验证与更新健康度',
      vibeScoreUnsyncedNote: 'GitHub 尚未同步（同步前外部牵引力计 0 分）',
      vibeScoreReportsPenalty: '来自问题反馈的情绪扣分',
      vibeScoreFormulaNote: '由最高 75 分的站内健康指标与最高 25 分的已同步外部 GitHub 指标透明计算。',
      sharePromoteTitle: '推广与分享',
      copyDirectLink: '复制直达链接',
      copyPromoPitch: '复制推广文案',
      copiedFeedback: '已复制',
      timelineTitle: '项目时间线与里程碑',
      timelineSubtitle: '按时间顺序呈现 GitHub 版本发布、近期仓库提交及作者手动发布的里程碑日志。',
      timelineFilterAll: '全部',
      timelineFilterReleases: '版本发布',
      timelineFilterCommits: '代码提交',
      timelineFilterCreatorLogs: '作者日志',
      timelineSortNewest: '最新优先',
      timelineSortOldest: '最早优先',
      timelineAddButton: '记录里程碑',
      timelineCloseComposer: '收起表单',
      timelineCadenceLabel: '活跃周期分布',
      timelineSpanDaysSuffix: '天跨度',
      timelineGapSuffix: '天间隔',
      timelineLoadingLabel: '正在从 GitHub 拉取发布记录与最近提交...',
      timelineRepoErrorNotice: '暂时无法加载 GitHub 仓库动态，当前仅显示目录及作者日志记录。',
      timelineNoRepoNote: '未绑定 GitHub 仓库 — 当前展示目录索引记录与作者里程碑。',
      timelineEmptyTitle: '当前筛选下暂无里程碑记录',
      timelineEmptyBody: '切回“全部”即可查看仓库发布、代码提交与目录动态。',
      timelineEmptyCreatorBody: '该项目暂未发布作者手工里程碑日志。',
      timelineAuthNoticeSignedOut: '请使用项目创建者账号通过 Google 登录后发布官方里程碑日志。',
      timelineAuthNoticeNotOwner: '仅项目注册所有者或管理员可发布作者里程碑。如您为项目原作者，请先在上方提交所有权认证。',
      timelineSignInCta: 'Google 登录',
      timelineClaimCta: '前往所有权认证',
      timelineKindLabel: '里程碑类型',
      timelineKindRelease: '版本发布',
      timelineKindLaunch: '正式上线',
      timelineKindFeature: '新功能',
      timelineKindUpdate: '迭代更新',
      timelineKindFix: '问题修复',
      timelineVersionLabel: '版本标签（选填）',
      timelineDateLabel: '日期',
      timelineEntryTitleLabel: '里程碑标题 *',
      timelineSummaryLabel: '摘要说明（选填）',
      timelineUrlLabel: '参考链接（选填）',
      timelinePublishButton: '发布里程碑',
      timelinePublishingButton: '发布中...',
      timelineDeleteButton: '删除里程碑',
      timelineExternalLink: '查看详情',
      timelineSourceRelease: 'GitHub 发布',
      timelineSourceCommit: '提交记录',
      timelineSourceCreator: '作者日志',
      timelineSourceCatalog: '目录事件',
      volatilityTitle: 'Vibe 指数波动率 vs. GitHub 星标增速',
      volatilitySubtitle: '通过 D3 双趋势线对比社区 Vibe 指数波动区间（±σ 包络带）与仓库每日星标增长率。',
      volatilityModePace: '双趋势对比',
      volatilityModeSwing: '单日波幅',
      volatilityMetricStdDev: '波动率 (σ)',
      volatilityMetricNetVibe: '14天 Vibe 变化',
      volatilityMetricStarRate: '14天星标增速',
      volatilityMetricMaxSwing: '最大单日波幅',
      volatilityVerdictLabel: '社区情绪与技术采用节奏对比',
      volatilityVerdictKeepingPace: '情绪与采用保持同步',
      volatilityVerdictKeepingPaceDesc: '社区 Vibe 指数与外部 GitHub 星标增长速率同步稳健提升。',
      volatilityVerdictSentimentLeading: '社区情绪领先 · 波动增强',
      volatilityVerdictSentimentLeadingDesc: '站内 Vibe 关注度与短期波动幅度高于当前仓库星标的实际增长速度。',
      volatilityVerdictAdoptionOutpacing: '技术采用快于社区情绪',
      volatilityVerdictAdoptionOutpacingDesc: 'GitHub 星标增长速率显著快于当前站内社区互动与口碑反馈动量。',
      volatilityVerdictUnsynced: 'GitHub 尚未同步',
      volatilityVerdictUnsyncedDesc: '站内 Vibe 波动曲线已实时绘制，同步 GitHub 后可叠加真实星标增速对比。',
      volatilityVerdictBaseline: '单日基准快照',
      volatilityVerdictBaselineDesc: '已记录当前基准星标数。跨日同步累积后将绘制每日星标增长率曲线。',
      volatilityLegendVibeScore: 'Vibe 指数 (0–100)',
      volatilityLegendBand: '波动区间 (±σ)',
      volatilityLegendStarRate: '日星标增速 (%)',
      volatilityLegendSwing: '单日 Vibe 涨跌 (Δ)',
      volatilityLeftAxisLabel: 'Vibe 指数',
      volatilityRightAxisLabel: '星标增速 (%)',
      volatilitySwingAxisLabel: '单日波幅 (Δ)',
      volatilityScrubHint: '悬停或点击日期节点以查看当日详细数值',
      volatilityDateLabel: '日期',
      volatilityVibeDeltaLabel: '单日 Vibe 变化',
      volatilityStarGainLabel: '单日新增星标',
      insightsTitle: '项目洞察 · 近 7 天点赞与收藏趋势',
      insightsSubtitle: '通过 D3 可视化近 7 天社区点赞（即时认同）与收藏（留存意向）的每日增量及累计走势。',
      insightsModeDaily: '每日增量',
      insightsModeCumulative: '7天累计走势',
      insightsKpiLikes7d: '7天新增点赞',
      insightsKpiBookmarks7d: '7天新增收藏',
      insightsKpiBookmarkShare: '收藏意向占比',
      insightsKpiPeakDay: '最高互动日',
      insightsTotalPrefix: '累计',
      insightsAvgPerDay: '日均',
      insightsNoPeakDay: '暂无互动',
      insightsScrubHint: '悬停或选择任意日期柱条可查看当日详细数据',
      insightsDateLabel: '日期',
      insightsCombinedLabel: '合计',
      insightsMixTitle: '7天互动构成比',
      insightsEmptyTitle: '该 7 天窗口内暂未记录到点赞或收藏互动。',
      insightsEmptyHint: '点击下方点赞或收藏按钮即可实时记录每日社区互动变化。',
      insightsAxisCount: '次数',
      editProject: '编辑项目',
      starGrowthTitle: '星标增长曲线 (Star Growth)',
      starGrowthSubtitle: '基于星标快照系统记录的每日 GitHub 星标历史数据绘制趋势。',
      starGrowthRange7d: '7 天',
      starGrowthRange30d: '30 天',
      starGrowthRangeAll: '全部',
      starGrowthModeTotal: '累计星标',
      starGrowthModeDelta: '单日增量',
      starGrowthKpiCurrent: '最新快照星标',
      starGrowthKpiNet: '区间净增长',
      starGrowthKpiAvgDay: '日均增长',
      starGrowthKpiSnapshots: '已记录快照',
      starGrowthDaysSuffix: '天',
      starGrowthPerDaySuffix: '/天',
      starGrowthNoRepo: '未关联 GitHub 仓库，暂无法跟踪星标快照。',
      starGrowthUnsynced: '尚未记录星标快照。立即同步 GitHub 以生成首条基准快照。',
      starGrowthSingleBaseline: '当前仅记录单条基准快照，随着跨日同步积累将显示完整增长趋势。',
      starGrowthTooltipTotal: '记录星标',
      starGrowthTooltipDelta: '单日变化',
      starGrowthTooltipCumulative: '区间累计',
      mobileViewToggle: '手机视图',
      mobileViewTitle: '手机视图预览',
      mobileViewSubtitle: '在固定智能手机屏幕比例框架中实时预览项目在线演示。',
      mobileViewClose: '关闭手机视图',
    },
    submit: {
      title: '提交新项目',
      subtitle: '填写可验证的项目元数据，立即发布至目录并保存至 Firestore。',
      promoPreviewTitle: '首页推广效果实时预览',
      promoPreviewSubtitle: '发布后项目将登上首页推广展示区，并支持使用下方文案一键向外分享。',
      promoPreviewUntitled: '您的 AI 项目（输入标题后实时预览）',
      promoPreviewTaglineFallback: '填写一句话简介即可生成可分享的发布推介文案。',
      githubImportTitle: '从 GitHub 仓库导入元数据',
      githubImportHint: '例如：modelcontextprotocol/servers 或 https://github.com/cline/cline',
      githubImportPlaceholder: '输入 owner/repo 或 GitHub 链接',
      githubFetchButton: '实时获取',
      fetchingGithub: '获取中...',
      nameLabel: '项目名称 *',
      taglineEnLabel: '英文一句话简介（5-220 字符）*',
      taglineKoLabel: '韩文一句话简介',
      descriptionEnLabel: '英文详细说明（至少 20 字符）*',
      descriptionKoLabel: '韩文详细说明',
      contentTypeLabel: '内容类型',
      categoriesLabel: '分类标签（逗号分隔，最多 6 个）*',
      categoriesQuickTagsHint: '常用标签快选（点击切换）：',
      techStackLabel: '技术栈（逗号分隔，最多 12 项）',
      platformLabel: '开发平台',
      hostingLabel: '托管服务商',
      backendLabel: '后端技术',
      countryLabel: '国家/地区代码（如 KR、US）*',
      languageLabel: '支持语言',
      licenseLabel: '开源协议（如 MIT、Apache-2.0）*',
      pricingLabel: '定价模式',
      liveDemoLabel: '在线演示 URL (https://)',
      websiteLabel: '官方网站 URL (https://)',
      githubUrlLabel: 'GitHub URL (https://)',
      makerNameLabel: '创作者 / 团队名称 *',
      makerHandleLabel: '创作者账号（如 @handle）',
      submitButton: '发布到目录',
      submitting: '发布中...',
      signInPrompt: '请先使用 Google 登录，以发布经验证的项目至 Firestore。',
      submitSuccess: '项目已成功发布！',
      draftRestoredNotice: '已从本地存储恢复您上次未提交的草稿。',
      draftAutosaveHint: '您的输入内容每 30 秒自动保存至浏览器本地存储。',
      clearDraftButton: '清除草稿',
      validationSummaryPrefix: '请修正高亮的输入字段',
    },
    maker: {
      title: '创作者控制台与收藏库',
      subtitle: '管理您发布的项目、收藏列表、所有权认领与反馈记录。',
      myProjectsTab: '我的项目',
      myBookmarksTab: '收藏列表',
      claimsReportsTab: '认领与反馈记录',
      signInCtaTitle: '使用 Google 登录开启创作者控制台',
      signInCtaBody: '管理您的项目、同步 GitHub 数据并在多设备间同步收藏夹。',
      noProjectsYet: '您尚未发布任何项目。',
      noBookmarksYet: '暂无收藏的项目。',
      resyncGithub: '重新同步 GitHub',
      deleteProject: '删除',
      analyticsTitle: '项目互动数据分析',
      analyticsSubtitle: '站内点赞与收藏统计严格独立于外部 GitHub 星标。',
      metricOwnedProjects: '已发布项目',
      metricTotalLikes: '累计点赞',
      metricTotalBookmarks: '累计收藏',
      metricTotalEngagement: '站内总互动',
      metricExternalStarsNote: '外部 GitHub 星标总计',
      analyticsSortEngagement: '总互动量',
      analyticsSortLikes: '最多点赞',
      analyticsSortBookmarks: '最多收藏',
      analyticsSortRecent: '最新发布',
      tableProjectCol: '项目',
      tableLikesCol: '点赞',
      tableBookmarksCol: '收藏',
      tableTotalCol: '互动合计',
      tableSplitCol: '互动占比',
      tableGithubCol: 'GitHub 星标',
      topProjectLabel: '互动最高项目',
      analyticsEmptyHint: '发布项目后，可在此查看每个项目的点赞、收藏与互动明细。',
      projectListHeading: '我的项目列表',
      likesUnit: '点赞',
      bookmarksUnit: '收藏',
      engagementUnit: '总互动',
      editProject: '编辑',
      editSuccessNotice: '项目更新已保存。',
      confirmDeleteLabel: '确认删除',
      cancelDeleteLabel: '取消',
      lastUpdatedPrefix: '最近更新',
      viewDetail: '详情',
    },
    editModal: {
      title: '编辑我的项目',
      subtitle: '完善项目元数据、标签、链接与说明，并即时同步到 Firestore。',
      adminModeNote: '正在以管理员权限编辑此 Firestore 项目。',
      immutableNote: '为保障目录完整性，Slug、点赞收藏数及认证状态将保持不变。',
      slugLabel: 'Slug 标识',
      statusLabel: '验证状态',
      lastUpdatedLabel: '上次更新',
      githubSyncHeading: '重新拉取 GitHub 仓库元数据',
      githubSyncHint: '同步最新星标、Fork 与许可证，仅自动补全尚未填写的简介或技术栈字段。',
      githubFillEmptyButton: '同步最新 GitHub',
      thumbnailUrlLabel: '缩略图 URL (https://)',
      thumbnailPreviewLabel: '缩略图预览',
      sectionBasic: '基本信息与介绍',
      sectionClassification: '分类 · 技术栈 · 托管架构',
      sectionLinksMaker: '外部链接 · 缩略图 · 作者',
      resetButton: '还原更改',
      cancelButton: '取消',
      saveButton: '保存更改',
      savingButton: '保存中...',
      noChangesHint: '尚未修改任何字段。',
      changedCountSuffix: '项已修改',
      closeLabel: '关闭编辑弹窗',
    },
    mobileDemo: {
      sectionTitle: '移动应用发布与交互式演示设置',
      sectionSubtitle: '配置 iOS / Android / PWA 支持、应用商店链接、设备模拟器边框与二维码真机测试链接。',
      enableToggleLabel: '启用移动应用 / PWA 设备演示',
      enableToggleHint: 'Web 应用与 AI 工具也可以附加移动端视口模拟器与扫码测试链接。',
      targetPlatformsLabel: '目标移动平台',
      quickMobileStackLabel: '快速添加移动端技术栈',
      mobileDemoUrlLabel: '交互式移动演示 URL（Expo Snack / PWA / 移动网页）',
      mobileDemoUrlPlaceholder: 'https://snack.expo.dev/... 或 https://m.example.com',
      iosAppStoreLabel: 'App Store / TestFlight URL',
      iosAppStorePlaceholder: 'https://apps.apple.com/... 或 https://testflight.apple.com/...',
      androidPlayStoreLabel: 'Google Play URL',
      androidPlayStorePlaceholder: 'https://play.google.com/store/apps/details?id=...',
      mobilePackageUrlLabel: '安装包 / APK / IPA / Expo URL',
      mobilePackageUrlPlaceholder: 'https://expo.dev/... 或 https://github.com/.../releases',
      bundleIdLabel: 'Bundle / 包名 ID',
      bundleIdPlaceholder: 'com.wvibe.app',
      minOsLabel: '最低系统版本',
      minOsPlaceholder: 'iOS 16+ / Android 13+',
      devicePresetLabel: '默认设备边框',
      orientationLabel: '默认屏幕方向',
      presetIphone: 'iPhone 16',
      presetPixel: 'Pixel 9',
      orientationPortrait: '竖屏 (Portrait)',
      orientationLandscape: '横屏 (Landscape)',
      liveSubmitPreviewTitle: '实时移动设备预览与扫码测试',
      liveSubmitPreviewSubtitle: '发布前即时预览详情页中的手机模拟器与二维码效果。',
      simulatorTitle: '交互式移动演示模拟器',
      simulatorSubtitle: '支持切换机型边框、旋转横竖屏，并可通过手机扫描二维码即时体验。',
      modeAppCard: '交互式应用卡片',
      modeLiveFrame: '实时网页 / Expo 视口',
      openExternalButton: '在新标签页打开',
      copyDemoLinkButton: '复制移动测试链接',
      copiedLinkLabel: '已复制链接',
      iframeFallbackNotice: '若目标网站因 X-Frame-Options 限制无法嵌入，请切换为应用卡片模式或在新标签页打开。',
      iframeBlockedButton: '切换至应用卡片预览',
      qrTitle: '手机扫码即时体验 (QR)',
      qrSubtitleDemo: '使用手机相机扫描，即可直接在手机上打开移动演示。',
      qrSubtitleStore: '使用手机相机扫描，即可前往应用商店或下载页面。',
      qrSubtitleShare: '使用手机相机扫描，即可在 W-Vibe 打开项目页面。',
      storeLinksTitle: '应用商店与构建分发链接',
      noStoreLinksNote: '暂未填写商店或安装包分发链接。',
      specsTitle: '移动应用规格',
      cardBadgeLabel: '移动演示',
      previewTabOverview: '概览',
      previewTabFeatures: '技术栈',
      previewTabRelease: '发布信息',
      previewInteractiveCta: '打开移动演示',
    },
    footer: {
      tagline: 'W-Vibe — AI · MCP · Skills 目录',
      transparencyNote: 'GitHub 星标与站内互动指标严格分开统计。',
    },
    voiceSearch: {
      startLabel: '语音搜索',
      stopLabel: '停止语音输入',
      listeningStatus: '正在聆听... 请说出搜索关键词',
      stopButton: '停止',
      unsupportedError: '当前浏览器不支持语音搜索（Web Speech API），请尝试使用 Chrome 或 Edge。',
      permissionDeniedError: '麦克风权限被拒绝，请在浏览器设置中允许访问麦克风。',
      noSpeechError: '未检测到语音，请对着麦克风重试。',
      audioCaptureError: '未检测到麦克风设备，请检查音频输入设备。',
      networkError: '语音识别网络连接失败，请检查网络后重试。',
      unknownError: '无法完成语音识别，请稍后再试。',
      dismissError: '关闭',
    },
    githubStarsPage: {
      title: 'GitHub 星标 Top 100 排行榜',
      subtitle: '基于 GitHub 官方 Search REST API 实时统计星标数前 100 名仓库（与 W-Vibe 站内点赞收藏严格分离）。',
      refreshButton: '实时刷新',
      refreshing: '加载中...',
      presetAll: '全球 Top 100',
      presetWebApps: 'Web 应用',
      presetAiAgents: 'AI · 智能体 · MCP',
      presetTypescript: 'TypeScript',
      presetPython: 'Python',
      presetRust: 'Rust',
      presetGo: 'Go',
      kpiRankedCount: '上榜仓库数',
      kpiTopStars: '第 1 名星标数',
      kpiMedianStars: '星标中位数',
      kpiLastUpdated: '最后同步时间',
      cachedFallbackBadge: '缓存快照',
      searchPlaceholder: '在 Top 100 内搜索仓库名、描述或标签...',
      allLanguagesOption: '全部语言',
      showingCountLabel: '个仓库显示中',
      colRank: '排名',
      colRepository: '仓库',
      colLanguageLicense: '语言 · 协议',
      colForks: 'Forks',
      colStars: 'GitHub 星标',
      colActions: '链接',
      openInVibeAtlas: 'W-Vibe 详情',
      openGithub: 'GitHub',
      emptyFilteredTitle: '没有符合筛选条件的仓库',
      emptyFilteredBody: '请清空搜索关键词或语言筛选以查看完整的 Top 100 榜单。',
      resetFilterButton: '重置筛选',
      errorTitle: '无法加载 GitHub Top 100 排行榜',
      dataUnavailableTitle: '数据暂不可用',
      dataUnavailableBody: '排行榜服务暂时不可用或返回了异常响应页面，请稍后重试。',
      retryButton: '重试',
      rateLimitResetPrefix: 'API 配额预计重置时间',
      translatingDescriptions: '正在将仓库简介翻译为中文...',
      translatedBadge: '已翻译',
      showOriginal: '查看原文',
      showTranslated: '查看译文',
      translationErrorNotice: '实时翻译服务暂不可用，当前显示 GitHub 原始简介。',
    },
  },
  ja: {
    nav: {
      home: 'ホーム',
      discover: '探索',
      githubStars: 'GitHub スター',
      makers: 'メイカー',
      submit: '登録',
      primaryCta: 'プロジェクト登録',
      searchPlaceholder: 'プロジェクト・タグ検索...',
      searchAriaLabel: 'プロジェクトやタグをリアルタイム検索',
      searchClear: '検索をクリア',
      searchToggle: '検索を開く',
      searchProjectsHeading: '一致するプロジェクト',
      searchTagsHeading: '一致するタグ',
      searchTagCountSuffix: '件',
      searchNoResults: '一致するプロジェクトやタグが見つかりません。',
      searchActionSubmit: 'すべての検索結果を見る (Enter)',
    },
    workspace: {
      savedBookmarks: 'ブックマーク',
      signInGoogle: 'Google ログイン',
      signOut: 'ログアウト',
      makerAccount: 'メイカーアカウント',
      lightMode: 'ライトモード',
      darkMode: 'ダークモード',
      soundOn: '効果音オン',
      soundOff: '効果音オフ',
      koreanSearchNoteTitle: '多言語検索について',
      koreanSearchNoteBody:
        '一般的な英語ステマーは韓国語や日本語・中国語の部分語を適切に分割できません。W-Vibe は大文字小文字を区別しない多言語部分一致と技術用語の同義語拡張を組み合わせています。',
      authErrorClose: '閉じる',
      authUnauthorizedTitle: 'このデプロイ先ドメインは Firebase 認証の承認済みドメインに未登録です',
      authUnauthorizedBody:
        'GitHub Pages や Vercel などのデプロイ先ドメインで Google ログインを利用するには、下のホスト名を Firebase コンソールの承認済みドメインに追加する必要があります。未ログインでも閲覧・いいね・ブックマークは利用できます。',
      authUnauthorizedSteps:
        'Firebase コンソール → Authentication → Settings → Authorized domains → Add domain',
      authUnauthorizedCopyDomain: 'ドメインをコピー',
      authUnauthorizedCopied: 'コピー済み',
      authUnauthorizedOpenConsole: 'Firebase 承認済みドメインを開く',
      authPopupBlockedTitle: 'ブラウザにより Google ログインのポップアップがブロックされました',
      authPopupBlockedBody:
        'このサイトのポップアップを許可して再試行するか、下のボタンからリダイレクトログインをお試しください。',
      authPopupRedirectButton: 'リダイレクトでログイン',
      authCancelledNotice: 'Google ログインウィンドウが閉じられたためキャンセルされました。',
      authNetworkErrorBody: 'ネットワーク接続エラーにより Google ログインに失敗しました。時間をおいて再試行してください。',
      authGenericErrorTitle: 'Google ログイン中にエラーが発生しました',
    },
    hero: {
      kicker: '検証済み AI アトラス',
      headline: 'AI アプリ・MCP・Skills を瞬時に発見',
      subheadline: 'GitHub スターとコミュニティ指標を透明に分離表示。',
      searchPlaceholder: 'MCP、Lovable、Agent、Supabase...',
      searchButton: '検索',
      quickBrowseLabel: 'クイック探索',
    },
    home: {
      trendingTab: '今週のトレンド',
      newlyLaunchedTab: '新着',
      risingOssTab: '急上昇 OSS',
      viewAllDiscover: 'すべて見る',
      mcpAndSkillsTitle: 'MCP サーバー & AI Skills',
      mcpAndSkillsSubtitle: '検証済みプロトコルとエージェントツール',
      stacksTitle: 'スタック別コレクション',
      stacksSubtitle: 'モダン AI 開発スタックで探索',
      koreanGlobalTitle: 'グローバル & 韓国メイカー',
      koreanGlobalSubtitle: 'ソウルから世界まで個人開発者のプロダクト',
      featuredMakersTitle: '注目のメイカー',
      featuredMakersSubtitle: 'リポジトリが確認されたビルダー',
      submitCtaTitle: 'AI ツールを登録して発信しよう',
      submitCtaBody: '公開後すぐにショーケース掲載と共有キットを提供。',
      submitCtaButton: '登録してプロモーション',
      newsletterTitle: '週刊ダイジェスト',
      newsletterBody: '注目の新規 MCP と AI ツールを毎週お届け',
      newsletterPlaceholder: 'メールアドレス (Google ログイン)',
      newsletterButton: '購読',
      newsletterSignInNotice: 'Google ログイン後に購読保存',
      newsletterSuccess: '購読完了！',
      promoTitle: 'ローンチショーケース',
      promoSubtitle: '最新登録作とワンクリック共有キット',
      promoTabAll: 'すべて',
      promoTabSubmitted: '新規登録',
      promoTabDemoReady: 'ライブデモ',
      promoCtaSubmit: 'プロジェクト登録',
      promoKitHeading: '共有キット',
      promoToneCommunity: 'コミュニティ向け',
      promoToneSocial: 'SNS 要約',
      promoCopyLinkButton: 'リンクコピー',
      promoCopyPitchButton: '紹介文コピー',
      promoCopiedLabel: 'コピー済み',
      promoOpenDetailButton: '詳細',
      promoLiveDemoButton: 'デモ',
      promoSubmittedLabel: 'コミュニティ登録',
      promoCuratedLabel: 'ピックアップ',
      promoEmptyFilterTitle: '該当プロジェクトがありません',
      promoEmptyFilterBody: '最初のプロジェクトを登録しましょう。',
      promoCountLiveSuffix: '件',
      trending24hTitle: '24時間 GitHub 急上昇',
      trending24hSubtitle: '過去24時間のスター急増リポジトリ',
      trending24hAllLanguages: 'すべて',
      trending24hRefreshButton: '更新',
      trending24hViewLeaderboard: 'ランキング',
      trending24hStarsSuffix: '/ 24h',
      trending24hSourceSnapshot: '24h スナップショット',
      trending24hSourceRate: '24h 増加速度',
      trending24hOpenCatalog: '詳細',
      trending24hOpenGithub: 'GitHub',
      trending24hEmptyTitle: '該当言語の急上昇項目はありません',
      trending24hEmptyBody: 'すべての言語に切り替えるか更新してください。',
      trending24hResetLanguage: 'すべて表示',
      trending24hErrorTitle: '24時間指標を読み込めませんでした',
      trending24hRetryButton: '再試行',
      recentActivityTitle: 'ライブコミュニティ',
      recentActivitySubtitle: '新規投稿・いいね・ブックマークのリアルタイム履歴',
      recentActivityFilterAll: 'すべて',
      recentActivityFilterSubmissions: '新規投稿',
      recentActivityFilterLikes: 'いいね',
      recentActivityFilterBookmarks: 'ブックマーク',
      recentActivityAutoScrollOn: '自動スクロール',
      recentActivityAutoScrollPaused: '一時停止',
      recentActivityActionSubmitted: 'が新規投稿しました',
      recentActivityActionLiked: 'にいいねしました',
      recentActivityActionBookmarked: 'をブックマークしました',
      recentActivityCommunityActor: 'W-Vibe コミュニティ',
      recentActivityGuestActor: 'ゲスト',
      recentActivityLiveLabel: 'ライブ',
      recentActivityDeltaSuffix: '件の反応',
      recentActivityOpenProject: '詳細',
      recentActivityEmptyTitle: 'この種別のアクティビティはまだありません',
      recentActivityEmptyBody: 'プロジェクトを投稿したり、いいね・ブックマークを行うとここに即時反映されます。',
      recentActivityLiveCountSuffix: '件',
      recentActivityShowAllButton: 'すべて表示',
    },
    discover: {
      title: 'プロジェクト探索',
      subtitle: 'フィルターは URL とリアルタイム同期。',
      filtersHeading: 'フィルター',
      mobileFiltersButton: 'フィルター',
      resetFilters: 'フィルターをリセット',
      searchPlaceholder: 'キーワード、スタック、メイカー、リポジトリを検索...',
      sortLabel: '並び替え',
      resultsCount: '件の結果',
      emptyTitle: '一致するプロジェクトが見つかりません',
      emptyBody: 'フィルター条件を緩めるか、検索キーワードを変更してください。',
      previousPage: '前へ',
      nextPage: '次へ',
      filterType: 'コンテンツ種別',
      filterCategory: 'プロジェクトカテゴリ',
      allCategoriesOption: 'すべてのカテゴリ',
      filterTags: 'プロジェクトタグ',
      clearTags: 'タグ解除',
      activeTagsPrefix: '選択中のタグ',
      tagsHint: '複数タグの組み合わせで絞り込めます。',
      filterPlatform: '開発プラットフォーム',
      filterHosting: 'ホスティング',
      filterBackend: 'バックエンド',
      filterCountry: '国・地域',
      filterLanguage: '対応言語',
      filterLicense: 'ライセンス',
      filterPricing: '料金モデル',
      filterVerification: '検証ステータス',
      filterMinStars: '最小 GitHub スター',
      filterUpdatedWithin: '最終更新',
      allOption: 'すべて',
      webAppsTop100Title: 'Web アプリ Top #1 – #100 全件表示',
      webAppsTop100Subtitle: 'GitHub 公式 Search REST API に基づき、上位 #1 から #100 のオープンソース Web アプリを一括レンダリングします。',
      webAppsLoading: 'Web アプリ #1 – #100 を読み込み中...',
      webAppsError: 'ライブ Web アプリ Top 100 を取得できないため、ローカル登録項目のみ表示しています。',
      webAppsRetry: '再試行',
      summaryRegionLabel: 'カタログ主要サマリー',
      summaryTotalProjectsLabel: '総プロジェクト数',
      summaryVerifiedSuffix: '件検証済み',
      summaryMatchingSuffix: '件一致',
      summaryPopularCategoryLabel: '最も人気のカテゴリ',
      summaryCategoryShareUnit: '件',
      summaryFilterCategoryAction: '絞り込む',
      summaryGrowthTrendsLabel: '最近の成長トレンド',
      summaryGrowthStarsUnit: '7日間スター',
      summaryGrowthSignalsUnit: '7日間反応',
      summaryRisingProjectsSuffix: '件上昇中',
      summaryNoGrowthYet: '7日間の変化なし',
      typeFilterBarLabel: 'プロジェクト種別クイックフィルター',
      typeFilterClearLabel: 'リセット',
    },
    projectGrowth: {
      title: 'プロジェクト成長推移',
      subtitle: '過去30日間の新規プロジェクト登録数と7日移動平均の推移を可視化します。',
      toggleExpand: '成長グラフを展開',
      toggleCollapse: '成長グラフを折りたたむ',
      modeDaily: '日別登録',
      modeCumulative: '累計推移',
      scopeAll: '全カタログ',
      scopeFiltered: '絞り込み中',
      kpiNew30d: '過去30日新規',
      kpiPeakDay: 'ピーク日',
      kpiWeeklyPace: '週間登録ペース',
      kpiCatalogTotal: '総登録数',
      perWeekUnit: '/週',
      catalogGrowthSuffix: 'カタログ増加率',
      activeDaysSuffix: '日登録あり',
      dailySeriesLabel: '新規登録',
      rollingAvgLabel: '7日移動平均',
      cumulativeSeriesLabel: '累計プロジェクト',
      tooltipProjectsLabel: '登録プロジェクト',
      tooltipMoreSuffix: '件',
      noPeakYet: '記録なし',
      emptyTitle: '過去30日間の新規登録はありません',
      emptyFilteredBody: '現在の絞り込み条件では過去30日間の登録がありません。フィルターをリセットするか全カタログをご確認ください。',
      emptyCatalogBody: '新しいプロジェクトを登録すると、過去30日間の成長推移が表示されます。',
      resetFilterButton: 'フィルターをリセット',
      submitProjectButton: '登録する',
    },
    trendingSection: {
      title: 'トレンド & 成長速度',
      subtitle: '過去30日間・7日間のスター増加数と成長速度を D3 で可視化し、急上昇プロジェクトを見つけます。',
      toggleExpand: 'グラフを展開',
      toggleCollapse: 'グラフを折りたたむ',
      tabStar30d: '30日間スター増加',
      tabStar7d: '7日間急上昇',
      tabSignalVelocity: 'コミュニティ成長速度',
      chartHeading: '急上昇プロジェクト順位',
      trajectoryHeading: '日別累積推移',
      unitStars: 'スター',
      unitSignals: 'シグナル',
      perDaySuffix: '/日',
      periodDeltaLabel: '期間純増',
      dailyVelocityLabel: '日次速度',
      currentTotalLabel: '現在合計',
      inspectButton: '詳細を見る',
      emptyStarTitle: '複数日の GitHub スター履歴がまだ記録されていません',
      emptyStarBody: '複数の日付でリポジトリを同期すると、ここに30日・7日のスター成長速度が D3 グラフで表示されます。',
      switchToSignalButton: 'コミュニティ成長速度を表示',
      emptyFilteredTitle: '現在のフィルターに一致する成長データがありません',
      emptyFilteredBody: 'フィルター条件を緩めると、急上昇プロジェクトの成長速度グラフが表示されます。',
      fallbackNote: '複数日の GitHub スター履歴が蓄積されるまで、検証済み W-Vibe 内部成長速度を表示しています。',
    },
    githubTrendingBubble: {
      title: 'GitHub Trending · AI エコシステム',
      subtitle: 'D3 バブルチャートで AI エコシステムの最注目 GitHub リポジトリを日別スター数サイズで可視化します。',
      toggleExpand: 'バブルチャートを展開',
      toggleCollapse: 'バブルチャートを折りたたむ',
      refreshButton: '更新',
      refreshing: '読み込み中...',
      allLanguages: 'すべての言語',
      perDaySuffix: '/日',
      dailyStarsLabel: '日別スター',
      totalStarsLabel: '累計スター',
      forksLabel: 'Forks',
      pushedLabel: '最終プッシュ',
      topMoversHeading: '日別上位リポジトリ',
      openGithubButton: 'GitHub で開く',
      inspectVibeAtlasButton: 'W-Vibe で詳細を見る',
      loadingLabel: 'アクティブな AI エコシステムリポジトリを読み込み中...',
      emptyTitle: '該当言語のトレンドリポジトリはありません',
      emptyBody: '言語フィルターをリセットすると AI エコシステム全体のバブルが表示されます。',
      resetLanguageButton: 'すべて表示',
      errorTitle: 'GitHub Trending リポジトリを取得できませんでした',
      retryButton: '再試行',
      cachedNotice: 'キャッシュ表示中',
      rateModeVelocity: '日次スター増加ペース基準',
      rateModeSnapshot: '24時間スナップショット差分',
      reposCountLabel: '件の活発なリポジトリ',
      clickHint: 'バブルをクリックまたはホバーして詳細を確認',
    },
    discoveryMap: {
      title: 'エコシステム・ビジュアル探索マップ',
      subtitle: 'GitHub スター数（X軸・対数）と更新・コミュニティ活動頻度（Y軸）に基づく D3 散布図で直感的に探索します。',
      toggleExpand: 'マップを展開',
      toggleCollapse: 'マップを折りたたむ',
      scopeEcosystem: 'エコシステム全体',
      scopeDirectory: 'ディレクトリ絞り込み結果',
      scopeVerifiedMakers: '認証メイカーのみ',
      allTypes: 'すべて',
      xAxisLabel: 'GitHub スター（対数スケール）',
      yAxisLabel: '活動頻度スコア (0–100)',
      quadrantLeaders: 'エコシステム上位',
      quadrantActiveBuilders: '高活性・注目ビルド',
      quadrantEstablished: '安定・成熟',
      quadrantEmerging: '初期・ニッチ',
      spotlightHeading: 'ノード詳細スポットライト',
      starsMetricLabel: 'GitHub スター',
      activityMetricLabel: '活動頻度',
      dailyVelocityLabel: '日次スター速度',
      recencyLabel: '最終活動',
      todayLabel: '今日',
      daysAgoSuffix: '日前',
      sourceDirectory: 'W-Vibe 登録',
      sourceEnriched: 'ディレクトリ + リアルタイム GitHub',
      sourceEcosystem: 'GitHub AI エコシステム',
      inspectButton: '詳細を見る',
      openGithubButton: 'GitHub で開く',
      emptyTitle: '条件に一致するノードがありません',
      emptyBody: 'すべてのタイプに戻すかディレクトリ条件をリセットして全体マップを表示してください。',
      resetMapFilter: 'マップ絞り込み解除',
      resetFiltersButton: 'ディレクトリ条件をリセット',
      pointsCountLabel: '件のノードを表示中',
      interactionHint: '各ドットにホバーまたはクリックして詳細指標を確認',
      medianGuideNote: '破線：中央値ライン',
    },
    card: {
      githubStars: 'GitHub スター',
      internalLikes: 'いいね',
      internalBookmarks: 'ブックマーク',
      notSynced: '未同期',
      staleLabel: '同期が古い',
      verifiedLabel: '検証済み',
      pendingLabel: '検証待ち',
      unverifiedLabel: '未検証',
      missingLicense: 'ライセンス未記載',
      openDetail: '詳細を見る',
      likeAction: 'いいね',
      bookmarkAction: 'ブックマーク',
      trendingBadge: 'トレンド',
      trending7dTooltip: '過去 7 日間で GitHub スター +{count} 増加',
      trendingEngagementTooltip: '過去 7 日間でいいね +{likes}・ブックマーク +{bookmarks}（計 +{total} 増加）',
      compareAdd: '比較に追加',
      compareSelected: '比較対象',
      starHistory7d: '7日間のスター推移',
      starHistoryBaseline: '基準スナップショット',
      starHistoryNoSnapshots: 'スナップショット未記録',
      statusBadgesLabel: 'プロジェクトステータスバッジ',
      openSourceBadge: 'オープンソース',
      openSourceTooltip: 'オープンソースとして公開されているプロジェクトです。',
      openSourceWithLicenseTooltip: 'オープンソースプロジェクト（{license} ライセンス）',
      verifiedTooltip: 'リポジトリおよびメタデータの検証が完了しています。',
      pendingTooltip: 'メタデータと所有権の検証が進行中です。',
      unverifiedTooltip: '公式のメタデータ検証はまだ完了していません。',
    },
    highlights: {
      containerLabel: 'プロジェクト注目バッジ',
      featured: '注目ピック',
      newArrival: '新着',
      highActivity: '高アクティビティ',
      featuredTooltip: '検証済みメタデータと高いコミュニティ評価に基づく注目プロジェクトです。',
      newArrivalTooltip: '最近カタログに追加された新着プロジェクトです（{date}）。',
      highActivityTooltip: '直近の更新頻度やコミュニティ反応が特に活発なプロジェクトです。',
      highActivityStarsTooltip: '過去 7 日間で GitHub スター +{count} 増加の高成長プロジェクトです。',
      highActivitySignalsTooltip: '過去 7 日間でいいね・ブックマーク +{count} 件の活発な反応があります。',
    },
    verification: {
      claimedBadge: 'メイカー認証',
      claimedTooltip: '制作者本人によって所有権が認証・管理されているプロジェクトです。',
      pendingBadge: '認証審査中',
      pendingTooltip: 'メイカー所有権の認証リクエストを受領し確認中です。',
      unclaimedBadge: '未認証',
      panelTitleClaimed: 'メイカー所有権 認証済み',
      panelBodyClaimed:
        '公式メイカーが W-Vibe 上で所有権を認証済みです。外部リンクやライセンス表記、制作者情報の信頼性が確認されています。',
      panelTitlePending: 'メイカー所有権 認証審査中',
      panelBodyPending:
        '所有権の認証申請が提出され確認中です。承認されるとカードおよび詳細モーダルにメイカー認証バッジが表示されます。',
      panelTitleUnclaimed: 'メイカー未認証リスティング',
      panelBodyUnclaimed:
        '公開リポジトリまたはコミュニティ登録によるエントリです。制作者ご本人の場合は所有権を申請して信頼バッジを取得できます。',
      attributionLabel: 'メイカー',
      methodLabel: '認証方法',
      statusLabel: 'ステータス',
      statusClaimed: '所有権認証済み',
      statusPending: '審査中',
      statusUnclaimed: '未認証',
      ownerTag: 'あなたの登録',
      methodGithub: 'GitHub リポジトリ権限',
      methodDns: 'ドメイン DNS TXT',
      methodDemo: 'ライブデモ Meta タグ',
      methodDirect: 'メイカー直接投稿・検証済み',
      claimCta: '所有権を認証する',
    },
    compare: {
      trayTitle: 'プロジェクト比較',
      trayHintOneMore: '並べて比較するにはもう 1 件選択してください（最大 3 件）。',
      trayLimitNotice: '同時に比較できるのは最大 3 件までです。いずれかを外してから追加してください。',
      emptySlotLabel: '空きスロット',
      compareNowButton: '並べて比較する',
      clearButton: 'すべて解除',
      removeAction: '比較から外す',
      modalTitle: 'プロジェクト比較テーブル',
      modalSubtitle: 'GitHub 指標（スター・フォーク・ライセンス）と技術スタック・メタデータを並べて比較します。',
      closeButton: '閉じる',
      colAttribute: '比較項目',
      sectionGithub: 'GitHub 統計',
      sectionMetadata: 'メタデータ・技術スタック',
      sectionCommunity: 'コミュニティ指標・リンク',
      rowGithubStars: 'GitHub スター',
      rowGithubForks: 'GitHub フォーク',
      rowLicense: 'ライセンス',
      rowRepository: 'リポジトリ',
      rowLastSynced: '最終同期',
      rowContentType: 'コンテンツ種別',
      rowCategories: 'カテゴリ',
      rowPlatform: '開発プラットフォーム',
      rowHostingBackend: 'ホスティング・バックエンド',
      rowTechStack: '技術スタック',
      rowPricing: '料金モデル',
      rowVerification: '検証状態・出典',
      rowCountryLang: '国・言語',
      rowUpdatedAt: '最終更新',
      rowEngagement: 'いいね・ブックマーク',
      rowLinks: 'リンク',
      highestBadge: '最多',
      latestBadge: '最新',
      openDetail: '詳細を見る',
      notAvailable: '未設定',
    },
    detail: {
      close: '閉じる',
      externalLinksTitle: '外部リンク（外部サイトへ移動）',
      internalActionsTitle: 'W-Vibe 内部アクション',
      liveDemo: 'ライブデモ',
      officialWebsite: '公式サイト',
      githubRepository: 'GitHub リポジトリ',
      syncGithubNow: '今すぐ GitHub 同期',
      syncing: '同期中...',
      provenanceTitle: 'メタデータ出典 & 鮮度',
      provenanceSourceLabel: '出典',
      lastSyncedLabel: '最終同期',
      missingFieldsLabel: '未入力・未検証項目',
      noneMissing: '主要メタデータはすべて揃っています',
      techAndPlatformTitle: 'スタック & プラットフォーム帰属',
      platformLabel: '開発プラットフォーム',
      hostingLabel: 'ホスティング',
      backendLabel: 'バックエンド',
      licenseLabel: 'ライセンス',
      pricingLabel: '料金プラン',
      countryLangLabel: '国 / 言語',
      historyChartTitle: '過去 14 日間の成長推移（GitHub スター・内部指標）',
      historyChartSubtitle: '外部 GitHub スターと W-Vibe 内部のいいね・ブックマークは別軸で表示されます。',
      chartTabStars: 'GitHub スター',
      chartTabInternal: '内部いいね・ブックマーク',
      chartUnsyncedStarsHint: 'GitHub リポジトリが未同期です。同期するとリアルタイムスター数が表示されます。',
      chartLiveTotalLabel: '現在の GitHub スター',
      chartDeltaLabel: '14日間増加',
      chartBaselineNote: 'リアルタイム基準値（日次同期が蓄積されると推移が表示されます）',
      relatedTitle: '関連プロジェクト & 代替ツール',
      reportButton: '誤情報を報告',
      claimButton: '所有権を申請',
      reportTitle: '情報誤り・リンク切れの報告',
      claimTitle: 'メイカー所有権認証を申請',
      submitReport: '報告を送信',
      submitClaim: '認証申請を送信',
      actionSubmitted: 'Firestore に安全に保存されました。',
      signInRequired: 'この操作を保存するには Google ログインが必要です。',
      communityActivityTitle: 'コミュニティアクティビティ',
      communityActivitySubtitle: 'このプロジェクトへの最近のいいね・ブックマーク・報告を時系列で表示します。',
      activityFilterAll: 'すべて',
      activityFilterLikes: 'いいね',
      activityFilterBookmarks: 'ブックマーク',
      activityFilterReports: '報告',
      activityActionLike: 'がプロジェクトにいいねしました',
      activityActionBookmark: 'がプロジェクトをブックマークしました',
      activityActionReport: 'が問題を報告しました',
      activityGuestActor: 'ゲストメンバー',
      activityEmptyTitle: 'まだ最近のアクティビティはありません',
      activityEmptySubtitle: '上のいいね・ブックマーク・報告ボタンを使うと、ここに時系列でリアルタイム表示されます。',
      activityLoadingLabel: 'アクティビティを読み込み中...',
      activityErrorNotice: 'Firestore のリアルタイム同期を取得できないため、ローカル履歴のみ表示しています。',
      activityReasonBrokenLink: 'リンク切れ',
      activityReasonStaleMetadata: '古いメタデータ',
      activityReasonMisattribution: '帰属情報の誤り',
      activityReasonSpam: 'スパム',
      activityReasonSecurityConcern: 'セキュリティ上の懸念',
      vibeScoreTitle: 'Vibe スコア · コミュニティ健全度',
      vibeScoreSubtitle: 'W-Vibe 内部エンゲージメント・直近モメンタム・検証鮮度・同期済み GitHub 指標に基づく D3 ゲージです。',
      vibeScoreOutOf100: '/ 100',
      vibeScoreTierThriving: '高活性 (Thriving)',
      vibeScoreTierActive: '活発 (Active)',
      vibeScoreTierWarm: '安定 (Warm)',
      vibeScoreTierQuiet: '静穏 (Quiet)',
      vibeScorePillarAffinity: 'コミュニティ好感度 (いいね・保存)',
      vibeScorePillarMomentum: '直近アクティビティ勢い',
      vibeScorePillarTraction: '同期済み GitHub 牽引力',
      vibeScorePillarHealth: '検証・更新フレッシュネス',
      vibeScoreUnsyncedNote: 'GitHub 未同期のため外部牽引力スコアは 0 点です',
      vibeScoreReportsPenalty: '問題報告による減点反映',
      vibeScoreFormulaNote: '内部エンゲージメント・健全度（最大75点）と同期済み外部 GitHub 指標（最大25点）を分離して合算しています。',
      sharePromoteTitle: 'プロモーション · 共有',
      copyDirectLink: 'リンクをコピー',
      copyPromoPitch: '紹介文をコピー',
      copiedFeedback: 'コピーしました',
      timelineTitle: 'プロジェクトタイムライン & マイルストーン',
      timelineSubtitle: 'GitHub リリース・直近コミット履歴と作成者が記録したマイルストーンログを時系列で可視化します。',
      timelineFilterAll: 'すべて',
      timelineFilterReleases: 'リリース',
      timelineFilterCommits: 'コミット',
      timelineFilterCreatorLogs: '作成者ログ',
      timelineSortNewest: '新しい順',
      timelineSortOldest: '古い順',
      timelineAddButton: 'マイルストーンを追加',
      timelineCloseComposer: 'フォームを閉じる',
      timelineCadenceLabel: '活動タイムスパン',
      timelineSpanDaysSuffix: '日間',
      timelineGapSuffix: '日の間隔',
      timelineLoadingLabel: 'GitHub リポジトリのリリースとコミットを取得中...',
      timelineRepoErrorNotice: 'GitHub のアクティビティを一時的に取得できないため、ディレクトリおよび作成者ログのみ表示しています。',
      timelineNoRepoNote: 'GitHub リポジトリ未連携のため、ディレクトリ履歴と作成者ログを表示しています。',
      timelineEmptyTitle: '該当するマイルストーンがありません',
      timelineEmptyBody: '「すべて」に切り替えると、リポジトリやディレクトリの履歴を確認できます。',
      timelineEmptyCreatorBody: '作成者によるカスタム更新ログはまだ登録されていません。',
      timelineAuthNoticeSignedOut: '公式マイルストーンログを公開するには、プロジェクト所有者の Google アカウントでログインしてください。',
      timelineAuthNoticeNotOwner: '登録済みのプロジェクト所有者または管理者のみ作成者ログを追加できます。制作者の場合は上から所有権認証を申請してください。',
      timelineSignInCta: 'Google でログイン',
      timelineClaimCta: '所有権認証を開く',
      timelineKindLabel: '種別',
      timelineKindRelease: 'リリース',
      timelineKindLaunch: 'ローンチ',
      timelineKindFeature: '新機能',
      timelineKindUpdate: 'アップデート',
      timelineKindFix: '修正',
      timelineVersionLabel: 'バージョンタグ（任意）',
      timelineDateLabel: '日付',
      timelineEntryTitleLabel: 'タイトル *',
      timelineSummaryLabel: '概要（任意）',
      timelineUrlLabel: '参考 URL（任意）',
      timelinePublishButton: 'タイムラインに公開',
      timelinePublishingButton: '公開中...',
      timelineDeleteButton: 'マイルストーンを削除',
      timelineExternalLink: 'ソースを開く',
      timelineSourceRelease: 'GitHub リリース',
      timelineSourceCommit: 'コミット',
      timelineSourceCreator: '作成者ログ',
      timelineSourceCatalog: 'ディレクトリ履歴',
      volatilityTitle: 'Vibe スコア変動率 vs. GitHub スター成長率',
      volatilitySubtitle: 'D3 デュアルトレンド線で Vibe スコアの揺らぎ幅（±σ バンド）と日次スター増加率を比較します。',
      volatilityModePace: '複合トレンド',
      volatilityModeSwing: '日次変動幅',
      volatilityMetricStdDev: '変動率 (σ)',
      volatilityMetricNetVibe: '14日間 Vibe 変化',
      volatilityMetricStarRate: '14日間スター成長率',
      volatilityMetricMaxSwing: '最大日次振れ幅',
      volatilityVerdictLabel: '技術採用ペースとコミュニティ感情の整合性',
      volatilityVerdictKeepingPace: '技術採用と歩調が一致',
      volatilityVerdictKeepingPaceDesc: 'コミュニティの Vibe スコアと GitHub スター増加率がバランスよく連動しています。',
      volatilityVerdictSentimentLeading: 'コミュニティ期待が先行',
      volatilityVerdictSentimentLeadingDesc: '内部の注目度やスコア変動が現在のリポジトリスター成長速度を上回っています。',
      volatilityVerdictAdoptionOutpacing: '技術採用がコミュニティを上回る',
      volatilityVerdictAdoptionOutpacingDesc: 'GitHub スターの伸びが W-Vibe 内部のコミュニティ勢いよりも速く進んでいます。',
      volatilityVerdictUnsynced: 'GitHub 未同期',
      volatilityVerdictUnsyncedDesc: '内部 Vibe 変動のみ追跡中です。GitHub を同期すると実測スター成長率を重ねて比較できます。',
      volatilityVerdictBaseline: '初回スナップショット基準',
      volatilityVerdictBaselineDesc: '本日のスター数が記録されました。複数日の同期データが蓄積すると日次成長率が描画されます。',
      volatilityLegendVibeScore: 'Vibe スコア (0–100)',
      volatilityLegendBand: '変動バンド (±σ)',
      volatilityLegendStarRate: '日次スター成長率 (%)',
      volatilityLegendSwing: '日次 Vibe 増減 (Δ)',
      volatilityLeftAxisLabel: 'Vibe スコア',
      volatilityRightAxisLabel: 'スター成長率 (%)',
      volatilitySwingAxisLabel: '日次変動 (Δpt)',
      volatilityScrubHint: '日付ポイントにホバーまたは選択すると詳細数値を表示します',
      volatilityDateLabel: '日付',
      volatilityVibeDeltaLabel: '前日比 Vibe',
      volatilityStarGainLabel: '日次スター増減',
      insightsTitle: 'プロジェクトインサイト · 直近 7 日間のいいね & ブックマーク',
      insightsSubtitle: '直近 7 日間のいいね（即時反応）とブックマーク（保存意図）の日次増減および累計推移を D3 で可視化します。',
      insightsModeDaily: '日次増減',
      insightsModeCumulative: '7日間累計推移',
      insightsKpiLikes7d: '7日間のいいね増',
      insightsKpiBookmarks7d: '7日間の保存増',
      insightsKpiBookmarkShare: 'ブックマーク比率',
      insightsKpiPeakDay: '最大アクティブ日',
      insightsTotalPrefix: '累計',
      insightsAvgPerDay: '日平均',
      insightsNoPeakDay: '記録なし',
      insightsScrubHint: '日付ごとのバーやノードを選択して詳細数値を確認できます',
      insightsDateLabel: '日付',
      insightsCombinedLabel: '合計',
      insightsMixTitle: '7日間の反応内訳',
      insightsEmptyTitle: '直近 7 日間に記録されたいいね・ブックマークはまだありません。',
      insightsEmptyHint: '下のいいねまたはブックマークを押すと、日次のコミュニティ推移が即座に反映されます。',
      insightsAxisCount: '件数',
      editProject: 'プロジェクトを編集',
      starGrowthTitle: 'スター成長推移 (Star Growth)',
      starGrowthSubtitle: 'スタースナップショットシステムに記録された GitHub スターの履歴推移を可視化します。',
      starGrowthRange7d: '7日間',
      starGrowthRange30d: '30日間',
      starGrowthRangeAll: '全期間',
      starGrowthModeTotal: '累計スター',
      starGrowthModeDelta: '日次増減',
      starGrowthKpiCurrent: '最新スナップショット',
      starGrowthKpiNet: '期間純増',
      starGrowthKpiAvgDay: '日平均ペース',
      starGrowthKpiSnapshots: '記録スナップショット',
      starGrowthDaysSuffix: '日',
      starGrowthPerDaySuffix: '/日',
      starGrowthNoRepo: 'GitHub リポジトリが未設定のためスタースナップショットを追跡できません。',
      starGrowthUnsynced: 'スナップショットがまだありません。今すぐ GitHub 同期して基準値を記録してください。',
      starGrowthSingleBaseline: '現在は単一スナップショットのみ記録されています。複数日の記録が蓄積すると成長曲線が表示されます。',
      starGrowthTooltipTotal: '記録スター数',
      starGrowthTooltipDelta: '前日比',
      starGrowthTooltipCumulative: '期間累計',
      mobileViewToggle: 'モバイルビュー',
      mobileViewTitle: 'モバイルビュープレビュー',
      mobileViewSubtitle: '固定スマートフォン画面比率フレーム内でプロジェクトのライブデモを確認します。',
      mobileViewClose: 'モバイルビューを閉じる',
    },
    submit: {
      title: '新しいプロジェクトを登録',
      subtitle: '検証可能なメタデータを入力するとディレクトリに即時公開され、Firestore に保存されます。',
      promoPreviewTitle: 'トップページ紹介プレビュー',
      promoPreviewSubtitle: '公開するとトップページのショーケースに掲載され、下記の紹介文でそのまま発信できます。',
      promoPreviewUntitled: 'あなたの AI プロジェクト（入力プレビュー）',
      promoPreviewTaglineFallback: 'タグラインを入力すると共有用の紹介文が生成されます。',
      githubImportTitle: 'GitHub リポジトリからメタデータを取得',
      githubImportHint: '例: modelcontextprotocol/servers または https://github.com/cline/cline',
      githubImportPlaceholder: 'owner/repo または GitHub URL を入力',
      githubFetchButton: 'リアルタイム取得',
      fetchingGithub: '取得中...',
      nameLabel: 'プロジェクト名 *',
      taglineEnLabel: '英語タグライン（5〜220文字）*',
      taglineKoLabel: '韓国語タグライン',
      descriptionEnLabel: '英語の詳細説明（20文字以上）*',
      descriptionKoLabel: '韓国語の詳細説明',
      contentTypeLabel: 'コンテンツ種別',
      categoriesLabel: 'カテゴリ・タグ（カンマ区切り・最大6つ）*',
      categoriesQuickTagsHint: 'クイックタグ選択（クリックで切替）：',
      techStackLabel: '技術スタック（カンマ区切り・最大12件）',
      platformLabel: '開発プラットフォーム',
      hostingLabel: 'ホスティング',
      backendLabel: 'バックエンド技術',
      countryLabel: '国コード（例: KR, JP, US）*',
      languageLabel: '対応言語',
      licenseLabel: 'ライセンス（例: MIT, Apache-2.0）*',
      pricingLabel: '料金モデル',
      liveDemoLabel: 'ライブデモ URL (https://)',
      websiteLabel: '公式サイト URL (https://)',
      githubUrlLabel: 'GitHub URL (https://)',
      makerNameLabel: 'メイカー / チーム名 *',
      makerHandleLabel: 'メイカーハンドル（例: @handle）',
      submitButton: 'ディレクトリに公開',
      submitting: '公開中...',
      signInPrompt: 'プロジェクトを Firestore に公開するには Google でログインしてください。',
      submitSuccess: 'プロジェクトを公開しました！',
      draftRestoredNotice: '前回の入力途中の下書きをローカルストレージから復元しました。',
      draftAutosaveHint: '入力内容は 30 秒ごとにブラウザのローカルストレージへ自動保存されます。',
      clearDraftButton: '下書きを削除',
      validationSummaryPrefix: '入力内容を確認してください',
    },
    maker: {
      title: 'メイカーダッシュボード & 保存一覧',
      subtitle: '公開したプロジェクト、ブックマーク、所有権申請、報告履歴を管理します。',
      myProjectsTab: '公開プロジェクト',
      myBookmarksTab: 'ブックマーク',
      claimsReportsTab: '所有権申請・報告履歴',
      signInCtaTitle: 'Google ログインでメイカーダッシュボードを開く',
      signInCtaBody: 'プロジェクト管理、GitHub 再同期、端末間ブックマーク同期を利用できます。',
      noProjectsYet: 'まだ公開したプロジェクトはありません。',
      noBookmarksYet: 'ブックマークしたプロジェクトはありません。',
      resyncGithub: 'GitHub 再同期',
      deleteProject: '削除',
      analyticsTitle: 'エンゲージメント分析',
      analyticsSubtitle: '内部のいいね・ブックマーク合計は外部 GitHub スターと分離して集計されます。',
      metricOwnedProjects: '公開プロジェクト',
      metricTotalLikes: '累計いいね',
      metricTotalBookmarks: '累計ブックマーク',
      metricTotalEngagement: '内部エンゲージメント計',
      metricExternalStarsNote: '外部 GitHub スター合計',
      analyticsSortEngagement: '総エンゲージメント順',
      analyticsSortLikes: 'いいね順',
      analyticsSortBookmarks: 'ブックマーク順',
      analyticsSortRecent: '新着順',
      tableProjectCol: 'プロジェクト',
      tableLikesCol: 'いいね',
      tableBookmarksCol: 'ブックマーク',
      tableTotalCol: '合計',
      tableSplitCol: 'エンゲージメント比率',
      tableGithubCol: 'GitHub スター',
      topProjectLabel: '最多エンゲージメント',
      analyticsEmptyHint: 'プロジェクトを公開すると、作品ごとのいいね・ブックマーク内訳が表示されます。',
      projectListHeading: '公開プロジェクト一覧',
      likesUnit: 'いいね',
      bookmarksUnit: 'ブックマーク',
      engagementUnit: '合計',
      editProject: '編集',
      editSuccessNotice: 'プロジェクトの更新内容を保存しました。',
      confirmDeleteLabel: '削除を確定',
      cancelDeleteLabel: 'キャンセル',
      lastUpdatedPrefix: '最終更新',
      viewDetail: '詳細',
    },
    editModal: {
      title: '保有プロジェクトを編集',
      subtitle: 'メタデータ、タグ、リンク、説明文を最新の状態に更新して Firestore に反映します。',
      adminModeNote: '管理者権限でこの Firestore プロジェクトを編集中です。',
      immutableNote: '整合性維持のため、Slug・いいね/保存数・検証ステータスは変更されません。',
      slugLabel: 'スラッグ',
      statusLabel: '検証状態',
      lastUpdatedLabel: '最終更新',
      githubSyncHeading: 'GitHub リポジトリ情報を再取得',
      githubSyncHint: '最新のスター数・フォーク・ライセンスを取得し、空欄の説明や技術スタックのみ自動補完します。',
      githubFillEmptyButton: 'GitHub 最新同期',
      thumbnailUrlLabel: 'サムネイル画像 URL (https://)',
      thumbnailPreviewLabel: 'サムネイルプレビュー',
      sectionBasic: '基本情報・紹介文',
      sectionClassification: 'カテゴリ・技術スタック・インフラ',
      sectionLinksMaker: '外部リンク・サムネイル・メイカー',
      resetButton: '変更を戻す',
      cancelButton: 'キャンセル',
      saveButton: '変更を保存',
      savingButton: '保存中...',
      noChangesHint: '変更された項目はありません。',
      changedCountSuffix: '件の変更',
      closeLabel: '編集モーダルを閉じる',
    },
    mobileDemo: {
      sectionTitle: 'モバイルアプリ公開 & インタラクティブデモ設定',
      sectionSubtitle: 'iOS・Android・PWA 対応情報、ストアURL、デバイスシミュレーター、QRテストリンクを設定します。',
      enableToggleLabel: 'モバイルアプリ / PWA デバイスデモを有効にする',
      enableToggleHint: 'WebアプリやAIツールでも、モバイルプレビュー枠とQRテストリンクを併設できます。',
      targetPlatformsLabel: '対応モバイルOS / 環境',
      quickMobileStackLabel: 'モバイル技術スタックを素早く追加',
      mobileDemoUrlLabel: 'インタラクティブモバイルデモ URL (Expo Snack / PWA / モバイルWeb)',
      mobileDemoUrlPlaceholder: 'https://snack.expo.dev/... または https://m.example.com',
      iosAppStoreLabel: 'App Store / TestFlight URL',
      iosAppStorePlaceholder: 'https://apps.apple.com/... または https://testflight.apple.com/...',
      androidPlayStoreLabel: 'Google Play URL',
      androidPlayStorePlaceholder: 'https://play.google.com/store/apps/details?id=...',
      mobilePackageUrlLabel: 'ビルド / APK / IPA / Expo URL',
      mobilePackageUrlPlaceholder: 'https://expo.dev/... または https://github.com/.../releases',
      bundleIdLabel: 'Bundle / パッケージID',
      bundleIdPlaceholder: 'com.wvibe.app',
      minOsLabel: '最小OS要件',
      minOsPlaceholder: 'iOS 16+ / Android 13+',
      devicePresetLabel: '初期デバイスフレーム',
      orientationLabel: '初期画面向き',
      presetIphone: 'iPhone 16',
      presetPixel: 'Pixel 9',
      orientationPortrait: '縦向き (Portrait)',
      orientationLandscape: '横向き (Landscape)',
      liveSubmitPreviewTitle: 'リアルタイムモバイルプレビュー & QRテスト',
      liveSubmitPreviewSubtitle: '公開前に詳細モーダルのモバイルシミュレーター表示を即座に確認できます。',
      simulatorTitle: 'インタラクティブモバイルデモシミュレーター',
      simulatorSubtitle: 'デバイス枠の切り替え、縦横回転、スマホ用QRコードでの実機テストに対応しています。',
      modeAppCard: 'インタラクティブカード',
      modeLiveFrame: 'ライブ Web / Expo フレーム',
      openExternalButton: '新しいタブで開く',
      copyDemoLinkButton: 'モバイルテストURLをコピー',
      copiedLinkLabel: 'コピーしました',
      iframeFallbackNotice: '外部サイトの X-Frame-Options 制限により埋め込みできない場合は、カード表示または新しいタブで開くをご利用ください。',
      iframeBlockedButton: 'カードプレビューに切替',
      qrTitle: 'スマホで実機テスト (QR)',
      qrSubtitleDemo: 'カメラでスキャンすると、ライブモバイルデモをスマホで直接開けます。',
      qrSubtitleStore: 'カメラでスキャンすると、ストアまたはビルド配布ページを開きます。',
      qrSubtitleShare: 'カメラでスキャンすると、W-Vibe のプロジェクトページを開きます。',
      storeLinksTitle: 'ストア & ビルド配布リンク',
      noStoreLinksNote: 'ストアまたは直接ビルドURLはまだ登録されていません。',
      specsTitle: 'モバイルアプリ仕様',
      cardBadgeLabel: 'モバイルデモ',
      previewTabOverview: '概要',
      previewTabFeatures: '技術スタック',
      previewTabRelease: 'リリース情報',
      previewInteractiveCta: 'モバイルデモを開く',
    },
    footer: {
      tagline: 'W-Vibe — AI · MCP · Skills ディレクトリ',
      transparencyNote: 'GitHub スターと内部指標は常に分離集計されます。',
    },
    voiceSearch: {
      startLabel: '音声で検索',
      stopLabel: '音声入力を停止',
      listeningStatus: '聞き取り中... 検索キーワードをお話しください',
      stopButton: '停止',
      unsupportedError: 'お使いのブラウザは音声検索（Web Speech API）に対応していません。Chrome または Edge をお試しください。',
      permissionDeniedError: 'マイクへのアクセスが拒否されました。ブラウザ設定からマイク権限を許可してください。',
      noSpeechError: '音声が検出されませんでした。マイクに向かって再度お話しください。',
      audioCaptureError: 'マイクデバイスが見つかりません。オーディオ入力設定をご確認ください。',
      networkError: '音声認識サービスへの接続に失敗しました。通信環境をご確認ください。',
      unknownError: '音声認識を完了できませんでした。しばらくしてから再試行してください。',
      dismissError: '閉じる',
    },
    githubStarsPage: {
      title: 'GitHub スター Top 100 ランキング',
      subtitle: 'GitHub 公式 Search REST API に基づくスター数上位 100 リポジトリのリアルタイム集計（W-Vibe 内部評価とは別集計）。',
      refreshButton: '最新に更新',
      refreshing: '読み込み中...',
      presetAll: '世界 Top 100',
      presetWebApps: 'Web アプリ',
      presetAiAgents: 'AI・エージェント・MCP',
      presetTypescript: 'TypeScript',
      presetPython: 'Python',
      presetRust: 'Rust',
      presetGo: 'Go',
      kpiRankedCount: '集計リポジトリ',
      kpiTopStars: '1位スター数',
      kpiMedianStars: '中央値スター',
      kpiLastUpdated: '最終同期',
      cachedFallbackBadge: 'キャッシュ表示中',
      searchPlaceholder: 'Top 100 内でリポジトリ名・説明・トピックを検索...',
      allLanguagesOption: 'すべての言語',
      showingCountLabel: '件のリポジトリを表示',
      colRank: '順位',
      colRepository: 'リポジトリ',
      colLanguageLicense: '言語 · ライセンス',
      colForks: 'Forks',
      colStars: 'GitHub スター',
      colActions: 'リンク',
      openInVibeAtlas: 'W-Vibe 詳細',
      openGithub: 'GitHub',
      emptyFilteredTitle: '条件に一致するリポジトリがありません',
      emptyFilteredBody: '検索キーワードや言語フィルターをリセットして Top 100 全体を確認してください。',
      resetFilterButton: 'フィルターをリセット',
      errorTitle: 'GitHub Top 100 ランキングを読み込めませんでした',
      dataUnavailableTitle: 'データを利用できません',
      dataUnavailableBody: 'ランキングサービスが一時的に利用できないか、予期しない応答ページが返されました。しばらくしてから再試行してください。',
      retryButton: '再試行',
      rateLimitResetPrefix: 'API 制限リセット予定',
      translatingDescriptions: 'リポジトリの説明を日本語に翻訳中...',
      translatedBadge: '翻訳済み',
      showOriginal: '原文を表示',
      showTranslated: '翻訳を表示',
      translationErrorNotice: 'リアルタイム翻訳を利用できないため、GitHub の原文説明を表示しています。',
    },
  },
};

export const CONTENT_TYPE_LABELS: Record<AppLanguage, Record<ContentType, string>> = {
  ko: {
    web_app: '웹 애플리케이션',
    mobile_app: '모바일 앱',
    ai_tool: 'AI 툴',
    mcp_server: 'MCP 서버',
    ai_skill: 'AI Skills',
    ai_agent: 'AI 에이전트',
    template: '템플릿',
    open_source: '오픈소스',
  },
  en: {
    web_app: 'Web Apps',
    mobile_app: 'Mobile Apps',
    ai_tool: 'AI Tools',
    mcp_server: 'MCP Servers',
    ai_skill: 'AI Skills',
    ai_agent: 'AI Agents',
    template: 'Templates',
    open_source: 'Open Source',
  },
  zh: {
    web_app: 'Web 应用',
    mobile_app: '移动应用',
    ai_tool: 'AI 工具',
    mcp_server: 'MCP 服务器',
    ai_skill: 'AI Skills',
    ai_agent: 'AI 智能体',
    template: '项目模板',
    open_source: '开源项目',
  },
  ja: {
    web_app: 'Web アプリ',
    mobile_app: 'モバイルアプリ',
    ai_tool: 'AI ツール',
    mcp_server: 'MCP サーバー',
    ai_skill: 'AI Skills',
    ai_agent: 'AI エージェント',
    template: 'テンプレート',
    open_source: 'オープンソース',
  },
};

export const PROJECT_CATEGORY_LABELS: Record<AppLanguage, Record<ProjectCategory, string>> = {
  ko: {
    'AI Agent': 'AI 에이전트',
    'CLI Tool': 'CLI 도구',
    Framework: '프레임워크',
    'MCP Server': 'MCP 서버',
    'Web Tool': '웹 툴',
    'Mobile App': '모바일 앱',
    'AI Skills': 'AI Skills',
    'Developer Tools': '개발자 도구',
    Workflow: '워크플로우',
    'Korean Builders': '한국 메이커',
    Templates: '템플릿',
    Backend: '백엔드',
    SDK: 'SDK',
  },
  en: {
    'AI Agent': 'AI Agent',
    'CLI Tool': 'CLI Tool',
    Framework: 'Framework',
    'MCP Server': 'MCP Server',
    'Web Tool': 'Web Tool',
    'Mobile App': 'Mobile App',
    'AI Skills': 'AI Skills',
    'Developer Tools': 'Developer Tools',
    Workflow: 'Workflow',
    'Korean Builders': 'Korean Builders',
    Templates: 'Templates',
    Backend: 'Backend',
    SDK: 'SDK',
  },
  zh: {
    'AI Agent': 'AI 智能体',
    'CLI Tool': 'CLI 工具',
    Framework: '开发框架',
    'MCP Server': 'MCP 服务器',
    'Web Tool': 'Web 工具',
    'Mobile App': '移动应用',
    'AI Skills': 'AI Skills',
    'Developer Tools': '开发工具',
    Workflow: '工作流',
    'Korean Builders': '韩国创作者',
    Templates: '模板',
    Backend: '后端',
    SDK: 'SDK',
  },
  ja: {
    'AI Agent': 'AI エージェント',
    'CLI Tool': 'CLI ツール',
    Framework: 'フレームワーク',
    'MCP Server': 'MCP サーバー',
    'Web Tool': 'Web ツール',
    'Mobile App': 'モバイルアプリ',
    'AI Skills': 'AI Skills',
    'Developer Tools': '開発ツール',
    Workflow: 'ワークフロー',
    'Korean Builders': '韓国メイカー',
    Templates: 'テンプレート',
    Backend: 'バックエンド',
    SDK: 'SDK',
  },
};

export const PLATFORM_LABELS: Record<DevelopmentPlatform, string> = {
  lovable: 'Lovable',
  cursor: 'Cursor',
  windsurf: 'Windsurf',
  bolt: 'Bolt.new',
  v0: 'v0 by Vercel',
  claude_code: 'Claude Code',
  replit: 'Replit',
  custom: 'Custom IDE',
};

export const HOSTING_LABELS: Record<HostingProvider, string> = {
  vercel: 'Vercel',
  cloudflare: 'Cloudflare',
  aws: 'AWS',
  fly_io: 'Fly.io',
  gcp: 'Google Cloud',
  netlify: 'Netlify',
  self_hosted: 'Self-Hosted',
  unknown: 'Unspecified',
};

export const BACKEND_LABELS: Record<BackendTech, string> = {
  supabase: 'Supabase',
  firebase: 'Firebase',
  postgresql: 'PostgreSQL',
  nodejs: 'Node.js / Express',
  python_fastapi: 'Python / FastAPI',
  sqlite: 'SQLite',
  serverless: 'Serverless',
  none: 'Client-Only',
  unknown: 'Unspecified',
};

export const PRICING_LABELS: Record<AppLanguage, Record<PricingModel, string>> = {
  ko: {
    free: '무료',
    open_source: '오픈소스',
    freemium: '부분 유료',
    paid: '유료',
    enterprise: '엔터프라이즈',
  },
  en: {
    free: 'Free',
    open_source: 'Open Source',
    freemium: 'Freemium',
    paid: 'Paid',
    enterprise: 'Enterprise',
  },
  zh: {
    free: '免费',
    open_source: '开源',
    freemium: '免费增值',
    paid: '付费',
    enterprise: '企业版',
  },
  ja: {
    free: '無料',
    open_source: 'オープンソース',
    freemium: 'フリーミアム',
    paid: '有料',
    enterprise: 'エンタープライズ',
  },
};

export const SORT_LABELS: Record<AppLanguage, Record<SortOption, string>> = {
  ko: {
    relevance: '관련도순',
    trending_24h: '트렌딩 24시간',
    trending_7d: '트렌딩 7일',
    trending_30d: '트렌딩 30일',
    most_starred: 'GitHub 스타순',
    most_liked: 'W-Vibe 좋아요순',
    most_bookmarked: 'W-Vibe 북마크순',
    recently_added: '최신 등록순',
    recently_updated: '최근 업데이트순',
  },
  en: {
    relevance: 'Relevance',
    trending_24h: 'Trending 24h',
    trending_7d: 'Trending 7d',
    trending_30d: 'Trending 30d',
    most_starred: 'Most Starred (GitHub)',
    most_liked: 'Most Liked (W-Vibe)',
    most_bookmarked: 'Most Bookmarked',
    recently_added: 'Recently Added',
    recently_updated: 'Recently Updated',
  },
  zh: {
    relevance: '相关性',
    trending_24h: '24 小时趋势',
    trending_7d: '7 天趋势',
    trending_30d: '30 天趋势',
    most_starred: 'GitHub 星标最多',
    most_liked: 'W-Vibe 点赞最多',
    most_bookmarked: '收藏最多',
    recently_added: '最新收录',
    recently_updated: '最近更新',
  },
  ja: {
    relevance: '関連度順',
    trending_24h: 'トレンド 24時間',
    trending_7d: 'トレンド 7日間',
    trending_30d: 'トレンド 30日間',
    most_starred: 'GitHub スター順',
    most_liked: 'W-Vibe いいね順',
    most_bookmarked: 'ブックマーク順',
    recently_added: '新着順',
    recently_updated: '更新日順',
  },
};

export const VERIFICATION_LABELS: Record<AppLanguage, Record<VerificationStatus, string>> = {
  ko: {
    verified: '검증됨',
    pending: '검증 대기',
    unverified: '미검증',
  },
  en: {
    verified: 'Verified',
    pending: 'Pending',
    unverified: 'Unverified',
  },
  zh: {
    verified: '已验证',
    pending: '待验证',
    unverified: '未验证',
  },
  ja: {
    verified: '検証済み',
    pending: '検証待ち',
    unverified: '未検証',
  },
};
