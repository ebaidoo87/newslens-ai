import type {
  Article,
} from "../../../news/types/article";


export interface PreferenceSignals {
  categories: string[];
  countries: string[];
  keywords: string[];
}


function normalize(
  value: string | null | undefined,
): string {
  return (
    value
      ?.trim()
      .toLowerCase()
    ?? ""
  );
}


function containsKeyword(
  article: Article,
  keyword: string,
): boolean {
  const normalizedKeyword =
    normalize(keyword);

  if (!normalizedKeyword) {
    return false;
  }

  const searchableText = [
    article.title,
    article.summary,
    article.content,
    article.category,
    article.source,
    article.country,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(
    normalizedKeyword,
  );
}


export function getPreferenceScore(
  article: Article,
  preferences: PreferenceSignals,
): number {
  let score = 0;

  const articleCategory =
    normalize(
      article.category,
    );

  const articleCountry =
    normalize(
      article.country,
    );


  const categoryMatch =
    preferences.categories.some(
      (category) =>
        normalize(category)
        === articleCategory,
    );

  if (categoryMatch) {
    score += 5;
  }


  const countryMatch =
    preferences.countries.some(
      (country) =>
        normalize(country)
        === articleCountry,
    );

  if (countryMatch) {
    score += 3;
  }


  for (
    const keyword
    of preferences.keywords
  ) {
    if (
      containsKeyword(
        article,
        keyword,
      )
    ) {
      score += 2;
    }
  }


  return score;
}


export function rankArticlesByPreferences<
  T,
>(
  items: T[],
  getArticle: (
    item: T,
  ) => Article,
  preferences: PreferenceSignals,
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
          getPreferenceScore(
            getArticle(item),
            preferences,
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

        /*
         * Preserve the API's original
         * ordering when two items have
         * the same preference score.
         */
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