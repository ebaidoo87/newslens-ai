import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

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
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      <Icon size={20} />
      <span>{title}</span>
    </NavLink>
  );
}