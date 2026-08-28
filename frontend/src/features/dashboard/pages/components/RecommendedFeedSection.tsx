import {
  usePreferences,
} from "../../../../shared/hooks/usePreferences";

import {
  useBookmarks,
} from "../../../../shared/hooks/useBookmarks";

import {
  useReadingHistory,
} from "../../../../shared/hooks/useReadingHistory";

import RecommendationCard from "../../../recommendations/components/RecommendationCard";

import type {
  RecommendedArticle,
} from "../../../../shared/services/recommendationApi";

import DashboardFeedSection from "./DashboardFeedSection";

import PreferenceMatchBadge from "./PreferenceMatchBadge";

import FeedStatusBadge from "./FeedStatusBadge";


interface RecommendedFeedSectionProps {
  items: RecommendedArticle[];
  isLoading: boolean;
  error?: string | null;
}


export default function RecommendedFeedSection({
  items,
  isLoading,
  error = null,
}: RecommendedFeedSectionProps) {
  const {
    selectedCategories,
    selectedCountries,
    selectedKeywords,
  } = usePreferences();


  const {
    bookmarkedArticleIds,
  } = useBookmarks();


  const {
    history,
  } = useReadingHistory();


  const viewedArticleIds =
    new Set(
      history.map(
        (item) =>
          item.article.id,
      ),
    );


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
      title="Recommended for you"
      description={
        "Stories selected using your "
        + "interests and reading activity."
      }
      viewAllTo="/recommended"
      viewAllLabel="View recommendations"
      isLoading={isLoading}
      error={error}
      isEmpty={
        previewItems.length === 0
      }
      emptyTitle="You're caught up on recommendations."
    emptyMessage={
        "No fresh personalized stories "
        + "are available right now. "
        + "Refresh the feed later or "
        + "explore trending news."
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
          (recommendation) => {
            const articleId =
              recommendation.article.id;

            return (
              <div
                key={articleId}
                className="space-y-3"
              >
                <FeedStatusBadge
                  isBookmarked={
                    bookmarkedArticleIds.has(
                      articleId,
                    )
                  }
                  isViewed={
                    viewedArticleIds.has(
                      articleId,
                    )
                  }
                />

                <PreferenceMatchBadge
                  article={
                    recommendation.article
                  }
                  preferences={
                    preferences
                  }
                />

                <RecommendationCard
                  recommendation={
                    recommendation
                  }
                />
              </div>
            );
          },
        )}
      </div>
    </DashboardFeedSection>
  );
}
