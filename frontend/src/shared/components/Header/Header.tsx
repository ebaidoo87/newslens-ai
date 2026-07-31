import { Menu } from "lucide-react";

import HeaderSearch from "./HeaderSearch";
import HeaderActions from "./HeaderActions";

type Props = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: Props) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-gray-800 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <HeaderSearch />
      </div>

      <HeaderActions />
    </header>
  );
}