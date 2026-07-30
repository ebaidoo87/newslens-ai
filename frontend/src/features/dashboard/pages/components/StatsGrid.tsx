import {
  Newspaper,
  Globe,
  Brain,
  TrendingUp,
} from "lucide-react";

import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Articles"
        value="12,458"
        change="+15%"
        icon={Newspaper}
      />

      <StatCard
        title="Sources"
        value="87"
        change="+8%"
        icon={Globe}
      />

      <StatCard
        title="AI Summaries"
        value="4,216"
        change="+31%"
        icon={Brain}
      />

      <StatCard
        title="Trending"
        value="53"
        change="+5%"
        icon={TrendingUp}
      />
    </div>
  );
}