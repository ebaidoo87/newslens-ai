import {
  Compass,
} from "lucide-react";

import ArticleCard from "../../news/components/ArticleCard";

import type {
  DiscoveredArticle,
} from "../../../shared/services/discoveryApi";


interface DiscoveryCardProps {
  item: DiscoveredArticle;
}


export default function DiscoveryCard({
  item,
}: DiscoveryCardProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <ArticleCard
        article={item.article}
      />

      <div className="rounded-xl border border-cyan-900 bg-cyan-950/30 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
          <Compass size={17} />

          Why explore this?
        </div>

        {item.reasons.length > 0 ? (
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            {item.reasons.map(
              (reason) => (
                <li
                  key={reason}
                  className="flex gap-2"
                >
                  <span className="text-cyan-400">
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
            Selected to add more variety
            to your feed.
          </p>
        )}
      </div>
    </div>
  );
}