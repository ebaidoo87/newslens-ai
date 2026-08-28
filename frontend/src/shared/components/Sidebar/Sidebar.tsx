
import {
  useAuth,
} from "../../hooks/useAuth";

import SidebarItem from "./SidebarItem";
import {
  sidebarItems,
} from "./sidebarData";


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
    <aside
      className="
        h-full
        w-64
        border-r
        border-gray-800
        bg-gray-900
      "
    >
      <nav
        className="
          flex
          flex-col
          gap-2
          p-4
        "
      >
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