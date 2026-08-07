import {
  Bell,
  Bookmark,
  Clock3,
  Compass,
  Flame,
  Home,
  Newspaper,
  Search,
  Settings,
  Sparkles,
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
  label: "Trending",
  path: "/trending",
  icon: Flame,
  },
  {
  label: "For You",
  path: "/recommended",
  icon: Sparkles,
  },
  {
  label: "Discover",
  path: "/discover",
  icon: Compass,
  },
  {
    label: "Search",
    path: "/search",
    icon: Search,
  },
  {
  label: "Notifications",
  path: "/notifications",
  icon: Bell,
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