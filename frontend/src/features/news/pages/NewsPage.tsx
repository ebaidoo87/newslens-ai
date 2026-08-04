import { useDebounce } from "use-debounce";

import { useArticles } from "../hooks/useArticles";
import { useSearch } from "../../../shared/context/SearchContext";

import ArticleList from "../components/ArticleList";
import ArticleSkeletonList from "../components/ArticleSkeletonList";

import EmptyState from "../../../shared/components/EmptyState/EmptyState";

import { useCategory } from "../../../shared/context/CategoryContext";
import CategoryFilter from "../components/CategoryFilter";



export default function NewsPage() {
  const { search } = useSearch();

  const [debouncedSearch] = useDebounce(search, 400);

  const { category, setCategory } = useCategory();

 const {
  data,
  isLoading,
  isError,
} = useArticles(
  debouncedSearch,
  category === "all"
    ? undefined
    : category
);

console.log("Search:", search);
console.log("Category:", category);


  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold">
          Latest News
        </h1>

        <ArticleSkeletonList />
      </div>
    );
  }

  if (isError) {
    return <div className="rounded-xl border border-red-800 bg-red-950 p-6">
  <h2 className="text-xl font-semibold text-red-300">
    Unable to load articles
  </h2>

  <p className="mt-2 text-red-200">
    Please check your backend server and try again.
  </p>
</div>;
  }

  if (!data?.length) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Latest News
        </h1>

        <p className="mt-2 text-gray-400">
          AI-powered news intelligence
        </p>
      </div>

      <EmptyState search={search} />
    </div>
  );
}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">
          Latest News
        </h1>

        <p className="mt-2 text-gray-400">
          AI-powered news intelligence
        </p>
      </div>

      <CategoryFilter
      value={category}
      onChange={setCategory}
      />

      <ArticleList articles={data ?? []} />
    </div>
  );
}

