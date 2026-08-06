import {
  Home,
  Search,
  Newspaper,
  Bell,
  Settings,
  Bookmark,
} from "lucide-react";


export const sidebarItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },

  {
    label: "Search",
    path: "/search",
    icon: Search,
  },
  {
    label: "News",
    path: "/news",
    icon: Newspaper,
  },
  {
    label: "Alerts",
    path: "/alerts",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
  {
  label: "Saved Articles",
  path: "/saved",
  icon: Bookmark,
  },
];