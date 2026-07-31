import {
  LatestHeadlines,
  QuickActions,
  StatsGrid,
  TrendingTopics,
} from "./components";

import { useDashboardStats } from "./hooks/useDashboardStats";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useDashboardStats();

  if (isError) {
    return (
      <div className="rounded-xl border border-red-700 bg-red-900/20 p-6">
        <h2 className="text-xl font-semibold text-red-400">
          Unable to load dashboard.
        </h2>

        <p className="mt-2 text-gray-300">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back 👋
        </h1>

        <p className="mt-2 text-gray-400">
          Here's what's happening across your news platform today.
        </p>
      </div>

      <StatsGrid
        data={data}
        isLoading={isLoading}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LatestHeadlines />
        </div>

        <TrendingTopics />
      </div>

      <QuickActions />
    </div>
  );
}