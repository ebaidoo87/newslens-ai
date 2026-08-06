import {
  Sparkles,
} from "lucide-react";

import ArticleCard from "../../news/components/ArticleCard";

import type {
  RecommendedArticle,
} from "../../../shared/services/recommendationApi";


interface RecommendationCardProps {
  recommendation: RecommendedArticle;
}


export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  return (
    <div className="space-y-3">
      <ArticleCard
        article={
          recommendation.article
        }
      />

      <div className="rounded-xl border border-purple-900 bg-purple-950/30 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-purple-300">
          <Sparkles size={16} />

          Why this was recommended
        </div>

        {recommendation.reasons.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            {recommendation.reasons.map(
              (reason) => (
                <li
                  key={reason}
                  className="flex gap-2"
                >
                  <span className="text-purple-400">
                    •
                  </span>

                  <span>
                    {reason}
                  </span>
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-400">
            Recommended because it is one
            of the latest available articles.
          </p>
        )}

        <p className="mt-3 text-xs text-gray-600">
          Recommendation score:{" "}
          {recommendation.score}
        </p>
      </div>
    </div>
  );
}