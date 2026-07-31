const headlines = [
  "Microsoft expands AI services in Europe",
  "OpenAI releases new developer tools",
  "Global markets respond to inflation data",
  "BBC reports breakthrough in renewable energy",
  "Reuters: Tech stocks rally for third day",
];

export default function LatestHeadlines() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
      <h2 className="mb-4 text-xl font-semibold">
        Latest Headlines
      </h2>

      <ul className="space-y-3">
        {headlines.map((headline) => (
          <li
            key={headline}
            className="border-b border-gray-800 pb-2 text-gray-300 last:border-none"
          >
            {headline}
          </li>
        ))}
      </ul>
    </div>
  );
}