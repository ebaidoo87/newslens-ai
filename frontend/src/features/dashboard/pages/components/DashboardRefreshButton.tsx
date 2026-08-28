import {
  RefreshCw,
} from "lucide-react";


interface DashboardRefreshButtonProps {
  isRefreshing: boolean;
  lastUpdated: Date | null;

  onRefresh: () =>
    Promise<void>;
}


export default function DashboardRefreshButton({
  isRefreshing,
  lastUpdated,
  onRefresh,
}: DashboardRefreshButtonProps) {
  const formattedTime =
    lastUpdated
      ? lastUpdated.toLocaleTimeString(
          [],
          {
            hour:
              "2-digit",

            minute:
              "2-digit",
          },
        )
      : null;


  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-3
      "
    >
      {formattedTime && (
        <span
          className="
            text-xs
            text-gray-500
          "
        >
          Updated {formattedTime}
        </span>
      )}


      <button
        type="button"
        disabled={isRefreshing}
        onClick={() => {
          void onRefresh();
        }}
        className="
          inline-flex
          items-center
          gap-2
          rounded-lg
          border
          border-gray-700
          bg-gray-900
          px-4
          py-2
          text-sm
          font-medium
          text-gray-200
          transition
          hover:border-gray-600
          hover:bg-gray-800
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <RefreshCw
          size={16}
          className={
            isRefreshing
              ? "animate-spin"
              : ""
          }
        />

        {isRefreshing
          ? "Refreshing..."
          : "Refresh feed"}
      </button>
    </div>
  );
}