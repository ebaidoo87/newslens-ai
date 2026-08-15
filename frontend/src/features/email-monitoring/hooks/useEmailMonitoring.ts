import {
  useQuery,
} from "@tanstack/react-query";

import {
  getEmailStats,
  getRecentEmails,
} from "../../../shared/services/emailMonitoringApi";


export function useEmailStats() {
  return useQuery({
    queryKey: [
      "email-monitoring",
      "stats",
    ],

    queryFn: getEmailStats,

    refetchInterval: 30_000,

    staleTime: 15_000,
  });
}


export function useRecentEmails(
  limit = 25,
) {
  return useQuery({
    queryKey: [
      "email-monitoring",
      "recent",
      limit,
    ],

    queryFn: () =>
      getRecentEmails(limit),

    refetchInterval: 30_000,

    staleTime: 15_000,
  });
}