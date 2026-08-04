import { SearchX } from "lucide-react";

type Props = {
  search: string;
};

export default function EmptyState({ search }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-700 bg-gray-900 py-16 text-center">
      <SearchX size={48} className="mb-4 text-gray-500" />

      <h2 className="text-2xl font-semibold text-white">
        Sorry! No articles found
      </h2>

      <p className="mt-2 max-w-md text-gray-400">
        No articles matched{" "}
        <span className="font-medium text-white">
          "{search}"
        </span>.
        Please try a different keyword.
      </p>
    </div>
  );
}