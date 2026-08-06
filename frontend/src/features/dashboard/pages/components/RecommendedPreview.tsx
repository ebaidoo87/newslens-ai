import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  useRecommendations,
} from "../../../recommendations/hooks/useRecommendations";


export default function RecommendedPreview() {
  const {
    data,
    isLoading,
    isError,
  } = useRecommendations(3);


  if (isLoading) {
    return (
      <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <div className="h-7 w-48 animate-pulse rounded bg-gray-800" />

        <div className="mt-6 space-y-4">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-xl bg-gray-800"
            />
          ))}
        </div>
      </section>
    );
  }


  if (
    isError
    || !data?.length
  ) {
    return null;
  }


  return (
    <section className="rounded-2xl border border-purple-900/70 bg-gray-900 p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-purple-400" />

          <div>
            <h2 className="text-2xl font-bold">
              Recommended For You
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Based on your saved interests.
            </p>
          </div>
        </div>

        <Link
          to="/recommended"
          className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-purple-200"
        >
          View all

          <ArrowRight size={17} />
        </Link>
      </div>


      <div className="mt-6 space-y-4">
        {data.map(
          (recommendation) => (
            <Link
              key={
                recommendation.article.id
              }
              to={
                `/articles/${recommendation.article.id}`
              }
              className="group block rounded-xl border border-gray-800 bg-gray-950/40 p-4 transition hover:border-purple-700"
            >
              <div className="flex gap-4">
                {recommendation.article.image_url && (
                  <img
                    src={
                      recommendation.article.image_url
                    }
                    alt=""
                    className="h-20 w-24 shrink-0 rounded-lg object-cover"
                  />
                )}

                <div className="min-w-0">
                  <p className="line-clamp-2 font-semibold transition group-hover:text-purple-300">
                    {
                      recommendation.article.title
                    }
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span>
                      {
                        recommendation.article.source
                      }
                    </span>

                    <span className="capitalize">
                      {
                        recommendation.article.category
                      }
                    </span>

                    <span>
                      Score:{" "}
                      {recommendation.score}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}