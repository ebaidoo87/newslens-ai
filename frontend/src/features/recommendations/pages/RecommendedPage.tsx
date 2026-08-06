import {
  Link,
} from "react-router-dom";

import {
  RefreshCw,
  Settings2,
  Sparkles,
} from "lucide-react";

import RecommendationCard from "../components/RecommendationCard";

import {
  useRecommendations,
} from "../hooks/useRecommendations";

import {
  usePreferences,
} from "../../../shared/context/PreferenceContext";


export default function RecommendedPage() {
  const {
    data: recommendations,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRecommendations(20);

  const {
    selectedCategories,
    selectedCountries,
    selectedKeywords,
  } = usePreferences();

  const preferenceCount =
    selectedCategories.length
    + selectedCountries.length
    + selectedKeywords.length;


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            Recommended For You
          </h1>

          <p className="mt-2 text-gray-400">
            Building your personalized feed...
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900"
            >
              <div className="h-48 animate-pulse bg-gray-800" />

              <div className="space-y-4 p-6">
                <div className="h-5 w-24 animate-pulse rounded bg-gray-800" />
                <div className="h-7 w-full animate-pulse rounded bg-gray-800" />
                <div className="h-7 w-4/5 animate-pulse rounded bg-gray-800" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-800" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="rounded-2xl border border-red-900 bg-red-950/30 p-8 text-center">
        <h1 className="text-2xl font-bold text-red-300">
          Unable to load recommendations
        </h1>

        <p className="mt-3 text-red-200">
          Please check the backend and try
          again.
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-700 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
        >
          <RefreshCw size={18} />

          Try again
        </button>
      </div>
    );
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Sparkles className="text-purple-400" />

            <h1 className="text-4xl font-bold">
              Recommended For You
            </h1>
          </div>

          <p className="mt-2 text-gray-400">
            Personalized using your categories,
            countries and favourite topics.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              isFetching
                ? "animate-spin"
                : ""
            }
          />

          {isFetching
            ? "Refreshing..."
            : "Refresh"}
        </button>
      </div>


      {preferenceCount === 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-900 bg-blue-950/30 p-5">
          <div>
            <h2 className="font-semibold text-blue-200">
              Personalize your recommendations
            </h2>

            <p className="mt-1 text-sm text-blue-300/80">
              Choose categories, countries and
              topics to improve this feed.
            </p>
          </div>

          <Link
            to="/settings"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            <Settings2 size={17} />

            Set preferences
          </Link>
        </div>
      )}


      {!recommendations?.length ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-16 text-center">
          <Sparkles
            size={48}
            className="mx-auto text-gray-500"
          />

          <h2 className="mt-5 text-2xl font-semibold">
            No recommendations available
          </h2>

          <p className="mx-auto mt-3 max-w-md text-gray-400">
            Add some preferences or import more
            articles to build your personalized
            feed.
          </p>

          <Link
            to="/settings"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-500"
          >
            Update preferences
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map(
            (recommendation) => (
              <RecommendationCard
                key={
                  recommendation.article.id
                }
                recommendation={
                  recommendation
                }
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}