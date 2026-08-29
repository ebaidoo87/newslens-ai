import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import DashboardPage from "./DashboardPage";

import {
  useAuth,
} from "../../../shared/hooks/useAuth";

import {
  useDashboardStats,
} from "./hooks/useDashboardStats";

import {
  usePersonalizedDashboard,
} from "./hooks/usePersonalizedDashboard";


vi.mock(
  "../../../shared/hooks/useAuth",
  () => ({
    useAuth: vi.fn(),
  }),
);


vi.mock(
  "./hooks/useDashboardStats",
  () => ({
    useDashboardStats: vi.fn(),
  }),
);


vi.mock(
  "./hooks/usePersonalizedDashboard",
  () => ({
    usePersonalizedDashboard:
      vi.fn(),
  }),
);


/*
 * Mock unrelated dashboard widgets.
 *
 * These components already have
 * their own responsibilities and
 * should not make DashboardPage
 * integration tests brittle.
 */
vi.mock(
  "./components",
  () => ({
    LatestHeadlines: () => (
      <div>
        Latest Headlines Widget
      </div>
    ),

    QuickActions: () => (
      <div>
        Quick Actions Widget
      </div>
    ),

    StatsGrid: () => (
      <div>
        Stats Grid Widget
      </div>
    ),

    TrendingTopics: () => (
      <div>
        Trending Topics Widget
      </div>
    ),
  }),
);


vi.mock(
  "./components/RecommendedFeedSection",
  () => ({
    default: ({
      items,
      isLoading,
      error,
    }: {
      items: unknown[];
      isLoading: boolean;
      error: string | null;
    }) => (
      <div>
        <span>
          Recommended Feed
        </span>

        <span>
          Recommended count:
          {" "}
          {items.length}
        </span>

        {isLoading && (
          <span>
            Recommended loading
          </span>
        )}

        {error && (
          <span>
            Recommended error:
            {" "}
            {error}
          </span>
        )}
      </div>
    ),
  }),
);


vi.mock(
  "./components/TrendingFeedSection",
  () => ({
    default: ({
      items,
      isLoading,
      error,
    }: {
      items: unknown[];
      isLoading: boolean;
      error: string | null;
    }) => (
      <div>
        <span>
          Trending Feed
        </span>

        <span>
          Trending count:
          {" "}
          {items.length}
        </span>

        {isLoading && (
          <span>
            Trending loading
          </span>
        )}

        {error && (
          <span>
            Trending error:
            {" "}
            {error}
          </span>
        )}
      </div>
    ),
  }),
);


vi.mock(
  "./components/DiscoveryFeedSection",
  () => ({
    default: ({
      items,
      isLoading,
      error,
    }: {
      items: unknown[];
      isLoading: boolean;
      error: string | null;
    }) => (
      <div>
        <span>
          Discovery Feed
        </span>

        <span>
          Discovery count:
          {" "}
          {items.length}
        </span>

        {isLoading && (
          <span>
            Discovery loading
          </span>
        )}

        {error && (
          <span>
            Discovery error:
            {" "}
            {error}
          </span>
        )}
      </div>
    ),
  }),
);


vi.mock(
  "./components/DashboardRefreshButton",
  () => ({
    default: ({
      isRefreshing,
      onRefresh,
    }: {
      isRefreshing: boolean;
      onRefresh:
        () => Promise<void>;
    }) => (
      <button
        type="button"
        disabled={
          isRefreshing
        }
        onClick={() => {
          void onRefresh();
        }}
      >
        Test Refresh
      </button>
    ),
  }),
);


const mockUseAuth =
  vi.mocked(
    useAuth,
  );

const mockUseDashboardStats =
  vi.mocked(
    useDashboardStats,
  );

const mockUsePersonalizedDashboard =
  vi.mocked(
    usePersonalizedDashboard,
  );


function setupAuth(
  isAuthenticated:
    boolean,
) {
  mockUseAuth.mockReturnValue(
    {
      isAuthenticated,
    } as unknown as ReturnType<
      typeof useAuth
    >,
  );
}


function setupStats({
  isLoading = false,
  isError = false,
}: {
  isLoading?: boolean;
  isError?: boolean;
} = {}) {
  mockUseDashboardStats
    .mockReturnValue(
      {
        data: undefined,

        isLoading,

        isError,
      } as unknown as ReturnType<
        typeof useDashboardStats
      >,
    );
}


function setupPersonalizedDashboard({
  recommendations = [],
  trending = [],
  discovery = [],

  recommendationError = null,
  trendingError = null,
  discoveryError = null,

  isLoading = false,
  isRefreshing = false,

  hasAnyContent = true,

  refresh =
    vi.fn()
      .mockResolvedValue(
        undefined,
      ),
}: {
  recommendations?: unknown[];
  trending?: unknown[];
  discovery?: unknown[];

  recommendationError?:
    string | null;

  trendingError?:
    string | null;

  discoveryError?:
    string | null;

  isLoading?: boolean;
  isRefreshing?: boolean;

  hasAnyContent?: boolean;

  refresh?: ReturnType<
    typeof vi.fn
  >;
} = {}) {
  mockUsePersonalizedDashboard
    .mockReturnValue(
      {
        data: {
          recommendations,
          trending,
          discovery,
        },

        errors: {
          recommendations:
            recommendationError,

          trending:
            trendingError,

          discovery:
            discoveryError,
        },

        isLoading,

        isRefreshing,

        lastUpdated:
          null,

        hasAnyContent,

        hasPersonalizedContent:
          recommendations.length > 0
          || discovery.length > 0,

        refresh,
      } as unknown as ReturnType<
        typeof usePersonalizedDashboard
      >,
    );

  return {
    refresh,
  };
}


describe(
  "DashboardPage",
  () => {
    beforeEach(() => {
      vi.clearAllMocks();

      setupAuth(
        true,
      );

      setupStats();

      setupPersonalizedDashboard({
        recommendations: [
          { id: 1 },
        ],

        trending: [
          { id: 2 },
        ],

        discovery: [
          { id: 3 },
        ],
      });
    });


    it(
      "renders all personalized feed sections for authenticated users",
      () => {
        render(
          <DashboardPage />,
        );


        expect(
          screen.getByText(
            "Recommended Feed",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Trending Feed",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Discovery Feed",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            /Recommended count:\s*1/,
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            /Trending count:\s*1/,
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            /Discovery count:\s*1/,
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "shows only the public trending feed to guests",
      () => {
        setupAuth(
          false,
        );


        render(
          <DashboardPage />,
        );


        expect(
          screen.queryByText(
            "Recommended Feed",
          ),
        ).not.toBeInTheDocument();


        expect(
          screen.getByText(
            "Trending Feed",
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Discovery Feed",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "renders the quiet-feed state when no personalized content exists",
      () => {
        setupPersonalizedDashboard({
          recommendations: [],
          trending: [],
          discovery: [],

          hasAnyContent:
            false,

          isLoading:
            false,
        });


        render(
          <DashboardPage />,
        );


        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Your feed is quiet right now.",
            },
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            /could not find any available feed stories/i,
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "renders the dashboard error state when stats fail",
      () => {
        setupStats({
          isError:
            true,
        });


        render(
          <DashboardPage />,
        );


        const alert =
          screen.getByRole(
            "alert",
          );


        expect(
          alert,
        ).toBeInTheDocument();


        expect(
          screen.getByRole(
            "heading",
            {
              name:
                "Unable to load dashboard.",
            },
          ),
        ).toBeInTheDocument();


        expect(
          screen.queryByText(
            "Recommended Feed",
          ),
        ).not.toBeInTheDocument();


        expect(
          screen.queryByText(
            "Trending Feed",
          ),
        ).not.toBeInTheDocument();
      },
    );


    it(
      "passes personalized section errors to the correct feeds",
      () => {
        setupPersonalizedDashboard({
          recommendations: [],
          trending: [],
          discovery: [],

          recommendationError:
            "Recommendation service failed",

          trendingError:
            "Trending service failed",

          discoveryError:
            "Discovery service failed",

          hasAnyContent:
            false,
        });


        render(
          <DashboardPage />,
        );


        expect(
          screen.getByText(
            /Recommended error:\s*Recommendation service failed/,
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            /Trending error:\s*Trending service failed/,
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            /Discovery error:\s*Discovery service failed/,
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "passes personalized loading state to feed sections",
      () => {
        setupPersonalizedDashboard({
          isLoading:
            true,
        });


        render(
          <DashboardPage />,
        );


        expect(
          screen.getByText(
            "Recommended loading",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Trending loading",
          ),
        ).toBeInTheDocument();


        expect(
          screen.getByText(
            "Discovery loading",
          ),
        ).toBeInTheDocument();
      },
    );


    it(
      "calls dashboard refresh when refresh control is clicked",
      () => {
        const refresh =
          vi.fn()
            .mockResolvedValue(
              undefined,
            );


        setupPersonalizedDashboard({
          refresh,
        });


        render(
          <DashboardPage />,
        );


        fireEvent.click(
          screen.getByRole(
            "button",
            {
              name:
                "Test Refresh",
            },
          ),
        );


        expect(
          refresh,
        ).toHaveBeenCalledTimes(
          1,
        );
      },
    );


    it(
      "disables the refresh control while refreshing",
      () => {
        setupPersonalizedDashboard({
          isRefreshing:
            true,
        });


        render(
          <DashboardPage />,
        );


        expect(
          screen.getByRole(
            "button",
            {
              name:
                "Test Refresh",
            },
          ),
        ).toBeDisabled();
      },
    );
  },
);