import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  usePersonalizedDashboard,
} from "./usePersonalizedDashboard";

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
  getRecommendations,
} from "../../../../shared/services/recommendationApi";

import {
  getDiscoveryArticles,
} from "../../../../shared/services/discoveryApi";

import {
  getTrendingArticles,
} from "../../../../shared/services/trendingApi";

type RecommendedArticle =
  Awaited<
    ReturnType<
      typeof getRecommendations
    >
  >[number];


type DiscoveredArticle =
  Awaited<
    ReturnType<
      typeof getDiscoveryArticles
    >
  >[number];


type TrendingArticle =
  Awaited<
    ReturnType<
      typeof getTrendingArticles
    >
  >[number];

  
vi.mock(
  "../../../../shared/hooks/useAuth",
  () => ({
    useAuth: vi.fn(),
  }),
);


vi.mock(
  "../../../../shared/hooks/usePreferences",
  () => ({
    usePreferences: vi.fn(),
  }),
);


vi.mock(
  "../../../../shared/hooks/useBookmarks",
  () => ({
    useBookmarks: vi.fn(),
  }),
);


vi.mock(
  "../../../../shared/hooks/useReadingHistory",
  () => ({
    useReadingHistory: vi.fn(),
  }),
);


vi.mock(
  "../../../../shared/services/recommendationApi",
  () => ({
    getRecommendations: vi.fn(),
  }),
);


vi.mock(
  "../../../../shared/services/discoveryApi",
  () => ({
    getDiscoveryArticles: vi.fn(),
  }),
);


vi.mock(
  "../../../../shared/services/trendingApi",
  () => ({
    getTrendingArticles: vi.fn(),
  }),
);


const mockUseAuth =
  vi.mocked(useAuth);

const mockUsePreferences =
  vi.mocked(usePreferences);

const mockUseBookmarks =
  vi.mocked(useBookmarks);

const mockUseReadingHistory =
  vi.mocked(useReadingHistory);

const mockGetRecommendations =
  vi.mocked(getRecommendations);

const mockGetDiscoveryArticles =
  vi.mocked(getDiscoveryArticles);

const mockGetTrendingArticles =
  vi.mocked(getTrendingArticles);


function makeArticle(
  id: number,
  overrides: Record<
    string,
    unknown
  > = {},
) {
  return {
    id,

    title:
      `Article ${id}`,

    summary:
      `Summary ${id}`,

    content:
      `Content ${id}`,

    url:
      `https://example.com/articles/${id}`,

    source:
      "NewsLens",

    language:
      "en",

    country:
      "UK",

    category:
      "technology",

    published_at:
      null,

    ...overrides,
  };
}


function makeRecommendation(
  id: number,
): RecommendedArticle {
  return {
    article:
      makeArticle(id) as RecommendedArticle["article"],

    score: 0.9,

    reasons: [
      "Matches your interests",
    ],
  };
}


function makeDiscovery(
  id: number,
): DiscoveredArticle {
  return {
    article:
      makeArticle(id) as DiscoveredArticle["article"],

    discovery_score: 0.8,

    reasons: [
      "Explore something new",
    ],
  };
}


function makeTrending(
  id: number,
): TrendingArticle {
  return {
    article:
      makeArticle(id) as TrendingArticle["article"],

    trending_score: 0.95,

    bookmark_count: 5,

    view_count: 20,

    reasons: [
      "Popular right now",
    ],
  };
}


function setupAuthenticatedUser() {
  /*
   * Keep these references stable.
   *
   * The production hook uses arrays,
   * Sets and history inside callback
   * dependencies.
   */
  const selectedCategories = [
    "technology",
  ];

  const selectedCountries = [
    "UK",
  ];

  const selectedKeywords = [
    "AI",
  ];

  const bookmarkedArticleIds =
    new Set<number>();

  const history: never[] = [];


  mockUseAuth.mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
  } as ReturnType<
    typeof useAuth
  >);


  mockUsePreferences.mockReturnValue({
    selectedCategories,
    selectedCountries,
    selectedKeywords,
    isLoading: false,
  } as ReturnType<
    typeof usePreferences
  >);


  mockUseBookmarks.mockReturnValue({
    bookmarkedArticleIds,
    isLoading: false,
  } as ReturnType<
    typeof useBookmarks
  >);


mockUseReadingHistory.mockReturnValue({
  history,
  historyCount:
    history.length,

  isLoading:
    false,

  refreshHistory:
    vi.fn(),

  clearHistory:
    vi.fn(),
} as ReturnType<
  typeof useReadingHistory
>);
}



function setupGuestUser() {
  const selectedCategories:
    string[] = [];

  const selectedCountries:
    string[] = [];

  const selectedKeywords:
    string[] = [];

  const bookmarkedArticleIds =
    new Set<number>();

  const history: never[] = [];


  mockUseAuth.mockReturnValue({
    isAuthenticated: false,
    isLoading: false,
  } as ReturnType<
    typeof useAuth
  >);


  mockUsePreferences.mockReturnValue({
    selectedCategories,
    selectedCountries,
    selectedKeywords,
    isLoading: false,
  } as ReturnType<
    typeof usePreferences
  >);


  mockUseBookmarks.mockReturnValue({
    bookmarkedArticleIds,
    isLoading: false,
  } as ReturnType<
    typeof useBookmarks
  >);


mockUseReadingHistory.mockReturnValue({
  history,
  historyCount:
    history.length,

  isLoading:
    false,

  refreshHistory:
    vi.fn(),

  clearHistory:
    vi.fn(),
} as ReturnType<
  typeof useReadingHistory
>);
}


describe(
  "usePersonalizedDashboard",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();


      setupAuthenticatedUser();


      mockGetRecommendations
        .mockResolvedValue([
          makeRecommendation(1),
        ]);


      mockGetDiscoveryArticles
        .mockResolvedValue([
          makeDiscovery(2),
        ]);


      mockGetTrendingArticles
        .mockResolvedValue([
          makeTrending(3),
        ]);
    });


    it(
      "loads recommendations, discovery and trending for authenticated users",
      async () => {
        const {
          result,
        } = renderHook(
          () =>
            usePersonalizedDashboard(),
        );


        await waitFor(
          () => {
            expect(
              result.current.isLoading,
            ).toBe(false);
          },
        );


        expect(
          mockGetRecommendations,
        ).toHaveBeenCalledWith(
          6,
        );


        expect(
          mockGetDiscoveryArticles,
        ).toHaveBeenCalledWith(
          6,
        );


        expect(
          mockGetTrendingArticles,
        ).toHaveBeenCalledWith({
          limit: 6,
        });


        expect(
          result.current
            .data
            .recommendations,
        ).toHaveLength(1);


        expect(
          result.current
            .data
            .discovery,
        ).toHaveLength(1);


        expect(
          result.current
            .data
            .trending,
        ).toHaveLength(1);


        expect(
          result.current
            .hasPersonalizedContent,
        ).toBe(true);


        expect(
          result.current
            .hasAnyContent,
        ).toBe(true);


        expect(
          result.current
            .lastUpdated,
        ).toBeInstanceOf(
          Date,
        );
      },
    );


    it(
      "does not call personalized endpoints for guests",
      async () => {
        setupGuestUser();


        mockGetTrendingArticles
          .mockResolvedValue([
            makeTrending(10),
          ]);


        const {
          result,
        } = renderHook(
          () =>
            usePersonalizedDashboard(),
        );


        await waitFor(
          () => {
            expect(
              result.current.isLoading,
            ).toBe(false);
          },
        );


        expect(
          mockGetRecommendations,
        ).not.toHaveBeenCalled();


        expect(
          mockGetDiscoveryArticles,
        ).not.toHaveBeenCalled();


        expect(
          mockGetTrendingArticles,
        ).toHaveBeenCalledTimes(
          1,
        );


        expect(
          result.current
            .data
            .recommendations,
        ).toEqual([]);


        expect(
          result.current
            .data
            .discovery,
        ).toEqual([]);


        expect(
          result.current
            .data
            .trending,
        ).toHaveLength(1);


        expect(
          result.current
            .hasPersonalizedContent,
        ).toBe(false);


        expect(
          result.current
            .hasAnyContent,
        ).toBe(true);
      },
    );


    it(
      "keeps successful sections when discovery fails",
      async () => {
        mockGetRecommendations
          .mockResolvedValue([
            makeRecommendation(20),
          ]);


        mockGetDiscoveryArticles
          .mockRejectedValue(
            new Error(
              "Discovery unavailable",
            ),
          );


        mockGetTrendingArticles
          .mockResolvedValue([
            makeTrending(21),
          ]);


        const {
          result,
        } = renderHook(
          () =>
            usePersonalizedDashboard(),
        );


        await waitFor(
          () => {
            expect(
              result.current.isLoading,
            ).toBe(false);
          },
        );


        expect(
          result.current
            .data
            .recommendations,
        ).toHaveLength(1);


        expect(
          result.current
            .data
            .trending,
        ).toHaveLength(1);


        expect(
          result.current
            .data
            .discovery,
        ).toEqual([]);


        expect(
          result.current
            .errors
            .discovery,
        ).toBeTruthy();


        expect(
          result.current
            .errors
            .recommendations,
        ).toBeNull();


        expect(
          result.current
            .errors
            .trending,
        ).toBeNull();
      },
    );


    it(
      "keeps other sections available when recommendations fail",
      async () => {
        mockGetRecommendations
          .mockRejectedValue(
            new Error(
              "Recommendations unavailable",
            ),
          );


        mockGetDiscoveryArticles
          .mockResolvedValue([
            makeDiscovery(30),
          ]);


        mockGetTrendingArticles
          .mockResolvedValue([
            makeTrending(31),
          ]);


        const {
          result,
        } = renderHook(
          () =>
            usePersonalizedDashboard(),
        );


        await waitFor(
          () => {
            expect(
              result.current.isLoading,
            ).toBe(false);
          },
        );


        expect(
          result.current
            .data
            .recommendations,
        ).toEqual([]);


        expect(
          result.current
            .data
            .discovery,
        ).toHaveLength(1);


        expect(
          result.current
            .data
            .trending,
        ).toHaveLength(1);


        expect(
          result.current
            .errors
            .recommendations,
        ).toBeTruthy();
      },
    );


    it(
      "handles a trending failure without collapsing personalized feeds",
      async () => {
        mockGetRecommendations
          .mockResolvedValue([
            makeRecommendation(40),
          ]);


        mockGetDiscoveryArticles
          .mockResolvedValue([
            makeDiscovery(41),
          ]);


        mockGetTrendingArticles
          .mockRejectedValue(
            new Error(
              "Trending unavailable",
            ),
          );


        const {
          result,
        } = renderHook(
          () =>
            usePersonalizedDashboard(),
        );


        await waitFor(
          () => {
            expect(
              result.current.isLoading,
            ).toBe(false);
          },
        );


        expect(
          result.current
            .data
            .recommendations,
        ).toHaveLength(1);


        expect(
          result.current
            .data
            .discovery,
        ).toHaveLength(1);


        expect(
          result.current
            .data
            .trending,
        ).toEqual([]);


        expect(
          result.current
            .errors
            .trending,
        ).toBeTruthy();


        expect(
          result.current
            .hasAnyContent,
        ).toBe(true);
      },
    );


    it(
      "deduplicates articles across dashboard sections",
      async () => {
        /*
         * Article 50 appears in
         * every API response.
         *
         * Recommended has priority.
         */
        mockGetRecommendations
          .mockResolvedValue([
            makeRecommendation(50),
            makeRecommendation(51),
          ]);


        mockGetTrendingArticles
          .mockResolvedValue([
            makeTrending(50),
            makeTrending(52),
          ]);


        mockGetDiscoveryArticles
          .mockResolvedValue([
            makeDiscovery(50),
            makeDiscovery(52),
            makeDiscovery(53),
          ]);


        const {
          result,
        } = renderHook(
          () =>
            usePersonalizedDashboard(),
        );


        await waitFor(
          () => {
            expect(
              result.current.isLoading,
            ).toBe(false);
          },
        );


        expect(
        result.current
            .data
            .recommendations
            .map(
            (
                item: RecommendedArticle,
            ) => item.article.id,
            ),
        ).toEqual([
        50,
        51,
        ]);


        expect(
        result.current
            .data
            .trending
            .map(
            (
                item: TrendingArticle,
            ) => item.article.id,
            ),
        ).toEqual([
        52,
        ]);


        expect(
        result.current
            .data
            .discovery
            .map(
            (
                item: DiscoveredArticle,
            ) => item.article.id,
            ),
        ).toEqual([
        53,
        ]);
      },
    );


      it(
        "uses refresh state without returning to initial loading state",
        async () => {
          const {
            result,
          } = renderHook(
            () =>
              usePersonalizedDashboard(),
          );


          await waitFor(
            () => {
              expect(
                result.current.isLoading,
              ).toBe(false);
            },
          );


          expect(
            result.current
              .isRefreshing,
          ).toBe(false);


          let resolveTrending:
            (
              value:
                TrendingArticle[],
            ) => void =
              () => {};


          const pendingTrending =
            new Promise<
              TrendingArticle[]
            >(
              (resolve) => {
                resolveTrending =
                  resolve;
              },
            );


          mockGetRecommendations
            .mockResolvedValue([
              makeRecommendation(60),
            ]);


          mockGetDiscoveryArticles
            .mockResolvedValue([
              makeDiscovery(61),
            ]);


          mockGetTrendingArticles
            .mockReturnValueOnce(
              pendingTrending,
            );


          let refreshPromise:
            Promise<void>;


          act(() => {
            refreshPromise =
              result.current.refresh();
          });


          await waitFor(
            () => {
              expect(
                result.current
                  .isRefreshing,
              ).toBe(true);
            },
          );


          expect(
            result.current.isLoading,
          ).toBe(false);


          await act(
            async () => {
              resolveTrending([
                makeTrending(62),
              ]);


              await refreshPromise;
            },
          );


          expect(
            result.current
              .isRefreshing,
          ).toBe(false);


          expect(
            result.current.isLoading,
          ).toBe(false);
        },
      );

      it(
      "handles all feed endpoints failing",
      async () => {
        mockGetRecommendations
          .mockRejectedValue(
            new Error(
              "Recommendations failed",
            ),
          );


        mockGetDiscoveryArticles
          .mockRejectedValue(
            new Error(
              "Discovery failed",
            ),
          );


        mockGetTrendingArticles
          .mockRejectedValue(
            new Error(
              "Trending failed",
            ),
          );


        const {
          result,
        } = renderHook(
          () =>
            usePersonalizedDashboard(),
        );


        await waitFor(
          () => {
            expect(
              result.current.isLoading,
            ).toBe(false);
          },
        );


        expect(
          result.current.data,
        ).toEqual({
          recommendations: [],
          discovery: [],
          trending: [],
        });


        expect(
          result.current
            .errors
            .recommendations,
        ).toBeTruthy();


        expect(
          result.current
            .errors
            .discovery,
        ).toBeTruthy();


        expect(
          result.current
            .errors
            .trending,
        ).toBeTruthy();


        expect(
          result.current
            .hasPersonalizedContent,
        ).toBe(false);


        expect(
          result.current
            .hasAnyContent,
        ).toBe(false);
          },
        );
    },
);
