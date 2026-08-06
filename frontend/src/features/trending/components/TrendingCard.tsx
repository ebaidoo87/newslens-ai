import {
  Bookmark,
  Eye,
  Flame,
} from "lucide-react";

import ArticleCard from "../../news/components/ArticleCard";

import type {
  TrendingArticle,
} from "../../../shared/services/trendingApi";


interface TrendingCardProps {
  item: TrendingArticle;
  position: number;
}


export default function TrendingCard({
  item,
  position,
}: TrendingCardProps) {
  return (
    <div className="relative flex h-full flex-col gap-4">
      <div className="relative z-10 flex items-center justify-between gap-3 rounded-xl border border-orange-900 bg-orange-950/40 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-600 font-bold text-white">
            {position}
          </span>

          <div className="flex items-center gap-2 font-semibold text-orange-300">
            <Flame size={17} />

            Trending
          </div>
        </div>

        <span className="shrink-0 text-sm font-semibold text-orange-200">
          Score {item.trending_score}
        </span>
      </div>

      <div className="relative z-0">
        <ArticleCard
          article={item.article}
        />
      </div>

      <div className="rounded-xl border border-gray-800 bg-gray-900 p-4">
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <span className="inline-flex items-center gap-2">
            <Eye size={16} />

            {item.view_count} views
          </span>

          <span className="inline-flex items-center gap-2">
            <Bookmark size={16} />

            {item.bookmark_count} saves
          </span>
        </div>

        {item.reasons.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-gray-500">
            {item.reasons.map(
              (reason) => (
                <li key={reason}>
                  • {reason}
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </div>
  );
}