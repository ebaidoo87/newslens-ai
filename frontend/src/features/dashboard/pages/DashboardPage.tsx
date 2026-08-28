import {
  LatestHeadlines,
  QuickActions,
  StatsGrid,
  TrendingTopics,
} from "./components";

import {
  useAuth,
} from "../../../shared/hooks/useAuth";

import {
  useDashboardStats,
} from "./hooks/useDashboardStats";

import {
  usePersonalizedDashboard,
} from "./hooks/usePersonalizedDashboard";

import RecommendedFeedSection from "./components/RecommendedFeedSection";

import DiscoveryFeedSection from "./components/DiscoveryFeedSection";

import TrendingFeedSection from "./components/TrendingFeedSection";

import DashboardRefreshButton from "./components/DashboardRefreshButton";


export default function DashboardPage() {
  const {
    isAuthenticated,
  } = useAuth();


  const {
    data: stats,
    isLoading:
      isStatsLoading,
    isError:
      isStatsError,
  } = useDashboardStats();


  const {
    data:
      personalizedData,

    errors:
      personalizedErrors,

    isLoading:
      isPersonalizedLoading,

    isRefreshing,

    lastUpdated,

    hasAnyContent,

    refresh,
  } = usePersonalizedDashboard();


  if (isStatsError) {
    return (
      <div
        role="alert"
        className="
          rounded-xl
          border
          border-red-700
          bg-red-900/20
          p-6
        "
      >
        <h1
          className="
            text-xl
            font-semibold
            text-red-400
          "
        >
          Unable to load dashboard.
        </h1>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-gray-300
          "
        >
          Some dashboard information
          could not be loaded.
          Please try again later.
        </p>
      </div>
    );
  }


  return (
    <div
      className="
        space-y-10
        pb-10
        sm:space-y-12
      "
      aria-busy={
        isPersonalizedLoading
      }
    >
      <header
        className="
          flex
          flex-col
          gap-5
          border-b
          border-gray-900
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <h1
            className="
              text-2xl
              font-bold
              tracking-tight
              text-white
              sm:text-3xl
            "
          >
            Welcome back 👋
          </h1>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-gray-400
              sm:text-base
            "
          >
            Your personalized view
            of what's happening today.
          </p>
        </div>


        <DashboardRefreshButton
          isRefreshing={
            isRefreshing
          }
          lastUpdated={
            lastUpdated
          }
          onRefresh={
            refresh
          }
        />
      </header>


      <StatsGrid
        data={stats}
        isLoading={
          isStatsLoading
        }
      />


      <main
        className="
          space-y-12
        "
      >
        {isAuthenticated && (
          <RecommendedFeedSection
            items={
              personalizedData
                .recommendations
            }
            isLoading={
              isPersonalizedLoading
            }
            error={
              personalizedErrors
                .recommendations
            }
          />
        )}


        <TrendingFeedSection
          items={
            personalizedData
              .trending
          }
          isLoading={
            isPersonalizedLoading
          }
          error={
            personalizedErrors
              .trending
          }
        />


        {isAuthenticated && (
          <DiscoveryFeedSection
            items={
              personalizedData
                .discovery
            }
            isLoading={
              isPersonalizedLoading
            }
            error={
              personalizedErrors
                .discovery
            }
          />
        )}


        {!isPersonalizedLoading
          && !hasAnyContent && (
            <div
              className="
                rounded-2xl
                border
                border-gray-800
                bg-gray-900/40
                px-6
                py-10
                text-center
              "
            >
              <h2
                className="
                  text-lg
                  font-semibold
                  text-gray-200
                "
              >
                Your feed is quiet
                right now.
              </h2>

              <p
                className="
                  mx-auto
                  mt-2
                  max-w-xl
                  text-sm
                  leading-6
                  text-gray-500
                "
              >
                NewsLens could not find
                any available feed stories.
                Refresh again later as new
                articles are published.
              </p>
            </div>
          )}


        <section
          aria-labelledby="latest-news-heading"
          className="
            grid
            gap-6
            lg:grid-cols-3
          "
        >
          <div
            className="
              min-w-0
              lg:col-span-2
            "
          >
            <LatestHeadlines />
          </div>

          <div className="min-w-0">
            <TrendingTopics />
          </div>
        </section>


        <QuickActions />
      </main>
    </div>
  );
}