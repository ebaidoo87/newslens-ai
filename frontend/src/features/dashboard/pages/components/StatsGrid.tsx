import {
  Brain,
  Globe,
  Newspaper,
  TrendingUp,
} from "lucide-react";

import StatCard from "./StatCard";
import LoadingCard from "./LoadingCard";

import type { DashboardStats } from "../types/dashboard";

type Props = {
  data?: DashboardStats;
  isLoading: boolean;
};

export default function StatsGrid({
  data,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Articles"
        value={data.articles.toLocaleString()}
        change="+15%"
        icon={Newspaper}
      />

      <StatCard
        title="Sources"
        value={data.sources.toString()}
        change="+8%"
        icon={Globe}
      />

      <StatCard
        title="AI Summaries"
        value={data.aiSummaries.toLocaleString()}
        change="+31%"
        icon={Brain}
      />

      <StatCard
        title="Trending"
        value={data.trendingTopics.toString()}
        change="+5%"
        icon={TrendingUp}
      />
    </div>
  );
}