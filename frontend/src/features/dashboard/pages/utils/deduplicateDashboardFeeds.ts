import type {
  DiscoveredArticle,
} from "../../../../shared/services/discoveryApi";

import type {
  RecommendedArticle,
} from "../../../../shared/services/recommendationApi";

import type {
  TrendingArticle,
} from "../../../../shared/services/trendingApi";


interface DashboardFeeds {
  recommendations:
    RecommendedArticle[];

  trending:
    TrendingArticle[];

  discovery:
    DiscoveredArticle[];
}


function takeUniqueItems<T>(
  items: T[],
  getArticleId: (
    item: T,
  ) => number,
  seenArticleIds: Set<number>,
): T[] {
  const uniqueItems: T[] = [];


  for (const item of items) {
    const articleId =
      getArticleId(item);


    if (
      seenArticleIds.has(
        articleId,
      )
    ) {
      continue;
    }


    seenArticleIds.add(
      articleId,
    );

    uniqueItems.push(
      item,
    );
  }


  return uniqueItems;
}


export function deduplicateDashboardFeeds({
  recommendations,
  trending,
  discovery,
}: DashboardFeeds): DashboardFeeds {
  const seenArticleIds =
    new Set<number>();


  /*
   * Dashboard priority:
   *
   * 1. Personalized recommendations
   * 2. Trending stories
   * 3. Discovery stories
   *
   * The dedicated pages remain
   * unaffected by this ordering.
   */

  const uniqueRecommendations =
    takeUniqueItems(
      recommendations,
      (item) =>
        item.article.id,
      seenArticleIds,
    );


  const uniqueTrending =
    takeUniqueItems(
      trending,
      (item) =>
        item.article.id,
      seenArticleIds,
    );


  const uniqueDiscovery =
    takeUniqueItems(
      discovery,
      (item) =>
        item.article.id,
      seenArticleIds,
    );


  return {
    recommendations:
      uniqueRecommendations,

    trending:
      uniqueTrending,

    discovery:
      uniqueDiscovery,
  };
}