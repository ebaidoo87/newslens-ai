import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { useBookmarks } from "../../context/BookmarkContext";

import {
  useReadingHistory,
} from "../../context/ReadingHistoryContext";

type SidebarItemProps = {
  title: string;
  path: string;
  icon: LucideIcon;
};

export default function SidebarItem({
  title,
  path,
  icon: Icon,
}: SidebarItemProps) {
  const { bookmarkCount } = useBookmarks();

  const displayTitle =
    title === "Saved Articles"
      ? `${title} (${bookmarkCount})`
      : title;

  const {
        historyCount,
      } = useReadingHistory();

  const count =
  title === "Saved Articles"
    ? bookmarkCount
    : title === "Recently Viewed"
      ? historyCount
      : null;

  return (
    <NavLink
      to={path}
  className={({ isActive }) =>
    `flex items-center justify-between rounded-lg px-4 py-3 transition-colors ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-800 hover:text-white"
    }`
  }
>
  <div className="flex items-center gap-3">
    <Icon size={20} />
    <span>{title}</span>
  </div>

  {count !== null && (
    <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-semibold">
      {count}
    </span>
  )}
    </NavLink>
    
  );
}
