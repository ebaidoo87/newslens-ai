import {
  Bookmark,
  Clock3,
  Home,
  Newspaper,
  Search,
  Settings,
} from "lucide-react";


export const sidebarItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    label: "News",
    path: "/news",
    icon: Newspaper,
  },
  {
    label: "Search",
    path: "/search",
    icon: Search,
  },
  {
  label: "Saved Articles",
  path: "/saved",
  icon: Bookmark,
  },
  {
  label: "Recently Viewed",
  path: "/history",
  icon: Clock3,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];