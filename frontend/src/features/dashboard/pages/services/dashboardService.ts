import type { DashboardStats } from "../types/dashboard";
import { mockDashboardStats } from "../data/mockDashboard";

export async function getDashboardStats(): Promise<DashboardStats> {
  // Simulate a network request
  await new Promise((resolve) => setTimeout(resolve, 500));

  return mockDashboardStats;
}