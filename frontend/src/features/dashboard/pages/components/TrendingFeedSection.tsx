import TrendingCard from "../../../trending/components/TrendingCard";

import type {
  TrendingArticle,
} from "../../../../shared/services/trendingApi";

import DashboardFeedSection from "./DashboardFeedSection";


interface TrendingFeedSectionProps {
  items: TrendingArticle[];
  isLoading: boolean;
  error?: string | null;
}


export default function TrendingFeedSection({
  items,
  isLoading,
  error = null,
}: TrendingFeedSectionProps) {
  const previewItems =
    items.slice(0, 3);

  return (
    <DashboardFeedSection
      title="Trending now"
      description={
        "Stories attracting attention "
        + "across NewsLens right now."
      }
      viewAllTo="/trending"
      viewAllLabel="View trending"
      isLoading={isLoading}
      error={error}
      isEmpty={
        previewItems.length === 0
      }
      emptyTitle="Nothing is trending yet."
      emptyMessage={
        "Trending stories will appear "
        + "once enough reading and "
        + "bookmark activity is available."
      }
    >
      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {previewItems.map(
          (item, index) => (
            <TrendingCard
              key={
                item.article.id
              }
              item={item}
              position={
                index + 1
              }
            />
          ),
        )}
      </div>
    </DashboardFeedSection>
  );
}