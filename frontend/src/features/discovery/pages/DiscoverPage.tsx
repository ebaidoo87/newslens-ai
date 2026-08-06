import {
  Compass,
  RefreshCw,
} from "lucide-react";

import DiscoveryCard from "../components/DiscoveryCard";

import {
  useDiscoveryArticles,
} from "../hooks/useDiscoveryArticles";


export default function DiscoverPage() {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useDiscoveryArticles(20);


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Compass className="text-cyan-400" />

            <h1 className="text-4xl font-bold">
              Discover Something New
            </h1>
          </div>

          <p className="mt-2 max-w-2xl text-gray-400">
            Explore stories beyond your usual
            categories, countries and favourite
            topics.
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


      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({
            length: 6,
          }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-xl bg-gray-900"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-900 bg-red-950/30 p-8 text-center text-red-200">
          Unable to load discovery articles.
        </div>
      ) : !data?.length ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-16 text-center">
          <Compass
            size={48}
            className="mx-auto text-gray-500"
          />

          <h2 className="mt-5 text-2xl font-semibold">
            Nothing new to discover yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-gray-400">
            Import more articles or broaden
            your selected preferences.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {data.map(
            (item) => (
              <DiscoveryCard
                key={item.article.id}
                item={item}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}