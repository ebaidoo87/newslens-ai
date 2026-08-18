import {
  useQuery,
} from "@tanstack/react-query";

import {
  getAuditLogs,
  getAuditStats,
  getRecentAuditLogs,
} from "../../../shared/services/auditApi";


export function useAuditLogs(
  skip = 0,
  limit = 50,
) {
  return useQuery({
    queryKey: [
      "admin",
      "audit",
      skip,
      limit,
    ],

    queryFn: () =>
      getAuditLogs(
        skip,
        limit,
      ),

    staleTime: 30_000,

    refetchInterval: 60_000,
  });
}


export function useRecentAuditLogs(
  limit = 20,
) {
  return useQuery({
    queryKey: [
      "admin",
      "audit",
      "recent",
      limit,
    ],

    queryFn: () =>
      getRecentAuditLogs(
        limit,
      ),

    staleTime: 30_000,
  });
}


export function useAuditStats() {
  return useQuery({
    queryKey: [
      "admin",
      "audit",
      "stats",
    ],

    queryFn: getAuditStats,

    staleTime: 30_000,
  });
}