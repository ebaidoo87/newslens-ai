import HeaderSearch from "./HeaderSearch";
import HeaderActions from "./HeaderActions";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-8">
      <HeaderSearch />

      <HeaderActions />
    </header>
  );
}