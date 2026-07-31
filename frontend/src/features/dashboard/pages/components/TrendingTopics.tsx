const topics = [
  "#AI",
  "#Markets",
  "#Technology",
  "#Politics",
  "#Climate",
];

export default function TrendingTopics() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Trending Topics
      </h2>

      <div className="flex flex-wrap gap-3">
        {topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}