import { Search } from "lucide-react";

import {
  useSearch,
} from "../../hooks/useSearch";

export default function HeaderSearch() {
  const {
    search,
    setSearch,
  } = useSearch();

  return (
    <div
      role="search"
      className="
        relative
        hidden
        w-full
        max-w-md
        md:block
      "
    >
      <label
        htmlFor="header-news-search"
        className="sr-only"
      >
        Search news
      </label>

      <Search
        size={18}
        aria-hidden="true"
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        id="header-news-search"
        type="search"
        value={search}
        onChange={(event) =>
          setSearch(
            event.target.value,
          )
        }
        placeholder="Search news..."
        autoComplete="off"
        className="
          w-full
          rounded-lg
          border
          border-gray-700
          bg-gray-800
          py-2
          pl-10
          pr-4
          text-white
          outline-none
          transition
          placeholder:text-gray-400
          focus:border-blue-500
          focus-visible:ring-2
          focus-visible:ring-blue-500
        "
      />
    </div>
  );
}