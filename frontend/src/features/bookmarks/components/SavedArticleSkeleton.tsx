export default function SavedArticleSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
      <div className="h-48 animate-pulse bg-gray-800" />

      <div className="space-y-4 p-6">
        <div className="h-4 w-24 animate-pulse rounded bg-gray-800" />

        <div className="h-6 w-full animate-pulse rounded bg-gray-800" />

        <div className="h-6 w-4/5 animate-pulse rounded bg-gray-800" />

        <div className="h-4 w-full animate-pulse rounded bg-gray-800" />

        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-800" />

        <div className="h-9 w-28 animate-pulse rounded bg-gray-800" />
      </div>
    </div>
  );
}