import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  useAuth,
} from "../../../../shared/hooks/useAuth";

import {
  usePreferences,
} from "../../../../shared/hooks/usePreferences";

import {
  useBookmarks,
} from "../../../../shared/hooks/useBookmarks";

import {
  useReadingHistory,
} from "../../../../shared/hooks/useReadingHistory";

import {
  normalizeApiError,
} from "../../../../shared/api/errors";

import {
  getDiscoveryArticles,
} from "../../../../shared/services/discoveryApi";

import {
  getRecommendations,
} from "../../../../shared/services/recommendationApi";

import {
  getTrendingArticles,
} from "../../../../shared/services/trendingApi";

import {
  rankArticlesByPreferences,
} from "../utils/rankArticlesByPreferences";

import {
  rankArticlesByBehavior,
} from "../utils/feedSignals";

import {
  deduplicateDashboardFeeds,
} from "../utils/deduplicateDashboardFeeds";

import type {
  PersonalizedDashboardData,
  PersonalizedDashboardErrors,
} from "../types/personalizedDashboard";


const INITIAL_DATA:
PersonalizedDashboardData = {
  recommendations: [],
  discovery: [],
  trending: [],
};


const INITIAL_ERRORS:
PersonalizedDashboardErrors = {
  recommendations: null,
  discovery: null,
  trending: null,
};


export function usePersonalizedDashboard() {
  const {
    isAuthenticated,
    isLoading:
      isAuthLoading,
  } = useAuth();


  const {
    selectedCategories,
    selectedCountries,
    selectedKeywords,
    isLoading:
      isPreferencesLoading,
  } = usePreferences();


  const {
    bookmarkedArticleIds,
    isLoading:
      isBookmarksLoading,
  } = useBookmarks();


  const {
    history,
    isLoading:
      isHistoryLoading,
  } = useReadingHistory();


  const [
    data,
    setData,
  ] = useState<
    PersonalizedDashboardData
  >(INITIAL_DATA);


  const [
    errors,
    setErrors,
  ] = useState<
    PersonalizedDashboardErrors
  >(INITIAL_ERRORS);


  const [
    isLoading,
    setIsLoading,
  ] = useState(true);


  const [
    isRefreshing,
    setIsRefreshing,
  ] = useState(false);


  const [
    lastUpdated,
    setLastUpdated,
  ] = useState<Date | null>(
    null,
  );


  const hasLoadedRef =
    useRef(false);


  const viewedArticleIds =
    useMemo(
      () =>
        new Set(
          history.map(
            (item) =>
              item.article.id,
          ),
        ),
      [history],
    );


  const loadDashboard =
    useCallback(
      async (): Promise<void> => {
        /*
         * Wait until all authenticated
         * personalization providers
         * have completed restoration.
         */
        if (
          isAuthLoading
          || (
            isAuthenticated
            && (
              isPreferencesLoading
              || isBookmarksLoading
              || isHistoryLoading
            )
          )
        ) {
          return;
        }


        const isInitialLoad =
          !hasLoadedRef.current;


        if (isInitialLoad) {
          setIsLoading(
            true,
          );
        } else {
          setIsRefreshing(
            true,
          );
        }


        setErrors(
          INITIAL_ERRORS,
        );


        const preferenceSignals = {
          categories:
            selectedCategories,

          countries:
            selectedCountries,

          keywords:
            selectedKeywords,
        };


        const behaviorSignals = {
          bookmarkedArticleIds,
          viewedArticleIds,
        };


        try {
          const trendingPromise =
            getTrendingArticles({
              limit: 6,
            });


          const recommendationPromise =
            isAuthenticated
              ? getRecommendations(6)
              : Promise.resolve([]);


          const discoveryPromise =
            isAuthenticated
              ? getDiscoveryArticles(6)
              : Promise.resolve([]);


          const [
            recommendationsResult,
            discoveryResult,
            trendingResult,
          ] = await Promise.allSettled([
            recommendationPromise,
            discoveryPromise,
            trendingPromise,
          ]);


          const nextData:
          PersonalizedDashboardData = {
            recommendations: [],
            discovery: [],
            trending: [],
          };


          const nextErrors:
          PersonalizedDashboardErrors = {
            recommendations: null,
            discovery: null,
            trending: null,
          };


          /*
           * Recommendations
           */
          if (
            recommendationsResult.status
            === "fulfilled"
          ) {
            const preferenceRanked =
              rankArticlesByPreferences(
                recommendationsResult.value,
                (item) =>
                  item.article,
                preferenceSignals,
              );


            nextData.recommendations =
              rankArticlesByBehavior(
                preferenceRanked,
                (item) =>
                  item.article,
                behaviorSignals,
              );
          } else {
            nextErrors.recommendations =
              normalizeApiError(
                recommendationsResult.reason,
              ).message;
          }


          /*
           * Discovery
           */
          if (
            discoveryResult.status
            === "fulfilled"
          ) {
            const preferenceRanked =
              rankArticlesByPreferences(
                discoveryResult.value,
                (item) =>
                  item.article,
                preferenceSignals,
              );


            nextData.discovery =
              rankArticlesByBehavior(
                preferenceRanked,
                (item) =>
                  item.article,
                behaviorSignals,
              );
          } else {
            nextErrors.discovery =
              normalizeApiError(
                discoveryResult.reason,
              ).message;
          }


          /*
           * Trending
           */
          if (
            trendingResult.status
            === "fulfilled"
          ) {
            const preferenceRanked =
              rankArticlesByPreferences(
                trendingResult.value,
                (item) =>
                  item.article,
                preferenceSignals,
              );


            nextData.trending =
              rankArticlesByBehavior(
                preferenceRanked,
                (item) =>
                  item.article,
                behaviorSignals,
              );
          } else {
            nextErrors.trending =
              normalizeApiError(
                trendingResult.reason,
              ).message;
          }


          /*
           * Remove duplicate articles
           * across dashboard sections.
           */
          const uniqueData =
            deduplicateDashboardFeeds({
              recommendations:
                nextData.recommendations,

              trending:
                nextData.trending,

              discovery:
                nextData.discovery,
            });


          setData({
            recommendations:
              uniqueData.recommendations,

            trending:
              uniqueData.trending,

            discovery:
              uniqueData.discovery,
          });


          setErrors(
            nextErrors,
          );


          setLastUpdated(
            new Date(),
          );


          hasLoadedRef.current =
            true;
        } finally {
          setIsLoading(
            false,
          );

          setIsRefreshing(
            false,
          );
        }
      },
      [
        isAuthenticated,
        isAuthLoading,
        isPreferencesLoading,
        isBookmarksLoading,
        isHistoryLoading,
        selectedCategories,
        selectedCountries,
        selectedKeywords,
        bookmarkedArticleIds,
        viewedArticleIds,
      ],
    );


  useEffect(() => {
    void loadDashboard();
  }, [
    loadDashboard,
  ]);


  const hasPersonalizedContent =
    data.recommendations.length > 0
    || data.discovery.length > 0;


  const hasAnyContent =
    hasPersonalizedContent
    || data.trending.length > 0;


  return {
    data,
    errors,

    isLoading,
    isRefreshing,

    lastUpdated,

    hasPersonalizedContent,
    hasAnyContent,

    refresh:
      loadDashboard,
  };
}