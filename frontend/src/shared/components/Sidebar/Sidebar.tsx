import { sidebarItems } from "./sidebarData";
import SidebarItem from "./SidebarItem";
import {
  Activity,
} from "lucide-react";

import {
  useAuth,
} from "../../context/AuthContext";

  label: "Email Delivery"
  path: "/email-monitoring"
  icon: Activity

export default function Sidebar() {
  const {
    isAdmin,
  } = useAuth();

  const visibleItems =
    sidebarItems.filter(
      (item) =>
        !item.adminOnly
        || isAdmin,
    );
    

  return (
    <aside className="h-full w-64 border-r border-gray-800 bg-gray-900">
      <nav className="flex flex-col gap-2 p-4">
        {visibleItems.map(
          (item) => (
            <SidebarItem
              key={item.path}
              title={item.label}
              path={item.path}
              icon={item.icon}
            />
          ),
        )}
      </nav>
    </aside>
  );
}