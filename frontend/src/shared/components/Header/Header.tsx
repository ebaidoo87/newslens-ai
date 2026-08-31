import { Menu } from "lucide-react";

import HeaderSearch from "./HeaderSearch";
import HeaderActions from "./HeaderActions";

type Props = {
  onMenuClick?: () => void;
};

export default function Header({
  onMenuClick,
}: Props) {
  return (
    <header
      className="
        flex
        h-16
        items-center
        justify-between
        border-b
        border-gray-800
        bg-gray-900
        px-6
      "
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="
            rounded-lg
            p-2
            transition
            hover:bg-gray-800
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-blue-500
            focus-visible:ring-offset-2
            focus-visible:ring-offset-gray-900
            lg:hidden
          "
        >
          <Menu
            size={22}
            aria-hidden="true"
          />
        </button>

        <HeaderSearch />
      </div>

      <HeaderActions />
    </header>
  );
}