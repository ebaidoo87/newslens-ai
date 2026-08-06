import {
  Flame,
  RefreshCw,
} from "lucide-react";

import TrendingCard from "../components/TrendingCard";

import {
  useTrendingArticles,
} from "../hooks/useTrendingArticles";

import {
  getCountryMetadata,
} from "../../../shared/utils/countries";

import {
  useState,
} from "react";


interface RegionOption {
  code?: string;
  label: string;
}


const REGIONS: RegionOption[] = [
  {
    code: undefined,
    label: "Worldwide",
  },
  {
    code: "global",
    label: "International",
  },
  {
    code: "gb",
    label: "United Kingdom",
  },
  {
    code: "us",
    label: "United States",
  },
  {
    code: "gh",
    label: "Ghana",
  },
  {
    code: "ng",
    label: "Nigeria",
  },
  {
    code: "ca",
    label: "Canada",
  },
  {
    code: "au",
    label: "Australia",
  },
  {
    code: "in",
    label: "India",
  },
  {
    code: "de",
    label: "Germany",
  },
  {
    code: "fr",
    label: "France",
  },
  {
    code: "jp",
    label: "Japan",
  },
];


export default function TrendingPage() {
  const [
    country,
    setCountry,
  ] = useState<
    string | undefined
  >(undefined);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useTrendingArticles(
    country,
    20,
  );


  const selectedRegion =
    REGIONS.find(
      (region) =>
        region.code === country,
    );

  const countryMetadata =
    country
      ? getCountryMetadata(country)
      : {
          flag: "🌍",
          name: "Worldwide",
        };


  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Flame className="text-orange-400" />

            <h1 className="text-4xl font-bold">
              Trending
            </h1>
          </div>

          <p className="mt-2 text-gray-400">
            {countryMetadata.flag}{" "}
            {selectedRegion?.label
              ?? countryMetadata.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              isFetching
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>
      </div>


      <div className="flex flex-wrap gap-3">
        {REGIONS.map((region) => {
          const active =
            region.code === country;

          return (
            <button
              key={
                region.code
                ?? "worldwide"
              }
              type="button"
              onClick={() =>
                setCountry(
                  region.code
                )
              }
              className={`
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-medium
                transition
                ${
                  active
                    ? "border-orange-500 bg-orange-600 text-white"
                    : "border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500"
                }
              `}
            >
              {region.code
                ? getCountryMetadata(
                    region.code,
                  ).flag
                : "🌍"}{" "}
              {region.label}
            </button>
          );
        })}
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
          Unable to load trending articles.
        </div>
      ) : !data?.length ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 px-6 py-16 text-center">
          <Flame
            size={48}
            className="mx-auto text-gray-500"
          />

          <h2 className="mt-5 text-2xl font-semibold">
            No trending articles found
          </h2>

          <p className="mt-3 text-gray-400">
            Import more articles or select
            another region.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {data.map(
            (item, index) => (
              <TrendingCard
                key={item.article.id}
                item={item}
                position={index + 1}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}