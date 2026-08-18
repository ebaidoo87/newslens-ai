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
  Users,
} from "lucide-react";

import {
  ClipboardList,
} from "lucide-react";

import {
  Activity,
  ShieldCheck,
} from "lucide-react";

export type SidebarItemData = {
  label: string;
  path: string;
  adminOnly?: boolean;
};

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
  {
  label: "Admin",
  path: "/admin",
  icon: ShieldCheck,
  adminOnly: true,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
    adminOnly: true,
  },
  {
  label: "Audit Logs",
  path: "/admin/audit",
  icon: ClipboardList,
  adminOnly: true,
  },
    {
    label: "Email Delivery",
    path: "/email-monitoring",
    icon: Activity,
    adminOnly: true,
  },
];