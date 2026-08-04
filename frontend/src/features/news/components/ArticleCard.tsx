import { Link } from "react-router-dom";

import type { Article } from "../types/article";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({
  article,
}: ArticleCardProps) {
  return (
    <Link
      to={`/articles/${article.id}`}
      className="block"
    >
      <article
        className="
          rounded-xl
          border
          border-gray-800
          bg-gray-900
          p-6
          transition-all
          duration-200
          hover:border-blue-500
          hover:shadow-lg
          hover:-translate-y-1
          cursor-pointer
        "
      >
        <h2 className="text-xl font-semibold">
          {article.title}
        </h2>

        <p className="mt-3 text-gray-400 leading-relaxed">
          {article.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-500">
          <span>📰 {article.source}</span>

          <span>🌍 {article.country}</span>

          <span>🏷 {article.category}</span>
        </div>

        <div className="mt-5 text-blue-400">
          Read full article →
        </div>
      </article>
    </Link>
  );
}