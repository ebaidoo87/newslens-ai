import {
  useQuery,
} from "@tanstack/react-query";

import {
  queryKeys,
} from "../../../shared/lib/queryKeys";

import {
  getRecommendations,
} from "../../../shared/services/recommendationApi";


export function useRecommendations(
  limit = 20,
) {
  return useQuery({
    queryKey:
      queryKeys.recommendations.list(
        limit,
      ),

    queryFn: () =>
      getRecommendations(
        limit,
      ),
  });
}