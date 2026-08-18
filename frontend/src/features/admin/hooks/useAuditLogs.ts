import {
  useQuery,
} from "@tanstack/react-query";


import {
  getAuditLogs,
  getAuditStats,
  getRecentAuditLogs,
  type AuditFilters,
} from "../../../shared/services/auditApi";

export function useAuditLogs(
  filters: AuditFilters,
) {
  return useQuery({
    queryKey: [
      "admin",
      "audit",
      filters,
    ],

    queryFn: () =>
      getAuditLogs(
        filters
      ),

    staleTime: 30_000,

    refetchInterval: 60_000,
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

export function useRecentAuditLogs(
  limit = 8,
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

    refetchInterval: 60_000,
  });
}