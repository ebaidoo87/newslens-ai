import type {
  Article,
} from "../../../news/types/article";


export interface FeedBehaviorSignals {
  bookmarkedArticleIds:
    Set<number>;

  viewedArticleIds:
    Set<number>;
}


export function getFeedBehaviorScore(
  article: Article,
  signals: FeedBehaviorSignals,
): number {
  let score = 0;


  if (
    signals.bookmarkedArticleIds.has(
      article.id,
    )
  ) {
    score += 2;
  }


  if (
    signals.viewedArticleIds.has(
      article.id,
    )
  ) {
    score -= 4;
  }


  return score;
}


export function rankArticlesByBehavior<
  T,
>(
  items: T[],
  getArticle: (
    item: T,
  ) => Article,
  signals: FeedBehaviorSignals,
): T[] {
  return items
    .map(
      (
        item,
        index,
      ) => ({
        item,
        index,
        score:
          getFeedBehaviorScore(
            getArticle(item),
            signals,
          ),
      }),
    )
    .sort(
      (left, right) => {
        if (
          right.score
          !== left.score
        ) {
          return (
            right.score
            - left.score
          );
        }

        return (
          left.index
          - right.index
        );
      },
    )
    .map(
      ({ item }) =>
        item,
    );
}