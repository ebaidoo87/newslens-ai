import {
  LayoutDashboard,
  Search,
  Newspaper,
  Bell,
  Settings,
} from "lucide-react";

export const sidebarItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Search",
    path: "/search",
    icon: Search,
  },
  {
    title: "News",
    path: "/news",
    icon: Newspaper,
  },
  {
    title: "Alerts",
    path: "/alerts",
    icon: Bell,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];