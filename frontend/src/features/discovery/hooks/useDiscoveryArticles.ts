import {
  useQuery,
} from "@tanstack/react-query";

import {
  queryKeys,
} from "../../../shared/lib/queryKeys";

import {
  getDiscoveryArticles,
} from "../../../shared/services/discoveryApi";


export function useDiscoveryArticles(
  limit = 20,
) {
  return useQuery({
    queryKey:
      queryKeys.discovery.list(
        limit,
      ),

    queryFn: () =>
      getDiscoveryArticles(
        limit,
      ),
  });
}