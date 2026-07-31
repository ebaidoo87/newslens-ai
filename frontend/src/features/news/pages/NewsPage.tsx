import { useArticles } from "../hooks/useArticles";

export default function NewsPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useArticles();

  console.log("data:", data);
  console.log("isLoading:", isLoading);
  console.log("isError:", isError);
  console.log("error:", error);

  if (isLoading) {
    return <h2>Loading articles...</h2>;
  }

  if (isError) {
    return (
      <pre>
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Latest News
      </h1>

      {data?.map((article) => (
        <div
          key={article.id}
          className="rounded-xl border border-gray-800 bg-gray-900 p-6"
        >
          <h2 className="text-xl font-semibold">
            {article.title}
          </h2>

          <p className="mt-3 text-gray-400">
            {article.summary}
          </p>

          <div className="mt-4 text-sm text-gray-500">
            {article.source}
          </div>
        </div>
      ))}
    </div>
  );
}