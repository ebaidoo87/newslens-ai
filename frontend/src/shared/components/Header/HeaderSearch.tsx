import { Search } from "lucide-react";

import { useSearch } from "../../context/SearchContext";

export default function HeaderSearch() {
  const { search, setSearch } = useSearch();

  return (
    <div className="relative hidden w-full max-w-md md:block">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search news..."
        className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-white outline-none focus:border-blue-500"
      />
    </div>
  );
}