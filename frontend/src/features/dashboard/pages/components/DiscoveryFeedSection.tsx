import {
  usePreferences,
} from "../../../../shared/hooks/usePreferences";

import DiscoveryCard from "../../../discovery/components/DiscoveryCard";

import type {
  DiscoveredArticle,
} from "../../../../shared/services/discoveryApi";

import DashboardFeedSection from "./DashboardFeedSection";

import PreferenceMatchBadge from "./PreferenceMatchBadge";


interface DiscoveryFeedSectionProps {
  items: DiscoveredArticle[];
  isLoading: boolean;
  error?: string | null;
}


export default function DiscoveryFeedSection({
  items,
  isLoading,
  error = null,
}: DiscoveryFeedSectionProps) {
  const {
    selectedCategories,
    selectedCountries,
    selectedKeywords,
  } = usePreferences();


  const preferences = {
    categories:
      selectedCategories,

    countries:
      selectedCountries,

    keywords:
      selectedKeywords,
  };


  const previewItems =
    items.slice(0, 3);


  return (
    <DashboardFeedSection
      title="Discover something new"
      description={
        "Stories outside your usual feed "
        + "to broaden what you see."
      }
      viewAllTo="/discover"
      viewAllLabel="Explore more"
      isLoading={isLoading}
      error={error}
      isEmpty={
        previewItems.length === 0
      }
      emptyTitle="No trending stories right now."
      emptyMessage={
        "NewsLens has not detected enough "
        + "activity to rank a unique "
        + "trending story yet."
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
          (item) => (
            <div
              key={
                item.article.id
              }
              className="space-y-3"
            >
              <PreferenceMatchBadge
                article={
                  item.article
                }
                preferences={
                  preferences
                }
              />

              <DiscoveryCard
                item={item}
              />
            </div>
          ),
        )}
      </div>
    </DashboardFeedSection>
  );
}