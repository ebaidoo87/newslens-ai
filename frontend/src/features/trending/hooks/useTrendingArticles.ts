import {
  useQuery,
} from "@tanstack/react-query";

import {
  queryKeys,
} from "../../../shared/lib/queryKeys";

import {
  getTrendingArticles,
} from "../../../shared/services/trendingApi";


export function useTrendingArticles(
  country?: string,
  limit = 20,
) {
  return useQuery({
    queryKey:
      queryKeys.trending.list(
        country,
        limit,
      ),

    queryFn: () =>
      getTrendingArticles({
        country,
        limit,
      }),
  });
}