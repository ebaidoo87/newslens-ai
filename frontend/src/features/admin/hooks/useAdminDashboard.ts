import {
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminDashboard,
  getAdminEmailStats,
  getAdminRecentEmails,
  getAdminSystemHealth,
  getAdminUserStats,
} from "../../../shared/services/adminApi";


export function useAdminDashboard() {
  return useQuery({
    queryKey: [
      "admin",
      "dashboard",
    ],

    queryFn: getAdminDashboard,

    staleTime: 30_000,

    refetchInterval: 60_000,
  });
}


export function useAdminUserStats() {
  return useQuery({
    queryKey: [
      "admin",
      "users",
      "stats",
    ],

    queryFn: getAdminUserStats,

    staleTime: 30_000,

    refetchInterval: 60_000,
  });
}


export function useAdminSystemHealth() {
  return useQuery({
    queryKey: [
      "admin",
      "system",
      "health",
    ],

    queryFn: getAdminSystemHealth,

    staleTime: 15_000,

    refetchInterval: 30_000,
  });
}


export function useAdminEmailStats() {
  return useQuery({
    queryKey: [
      "admin",
      "email",
      "stats",
    ],

    queryFn: getAdminEmailStats,

    staleTime: 30_000,

    refetchInterval: 60_000,
  });
}


export function useAdminRecentEmails(
  limit = 10,
) {
  return useQuery({
    queryKey: [
      "admin",
      "email",
      "recent",
      limit,
    ],

    queryFn: () =>
      getAdminRecentEmails(limit),

    staleTime: 30_000,

    refetchInterval: 60_000,
  });
}