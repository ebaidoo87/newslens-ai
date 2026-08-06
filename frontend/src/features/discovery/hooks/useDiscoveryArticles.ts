import {
  useQuery,
} from "@tanstack/react-query";

import {
  getDiscoveryArticles,
} from "../../../shared/services/discoveryApi";


export function useDiscoveryArticles(
  limit = 20,
) {
  return useQuery({
    queryKey: [
      "discovery",
      limit,
    ],

    queryFn: () =>
      getDiscoveryArticles(limit),

    staleTime: 5 * 60 * 1000,

    retry: 1,
  });
}