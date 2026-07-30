import StatsGrid from "./components";

export default function DashboardPage() {
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

      <StatsGrid />
    </div>
  );
}