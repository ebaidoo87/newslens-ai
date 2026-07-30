import { sidebarItems } from "./sidebarData";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside className="h-full w-64 bg-gray-900 border-r border-gray-800">
      <nav className="flex flex-col gap-2 p-4">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </nav>
    </aside>
  );
}