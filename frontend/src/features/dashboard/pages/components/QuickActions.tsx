export default function QuickActions() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Quick Actions
      </h2>

      <div className="flex flex-wrap gap-4">
        <button className="rounded-lg bg-blue-600 px-4 py-2 hover:bg-blue-700">
          Search News
        </button>

        <button className="rounded-lg bg-gray-700 px-4 py-2 hover:bg-gray-600">
          View Sources
        </button>

        <button className="rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700">
          Generate Summary
        </button>
      </div>
    </div>
  );
}