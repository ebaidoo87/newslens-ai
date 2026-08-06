import {
  useQuery,
} from "@tanstack/react-query";

import {
  getTrendingArticles,
} from "../../../shared/services/trendingApi";


export function useTrendingArticles(
  country?: string,
  limit = 20,
) {
  return useQuery({
    queryKey: [
      "trending",
      country ?? "world",
      limit,
    ],

    queryFn: () =>
      getTrendingArticles({
        country,
        limit,
      }),

    staleTime: 5 * 60 * 1000,

    retry: 1,
  });
}