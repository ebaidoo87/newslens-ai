import {
  useQuery,
} from "@tanstack/react-query";

import {
  getRecommendations,
} from "../../../shared/services/recommendationApi";


export function useRecommendations(
  limit = 20,
) {
  return useQuery({
    queryKey: [
      "recommendations",
      limit,
    ],

    queryFn: () =>
      getRecommendations(limit),

    staleTime: 5 * 60 * 1000,

    retry: 1,
  });
}