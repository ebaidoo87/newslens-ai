import {
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminAnalyticsSummary,
} from "../../../shared/services/adminAnalyticsApi";


export function useAdminAnalytics() {
  return useQuery({
    queryKey: [
      "admin",
      "analytics",
      "summary",
    ],

    queryFn:
      getAdminAnalyticsSummary,

    staleTime: 30_000,

    refetchInterval: 60_000,
  });
}