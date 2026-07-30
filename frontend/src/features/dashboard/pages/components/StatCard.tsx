import type { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm transition hover:border-blue-500">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">
          {title}
        </h3>

        <Icon
          className="text-blue-500"
          size={22}
        />
      </div>

      <h2 className="text-3xl font-bold">
        {value}
      </h2>

      <p className="mt-2 text-sm text-green-400">
        {change}
      </p>
    </div>
  );
}