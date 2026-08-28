import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

import { 
  useBookmarks,
} from "../../hooks/useBookmarks";


import {
  useReadingHistory,
} from "../../hooks/useReadingHistory";

import {
  useNotifications,
} from "../../hooks/useNotifications";


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


  const {
        historyCount,
      } = useReadingHistory();
  
  const {
        unreadCount,
      } = useNotifications();

  const count =
  title === "Saved Articles"
    ? bookmarkCount
    : title === "Recently Viewed"
      ? historyCount
      : title === "Notifications"
        ? unreadCount
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

  {count !== null
&& (
  title !== "Notifications"
  || count > 0
) && (
  <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs font-semibold">
    {count > 99
      ? "99+"
      : count}
  </span>
)}
    </NavLink>
    
  );
}
