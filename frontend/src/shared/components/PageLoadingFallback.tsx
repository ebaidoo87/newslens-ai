export default function PageLoadingFallback() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <div className="space-y-4 text-center">
        <div
          className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500"
          aria-hidden="true"
        />

        <p className="text-sm text-gray-400">
          Loading page...
        </p>
      </div>
    </div>
  );
}